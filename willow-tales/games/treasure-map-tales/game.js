/* The Treasure Map Tales — an original Willow Tales pirate adventure.
   Mechanics follow the house blueprint (CLASSIC-BLUEPRINTS.md, Muppet
   Treasure Island section): four story-shaped chapters, a companion who is
   hint system + inventory + comic relief, a coin economy inside the fiction,
   four compass stones across all chapters, one randomized key hiding place,
   and a finale that re-uses the journey. All characters, words, jokes, and
   art are our own. No external assets. (Stevenson's novel is public domain;
   nothing here copies the 1996 game or any Muppet character.) */

/* ================= SHIP ART (our own SVG) ================= */
const SHIP_SVG = `<svg viewBox="0 0 220 150" aria-label="The Turning Page, a friendly story ship">
  <path d="M0 128 Q30 118 55 128 T110 128 T165 128 T220 128 L220 150 L0 150 Z" fill="#2a7ab0"/>
  <path d="M0 138 Q30 130 55 138 T110 138 T165 138 T220 138 L220 150 L0 150 Z" fill="#14456b" opacity=".45"/>
  <path d="M40 108 L180 108 L162 132 L58 132 Z" fill="#8a5a2b"/>
  <path d="M40 108 L180 108 L174 118 L46 118 Z" fill="#a9713a"/>
  <rect x="106" y="34" width="7" height="76" rx="3" fill="#6e4520"/>
  <path d="M113 38 L152 78 L113 78 Z" fill="#fff8ec" stroke="#d99a06" stroke-width="2.5"/>
  <path d="M106 48 L74 82 L106 82 Z" fill="#ffe9a8" stroke="#d99a06" stroke-width="2.5"/>
  <path d="M113 34 L138 40 L113 47 Z" fill="#e8530a"/>
  <circle cx="78" cy="120" r="5" fill="#fdf3d8"/><circle cx="110" cy="120" r="5" fill="#fdf3d8"/><circle cx="142" cy="120" r="5" fill="#fdf3d8"/>
</svg>`;

/* ================= COMPASS STONES ================= */
const STONE_ORDER = ["north", "east", "south", "west"];
const STONES = {
  north: { name: "North Stone", emoji: "🔴", gem: "ruby-red",  chapter: "inn",    hint: "It hides at the Lantern Inn, somewhere that ticks and chimes." },
  east:  { name: "East Stone",  emoji: "🟢", gem: "emerald-green", chapter: "town", hint: "It hides in the Port Town, somewhere that smells of the sea's supper." },
  south: { name: "South Stone", emoji: "🔵", gem: "sapphire-blue", chapter: "ship", hint: "It hides aboard the Turning Page, somewhere that rings." },
  west:  { name: "West Stone",  emoji: "🟡", gem: "topaz-gold", chapter: "island", hint: "It hides on Storybook Island, behind singing water." }
};
const CHAPTER_NAMES = { inn: "Chapter 1 · The Lantern Inn", town: "Chapter 2 · The Port Town", ship: "Chapter 3 · The Turning Page", island: "Chapter 4 · Storybook Island" };

/* ================= THE BRASS KEY — hiding place randomized each new game ================= */
const KEY_SPOTS = [
  { id: "cookiejar",  chapter: "inn",  label: "the cookie jar at the inn" },
  { id: "welcomemat", chapter: "inn",  label: "under the welcome mat at the inn" },
  { id: "dockbarrel", chapter: "town", label: "the big barrel on the dock" },
  { id: "floursack",  chapter: "town", label: "the baker's flour sack" },
  { id: "souppot",    chapter: "ship", label: "the cook's soup pot" },
  { id: "ropecoil",   chapter: "ship", label: "the coiled rope on deck" }
];

/* ================= ECONOMY ================= */
const KIT_PRICE = 24;          // the Sailor's Kit at Marina's Shop
const PIE_TARGET_PAY = 2;      // per tin can splatted
const PIE_BYSTANDER_COST = 1;  // per bystander pied (never below 0)
const COUNT_PAY = 3;           // per correct count
const BAKER_PAY = 5;           // one-time help
const CRATES_PAY = 4;          // one-time help

