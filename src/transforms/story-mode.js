(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    let html = String(source || '');

    if (html.includes('const [storyManuallyStarted, setStoryManuallyStarted]')) {
      return html;
    }

    const statePattern = /(const \[initialNarrationDone, setInitialNarrationDone\] = \(0, react_10\.useState\)\([^;]+;)/;
    if (!statePattern.test(html)) {
      throw new Error('Story start rewrite failed: narration state not found.');
    }

    html = html.replace(
      statePattern,
      `$1\n        const [storyManuallyStarted, setStoryManuallyStarted] = (0, react_10.useState)(false);`
    );

    const leavePattern = /(\n\s*function leaveStory\(\) \{\s*resetAllPlayback\(\);\s*onMenu\(\);\s*\})/;
    if (!leavePattern.test(html)) {
      throw new Error('Story start rewrite failed: leaveStory function not found.');
    }

    html = html.replace(
      leavePattern,
      `
        function startStoryMode() {
            if (storyManuallyStarted)
                return;
            setStoryManuallyStarted(true);
            window.setTimeout(() => {
                playFullCurrentPage({ markInitialComplete: true });
            }, 120);
        }
$1`
    );

    const renderPattern = /(\n\s*return \(react_10\.default\.createElement\("main", \{ className: "screen story-screen" \},\s*react_10\.default\.createElement\("div", \{ className: "top-actions" \},\s*react_10\.default\.createElement\("button", \{ type: "button", onClick: leaveStory \}, "Menu"),\s*react_10\.default\.createElement\("button", \{ type: "button", onClick: readCurrentPage \})/;

    if (!renderPattern.test(html)) {
      throw new Error('Story start rewrite failed: normal Story Mode render not found.');
    }

    html = html.replace(
      renderPattern,
      `
        if (!storyManuallyStarted) {
            return (react_10.default.createElement("main", { className: "screen story-screen" },
                react_10.default.createElement("div", { className: "top-actions" },
                    react_10.default.createElement("button", { type: "button", onClick: leaveStory }, "Menu")),
                react_10.default.createElement("section", { className: "center story-center" },
                    react_10.default.createElement("div", { className: "story-title" }, story.title),
                    story.subtitle && react_10.default.createElement("div", { className: "story-subtitle" }, story.subtitle),
                    react_10.default.createElement("div", { className: "story-active-card" },
                        react_10.default.createElement("div", { className: "story-prompt" }, "Ready when you are"),
                        react_10.default.createElement("button", {
                            type: "button",
                            className: "primary-button story-start-button",
                            onClick: startStoryMode
                        }, "Start Story Mode")))));
        }
$1`
    );

    return html;
  };
})();
