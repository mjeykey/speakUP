(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    let html = String(source || '');

    // Copy the simple phase mechanism used by the other learning modes:
    // start screen -> active exercise. No DOM helpers and no extra story files.
    const narrationState = 'const [initialNarrationDone, setInitialNarrationDone] = (0, react_10.useState)(!Boolean(settings.audioOn && settings.sentenceAudioOn));';
    const phaseState = `${narrationState}\n        const [storyPhase, setStoryPhase] = (0, react_10.useState)('start');`;

    if (!html.includes(narrationState)) {
      throw new Error('Story phase rewrite failed: narration state not found.');
    }
    html = html.replace(narrationState, phaseState);

    const translationAnchor = '        if (pageTranslationItem) {';
    if (!html.includes(translationAnchor)) {
      throw new Error('Story phase rewrite failed: translation anchor not found.');
    }

    const startScreen = `        if (storyPhase === 'start') {
            return (react_10.default.createElement("main", { className: "screen story-screen" },
                react_10.default.createElement("div", { className: "top-actions" },
                    react_10.default.createElement("button", { type: "button", onClick: leaveStory }, "Menu")),
                react_10.default.createElement("section", { className: "center story-center" },
                    react_10.default.createElement("div", { className: "story-title" }, story.title),
                    story.subtitle && react_10.default.createElement("div", { className: "story-subtitle" }, story.subtitle),
                    react_10.default.createElement("button", {
                        type: "button",
                        className: "pill-button story-start-button",
                        onClick: () => {
                            setStoryPhase('active');
                            window.setTimeout(() => playFullCurrentPage({ markInitialComplete: true }), 80);
                        }
                    }, "Start Story Mode"))));
        }
`;

    html = html.replace(translationAnchor, startScreen + translationAnchor);

    html = html.replace(
      '.story-active-card{',
      '.story-start-button{display:inline-flex;align-items:center;justify-content:center;margin:36px auto 0}.story-active-card{'
    );

    return html;
  };
})();
