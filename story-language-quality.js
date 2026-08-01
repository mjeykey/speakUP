(() => {
  'use strict';

  const ptPtTerms = new Map([
    ['breakfast', 'pequeno-almoço'],
    ['bus', 'autocarro'],
    ['cell phone', 'telemóvel'],
    ['phone', 'telemóvel'],
    ['train station', 'estação de comboios'],
    ['subway', 'metro'],
    ['sidewalk', 'passeio'],
    ['apartment', 'apartamento'],
    ['vacation', 'férias']
  ]);

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function followingText(element) {
    let node = element.nextSibling;
    let text = '';
    while (node && text.length < 40) {
      text += node.textContent || '';
      node = node.nextSibling;
    }
    return normalize(text);
  }

  function contextualPortuguese(element) {
    const english = normalize(element.dataset.speakupEnglish);
    const current = String(element.dataset.speakupPortuguese || element.textContent || '').trim();
    const after = followingText(element);

    if (english === 'with') {
      if (/^\s*her\b/.test(after)) return 'com ela';
      if (/^\s*him\b/.test(after)) return 'com ele';
      if (/^\s*them\b/.test(after)) return 'com eles';
      if (/^\s*us\b/.test(after)) return 'connosco';
      if (/^\s*you\b/.test(after)) return 'contigo';
    }

    if (english === 'for') {
      if (/^\s*lunch\b/.test(after)) return 'para o almoço';
      if (/^\s*dinner\b/.test(after)) return 'para o jantar';
      if (/^\s*breakfast\b/.test(after)) return 'para o pequeno-almoço';
    }

    return ptPtTerms.get(english) || current;
  }

  function improve(element) {
    if (!(element instanceof HTMLElement)) return;
    if (!element.matches('.story-choice, .story-correct, .story-gap:not(:empty)')) return;
    if (!element.dataset.speakupEnglish) return;

    const improved = contextualPortuguese(element);
    if (!improved || improved === element.textContent?.trim()) return;

    element.textContent = improved;
    element.dataset.speakupPortuguese = improved;
    element.dataset.speakupLanguage = 'pt-PT';
    element.setAttribute('lang', 'pt-PT');
    element.setAttribute('aria-label', `${improved}, português europeu`);
  }

  function scan(root = document) {
    if (root instanceof HTMLElement) improve(root);
    root.querySelectorAll?.('.story-choice, .story-correct, .story-gap:not(:empty)').forEach(improve);
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
      if (record.type === 'characterData' && record.target.parentElement) {
        improve(record.target.parentElement);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  window.setInterval(() => scan(), 700);
  scan();
})();
