import { beginnerSentences } from './beginner.js?v=1';
import { survivorSentences } from './survivor.js?v=1';
import { explorerSentences } from './explorer.js?v=1';

export const SENTENCE_LEVELS = [
  { id: 'beginner', title: 'Beginner', emoji: '🟢', description: '1 gap · full English support', englishClass: '', items: beginnerSentences },
  { id: 'survivor', title: 'Survivor', emoji: '🟡', description: '2 gaps · full English support', englishClass: '', items: survivorSentences },
  { id: 'explorer', title: 'Explorer', emoji: '🔵', description: '3 gaps · softer English support', englishClass: 'is-soft', items: explorerSentences }
];

export function getSentenceLevel(id) {
  return SENTENCE_LEVELS.find(level => level.id === id) || SENTENCE_LEVELS[0];
}
