const FAMILY = {
  'pt-PT':'pt','de-DE':'de','en-GB':'en','es-ES':'es','es-AN':'es',
  'hr-HR':'hr','hr-DAL':'hr','fr-FR':'fr'
};

const HTML_LANG = { pt:'pt-PT', de:'de-DE', en:'en-GB', es:'es-ES', hr:'hr-HR', fr:'fr-FR' };

const MENU = {
  en:{
    levelHeading:'Level',exerciseHeading:'Exercise',storyHeading:'Choose a story',topicHeading:'Choose a topic',settingsHeading:'Settings',
    effectsTitle:'Effects',effectsDescription:'Choose the visual effect for the exercises.',futureTitle:'Later',futureDescription:'See planned features.',
    learningLanguage:'Learning language',nativeLanguage:'Native language / translation',start:'Start',chooseStory:'Choose a story',startStory:'▶ Start story',chooseTopic:'Choose a topic',startL2:'Start L2',startL3:'Start L3',
    modes:{emotions:['Emotions','Words, sentences and playful expressions for feelings.'],anxiety:['Anxiety','Learn with short stories about anxious thoughts, perspective and humour.'],'fill-gap':['Sentences','Choose your level and complete the sentence.'],memory:['Memory','Match words and meanings.'],words:['Words','One word at a time.'],'speak-practice':['Speaking','Say useful sentences out loud.'],'communication-strength':['Communication','Learn clearer ways to say things.'],story:['Stories','Learn language through short stories.']},
    levels:{l1:['L1 · Language','Words, sentences, speaking and stories.'],l2:['L2 · Interests & Work','Learn through topics that interest you.'],l3:['L3 · Knowledge','Learn facts and practical knowledge.']},
    l3Groups:{world:'World Knowledge',practical:'Practical Knowledge'}
  },
  de:{
    levelHeading:'Level',exerciseHeading:'Übung',storyHeading:'Geschichte wählen',topicHeading:'Thema wählen',settingsHeading:'Einstellungen',
    effectsTitle:'Effekte',effectsDescription:'Effekt für die Übungen auswählen.',futureTitle:'Später',futureDescription:'Geplante Funktionen ansehen.',
    learningLanguage:'Lernsprache',nativeLanguage:'Muttersprache / Übersetzung',start:'Start',chooseStory:'Geschichte wählen',startStory:'▶ Geschichte starten',chooseTopic:'Thema wählen',startL2:'L2 starten',startL3:'L3 starten',
    modes:{emotions:['Emotionen','Wörter, Sätze und Ausdrücke für Gefühle.'],anxiety:['Anxiety','Lerne mit kurzen Geschichten über ängstliche Gedanken, Perspektive und Humor.'],'fill-gap':['Sätze','Wähle dein Level und ergänze den Satz.'],memory:['Memory','Finde passende Wörter und Bedeutungen.'],words:['Wörter','Ein Wort nach dem anderen.'],'speak-practice':['Sprechen','Sprich nützliche Sätze laut aus.'],'communication-strength':['Kommunikation','Lerne klarere Formulierungen.'],story:['Geschichten','Lerne Sprache in kurzen Geschichten.']},
    levels:{l1:['L1 · Sprache','Wörter, Sätze, Sprechen und Geschichten.'],l2:['L2 · Interessen & Beruf','Lerne über Themen, die dich interessieren.'],l3:['L3 · Wissen','Lerne Fakten und praktisches Wissen.']},
    l3Groups:{world:'Weltwissen',practical:'Praktisches Wissen'}
  },
  pt:{
    levelHeading:'Nível',exerciseHeading:'Exercício',storyHeading:'Escolher história',topicHeading:'Escolher tema',settingsHeading:'Definições',
    effectsTitle:'Efeitos',effectsDescription:'Escolhe o efeito visual para os exercícios.',futureTitle:'Mais tarde',futureDescription:'Ver funcionalidades planeadas.',
    learningLanguage:'Língua a aprender',nativeLanguage:'Língua materna / tradução',start:'Começar',chooseStory:'Escolher história',startStory:'▶ Começar história',chooseTopic:'Escolher tema',startL2:'Começar L2',startL3:'Começar L3',
    modes:{emotions:['Emoções','Palavras, frases e expressões para sentimentos.'],anxiety:['Ansiedade','Aprende com pequenas histórias sobre pensamentos ansiosos, perspetiva e humor.'],'fill-gap':['Frases','Escolhe o teu nível e completa a frase.'],memory:['Memória','Relaciona palavras e significados.'],words:['Palavras','Uma palavra de cada vez.'],'speak-practice':['Falar','Diz frases úteis em voz alta.'],'communication-strength':['Comunicação','Aprende formas mais claras de dizer as coisas.'],story:['Histórias','Aprende a língua em pequenas histórias.']},
    levels:{l1:['L1 · Língua','Palavras, frases, fala e histórias.'],l2:['L2 · Interesses e trabalho','Aprende através de temas que te interessam.'],l3:['L3 · Conhecimento','Aprende factos e conhecimentos práticos.']},
    l3Groups:{world:'Conhecimento do mundo',practical:'Conhecimento prático'}
  },
  es:{
    levelHeading:'Nivel',exerciseHeading:'Ejercicio',storyHeading:'Elegir historia',topicHeading:'Elegir tema',settingsHeading:'Ajustes',
    effectsTitle:'Efectos',effectsDescription:'Elige el efecto visual para los ejercicios.',futureTitle:'Más adelante',futureDescription:'Ver funciones previstas.',
    learningLanguage:'Idioma que aprendes',nativeLanguage:'Lengua materna / traducción',start:'Empezar',chooseStory:'Elegir historia',startStory:'▶ Empezar historia',chooseTopic:'Elegir tema',startL2:'Empezar L2',startL3:'Empezar L3',
    modes:{emotions:['Emociones','Palabras, frases y expresiones para los sentimientos.'],anxiety:['Ansiedad','Aprende con pequeñas historias sobre pensamientos ansiosos, perspectiva y humor.'],'fill-gap':['Frases','Elige tu nivel y completa la frase.'],memory:['Memoria','Relaciona palabras y significados.'],words:['Palabras','Una palabra cada vez.'],'speak-practice':['Hablar','Di frases útiles en voz alta.'],'communication-strength':['Comunicación','Aprende formas más claras de decir las cosas.'],story:['Historias','Aprende el idioma con pequeñas historias.']},
    levels:{l1:['L1 · Idioma','Palabras, frases, conversación e historias.'],l2:['L2 · Intereses y trabajo','Aprende con temas que te interesan.'],l3:['L3 · Conocimiento','Aprende datos y conocimientos prácticos.']},
    l3Groups:{world:'Conocimiento del mundo',practical:'Conocimiento práctico'}
  },
  hr:{
    levelHeading:'Razina',exerciseHeading:'Vježba',storyHeading:'Odaberi priču',topicHeading:'Odaberi temu',settingsHeading:'Postavke',
    effectsTitle:'Efekti',effectsDescription:'Odaberi vizualni efekt za vježbe.',futureTitle:'Kasnije',futureDescription:'Pogledaj planirane funkcije.',
    learningLanguage:'Jezik koji učiš',nativeLanguage:'Materinski jezik / prijevod',start:'Počni',chooseStory:'Odaberi priču',startStory:'▶ Pokreni priču',chooseTopic:'Odaberi temu',startL2:'Pokreni L2',startL3:'Pokreni L3',
    modes:{emotions:['Emocije','Riječi, rečenice i izrazi za osjećaje.'],anxiety:['Anksioznost','Uči kroz kratke priče o tjeskobnim mislima, perspektivi i humoru.'],'fill-gap':['Rečenice','Odaberi razinu i dopuni rečenicu.'],memory:['Memorija','Poveži riječi i značenja.'],words:['Riječi','Jedna riječ po jedna.'],'speak-practice':['Govor','Izgovori korisne rečenice naglas.'],'communication-strength':['Komunikacija','Nauči jasnije načine izražavanja.'],story:['Priče','Uči jezik kroz kratke priče.']},
    levels:{l1:['L1 · Jezik','Riječi, rečenice, govor i priče.'],l2:['L2 · Interesi i posao','Uči kroz teme koje te zanimaju.'],l3:['L3 · Znanje','Uči činjenice i praktično znanje.']},
    l3Groups:{world:'Znanje o svijetu',practical:'Praktično znanje'}
  },
  fr:{
    levelHeading:'Niveau',exerciseHeading:'Exercice',storyHeading:'Choisir une histoire',topicHeading:'Choisir un thème',settingsHeading:'Paramètres',
    effectsTitle:'Effets',effectsDescription:'Choisis l’effet visuel pour les exercices.',futureTitle:'Plus tard',futureDescription:'Voir les fonctionnalités prévues.',
    learningLanguage:'Langue à apprendre',nativeLanguage:'Langue maternelle / traduction',start:'Commencer',chooseStory:'Choisir une histoire',startStory:'▶ Commencer l’histoire',chooseTopic:'Choisir un thème',startL2:'Commencer L2',startL3:'Commencer L3',
    modes:{emotions:['Émotions','Mots, phrases et expressions pour les émotions.'],anxiety:['Anxiété','Apprends avec de petites histoires sur les pensées anxieuses, le recul et l’humour.'],'fill-gap':['Phrases','Choisis ton niveau et complète la phrase.'],memory:['Mémoire','Associe les mots et les significations.'],words:['Mots','Un mot à la fois.'],'speak-practice':['Parler','Prononce des phrases utiles à voix haute.'],'communication-strength':['Communication','Apprends des formulations plus claires.'],story:['Histoires','Apprends la langue avec de petites histoires.']},
    levels:{l1:['L1 · Langue','Mots, phrases, expression orale et histoires.'],l2:['L2 · Intérêts et travail','Apprends avec des sujets qui t’intéressent.'],l3:['L3 · Connaissances','Apprends des faits et des connaissances pratiques.']},
    l3Groups:{world:'Connaissances du monde',practical:'Connaissances pratiques'}
  }
};

