import { test, expect } from '@playwright/test';

async function seed(page){
  await page.addInitScript(()=>{
    localStorage.setItem('speakup-progress-v1',JSON.stringify({
      learningLanguage:'pt-PT',nativeLanguage:'en-GB',audioOn:false,
      sentenceAudioOn:false,translationAudioOn:false,
      learningLevel:'l1',mode:'words',progress:{}
    }));
    window.__speechTranscript='';
    window.__speechTranscripts=[];
    window.SpeechRecognition=class{
      abort(){}
      start(){
        const transcripts=window.__speechTranscripts?.length?window.__speechTranscripts:[window.__speechTranscript];
        const alternatives=transcripts.filter(Boolean).map(transcript=>({transcript}));
        window.setTimeout(()=>this.onresult?.({results:[alternatives]}),10);
      }
    };
  });
}

async function answer(page,text){
  await page.evaluate(value=>{window.__speechTranscript=value;window.__speechTranscripts=[value];},text);
  await page.locator('[data-answer]').click();
}

async function answerAlternatives(page,texts){
  await page.evaluate(values=>{window.__speechTranscript=values[0]||'';window.__speechTranscripts=values;},texts);
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

async function reachFamily(page){
  await reachOrigin(page);
  await answer(page,'Sou da Alemanha.');
  await expect(page.locator('[data-next]')).toBeVisible();
  await page.locator('[data-next]').click();
  await expect(page.locator('.speak-progress')).toContainText('3 / 65');
  await answer(page,'Moro em Lisboa.');
  await expect(page.locator('[data-next]')).toBeVisible();
  await page.locator('[data-next]').click();
  await expect(page.locator('.speak-progress')).toContainText('4 / 65');
  await expect(page.locator('.free-speak-question')).toContainText('família');
}

test.beforeEach(async({page})=>{await seed(page);});

test('previous question button returns to the previous speaking page',async({page})=>{
  await reachOrigin(page);
  await expect(page.locator('[data-prev]')).toBeVisible();
  await page.locator('[data-prev]').click();
  await expect(page.locator('.speak-progress')).toContainText('1 / 65');
  await expect(page.locator('.free-speak-question')).toHaveText('Como te chamas?');
  await expect(page.locator('[data-prev]')).toBeDisabled();
});

test('ambiguous sou dela Maia transcription follows the current Alemanha learning context',async({page})=>{
  await reachOrigin(page);
  await answer(page,'sou dela Maia');

  await expect(page.locator('.speak-feedback')).toContainText('I think I understood you');
  await expect(page.locator('.free-speak-repair-card')).toContainText('Did you mean:');
  await expect(page.locator('.free-speak-repair-card .free-speak-example')).toHaveText('Sou da Alemanha.');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toHaveCount(0);

  await answer(page,'Sim');
  await expect(page.locator('.speak-progress')).toContainText('2 / 65');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).toHaveText('Sou da Alemanha.');
  await expect(page.locator('[data-next]')).toBeVisible();
  await page.waitForTimeout(1700);
  await expect(page.locator('.speak-progress')).toContainText('2 / 65');
  await page.locator('[data-next]').click();
  await expect(page.locator('.speak-progress')).toContainText('3 / 65');
});

test('Brave sou dela manha transcription is repaired like Croatian instead of praised as correct',async({page})=>{
  await reachOrigin(page);
  await answer(page,'sou dela manha');

  await expect(page.locator('.free-speak-transcript')).toContainText('sou dela manha');
  await expect(page.locator('.speak-feedback')).toContainText('I think I understood you');
  await expect(page.locator('.speak-feedback')).not.toContainText('Great');
  await expect(page.locator('.free-speak-repair-card')).toContainText('Did you mean:');
  await expect(page.locator('.free-speak-repair-card .free-speak-example')).toHaveText('Sou da Alemanha.');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toHaveCount(0);

  await answer(page,'Sim');
  await expect(page.locator('.speak-progress')).toContainText('2 / 65');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).toHaveText('Sou da Alemanha.');
  await expect(page.locator('[data-next]')).toBeVisible();
});

