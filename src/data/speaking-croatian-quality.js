const isCroatian=value=>String(value||'').toLowerCase().startsWith('hr');

const normalize=value=>String(value||'')
  .toLocaleLowerCase('hr')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/[^\p{L}\p{N}\s&-]/gu,' ')
  .replace(/\s+/g,' ')
  .trim();

const CROATIAN_MEET_POSSESSIVE={
  'obitelj':'svojoj obitelji',
  'najboljem prijatelju ili prijateljici':'svom najboljem prijatelju ili prijateljici',
  'hobijima':'svojim hobijima',
  'omiljenoj glazbi':'svojoj omiljenoj glazbi',
  'omiljenom filmu':'svom omiljenom filmu',
  'omiljenoj knjizi':'svojoj omiljenoj knjizi',
  'kućnim ljubimcima':'svojim kućnim ljubimcima',
  'jezicima':'jezicima koje govoriš',
  'rodnom gradu':'svom rodnom gradu',
  'rođendanu':'svom rođendanu',
  'vikendu':'svom vikendu',
  'nečemu na što si ponosan':'nečemu na što si ponosan',
  'poslu iz snova':'svom poslu iz snova',
  'omiljenoj hrani':'svojoj omiljenoj hrani',
  'posljednjem odmoru':'svom posljednjem odmoru',
  'jutarnjoj rutini':'svojoj jutarnjoj rutini',
  'omiljenom godišnjem dobu':'svom omiljenom godišnjem dobu',
  'djetinjstvu':'svom djetinjstvu',
  'susjedstvu':'svom susjedstvu',
  'planovima putovanja':'svojim planovima putovanja',
  'omiljenom mjestu':'svom omiljenom mjestu',
  'svakodnevnom životu':'svom svakodnevnom životu',
  'osobi kojoj se diviš':'osobi kojoj se diviš',
  'nečemu što te nasmijava':'nečemu što te nasmijava',
  'vještini koju želiš naučiti':'vještini koju želiš naučiti',
  'svom savršenom danu':'svom savršenom danu',
  'budućim ciljevima':'svojim budućim ciljevima'
};

const CROATIAN_FAMILY_SIGNALS=[
  'obitelj','familija','roditelj','roditelji','majka','mama','otac','tata',
  'brat','sestra','braća','sestre','baka','djed','djeca','dijete','sin','kći',
  'suprug','supruga','partner','partnerica'
];

const CROATIAN_MUSIC_SIGNALS=[
  'glazba','glazbu','glazbi','muzika','muziku','pjesma','pjesme','žanr','žanrovi',
  'pop','rock','rok','jazz','džez','techno','house','tech house','rap','hip hop','r&b',
  'soul','metal','reggae','klasična glazba','elektronska glazba'
];

const SAFE_PRONUNCIATION_CORRECTIONS=new Map([
  ['moji roditelji zive blizu meni','Moji roditelji žive blizu mene.']
]);

const hobbyForm=(noun,infinitive)=>({noun,infinitive});
const HOBBY_FORMS=new Map([
  ['crtati',hobbyForm('crtanje','crtati')],['crtanje',hobbyForm('crtanje','crtati')],['crtani',hobbyForm('crtanje','crtati')],
  ['trcati',hobbyForm('trčanje','trčati')],['trcanje',hobbyForm('trčanje','trčati')],
  ['vjezbati',hobbyForm('vježbanje','vježbati')],['vjezbanje',hobbyForm('vježbanje','vježbati')],
  ['plivati',hobbyForm('plivanje','plivati')],['plivanje',hobbyForm('plivanje','plivati')],
  ['citati',hobbyForm('čitanje','čitati')],['citanje',hobbyForm('čitanje','čitati')],
  ['kuhati',hobbyForm('kuhanje','kuhati')],['kuhanje',hobbyForm('kuhanje','kuhati')],
  ['plesati',hobbyForm('plesanje','plesati')],['plesanje',hobbyForm('plesanje','plesati')],
  ['pjevati',hobbyForm('pjevanje','pjevati')],['pjevanje',hobbyForm('pjevanje','pjevati')],
  ['pisati',hobbyForm('pisanje','pisati')],['pisanje',hobbyForm('pisanje','pisati')],
  ['fotografirati',hobbyForm('fotografiranje','fotografirati')],['fotografiranje',hobbyForm('fotografiranje','fotografirati')],
  ['setati',hobbyForm('šetnja','šetati')],['setnja',hobbyForm('šetnja','šetati')],
  ['planinariti',hobbyForm('planinarenje','planinariti')],['planinarenje',hobbyForm('planinarenje','planinariti')],
  ['putovati',hobbyForm('putovanja','putovati')],['putovanja',hobbyForm('putovanja','putovati')],
  ['peci',hobbyForm('pečenje','peći')],['pecenje',hobbyForm('pečenje','peći')],
  ['voziti bicikl',hobbyForm('vožnja bicikla','voziti bicikl')],['voznja bicikla',hobbyForm('vožnja bicikla','voziti bicikl')],
  ['igrati nogomet',hobbyForm('igranje nogometa','igrati nogomet')],['igranje nogometa',hobbyForm('igranje nogometa','igrati nogomet')],
  ['igrati tenis',hobbyForm('igranje tenisa','igrati tenis')],['igranje tenisa',hobbyForm('igranje tenisa','igrati tenis')],
  ['slusati glazbu',hobbyForm('slušanje glazbe','slušati glazbu')],['slusanje glazbe',hobbyForm('slušanje glazbe','slušati glazbu')],
  ['gledati filmove',hobbyForm('gledanje filmova','gledati filmove')],['gledanje filmova',hobbyForm('gledanje filmova','gledati filmove')],
  ['svirati gitaru',hobbyForm('sviranje gitare','svirati gitaru')],['sviranje gitare',hobbyForm('sviranje gitare','svirati gitaru')],
  ['izaci vani',hobbyForm('izlasci','izlaziti')],['izlaziti',hobbyForm('izlasci','izlaziti')],['izlasci',hobbyForm('izlasci','izlaziti')]
]);

