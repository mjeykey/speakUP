import { EMOTIONS } from '../data/emotions/index.js?v=2';
import { getPortugueseEmotionPractice } from '../data/emotions/portuguese-voice.js?v=1';
import { getFrenchEmotionPractice } from '../data/emotions/french-voice.js?v=1';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { speak, stopSpeech } from '../audio/speech.js?v=58';

const LABELS = {
  'pt-PT': {
    title: 'Como te sentes agora?',
    subtitle: 'Escolhe uma emoção.',
    listen: 'Ouvir',
    next: 'Seguinte',
    back: 'Voltar',
    another: 'Escolher outra emoção',
    finish: 'Terminar',
    repeat: 'Lê devagar e repete em voz alta.',
    emotions: {
      jealousy: 'Ciúme', anger: 'Raiva', anxiety: 'Ansiedade', stress: 'Stress',
      sadness: 'Tristeza', insecure: 'Insegurança', overwhelmed: 'Sobrecarregada',
      excited: 'Entusiasmo', lonely: 'Solidão', disappointed: 'Desilusão',
      selflove: 'Amor-próprio', spiral: 'Pensamentos repetitivos'
    }
  },
  'fr-FR': {
    title: 'Comment te sens-tu maintenant ?',
    subtitle: 'Choisis une émotion.',
    listen: 'Écouter',
    next: 'Suivant',
    back: 'Retour',
    another: 'Choisir une autre émotion',
    finish: 'Terminer',
    repeat: 'Lis lentement et répète à voix haute.',
    emotions: {
      jealousy: 'Jalousie', anger: 'Colère', anxiety: 'Anxiété', stress: 'Stress',
      sadness: 'Tristesse', insecure: 'Insécurité', overwhelmed: 'Débordée',
      excited: 'Enthousiasme', lonely: 'Solitude', disappointed: 'Déception',
      selflove: 'Amour de soi', spiral: 'Pensées répétitives'
    }
  }
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function selectedLanguage(language) {
  return language === 'fr-FR' ? 'fr-FR' : 'pt-PT';
}

function getPractice(language, emotionId) {
  return language === 'fr-FR'
    ? getFrenchEmotionPractice(emotionId)
    : getPortugueseEmotionPractice(emotionId);
}

export function renderEmotions(root, store) {
  const state = store.getState();
  const learningLanguage = selectedLanguage(state.learningLanguage);
  const copy = LABELS[learningLanguage];
  const voice = getSpeechLanguage(learningLanguage);
  const languageLabel = languageName(learningLanguage);
  let selected = null;
  let exerciseIndex = 0;

  const leave = () => {
    stopSpeech();
    store.setState({ screen: 'menu' });
  };

  function renderPicker() {
    stopSpeech();
    root.innerHTML = `<section class="screen emotions-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="emotions-shell">
        <p class="kicker">${escapeHtml(languageLabel)}</p>
        <h1>${escapeHtml(copy.title)}</h1>
        <p class="muted">${escapeHtml(copy.subtitle)}</p>
        <div class="emotion-grid">
          ${EMOTIONS.map(item => `<button class="emotion-card" data-emotion="${item.id}">
            <span>${item.emoji}</span>
            <strong>${escapeHtml(copy.emotions[item.id] || item.title)}</strong>
          </button>`).join('')}
        </div>
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick = leave;
    root.querySelectorAll('[data-emotion]').forEach(button => {
      button.onclick = () => {
        selected = EMOTIONS.find(item => item.id === button.dataset.emotion);
        exerciseIndex = 0;
        renderExercise();
      };
    });
  }

  function renderExercise() {
    stopSpeech();
    const practice = getPractice(learningLanguage, selected.id);
    const exercises = [practice.intro, ...practice.sentences];
    const sentence = exercises[exerciseIndex];
    const atStart = exerciseIndex === 0;
    const atEnd = exerciseIndex === exercises.length - 1;

    root.innerHTML = `<section class="screen emotions-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="emotions-shell emotion-journey">
        <div class="emotion-progress">
          ${exercises.map((_, index) => `<span class="${index <= exerciseIndex ? 'active' : ''}"></span>`).join('')}
        </div>
        <p class="emotion-current">${selected.emoji} ${escapeHtml(copy.emotions[selected.id] || selected.title)}</p>
        <div class="emotion-panel">
          <p class="kicker">${exerciseIndex + 1} / ${exercises.length} · ${escapeHtml(languageLabel)}</p>
          <p class="emotion-body emotion-portuguese-sentence">${escapeHtml(sentence)}</p>
          <p class="emotion-language-hint">${escapeHtml(copy.repeat)}</p>
          <div class="emotion-verb-list">
            ${practice.verbs.map(verb => `<span>${escapeHtml(verb)}</span>`).join('')}
          </div>
          <div class="emotion-language-actions">
            <button class="secondary-button" data-listen>${escapeHtml(copy.listen)}</button>
          </div>
        </div>
        <div class="emotion-controls">
          <button class="secondary-button" data-back>${escapeHtml(atStart ? copy.another : copy.back)}</button>
          <button class="primary-button" data-next>${escapeHtml(atEnd ? copy.finish : copy.next)}</button>
        </div>
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-listen]').onclick = () => {
      speak(sentence, voice, { enabled: store.getState().audioOn, rate: 0.58 });
    };
    root.querySelector('[data-back]').onclick = () => {
      stopSpeech();
      if (atStart) renderPicker();
      else {
        exerciseIndex -= 1;
        renderExercise();
      }
    };
    root.querySelector('[data-next]').onclick = () => {
      stopSpeech();
      if (atEnd) renderPicker();
      else {
        exerciseIndex += 1;
        renderExercise();
      }
    };

    speak(sentence, voice, { enabled: state.audioOn, rate: 0.58 });
  }

  renderPicker();
}
