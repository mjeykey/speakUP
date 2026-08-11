let audioContext=null;
let activeNodes=[];
let activeTimer=null;

function context(){
 if(!audioContext){
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return null;
  audioContext=new AudioContextClass();
 }
 return audioContext;
}

export async function unlockStorySfx(){
 const ctx=context();
 if(ctx?.state==='suspended')try{await ctx.resume();}catch(_){}
}

export function stopStorySfx(){
 if(activeTimer){clearTimeout(activeTimer);activeTimer=null;}
 activeNodes.forEach(node=>{try{node.stop?.();}catch(_){}try{node.disconnect?.();}catch(_){}});
 activeNodes=[];
}

function remember(...nodes){activeNodes.push(...nodes.filter(Boolean));}
function gain(ctx,value=0.12){const node=ctx.createGain();node.gain.value=value;node.connect(ctx.destination);remember(node);return node;}
function osc(ctx,type,freq,volume,duration,delay=0,endFreq=null){
 const out=gain(ctx,0);const node=ctx.createOscillator();node.type=type;node.frequency.setValueAtTime(freq,ctx.currentTime+delay);
 if(endFreq)node.frequency.exponentialRampToValueAtTime(Math.max(1,endFreq),ctx.currentTime+delay+duration);
 node.connect(out);out.gain.setValueAtTime(0.0001,ctx.currentTime+delay);out.gain.exponentialRampToValueAtTime(volume,ctx.currentTime+delay+0.025);out.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+delay+duration);
 node.start(ctx.currentTime+delay);node.stop(ctx.currentTime+delay+duration+0.04);remember(node);return node;
}
function noise(ctx,volume,duration,filterType='lowpass',frequency=1200,delay=0){
 const frames=Math.ceil(ctx.sampleRate*duration);const buffer=ctx.createBuffer(1,frames,ctx.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<frames;i++)data[i]=Math.random()*2-1;
 const src=ctx.createBufferSource();src.buffer=buffer;const filter=ctx.createBiquadFilter();filter.type=filterType;filter.frequency.value=frequency;const out=gain(ctx,0);src.connect(filter);filter.connect(out);
 out.gain.setValueAtTime(0.0001,ctx.currentTime+delay);out.gain.exponentialRampToValueAtTime(volume,ctx.currentTime+delay+0.03);out.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+delay+duration);src.start(ctx.currentTime+delay);remember(src,filter);return src;
}
function pulse(ctx,freq=70,volume=.18,delay=0){osc(ctx,'sine',freq,volume,.18,delay,45);}

const EFFECTS={
 rain(ctx){noise(ctx,.06,1.5,'highpass',1300);noise(ctx,.035,1.5,'lowpass',650);},
 bell(ctx){[440,660,880].forEach((f,i)=>osc(ctx,'sine',f,.09/(i+1),1.35,0));},
 'door-creak'(ctx){osc(ctx,'sawtooth',240,.055,.9,0,105);noise(ctx,.02,.85,'bandpass',700);},
 wind(ctx){noise(ctx,.055,1.35,'bandpass',520);},
 heartbeat(ctx){pulse(ctx,64,.18,0);pulse(ctx,58,.14,.28);},
 'glass-break'(ctx){noise(ctx,.11,.38,'highpass',3200);[1900,2700,3600].forEach((f,i)=>osc(ctx,'triangle',f,.035,.25,i*.025,f*1.45));},
 'engine-start'(ctx){osc(ctx,'sawtooth',48,.09,1.4,0,105);osc(ctx,'sine',70,.08,1.4,.08,92);},
 crowd(ctx){noise(ctx,.04,1.1,'bandpass',900);osc(ctx,'triangle',180,.015,.7,.1,230);osc(ctx,'triangle',240,.012,.7,.25,170);},
 'water-crash'(ctx){noise(ctx,.12,.8,'lowpass',1200);noise(ctx,.05,1.1,'highpass',900,.08);},
 water(ctx){noise(ctx,.055,1.25,'lowpass',900);},
 'metal-scrape'(ctx){osc(ctx,'sawtooth',1450,.045,.85,0,420);noise(ctx,.025,.8,'bandpass',1800);},
 'magic-hum'(ctx){osc(ctx,'sine',220,.045,1.25);osc(ctx,'sine',330,.03,1.25);osc(ctx,'sine',440,.02,1.25);},
 thunder(ctx){noise(ctx,.14,1.1,'lowpass',260);osc(ctx,'sine',52,.16,.8,0,32);},
 'wagon-turn'(ctx){osc(ctx,'sawtooth',150,.055,.75,0,82);noise(ctx,.018,.65,'bandpass',480);},
 'dawn-wind'(ctx){noise(ctx,.035,1.15,'bandpass',700);},
 birds(ctx){[[1600,2300,0],[1900,2800,.25],[1450,2200,.48]].forEach(([a,b,d])=>osc(ctx,'sine',a,.035,.2,d,b));},
 'soft-wind'(ctx){noise(ctx,.025,1.15,'bandpass',620);},
 'key-turn'(ctx){osc(ctx,'triangle',1750,.05,.09,0,2100);osc(ctx,'triangle',1150,.045,.11,.12,1500);}
};

export async function playStorySfx(name,{enabled=true}={}){
 if(!enabled||!name||name==='none')return;
 const ctx=context();if(!ctx)return;
 if(ctx.state==='suspended')try{await ctx.resume();}catch(_){return;}
 stopStorySfx();
 const effect=EFFECTS[name]||EFFECTS.wind;
 try{effect(ctx);}catch(_){stopStorySfx();return;}
 activeTimer=setTimeout(()=>stopStorySfx(),2200);
}

if(typeof window!=='undefined'){
 const unlock=()=>unlockStorySfx();
 window.addEventListener('pointerdown',unlock,{once:true,capture:true});
 window.addEventListener('touchstart',unlock,{once:true,capture:true,passive:true});
}
