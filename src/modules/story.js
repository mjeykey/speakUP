import { STORIES } from '../data/content.js';
import { speak, stopSpeech } from '../audio/speech.js';

export function renderStory(root, store) {
  const state = store.getState();
  const story = STORIES.find(item => item.id === state.selectedStory);
  if (!story) {
    store.setState({ screen: 'menu' });
    return;
  }

  const pages = Array.isArray(story.pages) && story.pages.length
    ? story.pages
    : [story.english || ''];
  let pageIndex = 0;

  const renderPage = () => {
    const text = pages[pageIndex] || '';
    root.innerHTML = `
      <section class="screen story-screen">
        <button class="menu-button" data-menu>Menu</button>
        <div class="center story-view">
          <p class="kicker">Story Mode</p>
          <h1>${story.emoji} ${story.title}</h1>
          <p class="story-subtitle">${story.subtitle || ''}</p>
          <p class="story-progress">Page ${pageIndex + 1} / ${pages.length}</p>
          <p class="story-copy">${text}</p>
          <div class="story-controls">
            <button class="secondary-button" data-prev ${pageIndex === 0 ? 'disabled' : ''}>Previous</button>
            <button class="primary-button" data-replay>Replay</button>
            <button class="secondary-button" data-next ${pageIndex === pages.length - 1 ? 'disabled' : ''}>Next</button>
          </div>
        </div>
      </section>`;

    root.querySelector('[data-menu]').onclick = () => {
      stopSpeech();
      store.setState({ screen: 'menu' });
    };
    root.querySelector('[data-replay]').onclick = () => play(text);
    root.querySelector('[data-prev]').onclick = () => {
      if (pageIndex === 0) return;
      stopSpeech();
      pageIndex -= 1;
      renderPage();
      play(pages[pageIndex]);
    };
    root.querySelector('[data-next]').onclick = () => {
      if (pageIndex >= pages.length - 1) return;
      stopSpeech();
      pageIndex += 1;
      renderPage();
      play(pages[pageIndex]);
    };
  };

  const play = text => speak({
    text,
    language: 'en-GB',
    rate: 0.9,
    enabled: store.getState().audioOn
  });

  renderPage();
  play(pages[pageIndex]);
}