test('a genuinely correct Sou da Alemanha answer is accepted directly',async({page})=>{
  await reachOrigin(page);
  await answer(page,'Sou da Alemanha.');

  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.free-speak-transcript')).toContainText('Sou da Alemanha.');
  await expect(page.locator('[data-next]')).toBeVisible();
});

test('a genuinely correct Sou da Maia answer is not rewritten as Germany',async({page})=>{
  await reachOrigin(page);
  await answer(page,'Sou da Maia.');

  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.free-speak-transcript')).toContainText('Sou da Maia.');
  await expect(page.locator('[data-next]')).toBeVisible();
});

test('unknown malformed Portuguese origin falls back to a simple question instead of green praise',async({page})=>{
  await reachOrigin(page);
  await answer(page,'sou dela Angola');

  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.speak-feedback')).not.toContainText('Great');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('És de Portugal?');
  await expect(page.locator('[data-next]')).toHaveCount(0);
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

test('Croatia and Germany family speech-to-text noise is corrected instead of praised',async({page})=>{
  await reachFamily(page);
  await answer(page,'a minha família viveu Croácia é mala mãe');

  await expect(page.locator('.free-speak-transcript')).toContainText('viveu Croácia');
  await expect(page.locator('.speak-feedback')).toContainText('I think I understood you');
  await expect(page.locator('.speak-feedback')).not.toContainText('Great');
  await expect(page.locator('.free-speak-repair-card')).toContainText('Did you mean:');
  await expect(page.locator('.free-speak-repair-card .free-speak-example')).toHaveText('A minha família vive na Croácia e na Alemanha.');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toHaveCount(0);
});

test('screenshot family transcription with nada mae is never praised as correct',async({page})=>{
  await reachFamily(page);
  await answer(page,'a minha família vive na Croácia E nada mãe');

  await expect(page.locator('.free-speak-transcript')).toContainText('nada mãe');
  await expect(page.locator('.speak-feedback')).not.toContainText('Great');
  await expect(page.locator('.free-speak-repair-card')).toContainText('Did you mean:');
  await expect(page.locator('.free-speak-repair-card .free-speak-example')).toHaveText('A minha família vive na Croácia e na Alemanha.');
  await expect(page.locator('[data-next]')).toHaveCount(0);
});

test('family repair confirmation stays on the same question and shows pronunciation until Next',async({page})=>{
  await reachFamily(page);
  await answer(page,'a minha família vive na Croácia E nada mãe');
  await expect(page.locator('.free-speak-repair-card')).toBeVisible();

  await answer(page,'Sim');
  await expect(page.locator('.speak-progress')).toContainText('4 / 65');
  await expect(page.locator('.free-speak-pronunciation-card .free-speak-example')).toHaveText('A minha família vive na Croácia e na Alemanha.');
  await expect(page.locator('[data-next]')).toBeVisible();
  await page.waitForTimeout(1700);
  await expect(page.locator('.speak-progress')).toContainText('4 / 65');
});

test('family location slot rejects an implausible tail even without a known correction',async({page})=>{
  await reachFamily(page);
  await answer(page,'A minha família vive na Croácia e banana');

  await expect(page.locator('.speak-feedback')).not.toContainText('Great');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toHaveCount(0);
});

test('a valid Croatia and Germany family sentence is accepted',async({page})=>{
  await reachFamily(page);
  await answer(page,'A minha família vive na Croácia e na Alemanha.');

  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.free-speak-transcript')).toContainText('A minha família vive na Croácia e na Alemanha.');
  await expect(page.locator('[data-next]')).toBeVisible();
});

test('a better speech-recognition alternative wins over a broken first alternative',async({page})=>{
  await reachFamily(page);
  await answerAlternatives(page,[
    'a minha família vive na Croácia E nada mãe',
    'A minha família vive na Croácia e na Alemanha.'
  ]);

  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.free-speak-transcript')).toContainText('A minha família vive na Croácia e na Alemanha.');
  await expect(page.locator('.speak-feedback')).toContainText('Great');
  await expect(page.locator('[data-next]')).toBeVisible();
});