/* ================= CHAPTERS & HOTSPOTS ================= */
/* act names resolve in ACTIONS below. kind "joke"/"fact" spots just pop text. */
const CHAPTERS = [
{
  id: "inn", n: 1, emoji: "🏮", name: "The Lantern Inn", sub: "Find the treasure map",
  intro: "Rain patters on the roof of Lottie's Lantern Inn, but inside it is warm and smells of cocoa. Tonight, you start work as the inn's brand-new cabin kid. Lottie winks: “Every great adventure begins with a small kindness. Let's make the inn cozy — and keep your eyes open. Old inns keep wonderful secrets.”",
  bg: "linear-gradient(180deg,#ffe9c9,#f7d9a0)",
  spots: [
    { id: "biscuit", emoji: "🦜", label: "Biscuit", act: "meetBiscuit",
      again: "Biscuit does a happy hop. “That's me! Biscuit the parrot, keeper of the satchel, teller of hints, eater of crackers. We are going to be BEST friends.”" },
    { id: "woodpile", emoji: "🪵", label: "Woodpile", act: "wood",
      again: "The woodpile is tidy now. One log winks at you. Logs cannot wink. You decide not to tell anyone." },
    { id: "fireplace", emoji: "🔥", label: "Fireplace", act: "fire",
      again: "The fire crackles and dances. It is telling the chimney a story in pops and snaps." },
    { id: "portrait", emoji: "🖼️", label: "Old Portrait", act: "portrait",
      again: "Captain Rose smiles out of her portrait. Her painted eyes seem to say: “Well done, cabin kid. Well done.”" },
    { id: "clock", emoji: "🕰️", label: "Old Clock", act: "stoneNorth",
      again: "Tick… tock… tick… tock… The old clock is counting stories instead of seconds. It does that when it is happy." },
    { id: "cookiejar", emoji: "🍪", label: "Cookie Jar", act: "keySpot",
      again: "You peek again — just cookies now. You take exactly one. A cabin kid has honor. And crumbs." },
    { id: "welcomemat", emoji: "🟧", label: "Welcome Mat", act: "keySpot",
      again: "The mat says WELCOME in curly letters. Underneath: just floor. And one very surprised dust bunny." },
    { id: "teapot", emoji: "🫖", label: "Teapot", kind: "joke",
      text: "The teapot sings when the water boils. Today it is humming a sea shanty. Nobody taught it any sea shanties. The teapot has mysteries." },
    { id: "cat", emoji: "🐱", label: "Pickles the Cat", kind: "fact",
      text: "Pickles the inn cat is asleep on the warm rug. Real cats sleep for about 12 to 16 hours every day — Pickles is a champion sleeper, and this is her training." },
    { id: "bookshelf", emoji: "📚", label: "Bookshelf", kind: "joke",
      text: "Lottie's bookshelf leans a little to the left, because all the adventure stories are on the right side and they are heavier with excitement." }
  ],
  tasks: () => [
    { label: "Meet Biscuit the parrot", done: !!save.flags.met },
    { label: "Fetch firewood for the fireplace", done: !!save.flags.wood },
    { label: "Light the fireplace", done: !!save.flags.fire },
    { label: "Find the treasure map", done: !!save.flags.map }
  ],
  doneText: "🗺️ You found Captain Rose's treasure map! The Port Town is waiting…"
},
{
  id: "town", n: 2, emoji: "⚓", name: "The Port Town", sub: "Earn doubloons & buy the Sailor's Kit",
  intro: "Morning! The Port Town sparkles after the rain. Captain Marina's ship, the Turning Page, rocks gently at the dock — but no sailor sails without a proper Sailor's Kit from Marina's Shop, and it costs " + KIT_PRICE + " doubloons. Time to earn, cabin kid! The pie stall and the counting table pay fair wages for fair fun.",
  bg: "linear-gradient(180deg,#cfeeff,#a8dcf5)",
  spots: [
    { id: "pies", emoji: "🥧", label: "Pie Stall", act: "pieGame",
      again: "The pie stall smells of apples and cinnamon. The stall keeper waves: “Throw a pie any time, cabin kid — cans only, mind!”" },
    { id: "counttable", emoji: "🪙", label: "Counting Table", act: "countGame",
      again: "Old Marta runs the counting table. “Counting coins carefully is a sailor's superpower,” she says. “Come and practice!”" },
    { id: "bakery", emoji: "🥖", label: "Bakery", act: "bakerHelp",
      again: "The baker beams: “My flour is all carried in, thanks to you! Sailors who help bakers never go hungry. Remember that.”" },
    { id: "floursack", emoji: "🌾", label: "Flour Sack", act: "keySpot",
      again: "You pat the flour sack. Puff! A little flour cloud sneezes out. The baker laughs: “Bless you, sack!”" },
    { id: "dockbarrel", emoji: "🛢️", label: "Dock Barrel", act: "keySpot",
      again: "You peek in the barrel again. A crab waves a claw at you like a tiny traffic guard. You wave back. Politeness matters." },
    { id: "crates", emoji: "📦", label: "Dock Crates", act: "cratesHelp",
      again: "The crates sit in a neat, proud stack. Somewhere, a dockworker is telling everyone it was his idea. You let him. Kindness is a cargo too." },
    { id: "fishcrate", emoji: "🐟", label: "Fish Crate", act: "stoneEast",
      again: "The fish in the crate stare up with round, surprised eyes. They have seen the bottom of the sea, and they are not telling." },
    { id: "shop", emoji: "🧥", label: "Marina's Shop", act: "shop",
      again: "Marina's Shop smells of rope, soap, and new beginnings. The Sailor's Kit hangs by the door, right where you left it." },
    { id: "lighthouse", emoji: "🗼", label: "Lighthouse", kind: "fact",
      text: "The lighthouse blinks all night long. Its light warns ships away from the sharp rocks — a lighthouse is a story the shore tells the sea: “Careful, friends. Come home safe.”" },
    { id: "seagull", emoji: "🕊️", label: "Seagull", kind: "joke",
      text: "A seagull lands beside you, hopefully. “I am not a pie target,” it says with its eyes. “I am a pie FAN.” You promise to aim carefully." }
  ],
  tasks: () => [
    { label: "Fill your purse — earn " + KIT_PRICE + " doubloons", done: save.totalEarned >= KIT_PRICE || save.flags.purchased },
    { label: "Buy the Sailor's Kit at Marina's Shop (" + KIT_PRICE + " doubloons)", done: !!save.flags.purchased }
  ],
  doneText: "🧥 You bought the Sailor's Kit — coat, hat, and the Captain's Passage Token! The Turning Page is waiting…"
},
{
  id: "ship", n: 3, emoji: "⛵", name: "The Turning Page", sub: "Do five crew duties, then steer the ship",
  intro: "“Welcome aboard the Turning Page!” says Captain Marina, kind and fair. “Leo and Nia are crew, and now so are you. A cabin kid earns the wheel by learning the ship: five crew duties first — then, if your hands are ready, YOU will steer us to Storybook Island.” Leo grins. Nia gives you the sailor's thumbs-up.",
  bg: "linear-gradient(180deg,#bfe6ff,#8fd0f5)",
  spots: [
    { id: "modelship", emoji: "🚢", label: "Model Ship", act: "dutyModel",
      again: "Your model ship sits proudly on the Captain's table. Leo keeps saluting it. It is a very small ship, but it holds a very big lesson." },
    { id: "rowboat", emoji: "🚣", label: "Rowboat", act: "dutyLoad",
      again: "The rowboat bobs beside the ship, loaded just right. Not too much, not too little — exactly seven crates, like a story with exactly the right number of pages." },
    { id: "galley", emoji: "🍳", label: "Galley", act: "dutyBake",
      again: "The galley smells of warm berry cake. The cook hums: “Eggs, milk, butter, berries…” Some recipes you remember with your nose." },
    { id: "anchor", emoji: "⚓", label: "Anchor", act: "dutyAnchor",
      again: "The anchor rests on deck, dripping and dignified. It has held this ship through a hundred naps of the sea." },
    { id: "mop", emoji: "🧹", label: "Mop & Puddles", act: "dutyMop",
      again: "The deck shines. A puddle-free deck is a safe deck — and also, the seagulls can see themselves in it, which they enjoy very much." },
    { id: "bell", emoji: "🔔", label: "Ship's Bell", act: "stoneSouth",
      again: "You polish the bell until it shines. Ding! It rings once, all by itself, just to show off its good manners." },
    { id: "souppot", emoji: "🍲", label: "Soup Pot", act: "keySpot",
      again: "You peek in the soup pot. Today's soup is vegetable, with exactly one noodle shaped like a question mark. The cook refuses to explain it." },
    { id: "ropecoil", emoji: "🪢", label: "Rope Coil", act: "keySpot",
      again: "The rope coil lies in a perfect sailor's spiral. Coiling rope neatly is how sailors say “I was here, and I cared.”" },
    { id: "helm", emoji: "🎡", label: "Ship's Wheel", act: "steer",
      again: "The great wheel turns smoothly under your hands. Somewhere below, the rudder answers. You and the ship understand each other now." },
    { id: "crowsnest", emoji: "🔭", label: "Crow's Nest", kind: "fact",
      text: "From the crow's nest — the lookout basket high on the mast — Nia can see the whole shining sea. Sailors climb up there to watch for land, whales, and weather. Today she reports: “One island, shaped exactly like an open book!”" },
    { id: "flag", emoji: "🚩", label: "Ship's Flag", kind: "joke",
      text: "The Turning Page flies a flag with a golden book on it. When the wind blows, the book looks like it is turning its own pages. The wind is a very fast reader." }
  ],
  tasks: () => [
    { label: "Duty 1: Build the model ship — learn the parts of a ship", done: !!save.duties.model },
    { label: "Duty 2: Load the rowboat with exactly 7 crates", done: !!save.duties.load },
    { label: "Duty 3: Bake with the cook — follow the recipe in order", done: !!save.duties.bake },
    { label: "Duty 4: Weigh anchor — count the chain links", done: !!save.duties.anchor },
    { label: "Duty 5: Mop the deck — splash away every puddle", done: !!save.duties.coil },
    { label: "Steer the ship to Storybook Island", done: !!save.steered }
  ],
  doneText: "🏝️ You steered the Turning Page across the shining sea — Storybook Island is HERE!"
},
{
  id: "island", n: 4, emoji: "🏝️", name: "Storybook Island", sub: "Follow the map & open the Story Chest",
  intro: "The island is shaped like an open book, with palm trees for bookmarks. Captain Marina hands you the treasure map. “The verses will guide you, cabin kid — and everything you learned on the way is in your hands now. Leo, Nia, Biscuit — stay close. Treasure time.”",
  bg: "linear-gradient(180deg,#ffeec2,#ffe082)",
  spots: [
    { id: "palm", emoji: "🌴", label: "Leaning Palm", act: "palm",
      again: "The tall palm leans toward the sea, listening. Palms are excellent listeners. They have heard every story the waves ever told." },
    { id: "shells", emoji: "🐚", label: "Three Shells", act: "shells",
      again: "One, two, three shells, all counted. If you hold one to your ear, it doesn't whisper the sea — it whispers: “Well counted, cabin kid.”" },
    { id: "waterfall", emoji: "💦", label: "Waterfall", act: "waterfall",
      again: "Behind the waterfall, the little cave sparkles dry and secret. The waterfall keeps singing guard outside, splashing happily." },
    { id: "oldboat", emoji: "🛶", label: "Old Rowboat", act: "oldBoat",
      again: "The old rowboat floats straight and proud, rudder steering true, little sail catching the breeze. Good as new — because you knew how." },
    { id: "circle", emoji: "🧭", label: "Stone Circle", act: "circle",
      again: "The four compass stones glow softly in their places — North, East, South, West — like four good friends holding hands around the treasure." },
    { id: "chest", emoji: "✨", label: "The Story Chest", act: "chest",
      again: "The Story Chest stands open, and its golden books shine like morning. Some treasures are meant to be shared — and this one is." },
    { id: "crab", emoji: "🦀", label: "Crab", kind: "joke",
      text: "A crab sidesteps up to you. Crabs always walk sideways — this one says it's because treasure could be anywhere, and sideways covers more ground. You cannot argue with crab logic." },
    { id: "rainbow", emoji: "🌈", label: "Rainbow", kind: "fact",
      text: "A rainbow arches over the island. Rainbows appear when sunlight shines through raindrops — the drops bend the light into all its hidden colors, like a story opening to its most colorful page." }
  ],
  tasks: () => [
    { label: "Count the three shells by the leaning palm", done: !!save.flags.shells },
    { label: "Step behind the waterfall", done: !!save.flags.waterfall },
    { label: "Fix the old rowboat — rudder and sail", done: !!save.flags.boat },
    { label: "Wake the stone circle — all four compass stones", done: !!save.flags.circle },
    { label: "Open the Captain's Story Chest", done: !!save.flags.finished }
  ],
  doneText: "📚 THE STORY CHEST IS OPEN! Golden storybooks for everyone!"
}
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
  coin()    { this.tone(987.77, 0, .12, "square", .07); this.tone(1318.5, .07, .2, "square", .07); },
  correct() { this.tone(523.25, 0, .16, "triangle"); this.tone(659.25, .09, .16, "triangle"); this.tone(783.99, .18, .26, "triangle"); },
  wrong()   { this.tone(196, 0, .22, "sine", .08); },
  sparkle() { this.tone(1318.5, 0, .18, "triangle", .1); this.tone(1567.98, .09, .18, "triangle", .1); this.tone(2093, .18, .3, "triangle", .09); },
  fanfare() { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * .13, .3, "triangle")); },
  /* HOUSE LIFECYCLE FIX: sound must never keep playing after leaving the game */
  stopAll() {
    Song.stop();
    if (this.ctx) { try { this.ctx.close(); } catch (e) {} this.ctx = null; }
  }
};
document.addEventListener("visibilitychange", () => { if (document.hidden) SoundFX.stopAll(); });
window.addEventListener("pagehide", () => SoundFX.stopAll());
window.addEventListener("beforeunload", () => SoundFX.stopAll());

/* ================= SAVE ================= */
const SAVE_KEY = "treasureMapSave";
function freshSave() {
  return {
    sound: true, unlocked: 1, coins: 0, totalEarned: 0,
    keySpot: Math.floor(Math.random() * KEY_SPOTS.length), keyFound: false,
    stones: { north: false, east: false, south: false, west: false },
    flags: {}, duties: {}, steered: false, foundSpots: {}
  };
}
let save = freshSave();
try {
  const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
  if (raw && typeof raw === "object" && typeof raw.keySpot === "number") {
    const base = freshSave();
    save = Object.assign(base, raw);
    save.stones = Object.assign(base.stones, raw.stones || {});
    save.flags = raw.flags || {}; save.duties = raw.duties || {}; save.foundSpots = raw.foundSpots || {};
  } else { persist(); }
} catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

