const synth = window.speechSynthesis;
let speechRunId = 0;
let voicesReadyPromise = null;

function availableVoices() {
  return synth?.getVoices?.() || [];
}

function waitForVoices(timeout = 1500) {
  const currentVoices = availableVoices();
  if (currentVoices.length || !synth) return Promise.resolve(currentVoices);
  if (voicesReadyPromise) return voicesReadyPromise;

  voicesReadyPromise = new Promise(resolve => {
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      synth.removeEventListener?.('voiceschanged', handleVoicesChanged);
      resolve(availableVoices());
    };

    const handleVoicesChanged = () => {
      if (availableVoices().length) finish();
    };

    synth.addEventListener?.('voiceschanged', handleVoicesChanged);
    window.setTimeout(finish, timeout);
  }).finally(() => {
    voicesReadyPromise = null;
  });

  return voicesReadyPromise;
}

function pickVoice(language) {
  const requested = String(language || '').toLowerCase();
  const base = requested.split('-')[0];
  const voices = availableVoices();
  const sameLanguageVoices = voices.filter(
    voice => String(voice.lang || '').toLowerCase().split('-')[0] === base
  );

  return sameLanguageVoices.find(
    voice => String(voice.lang || '').toLowerCase() === requested
  ) || sameLanguageVoices[0] || null;
}

function adjustedRate(language, requestedRate, fallbackRate = 0.82) {
  const value = Number.isFinite(Number(requestedRate)) ? Number(requestedRate) : fallbackRate;
  return String(language || '').toLowerCase().startsWith('pt')
    ? Math.min(value, 0.62)
    : value;
}

function sleep(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

function punctuationPause(text) {
  const ending = String(text || '').trim().slice(-1);
  if (ending === ',') return 200;
  if (ending === '.') return 600;
  if (ending === '?' || ending === '!') return 650;
  if (ending === ';' || ending === ':') return 350;
  return 0;
}

function splitSpeechSegments(text) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  return value.match(/[^,.;:!?]+[,.;:!?]?/g)?.map(segment => segment.trim()).filter(Boolean) || [];
}

function createUtterance(text, language, rate, pitch = 1) {
  const requestedLanguage = String(language || 'en-GB');
  const voice = pickVoice(requestedLanguage);
  const isFrench = requestedLanguage.toLowerCase().startsWith('fr');

  // Never let the browser pronounce French with a Portuguese or generic default voice.
  if (isFrench && !voice) return null;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang || requestedLanguage;
  utterance.rate = rate;
  utterance.pitch = pitch;
  if (voice) utterance.voice = voice;
  return utterance;
}

function playUtterance(utterance, runId, onBoundary) {
  return new Promise(resolve => {
    if (!synth || !utterance || runId !== speechRunId) {
      resolve(false);
      return;
    }
    if (onBoundary) utterance.onboundary = onBoundary;
    utterance.onend = () => resolve(runId === speechRunId);
    utterance.onerror = () => resolve(runId === speechRunId);
    window.setTimeout(() => {
      if (runId !== speechRunId) {
        resolve(false);
        return;
      }
      synth.speak(utterance);
    }, 40);
  });
}

export function stopSpeech() {
  speechRunId += 1;
  synth?.cancel?.();
}

export function speak(textOrRequest, language, options = {}) {
  const request = textOrRequest && typeof textOrRequest === 'object'
    ? textOrRequest
    : { text: textOrRequest, language, ...options };

  const value = String(request.text || '').replace(/\s+/g, ' ').trim();
  const selectedLanguage = request.language || language || 'en-GB';
  const enabled = request.enabled ?? options.enabled;

  if (!value || !synth || enabled === false) return Promise.resolve();

  stopSpeech();
  const runId = speechRunId;
  const rate = adjustedRate(selectedLanguage, request.rate ?? options.rate);
  const pitch = request.pitch ?? options.pitch ?? 1;
  const segments = splitSpeechSegments(value);

  return (async () => {
    await waitForVoices();
    if (runId !== speechRunId) return;

    for (const segment of segments) {
      if (runId !== speechRunId) return;
      const utterance = createUtterance(segment, selectedLanguage, rate, pitch);
      if (!utterance) return;
      const completed = await playUtterance(utterance, runId);
      if (!completed || runId !== speechRunId) return;
      const pause = punctuationPause(segment);
      if (pause) await sleep(pause);
    }
  })();
}

