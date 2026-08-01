(() => {
  'use strict';

  const synth = window.speechSynthesis;
  const processedBlocks = new WeakSet();
  let voices = [];

  const TIMING = {
    openingPause: 2100,
    englishRate: 0.92,
    portugueseRate: 0.72,
    englishHoldAfterSpeech: 12000,
    portugueseHoldAfterSpeech: 15000,
    betweenLanguages: 3000,
    beforeExercise: 3000
  };

  function refreshVoices() { voices = synth?.getVoices?.() || []; }
  refreshVoices();
  synth?.addEventListener?.('voiceschanged', refreshVoices);

  function pickVoice(lang) {
    refreshVoices();
    const requested = String(lang || '').toLowerCase();
    const base = requested.split('-')[0];
    const exact = voices.filter(v => String(v.lang || '').toLowerCase() === requested);
    const same = voices.filter(v => String(v.lang || '').toLowerCase().split('-')[0] === base);
    const preferred = list => list.find(v => /google|microsoft|natural|premium|online/i.test(v.name));
    return preferred(exact) || exact[0] || preferred(same) || same[0] || null;
  }

  function cleanText(value) { return String(value || '').replace(/\s+/g, ' ').replace(/\s+([,.;!?])/g, '$1').trim(); }

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
    const cacheKey = `speakup-flow-pt-v2:${value}`;
    try { const cached = localStorage.getItem(cacheKey); if (cached) return cached; } catch (_) {}
    try {
      const url = new URL('https://translate.googleapis.com/translate_a/single');
      url.searchParams.set('client', 'gtx');
      url.searchParams.set('sl', 'en');
      url.searchParams.set('tl', 'pt-PT');
      url.searchParams.set('dt', 't');
      url.searchParams.set('q', value);
      const response = await fetch(url.toString(), { cache: 'no-store' });
      if (!response.ok) throw new Error(String(response.status));
      const payload = await response.json();
      const translated = Array.isArray(payload?.[0]) ? payload[0].map(part => Array.isArray(part) ? (part[0] || '') : '').join('') : '';
      const result = cleanText(translated) || value;
      try { localStorage.setItem(cacheKey, result); } catch (_) {}
      return result;
    } catch (_) { return value; }
  }

  function ensureStyles() {
    if (document.getElementById('speakup-story-flow-styles')) return;
    const style = document.createElement('style');
    style.id = 'speakup-story-flow-styles';
    style.textContent = `
      .speakup-flow-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:28px;background:radial-gradient(circle at 20% 20%,rgba(255,95,215,.14),transparent 36%),radial-gradient(circle at 80% 80%,rgba(101,232,255,.13),transparent 38%),#020205;color:#fff;opacity:1;transition:opacity .45s ease;}
      .speakup-flow-overlay.leaving{opacity:0;}.speakup-flow-card{width:min(1080px,100%);text-align:center;}
      .speakup-flow-label{font-family:Arial,sans-serif;font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:#9daac7;margin-bottom:24px;}
      .speakup-flow-text{font-family:Georgia,'Times New Roman',serif;font-size:clamp(30px,5vw,64px);line-height:1.5;font-style:italic;text-wrap:balance;}
      .speakup-flow-word{display:inline-block;padding:0 .08em;border-radius:.2em;transition:color .16s ease,background .16s ease,text-shadow .16s ease,transform .16s ease;}
      .speakup-flow-word.active{color:#020205;background:#65e8ff;text-shadow:none;transform:translateY(-1px) scale(1.035);}
      .speakup-flow-hidden{visibility:hidden!important;pointer-events:none!important;}.speakup-flow-countdown{margin-top:26px;font:13px Arial,sans-serif;letter-spacing:.08em;color:#7f8ba6;}
    `;
    document.head.appendChild(style);
  }

  function tokenize(text) { return cleanText(text).match(/\S+/g) || []; }

  function createOverlay(label, text) {
    const overlay = document.createElement('div'); overlay.className = 'speakup-flow-overlay';
    const card = document.createElement('div'); card.className = 'speakup-flow-card';
    const heading = document.createElement('div'); heading.className = 'speakup-flow-label'; heading.textContent = label;
    const line = document.createElement('div'); line.className = 'speakup-flow-text';
    tokenize(text).forEach((word, index, words) => { const span = document.createElement('span'); span.className = 'speakup-flow-word'; span.textContent = word; line.appendChild(span); if (index < words.length - 1) line.appendChild(document.createTextNode(' ')); });
    const countdown = document.createElement('div'); countdown.className = 'speakup-flow-countdown';
    card.append(heading, line, countdown); overlay.appendChild(card); document.body.appendChild(overlay);
    return { overlay, words: Array.from(line.querySelectorAll('.speakup-flow-word')), countdown };
  }

  function speakHighlighted(text, lang, rate, wordElements) {
    return new Promise(resolve => {
      const value = cleanText(text);
      if (!value || !synth) return resolve();
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = lang; utterance.rate = rate; utterance.pitch = 1; utterance.volume = 1;
      const voice = pickVoice(lang); if (voice) utterance.voice = voice;
      let activeIndex = -1, fallbackTimer = null, boundaryReceived = false;
      const tokens = tokenize(value);
      const activate = index => { if (index < 0 || index >= wordElements.length || index === activeIndex) return; if (activeIndex >= 0) wordElements[activeIndex]?.classList.remove('active'); activeIndex = index; wordElements[activeIndex]?.classList.add('active'); };
      utterance.onboundary = event => { if (event.name && event.name !== 'word') return; boundaryReceived = true; const before = value.slice(0, event.charIndex); const index = (before.match(/\S+/g) || []).length; activate(Math.min(index, wordElements.length - 1)); };
      const msPerWord = lang.startsWith('pt') ? 720 : 500;
      const estimatedMs = Math.max(1800, tokens.length * msPerWord / Math.max(rate, .5));
      if (tokens.length) { let fallbackIndex = 0; activate(0); fallbackTimer = window.setInterval(() => { if (boundaryReceived) return; fallbackIndex += 1; if (fallbackIndex < wordElements.length) activate(fallbackIndex); }, estimatedMs / tokens.length); }
      const finish = () => { if (fallbackTimer) window.clearInterval(fallbackTimer); if (wordElements.length) activate(wordElements.length - 1); window.setTimeout(() => { if (activeIndex >= 0) wordElements[activeIndex]?.classList.remove('active'); window.__speakUpFlowOwnSpeech = false; resolve(); }, 320); };
      utterance.onend = finish; utterance.onerror = finish;
      window.__speakUpFlowOwnSpeech = true;
      synth.speak(utterance);
    });
  }

  function delay(ms) { return new Promise(resolve => window.setTimeout(resolve, ms)); }
  async function holdAfterSpeech(preview, durationMs, message) { const started = Date.now(); while (Date.now() - started < durationMs) { const remaining = Math.ceil((durationMs - (Date.now() - started)) / 1000); preview.countdown.textContent = `${message} · ${remaining}s`; await delay(250); } preview.countdown.textContent = ''; }
  async function removeOverlaySmoothly(overlay) { overlay.classList.add('leaving'); await delay(470); overlay.remove(); }
  function locateStoryContainer(storyText) { return storyText.closest('.story-center, .center, main, section') || storyText.parentElement; }

  async function runPreview(storyText) {
    if (!storyText.isConnected || processedBlocks.has(storyText)) return;
    processedBlocks.add(storyText); ensureStyles();
    const container = locateStoryContainer(storyText); if (!(container instanceof HTMLElement)) return;
    const english = rebuildEnglishText(storyText); if (!english || english.length < 20) return;
    container.classList.add('speakup-flow-hidden'); window.__speakUpSuppressCompletedBlock = true; synth?.cancel?.();
    let preview = createOverlay('Listen in English', english);
    await delay(TIMING.openingPause); await speakHighlighted(english, 'en-GB', TIMING.englishRate, preview.words);
    await holdAfterSpeech(preview, TIMING.englishHoldAfterSpeech, 'Read again'); await removeOverlaySmoothly(preview.overlay); await delay(TIMING.betweenLanguages);
    const portuguese = await translateToPortuguese(english);
    preview = createOverlay('Ouve em português', portuguese);
    await delay(TIMING.openingPause); await speakHighlighted(portuguese, 'pt-PT', TIMING.portugueseRate, preview.words);
    await holdAfterSpeech(preview, TIMING.portugueseHoldAfterSpeech, 'Lê novamente'); await removeOverlaySmoothly(preview.overlay); await delay(TIMING.beforeExercise);
    if (storyText.isConnected) container.classList.remove('speakup-flow-hidden');
    window.__speakUpFlowOwnSpeech = false; window.__speakUpSuppressCompletedBlock = false;
  }

  function scan() { document.querySelectorAll('.story-text').forEach(storyText => { const container = locateStoryContainer(storyText); if (container instanceof HTMLElement && container.offsetParent !== null && !processedBlocks.has(storyText)) runPreview(storyText); }); }
  const observer = new MutationObserver(scan); observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  document.addEventListener('click', event => { const button = event.target instanceof Element ? event.target.closest('button') : null; if (button && /menu|back/i.test(cleanText(button.textContent))) { window.__speakUpFlowOwnSpeech = false; synth?.cancel?.(); } }, true);
  scan();
})();