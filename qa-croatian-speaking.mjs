import assert from 'node:assert/strict';
import { polishCroatianSpeakingTurn, hasObviousCroatianGrammarIssue } from './src/data/speaking-croatian-quality.js';
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
  exampleTranslation:'My favourite music is an important part of my life.'
},'hr-HR','en-GB');
check(music.question==='Reci mi nešto o svojoj omiljenoj glazbi.','favourite music agreement was not corrected');

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
check(!hasObviousCroatianGrammarIssue('Moja obitelj živi blizu mene.','hr-HR'),'correct nominative family sentence was rejected');
check(!hasObviousCroatianGrammarIssue('Moja obitelj mi je jako važna.','hr-HR'),'correct family sentence was rejected');
check(!hasObviousCroatianGrammarIssue('U mojoj obitelji živi pet osoba.','hr-HR'),'correct locative family sentence was rejected');
check(!hasObviousCroatianGrammarIssue('moji obitelji živi kao meni','de-DE'),'Croatian heuristic leaked into another learning language');

console.log(`✅ ${checks} Croatian speaking QA checks passed.`);
