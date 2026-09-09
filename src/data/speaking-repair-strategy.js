import { hasObviousCroatianGrammarIssue, getRecommendedSpeakingSentence } from './speaking-croatian-quality.js?v=12';

const languageFamily=value=>{
  const code=String(value||'').toLowerCase();
  if(code.startsWith('hr'))return 'hr';
  if(code.startsWith('pt'))return 'pt';
  return 'other';
};

const normalize=value=>String(value||'')
  .toLocaleLowerCase('pt')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/[^\p{L}\p{N}\s&-]/gu,' ')
  .replace(/\s+/g,' ')
  .trim();

const hasRepeatedNeighbour=value=>{
  const words=normalize(value).split(/\s+/u).filter(Boolean);
  return words.some((word,index)=>index>0&&word.length>1&&word===words[index-1]);
};

const hasFamilySubjectNoise=(value,turn)=>{
  if(!String(turn?.question||'').includes('obitelji'))return false;
  const text=normalize(value);
  return /^moje\s+obitelji\b/u.test(text)
    || /^moji\s+obitelj(?:i)?\b/u.test(text)
    || /\bobitelj(?:i)?\s+mi\s+mi\b/u.test(text);
};

const familyLaughSuggestion=(value,turn)=>{
  if(!String(turn?.question||'').includes('obitelji'))return '';
  const text=normalize(value);
  if(/^(?:moja|moje)\s+obitelj(?:i)?\b.*\buvijek\b.*\bnasmij/u.test(text)){
    return 'Moja obitelj me uvijek nasmije.';
  }
  return '';
};

const hasMusicGenre=value=>/\b(pop|rock|rok|jazz|dzez|techno|house|rap|hip hop|r&b|soul|metal|reggae)\b/u.test(normalize(value));

const isSafeGeneratedRepair=(value,suggestion,turn)=>{
  const source=normalize(value),repair=normalize(suggestion);
  if(!source||!repair||source===repair)return false;
  if(/^zivim(?:o)?\b/u.test(source)&&repair==='zivim u lisabonu')return true;
  if(/^moji\s+roditelji\b/u.test(source)&&(repair.startsWith('moji roditelji ')||repair.startsWith('u mojoj obitelji ')))return true;
  if(/\bhobi/u.test(source)&&/\bhobi/u.test(repair))return true;
  if(String(turn?.question||'').includes('omiljenoj glazbi')&&hasMusicGenre(source)&&hasMusicGenre(repair))return true;
  return false;
};

const PORTUGUESE_ORIGINS=new Map([
  ['maia','Sou da Maia.'],
  ['alemanha','Sou da Alemanha.'],
  ['croacia','Sou da Croácia.'],
  ['lisboa','Sou de Lisboa.'],
  ['portugal','Sou de Portugal.'],
  ['porto','Sou do Porto.'],
  ['brasil','Sou do Brasil.'],
  ['espanha','Sou de Espanha.'],
  ['franca','Sou de França.']
]);

const isPortugueseOriginTurn=turn=>/^de onde (?:es|e)\??$/u.test(normalize(turn?.question));
const isWellFormedPortugueseOrigin=value=>/^(?:eu\s+)?sou\s+(?:de|da|do|das|dos)\s+[\p{L}][\p{L}\s-]*$/u.test(normalize(value));
const isPortugueseFamilyTurn=turn=>/\b(?:familia|família)\b/u.test(String(turn?.question||'').toLocaleLowerCase('pt'));

const hasPortugueseOriginSpeechNoise=(value,turn)=>{
  if(!isPortugueseOriginTurn(turn))return false;
  const text=normalize(value);
  if(!/^(?:eu\s+)?sou\b/u.test(text))return false;
  return !isWellFormedPortugueseOrigin(text);
};

const portugueseOriginSuggestion=(value,turn)=>{
  if(!isPortugueseOriginTurn(turn))return '';
  const text=normalize(value);
  const turnExample=normalize(turn?.example);

  // Speech-to-text often hears "da Alemanha" correctly but writes the sound
  // as fragments such as "dela Maia" or "dela manha". In the Germany lesson
  // context we ask for confirmation instead of accepting that broken spelling.
  const germanyContext=/\bsou\s+da\s+alemanha\b/u.test(turnExample);
  if(germanyContext&&/^(?:eu\s+)?sou\s+(?:(?:de\s+la)|dela|deia)\s+(?:maia|manha|lemanha|alemanha|alemania)$/u.test(text)){
    return 'Sou da Alemanha.';
  }

  const match=text.match(/^(?:eu\s+)?sou\s+(?:(?:de\s+la|dela|dele|deia|da|do|das|dos|de)\s+)?(.+)$/u);
  if(!match)return '';
  const place=match[1].trim();
  const suggestion=PORTUGUESE_ORIGINS.get(place)||'';
  if(!suggestion)return '';
  return normalize(suggestion)===text?'':suggestion;
};

