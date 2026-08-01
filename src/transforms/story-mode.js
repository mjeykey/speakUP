(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    let html = String(source || '');

    // Keep the original pre-start state intact so the learner still sees and
    // controls the Story Mode start button. Only the obsolete replay phase
    // after a completed bilingual page is disabled here.
    html = html.replace(
      /resetAllPlayback\(\);\s*setIsPageFinishing\(true\);\s*setLearningReplayCharIndex\(0\);\s*setPageReadyToContinue\(false\);/g,
      'resetAllPlayback();\n            setIsPageFinishing(false);\n            setLearningReplayCharIndex(currentPage.text.length);\n            setPageReadyToContinue(true);\n            return;'
    );

    return html;
  };
})();
