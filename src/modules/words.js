import { getWords, getSpeechLanguage, languageName } from '../data/language-content.js?v=2';
import { speakPair, stopSpeech } from '../audio/speech.js?v=39';
import { explodeText, getModeTextEffect } from '../effects/text-effects.js?v=2';

export function renderWords(root, store) {
  const state = store.getState();
  const words = getWords(state.learningLanguage, state.nativeLanguage);
  const item = words[state.currentIndex % words.length];
  let moving = false;

  root.innerHTML = `<section class="screen words-screen">
    <button class="menu-button" data-menu>Menu</button>
    <div class="center words-view">
      <p class="kicker">Words · ${languageName(state.learningLanguage)}</p>
      <div class="words-stage" data-stage>
        <div class="single-word" data-effect-text>${item.target}</div>
        <div class="translation" data-effect-text>${item.translation}</div>
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
    { text: item.target, language: getSpeechLanguage(state.learningLanguage), rate: state.learningLanguage === 'de-DE' ? 0.72 : 0.76 },
    { text: item.translation, language: getSpeechLanguage(state.nativeLanguage), rate: 0.88 },
    { enabled: state.audioOn, pause: 320 }
  );
}
