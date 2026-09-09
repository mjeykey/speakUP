const isCroatian=value=>String(value||'').toLowerCase().startsWith('hr');

const normalize=value=>String(value||'')
  .toLocaleLowerCase('hr')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/[^\p{L}\p{N}\s-]/gu,' ')
  .replace(/\s+/g,' ')
  .trim();

const polishCroatianQuestion=value=>{
  let text=String(value||'');

  // Older generated Meet questions used the plural possessive "svojim"
  // for every noun, including singular feminine/masculine topics.
  if(text.startsWith('Reci mi nešto o svojim ')){
    text=text.replace('Reci mi nešto o svojim ','Reci mi nešto o ');
    text=text.replace(/o obitelj\.$/u,'o obitelji.');
  }

  // The second generated Meet template had the same agreement problem.
  if(text.startsWith('Zašto su ti važni ')){
    let topic=text.slice('Zašto su ti važni '.length).replace(/\?$/u,'');
    if(topic==='obitelj')topic='obitelji';
    text=`Zašto ti je važno razgovarati o ${topic}?`;
  }

  return text;
};

const polishCroatianExample=value=>{
  const text=String(value||'');
  if(/^Moja .+ važan je dio mog života\.$/u.test(text))return 'To mi je važan dio života.';
  if(/ mi je važno jer obogaćuje moj život\.$/u.test(text))return 'Ta mi je tema važna jer obogaćuje moj život.';
  return text;
};

export function polishCroatianSpeakingTurn(turn,learningLanguage,nativeLanguage){
  const next={...turn};
  if(isCroatian(learningLanguage)){
    next.question=polishCroatianQuestion(next.question);
    next.example=polishCroatianExample(next.example);
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
    /\bsvojim\s+obitelj\b/u
  ];
  return badPatterns.some(pattern=>pattern.test(text));
}
