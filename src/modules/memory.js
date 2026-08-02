import { speak, stopSpeech } from '../audio/speech.js?v=54';
import { languageName } from '../data/language-content-extended.js?v=2';
import { getMemoryMessages, memoryText, memorySentence, memorySpeechLanguage } from '../data/memory/multilingual-memory.js?v=1';

const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));
const shuffle = items => [...items].sort(() => Math.random() - 0.5);

async function dissolve(element) {
  if (!element) return;
  const animation = element.animate([
    { opacity: 1, filter: 'blur(0)', transform: 'translateY(0) scale(1)' },
    { opacity: .9, offset: .35 },
    { opacity: 0, filter: 'blur(12px)', transform: 'translateY(-20px) scale(.95)' }
  ], { duration: 2100, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
  await animation.finished.catch(() => {});
}

export function renderMemory(root, store) {
  const state = store.getState();
  const learningLanguage = state.learningLanguage;
  const nativeLanguage = state.nativeLanguage;
  const messages = getMemoryMessages();
  const pairs = shuffle(messages).slice(0, 2).map((item, pair) => ({ ...item, pair }));
  const cards = shuffle(pairs.flatMap(item => [
    {
      id: `${item.pair}-learning`,
      pair: item.pair,
      text: memoryText(item, learningLanguage),
      language: memorySpeechLanguage(learningLanguage),
      item
    },
    {
      id: `${item.pair}-native`,
      pair: item.pair,
      text: memoryText(item, nativeLanguage),
      language: memorySpeechLanguage(nativeLanguage),
      item
    }
  ]));

  let first = null;
  let locked = false;
  const matched = new Set();

  root.innerHTML = `<section class="screen memory-screen">
    <button class="menu-button" data-menu>Menu</button>
    <div class="center memory-view">
      <p class="kicker">memORy</p>
      <h1>A little kindness for today</h1>
      <p class="memory-intro">Find two ${languageName(learningLanguage)}–${languageName(nativeLanguage)} pairs and discover today’s messages.</p>
      <div class="memory-grid positive-memory-grid" data-grid></div>
      <div class="memory-message-stage" data-stage aria-live="polite"></div>
      <div class="memory-actions" data-actions hidden>
        <button class="primary-button" data-next-round>New messages</button>
      </div>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => {
    stopSpeech();
    store.setState({ screen: 'menu' });
  };

  const grid = root.querySelector('[data-grid]');
  const stage = root.querySelector('[data-stage]');

  const showMessage = async item => {
    locked = true;
    const learningWord = memoryText(item, learningLanguage);
    const nativeWord = memoryText(item, nativeLanguage);
    const learningSentence = memorySentence(item, learningLanguage);
    const nativeSentence = memorySentence(item, nativeLanguage);

    stage.innerHTML = `<div class="memory-message-card">
      <div class="memory-message-icon">${item.emoji}</div>
      <p class="memory-message-topic">${learningWord} · ${nativeWord}</p>
      <p class="memory-message-text" data-message-text>${learningSentence}</p>
    </div>`;
    await speak(learningSentence, memorySpeechLanguage(learningLanguage), {
      enabled: store.getState().audioOn,
      rate: learningLanguage.startsWith('pt') || learningLanguage.startsWith('fr') ? .62 : .78
    });
    await sleep(500);
    await dissolve(stage.querySelector('[data-message-text]'));

    stage.innerHTML = `<div class="memory-message-card">
      <div class="memory-message-icon">${item.emoji}</div>
      <p class="memory-message-topic">${learningWord} · ${nativeWord}</p>
      <p class="memory-message-text memory-message-english" data-message-text>${nativeSentence}</p>
    </div>`;
    await speak(nativeSentence, memorySpeechLanguage(nativeLanguage), {
      enabled: store.getState().audioOn,
      rate: nativeLanguage.startsWith('pt') || nativeLanguage.startsWith('fr') ? .62 : .86
    });
    await sleep(500);
    await dissolve(stage.querySelector('[data-message-text]'));
    stage.innerHTML = '';
    locked = false;

    if (matched.size === pairs.length) {
      root.querySelector('[data-actions]').hidden = false;
    }
  };

  cards.forEach(card => {
    const button = document.createElement('button');
    button.className = 'memory-card positive-memory-card';
    button.innerHTML = '<span class="memory-card-back">✦</span>';

    button.onclick = async () => {
      if (locked || matched.has(card.pair) || button.classList.contains('open')) return;
      button.classList.add('open');
      button.innerHTML = `<span class="memory-card-emoji">${card.item.emoji}</span><span class="memory-card-word">${card.text}</span>`;
      await speak(card.text, card.language, {
        enabled: store.getState().audioOn,
        rate: card.language.startsWith('pt') || card.language.startsWith('fr') ? .68 : .88
      });

      if (!first) {
        first = { card, button };
        return;
      }

      if (first.card.pair === card.pair) {
        matched.add(card.pair);
        first.button.classList.add('matched');
        button.classList.add('matched');
        const item = card.item;
        first = null;
        await sleep(350);
        await showMessage(item);
        return;
      }

      locked = true;
      window.setTimeout(() => {
        first.button.classList.remove('open');
        first.button.innerHTML = '<span class="memory-card-back">✦</span>';
        button.classList.remove('open');
        button.innerHTML = '<span class="memory-card-back">✦</span>';
        first = null;
        locked = false;
      }, 800);
    };

    grid.appendChild(button);
  });

  root.querySelector('[data-next-round]').onclick = () => {
    stopSpeech();
    renderMemory(root, store);
  };
}
