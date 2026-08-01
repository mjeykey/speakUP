import { WORDS } from '../data/content.js?v=6';
import { speakPair, stopSpeech } from '../audio/speech.js?v=38';
import { explodeText, getModeTextEffect } from '../effects/text-effects.js?v=2';

export function renderWords(root, store) {
  const state = store.getState();
  const item = WORDS[state.currentIndex % WORDS.length];
  let moving = false;

  root.innerHTML = `<section class="screen words-screen">
    <button class="menu-button" data-menu>Menu</button>
    <div class="center words-view">
      <p class="kicker">Words</p>
      <div class="words-stage" data-stage>
        <div class="single-word" data-effect-text>${item.pt}</div>
        <div class="translation" data-effect-text>${item.en}</div>
      </div>
      <button class="primary-button" data-next>Next</button>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => {
    stopSpeech();
    store.setState({ screen: 'menu', currentIndex: 0 });
  };

  root.querySelector('[data-next]').onclick = async () => {
    if (moving) return;
    moving = true;
    stopSpeech();
    await explodeText(
      Array.from(root.querySelectorAll('[data-effect-text]')),
      getModeTextEffect('words'),
      { duration: 1750, stagger: 24 }
    );
    store.setState({ currentIndex: state.currentIndex + 1 });
  };

  speakPair(
    { text: item.pt, language: 'pt-PT', rate: 0.76 },
    { text: item.en, language: 'en-GB', rate: 0.9 },
    { enabled: state.audioOn, pause: 320 }
  );
}
