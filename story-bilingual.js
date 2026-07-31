(() => {
  'use strict';

  const cache = new Map();
  const translating = new WeakSet();
  let lastSpokenAt = 0;

  async function translateWordToPortuguese(text) {
    const input = String(text || '').trim();
    if (!input) return input;
    if (cache.has(input)) return cache.get(input);

    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.set('client', 'gtx');
    url.searchParams.set('sl', 'en');
    url.searchParams.set('tl', 'pt');
    url.searchParams.set('dt', 't');
    url.searchParams.set('q', input);

    try {
      const response = await fetch(url.toString(), { cache: 'no-store' });
      if (!response.ok) return input;
      const payload = await response.json();
      const translated = Array.isArray(payload?.[0])
        ? payload[0].map(part => Array.isArray(part) ? (part[0] || '') : '').join('').trim()
        : '';
      const result = translated || input;
      cache.set(input, result);
      return result;
    } catch (_) {
      return input;
    }
  }

  function isStoryWordElement(element) {
    return element instanceof HTMLElement && element.matches(
      '.story-choice, .story-correct, .story-gap:not(:empty)'
    );
  }

  function findPortugueseVoice() {
    const voices = window.speechSynthesis?.getVoices?.() || [];
    const ptVoices = voices.filter(voice => String(voice.lang || '').toLowerCase().startsWith('pt'));
    return ptVoices.find(voice => /google|microsoft|natural|premium|online/i.test(voice.name))
      || ptVoices.find(voice => String(voice.lang).toLowerCase() === 'pt-pt')
      || ptVoices[0]
      || null;
  }

  function speakPortuguese(text) {
    const value = String(text || '').trim();
    if (!value || !window.speechSynthesis) return;

    const now = Date.now();
    if (now - lastSpokenAt < 120) return;
    lastSpokenAt = now;

    // The app may queue the original English word from its own click handler.
    // Run after that handler, cancel it, then speak the visible Portuguese word.
    window.setTimeout(() => {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(value);
        utterance.lang = 'pt-PT';
        const voice = findPortugueseVoice();
        if (voice) utterance.voice = voice;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch (_) {}
    }, 90);
  }

  async function localizeElement(element) {
    if (!isStoryWordElement(element) || translating.has(element)) return;
    const original = element.dataset.speakupEnglish || element.textContent?.trim() || '';
    if (!original || original.length > 40) return;

    translating.add(element);
    element.dataset.speakupEnglish = original;
    const translated = await translateWordToPortuguese(original);
    if (element.isConnected && translated) {
      element.textContent = translated;
      element.dataset.speakupLanguage = 'pt-PT';
      element.setAttribute('lang', 'pt-PT');
      element.setAttribute('aria-label', `${translated}, Portuguese`);
    }
    translating.delete(element);
  }

  function scan(root = document) {
    if (root instanceof HTMLElement && isStoryWordElement(root)) localizeElement(root);
    root.querySelectorAll?.('.story-choice, .story-correct, .story-gap:not(:empty)').forEach(localizeElement);
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element
      ? event.target.closest('.story-choice, .story-correct, .story-gap:not(:empty)')
      : null;
    if (!target) return;
    speakPortuguese(target.textContent);
  }, true);

  document.addEventListener('pointerup', event => {
    if (event.pointerType !== 'touch') return;
    const target = event.target instanceof Element
      ? event.target.closest('.story-choice, .story-correct, .story-gap:not(:empty)')
      : null;
    if (!target) return;
    speakPortuguese(target.textContent);
  }, true);

  const observer = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
      if (record.type === 'characterData' && record.target.parentElement) {
        localizeElement(record.target.parentElement);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  scan();
})();
