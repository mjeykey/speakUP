import { createStore } from './state.js?v=56';
import { renderWelcome } from '../modules/welcome.js?v=52';
import { renderMenu } from '../modules/menu.js?v=67';
import { renderWords } from '../modules/words.js?v=53';
import { renderMemory } from '../modules/memory.js?v=60';
import { renderFillGap } from '../modules/fill-gap.js?v=62';
import { renderSpeakPractice } from '../modules/speak-practice.js?v=54';
import { renderStory } from '../modules/story-loader.js?v=62';
import { renderEffectsSettings } from '../modules/effects-settings.js?v=52';
import { renderEmotions } from '../modules/emotions.js?v=56';
import { renderFuture } from '../modules/future.js?v=1';
import { stopSpeech } from '../audio/speech.js?v=58';

const root = document.getElementById('app');
const store = createStore({ screen: 'welcome' });

const routes = {
  welcome: renderWelcome,
  menu: renderMenu,
  words: renderWords,
  memory: renderMemory,
  emotions: renderEmotions,
  'fill-gap': renderFillGap,
  'speak-practice': renderSpeakPractice,
  'effects-settings': renderEffectsSettings,
  future: renderFuture,
  story: renderStory
};

function render(state) {
  stopSpeech();
  const view = routes[state.screen] || renderWelcome;
  view(root, store);
}

store.subscribe(render);
render(store.getState());
