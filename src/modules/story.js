import { getMultilingualStory } from '../data/stories/multilingual-stories.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=54';
import { getSpeechLanguage, languageName } from '../data/language-content-extended.js?v=2';

const PHASES=['native','learning','gap','review'];
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const shuffle=items=>[...items].sort(()=>Math.random()-.5);

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
 const story=getMultilingualStory(state.selectedStory||'everyday',state.learningLanguage,state.nativeLanguage);
 const learningVoice=getSpeechLanguage(state.learningLanguage);
 const nativeVoice=getSpeechLanguage(state.nativeLanguage);
 let pageIndex=0,phaseIndex=0,solved=0,locked=false;
 const page=()=>story.pages[pageIndex];
 const leave=()=>{stopSpeech();store.setState({screen:'menu'});};

 function shell(content){
  const atStart=pageIndex===0&&phaseIndex===0;
  const atEnd=pageIndex===story.pages.length-1&&phaseIndex===PHASES.length-1;
  root.innerHTML=`<section class="screen story-screen">
   <button class="menu-button" data-menu>Menu</button>
   <button class="story-arrow story-arrow-left" data-prev ${atStart?'disabled':''}>←</button>
   <button class="story-arrow story-arrow-right" data-next ${atEnd?'disabled':''}>→</button>
   <div class="center story-view">
    <p class="kicker">Story Mode · ${escapeHtml(languageName(state.learningLanguage))}</p>
    <h1>${story.emoji} ${escapeHtml(story.title)}</h1>
    <p class="story-subtitle">${escapeHtml(story.subtitle)}</p>
    <p class="story-progress">Page ${pageIndex+1} / ${story.pages.length} · Step ${phaseIndex+1} / ${PHASES.length}</p>
    ${content}
   </div></section>`;
  root.querySelector('[data-menu]').onclick=leave;
  root.querySelector('[data-prev]').onclick=()=>navigate(-1);
  root.querySelector('[data-next]').onclick=()=>navigate(1);
 }

 async function renderPhase(){
  stopSpeech();
  const current=page();
  if(phaseIndex===0){
   shell(`<p class="story-phase-label">${escapeHtml(languageName(state.nativeLanguage))}</p><p class="story-copy">${escapeHtml(current.native)}</p>`);
   await speak(current.native,nativeVoice,{enabled:store.getState().audioOn,rate:.88});
  }else if(phaseIndex===1){
   shell(`<p class="story-phase-label">${escapeHtml(languageName(state.learningLanguage))}</p><p class="story-copy story-portuguese-copy">${escapeHtml(current.learning)}</p>`);
   await speak(current.learning,learningVoice,{enabled:store.getState().audioOn,rate:.62});
  }else if(phaseIndex===2){
   const item=current.items[solved];
   const options=shuffle(current.items.map(entry=>entry.answer));
   shell(`<p class="story-phase-label">Complete the story</p><p class="story-copy story-gap-copy">${gapHtml(current,solved)}</p>
    ${item?`<div class="story-word-options">${options.map(option=>`<button class="story-word-option" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`:'<p class="feedback">All learning words found.</p>'}`);
   root.querySelectorAll('[data-option]').forEach(button=>button.onclick=async()=>{
    if(locked)return;
    if(button.dataset.option.toLocaleLowerCase()===item.answer.toLocaleLowerCase()){
     locked=true;solved+=1;await speak(item.answer,learningVoice,{enabled:store.getState().audioOn,rate:.58});locked=false;renderPhase();
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
  if(direction>0){
   if(phaseIndex===2&&solved<page().items.length)return;
   if(phaseIndex<3){phaseIndex+=1;if(phaseIndex===2)solved=0;return renderPhase();}
   if(pageIndex<story.pages.length-1){pageIndex+=1;phaseIndex=0;solved=0;return renderPhase();}
  }else{
   if(phaseIndex>0){phaseIndex-=1;if(phaseIndex===2)solved=0;return renderPhase();}
   if(pageIndex>0){pageIndex-=1;phaseIndex=3;solved=0;return renderPhase();}
  }
 }
 renderPhase();
}