/* ================= HELPERS / STATE ================= */
const $ = id => document.getElementById(id);
const FAST = !!window.TMT_FAST; // test hook: shortens animation delays
let cur = { chapter: null };
let overlayCleanup = null; // stops timers of the currently open mini-game

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $("screen-" + name).classList.add("active");
  window.scrollTo(0, 0);
}
function shuffle(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
function confettiInto(zone, n) {
  const bits = ["🎉", "✨", "🎊", "⭐", "📚", "🪙"];
  let s = "";
  for (let i = 0; i < (n || 14); i++) s += bits[i % bits.length] + " ";
  zone.textContent = s;
}
function chapterById(id) { return CHAPTERS.find(c => c.id === id); }
function stonesHeld() { return STONE_ORDER.filter(s => save.stones[s]).length; }
function addCoins(n) {
  save.coins += n;
  if (n > 0) { save.totalEarned += n; SoundFX.coin(); }
  if (save.coins < 0) save.coins = 0;
  persist(); refreshChips();
}
function refreshChips() {
  const c = "🪙 " + save.coins + " doubloons";
  if ($("coinLine")) $("coinLine").textContent = c;
  if ($("sceneCoinChip")) $("sceneCoinChip").textContent = c + " · 🧭 " + stonesHeld() + "/4 stones";
  if ($("stoneLine")) $("stoneLine").textContent = "Compass stones: " +
    STONE_ORDER.map(s => (save.stones[s] ? STONES[s].emoji + " " + STONES[s].name : "⚪ ???")).join(" · ");
}

/* ================= POPUPS ================= */
function showSpot(emoji, chip, text, itemText) {
  $("spotEmoji").textContent = emoji;
  $("spotChip").textContent = chip;
  $("spotText").textContent = text;
  const b = $("spotItem");
  if (itemText) { b.hidden = false; b.textContent = itemText; } else { b.hidden = true; b.textContent = ""; }
  $("spotOverlay").hidden = false;
}
function hideSpot() { $("spotOverlay").hidden = true; }

/* ================= BISCUIT — hint system + satchel ================= */
function keySpotDef() { return KEY_SPOTS[save.keySpot]; }
function biscuitHint() {
  const f = save.flags, ch = cur.chapter;
  // Story-progress hints first, for the chapter you are standing in.
  if (ch === "inn") {
    if (!f.met) return "Tap the parrot in the inn scene — that's ME! Introduce yourself, cabin kid!";
    if (!f.wood) return "The fireplace is cold and grumbly. Fetch some firewood from the woodpile first — fires are just stories wood tells when it's warm.";
    if (!f.fire) return "Now tap the fireplace and light it. Warm firelight has a way of showing secrets that cold rooms keep hidden…";
    if (!f.map) return "Look at the old portrait of Captain Rose by the fire. Firelight is dancing on its frame — tap it and see!";
  }
  if (ch === "town") {
    if (!f.purchased) return "The Sailor's Kit costs " + KIT_PRICE + " doubloons and you have " + save.coins + ". Earn at the Pie Stall (aim at CANS, not people!) and the Counting Table. Helping the baker and the dock crew pays, too!";
  }
  if (ch === "ship") {
    const left = [["model", "build the model ship"], ["load", "load the rowboat with exactly 7 crates"], ["bake", "bake with the cook"], ["anchor", "weigh the anchor"], ["coil", "mop the puddles"]]
      .filter(([k]) => !save.duties[k]).map(([, v]) => v);
    if (left.length) return "Crew duties still waiting: " + left.join(", ") + ". Tap the matching thing on deck — I believe in you, cabin kid!";
    if (!save.steered) return "All duties done! Tap the Ship's Wheel — Captain Marina trusts YOU to steer us to the island. Just follow my calls: North, East, South, West!";
  }
  if (ch === "island") {
    if (!f.shells) return "The map's first verse: by the leaning palm, count the shells — one, two, three. Tap the Three Shells!";
    if (!f.waterfall) return "Second verse: step behind the waterfall's silver spray. Tap the Waterfall — mind you don't get sprinkled!";
    if (!f.boat) return "The old rowboat needs its rudder (the steering part — you learned it on the ship!) and its sail raised before it can cross to the chest cove.";
    if (!f.circle) {
      const missing = STONE_ORDER.filter(s => !save.stones[s]);
      if (missing.length) return "The stone circle needs all four compass stones, and we're missing: " + missing.map(s => STONES[s].name + " (" + STONES[s].hint + ")").join("; ") + ". Finished chapters stay open — go hunting!";
      return "You have all four stones! Tap the Stone Circle and lay each stone at its own compass point — North, East, South, West, like the map says.";
    }
    if (!save.keyFound) return "The circle is awake! Now the chest wants the brass key… " + keyHintText();
    if (!f.finished) return "Everything is ready — stones awake, key in hand. Tap the Story Chest, cabin kid. This is YOUR moment!";
  }
  // Cross-chapter reminders.
  const missing = STONE_ORDER.filter(s => !save.stones[s]);
  let extra = "";
  if (missing.length && f.map) extra = " Compass stones still hiding: " + missing.map(s => STONES[s].name + " — " + STONES[s].hint).join(" ");
  if (!save.keyFound && f.map) extra += " And the brass key: " + keyHintText();
  return "You're doing splendidly, cabin kid! Wander, tap everything, and enjoy the jokes — nearly everything on this adventure does something kind or funny." + extra;
}
function keyHintText() {
  const ks = keySpotDef();
  if (cur.chapter === ks.chapter) return "Psst — my parrot nose smells brass right here in this chapter. Check " + ks.label + "!";
  return "My parrot nose smells brass in " + CHAPTER_NAMES[ks.chapter] + ". Something there is hiding the key…";
}
function satchelItems() {
  const items = [];
  if (save.flags.map) items.push({ emoji: "🗺️", name: "Captain Rose's Treasure Map" });
  if (save.flags.purchased) items.push({ emoji: "🧥", name: "Sailor's Kit (coat, hat & Passage Token)" });
  STONE_ORDER.forEach(s => { if (save.stones[s]) items.push({ emoji: STONES[s].emoji, name: STONES[s].name }); });
  if (save.keyFound) items.push({ emoji: "🗝️", name: "The Brass Key" });
  if (save.duties.model) items.push({ emoji: "🚢", name: "Model Ship (finished!)" });
  if (save.steered) items.push({ emoji: "🎡", name: "Helm Ribbon — you steered the ship!" });
  if (save.flags.finished) items.push({ emoji: "📚", name: "A Golden Storybook of Your Very Own" });
  return items;
}
function openBiscuit() {
  $("biscuitHint").textContent = biscuitHint();
  const list = $("satchelList");
  const items = satchelItems();
  list.innerHTML = items.length
    ? items.map(i => `<div class="satchel-item"><span class="si-emoji">${i.emoji}</span>${i.name}</div>`).join("")
    : `<p class="spot-text">Just crackers so far. Every adventure starts with an empty satchel and a full heart!</p>`;
  list.innerHTML += `<div class="satchel-item"><span class="si-emoji">🪙</span>${save.coins} doubloons</div>`;
  $("biscuitOverlay").hidden = false;
}

/* ================= GAME OVERLAY ================= */
function openGame(title, intro) {
  closeGame();
  $("gameTitle").textContent = title;
  $("gameIntro").textContent = intro;
  $("gameArea").innerHTML = "";
  $("gameMsg").innerHTML = "";
  $("gameOverlay").hidden = false;
}
function gameMsg(html) { $("gameMsg").innerHTML = html; }
function closeGame() {
  if (overlayCleanup) { try { overlayCleanup(); } catch (e) {} overlayCleanup = null; }
  $("gameOverlay").hidden = true;
}

/* ================= NAVIGATION / RENDERING ================= */
function renderTitle() {
  $("titleShip").innerHTML = SHIP_SVG;
  $("btnSoundTitle").textContent = save.sound ? "🔊 Sound: On" : "🔇 Sound: Off";
  const done = CHAPTERS.filter(c => chapterDone(c)).length;
  $("titleProgress").textContent = save.flags.finished
    ? "⭐ Adventure complete! The Story Chest is open — replay any chapter any time. ⭐"
    : (done > 0 || save.flags.met ? "Your adventure so far: " + done + " of 4 chapters finished · " + stonesHeld() + " of 4 compass stones found" : "");
}
function chapterDone(ch) {
  if (ch.id === "inn") return !!save.flags.map;
  if (ch.id === "town") return !!save.flags.purchased;
  if (ch.id === "ship") return !!save.steered;
  if (ch.id === "island") return !!save.flags.finished;
  return false;
}
function renderChapters() {
  refreshChips();
  const list = $("chapterList");
  list.innerHTML = "";
  CHAPTERS.forEach(ch => {
    const locked = ch.n > save.unlocked;
    const done = chapterDone(ch);
    const b = document.createElement("button");
    b.className = "case-card" + (done ? " solved" : "") + (locked ? " locked" : "");
    b.id = "chapterCard-" + ch.id;
    b.innerHTML = `<span class="cc-emoji">${locked ? "🔒" : ch.emoji}</span><span><b>Chapter ${ch.n}: ${ch.name}</b><small>${locked ? "Still over the horizon…" : ch.sub}</small></span><span class="cc-status">${done ? "⭐" : locked ? "" : "›"}</span>`;
    b.onclick = () => {
      if (locked) { showSpot("🌫️", "Biscuit says", "That chapter is still over the horizon, cabin kid. Finish the chapter before it, and the way will open!", null); return; }
      SoundFX.pop(); openScene(ch.id);
    };
    list.appendChild(b);
  });
  $("finishZone").hidden = !save.flags.finished;
}
function openScene(id) {
  cur.chapter = id;
  const ch = chapterById(id);
  $("sceneTitle").textContent = ch.emoji + " Chapter " + ch.n + ": " + ch.name;
  $("sceneIntro").textContent = ch.intro;
  $("sceneBox").style.background = ch.bg;
  $("btnMap").hidden = !save.flags.map;
  renderScene();
  showScreen("scene");
}
function renderScene() {
  const ch = chapterById(cur.chapter);
  refreshChips();
  const ul = $("taskList");
  ul.innerHTML = ch.tasks().map(t => `<li class="${t.done ? "done" : ""}">${t.done ? "✔️" : "🔹"} ${t.label}</li>`).join("");
  const row = $("hotspotRow");
  row.innerHTML = "";
  ch.spots.forEach(sp => {
    const b = document.createElement("button");
    b.className = "hotspot-btn" + (save.foundSpots[sp.id] ? " found" : "");
    b.id = "spot-" + sp.id;
    b.innerHTML = `<span class="hs-emoji">${sp.emoji}</span><span class="hs-label">${sp.label}</span>`;
    b.onclick = () => tapSpot(ch, sp);
    row.appendChild(b);
  });
  const done = chapterDone(ch);
  $("chapterDoneZone").hidden = !done;
  if (done) $("chapterDoneText").textContent = ch.doneText;
}
function afterChange() { persist(); renderScene(); }

/* ================= SPOT ACTIONS ================= */
function grantStone(which, emoji, placeText) {
  if (save.stones[which]) return false;
  save.stones[which] = true; SoundFX.sparkle();
  showSpot(emoji, "Compass Stone Found!", placeText,
    STONES[which].emoji + " You found the " + STONES[which].name + "! (" + stonesHeld() + " of 4)");
  afterChange(); return true;
}
function tapSpot(ch, sp) {
  SoundFX.pop();
  const act = ACTIONS[sp.act];
  if (act) { act(sp); return; }
  if (sp.kind) { showSpot(sp.emoji, sp.kind === "fact" ? "Did You Know?" : "Hee Hee!", sp.text, null); return; }
  showSpot(sp.emoji, sp.label, sp.again || "It smiles at you. Everything here is friendly.", null);
}

const ACTIONS = {
  /* ---- Chapter 1: The Inn ---- */
  meetBiscuit(sp) {
    if (!save.flags.met) {
      save.flags.met = true;
      showSpot("🦜", "A New Friend!", "A green parrot flutters down and lands — very professionally — on your head. “Biscuit's my name! I keep the inn's satchel, I know every hint, and I have decided: YOU are my cabin kid. If you're ever stuck, tap ‘Ask Biscuit.’ Asking for help is what smart sailors do!”", "🦜 Biscuit has joined your adventure!");
      afterChange();
    } else showSpot(sp.emoji, "Biscuit", sp.again, null);
  },
  wood(sp) {
    if (!save.flags.wood) {
      save.flags.wood = true;
      showSpot("🪵", "Kindness First", "You carry in three good logs, stacking them neatly by the fireplace. Lottie nods approvingly: “Warm hands, warm heart, warm inn. Now the fireplace, cabin kid — light it up!”", "🪵 Firewood fetched!");
      afterChange();
    } else showSpot(sp.emoji, "Woodpile", sp.again, null);
  },
  fire(sp) {
    if (!save.flags.wood) {
      showSpot("🔥", "The Fireplace", "The fireplace is cold and full of old ashes. It sighs a tiny sooty sigh. Fires need wood before they can dance — fetch some firewood from the woodpile first!", null);
    } else if (!save.flags.fire) {
      save.flags.fire = true;
      showSpot("🔥", "Firelight!", "Whoosh! The fire leaps up, golden and crackly, and the whole inn glows. Shadows dance on the walls… and look! The firelight is shining on the frame of the old portrait — something behind it is GLEAMING.", "🔥 The fireplace is lit!");
      afterChange();
    } else showSpot(sp.emoji, "Fireplace", sp.again, null);
  },
  portrait(sp) {
    if (!save.flags.fire) {
      showSpot("🖼️", "Captain Rose", "The portrait shows Captain Rose, the kindest captain who ever sailed, holding a book of gold. In the dim room her smile is hard to see. Portraits always look better by firelight…", null);
    } else if (!save.flags.map) {
      save.flags.map = true; save.unlocked = Math.max(save.unlocked, 2);
      SoundFX.fanfare();
      showSpot("🗺️", "THE TREASURE MAP!", "The firelight makes the portrait's frame gleam — and as you tap it, the frame swings open like a tiny door! Behind it, folded with care, is a map in Captain Rose's own hand: a palm tree, a waterfall, a circle of stones… and a chest marked with a golden book. “For the cabin kid who is kind, careful, and brave,” reads the corner. That's YOU.", "🗺️ You found the Treasure Map! Chapter 2 is open!");
      afterChange();
    } else showSpot(sp.emoji, "Captain Rose", sp.again, null);
  },
  stoneNorth(sp) {
    if (grantStone("north", "🕰️", "As the old clock chimes for cocoa o'clock, a little door in its belly pops open — and inside, glowing ruby-red, sits a round stone carved with the letter N!")) return;
    showSpot(sp.emoji, "Old Clock", sp.again, null);
  },
  keySpot(sp) {
    const ks = keySpotDef();
    if (!save.keyFound && ks.id === sp.id) {
      save.keyFound = true; save.foundSpots[sp.id] = true; SoundFX.sparkle();
      showSpot("🗝️", "THE BRASS KEY!", "You found something cold, heavy, and brass hiding in " + ks.label + "! It's a key — a real treasure key, with a tiny book engraved on its handle. Biscuit gasps: “THE key! The Story Chest's key! Oh, keep it safe in the satchel, cabin kid!”", "🗝️ The Brass Key is in your satchel!");
      afterChange();
    } else if (sp.id === ks.id && save.keyFound) {
      showSpot(sp.emoji, sp.label, sp.again, null);
    } else {
      showSpot(sp.emoji, sp.label, sp.again, null);
    }
  },

  /* ---- Chapter 2: The Port Town ---- */
  stoneEast(sp) {
    if (grantStone("east", "🐟", "You lift a very surprised fish — and underneath it, glowing emerald-green in a bed of ice, sits a round stone carved with the letter E! The fish winks. It was guarding it, apparently.")) return;
    showSpot(sp.emoji, "Fish Crate", sp.again, null);
  },
  shop() { openShop(); },
  pieGame() { openPieToss(); },
  countGame() { openCounting(); },
  bakerHelp() { openHelpTask("baker"); },
  cratesHelp() { openHelpTask("crates"); }
};

/* ================= MARINA'S SHOP ================= */
function openShop() {
  if (save.flags.purchased) {
    showSpot("🧥", "Marina's Shop", "Your Sailor's Kit is already yours: a warm coat, a fine hat, and the Captain's Passage Token shining in the pocket. Marina salutes you: “See you aboard, sailor!”", null);
    return;
  }
  openGame("🧥 Marina's Shop — The Sailor's Kit",
    "A warm sailor coat, a fine hat, and the Captain's Passage Token — everything a cabin kid needs to sail. Price: " + KIT_PRICE + " doubloons. You have " + save.coins + ".");
  const area = $("gameArea");
  area.innerHTML = `<div style="text-align:center;font-size:4rem;">🧥</div>
    <div class="ctl-row"><button class="play-btn green" id="btnBuy">🪙 Buy the Sailor's Kit — ${KIT_PRICE} doubloons</button></div>`;
  $("btnBuy").onclick = () => {
    if (save.coins < KIT_PRICE) {
      SoundFX.wrong();
      gameMsg(`<span class="try">Not quite yet — you have ${save.coins} of ${KIT_PRICE} doubloons. Earn more at the Pie Stall and the Counting Table. Helping people pays, too!</span>`);
      return;
    }
    save.coins -= KIT_PRICE; save.flags.purchased = true;
    save.unlocked = Math.max(save.unlocked, 3);
    SoundFX.fanfare(); persist(); refreshChips(); closeGame(); afterChange();
    showSpot("🧥", "THE SAILOR'S KIT IS YOURS!", "Marina wraps the coat around your shoulders herself. “Warm coat — check. Fine hat — check. Passage Token — check!” She pins the token on with a wink. “Welcome aboard the Turning Page, sailor. Chapter 3 is open — the ship is waiting!”", "🧥 Sailor's Kit bought! Chapter 3 is open!");
    renderScene();
  };
}

/* ================= PIE TOSS (coin economy + reckless-hit deduction) ================= */
function openPieToss() {
  openGame("🥧 Pie Toss Gallery",
    "Tap a figure to throw a pie! Splat a TIN CAN: +2 doubloons. But careful — if a pie lands on a PERSON or the seagull, the stall pays 1 doubloon for the laundry. Aim kindly, cabin kid! 6 pies per round.");
  const area = $("gameArea");
  area.innerHTML = `<div class="pie-stage"><button class="pie-slot" id="pieFigure"></button></div>
    <p class="progress-line" id="pieLine"></p>
    <div class="ctl-row"><button class="play-btn" id="pieAgain" hidden>🥧 Play Another Round</button></div>`;
  const figures = shuffle([
    { kind: "target", emoji: "🥫", label: "Tin Can" }, { kind: "target", emoji: "🥫", label: "Tin Can" },
    { kind: "target", emoji: "🥫", label: "Tin Can" }, { kind: "target", emoji: "🥫", label: "Tin Can" },
    { kind: "bystander", emoji: "👩‍🍳", label: "The Baker" }, { kind: "bystander", emoji: "🕊️", label: "Seagull" }
  ]);
  let idx = 0, roundEarned = 0;
  const fig = $("pieFigure"), line = $("pieLine");
  function showFigure() {
    if (idx >= figures.length) {
      fig.disabled = true;
      fig.innerHTML = `<span class="ps-emoji">🎉</span><span class="ps-label">Round over!</span>`;
      line.textContent = "That round earned " + roundEarned + " doubloons. Your purse: " + save.coins + ".";
      gameMsg(roundEarned >= 8 ? "Sharp eyes, gentle aim — a perfect pirate of pies!" : "Good throwing! Play again any time — the cans aren't going anywhere.");
      $("pieAgain").hidden = false;
      return;
    }
    const f = figures[idx];
    fig.disabled = false;
    fig.classList.remove("splatted");
    fig.dataset.kind = f.kind;
    fig.innerHTML = `<span class="ps-emoji">${f.emoji}</span><span class="ps-label">${f.label}</span>`;
    line.textContent = "Pie " + (idx + 1) + " of 6 · Your purse: " + save.coins + " doubloons";
  }
  fig.onclick = () => {
    const f = figures[idx]; if (!f || fig.disabled) return;
    fig.disabled = true;
    fig.classList.add("splatted");
    if (f.kind === "target") {
      roundEarned += PIE_TARGET_PAY; addCoins(PIE_TARGET_PAY);
      gameMsg("🎯 SPLAT! Right on the can! +" + PIE_TARGET_PAY + " doubloons!");
    } else {
      if (save.coins > 0) { addCoins(-PIE_BYSTANDER_COST); gameMsg("😆 OH NO — pie on " + (f.emoji === "🕊️" ? "the seagull" : "the baker") + "! Everyone is laughing (even them), but the laundry costs 1 doubloon. Aim for cans, cabin kid!"); }
      else gameMsg("😆 Pie on " + (f.emoji === "🕊️" ? "the seagull" : "the baker") + "! Lucky your purse was empty — no doubloons to pay for laundry. Aim for cans!");
      SoundFX.wrong();
    }
    idx++; persist();
    setTimeout(showFigure, FAST ? 30 : 650);
  };
  $("pieAgain").onclick = () => { closeGame(); openPieToss(); };
  showFigure();
}

/* ================= COUNT THE DOUBLOONS ================= */
function openCounting() {
  openGame("🪙 Count the Doubloons",
    "Old Marta pours a pile of doubloons on the counting table. Count them carefully and tap the right number — each correct count earns " + COUNT_PAY + " doubloons! 3 counts per round.");
  const area = $("gameArea");
  area.innerHTML = `<div class="coin-pile" id="coinPile"></div>
    <div class="num-row" id="numRow"></div>
    <p class="progress-line" id="countLine"></p>
    <div class="ctl-row"><button class="play-btn" id="countAgain" hidden>🪙 Count Another Round</button></div>`;
  let q = 0;
  function nextQuestion() {
    if (q >= 3) {
      $("coinPile").textContent = "🎉";
      $("numRow").innerHTML = "";
      $("countLine").textContent = "Round finished! Your purse: " + save.coins + " doubloons.";
      gameMsg("Counting carefully is a sailor's superpower — and now it's yours!");
      $("countAgain").hidden = false;
      return;
    }
    const n = 5 + Math.floor(Math.random() * 11); // 5..15
    $("coinPile").textContent = "🪙".repeat(n);
    $("countLine").textContent = "Count " + (q + 1) + " of 3 · Your purse: " + save.coins + " doubloons";
    const opts = shuffle([...new Set([n, n + 1, Math.max(1, n - 1), n + 2])].slice(0, 3));
    const row = $("numRow"); row.innerHTML = "";
    opts.forEach(v => {
      const b = document.createElement("button");
      b.className = "num-btn"; b.textContent = v; b.dataset.val = v;
      b.onclick = () => {
        if (v === n) {
          b.classList.add("right"); SoundFX.correct(); addCoins(COUNT_PAY);
          gameMsg("✔️ Exactly " + n + "! +" + COUNT_PAY + " doubloons. Marta nods: “A careful counter. The sea respects that.”");
          q++; persist();
          setTimeout(nextQuestion, FAST ? 30 : 800);
        } else {
          b.classList.add("nope"); b.disabled = true; SoundFX.wrong();
          gameMsg(`<span class="try">Not quite — count again slowly, one coin at a time. Sailors point at each coin as they count!</span>`);
        }
      };
      row.appendChild(b);
    });
  }
  $("countAgain").onclick = () => { closeGame(); openCounting(); };
  nextQuestion();
}

/* ================= HELP TASKS (one-time coin earnings) ================= */
function openHelpTask(which) {
  const isBaker = which === "baker";
  const flag = isBaker ? "baker" : "crates";
  const pay = isBaker ? BAKER_PAY : CRATES_PAY;
  if (save.flags[flag]) {
    showSpot(isBaker ? "🥖" : "📦", isBaker ? "The Bakery" : "The Dock Crates",
      isBaker ? ACTIONS._bakerAgain : ACTIONS._cratesAgain, null);
    return;
  }
  openGame(isBaker ? "🥖 Help the Baker" : "📦 Help the Dock Crew",
    isBaker ? "The baker's arms are full of bread! Carry her 3 flour sacks into the bakery, one tap each. Honest help earns " + pay + " doubloons."
            : "The dock crew is behind schedule! Stack 4 crates neatly onto the pile, one tap each. Honest help earns " + pay + " doubloons.");
  const area = $("gameArea");
  const total = isBaker ? 3 : 4;
  const emoji = isBaker ? "🌾" : "📦";
  area.innerHTML = `<div class="chore-grid" id="helpGrid"></div>`;
  const grid = $("helpGrid");
  let doneCount = 0;
  for (let i = 0; i < total; i++) {
    const b = document.createElement("button");
    b.className = "chore-btn"; b.textContent = emoji;
    b.onclick = () => {
      if (b.classList.contains("done-chore")) return;
      b.classList.add("done-chore"); b.textContent = "✔️"; SoundFX.pop();
      doneCount++;
      if (doneCount >= total) {
        save.flags[flag] = true; addCoins(pay); persist(); afterChange();
        gameMsg("💪 All done — and done kindly! +" + pay + " doubloons. Your purse: " + save.coins + ".");
        setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 900);
      } else gameMsg("That's " + doneCount + " of " + total + ". Steady and kind wins the day!");
    };
    grid.appendChild(b);
  }
}
ACTIONS._bakerAgain = "The baker beams: “My flour is all carried in, thanks to you! Sailors who help bakers never go hungry. Remember that.”";
ACTIONS._cratesAgain = "The crates sit in a neat, proud stack. Somewhere, a dockworker is telling everyone it was his idea. You let him. Kindness is a cargo too.";

