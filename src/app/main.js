import { createStore } from './state.js?v=27';
import { renderWelcome } from '../modules/welcome.js?v=27';
import { renderMenu } from '../modules/menu.js?v=27';
import { renderWords } from '../modules/words.js?v=27';
import { renderMemory } from '../modules/memory.js?v=27';
import { renderFillGap } from '../modules/fill-gap.js?v=27';
import { renderStory } from '../modules/story-loader.js?v=27';
import { stopSpeech } from '../audio/speech.js?v=27';

const root = document.getElementById('app');
const store = createStore({ screen: 'welcome' });

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
