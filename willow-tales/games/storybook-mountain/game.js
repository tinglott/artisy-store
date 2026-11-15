/* Mystery at Storybook Mountain — an original Willow Tales learning adventure.
   Mechanics follow the house blueprint (CLASSIC-BLUEPRINTS.md, JumpStart
   Mystery Mountain section): one lodge known by heart, a fixed mission
   skeleton (comic briefing → four signposted Story Clues in four activities →
   a rising Story Sparks threshold → a finale that makes the child COMBINE the
   clues → the restored book joins the Story Hall), a dual economy (Story
   Sparks + Lantern Light recharged by a math game), and three difficulty
   levels inside every activity. All characters, words, stories, and art are
   our own. No external assets. */

/* ================= ART (our own SVG) ================= */
const LODGE_SVG = `<svg viewBox="0 0 220 150" aria-label="Storybook Mountain Lodge">
  <polygon points="10,140 80,30 130,140" fill="#7fa8c9"/>
  <polygon points="80,30 105,72 80,88 62,60" fill="#eef7ff"/>
  <polygon points="95,140 160,55 215,140" fill="#5d8ab0"/>
  <polygon points="160,55 178,82 160,94 146,74" fill="#eef7ff"/>
  <rect x="62" y="96" width="86" height="46" rx="6" fill="#8a5a2b"/>
  <polygon points="54,100 105,66 156,100" fill="#6e451d"/>
  <rect x="97" y="114" width="16" height="28" rx="3" fill="#5d3c17"/>
  <rect x="70" y="106" width="14" height="14" rx="2" fill="#ffcf5c"/>
  <rect x="126" y="106" width="14" height="14" rx="2" fill="#ffcf5c"/>
  <circle cx="105" cy="84" r="7" fill="#ffb703"/>
  <circle cx="34" cy="34" r="4" fill="#fff"/><circle cx="188" cy="24" r="3" fill="#fff"/>
  <circle cx="150" cy="40" r="3" fill="#fff"/>
</svg>`;

const SCRAMBLER_SVG = `<svg viewBox="0 0 120 120" aria-label="The Scrambler">
  <path d="M60 12 a48 48 0 1 1 -34 14 a38 38 0 1 0 30 -12 a28 28 0 1 1 -22 10 a18 18 0 1 0 16 -8"
        fill="none" stroke="#7ecbf2" stroke-width="9" stroke-linecap="round"/>
  <circle cx="48" cy="58" r="6" fill="#14456b"/>
  <circle cx="72" cy="58" r="6" fill="#14456b"/>
  <path d="M48 78 q12 10 24 0" fill="none" stroke="#14456b" stroke-width="5" stroke-linecap="round"/>
  <circle cx="38" cy="70" r="5" fill="#ffb3c8" opacity=".8"/>
  <circle cx="82" cy="70" r="5" fill="#ffb3c8" opacity=".8"/>
</svg>`;

/* ================= THE LODGE ================= */
const ACTIVITIES = {
  math:     { name:"Recipe Math",     subject:"Math",      emoji:"🧮" },
  word:     { name:"Word Builder",    subject:"Reading",   emoji:"🔤" },
  sentence: { name:"Sentence Fixer",  subject:"Reading",   emoji:"✏️" },
  nature:   { name:"Nature Sort",     subject:"Science",   emoji:"🦋" },
  geo:      { name:"World Explorer",  subject:"Geography", emoji:"🧭" },
  rhyme:    { name:"Rhyme Time",      subject:"Reading",   emoji:"🎵" },
  lantern:  { name:"Lantern Sums",    subject:"Math",      emoji:"🔦" }
};
const ROOMS = {
  clocktower:{ name:"Clock Tower",  emoji:"🔔", activity:"sentence", blurb:"Tick, tock! The tower keeps the whole lodge's time — and it loves tidy sentences." },
  attic:     { name:"Attic",        emoji:"🧳", activity:"geo",      blurb:"Old maps, a round globe, and a very dusty telescope live up here." },
  library:   { name:"Library",      emoji:"📚", activity:"word",     blurb:"Tall shelves, a squishy reading chair, and words hiding everywhere." },
  storyhall: { name:"Story Hall",   emoji:"🏆", activity:null,       blurb:"The grand shelf where every restored book comes home to live." },
  entry:     { name:"Entry Hall",   emoji:"🚪", activity:"rhyme",    blurb:"Coats, boots, a creaky floorboard — and a rug that only speaks in rhymes." },
  kitchen:   { name:"Kitchen",      emoji:"🍳", activity:"math",     blurb:"Something yummy is always almost ready. The cook counts everything twice!" },
  cellar:    { name:"Cellar",       emoji:"🔦", activity:"lantern",  blurb:"The Lantern Station hums down here, keeping the lodge's lanterns bright." },
  garden:    { name:"Garden",       emoji:"🌻", activity:"nature",   blurb:"Sunflowers taller than Leo, and every bug and bird you can name." }
};
const FLOORS = [
  { name:"🗻 Floor 3 — The Tippy Top",   rooms:["clocktower","attic"] },
  { name:"📚 Floor 2 — The Story Floor", rooms:["library","storyhall"] },
  { name:"🏠 Floor 1 — The Cozy Floor",  rooms:["entry","kitchen"] },
  { name:"🔦 Down the Stairs",           rooms:["cellar"] },
  { name:"🌳 Outside",                   rooms:["garden"] }
];

