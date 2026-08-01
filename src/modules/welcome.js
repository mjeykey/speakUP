export function renderWelcome(root, store) {
  root.innerHTML = `<section class="screen welcome-screen">
    <div class="welcome-orbit welcome-orbit-one"></div>
    <div class="welcome-orbit welcome-orbit-two"></div>
    <div class="welcome-card">
      <p class="welcome-eyebrow">Learn gently. Speak bravely.</p>
      <div class="welcome-mark" aria-hidden="true">
        <span class="welcome-mark-ring"></span>
        <span class="welcome-mark-core">S</span>
      </div>
      <h1 class="welcome-title">SpeakUP</h1>
      <p class="welcome-tagline">Stories, words and little moments that help you grow into the language.</p>
      <div class="welcome-language-line" aria-label="English and European Portuguese">
        <span>English</span><i></i><span>Português</span>
      </div>
      <button class="welcome-start" data-start>
        <span>Start</span>
        <span class="welcome-start-arrow" aria-hidden="true">→</span>
      </button>
      <p class="welcome-note">European Portuguese · Made for calm, real learning</p>
    </div>
  </section>`;

  const startButton = root.querySelector('[data-start]');
  startButton.onclick = () => {
    startButton.classList.add('is-leaving');
    window.setTimeout(() => store.setState({ screen: 'menu' }), 280);
  };
}
