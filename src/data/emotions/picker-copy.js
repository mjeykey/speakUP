export const EMOTION_PICKER_COPY = [
  {
    kicker: 'Emotions',
    title: 'What is asking for your attention today?',
    subtitle: 'Choose the feeling that comes closest. Nothing has to be fixed immediately.'
  },
  {
    kicker: 'A moment for you',
    title: 'How does this moment feel?',
    subtitle: 'You can begin exactly where you are and skip anything that does not help.'
  },
  {
    kicker: 'Check in gently',
    title: 'What feels strongest right now?',
    subtitle: 'There is no wrong answer. Pick the word that fits best for this moment.'
  },
  {
    kicker: 'Speak from where you are',
    title: 'Which feeling is closest today?',
    subtitle: 'We will acknowledge it first, then turn one small step into language practice.'
  },
  {
    kicker: 'No pressure',
    title: 'What would you like support with?',
    subtitle: 'Choose one feeling. You can change your mind or return to the menu at any time.'
  },
  {
    kicker: 'Pause and notice',
    title: 'What is happening inside right now?',
    subtitle: 'You do not need a perfect label. Choose the closest one and continue gently.'
  }
];

export function getEmotionPickerCopy() {
  const previous = Number(sessionStorage.getItem('speakup-emotion-copy') || -1);
  let next = Math.floor(Math.random() * EMOTION_PICKER_COPY.length);
  if (EMOTION_PICKER_COPY.length > 1 && next === previous) next = (next + 1) % EMOTION_PICKER_COPY.length;
  sessionStorage.setItem('speakup-emotion-copy', String(next));
  return EMOTION_PICKER_COPY[next];
}
