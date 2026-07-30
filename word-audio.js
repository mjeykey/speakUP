(() => {
  if (window.__speakupUnifiedAudioV7) return;
  window.__speakupUnifiedAudioV7 = true;

  const ROOT_SELECTOR = [
    '.story-text',
    '.story-playback-text',
    '.story-playback-copy',
    '.story-playback-sentence',
    '.story-translation-text',
    '.translation-text'
  ].join(',');

  const WORD_SELECTOR = '.story-playback-word,.speakup-word,.speakup-audio-word';
  let lastPointerTime = 0;
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
    return String(value || '')
      .replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}'’\-]+$/gu, '')
      .trim();
  }

  function clearHighlight() {
    if (activeElement) activeElement.classList.remove('speakup-word-speaking');
    activeElement = null;
  }

  function speak(text, element) {
    const word = cleanWord(text);
    if (!word || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;

    clearHighlight();
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (_) {}

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

    // Android Chrome is more reliable when speech starts just after the tap handler.
    window.setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (_) {
        finish();
      }
    }, 20);
  }

  function wordAtPoint(x, y, root) {
    let node = null;
    let offset = 0;

    if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos) {
        node = pos.offsetNode;
        offset = pos.offset;
      }
    } else if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(x, y);
      if (range) {
        node = range.startContainer;
        offset = range.startOffset;
      }
    }

    if (!node || !root.contains(node)) return '';
    if (node.nodeType !== Node.TEXT_NODE) {
      const textNode = Array.from(node.childNodes || []).find(child => child.nodeType === Node.TEXT_NODE);
      if (!textNode) return '';
      node = textNode;
      offset = 0;
    }

    const text = node.nodeValue || '';
    if (!text) return '';
    const isWord = char => /[\p{L}\p{M}'’\-]/u.test(char || '');
    let index = Math.min(Math.max(offset, 0), Math.max(text.length - 1, 0));
    if (!isWord(text[index]) && index > 0 && isWord(text[index - 1])) index -= 1;
    if (!isWord(text[index])) return '';

    let start = index;
    let end = index + 1;
    while (start > 0 && isWord(text[start - 1])) start -= 1;
    while (end < text.length && isWord(text[end])) end += 1;
    return text.slice(start, end);
  }

  function findStoryRoot(target) {
    return target?.closest?.(ROOT_SELECTOR) || target?.closest?.('.story-center');
  }

  function activate(event) {
    if (event.type === 'click' && Date.now() - lastPointerTime < 500) return;
    if (event.type === 'pointerup') lastPointerTime = Date.now();

    const target = event.target;
    const root = findStoryRoot(target);
    if (!root) return;
    if (target?.closest?.('button,.story-gap,.story-choice,.story-option-block,.story-active-card')) return;

    const wordElement = target?.closest?.(WORD_SELECTOR);
    const word = wordElement?.textContent || wordAtPoint(event.clientX, event.clientY, root);
    if (!cleanWord(word)) return;

    event.preventDefault();
    event.stopPropagation();
    speak(word, wordElement || root);
  }

  const style = document.createElement('style');
  style.id = 'speakup-unified-audio-style-v7';
  style.textContent = `
    ${ROOT_SELECTOR}{touch-action:manipulation}
    ${WORD_SELECTOR}{cursor:pointer;touch-action:manipulation}
    .speakup-word-speaking{color:#65e8ff!important;text-shadow:0 0 16px rgba(101,232,255,.9)!important}
  `;
  document.head.appendChild(style);

  // Prime the browser audio engine on the first genuine user interaction.
  document.addEventListener('pointerdown', () => {
    try {
      window.speechSynthesis?.resume();
      window.speechSynthesis?.getVoices();
    } catch (_) {}
  }, { capture: true, once: true });

  document.addEventListener('pointerup', activate, true);
  document.addEventListener('click', activate, true);
  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const wordElement = event.target?.closest?.(WORD_SELECTOR);
    if (!wordElement) return;
    event.preventDefault();
    speak(wordElement.textContent, wordElement);
  }, true);
})();