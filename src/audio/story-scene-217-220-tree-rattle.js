import { getBase64AudioSource } from './story-b64-source.js?v=312';

const PARTS=[new URL('../../assets/audio/tree-rattle-217-220.b64?v=312',import.meta.url).href];
const EN='the tree rolled away from the road';
const PT='a árvore rolou para fora da estrada';
const FULL_EN='seventy people pulled as one';
const FULL_PT='setenta pessoas puxaram como uma só';

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
  const en=value.indexOf(EN);
  if(en>=0){
    const direct=en<=2;
    return {delay:direct?350:(value.includes(FULL_EN)?4300:Math.max(1200,en*55))};
  }
  const pt=value.indexOf(PT);
  if(pt>=0){
    const direct=pt<=2;
    return {delay:direct?350:(value.includes(FULL_PT)?4300:Math.max(1200,pt*55))};
  }
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

  document.addEventListener('pointerdown',prime,{capture:true});

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

    const originalStart=utterance.onstart;
    utterance.onstart=event=>{
      originalStart?.call(utterance,event);
      timer=window.setTimeout(trigger,match.delay);
    };

    const originalEnd=utterance.onend;
    utterance.onend=event=>{
      if(timer)window.clearTimeout(timer);
      originalEnd?.call(utterance,event);
    };

    const originalError=utterance.onerror;
    utterance.onerror=event=>{
      if(timer)window.clearTimeout(timer);
      originalError?.call(utterance,event);
    };

    return originalSpeak(utterance);
  };

  synth.__speakupTreeRattleWrapped=true;
}
