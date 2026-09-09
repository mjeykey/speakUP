const family=value=>{
  const code=String(value||'').toLowerCase();
  if(code.startsWith('de'))return 'de';
  if(code.startsWith('pt'))return 'pt';
  if(code.startsWith('es'))return 'es';
  if(code.startsWith('hr'))return 'hr';
  if(code.startsWith('fr'))return 'fr';
  return 'en';
};

const normalize=value=>String(value||'')
  .toLocaleLowerCase('hr')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/[^\p{L}\p{N}\s-]/gu,' ')
  .replace(/\s+/g,' ')
  .trim();

const MUSIC_SCAFFOLD={
  followUp:'Gdje obično slušaš glazbu?',
  followUpTranslation:{
    en:'Where do you usually listen to music?',
    de:'Wo hörst du normalerweise Musik?',
    pt:'Onde costumas ouvir música?',
    es:'¿Dónde sueles escuchar música?',
    hr:'Gdje obično slušaš glazbu?',
    fr:'Où écoutes-tu habituellement de la musique ?'
  },
  example:'Ja, primjerice, slušam glazbu na putu na posao.',
  exampleTranslation:{
    en:'For example, I listen to music on the way to work.',
    de:'Ich höre zum Beispiel auf dem Weg zur Arbeit Musik.',
    pt:'Por exemplo, ouço música a caminho do trabalho.',
    es:'Por ejemplo, escucho música de camino al trabajo.',
    hr:'Ja, primjerice, slušam glazbu na putu na posao.',
    fr:'Par exemple, j’écoute de la musique sur le chemin du travail.'
  },
  easyQuestion:'Je li i kod tebe tako?',
  easyTranslation:{
    en:'Is it like that for you too?',
    de:'Ist das bei dir auch so?',
    pt:'Contigo também é assim?',
    es:'¿A ti también te pasa?',
    hr:'Je li i kod tebe tako?',
    fr:'C’est pareil pour toi aussi ?'
  }
};

const DANGLING_CROATIAN_WORDS=new Set([
  'na','u','za','od','do','iz','s','sa','kod','prema','kroz','bez','oko','kad','kada','jer','ako','dok','da','pa','ali','i','ili'
]);

export function isSpeakingAnswerIncomplete(value,learningLanguage){
  if(!String(learningLanguage||'').toLowerCase().startsWith('hr'))return false;
  const text=normalize(value);
  if(!text)return false;
  const words=text.split(/\s+/u).filter(Boolean);
  if(words.length<2)return false;
  return DANGLING_CROATIAN_WORDS.has(words.at(-1));
}

export function getSpeakingConversationScaffold(turn,learningLanguage,nativeLanguage){
  if(!String(learningLanguage||'').toLowerCase().startsWith('hr'))return null;
  const question=String(turn?.question||'');
  if(!question.includes('omiljenoj glazbi'))return null;
  const f=family(nativeLanguage);
  return {
    followUp:MUSIC_SCAFFOLD.followUp,
    followUpTranslation:MUSIC_SCAFFOLD.followUpTranslation[f],
    example:MUSIC_SCAFFOLD.example,
    exampleTranslation:MUSIC_SCAFFOLD.exampleTranslation[f],
    easyQuestion:MUSIC_SCAFFOLD.easyQuestion,
    easyTranslation:MUSIC_SCAFFOLD.easyTranslation[f]
  };
}

export function isEasyConversationAnswer(value,learningLanguage){
  if(!String(learningLanguage||'').toLowerCase().startsWith('hr'))return false;
  const text=normalize(value);
  return /^(da|ne|jest|je|nije|jesam|nisam|naravno|ponekad|da jesam|ne nisam|da je|nije tako)$/u.test(text);
}
