const SCENE_PAGES=new Set([73,74,75,76]);
const WAGON_DELAY_BY_PAGE=new Map([[73,4.8],[74,5.8],[75,4.8],[76,5.8]]);
const WAGON_URL=new URL('../../assets/audio/dragon-studio-hammer-smash-effect-382731-mobile.mp3?v=235',import.meta.url).href;
let timer=0;
let audio=null;
let lastPage=-1;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function stopWagon(){
  clearTimeout(timer);
  timer=0;
  if(audio){
    try{audio.pause();audio.currentTime=0;}catch(_){}
    audio=null;
  }
}

function scheduleWagon(root,page){
  stopWagon();
  const delay=(WAGON_DELAY_BY_PAGE.get(page)??5)*1000;
  timer=window.setTimeout(async()=>{
    timer=0;
    if(currentPage(root)!==page)return;
    try{
      const track=new Audio(WAGON_URL);
      track.preload='auto';
      track.loop=false;
      track.volume=1;
      track.setAttribute('playsinline','');
      audio=track;
      track.onended=()=>{if(audio===track)audio=null;};
      track.onerror=()=>{if(audio===track)audio=null;};
      await track.play();
    }catch(error){
      console.warn('Wagon sound playback failed.',error);
    }
  },delay);
}

export function stopScene7376(){
  lastPage=-1;
  stopWagon();
}

export function installScene7376(root,store){
  if(root.dataset.wagonOnlyInstalled==='1')return;
  root.dataset.wagonOnlyInstalled='1';

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage)return;
    lastPage=page;
    if(enabled&&SCENE_PAGES.has(page))scheduleWagon(root,page);
    else stopWagon();
  };

  root.addEventListener('pointerdown',()=>{
    if(!store.getState().audioOn)return;
    const warmup=new Audio(WAGON_URL);
    warmup.muted=true;
    void warmup.play().then(()=>{warmup.pause();}).catch(()=>{});
  },{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
