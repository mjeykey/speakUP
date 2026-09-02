import { getExerciseUiCopy, getUiFamily } from '../app/ui-language.js?v=3';

const FEATURES = [
  ['🎭','simulation'],['💼','interview'],['🧑‍💼','roles'],['🗺️','map'],['👥','group'],
  ['🎥','native'],['🤝','friends'],['🌍','challenges'],['✨','personal'],['📝','own'],
  ['☁️','sync'],['📴','offline'],['⌚','devices'],['🎓','certificates'],['ع','languages']
];

const COPY = {
  en:{
    simulation:['Conversation simulation','Practise realistic conversations and use what you learned in the moment.'],interview:['Job interview','Practise with different recruiters, difficult questions and realistic interviews.'],
    roles:['Roles','Practise with a boss, customer, recruiter, date or meeting partner.'],map:['Map','Find language partners, meet-ups, trainers and events nearby.'],
    group:['Group training','Practise together with other learners.'],native:['Native-speaker conversations','Practise the language in real video conversations.'],
    friends:['Friends and study groups','Learn together without rankings or pressure.'],challenges:['Shared challenges','Reach language goals together.'],
    personal:['Personal learning path','SpeakUP adapts exercises to what you need and use often.'],own:['Your own words','Save words and sentences from your own life.'],
    sync:['Sync','Continue your progress on phone, tablet and computer.'],offline:['Offline','Learn without an internet connection.'],
    devices:['Home screen and smartwatch','Use small language moments throughout the day.'],certificates:['Language certificates','Show what you can understand and use in real situations.'],
    languages:['More languages','Arabic, Bengali, Swahili and more languages.']
  },
  de:{
    simulation:['Gesprächssimulation','Übe realistische Gespräche und setze Gelerntes direkt im Moment ein.'],interview:['Bewerbungsgespräch','Übe verschiedene Recruiter, schwierige Fragen und realistische Gespräche.'],
    roles:['Rollen','Übe mit Chef, Kunde, Recruiter, Date oder Meetingpartner.'],map:['Karte','Finde Sprachpartner, Treffen, Trainer und Veranstaltungen in deiner Nähe.'],
    group:['Gruppentraining','Übe gemeinsam mit anderen Lernenden.'],native:['Gespräche mit Muttersprachlern','Übe die Sprache in echten Video-Gesprächen.'],
    friends:['Freunde und Lerngruppen','Lerne gemeinsam ohne Rankings oder Druck.'],challenges:['Gemeinsame Challenges','Erreiche Sprachziele gemeinsam mit anderen.'],
    personal:['Persönlicher Lernweg','SpeakUP passt Übungen an das an, was du brauchst und häufig nutzt.'],own:['Eigene Wörter','Speichere Wörter und Sätze aus deinem eigenen Leben.'],
    sync:['Synchronisierung','Setze deinen Fortschritt auf Handy, Tablet und Computer fort.'],offline:['Offline','Lerne auch ohne Internetverbindung.'],
    devices:['Homescreen und Smartwatch','Nutze kleine Sprachmomente über den Tag.'],certificates:['Sprachzertifikate','Zeige, was du in echten Situationen verstehen und anwenden kannst.'],
    languages:['Weitere Sprachen','Arabisch, Bengali, Swahili und weitere Sprachen.']
  },
  pt:{
    simulation:['Simulação de conversa','Pratica conversas realistas e usa no momento o que aprendeste.'],interview:['Entrevista de emprego','Pratica com diferentes recrutadores, perguntas difíceis e entrevistas realistas.'],
    roles:['Papéis','Pratica com um chefe, cliente, recrutador, encontro ou colega de reunião.'],map:['Mapa','Encontra parceiros de língua, encontros, formadores e eventos perto de ti.'],
    group:['Treino em grupo','Pratica em conjunto com outros alunos.'],native:['Conversas com falantes nativos','Pratica a língua em videochamadas reais.'],
    friends:['Amigos e grupos de estudo','Aprende em conjunto, sem classificações nem pressão.'],challenges:['Desafios partilhados','Alcança objetivos linguísticos em conjunto.'],
    personal:['Percurso pessoal','O SpeakUP adapta os exercícios ao que precisas e usas mais.'],own:['As tuas palavras','Guarda palavras e frases da tua vida.'],
    sync:['Sincronização','Continua o progresso no telemóvel, tablet e computador.'],offline:['Offline','Aprende mesmo sem ligação à Internet.'],
    devices:['Ecrã inicial e smartwatch','Aproveita pequenos momentos linguísticos ao longo do dia.'],certificates:['Certificados de línguas','Mostra o que compreendes e sabes usar em situações reais.'],
    languages:['Mais línguas','Árabe, bengali, suaíli e muitas outras línguas.']
  },
  es:{
    simulation:['Simulación de conversación','Practica conversaciones realistas y usa lo aprendido en el momento.'],interview:['Entrevista de trabajo','Practica con distintos reclutadores, preguntas difíciles y entrevistas realistas.'],
    roles:['Roles','Practica con un jefe, cliente, reclutador, cita o compañero de reunión.'],map:['Mapa','Encuentra compañeros de idioma, encuentros, profesores y eventos cercanos.'],
    group:['Práctica en grupo','Practica junto a otros estudiantes.'],native:['Conversaciones con nativos','Practica el idioma en videoconversaciones reales.'],
    friends:['Amigos y grupos de estudio','Aprende en compañía, sin clasificaciones ni presión.'],challenges:['Retos compartidos','Alcanza objetivos lingüísticos junto a otras personas.'],
    personal:['Ruta personal de aprendizaje','SpeakUP adapta los ejercicios a lo que necesitas y usas más.'],own:['Tus propias palabras','Guarda palabras y frases de tu vida.'],
    sync:['Sincronización','Continúa tu progreso en móvil, tableta y ordenador.'],offline:['Sin conexión','Aprende incluso sin conexión a Internet.'],
    devices:['Pantalla de inicio y smartwatch','Aprovecha pequeños momentos de idioma durante el día.'],certificates:['Certificados de idiomas','Demuestra lo que entiendes y sabes usar en situaciones reales.'],
    languages:['Más idiomas','Árabe, bengalí, suajili y muchos otros idiomas.']
  },
  fr:{
    simulation:['Simulation de conversation','Entraîne-toi à des conversations réalistes et utilise tes acquis sur le moment.'],interview:['Entretien d’embauche','Entraîne-toi avec différents recruteurs, des questions difficiles et des entretiens réalistes.'],
    roles:['Rôles','Entraîne-toi avec un responsable, un client, un recruteur ou un partenaire de réunion.'],map:['Carte','Trouve des partenaires linguistiques, rencontres, formateurs et événements près de chez toi.'],
    group:['Entraînement en groupe','Pratique avec d’autres personnes qui apprennent.'],native:['Conversations avec des natifs','Pratique la langue dans de vraies conversations vidéo.'],
    friends:['Amis et groupes d’étude','Apprends avec les autres, sans classement ni pression.'],challenges:['Défis communs','Atteins des objectifs linguistiques avec les autres.'],
    personal:['Parcours personnel','SpeakUP adapte les exercices à tes besoins et à tes usages.'],own:['Tes propres mots','Enregistre des mots et des phrases de ta vie.'],
    sync:['Synchronisation','Poursuis ta progression sur téléphone, tablette et ordinateur.'],offline:['Hors ligne','Apprends même sans connexion Internet.'],
    devices:['Écran d’accueil et montre connectée','Profite de petits moments de langue au fil de la journée.'],certificates:['Certificats de langue','Montre ce que tu comprends et sais utiliser en situation réelle.'],
    languages:['Plus de langues','Arabe, bengali, swahili et bien d’autres langues.']
  },
  hr:{
    simulation:['Simulacija razgovora','Vježbaj stvarne razgovore i odmah primijeni naučeno.'],interview:['Razgovor za posao','Vježbaj s različitim regruterima, teškim pitanjima i stvarnim razgovorima.'],
    roles:['Uloge','Vježbaj s nadređenim, klijentom, regruterom ili partnerom na sastanku.'],map:['Karta','Pronađi jezične partnere, susrete, trenere i događaje u blizini.'],
    group:['Grupno vježbanje','Vježbaj zajedno s drugim polaznicima.'],native:['Razgovori s izvornim govornicima','Vježbaj jezik u stvarnim video razgovorima.'],
    friends:['Prijatelji i grupe za učenje','Uči zajedno bez rangiranja i pritiska.'],challenges:['Zajednički izazovi','Ostvari jezične ciljeve zajedno s drugima.'],
    personal:['Osobni put učenja','SpeakUP prilagođava vježbe onome što trebaš i često koristiš.'],own:['Vlastite riječi','Spremi riječi i rečenice iz svojeg života.'],
    sync:['Sinkronizacija','Nastavi napredak na mobitelu, tabletu i računalu.'],offline:['Izvan mreže','Uči i bez internetske veze.'],
    devices:['Početni zaslon i pametni sat','Iskoristi male jezične trenutke tijekom dana.'],certificates:['Jezični certifikati','Pokaži što razumiješ i znaš primijeniti u stvarnim situacijama.'],
    languages:['Više jezika','Arapski, bengalski, svahili i mnogi drugi jezici.']
  }
};

export function renderFuture(root, store) {
  const state = store.getState();
  const ui = getExerciseUiCopy(state.nativeLanguage);
  const copy = COPY[getUiFamily(state.nativeLanguage)] || COPY.en;
  root.innerHTML = `<section class="screen future-screen">
    <button class="menu-button" data-back aria-label="${ui.back}">←</button>
    <div class="future-view"><p class="future-kicker">SpeakUP</p><h1>${ui.later}</h1>
      <div class="future-grid">${FEATURES.map(([icon,id]) => {
        const [title,description] = copy[id];
        return `<article class="future-card"><span class="future-icon" aria-hidden="true">${icon}</span><div><h2>${title}</h2><p>${description}</p></div></article>`;
      }).join('')}</div>
    </div>
  </section>`;
  root.querySelector('[data-back]').onclick = () => store.setState({ screen:'menu' });
}
