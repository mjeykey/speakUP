import {
  getFantasyTranslation as getLegacyFantasyTranslation,
  hasFantasyLanguage as hasLegacyFantasyLanguage
} from './fantasy-translations-legacy.js?v=1';
import { getGermanFantasyTranslation } from './fantasy-german-extended.js?v=1';

const PORTUGUESE_OVERRIDES = new Map([
  [3, 'Atrás dele estava a maior carruagem real, construída para transportar setenta pessoas. O símbolo de evacuação estava pintado na lateral da carruagem, mas não havia condutor nem ordem para a utilizar.'],
  [10, 'Uma garra raspou lentamente ao longo da parede de metal. Ninguém falou. Kael manteve as duas mãos no volante e continuou a conduzir.']
]);

export function getFantasyTranslation(page, index, language) {
  if (language === 'de-DE' && index >= 14) {
    const german = getGermanFantasyTranslation(index);
    if (german) return german;
  }
  if (language === 'pt-PT' && PORTUGUESE_OVERRIDES.has(index)) {
    return PORTUGUESE_OVERRIDES.get(index);
  }
  return getLegacyFantasyTranslation(page, index, language);
}

export function hasFantasyLanguage(language) {
  return language === 'de-DE' || hasLegacyFantasyLanguage(language);
}
