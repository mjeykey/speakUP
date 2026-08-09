const DEMO_ITEMS = [
  {
    icon: '🏃',
    title: 'Open community run',
    meta: 'Today · 18:30 · 1.2 km away',
    note: 'Free · all levels · casual pace'
  },
  {
    icon: '🥊',
    title: 'Outdoor boxing basics',
    meta: 'Saturday · 10:00 · 2.8 km away',
    note: 'First session free · equipment available'
  },
  {
    icon: '🏄',
    title: 'Sunset surf meetup',
    meta: 'Sunday · 17:30 · 7.4 km away',
    note: 'Community meetup · optional board rental'
  }
];

export function renderWhatsAroundYouTest(root, store) {
  root.innerHTML = `<section class="screen feature-lab around-you-screen">
    <button class="menu-button feature-back" data-back aria-label="Back">←</button>
    <div class="around-shell">
      <div class="around-progress-pill">TEST MODE · SPORT</div>
      <p class="around-eyebrow">You’ve been making real progress here.</p>
      <h1>What’s Around You</h1>
      <p class="around-lead">You seem to enjoy sport — and your language around it is getting strong. Thought you might like to know what’s happening nearby.</p>

      <div class="around-note">No challenge. No homework. No pressure. Just in case you feel like going.</div>

      <div class="around-grid">
        ${DEMO_ITEMS.map(item => `<article class="around-card">
          <div class="around-card-icon">${item.icon}</div>
          <div class="around-card-copy">
            <h2>${item.title}</h2>
            <p>${item.meta}</p>
            <small>${item.note}</small>
          </div>
          <button type="button" class="around-open" data-demo-open>See details</button>
        </article>`).join('')}
      </div>

      <div class="around-footer">
        <span>Demo data only</span>
        <button type="button" class="ghost-button" data-back-bottom>Not now</button>
      </div>
    </div>
  </section>`;

  root.querySelectorAll('[data-back], [data-back-bottom]').forEach(button => {
    button.onclick = () => store.setState({ screen: 'menu' });
  });

  root.querySelectorAll('[data-demo-open]').forEach(button => {
    button.onclick = () => {
      const old = button.textContent;
      button.textContent = 'Just a demo :)';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = old;
        button.disabled = false;
      }, 1400);
    };
  });
}
