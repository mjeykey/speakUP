import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio=null;
let activeName='';
let rainAudio=null;
let bellAudio=null;
let bellBlobUrl='';
let bellPreparePromise=null;
let doorAudio=null;
let stopTimer=0;
let bellStatus={state:'idle',detail:''};

const RAIN_MP3_URL='https://raw.githubusercontent.com/smithcol11/vr-class-horror-game/04a6aeb5b51ae98c1579c166d7fd42e24c88950d/sounds/rain-on-roof-or-window-nature-sounds-8312.mp3';
const BELL_MP3_URL=new URL('../../assets/audio/soundreality-tsar-bell-sound-simulation-292699.mp3?v=969c6cd233d57223-clean4',import.meta.url).href;
const DOOR_MP3_URL=new URL('../../assets/audio/door-creak-original-loud.mp3?v=1',import.meta.url).href;

const clampVolume=value=>Number.isFinite(value)?Math.max(0,Math.min(1,value)):null;

function setBellStatus(state,detail=''){
  bellStatus={state,detail};
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('speakup-bell-status',{detail:bellStatus}));
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

function ensureDoorAudio(){
  if(doorAudio&&doorAudio.isConnected)return doorAudio;
  doorAudio=styleHiddenAudio(document.createElement('audio'));
  doorAudio.volume=.95;
  doorAudio.src=DOOR_MP3_URL;
  doorAudio.load();
  return doorAudio;
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

function prepareDoorAudio(){
  const audio=ensureDoorAudio();
  if(audio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA)return Promise.resolve(true);
  return waitForCanPlay(audio);
}

function stopMedia(audio){
  if(!audio)return;
  try{audio.pause();}catch(_){}
  try{audio.currentTime=0;}catch(_){}
}

function playDoor(volume=.95){
  const audio=ensureDoorAudio();
  try{
    stopMedia(audio);
    audio.muted=false;
    audio.volume=clampVolume(volume)??.95;
    // Important for Android: play() is invoked synchronously inside the navigation click.
    return Promise.resolve(audio.play()).then(()=>true).catch(error=>{
      console.warn('Door playback failed.',error);
      return false;
    });
  }catch(error){
    console.warn('Door playback failed.',error);
    return Promise.resolve(false);
  }
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

function staticSource(name){
  if(!name||name==='none'||name==='bell'||name==='warning-bell'||name==='rain'||name==='door-creak')return'';
  return STORY_SFX_ASSETS[name]||'';
}

function stopGeneric(){
  stopMedia(activeAudio);
  activeAudio=null;
  activeName='';
}

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

export function getStorySfxStatus(){
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
  if(name==='door-creak')return DOOR_MP3_URL;
  if(name==='warning-bell')return'';
  return staticSource(name);
}

export function isStorySfxReady(name){
  if(name==='bell')return Boolean(bellAudio&&bellAudio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA);
  if(name==='door-creak')return Boolean(doorAudio&&doorAudio.readyState>=HTMLMediaElement.HAVE_CURRENT_DATA);
  if(name==='rain'||name==='warning-bell')return true;
  return Boolean(staticSource(name));
}

export function isStorySfxPlaying(name){
  if(name==='bell')return Boolean(bellAudio&&!bellAudio.paused&&!bellAudio.ended&&!bellAudio.muted);
  if(name==='door-creak')return Boolean(doorAudio&&!doorAudio.paused&&!doorAudio.ended&&!doorAudio.muted);
  if(name==='rain')return Boolean(rainAudio&&!rainAudio.paused&&!rainAudio.ended);
  if(name==='warning-bell')return false;
  return Boolean(activeAudio&&!activeAudio.paused&&activeName===name);
}

export function preloadStorySfx(name){
  if(name==='bell')return prepareBellAudio();
  if(name==='door-creak')return prepareDoorAudio();
  if(name==='rain'||name==='warning-bell')return Promise.resolve(true);
  return Promise.resolve(Boolean(staticSource(name)));
}

export function stopStorySfx(){
  clearTimeout(stopTimer);
  stopTimer=0;
  stopGeneric();
  stopMedia(rainAudio);rainAudio=null;
  stopMedia(bellAudio);
  stopMedia(doorAudio);
}

export async function unlockStorySfx(){
  const results=await Promise.allSettled([prepareBellAudio(),prepareDoorAudio()]);
  return results.some(result=>result.status==='fulfilled'&&result.value);
}

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

if(typeof document!=='undefined'&&document.body){
  // Start loading the real files long before the user reaches the Story scene.
  void prepareBellAudio();
  void prepareDoorAudio();
}
