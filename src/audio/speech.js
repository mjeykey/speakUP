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

export function speakWithWordHighlight({ text, language = 'pt-PT', rate = 0.48, enabled = true, onWord }) {
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
      ? Math.min(adjustedRate(language, rate, 0.48), 0.48)
      : adjustedRate(language, rate, 0.48);
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
    let lastHighlightAt = 0;
    let pendingTimer = 0;
    const isSlowPortuguese = String(language || '').toLowerCase().startsWith('pt') && utterance.rate <= 0.5;
    const minimumLightTime = isSlowPortuguese ? 620 : Math.max(280, 300 / utterance.rate);
    const fallbackWordDelay = isSlowPortuguese ? 760 : Math.max(340, 470 / utterance.rate);

    const showWord = index => {
      if (finished || index < 0 || index >= words.length || index === activeIndex) return;
      activeIndex = index;
      lastHighlightAt = performance.now();
      onWord?.(index);
    };

    const requestWord = index => {
      if (finished || index < 0 || index >= words.length || index <= activeIndex) return;
      const elapsed = performance.now() - lastHighlightAt;
      const wait = Math.max(0, minimumLightTime - elapsed);
      window.clearTimeout(pendingTimer);
      pendingTimer = window.setTimeout(() => showWord(index), wait);
    };

    utterance.onstart = () => showWord(0);
    utterance.onboundary = event => {
      if (typeof event.charIndex !== 'number') return;
      let index = 0;
      for (let i = 0; i < starts.length; i += 1) {
        if (starts[i] <= event.charIndex) index = i;
        else break;
      }
      requestWord(index);
    };

    const fallbackTimer = window.setInterval(() => {
      if (finished || activeIndex >= words.length - 1) return;
      if (performance.now() - lastHighlightAt >= fallbackWordDelay) {
        requestWord(activeIndex + 1);
      }
    }, 100);

    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearInterval(fallbackTimer);
      window.clearTimeout(pendingTimer);

      const remaining = [];
      for (let index = activeIndex + 1; index < words.length; index += 1) remaining.push(index);
      const showRemaining = () => {
        const index = remaining.shift();
        if (index === undefined) {
          window.setTimeout(() => {
            onWord?.(-1);
            resolve();
          }, minimumLightTime);
          return;
        }
        onWord?.(index);
        window.setTimeout(showRemaining, minimumLightTime);
      };
      showRemaining();
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
