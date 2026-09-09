import assert from 'node:assert/strict';
import { polishCroatianSpeakingTurn, hasObviousCroatianGrammarIssue, getRecommendedSpeakingSentence, getAlternativeSpeakingSentence } from './src/data/speaking-croatian-quality.js';
import { isRelevantSpeakingAnswer } from './src/data/speaking-conversations.js';

let checks=0;
const check=(condition,message)=>{checks+=1;assert.ok(condition,message);};

const family=polishCroatianSpeakingTurn({
  intent:'profile',
  signals:['family','Familie','família','familia','obitelj','famille'],
  question:'Reci mi nešto o svojim obitelj.',
  translation:'Tell me about your family.',
  example:'Moja obitelj važan je dio mog života.',
  exampleTranslation:'My family is an important part of my life.'
},'hr-HR','en-GB');
check(family.question==='Reci mi nešto o svojoj obitelji.','family question was not corrected');
check(family.example==='Moja obitelj mi je jako važna.','natural family example was not applied');
check(isRelevantSpeakingAnswer('Moji roditelji žive blizu mene.',family),'parents should count as a family answer');
check(isRelevantSpeakingAnswer('Moji roditelji žive blizu meni',family),'speech-recognition case variation should still count as on-topic');
check(isRelevantSpeakingAnswer('Moja mama živi u Splitu.',family),'mother should count as a family answer');

const music=polishCroatianSpeakingTurn({
  question:'Reci mi nešto o svojim omiljenoj glazbi.',
  translation:'Tell me about your favourite music.',
  example:'Moja omiljenoj glazbi važan je dio mog života.',
  exampleTranslation:'My favourite music is an important part of my life.',
  signals:['music','Musik','música','glazbi','musique']
},'hr-HR','en-GB');
check(music.question==='Reci mi nešto o svojoj omiljenoj glazbi.','favourite music agreement was not corrected');
check(music.example==='Moja omiljena glazba važan je dio mog života.','music example should stay specific and grammatical');
check(isRelevantSpeakingAnswer('Najviše slušam jazz.',music),'music genre should count as on-topic');
check(isRelevantSpeakingAnswer('Volim rock.',music),'rock should count as on-topic');

const hobbies=polishCroatianSpeakingTurn({
  question:'Reci mi nešto o svojim hobijima.',
  translation:'Tell me about your hobbies.',
  example:'Moja hobijima važan je dio mog života.',
  exampleTranslation:'My hobbies are an important part of my life.'
},'hr-HR','en-GB');
check(hobbies.question==='Reci mi nešto o svojim hobijima.','correct plural possessive was damaged');

const second=polishCroatianSpeakingTurn({
  question:'Zašto su ti važni obitelj?',
  translation:'Why is family important to you?',
  example:'obitelj mi je važno jer obogaćuje moj život.',
  exampleTranslation:'Family matters to me.'
},'hr-HR','en-GB');
check(second.question==='Zašto ti je važno razgovarati o obitelji?','secondary family question was not corrected');
check(second.example==='Obitelj mi je važna jer obogaćuje moj život.','secondary family example was not corrected');

const nativeCroatian=polishCroatianSpeakingTurn({
  question:'Tell me about your family.',
  translation:'Reci mi nešto o svojim obitelj.',
  example:'My family matters to me.',
  exampleTranslation:'Moja obitelj važan je dio mog života.'
},'en-GB','hr-HR');
check(nativeCroatian.translation==='Reci mi nešto o svojoj obitelji.','Croatian native-language translation was not corrected');
check(nativeCroatian.exampleTranslation==='Moja obitelj mi je jako važna.','Croatian native-language example was not corrected');