/* ================= QUESTION BANKS ================= */
/* word: L1/L2 = word with one missing letter; L3 = pick the correct spelling */
const WORD_BANK = {
  1: [
    { word:"CAT", emoji:"🐱", missing:0 }, { word:"SUN", emoji:"☀️", missing:0 },
    { word:"DOG", emoji:"🐶", missing:2 }, { word:"EGG", emoji:"🥚", missing:0 },
    { word:"BEE", emoji:"🐝", missing:0 }, { word:"PIG", emoji:"🐷", missing:0 },
    { word:"BUS", emoji:"🚌", missing:0 }, { word:"ANT", emoji:"🐜", missing:0 },
    { word:"COW", emoji:"🐮", missing:0 }, { word:"FOX", emoji:"🦊", missing:2 }
  ],
  2: [
    { word:"APPLE", emoji:"🍎", missing:1 }, { word:"HORSE", emoji:"🐴", missing:2 },
    { word:"TRAIN", emoji:"🚂", missing:2 }, { word:"HOUSE", emoji:"🏠", missing:2 },
    { word:"MOUSE", emoji:"🐭", missing:2 }, { word:"BREAD", emoji:"🍞", missing:2 },
    { word:"PLANT", emoji:"🌱", missing:2 }, { word:"CHAIR", emoji:"🪑", missing:2 },
    { word:"WATER", emoji:"💧", missing:2 }, { word:"TIGER", emoji:"🐯", missing:2 }
  ],
  3: [
    { word:"BUTTERFLY", emoji:"🦋", options:["BUTTERFLY","BUTERFLY","BUTTERFLI"] },
    { word:"RAINBOW",   emoji:"🌈", options:["RAINBOW","RANEBOW","RAINBOE"] },
    { word:"ELEPHANT",  emoji:"🐘", options:["ELEPHANT","ELEFANT","ELEPHENT"] },
    { word:"BANANA",    emoji:"🍌", options:["BANANA","BANANNA","BANNANA"] },
    { word:"UMBRELLA",  emoji:"☂️", options:["UMBRELLA","UMBRELA","UMBERELLA"] },
    { word:"KANGAROO",  emoji:"🦘", options:["KANGAROO","KANGARU","KANGGAROO"] }
  ]
};
/* sentence: L1/L2 = fill the blank; L3 = tap the words in order */
const SENT_BANK = {
  1: [
    { text:"I drink a glass of ___.", options:["milk","sand"], answer:0 },
    { text:"The dog wagged its ___.", options:["tail","ear"], answer:0 },
    { text:"At night, we sleep in a ___.", options:["bed","bus"], answer:0 },
    { text:"The fish swims in the ___.", options:["water","sky"], answer:0 },
    { text:"I write with a ___.", options:["pencil","banana"], answer:0 },
    { text:"The bird uses its wings to ___.", options:["fly","swim"], answer:0 }
  ],
  2: [
    { text:"Yesterday, we ___ to the park.", options:["went","go","goes"], answer:0 },
    { text:"She ___ her hands before lunch.", options:["washes","wash","washing"], answer:0 },
    { text:"Look! The baby is ___.", options:["crying","cry","cries"], answer:0 },
    { text:"The two ducks ___ on the pond every morning.", options:["swim","swims","swimming"], answer:0 },
    { text:"He ___ a tall tower with blocks yesterday.", options:["built","builds","building"], answer:0 },
    { text:"The sun ___ in the east every morning.", options:["rises","rise","rose up high"], answer:0 }
  ],
  3: [
    { words:["The","cat","drank","the","milk"] },
    { words:["Leo","reads","a","funny","book"] },
    { words:["The","train","goes","up","the","hill"] },
    { words:["Nia","plants","red","flowers"] },
    { words:["The","moon","shines","at","night"] }
  ]
};
/* rhyme: L1/L2 = which word rhymes; L3 = which word does NOT rhyme */
const RHYME_BANK = {
  1: [
    { target:"CAT", options:["hat","pig","sun"], answer:0 },
    { target:"DOG", options:["frog","cat","bed"], answer:0 },
    { target:"SUN", options:["fun","moon","cup"], answer:0 },
    { target:"PIG", options:["wig","cow","egg"], answer:0 },
    { target:"BEE", options:["tree","bus","rock"], answer:0 },
    { target:"FOX", options:["box","hen","jam"], answer:0 }
  ],
  2: [
    { target:"CAKE", options:["snake","cup","dog"], answer:0 },
    { target:"MOON", options:["spoon","star","bed"], answer:0 },
    { target:"TRAIN", options:["rain","boat","pig"], answer:0 },
    { target:"BOAT", options:["goat","fish","sun"], answer:0 },
    { target:"LIGHT", options:["kite","lamp","bear"], answer:0 },
    { target:"BEAR", options:["chair","nose","cup"], answer:0 }
  ],
  3: [
    { target:"CAKE", options:["snake","lake","frog"], answer:2 },
    { target:"MOON", options:["spoon","noon","cake"], answer:2 },
    { target:"DOG", options:["frog","log","sun"], answer:2 },
    { target:"BEE", options:["tree","sea","hat"], answer:2 },
    { target:"PIG", options:["wig","dig","boat"], answer:2 }
  ]
};
/* nature sort: bins + items per level */
const NATURE_BANK = {
  1: { bins:["Living","Not Living"], items:[
    { name:"dog", emoji:"🐶", bin:0 }, { name:"rock", emoji:"🪨", bin:1 },
    { name:"flower", emoji:"🌼", bin:0 }, { name:"chair", emoji:"🪑", bin:1 },
    { name:"bird", emoji:"🐦", bin:0 }, { name:"spoon", emoji:"🥄", bin:1 },
    { name:"tree", emoji:"🌳", bin:0 }, { name:"book", emoji:"📖", bin:1 } ] },
  2: { bins:["Plant","Animal"], items:[
    { name:"rose", emoji:"🌹", bin:0 }, { name:"rabbit", emoji:"🐰", bin:1 },
    { name:"grass", emoji:"🌿", bin:0 }, { name:"butterfly", emoji:"🦋", bin:1 },
    { name:"oak tree", emoji:"🌳", bin:0 }, { name:"fox", emoji:"🦊", bin:1 },
    { name:"sunflower", emoji:"🌻", bin:0 }, { name:"frog", emoji:"🐸", bin:1 } ] },
  3: { bins:["Pond","Desert","Forest"], items:[
    { name:"frog", emoji:"🐸", bin:0 }, { name:"fish", emoji:"🐟", bin:0 },
    { name:"duck", emoji:"🦆", bin:0 }, { name:"camel", emoji:"🐪", bin:1 },
    { name:"cactus", emoji:"🌵", bin:1 }, { name:"lizard", emoji:"🦎", bin:1 },
    { name:"owl", emoji:"🦉", bin:2 }, { name:"bear", emoji:"🐻", bin:2 },
    { name:"deer", emoji:"🦌", bin:2 } ] }
};
/* geography MC */
const GEO_BANK = {
  1: [
    { q:"The sun rises in the ___.", options:["east","west","north"], answer:0 },
    { q:"How many continents are there on Earth?", options:["7","5","12"], answer:0 },
    { q:"Which of these is an ocean?", options:["Pacific","Sahara","Paris"], answer:0 },
    { q:"A compass helps us find ___.", options:["directions","dinner","shoes"], answer:0 },
    { q:"The biggest continent on Earth is ___.", options:["Asia","Africa","Europe"], answer:0 }
  ],
  2: [
    { q:"The largest ocean on Earth is the ___ Ocean.", options:["Pacific","Atlantic","Indian"], answer:0 },
    { q:"Africa is a ___.", options:["continent","country","city"], answer:0 },
    { q:"The Sahara is a giant ___ in Africa.", options:["desert","ocean","forest"], answer:0 },
    { q:"Penguins live near the ___ Pole.", options:["South","North","West"], answer:0 },
    { q:"The Amazon rainforest is in ___ America.", options:["South","North","Middle"], answer:0 }
  ],
  3: [
    { q:"The Eiffel Tower stands in ___.", options:["Paris","London","Rome"], answer:0 },
    { q:"The Great Pyramids were built in ___.", options:["Egypt","China","Mexico"], answer:0 },
    { q:"The Great Wall stretches across ___.", options:["China","Japan","India"], answer:0 },
    { q:"Kangaroos hop wild and free in ___.", options:["Australia","Canada","Brazil"], answer:0 },
    { q:"The Statue of Liberty stands in ___.", options:["New York","London","Tokyo"], answer:0 }
  ]
};

/* ================= MISSIONS ================= */
/* clues are listed in STORY ORDER; each names the room hiding it.
   finale: two questions whose answers live inside the collected clues/story. */
