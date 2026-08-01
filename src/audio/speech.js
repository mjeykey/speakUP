const synth = window.speechSynthesis;

function pickVoice(language) {
  const requested = String(language || '').toLowerCase();
  const base = requested.split('-')[0];
  const voices = synth?.getVoices?.() || [];
  return voices.find(voice => String(voice.lang || '').toLowerCase() === requested)
    || voices.find(voice => String(voice.lang || '').toLowerCase().startsWith(base))
    || null;
}

export function stopSpeech() {
  synth?.cancel?.();
}

export function speak(text, language, options = {}) {
  return new Promise(resolve => {
    const value = String(text || '').replace(/\s+/g, ' ').trim();
    if (!value || !synth || options.enabled === false) {
      resolve();
      return;
    }

    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = language;
    utterance.rate = options.rate ?? 0.82;
    utterance.pitch = options.pitch ?? 1;
    const voice = pickVoice(language);
    if (voice) utterance.voice = voice;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.setTimeout(() => synth.speak(utterance), 40);
  });
}

export async function speakPair(first, second, options = {}) {
  await speak(first.text, first.language, { ...options, rate: first.rate ?? options.rate });
  await new Promise(resolve => window.setTimeout(resolve, options.pause ?? 320));
  await speak(second.text, second.language, { ...options, rate: second.rate ?? options.rate });
}
