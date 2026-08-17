import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let standbyAudio = null;
let activeName = '';
let stopTimer = 0;
let rainObjectUrl = '';
let rainPreloadPromise = null;
let rainLoopTimer = 0;
let rainFadeTimer = 0;
let rainCrossfading = false;
let rainTargetVolume = 0.28;
let status = { name:'', state:'idle', detail:'' };
const RAIN_B64_URL = new URL('../../assets/audio/rain-loop.mp3.b64?v=4', import.meta.url).href;

function setStatus(name,state,detail='') {
  status = { name, state, detail };
  window.dispatchEvent(new CustomEvent('story-sfx-status',{detail:status}));
}

export function getStorySfxStatus() { return { ...status }; }
function staticSource(name) { if (!name || name === 'none') return ''; return STORY_SFX_ASSETS[name] || ''; }
function base64ToBlobUrl(base64) {
  const clean = String(base64 || '').replace(/\s+/g, '');
  if (!clean) throw new Error('Rain asset is empty');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
}
function preloadRain() {
  if (rainObjectUrl) return Promise.resolve(true);
  setStatus('rain','loading','MP3 wird geladen');
  if (!rainPreloadPromise) {
    rainPreloadPromise = fetch(RAIN_B64_URL, { cache: 'force-cache' })
      .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.text(); })
      .then(base64 => { rainObjectUrl = base64ToBlobUrl(base64); setStatus('rain','ready','MP3 bereit'); return true; })
      .catch(error => { console.warn('Rain asset failed to preload.', error); rainPreloadPromise = null; setStatus('rain','error',`Laden fehlgeschlagen: ${error?.message || error}`); return false; });
  }
  return rainPreloadPromise;
}
void preloadRain();
export function isStorySfxReady(name) { if (name === 'rain') return Boolean(rainObjectUrl); return Boolean(staticSource(name)); }
export function isStorySfxPlaying(name) { return Boolean(activeAudio && !activeAudio.paused && activeName === name); }
export async function preloadStorySfx(name) { if (name === 'rain') return preloadRain(); return Boolean(staticSource(name)); }
export function getStorySfxSrc(name) { if (name === 'rain') return rainObjectUrl || ''; return staticSource(name); }

function clearRainLoop() {
  window.clearInterval(rainLoopTimer); rainLoopTimer = 0;
  window.clearInterval(rainFadeTimer); rainFadeTimer = 0;
  rainCrossfading = false;
}

function pauseAndReset(audio) {
  if (!audio) return;
  try { audio.pause(); audio.currentTime = 0; } catch (_) {}
}

export function stopStorySfx() {
  window.clearTimeout(stopTimer); stopTimer = 0;
  clearRainLoop();
  pauseAndReset(activeAudio);
  if (standbyAudio && standbyAudio !== activeAudio) pauseAndReset(standbyAudio);
  activeAudio = null;
  standbyAudio = null;
  activeName = '';
  setStatus(status.name || 'rain','stopped','Audio gestoppt');
}

function beginRainCrossfade() {
  if (rainCrossfading || !activeAudio || !standbyAudio || activeName !== 'rain') return;
  rainCrossfading = true;
  const outgoing = activeAudio;
  const incoming = standbyAudio;
  try { incoming.currentTime = 0.01; } catch (_) {}
  incoming.volume = 0;

  const fadeMs = 260;
  const stepMs = 26;
  const steps = Math.max(1, Math.round(fadeMs / stepMs));
  let step = 0;
  window.clearInterval(rainFadeTimer);
  rainFadeTimer = window.setInterval(() => {
    if (activeName !== 'rain') { clearRainLoop(); return; }
    step += 1;
    const progress = Math.min(1, step / steps);
    try {
      outgoing.volume = rainTargetVolume * (1 - progress);
      incoming.volume = rainTargetVolume * progress;
    } catch (_) {}
    if (progress >= 1) {
      window.clearInterval(rainFadeTimer); rainFadeTimer = 0;
      try { outgoing.volume = 0; } catch (_) {}
      activeAudio = incoming;
      standbyAudio = outgoing;
      rainCrossfading = false;
    }
  }, stepMs);
}

function startDualRainLoop(primary, secondary) {
  activeAudio = primary;
  standbyAudio = secondary;
  primary.loop = true;
  secondary.loop = true;
  primary.volume = rainTargetVolume;
  secondary.volume = 0;

  const first = primary.play();
  const second = secondary.play();
  const firstResult = first && typeof first.then === 'function' ? first : Promise.resolve();
  const secondResult = second && typeof second.then === 'function' ? second : Promise.resolve();

  return Promise.allSettled([firstResult, secondResult]).then(results => {
    if (results[0].status === 'rejected') throw results[0].reason;
    if (results[1].status === 'rejected') {
      console.warn('Standby rain player could not start; falling back to native loop.', results[1].reason);
      pauseAndReset(secondary);
      standbyAudio = null;
      primary.loop = true;
      return true;
    }

    rainLoopTimer = window.setInterval(() => {
      const current = activeAudio;
      if (!current || current.paused || activeName !== 'rain' || !standbyAudio || rainCrossfading) return;
      if (!Number.isFinite(current.duration) || current.duration <= 0) return;
      const overlap = Math.min(0.32, Math.max(0.16, current.duration * 0.12));
      if (current.currentTime >= current.duration - overlap) beginRainCrossfade();
    }, 24);
    return true;
  });
}

export function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') { setStatus(name || 'none','disabled','Audio ist ausgeschaltet'); return Promise.resolve(false); }
  const src = name === 'rain' ? rainObjectUrl : staticSource(name);
  if (!src) { console.warn('Story SFX is not ready.', name); setStatus(name,'not-ready','Soundquelle fehlt'); return Promise.resolve(false); }
  stopStorySfx();

  const selectedVolume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : (name === 'rain' ? 0.28 : 0.62);
  activeName = name;

  if (name === 'rain' && Boolean(loop)) {
    rainTargetVolume = selectedVolume;
    const primary = new Audio();
    const secondary = new Audio();
    for (const audio of [primary, secondary]) {
      audio.preload = 'auto';
      audio.src = src;
      audio.setAttribute('playsinline', '');
    }
    const result = startDualRainLoop(primary, secondary)
      .then(() => true)
      .catch(error => {
        console.warn('Story rain playback failed.', error);
        clearRainLoop();
        pauseAndReset(primary);
        pauseAndReset(secondary);
        if (activeName === 'rain') { activeAudio = null; standbyAudio = null; activeName = ''; }
        return false;
      });
    if (testDurationMs > 0) stopTimer = window.setTimeout(() => { if (activeName === 'rain') stopStorySfx(); }, testDurationMs);
    return result;
  }

  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = src;
  audio.loop = Boolean(loop);
  audio.volume = selectedVolume;
  audio.setAttribute('playsinline', '');
  activeAudio = audio;
  standbyAudio = null;
  const playback = audio.play();
  const result = playback && typeof playback.then === 'function'
    ? playback.then(() => true).catch(error => { console.warn('Story SFX playback failed.', name, error); if (activeAudio === audio) { activeAudio = null; activeName = ''; } return false; })
    : Promise.resolve(true);
  if (testDurationMs > 0) stopTimer = window.setTimeout(() => { if (activeAudio === audio) stopStorySfx(); }, testDurationMs);
  return result;
}
export async function unlockStorySfx() { return preloadRain(); }
