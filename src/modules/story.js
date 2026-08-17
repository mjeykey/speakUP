import { getMultilingualStory } from '../data/stories/multilingual-stories.js?v=1';
import { fantasyStory } from '../data/stories/fantasy.js?v=3';
import { getFantasyTranslation } from '../data/stories/fantasy-translations.js?v=1';
import { speak, stopSpeech } from '../audio/speech.js?v=63';
import { isStorySfxPlaying, preloadStorySfx, playStorySfx, stopStorySfx } from '../audio/story-sfx-simple.js?v=18';
import { getSpeechLanguage, languageName } from '../data/language-content-matrix.js?v=1';
