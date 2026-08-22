import { getMultilingualStory } from '../data/stories/multilingual-stories.js?v=1';
import { fantasyStory } from '../data/stories/fantasy.js?v=3';
import { getFantasyTranslation } from '../data/stories/fantasy-translations.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=63';
import { getStorySfxStatus, isStorySfxPlaying, preloadStorySfx, playStorySfx, setStorySfxVolume, stopStorySfx } from '../audio/story-sfx-clean.js?v=6';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';

const PHASES=['native','learning','gap','review'];
const CHURCH_BELL_PAGES=new Set([1]);
const DOOR_CREAK_PAGES=new Set([2]);
const BELL_HEADSTART_MS=1800;
const DOOR_CREAK_HEADSTART_MS=1100;
const BELL_NORMAL_VOLUME=0.90;
const BELL_LEARNING_VOLUME=0.68;
const DOOR_CREAK_VOLUME=0.80;
const DEBUG_BUILD='B172';
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const shuffle=items=>[...items].sort(()=>Math.random()-.5);
const sleep=ms=>new Promise(resolve=>window.setTimeout(resolve,ms));

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

function bellStatusText(){
  const status=getStorySfxStatus();
  const detail=status.detail?` · ${status.detail}`:'';
  return `${status.state}${detail}`;
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
  const saveProgress=()=>store.updateProgress('story',progressKey,{storyId,learningLanguage:state.learningLanguage,nativeLanguage:state.nativeLanguage,pageIndex,phaseIndex,solved});
  const bellVolumeForPhase=()=>phaseIndex===1||phaseIndex===3?BELL_LEARNING_VOLUME:BELL_NORMAL_VOLUME;

  const stopNarrator=()=>stopSpeech();
  const stopAmbience=()=>stopStorySfx();
  const stopAll=()=>{stopNarrator();stopAmbience();};
  const leave=()=>{renderToken+=1;stopAll();store.setState({screen:'menu'});};

  function refreshBellStatus(){
    const el=root.querySelector('[data-bell-status]');
    if(el)el.textContent=bellStatusText();
  }

  function shell(content){
    const atStart=pageIndex===0&&phaseIndex===0;
    const atEnd=pageIndex===story.pages.length-1&&phaseIndex===PHASES.length-1;
    const current=page();
    const debugButton=current.sound==='bell'
      ? `<button type="button" data-bell-test style="display:block;margin-top:7px;width:100%;border:1px solid rgba(255,255,255,.45);background:#24364a;color:white;border-radius:8px;padding:7px 8px;font-weight:700">🔔 TEST</button>`
      : '';
    const debugBadge='';
    root.innerHTML=`${debugBadge}<section class="screen story-screen"><button class="menu-button" data-menu>Menu</button><div class="center story-view"><p class="kicker">Story Mode · ${escapeHtml(languageName(state.learningLanguage))}</p><h1>${story.emoji} ${escapeHtml(story.title)}</h1><p class="story-subtitle">${escapeHtml(story.subtitle)}</p><p class="story-progress">Seite ${displayPage()}</p>${content}<nav class="story-page-nav" aria-label="Story navigation"><button class="story-nav-button" data-prev aria-label="Previous" ${atStart?'disabled':''}><span aria-hidden="true">◁</span></button><button class="story-nav-button story-nav-button-next" data-next aria-label="Next" ${atEnd?'disabled':''}><span aria-hidden="true">▷</span></button></nav></div></section>`;
    root.querySelector('[data-menu]').onclick=leave;
    root.querySelector('[data-prev]').onclick=()=>navigate(-1);
    root.querySelector('[data-next]').onclick=()=>navigate(1);
    const bellButton=root.querySelector('[data-bell-test]');
    if(bellButton){
      bellButton.onclick=async()=>{
        stopNarrator();
        await playStorySfx('bell',{enabled:true,loop:false,volume:BELL_NORMAL_VOLUME});
        refreshBellStatus();
      };
      window.addEventListener('speakup-bell-status',refreshBellStatus,{once:true});
    }
  }

  function ensureAmbience(current,audioEnabled,token){
    if(storyId!=='fantasy-1'||!audioEnabled||!current.sound||current.sound==='none')return;
    if(current.sound==='bell')setStorySfxVolume('bell',bellVolumeForPhase());
    if(current.sound==='door-creak'&&phaseIndex!==0)return;
    if(isStorySfxPlaying(current.sound))return;
    const start=()=>{
      if(token!==renderToken)return;
      const live=page();
      if(live!==current||isStorySfxPlaying(current.sound))return;
      const volume=current.sound==='rain'?0.40:current.sound==='bell'?bellVolumeForPhase():current.sound==='door-creak'?DOOR_CREAK_VOLUME:0.30;
      void playStorySfx(current.sound,{enabled:true,loop:current.sound==='rain',volume});
    };
    if(current.sound==='rain'||current.sound==='bell'){
      start();
      return;
    }
    void preloadStorySfx(current.sound).then(ok=>{if(ok)start();});
  }

  async function narrate(text,voice,audioEnabled,rate,token,current){
    if(token!==renderToken)return;
    if(audioEnabled&&current?.sound==='bell'){
      await sleep(BELL_HEADSTART_MS);
      if(token!==renderToken)return;
    }
    if(audioEnabled&&current?.sound==='door-creak'&&phaseIndex===0){
      await sleep(DOOR_CREAK_HEADSTART_MS);
      if(token!==renderToken)return;
    }
    await speak(text,voice,{enabled:audioEnabled,rate});
  }

  async function renderPhase(){
    const token=++renderToken;
    const current=page();
    const audioEnabled=Boolean(store.getState().audioOn);
    if(current.sound==='bell')setStorySfxVolume('bell',bellVolumeForPhase());
    if(phaseIndex===0){
      ensureAmbience(current,audioEnabled,token);
      shell(`<p class="story-phase-label">${escapeHtml(languageName(state.nativeLanguage))}</p><p class="story-copy">${escapeHtml(current.native)}</p>`);
      await narrate(current.native,nativeVoice,audioEnabled,.88,token,current);
    }else if(phaseIndex===1){
      ensureAmbience(current,audioEnabled,token);
      shell(`<p class="story-phase-label">${escapeHtml(languageName(state.learningLanguage))}</p><p class="story-copy story-portuguese-copy">${escapeHtml(current.learning)}</p>`);
      await narrate(current.learning,learningVoice,audioEnabled,.62,token,current);
    }else if(phaseIndex===2){
      if(current.sound!=='rain'&&current.sound!=='bell'&&current.sound!=='door-creak')stopAmbience();
      ensureAmbience(current,audioEnabled,token);
      solved=Math.min(solved,current.items.length);
      const item=current.items[solved];
      const options=shuffle(current.items.map(entry=>entry.answer));
      shell(`<p class="story-phase-label">Complete the story</p><p class="story-copy story-gap-copy">${gapHtml(current,solved)}</p>${item?`<div class="story-word-options">${options.map(option=>`<button class="story-word-option" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`:'<p class="feedback">All learning words found.</p>'}`);
      root.querySelectorAll('[data-option]').forEach(button=>button.onclick=()=>{
        if(locked)return;
        if(button.dataset.option.toLocaleLowerCase()===item.answer.toLocaleLowerCase()){
          locked=true;
          solved+=1;
          saveProgress();
        }else{
          button.classList.add('is-wrong');
          setTimeout(()=>button.classList.remove('is-wrong'),420);
        }
      });
    }else{
      if(current.sound!=='rain'&&current.sound!=='bell'&&current.sound!=='door-creak')stopAmbience();
      ensureAmbience(current,audioEnabled,token);
      shell(`<p class="story-phase-label">Review</p><p class="story-copy story-portuguese-copy">${escapeHtml(current.learning)}</p><p class="story-copy translated">${escapeHtml(current.native)}</p>`);
      await narrate(current.learning,learningVoice,audioEnabled,.62,token,current);
    }
  }

  function startSoundForCurrentPage(){
    if(storyId!=='fantasy-1'||!Boolean(store.getState().audioOn))return;
    const current=page();
    if(current.sound==='bell'){
      void playStorySfx('bell',{enabled:true,loop:false,volume:bellVolumeForPhase()});
      return;
    }
    if(current.sound==='door-creak'&&phaseIndex===0){
      void playStorySfx('door-creak',{enabled:true,loop:false,volume:DOOR_CREAK_VOLUME});
    }
  }

  function navigate(direction){
    renderToken+=1;
    stopNarrator();
    const currentSound=page().sound;
    const keepAmbience=currentSound==='rain'||currentSound==='bell'||currentSound==='door-creak';
    if(direction>0){
      if(phaseIndex===2&&solved<page().items.length){if(!keepAmbience)stopAmbience();return;}
      if(phaseIndex<3){if(!keepAmbience)stopAmbience();phaseIndex+=1;if(phaseIndex===2)solved=0;return saveProgress();}
      if(pageIndex<story.pages.length-1){stopAmbience();pageIndex+=1;phaseIndex=0;solved=0;startSoundForCurrentPage();return saveProgress();}
    }else{
      if(phaseIndex>0){if(!keepAmbience)stopAmbience();phaseIndex-=1;if(phaseIndex===2)solved=0;return saveProgress();}
      if(pageIndex>0){stopAmbience();pageIndex-=1;phaseIndex=3;solved=0;startSoundForCurrentPage();return saveProgress();}
    }
  }

  if(storyId==='fantasy-1'){
    void preloadStorySfx('bell');
    void preloadStorySfx('door-creak');
  }
  renderPhase();
}
