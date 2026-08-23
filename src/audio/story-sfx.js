import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio=null;
let activeName='';
let rainAudio=null;
let doorAudio=null;
let doorStartedAt=0;
let doorAudioContext=null;
let doorSourceNode=null;
let doorGainNode=null;
let bellAudio=null;
let bellBlobUrl='';
let bellPreparePromise=null;
let stopTimer=0;
let bellStatus={state:'idle',detail:''};
let doorStatus={state:'idle',detail:''};

const RAIN_MP3_URL=new URL('../../assets/audio/rain-natural-20s.ogg?v=2da55864',import.meta.url).href;
const BELL_MP3_URL=new URL('../../assets/audio/soundreality-tsar-bell-sound-simulation-292699.mp3?v=969c6cd2',import.meta.url).href;
const DOOR_MP3_URL='data:audio/mpeg;base64,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NEmJAjHJSzUzHoCuMEmEPTD3gKU2Nis6AEE1CFk5nIw3iZ89aAUzHVgxWDAxUhJ4hKUGGC2c5bRmnFHFgSbi3xiUKGFhCPMIySSTNbKMDggKgIweoBYsRwVDJjMSDIKegwCDzCVOMqgRrMqqgzv///////+/////ef56F2mFNDUhg8oj2YNcHhmPSP/7csS+gw5gVPoP92WJ6wrgDf9wCHmhsuGLw0jROEIUhihGhY2GPxHmD2YjBTcVsWQEbwYJHKkhqYUBkk4MlJjkZACsBLMmOKrJX1DgsiDaZbJEAv9YHRM1ggFgCXgm7///7/2L//////f/////6kxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7cMSugB3Ne1j5nIAQAAA0g4AABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
const DOOR_START_GUARD_MS=650;
const DOOR_FILE_URL=new URL('../../assets/audio/door-creak-original-loud.mp3?v=198',import.meta.url).href;

const clampVolume=value=>Number.isFinite(value)?Math.max(0,Math.min(1,value)):null;
const nowMs=()=>typeof performance!=='undefined'&&performance.now?performance.now():Date.now();
const doorIsStarting=()=>Boolean(doorAudio&&nowMs()-doorStartedAt<DOOR_START_GUARD_MS);

function setBellStatus(state,detail=''){
  bellStatus={state,detail};
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('speakup-bell-status',{detail:bellStatus}));
}

function setDoorStatus(state,detail=''){
  doorStatus={state,detail};
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('speakup-door-status',{detail:doorStatus}));
}

function styleHiddenAudio(audio){
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  Object.assign(audio.style,{position:'fixed',width:'1px',height:'1px',opacity:'0',pointerEvents:'none',left:'-9999px'});
  document.body.appendChild(audio);
  return audio;
}

function ensureBellAudio(){
  if(bellAudio&&bellAudio.isConnected)return bellAudio;
  bellAudio=styleHiddenAudio(document.createElement('audio'));
  bellAudio.volume=.90;
  bellAudio.oncanplay=()=>setBellStatus('ready',`readyState=${bellAudio.readyState}`);
  bellAudio.onerror=()=>setBellStatus('media-error',`code=${bellAudio.error?.code||'unknown'} readyState=${bellAudio.readyState}`);
  setBellStatus('created',`readyState=${bellAudio.readyState}`);
  return bellAudio;
}

function waitForCanPlay(audio,timeoutMs=12000){
  if(audio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA)return Promise.resolve(true);
  return new Promise(resolve=>{
    let settled=false;
    const finish=value=>{
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      audio.removeEventListener('canplay',onReady);
      audio.removeEventListener('loadeddata',onReady);
      audio.removeEventListener('error',onError);
      resolve(value);
    };
    const onReady=()=>finish(true);
    const onError=()=>finish(false);
    const timer=setTimeout(()=>finish(audio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA),timeoutMs);
    audio.addEventListener('canplay',onReady,{once:true});
    audio.addEventListener('loadeddata',onReady,{once:true});
    audio.addEventListener('error',onError,{once:true});
  });
}