/* ================= SHIP DUTIES ================= */
const SHIP_PARTS = [
  { id: "hull",      name: "Hull",       fact: "The hull is the ship's body — the big wooden shell that floats and keeps the sea outside." },
  { id: "bow",       name: "Bow",        fact: "The bow is the FRONT of the ship — the part that points where you're going." },
  { id: "stern",     name: "Stern",      fact: "The stern is the BACK of the ship — the part that waves goodbye." },
  { id: "mast",      name: "Mast",       fact: "The mast is the tall pole in the middle that holds the sails up high." },
  { id: "sail",      name: "Sail",       fact: "The sail catches the wind, and the wind pushes the whole ship along. Free power from the sky!" },
  { id: "rudder",    name: "Rudder",     fact: "The rudder is a flat board under the water at the stern. Turn it, and the ship turns. It is the ship's steering tail!" },
  { id: "anchor",    name: "Anchor",     fact: "The anchor is a heavy iron hook that grips the sea floor and holds the ship still for a rest." },
  { id: "wheel",     name: "Ship's Wheel", fact: "The ship's wheel is what the helmsman turns. It moves the rudder deep below — wheel, rudder, ship: turn, turn, turn!" },
  { id: "crowsnest", name: "Crow's Nest", fact: "The crow's nest is the lookout basket high on the mast, where a sailor watches for land and weather." }
];
const SHIP_DIAGRAM = `<svg viewBox="0 0 340 230" role="img" aria-label="Diagram of a ship">
  <path d="M0 196 Q60 186 110 196 T230 196 T340 196 L340 230 L0 230 Z" fill="#2a7ab0"/>
  <g class="part" data-part="crowsnest"><circle class="part-halo" cx="172" cy="26" r="17" fill="rgba(245,185,33,.25)" stroke="#d99a06" stroke-width="2"/><path d="M160 30 L184 30 L179 44 L165 44 Z" fill="#8a5a2b"/><text x="172" y="22" font-size="15" text-anchor="middle">🔭</text></g>
  <g class="part" data-part="mast"><rect class="part-halo" x="166" y="40" width="12" height="104" rx="5" fill="rgba(245,185,33,.25)"/><rect x="169" y="42" width="6" height="102" rx="3" fill="#6e4520"/></g>
  <g class="part" data-part="sail"><path class="part-halo" d="M178 48 L232 116 L178 116 Z" fill="rgba(255,248,236,.7)" stroke="#d99a06" stroke-width="2.5"/></g>
  <g class="part" data-part="wheel"><circle class="part-halo" cx="120" cy="128" r="15" fill="rgba(245,185,33,.25)" stroke="#d99a06" stroke-width="2"/><text x="120" y="135" font-size="19" text-anchor="middle">🎡</text></g>
  <g class="part" data-part="hull"><path class="part-halo" d="M52 148 L292 148 L262 190 L84 190 Z" fill="#8a5a2b" stroke="#6e4520" stroke-width="3"/></g>
  <g class="part" data-part="bow"><path class="part-halo" d="M292 148 L316 160 L262 190 L268 148 Z" fill="rgba(232,83,10,.35)" stroke="#e8530a" stroke-width="2"/></g>
  <g class="part" data-part="stern"><path class="part-halo" d="M52 148 L84 190 L62 190 L38 162 Z" fill="rgba(26,138,200,.3)" stroke="#1a8ac8" stroke-width="2"/></g>
  <g class="part" data-part="rudder"><rect class="part-halo" x="52" y="188" width="12" height="26" rx="3" fill="#e8530a" stroke="#b23c06" stroke-width="2"/></g>
  <g class="part" data-part="anchor"><text x="238" y="216" font-size="24" text-anchor="middle">⚓</text><circle class="part-halo" cx="238" cy="206" r="17" fill="rgba(245,185,33,.25)" stroke="#d99a06" stroke-width="2"/></g>
</svg>`;