const MISSIONS = [
{ title:"The Brave Little Lighthouse", emoji:"🗼", threshold:30,
  mixup:"“The lighthouse shone its light UP at the moon, so the moon could read a bedtime story — and the poor little boat sailed in circles all night long!”",
  summary:"Every night, the brave little lighthouse shone its lamp across the waves. One stormy night it guided a little boat safely home, and by sunrise the sea was calm and gold.",
  reaction:"🌪️ The Scrambler giggles from behind a curtain: “Fine, fine — that one DID sound better your way…”",
  clues:[
    { name:"The Lamp", emoji:"💡", room:"clocktower" },
    { name:"The Storm Cloud", emoji:"🌩️", room:"garden" },
    { name:"The Little Boat", emoji:"⛵", room:"kitchen" },
    { name:"The Sunrise", emoji:"🌅", room:"library" } ],
  finale:[
    { q:"What did the lighthouse shine to help the boat?", options:["Its lamp","A birthday cake","The moon"], answer:0, hint:"Look at your very first clue — the Lamp!" },
    { q:"When did the sea turn calm and gold?", options:["At sunrise","At lunchtime","At midnight"], answer:0, hint:"Your last clue holds the answer — the Sunrise!" } ] },
{ title:"Pip the Penguin's Long Walk", emoji:"🐧", threshold:30,
  mixup:"“Pip the penguin packed his sunglasses and walked to the hot, hot desert for a lovely swim in the sand!”",
  summary:"Pip the penguin walked across the snow to the sea. He caught a fish for his breakfast, waved to the seals, and slid home to his iceberg before lunch.",
  reaction:"🌪️ “Brrr! Even I know penguins don't belong in a desert. Probably.”",
  clues:[
    { name:"The Snowy Path", emoji:"❄️", room:"garden" },
    { name:"The Fish", emoji:"🐟", room:"kitchen" },
    { name:"The Seals", emoji:"🦭", room:"entry" },
    { name:"The Home Iceberg", emoji:"🧊", room:"attic" } ],
  finale:[
    { q:"Where did Pip walk first?", options:["Across the snow","Across the desert","Across the moon"], answer:0, hint:"Your first clue — the Snowy Path!" },
    { q:"What did Pip catch for his breakfast?", options:["A fish","A sandwich","A snowball"], answer:0, hint:"One of your clues is still swimming — the Fish!" } ] },
{ title:"The Garden That Grew at Night", emoji:"🌙", threshold:45,
  mixup:"“The garden grew upside down! The flowers waved from under the ground, and the moon did all the watering with a teapot!”",
  summary:"While everyone slept, the garden drank the moonlight and grew. Seeds sprouted, sunflowers stretched tall, and in the morning the bees came to say thank you.",
  reaction:"🌪️ “I only watered it a LITTLE bit with the teapot. The moon did the rest. Honest.”",
  clues:[
    { name:"The Sleepy Seeds", emoji:"🌱", room:"garden" },
    { name:"The Moonlight", emoji:"🌙", room:"clocktower" },
    { name:"The Tall Sunflower", emoji:"🌻", room:"library" },
    { name:"The Thank-You Bees", emoji:"🐝", room:"entry" } ],
  finale:[
    { q:"When did the garden do its growing?", options:["At night","At breakfast","In the winter"], answer:0, hint:"Think about the Moonlight clue — when does moonlight shine?" },
    { q:"Who came to say thank you in the morning?", options:["The bees","The frogs","The clouds"], answer:0, hint:"Your last clue is buzzing — the Thank-You Bees!" } ] },
{ title:"Bella the Bear and the Honey Cake", emoji:"🐻", threshold:45,
  mixup:"“Bella baked her honey cake IN the river, and the bees chased the soggy cake all the way up a tree!”",
  summary:"Bella the bear mixed flour, eggs, and honey to bake a cake. She shared it with the bees who gave the honey, and everyone ate together under the tall pine tree.",
  reaction:"🌪️ “A cake in a river. Hmm. Even MY tummy says that was too far.”",
  clues:[
    { name:"The Flour Sack", emoji:"🌾", room:"kitchen" },
    { name:"The Golden Honey", emoji:"🍯", room:"garden" },
    { name:"The Mixing Bowl", emoji:"🥣", room:"library" },
    { name:"The Tall Pine Tree", emoji:"🌲", room:"attic" } ],
  finale:[
    { q:"What sweet thing did Bella mix into her cake?", options:["Honey","Lemonade","Snow"], answer:0, hint:"It is golden and it buzzes — the Golden Honey clue!" },
    { q:"Where did everyone eat the cake together?", options:["Under the tall pine tree","In a boat","On the roof"], answer:0, hint:"Your last clue is tall and green — the Tall Pine Tree!" } ] },
{ title:"The Train That Could Whistle Tunes", emoji:"🚂", threshold:60,
  mixup:"“The little train whistled SO hard that it blew its own wheels off — and the passengers had to carry the train to the station!”",
  summary:"The little train whistled a happy tune at every stop. It carried the mail, the milk, and three singing goats, and it rolled into the station right on time.",
  reaction:"🌪️ “Carrying a train IS very silly. I out-sillied myself that time.”",
  clues:[
    { name:"The Whistle", emoji:"🎶", room:"entry" },
    { name:"The Mail Bag", emoji:"✉️", room:"library" },
    { name:"The Singing Goats", emoji:"🐐", room:"garden" },
    { name:"The Station Clock", emoji:"🕰️", room:"clocktower" } ],
  finale:[
    { q:"What did the train do at every stop?", options:["Whistled a tune","Took a nap","Turned into a boat"], answer:0, hint:"Your first clue can be HEARD — the Whistle!" },
    { q:"Who sang along on the train?", options:["Three goats","Two whales","Five robots"], answer:0, hint:"One clue has horns and a beard — the Singing Goats!" } ] },
{ title:"Mina and the Rainy-Day Kite", emoji:"🪁", threshold:60,
  mixup:"“Mina flew her kite UNDER the sea, and a fish flew it back up for her, holding an umbrella!”",
  summary:"Mina waited for the rain to stop and the wind to wake up. Then her kite danced over the hill, looped once around a cloud, and came home in time for cocoa.",
  reaction:"🌪️ “The fish was very polite about it, actually. Still. Ahem. Carry on.”",
  clues:[
    { name:"The Rain Cloud", emoji:"🌧️", room:"attic" },
    { name:"The Wake-Up Wind", emoji:"🌬️", room:"garden" },
    { name:"The Dancing Kite", emoji:"🪁", room:"entry" },
    { name:"The Warm Cocoa", emoji:"☕", room:"kitchen" } ],
  finale:[
    { q:"What did Mina have to wait for?", options:["The rain to stop and the wind to wake","A bus","Bedtime"], answer:0, hint:"Your first two clues are weather — the Rain Cloud and the Wake-Up Wind!" },
    { q:"What warm drink waited for Mina at home?", options:["Cocoa","Lemonade","Rain soup"], answer:0, hint:"Your last clue is warm and chocolatey — the Warm Cocoa!" } ] },
{ title:"The Clock That Ticked Too Fast", emoji:"⏰", threshold:75,
  mixup:"“The tower clock ticked SO fast that breakfast, lunch, and dinner all happened before the toast even popped up!”",
  summary:"The tower clock ticked too fast, so the whole morning raced by. Leo and Nia oiled its rusty gears and set it right, and the whole lodge had time for breakfast again.",
  reaction:"🌪️ “Too fast, too fast! Even a whirlwind gets dizzy sometimes, you know.”",
  clues:[
    { name:"The Racing Hands", emoji:"🕐", room:"clocktower" },
    { name:"The Rusty Gear", emoji:"⚙️", room:"attic" },
    { name:"The Oil Can", emoji:"🛢️", room:"library" },
    { name:"The Breakfast Toast", emoji:"🍞", room:"kitchen" } ],
  finale:[
    { q:"Why did the whole morning race by?", options:["The clock ticked too fast","The sun slept in","The lodge ran away"], answer:0, hint:"Your first clue is in a hurry — the Racing Hands!" },
    { q:"What did Leo and Nia use to fix the clock?", options:["Oil for its gears","A magic wand","Sticky jam"], answer:0, hint:"Two clues work together — the Rusty Gear and the Oil Can!" } ] },
{ title:"The Scrambler's Own Story", emoji:"🌪️", threshold:90,
  mixup:"“The Scrambler's OWN pages blew every which way — topside, downside, inside-out! Now even HE can't read his own story!”",
  summary:"The Scrambler was a lonely little whirlwind who loved stories so much that he shook the books just to hear their pages rustle. Now his own story sits whole on the shelf — and every night, Leo and Nia read it to him.",
  reaction:"🌪️ …the Scrambler is very quiet. Then, in the smallest voice: “…you fixed MY book too? Nobody ever… oh. Oh my.”",
  clues:[
    { name:"The Lonely Whirlwind", emoji:"🌪️", room:"garden" },
    { name:"The Rustling Pages", emoji:"📄", room:"library" },
    { name:"The Listening Chair", emoji:"🪑", room:"entry" },
    { name:"The Goodnight Story", emoji:"🌙", room:"clocktower" } ],
  finale:[
    { q:"Why did the Scrambler shake all the books?", options:["He loved stories and felt lonely","He was angry at the lodge","He wanted to break them"], answer:0, hint:"Your first clue is the whole secret — the Lonely Whirlwind." },
    { q:"What do Leo and Nia do for the Scrambler every night now?", options:["Read him a story","Hide all the books","Lock the library"], answer:0, hint:"Your last clue is the coziest one — the Goodnight Story." } ] }
];

