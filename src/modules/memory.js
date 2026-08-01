import { WORDS } from '../data/content.js';
import { speak, stopSpeech } from '../audio/speech.js';

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function renderMemory(root, store) {
  const pairs = WORDS.slice(0, 4);
  const cards = shuffle(pairs.flatMap((item, pair) => [
    { id: `${pair}-pt`, pair, text: item.pt, language: 'pt-PT' },
    { id: `${pair}-en`, pair, text: item.en, language: 'en-GB' }
  ]));
  let first = null;
  let locked = false;
  const matched = new Set();

  root.innerHTML = `<section class="screen"><button class="menu-button" data-menu>Menu</button><div class="center"><p class="kicker">Memory</p><div class="memory-grid" data-grid></div><p class="feedback" data-feedback></p></div></section>`;
  root.querySelector('[data-menu]').onclick = () => { stopSpeech(); store.setState({ screen: 'menu' }); };
  const grid = root.querySelector('[data-grid]');

  cards.forEach(card => {
    const button = document.createElement('button');
    button.className = 'memory-card';
    button.textContent = '?';
    button.onclick = async () => {
      if (locked || matched.has(card.pair) || button.classList.contains('open')) return;
      button.classList.add('open');
      button.textContent = card.text;
      await speak(card.text, card.language, { enabled: store.getState().audioOn, rate: card.language.startsWith('pt') ? 0.75 : 0.9 });
      if (!first) { first = { card, button }; return; }
      if (first.card.pair === card.pair) {
        matched.add(card.pair);
        first.button.classList.add('matched');
        button.classList.add('matched');
        first = null;
        if (matched.size === pairs.length) root.querySelector('[data-feedback]').textContent = 'Memory complete';
        return;
      }
      locked = true;
      window.setTimeout(() => {
        first.button.classList.remove('open');
        first.button.textContent = '?';
        button.classList.remove('open');
        button.textContent = '?';
        first = null;
        locked = false;
      }, 650);
    };
    grid.appendChild(button);
  });
}
