import { createStore } from './state.js?v=24';
import { renderWelcome } from '../modules/welcome.js?v=24';
import { renderMenu } from '../modules/menu.js?v=24';
import { renderWords } from '../modules/words.js?v=24';
import { renderMemory } from '../modules/memory.js?v=24';
import { renderFillGap } from '../modules/fill-gap.js?v=24';
import { renderStory } from '../modules/story.js?v=24';
import { stopSpeech } from '../audio/speech.js?v=24';

const root = document.getElementById('app');
const store = createStore();

const routes = {
  welcome: renderWelcome,
  menu: renderMenu,
  words: renderWords,
  memory: renderMemory,
  'fill-gap': renderFillGap,
  story: renderStory
};

function render(state) {
  stopSpeech();
  const view = routes[state.screen] || renderWelcome;
  view(root, store);
}

store.subscribe(render);
render(store.getState());
