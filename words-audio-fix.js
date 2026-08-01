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
    }, 5000);
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

    if (waitingForEnglishReplay && activeLearningWord === learningWord) {
      // The app's middle call repeats the Portuguese learning word.
      // Skip it completely, but report completion so the built-in flow continues.
      if (requestedText.toLowerCase() === learningWord.toLowerCase()) {
        window.setTimeout(() => {
          try { utterance?.onstart?.({ type: 'start', utterance }); } catch (_) {}
          try { utterance?.onend?.({ type: 'end', utterance }); } catch (_) {}
        }, 20);
        return;
      }

      // The next different word is the existing English replay. Let it through once.
      waitingForEnglishReplay = false;
      activeLearningWord = '';
      if (replayResetTimer) window.clearTimeout(replayResetTimer);
      utterance.lang = 'en-GB';
      utterance.rate = 1;
      return previousSpeak(utterance);
    }

    if (requestedText.toLowerCase() === learningWord.toLowerCase()) {
      return previousSpeak(utterance);
    }

    // Replace only the first native-language call with the Portuguese learning word.
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