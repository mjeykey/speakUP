(() => {
  'use strict';

  const synth = window.speechSynthesis;
  if (!synth || synth.__speakUpWordsAudioFixInstalled) return;
  synth.__speakUpWordsAudioFixInstalled = true;

  const previousSpeak = synth.speak.bind(synth);
  const clean = value => String(value || '')
    .replace(/[.,!?;:…“”„”()\[\]{}]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  function visibleLearningWord() {
    const wordPair = document.querySelector('.word-pair');
    if (!wordPair || wordPair.offsetParent === null) return '';
    const word = wordPair.querySelector('.single-word');
    return clean(word?.textContent || '');
  }

  synth.speak = utterance => {
    const learningWord = visibleLearningWord();
    const spoken = clean(utterance?.text);

    if (!learningWord || !spoken || spoken.toLowerCase() === learningWord.toLowerCase()) {
      return previousSpeak(utterance);
    }

    const corrected = new SpeechSynthesisUtterance(learningWord);
    corrected.lang = 'pt-PT';
    corrected.rate = 0.82;
    corrected.pitch = Number.isFinite(utterance?.pitch) ? utterance.pitch : 1;
    corrected.volume = Number.isFinite(utterance?.volume) ? utterance.volume : 1;

    const portugueseVoice = synth.getVoices().find(voice =>
      String(voice.lang || '').toLowerCase().startsWith('pt-pt')
    ) || synth.getVoices().find(voice =>
      String(voice.lang || '').toLowerCase().startsWith('pt')
    );
    if (portugueseVoice) corrected.voice = portugueseVoice;

    corrected.onstart = event => {
      try { utterance?.onstart?.(event); } catch (_) {}
    };
    corrected.onend = event => {
      try { utterance?.onend?.(event); } catch (_) {}
    };
    corrected.onerror = event => {
      try { utterance?.onerror?.(event); } catch (_) {}
    };

    return previousSpeak(corrected);
  };
})();