const LANGUAGE_NAMES = {
  en:{'pt-PT':'Portuguese','de-DE':'German','en-GB':'English','es-ES':'Spanish','es-AN':'Andalusian Spanish','hr-HR':'Croatian','hr-DAL':'Dalmatian Croatian','fr-FR':'French'},
  de:{'pt-PT':'Portugiesisch','de-DE':'Deutsch','en-GB':'Englisch','es-ES':'Spanisch','es-AN':'Andalusisches Spanisch','hr-HR':'Kroatisch','hr-DAL':'Dalmatinisches Kroatisch','fr-FR':'Französisch'},
  pt:{'pt-PT':'Português','de-DE':'Alemão','en-GB':'Inglês','es-ES':'Espanhol','es-AN':'Espanhol andaluz','hr-HR':'Croata','hr-DAL':'Croata dálmata','fr-FR':'Francês'},
  es:{'pt-PT':'Portugués','de-DE':'Alemán','en-GB':'Inglés','es-ES':'Español','es-AN':'Español andaluz','hr-HR':'Croata','hr-DAL':'Croata dálmata','fr-FR':'Francés'},
  hr:{'pt-PT':'Portugalski','de-DE':'Njemački','en-GB':'Engleski','es-ES':'Španjolski','es-AN':'Andaluzijski španjolski','hr-HR':'Hrvatski','hr-DAL':'Dalmatinski hrvatski','fr-FR':'Francuski'},
  fr:{'pt-PT':'Portugais','de-DE':'Allemand','en-GB':'Anglais','es-ES':'Espagnol','es-AN':'Espagnol andalou','hr-HR':'Croate','hr-DAL':'Croate dalmate','fr-FR':'Français'}
};

