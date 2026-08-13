import { speak, stopSpeech } from '../audio/speech.js?v=60';
import { getSpeechLanguage } from '../data/language-content-matrix.js?v=3';
import { getAnxietyPages } from '../data/anxiety-i18n.js?v=1';

export function renderAnxiety(root, store) {
  const state = store.getState();
  const key = `anxiety-world|${state.learningLanguage}|${state.nativeLanguage}`;
  const pages = getAnxietyPages(state.learningLanguage);
  const pageCount = pages.length;
  const saved = state.progress?.anxiety?.[key];
  let index = Math.max(0, Math.min(Number(saved?.currentIndex) || 0, pageCount - 1));

  function save(){
    store.saveProgress?.('anxiety', key, { currentIndex:index, total:pageCount });
  }

  function draw(){
    const page = pages[index];
    const whisper = page.whisper ? ' anxiety-whisper' : '';
    const speaker = page.speaker ? `<p class="anxiety-speaker${whisper}">${page.speaker}</p>` : '';
    const focus = page.focus ? ' anxiety-focus' : '';
    root.innerHTML = `<section class="anxiety-world-screen">
      <button class="anxiety-world-menu" data-menu>Menu</button>
      <div class="anxiety-world-progress">${index + 1} / ${pageCount}</div>
      <main class="anxiety-world-stage">
        ${speaker}
        <p class="anxiety-world-line${focus}${whisper}">${page.text}</p>
      </main>
      <div class="anxiety-world-controls">
        <button class="anxiety-world-arrow" data-prev aria-label="Previous" ${index===0?'disabled':''}>←</button>
        <button class="anxiety-world-listen" data-listen aria-label="Listen">🔊</button>
        <button class="anxiety-world-arrow" data-next aria-label="Next">→</button>
      </div>
    </section>`;

    root.querySelector('[data-menu]').onclick=()=>{ stopSpeech(); save(); store.setState({screen:'menu'}); };
    root.querySelector('[data-prev]').onclick=()=>{ stopSpeech(); index=Math.max(0,index-1); save(); draw(); };
    root.querySelector('[data-next]').onclick=()=>{ stopSpeech(); index=index>=pageCount-1?0:index+1; save(); draw(); };
    root.querySelector('[data-listen]').onclick=()=>speak(page.text,getSpeechLanguage(state.learningLanguage),{enabled:store.getState().audioOn,rate:page.whisper?.66:.78,pitch:page.whisper?.92:1}).catch(()=>{});
  }

  draw();
}
