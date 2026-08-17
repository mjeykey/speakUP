import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio = null;
let activeName = '';
let stopTimer = 0;
let rainObjectUrl = '';
let rainPreloadPromise = null;
let rainArrayBuffer = null;
let rainAudioBuffer = null;
let rainContext = null;
let rainSource = null;
let rainGain = null;
let status = { name:'', state:'idle', detail:'' };
const RAIN_URL = new URL('../../assets/audio/rain-natural-20s.ogg?v=1', import.meta.url).href;

function setStatus(name,state,detail='') {
  status={name,state,detail};
  window.dispatchEvent(new CustomEvent('story-sfx-status',{detail:status}));
}

export function getStorySfxStatus(){ return {...status}; }
function staticSource(name){ return (!name||name==='none') ? '' : (STORY_SFX_ASSETS[name]||''); }

function ensureRainContext(){
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx) return null;
  if(!rainContext) rainContext=new Ctx();
  return rainContext;
}

async function decodeRain(){
  if(rainAudioBuffer) return rainAudioBuffer;
  if(!rainArrayBuffer) return null;
  const context=ensureRainContext();
  if(!context) return null;
  try {
    rainAudioBuffer=await context.decodeAudioData(rainArrayBuffer.slice(0));
    return rainAudioBuffer;
  } catch(error) {
    console.warn('Rain decode failed',error);
    return null;
  }
}

function preloadRain(){
  if(rainAudioBuffer) return Promise.resolve(true);
  setStatus('rain','loading','Regen wird geladen');
  if(!rainPreloadPromise){
    rainPreloadPromise=fetch(RAIN_URL,{cache:'reload'})
      .then(response=>{
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.arrayBuffer();
      })
      .then(async buffer=>{
        rainArrayBuffer=buffer;
        rainObjectUrl=RAIN_URL;
        const decoded=await decodeRain();
        if(!decoded) throw new Error('Rain audio could not be decoded');
        setStatus('rain','ready',`Regen bereit · ${decoded.duration.toFixed(1)} s`);
        return true;
      })
      .catch(error=>{
        rainPreloadPromise=null;
        setStatus('rain','error',String(error));
        console.warn('Rain failed to load',error);
        return false;
      });
  }
  return rainPreloadPromise;
}

void preloadRain();

export function isStorySfxReady(name){ return name==='rain'?!!rainAudioBuffer:!!staticSource(name); }
export function isStorySfxPlaying(name){
  if(name==='rain'&&activeName==='rain'&&rainSource) return true;
  return !!(activeAudio&&!activeAudio.paused&&activeName===name);
}
export async function preloadStorySfx(name){ return name==='rain'?preloadRain():!!staticSource(name); }
export function getStorySfxSrc(name){ return name==='rain'?(rainObjectUrl||RAIN_URL):staticSource(name); }

function stopWebRain(){
  if(rainSource){
    try{rainSource.stop();}catch(_){}
    try{rainSource.disconnect();}catch(_){}
    rainSource=null;
  }
  if(rainGain){
    try{rainGain.disconnect();}catch(_){}
    rainGain=null;
  }
}

export function stopStorySfx(){
  clearTimeout(stopTimer);
  stopTimer=0;
  stopWebRain();
  if(activeAudio){
    try{activeAudio.pause();activeAudio.currentTime=0;}catch(_){}
  }
  activeAudio=null;
  activeName='';
}

async function playSeamlessRain(volume){
  const buffer=rainAudioBuffer||await decodeRain();
  const context=ensureRainContext();
  if(!buffer||!context) return false;
  try{
    if(context.state==='suspended') await context.resume();
    stopWebRain();
    const source=context.createBufferSource();
    const gain=context.createGain();
    source.buffer=buffer;
    source.loop=true;

    // The source file is a real, longer rain passage. Only skip the tiny
    // fade edges so the listener hears the natural interior instead of a
    // volume dip at every loop boundary.
    const edge=Math.min(0.38,Math.max(0.22,buffer.duration*0.012));
    source.loopStart=edge;
    source.loopEnd=Math.max(edge+5,buffer.duration-edge);

    gain.gain.value=Math.min(1,volume*1.12);
    source.connect(gain);
    gain.connect(context.destination);
    rainSource=source;
    rainGain=gain;
    source.start(0,source.loopStart);
    return true;
  }catch(error){
    console.warn('Seamless rain failed',error);
    stopWebRain();
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
  if(name==='rain'&&!rainAudioBuffer) await preloadRain();
  const src=name==='rain'?(rainObjectUrl||RAIN_URL):staticSource(name);
  if(!src) return false;

  stopStorySfx();
  const selectedVolume=Number.isFinite(volume)
    ? Math.max(0,Math.min(1,volume))
    : (name==='rain'?.28:.62);
  activeName=name;

  let result;
  if(name==='rain'&&loop){
    result=await playSeamlessRain(selectedVolume);
    if(!result) result=await playHtml(src,selectedVolume,true);
  }else{
    result=await playHtml(src,selectedVolume,loop);
  }

  if(!result&&activeName===name) activeName='';
  if(testDurationMs>0){
    stopTimer=setTimeout(()=>{if(activeName===name)stopStorySfx();},testDurationMs);
  }
  return result;
}

export async function unlockStorySfx(){
  await preloadRain();
  const context=ensureRainContext();
  if(context&&context.state==='suspended'){
    try{await context.resume();}catch(_){}
  }
  return true;
}