const STORY_TITLES = {
  en:{everyday:'Everyday Life',romance:'Romance',travel:'Travel',horror:'Horror','fantasy-1':'Fantasy'},
  de:{everyday:'Alltag',romance:'Romantik',travel:'Reise',horror:'Horror','fantasy-1':'Fantasy'},
  pt:{everyday:'Dia a dia',romance:'Romance',travel:'Viagem',horror:'Terror','fantasy-1':'Fantasia'},
  es:{everyday:'Vida cotidiana',romance:'Romance',travel:'Viaje',horror:'Terror','fantasy-1':'Fantasía'},
  hr:{everyday:'Svakodnevica',romance:'Romansa',travel:'Putovanje',horror:'Horor','fantasy-1':'Fantazija'},
  fr:{everyday:'Vie quotidienne',romance:'Romance',travel:'Voyage',horror:'Horreur','fantasy-1':'Fantaisie'}
};

const TOPICS = {
  de:{cooking:'Kochen',career:'Beruf & Karriere',art:'Kunst',sport:'Sport',dance:'Tanzen',reading:'Lesen',party:'Party',crafts:'Basteln',sewing:'Nähen',astronomy:'Astronomie & Weltraum',biology:'Biologie',earth:'Erde',physics:'Physik','human-body':'Menschlicher Körper',technology:'Technologie',history:'Geschichte',household:'Haushaltstipps',garden:'Gartentipps','home-building':'Haus & Bauen',diy:'Heimwerken','food-storage':'Lebensmittel & Aufbewahrung',sustainability:'Nachhaltig leben',plants:'Zimmerpflanzen',organisation:'Organisation',materials:'Materialien'},
  pt:{cooking:'Cozinha',career:'Trabalho e carreira',art:'Arte',sport:'Desporto',dance:'Dança',reading:'Leitura',party:'Festa',crafts:'Artesanato',sewing:'Costura',astronomy:'Astronomia e espaço',biology:'Biologia',earth:'Terra',physics:'Física','human-body':'Corpo humano',technology:'Tecnologia',history:'História',household:'Dicas para casa',garden:'Dicas de jardim','home-building':'Casa e construção',diy:'Bricolage','food-storage':'Alimentos e conservação',sustainability:'Vida sustentável',plants:'Plantas de interior',organisation:'Organização',materials:'Materiais'},
  es:{cooking:'Cocina',career:'Trabajo y carrera',art:'Arte',sport:'Deporte',dance:'Baile',reading:'Lectura',party:'Fiesta',crafts:'Manualidades',sewing:'Costura',astronomy:'Astronomía y espacio',biology:'Biología',earth:'Tierra',physics:'Física','human-body':'Cuerpo humano',technology:'Tecnología',history:'Historia',household:'Consejos para el hogar',garden:'Consejos de jardín','home-building':'Casa y construcción',diy:'Bricolaje','food-storage':'Alimentos y conservación',sustainability:'Vida sostenible',plants:'Plantas de interior',organisation:'Organización',materials:'Materiales'},
  hr:{cooking:'Kuhanje',career:'Posao i karijera',art:'Umjetnost',sport:'Sport',dance:'Ples',reading:'Čitanje',party:'Zabava',crafts:'Ručni radovi',sewing:'Šivanje',astronomy:'Astronomija i svemir',biology:'Biologija',earth:'Zemlja',physics:'Fizika','human-body':'Ljudsko tijelo',technology:'Tehnologija',history:'Povijest',household:'Savjeti za kućanstvo',garden:'Savjeti za vrt','home-building':'Kuća i gradnja',diy:'Uradi sam','food-storage':'Hrana i čuvanje',sustainability:'Održivi život',plants:'Sobne biljke',organisation:'Organizacija',materials:'Materijali'},
  fr:{cooking:'Cuisine',career:'Travail et carrière',art:'Art',sport:'Sport',dance:'Danse',reading:'Lecture',party:'Fête',crafts:'Loisirs créatifs',sewing:'Couture',astronomy:'Astronomie et espace',biology:'Biologie',earth:'Terre',physics:'Physique','human-body':'Corps humain',technology:'Technologie',history:'Histoire',household:'Astuces maison',garden:'Astuces jardin','home-building':'Maison et construction',diy:'Bricolage','food-storage':'Aliments et conservation',sustainability:'Vie durable',plants:'Plantes d’intérieur',organisation:'Organisation',materials:'Matériaux'}
};

