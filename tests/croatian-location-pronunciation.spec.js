import { test, expect } from '@playwright/test';

async function openLocationQuestion(page){
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
  return answer;
}

test('Croatian Lisbon recognition variant keeps the answer valid but recommends Lisabonu',async({page})=>{
  const answer=await openLocationQuestion(page);
  await answer('živim u listbonu');
  await expect(page.locator('.speak-feedback')).toContainText('matched the topic');
  await expect(page.locator('.free-speak-transcript')).toContainText('živim u listbonu');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).toHaveText('Živim u Lisabonu.');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).not.toContainText('listbonu');
  await expect(page.locator('[data-next]')).toBeVisible();
});

test('broken mobile recognition like živimo li zabona is corrected instead of praised',async({page})=>{
  const answer=await openLocationQuestion(page);
  await answer('živimo li zabona');
  await expect(page.locator('.speak-feedback')).toContainText('sentence form looks unusual');
  await expect(page.locator('.free-speak-transcript')).toContainText('živimo li zabona');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).toHaveText('Živim u Lisabonu.');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).not.toContainText('živimo li zabona');
  await expect(page.locator('[data-next]')).toHaveCount(0);
  await expect(page.locator('[data-answer]')).toBeVisible();
});

test('split mobile recognition like živimo Liza bonu is normalized to Lisabonu',async({page})=>{
  const answer=await openLocationQuestion(page);
  await answer('živimo Liza bonu');
  await expect(page.locator('.speak-feedback')).toContainText('sentence form looks unusual');
  await expect(page.locator('.free-speak-transcript')).toContainText('živimo Liza bonu');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).toHaveText('Živim u Lisabonu.');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).not.toContainText('Liza bonu');
  await expect(page.locator('[data-next]')).toHaveCount(0);
  await expect(page.locator('[data-answer]')).toBeVisible();
});
