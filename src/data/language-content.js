import { WORDS as PORTUGUESE_WORDS } from './content.js?v=6';
import { SENTENCE_LEVELS as PORTUGUESE_SENTENCES } from './sentences/index.js?v=1';

export const LANGUAGE_OPTIONS = [
  { code: 'pt-PT', label: 'Português (Portugal)', short: 'Português' },
  { code: 'de-DE', label: 'Deutsch', short: 'Deutsch' },
  { code: 'en-GB', label: 'English', short: 'English' }
];

const GERMAN_WORDS = [
  ['Haus','house'],['Straße','street'],['Freundin','female friend'],['Freund','male friend'],['Kaffee','coffee'],['Wasser','water'],['Morgen','morning'],['Abend','evening'],['Arbeit','work'],['Schule','school'],['Buch','book'],['Tisch','table'],['Stuhl','chair'],['Tür','door'],['Fenster','window'],['Brot','bread'],['Apfel','apple'],['Gemüse','vegetables'],['Zug','train'],['Bus','bus'],['Handy','mobile phone'],['Liebe','love'],['Hoffnung','hope'],['Ruhe','calm'],['Mut','courage'],['lernen','to learn'],['sprechen','to speak'],['gehen','to go'],['kommen','to come'],['sehen','to see'],['hören','to hear'],['essen','to eat'],['trinken','to drink'],['schlafen','to sleep'],['arbeiten','to work'],['glücklich','happy'],['müde','tired'],['freundlich','kind'],['schnell','fast'],['langsam','slow']
].map(([target, translation]) => ({ target, translation }));

const ENGLISH_WORDS = [
  ['house','Haus'],['street','Straße'],['friend','Freund/in'],['coffee','Kaffee'],['water','Wasser'],['morning','Morgen'],['evening','Abend'],['work','Arbeit'],['school','Schule'],['book','Buch'],['table','Tisch'],['chair','Stuhl'],['door','Tür'],['window','Fenster'],['bread','Brot'],['apple','Apfel'],['vegetables','Gemüse'],['train','Zug'],['bus','Bus'],['phone','Handy'],['love','Liebe'],['hope','Hoffnung'],['calm','Ruhe'],['courage','Mut'],['to learn','lernen'],['to speak','sprechen'],['to go','gehen'],['to come','kommen'],['to see','sehen'],['to hear','hören'],['to eat','essen'],['to drink','trinken'],['to sleep','schlafen'],['to work','arbeiten'],['happy','glücklich'],['tired','müde'],['kind','freundlich'],['fast','schnell'],['slow','langsam']
].map(([target, translation]) => ({ target, translation }));

const makeLevel = (id, title, emoji, description, englishClass, items) => ({ id, title, emoji, description, englishClass, items });

const GERMAN_SENTENCES = [
  makeLevel('beginner','Beginner','🌱','One gap with full English support.','',[
    { sentence:'Ich _____ jeden Morgen Kaffee.', answers:['trinke'], options:['trinke','sehe','schlafe','komme'], translation:'I drink coffee every morning.' },
    { sentence:'Wir _____ heute mit dem Bus.', answers:['fahren'], options:['fahren','essen','lernen','hören'], translation:'We are taking the bus today.' },
    { sentence:'Sie _____ ein neues Buch.', answers:['liest'], options:['liest','trinkt','geht','arbeitet'], translation:'She is reading a new book.' },
    { sentence:'Er _____ in Berlin.', answers:['wohnt'], options:['wohnt','spricht','kauft','öffnet'], translation:'He lives in Berlin.' },
    { sentence:'Ich _____ Deutsch.', answers:['lerne'], options:['lerne','warte','koche','finde'], translation:'I am learning German.' }
  ]),
  makeLevel('survivor','Survivor','🔥','Two gaps with full English support.','',[
    { sentence:'Ich _____ morgens Kaffee und _____ die Nachrichten.', answers:['trinke','lese'], options:['trinke','lese','schlafe','kaufe','höre'], translation:'I drink coffee and read the news in the morning.' },
    { sentence:'Wir _____ zum Bahnhof und _____ den Zug.', answers:['gehen','nehmen'], options:['gehen','nehmen','essen','sehen','öffnen'], translation:'We go to the station and take the train.' },
    { sentence:'Sie _____ das Fenster und _____ frische Luft.', answers:['öffnet','genießt'], options:['öffnet','genießt','schreibt','bezahlt','wartet'], translation:'She opens the window and enjoys the fresh air.' },
    { sentence:'Er _____ heute zu Hause und _____ am Computer.', answers:['bleibt','arbeitet'], options:['bleibt','arbeitet','fährt','tanzt','kauft'], translation:'He stays at home and works on the computer today.' },
    { sentence:'Ich _____ das Abendessen und _____ danach die Küche.', answers:['koche','räume auf'], options:['koche','räume auf','lese','schlafe','fahre'], translation:'I cook dinner and clean the kitchen afterwards.' }
  ]),
  makeLevel('explorer','Explorer','🧭','Three gaps with softer English support.','is-subtle',[
    { sentence:'Bevor ich zur Arbeit _____, _____ ich Kaffee und _____ kurz das Fenster.', answers:['gehe','trinke','öffne'], options:['gehe','trinke','öffne','schlafe','kaufe','höre'], translation:'Before I go to work, I drink coffee and briefly open the window.' },
    { sentence:'Wenn wir am Bahnhof _____, _____ wir die Anzeige und _____ das richtige Gleis.', answers:['ankommen','prüfen','suchen'], options:['ankommen','prüfen','suchen','essen','schlafen','bezahlen'], translation:'When we arrive at the station, we check the board and look for the right platform.' },
    { sentence:'Obwohl sie müde _____, _____ sie weiter und _____ ruhig.', answers:['ist','arbeitet','bleibt'], options:['ist','arbeitet','bleibt','fährt','kauft','öffnet'], translation:'Although she is tired, she keeps working and stays calm.' },
    { sentence:'Nachdem er das Essen _____, _____ er den Tisch und _____ Musik.', answers:['gekocht hat','deckt','hört'], options:['gekocht hat','deckt','hört','schläft','nimmt','liest'], translation:'After cooking the meal, he sets the table and listens to music.' },
    { sentence:'Ich _____ mir mein Ziel vor, _____ einen kleinen Schritt und _____ geduldig.', answers:['stelle','mache','bleibe'], options:['stelle','mache','bleibe','trinke','öffne','fahre'], translation:'I picture my goal, take a small step and remain patient.' }
  ])
];

