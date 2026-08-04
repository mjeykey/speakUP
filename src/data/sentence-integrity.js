const CITY_SENTENCES = {
  'pt-PT': {
    'pt-PT':'Ele mora em Lisboa.','de-DE':'Er wohnt in Lissabon.','en-GB':'He lives in Lisbon.','es-ES':'Vive en Lisboa.','es-AN':'Vive en Lisboa.','fr-FR':'Il habite à Lisbonne.','hr-HR':'On živi u Lisabonu.','hr-DAL':'On živi u Lisabonu.'
  },
  'de-DE': {
    'pt-PT':'Ele mora em Berlim.','de-DE':'Er wohnt in Berlin.','en-GB':'He lives in Berlin.','es-ES':'Vive en Berlín.','es-AN':'Vive en Berlín.','fr-FR':'Il habite à Berlin.','hr-HR':'On živi u Berlinu.','hr-DAL':'On živi u Berlinu.'
  },
  'en-GB': {
    'pt-PT':'Ele mora em Londres.','de-DE':'Er wohnt in London.','en-GB':'He lives in London.','es-ES':'Vive en Londres.','es-AN':'Vive en Londres.','fr-FR':'Il habite à Londres.','hr-HR':'On živi u Londonu.','hr-DAL':'On živi u Londonu.'
  },
  'es-ES': {
    'pt-PT':'Ele mora em Madrid.','de-DE':'Er wohnt in Madrid.','en-GB':'He lives in Madrid.','es-ES':'Vive en Madrid.','es-AN':'Vive en Madrid.','fr-FR':'Il habite à Madrid.','hr-HR':'On živi u Madridu.','hr-DAL':'On živi u Madridu.'
  },
  'es-AN': {
    'pt-PT':'Ele mora em Sevilha.','de-DE':'Er wohnt in Sevilla.','en-GB':'He lives in Seville.','es-ES':'Vive en Sevilla.','es-AN':'Vive en Sevilla.','fr-FR':'Il habite à Séville.','hr-HR':'On živi u Sevilli.','hr-DAL':'On živi u Sevilli.'
  },
  'fr-FR': {
    'pt-PT':'Ele mora em Paris.','de-DE':'Er wohnt in Paris.','en-GB':'He lives in Paris.','es-ES':'Vive en París.','es-AN':'Vive en París.','fr-FR':'Il habite à Paris.','hr-HR':'On živi u Parizu.','hr-DAL':'On živi u Parizu.'
  },
  'hr-HR': {
    'pt-PT':'Ele mora em Zagreb.','de-DE':'Er wohnt in Zagreb.','en-GB':'He lives in Zagreb.','es-ES':'Vive en Zagreb.','es-AN':'Vive en Zagreb.','fr-FR':'Il habite à Zagreb.','hr-HR':'On živi u Zagrebu.','hr-DAL':'On živi u Zagrebu.'
  },
  'hr-DAL': {
    'pt-PT':'Ele mora em Split.','de-DE':'Er wohnt in Split.','en-GB':'He lives in Split.','es-ES':'Vive en Split.','es-AN':'Vive en Split.','fr-FR':'Il habite à Split.','hr-HR':'On živi u Splitu.','hr-DAL':'On živi u Splitu.'
  }
};