const SENTENCE_LEVEL = {
  en:{back:'Back to menu',kicker:'Sentences',title:'Choose your level',subtitle:'Select one category to begin.',levels:{beginner:['Beginner','One gap with full support.'],survivor:['Survivor','Two gaps with full support.'],explorer:['Explorer','Three gaps with softer support.']}},
  de:{back:'Zurück zum Menü',kicker:'Sätze',title:'Wähle dein Level',subtitle:'Wähle eine Kategorie, um zu beginnen.',levels:{beginner:['Anfänger','Eine Lücke mit voller Unterstützung.'],survivor:['Survivor','Zwei Lücken mit voller Unterstützung.'],explorer:['Explorer','Drei Lücken mit weniger Unterstützung.']}},
  pt:{back:'Voltar ao menu',kicker:'Frases',title:'Escolhe o teu nível',subtitle:'Seleciona uma categoria para começar.',levels:{beginner:['Iniciante','Uma lacuna com apoio total.'],survivor:['Sobrevivente','Duas lacunas com apoio total.'],explorer:['Explorador','Três lacunas com menos apoio.']}},
  es:{back:'Volver al menú',kicker:'Frases',title:'Elige tu nivel',subtitle:'Selecciona una categoría para empezar.',levels:{beginner:['Principiante','Un hueco con apoyo completo.'],survivor:['Superviviente','Dos huecos con apoyo completo.'],explorer:['Explorador','Tres huecos con menos apoyo.']}},
  hr:{back:'Natrag na izbornik',kicker:'Rečenice',title:'Odaberi razinu',subtitle:'Odaberi jednu kategoriju za početak.',levels:{beginner:['Početnik','Jedna praznina uz punu podršku.'],survivor:['Preživljavanje','Dvije praznine uz punu podršku.'],explorer:['Istraživač','Tri praznine uz blažu podršku.']}},
  fr:{back:'Retour au menu',kicker:'Phrases',title:'Choisis ton niveau',subtitle:'Sélectionne une catégorie pour commencer.',levels:{beginner:['Débutant','Un blanc avec un accompagnement complet.'],survivor:['Survivant','Deux blancs avec un accompagnement complet.'],explorer:['Explorateur','Trois blancs avec moins d’aide.']}}
};

