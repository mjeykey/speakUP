import { getBase64AudioSource } from './story-b64-source.js?v=309';

const PARTS=[new URL('../../assets/audio/tree-rattle-217-220.b64?v=309',import.meta.url).href];
const EN='the tree rolled away from the road';
const PT='a árvore rolou para fora da estrada';

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
    player.volume=1;
    audio=player;
    return player;
  })().catch(error=>{audioPromise=null;throw error;});
  return audioPromise;
}

function reset(player=audio){
  if(!player)return;
  try{player.pause();player.currentTime=0;}catch(_){ }
}

async function playOnce(){
  let player;
  try{player=await getAudio();}catch(_){return;}
  reset(player);
  player.loop=false;
  player.playbackRate=1;
  player.volume=1;
  try{await player.play();}catch(_){ }
}

function matchInfo(text=''){
  const value=String(text).toLocaleLowerCase();
  let index=value.indexOf(EN);
  if(index>=0)return {index,anchor:index+EN.indexOf('rolled')};
  index=value.indexOf(PT);
  if(index>=0)return {index,anchor:index+PT.indexOf('rolou')};
  return null;
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
    const match=matchInfo(utterance?.text);
    if(!utterance||!match||utterance.__speakupTreeRattleInserted)return originalSpeak(utterance);

    utterance.__speakupTreeRattleInserted=true;
    let played=false;
    let timer=null;
    const trigger=()=>{
      if(played)return;
      played=true;
      if(timer)window.clearTimeout(timer);
      void playOnce();
    };

    utterance.addEventListener?.('boundary',event=>{
      const charIndex=Number(event.charIndex);
      if(Number.isFinite(charIndex)&&charIndex>=match.anchor&&!played){
        if(timer)window.clearTimeout(timer);
        timer=window.setTimeout(trigger,300);
      }
    });

    const originalStart=utterance.onstart;
    utterance.onstart=event=>{
      originalStart?.call(utterance,event);
      timer=window.setTimeout(trigger,Math.max(1800,Math.min(7000,match.anchor*55)));
    };

    const originalEnd=utterance.onend;
    utterance.onend=event=>{
      if(timer)window.clearTimeout(timer);
      if(!played)trigger();
      originalEnd?.call(utterance,event);
    };

    return originalSpeak(utterance);
  };

  synth.__speakupTreeRattleWrapped=true;
}
