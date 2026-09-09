import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';
import { getSpeakingTopics, isRelevantSpeakingAnswer } from '../data/speaking-conversations.js?v=6';
import { getSpeakingAdditions } from '../data/speaking-additions/index.js?v=2';
import { polishCroatianSpeakingTurn, getRecommendedSpeakingSentence, getAlternativeSpeakingSentence } from '../data/speaking-croatian-quality.js?v=12';
import { isSpeakingAnswerIncomplete, getSpeakingConversationScaffold, isEasyConversationAnswer, getEasyConversationAnswerIntent } from '../data/speaking-conversation-scaffold.js?v=2';
import { getSpeakingRepairDecision } from '../data/speaking-repair-strategy.js?v=3';
import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getUiFamily } from '../app/ui-language.js?v=4';

const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
const COPY={
  en:{menu:'Menu',kicker:'Speaking',choose:'What would you like to talk about?',hint:'Answer freely. There is no single correct sentence.',questions:'questions',back:'← Topics',question:'Question',listen:'Listen',answer:'🎙 Answer',listening:'Listening…',heard:'I heard',clear:'Great — I understood your answer and it matched the topic.',recommended:'Recommended pronunciation',hearAgain:'Hear again',alternative:'Alternative sentence',hearAlternative:'Hear alternative',grammar:'I understood the topic, but this sentence form looks unusual. Try it once more and compare it with the recommended pronunciation below.',incomplete:'I understood the word. Please answer in a complete sentence.',offTopic:'I understood your sentence, but I could not clearly connect it to the question. Please use at least one word from the question or topic.',natural:'A natural way to say it:',example:'Show an example',next:'Next question',retry:'I did not catch that. Take your time and try once more.',mic:'Microphone access is needed. Nothing was marked wrong.',unsupported:'Speech recognition is not available in this browser.',continue:'I got what you mean — let’s continue the conversation naturally.',followUp:'Let’s continue',exampleHelp:'No problem — let’s make it easier. You can simply answer yes or no.',easyExample:'An easy example',yesNo:'You can simply answer yes or no'},
  de:{menu:'Menü',kicker:'Sprechen',choose:'Worüber möchtest du sprechen?',hint:'Antworte frei. Es gibt nicht nur einen richtigen Satz.',questions:'Fragen',back:'← Themen',question:'Frage',listen:'Anhören',answer:'🎙 Antworten',listening:'Ich höre zu…',heard:'Ich habe verstanden',clear:'Super — ich habe deine Antwort verstanden und sie passte zum Thema.',recommended:'Empfohlene Aussprache',hearAgain:'Noch einmal hören',alternative:'Alternativsatz',hearAlternative:'Alternative anhören',grammar:'Ich habe das Thema verstanden, aber die Satzform klingt ungewöhnlich. Versuche es noch einmal und vergleiche mit der empfohlenen Aussprache unten.',incomplete:'Ich habe das Wort verstanden. Antworte bitte in einem vollständigen Satz.',offTopic:'Ich habe deinen Satz verstanden, konnte ihn aber nicht eindeutig mit der Frage verbinden. Verwende bitte mindestens ein Wort aus der Frage oder dem Thema.',natural:'So könntest du es natürlich sagen:',example:'Beispiel zeigen',next:'Nächste Frage',retry:'Ich habe dich noch nicht verstanden. Lass dir Zeit und versuche es noch einmal.',mic:'Für diese Übung wird Mikrofonzugriff benötigt. Nichts wurde als falsch gewertet.',unsupported:'Spracherkennung ist in diesem Browser nicht verfügbar.',continue:'Ich weiß, was du meinst — wir führen das Gespräch einfach natürlich weiter.',followUp:'Weiter im Gespräch',exampleHelp:'Kein Problem — wir machen es leichter. Du kannst einfach mit Ja oder Nein antworten.',easyExample:'Ein einfaches Beispiel',yesNo:'Du kannst einfach mit Ja oder Nein antworten'},
  pt:{menu:'Menu',kicker:'Falar',choose:'Sobre o que queres falar?',hint:'Responde livremente. Não existe apenas uma frase certa.',questions:'perguntas',back:'← Temas',question:'Pergunta',listen:'Ouvir',answer:'🎙 Responder',listening:'Estou a ouvir…',heard:'Percebi',clear:'Muito bem — percebi a tua resposta e ela correspondeu ao tema.',recommended:'Pronúncia recomendada',hearAgain:'Ouvir novamente',alternative:'Frase alternativa',hearAlternative:'Ouvir alternativa',grammar:'Percebi o tema, mas esta forma da frase parece pouco natural. Tenta novamente e compara com a pronúncia recomendada abaixo.',incomplete:'Percebi a palavra. Responde, por favor, com uma frase completa.',offTopic:'Percebi a tua frase, mas não consegui relacioná-la claramente com a pergunta. Usa pelo menos uma palavra da pergunta ou do tema.',natural:'Uma forma natural de dizer seria:',example:'Mostrar exemplo',next:'Próxima pergunta',retry:'Ainda não percebi. Sem pressa, tenta novamente.',mic:'É necessário permitir o microfone. Nada foi marcado como errado.',unsupported:'O reconhecimento de voz não está disponível neste navegador.',continue:'Percebi o que queres dizer — vamos continuar a conversa naturalmente.',followUp:'Vamos continuar',exampleHelp:'Sem problema — vamos tornar isto mais fácil. Podes responder apenas sim ou não.',easyExample:'Um exemplo simples',yesNo:'Podes responder apenas sim ou não'},
  es:{menu:'Menú',kicker:'Hablar',choose:'¿De qué quieres hablar?',hint:'Responde libremente. No hay una sola frase correcta.',questions:'preguntas',back:'← Temas',question:'Pregunta',listen:'Escuchar',answer:'🎙 Responder',listening:'Escuchando…',heard:'He entendido',clear:'Muy bien — entendí tu respuesta y coincidía con el tema.',recommended:'Pronunciación recomendada',hearAgain:'Escuchar otra vez',alternative:'Frase alternativa',hearAlternative:'Escuchar alternativa',grammar:'Entendí el tema, pero esta forma de la frase suena poco natural. Inténtalo otra vez y compárala con la pronunciación recomendada de abajo.',incomplete:'He entendido la palabra. Responde, por favor, con una frase completa.',offTopic:'He entendido tu frase, pero no he podido relacionarla claramente con la pregunta. Usa al menos una palabra de la pregunta o del tema.',natural:'Una forma natural de decirlo sería:',example:'Mostrar ejemplo',next:'Siguiente pregunta',retry:'Todavía no te he entendido. Tómate tu tiempo e inténtalo otra vez.',mic:'Se necesita acceso al micrófono. Nada se marcó como incorrecto.',unsupported:'El reconocimiento de voz no está disponible en este navegador.',continue:'Entiendo lo que quieres decir — sigamos la conversación de forma natural.',followUp:'Sigamos',exampleHelp:'No pasa nada — lo hacemos más fácil. Puedes responder solo sí o no.',easyExample:'Un ejemplo sencillo',yesNo:'Puedes responder solo sí o no'},
  hr:{menu:'Izbornik',kicker:'Govor',choose:'O čemu želiš razgovarati?',hint:'Odgovori slobodno. Ne postoji samo jedna točna rečenica.',questions:'pitanja',back:'← Teme',question:'Pitanje',listen:'Poslušaj',answer:'🎙 Odgovori',listening:'Slušam…',heard:'Razumjela sam',clear:'Odlično — razumjela sam odgovor i odgovarao je temi.',recommended:'Preporučeni izgovor',hearAgain:'Poslušaj ponovno',alternative:'Alternativna rečenica',hearAlternative:'Poslušaj alternativu',grammar:'Razumjela sam temu, ali ovaj oblik rečenice zvuči neobično. Pokušaj ponovno i usporedi s preporučenim izgovorom ispod.',incomplete:'Razumjela sam riječ. Odgovori, molim te, cijelom rečenicom.',offTopic:'Razumjela sam tvoju rečenicu, ali je nisam mogla jasno povezati s pitanjem. Upotrijebi barem jednu riječ iz pitanja ili teme.',natural:'Prirodno bi se moglo reći:',example:'Prikaži primjer',next:'Sljedeće pitanje',retry:'Još te nisam razumjela. Uzmi vremena i pokušaj ponovno.',mic:'Potreban je pristup mikrofonu. Ništa nije označeno kao pogrešno.',unsupported:'Prepoznavanje govora nije dostupno u ovom pregledniku.',continue:'Razumjela sam što želiš reći — nastavimo razgovor prirodno.',followUp:'Nastavimo razgovor',exampleHelp:'Nema problema — učinimo ovo lakšim. Možeš jednostavno odgovoriti da ili ne.',easyExample:'Jednostavan primjer',yesNo:'Možeš jednostavno odgovoriti da ili ne'},
  fr:{menu:'Menu',kicker:'Parler',choose:'De quoi veux-tu parler ?',hint:'Réponds librement. Il n’y a pas une seule phrase correcte.',questions:'questions',back:'← Thèmes',question:'Question',listen:'Écouter',answer:'🎙 Répondre',listening:'J’écoute…',heard:'J’ai compris',clear:'Très bien — j’ai compris ta réponse et elle correspondait au thème.',recommended:'Prononciation recommandée',hearAgain:'Réécouter',alternative:'Phrase alternative',hearAlternative:'Écouter l’alternative',grammar:'J’ai compris le thème, mais cette forme de phrase semble peu naturelle. Réessaie et compare avec la prononciation recommandée ci-dessous.',incomplete:'J’ai compris la parole. Réponds, s’il te plaît, avec une phrase complète.',offTopic:'J’ai compris ta phrase, mais je n’ai pas pu la relier clairement à la question. Utilise au moins un mot de la question ou du thème.',natural:'Une façon naturelle de le dire serait :',example:'Voir un exemple',next:'Question suivante',retry:'Je n’ai pas encore compris. Prends ton temps et réessaie.',mic:'L’accès au microphone est nécessaire. Rien n’a été marqué comme faux.',unsupported:'Le reconnaissance vocale n’est pas disponible dans ce navigateur.',continue:'J’ai compris ce que tu veux dire — continuons la conversation naturellement.',followUp:'Continuons',exampleHelp:'Pas de problème — on simplifie. Tu peux simplement répondre oui ou non.',easyExample:'Un exemple simple',yesNo:'Tu peux simplement répondre oui ou non'}
};

