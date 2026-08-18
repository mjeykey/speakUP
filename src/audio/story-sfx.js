import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let audioContext = null;
let activePlayer = null;
let rainAudio = null;
let testStopTimer = 0;
let playRequestId = 0;
let rainRequestId = 0;

const decodedBuffers = new Map();
const loadingBuffers = new Map();
// Exact 41.822031 s Library recording; immutable source commit, Git blob ddbc829ff6d8e4d3b64b2a5e65d6945a216e2592.
const RAIN_MP3_URL = 'https://raw.githubusercontent.com/smithcol11/vr-class-horror-game/04a6aeb5b51ae98c1579c166d7fd42e24c88950d/sounds/rain-on-roof-or-window-nature-sounds-8312.mp3';

function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass({ latencyHint: 'interactive' });
  }
  return audioContext;
}

function staticSource(name) {
  if (!name || name === 'none') return '';
  return STORY_SFX_ASSETS[name] || '';
}

async function sourceArrayBuffer(name) {
  const src = staticSource(name);
  if (!src) throw new Error(`No Story SFX asset for ${name}`);
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Story SFX HTTP ${response.status}`);
  return response.arrayBuffer();
}

async function loadBuffer(name) {
  if (!name || name === 'none' || name === 'rain') return null;
  if (decodedBuffers.has(name)) return decodedBuffers.get(name);
  if (loadingBuffers.has(name)) return loadingBuffers.get(name);
  const ctx = ensureAudioContext();
  if (!ctx) return null;
  const promise = sourceArrayBuffer(name)
    .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer.slice(0)))
    .then(buffer => { decodedBuffers.set(name, buffer); loadingBuffers.delete(name); return buffer; })
    .catch(error => { loadingBuffers.delete(name); console.warn('Story SFX preload failed.', name, error); return null; });
  loadingBuffers.set(name, promise);
  return promise;
}

function stopRainAudio() {
  rainRequestId += 1;
  const audio = rainAudio;
  rainAudio = null;
  if (!audio) return;
  audio.onended = null;
  audio.onerror = null;
  try { audio.pause(); } catch (_) {}
  try { audio.currentTime = 0; } catch (_) {}
  try { audio.removeAttribute('src'); audio.load(); } catch (_) {}
}

function playRain(volume, loop = true) {
  if (rainAudio && !rainAudio.paused && !rainAudio.ended) return Promise.resolve(true);
  stopRainAudio();
  const requestId = ++rainRequestId;
  const audio = new Audio(RAIN_MP3_URL);
  audio.preload = 'auto';
  audio.loop = Boolean(loop);
  audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.10;
  rainAudio = audio;

  audio.onended = () => {
    if (rainRequestId !== requestId || rainAudio !== audio) return;
    audio.onended = null;
    audio.onerror = null;
    rainAudio = null;
  };
  audio.onerror = () => {
    if (rainRequestId !== requestId || rainAudio !== audio) return;
    console.warn('Story rain playback failed.');
    rainAudio = null;
  };

  return audio.play()
    .then(() => rainRequestId === requestId && rainAudio === audio)
    .catch(error => {
      if (rainRequestId === requestId && rainAudio === audio) rainAudio = null;
      console.warn('Story rain playback failed.', error);
      return false;
    });
}

export function getStorySfxSrc(name) { return name === 'rain' ? RAIN_MP3_URL : staticSource(name); }
export function isStorySfxReady(name) { return name === 'rain' ? Boolean(rainAudio) : decodedBuffers.has(name); }
export function isStorySfxPlaying(name) {
  if (name === 'rain') return Boolean(rainAudio && !rainAudio.paused && !rainAudio.ended);
  return Boolean(activePlayer && (!name || activePlayer.name === name));
}
export async function preloadStorySfx(name) {
  if (name === 'rain') return true;
  return Boolean(await loadBuffer(name));
}

function stopActivePlayer() {
  if (!activePlayer) return;
  const player = activePlayer;
  activePlayer = null;
  try { player.source.onended = null; } catch (_) {}
  try { player.source.stop(0); } catch (_) {}
  try { player.source.disconnect(); } catch (_) {}
  try { player.gain.disconnect(); } catch (_) {}
}

export function stopStorySfx() {
  playRequestId += 1;
  window.clearTimeout(testStopTimer);
  testStopTimer = 0;
  stopActivePlayer();
  stopRainAudio();
}

export async function unlockStorySfx() {
  const ctx = ensureAudioContext();
  if (!ctx) return false;
  try { if (ctx.state === 'suspended') await ctx.resume(); return ctx.state === 'running'; }
  catch (_) { return false; }
}

export async function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return false;

  // Rain is an independent HTMLAudio ambience track. It may loop while the
  // current story page stays open; story.js stops it on the actual page change.
  if (name === 'rain') return playRain(volume, loop);

  const requestId = ++playRequestId;
  const ctx = ensureAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === 'suspended') await ctx.resume();
    if (ctx.state !== 'running' || requestId !== playRequestId) return false;
    const buffer = await loadBuffer(name);
    if (!buffer || requestId !== playRequestId) return false;
    stopActivePlayer();
    window.clearTimeout(testStopTimer);
    testStopTimer = 0;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    const isAmbience = name === 'wind' || name === 'soft-wind' || name === 'dawn-wind' || name === 'water';
    const selectedVolume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : (isAmbience ? 0.10 : 0.30);
    source.buffer = buffer;
    source.loop = Boolean(loop);
    gain.gain.setValueAtTime(selectedVolume, ctx.currentTime);
    source.connect(gain);
    gain.connect(ctx.destination);
    const player = { name, source, gain };
    activePlayer = player;
    source.onended = () => {
      if (activePlayer !== player) return;
      try { source.disconnect(); } catch (_) {}
      try { gain.disconnect(); } catch (_) {}
      activePlayer = null;
    };
    source.start(0);
    if (testDurationMs > 0) testStopTimer = window.setTimeout(() => { if (activePlayer === player) stopStorySfx(); }, testDurationMs);
    return true;
  } catch (error) {
    console.warn('Story SFX playback failed.', name, error);
    if (requestId === playRequestId) stopActivePlayer();
    return false;
  }
}

if (typeof window !== 'undefined') {
  const prime = () => { void unlockStorySfx(); };
  window.addEventListener('pointerdown', prime, { once: true, capture: true });
  window.addEventListener('touchstart', prime, { once: true, capture: true, passive: true });
}
