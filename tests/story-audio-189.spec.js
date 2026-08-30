import { test, expect } from '@playwright/test';

test('page 189 plays a slow crowd cue only between the matching text parts', async ({ page }) => {
  await page.addInitScript(() => {
    window.__speakupAudioPlays = [];
    window.__speakupStoryUtterances = [];

    HTMLMediaElement.prototype.play = function () {
      window.__speakupAudioPlays.push({
        src:this.src || this.currentSrc || '',
        rate:Number(this.playbackRate)||1,
        volume:Number(this.volume),
        loop:Boolean(this.loop)
      });
      try{this.dispatchEvent(new Event('playing'));}catch(_){}
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
    const module=await import('/src/audio/story-sfx.js?v=test-189-sequence');
    return module.getStorySfxSrc('crowd');
  });

  await expect.poll(async()=>page.evaluate(()=>window.__speakupStoryUtterances.length)).toBe(1);

  const firstText=await page.evaluate(()=>window.__speakupStoryUtterances[0].text);
  expect(firstText.toLocaleLowerCase()).not.toContain('passageiros gritavam');
  expect(firstText.toLocaleLowerCase()).toContain('lutaram no corredor');

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
  expect(play.rate).toBeCloseTo(.65,2);
  expect(play.volume).toBeCloseTo(.48,2);
  expect(play.loop).toBe(false);

  await expect.poll(async()=>page.evaluate(()=>window.__speakupStoryUtterances.length)).toBe(2);
  const secondText=await page.evaluate(()=>window.__speakupStoryUtterances[1].text);
  expect(secondText.toLocaleLowerCase()).toMatch(/^enquanto os passageiros gritavam/);
});
