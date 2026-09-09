import { test, expect } from '@playwright/test';

test('Croatian Lisbon recognition variant keeps the answer valid but recommends Lisabonu',async({page})=>{
  await page.addInitScript(()=>{
    localStorage.setItem('speakup-progress-v1',JSON.stringify({
      learningLanguage:'hr-HR',nativeLanguage:'en-GB',audioOn:false,
      sentenceAudioOn:false,translationAudioOn:false,
      learningLevel:'l1',mode:'words',progress:{}
    }));
    window.__speechTranscript='';
    window.SpeechRecognition=class{
      abort(){}
      start(){const transcript=window.__speechTranscript;window.setTimeout(()=>this.onresult?.({results:[[{transcript}]]}),10);}
    };
  });
  const answer=async text=>{
    await page.evaluate(value=>{window.__speechTranscript=value;},text);
    await page.locator('[data-answer]').click();
  };
  const answerAndNext=async text=>{
    await answer(text);
    await expect(page.locator('[data-next]')).toBeVisible();
    await page.locator('[data-next]').click();
  };

  await page.goto('./');
  await page.locator('[data-start]').click();
  await page.locator('[data-mode="speak-practice"]').click();
  await page.locator('[data-start]').click();
  await page.locator('.free-speak-topic').filter({hasText:'Getting to know you'}).click();

  await answerAndNext('Zovem se Marina.');
  await answerAndNext('Dolazim iz Hrvatske.');
  await expect(page.locator('.free-speak-question')).toHaveText('Gdje sada živiš?');

  await answer('živim u listbonu');
  await expect(page.locator('.speak-feedback')).toContainText('matched the topic');
  await expect(page.locator('.free-speak-transcript')).toContainText('živim u listbonu');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).toHaveText('Živim u Lisabonu.');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).not.toContainText('listbonu');
  await expect(page.locator('[data-next]')).toBeVisible();
});
