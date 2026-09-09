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

async function reachMusic(page){
  await openCroatianMeet(page);
  await answerAndNext(page,'Zovem se Marina.');
  await answerAndNext(page,'Dolazim iz Hrvatske.');
  await answerAndNext(page,'Živim u Lisabonu.');
  await answerAndNext(page,'Moja obitelj mi je jako važna.');
  await answerAndNext(page,'Moj najbolji prijatelj živi u Zagrebu.');
  await answerAndNext(page,'Moji hobiji su crtanje i vježbanje.');
  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojoj omiljenoj glazbi.');
  await expect(page.locator('.speak-progress')).toContainText('7 / 65');
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

test('Croatian hobby answer repairs malformed mobile recognition before pronunciation',async({page})=>{
  await openCroatianMeet(page);
  await answerAndNext(page,'Zovem se Marina.');
  await answerAndNext(page,'Dolazim iz Hrvatske.');
  await answerAndNext(page,'Živim u Lisabonu.');
  await answerAndNext(page,'Moja obitelj mi je jako važna.');
  await answerAndNext(page,'Moj najbolji prijatelj živi u Zagrebu.');

  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svojim hobijima.');
  await expect(page.locator('.speak-progress')).toContainText('6 / 65');

  await answer(page,'moji hobiji su crtani vježbanje');
  await expect(page.locator('.speak-feedback')).toContainText('sentence form looks unusual');
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Moji hobiji su crtanje i vježbanje.');
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Alternative sentence');
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Volim crtati i vježbati.');
  await expect(page.locator('.free-speak-pronunciation-card')).not.toContainText('moji hobiji su crtani vježbanje');
  await expect(page.locator('[data-pronunciation]')).toBeVisible();
  await expect(page.locator('[data-alternative]')).toBeVisible();
  await expect(page.locator('[data-next]')).toHaveCount(0);
});

test('Croatian music answer rejects malformed recognition and gives a real music sentence',async({page})=>{
  await reachMusic(page);
  await expect(page.locator('.free-speak-example-card .free-speak-example')).toHaveText('Moja omiljena glazba važan je dio mog života.');
  await expect(page.locator('.free-speak-example-card .speak-translation')).toHaveText('My favourite music is an important part of my life.');

  await answer(page,'Mio glazbi su mi');
  await expect(page.locator('.speak-feedback')).toContainText('sentence form looks unusual');
  await expect(page.locator('[data-next]')).toHaveCount(0);
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Moja omiljena glazba mi je jako važna.');
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Volim slušati glazbu.');
  await expect(page.locator('.free-speak-pronunciation-card')).not.toContainText('Mio glazbi su mi');

  await answer(page,'Najviše slušam jazz.');
  await expect(page.locator('.speak-feedback')).toContainText('matched the topic');
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Moja omiljena glazba je jazz.');
  await expect(page.locator('.free-speak-pronunciation-card')).toContainText('Najviše volim slušati jazz.');
  await expect(page.locator('[data-next]')).toBeVisible();
});

test('unfinished Croatian music answer becomes a gentle conversation and can fall back to yes or no',async({page})=>{
  await reachMusic(page);

  await answer(page,'moja najdraža muzika svira kad idem na');
  await expect(page.locator('.speak-feedback')).toContainText('continue the conversation naturally');
  await expect(page.locator('[data-next]')).toHaveCount(0);
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Gdje obično slušaš glazbu?');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Where do you usually listen to music?');
  await expect(page.locator('.free-speak-pronunciation-card')).toHaveCount(0);

  await answer(page,'hmm');
  await expect(page.locator('.speak-feedback')).toContainText('make it easier');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Ja, primjerice, slušam glazbu na putu na posao.');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Je li i kod tebe tako?');
  await expect(page.locator('.free-speak-conversation-card')).toContainText('Is it like that for you too?');

  await answer(page,'Da');
  await expect(page.locator('.free-speak-transcript')).toContainText('Da');
  await expect(page.locator('.speak-feedback')).toContainText('matched the topic');
  await expect(page.locator('.free-speak-question')).not.toHaveText('Reci mi nešto o svojoj omiljenoj glazbi.',{timeout:2500});
  await expect(page.locator('.speak-progress')).toContainText('8 / 65');
});
