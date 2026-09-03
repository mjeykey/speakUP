import { getL3Cards, getL3Topic } from '../data/l3/index.js?v=1';
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

export function renderL3Learning(root, store) {
  const state = store.getState();
  const ui = getExerciseUiCopy(state.nativeLanguage);
  const topicId = state.selectedL3Topic || 'biology';
  const topic = getL3Topic(topicId);
  const localizedTopic = getTopicCopy(topic, state.nativeLanguage);
  const cards = getL3Cards(topicId, state.learningLanguage, state.nativeLanguage);
  const progressKey = `${topicId}|${state.learningLanguage}|${state.nativeLanguage}`;
  const saved = state.progress?.l3?.[progressKey] || {};
  const index = Math.max(0, Number(saved.currentIndex) || 0) % cards.length;
  const card = cards[index];
  const speechLanguage = getSpeechLanguage(state.learningLanguage);
  const nativeSpeechLanguage = getSpeechLanguage(state.nativeLanguage);
  let moving = false;

  root.innerHTML = `<section class="screen knowledge-screen l3-screen">
    <button class="speakup-home-button" data-menu aria-label="${ui.backToSpeakUP}">SpeakUP</button>
    <div class="center knowledge-view">
      <div class="knowledge-topic">${topic.emoji} ${escapeHtml(localizedTopic.title)}</div>
      <div class="knowledge-card">
        <p class="knowledge-level">${ui.l3Level}</p>
        <h1 class="knowledge-term" data-learning-say="${escapeHtml(card.term)}" data-speech-language="${escapeHtml(speechLanguage)}">${escapeHtml(card.term)}</h1>
        <p class="knowledge-translation" data-native-say="${escapeHtml(card.termTranslation)}" data-speech-language="${escapeHtml(nativeSpeechLanguage)}">${escapeHtml(card.termTranslation)}</p>
        <div class="knowledge-divider"></div>
        <p class="knowledge-fact" data-learning-say="${escapeHtml(card.fact)}" data-speech-language="${escapeHtml(speechLanguage)}">${escapeHtml(card.fact)}</p>
        <p class="knowledge-fact-translation" data-native-say="${escapeHtml(card.factTranslation)}" data-speech-language="${escapeHtml(nativeSpeechLanguage)}">${escapeHtml(card.factTranslation)}</p>
        <div class="knowledge-explanation-block">
          <p class="knowledge-explanation-label">${ui.whatExactly}</p>
          <p class="knowledge-explanation" data-learning-say="${escapeHtml(card.explanation)}" data-speech-language="${escapeHtml(speechLanguage)}">${escapeHtml(card.explanation)}</p>
          <p class="knowledge-explanation-translation" data-native-say="${escapeHtml(card.explanationTranslation)}" data-speech-language="${escapeHtml(nativeSpeechLanguage)}">${escapeHtml(card.explanationTranslation)}</p>
        </div>
      </div>
      <button class="primary-button knowledge-next" data-next>${ui.next}</button>
    </div>
  </section>`;

  root.querySelector('[data-menu]').onclick = () => {
    stopSpeech();
    store.setState({ screen: 'menu' });
  };

  root.querySelectorAll('[data-learning-say]').forEach(element => {
    element.addEventListener('click', () => {
      speak(element.dataset.learningSay, speechLanguage, { enabled:store.getState().audioOn, rate:0.68 }).catch(() => {});
    });
  });
  root.querySelectorAll('[data-native-say]').forEach(element => {
    element.addEventListener('click', () => {
      speak(element.dataset.nativeSay, nativeSpeechLanguage, { enabled:store.getState().audioOn, rate:0.62 }).catch(() => {});
    });
  });

  root.querySelector('[data-next]').onclick = () => {
    if (moving) return;
    moving = true;
    stopSpeech();
    store.updateProgress('l3', progressKey, {
      currentIndex: index + 1,
      topicId,
      learningLanguage: state.learningLanguage,
      nativeLanguage: state.nativeLanguage
    });
  };

  window.setTimeout(async () => {
    if (!store.getState().audioOn) return;
    try {
      await speak(card.term, speechLanguage, { enabled: true, rate: 0.7 });
      await speak(card.fact, speechLanguage, { enabled: true, rate: 0.66 });
      await speak(card.explanation, speechLanguage, { enabled: true, rate: 0.64 });
    } catch (_) {}
  }, 260);
}
