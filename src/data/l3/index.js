import { pickLearningText } from '../learning-languages.js?v=1';
import { L3_TOPICS } from './topics.js?v=1';
import { L3_PRACTICAL_TOPICS } from './practical-topics.js?v=1';
import { L3_SCIENCE_PACKS } from './science-packs.js?v=1';
import { L3_PRACTICAL_PACKS } from './practical-packs.js?v=1';

const PACKS = {
  ...L3_SCIENCE_PACKS,
  ...L3_PRACTICAL_PACKS
};

export const L3_TOPIC_GROUPS = [
  { id: 'world', title: 'World Knowledge', topics: L3_TOPICS },
  { id: 'practical', title: 'Practical Knowledge', topics: L3_PRACTICAL_TOPICS }
];

export function getL3Topic(topicId) {
  return L3_TOPIC_GROUPS.flatMap(group => group.topics).find(topic => topic.id === topicId)
    || L3_TOPICS[0];
}

export function getL3Cards(topicId, learningLanguage, supportLanguage) {
  const pack = PACKS[topicId] || PACKS.astronomy;
  return pack.map((item, index) => ({
    id: `${topicId}-${index + 1}`,
    term: pickLearningText(item.term, learningLanguage),
    termTranslation: pickLearningText(item.term, supportLanguage),
    fact: pickLearningText(item.fact, learningLanguage),
    factTranslation: pickLearningText(item.fact, supportLanguage),
    explanation: pickLearningText(item.explanation, learningLanguage),
    explanationTranslation: pickLearningText(item.explanation, supportLanguage)
  }));
}