const WELCOME = {
  en:{tagline:'Learn gently. Speak bravely.'},
  de:{tagline:'Sanft lernen. Mutig sprechen.'},
  pt:{tagline:'Aprende com calma. Fala com coragem.'},
  es:{tagline:'Aprende con calma. Habla con valentía.'},
  hr:{tagline:'Uči nježno. Govori hrabro.'},
  fr:{tagline:'Apprends en douceur. Parle avec courage.'}
};

export function getUiFamily(code){ return FAMILY[code] || 'en'; }
export function getHtmlLanguage(code){ return HTML_LANG[getUiFamily(code)] || 'en-GB'; }
export function getMenuCopy(code){ return MENU[getUiFamily(code)] || MENU.en; }
export function getLanguageOptionLabel(language,nativeLanguage){
  const family=getUiFamily(nativeLanguage);
  const flag=String(language.label || '').split(' ')[0];
  return flag + ' ' + (LANGUAGE_NAMES[family]?.[language.code] || language.short || language.code);
}
export function getStoryCopy(story,nativeLanguage){
  const family=getUiFamily(nativeLanguage);
  return {title:STORY_TITLES[family]?.[story.id] || story.title,subtitle:story.subtitle};
}
export function getTopicTitle(topic,nativeLanguage){ return TOPICS[getUiFamily(nativeLanguage)]?.[topic.id] || topic.title; }
export function getSentenceLevelCopy(code){ return SENTENCE_LEVEL[getUiFamily(code)] || SENTENCE_LEVEL.en; }
export function getWelcomeCopy(code){ return WELCOME[getUiFamily(code)] || WELCOME.en; }


