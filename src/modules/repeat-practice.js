import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getVoiceCategories } from '../voice/multilingual-library.js?v=1';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { getUiFamily } from '../app/ui-language.js?v=4';

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

const COPY = {
  en:{menu:'Menu',kicker:'Repeat after me',choose:'What do you want to practise?',hint:'Choose a theme and repeat the sentences out loud.',sentences:'sentences',back:'← Themes',title:'Listen and repeat',sentence:'Sentence',streak:'Streak',easier:'easier version',initial:'Listen first. Then repeat when you are ready.',listen:'Listen',speak:'🎙 Repeat',listening:'Listening…',success:'That was good. You did it! ✨',strong:'Beautiful — your voice is getting stronger! ✨',altSuccess:'Yes — that worked. Same idea, clearer words. ✨',slower:'Let us hear the same sentence once more, a little slower.',easy:'Same meaning, easier sentence. We will try this one.',stay:'Stay with this easier sentence. Listen once more and take your time.',heard:'I heard',mic:'Microphone access is needed. Nothing was marked wrong.',unclear:'I could not hear that clearly. Try the same sentence again.',moment:'The microphone needs a short moment. Tap Repeat again.',next:'Ready for the next sentence.',unsupported:'Speech recognition is not available in this browser.'},
  de:{menu:'Menü',kicker:'Nachsprechen',choose:'Was möchtest du üben?',hint:'Wähle ein Thema und sprich die Sätze laut nach.',sentences:'Sätze',back:'← Themen',title:'Anhören und nachsprechen',sentence:'Satz',streak:'Serie',easier:'leichtere Version',initial:'Hör zuerst zu. Sprich den Satz danach nach.',listen:'Anhören',speak:'🎙 Nachsprechen',listening:'Ich höre zu…',success:'Gut gemacht. ✨',strong:'Sehr schön — deine Stimme wird sicherer! ✨',altSuccess:'Ja — das hat funktioniert. Gleiche Aussage, leichter gesagt. ✨',slower:'Wir hören denselben Satz noch einmal etwas langsamer.',easy:'Gleiche Bedeutung, leichterer Satz. Wir versuchen diesen.',stay:'Bleib bei diesem leichteren Satz. Hör noch einmal zu und nimm dir Zeit.',heard:'Ich habe gehört',mic:'Für diese Übung wird Mikrofonzugriff benötigt. Nichts wurde als falsch gewertet.',unclear:'Ich konnte das nicht klar verstehen. Versuch denselben Satz noch einmal.',moment:'Das Mikrofon braucht einen kurzen Moment. Tippe noch einmal auf Nachsprechen.',next:'Bereit für den nächsten Satz.',unsupported:'Spracherkennung ist in diesem Browser nicht verfügbar.'},
  pt:{menu:'Menu',kicker:'Repetir',choose:'O que queres praticar?',hint:'Escolhe um tema e repete as frases em voz alta.',sentences:'frases',back:'← Temas',title:'Ouve e repete',sentence:'Frase',streak:'Sequência',easier:'versão mais fácil',initial:'Ouve primeiro. Depois repete quando quiseres.',listen:'Ouvir',speak:'🎙 Repetir',listening:'A ouvir…',success:'Muito bem. Conseguiste! ✨',strong:'Muito bem — a tua voz está cada vez mais segura! ✨',altSuccess:'Sim — funcionou. A mesma ideia com palavras mais simples. ✨',slower:'Vamos ouvir a mesma frase outra vez, mais devagar.',easy:'O mesmo significado, numa frase mais fácil. Vamos tentar esta.',stay:'Fica com esta frase mais fácil. Ouve outra vez e sem pressa.',heard:'Ouvi',mic:'É necessário permitir o microfone. Nada foi marcado como errado.',unclear:'Não ouvi com clareza. Tenta novamente a mesma frase.',moment:'O microfone precisa de um momento. Toca novamente em Repetir.',next:'Pronta para a próxima frase.',unsupported:'O reconhecimento de voz não está disponível neste navegador.'},
  es:{menu:'Menú',kicker:'Repetir',choose:'¿Qué quieres practicar?',hint:'Elige un tema y repite las frases en voz alta.',sentences:'frases',back:'← Temas',title:'Escucha y repite',sentence:'Frase',streak:'Racha',easier:'versión más fácil',initial:'Escucha primero. Después repite cuando quieras.',listen:'Escuchar',speak:'🎙 Repetir',listening:'Escuchando…',success:'Muy bien. ¡Lo hiciste! ✨',strong:'Muy bien — tu voz suena cada vez más segura. ✨',altSuccess:'Sí — funcionó. La misma idea con palabras más sencillas. ✨',slower:'Vamos a escuchar la misma frase otra vez, más despacio.',easy:'El mismo significado, con una frase más fácil. Probemos esta.',stay:'Quédate con esta frase más fácil. Escucha otra vez y tómate tu tiempo.',heard:'He oído',mic:'Se necesita acceso al micrófono. Nada se marcó como incorrecto.',unclear:'No pude oírlo con claridad. Prueba la misma frase otra vez.',moment:'El micrófono necesita un momento. Toca Repetir de nuevo.',next:'Lista para la siguiente frase.',unsupported:'El reconocimiento de voz no está disponible en este navegador.'},
  hr:{menu:'Izbornik',kicker:'Ponovi',choose:'Što želiš vježbati?',hint:'Odaberi temu i glasno ponavljaj rečenice.',sentences:'rečenica',back:'← Teme',title:'Poslušaj i ponovi',sentence:'Rečenica',streak:'Niz',easier:'lakša verzija',initial:'Najprije poslušaj. Zatim ponovi kad želiš.',listen:'Poslušaj',speak:'🎙 Ponovi',listening:'Slušam…',success:'Odlično. Uspjelo je! ✨',strong:'Predivno — tvoj glas postaje sigurniji! ✨',altSuccess:'Da — uspjelo je. Ista ideja, jednostavnije riječi. ✨',slower:'Poslušajmo istu rečenicu još jednom, malo sporije.',easy:'Isto značenje, lakša rečenica. Pokušajmo ovu.',stay:'Ostani uz ovu lakšu rečenicu. Poslušaj još jednom i uzmi vremena.',heard:'Čula sam',mic:'Potreban je pristup mikrofonu. Ništa nije označeno kao pogrešno.',unclear:'Nisam jasno čula. Pokušaj ponovno istu rečenicu.',moment:'Mikrofon treba trenutak. Dodirni Ponovi ponovno.',next:'Spremna za sljedeću rečenicu.',unsupported:'Prepoznavanje govora nije dostupno u ovom pregledniku.'},
  fr:{menu:'Menu',kicker:'Répéter',choose:'Que veux-tu pratiquer ?',hint:'Choisis un thème et répète les phrases à voix haute.',sentences:'phrases',back:'← Thèmes',title:'Écoute et répète',sentence:'Phrase',streak:'Série',easier:'version plus facile',initial:'Écoute d’abord. Puis répète quand tu veux.',listen:'Écouter',speak:'🎙 Répéter',listening:'J’écoute…',success:'Très bien. Tu l’as fait ! ✨',strong:'Très bien — ta voix devient plus assurée ! ✨',altSuccess:'Oui — ça a marché. La même idée avec des mots plus simples. ✨',slower:'Écoutons encore une fois la même phrase, plus lentement.',easy:'Le même sens, avec une phrase plus facile. Essayons celle-ci.',stay:'Reste avec cette phrase plus facile. Écoute encore une fois et prends ton temps.',heard:'J’ai entendu',mic:'L’accès au microphone est nécessaire. Rien n’a été marqué comme faux.',unclear:'Je n’ai pas entendu clairement. Essaie encore la même phrase.',moment:'Le microphone a besoin d’un instant. Appuie de nouveau sur Répéter.',next:'Prête pour la phrase suivante.',unsupported:'La reconnaissance vocale n’est pas disponible dans ce navigateur.'}
};