/* ================= SOUND (WebAudio + house lifecycle fix) ================= */
const SoundFX = {
  ctx: null,
  ensure() {
    if (!save.sound) return null;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    } catch (e) { return null; }
  },
  tone(freq, start, dur, type, vol) {
    const ctx = this.ensure(); if (!ctx) return;
    try {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || "sine"; o.frequency.value = freq;
      const t = ctx.currentTime + start;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  },
  pop()     { this.tone(660, 0, .1, "triangle", .1); },
  correct() { this.tone(523.25, 0, .16, "triangle"); this.tone(659.25, .09, .16, "triangle"); this.tone(783.99, .18, .26, "triangle"); },
  wrong()   { this.tone(196, 0, .22, "sine", .08); },
  sparkle() { this.tone(1318.5, 0, .18, "triangle", .1); this.tone(1567.98, .09, .18, "triangle", .1); this.tone(2093, .18, .3, "triangle", .09); },
  fanfare() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * .13, .3, "triangle")); },
  /* HOUSE LIFECYCLE FIX: sound must never keep playing after leaving the game */
  stopAll() {
    if (this.ctx) { try { this.ctx.close(); } catch (e) {} this.ctx = null; }
  }
};
document.addEventListener("visibilitychange", () => { if (document.hidden) SoundFX.stopAll(); });
window.addEventListener("pagehide", () => SoundFX.stopAll());
window.addEventListener("beforeunload", () => SoundFX.stopAll());

/* ================= SAVE ================= */
const SAVE_KEY = "storybookMountainSave";
function freshMission(idx) { return { idx: idx, clues: [false, false, false, false], sparks: 0, briefed: false }; }
let save = { restored: [], totalSparks: 0, lantern: 100, sound: true, mission: freshMission(0) };
try {
  const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
  if (raw && typeof raw === "object") save = Object.assign(save, raw);
  if (!save.mission || typeof save.mission.idx !== "number") save.mission = freshMission(save.restored.length);
} catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

/* ================= HELPERS / STATE ================= */
const $ = id => document.getElementById(id);
const FAST = !!window.SBM_FAST; // test hook: shortens animation delays
const DELAY = FAST ? 0 : 420;
function shuffle(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = x[i]; x[i] = x[j]; x[j] = t; } return x; }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function mission() { return save.restored.length >= MISSIONS.length ? null : MISSIONS[save.mission.idx]; }
function cluesFound() { return save.mission.clues.filter(Boolean).length; }
function finaleReady() { const m = mission(); return !!m && cluesFound() === 4 && save.mission.sparks >= m.threshold; }
let curRoom = null;
let selLevel = {}; // per-activity chosen difficulty (1-3)

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $("screen-" + id).classList.add("active");
  window.scrollTo(0, 0);
}
function burst(zone) {
  if (!zone) return;
  const bits = ["⭐","✨","🎉","📚","💛","🌟"];
  for (let i = 0; i < 22; i++) {
    const s = document.createElement("span");
    s.className = "confetti-bit"; s.textContent = pick(bits);
    s.style.left = (4 + Math.random() * 92) + "%";
    s.style.animationDelay = (Math.random() * 0.35) + "s";
    zone.appendChild(s);
    setTimeout(() => s.remove(), 2400);
  }
}
function shelfHTML() {
  return MISSIONS.map((b, i) => {
    const full = save.restored.includes(i);
    return `<div class="book-slot"><div class="book-spine ${full ? "full" : ""}" ${full ? `style="background:${["#c0392b","#2471a3","#1e8449","#b7950b","#6c3483","#ca6f1e","#117a65","#5d6d7e"][i]}"` : ""}>${full ? b.emoji : "?"}</div><small>${full ? b.title : "A scrambled book…"}</small></div>`;
  }).join("");
}

/* ================= TITLE ================= */
function renderTitle() {
  $("titleLodge").innerHTML = LODGE_SVG;
  $("btnSoundTitle").textContent = save.sound ? "🔊 Sound: On" : "🔇 Sound: Off";
  const n = save.restored.length;
  $("titleProgress").textContent = n === 0
    ? "No books restored yet — the lodge needs you!"
    : n >= MISSIONS.length
      ? "🏆 All 8 books are restored! The lodge is open for free exploring."
      : `📚 Books restored: ${n} of 8 • ⭐ ${save.totalSparks} Story Sparks earned`;
}

