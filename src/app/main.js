import { createStore } from './state.js?v=57';
import { renderWelcome } from '../modules/welcome.js?v=52';
import { renderMenu } from '../modules/menu.js?v=73';
import { renderWords } from '../modules/words-matrix.js?v=1';
import { renderMemory } from '../modules/memory-matrix.js?v=1';
import { renderFillGap } from '../modules/fill-gap-matrix.js?v=1';
import { renderSentenceLevelSelect } from '../modules/sentence-level-select.js?v=1';
import { renderSpeakPractice } from '../modules/speak-practice-matrix.js?v=1';
import { renderCommunicationStrength } from '../modules/communication-strength-matrix.js?v=1';
import { renderStory } from '../modules/story-loader.js?v=67';
import { renderEffectsSettings } from '../modules/effects-settings.js?v=63';
import { renderEmotions } from '../modules/emotions-matrix.js?v=1';
import { renderAnxiety } from '../modules/anxiety.js?v=2';
import { renderFuture } from '../modules/future.js?v=1';
import { renderL2Learning } from '../modules/l2-learning.js?v=1';
import { renderL3Learning } from '../modules/l3-learning.js?v=1';
import { stopSpeech } from '../audio/speech.js?v=60';
import { playStorySfx } from '../audio/story-sfx.js?v=3';

const root = document.getElementById('app');
const store = createStore({ screen: 'welcome' });

const routes = {
  welcome: renderWelcome,
  menu: renderMenu,
  words: renderWords,
  memory: renderMemory,
  emotions: renderEmotions,
  anxiety: renderAnxiety,
  'sentence-level-select': renderSentenceLevelSelect,
  'fill-gap': renderFillGap,
  'speak-practice': renderSpeakPractice,
  'communication-strength': renderCommunicationStrength,
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
    if (current.selectedStory === 'fantasy-1' && current.audioOn) {
      void playStorySfx('rain', { enabled: true });
    }
    store.setState({ mode: 'story', screen: 'story' });
  }
});

store.subscribe(render);
render(store.getState());
