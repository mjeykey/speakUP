import { createStore } from './state.js?v=51';
import { renderWelcome } from '../modules/welcome.js?v=51';
import { renderMenu } from '../modules/menu.js?v=51';
import { renderWords } from '../modules/words.js?v=51';
import { renderMemory } from '../modules/memory.js?v=51';
import { renderFillGap } from '../modules/fill-gap.js?v=51';
import { renderSpeakPractice } from '../modules/speak-practice.js?v=51';
import { renderStory } from '../modules/story-loader.js?v=51';
import { renderEffectsSettings } from '../modules/effects-settings.js?v=51';
import { renderEmotions } from '../modules/emotions.js?v=51';
import { stopSpeech } from '../audio/speech.js?v=51';

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
  story: renderStory
};

function render(state) {
  stopSpeech();
  const view = routes[state.screen] || renderWelcome;
  view(root, store);
}

store.subscribe(render);
render(store.getState());
