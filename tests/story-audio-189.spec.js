import { test, expect } from '@playwright/test';

test('page 189 keeps speech and slow crowd cue fully separate', async ({ page }) => {
  await page.addInitScript(() => {
    window.__speakupAudioPlays = [];
    window.__speakupStoryUtterances = [];
    window.__crowdEndedAt = 0;

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
          window.__crowdEndedAt=performance.now();
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

  const crowdSrc=await page.evaluate(async()=>{
    const module=await import('/src/audio/story-sfx.js?v=test-189-separated');
    return module.getStorySfxSrc('crowd');
  });

  await expect.poll(async()=>page.evaluate(()=>window.__speakupStoryUtterances.length)).toBe(1);

  const firstText=await page.evaluate(()=>window.__speakupStoryUtterances[0].text);
  expect(firstText.toLocaleLowerCase()).toContain('lutaram no corredor');
  expect(firstText.toLocaleLowerCase()).not.toContain('passageiros gritavam');

  const audibleCrowdPlays=()=>page.evaluate(src=>
    window.__speakupAudioPlays.filter(item=>item.src===src && item.volume>.01),
    crowdSrc
  );

  await expect.poll(async()=>(await audibleCrowdPlays()).length).toBe(0);

  await page.evaluate(()=>{
    const utterance=window.__speakupStoryUtterances[0];
    window.speechSynthesis.speaking=false;
    utterance.onend?.();
  });

  await expect.poll(async()=>(await audibleCrowdPlays()).length).toBe(1);

  const [play]=await audibleCrowdPlays();
  expect(play.rate).toBeCloseTo(.50,2);
  expect(play.volume).toBeCloseTo(.78,2);
  expect(play.loop).toBe(false);

  // The second spoken part must not begin until the effect has ended.
  await expect.poll(async()=>page.evaluate(()=>window.__crowdEndedAt>0)).toBe(true);
  await expect.poll(async()=>page.evaluate(()=>window.__speakupStoryUtterances.length)).toBe(2);

  const timing=await page.evaluate(()=>({
    crowdEndedAt:window.__crowdEndedAt,
    secondStartedAt:window.__speakupStoryUtterances[1].__startedAt,
    secondText:window.__speakupStoryUtterances[1].text
  }));

  expect(timing.secondStartedAt).toBeGreaterThanOrEqual(timing.crowdEndedAt);
  expect(timing.secondText.toLocaleLowerCase()).toMatch(/^enquanto os passageiros gritavam/);
});
