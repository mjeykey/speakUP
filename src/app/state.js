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
  storyProgress: null
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
  'storyProgress'
]);

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([key]) => persistedKeys.has(key))
    );
  } catch (error) {
    console.warn('SpeakUP progress could not be loaded.', error);
    return {};
  }
}

function saveState(state) {
  try {
    const progress = Object.fromEntries(
      Object.entries(state).filter(([key]) => persistedKeys.has(key))
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
  let state = { ...initialState, ...loadSavedState(), ...seed };
  const listeners = new Set();

  return {
    getState: () => state,
    setState(patch) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      saveState(state);
      listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