const EXERCISE_UI = {
  en:{
    menu:'Menu',next:'Next',listen:'Listen',memory:'Memory',notThisPair:'Not this pair.',words:'Words',repeat:'Repeat',tapRepeat:'tap and repeat',
    miniExercise:'Mini exercise',emotions:'Emotions',correct:'Correct',tryAgain:'Try again.',
    anxietyTitle:'Language for the moment',anxietySubtitle:'Listen, repeat, then complete.',gapSentence:'Gap sentence',
    restart:'Start again',nextSentence:'Next sentence',speaking:'Speaking',communication:'Communication',
    sayItBetter:'Say it better.',sayInstead:'Say instead:',again:'Again',backToSpeakUP:'Back to SpeakUP',
    l2Level:'L2 · Learn through what you love',l3Level:'L3 · Learn the world while learning the language',
    whatExactly:'What exactly does that mean?',completed:'Done.',effects:'Effects',chooseEffects:'Choose how each mode dissolves',
    effectsHelp:'Every learning mode can have its own letter effect.',preview:'Preview',
    later:'Later',back:'Back'
  },
  de:{
    menu:'Menü',next:'Weiter',listen:'Anhören',memory:'Memory',notThisPair:'Nicht dieses Paar.',words:'Wörter',repeat:'Nachsprechen',tapRepeat:'antippen und nachsprechen',
    miniExercise:'Mini-Übung',emotions:'Emotionen',correct:'Richtig',tryAgain:'Noch einmal versuchen.',
    anxietyTitle:'Sprache für den Moment',anxietySubtitle:'Hören, nachsprechen, dann ergänzen.',gapSentence:'Lückensatz',
    restart:'Neu starten',nextSentence:'Nächster Satz',speaking:'Sprechen',communication:'Kommunikation',
    sayItBetter:'Sag es klarer.',sayInstead:'Sag stattdessen:',again:'Noch einmal',backToSpeakUP:'Zurück zu SpeakUP',
    l2Level:'L2 · Lerne über das, was du liebst',l3Level:'L3 · Lerne die Welt und gleichzeitig die Sprache',
    whatExactly:'Was bedeutet das genau?',completed:'Geschafft.',effects:'Effekte',chooseEffects:'Wähle, wie jeder Modus ausgeblendet wird',
    effectsHelp:'Jeder Lernmodus kann seinen eigenen Buchstabeneffekt haben.',preview:'Vorschau',
    later:'Später',back:'Zurück'
  },
  pt:{
    menu:'Menu',next:'Seguinte',listen:'Ouvir',memory:'Memória',notThisPair:'Não é este par.',words:'Palavras',repeat:'Repetir',tapRepeat:'toca e repete',
    miniExercise:'Mini-exercício',emotions:'Emoções',correct:'Certo',tryAgain:'Tenta novamente.',
    anxietyTitle:'Linguagem para o momento',anxietySubtitle:'Ouve, repete e depois completa.',gapSentence:'Frase com espaço',
    restart:'Recomeçar',nextSentence:'Próxima frase',speaking:'Falar',communication:'Comunicação',
    sayItBetter:'Diz de forma mais clara.',sayInstead:'Diz antes:',again:'Outra vez',backToSpeakUP:'Voltar ao SpeakUP',
    l2Level:'L2 · Aprende através do que gostas',l3Level:'L3 · Aprende sobre o mundo enquanto aprendes a língua',
    whatExactly:'O que significa exatamente?',completed:'Concluído.',effects:'Efeitos',chooseEffects:'Escolhe como cada modo desaparece',
    effectsHelp:'Cada modo de aprendizagem pode ter o seu próprio efeito de letras.',preview:'Pré-visualizar',
    later:'Mais tarde',back:'Voltar'
  },
  es:{
    menu:'Menú',next:'Siguiente',listen:'Escuchar',memory:'Memoria',notThisPair:'No es esta pareja.',words:'Palabras',repeat:'Repetir',tapRepeat:'toca y repite',
    miniExercise:'Mini ejercicio',emotions:'Emociones',correct:'Correcto',tryAgain:'Inténtalo de nuevo.',
    anxietyTitle:'Lenguaje para el momento',anxietySubtitle:'Escucha, repite y después completa.',gapSentence:'Frase con hueco',
    restart:'Empezar de nuevo',nextSentence:'Siguiente frase',speaking:'Hablar',communication:'Comunicación',
    sayItBetter:'Dilo de forma más clara.',sayInstead:'Di en su lugar:',again:'Otra vez',backToSpeakUP:'Volver a SpeakUP',
    l2Level:'L2 · Aprende con lo que te gusta',l3Level:'L3 · Aprende sobre el mundo mientras aprendes el idioma',
    whatExactly:'¿Qué significa exactamente?',completed:'Completado.',effects:'Efectos',chooseEffects:'Elige cómo desaparece cada modo',
    effectsHelp:'Cada modo de aprendizaje puede tener su propio efecto de letras.',preview:'Vista previa',
    later:'Más adelante',back:'Volver'
  },
  hr:{
    menu:'Izbornik',next:'Dalje',listen:'Poslušaj',memory:'Memorija',notThisPair:'Ovo nije par.',words:'Riječi',repeat:'Ponovi',tapRepeat:'dodirni i ponovi',
    miniExercise:'Mini vježba',emotions:'Emocije',correct:'Točno',tryAgain:'Pokušaj ponovno.',
    anxietyTitle:'Jezik za ovaj trenutak',anxietySubtitle:'Poslušaj, ponovi pa dopuni.',gapSentence:'Rečenica s prazninom',
    restart:'Počni ponovno',nextSentence:'Sljedeća rečenica',speaking:'Govor',communication:'Komunikacija',
    sayItBetter:'Reci jasnije.',sayInstead:'Umjesto toga reci:',again:'Ponovno',backToSpeakUP:'Natrag na SpeakUP',
    l2Level:'L2 · Uči kroz ono što voliš',l3Level:'L3 · Uči o svijetu dok učiš jezik',
    whatExactly:'Što to točno znači?',completed:'Gotovo.',effects:'Efekti',chooseEffects:'Odaberi kako svaki način nestaje',
    effectsHelp:'Svaki način učenja može imati vlastiti efekt slova.',preview:'Pregled',
    later:'Kasnije',back:'Natrag'
  },
  fr:{
    menu:'Menu',next:'Suivant',listen:'Écouter',memory:'Mémoire',notThisPair:'Ce n’est pas cette paire.',words:'Mots',repeat:'Répéter',tapRepeat:'touche et répète',
    miniExercise:'Mini-exercice',emotions:'Émotions',correct:'Correct',tryAgain:'Réessaie.',
    anxietyTitle:'Le langage du moment',anxietySubtitle:'Écoute, répète, puis complète.',gapSentence:'Phrase à compléter',
    restart:'Recommencer',nextSentence:'Phrase suivante',speaking:'Parler',communication:'Communication',
    sayItBetter:'Dis-le plus clairement.',sayInstead:'Dis plutôt :',again:'Encore',backToSpeakUP:'Retour à SpeakUP',
    l2Level:'L2 · Apprends grâce à ce que tu aimes',l3Level:'L3 · Découvre le monde en apprenant la langue',
    whatExactly:'Qu’est-ce que cela signifie exactement ?',completed:'Terminé.',effects:'Effets',chooseEffects:'Choisis comment chaque mode disparaît',
    effectsHelp:'Chaque mode d’apprentissage peut avoir son propre effet de lettres.',preview:'Aperçu',
    later:'Plus tard',back:'Retour'
  }
};

