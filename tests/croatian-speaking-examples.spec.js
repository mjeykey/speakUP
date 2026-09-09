import { test, expect } from '@playwright/test';

test('film prompt uses a real example instead of the repeated important-part template',async({page})=>{
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
  const answer=async text=>{await page.evaluate(value=>{window.__speechTranscript=value;},text);await page.locator('[data-answer]').click();await expect(page.locator('[data-next]')).toBeVisible();await page.locator('[data-next]').click();};

  await page.goto('./');
  await page.locator('[data-start]').click();
  await page.locator('[data-mode="speak-practice"]').click();
  await page.locator('[data-start]').click();
  await page.locator('.free-speak-topic').filter({hasText:'Getting to know you'}).click();

  await answer('Zovem se Marina.');
  await answer('Dolazim iz Hrvatske.');
  await answer('Živim u Lisabonu.');
  await answer('Moja obitelj mi je jako važna.');
  await answer('Moj najbolji prijatelj uvijek me nasmije.');
  await answer('Moji hobiji su crtanje i vježbanje.');
  await answer('Najviše slušam jazz.');

  await expect(page.locator('.speak-progress')).toContainText('8 / 65');
  await expect(page.locator('.free-speak-question')).toHaveText('Reci mi nešto o svom omiljenom filmu.');
  await expect(page.locator('.free-speak-example-card .free-speak-example')).toHaveText('Moj omiljeni film je Interstellar.');
  await expect(page.locator('.free-speak-example-card .speak-translation')).toHaveText('My favourite film is Interstellar.');
  await expect(page.locator('.free-speak-example-card')).not.toContainText('važan dio');
  await expect(page.locator('.free-speak-example-card')).not.toContainText('important part');
});
