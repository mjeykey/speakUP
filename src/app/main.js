import { createStore } from './state.js?v=57';
import { renderWelcome } from '../modules/welcome.js?v=52';
import { renderMenu } from '../modules/menu.js?v=81';
import { renderWords } from '../modules/words-matrix.js?v=1';
import { renderMemory } from '../modules/memory-matrix.js?v=2';
import { renderFillGap } from '../modules/fill-gap-matrix.js?v=1';
import { renderSentenceLevelSelect } from '../modules/sentence-level-select.js?v=1';
import { renderSpeakPractice } from '../modules/speak-practice-matrix.js?v=1';
import { renderCommunicationStrength } from '../modules/communication-strength-matrix.js?v=1';
import { renderStory } from '../modules/story-loader.js?v=144';
import { renderEffectsSettings } from '../modules/effects-settings.js?v=63';
import { renderEmotions } from '../modules/emotions-expanded.js?v=1';
import { renderAnxiety } from '../modules/anxiety-language.js?v=1';
import { renderFuture } from '../modules/future.js?v=1';
import { renderL2Learning } from '../modules/l2-learning.js?v=1';
import { renderL3Learning } from '../modules/l3-learning.js?v=1';
import { stopSpeech } from '../audio/speech.js?v=63';
import { playStorySfx } from '../audio/story-sfx-clean.js?v=16';

const root = document.getElementById('app');
const store = createStore({ screen: 'welcome' });

// Android/Chrome: start the Fantasy door from the trusted CLICK itself.
// This runs in capture phase before Story navigation can replace DOM or stop audio.
document.addEventListener('click', event => {
  const button=event.target?.closest?.('[data-next],[data-prev]');
  if(!button)return;
  const state=store.getState();
  if(state.screen!=='story'||state.selectedStory!=='fantasy-1'||!state.audioOn)return;
  const progressText=root.querySelector('.story-progress')?.textContent||'';
  const match=progressText.match(/(\d+)/);
  if(!match)return;
  const currentDisplay=Number(match[1]);
  const direction=button.matches('[data-next]')?1:-1;
  const targetDisplay=currentDisplay+direction;
  if(targetDisplay<9||targetDisplay>12)return;
  stopSpeech();
  void playStorySfx('door-creak',{enabled:true,loop:false,volume:.95});
},true);

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

store.subscribe(render);
render(store.getState());