async function prepareBellAudio(){
  const audio=ensureBellAudio();
  if(audio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA)return true;
  if(bellPreparePromise)return bellPreparePromise;
  bellPreparePromise=(async()=>{
    try{
      setBellStatus('fetching','loading exact uploaded MP3');
      const response=await fetch(BELL_MP3_URL,{cache:'force-cache'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const blob=await response.blob();
      if(bellBlobUrl)URL.revokeObjectURL(bellBlobUrl);
      bellBlobUrl=URL.createObjectURL(blob);
      audio.src=bellBlobUrl;
      audio.load();
      const ready=await waitForCanPlay(audio);
      setBellStatus(ready?'ready':'not-ready',`${blob.size} bytes · readyState=${audio.readyState}`);
      return ready;
    }catch(error){
      setBellStatus('prepare-error',`${error?.name||'Error'}: ${error?.message||String(error)}`);
      console.warn('Tsar bell preparation failed.',error);
      return false;
    }finally{bellPreparePromise=null;}
  })();
  return bellPreparePromise;
}

function stopMedia(audio){
  if(!audio)return;
  try{audio.pause();}catch(_){}
  try{audio.currentTime=0;}catch(_){}
}

async function playBell(volume=.90){
  const audio=ensureBellAudio();
  try{
    if(audio.readyState<HTMLMediaElement.HAVE_CURRENT_DATA)await prepareBellAudio();
    stopMedia(audio);
    audio.muted=false;
    audio.volume=clampVolume(volume)??.90;
    setBellStatus('play-request',`readyState=${audio.readyState}`);
    return Promise.resolve(audio.play()).then(()=>{setBellStatus('playing',`readyState=${audio.readyState}`);return true;}).catch(error=>{
      setBellStatus('blocked',`${error?.name||'Error'}: ${error?.message||String(error)}`);
      return false;
    });
  }catch(error){
    setBellStatus('exception',`${error?.name||'Error'}: ${error?.message||String(error)}`);
    return false;
  }
}

function playRain(volume=.40,keepGoing=false){
  if(rainAudio&&!rainAudio.paused&&!rainAudio.ended)return Promise.resolve(true);
  stopMedia(rainAudio);
  const audio=new Audio(RAIN_MP3_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.volume=clampVolume(volume)??.40;
  rainAudio=audio;
  audio.onended=()=>{if(rainAudio===audio){rainAudio=null;if(keepGoing)void playRain(volume,true);}};
  audio.onerror=()=>{if(rainAudio===audio)rainAudio=null;};
  return Promise.resolve(audio.play()).then(()=>true).catch(error=>{if(rainAudio===audio)rainAudio=null;console.warn('Rain playback failed.',error);return false;});
}

function playDoor(volume=.95){
  stopMedia(doorAudio);
  const audio=new Audio(DOOR_FILE_URL);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.muted=false;
  audio.volume=1;
  audio.playbackRate=.82;
  try{
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(AudioContextClass){
      if(!doorAudioContext)doorAudioContext=new AudioContextClass();
      if(doorAudioContext.state==='suspended')void doorAudioContext.resume();
      try{doorSourceNode?.disconnect();}catch(_){}
      try{doorGainNode?.disconnect();}catch(_){}
      doorSourceNode=doorAudioContext.createMediaElementSource(audio);
      doorGainNode=doorAudioContext.createGain();
      doorGainNode.gain.value=9*(clampVolume(volume)??.95);
      doorSourceNode.connect(doorGainNode).connect(doorAudioContext.destination);
    }
  }catch(error){
    console.warn('Door gain channel unavailable.',error);
  }
  doorAudio=audio;
  doorStartedAt=nowMs();
  setDoorStatus('starting','local MP3 · amplified channel');
  audio.onloadeddata=()=>setDoorStatus('loaded',`readyState=${audio.readyState} networkState=${audio.networkState}`);
  audio.onplaying=()=>setDoorStatus('playing',`readyState=${audio.readyState} time=${audio.currentTime.toFixed(2)}`);
  audio.onerror=()=>{
    setDoorStatus('media-error',`code=${audio.error?.code||'unknown'} readyState=${audio.readyState} networkState=${audio.networkState}`);
    if(doorAudio===audio){doorAudio=null;doorStartedAt=0;}
  };
  audio.onended=()=>{
    setDoorStatus('ended',`duration=${Number.isFinite(audio.duration)?audio.duration.toFixed(2):'unknown'}s`);
    if(doorAudio===audio){doorAudio=null;doorStartedAt=0;}
  };
  return Promise.resolve(audio.play()).then(()=>{
    setDoorStatus('playing',`readyState=${audio.readyState} time=${audio.currentTime.toFixed(2)}`);
    return true;
  }).catch(error=>{
    setDoorStatus('blocked',`${error?.name||'Error'}: ${error?.message||String(error)}`);
    if(doorAudio===audio){doorAudio=null;doorStartedAt=0;}
    console.warn('Door playback failed.',error);
    return false;
  });
}

function staticSource(name){
  if(!name||name==='none'||name==='bell'||name==='warning-bell'||name==='rain'||name==='door-creak')return'';
  return STORY_SFX_ASSETS[name]||'';
}

function stopGeneric(){stopMedia(activeAudio);activeAudio=null;activeName='';}

function playGeneric(name,volume=.30,loop=false){
  const src=staticSource(name);
  if(!src)return Promise.resolve(false);
  stopGeneric();
  const audio=new Audio(src);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=Boolean(loop);
  audio.volume=clampVolume(volume)??.30;
  activeAudio=audio;
  activeName=name;
  audio.onended=()=>{if(activeAudio===audio){activeAudio=null;activeName='';}};
  return Promise.resolve(audio.play()).then(()=>true).catch(error=>{if(activeAudio===audio){activeAudio=null;activeName='';}console.warn('Story SFX playback failed.',name,error);return false;});
}

export function getStorySfxStatus(name='bell'){
  if(name==='door-creak'){
    const audio=doorAudio;
    return{...doorStatus,src:'embedded-data-url',paused:audio?audio.paused:null,readyState:audio?audio.readyState:null,networkState:audio?audio.networkState:null,currentTime:audio?audio.currentTime:null,errorCode:audio?.error?.code||null,starting:doorIsStarting()};
  }
  const audio=bellAudio;
  return{...bellStatus,src:BELL_MP3_URL,paused:audio?audio.paused:null,readyState:audio?audio.readyState:null,networkState:audio?audio.networkState:null,currentTime:audio?audio.currentTime:null,errorCode:audio?.error?.code||null};
}

export function setStorySfxVolume(name,volume){
  const v=clampVolume(volume);
  if(v===null)return false;
  if(name==='bell'&&bellAudio){bellAudio.volume=v;return true;}
  if(name==='door-creak'&&doorAudio){doorAudio.volume=v;return true;}
  if(name==='rain'&&rainAudio){rainAudio.volume=v;return true;}
  if(activeAudio&&activeName===name){activeAudio.volume=v;return true;}
  return false;
}

export function getStorySfxSrc(name){
  if(name==='bell')return BELL_MP3_URL;
  if(name==='rain')return RAIN_MP3_URL;
  if(name==='door-creak')return DOOR_FILE_URL;
  if(name==='warning-bell')return'';
  return staticSource(name);
}

export function isStorySfxReady(name){
  if(name==='bell')return Boolean(bellAudio&&bellAudio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA);
  if(name==='door-creak'||name==='rain'||name==='warning-bell')return true;
  return Boolean(staticSource(name));
}

export function isStorySfxPlaying(name){
  if(name==='bell')return Boolean(bellAudio&&!bellAudio.paused&&!bellAudio.ended&&!bellAudio.muted);
  if(name==='door-creak')return Boolean(doorIsStarting()||(doorAudio&&!doorAudio.paused&&!doorAudio.ended&&!doorAudio.muted));
  if(name==='rain')return Boolean(rainAudio&&!rainAudio.paused&&!rainAudio.ended);
  if(name==='warning-bell')return false;
  return Boolean(activeAudio&&!activeAudio.paused&&activeName===name);
}

export function preloadStorySfx(name){
  if(name==='bell')return prepareBellAudio();
  if(name==='door-creak'||name==='rain'||name==='warning-bell')return Promise.resolve(true);
  return Promise.resolve(Boolean(staticSource(name)));
}

export function stopStorySfx(){
  clearTimeout(stopTimer);
  stopTimer=0;
  stopGeneric();
  stopMedia(rainAudio);rainAudio=null;
  stopMedia(bellAudio);
  if(doorIsStarting())setDoorStatus('guarded','navigation stop ignored during startup');
  else{stopMedia(doorAudio);doorAudio=null;doorStartedAt=0;}
}

export async function unlockStorySfx(){return prepareBellAudio();}

export function playStorySfx(name,{enabled=true,loop=false,volume,testDurationMs=0}={}){
  if(!enabled||!name||name==='none'||name==='warning-bell')return Promise.resolve(false);
  let result;
  if(name==='bell')result=playBell(volume);
  else if(name==='rain')result=playRain(volume,loop);
  else if(name==='door-creak')result=playDoor(volume);
  else result=playGeneric(name,volume,loop);
  if(testDurationMs>0){clearTimeout(stopTimer);stopTimer=window.setTimeout(()=>stopStorySfx(),testDurationMs);}
  return result;
}

if(typeof document!=='undefined'&&document.body){void prepareBellAudio();}
