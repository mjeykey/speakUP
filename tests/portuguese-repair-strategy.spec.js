import { test, expect } from '@playwright/test';

async function seed(page){
  await page.addInitScript(()=>{
    localStorage.setItem('speakup-progress-v1',JSON.stringify({
      learningLanguage:'pt-PT',nativeLanguage:'en-GB',audioOn:false,
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

async function reachOrigin(page){
  await page.goto('./');
  await page.locator('[data-start]').click();
  await page.locator('[data-mode="speak-practice"]').click();
  await page.locator('[data-start]').click();
  await page.locator('.free-speak-topic').first().click();
  await answer(page,'Chamo-me Marina.');
  await expect(page.locator('[data-next]')).toBeVisible();
  await page.locator('[data-next]').click();
  await expect(page.locator('.free-speak-question')).toHaveText('De onde és?');
  await expect(page.locator('.speak-progress')).toContainText('2 / 65');
  await expect(page.locator('.free-speak-example-card')).toContainText('Sou da Alemanha.');
}

test.beforeEach(async({page})=>{await seed(page);});

test('ambiguous sou dela Maia transcription follows the current Alemanha learning context',async({page})=>{
  await reachOrigin(page);
  await answer(page,'sou dela Maia');

  await expect(page.locator('.speak-feedback')).toContainText('I think I understood you');
  await expect(page.locator('.free-speak-repair-card')).toContainText('Did you mean:');
  await expect(page.locator('.free-speak-repair-card .free-speak-example')).toHaveText('Sou da Alemanha.');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toHaveCount(0);

  await answer(page,'Sim');
  await expect(page.locator('.speak-progress')).toContainText('3 / 65',{timeout:3000});
});

test('a genuinely correct Sou da Maia answer is not rewritten as Germany',async({page})=>{
  await reachOrigin(page);
  await answer(page,'Sou da Maia.');

  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.free-speak-transcript')).toContainText('Sou da Maia.');
  await expect(page.locator('[data-next]')).toBeVisible();
});

test('rejecting the ambiguous Portuguese repair falls back to an easy natural question',async({page})=>{
  await reachOrigin(page);
  await answer(page,'sou dela Maia');
  await expect(page.locator('.free-speak-repair-card')).toBeVisible();

  await answer(page,'Não');
  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.free-speak-conversation-card')).toContainText('És de Portugal?');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Are you from Portugal?');

  await answer(page,'Sim');
  await expect(page.locator('.speak-progress')).toContainText('3 / 65',{timeout:3000});
});
