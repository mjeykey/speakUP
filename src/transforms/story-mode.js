(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    let html = String(source || '');

    // The revised story flow owns narration and page timing. Disable the old
    // automatic narration state so the same block is not spoken twice.
    html = html.replace(
      /\(0, react_10\.useState\)\(!Boolean\(settings\.audioOn && settings\.sentenceAudioOn\)\)/g,
      '(0, react_10.useState)(true)'
    );

    html = html.replace(
      /setInitialNarrationDone\(!Boolean\(settings\.audioOn && settings\.sentenceAudioOn\)\);/g,
      'setInitialNarrationDone(true);'
    );

    // After the revised bilingual sequence finishes, keep the page ready for
    // the learner instead of launching the obsolete duplicate replay phase.
    html = html.replace(
      /resetAllPlayback\(\);\s*setIsPageFinishing\(true\);\s*setLearningReplayCharIndex\(0\);\s*setPageReadyToContinue\(false\);/g,
      'resetAllPlayback();\n            setIsPageFinishing(false);\n            setLearningReplayCharIndex(currentPage.text.length);\n            setPageReadyToContinue(true);\n            return;'
    );

    return html;
  };
})();
