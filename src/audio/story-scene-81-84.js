import { stopStoryEffects } from './story-effects.js?v=270';

const SCENE_PAGES=new Set([81,82,83,84]);
const STREAM_PART_URLS=[
  new URL('../../assets/audio/water-stream-81-84.part0?v=276',import.meta.url).href,
  new URL('../../assets/audio/water-stream-81-84.part1?v=276',import.meta.url).href,
  new URL('../../assets/audio/water-stream-81-84.part2?v=276',import.meta.url).href,
  new URL('../../assets/audio/water-stream-81-84.part3?v=276',import.meta.url).href,
  new URL('../../assets/audio/water-stream-81-84.part4?v=276',import.meta.url).href,
  new URL('../../assets/audio/water-stream-81-84.part5?v=276',import.meta.url).href
];

let objectUrl='';
let loadPromise=null;
let lastPage=-1;
let lastEnabled=null;
let primed=false;
let active=false;
let streamAudio=null;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

async function waterStreamSrc(){
  if(objectUrl)return objectUrl;
  if(loadPromise)return loadPromise;

  loadPromise=(async()=>{
    const responses=await Promise.all(
      STREAM_PART_URLS.map(url=>fetch(url,{cache:'force-cache'}))
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

function stopStream(){
  active=false;
  if(!streamAudio)return;
  try{
    streamAudio.pause();
    streamAudio.currentTime=0;
  }catch(_){}
  streamAudio=null;
}

async function primeStream(){
  if(primed)return;
  try{
    const probe=new Audio(await waterStreamSrc());
    probe.setAttribute('playsinline','');
    probe.muted=true;
    probe.volume=0;
    await probe.play();
    probe.pause();
    probe.currentTime=0;
    primed=true;
  }catch(_){}
}

async function playStream(root,store){
  if(active)return;
  if(
    !SCENE_PAGES.has(currentPage(root))||
    !isTargetStory(root)||
    !store.getState().audioOn
  )return;

  try{
    const track=new Audio(await waterStreamSrc());
    if(
      !SCENE_PAGES.has(currentPage(root))||
      !isTargetStory(root)||
      !store.getState().audioOn
    )return;

    track.setAttribute('playsinline','');
    track.preload='auto';
    track.loop=true;
    track.volume=.9;
    streamAudio=track;
    await track.play();
    active=true;
    track.onerror=()=>{
      if(streamAudio===track)stopStream();
    };
  }catch(error){
    active=false;
    console.warn('Water-stream playback failed.',error);
  }
}

export function stopScene8184(){
  lastPage=-1;
  lastEnabled=null;
  stopStream();
}

export function installScene8184(root,store){
  if(root.dataset.waterStreamInstalled==='1')return;
  root.dataset.waterStreamInstalled='1';
  void waterStreamSrc().catch(()=>{});

  const unlock=()=>{
    if(store.getState().audioOn)void primeStream();
  };

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;

    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root)){
      stopStoryEffects();
      void playStream(root,store);
    }else stopStream();
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
