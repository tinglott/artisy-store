/* The Great Globe Chase — an original Willow Tales detective game.
   Cast: Leo & Nia (junior detectives), Chief Lottie (owl), Maggie the Magpie.
   Mechanics (house blueprint): two clue tracks (destination + Maggie traits),
   a Detective Notebook proof gate, a gentle sun-clock that can never fail you,
   an anytime Fact Notebook, and passport ranks. All text and facts are our own. */
"use strict";

/* ================= DATA ================= */
const CASES = [
{
  id: "tiny-tower",
  num: 1,
  title: "The Tiny Tower",
  emoji: "🗼",
  taken: "a tiny golden Eiffel Tower",
  lastSeen: "Paris, France",
  brief: "Maggie the Magpie loves shiny things. Last night she swooped into Paris and took the Tiny Tower for her nest! Follow her feathers, detectives — and write down every clue about Maggie in your Detective Notebook.",
  stamp: "🗼 Tiny Tower Stamp",
  startFact: { city:"Paris", emoji:"🗼", country:"France", capital:"Paris",
    landmark:"The Eiffel Tower", fact:"The Eiffel Tower was finished in 1889. At night it twinkles with lights." },
  startTrait: "Shiny black-and-white feathers",
  startWitness: "A baker in Paris saw her: “She had shiny black-and-white feathers, and she flew east!”",
  catchText: "“You found me! I only wanted the Tiny Tower to shine in my nest. I am sorry — here it is, safe and sound. Your clues were just too clever!”",
  catchReturn: "The Tiny Tower is back where it belongs. Maggie waves a wing and promises to only collect pictures from now on.",
  decoys: ["A long purple tail", "Roars like a lion"],
  steps: [
    { from:"Paris", type:"🏛️ Landmark Clue", key:"Big Ben",
      clue:"A witness saw Maggie sitting on a giant clock tower called Big Ben, in a city with a king, red buses, and a river called the Thames.",
      choices:["London","Rome","Madrid"], answer:"London",
      hint1:"Think about the clock tower. Big Ben is very famous!",
      hint2:"Big Ben stands in London, the capital of the United Kingdom. Look — the key words are glowing!",
      travel:"✈️ Up, up in a little plane! Travel fact: above the clouds, the sun is almost always shining.",
      trait:"Loves anything shiny and sparkly",
      witness:"A guard at the tower says: “She kept whispering, ‘Ooh, SHINY!’”",
      fact:{ city:"London", emoji:"🕰️", country:"the United Kingdom", capital:"London",
        landmark:"Big Ben, the great clock tower", fact:"A river called the Thames flows through London, and big red buses drive over its bridges." } },
    { from:"London", type:"🗺️ Place Clue", key:"Colosseum",
      clue:"A postcard from Maggie! It shows a giant round stone arena called the Colosseum, where gladiators played games long ago. The postcard comes from Italy.",
      choices:["Athens","Rome","London"], answer:"Rome",
      hint1:"The giant arena is called the Colosseum.",
      hint2:"The Colosseum is in Rome, the capital of Italy.",
      travel:"🚆 The train rolls past green hills. Travel fact: Italy is shaped like a boot!",
      trait:"Carries a little red backpack",
      witness:"A pizza maker in Rome laughs: “She carried the Tiny Tower in a little red backpack!”",
      fact:{ city:"Rome", emoji:"🏛️", country:"Italy", capital:"Rome",
        landmark:"The Colosseum", fact:"The Colosseum is almost 2,000 years old. It could hold as many people as a big stadium today." } },
    { from:"Rome", type:"🏛️ Landmark Clue", key:"Acropolis",
      clue:"Maggie flew to Greece! She was seen on a high, rocky hill with a very old temple on top — the Acropolis.",
      choices:["Cairo","Paris","Athens"], answer:"Athens",
      hint1:"The Acropolis stands in the capital of Greece.",
      hint2:"The capital of Greece is Athens.",
      travel:"⛵ The ferry splashes across blue water. Travel fact: Greece has thousands of islands!",
      trait:"Always says sorry and gives things back",
      witness:"A sailor found her note: “Sorry! I will give it back. — M”",
      fact:{ city:"Athens", emoji:"🏺", country:"Greece", capital:"Athens",
        landmark:"The Acropolis", fact:"The Olympic Games began in Greece, long, long ago." } },
    { from:"Athens", type:"🌍 Continent Clue", key:"pyramids",
      clue:"The trail turns south, across the sea, to a NEW continent — Africa! Maggie is hiding by the giant stone pyramids.",
      choices:["Rome","Cairo","London"], answer:"Cairo",
      hint1:"The great pyramids stand in Egypt.",
      hint2:"Cairo is the capital of Egypt, the land of the pyramids.",
      travel:"✈️ Over the sea we fly! Travel fact: the Sahara in Africa is the biggest hot desert in the world.",
      trait:null, witness:null,
      fact:{ city:"Cairo", emoji:"🔺", country:"Egypt", capital:"Cairo",
        landmark:"The Great Pyramids of Giza", fact:"The Great Pyramid was the tallest building made by people for more than 3,800 years." } }
  ]
},
{
  id: "little-liberty",
  num: 2,
  title: "The Little Liberty",
  emoji: "🗽",
  taken: "a tiny Statue of Liberty",
  lastSeen: "New York City, United States",
  brief: "Maggie has struck again — this time in New York City! She took the Little Liberty. The trail crosses two whole continents, detectives. Keep your Notebook open: Maggie clues matter as much as map clues!",
  stamp: "🗽 Little Liberty Stamp",
  startFact: { city:"New York City", emoji:"🗽", country:"the United States", capital:"Washington, D.C. — New York is the biggest city, but it is not the capital!",
    landmark:"The Statue of Liberty", fact:"The Statue of Liberty was a gift from France, a country across the Atlantic Ocean." },
  startTrait: "Wears a tiny polka-dot scarf",
  startWitness: "A ferry captain saw her: “A magpie in a tiny polka-dot scarf, flying south!”",
  catchText: "“Caught fair and square! Here is the Little Liberty. I only wanted it to shine over my nest like a night-light. I am sorry!”",
  catchReturn: "The Little Liberty is home again. Maggie ties her polka-dot scarf a little tighter and waves goodbye.",
  decoys: ["Wears a pirate hat", "Can turn invisible"],
  steps: [
    { from:"New York City", type:"🏛️ Capital Clue", key:"White House",
      clue:"Maggie flew to the capital of the United States — the city where the President lives, in the White House.",
      choices:["Toronto","Washington, D.C.","Mexico City"], answer:"Washington, D.C.",
      hint1:"The White House is in the capital city of the United States.",
      hint2:"The capital of the United States is Washington, D.C.",
      travel:"🚆 All aboard the train! Travel fact: the United States has 50 states.",
      trait:"Hums a little song while she flies",
      witness:"A White House gardener heard her: “She hums while she flies — la la la!”",
      fact:{ city:"Washington, D.C.", emoji:"🏛️", country:"the United States", capital:"Washington, D.C. — it is the capital!",
        landmark:"The White House", fact:"Washington, D.C. is not a state. It is a special city called the District of Columbia." } },
    { from:"Washington, D.C.", type:"🚩 Flag Clue", key:"maple leaf",
      clue:"A flag clue! Red and white, with a red maple leaf in the middle. Maggie crossed the border into the country NORTH of the United States.",
      choices:["Washington, D.C.","Rio de Janeiro","Toronto"], answer:"Toronto",
      hint1:"The maple leaf flag belongs to Canada.",
      hint2:"Canada is north of the United States. Maggie is in Toronto, its biggest city.",
      travel:"✈️ Flying north! Travel fact: Canada has more lakes than any other country in the world.",
      trait:"Collects shiny buttons",
      witness:"A tower guide found her trade: “She left a shiny button and took a feather's worth of shine!”",
      fact:{ city:"Toronto", emoji:"🍁", country:"Canada", capital:"Ottawa — Toronto is the biggest city, but Ottawa is the capital!",
        landmark:"The CN Tower", fact:"Canada is the second-biggest country in the whole world." } },
    { from:"Toronto", type:"🗺️ Place Clue", key:"Spanish",
      clue:"Maggie flew far south, to a country where people speak Spanish and tacos come from. She is in its capital city, high in the mountains.",
      choices:["Mexico City","Toronto","New York City"], answer:"Mexico City",
      hint1:"Tacos come from Mexico.",
      hint2:"The capital of Mexico is Mexico City.",
      travel:"✈️ South we go! Travel fact: long ago, Mexico City was an Aztec city built on a lake.",
      trait:"A magpie with a very long tail",
      witness:"A market singer saw her clearly: “A magpie, black and white, with a very long tail!”",
      fact:{ city:"Mexico City", emoji:"🌮", country:"Mexico", capital:"Mexico City",
        landmark:"The Angel of Independence, a golden angel on a tall pillar", fact:"Mexico City stands where the Aztec city of Tenochtitlan once stood." } },
    { from:"Mexico City", type:"🗺️ Place Clue", key:"tango",
      clue:"New feathers — in Argentina! Maggie was dancing the tango in the capital city of this South American country.",
      choices:["Rio de Janeiro","Buenos Aires","Mexico City"], answer:"Buenos Aires",
      hint1:"The tango is a famous dance from Argentina.",
      hint2:"The capital of Argentina is Buenos Aires.",
      travel:"✈️ Over the equator we fly — below us, the seasons flip upside down!",
      trait:"Leaves a thank-you feather at every stop",
      witness:"A dancer found a feather on the floor: “She always leaves a thank-you feather!”",
      fact:{ city:"Buenos Aires", emoji:"💃", country:"Argentina", capital:"Buenos Aires",
        landmark:"The Obelisk, a tall white pillar in the middle of the city", fact:"The tallest mountain in South America, Aconcagua, is in Argentina." } },
    { from:"Buenos Aires", type:"🏛️ Landmark Clue", key:"Christ the Redeemer",
      clue:"Last stop! Maggie flew to Brazil, to a city with a giant statue on a mountain. The statue's arms are open wide — it is Christ the Redeemer.",
      choices:["Buenos Aires","Rio de Janeiro","Toronto"], answer:"Rio de Janeiro",
      hint1:"Christ the Redeemer watches over a famous beach city in Brazil.",
      hint2:"That city is Rio de Janeiro.",
      travel:"✈️ Almost there! Travel fact: in Brazil, people speak Portuguese.",
      trait:null, witness:null,
      fact:{ city:"Rio de Janeiro", emoji:"🏖️", country:"Brazil", capital:"Brasília — Rio is the famous beach city, but Brasília is the capital!",
        landmark:"Christ the Redeemer", fact:"Brazil is the biggest country in South America." } }
  ]
},
{
  id: "great-wall-puzzle",
  num: 3,
  title: "The Great Wall Puzzle",
  emoji: "🐉",
  taken: "a tiny jade dragon from the Great Wall",
  lastSeen: "Beijing, China",
  brief: "The trickiest case yet! Maggie took a tiny jade dragon from a shop by the Great Wall of China. Watch out, detectives — this trail has a TRICKY clue with two places that share one name. Read carefully, and keep that Notebook full!",
  stamp: "🐉 Great Wall Stamp",
  startFact: { city:"Beijing", emoji:"🐉", country:"China", capital:"Beijing",
    landmark:"The Great Wall of China", fact:"The Great Wall is the longest wall in the whole world. It stretches for thousands of miles." },
  startTrait: "A jade-green ribbon tied on her tail",
  startWitness: "A wall guard saw her: “She had a jade-green ribbon tied on her tail!”",
  catchText: "“You even solved the tricky Victoria clue! Here is the little jade dragon. I am sorry — I will collect pictures now, I promise!”",
  catchReturn: "The jade dragon is back by the Great Wall. Maggie bows, says sorry in three languages, and flies home to her postcard nest.",
  decoys: ["Is ten feet tall", "Never, ever leaves her nest"],
  steps: [
    { from:"Beijing", type:"🏛️ Landmark Clue", key:"island country",
      clue:"Maggie flew east, over the sea, to an island country. A feather was found by a tall red tower in its capital city.",
      choices:["Sydney","Tokyo","Agra"], answer:"Tokyo",
      hint1:"The island country east of China is Japan.",
      hint2:"The capital of Japan is Tokyo.",
      travel:"✈️ Over the sea to the east! Travel fact: Japan is a country made of islands — thousands of them.",
      trait:"Always says sorry, in every language",
      witness:"A tower worker bowed back: “She said sorry in three languages!”",
      fact:{ city:"Tokyo", emoji:"🌸", country:"Japan", capital:"Tokyo",
        landmark:"Tokyo Tower", fact:"Mount Fuji, Japan's tallest mountain, is not far from Tokyo. On clear days you can see it from the city." } },
    { from:"Tokyo", type:"🚩 Flag Clue", key:"blue wheel",
      clue:"A flag clue! Three stripes — orange, white, and green — with a blue wheel in the middle. Maggie is in the country with this flag, by a white marble building called the Taj Mahal.",
      choices:["Beijing","Agra","Sydney"], answer:"Agra",
      hint1:"That orange, white, and green flag belongs to India.",
      hint2:"The Taj Mahal is in Agra, a city in India.",
      travel:"✈️ A long flight west! Travel fact: India is the country with the most people in the world.",
      trait:"Collects one shiny pebble from every city",
      witness:"A guide by the Taj Mahal nodded: “She picked up one shiny pebble, like always.”",
      fact:{ city:"Agra", emoji:"🏰", country:"India", capital:"New Delhi — Agra is the home of the Taj Mahal, but New Delhi is the capital!",
        landmark:"The Taj Mahal", fact:"The Taj Mahal is made of white marble. It took about 20 years to build." } },
    { from:"Agra", type:"🌍 Continent Clue", key:"whole country",
      clue:"Think continents, detectives! Maggie flew way down south, to the one continent that is also a whole country. She is by a harbour, next to a building that looks like giant white sails.",
      choices:["Sydney","Tokyo","Cairo"], answer:"Sydney",
      hint1:"A country that is also a whole continent — that is Australia.",
      hint2:"The building with white sails is the Opera House in Sydney.",
      travel:"✈️ Down under we go! Travel fact: in Australia, winter comes in June, July, and August — the seasons are upside down!",
      trait:"Naps in the shade at lunchtime",
      witness:"A harbour sailor whispered: “Shh — she naps in the shade at lunchtime, every day.”",
      fact:{ city:"Sydney", emoji:"🦘", country:"Australia", capital:"Canberra — Sydney is the biggest city, but Canberra is the capital!",
        landmark:"The Sydney Opera House", fact:"Australia is the only country in the world that is also a whole continent." } },
    { from:"Sydney", type:"🕵️ Tricky Clue", key:"kangaroo footprint",
      clue:"Tricky trail! A sign says Maggie went to VICTORIA. But careful — there is a city called Victoria in Canada, AND a state called Victoria in Australia! Her feather has a tiny kangaroo footprint on it. Which city is the capital of Australia's Victoria?",
      choices:["Victoria, Canada","Perth","Melbourne"], answer:"Melbourne",
      hint1:"A kangaroo footprint! Kangaroos live in Australia, not Canada.",
      hint2:"Melbourne is the capital city of Victoria, the state in Australia.",
      travel:"🚆 The train clicks and clacks south. Travel fact: Melbourne's trams make up the biggest tram network in the world.",
      trait:"Lines her nest with postcards",
      witness:"A tram driver grinned: “She told me her nest is lined with postcards from every trip!”",
      fact:{ city:"Melbourne", emoji:"🚃", country:"Australia", capital:"Canberra is Australia's capital. Melbourne is the capital of the state of Victoria.",
        landmark:"The Melbourne Cricket Ground, one of the biggest stadiums in the world", fact:"Near Melbourne lives a parade of little penguins — the smallest penguins in the world!" } },
    { from:"Melbourne", type:"🗺️ Place Clue", key:"New Zealand",
      clue:"One last hop over the sea! Maggie flew east to New Zealand, the island country where the Māori people have lived for hundreds of years. She is in its biggest city, under a tall tower called the Sky Tower.",
      choices:["Melbourne","Auckland","Tokyo"], answer:"Auckland",
      hint1:"New Zealand is east of Australia, across the Tasman Sea.",
      hint2:"Auckland is the biggest city in New Zealand.",
      travel:"✈️ Over the Tasman Sea! Travel fact: New Zealand was the first country in the world where women could vote.",
      trait:null, witness:null,
      fact:{ city:"Auckland", emoji:"🗼", country:"New Zealand", capital:"Wellington — Auckland is the biggest city, but Wellington is the capital!",
        landmark:"The Sky Tower", fact:"New Zealand is made of two big islands — the North Island and the South Island." } }
  ]
}
];