/* ================= MAP + HUD ================= */
function renderHUD() {
  const m = mission();
  if (!m) {
    $("hudBox").innerHTML = `<div class="hud-mission">🏆 Every book is restored!</div>
      <div class="hud-row"><span class="hud-label">⭐ Sparks</span><span>${save.totalSparks} earned in all</span></div>
      <div class="hud-row"><span class="hud-label">🔦 Lantern</span><div class="meter"><div class="meter-fill lantern" style="width:${save.lantern}%"></div></div><span class="hud-num">${save.lantern} / 100</span></div>`;
    $("mapBanner").innerHTML = "";
    return;
  }
  const cf = cluesFound();
  const pips = m.clues.map((c, i) => save.mission.clues[i] ? "🟢" : "⚪").join("");
  const sp = Math.min(100, Math.round(save.mission.sparks / m.threshold * 100));
  $("hudBox").innerHTML = `
    <div class="hud-mission">📖 Mission ${save.mission.idx + 1}: ${m.emoji} ${m.title}</div>
    <div class="hud-row"><span class="hud-label">🔎 Clues</span><span class="pips">${pips}</span><span class="hud-num">${cf} of 4</span></div>
    <div class="hud-row"><span class="hud-label">⭐ Sparks</span><div class="meter"><div class="meter-fill sparks" style="width:${sp}%"></div></div><span class="hud-num">${save.mission.sparks} / ${m.threshold}</span></div>
    <div class="hud-row"><span class="hud-label">🔦 Lantern</span><div class="meter"><div class="meter-fill lantern" style="width:${save.lantern}%"></div></div><span class="hud-num">${save.lantern} / 100</span></div>`;
  let banner = "";
  if (finaleReady()) {
    banner = `<div class="map-banner">🎉 <b>Your book is ready to restore!</b> You have all 4 clues and ${save.mission.sparks} Story Sparks. Go to the <b>Story Hall</b> on Floor 2 and tap “Unscramble the Book!”</div>`;
  } else if (save.lantern < LANTERN_COST) {
    banner = `<div class="map-banner warn">🔦 <b>Your lantern is dim!</b> Visit the <b>Cellar Lantern Station</b> and play Lantern Sums to fill it back up.</div>`;
  } else if (cf < 4) {
    const next = m.clues.find((c, i) => !save.mission.clues[i]);
    banner = `<div class="map-banner">🦉 <b>Lottie's lantern glows toward the ${ROOMS[next.room].name}…</b> a Story Clue is hiding there. (${next.emoji} ${next.name})</div>`;
  } else {
    banner = `<div class="map-banner">⭐ <b>All 4 clues found!</b> Play any games you like to earn ${m.threshold - save.mission.sparks} more Story Sparks, then visit the Story Hall.</div>`;
  }
  $("mapBanner").innerHTML = banner;
}
function renderMap() {
  renderHUD();
  const m = mission();
  $("floorList").innerHTML = FLOORS.map(f => `
    <div class="floor-title">${f.name}</div>
    <div class="room-grid">${f.rooms.map(rid => {
      const r = ROOMS[rid];
      let badge = "";
      if (m) {
        const ci = m.clues.findIndex((c, i) => c.room === rid && !save.mission.clues[i]);
        const cd = m.clues.findIndex((c, i) => c.room === rid && save.mission.clues[i]);
        if (ci >= 0) badge = `<span class="room-badge">🔎 Clue!</span>`;
        else if (cd >= 0) badge = `<span class="room-badge done">✅ Clue</span>`;
      }
      if (rid === "storyhall" && finaleReady()) badge = `<span class="room-badge">🎉 Restore!</span>`;
      if (rid === "cellar" && save.lantern < LANTERN_COST) badge = `<span class="room-badge">🔦 Fill up!</span>`;
      const sub = rid === "storyhall" ? `${save.restored.length} of 8 books home` : ACTIVITIES[r.activity].name;
      return `<button class="room-btn" data-room="${rid}"><span class="r-emoji">${r.emoji}</span><b>${r.name}</b><small>${sub}</small>${badge}</button>`;
    }).join("")}</div>`).join("");
  document.querySelectorAll(".room-btn").forEach(b => b.onclick = () => { SoundFX.pop(); openRoom(b.dataset.room); });
}

/* ================= BRIEFING ================= */
function renderBriefing() {
  const m = mission();
  if (!m) { show("map"); renderMap(); return; }
  $("briefTitle").textContent = `📖 Mission ${save.mission.idx + 1}: ${m.emoji} ${m.title}`;
  $("scramblerArt").innerHTML = SCRAMBLER_SVG;
  $("briefMixup").textContent = m.mixup;
  $("briefText").innerHTML = `<b>Lottie says:</b> “The Scrambler scrambled <b>${m.title}</b>! Four Story Clues are hiding in four rooms of our lodge. My lantern will glow on the map toward the next one. Find all four, earn <b>${m.threshold} Story Sparks</b>, and we will unscramble the book together in the Story Hall.”`;
  $("briefClues").innerHTML = m.clues.map((c, i) => `
    <div class="clue-list-item ${save.mission.clues[i] ? "found" : ""}">
      <span class="c-emoji">${c.emoji}</span>
      <p><b>Clue ${i + 1}: ${c.name}</b> ${save.mission.clues[i] ? "— ✅ Found!" : `— hiding in the <b>${ROOMS[c.room].name}</b> (${ACTIVITIES[ROOMS[c.room].activity].name})`}</p>
    </div>`).join("");
  $("briefGoal").textContent = `⭐ Goal: 4 clues + ${m.threshold} Story Sparks (you have ${save.mission.sparks})`;
}

/* ================= QUESTION GENERATORS =================
   Every generator returns { type:"choice", prompt, options:[{t, ok}], hint }
   or { type:"order", prompt, words:[...] (in correct order), hint }.
   Math answers are computed in code — always verifiable. */