const MUSIC_GENRES=new Map([
  ['pop','pop'],['rock','rock'],['rok','rock'],['jazz','jazz'],['dzez','jazz'],['techno','techno'],
  ['house','house'],['tech house','tech house'],['rap','rap'],['hip hop','hip hop'],['r&b','R&B'],
  ['soul','soul'],['metal','metal'],['reggae','reggae'],['klasicna glazba','klasična glazba'],
  ['elektronska glazba','elektronska glazba']
]);

const asLocativeTopic=topic=>topic==='obitelj'?'obitelji':topic;

const polishCroatianQuestion=value=>{
  let text=String(value||'');
  if(text.startsWith('Reci mi nešto o svojim ')){
    const topic=text.slice('Reci mi nešto o svojim '.length).replace(/\.$/u,'');
    const natural=CROATIAN_MEET_POSSESSIVE[topic]||asLocativeTopic(topic);
    text=`Reci mi nešto o ${natural}.`;
  }
  if(text.startsWith('Zašto su ti važni ')){
    const topic=text.slice('Zašto su ti važni '.length).replace(/\?$/u,'');
    text=`Zašto ti je važno razgovarati o ${asLocativeTopic(topic)}?`;
  }
  return text;
};

const polishCroatianExample=value=>{
  const text=String(value||'');
  if(text==='Moja obitelj važan je dio mog života.')return 'Moja obitelj mi je jako važna.';
  if(text==='obitelj mi je važno jer obogaćuje moj život.')return 'Obitelj mi je važna jer obogaćuje moj život.';
  if(text==='Moja omiljenoj glazbi važan je dio mog života.')return 'Moja omiljena glazba važan je dio mog života.';
  if(/^Moja .+ važan je dio mog života\.$/u.test(text))return 'To mi je važan dio života.';
  if(/ mi je važno jer obogaćuje moj život\.$/u.test(text))return 'Ta mi je tema važna jer obogaćuje moj život.';
  return text;
};

const isCroatianFamilyTurn=turn=>{
  const question=String(turn?.question||'');
  return question==='Reci mi nešto o svojoj obitelji.'||question==='Zašto ti je važno razgovarati o obitelji?';
};

const isCroatianMusicTurn=turn=>String(turn?.question||'')==='Reci mi nešto o svojoj omiljenoj glazbi.';

const resolveHobbyActivity=value=>HOBBY_FORMS.get(normalize(value))||null;

const splitHobbyActivities=value=>{
  const source=String(value||'').trim();
  if(!source)return [];
  const explicit=source.split(/\s+i\s+|\s*,\s*/iu).map(part=>part.trim()).filter(Boolean);
  if(explicit.length>1)return explicit;
  if(resolveHobbyActivity(source))return [source];
  const tokens=source.split(/\s+/u).filter(Boolean),memo=new Map();
  const segment=start=>{
    if(start===tokens.length)return [];
    if(memo.has(start))return memo.get(start);
    for(let end=tokens.length;end>start;end-=1){
      const piece=tokens.slice(start,end).join(' ');
      if(!resolveHobbyActivity(piece))continue;
      const rest=segment(end);
      if(rest){const result=[piece,...rest];memo.set(start,result);return result;}
    }
    memo.set(start,null);return null;
  };
  const segmented=segment(0);
  return segmented?.length?segmented:[source];
};

const parseHobbyAnswer=value=>{
  const source=String(value||'').trim().replace(/[.!?]+$/u,'').trim();
  const match=source.match(/^(moj|moji|moje)\s+hobi(?:ji|je|ja|jem|jima)?\s+(?:(?:je|su)\s+)?(.+)$/iu);
  if(!match)return null;
  const activities=match[2].trim();
  if(!activities)return null;
  const parts=splitHobbyActivities(activities);
  if(!parts.length)return null;
  const forms=parts.map(resolveHobbyActivity);
  return {subject:match[1].toLocaleLowerCase('hr'),activities,parts,forms};
};

