import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let ambienceAudio = null;
let ambienceName = '';
let rainUrl = '';
let rainPromise = null;
const RAIN_B64_URL = new URL('../../assets/audio/rain-loop.mp3.b64', import.meta.url).href;

function staticSource(name) {
  if (!name || name === 'none') return '';
  return STORY_SFX_ASSETS[name] || '';
}

function base64ToBlobUrl(base64) {
  const clean = String(base64 || '').replace(/\s+/g, '');
  if (!clean) throw new Error('Rain asset is empty');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }));
}

export function preloadStoryAmbience(name = 'rain') {
  if (name !== 'rain') return Promise.resolve(Boolean(staticSource(name)));
  if (rainUrl) return Promise.resolve(true);
  if (!rainPromise) {
    rainPromise = fetch(RAIN_B64_URL, { cache: 'force-cache' })
      .then(response => {
        if (!response.ok) throw new Error(`Rain HTTP ${response.status}`);
        return response.text();
      })
      .then(text => {
        rainUrl = base64ToBlobUrl(text);
        return true;
      })
      .catch(error => {
        console.warn('Rain ambience failed to load.', error);
        rainPromise = null;
        return false;
      });
  }
  return rainPromise;
}

export function isStoryAmbienceReady(name = 'rain') {
  return name === 'rain' ? Boolean(rainUrl) : Boolean(staticSource(name));
}

export function isStoryAmbiencePlaying(name) {
  return Boolean(ambienceAudio && !ambienceAudio.paused && (!name || ambienceName === name));
}

export function stopStoryAmbience() {
  if (!ambienceAudio) return;
  try {
    ambienceAudio.pause();
    ambienceAudio.currentTime = 0;
  } catch (_) {}
  ambienceAudio = null;
  ambienceName = '';
}

export function startStoryAmbience(name, { enabled = true, loop, volume } = {}) {
  if (!enabled || !name || name === 'none') return Promise.resolve(false);
  if (isStoryAmbiencePlaying(name)) return Promise.resolve(true);

  const src = name === 'rain' ? rainUrl : staticSource(name);
  if (!src) return Promise.resolve(false);

  stopStoryAmbience();

  const audio = document.createElement('audio');
  audio.src = src;
  audio.preload = 'auto';
  audio.loop = loop ?? (name === 'rain');
  audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : (name === 'rain' ? 0.24 : 0.42);
  audio.setAttribute('playsinline', '');
  ambienceAudio = audio;
  ambienceName = name;

  const result = audio.play();
  if (result && typeof result.then === 'function') {
    return result.then(() => true).catch(error => {
      console.warn('Story ambience playback failed.', name, error);
      if (ambienceAudio === audio) {
        ambienceAudio = null;
        ambienceName = '';
      }
      return false;
    });
  }
  return Promise.resolve(true);
}

void preloadStoryAmbience('rain');
