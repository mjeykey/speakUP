const family=value=>{
  const code=String(value||'').toLowerCase();
  if(code.startsWith('de'))return 'de';
  if(code.startsWith('pt'))return 'pt';
  if(code.startsWith('es'))return 'es';
  if(code.startsWith('hr'))return 'hr';
  if(code.startsWith('fr'))return 'fr';
  return 'en';
};

const normalize=value=>String(value||'')
  .toLocaleLowerCase('pt')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/[^\p{L}\p{N}\s-]/gu,' ')
  .replace(/\s+/g,' ')
  .trim();

const t=(en,de,pt,es,hr,fr)=>({en,de,pt,es,hr,fr});

const MUSIC_SCAFFOLD={
  followUp:'Gdje obično slušaš glazbu?',
  followUpTranslation:t('Where do you usually listen to music?','Wo hörst du normalerweise Musik?','Onde costumas ouvir música?','¿Dónde sueles escuchar música?','Gdje obično slušaš glazbu?','Où écoutes-tu habituellement de la musique ?'),
  example:'Ja, primjerice, slušam glazbu na putu na posao.',
  exampleTranslation:t('For example, I listen to music on the way to work.','Ich höre zum Beispiel auf dem Weg zur Arbeit Musik.','Por exemplo, ouço música a caminho do trabalho.','Por ejemplo, escucho música de camino al trabajo.','Ja, primjerice, slušam glazbu na putu na posao.','Par exemple, j’écoute de la musique sur le chemin du travail.'),
  easyQuestion:'Je li i kod tebe tako?',
  easyTranslation:t('Is it like that for you too?','Ist das bei dir auch so?','Contigo também é assim?','¿A ti también te pasa?','Je li i kod tebe tako?','C’est pareil pour toi aussi ?'),
  followUpAcceptsYesNo:false
};

const FAMILY_SCAFFOLD={
  followUp:'Živi li tvoja obitelj blizu tebe?',
  followUpTranslation:t('Does your family live near you?','Wohnt deine Familie in deiner Nähe?','A tua família vive perto de ti?','¿Tu familia vive cerca de ti?','Živi li tvoja obitelj blizu tebe?','Ta famille habite près de chez toi ?'),
  example:'Moja obitelj živi blizu mene.',
  exampleTranslation:t('My family lives near me.','Meine Familie wohnt in meiner Nähe.','A minha família vive perto de mim.','Mi familia vive cerca de mí.','Moja obitelj živi blizu mene.','Ma famille habite près de chez moi.'),
  easyQuestion:'Je li i kod tebe tako?',
  easyTranslation:t('Is it like that for you too?','Ist das bei dir auch so?','Contigo também é assim?','¿A ti también te pasa?','Je li i kod tebe tako?','C’est pareil pour toi aussi ?'),
  followUpAcceptsYesNo:true
};

const PORTUGUESE_ORIGIN_SCAFFOLD={
  followUp:'És de Portugal?',
  followUpTranslation:t('Are you from Portugal?','Kommst du aus Portugal?','És de Portugal?','¿Eres de Portugal?','Jesi li iz Portugala?','Tu viens du Portugal ?'),
  example:'Eu, por exemplo, sou de Lisboa.',
  exampleTranslation:t('For example, I am from Lisbon.','Ich komme zum Beispiel aus Lissabon.','Eu, por exemplo, sou de Lisboa.','Por ejemplo, soy de Lisboa.','Ja sam, primjerice, iz Lisabona.','Par exemple, je viens de Lisbonne.'),
  easyQuestion:'És de Portugal?',
  easyTranslation:t('Are you from Portugal?','Kommst du aus Portugal?','És de Portugal?','¿Eres de Portugal?','Jesi li iz Portugala?','Tu viens du Portugal ?'),
  followUpAcceptsYesNo:true
};

