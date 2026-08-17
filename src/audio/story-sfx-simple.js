import { STORY_SFX_ASSETS } from './story-sfx-assets.js?v=2';

let activeAudio=null,standbyAudio=null,activeName='',stopTimer=0,rainObjectUrl='',rainPreloadPromise=null,rainLoopTimer=0,rainFadeTimer=0,rainCrossfading=false,rainTargetVolume=.28;
let status={name:'',state:'idle',detail:''};
const RAIN_B64_URL=new URL('../../assets/audio/rain-loop.mp3.b64?v=6',import.meta.url).href;
function setStatus(name,state,detail=''){status={name,state,detail};window.dispatchEvent(new CustomEvent('story-sfx-status',{detail:status}));}
export function getStorySfxStatus(){return{...status};}
function staticSource(name){return(!name||name==='none')?'':(STORY_SFX_ASSETS[name]||'');}
function base64ToBlobUrl(base64){const clean=String(base64||'').replace(/\s+/g,'');if(!clean)throw new Error('Rain asset is empty');const binary=atob(clean),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));}
function preloadRain(){if(rainObjectUrl)return Promise.resolve(true);setStatus('rain','loading','MP3 wird geladen');if(!rainPreloadPromise)rainPreloadPromise=fetch(RAIN_B64_URL,{cache:'reload'}).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();}).then(b=>{rainObjectUrl=base64ToBlobUrl(b);setStatus('rain','ready','MP3 bereit');return true;}).catch(e=>{rainPreloadPromise=null;setStatus('rain','error',String(e));return false;});return rainPreloadPromise;}
void preloadRain();
export function isStorySfxReady(name){return name==='rain'?!!rainObjectUrl:!!staticSource(name);}
export function isStorySfxPlaying(name){return !!(activeAudio&&!activeAudio.paused&&activeName===name);}
export async function preloadStorySfx(name){return name==='rain'?preloadRain():!!staticSource(name);}
export function getStorySfxSrc(name){return name==='rain'?(rainObjectUrl||''):staticSource(name);}
function clearRainLoop(){clearInterval(rainLoopTimer);clearInterval(rainFadeTimer);rainLoopTimer=rainFadeTimer=0;rainCrossfading=false;}
function pauseAndReset(a){if(!a)return;try{a.pause();a.currentTime=0;}catch(_){}}
export function stopStorySfx(){clearTimeout(stopTimer);clearRainLoop();pauseAndReset(activeAudio);if(standbyAudio!==activeAudio)pauseAndReset(standbyAudio);activeAudio=standbyAudio=null;activeName='';}
function crossfade(){if(rainCrossfading||!activeAudio||!standbyAudio||activeName!=='rain')return;rainCrossfading=true;const out=activeAudio,inc=standbyAudio;const fadeMs=900,stepMs=25,steps=Math.ceil(fadeMs/stepMs);let n=0;clearInterval(rainFadeTimer);rainFadeTimer=setInterval(()=>{n++;const p=Math.min(1,n/steps);try{out.volume=rainTargetVolume*(1-p);inc.volume=rainTargetVolume*p;}catch(_){}if(p>=1){clearInterval(rainFadeTimer);rainFadeTimer=0;activeAudio=inc;standbyAudio=out;rainCrossfading=false;}},stepMs);}
function startDualRainLoop(a,b){activeAudio=a;standbyAudio=b;for(const x of[a,b]){x.loop=true;x.preload='auto';x.volume=0;}a.volume=rainTargetVolume;try{b.currentTime=.55;}catch(_){}const p1=a.play(),p2=b.play();return Promise.all([p1,p2]).then(()=>{rainLoopTimer=setInterval(()=>{const cur=activeAudio;if(!cur||cur.paused||!standbyAudio||rainCrossfading||activeName!=='rain'||!Number.isFinite(cur.duration)||cur.duration<=0)return;const edge=Math.max(.95,Math.min(1.35,cur.duration*.34));if(cur.currentTime>=cur.duration-edge)crossfade();},20);return true;});}
export function playStorySfx(name,{enabled=true,loop=false,volume,testDurationMs=0}={}){if(!enabled||!name||name==='none')return Promise.resolve(false);const src=name==='rain'?rainObjectUrl:staticSource(name);if(!src)return Promise.resolve(false);stopStorySfx();const v=Number.isFinite(volume)?Math.max(0,Math.min(1,volume)):(name==='rain'?.28:.62);activeName=name;if(name==='rain'&&loop){rainTargetVolume=v;const a=new Audio(src),b=new Audio(src);for(const x of[a,b])x.setAttribute('playsinline','');const result=startDualRainLoop(a,b).then(()=>true).catch(e=>{console.warn('Rain playback failed',e);stopStorySfx();return false;});if(testDurationMs>0)stopTimer=setTimeout(stopStorySfx,testDurationMs);return result;}const a=new Audio(src);a.preload='auto';a.loop=!!loop;a.volume=v;a.setAttribute('playsinline','');activeAudio=a;return a.play().then(()=>true).catch(()=>false);}
export async function unlockStorySfx(){return preloadRain();}
