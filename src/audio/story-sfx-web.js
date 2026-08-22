import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let audioContext = null;
let bellBuffer = null;
let bellBufferPromise = null;
let bellSource = null;
let bellGain = null;
let activeAudio = null;
let activeName = '';
let rainAudio = null;
let stopTimer = 0;

const RAIN_MP3_URL = 'https://raw.githubusercontent.com/smithcol11/vr-class-horror-game/04a6aeb5b51ae98c1579c166d7fd42e24c88950d/sounds/rain-on-roof-or-window-nature-sounds-8312.mp3';
const BELL_MP3_URL = new URL('../../assets/audio/soundreality-tsar-bell-sound-simulation-292699.mp3?v=969c6cd233d57223-web1', import.meta.url).href;

function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass({ latencyHint: 'interactive' });
  }
  return audioContext;
}

function staticSource(name) {
  if (!name || name === 'none' || name === 'bell' || name === 'warning-bell' || name === 'rain') return '';
  return STORY_SFX_ASSETS[name] || '';
}

function prepareBellBuffer() {
  if (bellBuffer) return Promise.resolve(bellBuffer);
  if (bellBufferPromise) return bellBufferPromise;
  const ctx = ensureAudioContext();
  if (!ctx) return Promise.resolve(null);
  bellBufferPromise = fetch(BELL_MP3_URL, { cache: 'force-cache' })
    .then(response => {
      if (!response.ok) throw new Error(`Bell HTTP ${response.status}`);
      return response.arrayBuffer();
    })
    .then(bytes => ctx.decodeAudioData(bytes.slice(0)))
    .then(buffer => {
      bellBuffer = buffer;
      return buffer;
    })
    .catch(error => {
      bellBufferPromise = null;
      console.warn('Tsar bell buffer preparation failed.', error);
      return null;
    });
  return bellBufferPromise;
}

function stopBell() {
  const source = bellSource;
  bellSource = null;
  const gain = bellGain;
  bellGain = null;
  if (source) {
    try { source.onended = null; } catch (_) {}
    try { source.stop(0); } catch (_) {}
    try { source.disconnect(); } catch (_) {}
  }
  if (gain) {
    try { gain.disconnect(); } catch (_) {}
  }
}

async function playBell(volume = 0.90) {
  const ctx = ensureAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === 'suspended') await ctx.resume();
    if (ctx.state !== 'running') return false;
    const buffer = bellBuffer || await prepareBellBuffer();
    if (!buffer) return false;
    stopBell();
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    source.loop = false;
    gain.gain.setValueAtTime(Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.90, ctx.currentTime);
    source.connect(gain);
    gain.connect(ctx.destination);
    bellSource = source;
    bellGain = gain;
    source.onended = () => {
      if (bellSource !== source) return;
      try { source.disconnect(); } catch (_) {}
      try { gain.disconnect(); } catch (_) {}
      bellSource = null;
      bellGain = null;
    };
    source.start(0);
    return true;
  } catch (error) {
    console.warn('Tsar bell WebAudio playback failed.', error);
    stopBell();
    return false;
  }
}

function stopRain() {
  if (!rainAudio) return;
  const audio = rainAudio;
  rainAudio = null;
  audio.onended = null;
  audio.onerror = null;
  try { audio.pause(); } catch (_) {}
  try { audio.currentTime = 0; } catch (_) {}
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
  const audio = activeAudio;
  activeAudio = null;
  activeName = '';
  try { audio.pause(); } catch (_) {}
  try { audio.currentTime = 0; } catch (_) {}
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
  if (name === 'bell') return Boolean(bellBuffer);
  if (name === 'rain' || name === 'warning-bell') return true;
  return Boolean(staticSource(name));
}

export function isStorySfxPlaying(name) {
  if (name === 'bell') return Boolean(bellSource);
  if (name === 'rain') return Boolean(rainAudio && !rainAudio.paused && !rainAudio.ended);
  if (name === 'warning-bell') return false;
  return Boolean(activeAudio && !activeAudio.paused && activeName === name);
}

export async function preloadStorySfx(name) {
  if (name === 'bell') return Boolean(await prepareBellBuffer());
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
  const ctx = ensureAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === 'suspended') await ctx.resume();
    void prepareBellBuffer();
    return ctx.state === 'running';
  } catch (_) {
    return false;
  }
}

export function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return Promise.resolve(false);
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

// Decode the exact uploaded MP3 early. On mobile, any user touch resumes the
// AudioContext; no synthetic oscillator or substitute bell is ever created.
void prepareBellBuffer();
if (typeof window !== 'undefined') {
  const unlock = () => { void unlockStorySfx(); };
  window.addEventListener('pointerdown', unlock, { capture: true });
  window.addEventListener('touchstart', unlock, { capture: true, passive: true });
}
