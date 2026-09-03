import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getVoiceCategories } from '../voice/multilingual-library.js?v=1';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';
import { getUiFamily } from '../app/ui-language.js?v=4';

const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

const COPY = {
  en:{menu:'Menu',kicker:'Repeat after me',choose:'What do you want to practise?',hint:'Choose a theme and repeat the sentences out loud.',sentences:'sentences',back:'← Themes',title:'Listen and repeat',sentence:'Sentence',streak:'Streak',three:'3-word step',two:'2-word step',one:'1-word step',initial:'Listen first. Then repeat when you are ready.',listen:'Listen',speak:'🎙 Repeat',listening:'Listening…',success:'That was good. You did it! ✨',strong:'Beautiful — your voice is getting stronger! ✨',stepSuccess:'Yes — that worked. You did it! ✨',threePrompt:'Let’s make it smaller. Just these three words.',twoPrompt:'Good. Now only these two words.',onePrompt:'One tiny step: just this word.',stay:'Stay with this one word. Listen once more — no rush.',heard:'I heard',mic:'Microphone access is needed. Nothing was marked wrong.',moment:'The microphone needs a short moment. Tap Repeat again.',next:'Ready for the next sentence.',unsupported:'Speech recognition is not available in this browser.'},
  de:{menu:'Menü',kicker:'Nachsprechen',choose:'Was möchtest du üben?',hint:'Wähle ein Thema und sprich die Sätze laut nach.',sentences:'Sätze',back:'← Themen',title:'Anhören und nachsprechen',sentence:'Satz',streak:'Serie',three:'3-Wort-Schritt',two:'2-Wort-Schritt',one:'1 Wort',initial:'Hör zuerst zu. Sprich den Satz danach nach.',listen:'Anhören',speak:'🎙 Nachsprechen',listening:'Ich höre zu…',success:'Gut gemacht. Geschafft! ✨',strong:'Sehr schön — deine Stimme wird sicherer! ✨',stepSuccess:'Ja — das hat geklappt. Geschafft! ✨',threePrompt:'Wir machen es kleiner. Nur diese drei Wörter.',twoPrompt:'Gut. Jetzt nur noch diese zwei Wörter.',onePrompt:'Ein ganz kleiner Schritt: nur dieses Wort.',stay:'Bleib bei diesem einen Wort. Hör noch einmal zu — ohne Eile.',heard:'Ich habe gehört',mic:'Für diese Übung wird Mikrofonzugriff benötigt. Nichts wurde als falsch gewertet.',moment:'Das Mikrofon braucht einen kurzen Moment. Tippe noch einmal auf Nachsprechen.',next:'Bereit für den nächsten Satz.',unsupported:'Spracherkennung ist in diesem Browser nicht verfügbar.'},
  pt:{menu:'Menu',kicker:'Repetir',choose:'O que queres praticar?',hint:'Escolhe um tema e repete as frases em voz alta.',sentences:'frases',back:'← Temas',title:'Ouve e repete',sentence:'Frase',streak:'Sequência',three:'3 palavras',two:'2 palavras',one:'1 palavra',initial:'Ouve primeiro. Depois repete quando quiseres.',listen:'Ouvir',speak:'🎙 Repetir',listening:'A ouvir…',success:'Muito bem. Conseguiste! ✨',strong:'Muito bem — a tua voz está cada vez mais segura! ✨',stepSuccess:'Sim — funcionou. Conseguiste! ✨',threePrompt:'Vamos tornar mais pequeno. Só estas três palavras.',twoPrompt:'Boa. Agora só estas duas palavras.',onePrompt:'Um passo pequenino: só esta palavra.',stay:'Fica com esta palavra. Ouve outra vez, sem pressa.',heard:'Ouvi',mic:'É necessário permitir o microfone. Nada foi marcado como errado.',moment:'O microfone precisa de um momento. Toca novamente em Repetir.',next:'Pronta para a próxima frase.',unsupported:'O reconhecimento de voz não está disponível neste navegador.'},
  es:{menu:'Menú',kicker:'Repetir',choose:'¿Qué quieres practicar?',hint:'Elige un tema y repite las frases en voz alta.',sentences:'frases',back:'← Temas',title:'Escucha y repite',sentence:'Frase',streak:'Racha',three:'3 palabras',two:'2 palabras',one:'1 palabra',initial:'Escucha primero. Después repite cuando quieras.',listen:'Escuchar',speak:'🎙 Repetir',listening:'Escuchando…',success:'Muy bien. ¡Lo hiciste! ✨',strong:'Muy bien — tu voz suena cada vez más segura. ✨',stepSuccess:'Sí — funcionó. ¡Lo hiciste! ✨',threePrompt:'Vamos a hacerlo más pequeño. Solo estas tres palabras.',twoPrompt:'Bien. Ahora solo estas dos palabras.',onePrompt:'Un paso pequeñito: solo esta palabra.',stay:'Quédate con esta palabra. Escucha otra vez, sin prisa.',heard:'He oído',mic:'Se necesita acceso al micrófono. Nada se marcó como incorrecto.',moment:'El micrófono necesita un momento. Toca Repetir de nuevo.',next:'Lista para la siguiente frase.',unsupported:'El reconocimiento de voz no está disponible en este navegador.'},
  hr:{menu:'Izbornik',kicker:'Ponovi',choose:'Što želiš vježbati?',hint:'Odaberi temu i glasno ponavljaj rečenice.',sentences:'rečenica',back:'← Teme',title:'Poslušaj i ponovi',sentence:'Rečenica',streak:'Niz',three:'3 riječi',two:'2 riječi',one:'1 riječ',initial:'Najprije poslušaj. Zatim ponovi kad želiš.',listen:'Poslušaj',speak:'🎙 Ponovi',listening:'Slušam…',success:'Odlično. Uspjelo je! ✨',strong:'Predivno — tvoj glas postaje sigurniji! ✨',stepSuccess:'Da — uspjelo je. Bravo! ✨',threePrompt:'Smanjimo korak. Samo ove tri riječi.',twoPrompt:'Dobro. Sada samo ove dvije riječi.',onePrompt:'Još jedan mali korak: samo ova riječ.',stay:'Ostani uz ovu jednu riječ. Poslušaj još jednom, bez žurbe.',heard:'Čula sam',mic:'Potreban je pristup mikrofonu. Ništa nije označeno kao pogrešno.',moment:'Mikrofon treba trenutak. Dodirni Ponovi ponovno.',next:'Spremna za sljedeću rečenicu.',unsupported:'Prepoznavanje govora nije dostupno u ovom pregledniku.'},
  fr:{menu:'Menu',kicker:'Répéter',choose:'Que veux-tu pratiquer ?',hint:'Choisis un thème et répète les phrases à voix haute.',sentences:'phrases',back:'← Thèmes',title:'Écoute et répète',sentence:'Phrase',streak:'Série',three:'3 mots',two:'2 mots',one:'1 mot',initial:'Écoute d’abord. Puis répète quand tu veux.',listen:'Écouter',speak:'🎙 Répéter',listening:'J’écoute…',success:'Très bien. Tu l’as fait ! ✨',strong:'Très bien — ta voix devient plus assurée ! ✨',stepSuccess:'Oui — ça a marché. Tu l’as fait ! ✨',threePrompt:'On réduit encore. Seulement ces trois mots.',twoPrompt:'Bien. Maintenant seulement ces deux mots.',onePrompt:'Un tout petit pas : seulement ce mot.',stay:'Reste avec ce seul mot. Écoute encore une fois, sans pression.',heard:'J’ai entendu',mic:'L’accès au microphone est nécessaire. Rien n’a été marqué comme faux.',moment:'Le microphone a besoin d’un instant. Appuie de nouveau sur Répéter.',next:'Prête pour la phrase suivante.',unsupported:'Le reconnaissance vocale n’est pas disponible dans ce navigateur.'}
};