check(hasObviousCroatianGrammarIssue('moji obitelji živi kao meni','hr-HR'),'the reported malformed answer was not flagged');
check(hasObviousCroatianGrammarIssue('Moja obitelji živi blizu mene','hr-HR'),'wrong family agreement was not flagged');
check(hasObviousCroatianGrammarIssue('moji hobi je crtati i izaći vani','hr-HR'),'broken hobby agreement was not flagged');
check(hasObviousCroatianGrammarIssue('moje hobije crtati i trčati','hr-HR'),'reported hobby sentence was not flagged');
check(hasObviousCroatianGrammarIssue('moji hobiji su crtani vježbanje','hr-HR'),'speech-recognition hobby form from the screenshot was not flagged');
check(hasObviousCroatianGrammarIssue('moji hobiji su crtati i vježbati','hr-HR'),'infinitives after the hobby noun should be corrected to hobby nouns');
check(hasObviousCroatianGrammarIssue('Mio glazbi su mi','hr-HR'),'reported malformed music answer was not flagged');
check(!hasObviousCroatianGrammarIssue('Moja omiljena glazba je jazz.','hr-HR'),'correct music sentence was rejected');
check(!hasObviousCroatianGrammarIssue('Najviše volim slušati rock.','hr-HR'),'natural music sentence was rejected');
check(!hasObviousCroatianGrammarIssue('Moji hobiji su crtanje i vježbanje.','hr-HR'),'correct exercise hobby sentence was rejected');
check(!hasObviousCroatianGrammarIssue('Moji hobiji su crtanje i trčanje.','hr-HR'),'correct hobby sentence was rejected');
check(!hasObviousCroatianGrammarIssue('Volim crtati i trčati.','hr-HR'),'natural hobby alternative was rejected');
check(!hasObviousCroatianGrammarIssue('Moja obitelj živi blizu mene.','hr-HR'),'correct nominative family sentence was rejected');
check(!hasObviousCroatianGrammarIssue('Moja obitelj mi je jako važna.','hr-HR'),'correct family sentence was rejected');
check(!hasObviousCroatianGrammarIssue('U mojoj obitelji živi pet osoba.','hr-HR'),'correct locative family sentence was rejected');
check(!hasObviousCroatianGrammarIssue('moji obitelji živi kao meni','de-DE'),'Croatian heuristic leaked into another learning language');

check(getRecommendedSpeakingSentence('moji hobi je crtati i izaći vani','hr-HR')==='Moji hobiji su crtanje i izlasci.','hobby recommendation should keep hobby vocabulary');
check(getAlternativeSpeakingSentence('moji hobi je crtati i izaći vani','hr-HR')==='Volim crtati i izlaziti.','hobby alternative was not generated');
check(getRecommendedSpeakingSentence('moje hobije crtati i trčati','hr-HR')==='Moji hobiji su crtanje i trčanje.','reported hobby recommendation should keep hobby vocabulary');
check(getAlternativeSpeakingSentence('moje hobije crtati i trčati','hr-HR')==='Volim crtati i trčati.','reported hobby alternative was not generated');
check(getRecommendedSpeakingSentence('moje hobije plivati i plesati','hr-HR')==='Moji hobiji su plivanje i plesanje.','generic hobby recommendation was not corrected');
check(getAlternativeSpeakingSentence('moje hobije plivati i plesati','hr-HR')==='Volim plivati i plesati.','generic hobby alternative was not generated');
check(getRecommendedSpeakingSentence('moji hobiji su crtani vježbanje','hr-HR')==='Moji hobiji su crtanje i vježbanje.','screenshot hobby sentence was not repaired before pronunciation');
check(getAlternativeSpeakingSentence('moji hobiji su crtani vježbanje','hr-HR')==='Volim crtati i vježbati.','screenshot hobby alternative was not repaired');
check(getRecommendedSpeakingSentence('Mio glazbi su mi','hr-HR')==='Moja omiljena glazba mi je jako važna.','malformed music sentence was not repaired before pronunciation');
check(getAlternativeSpeakingSentence('Mio glazbi su mi','hr-HR')==='Volim slušati glazbu.','malformed music sentence should get a safe alternative');
check(getRecommendedSpeakingSentence('Volim jazz.','hr-HR')==='Moja omiljena glazba je jazz.','genre answer should produce a topic-focused music recommendation');
check(getAlternativeSpeakingSentence('Volim jazz.','hr-HR')==='Najviše volim slušati jazz.','genre answer should produce a natural music alternative');
check(getRecommendedSpeakingSentence('moji roditelji žive blizu meni','hr-HR')==='Moji roditelji žive blizu mene.','family pronunciation recommendation was not corrected');
check(getAlternativeSpeakingSentence('moji roditelji žive blizu meni','hr-HR')==='','family answer should not invent a hobby or music alternative');
check(getRecommendedSpeakingSentence('I like drawing.','en-GB')==='I like drawing.','non-Croatian recommendation should preserve the sentence');

console.log(`✅ ${checks} Croatian speaking QA checks passed.`);