export function speakWithWordHighlight({ text, language = 'pt-PT', rate = 0.48, enabled = true, onWord }) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (!value || !synth || enabled === false) return Promise.resolve();

  stopSpeech();
  const runId = speechRunId;
  const selectedRate = String(language || '').toLowerCase().startsWith('pt')
    ? Math.min(adjustedRate(language, rate, 0.48), 0.48)
    : adjustedRate(language, rate, 0.48);
  const isSlowPortuguese = String(language || '').toLowerCase().startsWith('pt') && selectedRate <= 0.5;
  const minimumLightTime = isSlowPortuguese ? 490 : Math.max(280, 300 / selectedRate);
  const fallbackWordDelay = isSlowPortuguese ? 600 : Math.max(340, 470 / selectedRate);
  const segments = splitSpeechSegments(value);

  return (async () => {
    await waitForVoices();
    if (runId !== speechRunId) return;

    let globalWordIndex = 0;

    for (const segment of segments) {
      if (runId !== speechRunId) return;

      const segmentWords = segment.match(/\S+/g) || [];
      const wordStarts = [];
      segment.replace(/\S+/g, (word, offset) => {
        wordStarts.push(offset);
        return word;
      });

      let localActive = -1;
      let lastHighlightAt = 0;
      let pendingTimer = 0;
      let segmentFinished = false;

      const showLocalWord = localIndex => {
        if (segmentFinished || runId !== speechRunId || localIndex < 0 || localIndex >= segmentWords.length || localIndex === localActive) return;
        localActive = localIndex;
        lastHighlightAt = performance.now();
        onWord?.(globalWordIndex + localIndex);
      };

      const requestLocalWord = localIndex => {
        if (segmentFinished || localIndex <= localActive || localIndex >= segmentWords.length) return;
        const elapsed = performance.now() - lastHighlightAt;
        const wait = Math.max(0, minimumLightTime - elapsed);
        window.clearTimeout(pendingTimer);
        pendingTimer = window.setTimeout(() => showLocalWord(localIndex), wait);
      };

      const utterance = createUtterance(segment, language, selectedRate);
      if (!utterance) return;
      utterance.onstart = () => showLocalWord(0);

      const fallbackTimer = window.setInterval(() => {
        if (segmentFinished || runId !== speechRunId || localActive >= segmentWords.length - 1) return;
        if (performance.now() - lastHighlightAt >= fallbackWordDelay) requestLocalWord(localActive + 1);
      }, 90);

      const completed = await playUtterance(utterance, runId, event => {
        if (typeof event.charIndex !== 'number') return;
        let localIndex = 0;
        for (let index = 0; index < wordStarts.length; index += 1) {
          if (wordStarts[index] <= event.charIndex) localIndex = index;
          else break;
        }
        requestLocalWord(localIndex);
      });

      segmentFinished = true;
      window.clearInterval(fallbackTimer);
      window.clearTimeout(pendingTimer);
      if (!completed || runId !== speechRunId) return;

      for (let index = localActive + 1; index < segmentWords.length; index += 1) {
        onWord?.(globalWordIndex + index);
        await sleep(minimumLightTime);
        if (runId !== speechRunId) return;
      }

      globalWordIndex += segmentWords.length;
      const pause = punctuationPause(segment);
      if (pause) await sleep(pause);
    }

    if (runId === speechRunId) onWord?.(-1);
  })();
}

export async function speakPair(first, second, options = {}) {
  await speak({ ...first, enabled: first.enabled ?? options.enabled });
  await sleep(options.pause ?? 320);
  await speak({ ...second, enabled: second.enabled ?? options.enabled });
}
