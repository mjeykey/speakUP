(() => {
  'use strict';

  window.SpeakUPTransforms = window.SpeakUPTransforms || {};

  window.SpeakUPTransforms.improveStoryMode = function improveStoryMode(source) {
    let html = String(source || '');

    // No story is selected when the menu opens.
    html = html.replace(
      "const [storyCategory, setStoryCategory] = (0, react_11.useState)('everyday');",
      "const [storyCategory, setStoryCategory] = (0, react_11.useState)(null);"
    );

    // The normal menu Start button is reused as the Story play button.
    // It is hidden only while Story Mode has no selected story.
    const originalStartButton = 'react_2.default.createElement("button", { className: "pill-button", onClick: onBegin }, "Start")';
    const conditionalStartButton = `(mode !== 'story' || storyCategory) && react_2.default.createElement("button", {
                    className: "pill-button story-menu-play-button",
                    onClick: onBegin
                }, mode === 'story' ? "Play Story" : "Start")`;

    if (!html.includes(originalStartButton)) {
      throw new Error('Story menu rewrite failed: menu Start button not found.');
    }
    html = html.replace(originalStartButton, conditionalStartButton);

    // Keep the selected story visibly highlighted and place the play button below the cards.
    html = html.replace(
      '.story-category-grid{',
      '.story-menu-play-button{display:flex;align-items:center;justify-content:center;margin:28px auto 0;min-width:190px}.story-category-grid{'
    );

    return html;
  };
})();
