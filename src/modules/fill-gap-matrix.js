import { getSentenceLevels, getSpeechLanguage } from '../data/language-content-matrix.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getExerciseUiCopy } from '../app/ui-language.js?v=3';
import { explodeText, getModeTextEffect } from '../effects/distinct-text-effects.js?v=6';

function esc(value) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
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

function fillAnswersHtml(sentence, answers, solvedCount, glowingIndex = -1) {
  let index = 0;
  let cursor = 0;
  const source = String(sentence);
  const parts = [];
  source.replace(/_____/g, (match, offset) => {
    parts.push(esc(source.slice(cursor, offset)));
    const answer = answers[index];
    if (index < solvedCount) {
      parts.push(index === glowingIndex
        ? `<span class="sentence-filled-answer-glow" data-filled-answer>${esc(answer)}</span>`
        : `<span class="sentence-filled-answer">${esc(answer)}</span>`);
    } else {
      parts.push('_____');
    }
    cursor = offset + match.length;
    index += 1;
    return match;
  });
  parts.push(esc(source.slice(cursor)));
  return parts.join('');
}

export function renderFillGap(root, store) {
  const state = store.getState();
  const ui = getExerciseUiCopy(state.nativeLanguage);
  const levels = getSentenceLevels(state.learningLanguage, state.nativeLanguage);
  const level = levels.find(item => item.id === state.sentenceLevel) || levels[0];
  const speechLanguage = getSpeechLanguage(state.learningLanguage);
  const progressKey = `${state.sentenceLevel}|${state.learningLanguage}|${state.nativeLanguage}`;
  const saved = state.progress?.fillGap?.[progressKey] || {};
  let sentenceIndex = Math.max(0, Number(saved.sentenceIndex) || 0) % level.items.length;
  let solvedCount = Math.max(0, Number(saved.solvedCount) || 0);
  let locked = false;

  const save = () => store.saveProgress?.('fillGap', progressKey, {
    sentenceIndex,
    solvedCount,
    sentenceLevel: state.sentenceLevel,
    learningLanguage: state.learningLanguage,
    nativeLanguage: state.nativeLanguage
  });
  const leave = () => { stopSpeech(); save(); store.setState({ screen:'menu' }); };

  function draw() {
    const item = level.items[sentenceIndex % level.items.length];
    solvedCount = Math.min(solvedCount, item.answers.length);
    const expected = item.answers[solvedCount];
    locked = false;
    root.innerHTML = `<section class="screen sentence-mode-screen">
      <button class="speakup-home-button" data-menu>SpeakUP</button>
      <div class="center sentence-mode-view">
        <div class="sentence-mode-stage">
          <p class="sentence sentence-mode-portuguese" data-sentence>${esc(fillAnswers(item.sentence,item.answers,solvedCount))}</p>
          <p class="sentence-mode-english">${esc(item.translation)}</p>
        </div>
        <div class="choices" data-choices></div><p class="feedback" data-feedback></p>
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick = leave;
    const choices = root.querySelector('[data-choices]');
    item.options.forEach(option => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.textContent = option;
      button.onclick = async () => {
        if (locked) return;
        if (option !== expected) {
          root.querySelector('[data-feedback]').textContent = ui.tryAgain;
          return;
        }
        locked = true;
        const insertedIndex = solvedCount;
        solvedCount += 1;
        save();
        const sentenceEl = root.querySelector('[data-sentence]');
        const feedbackEl = root.querySelector('[data-feedback]');
        if (sentenceEl) {
          sentenceEl.innerHTML = fillAnswersHtml(item.sentence, item.answers, solvedCount, insertedIndex);
          sentenceEl.dataset.effect = getModeTextEffect('sentences');
        }
        if (feedbackEl) feedbackEl.textContent = ui.correct + '.';
        await speak(option, speechLanguage, { enabled:state.audioOn, rate:.65 }).catch(() => {});
        await new Promise(resolve => window.setTimeout(resolve, 900));
        if (solvedCount < item.answers.length) { draw(); return; }
        const full = fillAnswers(item.sentence,item.answers);
        await speak(full, speechLanguage, { enabled:state.audioOn, rate:.65 }).catch(() => {});
        if (sentenceEl) {
          try {
            await explodeText(sentenceEl, getModeTextEffect('sentences'), { duration:1450, stagger:20 });
          } catch (error) {
            console.warn('Sentence effect failed.', error);
          }
        }
        solvedCount = 0;
        sentenceIndex = (sentenceIndex + 1) % level.items.length;
        save();
        draw();
      };
      choices.appendChild(button);
    });
  }
  draw();
}
