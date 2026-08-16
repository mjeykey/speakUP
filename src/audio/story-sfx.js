import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let audioContext = null;
let activePlayer = null;
let testStopTimer = 0;
let rainDataUrlPromise = null;

const RAIN_B64_PATH = 'assets/audio/rain-loop.mp3.b64';

function ensureAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

function staticSource(name) {
  if (!name || name === 'none') return '';
  return STORY_SFX_ASSETS[name] || '';
}

async function resolvePlayableSource(name) {
  if (name !== 'rain') return staticSource(name);
  if (!rainDataUrlPromise) {
    rainDataUrlPromise = fetch(RAIN_B64_PATH, { cache: 'force-cache' })
      .then(response => {
        if (!response.ok) throw new Error(`Rain asset HTTP ${response.status}`);
        return response.text();
      })
      .then(base64 => `data:audio/mpeg;base64,${base64.trim()}`)
      .catch(error => {
        rainDataUrlPromise = null;
        console.warn('Real rain asset could not be loaded.', error);
        return '';
      });
  }
  return rainDataUrlPromise;
}

export function getStorySfxSrc(name) {
  return name === 'rain' ? RAIN_B64_PATH : staticSource(name);
}

function disconnectPlayer(player) {
  if (!player) return;
  try {
    player.audio.pause();
    player.audio.currentTime = 0;
  } catch (_) {}
  try { player.source.disconnect(); } catch (_) {}
  try { player.gain.disconnect(); } catch (_) {}
}

export function stopStorySfx() {
  window.clearTimeout(testStopTimer);
  testStopTimer = 0;
  if (!activePlayer) return;
  disconnectPlayer(activePlayer);
  activePlayer = null;
}

export async function unlockStorySfx() {
  const ctx = ensureAudioContext();
  if (!ctx) return false;
  try {
    if (ctx.state === 'suspended') await ctx.resume();
    return ctx.state === 'running';
  } catch (_) {
    return false;
  }
}

function createMixedPlayer(src, { loop = false, volume = 0.2 } = {}) {
  const ctx = ensureAudioContext();
  if (!ctx) return null;

  const audio = new Audio(src);
  audio.preload = 'auto';
  audio.loop = loop;

  const source = ctx.createMediaElementSource(audio);
  const gain = ctx.createGain();
  gain.gain.value = volume;

  source.connect(gain);
  gain.connect(ctx.destination);

  return { audio, source, gain };
}

export async function playStorySfx(name, {
  enabled = true,
  loop = false,
  volume,
  testDurationMs = 0
} = {}) {
  if (!enabled || !name || name === 'none') return false;

  const src = await resolvePlayableSource(name);
  if (!src) {
    console.warn('No real Story SFX asset found for', name);
    return false;
  }

  const ctx = ensureAudioContext();
  if (!ctx) return false;

  try {
    if (ctx.state === 'suspended') await ctx.resume();
    if (ctx.state !== 'running') return false;

    stopStorySfx();

    const isAmbience = name === 'rain' || name === 'wind' || name === 'soft-wind' || name === 'dawn-wind' || name === 'water';
    const player = createMixedPlayer(src, {
      loop,
      volume: Number.isFinite(volume) ? volume : (isAmbience ? 0.1 : 0.3)
    });
    if (!player) return false;

    activePlayer = player;

    player.audio.addEventListener('ended', () => {
      if (activePlayer === player && !player.audio.loop) {
        disconnectPlayer(player);
        activePlayer = null;
      }
    }, { once: true });

    await player.audio.play();

    if (testDurationMs > 0) {
      testStopTimer = window.setTimeout(() => {
        if (activePlayer === player) stopStorySfx();
      }, testDurationMs);
    }

    return true;
  } catch (error) {
    console.warn('Story SFX playback failed.', name, error);
    stopStorySfx();
    return false;
  }
}

if (typeof window !== 'undefined') {
  const prime = () => { void unlockStorySfx(); };
  window.addEventListener('pointerdown', prime, { once: true, capture: true });
  window.addEventListener('touchstart', prime, { once: true, capture: true, passive: true });
}
