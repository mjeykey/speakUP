import { getBase64AudioSource } from './story-b64-source.js?v=302';

const TARGET_PAGES=new Set([217,218,219,220]);
const PARTS=[new URL('../../assets/audio/tree-rattle-217-220.b64?v=302',import.meta.url).href];

let audio=null;
let audioPromise=null;
let installed=false;

function currentPage(){
  const text=document.querySelector('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):0;
}

async function getAudio(){
  if(audio)return audio;
  if(audioPromise)return audioPromise;
  audioPromise=(async()=>{
    const src=await getBase64AudioSource(PARTS);
    const player=new Audio(src);
    player.setAttribute('playsinline','');
    player.preload='auto';
    player.loop=false;
    player.volume=1;
    audio=player;
    return player;
  })().catch(error=>{audioPromise=null;throw error;});
  return audioPromise;
}

function reset(){
  if(!audio)return;
  try{audio.pause();audio.currentTime=0;}catch(_){ }
}

async function playOnce(){
  let player;
  try{player=await getAudio();}catch(_){return;}
  reset();
  player.volume=1;
  void Promise.resolve(player.play()).catch(()=>{});
}

function anchorIndex(text=''){
  const value=String(text).toLocaleLowerCase();
  for(const term of ['the tree','a árvore']){
    const index=value.indexOf(term);
    if(index>=0)return index;
  }
  return -1;
}

function prime(){
  void getAudio().then(player=>{
    const oldVolume=player.volume;
    player.volume=0;
    try{player.currentTime=0;}catch(_){ }
    void Promise.resolve(player.play()).then(()=>{
      window.setTimeout(()=>{try{player.pause();player.currentTime=0;player.volume=oldVolume;}catch(_){ }},80);
    }).catch(()=>{player.volume=oldVolume;});
  }).catch(()=>{});
}

export function installScene217220TreeRattle(){
  if(installed)return;
  installed=true;
  void getAudio().catch(()=>{});

  document.addEventListener('pointerdown',event=>{
    if(event.target.closest('[data-next],[data-prev],[data-start]'))prime();
  },true);

  const synth=window.speechSynthesis;
  if(!synth||typeof synth.speak!=='function'||synth.__speakupTreeRattleWrapped)return;
  const originalSpeak=synth.speak.bind(synth);

  synth.speak=utterance=>{
    const page=currentPage();
    const anchor=anchorIndex(utterance?.text);
    const shouldInsert=TARGET_PAGES.has(page)&&anchor>=0&&!utterance?.__speakupTreeRattleInserted;
    if(!shouldInsert)return originalSpeak(utterance);

    utterance.__speakupTreeRattleInserted=true;
    let played=false;
    let fallbackTimer=null;

    const trigger=()=>{
      if(played)return;
      played=true;
      if(fallbackTimer)window.clearTimeout(fallbackTimer);
      void playOnce();
    };

    utterance.addEventListener?.('boundary',event=>{
      const charIndex=Number(event.charIndex);
      if(Number.isFinite(charIndex)&&charIndex>=anchor)trigger();
    });

    const originalStart=utterance.onstart;
    utterance.onstart=event=>{
      originalStart?.call(utterance,event);
      const estimatedMs=Math.max(250,Math.min(4200,anchor*52));
      fallbackTimer=window.setTimeout(trigger,estimatedMs);
    };

    const originalEnd=utterance.onend;
    utterance.onend=event=>{
      if(fallbackTimer)window.clearTimeout(fallbackTimer);
      if(!played)trigger();
      originalEnd?.call(utterance,event);
    };

    return originalSpeak(utterance);
  };

  synth.__speakupTreeRattleWrapped=true;
}