export function getExerciseUiCopy(code){ return EXERCISE_UI[getUiFamily(code)] || EXERCISE_UI.en; }

const EFFECT_UI = {
  en:{modes:{words:'Words',sentences:'Sentences',story:'Story',memory:'Memory','speak-practice':'Speaking'},effects:{scatter:'Scatter',burst:'Burst',float:'Float',glow:'Glow',collapse:'Push & Collapse',particel:'Particle',cascade:'Cascade',crack:'Crack & Break'}},
  de:{modes:{words:'Wörter',sentences:'Sätze',story:'Geschichte',memory:'Memory','speak-practice':'Sprechen'},effects:{scatter:'Verstreuen',burst:'Explosion',float:'Schweben',glow:'Leuchten',collapse:'Schieben & Kollabieren',particel:'Partikel',cascade:'Kaskade',crack:'Brechen & Zerfallen'}},
  pt:{modes:{words:'Palavras',sentences:'Frases',story:'História',memory:'Memória','speak-practice':'Falar'},effects:{scatter:'Dispersar',burst:'Explodir',float:'Flutuar',glow:'Brilhar',collapse:'Empurrar e colapsar',particel:'Partículas',cascade:'Cascata',crack:'Rachar e partir'}},
  es:{modes:{words:'Palabras',sentences:'Frases',story:'Historia',memory:'Memoria','speak-practice':'Hablar'},effects:{scatter:'Dispersar',burst:'Explosión',float:'Flotar',glow:'Brillo',collapse:'Empujar y colapsar',particel:'Partículas',cascade:'Cascada',crack:'Agrietar y romper'}},
  hr:{modes:{words:'Riječi',sentences:'Rečenice',story:'Priča',memory:'Pamćenje','speak-practice':'Govor'},effects:{scatter:'Rasprši',burst:'Eksplozija',float:'Lebdenje',glow:'Sjaj',collapse:'Gurni i sažmi',particel:'Čestice',cascade:'Kaskada',crack:'Napukni i razbij'}},
  fr:{modes:{words:'Mots',sentences:'Phrases',story:'Histoire',memory:'Mémoire','speak-practice':'Parler'},effects:{scatter:'Disperser',burst:'Explosion',float:'Flotter',glow:'Lueur',collapse:'Pousser et réduire',particel:'Particules',cascade:'Cascade',crack:'Fissurer et briser'}}
};

