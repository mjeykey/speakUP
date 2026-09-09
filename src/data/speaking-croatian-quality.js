const isCroatian=value=>String(value||'').toLowerCase().startsWith('hr');

const normalize=value=>String(value||'')
  .toLocaleLowerCase('hr')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/[^\p{L}\p{N}\s-]/gu,' ')
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

const SAFE_PRONUNCIATION_CORRECTIONS=new Map([
  ['moji roditelji zive blizu meni','Moji roditelji žive blizu mene.'],
  ['moji hobi je crtati i izaci vani','Volim crtati i izlaziti.'],
  ['moj hobi je crtati','Moj hobi je crtanje.']
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
  if(/^Moja .+ važan je dio mog života\.$/u.test(text))return 'To mi je važan dio života.';
  if(/ mi je važno jer obogaćuje moj život\.$/u.test(text))return 'Ta mi je tema važna jer obogaćuje moj život.';
  return text;
};

const isCroatianFamilyTurn=turn=>{
  const question=String(turn?.question||'');
  return question==='Reci mi nešto o svojoj obitelji.'||question==='Zašto ti je važno razgovarati o obitelji?';
};

const hobbyRecommendation=value=>{
  const source=String(value||'').trim().replace(/[.!?]+$/u,'').trim();
  const match=source.match(/^(?:moj|moji|moje)\s+hobi(?:ji|je|ja|jem|jima)?\s+(?:(?:je|su)\s+)?(.+)$/iu);
  if(!match)return '';
  let activities=match[1].trim();
  if(!activities)return '';
  activities=activities
    .replace(/\bizaći\s+vani\b/giu,'izlaziti')
    .replace(/\bizaci\s+vani\b/giu,'izlaziti');
  return `Volim ${activities}.`;
};

export function polishCroatianSpeakingTurn(turn,learningLanguage,nativeLanguage){
  const next={...turn};
  if(isCroatian(learningLanguage)){
    next.question=polishCroatianQuestion(next.question);
    next.example=polishCroatianExample(next.example);
    if(isCroatianFamilyTurn(next))next.signals=[...(next.signals||[]),...CROATIAN_FAMILY_SIGNALS];
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
    /\bmoji\s+obitelj(?:i)?\b/u,
    /\bmoja\s+obitelji\b/u,
    /\bmoje\s+obitelj\b/u,
    /\bmojoj\s+obitelj\b/u,
    /\bmoju\s+obitelji\b/u,
    /\bmojom\s+obitelj\b/u,
    /\bsvojim\s+obitelj\b/u,
    /\bmoji\s+hobi\b/u,
    /\bmoj\s+hobiji\b/u,
    /^moje\s+hobije\b/u,
    /^moji\s+hobije\b/u,
    /^moje\s+hobi\b/u
  ];
  return badPatterns.some(pattern=>pattern.test(text));
}

export function getRecommendedSpeakingSentence(value,learningLanguage){
  const source=String(value||'').trim();
  if(!source||!isCroatian(learningLanguage))return source;
  const exact=SAFE_PRONUNCIATION_CORRECTIONS.get(normalize(source));
  if(exact)return exact;
  return hobbyRecommendation(source)||source;
}
