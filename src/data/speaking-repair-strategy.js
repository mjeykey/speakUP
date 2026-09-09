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

const portugueseOriginSuggestion=(value,turn)=>{
  if(!isPortugueseOriginTurn(turn))return '';
  const text=normalize(value);
  const match=text.match(/^sou\s+(?:(?:de\s+la)|dela|dele|da|do|de)\s+(.+)$/u);
  if(!match)return '';
  const place=match[1].trim();
  const suggestion=PORTUGUESE_ORIGINS.get(place)||'';
  if(!suggestion)return '';
  return normalize(suggestion)===text?'':suggestion;
};

export function getSpeakingRepairDecision(value,turn,learningLanguage){
  const family=languageFamily(learningLanguage);
  const source=String(value||'').trim();
  if(!source)return {mode:'accept',suggestion:''};

  if(family==='pt'){
    const suggestion=portugueseOriginSuggestion(source,turn);
    if(suggestion)return {mode:'confirm',suggestion};
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
