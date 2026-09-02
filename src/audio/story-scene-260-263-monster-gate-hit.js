const MONSTER_B64_URL=new URL('../../assets/audio/monster-growl-213.b64?v=335',import.meta.url).href;
const HIT_B64_URL=new URL('../../assets/audio/cinematic-gate-hit-260-263.b64?v=335',import.meta.url).href;

let monster=null;
let hit=null;
let installed=false;
let observer=null;
let monsterTimer=null;
let hitTimer=null;
let currentPage=null;

async function audioFromBase64(url){
  const response=await fetch(url,{cache:'force-cache'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const encoded=(await response.text()).replace(/\s+/g,'');
  const audio=new Audio(`data:audio/mpeg;base64,${encoded}`);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.muted=false;
  audio.volume=1;
  return audio;
}

async function getMonster(){
  if(monster)return monster;
  monster=await audioFromBase64(MONSTER_B64_URL);
  return monster;
}

async function getHit(){
  if(hit)return hit;
  hit=await audioFromBase64(HIT_B64_URL);
  return hit;
}

function reset(audio){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){}
}

async function play(audioPromise,label,volume=1){
  try{
    const audio=await audioPromise;
    reset(audio);
    audio.muted=false;
    audio.loop=false;
    audio.volume=volume;
    audio.playbackRate=1;
    try{audio.currentTime=0;}catch(_){}
    void Promise.resolve(audio.play()).catch(error=>console.warn(`${label} playback failed.`,error));
  }catch(error){
    console.warn(`${label} load failed.`,error);
  }
}

function pageNumber(root){
  const text=root?.querySelector?.('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):null;
}

function prime(){
  [getMonster(),getHit()].forEach(promise=>{
    void promise.then(audio=>{
      const oldVolume=audio.volume;
      audio.volume=0;
      reset(audio);
      void Promise.resolve(audio.play()).then(()=>{
        window.setTimeout(()=>{reset(audio);audio.volume=oldVolume;},80);
      }).catch(()=>{audio.volume=oldVolume;});
    }).catch(()=>{});
  });
}

export function installScene260263MonsterGateHit(root,store){
  if(installed)return;
  installed=true;
  void getMonster().catch(()=>{});
  void getHit().catch(()=>{});
  document.addEventListener('pointerdown',prime,{capture:true});

  const target=root||document.body;
  const scan=()=>{
    const page=pageNumber(target);
    const inRange=page>=260&&page<=263;
    if(!inRange){
      currentPage=null;
      if(monsterTimer){window.clearTimeout(monsterTimer);monsterTimer=null;}
      if(hitTimer){window.clearTimeout(hitTimer);hitTimer=null;}
      reset(monster);
      reset(hit);
      return;
    }
    if(page===currentPage)return;
    currentPage=page;
    if(monsterTimer)window.clearTimeout(monsterTimer);
    if(hitTimer)window.clearTimeout(hitTimer);

    monsterTimer=window.setTimeout(()=>{
      monsterTimer=null;
      if(pageNumber(target)!==page)return;
      if(store?.getState&&store.getState().audioOn===false)return;
      void play(getMonster(),'Monster growl',.9);
    },650);

    // Page 260 contains “the creature reached the gate”; hit the word “gate” cinematically.
    if(page===260){
      hitTimer=window.setTimeout(()=>{
        hitTimer=null;
        if(pageNumber(target)!==page)return;
        if(store?.getState&&store.getState().audioOn===false)return;
        void play(getHit(),'Cinematic gate hit',1);
      },2500);
    }
  };

  observer=new MutationObserver(scan);
  observer.observe(target,{subtree:true,childList:true,characterData:true});
  scan();
}
