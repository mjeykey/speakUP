(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    let html = String(source || '');

    // Story Mode must always wait for an explicit learner action, exactly like
    // the other learning modes. Audio settings must not skip the start screen.
    const originalState = 'const [initialNarrationDone, setInitialNarrationDone] = (0, react_10.useState)(!Boolean(settings.audioOn && settings.sentenceAudioOn));';
    const manualState = 'const [initialNarrationDone, setInitialNarrationDone] = (0, react_10.useState)(false);';

    if (!html.includes(originalState)) {
      throw new Error('Story start rewrite failed: original narration state not found.');
    }
    html = html.replace(originalState, manualState);

    const optionsBlock = 'initialNarrationDone && !isStorySpeaking && !isResolvingAnswer && !isPageFinishing && !pageReadyToContinue && currentGap && (react_10.default.createElement("div", { className: "story-option-block" }, visibleOptions.map((option, optionIndex) => (react_10.default.createElement("button", { type: "button", key: `page-${currentPageIndex}-gap-${currentGapIndex}-option-${optionIndex}-${option}`, className: `choice story-choice ${wrongChoice === option ? \'story-choice-wrong\' : \'\'}`, onClick: () => choose(option), disabled: isResolvingAnswer }, option))))),';

    if (!html.includes(optionsBlock)) {
      throw new Error('Story start rewrite failed: Story option block not found.');
    }

    const startButtonAndOptions = `!initialNarrationDone && !isStorySpeaking && !isPageFinishing && (react_10.default.createElement("button", {
                        type: "button",
                        className: "primary-button story-start-button",
                        onClick: () => playFullCurrentPage({ markInitialComplete: true })
                    }, "Start Story Mode")),
                    ${optionsBlock}`;

    html = html.replace(optionsBlock, startButtonAndOptions);

    // Make the button visually unmistakable without depending on another file.
    html = html.replace(
      '.story-active-card{',
      '.story-start-button{display:inline-flex;align-items:center;justify-content:center;margin:22px auto 4px;padding:16px 34px;border-radius:999px;border:1px solid rgba(101,232,255,.75);background:rgba(101,232,255,.14);color:white;font-size:21px;font-style:italic;box-shadow:0 0 24px rgba(101,232,255,.16)}.story-active-card{'
    );

    return html;
  };
})();
