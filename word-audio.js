(() => {
  if (window.__speakupWordAudioV6) return;
  window.__speakupWordAudioV6 = true;

  function language() {
    const text = Array.from(document.querySelectorAll('select')).map(s => `${s.value} ${s.options?.[s.selectedIndex]?.textContent || ''}`).join(' ').toLowerCase();
    if (text.includes('portugu')) return 'pt-PT';
    if (text.includes('deutsch') || text.includes('german')) return 'de-DE';
    if (text.includes('spanish') || text.includes('español') || text.includes('spanisch')) return 'es-ES';
    if (text.includes('french') || text.includes('français') || text.includes('französ')) return 'fr-FR';
    if (text.includes('italian') || text.includes('italiano') || text.includes('italien')) return 'it-IT';
    if (text.includes('croatian') || text.includes('hrvatski') || text.includes('kroatisch')) return 'hr-HR';
    return 'en-US';
  }

  function say(word, el) {
    word = String(word || '').replace(/^[^A-Za-zÀ-ž]+|[^A-Za-zÀ-ž'’-]+$/g, '').trim();
    if (!word || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = language();
    u.rate = 0.75;
    if (el) {
      el.classList.add('speakup-word-speaking');
      setTimeout(() => el.classList.remove('speakup-word-speaking'), 700);
    }
    window.speechSynthesis.speak(u);
  }

  function wordAtPoint(x, y, root) {
    let range = null;
    if (document.caretRangeFromPoint) range = document.caretRangeFromPoint(x, y);
    else if (document.caretPositionFromPoint) {
      const p = document.caretPositionFromPoint(x, y);
      if (p) {
        range = document.createRange();
        range.setStart(p.offsetNode, p.offset);
        range.collapse(true);
      }
    }
    if (!range || !root.contains(range.startContainer)) return '';
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return '';
    const text = node.nodeValue || '';
    let i = Math.min(range.startOffset, Math.max(0, text.length - 1));
    const isWord = c => /[A-Za-zÀ-ž'’-]/.test(c || '');
    if (!isWord(text[i]) && i > 0 && isWord(text[i - 1])) i--;
    if (!isWord(text[i])) return '';
    let a = i, b = i + 1;
    while (a > 0 && isWord(text[a - 1])) a--;
    while (b < text.length && isWord(text[b])) b++;
    return text.slice(a, b);
  }

  const style = document.createElement('style');
  style.textContent = '.story-text{touch-action:manipulation}.speakup-word-speaking{color:#65e8ff!important;text-shadow:0 0 14px rgba(101,232,255,.8)!important}';
  document.head.appendChild(style);

  function activate(e) {
    const root = e.target?.closest?.('.story-text');
    if (!root) return;
    if (e.target.closest?.('button,.story-gap,.story-choice,.story-option-block')) return;
    const wrapped = e.target.closest?.('.speakup-word');
    const word = wrapped?.textContent || wordAtPoint(e.clientX, e.clientY, root);
    if (!word) return;
    e.preventDefault();
    e.stopPropagation();
    say(word, wrapped || root);
  }

  document.addEventListener('pointerup', activate, true);
  document.addEventListener('click', activate, true);
})();