function mcOptions(correct, distractors) {
  return shuffle([{ t: String(correct), ok: true }].concat(distractors.map(d => ({ t: String(d), ok: false }))));
}
function numDistractors(ans, spread) {
  const s = new Set();
  while (s.size < 2) { const d = ans + pick(spread); if (d !== ans && d >= 0) s.add(d); }
  return [...s];
}
function genMath(level) {
  let a, b, c, ans, text;
  if (level === 1) {
    a = 1 + Math.floor(Math.random() * 5); b = 1 + Math.floor(Math.random() * 5);
    ans = a + b; text = `${a} + ${b} = ?`;
  } else if (level === 2) {
    if (Math.random() < 0.5) { a = 6 + Math.floor(Math.random() * 12); b = 2 + Math.floor(Math.random() * 9); ans = a + b; text = `${a} + ${b} = ?`; }
    else { a = 9 + Math.floor(Math.random() * 11); b = 2 + Math.floor(Math.random() * (a - 2)); ans = a - b; text = `${a} − ${b} = ?`; }
  } else {
    if (Math.random() < 0.5) {
      a = 3 + Math.floor(Math.random() * 8); b = 2 + Math.floor(Math.random() * 7);
      c = 1 + Math.floor(Math.random() * Math.min(5, a + b - 1)); ans = a + b - c; text = `${a} + ${b} − ${c} = ?`;
    } else {
      const mult = pick([2, 5, 10]); b = 2 + Math.floor(Math.random() * 8); ans = mult * b; text = `${mult} × ${b} = ?`;
    }
  }
  return { type: "choice", prompt: `<span class="q-big">${text}</span>`, options: mcOptions(ans, numDistractors(ans, [-2, -1, 1, 2, 10])), hint: "Try counting it out slowly on your fingers — the lodge is in no hurry." };
}
function genLantern(level) {
  let target, known, ans, text;
  if (level === 1) { target = 10; known = 1 + Math.floor(Math.random() * 8); }
  else if (level === 2) { target = 20; known = 3 + Math.floor(Math.random() * 15); }
  else { target = 30 + Math.floor(Math.random() * 21); known = 5 + Math.floor(Math.random() * (target - 8)); }
  ans = target - known; text = `${known} + ? = ${target}`;
  return { type: "choice", prompt: `<span class="q-big">${text}</span>`, options: mcOptions(ans, numDistractors(ans, [-2, -1, 1, 2, 5])), hint: `Think: what number joins ${known} to make ${target}? Count up from ${known}.` };
}
function letterOptions(correct) {
  const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(l => l !== correct);
  return mcOptions(correct, [pick(pool), pick(pool)]);
}
function genWord(level) {
  const item = pick(WORD_BANK[level]);
  if (level === 3) {
    return { type: "choice", prompt: `${item.emoji}<br>Which spelling is right?`, options: mcOptions(item.word, item.options.filter(o => o !== item.word)), hint: "Say the word slowly and listen to every sound in it." };
  }
  const shown = item.word.split("").map((ch, i) => i === item.missing ? "_" : ch).join(" ");
  return { type: "choice", prompt: `${item.emoji}<br><span class="q-big">${shown}</span>`, options: letterOptions(item.word[item.missing]), hint: `The picture is a ${item.word.toLowerCase()}. Which letter is missing?` };
}
function genSentence(level) {
  if (level === 3) {
    const item = pick(SENT_BANK[3]);
    return { type: "order", prompt: "Tap the words in order to build the sentence:", words: item.words.slice(), hint: "Read your sentence out loud — does it sound like talking?" };
  }
  const item = pick(SENT_BANK[level]);
  return { type: "choice", prompt: item.text, options: mcOptions(item.options[item.answer], item.options.filter((o, i) => i !== item.answer)), hint: "Read the sentence with each word in the gap. One of them sounds just right." };
}
function genRhyme(level) {
  const item = pick(RHYME_BANK[level]);
  const prompt = level === 3
    ? `Which word does <u>NOT</u> rhyme with <b>${item.target}</b>?`
    : `Which word rhymes with <b>${item.target}</b>?`;
  return { type: "choice", prompt: prompt, options: mcOptions(item.options[item.answer], item.options.filter((o, i) => i !== item.answer)), hint: `Say ${item.target.toLowerCase()} slowly, then say each word. Rhyming words end with the same song.` };
}
function genNature(level) {
  const bank = NATURE_BANK[level];
  const item = pick(bank.items);
  const prompt = level === 3 ? `Where does the <b>${item.name}</b> live?` : `Sort the <b>${item.name}</b>!`;
  return { type: "choice", prompt: prompt, item: item, options: bank.bins.map((b, i) => ({ t: b, ok: i === item.bin })),
    hint: level === 3 ? `Picture the ${item.name} at home. Where does it sleep, swim, or grow?` : `Think about the ${item.name}. Which group does it belong in?` };
}
function genGeo(level) {
  const item = pick(GEO_BANK[level]);
  return { type: "choice", prompt: item.q, options: mcOptions(item.options[item.answer], item.options.filter((o, i) => i !== item.answer)), hint: "Picture the big globe in the Attic — and take your time." };
}
const GENERATORS = { math: genMath, word: genWord, sentence: genSentence, nature: genNature, geo: genGeo, rhyme: genRhyme, lantern: genLantern };

/* ================= ROOMS ================= */
const LANTERN_COST = 12;
function clueBannerHTML(rid) {
  const m = mission();
  if (!m) return "";
  const ci = m.clues.findIndex(c => c.room === rid);
  if (ci < 0) return "";
  if (save.mission.clues[ci]) return `<div class="clue-banner found">✅ You found the Story Clue in this room: ${m.clues[ci].emoji} <b>${m.clues[ci].name}</b></div>`;
  return `<div class="clue-banner here">🔎 A Story Clue is hiding in this room! Play <b>${ACTIVITIES[ROOMS[rid].activity].name}</b> to find it: ${m.clues[ci].emoji} <b>${m.clues[ci].name}</b></div>`;
}
function starRowHTML(actId) {
  const sel = selLevel[actId] || 1;
  return `<div class="star-row"><b>Pick your level:</b>${[1, 2, 3].map(l =>
    `<button class="star-btn ${l === sel ? "on" : ""}" data-level="${l}" data-act="${actId}">${"⭐".repeat(l)} Level ${l}</button>`).join("")}</div>`;
}
function wireStars(container, actId, onPick) {
  container.querySelectorAll(".star-btn").forEach(b => b.onclick = () => {
    selLevel[actId] = parseInt(b.dataset.level, 10);
    container.querySelectorAll(".star-btn").forEach(x => x.classList.toggle("on", x === b));
    SoundFX.pop();
    if (onPick) onPick();
  });
}
function openRoom(rid) {
  curRoom = rid; round = null;
  const r = ROOMS[rid];
  $("roomTitle").textContent = `${r.emoji} ${r.name}`;
  $("roomBlurb").textContent = r.blurb;
  const body = $("roomBody");
  if (rid === "storyhall") {
    const m = mission();
    body.innerHTML = `
      <div class="shelf">${shelfHTML()}</div>
      ${m ? `<p class="story-line">Mission ${save.mission.idx + 1}: ${m.emoji} <b>${m.title}</b> — Clues: ${cluesFound()} of 4 • Story Sparks: ${save.mission.sparks} of ${m.threshold}</p>
      <button class="big-btn gold" id="btnFinale" ${finaleReady() ? "" : "disabled"}>🧩 Unscramble the Book!</button>
      ${finaleReady() ? "" : `<p class="tiny-note">Find all 4 Story Clues and earn ${m.threshold} Story Sparks to unlock the unscrambling.</p>`}`
      : `<p class="master-line">🏆 Every book is home. The Story Hall is complete!</p>`}`;
    const fb = $("btnFinale");
    if (fb) fb.onclick = () => { SoundFX.sparkle(); openFinale(); };
    show("room"); return;
  }
  if (r.activity === "lantern") {
    body.innerHTML = `
      <div class="clue-banner here">🔦 <b>The Lantern Station:</b> every activity in the lodge spends Lantern Light. Solve Lantern Sums here — each right answer pours <b>+20 light</b> back into the lanterns (and earns Story Sparks too)!</div>
      <div class="layer-card exp">
        <h3 class="layer-title">🔦 Lantern Light: <span id="lNum">${save.lantern}</span> / 100</h3>
        <div class="meter"><div class="meter-fill lantern" id="lMeter" style="width:${save.lantern}%"></div></div>
        <div id="lStars">${starRowHTML("lantern")}</div>
        <div id="lArea"></div>
        <p class="layer-msg" id="lMsg"></p>
      </div>`;
    wireStars($("lStars"), "lantern", () => renderLanternQ());
    renderLanternQ();
    show("room"); return;
  }
  const act = ACTIVITIES[r.activity];
  body.innerHTML = `
    <div id="clueBanner">${clueBannerHTML(rid)}</div>
    <div class="layer-card">
      <h3 class="layer-title">${act.emoji} ${act.name} <small>• ${act.subject}</small></h3>
      <p class="layer-intro">Play a round of 3 questions. Every right answer earns ⭐ Story Sparks — more at higher levels! A round spends 🔦 ${LANTERN_COST} Lantern Light.</p>
      <div id="aStars">${starRowHTML(r.activity)}</div>
      <button class="big-btn primary" id="btnPlay">▶ Play a Round</button>
      <div id="actArea"></div>
      <p class="layer-msg" id="actMsg"></p>
    </div>`;
  wireStars($("aStars"), r.activity);
  $("btnPlay").onclick = () => startRound(rid);
  show("room");
}

