import { GAPS } from '../data/content.js';
import { speak, speakPair, stopSpeech } from '../audio/speech.js';

export function renderFillGap(root, store) {
  const state = store.getState();
  const item = GAPS[state.currentIndex % GAPS.length];
  root.innerHTML = `<section class="screen"><button class="menu-button" data-menu>Menu</button><div class="center"><p class="kicker">Fill Gap</p><div class="sentence">${item.sentence}</div><div class="choices" data-choices></div><p class="feedback" data-feedback></p></div></section>`;
  root.querySelector('[data-menu]').onclick = () => { stopSpeech(); store.setState({ screen: 'menu', currentIndex: 0 }); };
  const choices = root.querySelector('[data-choices]');
  item.options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.textContent = option;
    button.onclick = async () => {
      if (option !== item.answer) { root.querySelector('[data-feedback]').textContent = 'Try again'; return; }
      root.querySelector('.sentence').textContent = item.sentence.replace('_____', item.answer);
      root.querySelector('[data-feedback]').textContent = 'Correct';
      await speak(item.answer, 'pt-PT', { enabled: state.audioOn, rate: 0.72 });
      await speakPair({ text: item.sentence.replace('_____', item.answer), language: 'pt-PT', rate: 0.7 }, { text: item.english, language: 'en-GB', rate: 0.9 }, { enabled: state.audioOn, pause: 360 });
      store.setState({ currentIndex: state.currentIndex + 1 });
    };
    choices.appendChild(button);
  });
}
