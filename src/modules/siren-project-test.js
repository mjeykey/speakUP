const STORY_STAGES = [
  {
    title: 'THE BLACK ROCK',
    kicker: 'Kintyre, Scotland · 13 October 1811',
    body: `The sea should have been empty.<br><br>It wasn't.<br><br>John McIsaac saw the white shape before he saw the woman.`
  },
  {
    title: 'IT MOVED',
    kicker: 'A pale shape on black stone',
    body: `A head. Shoulders. Arms. Long hair.<br><br>Human.<br><br>Almost.<br><br>Below the waist, the body narrowed into something darker — mottled, wet, ending in a broad tail.`
  },
  {
    title: 'HE KEPT WATCHING',
    kicker: 'Not seconds. Not minutes.',
    body: `John did not run.<br><br>According to the testimony he later gave, he watched for nearly two hours as the tide pulled away from the rock.`
  },
  {
    title: 'THE GIRL',
    kicker: 'Elsewhere on the same coast',
    body: `Eight-year-old Catherine Loynachan saw something too.<br><br>She did not think it was a monster.<br><br>She thought a boy had fallen into the sea.`
  },
  {
    title: 'THE TESTIMONY',
    kicker: '29 October 1811',
    body: `Sixteen days later, John sat before Duncan Campbell, Sheriff-Substitute of Kintyre.<br><br>He swore an oath.<br><br>His words were written down.`
  },
  {
    title: 'THE DOCUMENTS SURVIVED',
    kicker: 'More than two centuries later',
    body: `John McIsaac was real.<br>Catherine Loynachan was real.<br>Duncan Campbell was real.<br><br>The testimony survived.`
  },
  {
    title: 'WHAT DID THEY SEE?',
    kicker: 'A sworn statement proves a statement was made — not that the witness understood what they saw.',
    body: `Seal?<br>Human?<br>Unknown marine animal?<br>Folklore?<br><br>There should be an ordinary explanation.<br><br>But the creature is gone.`
  },
  {
    title: 'WERE THEY THE ONLY ONES?',
    kicker: 'Kintyre was not the only place.',
    body: `Reay · 1809<br>Benbecula · c. 1830<br>Yell · 1833<br>Deerness · 1887–1899<br><br>Some stories were written down.<br>Others survived only in families.`
  }
];

function storyMarkup(stage, index) {
  return `<div class="siren-stage ${index >= 5 ? 'siren-stage-document' : ''}">
    <div class="siren-noise"></div>
    <div class="siren-lightning siren-lightning-a"></div>
    <div class="siren-lightning siren-lightning-b"></div>
    <div class="siren-horizon"></div>
    <div class="siren-wave siren-wave-a"></div>
    <div class="siren-wave siren-wave-b"></div>
    <div class="siren-story-copy">
      <p class="siren-kicker">${stage.kicker}</p>
      <h1>${stage.title}</h1>
      <div class="siren-body">${stage.body}</div>
      ${index === 5 ? `<div class="siren-document-card" aria-label="Historical document reveal">
        <div class="siren-doc-stamp">1811</div>
        <p>Deposition recorded before the Sheriff-Substitute of Kintyre</p>
        <span>Archive record survives</span>
      </div>` : ''}
    </div>
  </div>`;
}

function researchMarkup() {
  return `<div class="siren-research">
    <p class="research-secret">YOU FOUND SOMETHING MOST PEOPLE WILL NEVER SEE.</p>
    <div class="research-mark">🧜‍♀️</div>
    <h1>THE SIREN PROJECT</h1>
    <p class="research-intro">We are not here to prove mermaids exist. We are here to find out what people actually saw.</p>
    <div class="research-actions">
      <button type="button" class="research-primary" data-story-submit>I KNOW A STORY</button>
      <button type="button" class="research-secondary" data-evidence-submit>I FOUND EVIDENCE</button>
    </div>
    <div class="research-privacy">
      <p>Choose how a contribution may be used:</p>
      <label><input type="radio" name="privacy-demo" checked> Publish anonymously</label>
      <label><input type="radio" name="privacy-demo"> Research use only — do not publish</label>
      <label class="research-contact"><input type="checkbox"> The research team may contact me</label>
    </div>
    <p class="research-mantra">OBSERVE · PRESERVE · VERIFY · INVESTIGATE</p>
  </div>`;
}

export function renderSirenProjectTest(root, store) {
  let stageIndex = -1;
  root.innerHTML = `<section class="screen feature-lab siren-project-screen">
    <button class="menu-button feature-back siren-back" data-back aria-label="Back">←</button>
    <div class="siren-shell" data-siren-shell>
      <div class="siren-intro">
        <p class="siren-small">STORY MODE · HIDDEN TEST</p>
        <h1>The Black Rock</h1>
        <p>Headphones recommended.</p>
        <button type="button" class="siren-enter" data-enter>Enter the story</button>
      </div>
    </div>
  </section>`;

  const shell = root.querySelector('[data-siren-shell]');
  const back = root.querySelector('[data-back]');
  back.onclick = () => store.setState({ screen: 'menu' });

  const showStage = () => {
    if (stageIndex >= STORY_STAGES.length) {
      shell.innerHTML = researchMarkup();
      bindResearchButtons();
      return;
    }

    shell.innerHTML = `${storyMarkup(STORY_STAGES[stageIndex], stageIndex)}
      <div class="siren-controls">
        <span>${String(stageIndex + 1).padStart(2, '0')} / ${String(STORY_STAGES.length).padStart(2, '0')}</span>
        <button type="button" class="siren-next" data-next>${stageIndex === STORY_STAGES.length - 1 ? 'Open what comes next' : 'Continue'}</button>
      </div>`;

    requestAnimationFrame(() => shell.classList.add('siren-active'));
    shell.querySelector('[data-next]').onclick = () => {
      shell.classList.remove('siren-active');
      stageIndex += 1;
      setTimeout(showStage, 180);
    };
  };

  function bindResearchButtons() {
    shell.querySelectorAll('[data-story-submit], [data-evidence-submit]').forEach(button => {
      button.onclick = () => {
        const original = button.textContent;
        button.textContent = 'TEST MODE — FORM COMES NEXT';
        button.disabled = true;
        setTimeout(() => {
          button.textContent = original;
          button.disabled = false;
        }, 1600);
      };
    });
  }

  root.querySelector('[data-enter]').onclick = () => {
    stageIndex = 0;
    showStage();
  };
}
