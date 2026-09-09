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

async function reachFamily(page){
  await openCroatianMeet(page);
  await answerAndNext(page,'Zovem se Marina.');
  await answerAndNext(page,'Dolazim iz Hrvatske.');
  await answerAndNext(page,'Živim u Lisabonu.');
  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojoj obitelji.');
}

async function reachHobbies(page){
  await reachFamily(page);
  await answerAndNext(page,'Moja obitelj živi blizu mene.');
  await answerAndNext(page,'Moj najbolji prijatelj živi u Zagrebu.');
  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojim hobijima.');
}

async function reachMusic(page){
  await reachHobbies(page);
  await answerAndNext(page,'Moji hobiji su crtanje i vježbanje.');
  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojoj omiljenoj glazbi.');
  await expect(page.locator('.speak-progress')).toContainText('7 / 65');
}

test.beforeEach(async({page})=>{await seed(page);});

test('unclear family grammar becomes a natural follow-up instead of a grammar verdict',async({page})=>{
  await reachFamily(page);
  await answer(page,'moji obitelji živi kao meni');

  await expect(page.locator('.speak-feedback')).toContainText('continue the conversation naturally');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Živi li tvoja obitelj blizu tebe?');
  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toHaveCount(0);

  await answer(page,'Da');
  await expect(page.locator('.speak-progress')).toContainText('5 / 65',{timeout:2500});

  await page.locator('[data-menu]').click();
  await page.locator('[data-mode="speak-practice"]').click();
  await page.locator('[data-start]').click();
  await expect(page.locator('.speak-progress')).toContainText('5 / 65');
});

test('malformed hobby answer asks whether the safe correction was intended',async({page})=>{
  await reachHobbies(page);
  await answer(page,'moji hobiji su crtani vježbanje');

  await expect(page.locator('.speak-feedback')).toContainText('I think I understood you');
  await expect(page.locator('.free-speak-repair-card')).toContainText('Moji hobiji su crtanje i vježbanje.');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);
  await expect(page.locator('[data-next]')).toHaveCount(0);

  await answer(page,'Da');
  await expect(page.locator('.speak-progress')).toContainText('7 / 65',{timeout:2500});
});

test('uncertain music grammar does not invent a meaning and falls back to conversation',async({page})=>{
  await reachMusic(page);
  await expect(page.locator('.free-speak-example-card .free-speak-example')).toHaveText('Najviše volim slušati pop i soul.');

  await answer(page,'Mio glazbi su mi');
  await expect(page.locator('.speak-feedback')).toContainText('continue the conversation naturally');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Gdje obično slušaš glazbu?');
  await expect(page.locator('.free-speak-repair-card')).toHaveCount(0);
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);

  await answer(page,'hmm');
  await expect(page.locator('.speak-feedback')).toContainText('make it easier');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Ja, primjerice, slušam glazbu na putu na posao.');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Je li i kod tebe tako?');

  await answer(page,'Da');
  await expect(page.locator('.speak-progress')).toContainText('8 / 65',{timeout:2500});
});

test('unfinished Croatian music answer becomes a gentle conversation and can fall back to yes or no',async({page})=>{
  await reachMusic(page);

  await answer(page,'moja najdraža muzika svira kad idem na');
  await expect(page.locator('.speak-feedback')).toContainText('continue the conversation naturally');
  await expect(page.locator('[data-next]')).toHaveCount(0);
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Gdje obično slušaš glazbu?');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);

  await answer(page,'hmm');
  await expect(page.locator('.speak-feedback')).toContainText('make it easier');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Ja, primjerice, slušam glazbu na putu na posao.');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Je li i kod tebe tako?');

  await answer(page,'Da');
  await expect(page.locator('.speak-progress')).toContainText('8 / 65',{timeout:2500});
});
