import { createStore } from './state.js?v=31';
import { renderWelcome } from '../modules/welcome.js?v=31';
import { renderMenu } from '../modules/menu.js?v=31';
import { renderWords } from '../modules/words.js?v=31';
import { renderMemory } from '../modules/memory.js?v=31';
import { renderFillGap } from '../modules/fill-gap.js?v=31';
import { renderSpeakPractice } from '../modules/speak-practice.js?v=31';
import { renderStory } from '../modules/story-loader.js?v=31';
import { stopSpeech } from '../audio/speech.js?v=31';

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
