import { STORIES } from '../data/content.js?v=6';
import { speak, speakWithWordHighlight, stopSpeech } from '../audio/speech.js?v=6';
import { recordWordAnswer, recordWordExposure } from '../learning/progress.js?v=1';

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

const VERB_PAIRS = [
  { english: ['leaves', 'leave'], portuguese: ['sai', 'saem'] },
  { english: ['walks', 'walk'], portuguese: ['caminha', 'caminham'] },
  { english: ['buys', 'buy'], portuguese: ['compra', 'compram'] },
  { english: ['meets', 'meet'], portuguese: ['encontra', 'encontram'] },
  { english: ['smile', 'smiles'], portuguese: ['sorri', 'sorriem'] },
  { english: ['begin', 'begins'], portuguese: ['começa', 'começam'] },
  { english: ['lives', 'live'], portuguese: ['vive', 'vivem'] },
  { english: ['carry', 'carries', 'carrying'], portuguese: ['leva', 'levam', 'carrega', 'carregam'] },
  { english: ['asks', 'ask'], portuguese: ['pergunta', 'perguntam'] },
  { english: ['wants', 'want'], portuguese: ['quer', 'querem'] },
  { english: ['make', 'makes'], portuguese: ['fazer', 'faz', 'fazem'] },
  { english: ['invites', 'invite'], portuguese: ['convida', 'convidam'] },
  { english: ['eat', 'eats'], portuguese: ['comer', 'come', 'comem'] },
  { english: ['accepts', 'accept'], portuguese: ['aceita', 'aceitam'] },
  { english: ['enters', 'enter'], portuguese: ['entra', 'entram'] },
  { english: ['orders', 'order'], portuguese: ['pede', 'pedem'] },
  { english: ['sits', 'sit'], portuguese: ['senta-se', 'sentam-se', 'senta', 'sentam'] },
  { english: ['starts', 'start'], portuguese: ['começa', 'começam'] },
  { english: ['stops', 'stop'], portuguese: ['para', 'param'] },
  { english: ['looks', 'look'], portuguese: ['olha', 'olham'] },
  { english: ['drinks', 'drink'], portuguese: ['bebe', 'bebem'] },
  { english: ['watches', 'watch'], portuguese: ['observa', 'observam'] },
  { english: ['returns', 'return'], portuguese: ['regressa', 'regressam', 'volta', 'voltam'] },
  { english: ['opens', 'open'], portuguese: ['abre', 'abrem'] },
  { english: ['hears', 'hear'], portuguese: ['ouve', 'ouvem'] },
  { english: ['works', 'work'], portuguese: ['trabalha', 'trabalham'] },
  { english: ['checks', 'check'], portuguese: ['verifica', 'verificam'] },
  { english: ['speaks', 'speak'], portuguese: ['fala', 'falam'] },
  { english: ['plan', 'plans'], portuguese: ['planeia', 'planeiam'] },
  { english: ['jumps', 'jump'], portuguese: ['salta', 'saltam'] },
  { english: ['laughs', 'laugh'], portuguese: ['ri', 'riem'] }
];

function normalizeWord(value) {
  return String(value || '').toLocaleLowerCase('pt-PT').replace(/^[^a-zà-ÿ]+|[^a-zà-ÿ]+$/gi, '');
}

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

function findLearningItems(english, portuguese) {
  const englishWords = new Set((english.match(/[A-Za-zÀ-ÿ’'-]+/g) || []).map(normalizeWord));
  const portugueseWords = (portuguese.match(/[A-Za-zÀ-ÿ’'-]+/g) || []).map(normalizeWord);
  const items = [];

  for (const pair of VERB_PAIRS) {
    const englishMatch = pair.english.find(word => englishWords.has(normalizeWord(word)));
    const portugueseMatch = pair.portuguese.find(word => portugueseWords.includes(normalizeWord(word)));
    if (!englishMatch || !portugueseMatch) continue;
    if (items.some(item => normalizeWord(item.portuguese) === normalizeWord(portugueseMatch))) continue;
    items.push({ english: englishMatch, portuguese: portugueseMatch });
    if (items.length === 3) break;
  }
  return items;
}

function buildPortugueseGapHtml(portuguese, items, solvedCount) {
  const used = new Set();
  return escapeHtml(portuguese).replace(/[A-Za-zÀ-ÿ’'-]+/g, word => {
    const normalized = normalizeWord(word);
    const itemIndex = items.findIndex((item, index) => !used.has(index) && normalizeWord(item.portuguese) === normalized);
    if (itemIndex < 0) return word;
    used.add(itemIndex);
    const item = items[itemIndex];
    return itemIndex < solvedCount
      ? `<span class="story-gap-solved">${escapeHtml(item.portuguese)}</span>`
      : `<span class="story-gap-english" data-gap="${itemIndex}">${escapeHtml(item.english)}</span>`;
  });
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
    const items = findLearningItems(english, portuguese);
    if (!items.length || token !== runToken) return showCompletion(english, portuguese, token);

    items.forEach(item => recordWordExposure({
      ...item,
      source: 'story',
      storyId: story.id,
      pageIndex
    }));

    let solved = 0;
    const renderGap = () => {
      shell(`<p class="story-phase-label">Replace the English verbs with Portuguese</p>
        <p class="story-copy story-gap-copy">${buildPortugueseGapHtml(portuguese, items, solved)}</p>
        <div class="story-word-options">${items.map((item, index) => `<button class="story-word-option" data-option="${index}" ${index < solved ? 'disabled' : ''}>${escapeHtml(item.portuguese)}</button>`).join('')}</div>`);

      root.querySelectorAll('[data-option]').forEach(button => {
        button.onclick = async () => {
          const index = Number(button.dataset.option);
          const selected = items[index];
          const expected = items[solved];
          const correct = index === solved;

          recordWordAnswer({
            portuguese: selected.portuguese,
            english: selected.english,
            correct,
            source: 'story',
            storyId: story.id,
            pageIndex
          });

          if (!correct) {
            button.classList.add('is-wrong');
            window.setTimeout(() => button.classList.remove('is-wrong'), 400);
            return;
          }

          await speak(expected.portuguese, 'pt-PT', {
            rate: 0.72,
            enabled: store.getState().audioOn
          });
          solved += 1;
          renderGap();
          if (solved === items.length) {
            await sleep(1000);
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
