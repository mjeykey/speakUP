export const STORIES = [
  { id: 'everyday', emoji: '🏠', title: 'Everyday Life', subtitle: 'A Morning in the Neighborhood', english: 'Every morning, Leonor leaves her house and walks down the street.', portuguese: 'Todas as manhãs, Leonor sai de casa e caminha pela rua.' },
  { id: 'romance', emoji: '❤️', title: 'Romance', subtitle: 'The Café in the Rain', english: 'They meet in a quiet café while rain touches the windows.', portuguese: 'Eles encontram-se num café tranquilo enquanto a chuva toca nas janelas.' },
  { id: 'travel', emoji: '✈️', title: 'Travel', subtitle: 'One Hundred Euros in Portugal', english: 'A small journey begins at the station with one light bag.', portuguese: 'Uma pequena viagem começa na estação com uma mala leve.' }
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
