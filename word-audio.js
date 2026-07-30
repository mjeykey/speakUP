(() => {
  if (window.__speakupUnifiedAudioV10) return;
  window.__speakupUnifiedAudioV10 = true;

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

  function clearHighlight() {
    if (activeElement) activeElement.classList.remove('speakup-word-speaking');
    activeElement = null;
  }

  function speakWord(word, element) {
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

    window.setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (_) {
        finish();
      }
    }, 10);
  }

  function rootsAtPoint(x, y) {
    return Array.from(document.querySelectorAll(ROOT_SELECTOR))
      .filter(root => {
        const rect = root.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      })
      .sort((a, b) => {
        const ar = a.getBoundingClientRect();
        const br = b.getBoundingClientRect();
        return ar.width * ar.height - br.width * br.height;
      });
  }

  function wordAtPoint(root, x, y) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest('button,.story-gap,.story-choice,.story-option-block,script,style')) return NodeFilter.FILTER_REJECT;
        return /[\p{L}\p{M}]/u.test(node.nodeValue || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    const wordPattern = /[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*/gu;
    let node;

    while ((node = walker.nextNode())) {
      const text = node.nodeValue || '';
      wordPattern.lastIndex = 0;
      let match;

      while ((match = wordPattern.exec(text))) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);

        const rects = Array.from(range.getClientRects());
        const hit = rects.some(rect => x >= rect.left - 3 && x <= rect.right + 3 && y >= rect.top - 5 && y <= rect.bottom + 5);
        range.detach?.();

        if (hit) return { word: match[0], element: node.parentElement };
      }
    }

    return null;
  }

  function handlePointer(event) {
    if (event.button !== undefined && event.button !== 0) return;

    const roots = rootsAtPoint(event.clientX, event.clientY);
    for (const root of roots) {
      const result = wordAtPoint(root, event.clientX, event.clientY);
      if (!result) continue;

      event.preventDefault();
      event.stopPropagation();
      speakWord(result.word, result.element);
      return;
    }
  }

  const style = document.createElement('style');
  style.id = 'speakup-unified-audio-style-v10';
  style.textContent = `
    ${ROOT_SELECTOR}{touch-action:manipulation}
    .speakup-word-speaking{color:#65e8ff!important;text-shadow:0 0 16px rgba(101,232,255,.9)!important}
  `;
  document.head.appendChild(style);

  document.addEventListener('pointerdown', () => {
    try {
      window.speechSynthesis?.resume();
      window.speechSynthesis?.getVoices();
    } catch (_) {}
  }, { capture: true, once: true });

  document.addEventListener('pointerup', handlePointer, true);
})();
