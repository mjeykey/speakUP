import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let activeName = '';
let rainAudio = null;
let bellAudio = null;
let bellBlobUrl = '';
let bellPreparePromise = null;
let doorAudio = null;
let doorBlobUrl = '';
let doorPreparePromise = null;
let doorAudioContext = null;
let doorSourceNode = null;
let doorGainNode = null;
let stopTimer = 0;
let bellStatus = { state: 'idle', detail: '' };

const RAIN_MP3_URL = 'https://raw.githubusercontent.com/smithcol11/vr-class-horror-game/04a6aeb5b51ae98c1579c166d7fd42e24c88950d/sounds/rain-on-roof-or-window-nature-sounds-8312.mp3';
const BELL_MP3_URL = new URL('../../assets/audio/soundreality-tsar-bell-sound-simulation-292699.mp3?v=969c6cd233d57223-clean4', import.meta.url).href;
const DOOR_DATA_URL = STORY_SFX_ASSETS['door-creak'] || '';
const DOOR_SIGNAL_GAIN = 25;

function setBellStatus(state, detail = '') {
  bellStatus = { state, detail };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('speakup-bell-status', { detail: bellStatus }));
  }
}

export function getStorySfxStatus() {
  const audio = bellAudio;
  return {
    ...bellStatus,
    src: BELL_MP3_URL,
    paused: audio ? audio.paused : null,
    readyState: audio ? audio.readyState : null,
    networkState: audio ? audio.networkState : null,
    currentTime: audio ? audio.currentTime : null,
    errorCode: audio?.error?.code || null
  };
}

export function setStorySfxVolume(name, volume) {
  const normalized = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : null;
  if (normalized === null) return false;
  if (name === 'bell' && bellAudio) {
    bellAudio.volume = normalized;
    return true;
  }
  if (name === 'door-creak' && doorAudio) {
    doorAudio.volume = normalized;
    return true;
  }
  if (name === 'rain' && rainAudio) {
    rainAudio.volume = normalized;
    return true;
  }
  if (activeAudio && activeName === name) {
    activeAudio.volume = normalized;
    return true;
  }
  return false;
}

function staticSource(name) {
  if (!name || name === 'none' || name === 'bell' || name === 'warning-bell' || name === 'rain' || name === 'door-creak') return '';
  return STORY_SFX_ASSETS[name] || '';
}

function ensureBellAudio() {
  if (bellAudio && bellAudio.isConnected) return bellAudio;
  const audio = document.createElement('audio');
  audio.setAttribute('playsinline', '');
  audio.preload = 'auto';
  audio.loop = false;
  audio.volume = 0.90;
  audio.style.position = 'fixed';
  audio.style.width = '1px';
  audio.style.height = '1px';
  audio.style.opacity = '0';
  audio.style.pointerEvents = 'none';
  audio.style.left = '-9999px';
  audio.oncanplay = () => setBellStatus('ready', `readyState=${audio.readyState}`);
  audio.onerror = () => setBellStatus('media-error', `code=${audio.error?.code || 'unknown'} readyState=${audio.readyState} networkState=${audio.networkState}`);
  document.body.appendChild(audio);
  bellAudio = audio;
  setBellStatus('created', `readyState=${audio.readyState}`);
  return audio;
}

function ensureDoorAmplifier(audio) {
  if (!audio || typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!doorAudioContext || doorAudioContext.state === 'closed') {
    doorAudioContext = new AudioContextClass({ latencyHint: 'interactive' });
    doorSourceNode = null;
    doorGainNode = null;
  }
  if (!doorSourceNode) {
    doorSourceNode = doorAudioContext.createMediaElementSource(audio);
    doorGainNode = doorAudioContext.createGain();
    doorGainNode.gain.value = DOOR_SIGNAL_GAIN;
    doorSourceNode.connect(doorGainNode);
    doorGainNode.connect(doorAudioContext.destination);
  }
  return { context: doorAudioContext, gain: doorGainNode };
}

