/* Willow Reading World — an original Willow Tales reading game for ages 4–7.
   Cast: Lottie the owl (host & scrapbook keeper), Leo, Nia, Bao the panda,
   Nana T the turtle, and their neighborhood friends.
   Mechanics (house blueprint, Franklin-style): a small knowable neighborhood,
   the same three activity shapes in every scene (Word Builder, Sentence
   Builder, Memory Match) with themed word banks pre-sorted into three star
   levels the CHILD controls, friend-hosted extras, an entry-ritual handshake,
   and a scrapbook instead of a score. No timers, no villains, no fail states.
   All words, sentences, and text are our own. */
"use strict";

/* ================= HANDSHAKE ACTIONS ================= */
const HS_ACTIONS = [
  { id:"wave",  e:"👋", n:"Wave"  },
  { id:"hug",   e:"🤗", n:"Hug"   },
  { id:"star",  e:"⭐", n:"Star"  },
  { id:"note",  e:"🎵", n:"Note"  },
  { id:"heart", e:"💗", n:"Heart" }
];

/* ================= SCENES ================= */
/* words: pre-sorted into 3 star levels by length/complexity.
   sentences: per star level, tiles are tapped in order. */
const SCENES = [
{ id:"clubhouse", name:"The Clubhouse", art:"🏠", emoji:"🏠",
  line:"The coziest house on the lane — every friend is welcome here.",
  friend:{ name:"Lottie", face:"🦉" },
  hello:"Welcome to the Clubhouse, little reader! I am Lottie. I keep our Scrapbook and I know every friend on the lane.",
  help:"First, let's do our Friendship Handshake — watch my moves, then copy me. That is how every friend says hello here!",
  thanks:"You remembered our handshake! The door is open, and so is my heart. You are a true friend of the neighborhood.",
  keepsake:{ id:"ribbon", e:"🎀", name:"Welcome Ribbon" },
  extra:"handshake", extraName:"Friendship Handshake", extraEmoji:"🤝",
  words:{
    1:[{w:"hug",e:"🤗"},{w:"pal",e:"🧒"},{w:"fun",e:"🎉"},{w:"tea",e:"🍵"}],
    2:[{w:"home",e:"🏠"},{w:"play",e:"🛝"},{w:"kind",e:"💗"},{w:"book",e:"📖"}],
    3:[{w:"friend",e:"👫"},{w:"welcome",e:"👋"},{w:"gentle",e:"🌸"},{w:"please",e:"🙏"}] },
  sentences:{
    1:["I hug my pal.","We have fun."],
    2:["We play at home.","A kind friend helps."],
    3:["Welcome, my gentle friend.","Please share the warm tea."] } },
{ id:"porch", name:"Leo's Porch", art:"🏡", emoji:"🪁",
  line:"A sunny porch with a kite, a chair, and the whole blue sky.",
  friend:{ name:"Leo", face:"👦" },
  hello:"Hi! I'm Leo. I love sunny days, fast feet, and flying my kite from the porch.",
  help:"The porch signs blew into a jumble! Play a word game with me and help me read them again.",
  thanks:"You helped me read every sign! Now my kite can fly. Thank you, friend!",
  keepsake:{ id:"kite", e:"🪁", name:"Sunny Kite" },
  words:{
    1:[{w:"sun",e:"☀️"},{w:"sky",e:"🌤️"},{w:"run",e:"🏃"},{w:"sit",e:"🪑"}],
    2:[{w:"kite",e:"🪁"},{w:"wind",e:"🌬️"},{w:"bird",e:"🐦"},{w:"jump",e:"🤸"}],
    3:[{w:"cloud",e:"☁️"},{w:"sunny",e:"🌞"},{w:"breeze",e:"🍃"},{w:"rainbow",e:"🌈"}] },
  sentences:{
    1:["I see the sun.","Leo can run fast."],
    2:["My kite flies high.","Birds sing on the porch."],
    3:["The rainbow follows the rain.","A soft breeze hugs the porch."] } },
{ id:"garden", name:"Nia's Garden", art:"🌻", emoji:"🌻",
  line:"Rows of flowers, buzzing bees, and tomatoes as red as rubies.",
  friend:{ name:"Nia", face:"👧" },
  hello:"Hello! I'm Nia. My garden grows a little more every day — seeds, sprouts, and surprises.",
  help:"The garden labels fell off the rows! Play a game with me and help me read them back.",
  thanks:"Every label is back in its row! The garden is happy, and so am I. Thank you!",
  keepsake:{ id:"flower", e:"🌼", name:"Garden Flower" },
  words:{
    1:[{w:"bee",e:"🐝"},{w:"ant",e:"🐜"},{w:"pea",e:"🫛"},{w:"egg",e:"🥚"}],
    2:[{w:"seed",e:"🌱"},{w:"rain",e:"🌧️"},{w:"leaf",e:"🍃"},{w:"rose",e:"🌹"}],
    3:[{w:"flower",e:"🌼"},{w:"garden",e:"🪴"},{w:"tomato",e:"🍅"},{w:"sprout",e:"🌿"}] },
  sentences:{
    1:["An ant is tiny.","The bee is busy."],
    2:["Rain helps the seeds grow.","Nia plants a red rose."],
    3:["The tomato is round and red.","Little sprouts reach for the sun."] } },
{ id:"bakery", name:"Bao's Bakery", art:"🥖", emoji:"🥖",
  line:"Warm bread, sweet jam, and the happiest smell on the lane.",
  friend:{ name:"Bao", face:"🐼" },
  hello:"Welcome to my bakery! I'm Bao. Everything here is warm, soft, and made to share.",
  help:"My recipe cards got all mixed up! Play a game with me and help me read them right.",
  thanks:"Every recipe is right again! The rolls are warm and my heart is warmer. Thank you!",
  keepsake:{ id:"roll", e:"🥐", name:"Warm Roll" },
  words:{
    1:[{w:"egg",e:"🥚"},{w:"pie",e:"🥧"},{w:"jam",e:"🫙"},{w:"nut",e:"🌰"}],
    2:[{w:"cake",e:"🎂"},{w:"milk",e:"🥛"},{w:"roll",e:"🥐"},{w:"loaf",e:"🥖"}],
    3:[{w:"muffin",e:"🧁"},{w:"cookie",e:"🍪"},{w:"butter",e:"🧈"},{w:"bread",e:"🍞"}] },
  sentences:{
    1:["Bao bakes a pie.","I like warm jam."],
    2:["The cake is sweet.","Warm milk helps me grow."],
    3:["The muffin smells so sweet.","Bao shares a warm cookie with me."] } },
{ id:"pond", name:"Nana T's Pond", art:"🐢", emoji:"🐢",
  line:"A quiet pond where the water sparkles and nobody ever hurries.",
  friend:{ name:"Nana T", face:"🐢" },
  hello:"Hello, dear. I am Nana T. I have lived by this pond a long, slow, happy time.",
  help:"The story stones by the water are jumbled. Play a game with me, slowly and kindly, and help me read them.",
  thanks:"The stones are right again, and so is my heart. Slow and kind wins every day. Thank you, dear.",
  keepsake:{ id:"shell", e:"🐚", name:"Pond Shell" },
  words:{
    1:[{w:"log",e:"🪵"},{w:"wet",e:"💧"},{w:"hop",e:"🐸"},{w:"egg",e:"🥚"}],
    2:[{w:"frog",e:"🐸"},{w:"duck",e:"🦆"},{w:"swim",e:"🏊"},{w:"lily",e:"🪷"}],
    3:[{w:"turtle",e:"🐢"},{w:"splash",e:"💦"},{w:"ripple",e:"〰️"},{w:"pebble",e:"🪨"}] },
  sentences:{
    1:["A frog can hop.","The log is wet."],
    2:["Ducks swim in the pond.","A lily floats softly."],
    3:["The old turtle swims very slowly.","Ripples dance on the quiet pond."] } },
{ id:"library", name:"The Library Tree", art:"🌳", emoji:"🌳",
  line:"A great old tree full of books, nests, and stories in its branches.",
  friend:{ name:"Pip", face:"🐦" },
  hello:"Tweet hello! I'm Pip. I live in the Library Tree and I read every story twice.",
  help:"Story words blew out of my books and into the leaves! Play a game with me and help me catch them.",
  thanks:"Every word is back in its book! Tweet thanks, dear reader — you are a story hero!",
  keepsake:{ id:"bookmark", e:"🔖", name:"Story Bookmark" },
  extra:"spotdiff", extraName:"Spot the Difference", extraEmoji:"🔍",
  words:{
    1:[{w:"fox",e:"🦊"},{w:"hen",e:"🐔"},{w:"pig",e:"🐷"},{w:"owl",e:"🦉"}],
    2:[{w:"bear",e:"🐻"},{w:"lion",e:"🦁"},{w:"wolf",e:"🐺"},{w:"goat",e:"🐐"}],
    3:[{w:"story",e:"📖"},{w:"dragon",e:"🐉"},{w:"castle",e:"🏰"},{w:"queen",e:"👑"}] },
  sentences:{
    1:["The fox is quick.","An owl can hoot."],
    2:["The bear reads a book.","A lion naps softly."],
    3:["The dragon guards the castle.","Pip reads a bedtime story."] } },
{ id:"market", name:"The Market Stall", art:"🛒", emoji:"🛒",
  line:"Crates of apples, bunches of grapes, and a very busy little mouse.",
  friend:{ name:"Momo", face:"🐭" },
  hello:"Squeak hi! I'm Momo. My stall has the shiniest apples and the sweetest grapes on the lane.",
  help:"My shopping list blew away in the wind! Play a game with me and help me read what everyone needs.",
  thanks:"The list is read and every basket is full! Squeak thanks — you are the kindest shopper ever!",
  keepsake:{ id:"apple", e:"🍎", name:"Shiny Apple" },
  extra:"sorting", extraName:"Sorting Baskets", extraEmoji:"🧺",
  words:{
    1:[{w:"nut",e:"🌰"},{w:"yam",e:"🍠"},{w:"egg",e:"🥚"},{w:"pea",e:"🫛"}],
    2:[{w:"corn",e:"🌽"},{w:"pear",e:"🍐"},{w:"rice",e:"🍚"},{w:"bean",e:"🫘"}],
    3:[{w:"apple",e:"🍎"},{w:"grape",e:"🍇"},{w:"lemon",e:"🍋"},{w:"banana",e:"🍌"}] },
  sentences:{
    1:["I buy an egg.","The yam is sweet."],
    2:["Corn grows very tall.","Momo sells ripe pears."],
    3:["The bananas are yellow and sweet.","Grapes grow in big bunches."] } },
{ id:"music", name:"The Music Corner", art:"🎵", emoji:"🎵",
  line:"A shady corner where the drums are soft and every song is a hug.",
  friend:{ name:"Bella", face:"🐻" },
  hello:"Hello, hello! I'm Bella. I sing to the flowers and drum very, very gently.",
  help:"The words of my new song scattered like leaves! Play a game with me and help me gather them.",
  thanks:"My song is whole again — la la la! Thank you for singing it back to me, friend!",
  keepsake:{ id:"note", e:"🎵", name:"Song Note" },
  extra:"pattern", extraName:"Pattern Parade", extraEmoji:"🥁",
  words:{
    1:[{w:"hum",e:"🎶"},{w:"tap",e:"👆"},{w:"pop",e:"🎈"}],
    2:[{w:"sing",e:"🎤"},{w:"drum",e:"🥁"},{w:"bell",e:"🔔"},{w:"clap",e:"👏"}],
    3:[{w:"music",e:"🎼"},{w:"piano",e:"🎹"},{w:"guitar",e:"🎸"},{w:"trumpet",e:"🎺"}] },
  sentences:{
    1:["We hum a tune.","I tap my feet."],
    2:["Bella sings a sweet song.","The drum goes boom boom."],
    3:["The piano plays a gentle tune.","Music makes our hearts happy."] } },
{ id:"art", name:"The Art Bench", art:"🎨", emoji:"🎨",
  line:"Crayons, paper, and a rainbow waiting to happen.",
  friend:{ name:"Coco", face:"🐱" },
  hello:"Meow hello! I'm Coco. I paint the sky pink just because I can.",
  help:"My color labels all fell off the crayons! Play a game with me and help me read them back.",
  thanks:"Every crayon has its name again! You color my world happy. Thank you, artist friend!",
  keepsake:{ id:"crayon", e:"🖍️", name:"Rainbow Crayon" },
  extra:"poster", extraName:"Make a Poster", extraEmoji:"🖼️",
  words:{
    1:[{w:"red",e:"🔴"},{w:"pen",e:"🖊️"},{w:"dot",e:"⚪"},{w:"art",e:"🎨"}],
    2:[{w:"blue",e:"🔵"},{w:"pink",e:"🩷"},{w:"draw",e:"✏️"},{w:"star",e:"⭐"}],
    3:[{w:"green",e:"🟢"},{w:"purple",e:"🟣"},{w:"yellow",e:"🟡"},{w:"crayon",e:"🖍️"}] },
  sentences:{
    1:["I draw a dot.","The pen is red."],
    2:["I paint a blue star.","Coco draws pink flowers."],
    3:["The crayon is purple and green.","Yellow sunshine fills my picture."] } },
{ id:"storycircle", name:"The Story Circle", art:"🔥", emoji:"⭐",
  line:"A ring of soft logs under the stars, where all the friends gather.",
  friend:{ name:"All Your Friends", face:"🌈" },
  hello:"You made it to the Story Circle! Every friend gathers here when the stars come out.",
  help:"The bedtime story needs its words! Play a game with us and help the story get ready.",
  thanks:"The story is ready, the stars are out, and every friend is smiling. This is the best part of the day.",
  keepsake:{ id:"star", e:"⭐", name:"Story Star" },
  words:{
    1:[{w:"bed",e:"🛏️"},{w:"nap",e:"😴"},{w:"dim",e:"🌙"}],
    2:[{w:"moon",e:"🌕"},{w:"star",e:"⭐"},{w:"night",e:"🌃"},{w:"dream",e:"💭"}],
    3:[{w:"story",e:"📖"},{w:"blanket",e:"🛌"},{w:"whisper",e:"🤫"},{w:"listen",e:"👂"}] },
  sentences:{
    1:["Time for a nap.","I love my bed."],
    2:["The moon is round.","Stars shine at night."],
    3:["We whisper a bedtime story.","A blanket keeps us cozy and warm."] } }
];