const ENGLISH_SENTENCES = [
  makeLevel('beginner','Beginner','🌱','One gap with full German support.','',[
    { sentence:'I _____ coffee every morning.', answers:['drink'], options:['drink','see','sleep','come'], translation:'Ich trinke jeden Morgen Kaffee.' },
    { sentence:'We _____ the bus today.', answers:['take'], options:['take','eat','learn','hear'], translation:'Wir nehmen heute den Bus.' },
    { sentence:'She _____ a new book.', answers:['reads'], options:['reads','drinks','goes','works'], translation:'Sie liest ein neues Buch.' },
    { sentence:'He _____ in Berlin.', answers:['lives'], options:['lives','speaks','buys','opens'], translation:'Er wohnt in Berlin.' },
    { sentence:'I _____ English.', answers:['learn'], options:['learn','wait','cook','find'], translation:'Ich lerne Englisch.' }
  ]),
  makeLevel('survivor','Survivor','🔥','Two gaps with full German support.','',[
    { sentence:'I _____ coffee and _____ the news in the morning.', answers:['drink','read'], options:['drink','read','sleep','buy','hear'], translation:'Ich trinke morgens Kaffee und lese die Nachrichten.' },
    { sentence:'We _____ to the station and _____ the train.', answers:['go','take'], options:['go','take','eat','see','open'], translation:'Wir gehen zum Bahnhof und nehmen den Zug.' },
    { sentence:'She _____ the window and _____ the fresh air.', answers:['opens','enjoys'], options:['opens','enjoys','writes','pays','waits'], translation:'Sie öffnet das Fenster und genießt die frische Luft.' },
    { sentence:'He _____ at home and _____ on the computer.', answers:['stays','works'], options:['stays','works','drives','dances','buys'], translation:'Er bleibt zu Hause und arbeitet am Computer.' },
    { sentence:'I _____ dinner and _____ the kitchen afterwards.', answers:['cook','clean'], options:['cook','clean','read','sleep','drive'], translation:'Ich koche das Abendessen und räume danach die Küche auf.' }
  ]),
  makeLevel('explorer','Explorer','🧭','Three gaps with softer German support.','is-subtle',[
    { sentence:'Before I _____ to work, I _____ coffee and _____ the window.', answers:['go','drink','open'], options:['go','drink','open','sleep','buy','hear'], translation:'Bevor ich zur Arbeit gehe, trinke ich Kaffee und öffne das Fenster.' },
    { sentence:'When we _____ at the station, we _____ the board and _____ the platform.', answers:['arrive','check','find'], options:['arrive','check','find','eat','sleep','pay'], translation:'Wenn wir am Bahnhof ankommen, prüfen wir die Anzeige und finden das Gleis.' },
    { sentence:'Although she _____ tired, she _____ working and _____ calm.', answers:['is','keeps','stays'], options:['is','keeps','stays','drives','buys','opens'], translation:'Obwohl sie müde ist, arbeitet sie weiter und bleibt ruhig.' },
    { sentence:'After he _____ dinner, he _____ the table and _____ to music.', answers:['cooks','sets','listens'], options:['cooks','sets','listens','sleeps','takes','reads'], translation:'Nachdem er das Essen kocht, deckt er den Tisch und hört Musik.' },
    { sentence:'I _____ my goal, _____ one small step and _____ patient.', answers:['picture','take','remain'], options:['picture','take','remain','drink','open','drive'], translation:'Ich stelle mir mein Ziel vor, mache einen kleinen Schritt und bleibe geduldig.' }
  ])
];

export function languageName(code) {
  return LANGUAGE_OPTIONS.find(item => item.code === code)?.short || code;
}

export function getSpeechLanguage(code) {
  return code || 'pt-PT';
}

export function getWords(learningLanguage, nativeLanguage) {
  if (learningLanguage === 'de-DE') return GERMAN_WORDS;
  if (learningLanguage === 'en-GB') return ENGLISH_WORDS;
  return PORTUGUESE_WORDS.map(item => ({ target: item.pt, translation: item.en }));
}

export function getSentenceLevels(learningLanguage) {
  if (learningLanguage === 'de-DE') return GERMAN_SENTENCES;
  if (learningLanguage === 'en-GB') return ENGLISH_SENTENCES;
  return PORTUGUESE_SENTENCES.map(level => ({
    ...level,
    items: level.items.map(item => ({ ...item, translation: item.english }))
  }));
}
