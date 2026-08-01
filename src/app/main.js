import { createStore } from './state.js';
import { renderMenu } from '../modules/menu.js';
import { renderWords } from '../modules/words.js';
import { renderMemory } from '../modules/memory.js';
import { renderFillGap } from '../modules/fill-gap.js';
import { renderStory } from '../modules/story.js';
import { stopSpeech } from '../audio/speech.js';

const root = document.getElementById('app');
const store = createStore();

const routes = {
  menu: renderMenu,
  words: renderWords,
  memory: renderMemory,
  'fill-gap': renderFillGap,
  story: renderStory
};

function render(state) {
  stopSpeech();
  const view = routes[state.screen] || renderMenu;
  view(root, store);
}

store.subscribe(render);
render(store.getState());