const CATEGORY_TITLES = {
  en:{'self-love':'Self-love',confidence:'Confidence',kindness:'Kindness',gratitude:'Gratitude',calm:'Calm',forgiveness:'Forgiveness',hope:'Hope',courage:'Courage','stoic-wisdom':'Stoic wisdom','spiral-thoughts':'Spiral thoughts',visualisation:'Visualisation',meditation:'Meditation',nature:'Nature'},
  de:{'self-love':'Selbstliebe',confidence:'Selbstvertrauen',kindness:'Freundlichkeit',gratitude:'Dankbarkeit',calm:'Ruhe',forgiveness:'Vergebung',hope:'Hoffnung',courage:'Mut','stoic-wisdom':'Stoische Weisheit','spiral-thoughts':'Gedankenspiralen',visualisation:'Visualisierung',meditation:'Meditation',nature:'Natur'},
  pt:{'self-love':'Amor-próprio',confidence:'Confiança',kindness:'Gentileza',gratitude:'Gratidão',calm:'Calma',forgiveness:'Perdão',hope:'Esperança',courage:'Coragem','stoic-wisdom':'Sabedoria estoica','spiral-thoughts':'Pensamentos em espiral',visualisation:'Visualização',meditation:'Meditação',nature:'Natureza'},
  es:{'self-love':'Amor propio',confidence:'Confianza',kindness:'Amabilidad',gratitude:'Gratitud',calm:'Calma',forgiveness:'Perdón',hope:'Esperanza',courage:'Valentía','stoic-wisdom':'Sabiduría estoica','spiral-thoughts':'Pensamientos en espiral',visualisation:'Visualización',meditation:'Meditación',nature:'Naturaleza'},
  hr:{'self-love':'Ljubav prema sebi',confidence:'Samopouzdanje',kindness:'Ljubaznost',gratitude:'Zahvalnost',calm:'Mir',forgiveness:'Oprost',hope:'Nada',courage:'Hrabrost','stoic-wisdom':'Stoička mudrost','spiral-thoughts':'Spiralne misli',visualisation:'Vizualizacija',meditation:'Meditacija',nature:'Priroda'},
  fr:{'self-love':'Amour de soi',confidence:'Confiance',kindness:'Bienveillance',gratitude:'Gratitude',calm:'Calme',forgiveness:'Pardon',hope:'Espoir',courage:'Courage','stoic-wisdom':'Sagesse stoïcienne','spiral-thoughts':'Pensées en boucle',visualisation:'Visualisation',meditation:'Méditation',nature:'Nature'}
};

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
    const key = 'speakup-repeat-later';
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (!saved.some(item => item.sentence === sentence && item.language === language)) {
      saved.push({ sentence, categoryId, language });
    }
    localStorage.setItem(key, JSON.stringify(saved.slice(-40)));
  } catch (_) {}
}

