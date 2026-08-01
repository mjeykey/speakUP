(() => {
  'use strict';

  const synth = window.speechSynthesis;
  if (!synth || window.__speakUpMemoryFastInstalled) return;
  window.__speakUpMemoryFastInstalled = true;

  let voices = [];
  const refreshVoices = () => { voices = synth.getVoices?.() || []; };
  refreshVoices();
  synth.addEventListener?.('voiceschanged', refreshVoices);

  function pickVoice(lang) {
    refreshVoices();
    const requested = String(lang || '').toLowerCase();
    const base = requested.split('-')[0];
    const exact = voices.filter(v => String(v.lang || '').toLowerCase() === requested);
    const same = voices.filter(v => String(v.lang || '').toLowerCase().split('-')[0] === base);
    const preferred = list => list.find(v => /google|microsoft|natural|premium|online/i.test(v.name));
    return preferred(exact) || exact[0] || preferred(same) || same[0] || null;
  }

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function cardText(card) {
    return clean(card.querySelector('.memory-card-front')?.textContent);
  }

  function cardLanguage(card, text) {
    const front = card.querySelector('.memory-card-front');
    if (front?.classList.contains('memory-card-word')) return 'pt-PT';
    if (front?.classList.contains('memory-card-translation')) return 'en-GB';

    // Safe fallback for the current Portuguese-learning / English-menu flow.
    return /[ãõçáàâéêíóôúü]/i.test(text) ? 'pt-PT' : 'en-GB';
  }

  function speakNow(card) {
    const text = cardText(card);
    if (!text) return;

    const lang = cardLanguage(card, text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang.startsWith('pt') ? 0.82 : 0.9;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    utterance.__speakUpMemoryFast = true;
    const voice = pickVoice(lang);
    if (voice) utterance.voice = voice;

    window.__speakUpMemoryFastSuppress = {
      text: text.toLowerCase(),
      expires: Date.now() + 1400
    };

    try {
      window.__speakUpCancelSpeech?.();
      (window.__speakUpSpeakPreview || synth.speak.bind(synth))(utterance);
    } catch (_) {
      synth.speak(utterance);
    }
  }

  document.addEventListener('pointerdown', event => {
    const card = event.target instanceof Element ? event.target.closest('.memory-card') : null;
    if (!(card instanceof HTMLElement) || card.disabled) return;
    speakNow(card);
  }, true);
})();
