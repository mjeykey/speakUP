const WOOD_PARTS=[
  new URL('../../assets/audio/wood-creaks-253-256.part0.b64?v=333',import.meta.url).href,
  new URL('../../assets/audio/wood-creaks-253-256.part1.b64?v=333',import.meta.url).href,
  new URL('../../assets/audio/wood-creaks-253-256.part2.b64?v=333',import.meta.url).href
];

let audio=null;
let sourcePromise=null;
let installed=false;
let observer=null;
let timer=null;
let currentPage=null;

async function getAudio(){
  if(audio)return audio;
  if(sourcePromise)return sourcePromise;
  sourcePromise=(async()=>{
    const responses=await Promise.all(WOOD_PARTS.map(url=>fetch(url,{cache:'force-cache'})));
    const failed=responses.find(response=>!response.ok);
    if(failed)throw new Error(`HTTP ${failed.status}`);
    const encoded=(await Promise.all(responses.map(response=>response.text()))).join('').replace(/\s+/g,'');
    const player=new Audio(`data:audio/mpeg;base64,${encoded}`);
    player.setAttribute('playsinline','');
    player.preload='auto';
    player.loop=false;
    player.muted=false;
    player.volume=1;
    audio=player;
    return player;
  })().catch(error=>{sourcePromise=null;throw error;});
  return sourcePromise;
}

function reset(player=audio){
  if(!player)return;
  try{player.pause();player.currentTime=0;}catch(_){}
}

async function playWood(){
  let player;
  try{player=await getAudio();}catch(error){console.warn('Wood creak load failed.',error);return;}
  reset(player);
  player.muted=false;
  player.loop=false;
  player.volume=1;
  player.playbackRate=1;
  try{player.currentTime=0;}catch(_){}
  void Promise.resolve(player.play()).catch(error=>console.warn('Wood creak playback failed.',error));
}

function pageNumber(root){
  const text=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):null;
}

function prime(){
  void getAudio().then(player=>{
    const oldVolume=player.volume;
    player.volume=0;
    reset(player);
    void Promise.resolve(player.play()).then(()=>{
      window.setTimeout(()=>{reset(player);player.volume=oldVolume;},80);
    }).catch(()=>{player.volume=oldVolume;});
  }).catch(()=>{});
}

export function installScene253256WoodCreak(root,store){
  if(installed)return;
  installed=true;
  void getAudio().catch(()=>{});
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const page=pageNumber(target);
    const inRange=page>=253&&page<=256;
    if(!inRange){
      currentPage=null;
      if(timer){window.clearTimeout(timer);timer=null;}
      reset();
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(timer)window.clearTimeout(timer);
    // Trigger around “Wood cracked” after the wagon strikes the ancient doors.
    timer=window.setTimeout(()=>{
      timer=null;
      if(pageNumber(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      void playWood();
    },2100);
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
