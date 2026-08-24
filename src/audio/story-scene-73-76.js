const SCENE_PAGES=new Set([73,74,75,76]);
const TILE_WORDS=new Set([
  'tile','tiles','telha','telhas','ziegel','dachziegel',
  'teja','tejas','tuile','tuiles','tegola','tegole',
  'crijep','crijepovi','crijepove','crjepovi','crjepove'
]);
const TILE_URL=new URL('../../assets/audio/freesound_community-tiles-smashing-90254-mobile.mp3?v=237',import.meta.url).href;
const GAP_DELAY_MS=1900;

let timer=0;
let track=null;
let lastPage=-1;
let lastEnabled=null;
let playedPage=-1;
let primed=false;

function currentPage(root){
  const match=root.querySelector('.story-progress')?.textContent?.match(/(\d+)/);
  return match?Number(match[1]):0;
}

function isTargetStory(root){
  return /Last Wagon of Avarin/i.test(root.querySelector('.story-subtitle')?.textContent||'');
}

function normalizeWord(value){
  return String(value||'')
    .normalize('NFD')
    .replace(/\p{M}/gu,'')
    .toLocaleLowerCase()
    .replace(/[^\p{L}]/gu,'');
}

function textWords(value){
  return String(value||'').match(/\p{L}+(?:[вЂ™'-]\p{L}+)*/gu)||[];
}

function visibleText(root){
  return [...root.querySelectorAll('.story-copy')]
    .map(node=>node.textContent||'')
    .join(' ')
    .trim();
}

function targetPosition(text){
  const words=textWords(text);
  const exact=words.findIndex(word=>TILE_WORDS.has(normalizeWord(word)));
  return{
    index:exact>=0?exact:Math.max(0,Math.round(words.length*.68)),
    matched:exact>=0?normalizeWord(words[exact]):''
  };
}

function fallbackDelay(root,page){
  if(page===75)return GAP_DELAY_MS;
  const target=targetPosition(visibleText(root));
  const rate=page===73&&['telha','telhas'].includes(target.matched)?.62:page===73?.88:.62;
  const delay=350+target.index*(265/rate);
  return Math.max(2200,Math.min(8500,Math.round(delay)));
}

function installSpeechBoundaryBridge(){
  const synth=window.speechSynthesis;
  if(!synth||synth.__speakUpStoryWordBridgeInstalled)return;
  synth.__speakUpStoryWordBridgeInstalled=true;
  const routedSpeak=synth.speak.bind(synth);
  synth.speak=utterance=>{
    if(utterance&&!utterance.__speakUpStoryWordBridge){
      utterance.__speakUpStoryWordBridge=true;
      const previousBoundary=utterance.onboundary;
      utterance.onboundary=event=>{
        try{previousBoundary?.call(utterance,event);}catch(_){}
        const text=String(utterance.text||'');
        const index=Math.max(0,Number(event.charIndex)||0);
        const word=text.slice(index).match(/^\s*([\p{L}]+(?:[вЂ™'-][WУJКJЉKЭJOЛ–МW_	ЙОВ€YЉ]ЫЬ™
\™]\›ЋВ€Ъ[™ЭЛ™\Ь]Ъ]™[ќ
™]ИЭ\ЭЫQ]™[ќ
	ЬЬXZЭ\њЭЬћK]ЫЬ™	ЛВ€]Z[ћЭЫЬ™Ъ\’[™^љ[™^^B€JJNВ€NВ€B€™]\›€›Э]YЬXZК]\[ЩJNВ€NВџB‚™ќ[Э[Ы€[њЭ\™UXЪК
^В€YЉXЪК\™]\›€XЪОВ€XЪПYШЭ[Y[ќЬ™X]Q[[Y[ќ
	Ш]Y[ЙКNВ€XЪЛњЬПUSWХT“В€XЪЛњ™[ШYIШ]]ЙОВ€XЪЛ›ЫЬY[ЩNВ€XЪЛќ›Ы[YOLNВ€XЪЛњЩ]]љXќ]J	Ь^\Ъ[›[™IЛ	ЙКNВ€XЪЛњЭ[K™\Ь^OIЫ›Ы™IОВ€XЪЛ™]\Щ]њЭЬћUXЪПIЭ[KXњ™XZЙОВ€ШЭ[Y[ќ›ЩK\[™Ъ[
XЪКNВ€XЪЛ›ШY

NВ€™]\›€XЪОВџB‚\Ю[Иќ[Э[Ы€љ[YUXЪК
^В€YЉљ[YY
\™]\›ЋВ€ЫЫњЭ]Y[ПY[њЭ\™UXЪК
NВ€ЫЫњЭ™]љ[Э\У]]YX]Y[Л›]]YВ€ћ^В€]Y[Л›]]Y]ќYNВ€]Y[ЛЭ\њ™[ќ[YOLВ€]ШZ]]Y[Лњ^J
NВ€]Y[Лњ]\ЩJ
NВ€]Y[ЛЭ\њ™[ќ[YOLВ€]Y[Л›]]Y\™]љ[Э\У]]YВ€љ[YY]ќYNВ€XШ]Ъ
К^В€]Y[Л›]]Y\™]љ[Э\У]]YВ€BџB‚™ќ[Э[Ы€ЭЬ[J
^В€ЫX\•[Y[Э]
[Y\ЉNВ€[Y\ЏLВ€YЉ]XЪК\™]\›ЋВ€ћ^В€XЪЛњ]\ЩJ
NВ€XЪЛЭ\њ™[ќ[YOLВ€XШ]Ъ
К^ЯBџB‚\Ю[Иќ[Э[Ы€^U[J›ЫЭYЩJ^В€YЉ^YYYЩOOO\YЩ_Э\њ™[ќYЩJ›ЫЭ
HOO\YЩ_Z\Х\™Щ]ЭЬћJ›ЫЭ
J\™]\›ЋВ€^YYYЩO\YЩNВ€ЫЫњЭ]Y[ПY[њЭ\™UXЪК
NВ€ћ^В€]Y[Лњ]\ЩJ
NВ€]Y[ЛЭ\њ™[ќ[YOLВ€]Y[Л›]]YY[ЩNВ€]Y[Лќ›Ы[YOLNВ€]ШZ]]Y[Лњ^J
NВ€XШ]Ъ
\њ›ЬЉ^В€^YYYЩOKLNВ€ЫЫњЫЫKќШ\›Љ	Х[HЫЭ[™^XXЪИZ[Y‰Л\њ›ЬЉNВ€BџB‚™ќ[Э[Ы€ШЪY[U[J›ЫЭYЩJ^В€ЭЬ[J
NВ€[Y\Џ]Ъ[™ЭЛњЩ][Y[Э]


OOћВ€[Y\ЏLВ€›ЪY^U[J›ЫЭYЩJNВ€K[XЪС[^J›ЫЭYЩJJNВџB‚™^Ьќќ[Э[Ы€ЭЬШЩ[™MМННЉ
^В€\ЭYЩOKLNВ€\Э[X›Y[ќ[В€^YYYЩOKLNВ€ЭЬ[J
NВџB‚™^Ьќќ[Э[Ы€[њЭ[ШЩ[™MМННЉ›ЫЭЭЬ™J^В€YЉ›ЫЭ™]\Щ]ќ[Pњ™XZТ[њЭ[YOOIМIК\™]\›ЋВ€›ЫЭ™]\Щ]ќ[Pњ™XZТ[њЭ[YIМIОВ€[њЭ\™UXЪК
NВ€[њЭ[ЬYXЪ›Э[™\ћPњљYЩJ
NВ‚€ЫЫњЭ[›ШЪПJ
OOћВ€YЉЭЬ™K™Щ]Э]J
K]Y[УЫЉ]›ЪYљ[YUXЪК
NВ€NВ‚€ЫЫњЭЫ”ЭЬћUЫЬ™Y]™[ќOћВ€ЫЫњЭYЩOXЭ\њ™[ќYЩJ›ЫЭ
NВ€ЫЫњЭ[X›YP›ЫЫX[ЉЭЬ™K™Щ]Э]J
K]Y[УЫЉNВ€ЫЫњЭЫЬ™[›Ь›X[^™UЫЬ™
]™[ќ™]Z[ЛќЫЬ™
NВ€YЉY[X›YTРСS‘WФQСTЛљ\КYЩJ_Z\Х\™Щ]ЭЬћJ›ЫЭ
_USWХУФ‘Лљ\КЫЬ™
J\™]\›ЋВ€ЫX\•[Y[Э]
[Y\ЉNВ€[Y\ЏLВ€›ЪY^U[J›ЫЭYЩJNВ€NВ‚€ЫЫњЭЮ[ПJ
OOћВ€ЫЫњЭYЩOXЭ\њ™[ќYЩJ›ЫЭ
NВ€ЫЫњЭ[X›YP›ЫЫX[ЉЭЬ™K™Щ]Э]J
K]Y[УЫЉNВ€YЉYЩOOO[\ЭYЩI‰™[X›YOO[\Э[X›Y
\™]\›ЋВ€\ЭYЩO\YЩNВ€\Э[X›YY[X›YВ€^YYYЩOKLNВ€YЉ[X›Y	‰”РСS‘WФQСTЛљ\КYЩJI‰љ\Х\™Щ]ЭЬћJ›ЫЭ
J\ШЪY[U[J›ЫЭYЩJNВ€[ЩHЭЬ[J
NВ€NВ‚€›ЫЭY]™[ќ\Э[™\Љ	ЬЪ[ќ\™ЭЫ‰Л[›ШЪЛШШ\\™NќќY_JNВ€›ЫЭY]™[ќ\Э[™\Љ	ШЫXЪЙЛ[›ШЪЛШШ\\™NќќY_JNВ€Ъ[™ЭЛY]™[ќ\Э[™\Љ	ЬЬXZЭ\њЭЬћK]ЫЬ™	ЛЫ”ЭЬћUЫЬ™
NВ‚€ЫЫњЭШњЩ\ќ™\Џ[™]И]]][Ы“ШњЩ\ќ™\ЉЮ[КNВ€ШњЩ\ќ™\‹›ШњЩ\ќ™J›ЫЭШЪ[\ЭќќYKЭXќ™YNќќYKЪ\XЭ\‘]NќќY_JNВ€Ю[К
NВџB