const STORAGE_KEY = 'speakup:learning-progress:v1';

function readProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Learning still works when storage is unavailable.
  }
}

function wordKey(portuguese, english) {
  return `${String(portuguese).trim().toLowerCase()}::${String(english).trim().toLowerCase()}`;
}

export function recordWordExposure({ portuguese, english, source = 'unknown', storyId = null, pageIndex = null }) {
  const progress = readProgress();
  const key = wordKey(portuguese, english);
  const previous = progress[key] || {};
  progress[key] = {
    portuguese,
    english,
    exposures: Number(previous.exposures || 0) + 1,
    correct: Number(previous.correct || 0),
    wrong: Number(previous.wrong || 0),
    lastSeenAt: Date.now(),
    source,
    storyId,
    pageIndex
  };
  writeProgress(progress);
  return progress[key];
}

export function recordWordAnswer({ portuguese, english, correct, source = 'unknown', storyId = null, pageIndex = null }) {
  const progress = readProgress();
  const key = wordKey(portuguese, english);
  const previous = progress[key] || {};
  progress[key] = {
    portuguese,
    english,
    exposures: Number(previous.exposures || 0) + 1,
    correct: Number(previous.correct || 0) + (correct ? 1 : 0),
    wrong: Number(previous.wrong || 0) + (correct ? 0 : 1),
    lastSeenAt: Date.now(),
    source,
    storyId,
    pageIndex
  };
  writeProgress(progress);
  return progress[key];
}

export function getLearningWords({ limit = 30 } = {}) {
  return Object.values(readProgress())
    .sort((a, b) => Number(b.lastSeenAt || 0) - Number(a.lastSeenAt || 0))
    .slice(0, limit);
}