const REPAIR_COPY={
  en:{feedback:'I think I understood you — let’s check.',title:'Did you mean:',help:'You can simply answer yes or no.',listen:'Hear suggestion'},
  de:{feedback:'Ich glaube, ich habe dich verstanden — prüfen wir kurz.',title:'Meintest du:',help:'Du kannst einfach mit Ja oder Nein antworten.',listen:'Vorschlag anhören'},
  pt:{feedback:'Acho que percebi — vamos confirmar.',title:'Quiseste dizer:',help:'Podes responder apenas sim ou não.',listen:'Ouvir sugestão'},
  es:{feedback:'Creo que te entendí — vamos a comprobarlo.',title:'¿Querías decir:',help:'Puedes responder solo sí o no.',listen:'Escuchar sugerencia'},
  hr:{feedback:'Mislim da sam te razumjela — provjerimo.',title:'Jesi li htjela reći:',help:'Možeš samo odgovoriti da ili ne.',listen:'Poslušaj prijedlog'},
  fr:{feedback:'Je pense avoir compris — vérifions.',title:'Tu voulais dire :',help:'Tu peux répondre simplement oui ou non.',listen:'Écouter la suggestion'}
};

const PREVIOUS_COPY={en:'Previous question',de:'Vorherige Frage',pt:'Pergunta anterior',es:'Pregunta anterior',hr:'Prethodno pitanje',fr:'Question précédente'};