const CATEGORY_TITLES = {
  en:{'self-love':'Self-love',confidence:'Confidence',kindness:'Kindness',gratitude:'Gratitude',calm:'Calm',forgiveness:'Forgiveness',hope:'Hope',courage:'Courage','stoic-wisdom':'Stoic wisdom','spiral-thoughts':'Spiral thoughts',visualisation:'Visualisation',meditation:'Meditation',nature:'Nature'},
  de:{'self-love':'Selbstliebe',confidence:'Selbstvertrauen',kindness:'Freundlichkeit',gratitude:'Dankbarkeit',calm:'Ruhe',forgiveness:'Vergebung',hope:'Hoffnung',courage:'Mut','stoic-wisdom':'Stoische Weisheit','spiral-thoughts':'Gedankenspiralen',visualisation:'Visualisierung',meditation:'Meditation',nature:'Natur'},
  pt:{'self-love':'Amor-próprio',confidence:'Confiança',kindness:'Gentileza',gratitude:'Gratidão',calm:'Calma',forgiveness:'Perdão',hope:'Esperança',courage:'Coragem','stoic-wisdom':'Sabedoria estoica','spiral-thoughts':'Pensamentos em espiral',visualisation:'Visualização',meditation:'Meditação',nature:'Natureza'},
  es:{'self-love':'Amor propio',confidence:'Confianza',kindness:'Amabilidad',gratitude:'Gratitud',calm:'Calma',forgiveness:'Perdón',hope:'Esperanza',courage:'Valentía','stoic-wisdom':'Sabiduría estoica','spiral-thoughts':'Pensamientos en espiral',visualisation:'Visualización',meditation:'Meditación',nature:'Naturaleza'},
  hr:{'self-love':'Ljubav prema sebi',confidence:'Samopouzdanje',kindness:'Ljubaznost',gratitude:'Zahvalnost',calm:'Mir',forgiveness:'Oprost',hope:'Nada',courage:'Hrabrost','stoic-wisdom':'Stoička mudrost','spiral-thoughts':'Spiralne misli',visualisation:'Vizualizacija',meditation:'Meditacija',nature:'Priroda'},
  fr:{'self-love':'Amour de soi',confidence:'Confiance',kindness:'Bienveillance',gratitude:'Gratitude',calm:'Calme',forgiveness:'Pardon',hope:'Espoir',courage:'Courage','stoic-wisdom':'Sagesse stoïcienne','spiral-thoughts':'Pensées en boucle',visualisation:'Visualisation',meditation:'Méditation',nature:'Nature'}
};

