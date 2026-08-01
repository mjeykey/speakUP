(() => {
  'use strict';

  const START_ID = 'speakup-story-start-button';
  let storyStarted = false;

  function isStoryScreen() {
    return Boolean(document.querySelector('main.story-screen .story-active-card'));
  }

  function getReadButton() {
    const buttons = [...document.querySelectorAll('main.story-screen .top-actions button')];
    return buttons.find(button => /read full block|stop audio/i.test(button.textContent || '')) || null;
  }

  function removeStartButton() {
    document.getElementById(START_ID)?.remove();
  }

  function installStartButton() {
    if (!isStoryScreen()) {
      storyStarted = false;
      removeStartButton();
      return;
    }

    if (storyStarted || document.getElementById(START_ID)) return;

    const card = document.querySelector('main.story-screen .story-active-card');
    const optionBlock = card?.querySelector('.story-option-block');
    const prompt = card?.querySelector('.story-prompt');
    const readButton = getReadButton();

    if (!card || !readButton) return;

    if (optionBlock) optionBlock.style.display = 'none';
    if (prompt) prompt.textContent = 'Ready when you are';

    const button = document.createElement('button');
    button.id = START_ID;
    button.type = 'button';
    button.className = 'primary-button story-start-button';
    button.textContent = 'Start Story Mode';
    button.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'justify-content:center',
      'margin:20px auto 4px',
      'padding:15px 30px',
      'border-radius:999px',
      'border:1px solid rgba(101,232,255,.72)',
      'background:rgba(101,232,255,.14)',
      'color:white',
      'font-size:20px',
      'font-style:italic',
      'cursor:pointer'
    ].join(';');

    button.addEventListener('click', () => {
      storyStarted = true;
      removeStartButton();
      if (optionBlock) optionBlock.style.display = '';
      readButton.click();
    }, { once: true });

    card.appendChild(button);
  }

  const observer = new MutationObserver(installStartButton);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('popstate', installStartButton);
  window.addEventListener('hashchange', installStartButton);
  document.addEventListener('DOMContentLoaded', installStartButton);
  window.setInterval(installStartButton, 500);
})();