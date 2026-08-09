const LANGUAGE_ALIASES = {
  'es-AN': 'es-ES',
  'hr-DAL': 'hr-HR'
};

export function learningBaseLanguage(code) {
  return LANGUAGE_ALIASES[code] || code || 'en-GB';
}

export function pickLearningText(values, code) {
  const resolved = learningBaseLanguage(code);
  return values?.[resolved] || values?.['en-GB'] || Object.values(values || {})[0] || '';
}

export function multilingual(de, en, pt, es, fr, hr) {
  return {
    'de-DE': de,
    'en-GB': en,
    'pt-PT': pt,
    'es-ES': es,
    'fr-FR': fr,
    'hr-HR': hr
  };
}