function dutyDone(key) {
  save.duties[key] = true; persist(); afterChange();
  SoundFX.fanfare();
}
function openModelShip() {
  if (save.duties.model) { showSpot("🚢", "Model Ship", "Your model ship sits proudly on the Captain's table. Leo keeps saluting it. It is a very small ship, but it holds a very big lesson.", null); return; }
  openGame("🚢 Duty 1: Build the Model Ship",
    "Captain Marina sets a model ship on the table. “A sailor knows the ship like a story — every part by name. I'll call a part; you tap it on the ship. Wrong taps are fine: I'll tell you what you found instead. Learning IS the duty!”");
  const area = $("gameArea");
  area.innerHTML = `<div class="ship-diagram" id="shipDiagram">${SHIP_DIAGRAM}</div>
    <p class="progress-line" id="modelCall"></p>`;
  const order = shuffle(SHIP_PARTS.map(p => p.id));
  let idx = 0;
  const call = $("modelCall");
  function ask() {
    if (idx >= order.length) {
      call.textContent = "The model is complete!";
      gameMsg("🎉 Every part named and known — hull to crow's nest! Captain Marina writes in the log: “This cabin kid KNOWS the ship.” Duty 1 done!");
      dutyDone("model");
      setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 1200);
      return;
    }
    const part = SHIP_PARTS.find(p => p.id === order[idx]);
    call.textContent = "Captain Marina calls: “Tap the " + part.name.toUpperCase() + "!” (" + (idx + 1) + " of " + order.length + ")";
  }
  area.querySelectorAll("g.part").forEach(g => {
    g.addEventListener("click", () => {
      const tapped = SHIP_PARTS.find(p => p.id === g.dataset.part);
      const want = SHIP_PARTS.find(p => p.id === order[idx]);
      if (!want) return;
      if (tapped.id === want.id) {
        g.classList.add("found-part"); SoundFX.correct();
        gameMsg("✔️ That's the " + tapped.name + "! " + tapped.fact);
        idx++; setTimeout(ask, FAST ? 30 : 900);
      } else {
        SoundFX.wrong();
        gameMsg(`<span class="try">That's the ${tapped.name} — ${tapped.fact} The Captain is asking for the ${want.name}. Try again!</span>`);
      }
    });
  });
  ask();
}
function openLoadBoat() {
  if (save.duties.load) { showSpot("🚣", "Rowboat", "The rowboat bobs beside the ship, loaded just right. Not too much, not too little — exactly seven crates, like a story with exactly the right number of pages.", null); return; }
  openGame("🚣 Duty 2: Load the Rowboat",
    "“Exactly SEVEN crates,” says Nia. “Too few and we go hungry. Too many and — splash! Count them into the boat one by one.”");
  const area = $("gameArea");
  area.innerHTML = `<p class="progress-line" id="loadLine"></p>
    <div class="coin-pile" id="boatPile" style="min-height:2.4em;"></div>
    <div class="chore-grid" id="cratePile"></div>`;
  let loaded = 0;
  const line = $("loadLine"), pile = $("boatPile"), grid = $("cratePile");
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven"];
  function draw() {
    line.textContent = "Crates in the boat: " + words[loaded] + " (" + loaded + " of 7)";
    pile.textContent = "🧺".repeat(loaded);
  }
  for (let i = 0; i < 9; i++) {
    const b = document.createElement("button");
    b.className = "chore-btn"; b.textContent = "🧺";
    b.onclick = () => {
      if (b.classList.contains("done-chore")) return;
      if (loaded >= 7) { SoundFX.wrong(); gameMsg(`<span class="try">Splash! That crate tumbled right back out — the boat already holds exactly seven. A boat, like a bookshelf, knows when it's full!</span>`); return; }
      b.classList.add("done-chore"); b.textContent = "✔️"; loaded++; SoundFX.pop(); draw();
      if (loaded === 7) {
        gameMsg("🎉 Exactly seven! Nia cheers: “Counted, loaded, perfect.” Duty 2 done!");
        dutyDone("load");
        setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 1100);
      } else gameMsg(words[loaded] + "! Keep counting…");
    };
    grid.appendChild(b);
  }
  draw();
}
function openBake() {
  if (save.duties.bake) { showSpot("🍳", "The Galley", "The galley smells of warm berry cake. The cook hums: “Eggs, milk, butter, berries…” Some recipes you remember with your nose.", null); return; }
  openGame("🍳 Duty 3: Bake with the Cook",
    "The cook is baking Sailor's Berry Cake! Watch the ingredients light up in recipe order, then tap them in the same order. The order is the secret — baking is just a story you can eat.");
  const area = $("gameArea");
  const ings = [
    { id: "eggs", emoji: "🥚", name: "Eggs" }, { id: "milk", emoji: "🥛", name: "Milk" },
    { id: "butter", emoji: "🧈", name: "Butter" }, { id: "berries", emoji: "🍓", name: "Berries" }
  ];
  area.innerHTML = `<div class="seq-stage" id="bakeStage"></div>
    <div class="ctl-row"><button class="play-btn" id="bakeWatch">👀 Watch the Recipe</button></div>`;
  const stage = $("bakeStage");
  const seq = shuffle(ings.map(i => i.id));
  let prog = 0, accepting = false;
  const btns = {};
  ings.forEach(ing => {
    const b = document.createElement("button");
    b.className = "seq-btn"; b.textContent = ing.emoji; b.title = ing.name; b.dataset.id = ing.id;
    b.onclick = () => {
      if (!accepting) return;
      if (ing.id === seq[prog]) {
        b.classList.add("flash"); SoundFX.pop();
        setTimeout(() => b.classList.remove("flash"), FAST ? 30 : 350);
        prog++;
        if (prog >= seq.length) {
          accepting = false;
          gameMsg("🎉 You baked it in perfect order — " + seq.map(id => ings.find(i => i.id === id).name).join(", ") + "! The cake rises golden. Duty 3 done!");
          dutyDone("bake");
          setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 1200);
        } else gameMsg("Yes! That's " + prog + " of " + seq.length + ". What came next?");
      } else {
        SoundFX.wrong(); prog = 0;
        gameMsg(`<span class="try">Ooh, not that one yet — no harm done! Even cooks peek at the recipe again. Tap “Watch the Recipe” and try once more.</span>`);
      }
    };
    btns[ing.id] = b; stage.appendChild(b);
  });
  let timers = [];
  $("bakeWatch").onclick = () => {
    accepting = false; prog = 0;
    gameMsg("Watch closely… the cook points at each ingredient in order:");
    seq.forEach((id, i) => {
      timers.push(setTimeout(() => {
        btns[id].classList.add("flash"); SoundFX.pop();
        gameMsg("The cook points to: " + ings.find(x => x.id === id).name + " (" + (i + 1) + " of " + seq.length + ")");
        timers.push(setTimeout(() => btns[id].classList.remove("flash"), FAST ? 40 : 420));
        if (i === seq.length - 1) timers.push(setTimeout(() => { accepting = true; gameMsg("Now you! Tap the ingredients in the same order."); }, FAST ? 50 : 600));
      }, (FAST ? 90 : 750) * (i + 1)));
    });
  };
  overlayCleanup = () => timers.forEach(clearTimeout);
  gameMsg("Tap “Watch the Recipe” to see the order first!");
}
function openAnchor() {
  if (save.duties.anchor) { showSpot("⚓", "Anchor", "The anchor rests on deck, dripping and dignified. It has held this ship through a hundred naps of the sea.", null); return; }
  openGame("⚓ Duty 4: Weigh Anchor",
    "“Weigh anchor” means PULL IT UP! Leo calls the count as the chain comes in. Tap each chain link and count out loud — one to eight!");
  const area = $("gameArea");
  area.innerHTML = `<p class="progress-line" id="anchorLine">Links pulled: none yet. Tap a link!</p>
    <div class="chore-grid" id="anchorGrid"></div>`;
  const words = ["One!", "Two!", "Three!", "Four!", "Five!", "Six!", "Seven!", "Eight!"];
  let pulled = 0;
  const grid = $("anchorGrid");
  for (let i = 0; i < 8; i++) {
    const b = document.createElement("button");
    b.className = "chore-btn"; b.textContent = "🔗";
    b.onclick = () => {
      if (b.classList.contains("done-chore")) return;
      b.classList.add("done-chore"); b.textContent = pulled + 1; SoundFX.pop();
      $("anchorLine").textContent = "“" + words[pulled] + "” calls Leo. Links pulled: " + (pulled + 1) + " of 8.";
      pulled++;
      if (pulled >= 8) {
        gameMsg("🎉 “Eight!” — and with a happy CLUNK, the anchor is up and the Turning Page is free to sail! Duty 4 done!");
        dutyDone("anchor");
        setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 1100);
      }
    };
    grid.appendChild(b);
  }
}
function openMop() {
  if (save.duties.coil) { showSpot("🧹", "Mop & Puddles", "The deck shines. A puddle-free deck is a safe deck — and also, the seagulls can see themselves in it, which they enjoy very much.", null); return; }
  openGame("🧹 Duty 5: Mop the Deck",
    "Sea-spray has left six puddles shining on the deck. A wet deck is a slippery deck! Tap every puddle to mop it up.");
  const area = $("gameArea");
  area.innerHTML = `<div class="chore-grid" id="mopGrid"></div>`;
  const grid = $("mopGrid");
  let doneCount = 0;
  for (let i = 0; i < 6; i++) {
    const b = document.createElement("button");
    b.className = "chore-btn"; b.textContent = "💧";
    b.onclick = () => {
      if (b.classList.contains("done-chore")) return;
      b.classList.add("done-chore"); b.textContent = "✨"; SoundFX.pop(); doneCount++;
      if (doneCount >= 6) {
        gameMsg("🎉 Every puddle mopped — the deck is safe and shining! Duty 5 done!");
        dutyDone("coil");
        setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 1100);
      } else gameMsg("That's " + doneCount + " of 6 puddles. Swish, swish!");
    };
    grid.appendChild(b);
  }
}

