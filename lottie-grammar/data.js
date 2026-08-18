const grammarTopics = [
  {
    id: 1,
    name: "Nouns",
    emoji: "📚",
    rule: "A noun is a person, place, or thing.",
    source: "English Grammar Basics",
    coach: "Nouns are all around us! People like your teacher, places like your school, and things like your pencil are all nouns.",
    questions: [
      { type: "text", q: "Is 'dog' a noun?", a: "yes", explanation: "Yes! A dog is an animal (a thing), so it's a noun." },
      { type: "text", q: "Is 'run' a noun?", a: "no", explanation: "No, 'run' is a verb (an action). But 'a run' can be a noun!" },
      { type: "text", q: "What noun is a person?", a: ["teacher", "doctor", "child", "student"], explanation: "Great! Any person's job or role can be a noun." },
      { type: "mc", q: "Which is a noun?", opts: ["jump", "happy", "cat", "quickly"], a: "cat" }
    ]
  },
  {
    id: 2,
    name: "Verbs",
    emoji: "🏃",
    rule: "A verb is an action or a state of being.",
    source: "English Grammar Basics",
    coach: "Verbs are words that show what something does or is. Run, jump, sleep, and 'be' are all verbs!",
    questions: [
      { type: "text", q: "Is 'jump' a verb?", a: "yes", explanation: "Yes! Jump is an action, so it's a verb." },
      { type: "text", q: "Is 'blue' a verb?", a: "no", explanation: "No, 'blue' is an adjective (a describing word). But 'to blue' isn't commonly used as a verb." },
      { type: "text", q: "Name one action verb.", a: ["run", "walk", "eat", "play", "sing", "dance", "jump"], explanation: "Perfect! Any action word is an action verb." },
      { type: "mc", q: "Which is a verb?", opts: ["green", "sing", "happy", "tree"], a: "sing" }
    ]
  },
  {
    id: 3,
    name: "Adjectives",
    emoji: "✨",
    rule: "An adjective is a word that describes a noun.",
    source: "English Grammar Basics",
    coach: "Adjectives tell us more about nouns. They describe colors, sizes, feelings, and more!",
    questions: [
      { type: "text", q: "Is 'big' an adjective?", a: "yes", explanation: "Yes! 'Big' describes the size of something." },
      { type: "text", q: "Is 'run' an adjective?", a: "no", explanation: "No, 'run' is a verb. But 'running' can describe (as in 'running water')." },
      { type: "text", q: "Name one adjective that describes color.", a: ["red", "blue", "green", "yellow", "purple", "orange"], explanation: "Excellent! Colors are adjectives." },
      { type: "mc", q: "Which adjective describes how something feels?", opts: ["soft", "fast", "dark", "loud"], a: "soft" }
    ]
  },
  {
    id: 4,
    name: "Subject-Verb Agreement",
    emoji: "🤝",
    rule: "The subject and verb must match in number (singular or plural).",
    source: "Grammar Rules",
    coach: "If the subject is one thing (singular), the verb should match. If it's more than one (plural), the verb changes too!",
    questions: [
      { type: "mc", q: "Choose the correct sentence:", opts: ["The cat are sleeping.", "The cat is sleeping.", "The cat am sleeping."], a: "The cat is sleeping." },
      { type: "mc", q: "Which is correct?", opts: ["Dogs runs fast.", "Dogs run fast.", "Dog run fast."], a: "Dogs run fast." },
      { type: "text", q: "Does 'She _____ a book.' want 'read' or 'reads'?", a: "reads", explanation: "Correct! 'She reads' because 'she' is singular." },
      { type: "text", q: "Does 'They _____ to school.' want 'go' or 'goes'?", a: "go", explanation: "Right! 'They go' because 'they' is plural." }
    ]
  },
  {
    id: 5,
    name: "Punctuation",
    emoji: "❗",
    rule: "Punctuation marks help us read and understand sentences clearly.",
    source: "Grammar Rules",
    coach: "Periods end sentences. Commas pause. Question marks ask. Exclamation points show excitement!",
    questions: [
      { type: "text", q: "What punctuation ends a sentence?", a: ["period", ".", "full stop"], explanation: "Great! A period (.) ends a sentence." },
      { type: "text", q: "What punctuation asks a question?", a: ["question mark", "?"], explanation: "Perfect! A question mark (?) shows we're asking something." },
      { type: "mc", q: "Which sentence is punctuated correctly?", opts: ["Do you like cats.", "Do you like cats?", "Do you like cats"], a: "Do you like cats?" },
      { type: "text", q: "What punctuation shows strong feeling?", a: ["exclamation mark", "!", "exclamation point"], explanation: "Awesome! An exclamation mark (!) shows excitement or strong feeling!" }
    ]
  }
];
