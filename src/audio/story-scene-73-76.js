const SCENE_PAGES=new Set([73,74,75,76]);
const TIMING=new Map([
  [73,{wagon:4.8,tiles:7.8}],
  [74,{wagon:5.8,tiles:9.5}],
  [75,{wagon:4.8,tiles:7.8}],
  [76,{wagon:5.8,tiles:9.5}]
]);

const WIND_URL=new URL('../../assets/audio/dragon-studio-wind-blowing-sfx-06-423674-mobile.mp3?v=232',import.meta.url).href;
const WAGON_URL=new URL('../../assets/audio/dragon-studio-hammer-smash-effect-382731-mobile.mp3?v=232',import.meta.url).href;
const TILES_B64_URL=new URL('../../assets/audio/tile-break.b64?v=232',import.meta.url).href;

let context=null;
let windBufferPromise=null;
let wagonBufferPromise=null;
let tilesBufferPromise=null;
let windSource=null;
let wagonSource=null;
let tilesSource=null;
let generation=0;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function getContext(){
  if(context)return context;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return null;
  context=new AudioContextClass();
  return context;
}

async function decodeMp3(url){
  const ctx=getContext();
  if(!ctx)throw new Error('Web Audio unavailable');
  const response=await fetch(url,{cache:'force-cache'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const bytes=await response.arrayBuffer();
  return ctx.decodeAudioData(bytes.slice(0));
}

async function decodeBase64Mp3(url){
  const ctx=getContext();
  if(!ctx)throw new Error('Web Audio unavailable');
  const response=await fetch(url,{cache:'force-cache'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const encoded=(await response.text()).replace(/\s+/g,'');
  const binary=atob(encoded);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i+=1)bytes[i]=binary.charCodeAt(i);
  return ctx.decodeAudioData(bytes.buffer.slice(0));
}

function loadBuffers(){
  windBufferPromise??=decodeMp3(WIND_URL);
  wagonBufferPromise??=decodeMp3(WAGON_URL);
  tilesBufferPromise??=decodeBase64Mp3(TILES_B64_URL);
  return Promise.all([windBufferPromise,wagonBufferPromise,tilesBufferPromise]);
}

function stopSource(source){
  if(!source)return;
  try{source.stop();}catch(_){}
  try{source.disconnect();}catch(_){}
}

export function stopScene7376(){
  generation+=1;
  stopSource(windSource);
  stopSource(wagonSource);
  stopSource(tilesSource);
  windSource=null;
  wagonSource=null;
  tilesSource=null;
}

function makeSource(buffer,volume,loop=false){
  const ctx=getContext();
  const source=ctx.createBufferSource();
  const gain=ctx.createGain();
  source.buffer=buffer;
  source.loop=loop;
  gain.gain.value=volume;
  source.connect(gain);
  gain.connect(ctx.destination);
  source.onended=()=>{
    try{source.disconnect();gain.disconnect();}catch(_){}
  };
  return source;
}

async function startScene(root,page,audioEnabled){
  stopScene7376();
  if(!audioEnabled||!SCENE_PAGES.has(page))return;

  const myGeneration=generation;
  const startedAt=performance.now();
  try{
    const ctx=getContext();
    if(!ctx)return;
    if(ctx.state!=='running')await ctx.resume();
    const [windBuffer,wagonBuffer,tilesBuffer]=await loadBuffers();
    if(myGeneration!==generation||currentPage(root)!==page)return;

    const timing=TIMING.get(page)||{wagon:5,tiles:8};
    const elapsed=(performance.now()-startedAt)/1000;

    windSource=makeSource(windBuffer,.24,true);
    windSource.start();

    wagonSource=makeSource(wagonBuffer,.9,false);
    wagonSource.start(ctx.currentTime+Math.max(.05,timing.wagon-elapsed));

    tilesSource=makeSource(tilesBuffer,.9,false);
    tilesSource.start(ctx.currentTime+Math.max(.05,timing.tiles-elapsed));
  }catch(error){
    console.warn('Pages 73-76 scene audio failed.',error);
  }
}

export function installScene7376(root,store){
  if(root.dataset.scene7376Installed==='1')return;
  root.dataset.scene7376Installed='1';

  let lastPage=-1;
  let lastAudioEnabled=null;

  const unlock=()=>{
    if(!store.getState().audioOn)return;
    const ctx=getContext();
    if(ctx&&ctx.state!=='running')void ctx.resume();
    void loadBuffers().catch(()=>{});
  };

  const sync=()=>{
    const page=currentPage(root);
    const audioEnabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&audioEnabled===lastAudioEnabled)return;
    lastPage=page;
    lastAudioEnabled=audioEnabled;
    if(SCENE_PAGES.has(page)&&audioEnabled)void startScene(root,page,true);
    else stopScene7376();
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