const hobbyRecommendation=value=>{
  const parsed=parseHobbyAnswer(value);
  if(!parsed||parsed.forms.some(item=>!item))return '';
  const nouns=parsed.forms.map(item=>item.noun);
  return nouns.length===1?`Moj hobi je ${nouns[0]}.`:`Moji hobiji su ${nouns.join(' i ')}.`;
};

const hobbyAlternative=value=>{
  const parsed=parseHobbyAnswer(value);
  if(!parsed||parsed.forms.some(item=>!item))return '';
  const infinitives=parsed.forms.map(item=>item.infinitive);
  return infinitives.length?`Volim ${infinitives.join(' i ')}.`:'';
};

const hasHobbyGrammarIssue=value=>{
  const recommendation=hobbyRecommendation(value);
  return Boolean(recommendation&&normalize(value)!==normalize(recommendation));
};

const findMusicGenre=value=>{
  const text=` ${normalize(value)} `;
  const entries=[...MUSIC_GENRES.entries()].sort((a,b)=>b[0].length-a[0].length);
  for(const [key,label] of entries){if(text.includes(` ${key} `))return label;}
  return '';
};

const musicRecommendation=value=>{
  const source=String(value||'').trim();
  const text=normalize(source);
  if(!source)return '';
  const genre=findMusicGenre(source);
  if(genre)return `Moja omiljena glazba je ${genre}.`;
  if(/\bglazb|\bmuzik/u.test(text))return 'Moja omiljena glazba mi je jako važna.';
  return '';
};

const musicAlternative=value=>{
  const source=String(value||'').trim();
  const text=normalize(source);
  if(!source)return '';
  const genre=findMusicGenre(source);
  if(genre)return `Najviše volim slušati ${genre}.`;
  if(/\bglazb|\bmuzik/u.test(text))return 'Volim slušati glazbu.';
  return '';
};

const hasMusicGrammarIssue=value=>{
  const text=normalize(value);
  if(!/\bglazb|\bmuzik/u.test(text))return false;
  const badPatterns=[
    /^mio\s+glazb/u,/^mio\s+muzik/u,/\bglazbi\s+su\s+mi\b/u,
    /^moji\s+glazb/u,/^moje\s+glazb/u,/^moja\s+glazbi\b/u,
    /^moj\s+omiljena\s+glazb/u,/^moja\s+omiljeni\s+glazb/u
  ];
  return badPatterns.some(pattern=>pattern.test(text));
};

export function polishCroatianSpeakingTurn(turn,learningLanguage,nativeLanguage){
  const next={...turn};
  if(isCroatian(learningLanguage)){
    next.question=polishCroatianQuestion(next.question);
    next.example=polishCroatianExample(next.example);
    if(isCroatianFamilyTurn(next))next.signals=[...(next.signals||[]),...CROATIAN_FAMILY_SIGNALS];
    if(isCroatianMusicTurn(next))next.signals=[...(next.signals||[]),...CROATIAN_MUSIC_SIGNALS];
  }
  if(isCroatian(nativeLanguage)){
    next.translation=polishCroatianQuestion(next.translation);
    next.exampleTranslation=polishCroatianExample(next.exampleTranslation);
  }
  return next;
}

export function hasObviousCroatianGrammarIssue(value,learningLanguage){
  if(!isCroatian(learningLanguage))return false;
  const text=normalize(value);
  const badPatterns=[
    /\bmoji\s+obitelj(?:i)?\b/u,/\bmoja\s+obitelji\b/u,/\bmoje\s+obitelj\b/u,
    /\bmojoj\s+obitelj\b/u,/\bmoju\s+obitelji\b/u,/\bmojom\s+obitelj\b/u,
    /\bsvojim\s+obitelj\b/u,/\bmoji\s+hobi\b/u,/\bmoj\s+hobiji\b/u,
    /^moje\s+hobije\b/u,/^moji\s+hobije\b/u,/^moje\s+hobi\b/u
  ];
  return badPatterns.some(pattern=>pattern.test(text))||hasHobbyGrammarIssue(value)||hasMusicGrammarIssue(value);
}

export function getRecommendedSpeakingSentence(value,learningLanguage){
  const source=String(value||'').trim();
  if(!source||!isCroatian(learningLanguage))return source;
  const exact=SAFE_PRONUNCIATION_CORRECTIONS.get(normalize(source));
  if(exact)return exact;
  return hobbyRecommendation(source)||musicRecommendation(source)||source;
}

export function getAlternativeSpeakingSentence(value,learningLanguage){
  const source=String(value||'').trim();
  if(!source||!isCroatian(learningLanguage))return '';
  return hobbyAlternative(source)||musicAlternative(source);
}
