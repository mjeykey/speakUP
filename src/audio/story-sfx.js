import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let audioContext = null;
let activePlayer = null;
let rainAudio = null;
let rainShouldContinue = false;
let bellAudio = null;
let bellPrimed = false;
let testStopTimer = 0;
let playRequestId = 0;
let rainRequestId = 0;
let bellRequestId = 0;

const decodedBuffers = new Map();
const loadingBuffers = new Map();
// Exact 41.822031 s Library recording; immutable source commit, Git blob ddbc829ff6d8e4d3b64b2a5e65d6945a216e2592.
const RAIN_MP3_URL = 'https://raw.githubusercontent.com/smithcol11/vr-class-horror-game/04a6aeb5b51ae98c1579c166d7fd42e24c88950d/sounds/rain-on-roof-or-window-nature-sounds-8312.mp3';
// Exact verified 50.04 s user-uploaded Tsar church-bell recording.
const BELL_MP3_URL = new URL('../../assets/audio/soundreality-tsar-bell-sound-simulation-292699.mp3', import.meta.url).href;
let bellMp3Url = BELL_MP3_URL;

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

async function getBellMp3Url() {
  bellMp3Url = BELL_MP3_URL;
  if (typeof document !== 'undefined' && document.body) {
    const audio = ensureBellAudio();
    if (audio.src !== BELL_MP3_URL) {
      audio.src = BELL_MP3_URL;
      audio.load();
    }
  }
  return BELL_MP3_URL;
}

