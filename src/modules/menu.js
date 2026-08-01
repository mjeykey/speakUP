import { STORIES } from '../data/content.js?v=4';

const MODES = [
  ['fill-gap', 'Fill Gap', 'Complete calm sentences in your learning language.'],
  ['memory', 'Memory', 'Find matching word cards.'],
  ['words', 'Words', 'One word after another.'],
  ['speak-practice', 'Speak & Grow', 'Repeat, retry gently, and always leave with a success.'],
  ['story', 'Story Mode', 'Tiny stories with mother-language clues.']
];

export function renderMenu(root, store) {
  const state = store.getState();
  root.innerHTML = `<section class="screen menu-screen"><div class="menu-panel">
    <h1>Choose your path</h1><p class="muted">Everything runs calmly, one step at a time.</p>
    <h2>Learning Mode</h2><div class="card-grid" data-modes></div>
    ${state.mode === 'story' ? '<h2>Choose a Story</h2><div class="story-grid" data-stories></div>' : ''}
    <div class="settings-row"><label>Learning Language<select data-learning><option value="pt-PT">Portuguese</option></select></label><label>Mother Language<select data-native><option value="en-GB">English</option></select></label></div>
    <div class="menu-action" data-action></div>
  </div></section>`;

  const modes = root.querySelector('[data-modes]');
  MODES.forEach(([id, title, description]) => {
    const button = document.createElement('button');
    button.className = `menu-card ${state.mode === id ? 'selected' : ''}`;
    button.innerHTML = `<span>${title}</span><small>${description}</small>`;
    button.onclick = () => store.setState({ mode: id, selectedStory: id === 'story' ? null : state.selectedStory });
    modes.appendChild(button);
  });

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
