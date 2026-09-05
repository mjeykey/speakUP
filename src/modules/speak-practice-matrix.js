import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';
import { getSpeakingTopics } from '../data/speaking-conversations.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getUiFamily } from '../app/ui-language.js?v=4';

const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
const COPY={
  en:{menu:'Menu',kicker:'Speaking',choose:'What would you like to talk about?',hint:'Answer freely. There is no single correct sentence.',questions:'questions',back:'← Topics',question:'Question',listen:'Listen',answer:'🎙 Answer',listening:'Listening…',heard:'I heard',clear:'Great — that was clear.',natural:'A natural way to say it:',example:'Show an example',next:'Next question',retry:'I did not catch that. Take your time and try once more.',mic:'Microphone access is needed. Nothing was marked wrong.',unsupported:'Speech recognition is not available in this browser.'},
  de:{menu:'Menü',kicker:'Sprechen',choose:'Worüber möchtest du sprechen?',hint:'Antworte frei. Es gibt nicht nur einen richtigen Satz.',questions:'Fragen',back:'← Themen',question:'Frage',listen:'Anhören',answer:'🎙 Antworten',listening:'Ich höre zu…',heard:'Ich habe verstanden',clear:'Super — das war verständlich.',natural:'So könntest du es natürlich sagen:',example:'Beispiel zeigen',next:'Nächste Frage',retry:'Ich habe dich noch nicht verstanden. Lass dir Zeit und versuche es noch einmal.',mic:'Für diese Übung wird Mikrofonzugriff benötigt. Nichts wurde als falsch gewertet.',unsupported:'Spracherkennung ist in diesem Browser nicht verfügbar.'},
  pt:{menu:'Menu',kicker:'Falar',choose:'Sobre o que queres falar?',hint:'Responde livremente. Não existe apenas uma frase certa.',questions:'perguntas',back:'← Temas',question:'Pergunta',listen:'Ouvir',answer:'🎙 Responder',listening:'Estou a ouvir…',heard:'Percebi',clear:'Muito bem — foi claro.',natural:'Uma forma natural de dizer seria:',example:'Mostrar exemplo',next:'Próxima pergunta',retry:'Ainda não percebi. Sem pressa, tenta novamente.',mic:'É necessário permitir o microfone. Nada foi marcado como errado.',unsupported:'O reconhecimento de voz não está disponível neste navegador.'},
  es:{menu:'Menú',kicker:'Hablar',choose:'¿De qué quieres hablar?',hint:'Responde libremente. No hay una sola frase correcta.',questions:'preguntas',back:'← Temas',question:'Pregunta',listen:'Escuchar',answer:'🎙 Responder',listening:'Escuchando…',heard:'He entendido',clear:'Muy bien — se entendió claramente.',natural:'Una forma natural de decirlo sería:',example:'Mostrar ejemplo',next:'Siguiente pregunta',retry:'Todavía no te he entendido. Tómate tu tiempo e inténtalo otra vez.',mic:'Se necesita acceso al micrófono. Nada se marcó como incorrecto.',unsupported:'El reconocimiento de voz no está disponible en este navegador.'},
  hr:{menu:'Izbornik',kicker:'Govor',choose:'O čemu želiš razgovarati?',hint:'Odgovori slobodno. Ne postoji samo jedna točna rečenica.',questions:'pitanja',back:'← Teme',question:'Pitanje',listen:'Poslušaj',answer:'🎙 Odgovori',listening:'Slušam…',heard:'Razumjela sam',clear:'Odlično — bilo je jasno.',natural:'Prirodno bi se moglo reći:',example:'Prikaži primjer',next:'Sljedeće pitanje',retry:'Još te nisam razumjela. Uzmi vremena i pokušaj ponovno.',mic:'Potreban je pristup mikrofonu. Ništa nije označeno kao pogrešno.',unsupported:'Prepoznavanje govora nije dostupno u ovom pregledniku.'},
  fr:{menu:'Menu',kicker:'Parler',choose:'De quoi veux-tu parler ?',hint:'Réponds librement. Il n’y a pas une seule phrase correcte.',questions:'questions',back:'← Thèmes',question:'Question',listen:'Écouter',answer:'🎙 Répondre',listening:'J’écoute…',heard:'J’ai compris',clear:'Très bien — c’était clair.',natural:'Une façon naturelle de le dire serait :',example:'Voir un exemple',next:'Question suivante',retry:'Je n’ai pas encore compris. Prends ton temps et réessaie.',mic:'L’accès au microphone est nécessaire. Rien n’a été marqué comme faux.',unsupported:'La reconnaissance vocale n’est pas disponible dans ce navigateur.'}
};
const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');

