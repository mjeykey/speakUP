import {
  LANGUAGE_OPTIONS as BASE_OPTIONS,
  languageName as baseLanguageName,
  getSpeechLanguage as baseGetSpeechLanguage,
  getWords as baseGetWords,
  getSentenceLevels as baseGetSentenceLevels
} from './language-content-extended.js?v=3';
import { ITALIAN_WORDS } from './italian/words.js?v=2';
import { ITALIAN_COMPLETE, ITALIAN_EXERCISES } from './italian/sentences.js?v=1';

// Italian content is intentionally parked for a future complete rollout.
// It remains available internally, but it is not exposed as a selectable language
// until every SpeakUP area has full Italian coverage.
export const ITALIAN_OPTION = { code:'it-IT', label:'🇮🇹 Italiano — standard', short:'Italiano' };
export const LANGUAGE_OPTIONS = [...BASE_OPTIONS];

const META = [
  { id:'beginner', title:'Beginner', emoji:'🌱', description:'One gap with full support.', englishClass:'' },
  { id:'survivor', title:'Survivor', emoji:'🔥', description:'Two gaps with full support.', englishClass:'' },
  { id:'explorer', title:'Explorer', emoji:'🧭', description:'Three gaps with softer support.', englishClass:'is-subtle' }
];

function fillAnswers(sentence, answers) {
  let index = 0;
  return String(sentence).replace(/_____/g, () => answers[index++] || '');
}

function completeSentencesFor(code) {
  if (code === 'it-IT') return ITALIAN_COMPLETE;
  const levels = baseGetSentenceLevels(code, 'en-GB');
  return levels.flatMap(level => level.items.map(item => fillAnswers(item.sentence, item.answers)));
}

export function languageName(code) {
  return code === 'it-IT' ? 'Italiano' : baseLanguageName(code);
}

export function getSpeechLanguage(code) {
  return code === 'it-IT' ? 'it-IT' : baseGetSpeechLanguage(code);
}

export function getWords(learningLanguage, nativeLanguage) {
  if (learningLanguage === 'it-IT') {
    const supportWords = nativeLanguage === 'it-IT'
      ? ITALIAN_WORDS
      : baseGetWords(nativeLanguage, 'en-GB').map(item => item.target);
    return ITALIAN_WORDS.map((target, index) => ({ target, translation: supportWords[index] || '' }));
  }

  if (nativeLanguage === 'it-IT') {
    const targetWords = baseGetWords(learningLanguage, 'en-GB');
    return targetWords.map((item, index) => ({ target:item.target, translation:ITALIAN_WORDS[index] || '' }));
  }

  return baseGetWords(learningLanguage, nativeLanguage);
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  if (learningLanguage === 'it-IT') {
    const supportSentences = completeSentencesFor(nativeLanguage);
    return META.map((meta, levelIndex) => ({
      ...meta,
      items: ITALIAN_EXERCISES.slice(levelIndex * 5, levelIndex * 5 + 5).map((row, itemIndex) => ({
        id:`italian-${meta.id}-${itemIndex + 1}`,
        sentence:row[0],
        answers:row[1],
        options:row[2],
        translation:supportSentences[levelIndex * 5 + itemIndex] || ''
      }))
    }));
  }

  const levels = baseGetSentenceLevels(learningLanguage, nativeLanguage === 'it-IT' ? 'en-GB' : nativeLanguage);
  if (nativeLanguage !== 'it-IT') return levels;

  let absolute = 0;
  return levels.map(level => ({
    ...level,
    items: level.items.map(item => ({
      ...item,
      translation:ITALIAN_COMPLETE[absolute++] || item.translation
    }))
  }));
}
