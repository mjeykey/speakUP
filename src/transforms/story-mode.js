(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    let html = String(source || '');

    const optionsBlock = '                    initialNarrationDone && !isStorySpeaking && !isResolvingAnswer && !isPageFinishing && !pageReadyToContinue && currentGap && (react_10.default.createElement("div", { className: "story-option-block" }, visibleOptions.map((option, optionIndex) => (react_10.default.createElement("button", { type: "button", key: `page-${currentPageIndex}-gap-${currentGapIndex}-option-${optionIndex}-${option}`, className: `choice story-choice ${wrongChoice === option ? \'story-choice-wrong\' : \'\'}`, onClick: () => choose(option), disabled: isResolvingAnswer }, option))))),';

    const startAndOptionsBlock = '                    !initialNarrationDone && !isStorySpeaking && !isPageFinishing && (react_10.default.createElement("button", { type: "button", className: "primary-button story-start-button", onClick: readCurrentPage }, "Start Story Mode")),\n' + optionsBlock;

    if (html.includes(optionsBlock)) {
      html = html.replace(optionsBlock, startAndOptionsBlock);
    }

    return html;
  };
})();
