(() => {
  if (window.__speakupUnifiedAudioV12) return;
  window.__speakupUnifiedAudioV12 = true;

  const STORY_SELECTOR = '.story-text';
  const OVERLAY_CLASS = 'speakup-word-hitbox';
  const WORD_PATTERN = /[\p{L}\p{M}]+(?:['’\-][\p{L}\p{M}]+)*/gu;
  let overlayLayer = null;
  let rebuildFrame = 0;
  let activeHitbox = null;
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

  function ensureLayer() {
    if (overlayLayer?.isConnected) return overlayLayer;
    overlayLayer = document.createElement('div');
    overlayLayer.id = 'speakup-word-overlay-v12';
    overlayLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlayLayer);
    return overlayLayer;
  }

  function clearActive() {
    if (activeHitbox) activeHitbox.classList.remove('is-speaking');
    activeHitbox = null;
  }

  function speakWord(word, hitbox) {
    if (!word || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    clearActive();
    try { window.speechSynthesis.cancel(); } catch (_) {}

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = detectLanguage();
    utterance.rate = 0.74;
    utterance.pitch = 1;
    utterance.volume = 1;
    activeUtterance = utterance;
    activeHitbox = hitbox;
    hitbox?.classList.add('is-speaking');

    const finish = () => {
      if (activeUtterance === utterance) activeUtterance = null;
      clearActive();
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

  function addHitbox(rect, word) {
    if (rect.width < 2 || rect.height < 2) return;
    const hitbox = document.createElement('button');
    hitbox.type = 'button';
    hitbox.className = OVERLAY_CLASS;
    hitbox.setAttribute('aria-label', `Pronounce ${word}`);
    hitbox.dataset.word = word;
    hitbox.style.left = `${Math.max(0, rect.left - 3)}px`;
    hitbox.style.top = `${Math.max(0, rect.top - 4)}px`;
    hitbox.style.width = `${rect.width + 6}px`;
    hitbox.style.height = `${rect.height + 8}px`;

    const activate = event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      speakWord(word, hitbox);
    };
    hitbox.addEventListener('pointerdown', activate, true);
    hitbox.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
    }, true);
    ensureLayer().appendChild(hitbox);
  }

  function addTextNodeWords(node) {
    const parent = node.parentElement;
    if (!parent) return;
    if (parent.closest('.story-gap,.story-choice,.story-option-block,button,script,style')) return;

    const text = node.nodeValue || '';
    WORD_PATTERN.lastIndex = 0;
    let match;
    while ((match = WORD_PATTERN.exec(text))) {
      const range = document.createRange();
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      Array.from(range.getClientRects()).forEach(rect => addHitbox(rect, match[0]));
      range.detach?.();
    }
  }

  function rebuildNow() {
    rebuildFrame = 0;
    const layer = ensureLayer();
    layer.replaceChildren();

    document.querySelectorAll(STORY_SELECTOR).forEach(root => {
      const rect = root.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const style = getComputedStyle(root);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          return /[\p{L}\p{M}]/u.test(node.nodeValue || '')
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(addTextNodeWords);
    });
  }

  function scheduleRebuild() {
    if (rebuildFrame) cancelAnimationFrame(rebuildFrame);
    rebuildFrame = requestAnimationFrame(rebuildNow);
  }

  const style = document.createElement('style');
  style.id = 'speakup-word-overlay-style-v12';
  style.textContent = `
    #speakup-word-overlay-v12{position:fixed;inset:0;z-index:2147483000;pointer-events:none}
    .${OVERLAY_CLASS}{position:fixed;margin:0;padding:0;border:0;background:transparent;color:transparent;appearance:none;-webkit-appearance:none;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:6px}
    .${OVERLAY_CLASS}.is-speaking{background:rgba(101,232,255,.18);box-shadow:0 0 14px rgba(101,232,255,.45)}
  `;
  document.head.appendChild(style);

  document.addEventListener('pointerdown', () => {
    try {
      window.speechSynthesis?.resume();
      window.speechSynthesis?.getVoices();
    } catch (_) {}
  }, { capture: true, once: true });

  new MutationObserver(scheduleRebuild).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
  window.addEventListener('resize', scheduleRebuild, { passive: true });
  window.addEventListener('scroll', scheduleRebuild, { passive: true, capture: true });
  document.addEventListener('transitionend', scheduleRebuild, true);

  scheduleRebuild();
})();