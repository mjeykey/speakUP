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
    const englishWord = clean(utterance?.text);

    if (!learningWord || !englishWord || englishWord.toLowerCase() === learningWord.toLowerCase()) {
      return previousSpeak(utterance);
    }

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

    const english = new SpeechSynthesisUtterance(englishWord);
    english.lang = 'en-GB';
    english.rate = Number.isFinite(utterance?.rate) ? utterance.rate : 1;
    english.pitch = Number.isFinite(utterance?.pitch) ? utterance.pitch : 1;
    english.volume = Number.isFinite(utterance?.volume) ? utterance.volume : 1;

    const englishVoice = synth.getVoices().find(voice =>
      String(voice.lang || '').toLowerCase().startsWith('en-gb')
    ) || synth.getVoices().find(voice =>
      String(voice.lang || '').toLowerCase().startsWith('en')
    );
    if (englishVoice) english.voice = englishVoice;

    portuguese.onstart = event => {
      try { utterance?.onstart?.(event); } catch (_) {}
    };
    portuguese.onend = () => {
      window.setTimeout(() => previousSpeak(english), 220);
    };
    portuguese.onerror = event => {
      try { utterance?.onerror?.(event); } catch (_) {}
    };

    english.onend = event => {
      try { utterance?.onend?.(event); } catch (_) {}
    };
    english.onerror = event => {
      try { utterance?.onerror?.(event); } catch (_) {}
    };

    synth.cancel();
    return previousSpeak(portuguese);
  };
})();
