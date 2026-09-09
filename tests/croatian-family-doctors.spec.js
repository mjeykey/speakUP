import { test, expect } from '@playwright/test';

async function seed(page){
  await page.addInitScript(()=>{
    localStorage.setItem('speakup-progress-v1',JSON.stringify({
      learningLanguage:'hr-HR',nativeLanguage:'en-GB',audioOn:false,
      sentenceAudioOn:false,translationAudioOn:false,
      learningLevel:'l1',mode:'words',progress:{}
    }));
    window.__speechTranscript='';
    window.SpeechRecognition=class{
      abort(){}
      start(){
        const transcript=window.__speechTranscript;
        window.setTimeout(()=>this.onresult?.({results:[[{transcript}]]}),10);
      }
    };
  });
}

async function answer(page,text){
  await page.evaluate(value=>{window.__speechTranscript=value;},text);
  await page.locator('[data-answer]').click();
}

async function answerAndNext(page,text){
  await answer(page,text);
  await expect(page.locator('[data-next]')).toBeVisible();
  await page.locator('[data-next]').click();
}

test('malformed family doctor answer is corrected instead of praised',async({page})=>{
  await seed(page);
  await page.goto('./');
  await page.locator('[data-start]').click();
  await page.locator('[data-mode="speak-practice"]').click();
  await page.locator('[data-start]').click();
  await page.locator('.free-speak-topic').filter({hasText:'Getting to know you'}).click();
  await answerAndNext(page,'Zovem se Marina.');
  await answerAndNext(page,'Dolazim iz Hrvatske.');
  await answerAndNext(page,'Živim u Lisabonu.');

  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojoj obitelji.');
  await answer(page,'moji roditelji ima ih puno doktori');

  await expect(page.locator('.speak-feedback')).toContainText('sentence form looks unusual');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).toHaveText('U mojoj obitelji ima puno doktora.');
  await expect(page.locator('.free-speak-pronunciation-card')).not.toContainText('moji roditelji ima ih puno doktori');
  await expect(page.locator('[data-next]')).toHaveCount(0);
  await expect(page.locator('[data-answer]')).toBeVisible();
});
