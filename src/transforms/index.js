(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.applyAll = function applyAll(source) {
    let html = String(source || '');

    const orderedTransforms = [
      window.SpeakUPTransforms.improveStoryMode,
      window.SpeakUPTransforms.improveMemoryMode,
      window.SpeakUPTransforms.improveWordsMode,
      window.SpeakUPTransforms.improveFillGapMode,
      window.SpeakUPTransforms.skipFillGapTranslationScreen
    ];

    for (const transform of orderedTransforms) {
      if (typeof transform === 'function') {
        html = transform(html);
      }
    }

    return html;
  };
})();
