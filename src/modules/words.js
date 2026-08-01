import { WORDS } from '../data/content.js?v=6';
import { speakPair, stopSpeech } from '../audio/speech.js?v=35';

export function renderWords(root, store) {
  const state = store.getState();
  const item = WORDS[state.currentIndex % WORDS.length];
  root.innerHTML = `<section class="screen"><button class="menu-button" data-menu>Menu</button><div class="center"><p class="kicker">Words</p><div class="single-word">${item.pt}</div><div class="translation">${item.en}</div><button class="primary-button" data-next>Next</button></div></section>`;
  root.querySelector('[data-menu]').onclick = () => { stopSpeech(); store.setState({ screen: 'menu', currentIndex: 0 }); };
  root.querySelector('[data-next]').onclick = () => store.setState({ currentIndex: state.currentIndex + 1 });
  speakPair({ text: item.pt, language: 'pt-PT', rate: 0.76 }, { text: item.en, language: 'en-GB', rate: 0.9 }, { enabled: state.audioOn, pause: 320 });
}
