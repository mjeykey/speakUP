import { STORIES } from '../data/content.js?v=5';
import { speak, speakWithWordHighlight, stopSpeech } from '../audio/speech.js?v=5';

const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));
const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const BUILT_IN_PT = {
  everyday: {
    0: 'Todas as manhãs, Leonor sai de casa e caminha pela rua. Compra pão no mercado e encontra uma vizinha. Sorriem uma para a outra e começam o dia com calma.'
  }
};

function getEnglish(page) {
  if (typeof page === 'string') return page;
  if (page && typeof page === 'object') return String(page.english ?? page.text ?? page.translation ?? '');
  return '';
}

function getStoredTranslation(storyId, pageIndex) {
  try {
    return localStorage.getItem(`speakup:story:pt:${storyId}:${pageIndex}`) || '';
  } catch {
    return '';
  }
}

function storeTranslation(storyId, pageIndex, text) {
  try {
    localStorage.setItem(`speakup:story:pt:${storyId}:${pageIndex}`, text);
  } catch {
    // Storage is optional.
  }
}

async function translateWithBrowser(text) {
  if (globalThis.Translator?.create) {
    const translator = await globalThis.Translator.create({ sourceLanguage: 'en', targetLanguage: 'pt' });
    return translator.translate(text);
  }
  if (globalThis.translation?.createTranslator) {
    const translator = await globalThis.translation.createTranslator({ sourceLanguage: 'en', targetLanguage: 'pt' });
    return translator.translate(text);
  }
  return '';
}

async function getPortuguese(story, pageIndex, page) {
  if (page && typeof page === 'object' && page.portuguese) return String(page.portuguese);
  const stored = getStoredTranslation(story.id, pageIndex);
  if (stored) return stored;
  const builtIn = BUILT_IN_PT[story.id]?.[pageIndex];
  if (builtIn) {
    storeTranslation(story.id, pageIndex, builtIn);
    return builtIn;
  }
  try {
    const translated = String(await translateWithBrowser(getEnglish(page)) || '').trim();
    if (translated) storeTranslation(story.id, pageIndex, translated);
    return translated;
  } catch {
    return '';
  }
}

