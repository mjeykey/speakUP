import { createStore } from './state.js?v=10';
import { renderMenu } from '../modules/menu.js?v=10';
import { renderWords } from '../modules/words.js?v=10';
import { renderMemory } from '../modules/memory.js?v=10';
import { renderFillGap } from '../modules/fill-gap.js?v=10';
import { renderStory } from '../modules/story.js?v=10';
import { stopSpeech } from '../audio/speech.js?v=10';

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