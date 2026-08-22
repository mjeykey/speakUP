import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let activeName = '';
let rainAudio = null;
let bellAudio = null;
let stopTimer = 0;

const RAIN_MP3_URL = 'https://raw.githubusercontent.com/smithcol11/vr-class-horror-game/04a6aeb5b51ae98c1579c166d7fd42e24c88950d/sounds/rain-on-roof-or-window-nature-sounds-8312.mp3';
const BELL_MP3_URL = new URL('../../assets/audio/soundreality-tsar-bell-sound-simulation-292699.mp3?v=969c6cd233d57223-clean1', import.meta.url).href;

function staticSource(name) {
  if (!name || name === 'none' || name === 'bell' || name === 'warning-bell' || name === 'rain') return '';
  return STORY_SFX_ASSETS[name] || '';
}

function ensureBellAudio() {
  if (bellAudio && bellAudio.isConnected) return bellAudio;
  const audio = document.createElement('audio');
  audio.setAttribute('playsinline', '');
  audio.preload = 'auto';
  audio.loop = false;
  audio.volume = 0.90;
  audio.src = BELL_MP3_URL;
  audio.style.position = 'fixed';
  audio.style.width = '1px';
  audio.style.height = '1px';
  audio.style.opacity = '0';
  audio.style.pointerEvents = 'none';
  audio.style.left = '-9999px';
  document.body.appendChild(audio);
  bellAudio = audio;
  return audio;
}

function stopBell() {
  if (!bellAudio) return;
  try { bellAudio.pause(); } catch (_) {}
  try { bellAudio.currentTime = 0; } catch (_) {}
}

function playBell(volume = 0.90) {
  const audio = ensureBellAudio();
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.90;
    if (audio.src !== BELL_MP3_URL) {
      audio.src = BELL_MP3_URL;
      audio.load();
    }
    return Promise.resolve(audio.play()).then(() => true).catch(error => {
      console.warn('Tsar bell playback failed.', error);
      return false;
    });
  } catch (error) {
    console.warn('Tsar bell playback failed.', error);
    return Promise.resolve(false);
  }
}

function stopRain() {
  if (!rainAudio) return;
  try { rainAudio.pause(); } catch (_) {}
  try { rainAudio.currentTime = 0; } catch (_) {}
  rainAudio = null;
}

function playRain(volume = 0.40, keepGoing = false) {
  if (rainAudio && !rainAudio.paused && !rainAudio.ended) return Promise.resolve(true);
  stopRain();
  const audio = new Audio(RAIN_MP3_URL);
  audio.setAttribute('playsinline', '');
  audio.preload = 'auto';
  audio.loop = false;
  audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.40;
  rainAudio = audio;
  audio.onended = () => {
    if (rainAudio !== audio) return;
    rainAudio = null;
    if (keepGoing) void playRain(volume, true);
  };
  audio.onerror = () => {
    if (rainAudio === audio) rainAudio = null;
  };
  return Promise.resolve(audio.play()).then(() => true).catch(error => {
    if (rainAudio === audio) rainAudio = null;
    console.warn('Rain playback failed.', error);
    return false;
  });
}

function stopGeneric() {
  if (!activeAudio) return;
  try { activeAudio.pause(); } catch (_) {}
  try { activeAudio.currentTime = 0; } catch (_) {}
  activeAudio = null;
  activeName = '';
}

function playGeneric(name, volume = 0.30, loop = false) {
  const src = staticSource(name);
  if (!src) return Promise.resolve(false);
  stopGeneric();
  const audio = new Audio(src);
  audio.setAttribute('playsinline', '');
  audio.preload = 'auto';
  audio.loop = Boolean(loop);
  audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.30;
  activeAudio = audio;
  activeName = name;
  audio.onended = () => {
    if (activeAudio !== audio) return;
    activeAudio = null;
    activeName = '';
  };
  return Promise.resolve(audio.play()).then(() => true).catch(error => {
    if (activeAudio === audio) {
      activeAudio = null;
      activeName = '';
    }
    console.warn('Story SFX playback failed.', name, error);
    return false;
  });
}

export function getStorySfxSrc(name) {
  if (name === 'bell') return BELL_MP3_URL;
  if (name === 'rain') return RAIN_MP3_URL;
  if (name === 'warning-bell') return '';
  return staticSource(name);
}

export function isStorySfxReady(name) {
  if (name === 'bell' || name === 'rain' || name === 'warning-bell') return true;
  return Boolean(staticSource(name));
}

export function isStorySfxPlaying(name) {
  if (name === 'bell') return Boolean(bellAudio && !bellAudio.paused && !bellAudio.ended && !bellAudio.muted);
  if (name === 'rain') return Boolean(rainAudio && !rainAudio.paused && !rainAudio.ended);
  if (name === 'warning-bell') return false;
  return Boolean(activeAudio && !activeAudio.paused && activeName === name);
}

export async function preloadStorySfx(name) {
  if (name === 'bell') {
    ensureBellAudio();
    return true;
  }
  if (name === 'rain' || name === 'warning-bell') return true;
  return Boolean(staticSource(name));
}

export function stopStorySfx() {
  clearTimeout(stopTimer);
  stopTimer = 0;
  stopGeneric();
  stopRain();
  stopBell();
}

export async function unlockStorySfx() {
  ensureBellAudio();
  return true;
}

export function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return Promise.resolve(false);

  // Page 2 keeps the separate warning-bell mapping, but the old synthetic oscillator is intentionally removed.
  if (name === 'warning-bell') return Promise.resolve(false);
  if (name === 'bell') return playBell(volume);
  if (name === 'rain') return playRain(volume, loop);

  const result = playGeneric(name, volume, loop);
  if (testDurationMs > 0) {
    clearTimeout(stopTimer);
    stopTimer = window.setTimeout(() => stopStorySfx(), testDurationMs);
  }
  return result;
}
