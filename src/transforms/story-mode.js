(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    // Preserve the original Story Mode start screen and start button exactly.
    // Story audio refinements are handled by the dedicated story helper files
    // after the learner starts the story.
    return String(source || '');
  };
})();