/* ================= EXTRA GAME DATA ================= */
const SORT_ITEMS = [
  { e:"🍎", n:"apple",      c:"fruit" },
  { e:"🍌", n:"banana",     c:"fruit" },
  { e:"🍇", n:"grapes",     c:"fruit" },
  { e:"🍓", n:"strawberry", c:"fruit" },
  { e:"🍊", n:"orange",     c:"fruit" },
  { e:"🥕", n:"carrot",     c:"other" },
  { e:"🍞", n:"bread",      c:"other" },
  { e:"🧀", n:"cheese",     c:"other" },
  { e:"🥦", n:"broccoli",   c:"other" },
  { e:"🥒", n:"cucumber",   c:"other" }
];
const PATTERN_POOL = ["🎵","🥁","🔔","🎤","🎶","👏"];
const DIFF_SETS = [
  ["🌻","🐝","🌳","🍎","🦋","☀️"],
  ["🐠","🐙","⭐","🐚","🌊","🦀"],
  ["☀️","☁️","🌈","🐦","🎈","🌙"],
  ["🍎","🍌","🍇","🍓","🍊","🍉"]
];
const DIFF_SPARES = ["🍄","🎃","🦉","🍩","🚀","🐳"];
const POSTER_BGS = ["#ffe9f3","#e3f6ff","#fff6d8","#e6ffd9","#f0e6ff","#ffe3c2"];
const POSTER_STICKERS = ["🌻","🦋","☀️","🌈","⭐","💗","🐝","🍎","🎵","🦉","🌙","🐢"];
const POSTER_SPOTS = [
  {x:18,y:22},{x:50,y:16},{x:80,y:24},{x:30,y:52},{x:64,y:48},{x:16,y:78},
  {x:48,y:80},{x:82,y:76},{x:50,y:50},{x:24,y:36},{x:74,y:62},{x:38,y:66}
];

