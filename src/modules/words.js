import { getWords, getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { speakPair, stopSpeech } from '../audio/speech.js?v=60';
import { explodeText, getModeTextEffect } from '../effects/distinct-text-effects.js?v=1';

export function renderWords(root, store) {
  const state = store.getState();
  const words = getWords(state.learningLanguage, state.nativeLanguage);
  const progressKey = [state.learningLanguage, state.nativeLanguage].join('|');
  const saved = state.progress?.words?.[progressKey] || {};
  const currentIndex = Math.max(Number(saved.currentIndex) || 0, 0);
  const item = words[currentIndex % words.length];
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
    store.setState({ screen: 'menu' });
  };

  root.querySelector('[data-next]').onclick = async () => {
    if (moving) return;
    moving = true;
    stopSpeech();

    try {
      await explodeText(
        Array.from(root.querySelectorAll('[data-effect-text]')),
        getModeTextEffect('words'),
        { duration: 1750, stagger: 24 }
      );
    } catch (error) {
      console.warn('Word effect failed; continuing to next word.', error);
    } finally {
      store.updateProgress('words', progressKey, {
        currentIndex: currentIndex + 1,
        viewed: Math.min(currentIndex + 1, words.length),
        total: words.length,
        learningLanguage: state.learningLanguage,
        nativeLanguage: state.nativeLanguage
      });
    }
  };

  const learningRate = state.learningLanguage === 'de-DE'
    ? 0.72
    : state.learningLanguage.startsWith('es-')
      ? 0.74
      : state.learningLanguage.startsWith('hr-')
        ? 0.72
        : state.learningLanguage === 'fr-FR'
          ? 0.7
          : 0.76;

  speakPair(
    { text: item.target, language: getSpeechLanguage(state.learningLanguage), rate: learningRate },
    { text: item.translation, language: getSpeechLanguage(state.nativeLanguage), rate: 0.88 },
    { enabled: state.audioOn, pause: 320 }
  ).catch(error => console.warn('Word audio could not play.', error));
}
