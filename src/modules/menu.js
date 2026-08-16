import { STORIES } from '../data/content.js?v=5';
import { LANGUAGE_OPTIONS } from '../data/language-content-matrix.js?v=1';
import { L2_TOPICS } from '../data/l2/index.js?v=1';
import { L3_TOPIC_GROUPS } from '../data/l3/index.js?v=1';

const MODES = [
  ['emotions', 'Emotionen', 'Wörter, Sätze und spielerische Ausdrücke für Gefühle.'],
  ['anxiety', 'Anxiety', 'Lerne Sprache in kleinen Geschichten über ängstliche Gedanken, Perspektive und Humor.'],
  ['fill-gap', 'Sätze', 'Wähle dein Level und ergänze den Satz.'],
  ['memory', 'Memory', 'Finde Wörter, Bedeutungen und passende Verbindungen.'],
  ['words', 'Wörter', 'Ein Wort nach dem anderen.'],
  ['speak-practice', 'Sprechen', 'Sprich echte, nützliche Sätze laut aus.'],
  ['communication-strength', 'Kommunikation', 'Lerne einen Satz und eine klarere Formulierung.'],
  ['story', 'Geschichten', 'Lerne Sprache in kleinen Geschichten.']
];

const LEVELS = [
  ['l1', 'L1 · Sprache', 'Wörter, Sätze, Sprechen und Geschichten.'],
  ['l2', 'L2 · Interessen & Beruf', 'Lerne Sprache über Themen, die dich interessieren.'],
  ['l3', 'L3 · Wissen', 'Lerne Fakten und praktisches Wissen in der neuen Sprache.']
];

const L1_MODE_IDS = new Set(MODES.map(([id]) => id));

function topicButton(topic, selected, attribute) {
  return `<button type="button" class="menu-card knowledge-topic-card ${selected ? 'selected' : ''}" ${attribute}="${topic.id}"><span>${topic.emoji} ${topic.title}</span><small>${topic.subtitle}</small></button>`;
}

export function renderMenu(root, store) {
  const state = store.getState();
  const learningLevel = ['l1','l2','l3'].includes(state.learningLevel) ? state.learningLevel : 'l1';
  const languageOptions = LANGUAGE_OPTIONS.map(language => `<option value="${language.code}" ${state.learningLanguage === language.code ? 'selected' : ''}>${language.label}</option>`).join('');
  const nativeOptions = LANGUAGE_OPTIONS.map(language => `<option value="${language.code}" ${state.nativeLanguage === language.code ? 'selected' : ''}>${language.label}</option>`).join('');

  const waitingForStory = learningLevel === 'l1' && state.mode === 'story' && !state.selectedStory;
  const waitingForL2 = learningLevel === 'l2' && !state.selectedL2Topic;
  const waitingForL3 = learningLevel === 'l3' && !state.selectedL3Topic;
  const waiting = waitingForStory || waitingForL2 || waitingForL3;

  let startLabel = 'Start';
  if (waitingForStory) startLabel = 'Geschichte wählen';
  else if (learningLevel === 'l1' && state.mode === 'story') startLabel = '▶ Geschichte starten';
  else if (waitingForL2 || waitingForL3) startLabel = 'Thema wählen';
  else if (learningLevel === 'l2') startLabel = 'L2 starten';
  else if (learningLevel === 'l3') startLabel = 'L3 starten';

  const l2Topics = learningLevel === 'l2'
    ? `<h2>Thema wählen</h2><div class="card-grid knowledge-topic-grid" data-l2-topics>${L2_TOPICS.map(topic => topicButton(topic, state.selectedL2Topic === topic.id, 'data-l2-topic')).join('')}</div>`
    : '';

  const l3Topics = learningLevel === 'l3'
    ? L3_TOPIC_GROUPS.map(group => `<div class="knowledge-topic-group"><h2>${group.title}</h2><div class="card-grid knowledge-topic-grid">${group.topics.map(topic => topicButton(topic, state.selectedL3Topic === topic.id, 'data-l3-topic')).join('')}</div></div>`).join('')
    : '';

  root.innerHTML = `<section class="screen menu-screen"><div class="menu-panel">
    <h1>SpeakUP</h1>
    <h2>Level</h2><div class="card-grid learning-level-grid" data-learning-levels></div>
    ${learningLevel === 'l1' ? '<h2>Übung</h2><div class="card-grid" data-modes></div>' : ''}
    ${learningLevel === 'l1' && state.mode === 'story' ? '<h2>Geschichte wählen</h2><div class="story-grid" data-stories></div>' : ''}
    ${l2Topics}${l3Topics}
    <h2>Einstellungen</h2>
    <button class="menu-card effects-menu-card" data-effects><span>Effekte</span><small>Effekt für die Übungen auswählen.</small></button>
    <button class="menu-card future-menu-card" data-future><span>Später</span><small>Geplante Funktionen ansehen.</small></button>
    <div class="settings-row"><label>Lernsprache<select data-learning>${languageOptions}</select></label><label>Übersetzung<select data-native>${nativeOptions}</select></label></div>
    <div class="menu-action"><button class="primary-button menu-start-button" data-start ${waiting ? 'disabled' : ''}>${startLabel}</button></div>
  </div></section>`;

  const levelRoot = root.querySelector('[data-learning-levels]');
  LEVELS.forEach(([id,title,description]) => {
    const button = document.createElement('button');
    button.type = 'button';
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
  if (modes) MODES.forEach(([id,title,description]) => {
    const button = document.createElement('button');
    button.type = 'button';
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
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `menu-card ${state.selectedStory === story.id ? 'selected' : ''}`;
    button.innerHTML = `<span>${story.emoji} ${story.title}</span><small>${story.subtitle}</small>`;
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
    if (current.mode === 'fill-gap') {
      store.setState({ screen:'sentence-level-select' });
      return;
    }
    store.setState({ screen:current.mode });
  };
}
