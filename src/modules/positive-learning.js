import { speak, stopSpeech } from '../audio/speech.js?v=58';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';

const CONTENT = {
  'de-DE': {
    sentences:['Ich glaube an mich.','Ich werde jeden Tag besser.','Jeder kleine Schritt zählt.','Fehler helfen mir zu lernen.','Ich bin stolz auf meinen Fortschritt.','Heute lerne ich etwas Neues.','Ich gebe nicht auf.','Ich kann das schaffen.','Ich wachse mit jeder Übung.','Ich bin mutiger als gestern.','Lernen macht mir Spaß.','Ich vertraue auf meine Fähigkeiten.','Jede Minute Übung bringt mich weiter.','Ich darf in meinem eigenen Tempo lernen.','Mein Ziel ist erreichbar.','Ich bin geduldig mit mir selbst.','Heute ist ein guter Tag zum Lernen.','Ich freue mich über jeden Fortschritt.','Meine Zukunft beginnt mit dem, was ich heute lerne.','Ich bin stärker, als ich denke.'],
    words:['Mut','Hoffnung','Stärke','Freude','Liebe','Frieden','Vertrauen','Geduld','Erfolg','Dankbarkeit','Freundlichkeit','Gelassenheit','Lächeln','Ziel','Traum','Wachstum','Glück','Energie','Zuversicht','Freiheit']
  },
  'en-GB': {
    sentences:['I believe in myself.','I get better every day.','Every small step counts.','Mistakes help me learn.','I am proud of my progress.','Today I learn something new.','I do not give up.','I can do this.','I grow with every exercise.','I am braver than yesterday.','Learning is enjoyable.','I trust my abilities.','Every minute of practice moves me forward.','I may learn at my own pace.','My goal is within reach.','I am patient with myself.','Today is a good day to learn.','I celebrate every bit of progress.','My future begins with what I learn today.','I am stronger than I think.'],
    words:['courage','hope','strength','joy','love','peace','trust','patience','success','gratitude','kindness','calm','smile','goal','dream','growth','happiness','energy','confidence','freedom']
  },
  'pt-PT': {
    sentences:['Eu acredito em mim.','Eu melhoro todos os dias.','Cada pequeno passo conta.','Os erros ajudam-me a aprender.','Tenho orgulho no meu progresso.','Hoje aprendo algo novo.','Eu não desisto.','Eu consigo fazer isto.','Eu cresço com cada exercício.','Hoje sou mais corajosa do que ontem.','Aprender dá-me prazer.','Confio nas minhas capacidades.','Cada minuto de prática faz-me avançar.','Posso aprender ao meu ritmo.','O meu objetivo está ao meu alcance.','Sou paciente comigo mesma.','Hoje é um bom dia para aprender.','Celebro cada progresso.','O meu futuro começa com o que aprendo hoje.','Sou mais forte do que penso.'],
    words:['coragem','esperança','força','alegria','amor','paz','confiança','paciência','sucesso','gratidão','gentileza','calma','sorriso','objetivo','sonho','crescimento','felicidade','energia','otimismo','liberdade']
  },
  'es-ES': {
    sentences:['Creo en mí.','Mejoro cada día.','Cada pequeño paso cuenta.','Los errores me ayudan a aprender.','Estoy orgullosa de mi progreso.','Hoy aprendo algo nuevo.','No me rindo.','Puedo hacerlo.','Crezco con cada ejercicio.','Soy más valiente que ayer.','Aprender me hace feliz.','Confío en mis capacidades.','Cada minuto de práctica me hace avanzar.','Puedo aprender a mi propio ritmo.','Mi objetivo está a mi alcance.','Tengo paciencia conmigo misma.','Hoy es un buen día para aprender.','Celebro cada progreso.','Mi futuro empieza con lo que aprendo hoy.','Soy más fuerte de lo que pienso.'],
    words:['valor','esperanza','fuerza','alegría','amor','paz','confianza','paciencia','éxito','gratitud','amabilidad','calma','sonrisa','meta','sueño','crecimiento','felicidad','energía','optimismo','libertad']
  },
  'fr-FR': {
    sentences:['Je crois en moi.','Je progresse chaque jour.','Chaque petit pas compte.','Les erreurs m’aident à apprendre.','Je suis fière de mes progrès.','Aujourd’hui, j’apprends quelque chose de nouveau.','Je n’abandonne pas.','Je peux y arriver.','Je grandis avec chaque exercice.','Je suis plus courageuse qu’hier.','Apprendre me fait plaisir.','J’ai confiance en mes capacités.','Chaque minute de pratique me fait avancer.','Je peux apprendre à mon rythme.','Mon objectif est à ma portée.','Je suis patiente avec moi-même.','Aujourd’hui est un bon jour pour apprendre.','Je célèbre chaque progrès.','Mon avenir commence avec ce que j’apprends aujourd’hui.','Je suis plus forte que je ne le pense.'],
    words:['courage','espoir','force','joie','amour','paix','confiance','patience','succès','gratitude','gentillesse','calme','sourire','objectif','rêve','croissance','bonheur','énergie','optimisme','liberté']
  },
  'hr-HR': {
    sentences:['Vjerujem u sebe.','Svakoga dana postajem bolja.','Svaki mali korak je važan.','Pogreške mi pomažu učiti.','Ponosna sam na svoj napredak.','Danas učim nešto novo.','Ne odustajem.','Ja to mogu.','Rastem sa svakom vježbom.','Hrabrija sam nego jučer.','Učenje me veseli.','Vjerujem svojim sposobnostima.','Svaka minuta vježbe vodi me naprijed.','Smijem učiti svojim tempom.','Moj cilj mi je dostižan.','Strpljiva sam prema sebi.','Danas je dobar dan za učenje.','Veselim se svakom napretku.','Moja budućnost počinje onim što danas učim.','Jača sam nego što mislim.'],
    words:['hrabrost','nada','snaga','radost','ljubav','mir','povjerenje','strpljenje','uspjeh','zahvalnost','ljubaznost','smirenost','osmijeh','cilj','san','rast','sreća','energija','optimizam','sloboda']
  }
};

