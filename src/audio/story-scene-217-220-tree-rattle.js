const TREE_B64_URL=new URL('../../assets/audio/tree-rattle-217-220.b64?v=319',import.meta.url).href;

let installed=false;
let observer=null;
let timer=null;
let currentPage=null;
let context=null;
let buffer=null;
let bufferPromise=null;
let activeSource=null;

function getContext(){
  if(context)return context;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return null;
  context=new AudioContextClass();
  return context;
}

async function getBuffer(){
  if(buffer)return buffer;
  if(bufferPromise)return bufferPromise;
  bufferPromise=(async()=>{
    const ctx=getContext();
    if(!ctx)throw new Error('Web Audio unavailable');
    const response=await fetch(TREE_B64_URL,{cache:'force-cache'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const encoded=(await response.text()).replace(/\s+/g,'');
    const binary=atob(encoded);
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    const decoded=await ctx.decodeAudioData(bytes.buffer.slice(0));
    buffer=decoded;
    return decoded;
  })().catch(error=>{bufferPromise=null;throw error;});
  return bufferPromise;
}

function stopActive(){
  if(!activeSource)return;
  try{activeSource.stop();}catch(_){}
  activeSource=null;
}

async function playOnce(){
  try{
    const ctx=getContext();
    if(!ctx)return;
    if(ctx.state==='suspended')await ctx.resume();
    const decoded=await getBuffer();
    stopActive();
    const source=ctx.createBufferSource();
    const gain=ctx.createGain();
    source.buffer=decoded;
    source.playbackRate.value=.72;
    gain.gain.value=1;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.onended=()=>{if(activeSource===source)activeSource=null;};
    activeSource=source;
    source.start(0);
  }catch(error){
    console.warn('Tree sound playback failed.',error);
  }
}

function visibleStoryPage(root){
  const progress=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=progress.match(/(\d+)/);
  return match?Number(match[1]):null;
}

function prime(){
  const ctx=getContext();
  if(ctx?.state==='suspended')void ctx.resume().catch(()=>{});
  void getBuffer().catch(()=>{});
}

export function installScene217220TreeRattle(root,store){
  if(installed)return;
  installed=true;
  void getBuffer().catch(()=>{});
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const page=visibleStoryPage(target);
    const inRange=page>=217&&page<=220;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      stopActive();
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    timer=window.setTimeout(()=>{
      timer=null;
      if(visibleStoryPage(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      void playOnce();
    },3900);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
