import { createStore } from './state.js?v=21';
import { renderMenu } from '../modules/menu.js?v=21';
import { renderWords } from '../modules/words.js?v=21';
import { renderMemory } from '../modules/memory.js?v=21';
import { renderFillGap } from '../modules/fill-gap.js?v=21';
import { renderStory } from '../modules/story.js?v=21';
import { stopSpeech } from '../audio/speech.js?v=21';

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