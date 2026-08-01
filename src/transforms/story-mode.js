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

    // Replace the SpeakUP Map coming-soon card with the Story play button.
    const mapCard = `mode === 'story' && (react_2.default.createElement("section", { className: "coming-soon-card" },
                    react_2.default.createElement("strong", null, "\\uD83C\\uDF0D SpeakUP Map \\u2014 Coming Soon"),
                    react_2.default.createElement("span", null, "Meet nearby learners with opt-in visibility, approximate location and privacy first.")))`;

    const storyPlayButton = `mode === 'story' && storyCategory && (react_2.default.createElement("button", {
                    className: "pill-button story-menu-play-button",
                    onClick: onBegin
                }, "Play Story"))`;

    if (!html.includes(mapCard)) {
      throw new Error('Story menu rewrite failed: SpeakUP Map card not found.');
    }
    html = html.replace(mapCard, storyPlayButton);

    // Keep the normal Start button for the other learning modes only.
    const originalStartButton = 'react_2.default.createElement("button", { className: "pill-button", onClick: onBegin }, "Start")';
    const nonStoryStartButton = `mode !== 'story' && react_2.default.createElement("button", {
                    className: "pill-button",
                    onClick: onBegin
                }, "Start")`;

    if (!html.includes(originalStartButton)) {
      throw new Error('Story menu rewrite failed: normal Start button not found.');
    }
    html = html.replace(originalStartButton, nonStoryStartButton);

    html = html.replace(
      '.story-category-grid{',
      '.story-menu-play-button{display:flex;align-items:center;justify-content:center;width:min(360px,100%);margin:26px auto 0;padding:17px 34px}.story-category-grid{'
    );

    return html;
  };
})();
