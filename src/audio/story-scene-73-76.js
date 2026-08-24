const SCENE_PAGES=new Set([73,74,75,76]);
const TILE_BREAK_DELAY_BY_PAGE=new Map([[73,7200],[74,9200],[75,7600],[76,9200]]);
const TILE_BREAK_B64_URL=new URL('../../assets/audio/tile-break.b64?v=238',import.meta.url).href;

let timer=0;
let audio=null;
let blobUrl='';
let loadPromise=null;
let lastPage=-1;
let lastEnabled=null;
let playedPage=-1;
let primed=false;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

async function tileBreakSrc(){
  if(blobUrl)return blobUrl;
  if(loadPromise)return loadPromise;
  loadPromise=(async()=>{
    const response=await fetch(TILE_BREAK_B64_URL,{cache:'force-cache'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const encoded=(await response.text()).replace(/\s+/g,'');
    const binary=atob(encoded);
    const bytes=new Uint8Array(binary.length);
    for(let index=0;index<binary.length;index+=1)bytes[index]=binary.charCodeAt(index);
    blobUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
    return blobUrl;
  })().catch(error=>{
    loadPromise=null;
    throw error;
  });
  return loadPromise;
}

function stopTileBreak(){
  clearTimeout(timer);
  timer=0;
  if(!audio)return;
  try{
    audio.pause();
    audio.currentTime=0;
  }catch(_){}
  audio=null;
}

async function primeTileBreak(){
  if(primed)return;
  try{
    const probe=new Audio(await tileBreakSrc());
    probe.setAttribute('playsinline','');
    probe.muted=true;
    probe.volume=0;
    await probe.play();
    probe.pause();
    probe.currentTime=0;
    primed=true;
  }catch(_){}
}

async function playTileBreak(root,page){
  if(playedPage===page||currentPage(root)!==page||!isTargetStory(root))return;
  playedPage=page;
  try{
    const track=new Audio(await tileBreakSrc());
    if(currentPage(root)!==page||!isTargetStory(root))return;
    track.setAttribute('playsinline','');
    track.preload='auto';
    track.loop=false;
    track.volume=.9;
    track.playbackRate=1;
    audio=track;
    let playCount=1;
    track.onended=()=>{
      if(audio!==track)return;
      if(playCount<2&&currentPage(root)===page&&isTargetStory(root)){
        playCount+=1;
        track.currentTime=0;
        void track.play().catch(()=>{if(audio===track)audio=null;});
        return;
      }
      audio=null;
    };
    track.onerror=()=>{if(audio===track)audio=null;};
    await track.play();
  }catch(error){
    playedPage=-1;
    console.warn('Tile-break playback failed.',error);
  }
}

function scheduleTileBreak(root,page){
  stopTileBreak();
  const delay=TILE_BREAK_DELAY_BY_PAGE.get(page)??8000;
  timer=window.setTimeout(()=>{
    timer=0;
    void playTileBreak(root,page);
  },delay);
}

export function stopScene7376(){
  lastPage=-1;
  lastEnabled=null;
  playedPage=-1;
  stopTileBreak();
}

export function installScene7376(root,store){
  if(root.dataset.tileBreakInstalled==='1')return;
  root.dataset.tileBreakInstalled='1';
  void tileBreakSrc().catch(()=>{});

  const unlock=()=>{
    if(store.getState().audioOn)void primeTileBreak();
  };

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    playedPage=-1;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root))scheduleTileBreak(root,page);
    else stopTileBreak();
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