const LEARNING_SENTENCES = {
  'pt-PT': {
    'pt-PT':'Estou a aprender português.','de-DE':'Ich lerne Portugiesisch.','en-GB':'I am learning Portuguese.','es-ES':'Estoy aprendiendo portugués.','es-AN':'Estoy aprendiendo portugués.','fr-FR':'J’apprends le portugais.','hr-HR':'Učim portugalski.','hr-DAL':'Učin portugalski.'
  },
  'de-DE': {
    'pt-PT':'Estou a aprender alemão.','de-DE':'Ich lerne Deutsch.','en-GB':'I am learning German.','es-ES':'Estoy aprendiendo alemán.','es-AN':'Estoy aprendiendo alemán.','fr-FR':'J’apprends l’allemand.','hr-HR':'Učim njemački.','hr-DAL':'Učin njemački.'
  },
  'en-GB': {
    'pt-PT':'Estou a aprender inglês.','de-DE':'Ich lerne Englisch.','en-GB':'I am learning English.','es-ES':'Estoy aprendiendo inglés.','es-AN':'Estoy aprendiendo inglés.','fr-FR':'J’apprends l’anglais.','hr-HR':'Učim engleski.','hr-DAL':'Učin engleski.'
  },
  'es-ES': {
    'pt-PT':'Estou a aprender espanhol.','de-DE':'Ich lerne Spanisch.','en-GB':'I am learning Spanish.','es-ES':'Estoy aprendiendo español.','es-AN':'Estoy aprendiendo español.','fr-FR':'J’apprends l’espagnol.','hr-HR':'Učim španjolski.','hr-DAL':'Učin španjolski.'
  },
  'es-AN': {
    'pt-PT':'Estou a aprender espanhol andaluz.','de-DE':'Ich lerne andalusisches Spanisch.','en-GB':'I am learning Andalusian Spanish.','es-ES':'Estoy aprendiendo andaluz.','es-AN':'Estoy aprendiendo andaluz.','fr-FR':'J’apprends l’espagnol andalou.','hr-HR':'Učim andaluzijski španjolski.','hr-DAL':'Učin andaluzijski španjolski.'
  },
  'fr-FR': {
    'pt-PT':'Estou a aprender francês.','de-DE':'Ich lerne Französisch.','en-GB':'I am learning French.','es-ES':'Estoy aprendiendo francés.','es-AN':'Estoy aprendiendo francés.','fr-FR':'J’apprends le français.','hr-HR':'Učim francuski.','hr-DAL':'Učin francuski.'
  },
  'hr-HR': {
    'pt-PT':'Estou a aprender croata.','de-DE':'Ich lerne Kroatisch.','en-GB':'I am learning Croatian.','es-ES':'Estoy aprendiendo croata.','es-AN':'Estoy aprendiendo croata.','fr-FR':'J’apprends le croate.','hr-HR':'Učim hrvatski.','hr-DAL':'Učin hrvatski.'
  },
  'hr-DAL': {
    'pt-PT':'Estou a aprender dálmata.','de-DE':'Ich lerne Dalmatinisch.','en-GB':'I am learning Dalmatian.','es-ES':'Estoy aprendiendo dálmata.','es-AN':'Estoy aprendiendo dálmata.','fr-FR':'J’apprends le dalmate.','hr-HR':'Učim dalmatinski.','hr-DAL':'Učin dalmatinski.'
  }
};

function placeholderCount(sentence) {
  return (String(sentence || '').match(/_____/g) || []).length;
}

function sanitizeItem(item, levelId, itemIndex) {
  const sentence = String(item?.sentence || '').trim();
  const translation = String(item?.translation || '').trim();
  const answers = Array.isArray(item?.answers) ? item.answers.map(value => String(value).trim()).filter(Boolean) : [];
  const options = Array.isArray(item?.options) ? item.options.map(value => String(value).trim()).filter(Boolean) : [];
  const uniqueOptions = [...new Set([...answers, ...options])];
  const gaps = placeholderCount(sentence);

  if (!sentence || !translation || gaps !== answers.length) {
    console.warn('SpeakUP sentence data issue', { levelId, itemIndex, sentence, translation, gaps, answers });
  }

  return {
    ...item,
    sentence,
    translation,
    answers,
    options: uniqueOptions
  };
}

export function repairSentenceLevels(levels, learningLanguage, nativeLanguage) {
  let absoluteIndex = 0;
  return (Array.isArray(levels) ? levels : []).map(level => ({
    ...level,
    items: (Array.isArray(level.items) ? level.items : []).map((rawItem, itemIndex) => {
      let item = sanitizeItem(rawItem, level.id, itemIndex);

      // The first three legacy levels share the same 15 semantic sentence IDs.
      if (level.id !== 'everyday-50') {
        if (absoluteIndex === 3) {
          item = { ...item, translation: CITY_SENTENCES[learningLanguage]?.[nativeLanguage] || item.translation };
        }
        if (absoluteIndex === 4) {
          item = { ...item, translation: LEARNING_SENTENCES[learningLanguage]?.[nativeLanguage] || item.translation };
        }
        absoluteIndex += 1;
      }

      return item;
    })
  }));
}
