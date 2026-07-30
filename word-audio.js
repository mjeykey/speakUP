(() => {
  if (window.__speakupUnifiedAudioV9) return;
  window.__speakupUnifiedAudioV9 = true;

  const ROOT_SELECTOR = [
    '.story-text',
    '.story-playback-text',
    '.story-playback-copy',
    '.story-playback-sentence',
    '.story-translation-text',
    '.translation-text'
  ].join(',');

  let activeElement = null;
  let activeUtterance = null;

  function detectLanguage() {
    const selected = Array.from(document.querySelectorAll('select'))
      .map(select => `${select.value || ''} ${select.options?.[select.selectedIndex]?.textContent || ''}`)
      .join(' ')
      .toLowerCase();
    if (selected.includes('portugu')) return 'pt-PT';
    if (selected.includes('deutsch') || selected.includes('german')) return 'de-DE';
    if (selected.includes('spanish') || selected.includes('español') || selected.includes('spanisch')) return 'es-ES';
    if (selected.includes('french') || selected.includes('français') || selected.includes('französ')) return 'fr-FR';
    if (selected.includes('italian') || selected.includes('italiano') || selected.includes('italien')) return 'it-IT';
    if (selected.includes('croatian') || selected.includes('hrvatski') || selected.includes('kroatisch')) return 'hr-HR';
    return 'en-US';
  }

  function cleanWord(value) {
    return String(value || '').replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}'’\-]+$/gu, '').trim();
  }

  function clearHighlight() {
    if (activeElement) activeElement.classList.remove('speakup-word-speaking');
    activeElement = null;
  }

  function speak(text, element) {
    const word = cleanWord(text);
    if (!word || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;

    clearHighlight();
    try { window.speechSynthesis.cancel(); } catch (_) {}

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = detectLanguage();
    utterance.rate = 0.76;
    utterance.pitch = 1;
    utterance.volume = 1;
    activeUtterance = utterance;
    activeElement = element || null;
    if (activeElement) activeElement.classList.add('speakup-word-speaking');

    const finish = () => {
      if (activeUtterance === utterance) activeUtterance = null;
      clearHighlight();
    };
    utterance.onend = finish;
    utterance.onerror = finish;

    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
    } catch (_) {
      finish();
    }
  }

  function makeWordSpan(text) {
    const span = document.createElement('span');
    span.className = 'speakup-direct-word';
    span.textContent = text;
    span.setAttribute('role', 'button');
    span.setAttribute('tabindex', '0');
    span.addEventListener('pointerdown', event => {
      event.preventDefault();
      event.stopPropagation();
      speak(text, span);
    }, true);
    span.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
    }, true);
    span.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      speak(text, span);
    }, true);
    return span;
  }

  function wrapTextNode(node) {
    const text = node.nodeValue || '';
    if (!/[\p{L}\p{M}]/u.test(text)) return;
    const fragment = document.createDocumentFragment();
    const parts = text.split(/([\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*)/gu);
    for (const part of parts) {
      if (!part) continue;
      if (/^[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*$/u.test(part)) fragment.appendChild(makeWordSpan(part));
      else fragment.appendChild(document.createTextNode(part));
    }
    node.parentNode?.replaceChild(fragment, node);
  }

  function prepareRoot(root) {
    if (!root || root.dataset.speakupWordsReady === '1') return;
    root.dataset.speakupWordsReady = '1';
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest('button,.story-gap,.story-choice,.story-option-block,.speakup-direct-word,script,style')) return NodeFilter.FILTER_REJECT;
        return /[\p{L}\p{M}]/u.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(wrapTextNode);
  }

  function prepareAll() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(prepareRoot);
  }

  const style = document.createElement('style');
  style.id = 'speakup-unified-audio-style-v9';
  style.textContent = `
    ${ROOT_SELECTOR}{touch-action:manipulation}
    .speakup-direct-word{cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
    .speakup-word-speaking{color:#65e8ff!important;text-shadow:0 0 16px rgba(101,232,255,.9)!important}
  `;
  document.head.appendChild(style);

  prepareAll();
  const observer = new MutationObserver(() => window.requestAnimationFrame(prepareAll));
  observer.observe(document.body, { childList: true, subtree: true });
})();