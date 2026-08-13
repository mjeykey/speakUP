const FUTURE_FEATURES = [
  ['🎭', 'Real-Life Role Simulator', 'Step into realistic conversations and practise using strong communication in the moment — not only recognising it afterwards.'],
  ['💼', 'Job Interview Simulator', 'Face different recruiter personalities, difficult follow-up questions, confidence tests and realistic interview pressure in the language you are learning.'],
  ['🧑‍💼', 'Conversation Roles', 'Practise with roles such as a demanding recruiter, difficult boss, unhappy customer, salary negotiator, date, new friend or meeting partner. The conversation changes with your answers.'],
  ['🗺️', 'SpeakUP Map', 'Find language partners, meetups, trainers and events near you.'],
  ['👥', 'Online Group Training', 'Join calm, guided practice sessions with other learners.'],
  ['🎥', 'Native Speaker Calls', 'Practice naturally in live video conversations.'],
  ['🤝', 'Friends & Learning Groups', 'Learn together without rankings or pressure.'],
  ['🌍', 'Community Challenges', 'Take part in shared language goals at your own pace.'],
  ['✨', 'Personal AI Learning Path', 'SpeakUP adapts future practice to what feels easy, difficult or useful to you.'],
  ['📝', 'Personal Word Collections', 'Save words and phrases that matter in your own life.'],
  ['☁️', 'Device Sync', 'Continue your progress across phone, tablet and computer.'],
  ['📴', 'Offline Mode', 'Keep learning even without an internet connection.'],
  ['⌚', 'Homescreen & Smartwatch', 'Use tiny language moments throughout the day.'],
  ['🎓', 'Language Certificates', 'Show what you can use and understand in real situations.'],
  ['ع', 'More Languages', 'Arabic, Bengali, Swahili and more will join SpeakUP.']
];

export function renderFuture(root, store) {
  root.innerHTML = `<section class="screen future-screen">
    <button class="menu-button" data-back aria-label="Back">←</button>
    <div class="future-view">
      <p class="future-kicker">✦ Future SpeakUP</p>
      <h1>What comes next</h1>
      <p class="future-intro">SpeakUP keeps growing. These are some of the experiences planned for the future.</p>
      <div class="future-grid">
        ${FUTURE_FEATURES.map(([icon, title, description]) => `
          <article class="future-card">
            <span class="future-icon" aria-hidden="true">${icon}</span>
            <div>
              <h2>${title}</h2>
              <p>${description}</p>
            </div>
          </article>`).join('')}
      </div>
      <p class="future-note">Built step by step, without turning learning into pressure.</p>
    </div>
  </section>`;

  root.querySelector('[data-back]').onclick = () => store.setState({ screen: 'menu' });
}
