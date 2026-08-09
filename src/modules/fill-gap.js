import { getSentenceLevels } from '../data/mixed-sentence-levels.js?v=6';
import { getSpeechLanguage } from '../data/language-content-extended.js?v=6';
import { repairSentenceLevels } from '../data/sentence-integrity.js?v=2';
import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { explodeText, getModeTextEffect } from '../effects/distinct-text-effects.js?v=3';

const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
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
  const rawLevels = getSentenceLevels(state.learningLanguage, state.nativeLanguage);
  const levels = repairSentenceLevels(rawLevels);
  const level = levels.find(item => item.id === state.sentenceLevel) || levels[0];
  const speechLanguage = getSpeechLanguage(state.learningLanguage);
  const progressKey = `${state.learningLanguage}|${state.nativeLanguage}|${level.id}`;
  const saved = state.progress?.fillGap?.[progressKey] || {};
  const speechRate = state.learningLanguage.startsWith('hr-') ? 0.56 : speechLanguage === 'es-ES' ? 0.6 : speechLanguage === 'fr-FR' ? 0.56 : 0.58;

  let sentenceIndex = Math.max(0, Number(saved.sentenceIndex) || 0) % level.items.length;
  let solvedCount = Math.max(0, Number(saved.solvedCount) || 0);
  let solved = false;

  const saveProgress = () => store.saveProgress('fillGap', progressKey, { sentenceIndex, solvedCount });
  const leave = () => { stopSpeech(); store.setState({ screen: 'menu' }); };

  function renderSentence() {
    const item = level.items[sentenceIndex];
    solvedCount = Math.min(solvedCount, item.answers.length);
    solved = false;
    const visibleSentence = fillAnswers(item.sentence, item.answers, solvedCount);

    root.innerHTML = `<section class="screen sentence-mode-screen">
      <button class="speakup-home-button" data-menu aria-label="Back to SpeakUP">SpeakUP</button>
      <div class="center sentence-mode-view">
        <div class="sentence-mode-stage" data-stage>
          <p class="sentence sentence-mode-portuguese" data-learning-text>${escapeHtml(visibleSentence)}</p>
          <p class="sentence-mode-english ${level.englishClass}" data-support-text>${escapeHtml(item.translation)}</p>
        </div>
        <div class="choices" data-choices></div><p class="feedback sentence-mode-feedback" data-feedback></p>
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick = leave;
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
          button.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }], { duration: 340, easing: 'ease' });
          root.querySelector('[data-feedback]').textContent = 'Almost — try another word.';
          return;
        }

        solvedCount += 1;
        root.querySelector('[data-learning-text]').textContent = fillAnswers(item.sentence, item.answers, solvedCount);
        saveProgress();
        await speak(option, speechLanguage, { enabled: state.audioOn, rate: speechRate });

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
        sentenceIndex = (sentenceIndex + 1) % level.items.length;
        solvedCount = 0;
        saveProgress();

        await speak(completeSentence, speechLanguage, { enabled: state.audioOn, rate: speechRate });
        await sleep(500);
        try {
          await explodeText(
            [root.querySelector('[data-learning-text]'), root.querySelector('[data-support-text]')],
            getModeTextEffect('sentences'),
            { duration: 1750, stagger: 16 }
          );
        } catch (error) {
          console.warn('Sentence effect failed; continuing.', error);
        }
        await sleep(180);
        renderSentence();
      };
      choices.appendChild(button);
    });

    const spokenSentence = fillAnswers(item.sentence, item.answers.map(() => '...'));
    window.setTimeout(() => {
      if (!solved) speak(spokenSentence, speechLanguage, { enabled: state.audioOn, rate: Math.max(.52, speechRate - .02) }).catch(() => {});
    }, 350);
  }

  renderSentence();
}