/* ================= STEERING (re-used at the finale) ================= */
const DIRS = {
  north: { name: "NORTH", arrow: "⬆️", hint: "North is UP — where the North Star shines!" },
  east:  { name: "EAST",  arrow: "➡️", hint: "East is RIGHT — where the sun wakes up!" },
  south: { name: "SOUTH", arrow: "⬇️", hint: "South is DOWN — toward the warm winds!" },
  west:  { name: "WEST",  arrow: "⬅️", hint: "West is LEFT — where the sun goes to sleep!" }
};
function openSteering() {
  const left = ["model", "load", "bake", "anchor", "coil"].filter(k => !save.duties[k]);
  if (left.length) {
    showSpot("🎡", "The Ship's Wheel", "The great wheel is polished and waiting — but Captain Marina's rule is fair: crew duties first, steering after. “A captain must know the whole ship,” she says, “then the ship will trust your hands.” Duties still waiting: " + left.length + ". Ask Biscuit if you're not sure which!", null);
    return;
  }
  if (save.steered) { showSpot("🎡", "Ship's Wheel", "The great wheel turns smoothly under your hands. Somewhere below, the rudder answers. You and the ship understand each other now.", null); return; }
  openGame("🎡 Steer the Turning Page!",
    "Captain Marina steps aside. “The wheel is yours, cabin kid.” Biscuit will call a direction — tap that point of the compass. Four true steers and the island is ours!");
  const area = $("gameArea");
  area.innerHTML = `<p class="progress-line" id="steerCall"></p>
    <div class="compass-wrap" id="steerRose"></div>`;
  const calls = shuffle(["north", "east", "south", "west"]);
  let idx = 0;
  const callEl = $("steerCall"), rose = $("steerRose");
  ["north", "west", "east", "south"].forEach(d => {
    const b = document.createElement("button");
    b.className = "compass-btn"; b.dataset.dir = d;
    b.innerHTML = `<span class="cb-arrow">${DIRS[d].arrow}</span>${DIRS[d].name}`;
    b.onclick = () => {
      const want = calls[idx]; if (!want) return;
      if (d === want) {
        b.classList.add("right"); SoundFX.correct(); idx++;
        if (idx >= calls.length) {
          callEl.textContent = "⛵ The Turning Page surges forward over the shining sea…";
          gameMsg("🎉 “Land ho!” cries Nia from the crow's nest — an island shaped like an open book! YOU steered us here, cabin kid. Captain Marina writes it in the log in her finest hand.");
          save.steered = true; save.unlocked = Math.max(save.unlocked, 4);
          persist(); afterChange();
          setTimeout(() => { closeGame(); renderScene(); showSpot("🏝️", "STORYBOOK ISLAND!", "The Turning Page glides into a turquoise bay. Palm trees lean over golden sand, a waterfall sings somewhere, and — Biscuit can smell it — treasure is near. Chapter 4 is open!", "🏝️ Chapter 4 is open!"); }, FAST ? 40 : 1300);
        } else draw();
      } else {
        SoundFX.wrong();
        gameMsg(`<span class="try">Not that way — Biscuit called ${DIRS[want].name}! Remember: ${DIRS[want].hint}</span>`);
      }
    };
    rose.appendChild(b);
  });
  function draw() {
    const want = calls[idx];
    callEl.textContent = "🦜 Biscuit calls: “Steer " + DIRS[want].name + "!” (" + (idx + 1) + " of 4)";
    callEl.dataset.dir = want;
    rose.querySelectorAll(".compass-btn").forEach(b => b.classList.remove("right"));
  }
  draw();
}

