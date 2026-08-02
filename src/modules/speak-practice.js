import { speak, stopSpeech } from '../audio/speech.js?v=54';
import { getVoiceCategories } from '../voice/multilingual-library.js?v=1';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

function normalize(text, locale = 'en-GB') {
  return String(text || '').toLocaleLowerCase(locale).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function similarity(expected, heard, locale) {
  const a = normalize(expected, locale).split(' ').filter(Boolean);
  const b = normalize(heard, locale).split(' ').filter(Boolean);
  if (!a.length || !b.length) return 0;
  const counts = new Map();
  b.forEach(word => counts.set(word, (counts.get(word) || 0) + 1));
  let matches = 0;
  a.forEach(word => {
    const amount = counts.get(word) || 0;
    if (amount > 0) { matches += 1; counts.set(word, amount - 1); }
  });
  return (matches / a.length * .72) + (matches / b.length * .28);
}

function rememberForLater(sentence, categoryId, language) {
  try {
    const key = 'speakup-practice-later';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (!saved.some(item => item.sentence === sentence && item.language === language)) {
      saved.push({ sentence, categoryId, language });
    }
    localStorage.setItem(key, JSON.stringify(saved.slice(-40)));
  } catch (_) {}
}

export function renderSpeakPractice(root, store) {
  const initialState = store.getState();
  const learningLanguage = initialState.learningLanguage;
  const nativeLanguage = initialState.nativeLanguage;
  const speechLanguage = getSpeechLanguage(learningLanguage);
  const categories = getVoiceCategories(learningLanguage, nativeLanguage);
  let category = null;
  let index = 0;
  let attempts = 0;
  let usingAlternative = false;
  let recognition = null;
  let listening = false;
  let streak = 0;

  const exercises = () => category?.exercises || [];
  const current = () => exercises()[index % Math.max(1, exercises().length)];
  const activeSentence = () => usingAlternative ? current().alternative : current().sentence;
  const activeTranslation = () => usingAlternative ? current().alternativeEnglish : current().english;
  const successThreshold = () => usingAlternative ? .52 : .64;

  function leave() {
    recognition?.abort?.();
    stopSpeech();
    store.setState({ screen: 'menu' });
  }

  function showCategories() {
    stopSpeech();
    root.innerHTML = `<section class="screen speak-screen"><button class="menu-button" data-menu>Menu</button>
      <div class="center speak-view"><p class="kicker">Speak & Grow · ${languageName(learningLanguage)}</p><h1>What do you need today?</h1>
      <p class="muted">Choose one feeling or learning path. Every category contains 50 exercises in your selected learning language.</p>
      <div class="voice-category-grid" data-categories></div></div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    const grid = root.querySelector('[data-categories]');
    categories.forEach(item => {
      const button = document.createElement('button');
      button.className = 'voice-category-card';
      button.innerHTML = `<span class="voice-category-emoji">${item.emoji}</span><span>${item.title}</span><small>${item.description}</small><small>${item.exercises.length} sentences · ${languageName(learningLanguage)}</small>`;
      button.onclick = () => {
        category = item;
        index = 0;
        attempts = 0;
        streak = 0;
        usingAlternative = false;
        renderPractice();
        window.setTimeout(() => playSentence(false), 350);
      };
      grid.appendChild(button);
    });
  }

  function renderPractice(message = 'Listen first, then speak when you are ready.', tone = 'calm') {
    const supported = Boolean(Recognition);
    root.innerHTML = `<section class="screen speak-screen"><button class="menu-button" data-menu>Menu</button>
      <button class="secondary-button speak-back" data-back>← Categories</button>
      <div class="center speak-view"><p class="kicker">${category.emoji} ${category.title}</p><h1>Say it your way</h1>
      <p class="speak-progress">Sentence ${index + 1} / ${exercises().length} · Streak ${streak}</p>
      <div class="speak-card ${usingAlternative ? 'is-alternative' : ''}"><p class="speak-label">${languageName(learningLanguage)}${usingAlternative ? ' · easier version' : ''}</p>
      <p class="speak-sentence">${activeSentence()}</p><p class="speak-label">${languageName(nativeLanguage)}</p><p class="speak-translation">${activeTranslation()}</p></div>
      <p class="speak-feedback is-${tone}" data-feedback>${message}</p><p class="speak-heard" data-heard></p>
      <div class="speak-actions"><button class="secondary-button" data-listen>🔊 Listen</button>
      <button class="primary-button speak-mic" data-speak ${supported ? '' : 'disabled'}>${listening ? 'Listening…' : '🎙 Speak'}</button></div>
      ${supported ? '' : '<p class="speak-support">Speech recognition is not available in this browser. Chrome on Android usually supports it.</p>'}
      </div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-back]').onclick = showCategories;
    root.querySelector('[data-listen]').onclick = () => playSentence(false);
    if (supported) root.querySelector('[data-speak]').onclick = startListening;
  }

  async function playSentence(slower) {
    stopSpeech();
    await speak(activeSentence(), speechLanguage, {
      enabled: store.getState().audioOn,
      rate: slower ? .46 : .58
    });
  }

  async function celebrate() {
    streak += 1;
    attempts = 0;
    renderPractice(
      usingAlternative
        ? 'Yes — that worked. You expressed the same idea in a clearer way. ✨'
        : streak >= 3
          ? 'Beautiful — your voice is getting stronger! ✨'
          : 'That was good. You did it! ✨',
      'success'
    );
    await sleep(1350);
    index = (index + 1) % exercises().length;
    usingAlternative = false;
    renderPractice('Ready for the next small step.', 'calm');
    await playSentence(false);
  }

  async function softenAfterMiss(heard) {
    attempts += 1;
    streak = 0;

    if (!usingAlternative && attempts === 1) {
      renderPractice('Let us hear the same sentence once more, a little slower.', 'gentle');
      const node = root.querySelector('[data-heard]');
      if (node && heard) node.textContent = `I heard: “${heard}”`;
      await sleep(450);
      await playSentence(true);
      return;
    }

    if (!usingAlternative) {
      rememberForLater(activeSentence(), category.id, learningLanguage);
      usingAlternative = true;
      attempts = 0;
      renderPractice('Same meaning, easier sentence. We stay here until it feels good.', 'gentle');
      await sleep(550);
      await playSentence(true);
      return;
    }

    renderPractice(
      attempts === 1
        ? 'Stay with this easier sentence. Listen once more and take your time.'
        : 'No rush. We keep the easy sentence and try it together again.',
      'gentle'
    );
    const node = root.querySelector('[data-heard]');
    if (node && heard) node.textContent = `I heard: “${heard}”`;
    await sleep(500);
    await playSentence(true);
  }

  function startListening() {
    if (listening || !Recognition) return;
    stopSpeech();
    recognition = new Recognition();
    recognition.lang = speechLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    listening = true;
    renderPractice('I am listening. Take your time.', 'listening');

    recognition.onresult = async event => {
      const alternatives = Array.from(event.results?.[0] || []).map(result => result.transcript);
      const best = alternatives.reduce((winner, text) => {
        const score = similarity(activeSentence(), text, speechLanguage);
        return score > winner.score ? { text, score } : winner;
      }, { text: '', score: 0 });
      listening = false;
      if (best.score >= successThreshold()) await celebrate();
      else await softenAfterMiss(best.text);
    };

    recognition.onerror = event => {
      listening = false;
      const message = event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'Microphone access is needed. Nothing was marked wrong.'
        : 'I could not hear that clearly. We can simply try the same sentence again.';
      renderPractice(message, 'gentle');
    };
    recognition.onend = () => { listening = false; };
    try { recognition.start(); }
    catch (_) {
      listening = false;
      renderPractice('The microphone needs a short moment. Please tap Speak again.', 'gentle');
    }
  }

  showCategories();
}
