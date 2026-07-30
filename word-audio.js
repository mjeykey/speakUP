(() => {
  if (window.__speakupUnifiedAudioV11) return;
  window.__speakupUnifiedAudioV11 = true;

  const STORY_SELECTOR = '.story-text';
  const OTHER_ROOTS = '.story-playback-text,.story-playback-copy,.story-playback-sentence,.story-translation-text,.translation-text';
  let activeElement = null;
  let activeUtterance = null;

  function detectLanguage() {
    const text = `${document.documentElement.lang || ''} ${document.body?.innerText || ''}`.toLowerCase();
    if (text.includes('portugu')) return 'pt-PT';
    if (text.includes('deutsch') || text.includes('german')) return 'de-DE';
    if (text.includes('spanish') || text.includes('español') || text.includes('spanisch')) return 'es-ES';
    if (text.includes('french') || text.includes('français') || text.includes('französ')) return 'fr-FR';
    if (text.includes('italian') || text.includes('italiano') || text.includes('italien')) return 'it-IT';
    if (text.includes('croatian') || text.includes('hrvatski') || text.includes('kroatisch')) return 'hr-HR';
    return 'en-US';
  }

  function cleanWord(value) {
    return String(value || '').replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}'’\-]+$/gu, '').trim();
  }

  function clearHighlight() {
    if (activeElement) activeElement.classList.remove('speakup-word-speaking');
    activeElement = null;
  }

  function speakWord(value, element) {
    const word = cleanWord(value);
    if (!word || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;

    clearHighlight();
    try { window.speechSynthesis.cancel(); } catch (_) {}

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = detectLanguage();
    utterance.rate = 0.74;
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
      return true;
    } catch (_) {
      finish();
      return false;
    }
  }

  function wordFromCaret(root, x, y) {
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

    if (!node || !root.contains(node)) return null;
    if (node.nodeType !== Node.TEXT_NODE) {
      const child = Array.from(node.childNodes || []).find(n => n.nodeType === Node.TEXT_NODE);
      if (!child) return null;
      node = child;
      offset = 0;
    }

    const text = node.nodeValue || '';
    const isWord = ch => /[\p{L}\p{M}'’\-]/u.test(ch || '');
    let index = Math.min(Math.max(offset, 0), Math.max(text.length - 1, 0));
    if (!isWord(text[index]) && index > 0 && isWord(text[index - 1])) index -= 1;
    if (!isWord(text[index])) return null;

    let start = index;
    let end = index + 1;
    while (start > 0 && isWord(text[start - 1])) start -= 1;
    while (end < text.length && isWord(text[end])) end += 1;
    return { word: text.slice(start, end), element: node.parentElement || root };
  }

  function wordFromRects(root, x, y) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('button,.story-choice,.story-option-block,script,style')) return NodeFilter.FILTER_REJECT;
        return /[\p{L}\p{M}]/u.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const pattern = /[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*/gu;
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue || '';
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text))) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const hit = Array.from(range.getClientRects()).some(rect =>
          x >= rect.left - 6 && x <= rect.right + 6 && y >= rect.top - 8 && y <= rect.bottom + 8
        );
        if (hit) return { word: match[0], element: node.parentElement || root };
      }
    }
    return null;
  }

  function handleStoryTap(event) {
    const root = event.currentTarget;
    if (!root || event.target?.closest?.('.story-choice,.story-option-block,button')) return;
    const x = event.clientX;
    const y = event.clientY;
    const result = wordFromCaret(root, x, y) || wordFromRects(root, x, y);
    if (!result) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    speakWord(result.word, result.element);
  }

  function attachStoryRoot(root) {
    if (!root || root.dataset.speakupWordAudio === '11') return;
    root.dataset.speakupWordAudio = '11';
    root.style.touchAction = 'manipulation';
    root.addEventListener('click', handleStoryTap, true);
  }

  function attachAll() {
    document.querySelectorAll(STORY_SELECTOR).forEach(attachStoryRoot);
  }

  function handleOtherTap(event) {
    const root = event.target?.closest?.(OTHER_ROOTS);
    if (!root) return;
    const result = wordFromCaret(root, event.clientX, event.clientY) || wordFromRects(root, event.clientX, event.clientY);
    if (!result) return;
    event.preventDefault();
    event.stopPropagation();
    speakWord(result.word, result.element);
  }

  const style = document.createElement('style');
  style.id = 'speakup-unified-audio-style-v11';
  style.textContent = `
    ${STORY_SELECTOR},${OTHER_ROOTS}{touch-action:manipulation}
    .speakup-word-speaking{color:#65e8ff!important;text-shadow:0 0 16px rgba(101,232,255,.9)!important}
  `;
  document.head.appendChild(style);

  document.addEventListener('pointerdown', () => {
    try {
      window.speechSynthesis?.resume();
      window.speechSynthesis?.getVoices();
    } catch (_) {}
  }, { capture: true, once: true });

  attachAll();
  new MutationObserver(() => window.requestAnimationFrame(attachAll))
    .observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', handleOtherTap, true);
})();