export function renderWelcome(root, store) {
  root.innerHTML = `<section class="screen welcome-screen">
    <div class="welcome-glow welcome-glow-cyan"></div>
    <div class="welcome-glow welcome-glow-pink"></div>
    <div class="welcome-content">
      <h1 class="welcome-title">SpeakUP</h1>
      <p class="welcome-tagline">Learn gently. Speak bravely.</p>
      <button class="welcome-start" data-start>Start</button>
    </div>
  </section>`;

  const startButton = root.querySelector('[data-start]');
  startButton.onclick = () => {
    startButton.classList.add('is-leaving');
    root.querySelector('.welcome-content')?.classList.add('is-leaving');
    window.setTimeout(() => store.setState({ screen: 'menu' }), 320);
  };
}
