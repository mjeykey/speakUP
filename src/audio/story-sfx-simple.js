import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let stopTimer = 0;
let rainDataUrl = '';
let rainPreloadPromise = null;
const RAIN_B64_URL = new URL('../../assets/audio/rain-loop.mp3.b64', import.meta.url).href;

function staticSource(name) {
  if (!name || name === 'none') return '';
  return STORY_SFX_ASSETS[name] || '';
}

function preloadRain() {
  if (rainDataUrl) return Promise.resolve(rainDataUrl);
  if (!rainPreloadPromise) {
    rainPreloadPromise = fetch(RAIN_B64_URL, { cache: 'force-cache' })
      .then(response => {
        if (!response.ok) throw new Error(`Rain asset HTTP ${response.status}`);
        return response.text();
      })
      .then(base64 => {
        rainDataUrl = `data:audio/mpeg;base64,${base64.trim()}`;
        return rainDataUrl;
      })
      .catch(error => {
        console.warn('Rain asset failed to preload.', error);
        rainPreloadPromise = null;
        return '';
      });
  }
  return rainPreloadPromise;
}

// Important for Android: load the rain bytes before the user starts the story.
// audio.play() can then run immediately inside the user's click gesture.
void preloadRain();

export function getStorySfxSrc(name) {
  if (name === 'rain') return rainDataUrl || '';
  return staticSource(name);
}

export function stopStorySfx() {
  window.clearTimeout(stopTimer);
  stopTimer = 0;
  if (!activeAudio) return;
  try {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  } catch (_) {}
  activeAudio = null;
}

export function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return Promise.resolve(false);

  // Do not fetch here. Waiting for a network/file fetch during the click handler
  // loses Android's transient user activation and the browser can block playback.
  const src = name === 'rain' ? rainDataUrl : staticSource(name);
  if (!src) {
    if (name === 'rain') void preloadRain();
    console.warn('Story SFX not ready yet.', name);
    return Promise.resolve(false);
  }

  stopStorySfx();

  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = Boolean(loop);
  audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : (name === 'rain' ? 0.10 : 0.62);
  activeAudio = audio;

  const playback = audio.play();
  const result = playback && typeof playback.then === 'function'
    ? playback.then(() => true).catch(error => {
        console.warn('Story SFX playback failed.', name, error);
        if (activeAudio === audio) activeAudio = null;
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
  await preloadRain();
  return true;
}
