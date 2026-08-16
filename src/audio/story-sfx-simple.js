import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let stopTimer = 0;
let rainDataUrlPromise = null;
const RAIN_B64_URL = new URL('../../assets/audio/rain-loop.mp3.b64', import.meta.url).href;

function staticSource(name) {
  if (!name || name === 'none') return '';
  return STORY_SFX_ASSETS[name] || '';
}

async function resolveSource(name) {
  if (!name || name === 'none') return '';
  if (name !== 'rain') return staticSource(name);

  if (!rainDataUrlPromise) {
    rainDataUrlPromise = fetch(RAIN_B64_URL, { cache: 'force-cache' })
      .then(response => {
        if (!response.ok) throw new Error(`Rain asset HTTP ${response.status}`);
        return response.text();
      })
      .then(base64 => `data:audio/mpeg;base64,${base64.trim()}`)
      .catch(error => {
        rainDataUrlPromise = null;
        console.warn('Rain asset failed to load.', error);
        return STORY_SFX_ASSETS.rain || STORY_SFX_ASSETS.thunder || '';
      });
  }
  return rainDataUrlPromise;
}

export function getStorySfxSrc(name) {
  return name === 'rain' ? RAIN_B64_URL : staticSource(name);
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

export async function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return false;
  const src = await resolveSource(name);
  if (!src) return false;

  stopStorySfx();

  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = Boolean(loop);
  audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : (name === 'rain' ? 0.10 : 0.62);
  activeAudio = audio;

  try {
    await audio.play();
  } catch (error) {
    console.warn('Story SFX playback failed.', name, error);
    if (activeAudio === audio) activeAudio = null;
    return false;
  }

  if (testDurationMs > 0) {
    stopTimer = window.setTimeout(() => {
      if (activeAudio === audio) stopStorySfx();
    }, testDurationMs);
  }

  return true;
}

export async function unlockStorySfx() {
  return true;
}
