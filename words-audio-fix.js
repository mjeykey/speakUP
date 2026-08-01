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

  let waitingForEnglishReplay = false;
  let activeLearningWord = '';
  let replayResetTimer = null;

  function visibleLearningWord() {
    const wordPair = document.querySelector('.word-pair');
    if (!wordPair || wordPair.offsetParent === null) return '';
    return clean(wordPair.querySelector('.single-word')?.textContent || '');
  }

  function resetReplayStateLater() {
    if (replayResetTimer) window.clearTimeout(replayResetTimer);
    replayResetTimer = window.setTimeout(() => {
      waitingForEnglishReplay = false;
      activeLearningWord = '';
    }, 4000);
  }

  synth.speak = utterance => {
    const learningWord = visibleLearningWord();
    const requestedText = clean(utterance?.text);

    if (!learningWord || !requestedText) {
      return previousSpeak(utterance);
    }

    if (activeLearningWord && activeLearningWord !== learningWord) {
      waitingForEnglishReplay = false;
      activeLearningWord = '';
    }

    // The app already provides the English replay. Let that second call pass through.
    if (waitingForEnglishReplay && activeLearningWord === learningWord) {
      waitingForEnglishReplay = false;
      activeLearningWord = '';
      if (replayResetTimer) window.clearTimeout(replayResetTimer);
      utterance.lang = 'en-GB';
      utterance.rate = Number.isFinite(utterance.rate) ? utterance.rate : 1;
      return previousSpeak(utterance);
    }

    // If the app is already speaking the visible Portuguese word, keep it unchanged.
    if (requestedText.toLowerCase() === learningWord.toLowerCase()) {
      return previousSpeak(utterance);
    }

    // Replace only the first Words-mode audio call with Portuguese.
    const portuguese = new SpeechSynthesisUtterance(learningWord);
    portuguese.lang = 'pt-PT';
    portuguese.rate = 0.82;
    portuguese.pitch = 1;
    portuguese.volume = Number.isFinite(utterance?.volume) ? utterance.volume : 1;

    const portugueseVoice = synth.getVoices().find(voice =>
      String(voice.lang || '').toLowerCase().startsWith('pt-pt')
    ) || synth.getVoices().find(voice =>
      String(voice.lang || '').toLowerCase().startsWith('pt')
    );
    if (portugueseVoice) portuguese.voice = portugueseVoice;

    portuguese.onstart = event => {
      try { utterance?.onstart?.(event); } catch (_) {}
    };
    portuguese.onend = event => {
      waitingForEnglishReplay = true;
      activeLearningWord = learningWord;
      resetReplayStateLater();
      try { utterance?.onend?.(event); } catch (_) {}
    };
    portuguese.onerror = event => {
      waitingForEnglishReplay = false;
      activeLearningWord = '';
      try { utterance?.onerror?.(event); } catch (_) {}
    };

    synth.cancel();
    return previousSpeak(portuguese);
  };
})();