export function renderSpeakPractice(root,store){
  const state=store.getState(),learningLanguage=state.learningLanguage,nativeLanguage=state.nativeLanguage;
  const speechLanguage=getSpeechLanguage(learningLanguage),copy=COPY[getUiFamily(nativeLanguage)]||COPY.en;
  const topics=getSpeakingTopics(learningLanguage,nativeLanguage),progressKey=`${learningLanguage}|${nativeLanguage}`;
  const saved=state.progress?.speakPractice?.[progressKey]||{};
  let topic=topics.find(item=>item.id===saved.topicId)||null,index=Math.max(0,Number(saved.currentIndex)||0);
  let recognition=null,listening=false,transcript='',message='',showExample=false;
  const current=()=>topic.turns[index%topic.turns.length];
  const save=()=>store.saveProgress?.('speakPractice',progressKey,{topicId:topic?.id||null,currentIndex:index,learningLanguage,nativeLanguage});
  const leave=()=>{recognition?.abort?.();stopSpeech();save();store.setState({screen:'menu'});};

  function showTopics(){
    recognition?.abort?.();stopSpeech();topic=null;transcript='';message='';showExample=false;
    root.innerHTML=`<section class="screen speak-screen free-speak-screen"><button class="menu-button" data-menu>${copy.menu}</button><div class="center speak-view"><p class="kicker">${copy.kicker} · ${esc(languageName(learningLanguage))}</p><h1>${copy.choose}</h1><p class="muted free-speak-hint">${copy.hint}</p><div class="free-speak-topic-grid" data-topics></div></div></section>`;
    root.querySelector('[data-menu]').onclick=leave;
    const grid=root.querySelector('[data-topics]');
    topics.forEach(item=>{const button=document.createElement('button');button.className='free-speak-topic';button.innerHTML=`<span>${item.emoji}</span><strong>${esc(item.title)}</strong><small>${item.turns.length} ${copy.questions}</small>`;button.onclick=()=>{topic=item;index=0;transcript='';message='';showExample=false;save();draw();window.setTimeout(playQuestion,260);};grid.appendChild(button);});
  }

  function draw(){
    const item=current();
    root.innerHTML=`<section class="screen speak-screen free-speak-screen"><button class="menu-button" data-menu>${copy.menu}</button><button class="secondary-button speak-back" data-back>${copy.back}</button><div class="center speak-view"><p class="kicker">${topic.emoji} ${esc(topic.title)}</p><p class="speak-progress">${copy.question} ${index+1} / ${topic.turns.length}</p><div class="free-speak-card"><p class="speak-label">${esc(languageName(learningLanguage))}</p><h1 class="free-speak-question">${esc(item.question)}</h1><p class="speak-label">${esc(languageName(nativeLanguage))}</p><p class="speak-translation">${esc(item.translation)}</p></div>${transcript?`<div class="free-speak-result"><p class="speak-label">${copy.heard}</p><p class="free-speak-transcript">“${esc(transcript)}”</p><p class="speak-feedback is-success">${copy.clear}</p>${showExample?`<p class="free-speak-natural">${copy.natural}</p><p class="free-speak-example">${esc(item.example)}</p><p class="speak-translation">${esc(item.exampleTranslation)}</p>`:`<button class="secondary-button" data-example>${copy.example}</button>`}</div>`:`<p class="speak-feedback ${listening?'is-listening':'is-gentle'}">${esc(message)}</p>`}<div class="speak-actions"><button class="secondary-button" data-listen>🔊 ${copy.listen}</button>${transcript?`<button class="primary-button" data-next>${copy.next}</button>`:`<button class="primary-button speak-mic" data-answer ${Recognition?'':'disabled'}>${listening?copy.listening:copy.answer}</button>`}</div>${Recognition?'':`<p class="speak-support">${copy.unsupported}</p>`}</div></section>`;
    root.querySelector('[data-menu]').onclick=leave;root.querySelector('[data-back]').onclick=showTopics;root.querySelector('[data-listen]').onclick=playQuestion;
    root.querySelector('[data-example]')?.addEventListener('click',()=>{showExample=true;draw();});
    root.querySelector('[data-next]')?.addEventListener('click',()=>{index=(index+1)%topic.turns.length;transcript='';message='';showExample=false;save();draw();window.setTimeout(playQuestion,220);});
    root.querySelector('[data-answer]')?.addEventListener('click',startListening);
  }
  function playQuestion(){stopSpeech();return speak(current().question,speechLanguage,{enabled:store.getState().audioOn,rate:.66}).catch(()=>{});}
  function startListening(){
    if(listening||!Recognition)return;stopSpeech();recognition=new Recognition();recognition.lang=speechLanguage;recognition.interimResults=false;recognition.maxAlternatives=1;recognition.continuous=false;listening=true;message=copy.listening;draw();
    recognition.onresult=event=>{listening=false;transcript=String(event.results?.[0]?.[0]?.transcript||'').trim();message=transcript?copy.clear:copy.retry;draw();};
    recognition.onerror=event=>{listening=false;message=(event.error==='not-allowed'||event.error==='service-not-allowed')?copy.mic:copy.retry;draw();};
    recognition.onend=()=>{if(!listening)return;listening=false;message=copy.retry;draw();};
    try{recognition.start();}catch(_){listening=false;message=copy.retry;draw();}
  }
  showTopics();
}