async function sourceArrayBuffer(name) {
  const src = staticSource(name);
  if (!src) throw new Error(`No Story SFX asset for ${name}`);
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Story SFX HTTP ${response.status}`);
  return response.arrayBuffer();
}

async function loadBuffer(name) {
  if (!name || name === 'none' || name === 'rain' || name === 'bell' || name === 'warning-bell') return null;
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
  rainShouldContinue = false;
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

function playRain(volume, continueUntilStopped = false) {
  if (rainAudio && !rainAudio.paused && !rainAudio.ended) {
    rainShouldContinue = rainShouldContinue || Boolean(continueUntilStopped);
    return Promise.resolve(true);
  }

  stopRainAudio();
  rainShouldContinue = Boolean(continueUntilStopped);
  const requestId = ++rainRequestId;
  const selectedVolume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.10;
  const audio = new Audio(RAIN_MP3_URL);
  audio.preload = 'auto';
  audio.loop = false;
  audio.volume = selectedVolume;
  rainAudio = audio;

  audio.onended = () => {
    if (rainRequestId !== requestId || rainAudio !== audio) return;
    audio.onended = null;
    audio.onerror = null;
    rainAudio = null;
    if (!rainShouldContinue) return;
    window.setTimeout(() => {
      if (rainRequestId !== requestId || !rainShouldContinue || rainAudio) return;
      void playRain(selectedVolume, true);
    }, 0);
  };

  audio.onerror = () => {
    if (rainRequestId !== requestId || rainAudio !== audio) return;
    console.warn('Story rain playback failed.');
    rainShouldContinue = false;
    rainAudio = null;
  };

  return audio.play()
    .then(() => rainRequestId === requestId && rainAudio === audio)
    .catch(error => {
      if (rainRequestId === requestId && rainAudio === audio) {
        rainShouldContinue = false;
        rainAudio = null;
      }
      console.warn('Story rain playback failed.', error);
      return false;
    });
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

function stopBellAudio() {
  bellRequestId += 1;
  const audio = bellAudio;
  if (!audio) return;
  audio.onended = null;
  audio.onerror = null;
  try { audio.pause(); } catch (_) {}
  try { audio.currentTime = 0; } catch (_) {}
}

function startBellAudio(sourceUrl, volume, requestId) {
  if (!sourceUrl || requestId !== bellRequestId) return Promise.resolve(false);
  const audio = ensureBellAudio();
  try {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.90;
    if (audio.src !== sourceUrl) {
      audio.src = sourceUrl;
      audio.load();
    }
    audio.onended = () => {
      if (bellRequestId !== requestId || bellAudio !== audio) return;
      audio.onended = null;
      audio.onerror = null;
    };
    audio.onerror = () => {
      if (bellRequestId !== requestId || bellAudio !== audio) return;
      console.warn('Uploaded church bell MP3 playback failed.');
    };
    const playback = audio.play();
    return Promise.resolve(playback)
      .then(() => bellRequestId === requestId && bellAudio === audio)
      .catch(error => {
        console.warn('Uploaded church bell MP3 playback failed.', error);
        return false;
      });
  } catch (error) {
    console.warn('Uploaded church bell MP3 playback failed.', error);
    return Promise.resolve(false);
  }
}

function playBell(volume) {
  stopBellAudio();
  const requestId = ++bellRequestId;
  // Direct verified MP3 keeps play() inside the user's Story navigation gesture.
  return startBellAudio(BELL_MP3_URL, volume, requestId);
}

function primeBellFromGesture() {
  if (bellPrimed) return;
  const audio = ensureBellAudio();
  if (!bellMp3Url) {
    void getBellMp3Url();
    return;
  }

  const primeRequestId = bellRequestId;
  bellPrimed = true;
  try {
    if (audio.src !== bellMp3Url) {
      audio.src = bellMp3Url;
      audio.load();
    }
    audio.muted = true;
    audio.volume = 0;
    const playback = audio.play();
    Promise.resolve(playback).then(() => {
      // A real bell may have started from the same tap. Never pause it here.
      if (bellRequestId !== primeRequestId || !audio.muted) return;
      try { audio.pause(); audio.currentTime = 0; } catch (_) {}
      audio.muted = false;
      audio.volume = 0.90;
    }).catch(() => {
      if (bellRequestId === primeRequestId && audio.muted) {
        audio.muted = false;
        audio.volume = 0.90;
        bellPrimed = false;
      }
    });
  } catch (_) {
    audio.muted = false;
    audio.volume = 0.90;
    bellPrimed = false;
  }
}

async function playWarningBell(volume) {
  const ctx = ensureAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === 'suspended') await ctx.resume();
    if (ctx.state !== 'running') return false;
    stopActivePlayer();
    const selectedVolume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.55;
    const nodes = [];
    const start = ctx.currentTime + 0.015;
    [0, 0.42, 0.84].forEach(delay => {
      [760, 1140].forEach((frequency, harmonicIndex) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = harmonicIndex === 0 ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, start + delay);
        gain.gain.setValueAtTime(0.0001, start + delay);
        gain.gain.exponentialRampToValueAtTime(selectedVolume * (harmonicIndex === 0 ? 0.30 : 0.13), start + delay + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + delay + 0.30);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(start + delay);
        oscillator.stop(start + delay + 0.32);
        nodes.push(oscillator, gain);
      });
    });
    const player = { name: 'warning-bell', nodes };
    activePlayer = player;
    window.setTimeout(() => {
      if (activePlayer !== player) return;
      nodes.forEach(node => { try { node.disconnect(); } catch (_) {} });
      activePlayer = null;
    }, 1300);
    return true;
  } catch (error) {
    console.warn('Story warning bell playback failed.', error);
    stopActivePlayer();
    return false;
  }
}

export function getStorySfxSrc(name) {
  if (name === 'rain') return RAIN_MP3_URL;
  if (name === 'bell') return BELL_MP3_URL;
  return staticSource(name);
}
export function isStorySfxReady(name) {
  if (name === 'rain') return Boolean(rainAudio);
  if (name === 'bell') return Boolean(BELL_MP3_URL);
  if (name === 'warning-bell') return true;
  return decodedBuffers.has(name);
}
export function isStorySfxPlaying(name) {
  if (name === 'rain') return Boolean(rainAudio && !rainAudio.paused && !rainAudio.ended);
  if (name === 'bell') return Boolean(bellAudio && !bellAudio.paused && !bellAudio.ended && !bellAudio.muted);
  return Boolean(activePlayer && (!name || activePlayer.name === name));
}
export async function preloadStorySfx(name) {
  if (name === 'rain') return true;
  if (name === 'bell') return Boolean(await getBellMp3Url());
  if (name === 'warning-bell') return true;
  return Boolean(await loadBuffer(name));
}

function stopActivePlayer() {
  if (!activePlayer) return;
  const player = activePlayer;
  activePlayer = null;
  if (Array.isArray(player.nodes)) {
    player.nodes.forEach(node => {
      try { node.stop?.(0); } catch (_) {}
      try { node.disconnect?.(); } catch (_) {}
    });
    return;
  }
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
  stopBellAudio();
}

export async function unlockStorySfx() {
  ensureBellAudio();
  const ctx = ensureAudioContext();
  if (!ctx) return true;
  try { if (ctx.state === 'suspended') await ctx.resume(); return ctx.state === 'running'; }
  catch (_) { return false; }
}

export async function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return false;

  if (name === 'rain') return playRain(volume, loop);
  if (name === 'bell') return playBell(volume);
  if (name === 'warning-bell') return playWarningBell(volume);

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
  // Preload the exact verified church-bell MP3 so page 5 can
  // start it synchronously from the user's navigation gesture.
  void getBellMp3Url();
  const prime = () => {
    void unlockStorySfx();
    primeBellFromGesture();
  };
  window.addEventListener('pointerdown', prime, { capture: true });
  window.addEventListener('touchstart', prime, { capture: true, passive: true });
}