import { getWords, getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';
import { speakPair, stopSpeech } from '../audio/speech.js?v=61';
import { getExerciseUiCopy } from '../app/ui-language.js?v=2';

export function renderWords(root, store) {
  const state = store.getState();
  const ui = getExerciseUiCopy(state.nativeLanguage);
  const words = getWords(state.learningLanguage, state.nativeLanguage);
  const progressKey = `${state.learningLanguage}|${state.nativeLanguage}`;
  const saved = state.progress?.words?.[progressKey] || {};
  const currentIndex = Math.max(Number(saved.currentIndex) || 0, 0);
  const item = words[currentIndex % words.length];

  root.innerHTML = `<section class="screen words-screen">
    <button class="menu-button" data-menu>${ui.menu}</button>
    <div class="center words-view">
      <p class="kicker">${ui.words} · ${languageName(state.learningLanguage)}</p>
      <div class="words-stage"><div class="single-word">${item.target}</div><div class="translation">${item.translation}</div></div>
      <button class="primary-button" data-next>${ui.next}</button>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => { stopSpeech(); store.setState({ screen:'menu' }); };
  root.querySelector('[data-next]').onclick = () => {
    store.updateProgress('words', progressKey, {
      currentIndex: currentIndex + 1,
      viewed: Math.min(currentIndex + 1, words.length),
      total: words.length,
      learningLanguage: state.learningLanguage,
      nativeLanguage: state.nativeLanguage
    });
  };

  speakPair(
    { text:item.target, language:getSpeechLanguage(state.learningLanguage), rate:.74 },
    { text:item.translation, language:getSpeechLanguage(state.nativeLanguage), rate:.86 },
    { enabled:state.audioOn, pause:300 }
  ).catch(() => {});
}
