import { createStore } from './state.js?v=34';
import { renderWelcome } from '../modules/welcome.js?v=34';
import { renderMenu } from '../modules/menu.js?v=34';
import { renderWords } from '../modules/words.js?v=34';
import { renderMemory } from '../modules/memory.js?v=34';
import { renderFillGap } from '../modules/fill-gap.js?v=34';
import { renderSpeakPractice } from '../modules/speak-practice.js?v=34';
import { renderStory } from '../modules/story-loader.js?v=34';
import { stopSpeech } from '../audio/speech.js?v=34';

const root = document.getElementById('app');
const store = createStore({ screen: 'welcome' });

const routes = {
  welcome: renderWelcome,
  menu: renderMenu,
  words: renderWords,
  memory: renderMemory,
  'fill-gap': renderFillGap,
  'speak-practice': renderSpeakPractice,
  story: renderStory
};

function render(state) {
  stopSpeech();
  const view = routes[state.screen] || renderWelcome;
  view(root, store);
}

store.subscribe(render);
render(store.getState());
