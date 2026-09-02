import { createStore } from './state.js?v=57';
import { renderWelcome } from '../modules/welcome.js?v=52';
import { renderMenu } from '../modules/menu.js?v=265';
import { renderWords } from '../modules/words-matrix.js?v=1';
import { renderMemory } from '../modules/memory-matrix.js?v=2';
import { renderFillGap } from '../modules/fill-gap-matrix.js?v=1';
import { renderSentenceLevelSelect } from '../modules/sentence-level-select.js?v=1';
import { renderSpeakPractice } from '../modules/speak-practice-matrix.js?v=1';
import { renderCommunicationStrength } from '../modules/communication-strength-matrix.js?v=1';
import { renderStory } from '../modules/story-loader.js?v=335';
import { renderEffectsSettings } from '../modules/effects-settings.js?v=63';
import { renderEmotions } from '../modules/emotions-expanded.js?v=1';
import { renderAnxiety } from '../modules/anxiety-language.js?v=1';
import { renderFuture } from '../modules/future.js?v=1';
import { renderL2Learning } from '../modules/l2-learning.js?v=1';
import { renderL3Learning } from '../modules/l3-learning.js?v=1';
import { stopSpeech } from '../audio/speech.js?v=63';
import { stopStoryEffects } from '../audio/story-effects.js?v=270';
import { installMuffledTalkingScene } from '../audio/story-scene-165-168.js?v=285';

const root = document.getElementById('app');
const store = createStore({ screen: 'welcome' });

// Direct story links, e.g. ?story=fantasy-1&page=256
try {
  const params=new URLSearchParams(window.location.search);
  const storyId=params.get('story');
  const displayPage=Number(params.get('page'));
  if(storyId==='fantasy-1'&&Number.isInteger(displayPage)&&displayPage>=1){
    const snapshot=store.getState();
    const pageIndex=Math.floor((displayPage-1)/4);
    const phaseIndex=(displayPage-1)%4;
    const progressKey=[storyId,snapshot.learningLanguage,snapshot.nativeLanguage].join('|');
    store.saveProgress('story',progressKey,{
      storyId,
      learningLanguage:snapshot.learningLanguage,
      nativeLanguage:snapshot.nativeLanguage,
      pageIndex,
      phaseIndex,
      solved:0
    });
    store.setState({screen:'story',selectedStory:storyId});
  }
}catch(error){
  console.warn('Direct story link could not be applied.',error);
}

installMuffledTalkingScene(store);
let previousScreen=null;

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
  if(state.screen!=='story')stopSpeech();
  if(previousScreen==='story'&&state.screen!=='story')stopStoryEffects();
  previousScreen=state.screen;
  const view = routes[state.screen] || renderWelcome;
  view(root, store);
}

store.subscribe(render);
render(store.getState());
