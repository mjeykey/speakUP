import {
  LANGUAGE_OPTIONS as BASE_OPTIONS,
  languageName as baseLanguageName,
  getSpeechLanguage as baseSpeechLanguage,
  getWords as baseGetWords,
  getSentenceLevels as baseGetSentenceLevels
} from './language-content.js?v=4';
import {
  FRENCH_OPTION,
  FRENCH_WORDS,
  FRENCH_COMPLETE,
  FRENCH_EXERCISES
} from './french-language.js?v=1';

export const LANGUAGE_OPTIONS = [...BASE_OPTIONS, FRENCH_OPTION];

const META = [
  { id:'beginner', title:'Beginner', emoji:'🌱', description:'One gap with full support.', englishClass:'' },
  { id:'survivor', title:'Survivor', emoji:'🔥', description:'Two gaps with full support.', englishClass:'' },
  { id:'explorer', title:'Explorer', emoji:'🧭', description:'Three gaps with softer support.', englishClass:'is-subtle' }
];

function fillAnswers(sentence, answers) {
  let index = 0;
  return String(sentence).replace(/_____/g, () => answers[index++] || '');
}

function completeSentencesFor(languageCode) {
  if (languageCode === 'fr-FR') return FRENCH_COMPLETE;
  const levels = baseGetSentenceLevels(languageCode, 'en-GB');
  return levels.flatMap(level => level.items.map(item => fillAnswers(item.sentence, item.answers)));
}

export function languageName(code) {
  return code === 'fr-FR' ? FRENCH_OPTION.short : baseLanguageName(code);
}

export function getSpeechLanguage(code) {
  return code === 'fr-FR' ? 'fr-FR' : baseSpeechLanguage(code);
}

export function getWords(learningLanguage, nativeLanguage) {
  if (learningLanguage === 'fr-FR') {
    const support = nativeLanguage === 'fr-FR'
      ? FRENCH_WORDS
      : baseGetWords(nativeLanguage, 'en-GB').map(item => item.target);
    return FRENCH_WORDS.map((target, index) => ({ target, translation: support[index] || '' }));
  }

  if (nativeLanguage === 'fr-FR') {
    const target = baseGetWords(learningLanguage, 'en-GB');
    return target.map((item, index) => ({ target: item.target, translation: FRENCH_WORDS[index] || '' }));
  }

  return baseGetWords(learningLanguage, nativeLanguage);
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  if (learningLanguage === 'fr-FR') {
    const supportSentences = completeSentencesFor(nativeLanguage);
    return META.map((meta, levelIndex) => ({
      ...meta,
      items: FRENCH_EXERCISES.slice(levelIndex * 5, levelIndex * 5 + 5).map((row, itemIndex) => ({
        sentence: row[0],
        answers: row[1],
        options: row[2],
        translation: supportSentences[levelIndex * 5 + itemIndex] || ''
      }))
    }));
  }

  const levels = baseGetSentenceLevels(learningLanguage, nativeLanguage === 'fr-FR' ? 'en-GB' : nativeLanguage);
  if (nativeLanguage !== 'fr-FR') return levels;

  let absolute = 0;
  return levels.map(level => ({
    ...level,
    items: level.items.map(item => ({
      ...item,
      translation: FRENCH_COMPLETE[absolute++] || item.translation
    }))
  }));
}
