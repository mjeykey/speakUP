import { FIGHT_GRUNTS_189 } from './story-fight-grunts-189-data.js?v=295';

const TARGET_PAGES=new Set([189,190,192]);
const FIGHT_TERMS=[
  'fought in the aisle',
  'lutaram no corredor',
  'kämpften im gang',
  'lucharon en el pasillo',
  'se battirent dans l’allée',
  'se sont battus dans l’allée',
  'combatterono nel corridoio',
  'borili su se u prolazu'
];

let audio=null;
let installed=false;

function currentPage(){
  const text=document.querySelector('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isFightLine(text){
  const value=String(text||'').toLocaleLowerCase();
  return FIGHT_TERMS.some(term=>value.includes(term));
}

function getAudio(){
  if(audio)return audio;
  audio=new Audio(FIGHT_GRUNTS_189);
  audio.setAttribute('playsinline','');
  audio.preload='auto';
  audio.loop=false;
  audio.muted=false;
  audio.volume=.92;
  audio.playbackRate=.75;
  return audio;
}

function stopFight(){
  if(!audio)return;
  try{audio.pause();}catch(_){ }
  try{audio.currentTime=0;}catch(_){ }
}

function primeFight(){
  const player=getAudio();
  player.loop=true;
  player.muted=false;
  player.volume=0;
  player.playbackRate=.75;
  try{player.currentTime=0;}catch(_){ }
  if(!player.paused&&!player.ended)return;
  void Promise.resolve(player.play()).catch(()=>{});
}

function playFightOnce(){
  const player=getAudio();
  player.loop=false;
  player.muted=false;
  player.volume=.92;
  player.playbackRate=.75;
  try{player.currentTime=0;}catch(_){ }

  return new Promise(resolve=>{
    let done=false;
    const finish=()=>{
      if(done)return;
      done=true;
      window.clearTimeout(timer);
      player.removeEventListener('ended',finish);
      player.removeEventListener('error',finish);
      stopFight();
      resolve();
    };
    const timer=window.setTimeout(finish,5200);
    player.addEventListener('ended',finish,{once:true});
    player.addEventListener('error',finish,{once:true});

    if(player.paused||player.ended){
      void Promise.resolve(player.play()).catch(finish);
    }
  });
}

export function installScene189192FightGrunts(){
  if(installed)return;
  installed=true;

  document.addEventListener('pointerdown',event=>{
    if(event.target.closest('[data-next],[data-prev],[data-start]'))primeFight();
  },true);

  const synth=window.speechSynthesis;
  if(!synth||typeof synth.speak!=='function'||synth.__speakupFightGruntsWrapped)return;

  const originalSpeak=synth.speak.bind(synth);
  synth.speak=utterance=>{
    const page=currentPage();
    const shouldInsert=TARGET_PAGES.has(page)&&isFightLine(utterance?.text)&&!utterance.__speakupFightGruntsInserted;

    if(shouldInsert){
      utterance.__speakupFightGruntsInserted=true;
      const originalEnd=utterance.onend;
      const originalError=utterance.onerror;

      utterance.onend=event=>{
        void playFightOnce().then(()=>originalEnd?.call(utterance,event));
      };
      utterance.onerror=event=>{
        stopFight();
        originalError?.call(utterance,event);
      };
    }

    return originalSpeak(utterance);
  };
  synth.__speakupFightGruntsWrapped=true;
}
