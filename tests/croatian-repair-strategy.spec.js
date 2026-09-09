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
      start(){const transcript=window.__speechTranscript;window.setTimeout(()=>this.onresult?.({results:[[{transcript}]]}),10);}
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

async function reachFamily(page){
  await page.goto('./');
  await page.locator('[data-start]').click();
  await page.locator('[data-mode="speak-practice"]').click();
  await page.locator('[data-start]').click();
  await page.locator('.free-speak-topic').filter({hasText:'Getting to know you'}).click();
  await answerAndNext(page,'Zovem se Marina.');
  await answerAndNext(page,'Dolazim iz Hrvatske.');
  await answerAndNext(page,'Živim u Lisabonu.');
  await expect(page.locator('.speak-progress')).toContainText('4 / 65');
}

test.beforeEach(async({page})=>{await seed(page);});

test('repeated-word family speech asks did-you-mean instead of praising raw speech-to-text',async({page})=>{
  await reachFamily(page);
  await answer(page,'moje obitelji mi mi uvijek nasmije');

  await expect(page.locator('.speak-feedback')).toContainText('I think I understood you');
  await expect(page.locator('.free-speak-repair-card')).toContainText('Did you mean:');
  await expect(page.locator('.free-speak-repair-card .free-speak-example')).toHaveText('Moja obitelj me uvijek nasmije.');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toHaveCount(0);

  await answer(page,'Da');
  await expect(page.locator('.speak-progress')).toContainText('5 / 65',{timeout:2500});
});

test('saying no to a proposed repair turns into an easy natural family question',async({page})=>{
  await reachFamily(page);
  await answer(page,'moje obitelji mi mi uvijek nasmije');
  await expect(page.locator('.free-speak-repair-card')).toBeVisible();

  await answer(page,'Ne');
  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Živi li tvoja obitelj blizu tebe?');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Does your family live near you?');

  await answer(page,'Da');
  await expect(page.locator('.speak-progress')).toContainText('5 / 65',{timeout:2500});
});