/* ================= ROUND PLAYER ================= */
let round = null;
function awardSparks(level) {
  const gain = 5 * level;
  save.totalSparks += gain;
  if (mission()) save.mission.sparks += gain;
  persist();
  return gain;
}
function startRound(rid) {
  const actId = ROOMS[rid].activity;
  if (save.lantern < LANTERN_COST) {
    SoundFX.wrong();
    $("actMsg").className = "layer-msg kind";
    $("actMsg").innerHTML = `🔦 Oh no — the lantern is too dim to play (you need ${LANTERN_COST} light, you have ${save.lantern}). Lottie points downstairs: “To the <b>Cellar Lantern Station</b>! Lantern Sums will fill us right up.”`;
    return;
  }
  save.lantern -= LANTERN_COST; persist();
  round = { actId: actId, roomId: rid, level: selLevel[actId] || 1, qNum: 0, total: 3, sparks: 0 };
  $("btnPlay").style.display = "none";
  $("actMsg").textContent = "";
  nextQuestion();
}
function nextQuestion() {
  if (round.qNum >= round.total) { finishRound(); return; }
  const q = GENERATORS[round.actId](round.level);
  round.q = q;
  const area = $("actArea");
  const dots = "⭐".repeat(round.qNum) + "☆".repeat(round.total - round.qNum);
  if (q.type === "order") { renderOrderQuestion(area, q, dots); return; }
  const itemBlock = q.item ? `<div class="sort-item"><span class="s-emoji">${q.item.emoji}</span>${q.item.name}</div>` : "";
  const gridCls = round.actId === "nature" ? `bin-row ${q.options.length === 3 ? "cols3" : ""}` : (q.options.length <= 4 ? "opt-grid cols2" : "opt-grid");
  area.innerHTML = `<div class="dots">${dots}</div>${itemBlock}<div class="q-prompt">${q.prompt}</div>
    <div class="${gridCls}">${q.options.map(o => `<button class="opt-btn" data-ok="${o.ok ? "1" : "0"}">${o.t}</button>`).join("")}</div>`;
  area.querySelectorAll(".opt-btn").forEach(b => b.onclick = () => answerChoice(b, q));
}
function answerChoice(btn, q) {
  const area = $("actArea");
  if (btn.dataset.ok === "1") {
    btn.classList.add("correct");
    area.querySelectorAll(".opt-btn").forEach(x => x.disabled = true);
    SoundFX.correct();
    const gain = awardSparks(round.level); round.sparks += gain;
    $("actMsg").className = "layer-msg";
    $("actMsg").textContent = `⭐ +${gain} Story Sparks! ${round.qNum + 1 < round.total ? "Next question…" : ""}`;
    round.qNum++;
    setTimeout(nextQuestion, DELAY);
  } else {
    btn.classList.add("wrong"); btn.disabled = true;
    SoundFX.wrong();
    $("actMsg").className = "layer-msg kind";
    $("actMsg").textContent = "Not quite — and that's okay! " + q.hint;
  }
}
function renderOrderQuestion(area, q, dots) {
  const state = { next: 0 };
  const chips = shuffle(q.words.map((w, i) => ({ w: w, pos: i })));
  area.innerHTML = `<div class="dots">${dots}</div><div class="q-prompt">${q.prompt}</div>
    <div class="story-line-slots" id="ordSlots">${q.words.map((_, i) => `<div class="slot"><span class="slot-num">${i + 1}</span></div>`).join("")}</div>
    <div class="chip-row" id="ordChips">${chips.map((c, i) => `<button class="clue-chip word-chip" data-pos="${c.pos}" data-uid="${i}">${c.w}</button>`).join("")}</div>`;
  area.querySelectorAll(".clue-chip").forEach(chip => chip.onclick = () => {
    if (parseInt(chip.dataset.pos, 10) === state.next) {
      chip.classList.add("used");
      const slot = $("ordSlots").children[state.next];
      slot.classList.add("filled"); slot.insertAdjacentHTML("beforeend", chip.textContent);
      SoundFX.pop();
      state.next++;
      if (state.next === q.words.length) {
        SoundFX.correct();
        const gain = awardSparks(round.level); round.sparks += gain;
        $("actMsg").className = "layer-msg";
        $("actMsg").textContent = `⭐ +${gain} Story Sparks! You built the whole sentence: “${q.words.join(" ")}”`;
        round.qNum++;
        setTimeout(nextQuestion, DELAY);
      }
    } else {
      SoundFX.wrong();
      $("actMsg").className = "layer-msg kind";
      $("actMsg").textContent = "Hmm, that word comes later. " + q.hint;
    }
  });
}
function finishRound() {
  const area = $("actArea");
  const m = mission();
  let clueLine = "";
  if (m) {
    const ci = m.clues.findIndex((c, i) => c.room === round.roomId && !save.mission.clues[i]);
    if (ci >= 0) {
      save.mission.clues[ci] = true; persist();
      SoundFX.sparkle();
      clueLine = `<p class="master-line">🔎 STORY CLUE FOUND! ${m.clues[ci].emoji} ${m.clues[ci].name} (${cluesFound()} of 4)</p>`;
      const cb = $("clueBanner"); if (cb) cb.innerHTML = clueBannerHTML(round.roomId);
    }
  }
  area.innerHTML = `<div class="q-prompt">🎉 Round complete!</div>
    <p class="story-line">You earned ⭐ <b>${round.sparks} Story Sparks</b> this round.${m ? ` Mission total: ${save.mission.sparks} of ${m.threshold}.` : ""}</p>
    ${clueLine}
    <button class="big-btn" id="btnAgain">▶ Play Again</button>
    <button class="big-btn primary" id="btnToMap">🏔️ Back to the Lodge Map</button>`;
  $("btnAgain").onclick = () => startRound(round.roomId);
  $("btnToMap").onclick = () => { renderMap(); show("map"); };
  round = null;
}

