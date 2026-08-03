import { createStore } from './state.js?v=53';
import { renderWelcome } from '../modules/welcome.js?v=52';
import { renderMenu } from '../modules/menu.js?v=63';
import { renderWords } from '../modules/words.js?v=52';
import { renderMemory } from '../modules/memory.js?v=59';
import { renderFillGap } from '../modules/fill-gap.js?v=53';
import { renderSpeakPractice } from '../modules/speak-practice.js?v=54';
import { renderStory } from '../modules/story-loader.js?v=60';
import { renderEffectsSettings } from '../modules/effects-settings.js?v=52';
import { renderEmotions } from '../modules/emotions.js?v=52';
import { renderFuture } from '../modules/future.js?v=1';
import { stopSpeech } from '../audio/speech.js?v=57';

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
