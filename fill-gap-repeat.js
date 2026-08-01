(() => {
  'use strict';

  const synth = window.speechSynthesis;
  if (!synth || window.__speakUpFillGapRepeatInstalled) return;
  window.__speakUpFillGapRepeatInstalled = true;

  let voices = [];
  const refreshVoices = () => { voices = synth.getVoices?.() || []; };
  refreshVoices();
  synth.addEventListener?.('voiceschanged', refreshVoices);

  function cleanVisibleText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function cleanSpeechText(value) {
    return cleanVisibleText(value)
      .replace(/[.,!?;:…“”„"'()\[\]{}]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function pickPortugueseVoice() {
    refreshVoices();
    const exact = voices.filter(v => String(v.lang || '').toLowerCase() === 'pt-pt');
    const portuguese = voices.filter(v => String(v.lang || '').toLowerCase().startsWith('pt'));
    const preferred = list => list.find(v => /google|microsoft|natural|premium|online/i.test(v.name));
    return preferred(exact) || exact[0] || preferred(portuguese) || portuguese[0] || null;
  }

  function currentSentenceElement() {
    const candidates = [
      ...document.querySelectorAll('.learning-sentence, .dissolve-sentence')
    ];
    return candidates.find(el => el instanceof HTMLElement && el.offsetParent !== null) || null;
  }

  function isFillGapChoice(button) {
    if (!(button instanceof HTMLElement)) return false;
    if (!button.classList.contains('choice')) return false;
    if (button.closest('.memory-screen, .story-screen, .story-center')) return false;
    return Boolean(currentSentenceElement());
  }

  function speakFullSentence(text) {
    const spoken = cleanSpeechText(text);
    if (!spoken) return;

    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.lang = 'pt-PT';
    utterance.rate = 0.78;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    utterance.__speakUpFlowPreview = true;
    const voice = pickPortugueseVoice();
    if (voice) utterance.voice = voice;

    try {
      window.__speakUpCancelSpeech?.();
      (window.__speakUpSpeakPreview || synth.speak.bind(synth))(utterance);
    } catch (_) {
      synth.cancel();
      synth.speak(utterance);
    }
  }

  document.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest('button.choice') : null;
    if (!isFillGapChoice(button)) return;

    const beforeElement = currentSentenceElement();
    const before = cleanVisibleText(beforeElement?.textContent);
    const choice = cleanVisibleText(button.textContent);

    window.setTimeout(() => {
      const afterElement = currentSentenceElement();
      const after = cleanVisibleText(afterElement?.textContent);
      if (!after || after === before || !after.toLowerCase().includes(choice.toLowerCase())) return;

      // Let the inserted word finish first, then repeat the completed Portuguese sentence.
      window.setTimeout(() => speakFullSentence(after), 700);
    }, 140);
  }, true);
})();
