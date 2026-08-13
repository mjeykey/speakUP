import { ANXIETY_WORLD_PAGES } from './anxiety-world.js?v=1';

// Anxiety keeps the English source as the canonical, fixed script.
// Translation packs are added here without rewriting or reordering the source story.
const PACKS = {
  'en-GB': ANXIETY_WORLD_PAGES
};

const ALIASES = {
  'es-AN': 'es-ES',
  'hr-DAL': 'hr-HR'
};

export function anxietyLanguageCode(code) {
  return ALIASES[code] || code || 'en-GB';
}

export function hasAnxietyTranslation(code) {
  return Boolean(PACKS[anxietyLanguageCode(code)]);
}

export function getAnxietyPages(code) {
  return PACKS[anxietyLanguageCode(code)] || PACKS['en-GB'];
}

export function getAnxietyTranslationCoverage() {
  return Object.keys(PACKS);
}
