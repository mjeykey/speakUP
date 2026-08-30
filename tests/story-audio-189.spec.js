import { test, expect } from '@playwright/test';

test('page 189 crowd cue is slow and starts only at the matching words', async ({ page }) => {
  await page.addInitScript(() => {
    window.__speakupAudioPlays = [];
    window.__speakupStoryUtterance = null;

    HTMLMediaElement.prototype.play = function () {
      window.__speakupAudioPlays.push({
        src:this.src || this.currentSrc || '',
        rate:Number(this.playbackRate)||1,
        loop:Boolean(this.loop)
      });
      try{this.dispatchEvent(new Event('playing'));}catch(_){}
      return Promise.resolve();
    };

    const synth=window.speechSynthesis;
    if(synth){
      synth.getVoices=()=>[];
      synth.resume=()=>{};
      synth.cancel=()=>{};
      synth.speak=utterance=>{
        window.__speakupStoryUtterance=utterance;
        utterance.onstart?.();
      };
    }

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
    const module=await import('/src/audio/story-sfx.js?v=test-189-cue');
    return module.getStorySfxSrc('crowd');
  });

  const crowdPlays=()=>page.evaluate(src=>window.__speakupAudioPlays.filter(item=>item.src===src),crowdSrc);

  await expect.poll(async()=>(await crowdPlays()).length).toBe(0);

  const cueIndex=await page.evaluate(()=>{
    const utterance=window.__speakupStoryUtterance;
    if(!utterance)throw new Error('Story utterance was not created');
    const text=String(utterance.text||'').toLocaleLowerCase();
    const index=text.indexOf('passageiros gritavam');
    if(index<0)throw new Error('Expected Portuguese fight cue was not found');
    utterance.onboundary?.({charIndex:Math.max(0,index-1),name:'word',elapsedTime:0});
    return index;
  });

  await expect.poll(async()=>(await crowdPlays()).length).toBe(0);

  await page.evaluate(index=>{
    window.__speakupStoryUtterance?.onboundary?.({charIndex:index,name:'word',elapsedTime:0});
  },cueIndex);

  await expect.poll(async()=>(await crowdPlays()).length).toBe(1);
  const [play]=await crowdPlays();
  expect(play.rate).toBeCloseTo(.72,2);
  expect(play.loop).toBe(false);
});