const isPlausiblePortugueseFamilyCoordination=tail=>{
  const text=normalize(tail);
  if(!text)return false;
  // A second location: "e na Alemanha", "e em Portugal", etc.
  if(/^(?:em|na|no|nas|nos)\s+[\p{L}][\p{L}\s-]*$/u.test(text))return true;
  if(/^tambem\s+(?:em|na|no|nas|nos)\s+[\p{L}][\p{L}\s-]*$/u.test(text))return true;
  // A new clause: "e eu vivo...", "e a minha mãe mora...".
  if(/^(?:eu|ela|ele|nos|eles|elas|a\s+minha|minha|o\s+meu|meu|os\s+meus|meus|as\s+minhas|minhas)\b.*\b(?:vivo|vive|vivem|moro|mora|moram|sou|somos|e|sao|tenho|tem|gosto|gosta|gostam|trabalho|trabalha|estudo|estuda)\b/u.test(text))return true;
  // A coordinated predicate: "e é muito unida", "e gosta de viajar".
  if(/^(?:e|sao|tem|vive|vivem|mora|moram|gosta|gostam|trabalha|trabalham|estuda|estudam)\b/u.test(text))return true;
  return false;
};

const hasPortugueseFamilyStructureNoise=(value,turn)=>{
  if(!isPortugueseFamilyTurn(turn))return false;
  const text=normalize(value);
  if(!/\b(?:minha\s+familia|a\s+minha\s+familia)\b/u.test(text))return false;

  // Only apply this slot check to a clear residence construction. We do not
  // try to grammar-check every possible free family answer here.
  const residence=text.match(/\b(?:vive|vivem|mora|moram)\b\s+(.+)$/u);
  if(!residence)return false;
  const rest=residence[1].trim();
  if(!/^(?:em|na|no|nas|nos)\s+/u.test(rest))return false;

  const parts=rest.split(/\s+e\s+/u);
  if(parts.length<2)return false;
  const tail=parts.slice(1).join(' e ').trim();
  return !isPlausiblePortugueseFamilyCoordination(tail);
};

const portugueseFamilySuggestion=(value,turn)=>{
  if(!isPortugueseFamilyTurn(turn))return '';
  const text=normalize(value);
  const hasFamily=/\bminha\s+familia\b/u.test(text);
  const hasCroatia=/\bcroacia\b/u.test(text);
  const hasGermany=/\balemanha\b/u.test(text)
    || /\blemanha\b/u.test(text)
    || /\balemania\b/u.test(text)
    || /\bmala\s+mae\b/u.test(text)
    || /\bnada\s+mae\b/u.test(text)
    || /\bna\s+da\s+mae\b/u.test(text)
    || /\bnada\s+manha\b/u.test(text)
    || /\b(?:de\s+la|dela)\s+manha\b/u.test(text);
  if(hasFamily&&hasCroatia&&hasGermany){
    return 'A minha família vive na Croácia e na Alemanha.';
  }
  return '';
};

export function scoreSpeakingCandidate(value,turn,learningLanguage){
  const family=languageFamily(learningLanguage);
  const text=normalize(value);
  if(!text)return 0;

  if(family==='pt'&&isPortugueseFamilyTurn(turn)){
    if(hasPortugueseFamilyStructureNoise(text,turn))return 5;
    let score=30;
    if(/\bminha\s+familia\b/u.test(text))score+=20;
    if(/\b(?:vive|vivem|mora|moram|e|sao|tem|tenho|gosta|gostam)\b/u.test(text))score+=15;
    if(/\b(?:em|na|no|nas|nos)\s+[\p{L}]/u.test(text))score+=15;
    if(/\s+e\s+(?:em|na|no|nas|nos)\s+[\p{L}]/u.test(text))score+=15;
    return Math.min(100,score);
  }

  if(family==='pt'&&isPortugueseOriginTurn(turn)){
    return isWellFormedPortugueseOrigin(text)?90:25;
  }

  return 50;
}

export function getSpeakingRepairDecision(value,turn,learningLanguage){
  const family=languageFamily(learningLanguage);
  const source=String(value||'').trim();
  if(!source)return {mode:'accept',suggestion:''};

  if(family==='pt'){
    const originSuggestion=portugueseOriginSuggestion(source,turn);
    if(originSuggestion)return {mode:'confirm',suggestion:originSuggestion};

    const familySuggestion=portugueseFamilySuggestion(source,turn);
    if(familySuggestion&&normalize(familySuggestion)!==normalize(source))return {mode:'confirm',suggestion:familySuggestion};

    // Topic match is not enough: a family residence sentence must also have a
    // plausible second slot after "e" before it can be praised as correct.
    const suspicious=hasRepeatedNeighbour(source)
      || hasPortugueseOriginSpeechNoise(source,turn)
      || hasPortugueseFamilyStructureNoise(source,turn);
    if(suspicious)return {mode:'scaffold',suggestion:''};

    return {mode:'accept',suggestion:''};
  }

  if(family!=='hr')return {mode:'accept',suggestion:''};

  const suspicious=hasObviousCroatianGrammarIssue(source,learningLanguage)
    || hasRepeatedNeighbour(source)
    || hasFamilySubjectNoise(source,turn);
  if(!suspicious)return {mode:'accept',suggestion:''};

  const semanticSuggestion=familyLaughSuggestion(source,turn);
  if(semanticSuggestion)return {mode:'confirm',suggestion:semanticSuggestion};

  const generated=getRecommendedSpeakingSentence(source,learningLanguage);
  if(isSafeGeneratedRepair(source,generated,turn))return {mode:'confirm',suggestion:generated};

  return {mode:'scaffold',suggestion:''};
}
