import { STORIES } from '../data/content.js';
import { speakPair, stopSpeech } from '../audio/speech.js';

export function renderStory(root, store) {
  const state = store.getState();
  const story = STORIES.find(item => item.id === state.selectedStory);
  if (!story) { store.setState({ screen: 'menu' }); return; }
  root.innerHTML = `<section class="screen"><button class="menu-button" data-menu>Menu</button><div class="center story-view"><p class="kicker">Story Mode</p><h1>${story.emoji} ${story.title}</h1><p class="story-copy">${story.english}</p><p class="story-copy translated">${story.portuguese}</p><button class="primary-button" data-replay>Replay</button></div></section>`;
  root.querySelector('[data-menu]').onclick = () => { stopSpeech(); store.setState({ screen: 'menu' }); };
  const play = () => speakPair({ text: story.english, language: 'en-GB', rate: 0.92 }, { text: story.portuguese, language: 'pt-PT', rate: 0.72 }, { enabled: state.audioOn, pause: 700 });
  root.querySelector('[data-replay]').onclick = play;
  play();
}
