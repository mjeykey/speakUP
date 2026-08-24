import { stopStoryEffects } from './story-effects.js?v=250';

const SCENE_PAGES=new Set([89,90,91,92]);
const CRACK_DELAY_BY_PAGE=new Map([[89,450],[90,650],[91,700],[92,650]]);
const CRACK_PART_URLS=[
  new URL('../../assets/audio/stone-floor-crack.part0?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part1?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part2?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part3?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part4?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part5?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part6?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part7?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part8?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part9?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part10?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part11?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part12?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part13?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part14?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part15?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part16?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part17?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part18?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part19?v=251',import.meta.url).href,
  new URL('../../assets/audio/stone-floor-crack.part20?v=251',import.meta.url).href
];

let timer=0;
let audio=null;
let objectUrl='';
let loadPromise=null;
let lastPage=-1;
let lastEnabled=null;
let playedPage=-1;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  const title=root.querySelector('h1')?.textContent||'';
  const subtitle=root.querySelector('.story-subtitle')?.textContent||'';
  return /Last Wagon of Avarin/i.test(`${title} ${subtitle}`);
}

async function crackSrc(){
  if(objectUrl)return objectUrl;
  if(loadPromise)return loadPromise;

  loadPromise=(async()=>{
    const responses=await Promise.all(
      CRACK_PART_URLS.map(url=>fetch(url,{cache:'force-cache'}))
    );
    const failed=responses.find(response=>!response.ok);
    if(failed)throw new Error(`HTTP ${failed.status}`);
    const parts=await Promise.all(responses.map(response=>response.arrayBuffer()));
    objectUrl=URL.createObjectURL(new Blob(parts,{type:'audio/mpeg'}));
    return objectUrl;
  })().catch(error=>{
    loadPromise=null;
    throw error;
  });

  return loadPromise;
}

function stopCrack(){
  clearTimeout(timer);
  timer=0;
  if(audio){
    try{audio.pause();}catch(_){}
    try{audio.currentTime=0;}catch(_){}
  }
  audio=null;
}

async function playCrack(root,page,store){
  if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
  try{
    const track=new Audio(await crackSrc());
    if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
    stopCrack();
    track.setAttribute('playsinline','');
    track.preload='auto';
    track.loop=false;
    track.volume=.48;
    audio=track;
    track.onended=()=>{if(audio===track)audio=null;};
    track.onerror=()=>{if(audio===track)audio=null;};
    await track.play();
  }catch(error){
    console.warn('Stone-floor crack playback failed.',error);
  }
}

function sync(root,store){
  const page=currentPage(root);
  const enabled=Boolean(store.getState().audioOn);
  const target=enabled&&SCENE_PAGES.has(page)&&isTargetStory(root);

  if(page!==lastPage||enabled!==lastEnabled){
    stopCrack();
    playedPage=-1;
    lastPage=page;
    lastEnabled=enabled;
  }

  if(!target)return;
  stopStoryEffects();
  if(playedPage===page)return;

  playedPage=page;
  const delay=CRACK_DELAY_BY_PAGE.get(page)??600;
  timer=window.setTimeout(()=>{
    timer=0;
    void playCrack(root,page,store);
  },delay);
}

export function installScene8992(root,store){
  if(root.dataset.scene8992Installed==='1')return;
  root.dataset.scene8992Installed='1';

  void crackSrc().catch(()=>{});

  const observer=new MutationObserver(()=>sync(root,store));
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  root.addEventListener('pointerdown',()=>sync(root,store),{capture:true});
  root.addEventListener('click',()=>sync(root,store),{capture:true});
  sync(root,store);
}
