const SCENE_PAGES=new Set([73,74,75,76]);
const TILE_BREAK_DELAY_BY_PAGE=new Map([[73,7200],[74,9200],[75,7600],[76,9200]]);
const ROOF_ACCENT_DELAY_MS=620;
const CERAMIC_BREAK_DELAY_MS=3000;
const TILE_BREAK_B64_URL=new URL('../../assets/audio/tile-break.b64?v=242',import.meta.url).href;
const CERAMIC_BREAK_B64_URL=new URL('../../assets/audio/ceramic-tile-break.b64?v=242',import.meta.url).href;
const ROOF_ACCENT_PART_URLS=[
  new URL('../../assets/audio/roof-break-accent.part0?v=242',import.meta.url).href,
  new URL('../../assets/audio/roof-break-accent.part1?v=242',import.meta.url).href,
  new URL('../../assets/audio/roof-break-accent.part2?v=242',import.meta.url).href,
  new URL('../../assets/audio/roof-break-accent.part3?v=242',import.meta.url).href,
  new URL('../../assets/audio/roof-break-accent.part4?v=242',import.meta.url).href,
  new URL('../../assets/audio/roof-break-accent.part5?v=242',import.meta.url).href,
  new URL('../../assets/audio/roof-break-accent.part6?v=242',import.meta.url).href
];
const WIND_PART_URLS=[
  new URL('../../assets/audio/wind-blowing-73-76.part0?v=271',import.meta.url).href,
  new URL('../../assets/audio/wind-blowing-73-76.part1?v=271',import.meta.url).href,
  new URL('../../assets/audio/wind-blowing-73-76.part2?v=271',import.meta.url).href,
  new URL('../../assets/audio/wind-blowing-73-76.part3?v=271',import.meta.url).href
];

let tileTimer=0;
let accentTimer=0;
let ceramicTimer=0;
let tileAudio=null;
let accentAudio=null;
let ceramicAudio=null;
let windAudio=null;
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

