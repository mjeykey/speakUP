export const initialState = Object.freeze({
  screen: 'menu',
  mode: 'story',
  learningLanguage: 'pt-PT',
  nativeLanguage: 'en-GB',
  selectedStory: null,
  audioOn: true,
  sentenceAudioOn: true,
  translationAudioOn: true,
  currentIndex: 0
});

export function createStore(seed = {}) {
  let state = { ...initialState, ...seed };
  const listeners = new Set();

  return {
    getState: () => state,
    setState(patch) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
