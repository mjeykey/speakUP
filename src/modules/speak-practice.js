import { speak, stopSpeech } from '../audio/speech.js?v=52';
import { VOICE_CATEGORIES } from '../voice/index.js?v=52';

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

function normalize(text) {
  return String(text || '').toLocaleLowerCase('pt-PT').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function similarity(expected, heard) {
  const a = normalize(expected).split(' ').filter(Boolean);
  const b = normalize(heard).split(' ').filter(Boolean);
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

function rememberForLater(sentence, categoryId) {
  try {
    const key = 'speakup-practice-later';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (!saved.some(item => item.sentence === sentence)) saved.push({ sentence, categoryId });
    localStorage.setItem(key, JSON.stringify(saved.slice(-40)));
  } catch (_) {}
}

export function renderSpeakPractice(root, store) {
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
  const activeEnglish = () => usingAlternative ? current().alternativeEnglish : current().english;

  function leave() {
    recognition?.abort?.();
    stopSpeech();
    store.setState({ screen: 'menu' });
  }

  function showCategories() {
    stopSpeech();
    root.innerHTML = `<section class="screen speak-screen"><button class="menu-button" data-menu>Menu</button>
      <div class="center speak-view"><p class="kicker">Speak & Grow</p><h1>What do you need today?</h1>
      <p class="muted">Choose one feeling or learning path. Every category now contains 50 voice exercises.</p>
      <div class="voice-category-grid" data-categories></div></div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    const grid = root.querySelector('[data-categories]');
    VOICE_CATEGORIES.forEach(item => {
      const button = document.createElement('button');
      button.className = 'voice-category-card';
      button.innerHTML = `<span class="voice-category-emoji">${item.emoji}</span><span>${item.title}</span><small>${item.description}</small><small>${item.exercises.length} sentences</small>`;
      button.onclick = () => {
        category = item; index = 0; attempts = 0; streak = 0; usingAlternative = false;
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
      <div class="speak-card ${usingAlternative ? 'is-alternative' : ''}"><p class="speak-label">Português</p>
      <p class="speak-sentence">${activeSentence()}</p><p class="speak-translation">${activeEnglish()}</p></div>
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
    await speak(activeSentence(), 'pt-PT', { enabled: store.getState().audioOn, rate: slower ? .48 : .58 });
  }

  async function celebrate() {
    streak += 1; attempts = 0;
    renderPractice(streak >= 3 ? 'Beautiful — your voice is getting stronger! ✨' : 'That was good. You did it! ✨', 'success');
    await sleep(1250);
    index = (index + 1) % exercises().length;
    usingAlternative = false;
    renderPractice('Ready for the next small step.', 'calm');
    await playSentence(false);
  }

  async function softenAfterMiss(heard) {
    attempts += 1; streak = 0;
    if (attempts === 1) {
      renderPractice('Almost. Let us hear it once more, a little slower.', 'gentle');
      const node = root.querySelector('[data-heard]');
      if (node && heard) node.textContent = `I heard: “${heard}”`;
      await sleep(450); await playSentence(true); return;
    }
    rememberForLater(activeSentence(), category.id);
    usingAlternative = true; attempts = 0;
    renderPractice('Let us try the same idea in an easier way. You can do this.', 'gentle');
    await sleep(550); await playSentence(true);
  }

  function startListening() {
    if (listening || !Recognition) return;
    stopSpeech();
    recognition = new Recognition();
    recognition.lang = 'pt-PT'; recognition.interimResults = false;
    recognition.maxAlternatives = 3; recognition.continuous = false;
    listening = true; renderPractice('I am listening. Take your time.', 'listening');
    recognition.onresult = async event => {
      const alternatives = Array.from(event.results?.[0] || []).map(result => result.transcript);
      const best = alternatives.reduce((winner, text) => {
        const score = similarity(activeSentence(), text);
        return score > winner.score ? { text, score } : winner;
      }, { text: '', score: 0 });
      listening = false;
      if (best.score >= .64) await celebrate(); else await softenAfterMiss(best.text);
    };
    recognition.onerror = event => {
      listening = false;
      const message = event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'Microphone access is needed. Nothing was marked wrong.'
        : 'I could not hear that clearly. Let us simply try once more.';
      renderPractice(message, 'gentle');
    };
    recognition.onend = () => { listening = false; };
    try { recognition.start(); }
    catch (_) { listening = false; renderPractice('The microphone needs a short moment. Please tap Speak again.', 'gentle'); }
  }

  showCategories();
}
