import { STORIES } from '../data/content.js?v=4';
import { LANGUAGE_OPTIONS } from '../data/language-content-extended.js?v=2';

const MODES = [
  ['emotions', '🧠 Emotions', 'Learn through how you feel today.'],
  ['fill-gap', 'Sentences', 'Complete sentences in your selected learning language.'],
  ['memory', 'Memory', 'Find matching word cards.'],
  ['words', 'Words', 'One word after another.'],
  ['speak-practice', 'Speak & Grow', 'Repeat, retry gently, and always leave with a success.'],
  ['story', 'Story Mode', 'Tiny stories with mother-language clues.']
];

export function renderMenu(root, store) {
  const state = store.getState();
  const languageOptions = LANGUAGE_OPTIONS.map(language => `<option value="${language.code}" ${state.learningLanguage === language.code ? 'selected' : ''}>${language.label}</option>`).join('');
  const nativeOptions = LANGUAGE_OPTIONS.map(language => `<option value="${language.code}" ${state.nativeLanguage === language.code ? 'selected' : ''}>${language.label}</option>`).join('');
  const waitingForStory = state.mode === 'story' && !state.selectedStory;
  const startLabel = state.mode === 'story' ? (waitingForStory ? 'Choose a story first' : '▶ Play Story') : 'Start';

  root.innerHTML = `<section class="screen menu-screen"><div class="menu-panel">
    <h1>Choose your path</h1><p class="muted">Everything runs calmly, one step at a time.</p>
    <h2>Learning Mode</h2><div class="card-grid" data-modes></div>
    ${state.mode === 'story' ? '<h2>Choose a Story</h2><div class="story-grid" data-stories></div>' : ''}
    <h2>Personalise</h2>
    <button class="menu-card effects-menu-card" data-effects><span>✨ Effects</span><small>Choose a separate letter dissolve effect for every mode.</small></button>
    <button class="menu-card future-menu-card" data-future><span>✦ Future SpeakUP</span><small>See what is planned next.</small></button>
    <div class="settings-row"><label>Learning Language<select data-learning>${languageOptions}</select></label><label>Support Language<select data-native>${nativeOptions}</select></label></div>
    <div class="menu-action"><button class="primary-button menu-start-button" data-start ${waitingForStory ? 'disabled' : ''}>${startLabel}</button></div>
  </div></section>`;

  const modes = root.querySelector('[data-modes]');
  MODES.forEach(([id, title, description]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `menu-card ${state.mode === id ? 'selected' : ''}`;
    button.innerHTML = `<span>${title}</span><small>${description}</small>`;
    button.onclick = () => store.setState(current => ({ mode: id, selectedStory: current.selectedStory, currentIndex: 0 }));
    modes.appendChild(button);
  });

  root.querySelector('[data-effects]').onclick = () => store.setState({ screen: 'effects-settings' });
  root.querySelector('[data-future]').onclick = () => store.setState({ screen: 'future' });
  root.querySelector('[data-learning]').onchange = event => {
    const current = store.getState();
    const learningLanguage = event.target.value;
    const nativeLanguage = learningLanguage === current.nativeLanguage ? current.learningLanguage : current.nativeLanguage;
    store.setState({ learningLanguage, nativeLanguage, currentIndex: 0 });
  };
  root.querySelector('[data-native]').onchange = event => {
    const current = store.getState();
    const nativeLanguage = event.target.value;
    const learningLanguage = nativeLanguage === current.learningLanguage ? current.nativeLanguage : current.learningLanguage;
    store.setState({ learningLanguage, nativeLanguage, currentIndex: 0 });
  };

  const stories = root.querySelector('[data-stories]');
  if (stories) STORIES.forEach(story => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `menu-card ${state.selectedStory === story.id ? 'selected' : ''}`;
    button.innerHTML = `<span>${story.emoji} ${story.title}</span><small>${story.subtitle}</small>`;
    button.onclick = () => store.setState({ selectedStory: story.id });
    stories.appendChild(button);
  });

  root.querySelector('[data-start]').onclick = () => {
    const current = store.getState();
    if (current.mode === 'story' && !current.selectedStory) return;
    const screen = current.mode === 'fill-gap' ? 'sentence-level-select' : current.mode;
    store.setState({ screen });
  };
}
