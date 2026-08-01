import { STORIES } from '../data/content.js?v=29';
import { speak, speakWithWordHighlight, stopSpeech } from '../audio/speech.js?v=29';
import { recordWordAnswer, recordWordExposure } from '../learning/progress.js?v=1';

const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));
const nextFrame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const PHASES = ['english', 'portuguese', 'gap', 'review'];
const PAIRS = [
  ['leave|leaves|left', 'sai|saem|sair|deixou|deixam'],
  ['walk|walks|walking|walked', 'caminha|caminham|caminhar|anda|andam|passear|passeia'],
  ['buy|buys|bought', 'compra|compram|comprou|comprar'],
  ['meet|meets|met', 'encontra|encontram|encontrou|encontrar|encontram-se'],
  ['smile|smiles|smiled', 'sorri|sorriem|sorriu'],
  ['begin|begins|started|starts|start', 'começa|começam|começou|começar'],
  ['live|lives|lived', 'vive|vivem|mora|moram'],
  ['carry|carries|carrying', 'leva|levam|carrega|carregam'],
  ['ask|asks|asked', 'pergunta|perguntam|perguntou|perguntar'],
  ['want|wants|wanted', 'quer|querem|queria|querer'],
  ['make|makes|made', 'faz|fazem|fazer|fez|prepara|preparou'],
  ['invite|invites|invited', 'convida|convidam|convidou'],
  ['eat|eats|ate', 'come|comem|comer|comeu'],
  ['accept|accepts|accepted', 'aceita|aceitam|aceitou'],
  ['enter|enters|entered', 'entra|entram|entrou'],
  ['order|orders|ordered', 'pede|pedem|pediu'],
  ['sit|sits|sat', 'senta-se|sentam-se|sentou-se|sentado|sentada'],
  ['stop|stops|stopped', 'para|param|parou'],
  ['look|looks|looked', 'olha|olham|olhou|procura'],
  ['drink|drinks|drank', 'bebe|bebem|bebeu'],
  ['watch|watches|watched', 'observa|observam|viu|vê'],
  ['return|returns|returned', 'regressa|regressam|regressou|volta|voltou'],
  ['open|opens|opened', 'abre|abrem|abriu'],
  ['hear|hears|heard', 'ouve|ouvem|ouviu'],
  ['work|works|worked', 'trabalha|trabalham|trabalhou'],
  ['check|checks|checked', 'verifica|verificam|verificou'],
  ['speak|speaks|spoke|talk|talks|talked', 'fala|falam|falou|conversam|conversa'],
  ['plan|plans|planned', 'planeia|planeiam|planeou'],
  ['jump|jumps|jumped', 'salta|saltam|saltou'],
  ['laugh|laughs|laughed', 'ri|riem|riu|rir'],
  ['call|calls|called', 'chama|chamam|chama-se|telefonou|telefona'],
  ['get up|gets up|wake|wakes', 'levanta-se|acorda|acordam'],
  ['prepare|prepares|prepared', 'prepara|preparam|preparou'],
  ['go|goes|went', 'vai|vão|foi|ir'],
  ['love|loves|like|likes', 'adora|adoram|gosta|gostam'],
  ['say|says|said', 'diz|dizem|disse'],
  ['give|gives|gave', 'dá|dão|deu'],
  ['send|sends|sent', 'manda|mandam|mandou|envia'],
  ['write|writes|wrote', 'escreve|escrevem|escreveu|aponta'],
  ['read|reads|read', 'lê|leem|leu'],
  ['choose|chooses|chose', 'escolhe|escolhem|escolheu'],
  ['pay|pays|paid', 'paga|pagam|pagou'],
  ['find|finds|found', 'encontra|encontram|encontrou|acha'],
  ['wait|waits|waited', 'espera|esperam|esperou'],
  ['help|helps|helped', 'ajuda|ajudam|ajudou'],
  ['close|closes|closed', 'fecha|fecham|fechou'],
  ['rain|rains|raining', 'chuva|chover|chove|está a chover'],
  ['neighbor|neighbour', 'vizinha|vizinho'],
  ['house|home', 'casa'], ['street', 'rua'], ['market', 'mercado'], ['bakery', 'padaria'],
  ['bread', 'pão'], ['morning', 'manhã|manhãs'], ['day', 'dia'], ['building', 'prédio'],
  ['floor', 'andar'], ['different', 'diferente|diferentes'], ['same', 'mesmo|mesma'],
  ['neighborhood|neighbourhood', 'bairro'], ['coffee', 'café'], ['balcony', 'varanda'],
  ['friend', 'amiga|amigo'], ['woman', 'mulher|senhora'], ['man', 'homem|rapaz'],
  ['shop|store', 'loja'], ['school', 'escola'], ['food', 'comida'], ['water', 'água'],
  ['door', 'porta'], ['window|windows', 'janela|janelas'], ['car|cars', 'carro|carros'],
  ['bus', 'autocarro'], ['train', 'comboio'], ['station', 'estação'], ['ticket', 'bilhete'],
  ['bag', 'saco|mala'], ['table', 'mesa'], ['chair', 'cadeira'], ['river', 'rio'],
  ['city', 'cidade'], ['place|places', 'sítio|sítios|lugar|lugares'], ['bookshop', 'livraria'],
  ['cake|cakes', 'bolo|bolos'], ['phone', 'telemóvel'], ['number', 'número'],
  ['concert', 'concerto'], ['weekend', 'fim de semana'], ['weather', 'tempo'],
  ['fruit', 'fruta'], ['vegetables', 'legumes'], ['apple|apples', 'maçã|maçãs'],
  ['tomato|tomatoes', 'tomate|tomates'], ['carrot|carrots', 'cenoura|cenouras'],
  ['banana|bananas', 'banana|bananas'], ['potato|potatoes', 'batata|batatas'],
  ['onion|onions', 'cebola|cebolas'], ['spinach', 'espinafres'], ['soup', 'sopa'],
  ['milk', 'leite'], ['rice', 'arroz'], ['egg|eggs', 'ovo|ovos'], ['yogurt', 'iogurte'],
  ['cheese', 'queijo'], ['hotel|guesthouse', 'hotel|pensão'], ['room', 'quarto'],
  ['beach', 'praia'], ['museum', 'museu'], ['restaurant', 'restaurante'],
  ['lunch', 'almoço'], ['dinner', 'jantar'], ['breakfast', 'pequeno-almoço'],
  ['small', 'pequeno|pequena'], ['big', 'grande'], ['new', 'novo|nova|novos|novas'],
  ['old', 'velho|velha|antigo|antiga'], ['quiet', 'calmo|calma|sossegado|sossegada'],
  ['happy', 'feliz|contente'], ['tired', 'cansado|cansada'], ['free', 'livre'],
  ['empty', 'vazio|vazia'], ['full', 'cheio|cheia'], ['heavy', 'forte|pesado|pesada'],
  ['warm', 'quente'], ['cold', 'frio|fria'], ['beautiful', 'bonito|bonita|lindo|linda'],
  ['good', 'bom|boa'], ['special', 'especial'], ['important', 'importante'],
  ['slowly', 'devagar'], ['quickly', 'depressa|rapidamente'], ['together', 'juntos|juntas'],
  ['today', 'hoje'], ['tomorrow', 'amanhã'], ['Saturday', 'sábado'], ['Sunday', 'domingo']
].map(([english, portuguese]) => ({ english: english.split('|'), portuguese: portuguese.split('|') }));

