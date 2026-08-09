import { pickLearningText } from '../learning-languages.js?v=1';
import { L2_TOPICS } from './topics.js?v=1';
import { L2_COOKING } from './cooking.js?v=1';
import { L2_CAREER } from './career.js?v=1';
import { L2_CREATIVE } from './creative.js?v=1';
import { L2_LIFESTYLE } from './lifestyle.js?v=1';

const PACKS = {
  cooking: L2_COOKING,
  career: L2_CAREER,
  ...L2_CREATIVE,
  ...L2_LIFESTYLE
};

export { L2_TOPICS };

export function getL2Topic(topicId) {
  return L2_TOPICS.find(topic => topic.id === topicId) || L2_TOPICS[0];
}

export function getL2Cards(topicId, learningLanguage, supportLanguage) {
  const pack = PACKS[topicId] || PACKS.cooking;
  return pack.map((item, index) => ({
    id: `${topicId}-${index + 1}`,
    target: pickLearningText(item.term, learningLanguage),
    translation: pickLearningText(item.term, supportLanguage),
    info: pickLearningText(item.info, learningLanguage),
    infoTranslation: pickLearningText(item.info, supportLanguage)
  }));
}
