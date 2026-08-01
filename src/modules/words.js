import { WORDS } from '../data/content.js?v=6';
import { speakPair, stopSpeech } from '../audio/speech.js?v=36';
import { TEXT_EFFECTS, explodeText, getTextEffect, setTextEffect } from '../effects/text-effects.js?v=1';

export function renderWords(root, store) {
  const state = store.getState();
  const item = WORDS[state.currentIndex % WORDS.length];
  let effect = getTextEffect();
  let moving = false;

  root.innerHTML = `<section class="screen words-screen">
    <button class="menu-button" data-menu>Menu</button>
    <div class="center words-view">
      <p class="kicker">Words</p>
      <div class="words-stage" data-stage>
        <div class="single-word" data-effect-text>${item.pt}</div>
        <div class="translation" data-effect-text>${item.en}</div>
      </div>
      <div class="word-effect-picker" aria-label="Word dissolve effect">
        <span>Effect</span>
        <div class="word-effect-options">
          ${TEXT_EFFECTS.map(option => `<button class="word-effect-option ${option.id === effect ? 'selected' : ''}" data-effect="${option.id}">${option.label}</button>`).join('')}
        </div>
      </div>
      <button class="primary-button" data-next>Next</button>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => {
    stopSpeech();
    store.setState({ screen: 'menu', currentIndex: 0 });
  };

  root.querySelectorAll('[data-effect]').forEach(button => {
    button.onclick = () => {
      effect = button.dataset.effect;
      setTextEffect(effect);
      root.querySelectorAll('[data-effect]').forEach(itemButton => itemButton.classList.toggle('selected', itemButton === button));
    };
  });

  root.querySelector('[data-next]').onclick = async () => {
    if (moving) return;
    moving = true;
    stopSpeech();
    await explodeText(Array.from(root.querySelectorAll('[data-effect-text]')), effect, { duration: 1500, stagger: 22 });
    store.setState({ currentIndex: state.currentIndex + 1 });
  };

  speakPair(
    { text: item.pt, language: 'pt-PT', rate: 0.76 },
    { text: item.en, language: 'en-GB', rate: 0.9 },
    { enabled: state.audioOn, pause: 320 }
  );
}
