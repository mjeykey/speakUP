import { STORIES } from '../data/content.js?v=4';
import { LANGUAGE_OPTIONS } from '../data/language-content.js?v=1';

const MODES = [
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
  const storyAvailable = state.learningLanguage === 'pt-PT';

  root.innerHTML = `<section class="screen menu-screen"><div class="menu-panel">
    <h1>Choose your path</h1><p class="muted">Everything runs calmly, one step at a time.</p>
    <h2>Learning Mode</h2><div class="card-grid" data-modes></div>
    ${state.mode === 'story' && storyAvailable ? '<h2>Choose a Story</h2><div class="story-grid" data-stories></div>' : ''}
    ${state.mode === 'story' && !storyAvailable ? '<p class="muted">German and English stories are being prepared. Words and Sentences are already available.</p>' : ''}
    <h2>Personalise</h2>
    <button class="menu-card effects-menu-card" data-effects><span>✨ Effects</span><small>Choose a separate letter dissolve effect for every mode.</small></button>
    <div class="settings-row">
      <label>Learning Language<select data-learning>${languageOptions}</select></label>
      <label>Support Language<select data-native>${nativeOptions}</select></label>
    </div>
    <div class="menu-action" data-action></div>
  </div></section>`;

  const modes = root.querySelector('[data-modes]');
  MODES.forEach(([id, title, description]) => {
    const button = document.createElement('button');
    const disabled = id === 'story' && !storyAvailable;
    button.className = `menu-card ${state.mode === id ? 'selected' : ''}`;
    button.disabled = disabled;
    button.innerHTML = `<span>${title}</span><small>${disabled ? 'Available for Portuguese in this prototype.' : description}</small>`;
    button.onclick = () => store.setState({ mode: id, selectedStory: id === 'story' ? null : state.selectedStory, currentIndex: 0 });
    modes.appendChild(button);
  });

  root.querySelector('[data-effects]').onclick = () => store.setState({ screen: 'effects-settings' });
  root.querySelector('[data-learning]').onchange = event => {
    const learningLanguage = event.target.value;
    const nativeLanguage = learningLanguage === state.nativeLanguage
      ? (learningLanguage === 'en-GB' ? 'de-DE' : 'en-GB')
      : state.nativeLanguage;
    store.setState({ learningLanguage, nativeLanguage, selectedStory: null, currentIndex: 0, mode: learningLanguage === 'pt-PT' ? state.mode : (state.mode === 'story' ? 'words' : state.mode) });
  };
  root.querySelector('[data-native]').onchange = event => {
    const nativeLanguage = event.target.value;
    if (nativeLanguage === state.learningLanguage) return;
    store.setState({ nativeLanguage, currentIndex: 0 });
  };

  const stories = root.querySelector('[data-stories]');
  if (stories) STORIES.forEach(story => {
    const button = document.createElement('button');
    button.className = `menu-card ${state.selectedStory === story.id ? 'selected' : ''}`;
    button.innerHTML = `<span>${story.emoji} ${story.title}</span><small>${story.subtitle}</small>`;
    button.onclick = () => store.setState({ selectedStory: story.id });
    stories.appendChild(button);
  });

  const canStart = state.mode !== 'story' || Boolean(state.selectedStory);
  if (canStart) {
    const start = document.createElement('button');
    start.className = 'primary-button';
    start.textContent = state.mode === 'story' ? '▶ Play Story' : 'Start';
    start.onclick = () => store.setState({ screen: state.mode });
    root.querySelector('[data-action]').appendChild(start);
  }
}
