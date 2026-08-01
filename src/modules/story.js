import { STORIES } from '../data/content.js?v=7';
import { speak, speakWithWordHighlight, stopSpeech } from '../audio/speech.js?v=18';
import { recordWordAnswer, recordWordExposure } from '../learning/progress.js?v=1';

const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));
const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const PHASES = ['english', 'portuguese', 'gap', 'review'];
const LEARNING_PAIRS = [
  { english: ['leaves','leave'], portuguese: ['sai','saem'] },
  { english: ['walks','walk'], portuguese: ['caminha','caminham'] },
  { english: ['buys','buy'], portuguese: ['compra','compram'] },
  { english: ['meets','meet'], portuguese: ['encontra','encontram','encontram-se'] },
  { english: ['smile','smiles'], portuguese: ['sorri','sorriem'] },
  { english: ['begin','begins'], portuguese: ['começa','começam'] },
  { english: ['lives','live'], portuguese: ['vive','vivem','mora','moram'] },
  { english: ['carry','carries','carrying'], portuguese: ['leva','levam','carrega','carregam'] },
  { english: ['asks','ask'], portuguese: ['pergunta','perguntam'] },
  { english: ['wants','want'], portuguese: ['quer','querem'] },
  { english: ['make','makes'], portuguese: ['fazer','faz','fazem'] },
  { english: ['invites','invite'], portuguese: ['convida','convidam'] },
  { english: ['eat','eats'], portuguese: ['comer','come','comem'] },
  { english: ['accepts','accept'], portuguese: ['aceita','aceitam'] },
  { english: ['enters','enter'], portuguese: ['entra','entram'] },
  { english: ['orders','order'], portuguese: ['pede','pedem'] },
  { english: ['sits','sit'], portuguese: ['senta-se','sentam-se','senta','sentam'] },
  { english: ['starts','start'], portuguese: ['começa','começam'] },
  { english: ['stops','stop'], portuguese: ['para','param'] },
  { english: ['looks','look'], portuguese: ['olha','olham'] },
  { english: ['drinks','drink'], portuguese: ['bebe','bebem'] },
  { english: ['watches','watch'], portuguese: ['observa','observam'] },
  { english: ['returns','return'], portuguese: ['regressa','regressam','volta','voltam'] },
  { english: ['opens','open'], portuguese: ['abre','abrem'] },
  { english: ['hears','hear'], portuguese: ['ouve','ouvem'] },
  { english: ['works','work'], portuguese: ['trabalha','trabalham'] },
  { english: ['checks','check'], portuguese: ['verifica','verificam'] },
  { english: ['speaks','speak'], portuguese: ['fala','falam'] },
  { english: ['plans','plan'], portuguese: ['planeia','planeiam'] },
  { english: ['jumps','jump'], portuguese: ['salta','saltam'] },
  { english: ['laughs','laugh'], portuguese: ['ri','riem'] },
  { english: ['calls','called'], portuguese: ['chama-se','chama','chamam'] },
  { english: ['gets','gets up','wakes'], portuguese: ['acorda','levanta-se'] },
  { english: ['prepares','prepare'], portuguese: ['prepara','preparam'] },
  { english: ['goes','go'], portuguese: ['vai','vão'] },
  { english: ['loves','love'], portuguese: ['adora','adoram','ama','amam'] },
  { english: ['neighbor','neighbour'], portuguese: ['vizinha','vizinho'] },
  { english: ['house','home'], portuguese: ['casa'] },
  { english: ['street'], portuguese: ['rua'] },
  { english: ['market'], portuguese: ['mercado'] },
  { english: ['bread'], portuguese: ['pão'] },
  { english: ['morning'], portuguese: ['manhã','manhãs'] },
  { english: ['day'], portuguese: ['dia'] },
  { english: ['building'], portuguese: ['prédio'] },
  { english: ['floor'], portuguese: ['andar'] },
  { english: ['different'], portuguese: ['diferente'] },
  { english: ['same'], portuguese: ['mesmo','mesma'] },
  { english: ['often'], portuguese: ['muitas','vezes'] },
  { english: ['neighborhood','neighbourhood'], portuguese: ['bairro'] },
  { english: ['coffee'], portuguese: ['café'] },
  { english: ['balcony'], portuguese: ['varanda'] },
  { english: ['quiet'], portuguese: ['tranquilidade','calma'] },
  { english: ['early'], portuguese: ['cedo'] },
  { english: ['friend'], portuguese: ['amiga','amigo'] },
  { english: ['woman'], portuguese: ['mulher'] },
  { english: ['man'], portuguese: ['homem'] },
  { english: ['shop','store'], portuguese: ['loja'] },
  { english: ['school'], portuguese: ['escola'] },
  { english: ['work'], portuguese: ['trabalho'] },
  { english: ['food'], portuguese: ['comida'] },
  { english: ['water'], portuguese: ['água'] },
  { english: ['door'], portuguese: ['porta'] },
  { english: ['window'], portuguese: ['janela'] },
  { english: ['car'], portuguese: ['carro'] },
  { english: ['bus'], portuguese: ['autocarro'] },
  { english: ['train'], portuguese: ['comboio'] },
  { english: ['happy'], portuguese: ['feliz'] },
  { english: ['tired'], portuguese: ['cansada','cansado'] },
  { english: ['small'], portuguese: ['pequena','pequeno'] },
  { english: ['big'], portuguese: ['grande'] },
  { english: ['new'], portuguese: ['nova','novo'] },
  { english: ['old'], portuguese: ['velha','velho'] }
];

