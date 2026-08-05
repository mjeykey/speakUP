import { speak, stopSpeech } from '../audio/speech.js?v=58';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { getExpandedPositiveContent } from '../data/positive-learning/expanded-content.js?v=1';
import { POSITIVE_SECTIONS, getPositiveCollection, getPositiveItem } from '../data/positive-learning/sections.js?v=2';

export function renderPositiveLearning(root, store) {
  const state = store.getState();
  const section = state.positiveSection || 'sentences';
  const index = state.positiveIndex || 0;
  const data = getExpandedPositiveContent(state.learningLanguage);
  const collection = getPositiveCollection(section, data);
  const text = getPositiveItem(section, index, data);

  root.innerHTML = `<section class="screen">
    <button class="menu-button" data-menu>Menu</button>
    <div class="center">
      <p class="kicker">Positive Learning · ${languageName(state.learningLanguage)}</p>
      <div class="choice-row">
        ${POSITIVE_SECTIONS.map(([id, label]) => `<button class="choice ${section === id ? 'selected' : ''}" data-section="${id}">${label}</button>`).join('')}
      </div>
      <div class="learning-sentence" style="min-height:260px">${text}</div>
      <div class="choice-row">
        <button class="primary-button" data-audio>▶ Anhören</button>
        <button class="primary-button" data-next>Weiter</button>
      </div>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => {
    stopSpeech();
    store.setState({ screen: 'menu' });
  };

  root.querySelectorAll('[data-section]').forEach(button => {
    button.onclick = () => store.setState({
      positiveSection: button.dataset.section,
      positiveIndex: 0
    });
  });

  root.querySelector('[data-audio]').onclick = () => speak(text, {
    language: getSpeechLanguage(state.learningLanguage),
    rate: .78
  });

  root.querySelector('[data-next]').onclick = () => store.setState({
    positiveIndex: (index + 1) % Math.max(collection.length, 1)
  });

  if (section === 'listening' || section === 'pronunciation') {
    speak(text, {
      language: getSpeechLanguage(state.learningLanguage),
      rate: .76
    });
  }
}
