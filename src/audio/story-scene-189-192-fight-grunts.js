import { getBase64AudioSource } from './story-b64-source.js?v=297';

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
const PART_URLS=Array.from({length:8},(_,index)=>
  new URL(`../../assets/audio/fight-punch-hits-189.part${String(index).padStart(2,'0')}.b64?v=297`,import.meta.url).href
);

let audio=null;
let installed=false;
let audioPromise=null;

function currentPage(){
  const text=document.querySelector('.story-progress')?.textContent||'';
  const match=text.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function normalized(text){
  return String(text||'').toLocaleLowerCase();
}

function isFightLine(text){
  const value=normalized(text);
  return FIGHT_TERMS.some(term=>value.includes(term));
}

function fightAnchorIndex(text){
  const value=normalized(text);
  let best=-1;
  for(const term of FIGHT_TERMS){
    const index=value.indexOf(term);
    if(index>=0&&(best<0||index<best))best=index;
  }
  return best;
}

async function getAudio(){
  if(audio)return audio;
  if(!audioPromise){
    audioPromise=getBase64AudioSource(PART_URLS).then(source=>{
      const player=new Audio(source);
      player.setAttribute('playsinline','');
      player.preload='auto';
      player.loop=false;
      player.muted=false;
      player.volume=.96;
      player.playbackRate=.75;
      audio=player;
      return player;
    }).catch(error=>{
      audioPromise=null;
      throw error;
    });
  }
  return audioPromise;
}

function stopFight(){
  if(!audio)return;
  try{audio.pause();}catch(_){ }
  try{audio.currentTime=0;}catch(_){ }
}

function primeFight(){
  void getAudio().then(player=>{
    player.loop=false;
    player.muted=false;
    player.volume=0;
    player.playbackRate=.75;
    try{player.currentTime=0;}catch(_){ }
    return player.play();
  }).then(()=>{
    if(audio){
      try{audio.pause();audio.currentTime=0;}catch(_){ }
      audio.volume=.96;
    }
  }).catch(()=>{});
}

async function playFightOnce(){
  const player=await getAudio();
  player.loop=false;
  player.muted=false;
  player.volume=.96;
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
    const timer=window.setTimeout(finish,3600);
    player.addEventListener('ended',finish,{once:true});
    player.addEventListener('error',finish,{once:true});
    void Promise.resolve(player.play()).catch(finish);
  });
}

export function installScene189192FightGrunts(){
  if(installed)return;
  installed=true;
  void getBase64AudioSource(PART_URLS).catch(()=>{});

  document.addEventListener('pointerdown',event=>{
    if(event.target.closest('[data-next],[data-prev],[data-start]'))primeFight();
  },true);

  const synth=window.speechSynthesis;
  if(!synth||typeof synth.speak!=='function'||synth.__speakupFightGruntsWrapped)return;

  const originalSpeak=synth.speak.bind(synth);
  synth.speak=utterance=>{
    const page=currentPage();
    const text=String(utterance?.text||'');
    const shouldInsert=TARGET_PAGES.has(page)&&isFightLine(text)&&!utterance.__speakupFightGruntsInserted;

    if(shouldInsert){
      utterance.__speakupFightGruntsInserted=true;
      const anchor=fightAnchorIndex(text);
      const originalEnd=utterance.onend;
      const originalError=utterance.onerror;
      let inserted=false;
      let speechPaused=false;

      const insertFight=()=>{
        if(inserted)return;
        inserted=true;
        try{
          synth.pause();
          speechPaused=true;
        }catch(_){ }
        void playFightOnce().finally(()=>{
          if(speechPaused){
            try{synth.resume();}catch(_){ }
            speechPaused=false;
          }
        });
      };

      utterance.addEventListener('boundary',event=>{
        if(inserted||anchor<0)return;
        const charIndex=Number(event.charIndex)||0;
        if(charIndex>=anchor)insertFight();
      });

      utterance.onend=event=>{
        if(!inserted){
          void playFightOnce().then(()=>originalEnd?.call(utterance,event));
          return;
        }
        originalEnd?.call(utterance,event);
      };
      utterance.onerror=event=>{
        stopFight();
        if(speechPaused){
          try{synth.resume();}catch(_){ }
          speechPaused=false;
        }
        originalError?.call(utterance,event);
      };
    }

    return originalSpeak(utterance);
  };
  synth.__speakupFightGruntsWrapped=true;
}
