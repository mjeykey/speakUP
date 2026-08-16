import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let stopTimer = 0;

function resolveSource(name) {
  if (!name || name === 'none') return '';
  if (name === 'rain') {
    return STORY_SFX_ASSETS.rain || STORY_SFX_ASSETS.thunder || '';
  }
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

function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

export async function playStorySfx(name, { enabled = true, durationMs } = {}) {
  if (!enabled || !name || name === 'none') return false;

  const src = resolveSource(name);
  if (!src) {
    console.warn('No real Story SFX asset found for', name);
    return false;
  }

  stopStorySfx();

  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = false;
  audio.volume = name === 'rain' ? 0.34 : 0.62;
  activeAudio = audio;

  try {
    await audio.play();
  } catch (error) {
    console.warn('Story SFX playback failed.', name, error);
    if (activeAudio === audio) activeAudio = null;
    return false;
  }

  const cueLength = Number.isFinite(durationMs)
    ? Math.max(250, durationMs)
    : (name === 'rain' ? 2200 : 1100);

  await Promise.race([
    wait(cueLength),
    new Promise(resolve => {
      audio.addEventListener('ended', resolve, { once: true });
      audio.addEventListener('error', resolve, { once: true });
    })
  ]);

  if (activeAudio === audio) {
    try { audio.pause(); } catch (_) {}
    activeAudio = null;
  }
  return true;
}

export async function unlockStorySfx() {
  // Kept for compatibility. Playback is now started only from user-driven
  // Story Mode navigation and no longer relies on a persistent WebAudio loop.
  return true;
}
