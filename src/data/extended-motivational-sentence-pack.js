import { getSentenceLevels as getBaseLevels } from './motivational-sentence-pack.js?v=1';
import { EXTRA_MOTIVATIONAL_SENTENCES } from './motivational-sentences-extra.js?v=1';

const ALIASES = { 'es-AN': 'es-ES', 'hr-DAL': 'hr-HR' };

function sentencesFor(code) {
  return EXTRA_MOTIVATIONAL_SENTENCES[code]
    || EXTRA_MOTIVATIONAL_SENTENCES[ALIASES[code]]
    || EXTRA_MOTIVATIONAL_SENTENCES['en-GB'];
}

function splitAnswer(sentence) {
  const clean = sentence.replace(/[.!?]$/, '');
  const words = clean.split(' ');
  const answer = words.pop();
  return { sentence: `${words.join(' ')} _____.`, answer };
}

function buildItems(learningLanguage, nativeLanguage) {
  const learning = sentencesFor(learningLanguage);
  const support = sentencesFor(nativeLanguage);
  const answers = learning.map(item => splitAnswer(item).answer);

  return learning.map((complete, index) => {
    const gap = splitAnswer(complete);
    const options = [
      gap.answer,
      answers[(index + 3) % answers.length],
      answers[(index + 7) % answers.length],
      answers[(index + 11) % answers.length]
    ];

    return {
      sentence: gap.sentence,
      answers: [gap.answer],
      options: [...new Set(options)],
      translation: support[index] || complete,
      complete
    };
  });
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  return getBaseLevels(learningLanguage, nativeLanguage).map(level => {
    if (level.id !== 'motivation') return level;
    return {
      ...level,
      description: '40 positive learning sentences.',
      items: [...level.items, ...buildItems(learningLanguage, nativeLanguage)]
    };
  });
}
