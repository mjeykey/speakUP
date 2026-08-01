import { everydayStory } from './stories/everyday.js';

export const STORIES = [
  everydayStory,
  { id: 'romance', emoji: '❤️', title: 'Romance', subtitle: 'The Café in the Rain', pages: ['They meet in a quiet café while rain touches the windows.'] },
  { id: 'travel', emoji: '✈️', title: 'Travel', subtitle: 'One Hundred Euros in Portugal', pages: ['A small journey begins at the station with one light bag.'] }
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
