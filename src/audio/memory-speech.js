import { stopSpeech } from './speech.js?v=59';

const synth = window.speechSynthesis;

function pickVoice(language) {
  const requested = String(language || '').toLowerCase();
  const base = requested.split('-')[0];
  const voices = synth?.getVoices?.() || [];
  return voices.find(voice => String(voice.lang || '').toLowerCase() === requested)
    || voices.find(voice => String(voice.lang || '').toLowerCase().startsWith(base))
    || null;
}

export function speakMemorySentence(text, language, { enabled = true, rate = 0.78 } = {}) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (!value || !synth || enabled === false) return Promise.resolve();

  stopSpeech();

  return new Promise(resolve => {
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = language || 'en-GB';
    utterance.rate = String(language || '').startsWith('pt') ? Math.min(rate, 0.62) : rate;
    utterance.pitch = 1;
    const voice = pickVoice(language);
    if (voice) utterance.voice = voice;

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    synth.resume?.();
    synth.speak(utterance);
  });
}