function normalize(value) {
  return String(value || '').toLocaleLowerCase('pt-PT').replace(/^[^a-zà-ÿ]+|[^a-zà-ÿ]+$/gi, '');
}
function words(text) {
  return (String(text || '').match(/[A-Za-zÀ-ÿ’'-]+/g) || []).map(normalize);
}
function getEnglish(page) {
  if (typeof page === 'string') return page;
  return page && typeof page === 'object' ? String(page.english ?? page.text ?? page.translation ?? '') : '';
}
function getPortuguese(page) {
  return page && typeof page === 'object' ? String(page.portuguese ?? '') : '';
}
function splitSentences(text) {
  return String(text || '').match(/[^.!?]+[.!?]?/g)?.map(item => item.trim()).filter(Boolean) || [];
}
function targetCount(portuguese, sentenceCount) {
  const count = words(portuguese).length;
  if (sentenceCount <= 1 || count < 16) return Math.min(6, Math.max(5, Math.round(count * .35)));
  if (sentenceCount === 2 || count < 30) return Math.min(10, Math.max(8, Math.round(count * .36)));
  return Math.min(14, Math.max(10, Math.round(count * .38)));
}
function collectMatches(englishText, portugueseText, used, limit = Infinity) {
  const en = new Set(words(englishText));
  const pt = words(portugueseText);
  const matches = [];
  for (const pair of PAIRS) {
    const english = pair.english.find(item => en.has(normalize(item)));
    const portuguese = pair.portuguese.find(item => pt.includes(normalize(item)) && !used.has(normalize(item)));
    if (!english || !portuguese) continue;
    used.add(normalize(portuguese));
    matches.push({ english, portuguese });
    if (matches.length >= limit) break;
  }
  return matches;
}
function findLearningItems(english, portuguese) {
  const enSentences = splitSentences(english);
  const ptSentences = splitSentences(portuguese);
  const sentenceCount = Math.max(enSentences.length, ptSentences.length, 1);
  const target = targetCount(portuguese, sentenceCount);
  const used = new Set();
  const result = [];
  const perSentence = Math.max(2, Math.ceil(target / sentenceCount));

  for (let i = 0; i < sentenceCount; i += 1) {
    const en = enSentences[i] || enSentences.at(-1) || english;
    const pt = ptSentences[i] || ptSentences.at(-1) || portuguese;
    result.push(...collectMatches(en, pt, used, perSentence));
  }
  if (result.length < target) result.push(...collectMatches(english, portuguese, used, target - result.length));
  return result.slice(0, target);
}
function buildGapHtml(portuguese, items, solvedCount) {
  const used = new Set();
  return escapeHtml(portuguese).replace(/[A-Za-zÀ-ÿ’'-]+/g, word => {
    const index = items.findIndex((item, i) => !used.has(i) && normalize(item.portuguese) === normalize(word));
    if (index < 0) return word;
    used.add(index);
    return index < solvedCount
      ? `<span class="story-gap-solved">${escapeHtml(items[index].portuguese)}</span>`
      : `<span class="story-gap-english">${escapeHtml(items[index].english)}</span>`;
  });
}
async function dissolve(element) {
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
  const english = () => getEnglish(currentPage());
  const portuguese = () => getPortuguese(currentPage());
  const leave = () => { runToken += 1; stopSpeech(); store.setState({ screen: 'menu' }); };

  function shell(content) {
    const atBeginning = pageIndex === 0 && phaseIndex === 0;
    const atEnd = pageIndex === pages.length - 1 && phaseIndex === PHASES.length - 1;
    root.innerHTML = `<section class="screen story-screen">
      <button class="menu-button" data-menu>Menu</button>
      <button class="story-arrow story-arrow-left" data-prev ${atBeginning ? 'disabled' : ''}>←</button>
      <button class="story-arrow story-arrow-right" data-next ${atEnd ? 'disabled' : ''}>→</button>
      <div class="center story-view">
        <p class="kicker">Story Mode</p><h1>${story.emoji} ${escapeHtml(story.title)}</h1>
        <p class="story-subtitle">${escapeHtml(story.subtitle || '')}</p>
        <p class="story-progress">Page ${pageIndex + 1} / ${pages.length} · Step ${phaseIndex + 1} / ${PHASES.length}</p>
        ${content}
      </div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-prev]').onclick = () => navigate(-1);
    root.querySelector('[data-next]').onclick = () => navigate(1);
  }
  function goToPhase(next) {
    runToken += 1; stopSpeech(); phaseIndex = Math.max(0, Math.min(3, next));
    if (phaseIndex === 2) solvedCount = 0;
    showCurrentPhase();
  }
  function navigate(direction) {
    if (direction > 0) {
      if (phaseIndex < 3) return goToPhase(phaseIndex + 1);
      if (pageIndex < pages.length - 1) { pageIndex += 1; phaseIndex = 0; solvedCount = 0; runToken += 1; stopSpeech(); showCurrentPhase(); }
      return;
    }
    if (phaseIndex > 0) return goToPhase(phaseIndex - 1);
    if (pageIndex > 0) { pageIndex -= 1; phaseIndex = 3; solvedCount = 0; runToken += 1; stopSpeech(); showCurrentPhase(); }
  }
  async function showEnglish(token) {
    shell(`<p class="story-phase-label">English</p><p class="story-copy story-intro-text">${escapeHtml(english())}</p>`);
    await nextFrame();
    await speak(english(), 'en-GB', { rate: .96, enabled: store.getState().audioOn });
    if (token !== runToken || phaseIndex !== 0) return;
    await dissolve(root.querySelector('.story-intro-text'));
    if (token === runToken && phaseIndex === 0) { await sleep(300); goToPhase(1); }
  }
  async function showPortuguese(token) {
    const text = portuguese();
    if (!text) return shell('<div class="story-status-card"><p>Portuguese text is missing for this page.</p></div>');
    const list = text.split(/\s+/).filter(Boolean);
    shell(`<p class="story-phase-label">Portuguese</p><p class="story-copy story-portuguese-copy">${list.map((word, i) => `<span class="story-spoken-word" data-spoken="${i}">${escapeHtml(word)}</span>`).join(' ')}</p>`);
    await nextFrame();
    await speakWithWordHighlight({ text, language: 'pt-PT', rate: .48, enabled: store.getState().audioOn,
      onWord: index => root.querySelectorAll('[data-spoken]').forEach((el, i) => {
        const active = i === index;
        el.classList.toggle('is-speaking', active);
        el.style.color = active ? '#65e8ff' : '';
        el.style.transform = active ? 'scale(1.12)' : '';
        el.style.textShadow = active ? '0 0 22px rgba(101,232,255,.95)' : '';
        el.style.background = active ? 'rgba(101,232,255,.10)' : '';
        el.style.borderRadius = active ? '8px' : '';
      }) });
    if (token !== runToken || phaseIndex !== 1) return;
    await sleep(900); await dissolve(root.querySelector('.story-portuguese-copy'));
    if (token === runToken && phaseIndex === 1) { await sleep(300); goToPhase(2); }
  }
  function showGap() {
    const items = findLearningItems(english(), portuguese());
    if (!items.length) return goToPhase(3);
    items.forEach(item => recordWordExposure({ ...item, source: 'story', storyId: story.id, pageIndex }));
    shell(`<p class="story-phase-label">Replace the English words with Portuguese · ${items.length} words</p>
      <p class="story-copy story-gap-copy">${buildGapHtml(portuguese(), items, solvedCount)}</p>
      <div class="story-word-options">${items.map((item, i) => `<button class="story-word-option" data-option="${i}" ${i < solvedCount ? 'disabled' : ''}>${escapeHtml(item.portuguese)}</button>`).join('')}</div>`);
    root.querySelectorAll('[data-option]').forEach(button => button.onclick = async () => {
      const index = Number(button.dataset.option);
      const selected = items[index];
      const expected = items[solvedCount];
      const correct = index === solvedCount;
      recordWordAnswer({ ...selected, correct, source: 'story', storyId: story.id, pageIndex });
      if (!correct) { button.classList.add('is-wrong'); return window.setTimeout(() => button.classList.remove('is-wrong'), 400); }
      await speak(expected.portuguese, 'pt-PT', { rate: .62, enabled: store.getState().audioOn });
      solvedCount += 1;
      if (solvedCount >= items.length) { await sleep(700); return goToPhase(3); }
      showGap();
    });
  }
  async function showReview(token) {
    const sequence = [
      { label: 'Portuguese', text: portuguese(), language: 'pt-PT', rate: .62 },
      { label: 'English', text: english(), language: 'en-GB', rate: .96 },
      { label: 'Portuguese', text: portuguese(), language: 'pt-PT', rate: .62 }
    ];
    for (const item of sequence) {
      if (token !== runToken || phaseIndex !== 3) return;
      shell(`<p class="story-phase-label">${item.label}</p><p class="story-copy story-dissolve">${escapeHtml(item.text)}</p>`);
      await nextFrame(); await speak(item.text, item.language, { rate: item.rate, enabled: store.getState().audioOn });
      if (token !== runToken || phaseIndex !== 3) return;
      await dissolve(root.querySelector('.story-dissolve')); await sleep(250);
    }
    if (token === runToken && phaseIndex === 3) shell(`<p class="story-phase-label">Complete</p><p class="story-copy">${escapeHtml(portuguese())}</p>`);
  }
  function showCurrentPhase() {
    stopSpeech();
    const token = ++runToken;
    if (phaseIndex === 0) return showEnglish(token);
    if (phaseIndex === 1) return showPortuguese(token);
    if (phaseIndex === 2) return showGap();
    return showReview(token);
  }
  showCurrentPhase();
}
