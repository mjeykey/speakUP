import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';
import { RAIN_LOOP_ASSET } from './rain-loop-asset.js?v=1';

let activeAudio = null;
let stopTimer = 0;

function resolveSource(name) {
  if (!name || name === 'none') return '';
  if (name === 'rain') return RAIN_LOOP_ASSET || STORY_SFX_ASSETS.rain || STORY_SFX_ASSETS.thunder || '';
  return STORY_SFX_ASSETS[name] || '';
}

export function getStorySfxSrc(name) {
  return resolveSource(name);
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
  const src = resolveSource(name);
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