const SHAPES = [
  { id:"word",     e:"🔤", name:"Word Builder",     desc:"Build and find words" },
  { id:"sentence", e:"💬", name:"Sentence Builder", desc:"Put the words in order" },
  { id:"memory",   e:"🃏", name:"Memory Match",     desc:"Find the matching pairs" }
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
      g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  },
  tap()     { this.tone(660, 0, .1, "sine", .07); },
  good()    { this.tone(523.25, 0, .16, "triangle"); this.tone(783.99, .1, .24, "triangle"); },
  cheer()   { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, i * .12, .28, "triangle")); },
  pop()     { this.tone(880, 0, .09, "square", .05); },
  /* HOUSE LIFECYCLE FIX: sound must never keep playing after leaving the game */
  stopAll() {
    if (this.ctx) { try { this.ctx.close(); } catch (e) {} this.ctx = null; }
  }
};
document.addEventListener("visibilitychange", () => { if (document.hidden) SoundFX.stopAll(); });
window.addEventListener("pagehide", () => SoundFX.stopAll());
window.addEventListener("beforeunload", () => SoundFX.stopAll());

/* ================= SAVE ================= */
const SAVE_KEY = "readingWorldSave";
let save = {
  sound: true, handshakeDone: false,
  helped: {},        /* sceneId -> true */
  keepsakes: [],     /* keepsake ids, in earn order */
  posters: [],       /* {bg, stickers:[{e,x,y}]} */
  visited: {},       /* sceneId -> true */
  scenePlays: {},    /* sceneId -> count */
  sceneStars: {},    /* sceneId -> last star level used there */
  plays: { word:0, sentence:0, memory:0, extra:0 },
  stars: { word:1, sentence:1, memory:1, sorting:1, pattern:1, spotdiff:1 }
};
try {
  const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
  if (raw && typeof raw === "object") {
    save = Object.assign(save, raw);
    save.plays = Object.assign({ word:0, sentence:0, memory:0, extra:0 }, raw.plays || {});
    save.stars = Object.assign({ word:1, sentence:1, memory:1, sorting:1, pattern:1, spotdiff:1 }, raw.stars || {});
  }
} catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

/* ================= RUNTIME ================= */
const $ = id => document.getElementById(id);
let curScene = null;   /* scene object being visited */
let act = null;        /* current activity state (also read by the self-test) */
let hs = null;         /* handshake state */
let lastCeleScene = null;

