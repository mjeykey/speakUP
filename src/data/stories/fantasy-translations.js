import {
  getFantasyTranslation as getLegacyFantasyTranslation,
  hasFantasyLanguage as hasLegacyFantasyLanguage
} from './fantasy-translations-legacy.js?v=1';
import { getGermanFantasyTranslation } from './fantasy-german-extended.js?v=2';
import { getSpanishFantasyTranslation } from './fantasy-spanish-extended.js?v=2';
import { getFrenchFantasyTranslation } from './fantasy-french-extended.js?v=2';
import { getCroatianFantasyTranslation } from './fantasy-croatian-extended.js?v=2';
import { getItalianFantasyTranslation } from './fantasy-italian-extended.js?v=2';

const PORTUGUESE_OVERRIDES = new Map([
  [3, 'Atrás dele estava a maior carruagem real, construída para transportar setenta pessoas. O símbolo de evacuação estava pintado na lateral da carruagem, mas não havia condutor nem ordem para a utilizar.'],
  [10, 'Uma garra raspou lentamente ao longo da parede de metal. Ninguém falou. Kael manteve as duas mãos no volante e continuou a conduzir.']
]);

function extendedTranslation(index, language) {
  if (index < 14) return '';
  if (language === 'de-DE') return getGermanFantasyTranslation(index);
  if (language === 'es-ES' || language === 'es-AN') return getSpanishFantasyTranslation(index);
  if (language === 'fr-FR') return getFrenchFantasyTranslation(index);
  if (language === 'hr-HR' || language === 'hr-DAL') return getCroatianFantasyTranslation(index);
  if (language === 'it-IT') return getItalianFantasyTranslation(index);
  return '';
}

export function getFantasyTranslation(page, index, language) {
  const extended = extendedTranslation(index, language);
  if (extended) return extended;
  if (language === 'pt-PT' && PORTUGUESE_OVERRIDES.has(index)) {
    return PORTUGUESE_OVERRIDES.get(index);
  }
  return getLegacyFantasyTranslation(page, index, language);
}

export function hasFantasyLanguage(language) {
  return ['de-DE','es-ES','es-AN','fr-FR','hr-HR','hr-DAL','it-IT'].includes(language) || hasLegacyFantasyLanguage(language);
}