function ensureDoorAudio() {
  if (doorAudio && doorAudio.isConnected) return doorAudio;
  if (!DOOR_DATA_URL) return null;
  const audio = document.createElement('audio');
  audio.setAttribute('playsinline', '');
  audio.preload = 'auto';
  audio.loop = false;
  audio.volume = 0.95;
  audio.style.position = 'fixed';
  audio.style.width = '1px';
  audio.style.height = '1px';
  audio.style.opacity = '0';
  audio.style.pointerEvents = 'none';
  audio.style.left = '-9999px';
  document.body.appendChild(audio);
  doorAudio = audio;
  try { ensureDoorAmplifier(audio); } catch (error) { console.warn('Door amplifier setup failed.', error); }
  return audio;
}

function waitForCanPlay(audio, timeoutMs = 12000) {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve(true);
  return new Promise(resolve => {
    let settled = false;
    const finish = value => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      audio.removeEventListener('canplay', onReady);
      audio.removeEventListener('loadeddata', onLoaded);
      audio.removeEventListener('error', onError);
      resolve(value);
    };
    const onReady = () => finish(true);
    const onLoaded = () => {
      if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) finish(true);
    };
    const onError = () => finish(false);
    const timer = setTimeout(() => finish(audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA), timeoutMs);
    audio.addEventListener('canplay', onReady, { once: true });
    audio.addEventListener('loadeddata', onLoaded, { once: true });
    audio.addEventListener('error', onError, { once: true });
  });
}