function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $("screen-" + name).classList.add("active");
  window.scrollTo(0, 0);
}
function shuffle(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function sceneById(id) { return SCENES.find(s => s.id === id); }
function helpedCount() { return SCENES.filter(s => save.helped[s.id]).length; }
function confettiInto(zone, n) {
  const colors = ["#ffd740", "#38c172", "#ff8fb3", "#5aa9d6", "#f5b921"];
  zone.innerHTML = "";
  for (let i = 0; i < (n || 40); i++) {
    const b = document.createElement("div");
    b.className = "confetti-bit";
    b.style.left = Math.random() * 96 + "%";
    b.style.background = colors[i % colors.length];
    b.style.animationDelay = (Math.random() * .5) + "s";
    if (i % 3 === 0) b.style.borderRadius = "50%";
    zone.appendChild(b);
  }
}

/* ================= HANDSHAKE (entry ritual) ================= */
function startHandshake() {
  const seq = shuffle(HS_ACTIONS).slice(0, 3).map(a => a.id);
  hs = { seq: seq, phase: "watch", step: 0, wrongs: 0 };
  showScreen("handshake");
  renderHandshake();
  demoHandshake();
}
function renderHandshake() {
  const stage = $("hsStage");
  stage.innerHTML = "";
  HS_ACTIONS.forEach(a => {
    const b = document.createElement("button");
    b.className = "hs-btn"; b.dataset.act = a.id;
    b.innerHTML = `<span class="hs-emoji">${a.e}</span><span class="hs-name">${a.n}</span>`;
    b.onclick = () => hsTap(a.id, b);
    stage.appendChild(b);
  });
  const dots = $("hsDots");
  dots.innerHTML = "";
  hs.seq.forEach(() => {
    const d = document.createElement("div");
    d.className = "hs-dot"; d.textContent = "☆";
    dots.appendChild(d);
  });
  $("btnHsEnter").hidden = true;
}
function demoHandshake() {
  if (!hs) return;
  hs.phase = "watch"; hs.step = 0;
  $("hsMsg").textContent = "Watch Lottie's moves…";
  document.querySelectorAll(".hs-btn").forEach(b => b.classList.remove("glow", "good"));
  document.querySelectorAll(".hs-dot").forEach(d => { d.classList.remove("done"); d.textContent = "☆"; });
  hs.seq.forEach((id, i) => {
    setTimeout(() => {
      document.querySelectorAll(".hs-btn").forEach(b => b.classList.toggle("glow", b.dataset.act === id));
      SoundFX.pop();
    }, 500 + i * 750);
  });
  setTimeout(() => {
    document.querySelectorAll(".hs-btn").forEach(b => b.classList.remove("glow"));
    hs.phase = "input";
    $("hsMsg").textContent = "Your turn! Copy Lottie's moves, one at a time.";
  }, 500 + hs.seq.length * 750 + 350);
}
function hsTap(id, btn) {
  if (!hs || hs.phase !== "input") return;
  if (id === hs.seq[hs.step]) {
    btn.classList.add("good");
    SoundFX.good();
    const dot = document.querySelectorAll(".hs-dot")[hs.step];
    if (dot) { dot.classList.add("done"); dot.textContent = "★"; }
    hs.step++;
    if (hs.step >= hs.seq.length) {
      hs.phase = "done";
      $("hsMsg").textContent = "You did it! That is our Friendship Handshake! 🎉";
      $("hsSpeech").innerHTML = `<b>Lottie:</b> “Perfect! Wave, hug, and a happy heart — you are one of us now. Come in, come in!”`;
      SoundFX.cheer();
      const firstTime = !save.handshakeDone;
      save.handshakeDone = true; persist();
      $("btnHsEnter").hidden = false;
      if (firstTime) markHelped(sceneById("clubhouse"), true);
    } else {
      $("hsMsg").textContent = "Yes! What comes next?";
    }
  } else {
    hs.wrongs++;
    btn.classList.add("wiggle");
    setTimeout(() => btn.classList.remove("wiggle"), 380);
    SoundFX.tap();
    if (hs.wrongs >= 2) {
      $("hsMsg").textContent = "That's okay! Watch Lottie one more time — there is no hurry.";
      hs.step = 0; hs.wrongs = 0;
      document.querySelectorAll(".hs-dot").forEach(d => { d.classList.remove("done"); d.textContent = "☆"; });
      document.querySelectorAll(".hs-btn").forEach(b => b.classList.remove("good"));
      demoHandshake();
    } else {
      $("hsMsg").textContent = "Oops — try another one. You can do it!";
    }
  }
}

/* ================= MAP ================= */
function renderMap() {
  $("mapProgress").textContent = `Friends helped: ${helpedCount()} of ${SCENES.length}` +
    (helpedCount() === SCENES.length ? " — every friend is smiling! 💛" : " — tap a place to visit a friend!");
  const grid = $("mapGrid");
  grid.innerHTML = "";
  SCENES.forEach(s => {
    const helped = !!save.helped[s.id];
    const b = document.createElement("button");
    b.className = "map-card" + (helped ? " helped" : "");
    b.dataset.scene = s.id;
    b.innerHTML = `<span class="mc-art">${s.art}</span><b>${s.name}</b>` +
      `<small>${s.friend.face} ${s.friend.name}</small>` +
      `<span class="mc-heart">${helped ? "💗 Helped!" : "☆ Say hello"}</span>`;
    b.onclick = () => { SoundFX.tap(); openScene(s.id); };
    grid.appendChild(b);
  });
  showScreen("map");
}

/* ================= SCENE ================= */
function openScene(id) {
  curScene = sceneById(id);
  if (!save.visited[id]) { save.visited[id] = true; persist(); }
  act = null;
  renderScene();
  showScreen("scene");
}
function starStr(n) { return "⭐".repeat(n); }
function renderScene() {
  const s = curScene, helped = !!save.helped[s.id];
  $("sceneArt").textContent = s.art;
  $("sceneName").textContent = s.name;
  $("sceneLine").textContent = s.line;
  $("sceneSpeech").innerHTML = `<p>${s.friend.face} <b>${s.friend.name}:</b> “${helped ? s.thanks : s.hello + " " + s.help}”</p>` +
    (helped ? `<p style="margin-top:8px;">💗 You helped ${s.friend.name}. Play again any time — friends love visitors!</p>`
            : `<p style="margin-top:8px;">💛 Play any game here to help ${s.friend.name}!</p>`);
  const box = $("sceneActs");
  box.innerHTML = "";
  SHAPES.forEach(sh => {
    const b = document.createElement("button");
    b.className = "act-btn"; b.dataset.shape = sh.id;
    b.innerHTML = `<span class="ab-emoji">${sh.e}</span><span><b>${sh.name}</b><small>${sh.desc}</small></span>` +
      `<span class="ab-stars">${starStr(save.stars[sh.id])}</span>`;
    b.onclick = () => startActivity(sh.id);
    box.appendChild(b);
  });
  if (s.extra) {
    const b = document.createElement("button");
    b.className = "act-btn"; b.dataset.extra = s.extra;
    b.innerHTML = `<span class="ab-emoji">${s.extraEmoji}</span><span><b>${s.extraName}</b><small>A special game with ${s.friend.name}</small></span>` +
      ((s.extra === "poster" || s.extra === "handshake") ? "" : `<span class="ab-stars">${starStr(save.stars[s.extra] || 1)}</span>`);
    b.onclick = () => startActivity(s.extra);
    box.appendChild(b);
  }
  const idx = SCENES.indexOf(s);
  $("btnWalkPrev").textContent = "‹ " + SCENES[(idx + SCENES.length - 1) % SCENES.length].name;
  $("btnWalkNext").textContent = SCENES[(idx + 1) % SCENES.length].name + " ›";
}

/* ================= ACTIVITIES ================= */
const ACT_TITLES = {
  word:"🔤 Word Builder", sentence:"💬 Sentence Builder", memory:"🃏 Memory Match",
  handshake:"🤝 Friendship Handshake", spotdiff:"🔍 Spot the Difference",
  sorting:"🧺 Sorting Baskets", pattern:"🥁 Pattern Parade", poster:"🖼️ Make a Poster"
};
function startActivity(kind) {
  if (kind === "handshake") { startHandshake(); return; }
  const s = curScene;
  const level = (kind === "poster" || kind === "handshake") ? 1 : (save.stars[kind] || 1);
  act = { kind: kind, sceneId: s.id, level: level, done: false };
  $("actTitle").textContent = ACT_TITLES[kind];
  $("actFriend").textContent = `Playing with ${s.friend.name} ${s.friend.face} at ${s.name}`;
  /* star row: on every leveled activity; the child can change it mid-activity */
  $("starRow").hidden = (kind === "poster" || kind === "handshake");
  document.querySelectorAll(".star-btn").forEach(b =>
    b.classList.toggle("on", +b.dataset.stars === level));
  showScreen("activity");
  if (kind === "word") buildWord();
  else if (kind === "sentence") buildSentence();
  else if (kind === "memory") buildMemory();
  else if (kind === "spotdiff") buildSpotDiff();
  else if (kind === "sorting") buildSorting();
  else if (kind === "pattern") buildPattern();
  else if (kind === "poster") buildPoster();
}
function setStars(n) {
  if (!act || act.kind === "poster" || act.kind === "handshake") return;
  save.stars[act.kind] = n;
  save.sceneStars[act.sceneId] = n;
  persist();
  document.querySelectorAll(".star-btn").forEach(b =>
    b.classList.toggle("on", +b.dataset.stars === n));
  act.level = n;
  SoundFX.tap();
  if (act.kind === "word") buildWord("Okay! New words, coming right up!");
  else if (act.kind === "sentence") buildSentence("Okay! A new sentence to build!");
  else if (act.kind === "memory") buildMemory("Okay! A fresh new game!");
  else if (act.kind === "spotdiff") buildSpotDiff("Okay! A new picture to peek at!");
  else if (act.kind === "sorting") buildSorting("Okay! Fresh things to sort!");
  else if (act.kind === "pattern") buildPattern("Okay! A new parade pattern!");
}
function actMsg(t) { const m = $("actMsg"); if (m) m.textContent = t; }
function actShell(html) { $("actBody").innerHTML = html + `<p class="act-msg" id="actMsg"></p>`; }

/* ---------- WORD BUILDER ---------- */
function buildWord(note) {
  const s = curScene, lvl = act.level;
  const entry = pick(s.words[lvl]);
  act.word = entry.w; act.emoji = entry.e; act.step = 0; act.done = false;
  if (lvl === 1) {
    /* Recognize: picture + 3 whole words */
    const others = shuffle(s.words[1].concat(s.words[2]).filter(x => x.w !== entry.w)).slice(0, 2);
    const opts = shuffle([entry].concat(others));
    act.mode = "recognize"; act.choices = opts.map(o => o.w);
    actShell(`<div class="act-pic">${entry.e}</div>
      <p class="act-prompt">Which word is this?</p>
      <div class="choices" id="wordChoices"></div>`);
    const box = $("wordChoices");
    opts.forEach(o => {
      const b = document.createElement("button");
      b.className = "choice-btn"; b.dataset.word = o.w; b.textContent = o.w;
      b.onclick = () => {
        if (act.done) return;
        if (o.w === act.word) {
          b.classList.add("right"); act.done = true; SoundFX.good();
          actMsg(`Yes! ${entry.e} That word is “${act.word}.” Hooray!`);
          setTimeout(finishActivity, 900);
        } else {
          b.classList.add("wiggle"); SoundFX.tap();
          actMsg(`That's a good word too! Look at the picture ${entry.e} and try again.`);
          setTimeout(() => b.classList.remove("wiggle"), 380);
        }
      };
      box.appendChild(b);
    });
  } else if (lvl === 2) {
    /* Fill in the missing middle letters */
    const w = entry.w;
    const missing = [];
    for (let i = 1; i < w.length - 1; i++) missing.push(i);
    act.mode = "fill"; act.missing = missing; act.need = missing.map(i => w[i]);
    const extra = shuffle("abcdefghijklmnopqrstuvwxyz".split("").filter(c => !w.includes(c))).slice(0, 2);
    act.tiles = shuffle(act.need.concat(extra)).map(c => ({ letter: c, used: false }));
    actShell(`<div class="act-pic">${entry.e}</div>
      <p class="act-prompt">Build the word! Tap the missing letters.</p>
      <div class="word-slots" id="wordSlots"></div>
      <div class="tile-row" id="tileRow"></div>`);
    renderWordSlots();
    renderLetterTiles();
  } else {
    /* Scramble: arrange every letter */
    const w = entry.w;
    let letters = shuffle(w.split(""));
    if (letters.join("") === w) letters = shuffle(w.split(""));
    act.mode = "scramble"; act.need = w.split(""); act.tiles = letters.map(c => ({ letter: c, used: false }));
    actShell(`<div class="act-pic">${entry.e}</div>
      <p class="act-prompt">Build the word! Tap the letters in order.</p>
      <div class="word-slots" id="wordSlots"></div>
      <div class="tile-row" id="tileRow"></div>`);
    renderWordSlots();
    renderLetterTiles();
  }
  if (note) actMsg(note);
}
function renderWordSlots() {
  const w = act.word, box = $("wordSlots");
  if (!box) return;
  box.innerHTML = "";
  w.split("").forEach((c, i) => {
    const d = document.createElement("div");
    d.className = "word-slot";
    if (act.mode === "fill") {
      if (act.missing.includes(i)) {
        const pos = act.missing.indexOf(i);
        if (pos < act.step) { d.className += " filled"; d.textContent = c; }
        else d.textContent = "·";
      } else { d.className += " given"; d.textContent = c; }
    } else {
      if (i < act.step) { d.className += " filled"; d.textContent = c; }
      else d.textContent = "·";
    }
    box.appendChild(d);
  });
}
function renderLetterTiles() {
  const row = $("tileRow");
  if (!row) return;
  row.innerHTML = "";
  act.tiles.forEach((t, idx) => {
    const letter = (typeof t === "string") ? t : t.letter;
    const used = (typeof t === "string") ? false : t.used;
    const b = document.createElement("button");
    b.className = "letter-tile" + (used ? " used" : "");
    b.dataset.letter = letter; b.dataset.idx = idx; b.textContent = letter;
    b.onclick = () => {
      if (act.done || used) return;
      if (letter === act.need[act.step]) {
        if (typeof act.tiles[idx] === "object") act.tiles[idx].used = true;
        act.step++; SoundFX.pop();
        renderWordSlots(); renderLetterTiles();
        if (act.step >= act.need.length) {
          act.done = true; SoundFX.good();
          actMsg(`You built it! ${act.emoji} “${act.word}” — great reading!`);
          setTimeout(finishActivity, 1000);
        } else {
          actMsg("Yes! Keep going…");
        }
      } else {
        b.classList.add("wiggle"); SoundFX.tap();
        actMsg(`Hmm, “${letter}” comes later. Look at the empty box and try another letter!`);
        setTimeout(() => b.classList.remove("wiggle"), 380);
      }
    };
    row.appendChild(b);
  });
}

/* ---------- SENTENCE BUILDER ---------- */
function buildSentence(note) {
  const s = curScene, lvl = act.level;
  const text = pick(s.sentences[lvl]);
  const words = text.replace(/\.$/, "").split(" ");
  words[words.length - 1] = words[words.length - 1] + ".";
  act.words = words; act.next = 0; act.done = false;
  act.tileList = shuffle(words.map((w, i) => ({ w: w, key: i, used: false })));
  /* if the shuffle accidentally spells the sentence, shuffle again */
  if (act.tileList.map(t => t.w).join(" ") === words.join(" ")) act.tileList.reverse();
  actShell(`<p class="act-prompt">Tap the words in order to build the sentence!</p>
    <div class="sentence-line" id="sentLine"></div>
    <div class="tile-row" id="tileRow"></div>`);
  renderSentence();
  if (note) actMsg(note);
}
function renderSentence() {
  const line = $("sentLine"), row = $("tileRow");
  if (!line || !row) return;
  line.innerHTML = "";
  act.words.forEach((w, i) => {
    const d = document.createElement("div");
    if (i < act.next) { d.className = "sent-word"; d.textContent = w; }
    else { d.className = "sent-word empty"; d.textContent = "· · ·"; }
    line.appendChild(d);
  });
  row.innerHTML = "";
  act.tileList.forEach((t, idx) => {
    const b = document.createElement("button");
    b.className = "word-tile" + (t.used ? " used" : "");
    b.dataset.w = t.w; b.dataset.idx = idx; b.textContent = t.w;
    b.onclick = () => {
      if (act.done || t.used) return;
      if (t.w === act.words[act.next]) {
        t.used = true; act.next++; SoundFX.pop();
        renderSentence();
        if (act.next >= act.words.length) {
          act.done = true; SoundFX.good();
          actMsg(`You built the sentence: “${act.words.join(" ")}” Beautiful reading!`);
          setTimeout(finishActivity, 1100);
        }
      } else {
        b.classList.add("wiggle"); SoundFX.tap();
        actMsg(act.next === 0
          ? "A sentence starts with a special word. Look for the one with the capital letter!"
          : `Good try! The sentence is waiting for “${act.words[act.next]}” next.`);
        setTimeout(() => b.classList.remove("wiggle"), 380);
      }
    };
    row.appendChild(b);
  });
}

/* ---------- MEMORY MATCH ---------- */
function buildMemory(note) {
  const s = curScene, lvl = act.level;
  const pairCount = lvl === 1 ? 3 : lvl === 2 ? 4 : 6;
  let pool = [];
  if (lvl === 1) pool = s.words[1].slice();
  else if (lvl === 2) pool = s.words[1].concat(s.words[2]);
  else pool = s.words[1].concat(s.words[2], s.words[3]);
  const chosen = shuffle(pool).slice(0, pairCount);
  act.pairs = chosen.map(c => c.w); act.found = 0; act.done = false;
  act.first = null; act.lock = false;
  const deck = shuffle(chosen.concat(chosen).map(c => ({ w: c.w, e: c.e })));
  act.deck = deck;
  actShell(`<p class="act-prompt">Find the matching pairs!</p>
    <p class="friend-line" id="memCount">Pairs found: 0 of ${pairCount}</p>
    <div class="mem-grid${pairCount >= 6 ? " big" : ""}" id="memGrid"></div>`);
  const grid = $("memGrid");
  deck.forEach((c, idx) => {
    const b = document.createElement("button");
    b.className = "mem-card"; b.dataset.pair = c.w; b.dataset.idx = idx;
    b.innerHTML = `<span class="mc-emoji">🌿</span>`;
    b.onclick = () => memFlip(b, c);
    grid.appendChild(b);
  });
  if (note) actMsg(note);
}
function memFlip(btn, card) {
  if (act.done || act.lock || btn.classList.contains("face") || btn.classList.contains("matched")) return;
  btn.classList.add("face");
  btn.innerHTML = `<span class="mc-emoji">${card.e}</span><span>${card.w}</span>`;
  SoundFX.tap();
  if (!act.first) { act.first = { btn: btn, card: card }; return; }
  const f = act.first; act.first = null;
  if (f.card.w === card.w) {
    f.btn.classList.add("matched"); btn.classList.add("matched");
    act.found++; SoundFX.good();
    $("memCount").textContent = `Pairs found: ${act.found} of ${act.pairs.length}`;
    if (act.found >= act.pairs.length) {
      act.done = true;
      actMsg("Every pair found! What a super memory! 🎉");
      setTimeout(finishActivity, 1000);
    } else actMsg("A match! Hooray!");
  } else {
    act.lock = true;
    actMsg("Those two are different. Watch them flip back and try again!");
    setTimeout(() => {
      [f.btn, btn].forEach(b => { b.classList.remove("face"); b.innerHTML = `<span class="mc-emoji">🌿</span>`; });
      act.lock = false;
    }, 950);
  }
}

/* ---------- finishing an activity ---------- */
function finishActivity() {
  if (!act) return;
  const s = sceneById(act.sceneId);
  const isExtra = !SHAPES.some(sh => sh.id === act.kind);
  if (isExtra) save.plays.extra++; else save.plays[act.kind]++;
  save.scenePlays[s.id] = (save.scenePlays[s.id] || 0) + 1;
  save.sceneStars[s.id] = act.level;
  persist();
  const kind = act.kind;
  act = null;
  if (!save.helped[s.id] && kind !== "handshake") {
    markHelped(s, false);
  } else {
    curScene = s;
    renderScene();
    showScreen("scene");
  }
}
function markHelped(s, silent) {
  if (save.helped[s.id]) { if (!silent) { curScene = s; renderScene(); showScreen("scene"); } return; }
  save.helped[s.id] = true;
  if (!save.keepsakes.includes(s.keepsake.id)) save.keepsakes.push(s.keepsake.id);
  persist();
  lastCeleScene = s;
  $("celeFace").textContent = s.friend.face;
  $("celeText").innerHTML = `<b>${s.friend.name}:</b> “${s.thanks}”`;
  $("celeKeepsake").innerHTML = `<span class="ks-emoji">${s.keepsake.e}</span>` +
    `<b>${s.keepsake.name}</b><small>A keepsake from ${s.name} — safe in your Scrapbook!</small>`;
  confettiInto($("confettiZone"), 46);
  showScreen("celebrate");
  SoundFX.cheer();
}

/* ---------- EXTRA: SPOT THE DIFFERENCE (Pip, Library Tree) ---------- */
function buildSpotDiff(note) {
  const lvl = act.level;
  const diffCount = lvl === 1 ? 2 : lvl === 2 ? 3 : 4;
  const base = pick(DIFF_SETS).slice();
  const idxs = shuffle([0, 1, 2, 3, 4, 5]).slice(0, diffCount);
  const changed = base.slice();
  const spares = shuffle(DIFF_SPARES.filter(e => !base.includes(e)));
  idxs.forEach((pos, i) => { changed[pos] = spares[i % spares.length]; });
  act.base = base; act.changed = changed; act.diffs = idxs.slice();
  act.foundDiffs = []; act.misses = 0; act.done = false;
  actShell(`<p class="act-prompt">The two pictures are almost the same! Tap what is different in Picture 2.</p>
    <p class="friend-line" id="diffCount">Differences found: 0 of ${diffCount}</p>
    <div class="diff-panels">
      <div class="diff-panel"><h4>Picture 1</h4><div class="diff-grid" id="diffA"></div></div>
      <div class="diff-panel"><h4>Picture 2 — tap the differences!</h4><div class="diff-grid" id="diffB"></div></div>
    </div>`);
  const gA = $("diffA"), gB = $("diffB");
  base.forEach(e => {
    const d = document.createElement("div");
    d.className = "diff-cell still"; d.textContent = e;
    gA.appendChild(d);
  });
  changed.forEach((e, i) => {
    const b = document.createElement("button");
    b.className = "diff-cell"; b.dataset.idx = i; b.textContent = e;
    if (act.diffs.includes(i)) b.dataset.diff = "1";
    b.onclick = () => {
      if (act.done || b.classList.contains("found")) return;
      if (act.diffs.includes(i)) {
        b.classList.add("found"); act.foundDiffs.push(i); SoundFX.good();
        $("diffCount").textContent = `Differences found: ${act.foundDiffs.length} of ${act.diffs.length}`;
        if (act.foundDiffs.length >= act.diffs.length) {
          act.done = true;
          actMsg("You found every difference! Pip is doing a happy flap! 🐦");
          setTimeout(finishActivity, 1100);
        } else actMsg("You spotted one! Keep looking…");
      } else {
        b.classList.add("wiggle"); SoundFX.tap(); act.misses++;
        if (act.misses >= 3) {
          const rest = act.diffs.filter(d => !act.foundDiffs.includes(d));
          actMsg(`That one is the same in both pictures. Peek at the ${rest.length === 1 ? "last glowing one" : "glowing ones"}!`);
          rest.forEach(d => {
            const cell = gB.querySelector(`[data-idx="${d}"]`);
            if (cell) { cell.style.borderColor = "#f5b921"; setTimeout(() => { cell.style.borderColor = ""; }, 1600); }
          });
          act.misses = 0;
        } else actMsg("That one is the same in both pictures. Keep looking!");
        setTimeout(() => b.classList.remove("wiggle"), 380);
      }
    };
    gB.appendChild(b);
  });
  if (note) actMsg(note);
}

/* ---------- EXTRA: SORTING BASKETS (Momo, Market Stall) ---------- */
function buildSorting(note) {
  const lvl = act.level;
  const count = lvl === 1 ? 6 : lvl === 2 ? 8 : 10;
  const fruits = shuffle(SORT_ITEMS.filter(i => i.c === "fruit"));
  const others = shuffle(SORT_ITEMS.filter(i => i.c === "other"));
  const items = shuffle(fruits.slice(0, Math.ceil(count / 2)).concat(others.slice(0, Math.floor(count / 2))));
  act.items = items; act.placed = 0; act.picked = null; act.done = false;
  actShell(`<p class="act-prompt">Tap a food, then tap the basket where it belongs!</p>
    <div class="sort-items" id="sortItems"></div>
    <div class="basket-row">
      <button class="basket" data-basket="fruit"><b>🍓 Fruit Basket</b><span class="basket-items" id="basketFruit"></span></button>
      <button class="basket" data-basket="other"><b>🥕 Other Foods Basket</b><span class="basket-items" id="basketOther"></span></button>
    </div>`);
  const box = $("sortItems");
  items.forEach((it, idx) => {
    const b = document.createElement("button");
    b.className = "sort-item"; b.dataset.idx = idx; b.dataset.cat = it.c;
    b.textContent = it.e; b.title = it.n;
    b.onclick = () => {
      if (act.done || b.classList.contains("placed")) return;
      document.querySelectorAll(".sort-item").forEach(x => x.classList.remove("picked"));
      b.classList.add("picked"); act.picked = idx; SoundFX.tap();
      actMsg(`You picked the ${it.n}. Which basket does it belong in?`);
    };
    box.appendChild(b);
  });
  document.querySelectorAll(".basket").forEach(bk => {
    bk.onclick = () => {
      if (act.done || act.picked === null) { if (!act.done) actMsg("Pick a food first, then tap its basket!"); return; }
      const it = act.items[act.picked];
      const btn = box.querySelector(`[data-idx="${act.picked}"]`);
      if (bk.dataset.basket === it.c) {
        btn.classList.remove("picked"); btn.classList.add("placed"); btn.style.visibility = "hidden";
        $(it.c === "fruit" ? "basketFruit" : "basketOther").textContent += it.e;
        act.picked = null; act.placed++; SoundFX.good();
        if (act.placed >= act.items.length) {
          act.done = true;
          actMsg("Every food is in its basket! Momo's stall is tidy and happy! 🐭");
          setTimeout(finishActivity, 1100);
        } else actMsg(`The ${it.n} is home! ${act.items.length - act.placed} to go.`);
      } else {
        btn.classList.add("wiggle"); SoundFX.tap();
        actMsg(`The ${it.n} lives in the other basket. That's okay — try there!`);
        setTimeout(() => btn.classList.remove("wiggle"), 380);
      }
    };
  });
  if (note) actMsg(note);
}

/* ---------- EXTRA: PATTERN PARADE (Bella, Music Corner) ---------- */
function buildPattern(note) {
  act.round = 0; act.done = false;
  actShell(`<p class="act-prompt">What comes next in the parade?</p>
    <p class="friend-line" id="patRound">Round 1 of 3</p>
    <div class="pattern-row" id="patRow"></div>
    <div class="choices" id="patChoices" style="grid-template-columns:1fr 1fr 1fr;"></div>`);
  nextPatternRound();
  if (note) actMsg(note);
}
function nextPatternRound() {
  const lvl = act.level;
  const syms = shuffle(PATTERN_POOL).slice(0, lvl === 3 ? 3 : 2);
  let seq;
  if (lvl === 1) seq = [syms[0], syms[1], syms[0], syms[1], syms[0]];
  else if (lvl === 2) seq = [syms[0], syms[0], syms[1], syms[1], syms[0]];
  else seq = [syms[0], syms[1], syms[2], syms[0], syms[1]];
  act.answer = lvl === 1 ? syms[1] : lvl === 2 ? syms[0] : syms[2];
  act.seq = seq;
  $("patRound").textContent = `Round ${act.round + 1} of 3`;
  const row = $("patRow");
  row.innerHTML = "";
  seq.forEach(e => {
    const d = document.createElement("div");
    d.className = "pattern-cell"; d.textContent = e;
    row.appendChild(d);
  });
  const q = document.createElement("div");
  q.className = "pattern-cell q"; q.textContent = "?";
  row.appendChild(q);
  const box = $("patChoices");
  box.innerHTML = "";
  const opts = shuffle([act.answer].concat(shuffle(PATTERN_POOL.filter(e => e !== act.answer)).slice(0, 2)));
  act.patOpts = opts;
  opts.forEach(e => {
    const b = document.createElement("button");
    b.className = "choice-btn"; b.dataset.v = e; b.textContent = e; b.style.fontSize = "2rem";
    b.onclick = () => {
      if (act.done) return;
      if (e === act.answer) {
        b.classList.add("right"); SoundFX.good();
        act.round++;
        if (act.round >= 3) {
          act.done = true;
          actMsg("The parade is perfect — march, march, hooray! 🥁");
          setTimeout(finishActivity, 1100);
        } else {
          actMsg("Yes! Here comes the next pattern…");
          setTimeout(nextPatternRound, 900);
        }
      } else {
        b.classList.add("wiggle"); SoundFX.tap();
        actMsg("Listen to the pattern with your eyes: it repeats! Try again.");
        setTimeout(() => b.classList.remove("wiggle"), 380);
      }
    };
    box.appendChild(b);
  });
}

/* ---------- EXTRA: MAKE A POSTER (Coco, Art Bench) ---------- */
function buildPoster() {
  act.poster = { bg: POSTER_BGS[0], stickers: [] };
  act.done = false;
  actShell(`<p class="act-prompt">Tap a color, then tap stickers to fill your poster!</p>
    <div class="poster-bgs" id="posterBgs"></div>
    <div class="poster-canvas" id="posterCanvas"></div>
    <div class="sticker-row" id="stickerRow"></div>
    <button class="big-btn" id="btnPosterUndo">↩️ Take the Last Sticker Off</button>
    <button class="big-btn primary" id="btnPosterSave">📖 Save My Poster in the Scrapbook</button>`);
  const bgs = $("posterBgs");
  POSTER_BGS.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "bg-swatch" + (i === 0 ? " on" : "");
    b.dataset.bg = c; b.style.background = c; b.setAttribute("aria-label", "poster color");
    b.onclick = () => {
      act.poster.bg = c; SoundFX.tap();
      document.querySelectorAll(".bg-swatch").forEach(x => x.classList.toggle("on", x.dataset.bg === c));
      renderPosterCanvas();
    };
    bgs.appendChild(b);
  });
  const row = $("stickerRow");
  POSTER_STICKERS.forEach(e => {
    const b = document.createElement("button");
    b.className = "sticker-btn"; b.dataset.sticker = e; b.textContent = e;
    b.onclick = () => {
      if (act.poster.stickers.length >= POSTER_SPOTS.length) {
        actMsg("Your poster is full and beautiful! Save it, or take one sticker off.");
        return;
      }
      const spot = POSTER_SPOTS[act.poster.stickers.length];
      act.poster.stickers.push({ e: e, x: spot.x, y: spot.y });
      SoundFX.pop();
      renderPosterCanvas();
      actMsg("Lovely! Add more stickers, or save your poster.");
    };
    row.appendChild(b);
  });
  $("btnPosterUndo").onclick = () => {
    act.poster.stickers.pop(); SoundFX.tap(); renderPosterCanvas();
  };
  $("btnPosterSave").onclick = () => {
    if (act.done) return;
    if (act.poster.stickers.length === 0) {
      actMsg("Add at least one sticker first — Coco believes in you! 🎨");
      return;
    }
    act.done = true;
    save.posters.push({ bg: act.poster.bg, stickers: act.poster.stickers.slice() });
    persist();
    SoundFX.cheer();
    actMsg("Saved in your Scrapbook forever! Coco is purring. 🐱");
    setTimeout(finishActivity, 1100);
  };
  renderPosterCanvas();
}
function renderPosterCanvas() {
  const c = $("posterCanvas");
  if (!c || !act || !act.poster) return;
  c.style.background = act.poster.bg;
  c.innerHTML = "";
  act.poster.stickers.forEach(st => {
    const sp = document.createElement("span");
    sp.className = "poster-sticker"; sp.textContent = st.e;
    sp.style.left = st.x + "%"; sp.style.top = st.y + "%";
    c.appendChild(sp);
  });
}

