const LEVELS = [
  { id: 'beginner', emoji: '🌱', title: 'Beginner', description: 'One gap with full support.' },
  { id: 'survivor', emoji: '🔥', title: 'Survivor', description: 'Two gaps with full support.' },
  { id: 'explorer', emoji: '🧭', title: 'Explorer', description: 'Three gaps with softer support.' }
];

export function renderSentenceLevelSelect(root, store) {
  const current = store.getState();
  const selected = LEVELS.some(level => level.id === current.sentenceLevel)
    ? current.sentenceLevel
    : 'beginner';

  root.innerHTML = `<section class="screen sentence-mode-screen">
    <button class="speakup-home-button" data-menu aria-label="Back to menu">SpeakUP</button>
    <div class="center sentence-level-view">
      <p class="kicker">Sentences</p>
      <h1>Choose your level</h1>
      <p class="muted">Select one category to begin.</p>
      <div class="sentence-level-grid" data-level-grid>
        ${LEVELS.map(level => `<button type="button" class="sentence-level-card ${selected === level.id ? 'selected' : ''}" data-level="${level.id}" aria-pressed="${selected === level.id}">
          <span class="sentence-level-emoji">${level.emoji}</span>
          <span class="sentence-level-title">${level.title}</span>
          <small>${level.description}</small>
        </button>`).join('')}
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
