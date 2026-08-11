import { createStore } from './state.js?v=57';
import { renderWelcome } from '../modules/welcome.js?v=52';
import { renderMenu } from '../modules/menu.js?v=72';
import { renderWords } from '../modules/words.js?v=62';
import { renderMemory } from '../modules/memory-full-speech.js?v=1';
import { renderFillGap } from '../modules/fill-gap.js?v=75';
import { renderSentenceLevelSelect } from '../modules/sentence-level-select.js?v=1';
import { renderSpeakPractice } from '../modules/speak-practice.js?v=54';
import { renderStory } from '../modules/story-loader.js?v=63';
import { renderEffectsSettings } from '../modules/effects-settings.js?v=63';
import { renderEmotions } from '../modules/emotions.js?v=58';
import { renderFuture } from '../modules/future.js?v=1';
import { renderL2Learning } from '../modules/l2-learning.js?v=1';
import { renderL3Learning } from '../modules/l3-learning.js?v=1';
import { stopSpeech } from '../audio/speech.js?v=60';

const root = document.getElementById('app');
const store = createStore({ screen: 'welcome' });

const routes = {
  welcome: renderWelcome,
  menu: renderMenu,
  words: renderWords,
  memory: renderMemory,
  emotions: renderEmotions,
  'sentence-level-select': renderSentenceLevelSelect,
  'fill-gap': renderFillGap,
  'speak-practice': renderSpeakPractice,
  'effects-settings': renderEffectsSettings,
  'l2-learning': renderL2Learning,
  'l3-learning': renderL3Learning,
  future: renderFuture,
  story: renderStory
};

function render(state) {
  stopSpeech();
  const view = routes[state.screen] || renderWelcome;
  view(root, store);
}

root.addEventListener('click', event => {
  const startButton = event.target.closest?.('[data-start]');
  if (!startButton || startButton.disabled) return;
  const current = store.getState();
  if (current.learningLevel === 'l1' && current.mode === 'story' && current.selectedStory) {
    store.setState({ mode: 'story', screen: 'story' });
  }
});

store.subscribe(render);
render(store.getState());
