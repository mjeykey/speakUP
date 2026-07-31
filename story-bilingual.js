(() => {
  'use strict';

  const cache = new Map();
  const translating = new WeakSet();
  let completionSkipRunning = false;

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

  function normalizedText(element) {
    return String(element?.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function isStoryWordElement(element) {
    return element instanceof HTMLElement && element.matches(
      '.story-choice, .story-correct, .story-gap:not(:empty)'
    );
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
      element.dataset.speakupPortuguese = translated;
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

  function preparePortugueseSpeech(event) {
    const target = event.target instanceof Element
      ? event.target.closest('.story-choice, .story-correct, .story-gap:not(:empty)')
      : null;
    if (!target) return;

    const text = target.dataset.speakupPortuguese || target.textContent?.trim() || '';
    if (!text) return;

    window.__speakUpPortugueseOverride = {
      text,
      consumed: false,
      expires: Date.now() + 1200
    };
  }

  function completionPhaseMarker() {
    const elements = Array.from(document.querySelectorAll('main *'));
    return elements.find(element => {
      if (!(element instanceof HTMLElement) || element.offsetParent === null) return false;
      const text = normalizedText(element);
      return text.includes('listening to the completed block')
        || text.includes('stay on this text until the final sentence has finished')
        || text.includes('completed block in portuguese');
    }) || null;
  }

  function findAdvanceButton() {
    const buttons = Array.from(document.querySelectorAll('button'))
      .filter(button => button instanceof HTMLButtonElement && !button.disabled);

    return buttons.find(button => {
      const text = normalizedText(button);
      return button.classList.contains('story-completion-button')
        || text.includes('continue to full translation')
        || /^(continue|next|next block|continue story|done|finish)/.test(text);
    }) || null;
  }

  function removeCompletedBlockPhase() {
    const marker = completionPhaseMarker();
    if (!marker || completionSkipRunning) return;

    completionSkipRunning = true;
    window.__speakUpSuppressCompletedBlock = true;
    window.speechSynthesis?.cancel?.();

    const panel = marker.closest('section, article, div');
    if (panel instanceof HTMLElement) panel.style.display = 'none';

    const storyText = document.querySelector('.story-text');
    if (storyText instanceof HTMLElement) storyText.style.visibility = 'hidden';

    let attempts = 0;
    const advance = () => {
      attempts += 1;
      const button = findAdvanceButton();
      if (button) {
        button.click();
        window.setTimeout(() => {
          window.__speakUpSuppressCompletedBlock = false;
          completionSkipRunning = false;
        }, 250);
        return;
      }
      if (attempts < 30) {
        window.setTimeout(advance, 100);
      } else {
        window.__speakUpSuppressCompletedBlock = false;
        completionSkipRunning = false;
      }
    };
    advance();
  }

  document.addEventListener('pointerdown', preparePortugueseSpeech, true);
  document.addEventListener('touchstart', preparePortugueseSpeech, { capture: true, passive: true });
  document.addEventListener('click', preparePortugueseSpeech, true);

  const observer = new MutationObserver(records => {
    for (const record of records) {
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
      if (record.type === 'characterData' && record.target.parentElement) {
        localizeElement(record.target.parentElement);
      }
    }
    removeCompletedBlockPhase();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  scan();
  removeCompletedBlockPhase();
})();
