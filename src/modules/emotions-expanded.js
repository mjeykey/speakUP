import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';
import { getExerciseUiCopy } from '../app/ui-language.js?v=3';
import { explodeText, getModeTextEffect } from '../effects/distinct-text-effects.js?v=6';

const DATA={
'en-GB':[
['😤','anger',['angry','annoyed','furious'],['I am angry right now.','I need a minute before I answer.','That was not okay with me.']],
['💚','jealousy',['jealous','comparison','insecure'],['I feel jealous.','I am comparing myself right now.','Someone else doing well does not erase me.']],
['🌱','insecurity',['unsure','hesitant','capable'],['I am not sure yet.','I can still ask the question.','I belong in this conversation too.']],
['✨','excitement',['excited','thrilled','eager'],['I am really excited.','I cannot wait to tell you.','This is such good news.']],
['😢','sadness',['sad','low','heavy'],['I feel sad today.','Can we talk for a moment?','I could use some company.']],
['🫣','shame',['embarrassed','ashamed','mistake'],['I feel embarrassed.','I made a mistake.','Can we start again?']],
['🌙','loneliness',['lonely','alone','company'],['I feel lonely today.','Are you free later?','Would you like to have a coffee?']],
['😊','joy',['happy','grateful','proud'],['I am really happy.','That made my day.','I am proud of myself.']]
],
'de-DE':[
['😤','Wut',['wütend','genervt','sauer'],['Ich bin gerade wütend.','Ich brauche einen Moment, bevor ich antworte.','Das war für mich nicht in Ordnung.']],
['💚','Eifersucht',['eifersüchtig','Vergleich','unsicher'],['Ich bin gerade eifersüchtig.','Ich vergleiche mich gerade.','Der Erfolg eines anderen macht mich nicht kleiner.']],
['🌱','Unsicherheit',['unsicher','zögerlich','fähig'],['Ich bin mir noch nicht sicher.','Ich kann die Frage trotzdem stellen.','Ich gehöre auch in dieses Gespräch.']],
['✨','Aufregung',['aufgeregt','begeistert','gespannt'],['Ich bin richtig aufgeregt.','Ich kann es kaum erwarten, dir davon zu erzählen.','Das sind richtig gute Neuigkeiten.']],
['😢','Traurigkeit',['traurig','niedergeschlagen','schwer'],['Ich bin heute traurig.','Können wir kurz reden?','Ich könnte etwas Gesellschaft gebrauchen.']],
['🫣','Scham',['beschämt','verlegen','Fehler'],['Mir ist das peinlich.','Ich habe einen Fehler gemacht.','Können wir noch einmal anfangen?']],
['🌙','Einsamkeit',['einsam','allein','Gesellschaft'],['Ich fühle mich heute einsam.','Hast du später Zeit?','Möchtest du einen Kaffee trinken gehen?']],
['😊','Freude',['glücklich','dankbar','stolz'],['Ich bin richtig glücklich.','Das hat mir den Tag versüßt.','Ich bin stolz auf mich.']]
],
'pt-PT':[
['😤','zanga',['zangado','irritado','furioso'],['Estou mesmo zangada.','Preciso de um minuto antes de responder.','Isto não foi aceitável para mim.']],
['💚','ciúmes',['ciúme','comparação','insegurança'],['Estou com ciúmes.','Estou a comparar-me neste momento.','O sucesso de outra pessoa não me torna menor.']],
['🌱','insegurança',['inseguro','hesitante','capaz'],['Ainda não tenho a certeza.','Posso fazer a pergunta na mesma.','Eu também pertenço a esta conversa.']],
['✨','entusiasmo',['entusiasmado','animado','ansioso'],['Estou mesmo entusiasmada.','Mal posso esperar para te contar.','São notícias mesmo boas.']],
['😢','tristeza',['triste','em baixo','pesado'],['Hoje estou triste.','Podemos falar um pouco?','Fazia-me bem ter companhia.']],
['🫣','vergonha',['envergonhado','constrangido','erro'],['Estou envergonhada.','Cometi um erro.','Podemos começar de novo?']],
['🌙','solidão',['sozinho','solitário','companhia'],['Hoje sinto-me sozinha.','Estás livre mais tarde?','Queres ir tomar um café?']],
['😊','alegria',['feliz','grato','orgulhoso'],['Estou mesmo feliz.','Isto alegrou o meu dia.','Tenho orgulho em mim.']]
],
'es-ES':[
['😤','enfado',['enfadado','molesto','furioso'],['Estoy muy enfadada ahora mismo.','Necesito un minuto antes de responder.','Eso no me ha parecido bien.']],
['💚','celos',['celos','comparación','inseguridad'],['Siento celos.','Ahora mismo me estoy comparando.','El éxito de otra persona no me hace más pequeña.']],
['🌱','inseguridad',['inseguro','dudoso','capaz'],['Todavía no estoy segura.','Aun así puedo hacer la pregunta.','Yo también pertenezco a esta conversación.']],
['✨','ilusión',['emocionado','entusiasmado','ilusionado'],['Estoy superemocionada.','No puedo esperar para contártelo.','Son noticias buenísimas.']],
['😢','tristeza',['triste','bajo de ánimo','pesado'],['Hoy estoy triste.','¿Podemos hablar un momento?','Me vendría bien un poco de compañía.']],
['🫣','vergüenza',['avergonzado','incómodo','error'],['Me siento avergonzada.','He cometido un error.','¿Podemos empezar de nuevo?']],
['🌙','soledad',['solo','solitario','compañía'],['Hoy me siento sola.','¿Estás libre más tarde?','¿Quieres tomar un café?']],
['😊','alegría',['feliz','agradecido','orgulloso'],['Estoy muy feliz.','Eso me alegró el día.','Estoy orgullosa de mí.']]
],
'fr-FR':[
['😤','colère',['en colère','agacé','furieux'],['Je suis vraiment en colère.','J’ai besoin d’une minute avant de répondre.','Pour moi, ce n’était pas acceptable.']],
['💚','jalousie',['jaloux','comparaison','insécurité'],['Je suis jalouse.','Je suis en train de me comparer.','La réussite de quelqu’un d’autre ne me diminue pas.']],
['🌱','incertitude',['incertain','hésitant','capable'],['Je ne suis pas encore sûre.','Je peux quand même poser la question.','J’ai aussi ma place dans cette conversation.']],
['✨','enthousiasme',['enthousiaste','ravi','impatient'],['Je suis vraiment enthousiaste.','J’ai tellement hâte de te raconter.','C’est une super nouvelle.']],
['😢','tristesse',['triste','abattu','lourd'],['Je suis triste aujourd’hui.','On peut parler un moment ?','Un peu de compagnie me ferait du bien.']],
['🫣','honte',['honteux','gêné','erreur'],['Je me sens gênée.','J’ai fait une erreur.','On peut recommencer ?']],
['🌙','solitude',['seul','isolé','compagnie'],['Je me sens seule aujourd’hui.','Tu es libre plus tard ?','Tu veux prendre un café ?']],
['😊','joie',['heureux','reconnaissant','fier'],['Je suis vraiment heureuse.','Ça a illuminé ma journée.','Je suis fière de moi.']]
],
'hr-HR':[
['😤','ljutnja',['ljut','iznerviran','bijesan'],['Sada sam stvarno ljuta.','Treba mi minuta prije nego odgovorim.','To mi nije bilo u redu.']],
['💚','ljubomora',['ljubomora','usporedba','nesigurnost'],['Osjećam ljubomoru.','Trenutno se uspoređujem.','Tuđi uspjeh ne umanjuje mene.']],
['🌱','nesigurnost',['nesiguran','neodlučan','sposoban'],['Još nisam sigurna.','Svejedno mogu postaviti pitanje.','I ja pripadam ovom razgovoru.']],
['✨','uzbuđenje',['uzbuđen','oduševljen','nestrpljiv'],['Baš sam uzbuđena.','Jedva čekam da ti ispričam.','Ovo su odlične vijesti.']],
['😢','tuga',['tužan','potišten','težak'],['Danas sam tužna.','Možemo li malo razgovarati?','Dobro bi mi došlo društvo.']],
['🫣','sram',['posramljen','neugodno','pogreška'],['Neugodno mi je.','Pogriješila sam.','Možemo li početi ponovno?']],
['🌙','usamljenost',['usamljen','sam','društvo'],['Danas se osjećam usamljeno.','Jesi li slobodna kasnije?','Želiš li na kavu?']],
['😊','radost',['sretan','zahvalan','ponosan'],['Stvarno sam sretna.','To mi je uljepšalo dan.','Ponosna sam na sebe.']]
],
'it-IT':[
['😤','rabbia',['arrabbiato','infastidito','furioso'],['Sono davvero arrabbiata.','Ho bisogno di un minuto prima di rispondere.','Per me questo non andava bene.']],
['💚','gelosia',['geloso','confronto','insicurezza'],['Sono gelosa.','In questo momento mi sto confrontando.','Il successo di un’altra persona non mi rende meno importante.']],
['🌱','insicurezza',['insicuro','esitante','capace'],['Non sono ancora sicura.','Posso comunque fare la domanda.','Anch’io ho il mio posto in questa conversazione.']],
['✨','entusiasmo',['entusiasta','emozionato','impaziente'],['Sono davvero entusiasta.','Non vedo l’ora di raccontartelo.','È una bellissima notizia.']],
['😢','tristezza',['triste','giù','pesante'],['Oggi sono triste.','Possiamo parlare un momento?','Mi farebbe bene un po’ di compagnia.']],
['🫣','vergogna',['imbarazzato','a disagio','errore'],['Mi sento in imbarazzo.','Ho fatto un errore.','Possiamo ricominciare?']],
['🌙','solitudine',['solo','isolato','compagnia'],['Oggi mi sento sola.','Sei libera più tardi?','Vuoi prendere un caffè?']],
['😊','gioia',['felice','grato','orgoglioso'],['Sono davvero felice.','Mi ha migliorato la giornata.','Sono orgogliosa di me.']]
]};

