import { getSentenceLevels, getSpeechLanguage, languageName } from '../data/language-content.js?v=3';
import { speak, stopSpeech } from '../audio/speech.js?v=40';
import { explodeText, getModeTextEffect } from '../effects/text-effects.js?v=2';

const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function fillAnswers(sentence, answers, solvedCount = answers.length) {
  let index = 0;
  return String(sentence).replace(/_____/g, () => {
    const answer = answers[index];
    const visible = index < solvedCount ? answer : '_____';
    index += 1;
    return visible;
  });
}

export function renderFillGap(root, store) {
  const state = store.getState();
  const levels = getSentenceLevels(state.learningLanguage, state.nativeLanguage);
  const learningName = languageName(state.learningLanguage);
  const supportName = languageName(state.nativeLanguage);
  const speechLanguage = getSpeechLanguage(state.learningLanguage);
  let selectedLevelId = null;
  let sentenceIndex = 0;
  let solvedCount = 0;
  let solved = false;

  const leave = () => {
    stopSpeech();
    store.setState({ screen: 'menu', currentIndex: 0 });
  };

  function renderLevelSelection() {
    stopSpeech();
    root.innerHTML = `<section class="screen sentence-mode-screen">
      <button class="menu-button" data-menu>Menu</button>
      <div class="center sentence-level-view">
        <p class="kicker">Sentences · ${learningName}</p>
        <h1>Choose your level</h1>
        <p class="muted">Support language: ${supportName}</p>
        <div class="sentence-level-grid">
          ${levels.map(level => `<button class="sentence-level-card" data-level="${level.id}">
            <span class="sentence-level-emoji">${level.emoji}</span>
            <span class="sentence-level-title">${level.title}</span>
            <small>${level.description}</small>
          </button>`).join('')}
        </div>
      </div>
    </section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelectorAll('[data-level]').forEach(button => {
      button.onclick = () => {
        selectedLevelId = button.dataset.level;
        sentenceIndex = 0;
        solvedCount = 0;
        renderSentence();
      };
    });
  }

  function renderSentence() {
    const level = levels.find(item => item.id === selectedLevelId) || levels[0];
    const item = level.items[sentenceIndex % level.items.length];
    solved = false;
    const visibleSentence = fillAnswers(item.sentence, item.answers, solvedCount);

    root.innerHTML = `<section class="screen sentence-mode-screen">
      <button class="menu-button" data-menu>Menu</button>
      <button class="sentence-level-back" data-levels>Levels</button>
      <div class="center sentence-mode-view">
        <p class="kicker">Sentences · ${learningName} · ${level.title}</p>
        <p class="sentence-mode-progress">Sentence ${sentenceIndex + 1} / ${level.items.length} · Gap ${Math.min(solvedCount + 1, item.answers.length)} / ${item.answers.length}</p>
        <div class="sentence-mode-stage" data-stage>
          <p class="sentence-mode-label">${learningName}</p>
          <p class="sentence sentence-mode-portuguese" data-learning-text>${escapeHtml(visibleSentence)}</p>
          <p class="sentence-mode-label sentence-mode-english-label">${supportName}</p>
          <p class="sentence-mode-english ${level.englishClass}" data-support-text>${escapeHtml(item.translation)}</p>
        </div>
        <div class="choices" data-choices></div>
        <p class="feedback sentence-mode-feedback" data-feedback></p>
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-levels]').onclick = renderLevelSelection;
    const choices = root.querySelector('[data-choices]');
    const expected = item.answers[solvedCount];

    item.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.textContent = option;
      button.disabled = item.answers.slice(0, solvedCount).includes(option);
      button.onclick = async () => {
        if (solved) return;
        if (option !== expected) {
          button.animate([
            { transform: 'translateX(0)' }, { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }
          ], { duration: 340, easing: 'ease' });
          root.querySelector('[data-feedback]').textContent = 'Almost — try another word.';
          return;
        }

        solvedCount += 1;
        root.querySelector('[data-learning-text]').textContent = fillAnswers(item.sentence, item.answers, solvedCount);
        await speak(option, speechLanguage, { enabled: state.audioOn, rate: speechLanguage === 'es-ES' ? 0.6 : 0.58 });

        if (solvedCount < item.answers.length) {
          root.querySelector('[data-feedback]').textContent = 'Good — one more step.';
          await sleep(250);
          renderSentence();
          return;
        }

        solved = true;
        choices.querySelectorAll('button').forEach(choice => { choice.disabled = true; });
        const completeSentence = fillAnswers(item.sentence, item.answers);
        root.querySelector('[data-feedback]').textContent = 'Beautiful — now hear the whole sentence.';
        await speak(completeSentence, speechLanguage, { enabled: state.audioOn, rate: speechLanguage === 'es-ES' ? 0.6 : 0.58 });
        await sleep(500);
        await explodeText([
          root.querySelector('[data-learning-text]'),
          root.querySelector('[data-support-text]')
        ], getModeTextEffect('sentences'), { duration: 1750, stagger: 16 });
        await sleep(180);
        sentenceIndex = (sentenceIndex + 1) % level.items.length;
        solvedCount = 0;
        renderSentence();
      };
      choices.appendChild(button);
    });

    const spokenSentence = fillAnswers(item.sentence, item.answers.map(() => '...'));
    window.setTimeout(() => {
      if (!solved) speak(spokenSentence, speechLanguage, { enabled: state.audioOn, rate: speechLanguage === 'es-ES' ? 0.58 : 0.56 });
    }, 350);
  }

  renderLevelSelection();
}