/* ================= SCRAPBOOK ================= */
function renderScrapbook() {
  $("sbFriendCount").textContent = `You have helped ${helpedCount()} of ${SCENES.length} friends!`;
  const fb = $("sbFriends");
  fb.innerHTML = "";
  SCENES.forEach(s => {
    const helped = !!save.helped[s.id];
    const d = document.createElement("div");
    d.className = "sb-friend" + (helped ? " helped" : "");
    d.innerHTML = `<span class="sf-face">${s.friend.face}</span>` +
      `<span><b>${s.friend.name}</b><small>${s.name}</small></span>` +
      `<span class="sf-heart">${helped ? "💗" : "☆"}</span>`;
    fb.appendChild(d);
  });
  const kb = $("sbKeepsakes");
  kb.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "sb-keepsakes";
  SCENES.forEach(s => {
    const earned = save.keepsakes.includes(s.keepsake.id);
    const d = document.createElement("div");
    d.className = "sb-keep" + (earned ? " earned" : "");
    d.innerHTML = `<span class="ks-emoji">${s.keepsake.e}</span><small>${earned ? s.keepsake.name : "A surprise from " + s.name}</small>`;
    grid.appendChild(d);
  });
  kb.appendChild(grid);
  const pb = $("sbPosters");
  pb.innerHTML = "";
  if (!save.posters.length) {
    pb.innerHTML = `<p class="sb-empty">No posters yet! Visit Coco at the Art Bench 🎨 and make one — it will live right here.</p>`;
  } else {
    save.posters.forEach(p => {
      const d = document.createElement("div");
      d.className = "sb-poster"; d.style.background = p.bg;
      p.stickers.forEach(st => {
        const sp = document.createElement("span");
        sp.className = "poster-sticker"; sp.textContent = st.e;
        sp.style.left = st.x + "%"; sp.style.top = st.y + "%"; sp.style.fontSize = "1.7rem";
        d.appendChild(sp);
      });
      pb.appendChild(d);
    });
  }
  showScreen("scrapbook");
}

