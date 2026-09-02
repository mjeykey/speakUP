import { getSentenceLevels, getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getExerciseUiCopy } from '../app/ui-language.js?v=3';

function fillAnswers(sentence, answers) {
  let index = 0;
  return String(sentence).replace(/_____/g, () => answers[index++] || '');
}

export function renderSpeakPractice(root, store) {
  const state = store.getState();
  const ui = getExerciseUiCopy(state.nativeLanguage);
  const levels = getSentenceLevels(state.learningLanguage, state.nativeLanguage);
  const items = levels.flatMap(level => level.items.map(item => ({
    sentence: fillAnswers(item.sentence, item.answers),
    translation: item.translation
  })));
  const progressKey = `${state.learningLanguage}|${state.nativeLanguage}`;
  const saved = state.progress?.speakPractice?.[progressKey] || {};
  let index = Math.min(Math.max(Number(saved.currentIndex) || 0, 0), Math.max(0, items.length - 1));
  const voice = getSpeechLanguage(state.learningLanguage);

  const save = () => store.saveProgress?.('speakPractice', progressKey, {
    currentIndex:index,
    learningLanguage:state.learningLanguage,
    nativeLanguage:state.nativeLanguage,
    total:items.length
  });
  const leave = () => { stopSpeech(); save(); store.setState({ screen:'menu' }); };

  function draw() {
    const item = items[index];
    root.innerHTML = `<section class="screen speak-practice-screen">
      <button class="menu-button" data-menu>${ui.menu}</button>
      <div class="center speak-practice-view">
        <p class="kicker">${ui.speaking} · ${languageName(state.learningLanguage)} · ${index + 1}/${items.length}</p>
        <p class="sentence">${item.sentence}</p>
        <p class="translation">${item.translation}</p>
        <div class="communication-actions">
          <button class="secondary-button" data-listen>🔊 ${ui.listen}</button>
          <button class="primary-button" data-next>${ui.next}</button>
        </div>
      </div>
    </section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-listen]').onclick = () => speak(item.sentence, voice, { enabled:state.audioOn, rate:.68 }).catch(() => {});
    root.querySelector('[data-next]').onclick = () => {
      stopSpeech();
      index = (index + 1) % items.length;
      save();
      draw();
    };
    window.setTimeout(() => speak(item.sentence, voice, { enabled:state.audioOn, rate:.68 }).catch(() => {}), 180);
  }

  draw();
}