function canonical(code){if(code==='es-AN')return'es-ES';if(code==='hr-DAL')return'hr-HR';return code;}

const EN_PT_QUIZ_HINTS={
  am:'sou / estou',
  need:'preciso',
  was:'foi / estava',
  feel:'sinto',
  else:'outra pessoa / outro',
  can:'posso',
  belong:'pertenço',
  cannot:'não consigo / mal posso',
  is:'é',
  we:'nós / podemos',
  could:'podia / poderia',
  made:'fiz / fez',
  you:'tu'
};

function supportLabel(code){
  const labels={'pt-PT':'Português','de-DE':'Deutsch','en-GB':'English','es-ES':'Español','fr-FR':'Français','hr-HR':'Hrvatski'};
  return labels[canonical(code)]||languageName(code);
}

function esc(v){return String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');}

function completedSentenceHtml(sentence,answer){
 const source=String(sentence||'');
 const target=String(answer||'');
 const index=source.indexOf(target);
 if(index<0)return esc(source);
 return `${esc(source.slice(0,index))}<span class="emotion-filled-answer-glow" data-filled-answer>${esc(target)}</span>${esc(source.slice(index+target.length))}`;
}

export function renderEmotions(root,store){
 const state=store.getState();const ui=getExerciseUiCopy(state.nativeLanguage);const code=canonical(state.learningLanguage);const supportCode=canonical(state.nativeLanguage);const items=DATA[code]||DATA['en-GB'];const supportItems=DATA[supportCode]||DATA['en-GB'];const voice=getSpeechLanguage(state.learningLanguage);const supportVoice=getSpeechLanguage(state.nativeLanguage);const supportLanguageLabel=supportLabel(supportCode);let selected=null;let selectedIndex=0;let quizIndex=0;let feedback='';let animating=false;
 const sayLearning=t=>speak(t,voice,{enabled:state.audioOn,rate:.72}).catch(()=>{});
 const saySupport=t=>speak(t,supportVoice,{enabled:state.audioOn,rate:.62}).catch(()=>{});
 const wireSpeech=()=>{
   root.querySelectorAll('[data-learning-say]').forEach(el=>el.addEventListener('click',()=>sayLearning(el.dataset.learningSay)));
   root.querySelectorAll('[data-support-say]').forEach(el=>el.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();saySupport(el.dataset.supportSay);}));
 };
 const leave=()=>{stopSpeech();store.setState({screen:'menu'});};
 function picker(){root.innerHTML=`<section class="screen emotions-screen"><button class="menu-button" data-menu>${ui.menu}</button><div class="emotions-shell"><p class="kicker">${esc(languageName(state.learningLanguage))}</p><h1>${ui.emotions}</h1><div class="emotion-grid">${items.map((x,i)=>`<button class="emotion-card" data-i="${i}" data-learning-say="${esc(x[1])}" data-speech-language="${esc(voice)}"><span>${x[0]}</span><strong>${esc(x[1])}</strong><small class="emotion-card-support" data-support-say="${esc(supportItems[i]?.[1]||'')}" data-speech-language="${esc(supportVoice)}">${esc(supportItems[i]?.[1]||'')}</small></button>`).join('')}</div></div></section>`;root.querySelector('[data-menu]').onclick=leave;root.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{selectedIndex=Number(b.dataset.i);selected=items[selectedIndex];quizIndex=0;feedback='';detail();});wireSpeech();}
 function detail(){animating=false;const sentence=selected[3][quizIndex];const supportSentence=supportItems[selectedIndex]?.[3]?.[quizIndex]||'';const words=sentence.replace(/[.,!?]/g,'').split(/\s+/);const answer=words[Math.min(1,words.length-1)];const gap=sentence.replace(answer,'___');const distractors=selected[2].filter(x=>x.toLowerCase()!==answer.toLowerCase()).slice(0,2);const options=[answer,...distractors].sort(()=>Math.random()-.5);const optionSupport=x=>{const descriptorIndex=selected[2].findIndex(word=>word.toLowerCase()===String(x).toLowerCase());if(descriptorIndex>=0)return supportItems[selectedIndex]?.[2]?.[descriptorIndex]||'';if(code==='en-GB'&&supportCode==='pt-PT')return EN_PT_QUIZ_HINTS[String(x).toLowerCase()]||'';return'';};root.innerHTML=`<section class="screen emotions-screen"><button class="menu-button" data-menu>${ui.menu}</button><div class="emotions-shell emotion-journey"><div class="emotion-current-block"><p class="emotion-current" data-learning-say="${esc(selected[1])}" data-speech-language="${esc(voice)}">${selected[0]} ${esc(selected[1])}</p><p class="translation emotion-current-translation" data-support-say="${esc(supportItems[selectedIndex]?.[1]||'')}" data-speech-language="${esc(supportVoice)}"><span>${esc(supportLanguageLabel)}:</span> ${esc(supportItems[selectedIndex]?.[1]||'')}</p></div><div class="emotion-panel"><p class="kicker">${ui.words}</p><div class="emotion-answer-grid">${selected[2].map((x,i)=>`<button class="emotion-answer emotion-bilingual-word" data-learning-say="${esc(x)}" data-speech-language="${esc(voice)}"><span>${esc(x)}</span><small class="emotion-word-support" data-support-say="${esc(supportItems[selectedIndex]?.[2]?.[i]||'')}" data-speech-language="${esc(supportVoice)}">${esc(supportItems[selectedIndex]?.[2]?.[i]||'')}</small></button>`).join('')}</div></div><div class="emotion-panel"><p class="kicker">${ui.repeat}</p><button class="menu-card emotion-repeat-card" data-learning-say="${esc(sentence)}" data-speech-language="${esc(voice)}"><span>${esc(sentence)}</span><small class="emotion-support-sentence" data-support-say="${esc(supportSentence)}" data-speech-language="${esc(supportVoice)}"><span>${esc(supportLanguageLabel)}:</span> ${esc(supportSentence)}</small><small>🔊 ${ui.tapRepeat}</small></button></div><div class="emotion-panel"><p class="kicker">${ui.miniExercise}</p><p class="story-copy" data-emotion-gap-sentence>${esc(gap)}</p><p class="emotion-support-sentence emotion-gap-support" data-support-say="${esc(supportSentence)}" data-speech-language="${esc(supportVoice)}"><span>${esc(supportLanguageLabel)}:</span> ${esc(supportSentence)}</p><div class="emotion-answer-grid">${options.map(x=>`<button class="emotion-answer emotion-bilingual-word emotion-quiz-answer" data-answer="${esc(x)}" data-speech-language="${esc(voice)}"><span class="emotion-answer-word" data-answer-word>${esc(x)}</span>${optionSupport(x)?`<small class="emotion-word-support" data-support-say="${esc(optionSupport(x))}" data-speech-language="${esc(supportVoice)}">${esc(optionSupport(x))}</small>`:''}</button>`).join('')}</div><p class="feedback" data-emotion-feedback>${esc(feedback)}</p></div><div class="memory-actions"><button class="secondary-button" data-back>← ${ui.emotions}</button><button class="primary-button" data-next>${ui.nextSentence}</button></div></div></section>`;root.querySelector('[data-menu]').onclick=leave;root.querySelector('[data-back]').onclick=picker;wireSpeech();root.querySelectorAll('[data-answer]').forEach(b=>{
  let selecting=false;
  const choose=async event=>{
    if(event?.target?.closest?.('[data-support-say]'))return;
    if(animating||selecting)return;
    selecting=true;
    const chosen=b.dataset.answer;
    const feedbackEl=root.querySelector('[data-emotion-feedback]');
    if(chosen!==answer){
      feedback=ui.tryAgain;
      b.classList.remove('emotion-answer-wrong');
      void b.offsetWidth;
      b.classList.add('emotion-answer-wrong');
      if(feedbackEl)feedbackEl.textContent=feedback;
      sayLearning(chosen);
      window.setTimeout(()=>{b.classList.remove('emotion-answer-wrong');selecting=false;},260);
      return;
    }
    animating=true;
    feedback=`✓ ${ui.correct}`;
    const sentenceEl=root.querySelector('[data-emotion-gap-sentence]');
    const nextButton=root.querySelector('[data-next]');
    root.querySelectorAll('[data-answer]').forEach(button=>button.disabled=true);
    if(nextButton)nextButton.disabled=true;
    const effect=getModeTextEffect('emotions');
    if(sentenceEl){sentenceEl.innerHTML=completedSentenceHtml(sentence,answer);sentenceEl.dataset.effect=effect;}
    if(feedbackEl)feedbackEl.textContent=feedback;
    sayLearning(chosen);
    await new Promise(resolve=>window.setTimeout(resolve,900));
    if(sentenceEl){try{await explodeText(sentenceEl,effect,{duration:1450,stagger:20});}catch(error){console.warn('Emotion sentence effect failed.',error);}}
    quizIndex=(quizIndex+1)%selected[3].length;
    feedback='';
    detail();
  };
  b.addEventListener('pointerup',event=>{
    if(event.pointerType==='touch'||event.pointerType==='pen'){event.preventDefault();choose(event);}
  });
  b.addEventListener('click',event=>{
    if(event.detail===0||!window.PointerEvent||event.pointerType!=='touch')choose(event);
  });
});root.querySelector('[data-next]').onclick=()=>{if(animating)return;quizIndex=(quizIndex+1)%selected[3].length;feedback='';detail();};}
 picker();
}