function normalizeWord(value) {
  return String(value || '').toLocaleLowerCase('pt-PT').replace(/^[^a-zà-ÿ]+|[^a-zà-ÿ]+$/gi, '');
}
function getEnglish(page) {
  if (typeof page === 'string') return page;
  return page && typeof page === 'object' ? String(page.english ?? page.text ?? page.translation ?? '') : '';
}
function getPortuguese(page) {
  return page && typeof page === 'object' ? String(page.portuguese ?? '') : '';
}
function splitSentences(text) {
  return String(text || '').match(/[^.!?]+[.!?]?/g)?.map(sentence => sentence.trim()).filter(Boolean) || [];
}
function matchPair(englishSentence, portugueseSentence, usedPortuguese) {
  const enWords = new Set((englishSentence.match(/[A-Za-zÀ-ÿ’'-]+/g) || []).map(normalizeWord));
  const ptWords = (portugueseSentence.match(/[A-Za-zÀ-ÿ’'-]+/g) || []).map(normalizeWord);
  const matches = [];
  for (const pair of LEARNING_PAIRS) {
    const englishMatch = pair.english.find(word => enWords.has(normalizeWord(word)));
    const portugueseMatch = pair.portuguese.find(word => ptWords.includes(normalizeWord(word)) && !usedPortuguese.has(normalizeWord(word)));
    if (!englishMatch || !portugueseMatch) continue;
    usedPortuguese.add(normalizeWord(portugueseMatch));
    matches.push({ english: englishMatch, portuguese: portugueseMatch });
    if (matches.length >= 3) break;
  }
  return matches;
}
function findLearningItems(english, portuguese) {
  const englishSentences = splitSentences(english);
  const portugueseSentences = splitSentences(portuguese);
  const usedPortuguese = new Set();
  const items = [];
  const sentenceCount = Math.max(englishSentences.length, portugueseSentences.length);

  for (let index = 0; index < sentenceCount; index += 1) {
    const enSentence = englishSentences[index] || englishSentences.at(-1) || english;
    const ptSentence = portugueseSentences[index] || portugueseSentences.at(-1) || portuguese;
    const sentenceItems = matchPair(enSentence, ptSentence, usedPortuguese);
    items.push(...sentenceItems);
  }

  if (items.length < Math.min(4, sentenceCount * 2)) {
    const extra = matchPair(english, portuguese, usedPortuguese);
    items.push(...extra);
  }

  return items.slice(0, 8);
}
function buildPortugueseGapHtml(portuguese, items, solvedCount) {
  const used = new Set();
  return escapeHtml(portuguese).replace(/[A-Za-zÀ-ÿ’'-]+/g, word => {
    const index = items.findIndex((item, itemIndex) => !used.has(itemIndex) && normalizeWord(item.portuguese) === normalizeWord(word));
    if (index < 0) return word;
    used.add(index);
    return index < solvedCount
      ? `<span class="story-gap-solved">${escapeHtml(items[index].portuguese)}</span>`
      : `<span class="story-gap-english">${escapeHtml(items[index].english)}</span>`;
  });
}
async function dissolveElement(element) {
  if (!element) return;
  await nextFrame();
  const animation = element.animate([
    { opacity: 1, filter: 'blur(0)', transform: 'translateY(0) scale(1)' },
    { opacity: .82, offset: .3 },
    { opacity: 0, filter: 'blur(11px)', transform: 'translateY(-18px) scale(.94)' }
  ], { duration: 1900, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
  await animation.finished.catch(() => {});
}

export function renderStory(root, store) {
  const story = STORIES.find(item => item.id === store.getState().selectedStory);
  if (!story) return store.setState({ screen: 'menu' });

  const pages = Array.isArray(story.pages) ? story.pages : [];
  let pageIndex = 0;
  let phaseIndex = 0;
  let runToken = 0;
  let solvedCount = 0;

  const currentPage = () => pages[pageIndex];
  const currentEnglish = () => getEnglish(currentPage());
  const currentPortuguese = () => getPortuguese(currentPage());

  const leave = () => {
    runToken += 1;
    stopSpeech();
    store.setState({ screen: 'menu' });
  };

  const goToPhase = nextPhase => {
    runToken += 1;
    stopSpeech();
    phaseIndex = Math.max(0, Math.min(PHASES.length - 1, nextPhase));
    if (PHASES[phaseIndex] === 'gap') solvedCount = 0;
    showCurrentPhase();
  };

  const navigate = direction => {
    if (direction > 0) {
      if (phaseIndex < PHASES.length - 1) return goToPhase(phaseIndex + 1);
      if (pageIndex < pages.length - 1) {
        pageIndex += 1;
        phaseIndex = 0;
        solvedCount = 0;
        runToken += 1;
        stopSpeech();
        showCurrentPhase();
      }
      return;
    }

    if (phaseIndex > 0) return goToPhase(phaseIndex - 1);
    if (pageIndex > 0) {
      pageIndex -= 1;
      phaseIndex = PHASES.length - 1;
      solvedCount = 0;
      runToken += 1;
      stopSpeech();
      showCurrentPhase();
    }
  };

  const shell = content => {
    const atBeginning = pageIndex === 0 && phaseIndex === 0;
    const atEnd = pageIndex === pages.length - 1 && phaseIndex === PHASES.length - 1;
    root.innerHTML = `<section class="screen story-screen">
      <button class="menu-button" data-menu>Menu</button>
      <button class="story-arrow story-arrow-left" data-step-prev aria-label="Previous learning step" ${atBeginning ? 'disabled' : ''}>←</button>
      <button class="story-arrow story-arrow-right" data-step-next aria-label="Next learning step" ${atEnd ? 'disabled' : ''}>→</button>
      <div class="center story-view">
        <p class="kicker">Story Mode</p>
        <h1>${story.emoji} ${escapeHtml(story.title)}</h1>
        <p class="story-subtitle">${escapeHtml(story.subtitle || '')}</p>
        <p class="story-progress">Page ${pageIndex + 1} / ${pages.length} · Step ${phaseIndex + 1} / ${PHASES.length}</p>
        ${content}
      </div>
    </section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-step-prev]').onclick = () => navigate(-1);
    root.querySelector('[data-step-next]').onclick = () => navigate(1);
  };

  async function showEnglish(token) {
    const english = currentEnglish();
    shell(`<p class="story-phase-label">English</p><p class="story-copy story-intro-text">${escapeHtml(english)}</p>`);
    await nextFrame();
    await speak(english, 'en-GB', { rate: .96, enabled: store.getState().audioOn });
    if (token !== runToken || phaseIndex !== 0) return;
    await dissolveElement(root.querySelector('.story-intro-text'));
    if (token !== runToken || phaseIndex !== 0) return;
    await sleep(300);
    if (token === runToken && phaseIndex === 0) goToPhase(1);
  }

  async function showPortuguese(token) {
    const portuguese = currentPortuguese();
    if (!portuguese) return shell('<div class="story-status-card"><p>Portuguese text is missing for this page.</p></div>');
    const words = portuguese.split(/\s+/).filter(Boolean);
    shell(`<p class="story-phase-label">Portuguese</p><p class="story-copy story-portuguese-copy">${words.map((word, index) => `<span class="story-spoken-word" data-spoken="${index}">${escapeHtml(word)}</span>`).join(' ')}</p>`);
    await nextFrame();
    await speakWithWordHighlight({
      text: portuguese, language: 'pt-PT', rate: .48, enabled: store.getState().audioOn,
      onWord: index => root.querySelectorAll('[data-spoken]').forEach((element, wordIndex) => {
        const active = wordIndex === index;
        element.classList.toggle('is-speaking', active);
        element.style.color = active ? '#65e8ff' : '';
        element.style.transform = active ? 'scale(1.12)' : '';
        element.style.textShadow = active ? '0 0 22px rgba(101,232,255,.95)' : '';
        element.style.background = active ? 'rgba(101,232,255,.10)' : '';
        element.style.borderRadius = active ? '8px' : '';
      })
    });
    if (token !== runToken || phaseIndex !== 1) return;
    await sleep(900);
    await dissolveElement(root.querySelector('.story-portuguese-copy'));
    if (token !== runToken || phaseIndex !== 1) return;
    await sleep(300);
    if (token === runToken && phaseIndex === 1) goToPhase(2);
  }

  function showGap() {
    const english = currentEnglish();
    const portuguese = currentPortuguese();
    const items = findLearningItems(english, portuguese);
    if (!items.length) return goToPhase(3);

    items.forEach(item => recordWordExposure({ ...item, source: 'story', storyId: story.id, pageIndex }));
    shell(`<p class="story-phase-label">Replace the English words with Portuguese</p>
      <p class="story-copy story-gap-copy">${buildPortugueseGapHtml(portuguese, items, solvedCount)}</p>
      <div class="story-word-options">${items.map((item, index) => `<button class="story-word-option" data-option="${index}" ${index < solvedCount ? 'disabled' : ''}>${escapeHtml(item.portuguese)}</button>`).join('')}</div>`);

    root.querySelectorAll('[data-option]').forEach(button => {
      button.onclick = async () => {
        const index = Number(button.dataset.option);
        const selected = items[index];
        const expected = items[solvedCount];
        const correct = index === solvedCount;
        recordWordAnswer({ ...selected, correct, source: 'story', storyId: story.id, pageIndex });
        if (!correct) {
          button.classList.add('is-wrong');
          return window.setTimeout(() => button.classList.remove('is-wrong'), 400);
        }
        await speak(expected.portuguese, 'pt-PT', { rate: .62, enabled: store.getState().audioOn });
        solvedCount += 1;
        if (solvedCount >= items.length) {
          await sleep(700);
          return goToPhase(3);
        }
        showGap();
      };
    });
  }

  async function showReview(token) {
    const english = currentEnglish();
    const portuguese = currentPortuguese();
    const sequence = [
      { label: 'Portuguese', text: portuguese, language: 'pt-PT', rate: .62 },
      { label: 'English', text: english, language: 'en-GB', rate: .96 },
      { label: 'Portuguese', text: portuguese, language: 'pt-PT', rate: .62 }
    ];
    for (const item of sequence) {
      if (token !== runToken || phaseIndex !== 3) return;
      shell(`<p class="story-phase-label">${item.label}</p><p class="story-copy story-dissolve">${escapeHtml(item.text)}</p>`);
      await nextFrame();
      await speak(item.text, item.language, { rate: item.rate, enabled: store.getState().audioOn });
      if (token !== runToken || phaseIndex !== 3) return;
      await dissolveElement(root.querySelector('.story-dissolve'));
      await sleep(250);
    }
    if (token !== runToken || phaseIndex !== 3) return;
    shell(`<p class="story-phase-label">Complete</p><p class="story-copy">${escapeHtml(portuguese)}</p>`);
  }

  function showCurrentPhase() {
    stopSpeech();
    const token = ++runToken;
    const phase = PHASES[phaseIndex];
    if (phase === 'english') return showEnglish(token);
    if (phase === 'portuguese') return showPortuguese(token);
    if (phase === 'gap') return showGap();
    return showReview(token);
  }

  showCurrentPhase();
}