/* ---- extend ACTIONS with ship duties ---- */
Object.assign(ACTIONS, {
  dutyModel() { openModelShip(); },
  dutyLoad() { openLoadBoat(); },
  dutyBake() { openBake(); },
  dutyAnchor() { openAnchor(); },
  dutyMop() { openMop(); },
  steer() { openSteering(); },
  stoneSouth(sp) {
    if (grantStone("south", "🔔", "You lift the great bell to polish under it — and something sapphire-blue rolls out with a tiny TING! A round stone, carved with the letter S, was sleeping inside the bell all along!")) return;
    showSpot(sp.emoji, "Ship's Bell", sp.again, null);
  }
});

/* ================= CHAPTER 4: THE ISLAND ================= */
Object.assign(ACTIONS, {
  palm(sp) {
    if (!save.flags.shells) {
      showSpot("🌴", "The Leaning Palm", "The tall palm leans toward the sea, listening. Carved gently into its trunk — long ago, by Captain Rose herself — are the map's own words: “Where the tall palm leans to hear the sea, count the shells — one, two, three.” Look for the Three Shells, cabin kid!", null);
    } else showSpot(sp.emoji, "Leaning Palm", sp.again, null);
  },
  shells(sp) {
    if (save.flags.shells) { showSpot(sp.emoji, "Three Shells", sp.again, null); return; }
    openGame("🐚 Count the Shells",
      "Three beautiful shells lie in the sand by the palm, just like the verse says. Tap each shell and count out loud — one, two, three!");
    const area = $("gameArea");
    area.innerHTML = `<p class="progress-line" id="shellLine">Shells counted: none yet. Tap a shell!</p>
      <div class="chore-grid" id="shellGrid"></div>`;
    const words = ["One!", "Two!", "Three!"];
    let counted = 0;
    const grid = $("shellGrid");
    for (let i = 0; i < 3; i++) {
      const b = document.createElement("button");
      b.className = "chore-btn"; b.textContent = "🐚";
      b.onclick = () => {
        if (b.classList.contains("done-chore")) return;
        b.classList.add("done-chore"); b.textContent = counted + 1; SoundFX.pop();
        $("shellLine").textContent = "“" + words[counted] + "” you count. Shells counted: " + (counted + 1) + " of 3.";
        counted++;
        if (counted >= 3) {
          save.flags.shells = true; persist(); afterChange();
          gameMsg("🎉 One, two, three — counted perfectly! And look: the third shell was hiding a little carved arrow in the sand, pointing toward the waterfall. The map's second verse is calling!");
          setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 1200);
        }
      };
      grid.appendChild(b);
    }
  },
  waterfall(sp) {
    if (!save.flags.shells) {
      showSpot("💦", "The Waterfall", "The waterfall sings and sparkles — but Biscuit shakes his feathers: “The map has an order, cabin kid! First the palm and the shells. Stories — and treasure maps — work best from the beginning.”", null);
      return;
    }
    if (!save.flags.waterfall) {
      save.flags.waterfall = true;
      const gotWest = !save.stones.west;
      if (gotWest) save.stones.west = true;
      SoundFX.sparkle(); persist(); afterChange();
      showSpot("💦", "Behind the Waterfall!", "You step behind the silver spray — and find a dry, secret little cave, cool and quiet. And there, on a smooth rock, glowing topaz-gold: a round stone carved with the letter W!" + (gotWest ? "" : ""),
        gotWest ? "🟡 You found the West Stone! (" + stonesHeld() + " of 4)" : null);
      renderScene();
    } else showSpot(sp.emoji, "Waterfall", sp.again, null);
  },
  oldBoat(sp) {
    if (!save.flags.waterfall) {
      showSpot("🛶", "The Old Rowboat", "An old rowboat rests on the sand beyond the waterfall's path. Its sail is folded, its rudder is off. Follow the map's verses first, cabin kid — the boat comes after the waterfall.", null);
      return;
    }
    if (save.flags.boat) { showSpot(sp.emoji, "Old Rowboat", sp.again, null); return; }
    openGame("🛶 Fix the Old Rowboat",
      "The little boat that crosses to the chest cove is broken in two ways — but YOU learned this ship by heart! First: which part STEERS a boat? Tap it. Then raise the sail!");
    const area = $("gameArea");
    area.innerHTML = `<p class="progress-line" id="boatQ">Question 1: Which part steers the boat?</p>
      <div class="num-row" id="boatOpts"></div>
      <div class="coin-pile" id="boatScene" style="min-height:2.4em;">🛶</div>`;
    const opts = [
      { id: "rudder", label: "The Rudder", right: true },
      { id: "mast", label: "The Mast", right: false },
      { id: "anchor", label: "The Anchor", right: false }
    ];
    const row = $("boatOpts");
    shuffle(opts).forEach(o => {
      const b = document.createElement("button");
      b.className = "num-btn"; b.style.width = "auto"; b.style.padding = "0 18px"; b.style.fontSize = "1.15rem";
      b.textContent = o.label; b.dataset.part = o.id;
      b.onclick = () => {
        if (o.right) {
          SoundFX.correct();
          $("boatQ").textContent = "✔️ The rudder steers the boat — you remembered! Now tap the sail to raise it:";
          row.innerHTML = "";
          const s = document.createElement("button");
          s.className = "num-btn"; s.style.width = "auto"; s.style.padding = "0 18px"; s.style.fontSize = "1.15rem";
          s.textContent = "⛵ Raise the Sail"; s.id = "btnRaiseSail";
          s.onclick = () => {
            save.flags.boat = true; persist(); afterChange(); SoundFX.fanfare();
            $("boatScene").textContent = "⛵💨";
            gameMsg("🎉 Rudder steering true, sail catching the breeze — the old boat is YOURS, because you learned the ship! The chest cove is just across the water. Duty of the heart: complete!");
            setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 1200);
          };
          row.appendChild(s);
        } else {
          SoundFX.wrong(); b.classList.add("nope"); b.disabled = true;
          gameMsg(o.id === "mast"
            ? `<span class="try">The mast is the tall pole that holds the sail. Steering is another part's job — think: the flat board under the water at the back…</span>`
            : `<span class="try">The anchor holds a boat STILL — the opposite of steering! Think: the flat board under the water at the back…</span>`);
        }
      };
      row.appendChild(b);
    });
  },
  circle(sp) {
    const missing = STONE_ORDER.filter(s => !save.stones[s]);
    if (save.flags.circle) { showSpot(sp.emoji, "Stone Circle", sp.again, null); return; }
    if (missing.length) {
      showSpot("🧭", "The Stone Circle Sleeps", "Four round holes wait in the stone circle — North, East, South, West — but the circle cannot wake without all four compass stones. Still hiding: " +
        missing.map(s => STONES[s].name + " (" + STONES[s].hint + ")").join("; ") + ". Finished chapters stay open on the Adventure Map — happy hunting, cabin kid!", null);
      return;
    }
    openStonePlacement();
  },
  chest(sp) {
    if (!save.flags.circle) {
      showSpot("✨", "The Story Chest", "Under a mound of soft sand and sparkles sleeps a great chest with a golden book on its lid. But it is sealed by the stone circle's old, gentle magic — wake the circle first, the way the map's last verse tells.", null);
      return;
    }
    if (!save.keyFound) {
      showSpot("✨", "The Story Chest", "The circle glows… the lid trembles… but the lock holds fast. This chest needs its brass key! " + keyHintText(), null);
      return;
    }
    if (!save.flags.finished) {
      save.flags.finished = true; persist(); SoundFX.fanfare();
      $("endText").textContent = "You fit the brass key into the lock — click! — and lift the lid of the Captain's Story Chest. Inside, stacked in golden rows, are the most beautiful storybooks you have ever seen, each one shining like morning. You did it: the map, the doubloons, the duties, the steering, the stones, the key — every step of the journey is in this moment, and every step was yours.";
      confettiInto($("confettiZone"), 16);
      renderScene();
      showScreen("end");
    } else showSpot(sp.emoji, "The Story Chest", sp.again, null);
  }
});

/* ================= THE FINALE: STONE PLACEMENT ================= */
function openStonePlacement() {
  openGame("🧭 Wake the Stone Circle",
    "The map's last verse: “North, East, South, West, laid true and right.” Tap a stone from your satchel, then tap its compass home. You know these directions — you STEERED by them!");
  const area = $("gameArea");
  area.innerHTML = `<div class="stone-slots" id="stoneSlots"></div>
    <div class="stone-pick" id="stonePick"></div>`;
  const placed = {};
  let picked = null;
  const slotsEl = $("stoneSlots"), pickEl = $("stonePick");
  function draw() {
    slotsEl.innerHTML = "";
    STONE_ORDER.forEach(pt => {
      const b = document.createElement("button");
      b.className = "stone-slot" + (placed[pt] ? " filled" : "");
      b.dataset.point = pt;
      b.innerHTML = placed[pt]
        ? `<span class="ss-emoji">${STONES[pt].emoji}</span>${STONES[pt].name}<br>✔️ home!`
        : `<span class="ss-emoji">${DIRS[pt].arrow}</span>${DIRS[pt].name.toUpperCase()}<br>tap to place`;
      b.onclick = () => {
        if (placed[pt]) return;
        if (!picked) { gameMsg(`<span class="try">First tap a stone below to pick it up — then tap its compass home.</span>`); return; }
        if (picked === pt) {
          placed[pt] = true; SoundFX.correct();
          gameMsg("✔️ The " + STONES[pt].name + " settles into the " + DIRS[pt].name + " with a warm, golden hum. " + DIRS[pt].hint);
          picked = null; draw(); checkDone();
        } else {
          SoundFX.wrong();
          gameMsg(`<span class="try">The ${STONES[picked].name} doesn't sleep there — it belongs in the ${DIRS[picked].name.toUpperCase()}. Remember steering? ${DIRS[picked].hint} Try again!</span>`);
        }
      };
      slotsEl.appendChild(b);
    });
    pickEl.innerHTML = "";
    STONE_ORDER.forEach(s => {
      if (placed[s]) return;
      const b = document.createElement("button");
      b.className = "stone-pick-btn" + (picked === s ? " picked" : "");
      b.dataset.stone = s;
      b.innerHTML = `<span class="sp-emoji">${STONES[s].emoji}</span>${STONES[s].name}`;
      b.onclick = () => { picked = s; SoundFX.pop(); draw(); gameMsg("You hold the " + STONES[s].name + ". Where does it sleep? " + DIRS[s].hint); };
      pickEl.appendChild(b);
    });
  }
  function checkDone() {
    if (STONE_ORDER.every(pt => placed[pt])) {
      save.flags.circle = true; persist(); afterChange(); SoundFX.fanfare();
      gameMsg("🎉 North, East, South, West — laid true and right! The whole circle wakes with a ring of golden light, and across the cove, the Story Chest's lock begins to GLOW. You used everything you learned, cabin kid. Everything.");
      setTimeout(() => { closeGame(); renderScene(); }, FAST ? 40 : 1500);
    }
  }
  draw();
}

