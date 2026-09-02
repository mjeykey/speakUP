import { test, expect } from '@playwright/test';

test('page 189 plays fight grunts then layered passenger shouts with no overlap', async ({ page }) => {
  await page.addInitScript(() => {
    window.__speakupAudioPlays = [];
    window.__speakupAudioEnds = [];
    window.__speakupStoryUtterances = [];

    HTMLMediaElement.prototype.play = function () {
      const entry={
        src:this.src || this.currentSrc || '',
        rate:Number(this.playbackRate)||1,
        volume:Number(this.volume),
        loop:Boolean(this.loop),
        at:performance.now()
      };
      window.__speakupAudioPlays.push(entry);
      try{this.dispatchEvent(new Event('playing'));}catch(_){}
      if(entry.volume>.01){
        setTimeout(()=>{
          window.__speakupAudioEnds.push({src:entry.src,rate:entry.rate,volume:entry.volume,at:performance.now()});
          try{this.dispatchEvent(new Event('ended'));}catch(_){}
        },80);
      }
      return Promise.resolve();
    };

    class FakeSpeechSynthesisUtterance {
      constructor(text){
        this.text=String(text||'');
        this.lang='';
        this.rate=1;
        this.pitch=1;
        this.voice=null;
        this.onstart=null;
        this.onboundary=null;
        this.onend=null;
        this.onerror=null;
      }
    }

    const fakeVoice={lang:'pt-PT',name:'SpeakUP Test Voice'};
    const fakeSynth={
      speaking:false,
      pending:false,
      paused:false,
      getVoices:()=>[fakeVoice],
      addEventListener:()=>{},
      removeEventListener:()=>{},
      resume:()=>{},
      cancel(){this.speaking=false;},
      speak(utterance){
        this.speaking=true;
        utterance.__startedAt=performance.now();
        window.__speakupStoryUtterances.push(utterance);
        utterance.onstart?.();
      }
    };

    Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:FakeSpeechSynthesisUtterance});
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:fakeSynth});

    localStorage.setItem('speakup-progress-v1', JSON.stringify({
      learningLanguage:'en-GB',
      nativeLanguage:'pt-PT',
      audioOn:true,
      sentenceAudioOn:false,
      translationAudioOn:false,
      learningLevel:'l1',
      mode:'story',
      selectedStory:'fantasy-1',
      progress:{
        story:{
          'v2|fantasy-1|en-GB|pt-PT':{
            storyId:'fantasy-1',
            learningLanguage:'en-GB',
            nativeLanguage:'pt-PT',
            pageIndex:47,
            phaseIndex:0,
            solved:0
          }
        }
      }
    }));
  });

  await page.goto('/');
  await page.locator('[data-start]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
  await page.locator('[data-start]').click();

  await expect(page.locator('.story-screen')).toBeVisible();
  await expect(page.locator('.story-progress')).toContainText('Página 189');

  const humanSrc=await page.evaluate(async()=>{
    const fight=await import('/src/audio/story-fight-grunts-189-data.js?v=test-189-layered');
    return fight.FIGHT_GRUNTS_189;
  });

  await expect.poll(async()=>page.evaluate(()=>window.__speakupStoryUtterances.length)).toBe(1);

  const firstText=await page.evaluate(()=>window.__speakupStoryUtterances[0].text);
  expect(firstText.toLocaleLowerCase()).toContain('lutaram no corredor');
  expect(firstText.toLocaleLowerCase()).not.toContain('passageiros gritavam');

  await page.evaluate(()=>{
    const utterance=window.__speakupStoryUtterances[0];
    window.speechSynthesis.speaking=false;
    utterance.onend?.();
  });

  await expect.poll(async()=>page.evaluate(src=>
    window.__speakupAudioPlays.filter(item=>item.src===src&&item.volume>.9&&Math.abs(item.rate-.75)<.01).length,
    humanSrc
  )).toBe(1);

  await expect.poll(async()=>page.evaluate(src=>
    window.__speakupAudioEnds.filter(item=>item.src===src&&item.volume>.9&&Math.abs(item.rate-.75)<.01).length,
    humanSrc
  )).toBe(1);

  const fightTiming=await page.evaluate(src=>{
    const play=window.__speakupAudioPlays.find(item=>item.src===src&&item.volume>.9&&Math.abs(item.rate-.75)<.01);
    const end=window.__speakupAudioEnds.find(item=>item.src===src&&item.volume>.9&&Math.abs(item.rate-.75)<.01);
    return{play,end};
  },humanSrc);

  expect(fightTiming.play.volume).toBeCloseTo(.92,2);
  expect(fightTiming.play.loop).toBe(false);

  await expect.poll(async()=>page.evaluate(src=>
    window.__speakupAudioPlays.filter(item=>
      item.src===src &&
      item.volume>.2 &&
      item.volume<.9
    ).length,
    humanSrc
  )).toBe(4);

  const passenger=await page.evaluate(src=>
    window.__speakupAudioPlays.filter(item=>
      item.src===src &&
      item.volume>.2 &&
      item.volume<.9
    ),
    humanSrc
  );

  const rates=passenger.map(item=>Number(item.rate.toFixed(2))).sort((a,b)=>a-b);
  expect(rates).toEqual([.74,.82,.96,1.10]);
  expect(passenger.every(item=>item.loop===true)).toBe(true);
  expect(Math.min(...passenger.map(item=>item.at))).toBeGreaterThanOrEqual(fightTiming.end.at);

  await expect.poll(async()=>page.evaluate(()=>window.__speakupStoryUtterances.length),{timeout:6000}).toBe(2);

  const second=await page.evaluate(()=>({
    text:window.__speakupStoryUtterances[1].text,
    startedAt:window.__speakupStoryUtterances[1].__startedAt
  }));

  expect(second.text.toLocaleLowerCase()).toMatch(/^enquanto os passageiros gritavam/);
  expect(second.startedAt).toBeGreaterThan(Math.max(...passenger.map(item=>item.at)));
});
