import { getStorySfxSrc, isStorySfxPlaying, preloadStorySfx, playStorySfx, setStorySfxVolume, stopStorySfx, transitionStorySfx } from './story-sfx.js?v=268';

const BELL_NORMAL_VOLUME=.90;
const BELL_LEARNING_VOLUME=.68;
const DOOR_VOLUME=1;
let locationAudio=null;
let locationName='';

function bellVolumeForPhase(phaseIndex){
  return phaseIndex===1||phaseIndex===3?BELL_LEARNING_VOLUME:BELL_NORMAL_VOLUME;
}

function stopLocationAudio(){
  if(!locationAudio)return;
  try{locationAudio.pause();}catch(_){}
  try{locationAudio.currentTime=0;}catch(_){}
  locationAudio=null;
  locationName='';
}

export function syncStoryLocationAmbience(name,{enabled=true,volume=.12}={}){
  if(!enabled||!name||name==='none'){
    stopLocationAudio();
    return;
  }

  const v=Number.isFinite(volume)?Math.max(0,Math.min(1,volume)):.12;
  if(locationAudio&&locationName===name){
    locationAudio.volume=v;
    locationAudio.loop=true;
    if(locationAudio.paused||locationAudio.ended){
      try{locationAudio.currentTime=0;}catch(_){}
      void Promise.resolve(locationAudio.play()).catch(error=>console.warn('Location ambience playback failed.',name,error));
    }
    return;
  }

  const src=getStorySfxSrc(name);
  if(!src){
    stopLocationAudio();
    return;
  }

  stopLocationAudio();
  const audio=new Audio(src);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=true;
  audio.volume=v;
  locationAudio=audio;
  locationName=name;
  audio.onerror=()=>{
    if(locationAudio===audio){locationAudio=null;locationName='';}
  };
  void Promise.resolve(audio.play()).catch(error=>{
    if(locationAudio===audio){locationAudio=null;locationName='';}
    console.warn('Location ambience playback failed.',name,error);
  });
}

export function stopStoryEffects(){
  stopLocationAudio();
  stopStorySfx();
}

export function prepareStoryEffects(storyId){
  if(storyId==='fantasy-1'){
    void preloadStorySfx('bell');
    void preloadStorySfx('door-creak');
  }
}

export function ensureStoryEffect({storyId,sound,phaseIndex,enabled=true,isCurrent=()=>true}={}){
  if(storyId!=='fantasy-1'||!enabled||!isCurrent())return;

  if(!sound||sound==='none'||sound==='rain'||sound==='door-creak'||sound==='crowd')return;

  if(sound==='bell')setStorySfxVolume('bell',bellVolumeForPhase(phaseIndex));
  if(isStorySfxPlaying(sound))return;

  const volume=sound==='lightning-strike'?1:sound==='storm-wind'?0.72:sound==='ocean-waves'?0.45:sound==='bell'?bellVolumeForPhase(phaseIndex):0.30;
  const start=()=>{
    if(!isCurrent()||isStorySfxPlaying(sound))return;
    void playStorySfx(sound,{enabled:true,loop:sound==='ocean-waves'||sound==='storm-wind',volume});
  };

  start();
}

export function transitionStoryEffects({storyId,enabled=true,targetSound='none'}={}){
  transitionStorySfx({keepRain:false});
  if(storyId==='fantasy-1'&&enabled&&targetSound==='door-creak'){
    void playStorySfx('door-creak',{enabled:true,loop:false,volume:DOOR_VOLUME});
  }
}
