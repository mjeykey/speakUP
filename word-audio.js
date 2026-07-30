(() => {
  if (window.__speakupDirectWordAudio) return;
  window.__speakupDirectWordAudio = true;

  const languageMap = {
    english: 'en-US', englisch: 'en-US',
    portuguese: 'pt-PT', portugiesisch: 'pt-PT', português: 'pt-PT',
    german: 'de-DE', deutsch: 'de-DE',
    spanish: 'es-ES', spanisch: 'es-ES', español: 'es-ES',
    french: 'fr-FR', französisch: 'fr-FR', français: 'fr-FR',
    italian: 'it-IT', italienisch: 'it-IT', italiano: 'it-IT',
    croatian: 'hr-HR', kroatisch: 'hr-HR', hrvatski: 'hr-HR'
  };

  function detectLanguage() {
    for (const select of document.querySelectorAll('select')) {
      const option = select.options && select.options[select.selectedIndex];
      const text = `${select.value || ''} ${option ? option.textContent : ''}`.toLowerCase();
      for (const [name, code] of Object.entries(languageMap)) {
        if (text.includes(name) || text.includes(code.slice(0, 2).toLowerCase())) return code;
      }
    }
    return document.documentElement.lang || 'en-US';
  }

  function speak(word, element) {
    const clean = (word || '').replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}'’\-]+$/gu, '').trim();
    if (!clean || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = detectLanguage();
    utterance.rate = 0.78;
    if (element) {
      element.classList.add('speakup-word-speaking');
      utterance.onend = utterance.onerror = () => element.classList.remove('speakup-word-speaking');
    }
    speechSynthesis.speak(utterance);
  }

  function wrapTextNode(node) {
    if (!node.parentElement || node.parentElement.closest('.speakup-word')) return;
    const text = node.nodeValue;
    if (!text || !/[\p{L}\p{M}]/u.test(text)) return;
    const fragment = document.createDocumentFragment();
    const parts = text.split(/([\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*)/gu);
    for (const part of parts) {
      if (/^[\p{L}\p{M}]/u.test(part)) {
        const span = document.createElement('span');
        span.className = 'speakup-word';
        span.textContent = part;
        span.tabIndex = 0;
        span.setAttribute('role', 'button');
        span.setAttribute('aria-label', `Listen: ${part}`);
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    }
    node.replaceWith(fragment);
  }

  function enhanceStory(story) {
    if (!story || story.dataset.speakupAudioReady === '1') return;
    const walker = document.createTreeWalker(story, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('button,.story-gap,.speakup-word')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(wrapTextNode);
    story.dataset.speakupAudioReady = '1';
  }

  function scan() {
    document.querySelectorAll('.story-text').forEach(enhanceStory);
  }

  const style = document.createElement('style');
  style.textContent = `
    .speakup-word{cursor:pointer;touch-action:manipulation;border-radius:.22em;padding:.02em .03em}
    .speakup-word:active,.speakup-word-speaking{color:#65e8ff;text-shadow:0 0 14px rgba(101,232,255,.7)}
  `;
  document.head.appendChild(style);

  document.addEventListener('pointerup', event => {
    const word = event.target.closest && event.target.closest('.speakup-word');
    if (!word) return;
    event.preventDefault();
    event.stopPropagation();
    speak(word.textContent, word);
  }, true);

  document.addEventListener('keydown', event => {
    const word = event.target.closest && event.target.closest('.speakup-word');
    if (word && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      speak(word.textContent, word);
    }
  }, true);

  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();