/* ================= GROWN-UP GATE + PARENT VIEW ================= */
let gate = null;
function openGate() {
  const a = 3 + Math.floor(Math.random() * 7);       /* 3..9 */
  const b = 2 + Math.floor(Math.random() * 6);       /* 2..7 */
  const times = Math.random() < 0.4;
  gate = times ? { q: `${a} × ${b}`, ans: a * b } : { q: `${a} + ${b}`, ans: a + b };
  $("gateQ").textContent = gate.q + " = ?";
  $("gateMsg").textContent = "";
  const opts = shuffle([gate.ans, gate.ans + 2, gate.ans - 1].filter((v, i, arr) => v > 0 && arr.indexOf(v) === i));
  while (opts.length < 3) opts.push(gate.ans + opts.length + 3);
  const box = $("gateChoices");
  box.innerHTML = "";
  opts.forEach(n => {
    const btn = document.createElement("button");
    btn.className = "choice-btn"; btn.dataset.n = n; btn.textContent = n;
    btn.onclick = () => {
      if (n === gate.ans) { SoundFX.good(); renderParent(); }
      else { btn.classList.add("wiggle"); $("gateMsg").textContent = "Not quite — try again, grown-up!"; setTimeout(() => btn.classList.remove("wiggle"), 380); }
    };
    box.appendChild(btn);
  });
  showScreen("gate");
}
function renderParent() {
  const totalPlays = save.plays.word + save.plays.sentence + save.plays.memory + save.plays.extra;
  $("parentSummary").innerHTML = `<div class="parent-card">
    <b>Friends helped:</b> ${helpedCount()} of ${SCENES.length} &nbsp;•&nbsp;
    <b>Keepsakes:</b> ${save.keepsakes.length} &nbsp;•&nbsp;
    <b>Posters made:</b> ${save.posters.length}<br>
    <b>Games finished:</b> ${totalPlays} (Word Builder ${save.plays.word} • Sentence Builder ${save.plays.sentence} • Memory Match ${save.plays.memory} • Special games ${save.plays.extra})<br>
    <b>Star levels your child picks:</b> Words ${starStr(save.stars.word)} • Sentences ${starStr(save.stars.sentence)} • Memory ${starStr(save.stars.memory)}
    </div>`;
  const box = $("parentScenes");
  box.innerHTML = "";
  SCENES.forEach(s => {
    const d = document.createElement("div");
    d.className = "parent-row";
    d.innerHTML = `<span class="pr-art">${s.art}</span><span><b>${s.name}</b> — ${s.friend.name}` +
      `<small>${save.visited[s.id] ? "Visited" : "Not visited yet"} • ${save.scenePlays[s.id] || 0} game(s) finished here` +
      `${save.sceneStars[s.id] ? " • last played at " + starStr(save.sceneStars[s.id]) : ""}` +
      `${save.helped[s.id] ? " • 💗 helped" : ""}</small></span>`;
    box.appendChild(d);
  });
  showScreen("parent");
}

