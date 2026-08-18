const grammarTopics = [
  {
    id: 1,
    name: "Nouns",
    emoji: "📦",
    rule: "A noun is a person, place, thing, or idea. It's what we name in a sentence.",
    source: "Elementary Grammar",
    coach: "Nouns are everywhere! Is it a person? A place? A thing? It's probably a noun!",
    questions: [
      {
        text: "Which word is a noun?",
        type: "multiple-choice",
        options: ["run", "happy", "dog", "quickly"],
        correct: "dog"
      },
      {
        text: "Identify the noun in: 'The blue car is fast.'",
        type: "multiple-choice",
        options: ["blue", "car", "fast", "is"],
        correct: "car"
      },
      {
        text: "Is 'teacher' a noun?",
        type: "multiple-choice",
        options: ["Yes", "No", "Sometimes", "Maybe"],
        correct: "Yes"
      },
      {
        text: "Which is a proper noun (starts with capital)?",
        type: "multiple-choice",
        options: ["boy", "Sarah", "dog", "house"],
        correct: "Sarah"
      },
      {
        text: "Name a noun that is a thing (object).",
        type: "text",
        acceptAnswers: ["book", "pen", "chair", "table", "desk", "cup", "box", "ball"]
      }
    ]
  },
  {
    id: 2,
    name: "Verbs",
    emoji: "⚡",
    rule: "A verb is an action word. It's what someone or something does.",
    source: "Elementary Grammar",
    coach: "Verbs are action! Running, jumping, thinking... if you can DO it, it's probably a verb!",
    questions: [
      {
        text: "Which word is a verb?",
        type: "multiple-choice",
        options: ["cat", "run", "blue", "happy"],
        correct: "run"
      },
      {
        text: "What is the verb in: 'She reads a book.'?",
        type: "multiple-choice",
        options: ["She", "reads", "a", "book"],
        correct: "reads"
      },
      {
        text: "Is 'think' a verb?",
        type: "multiple-choice",
        options: ["Yes", "No", "Maybe", "Sometimes"],
        correct: "Yes"
      },
      {
        text: "Find the action verb: 'The dog jumps over the fence.'",
        type: "multiple-choice",
        options: ["dog", "jumps", "fence", "over"],
        correct: "jumps"
      },
      {
        text: "Name an action verb (an action you can do).",
        type: "text",
        acceptAnswers: ["jump", "run", "swim", "write", "play", "eat", "dance", "sing"]
      }
    ]
  },
  {
    id: 3,
    name: "Adjectives",
    emoji: "🎨",
    rule: "An adjective describes a noun. It tells us what something is like.",
    source: "Elementary Grammar",
    coach: "Adjectives paint pictures! Big, small, colorful, happy—they describe nouns beautifully!",
    questions: [
      {
        text: "Which word is an adjective?",
        type: "multiple-choice",
        options: ["run", "beautiful", "dog", "jump"],
        correct: "beautiful"
      },
      {
        text: "What adjective describes the noun in: 'The tall building'?",
        type: "multiple-choice",
        options: ["tall", "building", "the", "is"],
        correct: "tall"
      },
      {
        text: "Is 'bright' an adjective?",
        type: "multiple-choice",
        options: ["Yes", "No", "Maybe", "Unsure"],
        correct: "Yes"
      },
      {
        text: "Find the adjective: 'She has a blue bicycle.'",
        type: "multiple-choice",
        options: ["She", "has", "blue", "bicycle"],
        correct: "blue"
      },
      {
        text: "Name an adjective that describes a color or feeling.",
        type: "text",
        acceptAnswers: ["red", "blue", "happy", "sad", "green", "yellow", "angry", "calm"]
      }
    ]
  },
  {
    id: 4,
    name: "Subject-Verb Agreement",
    emoji: "🤝",
    rule: "The subject and verb must agree. Singular subjects need singular verbs. Plural subjects need plural verbs.",
    source: "Elementary Grammar",
    coach: "One cat runs. Two cats run. See? They match! That's agreement!",
    questions: [
      {
        text: "Complete: 'The cat ___' (runs / run)?",
        type: "multiple-choice",
        options: ["runs", "run", "running", "ran"],
        correct: "runs"
      },
      {
        text: "Which is correct?",
        type: "multiple-choice",
        options: ["The dogs runs", "The dogs run", "The dog run", "Dogs is running"],
        correct: "The dogs run"
      },
      {
        text: "Does 'She go' agree?",
        type: "multiple-choice",
        options: ["Yes", "No", "Sometimes", "Maybe"],
        correct: "No"
      },
      {
        text: "Complete: 'They ___ to school.' (goes / go)?",
        type: "multiple-choice",
        options: ["goes", "go", "going", "gone"],
        correct: "go"
      },
      {
        text: "Is 'I am' correct agreement?",
        type: "text",
        acceptAnswers: ["yes", "Yes", "YES", "y"]
      }
    ]
  },
  {
    id: 5,
    name: "Punctuation",
    emoji: "✍️",
    rule: "Punctuation marks help us understand sentences. Periods end sentences. Question marks ask questions. Exclamation marks show excitement!",
    source: "Elementary Grammar",
    coach: "Punctuation is like traffic signs for words! They guide us where to pause and stop.",
    questions: [
      {
        text: "What punctuation ends a question?",
        type: "multiple-choice",
        options: [".", "?", "!", ","],
        correct: "?"
      },
      {
        text: "Which sentence is correct?",
        type: "multiple-choice",
        options: ["I like dogs", "I like dogs.", "I like dogs!", "All are correct"],
        correct: "All are correct"
      },
      {
        text: "What mark shows excitement?",
        type: "multiple-choice",
        options: [".", "?", "!", ","],
        correct: "!"
      },
      {
        text: "Complete: 'What is your name_'",
        type: "multiple-choice",
        options: [".", "?", "!", "-"],
        correct: "?"
      },
      {
        text: "Name one punctuation mark you use in sentences.",
        type: "text",
        acceptAnswers: ["period", ".", "question mark", "?", "exclamation", "!", "comma", ","]
      }
    ]
  }
];

// Lottie animations (owl emoji for now; can be replaced with actual Lottie JSON)
const lottieAnimations = {
  home: "🦉",
  lesson: "🦉",
  success: "🎉",
  thinking: "🤔"
};