function normalize(text, locale='en-GB') {
  return String(text||'').toLocaleLowerCase(locale).normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ').trim();
}

function similarity(expected, heard, locale) {
  const a=normalize(expected,locale).split(' ').filter(Boolean);
  const b=normalize(heard,locale).split(' ').filter(Boolean);
  if(!a.length||!b.length)return 0;
  const counts=new Map();
  b.forEach(word=>counts.set(word,(counts.get(word)||0)+1));
  let matches=0;
  a.forEach(word=>{const amount=counts.get(word)||0;if(amount>0){matches+=1;counts.set(word,amount-1);}});
  return (matches/a.length*.72)+(matches/b.length*.28);
}

function words(text) {
  return String(text||'').replace(/[.!?…,:;]+$/u,'').trim().split(/\s+/).filter(Boolean);
}

function tailWords(text,count) {
  const parts=words(text);
  return parts.slice(Math.max(0,parts.length-count)).join(' ');
}

function threeWordCore(shortText,fullText) {
  const shortParts=words(shortText);
  if(shortParts.length>=3)return shortParts.slice(-3).join(' ');
  const fullParts=words(fullText);
  if(fullParts.length>=3)return fullParts.slice(-3).join(' ');
  return shortParts.join(' ')||fullParts.join(' ');
}

