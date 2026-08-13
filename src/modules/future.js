const FUTURE_FEATURES = [
  ['🎭', 'Gesprächssimulation', 'Übe realistische Gespräche und setze gelernte Kommunikation direkt im Moment ein.'],
  ['💼', 'Bewerbungsgespräch', 'Übe unterschiedliche Recruiter, schwierige Nachfragen und realistische Bewerbungssituationen in der Lernsprache.'],
  ['🧑‍💼', 'Rollen', 'Übe Gespräche mit zum Beispiel Chef, Kunde, Recruiter, Date oder Meetingpartner. Das Gespräch reagiert auf deine Antworten.'],
  ['🗺️', 'Karte', 'Finde Sprachpartner, Treffen, Trainer und Veranstaltungen in deiner Nähe.'],
  ['👥', 'Gruppentraining', 'Übe gemeinsam mit anderen Lernenden.'],
  ['🎥', 'Gespräche mit Muttersprachlern', 'Übe die Sprache in echten Video-Gesprächen.'],
  ['🤝', 'Freunde & Lerngruppen', 'Lerne gemeinsam ohne Rankings oder Druck.'],
  ['🌍', 'Gemeinsame Challenges', 'Erreiche Sprachziele gemeinsam mit anderen.'],
  ['✨', 'Persönlicher Lernweg', 'SpeakUP passt Übungen an das an, was du brauchst und häufig nutzt.'],
  ['📝', 'Eigene Wörter', 'Speichere Wörter und Sätze aus deinem eigenen Leben.'],
  ['☁️', 'Synchronisierung', 'Setze deinen Fortschritt auf Handy, Tablet und Computer fort.'],
  ['📴', 'Offline', 'Lerne auch ohne Internetverbindung.'],
  ['⌚', 'Homescreen & Smartwatch', 'Nutze kleine Sprachmomente über den Tag.'],
  ['🎓', 'Sprachzertifikate', 'Zeige, was du in echten Situationen verstehen und anwenden kannst.'],
  ['ع', 'Weitere Sprachen', 'Arabisch, Bengali, Swahili und weitere Sprachen.']
];

export function renderFuture(root, store) {
  root.innerHTML = `<section class="screen future-screen">
    <button class="menu-button" data-back aria-label="Zurück">←</button>
    <div class="future-view">
      <p class="future-kicker">SpeakUP</p>
      <h1>Später</h1>
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
    </div>
  </section>`;

  root.querySelector('[data-back]').onclick = () => store.setState({ screen: 'menu' });
}
