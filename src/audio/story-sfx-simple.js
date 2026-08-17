import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let activeName = '';
let rainAudio = null;
let rainObjectUrl = '';
let rainLoadPromise = null;
let stopTimer = 0;
let status = { name:'', state:'idle', detail:'' };
const RAIN_B64_URL = new URL('../../assets/audio/rain-loop.mp3.b64?v=3', import.meta.url).href;

function setStatus(name,state,detail='') {
  status={name,state,detail};
  window.dispatchEvent(new CustomEvent('story-sfx-status',{detail:status}));
}

export function getStorySfxStatus(){ return {...status}; }
function staticSource(name){ return (!name||name==='none') ? '' : (STORY_SFX_ASSETS[name]||''); }

function makeMp3Url(base64Text){
  const clean=String(base64Text||'').replace(/\s+/g,'');
  const binary=atob(clean);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i+=1) bytes[i]=binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
}

function prepareRain(){
  if(rainAudio) return Promise.resolve(true);
  if(rainLoadPromise) return rainLoadPromise;
  setStatus('rain','loading','Regen wird vorbereitet');
  rainLoadPromise=fetch(RAIN_B64_URL,{cache:'reload'})
    .then(response=>{
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(text=>{
      rainObjectUrl=makeMp3Url(text);
      const audio=new Audio(rainObjectUrl);
      audio.preload='auto';
      audio.loop=false;
      audio.volume=0.38;
      audio.setAttribute('playsinline','');
      audio.load();
      rainAudio=audio;
      setStatus('rain','ready','Regen bereit');
      return true;
    })
    .catch(error=>{
      rainLoadPromise=null;
      setStatus('rain','error',String(error));
      console.warn('Rain preparation failed',error);
      return false;
    });
  return rainLoadPromise;
}

void prepareRain();

export function isStorySfxReady(name){ return name==='rain' ? !!rainAudio : !!staticSource(name); }
export function isStorySfxPlaying(name){
  if(name==='rain') return !!(rainAudio && !rainAudio.paused && !rainAudio.ended);
  return !!(activeAudio&&!activeAudio.paused&&activeName===name);
}
export async function preloadStorySfx(name){ return name==='rain'?prepareRain():!!staticSource(name); }
export function getStorySfxSrc(name){ return name==='rain'?(rainObjectUrl||RAIN_B64_URL):staticSource(name); }

function stopRain(){
  if(!rainAudio) return;
  try{rainAudio.pause();rainAudio.currentTime=0;}catch(_){}
}

export function stopStorySfx(name='all'){
  clearTimeout(stopTimer);
  stopTimer=0;
  if(name==='rain'||name==='all') stopRain();
  if(name!=='rain'&&activeAudio){
    try{activeAudio.pause();activeAudio.currentTime=0;}catch(_){}
    activeAudio=null;
    activeName='';
  }
}

function startPreparedRain(volume){
  if(!rainAudio) return null;
  rainAudio.volume=Math.max(0,Math.min(1,Number.isFinite(volume)?volume:0.38));
  rainAudio.loop=false;
  try{
    if(rainAudio.ended || rainAudio.currentTime >= rainAudio.duration) rainAudio.currentTime=0;
    const playback=rainAudio.play();
    if(playback&&typeof playback.then==='function'){
      return playback.then(()=>{
        setStatus('rain','playing','Regen läuft einmal');
        return true;
      }).catch(error=>{
        console.warn('Rain play failed',error);
        setStatus('rain','error',String(error));
        return false;
      });
    }
    setStatus('rain','playing','Regen läuft einmal');
    return Promise.resolve(true);
  }catch(error){
    console.warn('Rain play failed',error);
    setStatus('rain','error',String(error));
    return Promise.resolve(false);
  }
}

function playRain(volume){
  const immediate=startPreparedRain(volume);
  if(immediate) return immediate;
  return prepareRain().then(ok=>ok?startPreparedRain(volume):false);
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

export function playStorySfx(name,{enabled=true,loop=false,volume,testDurationMs=0}={}){
  if(!enabled||!name||name==='none') return Promise.resolve(false);
  if(name==='rain'){
    const result=playRain(volume);
    if(testDurationMs>0) stopTimer=setTimeout(()=>stopStorySfx('rain'),testDurationMs);
    return result;
  }

  const src=staticSource(name);
  if(!src) return Promise.resolve(false);
  if(activeAudio){
    try{activeAudio.pause();activeAudio.currentTime=0;}catch(_){}
  }
  activeName=name;
  const selectedVolume=Number.isFinite(volume)?Math.max(0,Math.min(1,volume)):0.62;
  const result=playHtml(src,selectedVolume,loop);
  if(testDurationMs>0) stopTimer=setTimeout(()=>{if(activeName===name)stopStorySfx();},testDurationMs);
  return result.then(ok=>{if(!ok&&activeName===name)activeName='';return ok;});
}

export async function unlockStorySfx(){
  await prepareRain();
  return true;
}
