let doorAudio = null;
const DOOR_SRC = new URL('../../assets/audio/door-creak-original-loud.mp3?v=5570c1b2', import.meta.url).href;

function ensureDoorAudio() {
  if (doorAudio && doorAudio.isConnected) return doorAudio;
  if (typeof document === 'undefined') return null;
  const audio = document.createElement('audio');
  audio.setAttribute('playsinline', '');
  audio.preload = 'auto';
  audio.loop = false;
  audio.src = DOOR_SRC;
  audio.volume = 1;
  audio.style.position = 'fixed';
  audio.style.width = '1px';
  audio.style.height = '1px';
  audio.style.opacity = '0';
  audio.style.pointerEvents = 'none';
  audio.style.left = '-9999px';
  document.body.appendChild(audio);
  doorAudio = audio;
  return audio;
}

export function playDoorCreak(volume = 1) {
  const audio = ensureDoorAudio();
  if (!audio) return Promise.resolve(false);
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 1;
    return Promise.resolve(audio.play()).then(() => true).catch(error => {
      console.warn('Real door creak playback failed.', error);
      return false;
    });
  } catch (error) {
    console.warn('Real door creak playback failed.', error);
    return Promise.resolve(false);
  }
}

export function isDoorCreakPlaying() {
  return Boolean(doorAudio && !doorAudio.paused && !doorAudio.ended && !doorAudio.muted);
}

export function stopDoorCreak() {
  if (!doorAudio) return;
  try { doorAudio.pause(); } catch (_) {}
  try { doorAudio.currentTime = 0; } catch (_) {}
}

export function unlockDoorCreak() {
  return Promise.resolve(Boolean(ensureDoorAudio()));
}
