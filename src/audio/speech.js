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

export function speak(textOrRequest, language, options = {}) {
  return new Promise(resolve => {
    const request = textOrRequest && typeof textOrRequest === 'object'
      ? textOrRequest
      : { text: textOrRequest, language, ...options };

    const value = String(request.text || '').replace(/\s+/g, ' ').trim();
    const selectedLanguage = request.language || language || 'en-GB';
    const enabled = request.enabled ?? options.enabled;

    if (!value || !synth || enabled === false) {
      resolve();
      return;
    }

    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = selectedLanguage;
    utterance.rate = request.rate ?? options.rate ?? 0.82;
    utterance.pitch = request.pitch ?? options.pitch ?? 1;
    const voice = pickVoice(selectedLanguage);
    if (voice) utterance.voice = voice;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.setTimeout(() => synth.speak(utterance), 40);
  });
}

export function speakWithWordHighlight({ text, language = 'pt-PT', rate = 0.72, enabled = true, onWord }) {
  return new Promise(resolve => {
    const value = String(text || '').replace(/\s+/g, ' ').trim();
    if (!value || !synth || enabled === false) {
      resolve();
      return;
    }

    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = language;
    utterance.rate = rate;
    const voice = pickVoice(language);
    if (voice) utterance.voice = voice;

    const starts = [];
    value.replace(/\S+/g, (word, offset) => {
      starts.push(offset);
      return word;
    });

    utterance.onboundary = event => {
      if (event.name !== 'word' && typeof event.charIndex !== 'number') return;
      let index = 0;
      for (let i = 0; i < starts.length; i += 1) {
        if (starts[i] <= event.charIndex) index = i;
        else break;
      }
      onWord?.(index);
    };
    utterance.onend = () => {
      onWord?.(-1);
      resolve();
    };
    utterance.onerror = () => {
      onWord?.(-1);
      resolve();
    };
    window.setTimeout(() => synth.speak(utterance), 40);
  });
}

export async function speakPair(first, second, options = {}) {
  await speak({ ...first, enabled: first.enabled ?? options.enabled });
  await new Promise(resolve => window.setTimeout(resolve, options.pause ?? 320));
  await speak({ ...second, enabled: second.enabled ?? options.enabled });
}
