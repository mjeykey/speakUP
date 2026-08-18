import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let audioContext = null;
let activePlayer = null;
let testStopTimer = 0;
let playRequestId = 0;

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

function base64ToArrayBuffer(base64Text) {
  const clean = String(base64Text || '').replace(/\s+/g, '');
  if (!clean) throw new Error('Story SFX base64 asset is empty');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

async function sourceArrayBuffer(name) {
  if (name === 'rain') {
    const response = await fetch(RAIN_MP3_URL, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Rain asset HTTP ${response.status}`);
    return response.arrayBuffer();
  }
  const src = staticSource(name);
  if (!src) throw new Error(`No Story SFX asset for ${name}`);
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Story SFX HTTP ${response.status}`);
  return response.arrayBuffer();
}

async function loadBuffer(name) {
  if (!name || name === 'none') return null;
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

export function getStorySfxSrc(name) { return name === 'rain' ? RAIN_MP3_URL : staticSource(name); }
export function isStorySfxReady(name) { return decodedBuffers.has(name); }
export function isStorySfxPlaying(name) { return Boolean(activePlayer && (!name || activePlayer.name === name)); }
export async function preloadStorySfx(name) { return Boolean(await loadBuffer(name)); }

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
}

export async function unlockStorySfx() {
  const ctx = ensureAudioContext();
  if (!ctx) return false;
  try { if (ctx.state === 'suspended') await ctx.resume(); return ctx.state === 'running'; }
  catch (_) { return false; }
}

export async function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return false;
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
    const isAmbience = name === 'rain' || name === 'wind' || name === 'soft-wind' || name === 'dawn-wind' || name === 'water';
    const selectedVolume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : (isAmbience ? 0.10 : 0.30);
    source.buffer = buffer;
    // Rain is deliberately one-shot. Ignore every loop request for rain.
    source.loop = name === 'rain' ? false : Boolean(loop);
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
    if (requestId === playRequestId) stopStorySfx();
    return false;
  }
}

if (typeof window !== 'undefined') {
  const prime = () => { void unlockStorySfx(); };
  window.addEventListener('pointerdown', prime, { once: true, capture: true });
  window.addEventListener('touchstart', prime, { once: true, capture: true, passive: true });
}
