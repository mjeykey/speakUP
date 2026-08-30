import { getMultilingualStory } from '../data/stories/multilingual-stories.js?v=1';
import { fantasyStory } from '../data/stories/fantasy.js?v=3';
import { getFantasyTranslation } from '../data/stories/fantasy-translations.js?v=1';
import { narrateStory, stopStoryNarration } from '../audio/story-narration.js?v=290';
import { ensureStoryEffect, prepareStoryEffects, stopStoryEffects, syncStoryLocationAmbience, transitionStoryEffects } from '../audio/story-effects.js?v=270';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';
import { getStorySfxSrc } from '../audio/story-sfx.js?v=268';

const PHASES=['native','learning','gap','review'];
const CHURCH_BELL_PAGES=new Set([1]);
const DOOR_CREAK_PAGES=new Set([2]);
// Zero-based source pages where the characters are actually outside and exposed to the storm.
// Rain is deliberately off in the stables, inside the wagon, inside the watchtower,
// and beyond the mountain gate.
const OUTDOOR_RAIN_PAGES=new Set([2,26,27,28,29,30,31,40,45,46,51,52,53,54,55,56,57]);

// Repeated places get the same low background atmosphere. Event sounds still play separately.
// The opening stable keeps its existing rain/bell/door design untouched.
const LOCATION_AMBIENCE_RANGES=[
  {from:9,to:17,sound:'water',volume:.10},        // flooded city around the wagon
  {from:19,to:25,sound:'water',volume:.14},       // broken bridge / black river
  {from:26,to:31,sound:'soft-wind',volume:.10},   // abandoned square / exposed mountain edge
  {from:33,to:36,sound:'soft-wind',volume:.08},   // mountain road, heard softly from inside wagon
  {from:37,to:50,sound:'soft-wind',volume:.10},   // watchtower area
  {from:51,to:58,sound:'storm-wind',volume:.12},  // outside at watchtower during attack
  {from:59,to:64,sound:'storm-wind',volume:.10},  // final mountain road / summit gate
  {from:65,to:67,sound:'dawn-wind',volume:.10}    // safe side of gate into dawn
];

const RAIN_URL=new URL('../../assets/audio/rain-natural-mobile.mp3?v=269',import.meta.url).href;
const RAIN_VOLUME=.28;
const WOOD_CREAK_SOURCE_PAGE=40;
const WOOD_CREAK_URL=new URL('../../assets/audio/wood-creak-161-164-core.mp3?v=289',import.meta.url).href;
const WOOD_CREAK_VOLUME=1;
const FIGHT_CROWD_SOURCE_PAGE=47;
const FIGHT_CROWD_URL=getStorySfxSrc('crowd');
const FIGHT_CROWD_VOLUME=.48;
const FIGHT_CROWD_RATE=.65;
const VERIFIED_DOOR_URL=new URL('../../assets/audio/freesound_community-heavy-metal-door-74594.mp3?v=205',import.meta.url).href;
let verifiedDoorAudio=null;
let storyRainAudio=null;
let storyWoodCreakAudio=null;
let storyFightCrowdAudio=null;
const DEBUG_BUILD='B270';
const escapeHtml=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const shuffle=items=>[...items].sort(()=>Math.random()-.5);

