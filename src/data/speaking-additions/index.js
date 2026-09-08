import { getMeetAdditions } from './meet.js';
import { getCafeAdditions } from './cafe.js';
import { getShoppingAdditions } from './shopping.js';
import { getDirectionsAdditions } from './directions.js';
import { getWorkAdditions } from './work.js';
import { getFeelingsAdditions } from './feelings.js';
import { getEverydayAdditions } from './everyday.js';

const GETTERS={meet:getMeetAdditions,cafe:getCafeAdditions,shopping:getShoppingAdditions,directions:getDirectionsAdditions,work:getWorkAdditions,feelings:getFeelingsAdditions,everyday:getEverydayAdditions};

const languageFamily=value=>{
  const code=String(value||'').toLowerCase();
  if(code.startsWith('de'))return 'de';
  if(code.startsWith('pt'))return 'pt';
  if(code.startsWith('es'))return 'es';
  if(code.startsWith('hr'))return 'hr';
  if(code.startsWith('fr'))return 'fr';
  return 'en';
};

const withExampleSignal=turn=>({
  ...turn,
  signals:[...(turn.signals||[]),turn.example].filter(Boolean)
});

export function getSpeakingAdditions(topicId,learning,native){
  const learningFamily=languageFamily(learning);
  const nativeFamily=languageFamily(native);
  return (GETTERS[topicId]?.(learningFamily,nativeFamily)||[]).map(withExampleSignal);
}

export const SPEAKING_ADDITIONS_PER_TOPIC=20;
export const SPEAKING_ADDITIONS_TOTAL=140;
