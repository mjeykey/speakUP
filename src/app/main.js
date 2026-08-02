import { createStore } from './state.js?v=46';
import { renderWelcome } from '../modules/welcome.js?v=46';
import { renderMenu } from '../modules/menu.js?v=46';
import { renderWords } from '../modules/words.js?v=46';
import { renderMemory } from '../modules/memory.js?v=46';
import { renderFillGap } from '../modules/fill-gap.js?v=46';
import { renderSpeakPractice } from '../modules/speak-practice.js?v=46';
import { renderStory } from '../modules/story-loader.js?v=46';
import { renderEffectsSettings } from '../modules/effects-settings.js?v=46';
import { renderEmotions } from '../modules/emotions.js?v=2';
import { stopSpeech } from '../audio/speech.js?v=46';

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
