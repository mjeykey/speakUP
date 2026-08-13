import { getMultilingualStory } from '../data/stories/multilingual-stories.js?v=1';
import { fantasyStory } from '../data/stories/fantasy.js?v=1';
import { getFantasyTranslation } from '../data/stories/fantasy-translations.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=54';
import { getStorySfxSrc, playStorySfx, stopStorySfx } from '../audio/story-sfx.js?v=5';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';

const PHASES=['native','learning','gap','review'];
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const shuffle=items=>[...items].sort(()=>Math.random()-.5);
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function learningItems(text,nativeText){
 const clean=value=>String(value||'').replace(/[“”"'.,!?;:()—–]/g,' ').split(/\s+/).filter(word=>word.length>=4);
 const words=[...new Set(clean(text))].slice(0,3);
 const hints=clean(nativeText);
 while(words.length<3)words.push(clean(text)[words.length]||'story');
 return words.map((answer,index)=>({answer,hint:hints[index]||answer}));
}
function getStory(storyId,learningLanguage,nativeLanguage){
 if(storyId!=='fantasy-1')return getMultilingualStory(storyId,learningLanguage,nativeLanguage);
 return {
  id:fantasyStory.id,
  emoji:fantasyStory.emoji,
  title:fantasyStory.title,
  subtitle:fantasyStory.subtitle,
  pages:fantasyStory.pages.map((source,index)=>{
   const learning=getFantasyTranslation(source,index,learningLanguage);
   const native=getFantasyTranslation(source,index,nativeLanguage);
   return {learning,native,sound:source.sound,items:learningItems(learning,native)};
  })
 };
}

function gapHtml(page,solved){
 let html=escapeHtml(page.learning);
 page.items.forEach((item,index)=>{
  const replacement=index<solved?`<span class="story-gap-solved">${escapeHtml(item.answer)}</span>`:`<span class="story-gap-english">${escapeHtml(item.hint)}</span>`;
  html=html.replace(new RegExp(`\\b${item.answer.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),replacement);
 });
 return html;
}

export function renderStory(root,store){
 const state=store.getState();
 const storyId=state.selectedStory||'everyday';
 const progressKey=[storyId,state.learningLanguage,state.nativeLanguage].join('|');
 const story=getStory(storyId,state.learningLanguage,state.nativeLanguage);
 const learningVoice=getSpeechLanguage(state.learningLanguage);
 const nativeVoice=getSpeechLanguage(state.nativeLanguage);
 const saved=state.progress?.story?.[progressKey];
 let pageIndex=Math.min(Math.max(Number(saved?.pageIndex)||0,0),story.pages.length-1);
 let phaseIndex=Math.min(Math.max(Number(saved?.phaseIndex)||0,0),PHASES.length-1);
 let solved=Math.max(Number(saved?.solved)||0,0);
 let locked=false;
 const page=()=>story.pages[pageIndex];
 const leave=()=>{stopSpeech();stopStorySfx();store.setState({screen:'menu'});};
 const saveProgress=()=>store.updateProgress('story',progressKey,{storyId,learningLanguage:state.learningLanguage,nativeLanguage:state.nativeLanguage,pageIndex,phaseIndex,solved});

 function shell(content){
  const atStart=pageIndex===0&&phaseIndex===0;
  const atEnd=pageIndex===story.pages.length-1&&phaseIndex===PHASES.length-1;
  const currentSound=page().sound&&page().sound!=='none'?page().sound:'rain';
  const currentSrc=getStorySfxSrc(currentSound);
  const testControl=storyId==='fantasy-1'&&currentSrc?`<div style="margin:10px auto 16px;max-width:360px"><div style="font-size:.9rem;margin-bottom:6px">🔊 Mobile sound test</div><audio data-native-sfx-test controls playsinline preload="auto" style="width:100%" src="${currentSrc}"></audio><div data-native-sfx-status style="font-size:.8rem;margin-top:5px;opacity:.75">Tap the ▶ button in the audio bar.</div></div>`:'';
  root.innerHTML=`<section class="screen story-screen">
   <button class="menu-button" data-menu>Menu</button>
   <button class="story-arrow story-arrow-left" data-prev ${atStart?'disabled':''}>←</button>
   <button class="story-arrow story-arrow-right" data-next ${atEnd?'disabled':''}>→</button>
   <div class="center story-view">
    <p class="kicker">Story Mode · ${escapeHtml(languageName(state.learningLanguage))}</p>
    <h1>${story.emoji} ${escapeHtml(story.title)}</h1>
    <p class="story-subtitle">${escapeHtml(story.subtitle)}</p>
    <p class="story-progress">Page ${pageIndex+1} / ${story.pages.length} · Step ${phaseIndex+1} / ${PHASES.length}</p>
    ${testControl}
    ${content}
   </div></section>`;
  root.querySelector('[data-menu]').onclick=leave;
  root.querySelector('[data-prev]').onclick=()=>navigate(-1);
  root.querySelector('[data-next]').onclick=()=>navigate(1);
  const nativeTest=root.querySelector('[data-native-sfx-test]');
  const nativeStatus=root.querySelector('[data-native-sfx-status]');
  if(nativeTest){
   nativeTest.addEventListener('play',()=>{stopSpeech();if(nativeStatus)nativeStatus.textContent='✅ Native mobile player started';});
   nativeTest.addEventListener('error',()=>{if(nativeStatus)nativeStatus.textContent='❌ Audio file could not be loaded';});
   nativeTest.addEventListener('stalled',()=>{if(nativeStatus)nativeStatus.textContent='⚠️ Audio loading stalled';});
  }
 }

 async function renderPhase(){
  stopSpeech();
  stopStorySfx();
  const current=page();
  if(phaseIndex===0){
   shell(`<p class="story-phase-label">${escapeHtml(languageName(state.nativeLanguage))}</p><p class="story-copy">${escapeHtml(current.native)}</p>`);
   if(storyId==='fantasy-1'&&current.sound&&current.sound!=='none'&&store.getState().audioOn){
    const played=await playStorySfx(current.sound,{enabled:true});
    if(played)await wait(1200);
    stopStorySfx();
   }
   await speak(current.native,nativeVoice,{enabled:store.getState().audioOn,rate:.88});
  }else if(phaseIndex===1){
   shell(`<p class="story-phase-label">${escapeHtml(languageName(state.learningLanguage))}</p><p class="story-copy story-portuguese-copy">${escapeHtml(current.learning)}</p>`);
   await speak(current.learning,learningVoice,{enabled:store.getState().audioOn,rate:.62});
  }else if(phaseIndex===2){
   solved=Math.min(solved,current.items.length);
   const item=current.items[solved];
   const options=shuffle(current.items.map(entry=>entry.answer));
   shell(`<p class="story-phase-label">Complete the story</p><p class="story-copy story-gap-copy">${gapHtml(current,solved)}</p>
    ${item?`<div class="story-word-options">${options.map(option=>`<button class="story-word-option" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`:'<p class="feedback">All learning words found.</p>'}`);
   root.querySelectorAll('[data-option]').forEach(button=>button.onclick=async()=>{
    if(locked)return;
    if(button.dataset.option.toLocaleLowerCase()===item.answer.toLocaleLowerCase()){
     locked=true;
     solved+=1;
     saveProgress();
    }else{
     button.classList.add('is-wrong');setTimeout(()=>button.classList.remove('is-wrong'),420);
    }
   });
  }else{
   shell(`<p class="story-phase-label">Review</p><p class="story-copy story-portuguese-copy">${escapeHtml(current.learning)}</p><p class="story-copy translated">${escapeHtml(current.native)}</p>`);
   await speak(current.learning,learningVoice,{enabled:store.getState().audioOn,rate:.62});
  }
 }

 function navigate(direction){
  stopStorySfx();
  if(direction>0){
   if(phaseIndex===2&&solved<page().items.length)return;
   if(phaseIndex<3){phaseIndex+=1;if(phaseIndex===2)solved=0;return saveProgress();}
   if(pageIndex<story.pages.length-1){pageIndex+=1;phaseIndex=0;solved=0;return saveProgress();}
  }else{
   if(phaseIndex>0){phaseIndex-=1;if(phaseIndex===2)solved=0;return saveProgress();}
   if(pageIndex>0){pageIndex-=1;phaseIndex=3;solved=0;return saveProgress();}
  }
 }
 renderPhase();
}
