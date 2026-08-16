import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let activeName = '';
let stopTimer = 0;
let rainObjectUrl = '';
let rainPreloadPromise = null;
let status = { name:'', state:'idle', detail:'' };
const RAIN_B64_URL = new URL('../../assets/audio/rain-loop.mp3.b64', import.meta.url).href;

function setStatus(name,state,detail='') {
  status = { name, state, detail };
  window.dispatchEvent(new CustomEvent('story-sfx-status',{detail:status}));
}

export function getStorySfxStatus() {
  return { ...status };
}

function staticSource(name) {
  if (!name || name === 'none') return '';
  return STORY_SFX_ASSETS[name] || '';
}

function base64ToBlobUrl(base64) {
  const clean = String(base64 || '').replace(/\s+/g, '');
  if (!clean) throw new Error('Rain asset is empty');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  const blob = new Blob([bytes], { type: 'audio/mpeg' });
  return URL.createObjectURL(blob);
}

function preloadRain() {
  if (rainObjectUrl) return Promise.resolve(true);
  setStatus('rain','loading','MP3 wird geladen');
  if (!rainPreloadPromise) {
    rainPreloadPromise = fetch(RAIN_B64_URL, { cache: 'force-cache' })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then(base64 => {
        rainObjectUrl = base64ToBlobUrl(base64);
        setStatus('rain','ready','MP3 bereit');
        return true;
      })
      .catch(error => {
        console.warn('Rain asset failed to preload.', error);
        rainPreloadPromise = null;
        setStatus('rain','error',`Laden fehlgeschlagen: ${error?.message || error}`);
        return false;
      });
  }
  return rainPreloadPromise;
}

void preloadRain();

export function isStorySfxReady(name) {
  if (name === 'rain') return Boolean(rainObjectUrl);
  return Boolean(staticSource(name));
}

export function isStorySfxPlaying(name) {
  return Boolean(activeAudio && !activeAudio.paused && activeName === name);
}

export async function preloadStorySfx(name) {
  if (name === 'rain') return preloadRain();
  return Boolean(staticSource(name));
}

export function getStorySfxSrc(name) {
  if (name === 'rain') return rainObjectUrl || '';
  return staticSource(name);
}

export function stopStorySfx() {
  window.clearTimeout(stopTimer);
  stopTimer = 0;
  if (!activeAudio) {
    activeName = '';
    return;
  }
  try {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  } catch (_) {}
  activeAudio = null;
  activeName = '';
  setStatus(status.name || 'rain','stopped','Audio gestoppt');
}

export function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') {
    setStatus(name || 'none','disabled','Audio ist ausgeschaltet');
    return Promise.resolve(false);
  }

  const src = name === 'rain' ? rainObjectUrl : staticSource(name);
  if (!src) {
    console.warn('Story SFX is not ready.', name);
    setStatus(name,'not-ready','Soundquelle fehlt');
    return Promise.resolve(false);
  }

  stopStorySfx();

  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = src;
  audio.loop = Boolean(loop);
  audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : (name === 'rain' ? 0.28 : 0.62);
  audio.setAttribute('playsinline', '');
  activeAudio = audio;
  activeName = name;
  setStatus(name,'starting',`play() aufgerufen · Lautstärke ${audio.volume.toFixed(2)}`);

  audio.addEventListener('loadedmetadata',()=>setStatus(name,'metadata',`Dauer ${Number.isFinite(audio.duration)?audio.duration.toFixed(1):'?'}s`));
  audio.addEventListener('canplay',()=>setStatus(name,'canplay','Browser kann Audio abspielen'));
  audio.addEventListener('playing',()=>setStatus(name,'playing',`läuft · t=${audio.currentTime.toFixed(2)}s`));
  audio.addEventListener('waiting',()=>setStatus(name,'waiting','Browser wartet auf Audiodaten'));
  audio.addEventListener('stalled',()=>setStatus(name,'stalled','Audiodaten hängen'));
  audio.addEventListener('error',()=>setStatus(name,'error',`MediaError ${audio.error?.code || '?'} `));

  const playback = audio.play();
  const result = playback && typeof playback.then === 'function'
    ? playback.then(() => {
        setStatus(name,'play-accepted',`play() akzeptiert · paused=${audio.paused}`);
        window.setTimeout(()=>{
          if (activeAudio === audio) setStatus(name,audio.paused?'paused':'playing',`nach 700ms · t=${audio.currentTime.toFixed(2)}s · readyState=${audio.readyState}`);
        },700);
        return true;
      }).catch(error => {
        console.warn('Story SFX playback failed.', name, error);
        setStatus(name,'blocked',`${error?.name || 'Fehler'}: ${error?.message || error}`);
        if (activeAudio === audio) {
          activeAudio = null;
          activeName = '';
        }
        return false;
      })
    : Promise.resolve(true);

  if (testDurationMs > 0) {
    stopTimer = window.setTimeout(() => {
      if (activeAudio === audio) stopStorySfx();
    }, testDurationMs);
  }

  return result;
}

export async function unlockStorySfx() {
  return preloadRain();
}
