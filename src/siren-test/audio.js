let stormAudio=null,flashTimer=null,rumbleCtx=null;
const STORM='https://assets.mixkit.co/active_storage/sfx/2402/2402-preview.mp3';

export async function startAudio(){
  if(stormAudio)return;
  stormAudio=new Audio(STORM);
  stormAudio.loop=true;
  stormAudio.preload='auto';
  stormAudio.volume=.82;
  await stormAudio.play();
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
    const now=rumbleCtx.currentTime;
    const gain=rumbleCtx.createGain();
    gain.gain.setValueAtTime(.001,now);
    gain.gain.exponentialRampToValueAtTime(.21,now+.18);
    gain.gain.exponentialRampToValueAtTime(.06,now+1.4);
    gain.gain.exponentialRampToValueAtTime(.001,now+4.6);
    gain.connect(rumbleCtx.destination);
    [44,56,67].forEach((hz,n)=>{
      const o=rumbleCtx.createOscillator();
      o.type='sine';
      o.frequency.setValueAtTime(hz,now);
      o.frequency.exponentialRampToValueAtTime(hz*.64,now+4);
      const og=rumbleCtx.createGain();
      og.gain.value=.38/(n+1);
      o.connect(og).connect(gain);
      o.start(now+n*.04);
      o.stop(now+4.8);
    });
  }catch(e){}
}

export function softenAudio(){if(stormAudio)stormAudio.volume=.14}
export function stopAudio(){
  clearTimeout(flashTimer);
  if(stormAudio){stormAudio.pause();stormAudio.currentTime=0;stormAudio=null}
  if(rumbleCtx){rumbleCtx.close();rumbleCtx=null}
}