/* Maggie the Magpie — our own simple SVG bird */
const MAGGIE_SVG = `<svg viewBox="0 0 100 100" aria-label="Maggie the Magpie">
  <path d="M30 60 L6 86 L18 88 L36 68 Z" fill="#1f7a63"/>
  <ellipse cx="46" cy="56" rx="23" ry="16" fill="#232323"/>
  <ellipse cx="50" cy="61" rx="14" ry="10" fill="#ffffff"/>
  <path d="M32 46 Q44 30 60 38 Q48 42 40 54 Z" fill="#2e9e7f"/>
  <circle cx="67" cy="41" r="11" fill="#232323"/>
  <circle cx="70" cy="39" r="2.4" fill="#ffffff"/>
  <path d="M77 42 L90 46 L77 50 Z" fill="#f5b921"/>
  <path d="M40 71 L38 80 M54 71 L54 80" stroke="#f5b921" stroke-width="2.4" stroke-linecap="round"/>
</svg>`;

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
  correct() { this.tone(523.25, 0, .16, "triangle"); this.tone(659.25, .09, .16, "triangle"); this.tone(783.99, .18, .26, "triangle"); },
  wrong()   { this.tone(196, 0, .22, "sine", .08); },
  stamp()   { this.tone(150, 0, .18, "square", .12); this.tone(1318.5, .1, .3, "triangle", .1); },
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
const SAVE_KEY = "globeChaseSave";
let save = { solved: {}, facts: [], sound: true };
try {
  const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
  if (raw && typeof raw === "object") save = Object.assign(save, raw);
} catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