const GENERIC_FOLLOW_UP={
  followUp:'Možeš li to reći jednostavnije?',
  followUpTranslation:t('Can you say it more simply?','Kannst du es einfacher sagen?','Consegues dizer isso de forma mais simples?','¿Puedes decirlo de forma más sencilla?','Možeš li to reći jednostavnije?','Peux-tu le dire plus simplement ?'),
  easyQuestion:'Je li kod tebe slično?',
  easyTranslation:t('Is it similar for you?','Ist es bei dir ähnlich?','Contigo é parecido?','¿En tu caso es parecido?','Je li kod tebe slično?','C’est similaire pour toi ?'),
  followUpAcceptsYesNo:false
};

const DANGLING_CROATIAN_WORDS=new Set([
  'na','u','za','od','do','iz','s','sa','kod','prema','kroz','bez','oko','kad','kada','jer','ako','dok','da','pa','ali','i','ili'
]);

export function isSpeakingAnswerIncomplete(value,learningLanguage){
  if(!String(learningLanguage||'').toLowerCase().startsWith('hr'))return false;
  const text=normalize(value);
  if(!text)return false;
  const words=text.split(/\s+/u).filter(Boolean);
  if(words.length<2)return false;
  return DANGLING_CROATIAN_WORDS.has(words.at(-1));
}

export function getSpeakingConversationScaffold(turn,learningLanguage,nativeLanguage){
  const learning=String(learningLanguage||'').toLowerCase();
  const question=String(turn?.question||'');
  const normalizedQuestion=normalize(question);
  const f=family(nativeLanguage);

  if(learning.startsWith('pt')){
    if(/^de onde (?:es|e)$/u.test(normalizedQuestion)){
      const scaffold=PORTUGUESE_ORIGIN_SCAFFOLD;
      return {
        followUp:scaffold.followUp,
        followUpTranslation:scaffold.followUpTranslation[f],
        example:scaffold.example,
        exampleTranslation:scaffold.exampleTranslation[f],
        easyQuestion:scaffold.easyQuestion,
        easyTranslation:scaffold.easyTranslation[f],
        followUpAcceptsYesNo:true
      };
    }
    return null;
  }

  if(!learning.startsWith('hr'))return null;
  let scaffold=null;
  if(question.includes('omiljenoj glazbi'))scaffold=MUSIC_SCAFFOLD;
  else if(question.includes('obitelji'))scaffold=FAMILY_SCAFFOLD;

  if(scaffold){
    return {
      followUp:scaffold.followUp,
      followUpTranslation:scaffold.followUpTranslation[f],
      example:scaffold.example,
      exampleTranslation:scaffold.exampleTranslation[f],
      easyQuestion:scaffold.easyQuestion,
      easyTranslation:scaffold.easyTranslation[f],
      followUpAcceptsYesNo:Boolean(scaffold.followUpAcceptsYesNo)
    };
  }

  return {
    followUp:GENERIC_FOLLOW_UP.followUp,
    followUpTranslation:GENERIC_FOLLOW_UP.followUpTranslation[f],
    example:String(turn?.example||''),
    exampleTranslation:String(turn?.exampleTranslation||''),
    easyQuestion:GENERIC_FOLLOW_UP.easyQuestion,
    easyTranslation:GENERIC_FOLLOW_UP.easyTranslation[f],
    followUpAcceptsYesNo:false
  };
}

export function getEasyConversationAnswerIntent(value,learningLanguage){
  const learning=String(learningLanguage||'').toLowerCase();
  const text=normalize(value);
  if(learning.startsWith('pt')){
    if(/^(sim|claro|claro que sim|sou|sim sou)$/u.test(text))return 'yes';
    if(/^(nao|nao sou|claro que nao)$/u.test(text))return 'no';
    return '';
  }
  if(!learning.startsWith('hr'))return '';
  if(/^(da|jest|je|jesam|naravno|da jesam|da je)$/u.test(text))return 'yes';
  if(/^(ne|nije|nisam|ne nisam|nije tako)$/u.test(text))return 'no';
  return '';
}

export function isEasyConversationAnswer(value,learningLanguage){
  return Boolean(getEasyConversationAnswerIntent(value,learningLanguage));
}
