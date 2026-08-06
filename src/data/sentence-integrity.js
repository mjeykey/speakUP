function placeholderCount(sentence) {
  return (String(sentence || '').match(/_____/g) || []).length;
}

function sanitizeItem(item, levelId, itemIndex) {
  const sentence = String(item?.sentence || '').trim();
  const translation = String(item?.translation || '').trim();
  const answers = Array.isArray(item?.answers)
    ? item.answers.map(value => String(value).trim()).filter(Boolean)
    : [];
  const options = Array.isArray(item?.options)
    ? item.options.map(value => String(value).trim()).filter(Boolean)
    : [];
  const gaps = placeholderCount(sentence);

  if (!sentence || !translation || gaps !== answers.length) {
    console.warn('SpeakUP sentence data issue', {
      levelId,
      itemIndex,
      sentence,
      translation,
      gaps,
      answers
    });
  }

  return {
    ...item,
    sentence,
    translation,
    answers,
    options: [...new Set([...answers, ...options])]
  };
}

export function repairSentenceLevels(levels) {
  return (Array.isArray(levels) ? levels : []).map(level => ({
    ...level,
    items: (Array.isArray(level.items) ? level.items : []).map((item, itemIndex) =>
      sanitizeItem(item, level.id, itemIndex)
    )
  }));
}