function rankName() {
  const n = CASES.filter(c => save.solved[c.id]).length;
  return n >= 3 ? "Master Detective" : n >= 1 ? "Detective" : "Junior Detective";
}
function factById(id) {
  for (const c of CASES) {
    if (c.startFact.city === id) return c.startFact;
    for (const s of c.steps) if (s.fact.city === id) return s.fact;
  }
  return null;
}
function caseTraits(c) {
  const t = [c.startTrait];
  c.steps.forEach(s => { if (s.trait) t.push(s.trait); });
  return t;
}

/* ================= RUNTIME ================= */
let run = null; // { kase, step, wrongs, sun, sunsets, traits:[] }
const $ = id => document.getElementById(id);
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $("screen-" + name).classList.add("active");
  window.scrollTo(0, 0);
}
function shuffle(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }
function confettiInto(zone, n) {
  const colors = ["#ffd740", "#38c172", "#e8530a", "#1a8ac8", "#ff6b9d"];
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

/* ---------- fact card rendering ---------- */
function factCardHTML(f, mini) {
  return `<div class="fact-card${mini ? " mini" : ""}">
    ${mini ? "" : `<span class="fc-emoji">${f.emoji}</span>`}
    <div class="fc-city">${f.emoji} ${f.city}</div>
    <div class="fc-row"><span class="fc-k">🌍 Country</span><span>${f.country}</span></div>
    <div class="fc-row"><span class="fc-k">🏛️ Capital</span><span>${f.capital}</span></div>
    <div class="fc-row"><span class="fc-k">⭐ Famous for</span><span>${f.landmark}</span></div>
    <div class="fc-row"><span class="fc-k">💡 Wow fact</span><span>${f.fact}</span></div>
  </div>`;
}
function earnFact(f) {
  if (!save.facts.includes(f.city)) { save.facts.push(f.city); persist(); }
}

/* ---------- sun clock (gentle — it can never fail you) ---------- */
function sunLabel() {
  if (!run) return "";
  const s = run.sun;
  const icon = s < .3 ? "🌅" : s < .55 ? "☀️" : s < .8 ? "🌤️" : "🌇";
  const word = s < .3 ? "Morning" : s < .55 ? "Midday" : s < .8 ? "Afternoon" : "Sunset soon";
  return `${icon} ${word}`;
}
function advanceSun(amount) {
  if (!run) return;
  run.sun += amount;
  if (run.sun >= 1) {
    /* The sun set — but Chief Lottie ALWAYS makes sure you arrive in time.
       Maggie naps, the trail stays warm, and a new day begins. No fail, ever. */
    run.sun = 0.08; run.sunsets++;
    run.sunsetNote = true;
  }
  renderTrail();
}

/* ---------- trail meter ---------- */
function renderTrail() {
  const m = $("trailMeter"); if (!m || !run) return;
  const w = run.wrongs;
  m.className = "trail-meter " + (w === 0 ? "warm" : w === 1 ? "cool" : "cold");
  m.textContent = w === 0 ? "👣 Trail: Warm" : w === 1 ? "👣 Trail: Cool" : "👣 Trail: Cold — extra help!";
  const sun = $("sunClock"); if (sun) sun.textContent = sunLabel();
}

/* ---------- title / cases ---------- */
function renderTitle() {
  $("titleBird").innerHTML = MAGGIE_SVG;
  $("btnSoundTitle").textContent = save.sound ? "🔊 Sound: On" : "🔇 Sound: Off";
  $("rankLine").textContent = `Your rank: ⭐ ${rankName()} • Cases solved: ${CASES.filter(c => save.solved[c.id]).length} of ${CASES.length}`;
}
function renderCases() {
  const n = CASES.filter(c => save.solved[c.id]).length;
  $("casesProgress").textContent = `Rank: ⭐ ${rankName()} — Cases solved: ${n} of ${CASES.length}` +
    (n === 0 ? " • Start with Case 1!" : "");
  const list = $("caseList"); list.innerHTML = "";
  CASES.forEach(c => {
    const b = document.createElement("button");
    b.className = "case-card" + (save.solved[c.id] ? " solved" : "");
    b.innerHTML = `<span class="cc-emoji">${c.emoji}</span>
      <span><b>Case ${c.num}: ${c.title}</b>
      <small>Maggie took ${c.taken} • ${c.steps.length + 1} cities</small></span>
      <span class="cc-status">${save.solved[c.id] ? "✅" : "📁"}</span>`;
    b.onclick = () => openCaseFile(c);
    list.appendChild(b);
  });
}

/* ---------- case file ---------- */
let selectedCase = null;
function openCaseFile(c) {
  selectedCase = c;
  $("cfTab").textContent = `CASE FILE #${c.num}`;
  $("cfTitle").textContent = `${c.emoji} ${c.title}`;
  $("cfTaken").textContent = c.taken;
  $("cfLastSeen").textContent = c.lastSeen;
  $("cfBrief").textContent = c.brief;
  showScreen("casefile");
}

/* ---------- start city ---------- */
function beginCase() {
  const c = selectedCase;
  run = { kase: c, step: 0, wrongs: 0, sun: 0.08, sunsets: 0, sunsetNote: false, traits: [c.startTrait] };
  earnFact(c.startFact);
  $("startHead").textContent = `📍 You are in ${c.startFact.city}!`;
  $("startStory").innerHTML = `${c.startWitness}<br><br>📓 <b>Detective Notebook:</b> Maggie clue #1 written down — “${c.startTrait}.”`;
  $("startFact").innerHTML = factCardHTML(c.startFact, false);
  showScreen("start");
}

/* ---------- a stop: clue + choices ---------- */
function renderStop() {
  const c = run.kase, s = c.steps[run.step];
  run.wrongs = 0;
  $("stopCount").textContent = `Stop ${run.step + 1} of ${c.steps.length}`;
  $("stopWhere").textContent = `📍 You are in ${s.from}`;
  $("stopSighting").textContent = run.sunsetNote
    ? "🌇 The sun set while you travelled — but Chief Lottie radioed in: “Detectives always arrive in time! Maggie napped, and her trail is fresh and warm this morning.”"
    : "You spot a shiny feather on the ground. Maggie was here!";
  run.sunsetNote = false;
  $("clueType").textContent = s.type;
  setClueText(false);
  $("hintBox").hidden = true;
  const box = $("choices"); box.innerHTML = "";
  shuffle(s.choices).forEach(city => {
    const b = document.createElement("button");
    b.className = "choice-btn"; b.textContent = city; b.dataset.city = city;
    b.onclick = () => choose(b, city);
    box.appendChild(b);
  });
  renderTrail();
  showScreen("stop");
}
function setClueText(glow) {
  const s = run.kase.steps[run.step];
  if (glow && s.key) {
    const i = s.clue.indexOf(s.key);
    if (i >= 0) {
      $("clueText").innerHTML = s.clue.slice(0, i) + `<span class="key">${s.key}</span>` + s.clue.slice(i + s.key.length);
      return;
    }
  }
  $("clueText").textContent = s.clue;
}
function choose(btn, city) {
  const s = run.kase.steps[run.step];
  if (city === s.answer) {
    SoundFX.correct();
    btn.classList.add("right");
    [...$("choices").children].forEach(x => x.disabled = true);
    advanceSun(0.16);
    setTimeout(() => renderTravel(), 850);
  } else {
    /* Wrong guess: the trail cools, Lottie helps more. Never a fail. */
    SoundFX.wrong();
    btn.classList.add("wrong"); btn.disabled = true;
    run.wrongs++;
    advanceSun(0.07);
    const hb = $("hintBox"); hb.hidden = false;
    if (run.wrongs >= 2) {
      $("hintText").innerHTML = `<b>Chief Lottie:</b> ${s.hint2}`;
      setClueText(true);
    } else {
      $("hintText").innerHTML = `<b>Chief Lottie:</b> Good try, detective! The trail is cooling, so here is a hint: ${s.hint1}`;
    }
    renderTrail();
  }
}

/* ---------- travel beat ---------- */
function renderTravel() {
  const s = run.kase.steps[run.step];
  $("travelArt").textContent = s.travel.slice(0, 2);
  $("travelHead").textContent = `Off to ${s.answer}!`;
  $("travelText").textContent = s.travel;
  $("btnArrive").textContent = `We made it to ${s.answer}! →`;
  showScreen("travel");
}
function arrive() {
  const s = run.kase.steps[run.step];
  earnFact(s.fact);
  let extra = "";
  if (s.trait) {
    run.traits.push(s.trait);
    extra = `<div class="hint-box" style="margin-bottom:14px;"><span class="hint-face">📓</span>
      <p><b>Detective Notebook — new Maggie clue!</b><br>${s.witness}<br>✏️ Written down: “${s.trait}.” (${run.traits.length} clues)</p></div>`;
  }
  $("factExtra").innerHTML = extra;
  $("factCardSlot").innerHTML = factCardHTML(s.fact, false);
  const last = run.step === run.kase.steps.length - 1;
  $("btnKeepChasing").textContent = last ? "📓 Open the Detective Notebook →" : "👣 Keep Chasing";
  showScreen("fact");
}
function keepChasing() {
  if (run.step === run.kase.steps.length - 1) { renderProof(); return; }
  run.step++;
  renderStop();
}

/* ---------- proof gate (Detective Notebook) ---------- */
let proofSelection = new Set();
function renderProof() {
  const c = run.kase;
  proofSelection = new Set();
  $("proofHead").textContent = `📓 Prove It's Maggie!`;
  $("proofStory").innerHTML = `You followed the whole trail to <b>${c.steps[c.steps.length - 1].answer}</b>!
    But before you catch the landmark-napper, a good detective must <b>prove</b> who it is.
    Circle every Maggie clue from your Notebook — only the clues you really found!`;
  const list = $("proofList"); list.innerHTML = "";
  shuffle(caseTraits(c).concat(c.decoys)).forEach(t => {
    const b = document.createElement("button");
    b.className = "proof-item"; b.textContent = "✏️ " + t; b.dataset.trait = t;
    b.onclick = () => { b.classList.toggle("picked"); proofSelection.has(t) ? proofSelection.delete(t) : proofSelection.add(t); };
    list.appendChild(b);
  });
  $("proofMsg").textContent = `Your Notebook holds ${caseTraits(c).length} Maggie clues from this trail.`;
  $("btnProofGo").hidden = true;
  showScreen("proof");
}
function checkProof() {
  const real = caseTraits(run.kase);
  const missing = real.filter(t => !proofSelection.has(t));
  const extra = [...proofSelection].filter(t => !real.includes(t));
  if (missing.length === 0 && extra.length === 0) {
    SoundFX.fanfare();
    $("proofMsg").innerHTML = "🎉 <b>Proof complete!</b> Every clue matches Maggie the Magpie — the shiny feathers, the sorry notes, all of it. Chief Lottie says: “That's real detective work!”";
    $("btnProofGo").hidden = false;
  } else if (extra.length > 0) {
    SoundFX.wrong();
    $("proofMsg").innerHTML = "🦉 <b>Chief Lottie:</b> Hmm — one of those circled clues is <b>not</b> in our Notebook. We can only use clues we really found on the trail. Uncircle it and try again!";
  } else {
    SoundFX.wrong();
    $("proofMsg").innerHTML = `🦉 <b>Chief Lottie:</b> Good start! You still need ${missing.length} more Maggie clue${missing.length > 1 ? "s" : ""} from your Notebook to prove it. Circle them all!`;
  }
}

/* ---------- catch + complete ---------- */
function renderCatch() {
  const c = run.kase;
  $("catchBird").innerHTML = MAGGIE_SVG;
  $("catchText").textContent = "🐦 Maggie: " + c.catchText;
  $("catchReturn").textContent = c.catchReturn;
  showScreen("catch");
}
function closeCase() {
  const c = run.kase;
  const wasAll = CASES.every(x => save.solved[x.id]);
  save.solved[c.id] = true; persist();
  SoundFX.stamp();
  confettiInto($("confettiZone"), 46);
  $("stampBig").textContent = c.stamp;
  const nowAll = CASES.every(x => save.solved[x.id]);
  $("completeText").innerHTML =
    `You returned ${c.taken} and earned the <b>${c.stamp}</b> for your passport!<br>` +
    `Your rank: ⭐ <b>${rankName()}</b>` +
    (nowAll && !wasAll ? "<br>And that was the LAST case — you solved them all!" : "");
  $("masterBanner").hidden = !nowAll;
  showScreen("complete");
}

/* ---------- passport (the dossier) ---------- */
function renderPassport() {
  $("passportRank").innerHTML = `Your rank: ⭐ <b>${rankName()}</b><br>` +
    `<span class="rank-ladder">${["Junior Detective", "Detective", "Master Detective"].map(r =>
      r === rankName() ? `<b class="rank-on">${r}</b>` : r).join(" → ")}</span>`;
  const grid = $("stampGrid"); grid.innerHTML = "";
  CASES.forEach(c => {
    const d = document.createElement("div");
    d.className = "stamp-slot" + (save.solved[c.id] ? " earned" : "");
    d.innerHTML = `<span class="ss-emoji">${c.emoji}</span>
      <span><b>${c.stamp}</b><small>${save.solved[c.id] ? "Case solved — great detective work!" : "Not yet — solve Case " + c.num + ": " + c.title}</small></span>`;
    grid.appendChild(d);
  });
  $("factCount").textContent = `${save.facts.length} of ${CASES.reduce((n, c) => n + 1 + c.steps.length, 0)} fact cards found`;
  const list = $("factList"); list.innerHTML = "";
  if (!save.facts.length) list.innerHTML = `<p style="opacity:.85">No fact cards yet — solve a case to start your collection!</p>`;
  save.facts.forEach(id => { const f = factById(id); if (f) list.innerHTML += factCardHTML(f, true); });
  showScreen("passport");
}

/* ---------- Fact Notebook overlay (open anytime) ---------- */
function openNotebook(tab) {
  document.querySelectorAll(".nb-tab").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  const body = $("nbBody");
  if (tab === "facts") {
    body.innerHTML = save.facts.length
      ? save.facts.map(id => { const f = factById(id); return f ? factCardHTML(f, true) : ""; }).join("")
      : "<p>No fact cards yet. Earn them by following Maggie's trail!</p>";
  } else {
    let html = "";
    if (run) {
      html += `<h4 class="nb-head">This case — Maggie clues found (${run.traits.length})</h4>` +
        run.traits.map(t => `<p class="nb-trait">✏️ ${t}</p>`).join("");
    }
    const done = CASES.filter(c => save.solved[c.id]);
    if (done.length) {
      html += `<h4 class="nb-head">Solved cases — full Maggie pages</h4>` +
        done.map(c => `<p class="nb-trait"><b>${c.title}:</b> ${caseTraits(c).join(" • ")}</p>`).join("");
    }
    body.innerHTML = html || "<p>No Maggie clues yet. Start a case and listen to the witnesses!</p>";
  }
  $("notebookOverlay").hidden = false;
}
function closeNotebook() { $("notebookOverlay").hidden = true; }

/* ---------- wiring ---------- */
document.querySelectorAll("[data-nav]").forEach(b => {
  b.onclick = () => {
    const t = b.dataset.nav;
    if (t === "cases") { renderCases(); showScreen("cases"); }
    else if (t === "passport") { renderPassport(); }
    else if (t === "master") { confettiInto($("confettiZone2"), 46); showScreen("master"); }
    else showScreen(t);
  };
});
$("btnStart").onclick = () => { renderCases(); showScreen("cases"); };
$("btnPassportTitle").onclick = () => renderPassport();
$("btnPassportCases").onclick = () => renderPassport();
$("btnSoundTitle").onclick = () => {
  save.sound = !save.sound; persist();
  if (!save.sound) SoundFX.stopAll();
  renderTitle();
};
$("btnBegin").onclick = () => beginCase();
$("btnFirstClue").onclick = () => renderStop();
$("btnArrive").onclick = () => arrive();
$("btnKeepChasing").onclick = () => keepChasing();
$("btnProof").onclick = () => checkProof();
$("btnProofGo").onclick = () => renderCatch();
$("btnCloseCase").onclick = () => closeCase();
$("btnMaster").onclick = () => { confettiInto($("confettiZone2"), 46); SoundFX.fanfare(); showScreen("master"); };
document.querySelectorAll(".nb-open").forEach(b => b.onclick = () => openNotebook(b.dataset.tab || "facts"));
$("nbClose").onclick = () => closeNotebook();
document.querySelectorAll(".nb-tab").forEach(b => b.onclick = () => openNotebook(b.dataset.tab));

renderTitle();
