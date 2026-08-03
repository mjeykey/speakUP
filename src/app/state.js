export const initialState = Object.freeze({
  screen: 'welcome',
  mode: 'story',
  learningLanguage: 'pt-PT',
  nativeLanguage: 'en-GB',
  selectedStory: null,
  audioOn: true,
  sentenceAudioOn: true,
  translationAudioOn: true,
  currentIndex: 0,
  progress: {
    story: {},
    words: {},
    memory: {},
    fillGap: {},
    speakPractice: {},
    emotions: {}
  }
});

const STORAGE_KEY = 'speakup-progress-v1';

const persistedKeys = new Set([
  'mode',
  'learningLanguage',
  'nativeLanguage',
  'selectedStory',
  'audioOn',
  'sentenceAudioOn',
  'translationAudioOn',
  'currentIndex',
  'progress'
]);

const emptyProgress = () => ({
  story: {},
  words: {},
  memory: {},
  fillGap: {},
  speakPractice: {},
  emotions: {}
});

function normalizeProgress(parsed) {
  const progress = { ...emptyProgress(), ...(parsed.progress || {}) };

  // Preserve progress saved by the first local-storage version.
  if (parsed.storyProgress && typeof parsed.storyProgress === 'object') {
    const old = parsed.storyProgress;
    const key = [old.storyId || 'everyday', old.learningLanguage || parsed.learningLanguage || 'pt-PT', old.nativeLanguage || parsed.nativeLanguage || 'en-GB'].join('|');
    if (!progress.story[key]) progress.story[key] = old;
  }

  if (Number.isFinite(Number(parsed.currentIndex)) && Number(parsed.currentIndex) > 0) {
    const key = [parsed.learningLanguage || 'pt-PT', parsed.nativeLanguage || 'en-GB'].join('|');
    if (!progress.words[key]) progress.words[key] = { currentIndex: Number(parsed.currentIndex) };
  }

  return progress;
}

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    const loaded = Object.fromEntries(
      Object.entries(parsed).filter(([key]) => persistedKeys.has(key))
    );
    loaded.progress = normalizeProgress(parsed);
    return loaded;
  } catch (error) {
    console.warn('SpeakUP progress could not be loaded.', error);
    return {};
  }
}

function saveState(state) {
  try {
    const saved = Object.fromEntries(
      Object.entries(state).filter(([key]) => persistedKeys.has(key))
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch (error) {
    console.warn('SpeakUP progress could not be saved.', error);
  }
}

export function clearSavedProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('SpeakUP progress could not be cleared.', error);
  }
}

export function createStore(seed = {}) {
  const saved = loadSavedState();
  let state = {
    ...initialState,
    ...saved,
    ...seed,
    progress: { ...emptyProgress(), ...(saved.progress || {}), ...(seed.progress || {}) }
  };
  const listeners = new Set();

  return {
    getState: () => state,
    setState(patch) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      saveState(state);
      listeners.forEach(listener => listener(state));
    },
    updateProgress(section, key, value) {
      const sectionProgress = { ...(state.progress?.[section] || {}) };
      if (value === null) delete sectionProgress[key];
      else sectionProgress[key] = value;
      state = {
        ...state,
        progress: { ...state.progress, [section]: sectionProgress }
      };
      saveState(state);
      listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
