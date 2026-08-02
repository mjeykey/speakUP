import { selfLove } from './categories/self-love.js';
import { confidence } from './categories/confidence.js';
import { kindness } from './categories/kindness.js';
import { gratitude } from './categories/gratitude.js';
import { calm } from './categories/calm.js';
import { forgiveness } from './categories/forgiveness.js';
import { hope } from './categories/hope.js';
import { courage } from './categories/courage.js';
import { stoicWisdom } from './categories/stoic-wisdom.js';
import { spiralThoughts } from './categories/spiral-thoughts.js';
import { visualisation } from './categories/visualisation.js';
import { meditation } from './categories/meditation.js';
import { nature } from './categories/nature.js';
import { expandVoiceCategory } from './category-library.js?v=1';

const categories = [
  selfLove,
  confidence,
  kindness,
  gratitude,
  calm,
  forgiveness,
  hope,
  courage,
  stoicWisdom,
  spiralThoughts,
  visualisation,
  meditation,
  nature
];

export const VOICE_CATEGORIES = categories.map(expandVoiceCategory);
