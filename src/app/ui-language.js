const FAMILY = {
  'pt-PT':'pt','de-DE':'de','en-GB':'en','es-ES':'es','es-AN':'es',
  'hr-HR':'hr','hr-DAL':'hr','fr-FR':'fr'
};

const HTML_LANG = { pt:'pt-PT', de:'de-DE', en:'en-GB', es:'es-ES', hr:'hr-HR', fr:'fr-FR' };

const MENU = {
  en:{
    levelHeading:'Level',exerciseHeading:'Exercise',storyHeading:'Choose a story',topicHeading:'Choose a topic',settingsHeading:'Settings',
    effectsTitle:'Effects',effectsDescription:'Choose the visual effect for the exercises.',futureTitle:'Later',futureDescription:'See planned features.',
    learningLanguage:'Learning language',nativeLanguage:'Translation',start:'Start',chooseStory:'Choose a story',startStory:'▶ Start story',chooseTopic:'Choose a topic',startL2:'Start L2',startL3:'Start L3',
    modes:{emotions:['Emotions','Words, sentences and playful expressions for feelings.'],anxiety:['Anxiety','Learn with short stories about anxious thoughts, perspective and humour.'],'fill-gap':['Sentences','Choose your level and complete the sentence.'],memory:['Memory','Match words and meanings.'],words:['Words','One word at a time.'],'speak-practice':['Speaking','Say useful sentences out loud.'],'communication-strength':['Communication','Learn clearer ways to say things.'],story:['Stories','Learn language through short stories.']},
    levels:{l1:['L1 · Language','Words, sentences, speaking and stories.'],l2:['L2 · Interests & Work','Learn through topics that interest you.'],l3:['L3 · Knowledge','Learn facts and practical knowledge.']},
    l3Groups:{world:'World Knowledge',practical:'Practical Knowledge'}
  },
  de:{
    levelHeading:'Level',exerciseHeading:'Übung',storyHeading:'Geschichte wählen',topicHeading:'Thema wählen',settingsHeading:'Einstellungen',
    effectsTitle:'Effekte',effectsDescription:'Effekt für die Übungen auswählen.',futureTitle:'Später',futureDescription:'Geplante Funktionen ansehen.',
    learningLanguage:'Lernsprache',nativeLanguage:'Übersetzung',start:'Start',chooseStory:'Geschichte wählen',startStory:'▶ Geschichte starten',chooseTopic:'Thema wählen',startL2:'L2 starten',startL3:'L3 starten',
    modes:{emotions:['Emotionen','Wörter, Sätze und Ausdrücke für Gefühle.'],anxiety:['Anxiety','Lerne mit kurzen Geschichten über ängstliche Gedanken, Perspektive und Humor.'],'fill-gap':['Sätze','Wähle dein Level und ergänze den Satz.'],memory:['Memory','Finde passende Wörter und Bedeutungen.'],words:['Wörter','Ein Wort nach dem anderen.'],'speak-practice':['Sprechen','Sprich nützliche Sätze laut aus.'],'communication-strength':['Kommunikation','Lerne klarere Formulierungen.'],story:['Geschichten','Lerne Sprache in kurzen Geschichten.']},
    levels:{l1:['L1 · Sprache','Wörter, Sätze, Sprechen und Geschichten.'],l2:['L2 · Interessen & Beruf','Lerne über Themen, die dich interessieren.'],l3:['L3 · Wissen','Lerne Fakten und praktisches Wissen.']},
    l3Groups:{world:'Weltwissen',practical:'Praktisches Wissen'}
  },
  pt:{
    levelHeading:'Nível',exerciseHeading:'Exercício',storyHeading:'Escolher história',topicHeading:'Escolher tema',settingsHeading:'Definições',
    effectsTitle:'Efeitos',effectsDescription:'Escolhe o efeito visual para os exercícios.',futureTitle:'Mais tarde',futureDescription:'Ver funcionalidades planeadas.',
    learningLanguage:'Língua de aprendizagem',nativeLanguage:'Tradução',start:'Começar',chooseStory:'Escolher história',startStory:'▶ Começar história',chooseTopic:'Escolher tema',startL2:'Começar L2',startL3:'Começar L3',
    modes:{emotions:['Emoções','Palavras, frases e expressões para sentimentos.'],anxiety:['Ansiedade','Aprende com pequenas histórias sobre pensamentos ansiosos, perspetiva e humor.'],'fill-gap':['Frases','Escolhe o teu nível e completa a frase.'],memory:['Memória','Relaciona palavras e significados.'],words:['Palavras','Uma palavra de cada vez.'],'speak-practice':['Falar','Diz frases úteis em voz alta.'],'communication-strength':['Comunicação','Aprende formas mais claras de dizer as coisas.'],story:['Histórias','Aprende a língua em pequenas histórias.']},
    levels:{l1:['L1 · Língua','Palavras, frases, fala e histórias.'],l2:['L2 · Interesses e trabalho','Aprende através de temas que te interessam.'],l3:['L3 · Conhecimento','Aprende factos e conhecimentos práticos.']},
    l3Groups:{world:'Conhecimento do mundo',practical:'Conhecimento prático'}
  },
  es:{
    levelHeading:'Nivel',exerciseHeading:'Ejercicio',storyHeading:'Elegir historia',topicHeading:'Elegir tema',settingsHeading:'Ajustes',
    effectsTitle:'Efectos',effectsDescription:'Elige el efecto visual para los ejercicios.',futureTitle:'Más adelante',futureDescription:'Ver funciones previstas.',
    learningLanguage:'Idioma de aprendizaje',nativeLanguage:'Traducción',start:'Empezar',chooseStory:'Elegir historia',startStory:'▶ Empezar historia',chooseTopic:'Elegir tema',startL2:'Empezar L2',startL3:'Empezar L3',
    modes:{emotions:['Emociones','Palabras, frases y expresiones para los sentimientos.'],anxiety:['Ansiedad','Aprende con pequeñas historias sobre pensamientos ansiosos, perspectiva y humor.'],'fill-gap':['Frases','Elige tu nivel y completa la frase.'],memory:['Memoria','Relaciona palabras y significados.'],words:['Palabras','Una palabra cada vez.'],'speak-practice':['Hablar','Di frases útiles en voz alta.'],'communication-strength':['Comunicación','Aprende formas más claras de decir las cosas.'],story:['Historias','Aprende el idioma con pequeñas historias.']},
    levels:{l1:['L1 · Idioma','Palabras, frases, conversación e historias.'],l2:['L2 · Intereses y trabajo','Aprende con temas que te interesan.'],l3:['L3 · Conocimiento','Aprende datos y conocimientos prácticos.']},
    l3Groups:{world:'Conocimiento del mundo',practical:'Conocimiento práctico'}
  },
  hr:{
    levelHeading:'Razina',exerciseHeading:'Vježba',storyHeading:'Odaberi priču',topicHeading:'Odaberi temu',settingsHeading:'Postavke',
    effectsTitle:'Efekti',effectsDescription:'Odaberi vizualni efekt za vježbe.',futureTitle:'Kasnije',futureDescription:'Pogledaj planirane funkcije.',
    learningLanguage:'Jezik učenja',nativeLanguage:'Prijevod',start:'Počni',chooseStory:'Odaberi priču',startStory:'▶ Pokreni priču',chooseTopic:'Odaberi temu',startL2:'Pokreni L2',startL3:'Pokreni L3',
    modes:{emotions:['Emocije','Riječi, rečenice i izrazi za osjećaje.'],anxiety:['Anksioznost','Uči kroz kratke priče o tjeskobnim mislima, perspektivi i humoru.'],'fill-gap':['Rečenice','Odaberi razinu i dopuni rečenicu.'],memory:['Memorija','Poveži riječi i značenja.'],words:['Riječi','Jedna riječ po jedna.'],'speak-practice':['Govor','Izgovori korisne rečenice naglas.'],'communication-strength':['Komunikacija','Nauči jasnije načine izražavanja.'],story:['Priče','Uči jezik kroz kratke priče.']},
    levels:{l1:['L1 · Jezik','Riječi, rečenice, govor i priče.'],l2:['L2 · Interesi i posao','Uči kroz teme koje te zanimaju.'],l3:['L3 · Znanje','Uči činjenice i praktično znanje.']},
    l3Groups:{world:'Znanje o svijetu',practical:'Praktično znanje'}
  },
  fr:{
    levelHeading:'Niveau',exerciseHeading:'Exercice',storyHeading:'Choisir une histoire',topicHeading:'Choisir un thème',settingsHeading:'Paramètres',
    effectsTitle:'Effets',effectsDescription:'Choisis l’effet visuel pour les exercices.',futureTitle:'Plus tard',futureDescription:'Voir les fonctionnalités prévues.',
    learningLanguage:'Langue d’apprentissage',nativeLanguage:'Traduction',start:'Commencer',chooseStory:'Choisir une histoire',startStory:'▶ Commencer l’histoire',chooseTopic:'Choisir un thème',startL2:'Commencer L2',startL3:'Commencer L3',
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