/* ================= THE GOLDEN STORYBOOK (ending reward) ================= */
const BOOK_PAGES = [
  "Once, in a harbor town not so very far away, there stood a lighthouse with a very small lamp. “I am too little to matter,” sighed the Littlest Lantern. “The great ships will never see me.”",
  "But the lighthouse keeper — a kind old sailor — polished the little lamp every single night. “Small lights matter,” she said, “on the darkest nights most of all.”",
  "Then came the stormiest night of the year. Rain sang on the roofs, the wind told wild stories, and out at sea, a little boat with a family aboard lost its way among the waves.",
  "The great lighthouse beam swung and swung — too high, too far. But down low, near the harbor mouth, one small golden light shone steady and true. “There!” cried the family. “There is home!”",
  "And the Littlest Lantern learned what every cabin kid knows: you do not have to be the biggest light. You only have to shine, kindly and truly, exactly where you are. The End. 🌟"
];
let bookPage = 0;
function drawBook() {
  $("bookText").textContent = BOOK_PAGES[bookPage];
  $("btnBookPrev").disabled = bookPage === 0;
  $("btnBookNext").disabled = bookPage === BOOK_PAGES.length - 1;
}

/* ================= BISCUIT'S SEA SONG (original tune, WebAudio) ================= */
const Song = {
  timers: [], playing: false,
  /* an original little sea melody in C major, [note, beats] */
  notes: [
    ["C4", 1], ["E4", 1], ["G4", 1], ["E4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["C4", 1],
    ["D4", 1], ["E4", 1], ["F4", 1], ["E4", 1], ["D4", 2], ["G3", 2],
    ["C4", 1], ["E4", 1], ["G4", 1], ["E4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["C4", 1],
    ["D4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["C4", 3], [null, 1]
  ],
  lyrics: [
    "“Sail, sail, over the sea,", "a story is waiting for you and me…",
    "Turn the page and trim the sail,", "kind hearts travel and never fail.",
    "Sail, sail, under the sun,", "the best of treasures is sharing one —",
    "A golden book, a friend, a song:", "sing it soft, and sail along.” 🎵"
  ],
  freq: { G3: 196.0, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0 },
  play() {
    this.stop();
    if (!save.sound) { $("songLyric").innerHTML = "🔇 Sound is off — tap “Sound: On” on the home screen to hear Biscuit's song!"; return; }
    this.playing = true;
    const beat = FAST ? 60 : 430;
    let t = 0;
    this.notes.forEach(([n, b], i) => {
      if (n) {
        this.timers.push(setTimeout(() => {
          const ctx = SoundFX.ensure(); if (!ctx) return;
          try {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = "triangle"; o.frequency.value = this.freq[n];
            const now = ctx.currentTime;
            g.gain.setValueAtTime(0.0001, now);
            g.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
            g.gain.exponentialRampToValueAtTime(0.0001, now + (b * beat / 1000) * 0.95);
            o.connect(g); g.connect(ctx.destination);
            o.start(now); o.stop(now + b * beat / 1000);
          } catch (e) {}
        }, t));
      }
      if (i % 4 === 0) {
        const line = this.lyrics[Math.floor(i / 4)];
        this.timers.push(setTimeout(() => { if (line) $("songLyric").textContent = line; }, t));
      }
      t += b * beat;
    });
    this.timers.push(setTimeout(() => { this.playing = false; }, t));
  },
  stop() { this.timers.forEach(clearTimeout); this.timers = []; this.playing = false; }
};

/* ================= COLORING PAGE ================= */
const COLOR_SVG = `<svg viewBox="0 0 340 250" role="img" aria-label="Coloring page: the Turning Page">
  <rect class="paintable" data-region="sky" x="0" y="0" width="340" height="180" fill="#ffffff"/>
  <circle class="paintable" data-region="sun" cx="292" cy="42" r="24" fill="#ffffff"/>
  <path class="paintable" data-region="sea" d="M0 178 Q60 166 110 178 T230 178 T340 178 L340 250 L0 250 Z" fill="#ffffff"/>
  <path class="paintable" data-region="sailBig" d="M178 52 L240 128 L178 128 Z" fill="#ffffff"/>
  <path class="paintable" data-region="sailSmall" d="M164 66 L112 130 L164 130 Z" fill="#ffffff"/>
  <rect class="paintable" data-region="mast" x="166" y="44" width="9" height="106" fill="#ffffff"/>
  <path class="paintable" data-region="flag" d="M175 44 L205 51 L175 59 Z" fill="#ffffff"/>
  <path class="paintable" data-region="hull" d="M52 152 L292 152 L262 196 L84 196 Z" fill="#ffffff"/>
</svg>`;
const PALETTE = ["#e8530a", "#f5b921", "#38c172", "#1a8ac8", "#9b59b6", "#ff6b9d", "#8a5a2b", "#ffffff"];
let pickedColor = PALETTE[3];
function openColoring() {
  $("colorArt").innerHTML = COLOR_SVG;
  const pal = $("colorPalette");
  pal.innerHTML = "";
  PALETTE.forEach(c => {
    const b = document.createElement("button");
    b.className = "swatch" + (c === pickedColor ? " picked" : "");
    b.style.background = c; b.dataset.color = c;
    b.onclick = () => { pickedColor = c; SoundFX.pop(); pal.querySelectorAll(".swatch").forEach(s => s.classList.toggle("picked", s.dataset.color === c)); };
    pal.appendChild(b);
  });
  $("colorArt").querySelectorAll(".paintable").forEach(r => {
    r.addEventListener("click", () => { r.setAttribute("fill", pickedColor); SoundFX.pop(); });
  });
  $("colorOverlay").hidden = false;
}

/* ================= WIRING ================= */
$("btnStart").onclick = () => { SoundFX.pop(); renderChapters(); showScreen("chapters"); };
$("btnSoundTitle").onclick = () => { save.sound = !save.sound; persist(); renderTitle(); if (save.sound) SoundFX.pop(); };
document.querySelectorAll("[data-nav]").forEach(b => {
  b.addEventListener("click", () => {
    const t = b.dataset.nav;
    if (t === "title") { renderTitle(); showScreen("title"); }
    else if (t === "chapters") { renderChapters(); showScreen("chapters"); }
  });
});
$("btnSpotClose").onclick = () => { hideSpot(); };
$("btnBiscuit").onclick = () => openBiscuit();
$("btnSatchel").onclick = () => openBiscuit();
$("btnBiscuitClose").onclick = () => { $("biscuitOverlay").hidden = true; };
$("btnMap").onclick = () => { $("mapOverlay").hidden = false; };
$("btnMapClose").onclick = () => { $("mapOverlay").hidden = true; };
$("btnGameClose").onclick = () => closeGame();
$("btnSong").onclick = () => { $("songOverlay").hidden = false; };
$("btnSongPlay").onclick = () => Song.play();
$("btnSongStop").onclick = () => Song.stop();
$("btnSongClose").onclick = () => { Song.stop(); $("songOverlay").hidden = true; };
$("btnColor").onclick = () => openColoring();
$("btnColorClose").onclick = () => { $("colorOverlay").hidden = true; };
$("btnColorReset").onclick = () => openColoring();
$("btnPrint").onclick = () => { try { window.print(); } catch (e) {} };
$("btnEnding2").onclick = () => {
  $("endText").textContent = "You fit the brass key into the lock — click! — and lift the lid of the Captain's Story Chest. Inside, stacked in golden rows, are the most beautiful storybooks you have ever seen, each one shining like morning. You did it: the map, the doubloons, the duties, the steering, the stones, the key — every step of the journey is in this moment, and every step was yours.";
  confettiInto($("confettiZone"), 16);
  showScreen("end");
};
$("btnStorybook").onclick = () => { bookPage = 0; drawBook(); $("bookOverlay").hidden = false; };
$("btnBookPrev").onclick = () => { if (bookPage > 0) { bookPage--; drawBook(); SoundFX.pop(); } };
$("btnBookNext").onclick = () => { if (bookPage < BOOK_PAGES.length - 1) { bookPage++; drawBook(); SoundFX.pop(); } };
$("btnBookClose").onclick = () => { $("bookOverlay").hidden = true; };
let resetArmed = false;
$("btnReset").onclick = () => {
  if (!resetArmed) {
    resetArmed = true;
    $("btnReset").textContent = "🦜 Biscuit asks: tap once more if you're sure — a fresh adventure, and the key will hide somewhere NEW!";
    return;
  }
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  save = freshSave(); persist();
  resetArmed = false;
  $("btnReset").textContent = "↺ Start the adventure over (the brass key will hide somewhere new!)";
  renderTitle(); showScreen("title");
  showSpot("🦜", "A Fresh Adventure!", "Biscuit fluffs his feathers: “A brand-new voyage, cabin kid! And this time, I've hidden the brass key somewhere different… my beak is sealed!”", null);
};

renderTitle();
