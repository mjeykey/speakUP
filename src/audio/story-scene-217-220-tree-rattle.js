import { getBase64AudioSource } from './story-b64-source.js?v=301';

const TARGET_EN='“Again!” Kael shouted. Seventy people pulled as one. The tree rolled away from the road.';
const TARGET_PT='“Outra vez!”, gritou Kael. Setenta pessoas puxaram como uma só. A árvore rolou para fora da estrada.';
const PARTS=[new URL('../../assets/audio/tree-rattle-217-220.b64?v=301',import.meta.url).href];

let audio=null;
let audioPromise=null;
let installed=false;

async function getAudio(){
  if(audio)return audio;
  if(audioPromise)return audioPromise;
  audioPromise=(async()=>{
    const src=await getBase64AudioSource(PARTS);
    const player=new Audio(src);
    player.setAttribute('playsinline','');
    player.preload='auto';
    player.loop=false;
    player.volume=.95;
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
  player.volume=.95;
  void Promise.resolve(player.play()).catch(()=>{});
}

function isTarget(text=''){
  const value=String(text).trim();
  return value.includes(TARGET_EN)||value.includes(TARGET_PT);
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
      window.setTimeout(()=>{try{player.pause();player.currentTime=0;player.volume=oldVolume;}catch(_){ }},60);
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
    if(!utterance||!isTarget(utterance.text)||utterance.__speakupTreeRattleInserted){
      return originalSpeak(utterance);
    }

    utterance.__speakupTreeRattleInserted=true;
    const anchor=anchorIndex(utterance.text);
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
      if(Number.isFinite(charIndex)&&anchor>=0&&charIndex>=anchor)trigger();
    });

    const originalStart=utterance.onstart;
    utterance.onstart=event=>{
      originalStart?.call(utterance,event);
      // Android/Chrome sometimes omits word-boundary events. Time this to the second sentence as fallback.
      fallbackTimer=window.setTimeout(trigger,3300);
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
