import { getSentenceLevelCopy } from '../app/ui-language.js?v=3';

const LEVEL_IDS = [
  { id: 'beginner', emoji: '🌱' },
  { id: 'survivor', emoji: '🔥' },
  { id: 'explorer', emoji: '🧭' }
];

export function renderSentenceLevelSelect(root, store) {
  const current = store.getState();
  const copy = getSentenceLevelCopy(current.nativeLanguage);
  const selected = LEVEL_IDS.some(level => level.id === current.sentenceLevel)
    ? current.sentenceLevel
    : 'beginner';

  root.innerHTML = `<section class="screen sentence-mode-screen">
    <button class="speakup-home-button" data-menu aria-label="${copy.back}">SpeakUP</button>
    <div class="center sentence-level-view">
      <p class="kicker">${copy.kicker}</p>
      <h1>${copy.title}</h1>
      <p class="muted">${copy.subtitle}</p>
      <div class="sentence-level-grid" data-level-grid>
        ${LEVEL_IDS.map(level => {
          const [title, description] = copy.levels[level.id];
          return `<button type="button" class="sentence-level-card ${selected === level.id ? 'selected' : ''}" data-level="${level.id}" aria-pressed="${selected === level.id}">
          <span class="sentence-level-emoji">${level.emoji}</span>
          <span class="sentence-level-title">${title}</span>
          <small>${description}</small>
        </button>`;
        }).join('')}
      </div>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => store.setState({ screen: 'menu' });
  root.querySelector('[data-level-grid]').onclick = event => {
    const button = event.target.closest('[data-level]');
    if (!button) return;
    store.setState({
      mode: 'fill-gap',
      sentenceLevel: button.dataset.level,
      currentIndex: 0,
      screen: 'fill-gap'
    });
  };
}
