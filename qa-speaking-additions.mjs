import assert from 'node:assert/strict';
import { getSpeakingAdditions, SPEAKING_ADDITIONS_PER_TOPIC, SPEAKING_ADDITIONS_TOTAL } from './src/data/speaking-additions/index.js';
import { isRelevantSpeakingAnswer } from './src/data/speaking-conversations.js';

const LANGUAGES=['en-GB','de-DE','pt-PT','es-ES','hr-HR','fr-FR'];
const TOPICS=['meet','cafe','shopping','directions','work','feelings','everyday'];
let checks=0;

const check=(condition,message)=>{
  checks+=1;
  assert.ok(condition,message);
};

const englishFirst=Object.fromEntries(TOPICS.map(topicId=>[
  topicId,
  getSpeakingAdditions(topicId,'en-GB','en-GB')[0]?.question
]));

for(const language of LANGUAGES){
  let total=0;
  for(const topicId of TOPICS){
    const turns=getSpeakingAdditions(topicId,language,language);
    total+=turns.length;
    check(turns.length===SPEAKING_ADDITIONS_PER_TOPIC,`${language}/${topicId}: expected ${SPEAKING_ADDITIONS_PER_TOPIC}, got ${turns.length}`);
    if(language!=='en-GB')check(turns[0]?.question!==englishFirst[topicId],`${language}/${topicId}: fell back to English`);
    turns.forEach((turn,index)=>{
      check(Boolean(turn.question&&turn.translation&&turn.example&&turn.exampleTranslation),`${language}/${topicId}/${index}: missing text`);
      check(isRelevantSpeakingAnswer(turn.example,turn),`${language}/${topicId}/${index}: visible example is rejected`);
    });
  }
  check(total===SPEAKING_ADDITIONS_TOTAL,`${language}: expected ${SPEAKING_ADDITIONS_TOTAL}, got ${total}`);
}

const croatianGerman=getSpeakingAdditions('meet','hr-HR','de-DE')[0];
const germanGerman=getSpeakingAdditions('meet','de-DE','de-DE')[0];
check(croatianGerman.question!==englishFirst.meet,'Croatian learning text fell back to English');
check(croatianGerman.translation===germanGerman.question,'German native translation is not localized correctly');

const dalmatian=getSpeakingAdditions('meet','hr-DAL','de-DE')[0];
const andalusian=getSpeakingAdditions('meet','es-AN','de-DE')[0];
check(Boolean(dalmatian?.question),'Dalmatian alias produced no speaking additions');
check(Boolean(andalusian?.question),'Andalusian alias produced no speaking additions');

console.log(`✅ ${checks} speaking-addition QA checks passed.`);