export function renderRepeatPractice(root, store) {
  const initialState = store.getState();
  const learningLanguage = initialState.learningLanguage;
  const nativeLanguage = initialState.nativeLanguage;
  const speechLanguage = getSpeechLanguage(learningLanguage);
  const nativeSpeechLanguage = getSpeechLanguage(nativeLanguage);
  const family = getUiFamily(nativeLanguage);
  const copy = COPY[family] || COPY.en;
  const categoryTitles = CATEGORY_TITLES[family] || CATEGORY_TITLES.en;
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
    store.setState({ screen:'menu' });
  }

  function showCategories() {
    stopSpeech();
    root.innerHTML = `<section class="screen speak-screen repeat-practice-screen"><button class="menu-button" data-menu>${copy.menu}</button>
      <div class="center speak-view"><p class="kicker">${copy.kicker} · ${languageName(learningLanguage)}</p><h1>${copy.choose}</h1>
      <p class="muted repeat-practice-hint">${copy.hint}</p>
      <div class="voice-category-grid" data-categories></div></div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    const grid = root.querySelector('[data-categories]');
    categories.forEach(item => {
      const button = document.createElement('button');
      button.className = 'voice-category-card';
      button.dataset.repeatCategory = item.id;
      button.innerHTML = `<span class="voice-category-emoji">${item.emoji}</span><span>${categoryTitles[item.id] || item.title}</span><small>${item.exercises.length} ${copy.sentences}</small>`;
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

  function renderPractice(message = copy.initial, tone = 'calm') {
    const supported = Boolean(Recognition);
    const sentence = activeSentence();
    const translation = activeTranslation();
    root.innerHTML = `<section class="screen speak-screen repeat-practice-screen"><button class="menu-button" data-menu>${copy.menu}</button>
      <button class="secondary-button speak-back" data-back>${copy.back}</button>
      <div class="center speak-view"><p class="kicker">${category.emoji} ${categoryTitles[category.id] || category.title}</p><h1>${copy.title}</h1>
      <p class="speak-progress">${copy.sentence} ${index + 1} / ${exercises().length} · ${copy.streak} ${streak}</p>
      <div class="speak-card ${usingAlternative ? 'is-alternative' : ''}">
        <p class="speak-label">${languageName(learningLanguage)}${usingAlternative ? ' · ' + copy.easier : ''}</p>
        <p class="speak-sentence" data-repeat-learning data-speech-language="${speechLanguage}">${sentence}</p>
        <p class="speak-label">${languageName(nativeLanguage)}</p>
        <p class="speak-translation" data-repeat-native data-speech-language="${nativeSpeechLanguage}">${translation}</p>
      </div>
      <p class="speak-feedback is-${tone}" data-feedback>${message}</p><p class="speak-heard" data-heard></p>
      <div class="speak-actions"><button class="secondary-button" data-listen>🔊 ${copy.listen}</button>
      <button class="primary-button speak-mic" data-speak ${supported ? '' : 'disabled'}>${listening ? copy.listening : copy.speak}</button></div>
      ${supported ? '' : `<p class="speak-support">${copy.unsupported}</p>`}
      </div></section>`;
    root.querySelector('[data-menu]').onclick = leave;
    root.querySelector('[data-back]').onclick = showCategories;
    root.querySelector('[data-listen]').onclick = () => playSentence(false);
    root.querySelector('[data-repeat-learning]').onclick = () => playSentence(false);
    root.querySelector('[data-repeat-native]').onclick = () => speak(translation, nativeSpeechLanguage, { enabled:store.getState().audioOn, rate:.62 }).catch(() => {});
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
    renderPractice(usingAlternative ? copy.altSuccess : (streak >= 3 ? copy.strong : copy.success), 'success');
    await sleep(1350);
    index = (index + 1) % exercises().length;
    usingAlternative = false;
    renderPractice(copy.next, 'calm');
    await playSentence(false);
  }

  async function showAlternativeAfterMiss(heard, message = copy.easy) {
    streak = 0;

    if (!usingAlternative) {
      rememberForLater(current().sentence, category.id, learningLanguage);
      usingAlternative = true;
      attempts = 0;
      renderPractice(message, 'gentle');
      const node = root.querySelector('[data-heard]');
      if (node && heard) node.textContent = `${copy.heard}: “${heard}”`;
      await sleep(420);
      await playSentence(true);
      return;
    }

    attempts += 1;
    renderPractice(copy.stay, 'gentle');
    const node = root.querySelector('[data-heard]');
    if (node && heard) node.textContent = `${copy.heard}: “${heard}”`;
    await sleep(420);
    await playSentence(true);
  }

  async function softenAfterMiss(heard) {
    attempts += 1;
    await showAlternativeAfterMiss(heard);
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
    renderPractice(copy.listening, 'listening');

    recognition.onresult = async event => {
      const alternatives = Array.from(event.results?.[0] || []).map(result => result.transcript);
      const best = alternatives.reduce((winner, text) => {
        const score = similarity(activeSentence(), text, speechLanguage);
        return score > winner.score ? { text, score } : winner;
      }, { text:'', score:0 });
      listening = false;
      if (best.score >= successThreshold()) await celebrate();
      else await softenAfterMiss(best.text);
    };

    recognition.onerror = async event => {
      listening = false;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        renderPractice(copy.mic, 'gentle');
        return;
      }
      await showAlternativeAfterMiss('', copy.easy);
    };
    recognition.onend = () => { listening = false; };
    try { recognition.start(); }
    catch (_) {
      listening = false;
      renderPractice(copy.moment, 'gentle');
    }
  }

  showCategories();
}
