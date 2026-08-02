export const EMOTION_CLOSINGS = {
  jealousy: [
    { title:'You do not have to compete for your worth', body:'Jealousy may still be here. But your value did not shrink because someone else was chosen, praised or noticed.', spark:'Someone else shining does not switch off your light.' },
    { title:'This fear does not define you', body:'Part of you may be afraid of losing love, attention or safety. That fear deserves honesty, not shame.', spark:'You are still worthy, even before anyone reassures you.' }
  ],
  anger: [
    { title:'You do not have to calm down perfectly', body:'The anger may still be moving through you. For now, it is enough that you did not abandon yourself inside it.', spark:'Sometimes the first spark is simply noticing what crossed your line.' },
    { title:'The storm can speak without taking over', body:'Your anger may be carrying hurt, exhaustion or a boundary that was ignored.', spark:'You can keep the message without letting the fire choose the next move.' }
  ],
  anxiety: [
    { title:'You can be afraid and still be here', body:'Nothing has to be solved in this moment. You are allowed to move through uncertainty one breath at a time.', spark:'A small piece of solid ground is still ground.' },
    { title:'Your mind is searching for safety', body:'It may keep offering worst-case scenarios because it wants certainty. You do not have to follow every one of them.', spark:'Not knowing is uncomfortable, but it is not the same as danger.' }
  ],
  stress: [
    { title:'You are carrying a lot', body:'The pressure may not disappear when this screen closes. But you do not have to carry all of it in the same second.', spark:'One thing can matter without everything becoming urgent.' },
    { title:'You are not behind as a person', body:'A full mind can make even small tasks feel heavy. That says something about the load, not your worth.', spark:'Reducing the pressure is also progress.' }
  ],
  sadness: [
    { title:'You do not have to leave the sadness yet', body:'Some feelings need company more than solutions. You can let this one sit beside you without becoming your whole world.', spark:'The fact that this hurts means something mattered.' },
    { title:'You are allowed to move slowly', body:'You do not have to turn pain into a lesson today. It is enough to stay gentle with yourself while it passes through.', spark:'Even a dim light is still light.' }
  ],
  insecure: [
    { title:'You are allowed to be unfinished', body:'Uncertainty does not mean you are incapable. It may simply mean you are standing somewhere new.', spark:'Every familiar strength was once something you had never done before.' },
    { title:'You do not need proof before beginning', body:'Confidence often comes after the first steps, not before them.', spark:'You are not late. You are learning.' }
  ],
  overwhelmed: [
    { title:'This is too much for one moment', body:'You do not need a perfect plan right now. The size of the feeling may be telling you the load needs to be divided.', spark:'Making the moment smaller is not giving up.' },
    { title:'You are still here inside the noise', body:'Even when everything feels tangled, one part of you is still noticing, choosing and trying.', spark:'The next inch is enough. You do not need the whole road.' }
  ],
  excited: [
    { title:'Let the good feeling be real', body:'You do not have to control every part of this excitement. You are allowed to enjoy what is opening in front of you.', spark:'Hope can feel unfamiliar and still be safe.' },
    { title:'This energy belongs somewhere', body:'Excitement can be restless because something matters deeply to you.', spark:'You do not have to rush the moment to make it count.' }
  ],
  lonely: [
    { title:'Wanting closeness is not weakness', body:'Loneliness can make you question your importance. But needing connection is part of being human.', spark:'One honest connection can change the shape of a whole day.' },
    { title:'You are not invisible here', body:'The absence of connection right now does not mean you are unworthy of it.', spark:'There are places where your presence will feel like warmth.' }
  ],
  disappointed: [
    { title:'This hurts because you hoped', body:'You do not need to erase the disappointment or turn it into gratitude. Something mattered, and it did not happen as you wished.', spark:'A closed door can hurt before another path becomes visible.' },
    { title:'You can hold both truths', body:'You can be deeply disappointed and still not be finished.', spark:'The story changed. That does not mean it ended.' }
  ],
  selflove: [
    { title:'You do not have to earn softness', body:'Self-love does not need to feel huge or convincing. Sometimes it is simply refusing to speak to yourself with cruelty.', spark:'You are already someone worth staying kind to.' },
    { title:'You can be on your own side', body:'You do not need to adore every part of yourself today.', spark:'Respect can be the first small flame before love feels possible.' }
  ],
  spiral: [
    { title:'You do not have to finish the thought', body:'The loop may return. You are still allowed to step out of it without finding the perfect answer.', spark:'A thought can be loud without being true or urgent.' },
    { title:'Your mind is tired, not broken', body:'Repeating the same question can feel like work, but it does not always bring you closer to clarity.', spark:'Sometimes the missing answer appears only after the mind rests.' }
  ]
};

export function getEmotionClosing(emotionId) {
  const options = EMOTION_CLOSINGS[emotionId] || [{
    title:'You stayed with yourself',
    body:'Nothing has to be fixed right now. You gave this feeling a little space.',
    spark:'Sometimes one honest moment is enough for today.'
  }];
  return options[Math.floor(Math.random() * options.length)];
}
