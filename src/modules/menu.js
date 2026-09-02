import { STORIES } from '../data/content.js?v=5';
import { LANGUAGE_OPTIONS } from '../data/language-content-matrix.js?v=1';
import { L2_TOPICS } from '../data/l2/index.js?v=1';
import { L3_TOPIC_GROUPS } from '../data/l3/index.js?v=1';
import { getLanguageOptionLabel, getMenuCopy } from '../app/ui-language.js?v=3';
import { getLocalizedStoryCopy, getTopicCopy } from '../app/navigation-language.js?v=1';

const MODE_IDS = ['emotions', 'anxiety', 'fill-gap', 'memory', 'words', 'speak-practice', 'communication-strength', 'story'];
const LEVEL_IDS = ['l1', 'l2', 'l3'];
const L1_MODE_IDS = new Set(MODE_IDS);

function topicButton(topic, selected, attribute, nativeLanguage) {
  const localized = getTopicCopy(topic, nativeLanguage);
  return `<button type="button" class="menu-card knowledge-topic-card ${selected ? 'selected' : ''}" ${attribute}="${topic.id}"><span>${topic.emoji} ${localized.title}</span><small>${localized.subtitle}</small></button>`;
}

export function renderMenu(root, store) {
  const state = store.getState();
  const copy = getMenuCopy(state.nativeLanguage);
  const learningLevel = ['l1','l2','l3'].includes(state.learningLevel) ? state.learningLevel : 'l1';
  const languageOptions = LANGUAGE_OPTIONS.map(language => `<option value="${language.code}" ${state.learningLanguage === language.code ? 'selected' : ''}>${getLanguageOptionLabel(language, state.nativeLanguage)}</option>`).join('');
  const nativeOptions = LANGUAGE_OPTIONS.map(language => `<option value="${language.code}" ${state.nativeLanguage === language.code ? 'selected' : ''}>${getLanguageOptionLabel(language, state.nativeLanguage)}</option>`).join('');

  const waitingForStory = learningLevel === 'l1' && state.mode === 'story' && !state.selectedStory;
  const waitingForL2 = learningLevel === 'l2' && !state.selectedL2Topic;
  const waitingForL3 = learningLevel === 'l3' && !state.selectedL3Topic;
  const waiting = waitingForStory || waitingForL2 || waitingForL3;

  let startLabel = copy.start;
  if (waitingForStory) startLabel = copy.chooseStory;
  else if (learningLevel === 'l1' && state.mode === 'story') startLabel = copy.startStory;
  else if (waitingForL2 || waitingForL3) startLabel = copy.chooseTopic;
  else if (learningLevel === 'l2') startLabel = copy.startL2;
  else if (learningLevel === 'l3') startLabel = copy.startL3;

  const l2Topics = learningLevel === 'l2'
    ? `<h2>${copy.topicHeading}</h2><div class="card-grid knowledge-topic-grid" data-l2-topics>${L2_TOPICS.map(topic => topicButton(topic, state.selectedL2Topic === topic.id, 'data-l2-topic', state.nativeLanguage)).join('')}</div>`
    : '';

  const l3Topics = learningLevel === 'l3'
    ? L3_TOPIC_GROUPS.map(group => `<div class="knowledge-topic-group"><h2>${copy.l3Groups[group.id] || group.title}</h2><div class="card-grid knowledge-topic-grid">${group.topics.map(topic => topicButton(topic, state.selectedL3Topic === topic.id, 'data-l3-topic', state.nativeLanguage)).join('')}</div></div>`).join('')
    : '';

  root.innerHTML = `<section class="screen menu-screen"><div class="menu-panel">
    <h1>SpeakUP</h1>
    <h2>${copy.levelHeading}</h2><div class="card-grid learning-level-grid" data-learning-levels></div>
    ${learningLevel === 'l1' ? `<h2>${copy.exerciseHeading}</h2><div class="card-grid" data-modes></div>` : ''}
    ${learningLevel === 'l1' && state.mode === 'story' ? `<h2>${copy.storyHeading}</h2><div class="story-grid" data-stories></div>` : ''}
    ${l2Topics}${l3Topics}
    <h2>${copy.settingsHeading}</h2>
    <button class="menu-card effects-menu-card" data-effects><span>${copy.effectsTitle}</span><small>${copy.effectsDescription}</small></button>
    <button class="menu-card future-menu-card" data-future><span>${copy.futureTitle}</span><small>${copy.futureDescription}</small></button>
    <div class="settings-row"><label>${copy.learningLanguage}<select data-learning>${languageOptions}</select></label><label>${copy.nativeLanguage}<select data-native>${nativeOptions}</select></label></div>
    <div class="menu-action"><button class="primary-button menu-start-button" data-start ${waiting ? 'disabled' : ''}>${startLabel}</button></div>
  </div></section>`;

  const levelRoot = root.querySelector('[data-learning-levels]');
  LEVEL_IDS.forEach(id => {
    const [title, description] = copy.levels[id];
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.level = id;
    button.className = `menu-card learning-level-card ${learningLevel === id ? 'selected' : ''}`;
    button.innerHTML = `<span>${title}</span><small>${description}</small>`;
    button.onclick = () => {
      if (id === 'l1') {
        const l1Mode = L1_MODE_IDS.has(store.getState().mode) ? store.getState().mode : 'words';
        store.setState({ learningLevel:'l1', mode:l1Mode, currentIndex:0 });
      } else if (id === 'l2') {
        store.setState({ learningLevel:'l2', mode:'l2-learning', currentIndex:0 });
      } else {
        store.setState({ learningLevel:'l3', mode:'l3-learning', currentIndex:0 });
      }
    };
    levelRoot.appendChild(button);
  });

  const modes = root.querySelector('[data-modes]');
  if (modes) MODE_IDS.forEach(id => {
    const [title, description] = copy.modes[id];
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.mode = id;
    button.className = `menu-card ${state.mode === id ? 'selected' : ''}`;
    button.innerHTML = `<span>${title}</span><small>${description}</small>`;
    button.onclick = () => {
      if (id === 'fill-gap') {
        store.setState({ learningLevel:'l1', mode:'fill-gap', screen:'sentence-level-select', currentIndex:0 });
        return;
      }
      store.setState(current => ({ learningLevel:'l1', mode:id, selectedStory:current.selectedStory, currentIndex:0 }));
    };
    modes.appendChild(button);
  });

  root.querySelectorAll('[data-l2-topic]').forEach(button => button.onclick = () => store.setState({ learningLevel:'l2', mode:'l2-learning', selectedL2Topic:button.dataset.l2Topic, currentIndex:0 }));
  root.querySelectorAll('[data-l3-topic]').forEach(button => button.onclick = () => store.setState({ learningLevel:'l3', mode:'l3-learning', selectedL3Topic:button.dataset.l3Topic, currentIndex:0 }));
  root.querySelector('[data-effects]').onclick = () => store.setState({ screen:'effects-settings' });
  root.querySelector('[data-future]').onclick = () => store.setState({ screen:'future' });

  root.querySelector('[data-learning]').onchange = event => {
    const current = store.getState();
    const learningLanguage = event.target.value;
    const nativeLanguage = learningLanguage === current.nativeLanguage ? current.learningLanguage : current.nativeLanguage;
    store.setState({ learningLanguage, nativeLanguage, currentIndex:0 });
  };
  root.querySelector('[data-native]').onchange = event => {
    const current = store.getState();
    const nativeLanguage = event.target.value;
    const learningLanguage = nativeLanguage === current.learningLanguage ? current.nativeLanguage : current.learningLanguage;
    store.setState({ learningLanguage, nativeLanguage, currentIndex:0 });
  };

  const stories = root.querySelector('[data-stories]');
  if (stories) STORIES.forEach(story => {
    const localized = getLocalizedStoryCopy(story, state.nativeLanguage);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `menu-card ${state.selectedStory === story.id ? 'selected' : ''}`;
    button.innerHTML = `<span>${story.emoji} ${localized.title}</span><small>${localized.subtitle}</small>`;
    button.onclick = () => store.setState({ selectedStory:story.id });
    stories.appendChild(button);
  });

  root.querySelector('[data-start]').onclick = () => {
    const current = store.getState();
    if (current.learningLevel === 'l2') {
      if (!current.selectedL2Topic) return;
      store.setState({ mode:'l2-learning', screen:'l2-learning' });
      return;
    }
    if (current.learningLevel === 'l3') {
      if (!current.selectedL3Topic) return;
      store.setState({ mode:'l3-learning', screen:'l3-learning' });
      return;
    }
    if (current.mode === 'story' && !current.selectedStory) return;
    if (current.mode === 'story' && current.selectedStory === 'fantasy-1') {
      store.setState({ screen:'story' });
      return;
    }
    if (current.mode === 'fill-gap') {
      store.setState({ screen:'sentence-level-select' });
      return;
    }
    store.setState({ screen:current.mode });
  };
}
