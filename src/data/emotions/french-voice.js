export const EMOTION_FRENCH = {
  jealousy: {
    intro: "La jalousie ne fait pas de toi une mauvaise personne. Elle apparaît souvent quand tu as peur de perdre quelqu’un ou de ne pas être suffisante.",
    verbs: ['ressentir','comparer','faire confiance','valoriser','choisir'],
    sentences: [
      "Je ressens de la jalousie et je peux reconnaître ce sentiment.",
      "Je n’ai pas besoin de me comparer aux autres.",
      "La réussite d’une autre personne ne diminue pas ma valeur."
    ]
  },
  anger: {
    intro: "La colère peut montrer qu’une limite a été dépassée. Tu peux la reconnaître sans la laisser tout décider.",
    verbs: ['ressentir','arrêter','respirer','protéger','parler'],
    sentences: [
      "Je ressens de la colère et je peux faire une pause.",
      "Je peux respirer avant de répondre.",
      "J’ai le droit de protéger mes limites."
    ]
  },
  anxiety: {
    intro: "Il est compréhensible de ressentir de l’anxiété. Ton esprit essaie peut-être de tout prévoir en même temps.",
    verbs: ['ressentir','respirer','observer','accepter','continuer'],
    sentences: [
      "Je ressens de l’anxiété et je suis toujours là.",
      "Je peux respirer lentement.",
      "Je peux avancer avec un petit pas."
    ]
  },
  stress: {
    intro: "Le stress peut apparaître quand trop de choses demandent ton attention. Cela ne veut pas dire que tu échoues.",
    verbs: ['arrêter','choisir','organiser','se reposer','continuer'],
    sentences: [
      "Je peux m’arrêter un moment.",
      "Je peux choisir une seule priorité.",
      "Je n’ai pas besoin de tout faire maintenant."
    ]
  },
  sadness: {
    intro: "La tristesse n’a pas besoin d’être résolue immédiatement. Elle montre parfois que quelque chose comptait pour toi.",
    verbs: ['ressentir','accepter','se reposer','se souvenir','prendre soin'],
    sentences: [
      "Je ressens de la tristesse et je n’ai pas besoin de la cacher.",
      "Je peux accepter que cette journée soit difficile.",
      "Aujourd’hui, je peux prendre soin de moi avec douceur."
    ]
  },
  insecure: {
    intro: "Te sentir peu sûre de toi ne signifie pas que tu n’es pas capable. Cela peut simplement être nouveau ou important pour toi.",
    verbs: ['apprendre','essayer','commencer','pratiquer','grandir'],
    sentences: [
      "Je suis encore en train d’apprendre.",
      "Je peux essayer sans tout savoir.",
      "Je peux progresser sans être parfaite."
    ]
  },
  overwhelmed: {
    intro: "Quand tout semble urgent, il est normal de perdre le sens de l’ordre. Tu n’as pas à tout porter en même temps.",
    verbs: ['séparer','choisir','reporter','demander','réduire'],
    sentences: [
      "Je peux choisir une chose à la fois.",
      "Je peux reporter ce qui n’est pas urgent.",
      "Je peux demander de l’aide."
    ]
  },
  excited: {
    intro: "L’enthousiasme peut apporter beaucoup d’énergie. Tu n’as pas besoin de le réduire; tu peux lui donner une direction.",
    verbs: ['ressentir','imaginer','profiter','partager','avancer'],
    sentences: [
      "Je suis enthousiaste pour ce qui arrive.",
      "Je peux profiter de cette énergie sans me presser.",
      "Je peux avancer tout en restant présente."
    ]
  },
  lonely: {
    intro: "La solitude peut faire mal même quand des personnes sont autour de toi. Vouloir du lien est profondément humain.",
    verbs: ['ressentir','chercher','appeler','partager','se rapprocher'],
    sentences: [
      "Je me sens seule et ce sentiment mérite de l’attention.",
      "Je peux chercher un lien qui me fait du bien.",
      "Je peux appeler quelqu’un sans devoir tout expliquer."
    ]
  },
  disappointed: {
    intro: "La déception fait mal parce que tu espérais quelque chose d’important. Tu n’as pas besoin de faire comme si cela ne t’avait pas touchée.",
    verbs: ['espérer','ressentir','accepter','recommencer','imaginer'],
    sentences: [
      "J’espérais que ce serait différent.",
      "Je peux ressentir cette déception sans me juger.",
      "Je peux imaginer un autre chemin."
    ]
  },
  selflove: {
    intro: "L’amour de soi ne demande pas une confiance constante. Il peut commencer par le respect, l’honnêteté et une phrase bienveillante.",
    verbs: ['respecter','accepter','prendre soin','reconnaître','valoriser'],
    sentences: [
      "Je peux respecter mes besoins.",
      "Je peux m’accepter dans ce moment.",
      "Ma valeur ne disparaît pas pendant les jours difficiles."
    ]
  },
  spiral: {
    intro: "Les pensées répétitives peuvent sembler vraies simplement parce qu’elles reviennent souvent. Tu n’as pas besoin de toutes les croire.",
    verbs: ['remarquer','questionner','arrêter','revenir','se reposer'],
    sentences: [
      "Je remarque que cette pensée est revenue.",
      "Je peux questionner cette pensée sans lutter contre elle.",
      "Mon esprit peut aussi se reposer."
    ]
  }
};

export function getFrenchEmotionPractice(emotionId) {
  return EMOTION_FRENCH[emotionId] || EMOTION_FRENCH.anxiety;
}
