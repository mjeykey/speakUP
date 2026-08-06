const KNOWN_TRANSLATION_FIXES = {
  'de-DE': {
    'Let us meet tomorrow.': 'Treffen wir uns morgen.',
    'I call my friend.': 'Ich rufe meine Freundin an.'
  },
  'en-GB': {
    'Lass uns morgen treffen.': 'Let us meet tomorrow.'
  }
};

function completeSentence(item) {
  let answerIndex = 0;
  return String(item?.sentence || '').replace(/_____/g, () => item?.answers?.[answerIndex++] || '');
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function auditAndRepairSentenceLevels(levels, learningLanguage, nativeLanguage) {
  const issues = [];
  const repaired = (Array.isArray(levels) ? levels : []).map(level => ({
    ...level,
    items: (Array.isArray(level.items) ? level.items : []).map((item, itemIndex) => {
      const complete = clean(completeSentence(item));
      let translation = clean(item.translation);
      const expectedGaps = (String(item.sentence || '').match(/_____/g) || []).length;
      const answerCount = Array.isArray(item.answers) ? item.answers.length : 0;

      if (!translation) {
        translation = complete;
        issues.push({ level: level.id, item: itemIndex + 1, type: 'missing translation', complete });
      }

      const corrected = KNOWN_TRANSLATION_FIXES[nativeLanguage]?.[translation];
      if (corrected) {
        issues.push({ level: level.id, item: itemIndex + 1, type: 'corrected translation', before: translation, after: corrected });
        translation = corrected;
      }

      if (expectedGaps !== answerCount) {
        issues.push({ level: level.id, item: itemIndex + 1, type: 'gap mismatch', expectedGaps, answerCount, complete });
      }

      if (!complete || complete.includes('_____')) {
        issues.push({ level: level.id, item: itemIndex + 1, type: 'incomplete learning sentence', complete });
      }

      return { ...item, translation };
    })
  }));

  if (issues.length) {
    console.groupCollapsed(`SpeakUP translation audit: ${learningLanguage} → ${nativeLanguage} (${issues.length} findings)`);
    console.table(issues);
    console.groupEnd();
  }

  return repaired;
}
