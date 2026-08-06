import { getSentenceLevels as getLevelsWithMotivation } from './extended-motivational-sentence-pack.js?v=5';
import { auditAndRepairSentenceLevels } from './sentence-quality.js?v=2';

const TARGET_PER_LEVEL = 50;

function interleave(existingItems, addedItems) {
  if (!addedItems.length) return [...existingItems];
  const result = [];
  const interval = Math.max(1, Math.ceil(existingItems.length / addedItems.length));
  let addedIndex = 0;

  existingItems.forEach((item, index) => {
    result.push({ ...item });
    if ((index + 1) % interval === 0 && addedIndex < addedItems.length) {
      result.push({ ...addedItems[addedIndex] });
      addedIndex += 1;
    }
  });

  return [...result, ...addedItems.slice(addedIndex).map(item => ({ ...item }))];
}

function fillToTarget(items, source, target) {
  const base = items.map(item => ({ ...item }));
  const needed = Math.max(0, target - base.length);
  if (!needed || !source.length) return base.slice(0, target);

  const additions = Array.from({ length: needed }, (_, index) => {
    const sourceItem = source[index % source.length];
    return {
      ...sourceItem,
      instanceId: `${sourceItem.id || 'sentence'}-copy-${index + 1}`
    };
  });

  return interleave(base, additions).slice(0, target);
}

export function getSentenceLevels(learningLanguage, nativeLanguage) {
  const levels = getLevelsWithMotivation(learningLanguage, nativeLanguage);
  const motivation = levels.find(level => level.id === 'motivation');
  const visibleLevels = levels.filter(level => ['beginner', 'survivor', 'explorer'].includes(level.id));
  const motivationalItems = motivation?.items || [];

  const filledLevels = visibleLevels.map(level => ({
    ...level,
    items: fillToTarget(level.items || [], motivationalItems, TARGET_PER_LEVEL)
  }));

  return auditAndRepairSentenceLevels(filledLevels, learningLanguage, nativeLanguage);
}