async function prepareBellAudio() {
  const audio = ensureBellAudio();
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return true;
  if (bellPreparePromise) return bellPreparePromise;

  bellPreparePromise = (async () => {
    try {
      setBellStatus('fetching', 'loading exact uploaded MP3');
      const response = await fetch(BELL_MP3_URL, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      setBellStatus('fetched', `${blob.size} bytes`);
      if (bellBlobUrl) URL.revokeObjectURL(bellBlobUrl);
      bellBlobUrl = URL.createObjectURL(blob);
      audio.src = bellBlobUrl;
      audio.load();
      setBellStatus('loading-media', `readyState=${audio.readyState}`);
      const ready = await waitForCanPlay(audio);
      if (!ready) {
        setBellStatus('not-ready', `readyState=${audio.readyState} networkState=${audio.networkState}`);
        return false;
      }
      setBellStatus('ready', `readyState=${audio.readyState} · ${blob.size} bytes`);
      return true;
    } catch (error) {
      setBellStatus('prepare-error', `${error?.name || 'Error'}: ${error?.message || String(error)}`);
      console.warn('Tsar bell preparation failed.', error);
      return false;
    } finally {
      bellPreparePromise = null;
    }
  })();

  return bellPreparePromise;
}

async function prepareDoorAudio() {
  const audio = ensureDoorAudio();
  if (!audio) return false;
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return true;
  if (doorPreparePromise) return doorPreparePromise;

  doorPreparePromise = (async () => {
    try {
      const response = await fetch(DOOR_DATA_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      if (!blob.size) throw new Error('Empty door audio');
      if (doorBlobUrl) URL.revokeObjectURL(doorBlobUrl);
      doorBlobUrl = URL.createObjectURL(blob);
      audio.src = doorBlobUrl;
      audio.load();
      return await waitForCanPlay(audio);
    } catch (error) {
      console.warn('Original door creak preparation failed.', error);
      return false;
    } finally {
      doorPreparePromise = null;
    }
  })();

  return doorPreparePromise;
}

function stopBell() {
  if (!bellAudio) return;
  try { bellAudio.pause(); } catch (_) {}
  try { bellAudio.currentTime = 0; } catch (_) {}
}

function stopDoor() {
  if (!doorAudio) return;
  try { doorAudio.pause(); } catch (_) {}
  try { doorAudio.currentTime = 0; } catch (_) {}
}

async function playBell(volume = 0.90) {
  const audio = ensureBellAudio();
  try {
    if (audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) await prepareBellAudio();
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.90;
    setBellStatus('play-request', `readyState=${audio.readyState} networkState=${audio.networkState}`);
    return Promise.resolve(audio.play()).then(() => {
      setBellStatus('playing', `readyState=${audio.readyState}`);
      return true;
    }).catch(error => {
      setBellStatus('blocked', `${error?.name || 'Error'}: ${error?.message || String(error)}`);
      console.warn('Tsar bell playback failed.', error);
      return false;
    });
  } catch (error) {
    setBellStatus('exception', `${error?.name || 'Error'}: ${error?.message || String(error)}`);
    console.warn('Tsar bell playback failed.', error);
    return false;
  }
}

async function playDoor(volume = 0.95) {
  const audio = ensureDoorAudio();
  if (!audio) return false;
  try {
    if (audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) await prepareDoorAudio();
    const amplifier = ensureDoorAmplifier(audio);
    if (amplifier) {
      amplifier.gain.gain.value = DOOR_SIGNAL_GAIN;
      if (amplifier.context.state === 'suspended') {
        try { await amplifier.context.resume(); } catch (_) {}
      }
    }
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.95;
    return Promise.resolve(audio.play()).then(() => true).catch(error => {
      console.warn('Original door creak playback failed.', error);
      return false;
    });
  } catch (error) {
    console.warn('Original door creak playback failed.', error);
    return false;
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
  if (name === 'door-creak') return doorBlobUrl || DOOR_DATA_URL;
  if (name === 'warning-bell') return '';
  return staticSource(name);
}

export function isStorySfxReady(name) {
  if (name === 'bell') return Boolean(bellAudio && bellAudio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA);
  if (name === 'door-creak') return Boolean(doorAudio && doorAudio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA);
  if (name === 'rain' || name === 'warning-bell') return true;
  return Boolean(staticSource(name));
}

export function isStorySfxPlaying(name) {
  if (name === 'bell') return Boolean(bellAudio && !bellAudio.paused && !bellAudio.ended && !bellAudio.muted);
  if (name === 'door-creak') return Boolean(doorAudio && !doorAudio.paused && !doorAudio.ended && !doorAudio.muted);
  if (name === 'rain') return Boolean(rainAudio && !rainAudio.paused && !rainAudio.ended);
  if (name === 'warning-bell') return false;
  return Boolean(activeAudio && !activeAudio.paused && activeName === name);
}

export async function preloadStorySfx(name) {
  if (name === 'bell') return prepareBellAudio();
  if (name === 'door-creak') return prepareDoorAudio();
  if (name === 'rain' || name === 'warning-bell') return true;
  return Boolean(staticSource(name));
}

export function stopStorySfx() {
  clearTimeout(stopTimer);
  stopTimer = 0;
  stopGeneric();
  stopRain();
  stopBell();
  stopDoor();
}

export async function unlockStorySfx() {
  const results = await Promise.allSettled([prepareBellAudio(), prepareDoorAudio()]);
  const amplifier = doorAudio ? ensureDoorAmplifier(doorAudio) : null;
  if (amplifier?.context?.state === 'suspended') {
    try { await amplifier.context.resume(); } catch (_) {}
  }
  return results.some(result => result.status === 'fulfilled' && result.value);
}

export function playStorySfx(name, { enabled = true, loop = false, volume, testDurationMs = 0 } = {}) {
  if (!enabled || !name || name === 'none') return Promise.resolve(false);
  if (name === 'warning-bell') return Promise.resolve(false);
  if (name === 'bell') return playBell(volume);
  if (name === 'rain') return playRain(volume, loop);
  if (name === 'door-creak') return playDoor(volume);

  const result = playGeneric(name, volume, loop);
  if (testDurationMs > 0) {
    clearTimeout(stopTimer);
    stopTimer = window.setTimeout(() => stopStorySfx(), testDurationMs);
  }
  return result;
}
