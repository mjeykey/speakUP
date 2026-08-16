const synth = window.speechSynthesis;
let speechRunId = 0;

const isMobileSpeechDevice = (() => {
  const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
  const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  return Boolean(coarsePointer || mobileUserAgent);
})();

let desktopVoices = [];

function refreshDesktopVoices() {
  desktopVoices = synth?.getVoices?.() || [];
  return desktopVoices;
}

if (synth) {
  refreshDesktopVoices();
  synth.addEventListener?.('voiceschanged', refreshDesktopVoices);
}

function availableVoices() { return synth?.getVoices?.() || []; }

async function ensureVoices(runId, timeoutMs = 900) {
  if (!synth || runId !== speechRunId) return [];
  let voices = availableVoices();
  if (voices.length) { desktopVoices = voices; return voices; }
  await new Promise(resolve => {
    let finished = false;
    const finish = () => { if (finished) return; finished = true; synth?.removeEventListener?.('voiceschanged', onVoicesChanged); window.clearTimeout(timer); resolve(); };
    const onVoicesChanged = () => finish();
    const timer = window.setTimeout(finish, timeoutMs);
    synth?.addEventListener?.('voiceschanged', onVoicesChanged);
  });
  if (runId !== speechRunId) return [];
  voices = availableVoices();
  if (voices.length) desktopVoices = voices;
  return voices;
}

function findLanguageVoice(language, voices) {
  const requested = String(language || '').toLowerCase();
  const base = requested.split('-')[0];
  const list = voices || [];
  return list.find(voice => String(voice.lang || '').toLowerCase() === requested)
    || list.find(voice => { const voiceLanguage = String(voice.lang || '').toLowerCase(); return voiceLanguage === base || voiceLanguage.startsWith(`${base}-`); })
    || null;
}

function pickVoice(language) {
  return findLanguageVoice(language, isMobileSpeechDevice ? availableVoices() : (desktopVoices.length ? desktopVoices : refreshDesktopVoices()));
}

function adjustedRate(language, requestedRate, fallbackRate = 0.82) {
  const value = Number.isFinite(Number(requestedRate)) ? Number(requestedRate) : fallbackRate;
  return String(language || '').toLowerCase().startsWith('pt') ? Math.min(value, 0.62) : value;
}

function sleep(ms) { return new Promise(resolve => window.setTimeout(resolve, ms)); }

function punctuationPause(text) {
  const ending = String(text || '').trim().slice(-1);
  if (ending === ',') return 90;
  if (ending === '.') return 220;
  if (ending === '?' || ending === '!') return 260;
  if (ending === ';' || ending === ':') return 140;
  return 0;
}

function splitSpeechSegments(text) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  return value.match(/[^,.;:!?]+[,.;:!?]?/g)?.map(segment => segment.trim()).filter(Boolean) || [];
}

function createUtterance(text, language, rate, pitch = 1) {
  const voice = pickVoice(language);
  const isFrench = String(language || '').toLowerCase().startsWith('fr');
  if (!isMobileSpeechDevice && isFrench && !voice) return null;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language; utterance.rate = rate; utterance.pitch = pitch;
  if (voice) utterance.voice = voice;
  return utterance;
}

function playUtterance(utterance, runId, onBoundary) {
  return new Promise(resolve => {
    if (!synth || !utterance || runId !== speechRunId) return resolve(false);
    if (onBoundary) utterance.onboundary = onBoundary;
    utterance.onend = () => resolve(runId === speechRunId);
    utterance.onerror = () => resolve(runId === speechRunId);
    if (runId !== speechRunId) return resolve(false);
    synth.resume?.(); synth.speak(utterance);
  });
}

export function stopSpeech() { speechRunId += 1; synth?.cancel?.(); }

