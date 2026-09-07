import { getMeetAdditions } from './meet.js';
import { getCafeAdditions } from './cafe.js';
import { getShoppingAdditions } from './shopping.js';
import { getDirectionsAdditions } from './directions.js';
import { getWorkAdditions } from './work.js';
import { getFeelingsAdditions } from './feelings.js';
import { getEverydayAdditions } from './everyday.js';

const GETTERS={meet:getMeetAdditions,cafe:getCafeAdditions,shopping:getShoppingAdditions,directions:getDirectionsAdditions,work:getWorkAdditions,feelings:getFeelingsAdditions,everyday:getEverydayAdditions};

export function getSpeakingAdditions(topicId,learning,native){
  return GETTERS[topicId]?.(learning,native)||[];
}

export const SPEAKING_ADDITIONS_PER_TOPIC=20;
export const SPEAKING_ADDITIONS_TOTAL=140;
