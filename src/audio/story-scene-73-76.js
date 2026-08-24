const SCENE_PAGES=new Set([73,74,75,76]);
const WAGON_DELAY=new Map([[73,4.8],[74,5.8],[75,4.8],[76,5.8]]);
const WAGON_URL=new URL('../../assets/audio/dragon-studio-hammer-smash-effect-382731-mobile.mp3?v=234',import.meta.url).href;

let context=null;
let wagonBufferPromise=null;
let wagonSource=null;
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

async function loadWagon(){
  if(wagonBufferPromise)return wagonBufferPromise;
  wagonBufferPromise=(async()=>{
    const ctx=getContext();
    if(!ctx)throw new Error('Web Audio unavailable');
    const response=await fetch(WAGON_URL,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const bytes=await response.arrayBuffer();
    return ctx.decodeAudioData(bytes.slice(0));
  })();
  return wagonBufferPromise;
}

function stopWagon(){
  generation+=1;
  if(wagonSource){
    try{wagonSource.stop();}catch(_){}
    try{wagonSource.disconnect();}catch(_){}
    wagonSource=null;
  }
}

export function stopScene7376(){stopWagon();}

async function startWagon(root,page){
  stopWagon();
  if(!SCENE_PAGES.has(page))return;
  const myGeneration=generation;
  const startedAt=performance.now();
  try{
    const ctx=getContext();
    if(!ctx)return;
    if(ctx.state!=='running')await ctx.resume();
    const buffer=await loadWagon();
    if(myGeneration!==generation||currentPage(root)!==page)return;
    const elapsed=(performance.now()-startedAt)/1000;
    const source=ctx.createBufferSource();
    const gain=ctx.createGain();
    source.buffer=buffer;
    source.loop=false;
    gain.gain.value=.9;
    source.connect(gain);
    gain.connect(ctx.destination);
    wagonSource=source;
    source.onended=()=>{
      if(wagonSource===source)wagonSource=null;
      try{source.disconnect();gain.disconnect();}catch(_){}
    };
    source.start(ctx.currentTime+Math.max(.05,(WAGON_DELAY.get(page)||5)-elapsed));
  }catch(error){
    console.warn('Wagon sound failed.',error);
  }
}

export function installScene7376(root,store){
  if(root.dataset.scene7376Installed==='234')return;
  root.dataset.scene7376Installed='234';
  let lastPage=-1;
  let lastAudioEnabled=null;

  root.addEventListener('pointerdown',()=>{
    if(!store.getState().audioOn)return;
    const ctx=getContext();
    if(ctx&&ctx.state!=='running')void ctx.resume();
    void loadWagon().catch(()=>{});
  },{capture:true});

  const sync=()=>{
    const page=currentPage(root);
    const audioEnabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&audioEnabled===lastAudioEnabled)return;
    lastPage=page;
    lastAudioEnabled=audioEnabled;
    if(SCENE_PAGES.has(page)&&audioEnabled)void startWagon(root,page);
    else stopWagon();
  };

  new MutationObserver(sync).observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