/* ================= LANTERN STATION ================= */
function renderLanternQ() {
  const level = selLevel.lantern || 1;
  const q = genLantern(level);
  const area = $("lArea"); if (!area) return;
  area.innerHTML = `<div class="q-prompt">${q.prompt}</div>
    <div class="opt-grid cols2">${q.options.map(o => `<button class="opt-btn" data-ok="${o.ok ? "1" : "0"}">${o.t}</button>`).join("")}</div>`;
  area.querySelectorAll(".opt-btn").forEach(b => b.onclick = () => {
    if (b.dataset.ok === "1") {
      area.querySelectorAll(".opt-btn").forEach(x => x.disabled = true);
      b.classList.add("correct");
      SoundFX.correct();
      save.lantern = Math.min(100, save.lantern + 20);
      const gain = awardSparks(level);
      $("lNum").textContent = save.lantern;
      $("lMeter").style.width = save.lantern + "%";
      $("lMsg").className = "layer-msg";
      $("lMsg").textContent = save.lantern >= 100 ? `🔦 The lantern is FULL and glowing! (+${gain} ⭐ too.) Off you go, keeper!` : `🔦 +20 Lantern Light and +${gain} ⭐ Story Sparks! Keep going, or head back up whenever you're ready.`;
      setTimeout(renderLanternQ, DELAY);
    } else {
      b.classList.add("wrong"); b.disabled = true;
      SoundFX.wrong();
      $("lMsg").className = "layer-msg kind";
      $("lMsg").textContent = "Not quite — the lantern believes in you. " + q.hint;
    }
  });
}

/* ================= FINALE ================= */
let finaleState = null;
function openFinale() {
  const m = mission(); if (!m || !finaleReady()) return;
  show("finale");
  $("finaleTitle").textContent = `🧩 Unscramble: ${m.emoji} ${m.title}`;
  finaleState = { next: 0, qIndex: 0 };
  $("orderMsg").textContent = "";
  $("finaleMsg").textContent = "";
  $("finaleQuiz").hidden = true;
  $("orderSlots").innerHTML = m.clues.map((c, i) => `<div class="slot"><span class="slot-num">${i + 1}</span></div>`).join("");
  const chips = shuffle(m.clues.map((c, i) => ({ c: c, pos: i })));
  $("orderChips").innerHTML = chips.map((x, i) => `<button class="clue-chip" data-pos="${x.pos}" data-uid="${i}">${x.c.emoji} ${x.c.name}</button>`).join("");
  $("orderChips").querySelectorAll(".clue-chip").forEach(chip => chip.onclick = () => {
    const pos = parseInt(chip.dataset.pos, 10);
    if (pos === finaleState.next) {
      chip.classList.add("used");
      const slot = $("orderSlots").children[finaleState.next];
      slot.classList.add("filled"); slot.textContent = m.clues[pos].emoji;
      SoundFX.pop();
      finaleState.next++;
      if (finaleState.next === 4) {
        SoundFX.sparkle();
        $("orderMsg").textContent = "🎉 The story is in order! Now for the story questions…";
        $("finaleQuiz").hidden = false;
        renderFinaleQ();
      } else {
        $("orderMsg").textContent = `That's the ${["first", "second", "third"][finaleState.next - 1]} piece! What happens next?`;
      }
    } else {
      SoundFX.wrong();
      $("orderMsg").textContent = `Not yet — the story needs “${m.clues[finaleState.next].name}” ${finaleState.next === 0 ? "first" : "next"}. Look for that chip!`;
    }
  });
}
function renderFinaleQ() {
  const m = mission();
  const q = m.finale[finaleState.qIndex];
  const opts = shuffle(q.options.map((t, i) => ({ t: t, ok: i === q.answer })));
  $("finaleQArea").innerHTML = `<div class="q-prompt">${q.q}</div>
    <div class="opt-grid">${opts.map(o => `<button class="opt-btn" data-ok="${o.ok ? "1" : "0"}">${o.t}</button>`).join("")}</div>`;
  $("finaleQArea").querySelectorAll(".opt-btn").forEach(b => b.onclick = () => {
    if (b.dataset.ok === "1") {
      b.classList.add("correct");
      $("finaleQArea").querySelectorAll(".opt-btn").forEach(x => x.disabled = true);
      SoundFX.correct();
      finaleState.qIndex++;
      if (finaleState.qIndex >= m.finale.length) { setTimeout(completeMission, DELAY); }
      else { $("finaleMsg").textContent = "⭐ Exactly right! One more…"; setTimeout(renderFinaleQ, DELAY); }
    } else {
      b.classList.add("wrong"); b.disabled = true;
      SoundFX.wrong();
      $("finaleMsg").textContent = "Hmm — check your clues! " + q.hint;
    }
  });
}
function completeMission() {
  const idx = save.mission.idx;
  const m = MISSIONS[idx];
  if (!save.restored.includes(idx)) save.restored.push(idx);
  save.restored.sort((a, b) => a - b);
  save.mission = freshMission(Math.min(idx + 1, MISSIONS.length));
  persist();
  SoundFX.fanfare();
  show("restored");
  burst($("confettiZone"));
  $("restoredBook").textContent = m.emoji;
  $("restoredSummary").innerHTML = `<b>${m.title}</b><br>${m.summary}`;
  $("restoredLine").textContent = m.reaction;
  $("restoredShelf").innerHTML = shelfHTML();
  const last = idx === MISSIONS.length - 1;
  $("restoredBtns").innerHTML = last
    ? `<button class="big-btn gold" id="btnEnding">🌙 See How the Story Ends</button>`
    : `<button class="big-btn primary" id="btnNextMission">📖 Next Mission: ${MISSIONS[idx + 1].emoji} ${MISSIONS[idx + 1].title}</button>
       <button class="big-btn" id="btnRestoredMap">🏔️ Back to the Lodge Map</button>`;
  if (last) {
    $("btnEnding").onclick = () => { $("endingShelf").innerHTML = shelfHTML(); show("ending"); burst($("confettiZone2")); SoundFX.fanfare(); };
  } else {
    $("btnNextMission").onclick = () => { renderBriefing(); show("briefing"); };
    $("btnRestoredMap").onclick = () => { renderMap(); show("map"); };
  }
}

/* ================= INIT ================= */
document.querySelectorAll("[data-nav]").forEach(b => b.onclick = () => {
  SoundFX.pop();
  if (b.dataset.nav === "title") { renderTitle(); show("title"); }
  else if (b.dataset.nav === "map") { renderMap(); show("map"); }
});
$("btnStart").onclick = () => {
  SoundFX.pop();
  const m = mission();
  if (m && !save.mission.briefed) { save.mission.briefed = true; persist(); renderBriefing(); show("briefing"); }
  else { renderMap(); show("map"); }
};
$("btnBriefing").onclick = () => { SoundFX.pop(); renderBriefing(); show("briefing"); };
$("btnSoundTitle").onclick = () => { save.sound = !save.sound; persist(); renderTitle(); if (save.sound) SoundFX.pop(); };
renderTitle();

/* test hooks (used by the scripted self-test only) */
window.SBM = {
  get save() { return save; },
  MISSIONS: MISSIONS, ROOMS: ROOMS,
  finaleReady: finaleReady, mission: mission,
  setLight: function (n) { save.lantern = n; persist(); }
};