function chooseGapWords(text) {
  const stopWords = new Set(['about', 'after', 'again', 'because', 'before', 'being', 'between', 'could', 'every', 'from', 'have', 'into', 'other', 'their', 'there', 'these', 'they', 'this', 'through', 'until', 'very', 'when', 'where', 'which', 'while', 'with', 'would']);
  const words = text.match(/[A-Za-zÀ-ÿ’'-]+/g) || [];
  const candidates = words.filter(word => word.length >= 5 && !stopWords.has(word.toLowerCase()));
  const unique = [...new Map(candidates.map(word => [word.toLowerCase(), word])).values()];
  return unique.slice(0, Math.min(3, unique.length));
}

function buildGapHtml(text, targets, solvedCount) {
  let targetIndex = 0;
  const targetSet = new Set(targets.map(word => word.toLowerCase()));
  return escapeHtml(text).replace(/[A-Za-zÀ-ÿ’'-]+/g, word => {
    if (!targetSet.has(word.toLowerCase())) return word;
    const index = targetIndex++;
    return index < solvedCount
      ? `<span class="story-gap-solved">${escapeHtml(targets[index])}</span>`
      : `<span class="story-gap-blank" data-gap="${index}">_____</span>`;
  });
}

function renderWordSpans(text) {
  return String(text).split(/(\s+)/).map((part, index) => /^\s+$/.test(part)
    ? part
    : `<span class="story-spoken-word" data-word-index="${index}">${escapeHtml(part)}</span>`).join('');
}

export function renderStory(root, store) {
  const state = store.getState();
  const story = STORIES.find(item => item.id === state.selectedStory);
  if (!story) {
    store.setState({ screen: 'menu' });
    return;
  }

  const pages = Array.isArray(story.pages) && story.pages.length ? story.pages : [story.english || ''];
  let pageIndex = 0;
  let runToken = 0;

  const leave = () => {
    runToken += 1;
    stopSpeech();
    store.setState({ screen: 'menu' });
  };

  const shell = content => {
    root.innerHTML = `<section class="screen story-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="center story-view">
        <p class="kicker">Story Mode</p>
        <h1>${story.emoji} ${escapeHtml(story.title)}</h1>
        <p class="story-subtitle">${escapeHtml(story.subtitle || '')}</p>
        <p class="story-progress">Page ${pageIndex + 1} / ${pages.length}</p>
        ${content}
      </div>
    </section>`;
    root.querySelector('[data-menu]').onclick = leave;
  };

  const showTranslationProblem = english => {
    shell(`<p class="story-copy">${escapeHtml(english)}</p>
      <div class="story-status-card">
        <p>Die portugiesische Übersetzung für diese Seite konnte auf diesem Gerät noch nicht vorbereitet werden.</p>
        <button class="primary-button" data-retry>Prepare Portuguese</button>
      </div>`);
    root.querySelector('[data-retry]').onclick = () => runPage();
  };

  const showGapExercise = async (english, portuguese, token) => {
    const targets = chooseGapWords(english);
    if (!targets.length || token !== runToken) return showCompletion(english, portuguese, token);
    let solved = 0;

    const renderGap = () => {
      shell(`<p class="story-phase-label">Complete the English text</p>
        <p class="story-copy story-gap-copy">${buildGapHtml(english, targets, solved)}</p>
        <div class="story-word-options">${targets.map((word, index) => `<button class="story-word-option" data-option="${index}" ${index < solved ? 'disabled' : ''}>${escapeHtml(word)}</button>`).join('')}</div>`);
      root.querySelectorAll('[data-option]').forEach(button => {
        button.onclick = async () => {
          const index = Number(button.dataset.option);
          if (index !== solved) {
            button.classList.add('is-wrong');
            window.setTimeout(() => button.classList.remove('is-wrong'), 400);
            return;
          }
          solved += 1;
          renderGap();
          if (solved === targets.length) {
            await sleep(850);
            showCompletion(english, portuguese, token);
          }
        };
      });
    };
    renderGap();
  };

  const showCompletion = async (english, portuguese, token) => {
    const sequence = [
      { label: 'Portuguese', text: portuguese, language: 'pt-PT', rate: 0.72 },
      { label: 'English', text: english, language: 'en-GB', rate: 0.96 },
      { label: 'Portuguese', text: portuguese, language: 'pt-PT', rate: 0.72 }
    ];
    for (const item of sequence) {
      if (token !== runToken) return;
      shell(`<p class="story-phase-label">${item.label}</p><p class="story-copy story-dissolve">${escapeHtml(item.text)}</p>`);
      await speak(item.text, item.language, { rate: item.rate, enabled: store.getState().audioOn });
      if (token !== runToken) return;
      root.querySelector('.story-dissolve')?.classList.add('is-dissolving');
      await sleep(1500);
    }
    if (token !== runToken) return;
    shell(`<p class="story-copy">${escapeHtml(portuguese)}</p>
      <div class="story-controls">
        <button class="secondary-button" data-prev ${pageIndex === 0 ? 'disabled' : ''}>Previous</button>
        <button class="primary-button" data-replay>Replay page</button>
        <button class="secondary-button" data-next ${pageIndex === pages.length - 1 ? 'disabled' : ''}>Next</button>
      </div>`);
    root.querySelector('[data-replay]').onclick = () => runPage();
    root.querySelector('[data-prev]').onclick = () => {
      if (pageIndex === 0) return;
      pageIndex -= 1;
      runPage();
    };
    root.querySelector('[data-next]').onclick = () => {
      if (pageIndex >= pages.length - 1) return;
      pageIndex += 1;
      runPage();
    };
  };

  const runPage = async () => {
    stopSpeech();
    const token = ++runToken;
    const page = pages[pageIndex];
    const english = getEnglish(page);

    shell(`<p class="story-phase-label">English</p><p class="story-copy">${escapeHtml(english)}</p>`);
    await speak(english, 'en-GB', { rate: 0.96, enabled: store.getState().audioOn });
    if (token !== runToken) return;
    await sleep(700);

    shell(`<div class="story-status-card"><p>Preparing Portuguese…</p></div>`);
    const portuguese = await getPortuguese(story, pageIndex, page);
    if (token !== runToken) return;
    if (!portuguese) {
      showTranslationProblem(english);
      return;
    }

    const spokenWords = portuguese.split(/\s+/).filter(Boolean);
    shell(`<p class="story-phase-label">Portuguese</p><p class="story-copy story-portuguese-copy">${spokenWords.map((word, index) => `<span class="story-spoken-word" data-spoken="${index}">${escapeHtml(word)}</span>`).join(' ')}</p>`);
    await speakWithWordHighlight({
      text: portuguese,
      language: 'pt-PT',
      rate: 0.7,
      enabled: store.getState().audioOn,
      onWord: index => {
        root.querySelectorAll('[data-spoken]').forEach((element, wordIndex) => element.classList.toggle('is-speaking', wordIndex === index));
      }
    });
    if (token !== runToken) return;
    await sleep(1000);
    showGapExercise(english, portuguese, token);
  };

  runPage();
}
