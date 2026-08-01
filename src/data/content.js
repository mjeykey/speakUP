import { everydayStory } from './stories/everyday.js?v=3';
import { romanceStory } from './stories/romance.js?v=1';
import { travelStory } from './stories/travel.js?v=1';
import { horrorStory } from './stories/horror.js?v=1';

export const STORIES = [
  everydayStory,
  romanceStory,
  travelStory,
  horrorStory
];

export const WORDS = [
  { pt: 'rua', en: 'street' },
  { pt: 'amiga', en: 'female friend' },
  { pt: 'amigo', en: 'male friend' },
  { pt: 'café', en: 'coffee' },
  { pt: 'manhã', en: 'morning' }
];

export const GAPS = [
  { sentence: 'Eu caminho pela _____.', answer: 'rua', options: ['mar', 'mesa', 'rua', 'café'], english: 'I walk down the street.' },
  { sentence: 'Eu bebo _____ de manhã.', answer: 'água', options: ['água', 'porta', 'livro', 'chuva'], english: 'I drink water in the morning.' }
];