function completeSentence(item) {
  let answerIndex = 0;
  return String(item?.sentence || '').replace(/_____/g, () => item?.answers?.[answerIndex++] || '');
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function auditAndRepairSentenceLevels(levels, learningLanguage, nativeLanguage) {
  const issues = [];
  const seenIds = new Map();

  const repaired = (Array.isArray(levels) ? levels : []).map(level => ({
    ...level,
    items: (Array.isArray(level.items) ? level.items : []).map((item, itemIndex) => {
      const complete = clean(completeSentence(item));
      const translation = clean(item.translation);
      const expectedGaps = (String(item.sentence || '').match(/_____/g) || []).length;
      const answerCount = Array.isArray(item.answers) ? item.answers.length : 0;
      const semanticId = item.translationId || item.id || `${level.id}-${itemIndex + 1}`;

      if (!translation) {
        issues.push({ level: level.id, item: itemIndex + 1, id: semanticId, type: 'missing translation', complete });
      }

      if (expectedGaps !== answerCount) {
        issues.push({ level: level.id, item: itemIndex + 1, id: semanticId, type: 'gap mismatch', expectedGaps, answerCount, complete });
      }

      if (!complete || complete.includes('_____')) {
        issues.push({ level: level.id, item: itemIndex + 1, id: semanticId, type: 'incomplete learning sentence', complete });
      }

      const previous = seenIds.get(semanticId);
      if (previous && previous.complete !== complete) {
        issues.push({
          level: level.id,
          item: itemIndex + 1,
          id: semanticId,
          type: 'semantic ID collision',
          first: previous.complete,
          second: complete
        });
      } else if (!previous) {
        seenIds.set(semanticId, { complete, translation });
      }

      // Never guess or replace a translation by array position. Data remains untouched.
      return { ...item, translation, translationId: semanticId };
    })
  }));

  if (issues.length) {
    console.groupCollapsed(`SpeakUP sentence audit: ${learningLanguage} → ${nativeLanguage} (${issues.length})`);
    console.table(issues);
    console.groupEnd();
  }

  return repaired;
}
