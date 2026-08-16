import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let activeName = '';
let stopTimer = 0;
let rainDataUrl = '';
let rainPreloadPromise = null;
const RAIN_B64_URL = new URL('../../assets/audio/rain-loop.mp3.b64', import.meta.url).href;

function staticSource(name) {
  if (!name || name === 'none') return '';
  return STORY_SFX_ASSETS[name] || '';
}

function preloadRain() {
  if (rainDataUrl) return Promise.resolve(true);
  if (!rainPreloadPromise) {
    rainPreloadPromise = fetch(RAIN_B64_URL, { cache: 'force-cache' })
      .then(response => {
        if (!response.ok) throw new Error(`Rain asset HTTP ${response.status}`);
        return response.text();
      })
      .then(base64 => {
        const clean = base64.trim();
        if (!clean) throw new Error('Rain asset is empty');
        rainDataUrl = `data:audio/mpeg;base64,${clean}`;
        return true;
      })
      .catch(error => {
        console.warn('Rain asset failed to preload.', error);
        rainPreloadPromise = null;
        return false;
      });
  }
  return rainPreloadPromise;
}

void preloadRain();

export function isStorySfxReady(name) {
  if (name === 'rain') return Boolean(rainDataUrl);
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
  if (name === 'rain') return rainDataUrl || '';
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
}

export function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return Promise.resolve(false);

  const src = name === 'rain' ? rainDataUrl : staticSource(name);
  if (!src) {
    console.warn('Story SFX is not ready.', name);
    return Promise.resolve(false);
  }

  stopStorySfx();

  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = Boolean(loop);
  audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : (name === 'rain' ? 0.20 : 0.62);
  activeAudio = audio;
  activeName = name;

  const playback = audio.play();
  const result = playback && typeof playback.then === 'function'
    ? playback.then(() => true).catch(error => {
        console.warn('Story SFX playback failed.', name, error);
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
