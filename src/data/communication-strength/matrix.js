import { ENGLISH_STRONG } from './english.js?v=1';
import { GERMAN_STRONG } from './german.js?v=1';
import { PORTUGUESE_STRONG } from './portuguese.js?v=1';
import { SPANISH_STRONG } from './spanish.js?v=1';
import { FRENCH_STRONG } from './french.js?v=1';
import { CROATIAN_STRONG } from './croatian.js?v=1';
import { ITALIAN_STRONG } from './italian.js?v=1';

const PACKS = {
  'en-GB': ENGLISH_STRONG,
  'de-DE': GERMAN_STRONG,
  'pt-PT': PORTUGUESE_STRONG,
  'es-ES': SPANISH_STRONG,
  'fr-FR': FRENCH_STRONG,
  'hr-HR': CROATIAN_STRONG,
  'it-IT': ITALIAN_STRONG
};

export function getCommunicationStrengthMatrix(learningLanguage, nativeLanguage) {
  const target = PACKS[learningLanguage] || ENGLISH_STRONG;
  const support = PACKS[nativeLanguage] || ENGLISH_STRONG;
  const count = Math.min(target.length, support.length);
  return target.slice(0, count).map((pair, index) => ({
    weak: pair[0],
    strong: pair[1],
    weakTranslation: support[index][0],
    strongTranslation: support[index][1]
  }));
}
