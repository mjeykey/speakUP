import { createStore } from './state.js?v=26';
import { renderWelcome } from '../modules/welcome.js?v=26';
import { renderMenu } from '../modules/menu.js?v=26';
import { renderWords } from '../modules/words.js?v=26';
import { renderMemory } from '../modules/memory.js?v=26';
import { renderFillGap } from '../modules/fill-gap.js?v=26';
import { renderStory } from '../modules/story.js?v=26';
import { stopSpeech } from '../audio/speech.js?v=26';

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