function getStoryRainAudio(){
  if(storyRainAudio)return storyRainAudio;
  const audio=new Audio(RAIN_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=true;
  audio.muted=false;
  audio.volume=RAIN_VOLUME;
  audio.onerror=()=>console.warn('Story rain media error.');
  storyRainAudio=audio;
  return audio;
}

function stopStoryRain(){
  const audio=storyRainAudio;
  if(!audio)return;
  try{audio.pause();}catch(_){}
  try{audio.currentTime=0;}catch(_){}
}

function ensureStoryRain(enabled=true){
  const audio=getStoryRainAudio();
  if(!enabled){
    stopStoryRain();
    return;
  }
  audio.muted=false;
  audio.loop=true;
  audio.volume=RAIN_VOLUME;
  if(!audio.paused&&!audio.ended)return;
  try{audio.currentTime=0;}catch(_){}
  void Promise.resolve(audio.play()).catch(error=>{
    console.warn('Story rain playback failed.',error);
  });
}

function getStoryWoodCreakAudio(){
  if(storyWoodCreakAudio)return storyWoodCreakAudio;
  const audio=new Audio(WOOD_CREAK_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.muted=false;
  audio.volume=WOOD_CREAK_VOLUME;
  audio.onerror=()=>console.warn('Wagon wood-creak media error.');
  storyWoodCreakAudio=audio;
  return audio;
}

function stopStoryWoodCreak(){
  const audio=storyWoodCreakAudio;
  if(!audio)return;
  try{audio.pause();}catch(_){}
  try{audio.currentTime=0;}catch(_){}
}

function playStoryWoodCreakOnce(){
  const audio=getStoryWoodCreakAudio();
  stopStoryWoodCreak();
  audio.muted=false;
  audio.loop=false;
  audio.volume=WOOD_CREAK_VOLUME;
  try{audio.currentTime=0;}catch(_){}
  void Promise.resolve(audio.play()).catch(error=>{
    console.warn('Wagon wood-creak playback failed.',error);
  });
}

function getStoryFightCrowdAudio(){
  if(storyFightCrowdAudio)return storyFightCrowdAudio;
  const audio=new Audio(FIGHT_CROWD_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.muted=false;
  audio.volume=FIGHT_CROWD_VOLUME;
  audio.playbackRate=FIGHT_CROWD_RATE;
  audio.onerror=()=>console.warn('Fight crowd cue failed to load.');
  storyFightCrowdAudio=audio;
  return audio;
}

function stopStoryFightCrowd(){
  const audio=storyFightCrowdAudio;
  if(!audio)return;
  try{audio.pause();}catch(_){}
  try{audio.currentTime=0;}catch(_){}
}

function primeStoryFightCrowd(){
  const audio=getStoryFightCrowdAudio();
  if(!audio.paused&&!audio.ended)return;
  audio.muted=false;
  audio.loop=false;
  audio.volume=0;
  audio.playbackRate=FIGHT_CROWD_RATE;
  try{audio.currentTime=0;}catch(_){}
  void Promise.resolve(audio.play()).then(()=>{
    try{audio.pause();audio.currentTime=0;}catch(_){}
    audio.volume=FIGHT_CROWD_VOLUME;
  }).catch(()=>{});
}

function playStoryFightCrowdOnce(){
  const audio=getStoryFightCrowdAudio();
  stopStoryFightCrowd();
  audio.muted=false;
  audio.loop=false;
  audio.volume=FIGHT_CROWD_VOLUME;
  audio.playbackRate=FIGHT_CROWD_RATE;
  try{audio.currentTime=0;}catch(_){}
  return Promise.resolve(audio.play()).catch(error=>{
    console.warn('Fight crowd cue playback failed.',error);
    return false;
  });
}

const FIGHT_CROWD_TERMS=[
  'while passengers shouted',
  'enquanto os passageiros gritavam',
  'während die passagiere schrien',
  'während die fahrgäste schrien',
  'mientras los pasajeros gritaban',
  'pendant que les passagers criaient',
  'mentre i passeggeri gridavano',
  'dok su putnici vikali'
];

function splitFightCrowdText(text){
  const value=String(text||'').replace(/\s+/g,' ').trim();
  const lower=value.toLocaleLowerCase();
  for(const term of FIGHT_CROWD_TERMS){
    const index=lower.indexOf(term);
    if(index>0){
      return{
        before:value.slice(0,index).trim(),
        after:value.slice(index).trim()
      };
    }
  }
  return null;
}

const WOOD_CREAK_TERMS=[
  'wagon','carruagem','wagen','carruaje','carrozza','voiture','carrosse',
  'vagn','karoca','колесниц','вагон','馬車','马车'
];

function woodCreakMarker(text){
  const value=String(text||'');
  const lower=value.toLocaleLowerCase();
  const indexes=WOOD_CREAK_TERMS.map(term=>lower.indexOf(term)).filter(index=>index>=0);
  if(indexes.length)return Math.min(...indexes);
  const sentenceEnd=value.search(/[.!?]/);
  return sentenceEnd>0?Math.max(0,sentenceEnd-8):Math.floor(value.length*.42);
}

function woodCreakFallbackDelay(text,rate){
  const marker=woodCreakMarker(text);
  const words=String(text||'').slice(0,marker).trim().split(/\s+/).filter(Boolean).length;
  const wordsPerSecond=2.45*Math.max(.55,Number(rate)||.82);
  return Math.max(1200,Math.min(6500,Math.round((words/wordsPerSecond)*1000)));
}

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

  // Create the rain element once while the story is being initialized.
  // It is kept for the whole app session and only paused/resumed between scenes.
  if(storyId==='fantasy-1'){getStoryRainAudio();getStoryWoodCreakAudio();}

  const page=()=>story.pages[pageIndex];
  const displayPage=()=>pageIndex*PHASES.length+phaseIndex+1;
  const rainAllowed=(sourcePage=pageIndex)=>storyId==='fantasy-1'&&OUTDOOR_RAIN_PAGES.has(sourcePage);
  const syncRain=(sourcePage=pageIndex,audioEnabled=Boolean(store.getState().audioOn))=>ensureStoryRain(Boolean(audioEnabled&&rainAllowed(sourcePage)));
  const locationAmbience=(sourcePage=pageIndex)=>LOCATION_AMBIENCE_RANGES.find(range=>sourcePage>=range.from&&sourcePage<=range.to)||null;
  const syncLocationAmbience=(sourcePage=pageIndex,audioEnabled=Boolean(store.getState().audioOn))=>{
    const ambience=storyId==='fantasy-1'?locationAmbience(sourcePage):null;
    syncStoryLocationAmbience(ambience?.sound||'none',{enabled:Boolean(audioEnabled&&ambience),volume:ambience?.volume??.10});
  };
  const phaseSound=(sourcePage=pageIndex,sourcePhase=phaseIndex)=>{
    if(sourcePage===10)return sourcePhase<=2?'metal-scrape':'none';
    if(sourcePage===11)return'lightning-strike';
    if(sourcePage===18)return'none';
    if(sourcePage===19)return'none';
    if(sourcePage===22)return'none';
    const sound=story.pages[sourcePage]?.sound||'none';
    return sound==='rain'?'none':sound;
  };
  const persistProgress=()=>store.saveProgress('story',progressKey,{storyId,learningLanguage:state.learningLanguage,nativeLanguage:state.nativeLanguage,pageIndex,phaseIndex,solved});
  const isTokenCurrent=token=>()=>token===renderToken;
  const leave=()=>{
    renderToken+=1;
    stopStoryRain();
    stopStoryWoodCreak();
    stopStoryFightCrowd();
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
      phaseIndex,
      enabled:audioEnabled,
      isCurrent:()=>token===renderToken&&page()===current
    });
  }

  async function narrate(text,voice,audioEnabled,rate,token,current){
    const creakCue=storyId==='fantasy-1'&&pageIndex===WOOD_CREAK_SOURCE_PAGE&&phaseIndex!==2&&audioEnabled;
    const fightCue=storyId==='fantasy-1'&&pageIndex===FIGHT_CROWD_SOURCE_PAGE&&phaseIndex!==2&&audioEnabled;
    const fightSplit=fightCue?splitFightCrowdText(text):null;

    if(fightSplit){
      await narrateStory({
        text:fightSplit.before,
        voice,
        enabled:audioEnabled,
        rate,
        sound:'none',
        isCurrent:isTokenCurrent(token)
      });
      if(token!==renderToken||page()!==current)return;
      await playStoryFightCrowdOnce();
      if(token!==renderToken||page()!==current)return;
      await narrateStory({
        text:fightSplit.after,
        voice,
        enabled:audioEnabled,
        rate,
        sound:'none',
        isCurrent:isTokenCurrent(token)
      });
      return;
    }

    const creakMarker=creakCue?woodCreakMarker(text):-1;
    let creakDone=false;
    let creakFallbackTimer=null;
    const triggerCreak=()=>{
      if(!creakCue||creakDone||token!==renderToken||page()!==current)return;
      creakDone=true;
      if(creakFallbackTimer){window.clearTimeout(creakFallbackTimer);creakFallbackTimer=null;}
      playStoryWoodCreakOnce();
    };
    await narrateStory({
      text,
      voice,
      enabled:audioEnabled,
      rate,
      sound:phaseSound(),
      isCurrent:isTokenCurrent(token),
      onStart:()=>{
        if(creakCue)creakFallbackTimer=window.setTimeout(triggerCreak,woodCreakFallbackDelay(text,rate));
      },
      onBoundary:event=>{
        if(creakCue&&Number(event.charIndex)>=creakMarker)triggerCreak();
      }
    });
    if(creakFallbackTimer){window.clearTimeout(creakFallbackTimer);creakFallbackTimer=null;}
  }

  async function renderPhase(){
    locked=false;
    const token=++renderToken;
    const current=page();
    const audioEnabled=Boolean(store.getState().audioOn);
    stopStoryWoodCreak();
    stopStoryFightCrowd();
    if(storyId==='fantasy-1'&&pageIndex===FIGHT_CROWD_SOURCE_PAGE&&phaseIndex!==2&&audioEnabled)primeStoryFightCrowd();
    syncRain(pageIndex,audioEnabled);
    syncLocationAmbience(pageIndex,audioEnabled);
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

    const audioEnabled=Boolean(store.getState().audioOn);
    // These calls happen directly inside the user's navigation click, which keeps mobile audio reliable.
    syncRain(target.pageIndex,audioEnabled);
    syncLocationAmbience(target.pageIndex,audioEnabled);

    const currentSound=phaseSound(pageIndex,phaseIndex);
    const targetSound=phaseSound(target.pageIndex,target.phaseIndex);
    if(targetSound==='door-creak'&&audioEnabled){
      stopStoryEffects();
      playVerifiedDoor();
    }else{
      transitionStoryEffects({
        storyId,
        enabled:audioEnabled,
        currentSound,
        targetSound,
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