function rememberForLater(sentence,categoryId,language) {
  try {
    const key='speakup-repeat-later';
    const saved=JSON.parse(localStorage.getItem(key)||'[]');
    if(!saved.some(item=>item.sentence===sentence&&item.language===language))saved.push({sentence,categoryId,language});
    localStorage.setItem(key,JSON.stringify(saved.slice(-40)));
  } catch (_) {}
}

export function renderRepeatPractice(root,store) {
  const initialState=store.getState();
  const learningLanguage=initialState.learningLanguage;
  const nativeLanguage=initialState.nativeLanguage;
  const speechLanguage=getSpeechLanguage(learningLanguage);
  const nativeSpeechLanguage=getSpeechLanguage(nativeLanguage);
  const family=getUiFamily(nativeLanguage);
  const copy=COPY[family]||COPY.en;
  const categoryTitles=CATEGORY_TITLES[family]||CATEGORY_TITLES.en;
  const categories=getVoiceCategories(learningLanguage,nativeLanguage);
  let category=null;
  let index=0;
  let stage=0;
  let recognition=null;
  let listening=false;
  let streak=0;

  const exercises=()=>category?.exercises||[];
  const current=()=>exercises()[index%Math.max(1,exercises().length)];
  const threeLearning=()=>threeWordCore(current().alternative,current().sentence);
  const threeNative=()=>threeWordCore(current().alternativeEnglish,current().english);
  const activeSentence=()=>stage===0?current().sentence:stage===1?threeLearning():stage===2?tailWords(threeLearning(),2):tailWords(threeLearning(),1);
  const activeTranslation=()=>stage===0?current().english:stage===1?threeNative():stage===2?tailWords(threeNative(),2):tailWords(threeNative(),1);
  const threshold=()=>stage===0?.64:stage===1?.58:stage===2?.54:.5;
  const stageLabel=()=>stage===1?copy.three:stage===2?copy.two:stage===3?copy.one:'';

  function leave() {
    recognition?.abort?.();
    stopSpeech();
    store.setState({screen:'menu'});
  }

  function showCategories() {
    stopSpeech();
    root.innerHTML=`<section class="screen speak-screen repeat-practice-screen"><button class="menu-button" data-menu>${copy.menu}</button>
      <div class="center speak-view"><p class="kicker">${copy.kicker} · ${languageName(learningLanguage)}</p><h1>${copy.choose}</h1>
      <p class="muted repeat-practice-hint">${copy.hint}</p><div class="voice-category-grid" data-categories></div></div></section>`;
    root.querySelector('[data-menu]').onclick=leave;
    const grid=root.querySelector('[data-categories]');
    categories.forEach(item=>{
      const button=document.createElement('button');
      button.className='voice-category-card';
      button.dataset.repeatCategory=item.id;
      button.innerHTML=`<span class="voice-category-emoji">${item.emoji}</span><span>${categoryTitles[item.id]||item.title}</span><small>${item.exercises.length} ${copy.sentences}</small>`;
      button.onclick=()=>{category=item;index=0;stage=0;streak=0;renderPractice();window.setTimeout(()=>playSentence(false),350);};
      grid.appendChild(button);
    });
  }

  function renderPractice(message=copy.initial,tone='calm') {
    const supported=Boolean(Recognition);
    const sentence=activeSentence();
    const translation=activeTranslation();
    root.innerHTML=`<section class="screen speak-screen repeat-practice-screen"><button class="menu-button" data-menu>${copy.menu}</button>
      <button class="secondary-button speak-back" data-back>${copy.back}</button>
      <div class="center speak-view"><p class="kicker">${category.emoji} ${categoryTitles[category.id]||category.title}</p><h1>${copy.title}</h1>
      <p class="speak-progress">${copy.sentence} ${index+1} / ${exercises().length} · ${copy.streak} ${streak}</p>
      <div class="speak-card ${stage>0?'is-alternative':''}">
        <p class="speak-label">${languageName(learningLanguage)}${stageLabel()?` · ${stageLabel()}`:''}</p>
        <p class="speak-sentence" data-repeat-learning data-speech-language="${speechLanguage}">${sentence}</p>
        <p class="speak-label">${languageName(nativeLanguage)}</p>
        <p class="speak-translation" data-repeat-native data-speech-language="${nativeSpeechLanguage}">${translation}</p>
      </div>
      <p class="speak-feedback is-${tone}" data-feedback>${message}</p><p class="speak-heard" data-heard></p>
      <div class="speak-actions"><button class="secondary-button" data-listen>🔊 ${copy.listen}</button>
      <button class="primary-button speak-mic" data-speak ${supported?'':'disabled'}>${listening?copy.listening:copy.speak}</button></div>
      ${supported?'':`<p class="speak-support">${copy.unsupported}</p>`}</div></section>`;
    root.querySelector('[data-menu]').onclick=leave;
    root.querySelector('[data-back]').onclick=showCategories;
    root.querySelector('[data-listen]').onclick=()=>playSentence(false);
    root.querySelector('[data-repeat-learning]').onclick=()=>playSentence(false);
    root.querySelector('[data-repeat-native]').onclick=()=>speak(translation,nativeSpeechLanguage,{enabled:store.getState().audioOn,rate:.62}).catch(()=>{});
    if(supported)root.querySelector('[data-speak]').onclick=startListening;
  }

  async function playSentence(slower) {
    stopSpeech();
    await speak(activeSentence(),speechLanguage,{enabled:store.getState().audioOn,rate:slower?.46:.58});
  }

  async function celebrate() {
    streak+=1;
    renderPractice(stage>0?copy.stepSuccess:(streak>=3?copy.strong:copy.success),'success');
    await sleep(1350);
    index=(index+1)%exercises().length;
    stage=0;
    renderPractice(copy.next,'calm');
    await playSentence(false);
  }

  async function moveDown(heard='') {
    if(stage===0){
      rememberForLater(current().sentence,category.id,learningLanguage);
      stage=1;
      renderPractice(copy.threePrompt,'gentle');
    }else if(stage===1){
      stage=2;
      renderPractice(copy.twoPrompt,'gentle');
    }else if(stage===2){
      stage=3;
      renderPractice(copy.onePrompt,'gentle');
    }else{
      renderPractice(copy.stay,'gentle');
    }
    const node=root.querySelector('[data-heard]');
    if(node&&heard)node.textContent=`${copy.heard}: “${heard}”`;
    await sleep(360);
    await playSentence(true);
  }

  function startListening() {
    if(listening||!Recognition)return;
    stopSpeech();
    recognition=new Recognition();
    recognition.lang=speechLanguage;
    recognition.interimResults=false;
    recognition.maxAlternatives=3;
    recognition.continuous=false;
    listening=true;
    renderPractice(copy.listening,'listening');

    recognition.onresult=async event=>{
      const alternatives=Array.from(event.results?.[0]||[]).map(result=>result.transcript);
      const best=alternatives.reduce((winner,text)=>{
        const score=similarity(activeSentence(),text,speechLanguage);
        return score>winner.score?{text,score}:winner;
      },{text:'',score:0});
      listening=false;
      if(best.score>=threshold())await celebrate();
      else await moveDown(best.text);
    };

    recognition.onerror=async event=>{
      listening=false;
      if(event.error==='not-allowed'||event.error==='service-not-allowed'){
        renderPractice(copy.mic,'gentle');
        return;
      }
      await moveDown('');
    };
    recognition.onend=()=>{listening=false;};
    try{recognition.start();}
    catch(_){listening=false;renderPractice(copy.moment,'gentle');}
  }

  showCategories();
}
