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

async function openCroatianMeet(page){
  await page.goto('./');
  await page.locator('[data-start]').click();
  await page.locator('[data-mode="speak-practice"]').click();
  await page.locator('[data-start]').click();
  await page.locator('.free-speak-topic').filter({hasText:'Getting to know you'}).click();
}

test.beforeEach(async({page})=>{await seed(page);});

test('Croatian family prompt accepts family vocabulary, rejects broken agreement and resumes at the saved question',async({page})=>{
  await openCroatianMeet(page);

  await answerAndNext(page,'Zovem se Marina.');
  await answerAndNext(page,'Dolazim iz Hrvatske.');
  await answerAndNext(page,'Živim u Lisabonu.');

  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojoj obitelji.');
  await expect(page.locator('.speak-progress')).toContainText('4 / 65');

  await answer(page,'moji obitelji živi kao meni');
  await expect(page.locator('.speak-feedback')).toContainText('sentence form looks unusual');
  await expect(page.locator('[data-next]')).toHaveCount(0);
  await expect(page.locator('[data-answer]')).toBeVisible();

  await answer(page,'moji roditelji žive blizu meni');
  await expect(page.locator('.speak-feedback')).toContainText('matched the topic');
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Moji roditelji žive blizu mene.');
  await expect(page.locator('[data-next]')).toBeVisible();

  await page.locator('[data-menu]').click();
  await expect(page.locator('.menu-screen')).toBeVisible();
  await page.locator('[data-mode="speak-practice"]').click();
  await page.locator('[data-start]').click();

  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojoj obitelji.');
  await expect(page.locator('.speak-progress')).toContainText('4 / 65');
  await expect(page.locator('[data-answer]')).toBeVisible();
});

test('Croatian hobby answer is corrected before recommended pronunciation',async({page})=>{
  await openCroatianMeet(page);
  await answerAndNext(page,'Zovem se Marina.');
  await answerAndNext(page,'Dolazim iz Hrvatske.');
  await answerAndNext(page,'Živim u Lisabonu.');
  await answerAndNext(page,'Moja obitelj mi je jako važna.');
  await answerAndNext(page,'Moj najbolji prijatelj živi u Zagrebu.');

  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojim hobijima.');
  await expect(page.locator('.speak-progress')).toContainText('6 / 65');

  await answer(page,'moje hobije crtati i trčati');
  await expect(page.locator('.speak-feedback')).toContainText('sentence form looks unusual');
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Volim crtati i trčati.');
  await expect(page.locator('.free-speak-pronunciation-card')).not.toContainText('moje hobije crtati i trčati');
  await expect(page.locator('[data-pronunciation]')).toBeVisible();
  await expect(page.locator('[data-next]')).toHaveCount(0);
});