export function getEffectUiCopy(code){ return EFFECT_UI[getUiFamily(code)] || EFFECT_UI.en; }

const STORY_UI = {
  en:{menu:'Menu',story:'Story',page:'Page',previous:'Previous',beginning:'Beginning',next:'Next',complete:'Complete the story',found:'All learning words found.',review:'Review'},
  de:{menu:'Menü',story:'Geschichte',page:'Seite',previous:'Zurück',beginning:'Anfang',next:'Weiter',complete:'Vervollständige die Geschichte',found:'Alle Lernwörter gefunden.',review:'Wiederholung'},
  pt:{menu:'Menu',story:'História',page:'Página',previous:'Anterior',beginning:'Início',next:'Seguinte',complete:'Completa a história',found:'Encontraste todas as palavras.',review:'Revisão'},
  es:{menu:'Menú',story:'Historia',page:'Página',previous:'Anterior',beginning:'Inicio',next:'Siguiente',complete:'Completa la historia',found:'Has encontrado todas las palabras.',review:'Repaso'},
  hr:{menu:'Izbornik',story:'Priča',page:'Stranica',previous:'Prethodno',beginning:'Početak',next:'Dalje',complete:'Dovrši priču',found:'Pronađene su sve riječi.',review:'Ponavljanje'},
  fr:{menu:'Menu',story:'Histoire',page:'Page',previous:'Précédent',beginning:'Début',next:'Suivant',complete:'Complète l’histoire',found:'Tous les mots ont été trouvés.',review:'Révision'}
};

export function getStoryUiCopy(code){ return STORY_UI[getUiFamily(code)] || STORY_UI.en; }

export const UI_LANGUAGE_CODES = Object.freeze(Object.keys(FAMILY));
export const UI_COPY = Object.freeze({ MENU, LANGUAGE_NAMES, SENTENCE_LEVEL, WELCOME, EXERCISE_UI, EFFECT_UI, STORY_UI });