export function speak(textOrRequest, language, options = {}) {
  const request = textOrRequest && typeof textOrRequest === 'object' ? textOrRequest : { text: textOrRequest, language, ...options };
  const value = String(request.text || '').replace(/\s+/g, ' ').trim();
  const selectedLanguage = request.language || language || 'en-GB';
  const enabled = request.enabled ?? options.enabled;
  if (!value || !synth || enabled === false) return Promise.resolve();

  stopSpeech();
  const runId = speechRunId;
  const rate = adjustedRate(selectedLanguage, request.rate ?? options.rate);
  const pitch = request.pitch ?? options.pitch ?? 1;

  return (async () => {
    await ensureVoices(runId);
    if (runId !== speechRunId) return;
    if (isMobileSpeechDevice) { await sleep(20); if (runId !== speechRunId) return; synth.resume?.(); }

    // Story/default narration is deliberately one utterance. Browser TTS already
    // handles punctuation naturally; splitting every sentence created audible gaps.
    const utterance = createUtterance(value, selectedLanguage, rate, pitch);
    await playUtterance(utterance, runId);
  })();
}

export function speakWithWordHighlight({ text, language = 'pt-PT', rate = 0.48, enabled = true, onWord }) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (!value || !synth || enabled === false) return Promise.resolve();
  stopSpeech();
  const runId = speechRunId;
  const selectedRate = String(language || '').toLowerCase().startsWith('pt') ? Math.min(adjustedRate(language, rate, 0.48), 0.48) : adjustedRate(language, rate, 0.48);
  const isSlowPortuguese = String(language || '').toLowerCase().startsWith('pt') && selectedRate <= 0.5;
  const minimumLightTime = isSlowPortuguese ? 490 : Math.max(280, 300 / selectedRate);
  const fallbackWordDelay = isSlowPortuguese ? 600 : Math.max(340, 470 / selectedRate);
  const segments = splitSpeechSegments(value);

  return (async () => {
    await ensureVoices(runId); if (runId !== speechRunId) return;
    if (isMobileSpeechDevice) { await sleep(20); if (runId !== speechRunId) return; synth.resume?.(); }
    let globalWordIndex = 0;
    for (const segment of segments) {
      if (runId !== speechRunId) return;
      const segmentWords = segment.match(/\S+/g) || [];
      const wordStarts = [];
      segment.replace(/\S+/g, (word, offset) => { wordStarts.push(offset); return word; });
      let localActive = -1, lastHighlightAt = 0, pendingTimer = 0, segmentFinished = false;
      const showLocalWord = localIndex => { if (segmentFinished || runId !== speechRunId || localIndex < 0 || localIndex >= segmentWords.length || localIndex === localActive) return; localActive = localIndex; lastHighlightAt = performance.now(); onWord?.(globalWordIndex + localIndex); };
      const requestLocalWord = localIndex => { if (segmentFinished || localIndex <= localActive || localIndex >= segmentWords.length) return; const elapsed = performance.now() - lastHighlightAt; const wait = Math.max(0, minimumLightTime - elapsed); window.clearTimeout(pendingTimer); pendingTimer = window.setTimeout(() => showLocalWord(localIndex), wait); };
      const utterance = createUtterance(segment, language, selectedRate); if (!utterance) return;
      utterance.onstart = () => showLocalWord(0);
      const fallbackTimer = window.setInterval(() => { if (segmentFinished || runId !== speechRunId || localActive >= segmentWords.length - 1) return; if (performance.now() - lastHighlightAt >= fallbackWordDelay) requestLocalWord(localActive + 1); }, 90);
      const completed = await playUtterance(utterance, runId, event => { if (typeof event.charIndex !== 'number') return; let localIndex = 0; for (let index = 0; index < wordStarts.length; index += 1) { if (wordStarts[index] <= event.charIndex) localIndex = index; else break; } requestLocalWord(localIndex); });
      segmentFinished = true; window.clearInterval(fallbackTimer); window.clearTimeout(pendingTimer);
      if (!completed || runId !== speechRunId) return;
      for (let index = localActive + 1; index < segmentWords.length; index += 1) { onWord?.(globalWordIndex + index); await sleep(minimumLightTime); if (runId !== speechRunId) return; }
      globalWordIndex += segmentWords.length;
      const pause = punctuationPause(segment); if (pause) await sleep(pause);
    }
    if (runId === speechRunId) onWord?.(-1);
  })();
}

export async function speakPair(first, second, options = {}) {
  await speak({ ...first, enabled: first.enabled ?? options.enabled });
  await sleep(options.pause ?? 220);
  await speak({ ...second, enabled: second.enabled ?? options.enabled });
}
