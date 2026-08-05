import { getSentenceLevels as getBaseSentenceLevels } from './language-content-extended.js?v=5';

const MOTIVATIONAL_SENTENCES = {
  'de-DE': [
    'Ich glaube an mich.','Ich lerne jeden Tag etwas Neues.','Jeder kleine Schritt bringt mich weiter.','Fehler helfen mir beim Lernen.','Ich bin stolz auf meinen Fortschritt.','Ich gebe nicht auf.','Ich kann das schaffen.','Ich lerne in meinem eigenen Tempo.','Mit jeder Übung werde ich sicherer.','Ich darf geduldig mit mir sein.','Heute übe ich mit Freude.','Meine Stimme darf gehört werden.','Ich traue mich zu sprechen.','Ich verstehe jeden Tag ein bisschen mehr.','Mein Ziel ist erreichbar.','Ich bleibe neugierig.','Ich wachse an neuen Aufgaben.','Ich vertraue meinen Fähigkeiten.','Lernen öffnet mir neue Türen.','Ich bin stärker, als ich denke.'
  ],
  'en-GB': [
    'I believe in myself.','I learn something new every day.','Every small step moves me forward.','Mistakes help me learn.','I am proud of my progress.','I do not give up.','I can do this.','I learn at my own pace.','Every exercise makes me more confident.','I can be patient with myself.','Today I practise with joy.','My voice deserves to be heard.','I dare to speak.','I understand a little more every day.','My goal is within reach.','I stay curious.','New challenges help me grow.','I trust my abilities.','Learning opens new doors for me.','I am stronger than I think.'
  ],
  'pt-PT': [
    'Eu acredito em mim.','Aprendo algo novo todos os dias.','Cada pequeno passo faz-me avançar.','Os erros ajudam-me a aprender.','Tenho orgulho no meu progresso.','Eu não desisto.','Eu consigo fazer isto.','Aprendo ao meu próprio ritmo.','Cada exercício dá-me mais confiança.','Posso ser paciente comigo mesma.','Hoje pratico com alegria.','A minha voz merece ser ouvida.','Eu atrevo-me a falar.','Compreendo um pouco mais todos os dias.','O meu objetivo está ao meu alcance.','Continuo curiosa.','Os novos desafios ajudam-me a crescer.','Confio nas minhas capacidades.','Aprender abre-me novas portas.','Sou mais forte do que penso.'
  ],
  'es-ES': [
    'Creo en mí.','Aprendo algo nuevo cada día.','Cada pequeño paso me hace avanzar.','Los errores me ayudan a aprender.','Estoy orgullosa de mi progreso.','No me rindo.','Puedo hacerlo.','Aprendo a mi propio ritmo.','Cada ejercicio me da más confianza.','Puedo tener paciencia conmigo misma.','Hoy practico con alegría.','Mi voz merece ser escuchada.','Me atrevo a hablar.','Comprendo un poco más cada día.','Mi objetivo está a mi alcance.','Sigo teniendo curiosidad.','Los nuevos retos me ayudan a crecer.','Confío en mis capacidades.','Aprender me abre nuevas puertas.','Soy más fuerte de lo que pienso.'
  ],
  'fr-FR': [
    'Je crois en moi.','J’apprends quelque chose de nouveau chaque jour.','Chaque petit pas me fait avancer.','Les erreurs m’aident à apprendre.','Je suis fière de mes progrès.','Je n’abandonne pas.','Je peux y arriver.','J’apprends à mon propre rythme.','Chaque exercice me donne plus de confiance.','Je peux être patiente avec moi-même.','Aujourd’hui, je pratique avec joie.','Ma voix mérite d’être entendue.','J’ose parler.','Je comprends un peu plus chaque jour.','Mon objectif est à ma portée.','Je reste curieuse.','Les nouveaux défis m’aident à grandir.','J’ai confiance en mes capacités.','Apprendre m’ouvre de nouvelles portes.','Je suis plus forte que je ne le pense.'
  ],
  'hr-HR': [
    'Vjerujem u sebe.','Svaki dan učim nešto novo.','Svaki mali korak vodi me naprijed.','Pogreške mi pomažu učiti.','Ponosna sam na svoj napredak.','Ne odustajem.','Ja to mogu.','Učim svojim tempom.','Svaka vježba daje mi više samopouzdanja.','Mogu biti strpljiva prema sebi.','Danas vježbam s veseljem.','Moj glas zaslužuje da se čuje.','Usuđujem se govoriti.','Svakoga dana razumijem malo više.','Moj cilj mi je nadohvat ruke.','Ostajem znatiželjna.','Novi izazovi pomažu mi rasti.','Vjerujem svojim sposobnostima.','Učenje mi otvara nova vrata.','Jača sam nego što mislim.'
  ]
};

const ALIASES = { 'es-AN':'es-ES', 'hr-DAL':'hr-HR' };

function sentencesFor(code) {
  return MOTIVATIONAL_SENTENCES[code] || MOTIVATIONAL_SENTENCES[ALIASES[code]] || MOTIVATIONAL_SENTENCES['en-GB'];
}

function splitAnswer(sentence) {
  const clean = sentence.replace(/[.!?]$/, '');
  const words = clean.split(' ');
  const answer = words.pop();
  return { sentence: `${words.join(' ')} _____.`, answer };
}

function buildMotivationLevel(learningLanguage, nativeLanguage) {
  const learning = sentencesFor(learningLanguage);
  const support = sentencesFor(nativeLanguage);
  const answers = learning.map(item => splitAnswer(item).answer);

  return {
    id: 'motivation',
    title: 'Motivation',
    emoji: '✨',
    description: '20 positive learning sentences.',
    englishClass: '',
    items: learning.map((complete, index) => {
      const gap = splitAnswer(complete);
      const options = [gap.answer, answers[(index + 3) % answers.length], answers[(index + 7) % answers.length], answers[(index + 11) % answers.length]];
      return {
        sentence: gap.sentence,
        answers: [gap.answer],
        options: [...new Set(options)],
        translation: support[index] || complete,
        complete
      };
    })
  };
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  return [
    ...getBaseSentenceLevels(learningLanguage, nativeLanguage),
    buildMotivationLevel(learningLanguage, nativeLanguage)
  ];
}
