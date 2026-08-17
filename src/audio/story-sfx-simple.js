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
const RAIN_B64_URL = new URL('../../assets/audio/rain-loop.mp3.b64?v=6', import.meta.url).href;

function setStatus(name,state,detail='') { status={name,state,detail}; window.dispatchEvent(new CustomEvent('story-sfx-status',{detail:status})); }
export function getStorySfxStatus(){ return {...status}; }
function staticSource(name){ return (!name||name==='none') ? '' : (STORY_SFX_ASSETS[name]||''); }
function base64ToBytes(base64){
  const clean=String(base64||'').replace(/\s+/g,'');
  if(!clean) throw new Error('Rain asset is empty');
  const binary=atob(clean), bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i+=1) bytes[i]=binary.charCodeAt(i);
  return bytes;
}
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
  try { rainAudioBuffer=await context.decodeAudioData(rainArrayBuffer.slice(0)); return rainAudioBuffer; }
  catch(error){ console.warn('Rain decode failed',error); return null; }
}
function preloadRain(){
  if(rainObjectUrl&&rainArrayBuffer) return Promise.resolve(true);
  setStatus('rain','loading','MP3 wird geladen');
  if(!rainPreloadPromise){
    rainPreloadPromise=fetch(RAIN_B64_URL,{cache:'reload'})
      .then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();})
      .then(async b=>{
        const bytes=base64ToBytes(b);
        rainArrayBuffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
        rainObjectUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
        await decodeRain();
        setStatus('rain','ready','MP3 bereit');
        return true;
      })
      .catch(e=>{rainPreloadPromise=null;setStatus('rain','error',String(e));return false;});
  }
  return rainPreloadPromise;
}
void preloadRain();
export function isStorySfxReady(name){ return name==='rain'?!!rainObjectUrl:!!staticSource(name); }
export function isStorySfxPlaying(name){
  if(name==='rain'&&activeName==='rain'&&rainSource) return true;
  return !!(activeAudio&&!activeAudio.paused&&activeName===name);
}
export async function preloadStorySfx(name){ return name==='rain'?preloadRain():!!staticSource(name); }
export function getStorySfxSrc(name){ return name==='rain'?(rainObjectUrl||''):staticSource(name); }
function stopWebRain(){
  if(rainSource){try{rainSource.stop();}catch(_){}try{rainSource.disconnect();}catch(_){}rainSource=null;}
  if(rainGain){try{rainGain.disconnect();}catch(_){}rainGain=null;}
}
export function stopStorySfx(){
  clearTimeout(stopTimer);stopTimer=0;stopWebRain();
  if(activeAudio){try{activeAudio.pause();activeAudio.currentTime=0;}catch(_){}}
  activeAudio=null;activeName='';
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
    const trim=Math.min(0.035,Math.max(0.006,buffer.duration*0.008));
    source.loopStart=trim;
    source.loopEnd=Math.max(trim+0.05,buffer.duration-trim);
    gain.gain.value=volume;
    source.connect(gain);gain.connect(context.destination);
    rainSource=source;rainGain=gain;
    source.start(0,source.loopStart);
    return true;
  }catch(error){console.warn('Seamless rain failed',error);stopWebRain();return false;}
}
function playHtml(src,volume,loop){
  const a=new Audio(src);a.preload='auto';a.loop=!!loop;a.volume=volume;a.setAttribute('playsinline','');activeAudio=a;
  const p=a.play();return p&&typeof p.then==='function'?p.then(()=>true).catch(()=>false):Promise.resolve(true);
}
export async function playStorySfx(name,{enabled=true,loop=false,volume,testDurationMs=0}={}){
  if(!enabled||!name||name==='none')return false;
  const src=name==='rain'?rainObjectUrl:staticSource(name);if(!src)return false;
  stopStorySfx();
  const v=Number.isFinite(volume)?Math.max(0,Math.min(1,volume)):(name==='rain'?.28:.62);
  activeName=name;
  let result;
  if(name==='rain'&&loop){result=await playSeamlessRain(v);if(!result)result=await playHtml(src,v,true);}else result=await playHtml(src,v,loop);
  if(!result&&activeName===name)activeName='';
  if(testDurationMs>0)stopTimer=setTimeout(()=>{if(activeName===name)stopStorySfx();},testDurationMs);
  return result;
}
export async function unlockStorySfx(){
  await preloadRain();
  const context=ensureRainContext();
  if(context&&context.state==='suspended'){try{await context.resume();}catch(_){}}
  return true;
}
