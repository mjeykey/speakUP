(() => {
  'use strict';

  const synth = window.speechSynthesis;
  const processedBlocks = new WeakSet();
  const activeRuns = new WeakMap();
  let voices = [];

  function refreshVoices() {
    voices = synth?.getVoices?.() || [];
  }

  refreshVoices();
  synth?.addEventListener?.('voiceschanged', refreshVoices);

  function pickVoice(lang) {
    refreshVoices();
    const requested = String(lang || '').toLowerCase();
    const base = requested.split('-')[0];
    const exact = voices.filter(voice => String(voice.lang || '').toLowerCase() === requested);
    const sameLanguage = voices.filter(voice => String(voice.lang || '').toLowerCase().split('-')[0] === base);
    const preferred = list => list.find(voice => /google|microsoft|natural|premium|online/i.test(voice.name));
    return preferred(exact) || exact[0] || preferred(sameLanguage) || sameLanguage[0] || null;
  }

  function speak(text, lang, rate = 1) {
    return new Promise(resolve => {
      const value = String(text || '').replace(/\s+/g, ' ').trim();
      if (!value || !synth) {
        resolve();
        return;
      }

      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voice = pickVoice(lang);
      if (voice) utterance.voice = voice;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      synth.speak(utterance);
    });
  }

  function delay(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }

  function cleanText(value) {
    return String(value || '').replace(/\s+/g, ' ').replace(/\s+([,.;!?])/g, '$1').trim();
  }

  function rebuildEnglishText(storyText) {
    const clone = storyText.cloneNode(true);
    clone.querySelectorAll('.story-gap, .story-correct').forEach(gap => {
      const original = gap.dataset.speakupEnglish || gap.getAttribute('data-speakup-english') || gap.textContent || '';
      gap.replaceWith(document.createTextNode(original));
    });
    return cleanText(clone.textContent);
  }

  async function translateToPortuguese(text) {
    const value = cleanText(text);
    if (!value) return value;

    const cacheKey = `speakup-flow-pt-v1:${value}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) return cached;
    } catch (_) {}

    const url = new URL('https://translate.googleapis.com/translate_a/single');
    url.searchParams.set('client', 'gtx');
    url.searchParams.set('sl', 'en');
    url.searchParams.set('tl', 'pt-PT');
    url.searchParams.set('dt', 't');
    url.searchParams.set('q', value);

    try {
      const response = await fetch(url.toString(), { cache: 'no-store' });
      if (!response.ok) throw new Error(String(response.status));
      const payload = await response.json();
      const translated = Array.isArray(payload?.[0])
        ? payload[0].map(part => Array.isArray(part) ? (part[0] || '') : '').join('')
        : '';
      const result = cleanText(translated) || value;
      try { localStorage.setItem(cacheKey, result); } catch (_) {}
      return result;
    } catch (_) {
      return value;
    }
  }

  function ensureStyles() {
    if (document.getElementById('speakup-story-flow-styles')) return;
    const style = document.createElement('style');
    style.id = 'speakup-story-flow-styles';
    style.textContent = `
      .speakup-flow-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:28px;background:radial-gradient(circle at 20% 20%,rgba(255,95,215,.14),transparent 36%),radial-gradient(circle at 80% 80%,rgba(101,232,255,.13),transparent 38%),#020205;color:#fff;}
      .speakup-flow-card{width:min(1050px,100%);text-align:center;}
      .speakup-flow-label{font-family:Arial,sans-serif;font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:#9daac7;margin-bottom:24px;}
      .speakup-flow-text{font-family:Georgia,'Times New Roman',serif;font-size:clamp(30px,5vw,64px);line-height:1.36;font-style:italic;text-wrap:balance;}
      .speakup-flow-progress{display:flex;justify-content:center;gap:9px;margin-top:34px;}
      .speakup-flow-progress span{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.2);}
      .speakup-flow-progress span.on{background:#65e8ff;box-shadow:0 0 15px rgba(101,232,255,.7);}
      .speakup-flow-hidden{visibility:hidden!important;pointer-events:none!important;}
      .speakup-flow-dissolve{position:relative;animation:speakupFlowFade 1.35s ease forwards;}
      .speakup-flow-dissolve::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 20% 30%,rgba(255,95,215,.65) 0 2px,transparent 3px),radial-gradient(circle at 75% 25%,rgba(101,232,255,.7) 0 2px,transparent 3px),radial-gradient(circle at 45% 78%,rgba(179,155,255,.65) 0 2px,transparent 3px);background-size:55px 55px,73px 73px,91px 91px;animation:speakupFlowParticles 1.35s ease forwards;}
      @keyframes speakupFlowFade{0%{opacity:1;filter:blur(0);transform:scale(1)}70%{opacity:.5;filter:blur(1px)}100%{opacity:0;filter:blur(7px);transform:scale(.96)}}
      @keyframes speakupFlowParticles{0%{opacity:0;transform:scale(.9)}20%{opacity:1}100%{opacity:0;transform:scale(1.35) translateY(-24px)}}
    `;
    document.head.appendChild(style);
  }

  function createOverlay(label, text, step) {
    const overlay = document.createElement('div');
    overlay.className = 'speakup-flow-overlay';
    overlay.innerHTML = `
      <div class="speakup-flow-card">
        <div class="speakup-flow-label"></div>
        <div class="speakup-flow-text"></div>
        <div class="speakup-flow-progress"><span></span><span></span><span></span></div>
      </div>`;
    overlay.querySelector('.speakup-flow-label').textContent = label;
    overlay.querySelector('.speakup-flow-text').textContent = text;
    overlay.querySelectorAll('.speakup-flow-progress span').forEach((dot, index) => dot.classList.toggle('on', index <= step));
    document.body.appendChild(overlay);
    return overlay;
  }

  function locateStoryContainer(storyText) {
    return storyText.closest('.story-center, .center, main, section') || storyText.parentElement;
  }

  async function runPreview(storyText) {
    if (!storyText.isConnected || processedBlocks.has(storyText)) return;
    processedBlocks.add(storyText);
    ensureStyles();

    const container = locateStoryContainer(storyText);
    if (!(container instanceof HTMLElement)) return;

    const english = rebuildEnglishText(storyText);
    if (!english || english.length < 20) return;

    const run = { cancelled: false };
    activeRuns.set(storyText, run);
    container.classList.add('speakup-flow-hidden');
    window.__speakUpSuppressCompletedBlock = true;
    synth?.cancel?.();

    let overlay = createOverlay('Listen in English', english, 0);
    await delay(300);
    if (!run.cancelled) await speak(english, 'en-GB', 1);
    await delay(420);
    overlay.remove();

    const portuguese = await translateToPortuguese(english);
    if (run.cancelled) return;
    overlay = createOverlay('Ouve em português', portuguese, 1);
    await delay(300);
    await speak(portuguese, 'pt-PT', 0.88);
    await delay(520);
    overlay.remove();

    if (!storyText.isConnected || run.cancelled) return;
    container.classList.remove('speakup-flow-hidden');
    window.__speakUpSuppressCompletedBlock = false;
  }

  function isSolvedStory(container) {
    const choices = container.querySelectorAll('.story-choice');
    const activeCard = container.querySelector('.story-active-card');
    const gaps = Array.from(container.querySelectorAll('.story-gap'));
    if (choices.length || activeCard) return false;
    return gaps.length > 0 && gaps.every(gap => cleanText(gap.textContent).length > 0);
  }

  function findNextButton() {
    return Array.from(document.querySelectorAll('button')).find(button => {
      if (!(button instanceof HTMLButtonElement) || button.disabled || button.offsetParent === null) return false;
      const text = cleanText(button.textContent).toLowerCase();
      return /^(continue|next|next block|continue story|done|finish)/.test(text) && !text.includes('menu');
    }) || null;
  }

  function dissolveAndAdvance(container) {
    if (!(container instanceof HTMLElement) || container.dataset.speakupDissolving === '1') return;
    container.dataset.speakupDissolving = '1';
    synth?.cancel?.();
    container.classList.add('speakup-flow-dissolve');
    window.setTimeout(() => {
      const next = findNextButton();
      if (next) next.click();
      container.classList.remove('speakup-flow-dissolve');
    }, 1380);
  }

  function scan() {
    document.querySelectorAll('.story-text').forEach(storyText => {
      const container = locateStoryContainer(storyText);
      if (!(container instanceof HTMLElement)) return;

      if (!processedBlocks.has(storyText) && container.offsetParent !== null) {
        runPreview(storyText);
        return;
      }

      if (processedBlocks.has(storyText) && container.offsetParent !== null && isSolvedStory(container)) {
        dissolveAndAdvance(container);
      }
    });
  }

  const observer = new MutationObserver(scan);
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  document.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest('button') : null;
    if (button && /menu|back/i.test(cleanText(button.textContent))) {
      synth?.cancel?.();
      activeRuns.forEach?.(run => { run.cancelled = true; });
    }
  }, true);

  scan();
})();