const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const hasMoreThanOneWord=value=>String(value||'').trim().split(/\s+/).filter(Boolean).length>1;
const validationText=(value,learningLanguage)=>{
  const text=String(value||'');
  if(!String(learningLanguage||'').toLowerCase().startsWith('hr'))return text;
  return text.replace(/\bhobby\b/giu,'hobijima').replace(/\bhobi(?:ji|ja|je|ju|jem|jima)?\b/giu,'hobijima');
};
const isRelevantCandidate=(value,item,learningLanguage)=>hasMoreThanOneWord(value)&&isRelevantSpeakingAnswer(validationText(value,learningLanguage),item);

export function renderSpeakPractice(root,store){
  const state=store.getState(),learningLanguage=state.learningLanguage,nativeLanguage=state.nativeLanguage;
  const speechLanguage=getSpeechLanguage(learningLanguage),uiFamily=getUiFamily(nativeLanguage),copy=COPY[uiFamily]||COPY.en,repairCopy=REPAIR_COPY[uiFamily]||REPAIR_COPY.en,previousLabel=PREVIOUS_COPY[uiFamily]||PREVIOUS_COPY.en;
  const topics=getSpeakingTopics(learningLanguage,nativeLanguage).map(item=>({...item,turns:[...item.turns,...getSpeakingAdditions(item.id,learningLanguage,nativeLanguage)].map(turn=>polishCroatianSpeakingTurn(turn,learningLanguage,nativeLanguage))}));
  const progressKey=`${learningLanguage}|${nativeLanguage}`;
  const saved=state.progress?.speakPractice?.[progressKey]||{};
  let topic=topics.find(item=>item.id===saved.topicId)||null,index=Math.max(0,Number(saved.currentIndex)||0);
  let resumeTopicId=topic?.id||saved.topicId||null,resumeIndex=index;
  let recognition=null,listening=false,transcript='',heardAttempt='',message='',pronunciationText='',alternativeText='',recognitionTimer=null;
  let conversationStep=0,conversationSupport=null,repairSuggestion='',repairOriginal='';

  const current=()=>topic.turns[index%topic.turns.length];
  const clearRecognitionTimer=()=>{if(recognitionTimer!==null){window.clearTimeout(recognitionTimer);recognitionTimer=null;}};
  const rememberCurrent=()=>{if(topic){resumeTopicId=topic.id;resumeIndex=index;}};
  const save=()=>{rememberCurrent();store.saveProgress?.('speakPractice',progressKey,{topicId:resumeTopicId,currentIndex:resumeIndex,learningLanguage,nativeLanguage});};
  const resetTurnState=()=>{transcript='';heardAttempt='';message='';pronunciationText='';alternativeText='';conversationStep=0;conversationSupport=null;repairSuggestion='';repairOriginal='';};
  const advance=()=>{stopSpeech();index=(index+1)%topic.turns.length;resetTurnState();save();draw();window.setTimeout(playQuestion,220);};
  const goPrevious=()=>{if(index<=0)return;clearRecognitionTimer();recognition?.abort?.();listening=false;stopSpeech();index-=1;resetTurnState();save();draw();window.setTimeout(playQuestion,220);};
  const leave=()=>{clearRecognitionTimer();recognition?.abort?.();stopSpeech();save();store.setState({screen:'menu'});};

  function showTopics(){
    clearRecognitionTimer();recognition?.abort?.();stopSpeech();save();topic=null;resetTurnState();
    root.innerHTML=`<section class="screen speak-screen free-speak-screen"><button class="menu-button" data-menu>${copy.menu}</button><div class="center speak-view"><p class="kicker">${copy.kicker} · ${esc(languageName(learningLanguage))}</p><h1>${copy.choose}</h1><p class="muted free-speak-hint">${copy.hint}</p><div class="free-speak-topic-grid" data-topics></div></div></section>`;
    root.querySelector('[data-menu]').onclick=leave;
    const grid=root.querySelector('[data-topics]');
    topics.forEach(item=>{
      const button=document.createElement('button');
      button.className='free-speak-topic';
      button.innerHTML=`<span>${item.emoji}</span><strong>${esc(item.title)}</strong><small>${item.turns.length} ${copy.questions}</small>`;
      button.onclick=()=>{topic=item;index=item.id===resumeTopicId?Math.min(Math.max(0,resumeIndex),Math.max(0,item.turns.length-1)):0;resetTurnState();save();draw();window.setTimeout(playQuestion,260);};
      grid.appendChild(button);
    });
  }

  function conversationBlock(){
    if(!conversationSupport||!conversationStep)return '';
    if(conversationStep===1){
      return `<div class="free-speak-result free-speak-conversation-card"><p class="speak-label">${esc(copy.followUp)}</p><p class="free-speak-example">${esc(conversationSupport.followUp)}</p><p class="speak-translation">${esc(conversationSupport.followUpTranslation)}</p></div>`;
    }
    return `<div class="free-speak-result free-speak-conversation-card"><p class="speak-label">${esc(copy.easyExample)}</p><p class="free-speak-example">${esc(conversationSupport.example)}</p><p class="speak-translation">${esc(conversationSupport.exampleTranslation)}</p><p class="speak-label">${esc(copy.yesNo)}</p><p class="free-speak-example">${esc(conversationSupport.easyQuestion)}</p><p class="speak-translation">${esc(conversationSupport.easyTranslation)}</p></div>`;
  }

  function repairBlock(){
    if(!repairSuggestion)return '';
    return `<div class="free-speak-result free-speak-repair-card"><p class="speak-label">${esc(repairCopy.title)}</p><p class="free-speak-example">${esc(repairSuggestion)}</p><button class="secondary-button" data-repair-listen>🔊 ${esc(repairCopy.listen)}</button><p class="speak-translation">${esc(repairCopy.help)}</p></div>`;
  }

  function draw(){
    const item=current();
    const resultBlock=transcript?`<div class="free-speak-result"><p class="speak-label">${copy.heard}</p><p class="free-speak-transcript">“${esc(transcript)}”</p><p class="speak-feedback is-success">${copy.clear}</p></div>`:heardAttempt?`<div class="free-speak-result"><p class="speak-label">${copy.heard}</p><p class="free-speak-transcript">“${esc(heardAttempt)}”</p><p class="speak-feedback is-gentle">${esc(message)}</p></div>`:`<p class="speak-feedback ${listening?'is-listening':'is-gentle'}">${esc(message)}</p>`;
    const alternativeBlock=alternativeText?`<div class="free-speak-alternative"><p class="speak-label">${esc(copy.alternative)}</p><p class="speak-translation">${esc(alternativeText)}</p><button class="secondary-button" data-alternative>🔊 ${esc(copy.hearAlternative)}</button></div>`:'';
    const pronunciationBlock=pronunciationText?`<div class="free-speak-result free-speak-pronunciation-card"><p class="speak-label">${esc(copy.recommended)}</p><p class="free-speak-example">${esc(pronunciationText)}</p><button class="secondary-button" data-pronunciation>🔊 ${esc(copy.hearAgain)}</button>${alternativeBlock}</div>`:'';
    root.innerHTML=`<section class="screen speak-screen free-speak-screen"><button class="menu-button" data-menu>${copy.menu}</button><button class="secondary-button speak-back" data-back>${copy.back}</button><div class="center speak-view"><p class="kicker">${topic.emoji} ${esc(topic.title)}</p><p class="speak-progress">${copy.question} ${index+1} / ${topic.turns.length}</p><div class="speak-question-nav"><button class="secondary-button" data-prev ${index<=0?'disabled':''}>← ${esc(previousLabel)}</button></div><div class="free-speak-card"><p class="speak-label">${esc(languageName(learningLanguage))}</p><h1 class="free-speak-question">${esc(item.question)}</h1><p class="speak-label">${esc(languageName(nativeLanguage))}</p><p class="speak-translation">${esc(item.translation)}</p></div><div class="free-speak-result free-speak-example-card"><p class="free-speak-natural">${copy.natural}</p><p class="free-speak-example">${esc(item.example)}</p><p class="speak-translation">${esc(item.exampleTranslation)}</p></div>${resultBlock}${repairBlock()}${conversationBlock()}${pronunciationBlock}<div class="speak-actions"><button class="secondary-button" data-listen>🔊 ${copy.listen}</button>${transcript?`<button class="primary-button" data-next>${copy.next}</button>`:`<button class="primary-button speak-mic" data-answer ${Recognition?'':'disabled'}>${listening?copy.listening:copy.answer}</button>`}</div>${Recognition?'':`<p class="speak-support">${copy.unsupported}</p>`}</div></section>`;
    root.querySelector('[data-menu]').onclick=leave;
    root.querySelector('[data-back]').onclick=showTopics;
    root.querySelector('[data-prev]')?.addEventListener('click',goPrevious);
    root.querySelector('[data-listen]').onclick=repairSuggestion?playRepairSuggestion:conversationStep?playConversationPrompt:playQuestion;
    root.querySelector('[data-repair-listen]')?.addEventListener('click',playRepairSuggestion);
    root.querySelector('[data-pronunciation]')?.addEventListener('click',playRecommendedPronunciation);
    root.querySelector('[data-alternative]')?.addEventListener('click',playAlternativeSentence);
    root.querySelector('[data-next]')?.addEventListener('click',advance);
    root.querySelector('[data-answer]')?.addEventListener('click',startListening);
  }

  function playQuestion(){stopSpeech();return speak(current().question,speechLanguage,{enabled:store.getState().audioOn,rate:.66}).catch(()=>{});}
  function playRepairSuggestion(){if(!repairSuggestion)return Promise.resolve();stopSpeech();return speak(repairSuggestion,speechLanguage,{enabled:store.getState().audioOn,rate:.72}).catch(()=>{});}
  function playRecommendedPronunciation(){if(!pronunciationText)return Promise.resolve();stopSpeech();return speak(pronunciationText,speechLanguage,{enabled:store.getState().audioOn,rate:.72}).catch(()=>{});}
  function playAlternativeSentence(){if(!alternativeText)return Promise.resolve();stopSpeech();return speak(alternativeText,speechLanguage,{enabled:store.getState().audioOn,rate:.72}).catch(()=>{});}
  function playConversationPrompt(){
    if(!conversationSupport)return Promise.resolve();
    const text=conversationStep===1?conversationSupport.followUp:`${conversationSupport.example} ${conversationSupport.easyQuestion}`;
    stopSpeech();
    return speak(text,speechLanguage,{enabled:store.getState().audioOn,rate:.7}).catch(()=>{});
  }

  function handleRepairResult(candidates){
    if(!repairSuggestion)return false;
    const heard=candidates[0]||'',intent=getEasyConversationAnswerIntent(heard,learningLanguage);
    if(intent==='yes'){
      const acceptedOriginal=repairOriginal||heardAttempt||repairSuggestion;
      const acceptedSuggestion=repairSuggestion;
      transcript=acceptedOriginal;heardAttempt='';message=copy.clear;pronunciationText=acceptedSuggestion;alternativeText=getAlternativeSpeakingSentence(acceptedOriginal,learningLanguage);repairSuggestion='';repairOriginal='';conversationStep=0;conversationSupport=null;draw();
      window.setTimeout(playRecommendedPronunciation,120);
      window.setTimeout(()=>{if(transcript===acceptedOriginal)advance();},1450);
      return true;
    }
    if(intent==='no'){
      const scaffold=getSpeakingConversationScaffold(current(),learningLanguage,nativeLanguage);
      repairSuggestion='';repairOriginal='';transcript='';heardAttempt=heard;message=copy.continue;pronunciationText='';alternativeText='';conversationStep=1;conversationSupport=scaffold;draw();window.setTimeout(playConversationPrompt,120);return true;
    }
    repairSuggestion='';repairOriginal='';
    return false;
  }

  function handleConversationResult(candidates){
    const heard=candidates[0]||'';
    if(conversationStep===2){
      const easy=isEasyConversationAnswer(heard,learningLanguage);
      const decision=getSpeakingRepairDecision(heard,current(),learningLanguage);
      const full=hasMoreThanOneWord(heard)&&!isSpeakingAnswerIncomplete(heard,learningLanguage)&&decision.mode==='accept';
      if(easy||full){
        transcript=heard;heardAttempt='';message=copy.clear;pronunciationText='';alternativeText='';conversationStep=0;conversationSupport=null;draw();
        if(easy)window.setTimeout(()=>{if(transcript===heard)advance();},850);
        return true;
      }
      transcript='';heardAttempt=heard;message=copy.exampleHelp;pronunciationText='';alternativeText='';draw();
      return true;
    }

    if(conversationStep===1){
      const easy=isEasyConversationAnswer(heard,learningLanguage);
      if(easy&&conversationSupport?.followUpAcceptsYesNo){
        transcript=heard;heardAttempt='';message=copy.clear;pronunciationText='';alternativeText='';conversationStep=0;conversationSupport=null;draw();window.setTimeout(()=>{if(transcript===heard)advance();},850);return true;
      }
      const decision=getSpeakingRepairDecision(heard,current(),learningLanguage);
      const needsHelp=!heard||!hasMoreThanOneWord(heard)||isSpeakingAnswerIncomplete(heard,learningLanguage)||decision.mode!=='accept';
      if(needsHelp){
        transcript='';heardAttempt=heard;message=copy.exampleHelp;pronunciationText='';alternativeText='';conversationStep=2;draw();window.setTimeout(playConversationPrompt,120);return true;
      }
      transcript=heard;heardAttempt='';message=copy.clear;pronunciationText=getRecommendedSpeakingSentence(heard,learningLanguage);alternativeText=getAlternativeSpeakingSentence(heard,learningLanguage);conversationStep=0;conversationSupport=null;draw();if(pronunciationText)window.setTimeout(playRecommendedPronunciation,120);return true;
    }
    return false;
  }

  function startListening(){
    if(listening||!Recognition)return;
    stopSpeech();clearRecognitionTimer();pronunciationText='';alternativeText='';recognition=new Recognition();recognition.lang=speechLanguage;recognition.interimResults=false;recognition.maxAlternatives=3;recognition.continuous=false;listening=true;message=copy.listening;draw();
    const stopRecognition=()=>{if(!listening)return;try{recognition?.stop?.();}catch(_){}};
    recognition.onspeechend=()=>{window.setTimeout(stopRecognition,120);};
    recognition.onsoundend=()=>{window.setTimeout(stopRecognition,180);};
    recognitionTimer=window.setTimeout(stopRecognition,6500);
    recognition.onresult=event=>{
      clearRecognitionTimer();listening=false;
      const result=event.results?.[0],candidates=[];
      for(let i=0;i<(result?.length||0);i++){
        const candidate=String(result?.[i]?.transcript||'').trim();
        if(candidate&&!candidates.includes(candidate))candidates.push(candidate);
      }

      if(handleRepairResult(candidates))return;
      if(handleConversationResult(candidates))return;

      const relevant=candidates.filter(candidate=>isRelevantCandidate(candidate,current(),learningLanguage));
      const incompleteCandidate=relevant.find(candidate=>isSpeakingAnswerIncomplete(candidate,learningLanguage));
      const evaluated=relevant
        .filter(candidate=>!isSpeakingAnswerIncomplete(candidate,learningLanguage))
        .map(candidate=>({candidate,decision:getSpeakingRepairDecision(candidate,current(),learningLanguage)}));
      const matchedEntry=evaluated.find(item=>item.decision.mode==='accept');
      const confirmEntry=evaluated.find(item=>item.decision.mode==='confirm');
      const scaffoldEntry=evaluated.find(item=>item.decision.mode==='scaffold');
      const matched=matchedEntry?.candidate||'';
      const confirmCandidate=confirmEntry?.candidate||'';
      const scaffoldCandidate=scaffoldEntry?.candidate||'';
      const heard=incompleteCandidate||matched||confirmCandidate||scaffoldCandidate||candidates[0]||'';

      if(incompleteCandidate){
        const scaffold=getSpeakingConversationScaffold(current(),learningLanguage,nativeLanguage);
        if(scaffold){
          transcript='';heardAttempt=incompleteCandidate;message=copy.continue;pronunciationText='';alternativeText='';repairSuggestion='';repairOriginal='';conversationStep=1;conversationSupport=scaffold;draw();window.setTimeout(playConversationPrompt,120);return;
        }
      }

      if(matched){
        transcript=matched;heardAttempt='';message=copy.clear;repairSuggestion='';repairOriginal='';conversationStep=0;conversationSupport=null;pronunciationText=getRecommendedSpeakingSentence(matched,learningLanguage);alternativeText=getAlternativeSpeakingSentence(matched,learningLanguage);draw();if(pronunciationText)window.setTimeout(playRecommendedPronunciation,120);return;
      }

      if(confirmEntry){
        transcript='';heardAttempt=confirmCandidate;message=repairCopy.feedback;pronunciationText='';alternativeText='';conversationStep=0;conversationSupport=null;repairOriginal=confirmCandidate;repairSuggestion=confirmEntry.decision.suggestion;draw();window.setTimeout(playRepairSuggestion,120);return;
      }

      if(scaffoldEntry){
        const scaffold=getSpeakingConversationScaffold(current(),learningLanguage,nativeLanguage);
        if(scaffold){
          transcript='';heardAttempt=scaffoldCandidate;message=copy.continue;pronunciationText='';alternativeText='';repairSuggestion='';repairOriginal='';conversationStep=1;conversationSupport=scaffold;draw();window.setTimeout(playConversationPrompt,120);return;
        }
      }

      pronunciationText='';alternativeText='';repairSuggestion='';repairOriginal='';transcript='';heardAttempt=heard;message=!heard?copy.retry:hasMoreThanOneWord(heard)?copy.offTopic:copy.incomplete;draw();
    };
    recognition.onerror=event=>{clearRecognitionTimer();listening=false;message=(event.error==='not-allowed'||event.error==='service-not-allowed')?copy.mic:copy.retry;draw();};
    recognition.onend=()=>{clearRecognitionTimer();if(!listening)return;listening=false;message=copy.retry;draw();};
    try{recognition.start();}catch(_){clearRecognitionTimer();listening=false;message=copy.retry;draw();}
  }

  if(topic){index=Math.min(index,Math.max(0,topic.turns.length-1));resumeIndex=index;draw();window.setTimeout(playQuestion,260);}else showTopics();
}