/* ================= INIT / WIRING ================= */
function refreshTitle() {
  $("titleProgress").textContent = helpedCount()
    ? `Friends helped: ${helpedCount()} of ${SCENES.length} • Keepsakes: ${save.keepsakes.length} • Posters: ${save.posters.length}`
    : "A brand-new adventure — your friends are waiting!";
  $("btnSoundTitle").textContent = save.sound ? "🔊 Sound: On" : "🔇 Sound: Off";
}
$("btnStart").onclick = () => {
  SoundFX.tap();
  if (save.handshakeDone) renderMap();
  else startHandshake();
};
$("btnHsWatch").onclick = () => demoHandshake();
$("btnHsEnter").onclick = () => { SoundFX.tap(); renderMap(); };
$("btnScrapbookTitle").onclick = () => renderScrapbook();
$("btnScrapbookMap").onclick = () => renderScrapbook();
$("btnGrownups").onclick = () => openGate();
$("btnSoundTitle").onclick = () => {
  save.sound = !save.sound; persist(); refreshTitle();
  if (save.sound) SoundFX.good();
};
$("btnSceneMap").onclick = () => renderMap();
$("btnActBack").onclick = () => { act = null; renderScene(); showScreen("scene"); };
$("btnWalkPrev").onclick = () => {
  const idx = SCENES.indexOf(curScene);
  SoundFX.tap(); openScene(SCENES[(idx + SCENES.length - 1) % SCENES.length].id);
};
$("btnWalkNext").onclick = () => {
  const idx = SCENES.indexOf(curScene);
  SoundFX.tap(); openScene(SCENES[(idx + 1) % SCENES.length].id);
};
$("btnCelePlay").onclick = () => { if (lastCeleScene) { curScene = lastCeleScene; renderScene(); showScreen("scene"); } };
$("btnCeleMap").onclick = () => renderMap();
$("btnCeleScrap").onclick = () => renderScrapbook();
document.querySelectorAll("[data-nav]").forEach(b => {
  b.onclick = () => {
    const t = b.dataset.nav;
    if (t === "title") { refreshTitle(); showScreen("title"); }
    else if (t === "map") renderMap();
    else showScreen(t);
  };
});
document.querySelectorAll(".star-btn").forEach(b => {
  b.onclick = () => setStars(+b.dataset.stars);
});
refreshTitle();
