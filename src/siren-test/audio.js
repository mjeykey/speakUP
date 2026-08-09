let stormAudio=null,sirenAudio=null,flashTimer=null,rumbleCtx=null;
const STORM='https://assets.mixkit.co/active_storage/sfx/2402/2402-preview.mp3';
const SIREN='./assets/audio/siren-loop.mp3';

export async function startAudio(){
  if(stormAudio||sirenAudio)return;

  stormAudio=new Audio(STORM);
  stormAudio.loop=true;
  stormAudio.preload='auto';
  stormAudio.volume=.62;

  sirenAudio=new Audio(SIREN);
  sirenAudio.loop=true;
  sirenAudio.preload='auto';
  sirenAudio.volume=.72;

  try{
    await Promise.all([stormAudio.play(),sirenAudio.play()]);
  }catch(e){
    console.warn('Storm or siren audio unavailable',e);
    try{await sirenAudio.play()}catch(_e){}
    try{await stormAudio.play()}catch(_e){}
  }

  scheduleLightning();
}

function scheduleLightning(){
  clearTimeout(flashTimer);
  flashTimer=setTimeout(()=>{
    const f=document.getElementById('flash');
    if(f){f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}
    thunderRumble();
    scheduleLightning();
  },5200+Math.random()*7600);
}

function thunderRumble(){
  try{
    if(!rumbleCtx)rumbleCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(rumbleCtx.state==='suspended')rumbleCtx.resume();
    const now=rumbleCtx.currentTime;
    const gain=rumbleCtx.createGain();
    gain.gain.setValueAtTime(.001,now);
    gain.gain.exponentialRampToValueAtTime(.25,now+.18);
    gain.gain.exponentialRampToValueAtTime(.07,now+1.4);
    gain.gain.exponentialRampToValueAtTime(.001,now+4.6);
    gain.connect(rumbleCtx.destination);
    [44,56,67].forEach((hz,n)=>{
      const o=rumbleCtx.createOscillator();
      o.type='sine';
      o.frequency.setValueAtTime(hz,now);
      o.frequency.exponentialRampToValueAtTime(hz*.64,now+4);
      const og=rumbleCtx.createGain();
      og.gain.value=.42/(n+1);
      o.connect(og).connect(gain);
      o.start(now+n*.04);
      o.stop(now+4.8);
    });
  }catch(e){}
}

export function softenAudio(){
  if(stormAudio)stormAudio.volume=.14;
  if(sirenAudio)sirenAudio.volume=.08;
}

export function stopAudio(){
  clearTimeout(flashTimer);
  if(stormAudio){stormAudio.pause();stormAudio.currentTime=0;stormAudio=null}
  if(sirenAudio){sirenAudio.pause();sirenAudio.currentTime=0;sirenAudio=null}
  if(rumbleCtx){rumbleCtx.close();rumbleCtx=null}
}