const SECTIONS = [
  ['sentences','Sätze'],['words','Wörter'],['dialogues','Dialoge'],['pronunciation','Aussprache'],['writing','Schreiben'],['listening','Hören'],['memory','Memory']
];

function pack(code){ return CONTENT[code] || CONTENT[code === 'hr-DAL' ? 'hr-HR' : code === 'es-AN' ? 'es-ES' : 'en-GB']; }
function itemFor(section, index, data){
  const sentence=data.sentences[index%20], word=data.words[index%20];
  if(section==='words'||section==='memory') return word;
  if(section==='dialogues') return `${sentence} — Ja, ich mache weiter.`;
  if(section==='writing') return `Schreibe weiter: ${sentence}`;
  return sentence;
}

export function renderPositiveLearning(root, store){
  const state=store.getState();
  const section=state.positiveSection||'sentences';
  const index=state.positiveIndex||0;
  const data=pack(state.learningLanguage);
  const text=itemFor(section,index,data);
  root.innerHTML=`<section class="screen"><button class="menu-button" data-menu>Menu</button><div class="center"><p class="kicker">Positive Learning · ${languageName(state.learningLanguage)}</p><div class="choice-row">${SECTIONS.map(([id,label])=>`<button class="choice ${section===id?'selected':''}" data-section="${id}">${label}</button>`).join('')}</div><div class="learning-sentence" style="min-height:260px">${text}</div><div class="choice-row"><button class="primary-button" data-audio>▶ Anhören</button><button class="primary-button" data-next>Weiter</button></div></div></section>`;
  root.querySelector('[data-menu]').onclick=()=>{stopSpeech();store.setState({screen:'menu'});};
  root.querySelectorAll('[data-section]').forEach(btn=>btn.onclick=()=>store.setState({positiveSection:btn.dataset.section,positiveIndex:0}));
  root.querySelector('[data-audio]').onclick=()=>speak(text,{language:getSpeechLanguage(state.learningLanguage),rate:.78});
  root.querySelector('[data-next]').onclick=()=>store.setState({positiveIndex:(index+1)%20});
  if(section==='listening'||section==='pronunciation') speak(text,{language:getSpeechLanguage(state.learningLanguage),rate:.76});
}
