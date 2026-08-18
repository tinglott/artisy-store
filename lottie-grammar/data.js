const grammarTopics = [
  {
    id: 1,
    name: "Nouns",
    emoji: "🏠",
    description: "Learn about nouns—words that name people, places, and things.",
    rule: "A noun is a word that names a person, place, thing, or idea.",
    coachTip: "Nouns are everywhere! Your dog, your house, your school—they're all nouns. Even your feelings like 'happiness' and 'sadness' are nouns!",
    lessons: [
      {
        id: "noun1",
        question: "Which word is a noun?",
        type: "multiple-choice",
        answers: ["run", "happy", "dog", "quickly"],
        correct: "dog",
        explanation: "'Dog' is a noun because it's a thing. 'Run' is a verb, 'happy' is an adjective, and 'quickly' is an adverb."
      },
      {
        id: "noun2",
        question: "Is 'love' a noun?",
        type: "yes-no",
        correct: "yes",
        explanation: "Yes! 'Love' is a noun when it's a feeling or emotion. It's something you can have or feel."
      },
      {
        id: "noun3",
        question: "Name 3 nouns from your house.",
        type: "text",
        answers: ["table", "chair", "door", "window", "couch", "bed", "lamp", "rug", "sink", "stove"],
        explanation: "Great! All of those are nouns because they're things in your house."
      }
    ]
  },
  {
    id: 2,
    name: "Verbs",
    emoji: "🏃",
    description: "Learn about verbs—action words that show what someone is doing.",
    rule: "A verb is a word that shows an action or state of being.",
    coachTip: "Verbs are action words! When you jump, dance, eat, or think—those are all verbs. Even 'is' and 'was' are verbs!",
    lessons: [
      {
        id: "verb1",
        question: "Which word is a verb?",
        type: "multiple-choice",
        answers: ["blue", "run", "happy", "table"],
        correct: "run",
        explanation: "'Run' is a verb because it shows action. The other words describe things."
      },
      {
        id: "verb2",
        question: "Which sentence has the correct verb?",
        type: "multiple-choice",
        answers: ["She go to school.", "She goes to school.", "She going to school.", "She gone to school."],
        correct: "She goes to school.",
        explanation: "When the subject is 'she' (third person singular), we use 'goes,' not 'go.'"
      },
      {
        id: "verb3",
        question: "Name an action verb.",
        type: "text",
        answers: ["jump", "run", "eat", "sleep", "sing", "dance", "read", "write", "draw", "paint"],
        explanation: "Perfect! All of those are action verbs."
      }
    ]
  },
  {
    id: 3,
    name: "Adjectives",
    emoji: "✨",
    description: "Learn about adjectives—words that describe nouns.",
    rule: "An adjective is a word that describes or modifies a noun.",
    coachTip: "Adjectives make nouns more interesting! Instead of just 'dog,' you can say 'big dog' or 'friendly dog.' That's an adjective at work!",
    lessons: [
      {
        id: "adj1",
        question: "Which word is an adjective?",
        type: "multiple-choice",
        answers: ["run", "beautiful", "quickly", "jump"],
        correct: "beautiful",
        explanation: "'Beautiful' is an adjective because it describes something. It tells us what the noun is like."
      },
      {
        id: "adj2",
        question: "What adjective describes this fruit? It's sweet and yellow.",
        type: "text",
        answers: ["sweet", "yellow", "ripe", "fresh", "delicious"],
        explanation: "Great! All of those are adjectives that could describe fruit."
      },
      {
        id: "adj3",
        question: "Pick the sentence with an adjective.",
        type: "multiple-choice",
        answers: ["The cat sleeps.", "The sleepy cat sleeps.", "The cat sleeps on the bed.", "The cat sleeps soundly."],
        correct: "The sleepy cat sleeps.",
        explanation: "'Sleepy' is an adjective describing the cat. The other sentences don't have descriptive words for nouns."
      }
    ]
  },
  {
    id: 4,
    name: "Subject & Verb Agreement",
    emoji: "⚙️",
    description: "Learn how subjects and verbs must work together.",
    rule: "The verb must agree with its subject. Singular subjects need singular verbs; plural subjects need plural verbs.",
    coachTip: "Think of it like a dance—the subject and verb have to be in sync! 'She runs' (singular), not 'She run.' 'They run' (plural).",
    lessons: [
      {
        id: "agree1",
        question: "Which sentence is correct?",
        type: "multiple-choice",
        answers: ["The dog run fast.", "The dog runs fast.", "The dog are fast.", "The dog have run."],
        correct: "The dog runs fast.",
        explanation: "'The dog' is singular, so it needs the singular verb 'runs,' not 'run.'"
      },
      {
        id: "agree2",
        question: "Pick the correct verb form.",
        type: "multiple-choice",
        answers: ["The children plays.", "The children play.", "The child play.", "The children is playing."],
        correct: "The children play.",
        explanation: "'Children' is plural, so we use 'play' (plural verb), not 'plays.'"
      },
      {
        id: "agree3",
        question: "Fill in the verb: 'She ___ to school every day.'",
        type: "text",
        answers: ["goes", "go"],
        explanation: "'She' is singular, so 'goes' is correct."
      }
    ]
  },
  {
    id: 5,
    name: "Punctuation",
    emoji: "🎯",
    description: "Learn about periods, commas, and other punctuation marks.",
    rule: "Punctuation marks tell readers when to pause, stop, or ask a question. They make writing clear and easy to understand.",
    coachTip: "Punctuation is like traffic signs for your eyes! A period (.) says 'stop.' A comma (,) says 'pause.' A question mark (?) says 'I'm confused!'",
    lessons: [
      {
        id: "punc1",
        question: "Which punctuation mark goes at the end of a question?",
        type: "multiple-choice",
        answers: ["Period (.)", "Comma (,)", "Question mark (?)", "Exclamation point (!)"],
        correct: "Question mark (?)",
        explanation: "Questions always end with a question mark."
      },
      {
        id: "punc2",
        question: "Pick the correctly punctuated sentence.",
        type: "multiple-choice",
        answers: ["I like apples oranges and bananas", "I like apples, oranges, and bananas.", "I like, apples oranges and bananas.", "I like apples oranges, and bananas"],
        correct: "I like apples, oranges, and bananas.",
        explanation: "Commas separate items in a list."
      },
      {
        id: "punc3",
        question: "What comes after the opening quote?",
        type: "text",
        answers: ["dialogue", "words", "sentence", "text"],
        explanation: "Quotes contain dialogue—the actual words someone is saying!"
      }
    ]
  }
];
