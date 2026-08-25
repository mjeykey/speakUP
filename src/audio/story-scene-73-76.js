const SCENE_PAGES=new Set([73,74,75,76]);
const TILE_DELAY_BY_PAGE=new Map([[73,7200],[74,9200],[75,7600],[76,9200]]);
const TILE_URL=new URL('../../assets/audio/freesound_community-tiles-smashing-90254-mobile.mp3?v=275',import.meta.url).href;

let timer=0;
let lastPage=-1;
let lastEnabled=null;
let primed=false;

const tileAudio=new Audio(TILE_URL);
tileAudio.setAttribute('playsinline','');
tileAudio.preload='auto';
tileAudio.loop=false;
tileAudio.volume=.9;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function stopTiles(){
  clearTimeout(timer);
  timer=0;
  try{
    tileAudio.pause();
    tileAudio.currentTime=0;
    tileAudio.muted=false;
    tileAudio.volume=.9;
  }catch(_){}
}

function primeTiles(){
  if(primed)return;
  tileAudio.muted=true;
  tileAudio.volume=0;
  const promise=tileAudio.play();
  if(!promise||typeof promise.then!=='function')return;
  promise.then(()=>{
    tileAudio.pause();
    tileAudio.currentTime=0;
    tileAudio.muted=false;
    tileAudio.volume=.9;
    primed=true;
  }).catch(()=>{
    tileAudio.muted=false;
    tileAudio.volume=.9;
  });
}

function scheduleTiles(root,page,store){
  stopTiles();
  const delay=TILE_DELAY_BY_PAGE.get(page)??8000;
  timer=window.setTimeout(async()=>{
    timer=0;
    if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
    try{
      tileAudio.pause();
      tileAudio.currentTime=0;
      tileAudio.muted=false;
      tileAudio.volume=.9;
      await tileAudio.play();
    }catch(error){
      console.warn('Tiles playback failed.',error);
    }
  },delay);
}

export function stopScene7376(){
  lastPage=-1;
  lastEnabled=null;
  stopTiles();
}

export function installScene7376(root,store){
  if(root.dataset.tilesOnlyInstalled==='1')return;
  root.dataset.tilesOnlyInstalled='1';

  try{tileAudio.load();}catch(_){}

  const unlock=()=>{
    if(store.getState().audioOn)primeTiles();
  };

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root))scheduleTiles(root,page,store);
    else stopTiles();
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
