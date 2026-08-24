const SCENE_PAGES=new Set([77,78,79,80]);
const ROCK_DELAY_BY_PAGE=new Map([[77,4500],[78,5200],[79,4500],[80,5200]]);
const ROCK_PART_URLS=[
  new URL('../../assets/audio/falling-rocks.part0?v=245',import.meta.url).href,
  new URL('../../assets/audio/falling-rocks.part1?v=245',import.meta.url).href,
  new URL('../../assets/audio/falling-rocks.part2?v=245',import.meta.url).href,
  new URL('../../assets/audio/falling-rocks.part3?v=245',import.meta.url).href,
  new URL('../../assets/audio/falling-rocks.part4?v=245',import.meta.url).href
];

let timer=0;
let audio=null;
let objectUrl='';
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

async function fallingRocksSrc(){
  if(objectUrl)return objectUrl;
  if(loadPromise)return loadPromise;

  loadPromise=(async()=>{
    const responses=await Promise.all(
      ROCK_PART_URLS.map(url=>fetch(url,{cache:'force-cache'}))
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

function stopRocks(){
  clearTimeout(timer);
  timer=0;
  if(!audio)return;
  try{
    audio.pause();
    audio.currentTime=0;
  }catch(_){}
  audio=null;
}

async function primeRocks(){
  if(primed)return;
  try{
    const probe=new Audio(await fallingRocksSrc());
    probe.setAttribute('playsinline','');
    probe.muted=true;
    probe.volume=0;
    await probe.play();
    probe.pause();
    probe.currentTime=0;
    primed=true;
  }catch(_){}
}

async function playRocks(root,page,store){
  if(
    playedPage===page||
    currentPage(root)!==page||
    !isTargetStory(root)||
    !store.getState().audioOn
  )return;

  playedPage=page;

  try{
    const track=new Audio(await fallingRocksSrc());
    if(
      currentPage(root)!==page||
      !isTargetStory(root)||
      !store.getState().audioOn
    )return;

    track.setAttribute('playsinline','');
    track.preload='auto';
    track.loop=false;
    track.volume=.72;
    audio=track;
    track.onended=()=>{if(audio===track)audio=null;};
    track.onerror=()=>{if(audio===track)audio=null;};
    await track.play();
  }catch(error){
    playedPage=-1;
    console.warn('Falling-rocks playback failed.',error);
  }
}

function scheduleRocks(root,page,store){
  stopRocks();
  const delay=ROCK_DELAY_BY_PAGE.get(page)??4800;
  timer=window.setTimeout(()=>{
    timer=0;
    void playRocks(root,page,store);
  },delay);
}

export function stopScene7780(){
  lastPage=-1;
  lastEnabled=null;
  playedPage=-1;
  stopRocks();
}

export function installScene7780(root,store){
  if(root.dataset.fallingRocksInstalled==='1')return;
  root.dataset.fallingRocksInstalled='1';
  void fallingRocksSrc().catch(()=>{});

  const unlock=()=>{
    if(store.getState().audioOn)void primeRocks();
  };

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    playedPage=-1;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root))scheduleRocks(root,page,store);
    else stopRocks();
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
