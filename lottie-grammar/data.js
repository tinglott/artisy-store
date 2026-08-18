// Grammar Topics and Lessons Data
const GRAMMAR_DATA = {
  topics: [
    {
      id: 'nouns',
      name: 'Nouns',
      icon: '📦',
      lessons: [
        {
          id: 'noun-singular',
          title: 'Singular & Plural Nouns',
          rule: 'A singular noun is one thing. A plural noun is more than one thing. Usually add "s" or "es" to make it plural.',
          coach: 'Cat is singular (one cat). Cats is plural (more than one cat). Try saying the word three times!',
          questions: [
            {
              question: 'Is "apple" singular or plural?',
              type: 'multiple-choice',
              options: ['Singular', 'Plural'],
              answer: 'Singular',
              explanation: 'Apple is one fruit. If we want more, we say "apples" (plural).'
            },
            {
              question: 'Which is the plural form of "dog"?',
              type: 'multiple-choice',
              options: ['dog', 'dogs', 'doges'],
              answer: 'dogs',
              explanation: 'We add "s" to make most nouns plural. Dog → Dogs!'
            },
            {
              question: 'Say the plural of "book" out loud, or type it:',
              type: 'text-voice',
              answer: 'books',
              explanation: 'Great job! Book → Books. Add "s" to make it plural.'
            }
          ]
        },
        {
          id: 'noun-types',
          title: 'Common & Proper Nouns',
          rule: 'Common nouns are general things (cat, house, ball). Proper nouns are specific names and start with a capital letter (Fluffy, Sarah, Paris).',
          coach: 'Remember: if you can give it a special name, it\'s probably a proper noun! Those always start big and tall.',
          questions: [
            {
              question: 'Is "Sarah" a common or proper noun?',
              type: 'multiple-choice',
              options: ['Common Noun', 'Proper Noun'],
              answer: 'Proper Noun',
              explanation: 'Sarah is a specific name! Proper nouns always start with a capital letter.'
            },
            {
              question: 'Which word is a proper noun?',
              type: 'multiple-choice',
              options: ['girl', 'Emma', 'house', 'tree'],
              answer: 'Emma',
              explanation: 'Emma is a person\'s name (proper noun). The others are common nouns.'
            },
            {
              question: 'Give me a proper noun (a person\'s name or place):',
              type: 'text-voice',
              answer: null,
              flexible: true,
              explanation: 'Perfect! Remember to capitalize it: It\'s a special name!'
            }
          ]
        }
      ]
    },
    {
      id: 'verbs',
      name: 'Verbs',
      icon: '💪',
      lessons: [
        {
          id: 'verb-action',
          title: 'Action Verbs',
          rule: 'Verbs are action words. They tell us what someone or something does. Examples: run, jump, eat, play, write, sleep.',
          coach: 'Think of a verb as a DOING word! If you can do it with your body, it\'s probably a verb.',
          questions: [
            {
              question: 'Which word is a verb (an action)?',
              type: 'multiple-choice',
              options: ['blue', 'run', 'happy', 'house'],
              answer: 'run',
              explanation: 'Run is something you DO! That\'s a verb. Blue is a color, happy is a feeling, house is a place.'
            },
            {
              question: 'What verb describes what a bird does?',
              type: 'multiple-choice',
              options: ['fly', 'small', 'nest', 'feather'],
              answer: 'fly',
              explanation: 'Fly is an action! Birds fly in the sky. The others describe birds but aren\'t actions.'
            },
            {
              question: 'Tell me an action verb you do every day:',
              type: 'text-voice',
              answer: null,
              flexible: true,
              explanation: 'Excellent! That\'s a doing word — a verb!'
            }
          ]
        },
        {
          id: 'verb-tense',
          title: 'Past, Present, Future Tense',
          rule: 'Present = now (I play). Past = already happened (I played). Future = will happen (I will play).',
          coach: 'Listen to the time in the sentence! Is it happening now? Already done? Or about to happen?',
          questions: [
            {
              question: '"I walked to school" — is this past, present, or future?',
              type: 'multiple-choice',
              options: ['Past', 'Present', 'Future'],
              answer: 'Past',
              explanation: 'Walked is the past tense. It already happened. Add "-ed" to show something already happened!'
            },
            {
              question: 'Which sentence uses future tense?',
              type: 'multiple-choice',
              options: ['I play basketball.', 'I played basketball.', 'I will play basketball.'],
              answer: 'I will play basketball.',
              explanation: 'Will play is future tense. It hasn\'t happened yet. Use "will" to show future!'
            }
          ]
        }
      ]
    },
    {
      id: 'adjectives',
      name: 'Adjectives',
      icon: '✨',
      lessons: [
        {
          id: 'adj-describing',
          title: 'Describing Words',
          rule: 'Adjectives describe nouns. They tell us HOW MANY, WHAT COLOR, WHAT SIZE, or WHAT KIND. Examples: big, red, happy, three.',
          coach: 'Ask yourself: Does this word describe a thing? Is it telling me more about a noun? If yes, it\'s an adjective!',
          questions: [
            {
              question: 'Which word is an adjective?',
              type: 'multiple-choice',
              options: ['run', 'happy', 'jump', 'quickly'],
              answer: 'happy',
              explanation: 'Happy is an adjective! It describes how something or someone feels. Run and jump are verbs. Quickly is an adverb.'
            },
            {
              question: 'Pick the adjective in: "The big dog barked."',
              type: 'multiple-choice',
              options: ['big', 'dog', 'barked'],
              answer: 'big',
              explanation: 'Big is an adjective! It describes the noun "dog" (tells us the dog is big).'
            }
          ]
        }
      ]
    },
    {
      id: 'punctuation',
      name: 'Punctuation',
      icon: '❗',
      lessons: [
        {
          id: 'period-question',
          title: 'Period & Question Mark',
          rule: 'Period (.) ends a sentence or statement. Question mark (?) ends a question. Exclamation mark (!) shows excitement.',
          coach: 'If it asks for an answer, use a question mark! If it\'s a statement, use a period!',
          questions: [
            {
              question: 'What punctuation ends this: "What is your name"?',
              type: 'multiple-choice',
              options: ['Period', 'Question Mark', 'Exclamation Mark'],
              answer: 'Question Mark',
              explanation: 'It\'s a question! Questions always end with a question mark (?)'
            }
          ]
        }
      ]
    }
  ],

  // Helper function to get topic by ID
  getTopic(topicId) {
    return this.topics.find(t => t.id === topicId);
  },

  // Helper to get lesson by ID
  getLesson(topicId, lessonId) {
    const topic = this.getTopic(topicId);
    return topic ? topic.lessons.find(l => l.id === lessonId) : null;
  },

  // Get all lessons for a topic
  getLessons(topicId) {
    const topic = this.getTopic(topicId);
    return topic ? topic.lessons : [];
  },

  // Get practice questions from a lesson
  getQuestions(topicId, lessonId) {
    const lesson = this.getLesson(topicId, lessonId);
    return lesson ? lesson.questions : [];
  }
};
