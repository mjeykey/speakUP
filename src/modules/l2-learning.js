import { getL2Cards, getL2Topic } from '../data/l2/index.js?v=1';
import { getSpeechLanguage } from '../data/language-content-extended.js?v=2';
import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getExerciseUiCopy } from '../app/ui-language.js?v=3';
import { getTopicCopy } from '../app/navigation-language.js?v=1';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderL2Learning(root, store) {
  const state = store.getState();
  const ui = getExerciseUiCopy(state.nativeLanguage);
  const topicId = state.selectedL2Topic || 'cooking';
  const topic = getL2Topic(topicId);
  const localizedTopic = getTopicCopy(topic, state.nativeLanguage);
  const cards = getL2Cards(topicId, state.learningLanguage, state.nativeLanguage);
  const progressKey = `${topicId}|${state.learningLanguage}|${state.nativeLanguage}`;
  const saved = state.progress?.l2?.[progressKey] || {};
  const index = Math.max(0, Number(saved.currentIndex) || 0) % cards.length;
  const card = cards[index];
  const speechLanguage = getSpeechLanguage(state.learningLanguage);
  let moving = false;

  root.innerHTML = `<section class="screen knowledge-screen l2-screen">
    <button class="speakup-home-button" data-menu aria-label="${ui.backToSpeakUP}">SpeakUP</button>
    <div class="center knowledge-view">
      <div class="knowledge-topic">${topic.emoji} ${escapeHtml(localizedTopic.title)}</div>
      <div class="knowledge-card">
        <p class="knowledge-level">${ui.l2Level}</p>
        <h1 class="knowledge-term">${escapeHtml(card.target)}</h1>
        <p class="knowledge-translation">${escapeHtml(card.translation)}</p>
        <div class="knowledge-divider"></div>
        <p class="knowledge-info">${escapeHtml(card.info)}</p>
        <p class="knowledge-info-translation">${escapeHtml(card.infoTranslation)}</p>
      </div>
      <button class="primary-button knowledge-next" data-next>${ui.next}</button>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => {
    stopSpeech();
    store.setState({ screen: 'menu' });
  };

  root.querySelector('[data-next]').onclick = () => {
    if (moving) return;
    moving = true;
    stopSpeech();
    store.updateProgress('l2', progressKey, {
      currentIndex: index + 1,
      topicId,
      learningLanguage: state.learningLanguage,
      nativeLanguage: state.nativeLanguage
    });
  };

  window.setTimeout(async () => {
    if (!store.getState().audioOn) return;
    try {
      await speak(card.target, speechLanguage, { enabled: true, rate: 0.7 });
      await speak(card.info, speechLanguage, { enabled: true, rate: 0.66 });
    } catch (_) {}
  }, 260);
}
