import { FANTASY_DE } from './fantasy-de.js?v=338';
import { FANTASY_ES } from './fantasy-es.js?v=338';
import { FANTASY_FR } from './fantasy-fr.js?v=338';
import { FANTASY_HR } from './fantasy-hr.js?v=338';

const TRANSLATIONS = Object.freeze({
  'de-DE': FANTASY_DE,
  'es-ES': FANTASY_ES,
  'fr-FR': FANTASY_FR,
  'hr-HR': FANTASY_HR
});

const BASE = Object.freeze({ 'es-AN':'es-ES', 'hr-DAL':'hr-HR' });

export function getFantasyTranslation(page, index, language) {
  if (language === 'pt-PT') return page.portuguese;
  if (language === 'en-GB') return page.english;
  const code = BASE[language] || language;
  return TRANSLATIONS[code]?.[index] || page.english;
}

export function hasFantasyLanguage(language) {
  const code = BASE[language] || language;
  return language === 'pt-PT' || language === 'en-GB' || Boolean(TRANSLATIONS[code]);
}

export const FANTASY_TRANSLATIONS = TRANSLATIONS;
