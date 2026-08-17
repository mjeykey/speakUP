import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let activeName = '';
let rainAudio = null;
let stopTimer = 0;
let status = { name:'', state:'idle', detail:'' };
const RAIN_URL = new URL('../../assets/audio/rain-natural-20s.ogg?v=2', import.meta.url).href;

function setStatus(name,state,detail='') {
  status={name,state,detail};
  window.dispatchEvent(new CustomEvent('story-sfx-status',{detail:status}));
}

export function getStorySfxStatus(){ return {...status}; }
function staticSource(name){ return (!name||name==='none') ? '' : (STORY_SFX_ASSETS[name]||''); }

function ensureRainAudio(){
  if(rainAudio) return rainAudio;
  const audio=new Audio(RAIN_URL);
  audio.preload='auto';
  audio.loop=true;
  audio.setAttribute('playsinline','');
  rainAudio=audio;
  return audio;
}

export function isStorySfxReady(name){ return name==='rain' ? true : !!staticSource(name); }
export function isStorySfxPlaying(name){
  if(name==='rain') return !!(rainAudio && !rainAudio.paused);
  return !!(activeAudio&&!activeAudio.paused&&activeName===name);
}
export async function preloadStorySfx(name){
  if(name==='rain'){
    ensureRainAudio().load();
    return true;
  }
  return !!staticSource(name);
}
export function getStorySfxSrc(name){ return name==='rain'?RAIN_URL:staticSource(name); }

function stopRain(){
  if(!rainAudio) return;
  try{rainAudio.pause();rainAudio.currentTime=0;}catch(_){}
}

export function stopStorySfx(name='all'){
  clearTimeout(stopTimer);
  stopTimer=0;
  if(name==='rain' || name==='all') stopRain();
  if(name!=='rain' && activeAudio){
    try{activeAudio.pause();activeAudio.currentTime=0;}catch(_){}
    activeAudio=null;
    activeName='';
  }
}

async function playRain(volume){
  const audio=ensureRainAudio();
  audio.volume=Math.max(0,Math.min(1,Number.isFinite(volume)?volume:0.36));
  audio.loop=true;
  try{
    if(audio.paused){
      const p=audio.play();
      if(p&&typeof p.then==='function') await p;
    }
    setStatus('rain','playing','Regen läuft');
    return true;
  }catch(error){
    console.warn('Rain play failed',error);
    setStatus('rain','error',String(error));
    return false;
  }
}

function playHtml(src,volume,loop){
  const audio=new Audio(src);
  audio.preload='auto';
  audio.loop=!!loop;
  audio.volume=volume;
  audio.setAttribute('playsinline','');
  activeAudio=audio;
  const playback=audio.play();
  return playback&&typeof playback.then==='function'
    ? playback.then(()=>true).catch(()=>false)
    : Promise.resolve(true);
}

export async function playStorySfx(name,{enabled=true,loop=false,volume,testDurationMs=0}={}){
  if(!enabled||!name||name==='none') return false;

  if(name==='rain'){
    const result=await playRain(volume);
    if(testDurationMs>0){
      stopTimer=setTimeout(()=>stopStorySfx('rain'),testDurationMs);
    }
    return result;
  }

  const src=staticSource(name);
  if(!src) return false;
  if(activeAudio){
    try{activeAudio.pause();activeAudio.currentTime=0;}catch(_){}
  }
  activeName=name;
  const selectedVolume=Number.isFinite(volume)?Math.max(0,Math.min(1,volume)):0.62;
  const result=await playHtml(src,selectedVolume,loop);
  if(!result&&activeName===name) activeName='';
  if(testDurationMs>0){
    stopTimer=setTimeout(()=>{if(activeName===name)stopStorySfx();},testDurationMs);
  }
  return result;
}

export async function unlockStorySfx(){
  ensureRainAudio();
  return true;
}
