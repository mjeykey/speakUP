(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    let html = String(source || '');

    const narrationState = '        const [initialNarrationDone, setInitialNarrationDone] = (0, react_10.useState)(!Boolean(settings.audioOn && settings.sentenceAudioOn));';
    const manualStartState = `${narrationState}\n        const [storyManuallyStarted, setStoryManuallyStarted] = (0, react_10.useState)(false);`;

    if (!html.includes('storyManuallyStarted') && html.includes(narrationState)) {
      html = html.replace(narrationState, manualStartState);
    }

    const leaveStoryFunction = '        function leaveStory() {\n            resetAllPlayback();\n            onMenu();\n        }';
    const startAndLeaveFunctions = `        function startStoryMode() {
            if (storyManuallyStarted)
                return;
            setStoryManuallyStarted(true);
            window.setTimeout(() => {
                playFullCurrentPage({ markInitialComplete: true });
            }, 80);
        }
${leaveStoryFunction}`;

    if (!html.includes('function startStoryMode()') && html.includes(leaveStoryFunction)) {
      html = html.replace(leaveStoryFunction, startAndLeaveFunctions);
    }

    const normalStoryRender = '        return (react_10.default.createElement("main", { className: "screen story-screen" },\n            react_10.default.createElement("div", { className: "top-actions" },\n                react_10.default.createElement("button", { type: "button", onClick: leaveStory }, "Menu"),\n                react_10.default.createElement("button", { type: "button", onClick: readCurrentPage }';

    const newStartScreen = `        if (!storyManuallyStarted) {
            return (react_10.default.createElement("main", { className: "screen story-screen" },
                react_10.default.createElement("div", { className: "top-actions" },
                    react_10.default.createElement("button", { type: "button", onClick: leaveStory }, "Menu")),
                react_10.default.createElement("section", { className: "center story-center" },
                    react_10.default.createElement("div", { className: "story-title" }, story.title),
                    story.subtitle && react_10.default.createElement("div", { className: "story-subtitle" }, story.subtitle),
                    react_10.default.createElement("div", { className: "story-active-card" },
                        react_10.default.createElement("div", { className: "story-prompt" }, "Ready when you are"),
                        react_10.default.createElement("button", { type: "button", className: "primary-button story-start-button", onClick: startStoryMode }, "Start Story Mode")))));
        }
${normalStoryRender}`;

    if (!html.includes('"Ready when you are"') && html.includes(normalStoryRender)) {
      html = html.replace(normalStoryRender, newStartScreen);
    }

    return html;
  };
})();
