import { test, expect } from '@playwright/test';

test('page 189 plays fight grunts before crowd shouting with no overlap', async ({ page }) => {
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
          window.__speakupAudioEnds.push({src:entry.src,at:performance.now()});
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
          'fantasy-1|en-GB|pt-PT':{
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
  await expect(page.locator('.story-progress')).toContainText('Seite 189');

  const sources=await page.evaluate(async()=>{
    const crowd=await import('/src/audio/story-sfx.js?v=test-189-order');
    const fight=await import('/src/audio/story-fight-grunts-189-data.js?v=test-189-order');
    return{crowdSrc:crowd.getStorySfxSrc('crowd'),fightSrc:fight.FIGHT_GRUNTS_189};
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
    window.__speakupAudioPlays.filter(item=>item.src===src&&item.volume>.01).length,
    sources.fightSrc
  )).toBe(1);

  await expect.poll(async()=>page.evaluate(src=>
    window.__speakupAudioPlays.filter(item=>item.src===src&&item.volume>.01).length,
    sources.crowdSrc
  )).toBe(1);

  const order=await page.evaluate(({fightSrc,crowdSrc})=>{
    const fightPlay=window.__speakupAudioPlays.find(item=>item.src===fightSrc&&item.volume>.01);
    const fightEnd=window.__speakupAudioEnds.find(item=>item.src===fightSrc);
    const crowdPlay=window.__speakupAudioPlays.find(item=>item.src===crowdSrc&&item.volume>.01);
    const crowdEnd=window.__speakupAudioEnds.find(item=>item.src===crowdSrc);
    return{fightPlay,fightEnd,crowdPlay,crowdEnd};
  },sources);

  expect(order.fightPlay.rate).toBeCloseTo(.75,2);
  expect(order.fightPlay.volume).toBeCloseTo(.92,2);
  expect(order.fightPlay.loop).toBe(false);
  expect(order.crowdPlay.rate).toBeCloseTo(.50,2);
  expect(order.crowdPlay.at).toBeGreaterThanOrEqual(order.fightEnd.at);

  await expect.poll(async()=>page.evaluate(()=>window.__speakupStoryUtterances.length)).toBe(2);
  const second=await page.evaluate(()=>({
    text:window.__speakupStoryUtterances[1].text,
    startedAt:window.__speakupStoryUtterances[1].__startedAt,
    crowdEnd:window.__speakupAudioEnds.find(item=>item.src.includes('data:audio'))?.at||0,
    ends:window.__speakupAudioEnds
  }));

  expect(second.text.toLocaleLowerCase()).toMatch(/^enquanto os passageiros gritavam/);
  const crowdEnd=order.crowdEnd?.at||0;
  expect(second.startedAt).toBeGreaterThanOrEqual(crowdEnd);
});
