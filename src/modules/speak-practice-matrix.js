import { getSentenceLevels, getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=60';

function fillAnswers(sentence, answers) {
  let index = 0;
  return String(sentence).replace(/_____/g, () => answers[index++] || '');
}

export function renderSpeakPractice(root, store) {
  const state = store.getState();
  const levels = getSentenceLevels(state.learningLanguage, state.nativeLanguage);
  const items = levels.flatMap(level => level.items.map(item => ({
    sentence: fillAnswers(item.sentence, item.answers),
    translation: item.translation
  })));
  let index = Math.min(state.currentIndex || 0, Math.max(0, items.length - 1));
  const voice = getSpeechLanguage(state.learningLanguage);

  const leave = () => { stopSpeech(); store.setState({ screen:'menu', currentIndex:0 }); };

  function draw() {
    const item = items[index];
    root.innerHTML = `<section class="screen speak-practice-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="center speak-practice-view">
        <p class="kicker">Sprechen · ${languageName(state.learningLanguage)} · ${index + 1}/${items.length}</p>
        <p class="sentence">${item.sentence}</p>
        <p class="translation">${item.translation}</p>
        <div class="communication-actions">
          <button class="secondary-button" data-listen>🔊 Anhören</button>
          <button class="primary-button" data-next>Weiter</button>
        </div>
      </div>
    </section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-listen]').onclick = () => speak(item.sentence, voice, { enabled:state.audioOn, rate:.68 }).catch(() => {});
    root.querySelector('[data-next]').onclick = () => { stopSpeech(); index = (index + 1) % items.length; draw(); };
    window.setTimeout(() => speak(item.sentence, voice, { enabled:state.audioOn, rate:.68 }).catch(() => {}), 180);
  }

  draw();
}
