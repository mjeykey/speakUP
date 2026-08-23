import { getMultilingualStory } from '../data/stories/multilingual-stories.js?v=1';
import { fantasyStory } from '../data/stories/fantasy.js?v=3';
import { getFantasyTranslation } from '../data/stories/fantasy-translations.js?v=1';
import { narrateStory, stopStoryNarration } from '../audio/story-narration.js?v=3';
import { ensureStoryEffect, prepareStoryEffects, stopStoryEffects, transitionStoryEffects } from '../audio/story-effects.js?v=215';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';

const PHASES=['native','learning','gap','review'];
const CHURCH_BELL_PAGES=new Set([1]);
const DOOR_CREAK_PAGES=new Set([2]);
// Zero-based story pages where the characters are physically outside in the storm.
const OUTDOOR_RAIN_PAGES=new Set([2,3,4,11,27,28,32,38,41,52,53,54,55,56,57,58]);
const VERIFIED_DOOR_URL=new URL('../../assets/audio/freesound_community-heavy-metal-door-74594.mp3?v=205',import.meta.url).href;
let verifiedDoorAudio=null;
const DEBUG_BUILD='B214';
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const shuffle=items=>[...items].sort(()=>Math.random()-.5);

function playVerifiedDoor(){
  try{verifiedDoorAudio?.pause();}catch(_){}
  const audio=new Audio(VERIFIED_DOOR_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.volume=1;
  verifiedDoorAudio=audio;
  audio.onended=()=>{if(verifiedDoorAudio===audio)verifiedDoorAudio=null;};
  audio.onerror=()=>{if(verifiedDoorAudio===audio)verifiedDoorAudio=null;};
  void audio.play().catch(error=>console.warn('Verified door playback failed.',error));
}

function learningItems(text,nativeText){
  const clean=value=>String(value||'').replace(/[“”"'.,!?;:()—–]/g,' ').split(/\s+/).filter(word=>word.length>=4);
  const words=[...new Set(clean(text))].slice(0,3);
  const hints=clean(nativeText);
  while(words.length<3)words.push(clean(text)[words.length]||'story');
  return words.map((answer,index)=>({answer,hint:hints[index]||answer}));
}

function getStory(storyId,learningLanguage,nativeLanguage){
  if(storyId!=='fantasy-1')return getMultilingualStory(storyId,learningLanguage,nativeLanguage);
  return{
    id:fantasyStory.id,
    emoji:fantasyStory.emoji,
    title:fantasyStory.title,
    subtitle:fantasyStory.subtitle,
    pages:fantasyStory.pages.map((source,index)=>{
      const learning=getFantasyTranslation(source,index,learningLanguage);
      const native=getFantasyTranslation(source,index,nativeLanguage);
      const sound=CHURCH_BELL_PAGES.has(index)?'bell':DOOR_CREAK_PAGES.has(index)?'door-creak':source.sound;
      return{learning,native,sound,items:learningItems(learning,native)};
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
  let renderToken=0;

  const page=()=>story.pages[pageIndex];
  const displayPage=()=>pageIndex*PHASES.length+phaseIndex+1;
  const phaseAmbientSound=(sourcePage=pageIndex)=>OUTDOOR_RAIN_PAGES.has(sourcePage)?'rain':'none';
  const phaseSound=(sourcePage=pageIndex,sourcePhase=phaseIndex)=>{
    if(sourcePage===10)return sourcePhase<=2?'metal-scrape':'none';
    const sound=story.pages[sourcePage]?.sound||'none';
    return sound==='rain'?phaseAmbientSound(sourcePage):sound;
  };
  const persistProgress=()=>store.saveProgress('story',progressKey,{storyId,learningLanguage:state.learningLanguage,nativeLanguage:state.nativeLanguage,pageIndex,phaseIndex,solved});
  const isTokenCurrent=token=>()=>token===renderToken;
  const leave=()=>{
    renderToken+=1;
    stopStoryNarration();
    stopStoryEffects();
    store.setState({screen:'menu'});
  };

  function shell(content){
    const atStart=pageIndex===0&&phaseIndex===0;
    const atEnd=pageIndex===story.pages.length-1&&phaseIndex===PHASES.length-1;
    root.innerHTML=`<section class="screen story-screen"><button class="menu-button" data-menu>Menu</button><div class="center story-view"><p class="kicker">Story Mode · ${escapeHtml(languageName(state.learningLanguage))}</p><h1>${story.emoji} ${escapeHtml(story.title)}</h1><p class="story-subtitle">${escapeHtml(story.subtitle)}</p><p class="story-progress">Seite ${displayPage()}</p>${content}<nav class="story-page-nav" aria-label="Story navigation"><button class="story-nav-button" data-prev aria-label="Previous" ${atStart?'disabled':''}><span aria-hidden="true">◁</span></button><button class="story-nav-button story-nav-button-next" data-next aria-label="Next" ${atEnd?'disabled':''}><span aria-hidden="true">▷</span></button></nav></div></section>`;
    root.querySelector('[data-menu]').onclick=leave;
    root.querySelector('[data-prev]').onclick=()=>navigate(-1);
    root.querySelector('[data-next]').onclick=()=>navigate(1);
  }

  function syncEffect(current,audioEnabled,token){
    ensureStoryEffect({
      storyId,
      sound:phaseSound(),
      ambientSound:phaseAmbientSound(),
      phaseIndex,
      enabled:audioEnabled,
      isCurrent:()=>token===renderToken&&page()===current
    });
  }

  async function narrate(text,voice,audioEnabled,rate,token,current){
    await narrateStory({
      text,
      voice,
      enabled:audioEnabled,
      rate,
      sound:phaseSound(),
      isCurrent:isTokenCurrent(token)
    });
  }

  async function renderPhase(){
    locked=false;
    const token=++renderToken;
    const current=page();
    const audioEnabled=Boolean(store.getState().audioOn);
    syncEffect(current,audioEnabled,token);

    if(phaseIndex===0){
      shell(`<p class="story-phase-label">${escapeHtml(languageName(state.nativeLanguage))}</p><p class="story-copy">${escapeHtml(current.native)}</p>`);
      await narrate(current.native,nativeVoice,audioEnabled,.88,token,current);
    }else if(phaseIndex===1){
      shell(`<p class="story-phase-label">${escapeHtml(languageName(state.learningLanguage))}</p><p class="story-copy story-portuguese-copy">${escapeHtml(current.learning)}</p>`);
      await narrate(current.learning,learningVoice,audioEnabled,.62,token,current);
    }else if(phaseIndex===2){
      stopStoryNarration();
      solved=Math.min(solved,current.items.length);
      const item=current.items[solved];
      const options=shuffle(current.items.map(entry=>entry.answer));
      shell(`<p class="story-phase-label">Complete the story</p><p class="story-copy story-gap-copy">${gapHtml(current,solved)}</p>${item?`<div class="story-word-options">${options.map(option=>`<button class="story-word-option" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`:'<p class="feedback">All learning words found.</p>'}`);
      root.querySelectorAll('[data-option]').forEach(button=>button.onclick=()=>{
        if(locked||!item)return;
        if(button.dataset.option.toLocaleLowerCase()===item.answer.toLocaleLowerCase()){
          locked=true;
          solved+=1;
          persistProgress();
          void renderPhase();
        }else{
          button.classList.add('is-wrong');
          setTimeout(()=>button.classList.remove('is-wrong'),420);
        }
      });
    }else{
      shell(`<p class="story-phase-label">Review</p><p class="story-copy story-portuguese-copy">${escapeHtml(current.learning)}</p><p class="story-copy translated">${escapeHtml(current.native)}</p>`);
      await narrate(current.learning,learningVoice,audioEnabled,.62,token,current);
    }
  }

  function targetPosition(direction){
    if(direction>0){
      if(phaseIndex===2&&solved<page().items.length)return null;
      if(phaseIndex<PHASES.length-1)return{pageIndex,phaseIndex:phaseIndex+1};
      if(pageIndex<story.pages.length-1)return{pageIndex:pageIndex+1,phaseIndex:0};
      return null;
    }
    if(phaseIndex>0)return{pageIndex,phaseIndex:phaseIndex-1};
    if(pageIndex>0)return{pageIndex:pageIndex-1,phaseIndex:PHASES.length-1};
    return null;
  }

  function navigate(direction){
    const target=targetPosition(direction);
    if(!target)return;

    renderToken+=1;
    if(target.phaseIndex===2)stopStoryNarration();

    const currentSound=phaseSound(pageIndex,phaseIndex);
    const targetSound=phaseSound(target.pageIndex,target.phaseIndex);
    if(targetSound==='door-creak'&&Boolean(store.getState().audioOn)){
      stopStoryEffects();
      playVerifiedDoor();
    }else{
      transitionStoryEffects({
        storyId,
        enabled:Boolean(store.getState().audioOn),
        currentSound,
        targetSound,
        targetAmbientSound:phaseAmbientSound(target.pageIndex),
        sameSourcePage:target.pageIndex===pageIndex
      });
    }

    const pageChanged=target.pageIndex!==pageIndex;
    pageIndex=target.pageIndex;
    phaseIndex=target.phaseIndex;
    if(pageChanged||phaseIndex===2)solved=0;
    persistProgress();
    void renderPhase();
  }

  prepareStoryEffects(storyId);
  renderPhase();
}
