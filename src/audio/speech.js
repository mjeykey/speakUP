const synth = window.speechSynthesis;

function pickVoice(language) {
  const requested = String(language || '').toLowerCase();
  const base = requested.split('-')[0];
  const voices = synth?.getVoices?.() || [];
  return voices.find(voice => String(voice.lang || '').toLowerCase() === requested)
    || voices.find(voice => String(voice.lang || '').toLowerCase().startsWith(base))
    || null;
}

function adjustedRate(language, requestedRate, fallbackRate = 0.82) {
  const value = Number.isFinite(Number(requestedRate)) ? Number(requestedRate) : fallbackRate;
  return String(language || '').toLowerCase().startsWith('pt')
    ? Math.min(value, 0.62)
    : value;
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
    utterance.rate = adjustedRate(selectedLanguage, request.rate ?? options.rate);
    utterance.pitch = request.pitch ?? options.pitch ?? 1;
    const voice = pickVoice(selectedLanguage);
    if (voice) utterance.voice = voice;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.setTimeout(() => synth.speak(utterance), 40);
  });
}

export function speakWithWordHighlight({ text, language = 'pt-PT', rate = 0.56, enabled = true, onWord }) {
  return new Promise(resolve => {
    const value = String(text || '').replace(/\s+/g, ' ').trim();
    if (!value || !synth || enabled === false) {
      resolve();
      return;
    }

    stopSpeech();
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = language;
    utterance.rate = String(language || '').toLowerCase().startsWith('pt')
      ? Math.min(adjustedRate(language, rate, 0.56), 0.56)
      : adjustedRate(language, rate, 0.56);
    const voice = pickVoice(language);
    if (voice) utterance.voice = voice;

    const starts = [];
    const words = [];
    value.replace(/\S+/g, (word, offset) => {
      starts.push(offset);
      words.push(word);
      return word;
    });

    let activeIndex = -1;
    let finished = false;
    let lastBoundaryAt = performance.now();
    const averageWordDelay = Math.max(340, 470 / utterance.rate);

    const highlight = index => {
      if (index < 0 || index >= words.length || index === activeIndex) return;
      activeIndex = index;
      lastBoundaryAt = performance.now();
      onWord?.(index);
    };

    utterance.onstart = () => highlight(0);
    utterance.onboundary = event => {
      if (typeof event.charIndex !== 'number') return;
      let index = 0;
      for (let i = 0; i < starts.length; i += 1) {
        if (starts[i] <= event.charIndex) index = i;
        else break;
      }

      if (index > activeIndex + 1) {
        let missing = activeIndex + 1;
        const advanceMissing = () => {
          if (finished || missing >= index) {
            highlight(index);
            return;
          }
          highlight(missing);
          missing += 1;
          window.setTimeout(advanceMissing, 110);
        };
        advanceMissing();
      } else {
        highlight(index);
      }
    };

    const fallbackTimer = window.setInterval(() => {
      if (finished || activeIndex >= words.length - 1) return;
      if (performance.now() - lastBoundaryAt >= averageWordDelay) {
        highlight(activeIndex + 1);
      }
    }, 100);

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearInterval(fallbackTimer);
      if (activeIndex < words.length - 1) {
        let index = activeIndex + 1;
        const showRemaining = () => {
          if (index >= words.length) {
            onWord?.(-1);
            resolve();
            return;
          }
          onWord?.(index);
          index += 1;
          window.setTimeout(showRemaining, 100);
        };
        showRemaining();
        return;
      }
      onWord?.(-1);
      resolve();
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    window.setTimeout(() => synth.speak(utterance), 40);
  });
}

export async function speakPair(first, second, options = {}) {
  await speak({ ...first, enabled: first.enabled ?? options.enabled });
  await new Promise(resolve => window.setTimeout(resolve, options.pause ?? 320));
  await speak({ ...second, enabled: second.enabled ?? options.enabled });
}