function createBase64AudioSource(url){
  let objectUrl='';
  let loadPromise=null;

  return async function audioSource(){
    if(objectUrl)return objectUrl;
    if(loadPromise)return loadPromise;

    loadPromise=(async()=>{
      const response=await fetch(url,{cache:'force-cache'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const encoded=(await response.text()).replace(/\s+/g,'');
      const binary=atob(encoded);
      const bytes=new Uint8Array(binary.length);
      for(let index=0;index<binary.length;index+=1)bytes[index]=binary.charCodeAt(index);
      objectUrl=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
      return objectUrl;
    })().catch(error=>{
      loadPromise=null;
      throw error;
    });

    return loadPromise;
  };
}

function createChunkedAudioSource(urls){
  let objectUrl='';
  let loadPromise=null;

  return async function audioSource(){
    if(objectUrl)return objectUrl;
    if(loadPromise)return loadPromise;

    loadPromise=(async()=>{
      const responses=await Promise.all(urls.map(url=>fetch(url,{cache:'force-cache'})));
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
  };
}

function createChunkedBase64AudioSource(urls){
  let objectUrl='';
  let loadPromise=null;

  return async function audioSource(){
    if(objectUrl)return objectUrl;
    if(loadPromise)return loadPromise;

    loadPromise=(async()=>{
      const responses=await Promise.all(urls.map(url=>fetch(url,{cache:'force-cache'})));
      const failed=responses.find(response=>!response.ok);
      if(failed)throw new Error(`HTTP ${failed.status}`);
      const encodedParts=await Promise.all(responses.map(response=>response.text()));
      const byteParts=encodedParts.map(encoded=>{
        const binary=atob(encoded.replace(/\s+/g,''));
        const bytes=new Uint8Array(binary.length);
        for(let index=0;index<binary.length;index+=1)bytes[index]=binary.charCodeAt(index);
        return bytes;
      });
      objectUrl=URL.createObjectURL(new Blob(byteParts,{type:'audio/mpeg'}));
      return objectUrl;
    })().catch(error=>{
      loadPromise=null;
      throw error;
    });

    return loadPromise;
  };
}

const tileBreakSrc=createBase64AudioSource(TILE_BREAK_B64_URL);
const ceramicBreakSrc=createBase64AudioSource(CERAMIC_BREAK_B64_URL);
const roofAccentSrc=createChunkedAudioSource(ROOF_ACCENT_PART_URLS);
const windSrc=createChunkedBase64AudioSource(WIND_PART_URLS);

function stopTrack(track){
  if(!track)return;
  try{
    track.pause();
    track.currentTime=0;
  }catch(_){}
}

function stopImpactAudio(){
  clearTimeout(tileTimer);
  clearTimeout(accentTimer);
  clearTimeout(ceramicTimer);
  tileTimer=0;
  accentTimer=0;
  ceramicTimer=0;
  stopTrack(tileAudio);
  stopTrack(accentAudio);
  stopTrack(ceramicAudio);
  tileAudio=null;
  accentAudio=null;
  ceramicAudio=null;
}

function stopSceneAudio(){
  stopImpactAudio();
  stopTrack(windAudio);
}

async function getWindAudio(){
  if(windAudio)return windAudio;
  const track=new Audio(await windSrc());
  track.setAttribute('playsinline','');
  track.preload='auto';
  track.loop=true;
  track.muted=false;
  track.volume=.30;
  track.onerror=()=>console.warn('Wind ambience playback failed.');
  windAudio=track;
  return track;
}

async function ensureWind(root,page,store){
  if(!SCENE_PAGES.has(page)||currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
  try{
    const track=await getWindAudio();
    if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
    track.muted=false;
    track.loop=true;
    track.volume=.30;
    if(!track.paused&&!track.ended)return;
    await track.play();
  }catch(error){
    console.warn('Wind ambience playback failed.',error);
  }
}

async function primeSceneAudio(){
  if(primed)return;
  try{
    const [tileSrc,accentSrc,ceramicSrc,windTrack]=await Promise.all([
      tileBreakSrc(),
      roofAccentSrc(),
      ceramicBreakSrc(),
      getWindAudio()
    ]);
    const probes=[new Audio(tileSrc),new Audio(accentSrc),new Audio(ceramicSrc)];
    await Promise.all(probes.map(async probe=>{
      probe.setAttribute('playsinline','');
      probe.muted=true;
      probe.volume=0;
      await probe.play();
      probe.pause();
      probe.currentTime=0;
    }));
    windTrack.muted=true;
    windTrack.volume=0;
    await windTrack.play();
    windTrack.pause();
    windTrack.currentTime=0;
    windTrack.muted=false;
    windTrack.volume=.30;
    primed=true;
  }catch(_){}
}

async function playRoofAccent(root,page,store){
  if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
  try{
    const track=new Audio(await roofAccentSrc());
    if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
    stopTrack(accentAudio);
    track.setAttribute('playsinline','');
    track.preload='auto';
    track.loop=false;
    track.volume=.52;
    accentAudio=track;
    track.onended=()=>{if(accentAudio===track)accentAudio=null;};
    track.onerror=()=>{if(accentAudio===track)accentAudio=null;};
    await track.play();
  }catch(error){
    console.warn('Roof-break accent playback failed.',error);
  }
}

async function playCeramicBreak(root,page,store){
  if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
  try{
    const track=new Audio(await ceramicBreakSrc());
    if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
    stopTrack(ceramicAudio);
    track.setAttribute('playsinline','');
    track.preload='auto';
    track.loop=false;
    track.volume=.9;
    ceramicAudio=track;
    track.onended=()=>{if(ceramicAudio===track)ceramicAudio=null;};
    track.onerror=()=>{if(ceramicAudio===track)ceramicAudio=null;};
    await track.play();
  }catch(error){
    console.warn('Ceramic tile-break playback failed.',error);
  }
}

async function playTileBreak(root,page,store){
  if(playedPage===page||currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
  playedPage=page;
  try{
    const track=new Audio(await tileBreakSrc());
    if(currentPage(root)!==page||!isTargetStory(root)||!store.getState().audioOn)return;
    track.setAttribute('playsinline','');
    track.preload='auto';
    track.loop=false;
    track.volume=.9;
    track.playbackRate=.82;
    tileAudio=track;
    let playCount=1;
    track.onended=()=>{
      if(tileAudio!==track)return;
      if(playCount<2&&currentPage(root)===page&&isTargetStory(root)&&store.getState().audioOn){
        playCount+=1;
        track.currentTime=0;
        void track.play().catch(()=>{if(tileAudio===track)tileAudio=null;});
        return;
      }
      tileAudio=null;
    };
    track.onerror=()=>{if(tileAudio===track)tileAudio=null;};
    await track.play();

    clearTimeout(accentTimer);
    accentTimer=window.setTimeout(()=>{
      accentTimer=0;
      void playRoofAccent(root,page,store);
    },ROOF_ACCENT_DELAY_MS);

    clearTimeout(ceramicTimer);
    ceramicTimer=window.setTimeout(()=>{
      ceramicTimer=0;
      void playCeramicBreak(root,page,store);
    },CERAMIC_BREAK_DELAY_MS);
  }catch(error){
    playedPage=-1;
    console.warn('Tile-break playback failed.',error);
  }
}

function scheduleScene(root,page,store){
  stopImpactAudio();
  void ensureWind(root,page,store);
  const delay=TILE_BREAK_DELAY_BY_PAGE.get(page)??8000;
  tileTimer=window.setTimeout(()=>{
    tileTimer=0;
    void playTileBreak(root,page,store);
  },delay);
}

export function stopScene7376(){
  lastPage=-1;
  lastEnabled=null;
  playedPage=-1;
  stopSceneAudio();
}

export function installScene7376(root,store){
  if(root.dataset.tileBreakInstalled==='1')return;
  root.dataset.tileBreakInstalled='1';
  void Promise.all([tileBreakSrc(),roofAccentSrc(),ceramicBreakSrc(),windSrc()]).catch(()=>{});

  const unlock=()=>{
    if(store.getState().audioOn)void primeSceneAudio();
  };

  const sync=()=>{
    const page=currentPage(root);
    const enabled=Boolean(store.getState().audioOn);
    if(page===lastPage&&enabled===lastEnabled)return;
    lastPage=page;
    lastEnabled=enabled;
    playedPage=-1;
    if(enabled&&SCENE_PAGES.has(page)&&isTargetStory(root))scheduleScene(root,page,store);
    else stopSceneAudio();
  };

  root.addEventListener('pointerdown',unlock,{capture:true});
  root.addEventListener('click',unlock,{capture:true});

  const observer=new MutationObserver(sync);
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  sync();
}
