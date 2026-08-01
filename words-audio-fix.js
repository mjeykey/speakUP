(() => {
  'use strict';

  const synth = window.speechSynthesis;
  if (!synth || synth.__speakUpWordsAudioFixInstalled) return;
  synth.__speakUpWordsAudioFixInstalled = true;

  const originalSpeak = synth.speak.bind(synth);
  const clean = value => String(value || '')
    .replace(/[.,!?;:…“”„”()\[\]{}]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let sequenceRunning = false;
  let suppressUntil = 0;

  function visibleWordsPair() {
    const pair = document.querySelector('.word-pair');
    if (!pair || pair.offsetParent === null) return null;

    const portuguese = clean(pair.querySelector('.single-word')?.textContent || '');
    const english = clean(pair.querySelector('.word-translation')?.textContent || '');
    if (!portuguese || !english) return null;

    return { portuguese, english };
  }

  function voiceFor(prefixes) {
    const voices = synth.getVoices();
    for (const prefix of prefixes) {
      const voice = voices.find(item =>
        String(item.lang || '').toLowerCase().startsWith(prefix)
      );
      if (voice) return voice;
    }
    return null;
  }

  function completeSilently(utterance) {
    window.setTimeout(() => {
      try { utterance?.onstart?.({ type: 'start', utterance }); } catch (_) {}
      try { utterance?.onend?.({ type: 'end', utterance }); } catch (_) {}
    }, 15);
  }

  synth.speak = utterance => {
    const pair = visibleWordsPair();
    const now = Date.now();

    if (!pair) return originalSpeak(utterance);

    // The original Words mode queues three utterances. Once our exact bilingual
    // sequence has started, finish the remaining old queue items silently.
    if (sequenceRunning || now < suppressUntil) {
      completeSilently(utterance);
      return;
    }

    sequenceRunning = true;
    suppressUntil = now + 8000;
    synth.cancel();

    const portuguese = new SpeechSynthesisUtterance(pair.portuguese);
    portuguese.lang = 'pt-PT';
    portuguese.rate = 0.82;
    portuguese.pitch = 1;
    portuguese.volume = 1;
    const ptVoice = voiceFor(['pt-pt', 'pt']);
    if (ptVoice) portuguese.voice = ptVoice;

    const english = new SpeechSynthesisUtterance(pair.english);
    english.lang = 'en-GB';
    english.rate = 1;
    english.pitch = 1;
    english.volume = 1;
    const enVoice = voiceFor(['en-gb', 'en']);
    if (enVoice) english.voice = enVoice;

    try { utterance?.onstart?.({ type: 'start', utterance }); } catch (_) {}

    portuguese.onend = () => {
      window.setTimeout(() => originalSpeak(english), 260);
    };
    portuguese.onerror = event => {
      sequenceRunning = false;
      suppressUntil = 0;
      try { utterance?.onerror?.(event); } catch (_) {}
    };

    english.onend = event => {
      sequenceRunning = false;
      // Keep a short suppression window for the two remaining legacy calls.
      suppressUntil = Date.now() + 1400;
      try { utterance?.onend?.(event); } catch (_) {}
    };
    english.onerror = event => {
      sequenceRunning = false;
      suppressUntil = 0;
      try { utterance?.onerror?.(event); } catch (_) {}
    };

    originalSpeak(portuguese);
  };
})();