(() => {
  'use strict';

  const synth = window.speechSynthesis;
  if (!synth || synth.__speakUpAudioEngineInstalled) return;
  synth.__speakUpAudioEngineInstalled = true;

  const originalSpeak = synth.speak.bind(synth);
  const originalCancel = synth.cancel.bind(synth);
  let voices = [];
  let lastKey = '';
  let lastAt = 0;
  let portugueseTimer = 0;

  const preferredNames = ['Google', 'Microsoft', 'Natural', 'Online', 'Premium'];
  const commonEnglishWords = new Set([
    'a','an','and','are','as','at','be','but','by','for','from','he','her','his','i','in','is','it','its','my','not','of','on','or','our','she','so','that','the','their','there','they','this','to','was','we','were','with','you','your'
  ]);

  function refreshVoices() {
    voices = synth.getVoices() || [];
  }

  function normalizeLanguage(value) {
    const raw = String(value || '').trim().toLowerCase().replace(/_/g, '-');
    if (!raw) return '';
    if (raw === 'pt' || raw === 'portuguese' || raw === 'português' || raw === 'portugues') return 'pt-PT';
    if (raw === 'en' || raw === 'english') return 'en-GB';
    return raw;
  }

  function languageMatches(voiceLang, requestedLang) {
    const voice = String(voiceLang || '').toLowerCase();
    const requested = String(requestedLang || '').toLowerCase();
    return Boolean(voice && requested && (voice === requested || voice.split('-')[0] === requested.split('-')[0]));
  }

  function bestVoice(lang, currentVoice = null) {
    refreshVoices();
    if (!voices.length || !lang) return currentVoice;
    if (currentVoice && languageMatches(currentVoice.lang, lang)) return currentVoice;

    const normalized = lang.toLowerCase();
    const base = normalized.split('-')[0];
    const exact = voices.filter(voice => String(voice.lang || '').toLowerCase() === normalized);
    const sameLanguage = voices.filter(voice => String(voice.lang || '').toLowerCase().split('-')[0] === base);
    const preferred = list => list.find(voice => preferredNames.some(name => String(voice.name || '').includes(name)));
    return preferred(exact) || exact[0] || preferred(sameLanguage) || sameLanguage[0] || currentVoice;
  }

  function looksLikeEnglishNarration(text) {
    const words = String(text || '').toLowerCase().match(/[a-z']+/g) || [];
    if (words.length < 6) return false;
    const matches = words.filter(word => commonEnglishWords.has(word)).length;
    return matches >= 2 && matches / words.length >= 0.12;
  }

  function completionPhaseVisible() {
    const text = String(document.body?.innerText || '').toLowerCase();
    return text.includes('listening to the completed block')
      || text.includes('listen to the complete block')
      || text.includes('stay on this text until the final sentence has finished')
      || text.includes('the missing words are included');
  }

  function finishSilently(utterance) {
    queueMicrotask(() => {
      try {
        utterance?.onend?.({ type: 'end', utterance });
      } catch (_) {}
    });
  }

  function duplicate(text, lang) {
    const key = `${lang}|${String(text || '').trim().toLowerCase()}`;
    const now = Date.now();
    const repeated = key === lastKey && now - lastAt < 1800;
    lastKey = key;
    lastAt = now;
    return repeated;
  }

  function copyCallbacks(source, target) {
    ['onstart', 'onend', 'onerror', 'onpause', 'onresume', 'onmark', 'onboundary'].forEach(name => {
      try { target[name] = source[name]; } catch (_) {}
    });
  }

  synth.addEventListener?.('voiceschanged', refreshVoices);
  refreshVoices();

  synth.speak = utterance => {
    try {
      if (!utterance) return originalSpeak(utterance);

      const override = window.__speakUpPortugueseOverride;
      if (override && !override.consumed && override.expires > Date.now() && override.text) {
        override.consumed = true;
        clearTimeout(portugueseTimer);
        originalCancel();

        const replacement = new SpeechSynthesisUtterance(String(override.text));
        replacement.lang = 'pt-PT';
        replacement.voice = bestVoice('pt-PT');
        replacement.rate = 0.86;
        replacement.pitch = 1;
        replacement.volume = Number.isFinite(utterance.volume) ? utterance.volume : 1;
        copyCallbacks(utterance, replacement);

        portugueseTimer = window.setTimeout(() => originalSpeak(replacement), 180);
        return;
      }

      const text = String(utterance.text || '').trim();
      let lang = normalizeLanguage(utterance.lang);

      if (completionPhaseVisible() || window.__speakUpSuppressCompletedBlock) {
        finishSilently(utterance);
        return;
      }

      if (lang.startsWith('pt') && looksLikeEnglishNarration(text)) lang = 'en-GB';
      if (!lang && looksLikeEnglishNarration(text)) lang = 'en-GB';

      if (duplicate(text, lang)) {
        finishSilently(utterance);
        return;
      }

      if (lang) {
        utterance.lang = lang;
        const voice = bestVoice(lang, utterance.voice);
        if (voice) utterance.voice = voice;
      }

      if (lang.startsWith('pt')) {
        utterance.rate = 0.86;
      } else if (lang.startsWith('en')) {
        utterance.rate = 1;
      }
    } catch (error) {
      console.warn('SpeakUP audio engine fallback:', error);
    }

    return originalSpeak(utterance);
  };
})();
