/* Miss Maple's Wonder Wagon — an original Willow Tales science adventure.
   Mechanics follow the house blueprint (CLASSIC-BLUEPRINTS.md, Magic School
   Bus section): one trip = one topic, three layers at every stop, a light
   collection over free wandering, no fail states, no timers. All characters,
   words, and art are our own. No external assets. */

/* ================= THE WONDER WAGON (our own SVG) ================= */
const WAGON_SVG = `<svg viewBox="0 0 200 120" aria-label="The Wonder Wagon">
  <path d="M30 40 L30 14" stroke="#8a6d3b" stroke-width="4" stroke-linecap="round"/>
  <path d="M30 14 Q50 9 45 25 Q31 25 30 14 Z" fill="#38c172"/>
  <path d="M35 42 Q97 4 165 42 L165 48 L35 48 Z" fill="#f5b921"/>
  <rect x="28" y="44" width="134" height="44" rx="14" fill="#3d9b4f"/>
  <rect x="116" y="52" width="32" height="24" rx="6" fill="#bde8fb"/>
  <polygon points="70,50 74,59 84,59 76,66 79,76 70,70 61,76 64,66 56,59 66,59" fill="#ffffff"/>
  <circle cx="60" cy="96" r="16" fill="#33302a"/><circle cx="60" cy="96" r="7" fill="#fdf3d8"/>
  <circle cx="140" cy="96" r="16" fill="#33302a"/><circle cx="140" cy="96" r="7" fill="#fdf3d8"/>
</svg>`;

/* ================= CLASSROOM HOTSPOTS ================= */
const CLASS_SPOTS = [
  { id:"globe", emoji:"🌍", label:"Globe", kind:"fact",
    text:"Our Earth spins around like a top, once every day. That spinning is what gives us daytime and nighttime!" },
  { id:"books", emoji:"📚", label:"Books", kind:"joke",
    text:"Why did the sun go to school? To get brighter! Miss Maple keeps the science shelf right here — every book is a trip somebody took in their mind first." },
  { id:"plant", emoji:"🌱", label:"Plant", kind:"fact",
    text:"This little plant drinks water up through its roots and breathes through tiny holes in its leaves. It is growing a tiny bit every single day." },
  { id:"fish", emoji:"🐠", label:"Fish Tank", kind:"fact",
    text:"Fish breathe oxygen from the water using feathery parts called gills. That is how they breathe without ever coming up for air!" },
  { id:"art", emoji:"🎨", label:"Art Wall", kind:"fact",
    text:"Every picture on this wall started as a question. Miss Maple says a question is a tiny adventure waiting to happen." }
];

/* ================= SHAPE ART (for the hexagon game) ================= */
const SVG_HEX  = `<svg viewBox="0 0 100 100"><polygon points="50,6 88,28 88,72 50,94 12,72 12,28" fill="#f5b921" stroke="#d99a06" stroke-width="5"/></svg>`;
const SVG_TRI  = `<svg viewBox="0 0 100 100"><polygon points="50,10 90,86 10,86" fill="#7ecbf2" stroke="#146a9c" stroke-width="5"/></svg>`;
const SVG_SQR  = `<svg viewBox="0 0 100 100"><rect x="18" y="18" width="64" height="64" fill="#38c172" stroke="#2a9d5c" stroke-width="5"/></svg>`;
const SVG_PENT = `<svg viewBox="0 0 100 100"><polygon points="50,6 93,38 74,90 26,90 7,38" fill="#ff6b9d" stroke="#d6336c" stroke-width="5"/></svg>`;
const SVG_CIRC = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#b388ff" stroke="#7d3c98" stroke-width="5"/></svg>`;

/* ================= TRIPS ================= */
const TRIPS = [
{
  id:"beehive", name:"Inside a Beehive", emoji:"🐝", badge:"Bee Friend Badge 🐝",
  form:"The wagon shrinks… smaller than a ladybug, smaller than a raindrop… until the beehive looks as big as a castle!",
  intro:"Miss Maple whispers: “Bees are gentle neighbors. We will visit quietly, tap softly, and learn their secrets. Four of Lottie's picnic treasures rolled into the hive — let's find them all!”",
  items:[
    { id:"jar",    emoji:"🍓", name:"Lottie's jam jar" },
    { id:"spoon",  emoji:"🥄", name:"the golden spoon" },
    { id:"teapot", emoji:"🫖", name:"the tiny teapot" },
    { id:"basket", emoji:"🧺", name:"the picnic basket" }
  ],
  stops:[
    { id:"door", name:"The Hive Door", emoji:"🚪",
      intro:"Two guard bees are checking everyone who comes home. Smile, detectives — we smell like friends today.",
      bg:"linear-gradient(180deg,#fff3b0,#ffe082)",
      hotspots:[
        { id:"flowers", emoji:"🌼", label:"Flowers", kind:"fact", item:"jar", anim:"wiggle",
          text:"A honeybee visits about 50 to 100 flowers on every trip out of the hive. What a busy, buzzy day!" },
        { id:"guard", emoji:"🐝", label:"Guard Bee", kind:"fact", anim:"bob",
          text:"A guard bee stands at the door and smells every bee who comes home. If you smell like family, you may pass. Strangers must stay out!" },
        { id:"knock", emoji:"🚪", label:"Hive Door", kind:"joke", anim:"grow",
          text:"Knock, knock! Who's there? Bee. Bee who? Bee careful — the wagon is very, very tiny today!" }
      ],
      game:{ kind:"sequence", title:"🎮 Copy the Waggle Dance",
        intro:"A bee tells her sisters where the flowers are by dancing! Watch the dance steps light up, then tap them in the same order.",
        symbols:["⬆️","⬅️","➡️","⬇️"], rounds:[3,4,5],
        winText:"You danced it perfectly! The bees cheer: now you speak bee!" },
      exp:{ kind:"toggle", title:"🔬 Bee Eyes",
        intro:"Bees can see a secret color called ultraviolet that people cannot see at all. Flowers wear secret patterns in that color. Try both kinds of eyes!",
        states:[
          { label:"👀 People Eyes", scene:`<span class="big">🌼 🌸 🌺 🌻</span><span>Pretty flowers… but which part holds the sweet nectar?</span>`,
            note:"With people eyes, the flowers just look pretty. The important part is hiding!" },
          { label:"🐝 Bee Eyes", scene:`<span class="big uv-on">🌼 🌸 🌺 🌻</span><span class="mid">◎ ◎ ◎ ◎</span><span>Dark bullseyes appear in the middle of every flower!</span>`,
            note:"There it is! In ultraviolet light, flowers show a dark bullseye that points bees straight to the nectar. It is a signpost only bees can read." }
        ] }
    },
    { id:"kitchen", name:"The Honeycomb Kitchen", emoji:"🍯",
      intro:"It smells like warm honey in here. Rows and rows of golden comb stretch as far as our tiny eyes can see.",
      bg:"linear-gradient(180deg,#ffe9a8,#ffd54f)",
      hotspots:[
        { id:"comb", emoji:"⬡", label:"Honeycomb", kind:"fact", item:"spoon", anim:"grow",
          text:"Bees build their comb from tiny flakes of wax they make themselves. Every cell has six sides — a shape called a hexagon. Hexagons fit together with no gaps at all!" },
        { id:"honeypot", emoji:"🍯", label:"Honey Pot", kind:"fact", anim:"bob",
          text:"Honey almost never spoils! Pots of honey found in ancient tombs in Egypt were still sweet and good to eat after about 3,000 years." },
        { id:"baker", emoji:"🐝", label:"Baker Bee", kind:"joke", anim:"wiggle",
          text:"What do bees chew after lunch? Bumble gum! The baker bee giggles and stirs her pot a little faster." }
      ],
      game:{ kind:"targets", title:"🎮 Tap the Hexagons",
        intro:"Bees build with hexagons — shapes with six sides. Tap every hexagon to help fill the comb. Other shapes are just visiting!",
        need:4,
        tiles:[
          { id:"h1", html:SVG_HEX, correct:true }, { id:"t1", html:SVG_TRI },
          { id:"h2", html:SVG_HEX, correct:true }, { id:"s1", html:SVG_SQR },
          { id:"p1", html:SVG_PENT },              { id:"h3", html:SVG_HEX, correct:true },
          { id:"c1", html:SVG_CIRC },              { id:"h4", html:SVG_HEX, correct:true }
        ],
        winText:"Every hexagon found! The comb clicks together perfectly — no gaps, just like the bees build it." },
      exp:{ kind:"tap", title:"🔬 Fan the Nectar into Honey",
        intro:"Bees bring home watery nectar, then fan it with their wings for a long time. The water floats away and thick honey is left. Tap the fan button to help the bees dry the nectar!",
        btn:"🌀 Fan! Fan! Fan!",
        stages:[
          { scene:`<span class="big">💧🍯</span><div class="water-bar"><div class="water-fill" style="width:80%"></div></div><span>Water in the nectar: lots and lots (80%)</span>`,
            note:"Fresh nectar is runny like juice. Too watery to keep!" },
          { scene:`<span class="big">🐝💨 🍯</span><div class="water-bar"><div class="water-fill" style="width:65%"></div></div><span>Water: 65% — the fanning has begun!</span>`,
            note:"Thousands of tiny wings are beating. The air carries the water away, drop by drop." },
          { scene:`<span class="big">🐝💨💨 🍯</span><div class="water-bar"><div class="water-fill" style="width:50%"></div></div><span>Water: 50% — halfway there!</span>`,
            note:"The nectar is getting thicker. Can you see it turning more golden?" },
          { scene:`<span class="big">🐝💨💨💨 🍯</span><div class="water-bar"><div class="water-fill" style="width:35%"></div></div><span>Water: 35% — thick and sticky!</span>`,
            note:"Almost honey! Bees fan day and night, taking turns so nobody gets too tired." },
          { scene:`<span class="big">✨🍯✨</span><div class="water-bar"><div class="water-fill" style="width:18%"></div></div><span>Water: 18% — just right!</span>`,
            note:"It's honey! Thick, golden, and it will keep for years and years. The bees seal it with a wax lid, like putting a cover on a jar." }
        ] }
    },
    { id:"nursery", name:"The Baby Bee Nursery", emoji:"🐛",
      intro:"Shhh… this is the nursery, where the baby bees grow. Nurse bees tiptoe from cell to cell, caring for them all.",
      bg:"linear-gradient(180deg,#ffe3ec,#ffc2d4)",
      hotspots:[
        { id:"queen", emoji:"👑", label:"The Queen", kind:"fact", item:"teapot", anim:"bob",
          text:"The queen bee is the mother of the whole hive. On a busy summer day she can lay up to 2,000 eggs — more than one every minute!" },
        { id:"babies", emoji:"🐛", label:"Baby Cells", kind:"fact", anim:"grow",
          text:"A baby bee grows in four steps: first an egg, then a larva (a tiny white grub), then a pupa resting quietly in a wrapped-up cell, and then — out comes a grown-up bee!" },
        { id:"nurse", emoji:"🐝", label:"Nurse Bee", kind:"fact", anim:"wiggle",
          text:"Nurse bees look after the babies all day and all night, feeding them and keeping them warm. Taking care of babies is their whole job." }
      ],
      game:{ kind:"order", title:"🎮 A Bee Grows Up",
        intro:"Tap the cards in the right order to show how a bee grows up, from the very beginning.",
        cards:[
          { id:"egg",   e:"🥚", t:"Egg" },
          { id:"larva", e:"🐛", t:"Larva" },
          { id:"pupa",  e:"🎁", t:"Pupa, all wrapped up" },
          { id:"bee",   e:"🐝", t:"Grown-up Bee" }
        ],
        winText:"Egg, larva, pupa, bee — that's the whole growing-up story. In about three weeks, a bee is all grown!" },
      exp:{ kind:"slider", title:"🔬 The Hive Thermostat",
        intro:"Bees keep the inside of their hive at about 95 degrees (35°C) — just right — all year long. Slide the weather outside from freezing to hot, and watch what the bees do!",
        steps:[
          { label:"❄️ Freezing outside", scene:`<span class="big">🐝🐝🐝</span><span>The bees huddle in a tight, cozy ball!</span>`,
            note:"Inside the hive: still about 95 degrees. The bees shiver their wing muscles to make heat, like tiny furnaces." },
          { label:"🌥️ Cold outside", scene:`<span class="big">🐝 🐝 🐝</span><span>The bees stay close and keep shivering.</span>`,
            note:"Inside the hive: still about 95 degrees. Huddling together shares the warmth — nobody heats the hive alone." },
          { label:"🌤️ Just right outside", scene:`<span class="big">🐝 🌼 🐝</span><span>Bees come and go, busy and happy.</span>`,
            note:"Inside the hive: about 95 degrees. On a just-right day, the bees barely have to work at heating or cooling at all." },
          { label:"☀️ Hot outside", scene:`<span class="big">🐝💨 🐝💨 🐝💨</span><span>The bees fan their wings at the door!</span>`,
            note:"Inside the hive: STILL about 95 degrees! Fanning bees are the hive's air conditioners, blowing the hot air out." }
        ] }
    },
    { id:"dancefloor", name:"The Waggle Dance Floor", emoji:"💃",
      intro:"In the middle of the hive is a dance floor! Returning bees dance here to tell everyone where the good flowers are.",
      bg:"linear-gradient(180deg,#e1bee7,#ce93d8)",
      hotspots:[
        { id:"dance", emoji:"💃", label:"Dance Floor", kind:"fact", item:"basket", anim:"wiggle",
          text:"When a bee finds good flowers, she dances a wiggly waggle dance right here on the comb. The dance is a map — it tells her sisters exactly where to fly!" },
        { id:"sun", emoji:"☀️", label:"The Sun", kind:"fact", anim:"bob",
          text:"A bee aims her dance using the sun, like a compass. Even on cloudy days, bees can tell where the sun is hiding in the sky." },
        { id:"map", emoji:"🌻", label:"Flower Map", kind:"fact", anim:"grow",
          text:"The longer the wiggly middle part of the dance, the farther away the flowers are. A short little wiggle means: the flowers are close by!" }
      ],
      game:{ kind:"path", title:"🎮 Follow the Dance Map",
        intro:"The waggle dance gives directions! Read the dance, then tap the flower the bee means.",
        char:"🐝", deco:"🌼", cols:3, rows:3,
        rounds:[
          { say:"The dance says: 2 flowers UP, then 1 flower to the RIGHT.", start:[2,0], target:[0,1] },
          { say:"The dance says: 1 flower UP, then 2 flowers to the RIGHT.", start:[2,0], target:[1,2] }
        ],
        winText:"You read the dance like a real bee! The flowers were right where the dance said." },
      exp:{ kind:"slider", title:"🔬 The Distance Dial",
        intro:"Slide to change how far away the flowers are — and watch how the bee's waggle dance changes!",
        steps:[
          { label:"🌼 Flowers are near", scene:`<span class="mid">🐝</span><span style="display:inline-block;width:60px;height:14px;background:#f5b921;border-radius:8px;vertical-align:middle;"></span><span> A short, quick wiggle!</span>`,
            note:"Short wiggle = close flowers. The dance is a quick little shimmy." },
          { label:"🌻 Flowers are farther", scene:`<span class="mid">🐝</span><span style="display:inline-block;width:130px;height:14px;background:#f5b921;border-radius:8px;vertical-align:middle;"></span><span> A longer wiggle…</span>`,
            note:"The wiggle stretch grows. The sisters watching can measure it with their own bodies!" },
          { label:"🌷 Flowers are far, far away", scene:`<span class="mid">🐝</span><span style="display:inline-block;width:210px;height:14px;background:#f5b921;border-radius:8px;vertical-align:middle;"></span><span> A loooong, slow wiggle!</span>`,
            note:"The longest wiggle of all! Bees can dance directions to flowers kilometers away — and their sisters really do find them." }
        ] }
    },
    { id:"meadow", name:"The Clover Meadow", emoji:"🌸",
      intro:"POP! The wagon grows back to its regular size, right in the middle of a clover meadow buzzing with happy bees.",
      bg:"linear-gradient(180deg,#c8f7c5,#a5e8a1)",
      hotspots:[
        { id:"pollen", emoji:"🌸", label:"Clover Flower", kind:"fact", anim:"wiggle",
          text:"When a bee visits a flower, dusty pollen sticks to her fuzzy body. At the next flower, some rubs off — and that helps the flower make seeds! This traveling pollen is called pollination." },
        { id:"butterfly", emoji:"🦋", label:"Butterfly", kind:"fact", anim:"bob",
          text:"A butterfly tastes with its feet! It stands on a leaf and its feet tell it whether the leaf is good for its babies to eat." },
        { id:"maybe", emoji:"🐝", label:"A Bee", kind:"joke", anim:"grow",
          text:"What do you call a bee who cannot make up her mind? A maybe! She giggles and zooms off to the next flower." }
      ],
      game:{ kind:"order", title:"🎮 A Flower Grows",
        intro:"With pollen delivered, a flower can grow and make new seeds. Tap the cards in order to show how a plant grows.",
        cards:[
          { id:"seed",   e:"🌰", t:"Seed" },
          { id:"sprout", e:"🌱", t:"Sprout" },
          { id:"bud",    e:"🌷", t:"Bud" },
          { id:"flower", e:"🌸", t:"Flower" }
        ],
        winText:"Seed, sprout, bud, flower! And inside the flower, new seeds are already starting. The circle begins again." },
      exp:{ kind:"tap", title:"🔬 Help a Flower Make Seeds",
        intro:"Follow one bee on her errand. Press the button to see what happens at each step of pollination!",
        btn:"➡️ What Happens Next?",
        stages:[
          { scene:`<span class="big">🐝 🌸</span><span>A bee lands on a flower to sip nectar…</span>`,
            note:"Dusty yellow pollen brushes onto the bee's fuzzy body. She doesn't even notice!" },
          { scene:`<span class="big">🐝💨 🌼</span><span>The bee flies to a different flower…</span>`,
            note:"Some pollen from the first flower rubs off onto this one. Delivery made!" },
          { scene:`<span class="big">🌼✨ 🌰</span><span>Deep inside the flower, seeds begin to grow.</span>`,
            note:"That dusting of pollen was the missing piece. Now the flower can make seeds." },
          { scene:`<span class="big">🌸🌼🌸🌼</span><span>Next spring: new flowers everywhere!</span>`,
            note:"The seeds fall, sprout, and bloom. The bees helped make a whole new meadow — just by having lunch!" }
        ] }
    }
  ]
},
{
  id:"moon", name:"A Trip to the Moon", emoji:"🌕", badge:"Moon Walker Badge 🌕",
  form:"The wagon sprouts rocket fins and a big glass dome — 3, 2, 1… BLAST OFF!",
  intro:"Miss Maple grins: “We're going to the Moon, Earth's closest neighbor in space! Four of our class moon treasures floated away on the trip up. Keep your eyes open, astronauts!”",
  items:[
    { id:"map",       emoji:"🗺️", name:"the star map" },
    { id:"boot",      emoji:"🥾", name:"the moon boot" },
    { id:"telescope", emoji:"🔭", name:"the tiny telescope" },
    { id:"cheese",    emoji:"🧀", name:"the cheese snack" }
  ],
  stops:[
    { id:"blastoff", name:"Blast Off!", emoji:"🚀",
      intro:"The wagon floats quietly in space. Out one window: our home, Earth. Out the other: the Moon, waiting for us.",
      bg:"linear-gradient(180deg,#26348f,#5b7fd4)",
      hotspots:[
        { id:"earth", emoji:"🌍", label:"Earth", kind:"fact", item:"map", anim:"bob",
          text:"Earth is our home — the only planet where living things are known to live. From out here it looks like a beautiful blue marble." },
        { id:"moonfar", emoji:"🌕", label:"The Moon", kind:"fact", anim:"grow",
          text:"The Moon is Earth's closest neighbor in space. It is so far away that you could line up about 30 Earths in a row between us and the Moon!" },
        { id:"party", emoji:"🚀", label:"Wagon Rocket", kind:"joke", anim:"wiggle",
          text:"How do you organize a space party? You planet! Leo has been saving that one up all morning." }
      ],
      game:{ kind:"targets", title:"🎮 Pack for Space",
        intro:"Tap everything our crew truly needs in space. Silly things can stay home!",
        need:4,
        tiles:[
          { id:"helmet", html:"⛑️", correct:true }, { id:"swim", html:"🩳" },
          { id:"water", html:"💧", correct:true },  { id:"balloon", html:"🎈" },
          { id:"food", html:"🥪", correct:true },   { id:"kite", html:"🪁" },
          { id:"umb", html:"☂️" },                   { id:"lamp", html:"🔦", correct:true }
        ],
        winText:"Helmet, water, food, flashlight — a perfectly packed space bag. Astronauts check their gear just like this!" },
      exp:{ kind:"jump", title:"🔬 The Great Gravity Jump",
        intro:"Gravity is the pull that holds us to the ground. The Moon is much smaller than Earth, so its gravity is much weaker — only about one-sixth as strong. Pick a place, then press JUMP!",
        states:[
          { label:"🌍 Jump on Earth", h:52, d:".6s",
            note:"A good strong jump — and gravity pulls you right back down. This is the jumping you know!" },
          { label:"🌕 Jump on the Moon", h:138, d:"1.5s",
            note:"Wheee! On the Moon you would jump about six times higher — and float slowly, slowly back down. Astronauts bounced everywhere they went!" }
        ] }
    },
    { id:"surface", name:"The Moon's Surface", emoji:"👣",
      intro:"The wagon lands with a soft poof of gray dust. Everything is quiet, gray, and wonderful. Mind the craters!",
      bg:"linear-gradient(180deg,#9aa3b2,#cfd6de)",
      hotspots:[
        { id:"prints", emoji:"👣", label:"Footprints", kind:"fact", item:"boot", anim:"grow",
          text:"Footprints left on the Moon can last for millions of years! The Moon has almost no air, so there is no wind to blow them away and no rain to wash them off." },
        { id:"craters", emoji:"🕳️", label:"Craters", kind:"fact", anim:"bob",
          text:"The Moon's big round holes are called craters. Long, long ago, space rocks crashed into the Moon and left these dents — and they are still there today." },
        { id:"flag", emoji:"🏳️", label:"A Flag", kind:"fact", anim:"wiggle",
          text:"The first people to walk on the Moon landed in the year 1969. Their names were Neil Armstrong and Buzz Aldrin. Imagine — the whole world watched!" }
      ],
      game:{ kind:"path", title:"🎮 Drive the Rover",
        intro:"Our little rover needs directions! Read the map, then tap where the rover should stop.",
        char:"🚙", deco:"🪨", cols:4, rows:3,
        rounds:[
          { say:"The map says: 3 steps RIGHT, then 2 steps UP.", start:[2,0], target:[0,3] },
          { say:"The map says: 2 steps RIGHT, then 1 step UP.", start:[2,0], target:[1,2] }
        ],
        winText:"Beep beep — rover arrived! Real Moon rovers were driven by astronauts, very slowly and very carefully." },
      exp:{ kind:"drop", title:"🔬 Hammer and Feather",
        intro:"On Earth, a feather floats down slowly because air pushes against it. The Moon has almost no air at all. Pick a place, then press DROP and watch carefully!",
        states:[
          { label:"🌍 Drop on Earth", fast:".45s", slow:"2.1s",
            note:"Thud… flutter, flutter, flutter. The hammer lands at once, but the air holds the feather up and slows it down." },
          { label:"🌕 Drop on the Moon", fast:".8s", slow:".8s",
            note:"Thud — together! With no air to slow it, the feather falls just as fast as the hammer. Astronauts really did this experiment on the Moon, and it worked!" }
        ] }
    },
    { id:"farside", name:"The Far Side of the Moon", emoji:"⭐",
      intro:"The wagon glides around to the side of the Moon that never faces Earth. The stars here look extra bright.",
      bg:"linear-gradient(180deg,#141a3d,#2c3a6e)",
      hotspots:[
        { id:"stars", emoji:"⭐", label:"Stars", kind:"fact", anim:"bob",
          text:"Stars are giant balls of glowing gas, so very far away that they look like tiny lights. Our own Sun is a star — it just looks bigger because it is so much closer!" },
        { id:"scope", emoji:"🔭", label:"Telescope", kind:"fact", item:"telescope", anim:"grow",
          text:"The Moon always shows Earth the same face, like a friend who never turns away. The other side is called the far side. It is not always dark — the sun shines there too!" },
        { id:"milkyway", emoji:"🌌", label:"Milky Way", kind:"fact", anim:"wiggle",
          text:"See that pale, milky band of light across the sky? That is the Milky Way — our home galaxy, made of billions and billions of stars, all together." }
      ],
      game:{ kind:"order", title:"🎮 The Moon Phase Parade",
        intro:"The Moon seems to change shape because the sun lights up different parts of it. Tap the moons in order, as the lit part grows bigger and bigger.",
        cards:[
          { id:"new",      e:"🌑", t:"New Moon" },
          { id:"crescent", e:"🌙", t:"Crescent Moon" },
          { id:"half",     e:"🌓", t:"Half Moon" },
          { id:"full",     e:"🌕", t:"Full Moon" }
        ],
        winText:"New, crescent, half, full! The Moon itself never changes shape — only the sunlight paints it differently." },
      exp:{ kind:"slider", title:"🔬 Shine the Sun",
        intro:"Slide the sun around the Moon and watch the lit part change. This is exactly why we see moon phases from Earth!",
        steps:[
          { label:"Sun behind the Moon", scene:`<span class="big">🌑</span><span>The side facing us is all in shadow.</span>`,
            note:"This is the New Moon. The Moon is still there — we just can't see its lit side!" },
          { label:"Sun to the side a little", scene:`<span class="big">🌙</span><span>A thin, smiling sliver lights up.</span>`,
            note:"A Crescent Moon! Only a little curve of the Moon catches the sunlight from where we stand." },
          { label:"Sun right beside the Moon", scene:`<span class="big">🌓</span><span>Half the face we see is lit.</span>`,
            note:"A Half Moon. The sun is shining across the Moon, lighting exactly half of the side that faces Earth." },
          { label:"Sun behind US", scene:`<span class="big">🌕</span><span>The whole face glows!</span>`,
            note:"A Full Moon! Earth sits between the sun and the Moon, so the whole side facing us is lit up bright." }
        ] }
    },
    { id:"basecamp", name:"Moon Base Camp", emoji:"🏕️",
      intro:"Welcome to our cozy moon base! Everything here — every breath of air — was carried all the way from Earth.",
      bg:"linear-gradient(180deg,#8fa3c7,#c3cfe0)",
      hotspots:[
        { id:"tent", emoji:"🏕️", label:"Base Tent", kind:"fact", anim:"bob",
          text:"Astronauts on the Moon must bring all their air, water, and food from Earth. The Moon has no air to breathe and no water to drink — none at all!" },
        { id:"dish", emoji:"📡", label:"Radio Dish", kind:"fact", anim:"wiggle",
          text:"Astronauts talk to Earth using radio waves. Their voices zoom through space at the speed of light — and still take a little over one second to get home!" },
        { id:"solar", emoji:"🔋", label:"Solar Panels", kind:"fact", anim:"grow",
          text:"These dark panels drink in sunlight and turn it into electricity to run the whole base. Sunshine is the Moon base's power plant!" }
      ],
      game:{ kind:"sequence", title:"🎮 Radio Message Home",
        intro:"The base sends messages to Earth as blinking lights! Watch the lights blink, then tap them in the same order to send the message back.",
        symbols:["🔴","🟢","🔵"], rounds:[3,4],
        winText:"Message sent! Somewhere on Earth, a radio dish just blinked back: WE HEAR YOU." },
      exp:{ kind:"toggle", title:"🔬 The Bell That Needs Air",
        intro:"Sound travels through air — it rides on the air like a boat rides on water. Try ringing the base bell in both places!",
        states:[
          { label:"🏕️ Inside the Base (there is air)", scene:`<span class="big anim-wiggle">🔔</span><span>DING! DING! DING!</span>`,
            note:"Inside, the bell rings loud and clear. The air carries the sound to your ears." },
          { label:"🌕 Outside on the Moon (almost no air)", scene:`<span class="big">🔔</span><span>…silence…</span>`,
            note:"Outside, the same bell makes no sound you could hear. With almost no air, the sound has nothing to ride on. Space is a very quiet place!" }
        ] }
    },
    { id:"home", name:"The Trip Home", emoji:"🌍",
      intro:"Time to fly home. The wagon turns toward a blue marble shining in the black sky. Everybody wave goodbye to the Moon!",
      bg:"linear-gradient(180deg,#1d2a5e,#41619e)",
      hotspots:[
        { id:"earthrise", emoji:"🌍", label:"Earthrise", kind:"fact", anim:"bob",
          text:"From the Moon, Earth looks like a bright blue marble hanging in a black sky. Astronauts say it is the prettiest sight in all of space." },
        { id:"goodbye", emoji:"🌙", label:"Goodbye, Moon", kind:"fact", anim:"grow",
          text:"The Moon is very, very slowly drifting away from Earth — about 4 centimeters every year. That is about as fast as your fingernails grow!" },
        { id:"cheese", emoji:"🧀", label:"Cheese Snack", kind:"joke", item:"cheese", anim:"wiggle",
          text:"Is the Moon made of cheese? No! It is made of rock, just like Earth. But Nia says bringing a cheese snack was still a very good idea." }
      ],
      game:{ kind:"targets", title:"🎮 Catch the Twinkling Stars",
        intro:"Tap all 5 twinkling stars to light our way home. Careful — don't tap the space rocks!",
        need:5,
        tiles:[
          { id:"st1", html:"⭐", correct:true }, { id:"rk1", html:"🪨" },
          { id:"st2", html:"⭐", correct:true }, { id:"st3", html:"⭐", correct:true },
          { id:"rk2", html:"🪨" },               { id:"st4", html:"⭐", correct:true },
          { id:"rk3", html:"🪨" },               { id:"st5", html:"⭐", correct:true }
        ],
        winText:"Five stars caught! They twinkle above the wagon all the way home like friendly streetlights." },
      exp:{ kind:"slider", title:"🔬 The Long Way Home",
        intro:"Slide to fly the wagon home, and watch Earth change as we travel!",
        steps:[
          { label:"Leaving the Moon", scene:`<span style="font-size:1.4rem;">🌍</span><span>Earth is a tiny marble, far, far away.</span>`,
            note:"From the Moon, our whole world fits behind your thumbnail. Every person you have ever known lives on that marble!" },
          { label:"Halfway home", scene:`<span style="font-size:2.4rem;">🌍</span><span>Earth is growing bigger…</span>`,
            note:"The closer we fly, the bigger Earth looks. Nothing about Earth changed — only our distance did!" },
          { label:"Almost there", scene:`<span style="font-size:3.6rem;">🌍</span><span>Blue oceans and white swirly clouds!</span>`,
            note:"Now we can see the oceans and clouds. The blue is water, and the white swirls are clouds moving over it." },
          { label:"Home!", scene:`<span style="font-size:4.6rem;">🌍</span><span>Earth fills the whole window!</span>`,
            note:"HOME! The wagon lands softly in the schoolyard. Miss Maple says: the best part of every trip is coming home with new wonders in your pockets." }
        ] }
    }
  ]
},
{
  id:"sea", name:"Under the Sea", emoji:"🐙", badge:"Deep-Sea Diver Badge 🐙",
  form:"The wagon grows a periscope, a propeller, and one big round window — glug, glug, glug!",
  intro:"Miss Maple calls: “All aboard for the ocean! We'll dive from the sunny shallows to the dark, dark deep. Four treasures from our class aquarium have swum away — let's bring them home!”",
  items:[
    { id:"shell",    emoji:"🐚", name:"the spiral shell" },
    { id:"seastar",  emoji:"⭐", name:"the sea star" },
    { id:"pearl",    emoji:"💎", name:"the shiny pearl" },
    { id:"spare",    emoji:"🦀", name:"the hermit crab's spare shell" }
  ],
  stops:[
    { id:"shallows", name:"The Sunny Shallows", emoji:"🌿",
      intro:"Sunbeams dance through clear, warm water. A whole forest of kelp waves at us as we sink down slowly.",
      bg:"linear-gradient(180deg,#7fd4e8,#a8e6f0)",
      hotspots:[
        { id:"kelp", emoji:"🌿", label:"Kelp", kind:"fact", item:"shell", anim:"wiggle",
          text:"Kelp is a giant kind of seaweed. It can grow about 30 centimeters in one single day — as tall as a whole school ruler!" },
        { id:"otter", emoji:"🦦", label:"Sea Otter", kind:"fact", anim:"bob",
          text:"A sea otter wraps itself in kelp like a blanket before its nap, so the waves don't carry it away while it sleeps." },
        { id:"seasun", emoji:"☀️", label:"Sunlight", kind:"fact", anim:"grow",
          text:"Sea plants need sunlight, just like plants on land. That is why kelp forests grow up near the bright, sunny surface." }
      ],
      game:{ kind:"order", title:"🎮 Build a Food Chain",
        intro:"Every sea creature's dinner begins with the sun. Tap in order: who shines, who grows, who munches, and who munches the muncher!",
        cards:[
          { id:"sun",   e:"☀️", t:"Sunshine" },
          { id:"kelp2", e:"🌿", t:"Kelp" },
          { id:"snail", e:"🐌", t:"Sea Snail" },
          { id:"star",  e:"⭐", t:"Sea Star" }
        ],
        winText:"Sunshine feeds the kelp, the snail munches the kelp, and the sea star munches the snail. Dinner chains connect the whole ocean!" },
      exp:{ kind:"tap", title:"🔬 Grow the Kelp",
        intro:"Giant kelp is one of the fastest-growing living things on Earth. Press “Next Day” and watch it grow about 30 centimeters — one ruler — every day!",
        btn:"☀️ Next Day",
        stages:[
          { scene:`<span class="big">🌱</span><span>Day 0 — a tiny kelp sprout. Height: 0 rulers.</span>`, note:"Every giant starts small. This sprout is anchored to a rock on the sea floor." },
          { scene:`<span class="big">🌿</span><span>Day 1 — Height: 1 ruler (30 cm)!</span>`, note:"One day, one whole ruler of growing. The kelp is racing toward the sunlight!" },
          { scene:`<span class="big">🌿🌿</span><span>Day 2 — Height: 2 rulers (60 cm)!</span>`, note:"Air-filled bubbles in the kelp's leaves help it float upward, like tiny life jackets." },
          { scene:`<span class="big">🌿🌿🌿</span><span>Day 3 — Height: 3 rulers (90 cm)!</span>`, note:"Small fish are moving in. A kelp forest is an apartment building for sea animals!" },
          { scene:`<span class="big">🌿🌿🌿🌿</span><span>Day 4 — Height: 4 rulers (120 cm)!</span>`, note:"Sea otters, snails, and fish all live here now. The forest feeds and shelters them all." },
          { scene:`<span class="big">🌿🌿🌿🌿🌿</span><span>Day 5 — Height: 5 rulers (150 cm)!</span>`, note:"Five days, five rulers! Some kelp forests grow as tall as a house — all starting from a sprout smaller than your thumb." }
        ] }
    },
    { id:"reef", name:"The Coral Reef", emoji:"🪸",
      intro:"Colors everywhere! The reef is a busy underwater city, full of neighbors. Let's float slowly and say hello.",
      bg:"linear-gradient(180deg,#64c7e8,#f7c8e0)",
      hotspots:[
        { id:"coral", emoji:"🪸", label:"Coral", kind:"fact", item:"seastar", anim:"grow",
          text:"Coral looks like rock or a plant, but it is built by tiny living animals called polyps. A reef is the city they build together, one tiny layer at a time!" },
        { id:"clown", emoji:"🐠", label:"Clownfish", kind:"fact", anim:"wiggle",
          text:"A clownfish lives safely among the stinging arms of a sea anemone. The anemone guards the fish, and the fish keeps the anemone clean. They help each other!" },
        { id:"turtle", emoji:"🐢", label:"Sea Turtle", kind:"fact", anim:"bob",
          text:"A sea turtle can swim thousands of kilometers across the whole ocean — and still find its way back to the very same beach where it was born." }
      ],
      game:{ kind:"targets", title:"🎮 Who Lives on the Reef?",
        intro:"Tap every animal that makes its home on a coral reef. Land animals are just visiting the wagon today!",
        need:4,
        tiles:[
          { id:"clown2", html:"🐠", correct:true }, { id:"ele", html:"🐘" },
          { id:"turt2", html:"🐢", correct:true },  { id:"monk", html:"🐵" },
          { id:"star2", html:"⭐", correct:true },  { id:"peng", html:"🐧" },
          { id:"lion2", html:"🦁" },                { id:"crab2", html:"🦀", correct:true }
        ],
        winText:"Clownfish, turtle, sea star, and crab — all reef neighbors! Elephants and lions waved from the wagon window instead." },
      exp:{ kind:"tap", title:"🔬 Grow a Coral City",
        intro:"One tiny polyp — an animal smaller than a pea — can start a whole reef. But it takes a very, very long time. Press “Years Pass” and watch!",
        btn:"⏳ Years Pass…",
        stages:[
          { scene:`<span class="big">🪸</span><span>One tiny polyp settles on a rock.</span>`, note:"The polyp is a real animal, with a mouth and tiny arms. It starts building a hard shell around itself." },
          { scene:`<span class="big">🪸🪸</span><span>The polyp copies itself — now there are many!</span>`, note:"Polyps grow buddies right beside them. Together they are called a colony, and their shells join into one." },
          { scene:`<span class="big">🪸🪸🪸</span><span>A small coral stands on the sea floor.</span>`, note:"Layer by layer, year by year, the colony grows. It is building with limestone — the same stuff as chalk!" },
          { scene:`<span class="big">🪸🐠🪸🐢🪸</span><span>A reef city, full of neighbors!</span>`, note:"Some reefs have been growing for thousands of years. A whole underwater city, built by animals smaller than peas!" }
        ] }
    },
    { id:"deep", name:"The Deep, Dark Deep", emoji:"🔦",
      intro:"Down, down we go, past where the sunlight can follow. Turn on the wagon's lights, everybody. It's very dark — and very wonderful — down here.",
      bg:"linear-gradient(180deg,#0d1b3e,#1c2f5e)",
      hotspots:[
        { id:"angler", emoji:"🔦", label:"Anglerfish", kind:"fact", item:"pearl", anim:"bob",
          text:"The anglerfish carries its own flashlight! A glowing lure dangles in front of its mouth, shining in the dark to bring curious fish closer." },
        { id:"dark", emoji:"🌑", label:"The Darkness", kind:"fact", anim:"grow",
          text:"Far below the surface, sunlight cannot reach at all. It is pitch black and very cold, and the water presses down with enormous weight." },
        { id:"snow", emoji:"❄️", label:"Marine Snow", kind:"fact", anim:"wiggle",
          text:"See those tiny white specks drifting down? That is marine snow — crumbs of food falling from the sunny world above. Deep-sea animals catch it and eat it!" }
      ],
      game:{ kind:"sequence", title:"🎮 The Echo Path",
        intro:"Down here we travel by echoes, the way dolphins do. Watch the pings glow, then tap them in the same order to follow the echo path!",
        symbols:["🔵","🟣","🟢"], rounds:[3,4,5],
        winText:"Ping, ping, ping — the echoes led us safely through the dark. Dolphins would be proud!" },
      exp:{ kind:"slider", title:"🔬 Dive Deeper",
        intro:"Slide to dive deeper and deeper. Watch the light — and the animals — change!",
        steps:[
          { label:"0 meters — the sunny zone", scene:`<span class="big">🐠 🐢 🌿</span><span>Bright blue water, full of light.</span>`,
            note:"Sunlight fills this top layer. Almost all ocean animals live in this sunny part!" },
          { label:"200 meters — the twilight zone", scene:`<span class="big">🐙 🦑</span><span>The light is dim and blue-gray.</span>`,
            note:"Only a little sunlight reaches here. Many animals have big eyes to catch what light is left." },
          { label:"600 meters — the midnight zone", scene:`<span class="big">🦑 🌑</span><span>No sunlight at all. Perfect darkness.</span>`,
            note:"Down here the sun never shines. Animals make their own light, or live without eyes. The water presses harder and harder, too." },
          { label:"1,000 meters — the deep deep", scene:`<span class="big">🔦 🐟</span><span>Only the anglerfish's little lamp glows.</span>`,
            note:"It is freezing cold and the water presses with enormous weight — yet animals still live here, calm as can be. The deep is full of surprises!" }
        ] }
    },
    { id:"beach", name:"Back to the Beach", emoji:"🌊",
      intro:"Up we float, back into the sunshine! The wagon bobs in the waves beside a sandy beach. Time to stretch our legs.",
      bg:"linear-gradient(180deg,#ffe9a8,#a8e6f0)",
      hotspots:[
        { id:"waves", emoji:"🌊", label:"Waves", kind:"fact", anim:"wiggle",
          text:"Ocean waves are made by the wind blowing across the top of the water. A windy day means big, splashy waves!" },
        { id:"shells", emoji:"🐚", label:"Shells", kind:"fact", item:"spare", anim:"grow",
          text:"A shell is a hard home that a sea animal built around itself. A hermit crab cannot build one — it moves into empty shells it finds, like this one!" },
        { id:"oceanfact", emoji:"💧", label:"The Ocean", kind:"fact", anim:"bob",
          text:"Almost all the water on Earth is ocean water — about 96 out of every 100 cups of Earth's water are in the ocean!" }
      ],
      game:{ kind:"path", title:"🎮 Help the Hermit Crab",
        intro:"This hermit crab has outgrown its shell and needs a bigger one. Read the directions, then tap the right shell!",
        char:"🦀", deco:"🐚", cols:3, rows:3,
        rounds:[
          { say:"The crab's new shell is 2 steps RIGHT, then 2 steps UP.", start:[2,0], target:[0,2] },
          { say:"Another crab! Its shell is 1 step RIGHT, then 2 steps UP.", start:[2,0], target:[0,1] }
        ],
        winText:"A perfect fit! The crab backs in, wiggles happily, and waves a tiny claw to say thank you." },
      exp:{ kind:"toggle", title:"🔬 The Just-Right Shell",
        intro:"A growing crab needs bigger and bigger shells. Try each shell and see which one fits this crab today!",
        states:[
          { label:"🐚 Tiny Shell", scene:`<span class="big">🦀</span><span>The crab tries to squeeze in… nope!</span>`,
            note:"Too small! The crab has grown, and its old shell doesn't fit anymore. Time to move house." },
          { label:"🐚 Just-Right Shell", scene:`<span class="big anim-bob">🦀</span><span>The crab backs in and wiggles happily!</span>`,
            note:"Just right! Room to wiggle, safe and snug. A hermit crab carries its home everywhere it goes." },
          { label:"🐚 Giant Shell", scene:`<span class="big">🦀</span><span>The crab rattles around inside like a pea in a pot!</span>`,
            note:"Too big! A giant shell is heavy and clumsy. The crab will grow into it one day — but not today." }
        ] }
    },
    { id:"tidepools", name:"The Tide Pools", emoji:"⭐",
      intro:"The tide has gone out, leaving little pools behind in the rocks. Each pool is a tiny sea world of its own!",
      bg:"linear-gradient(180deg,#bde8fb,#ffe9a8)",
      hotspots:[
        { id:"tide", emoji:"🌊", label:"The Tide", kind:"fact", anim:"wiggle",
          text:"Twice a day, the ocean rises and falls along the shore. These are the tides — and they are pulled by the gravity of the Moon!" },
        { id:"pool", emoji:"🦀", label:"Tide Pool", kind:"fact", anim:"bob",
          text:"When the tide goes out, it leaves pools of seawater trapped among the rocks. Crabs, snails, and sea stars wait in the pools until the sea comes back." },
        { id:"seastar2", emoji:"⭐", label:"Sea Star", kind:"fact", anim:"grow",
          text:"A sea star is not a fish at all — that is why scientists call it a sea star instead of a starfish. And if it loses an arm, it can slowly grow a new one!" }
      ],
      game:{ kind:"targets", title:"🎮 Tide Pool Treasures",
        intro:"Tap every sea star hiding in the tide pool. There are 4 of them!",
        need:4,
        tiles:[
          { id:"tp1", html:"⭐", correct:true }, { id:"tp5", html:"🦀" },
          { id:"tp6", html:"🐚" },               { id:"tp2", html:"⭐", correct:true },
          { id:"tp7", html:"🪨" },               { id:"tp3", html:"⭐", correct:true },
          { id:"tp8", html:"🐌" },               { id:"tp4", html:"⭐", correct:true }
        ],
        winText:"All four sea stars found! They wave their arms — well, they would if they could hurry. Sea stars take their time." },
      exp:{ kind:"slider", title:"🔬 Tide In, Tide Out",
        intro:"Slide to watch the tide come and go. Remember what pulls the tides? The Moon — the same Moon we just visited!",
        steps:[
          { label:"Low tide", scene:`<span class="big">🦀 ⭐ 🐚</span><span>The sea has pulled away. Tide pools everywhere!</span>`,
            note:"At low tide, the beach is wide and the pools are full of waiting animals. This is the best time to visit a tide pool!" },
          { label:"The tide is rising", scene:`<span class="big">🌊 🦀 ⭐</span><span>Waves creep closer and closer…</span>`,
            note:"The Moon's gravity is pulling the ocean toward it, and the water climbs up the beach." },
          { label:"High tide", scene:`<span class="big">🌊🌊🌊</span><span>The pools are covered by the sea!</span>`,
            note:"At high tide the pools disappear under the water, and the animals can swim and hunt again." },
          { label:"The tide is falling", scene:`<span class="big">🌊 ⭐ 🦀</span><span>The water slips away, leaving new pools behind.</span>`,
            note:"And so it goes, twice every day, pulled by the Moon — the ocean breathing in and out." }
        ] }
    }
  ]
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
const SAVE_KEY = "wonderWagonSave";
let save = { items: {}, tripsDone: {}, gamesWon: {}, visited: {}, tokens: 0, sound: true };
try {
  const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
  if (raw && typeof raw === "object") save = Object.assign(save, raw);
} catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

/* ================= HELPERS / STATE ================= */
const $ = id => document.getElementById(id);
const FAST = !!window.WW_FAST; // test hook: shortens animation delays
let cur = { trip: null, stop: null };
let pendingTripDone = null;

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
function tripById(id) { return TRIPS.find(t => t.id === id); }
function itemById(trip, id) { return trip.items.find(i => i.id === id); }
function foundItems(trip) { return save.items[trip.id] || []; }
function tripComplete(trip) { return foundItems(trip).length >= trip.items.length; }
function allTripsDone() { return TRIPS.every(t => save.tripsDone[t.id] || tripComplete(t)); }
function totalFound() { return TRIPS.reduce((n, t) => n + foundItems(t).length, 0); }
function totalItems() { return TRIPS.reduce((n, t) => n + t.items.length, 0); }

/* ================= TITLE ================= */
function renderTitle() {
  const done = TRIPS.filter(t => save.tripsDone[t.id] || tripComplete(t)).length;
  $("titleProgress").textContent =
    `Field trips finished: ${done} of ${TRIPS.length} • Treasures found: ${totalFound()} of ${totalItems()} • Wonder Tokens: ${save.tokens} 🪙`;
  $("btnSoundTitle").textContent = save.sound ? "🔊 Sound: On" : "🔇 Sound: Off";
}

/* ================= CLASSROOM ================= */
function renderClassroom() {
  const row = $("classSpots");
  row.innerHTML = "";
  CLASS_SPOTS.forEach(h => {
    const b = document.createElement("button");
    b.className = "hotspot-btn"; b.dataset.hid = h.id;
    b.innerHTML = `<span class="hs-emoji">${h.emoji}</span><span class="hs-label">${h.label}</span>`;
    b.onclick = () => { SoundFX.pop(); openSpot(h, null, null); };
    row.appendChild(b);
  });
  const list = $("tripList");
  list.innerHTML = "";
  TRIPS.forEach(t => {
    const done = save.tripsDone[t.id] || tripComplete(t);
    const card = document.createElement("button");
    card.className = "case-card" + (done ? " solved" : "");
    card.dataset.trip = t.id;
    card.innerHTML = `<span class="cc-emoji">${t.emoji}</span>
      <span><b>${t.name}</b><small>🎁 Treasures found: ${foundItems(t).length} of ${t.items.length} • ${t.stops.length} stops</small></span>
      <span class="cc-status">${done ? "🏅" : "🚌"}</span>`;
    card.onclick = () => openTrip(t.id);
    list.appendChild(card);
  });
  $("explorerZone").hidden = !allTripsDone();
  $("tokenLine").textContent = `🪙 Wonder Tokens: ${save.tokens} — win mini-games to earn tokens, and spend them on Miss Maple's best hints!`;
}

/* ================= TRIP ================= */
function openTrip(tripId) {
  cur.trip = tripById(tripId); cur.stop = null;
  const t = cur.trip;
  $("tripWagon").innerHTML = WAGON_SVG;
  $("tripTitle").textContent = `${t.emoji} ${t.name}`;
  $("tripIntro").textContent = `${t.form} ${t.intro}`;
  $("tripProgress").textContent = `🎁 Lost treasures found: ${foundItems(t).length} of ${t.items.length} — ${t.items.map(i => `${i.emoji} ${i.name}`).join(" • ")}`;
  $("hintBoxTrip").hidden = true;
  const list = $("stopList");
  list.innerHTML = "";
  t.stops.forEach(s => {
    const key = t.id + ":" + s.id;
    const itemHere = s.hotspots.find(h => h.item);
    const got = itemHere && foundItems(t).includes(itemHere.item);
    const status = [save.visited[key] ? "👀" : "", got ? "🎁" : "", save.gamesWon[key] ? "🎮" : ""].join(" ");
    const card = document.createElement("button");
    card.className = "case-card"; card.dataset.stop = s.id;
    card.innerHTML = `<span class="cc-emoji">${s.emoji}</span>
      <span><b>${s.name}</b><small>${itemHere ? (got ? "Treasure found here!" : "A treasure is hiding here…") : "No treasure here — just wonders"}</small></span>
      <span class="cc-status">${status}</span>`;
    card.onclick = () => openStop(s.id);
    list.appendChild(card);
  });
  showScreen("trip");
}

/* ================= STOP ================= */
function openStop(stopId) {
  const t = cur.trip, s = t.stops.find(x => x.id === stopId);
  cur.stop = s;
  save.visited[t.id + ":" + s.id] = true; persist();
  $("stopTripChip").textContent = `${t.emoji} ${t.name}`;
  $("stopTitle").textContent = `${s.emoji} ${s.name}`;
  $("stopIntro").textContent = s.intro;
  $("sceneBox").style.background = s.bg;
  $("hintBoxStop").hidden = true;
  const row = $("hotspotRow");
  row.innerHTML = "";
  s.hotspots.forEach(h => {
    const b = document.createElement("button");
    b.className = "hotspot-btn" + (h.item && foundItems(t).includes(h.item) ? " found" : "");
    b.dataset.hid = h.id;
    b.innerHTML = `<span class="hs-emoji">${h.emoji}</span><span class="hs-label">${h.label}</span>`;
    b.onclick = () => { SoundFX.pop(); openSpot(h, t, s); };
    row.appendChild(b);
  });
  mountGame($("gameArea"), $("gameMsg"), s.game, t.id + ":" + s.id);
  $("gameTitle").textContent = s.game.title;
  $("gameIntro").textContent = s.game.intro;
  mountExp($("expArea"), $("expNote"), s.exp);
  $("expTitle").textContent = s.exp.title;
  $("expIntro").textContent = s.exp.intro;
  showScreen("stop");
}

/* ================= HOTSPOT POPUP ================= */
let spotReturn = "classroom";
function openSpot(h, trip, stop) {
  spotReturn = stop ? "stop" : "classroom";
  $("spotEmoji").textContent = h.emoji;
  $("spotEmoji").className = "spot-emoji" + (h.anim ? " anim-" + h.anim : "");
  $("spotChip").textContent = h.kind === "joke" ? "😄 Giggle" : "⭐ Wonder Fact";
  $("spotText").textContent = h.text;
  const banner = $("spotItem");
  if (trip && h.item && !foundItems(trip).includes(h.item)) {
    const item = itemById(trip, h.item);
    if (!save.items[trip.id]) save.items[trip.id] = [];
    save.items[trip.id].push(h.item); persist();
    banner.hidden = false;
    banner.textContent = `🎁 You found ${item.emoji} ${item.name}! (${foundItems(trip).length} of ${trip.items.length} treasures)`;
    SoundFX.sparkle();
    if (tripComplete(trip) && !save.tripsDone[trip.id]) pendingTripDone = trip.id;
  } else {
    banner.hidden = true;
  }
  $("spotOverlay").hidden = false;
}
function closeSpot() {
  $("spotOverlay").hidden = true;
  if (pendingTripDone) {
    const t = tripById(pendingTripDone); pendingTripDone = null;
    save.tripsDone[t.id] = true; persist();
    showTripDone(t);
  } else if (spotReturn === "stop" && cur.trip && cur.stop) {
    openStop(cur.stop.id); // refresh found-state styling
  } else {
    renderClassroom();
  }
}

/* ================= TRIP DONE / COMPLETE ================= */
function showTripDone(t) {
  $("tripBadge").textContent = `🏅 ${t.badge}`;
  $("tripDoneText").textContent =
    `You found every lost treasure: ${t.items.map(i => `${i.emoji} ${i.name}`).join(", ")}! ` +
    `Leo and Nia cheer, Miss Maple beams, and the wagon does a happy little wiggle. ${t.name} — complete!`;
  $("allDoneZone").hidden = !allTripsDone();
  confettiInto($("confettiZone"), 46);
  SoundFX.fanfare();
  showScreen("tripdone");
}
function showComplete() {
  confettiInto($("confettiZone2"), 46);
  SoundFX.fanfare();
  showScreen("complete");
}

/* ================= MISS MAPLE HINTS ================= */
function mapleHint(onStop) {
  if (onStop && cur.trip && cur.stop) {
    const t = cur.trip, s = cur.stop;
    const h = s.hotspots.find(x => x.item && !foundItems(t).includes(x.item));
    if (!h) {
      $("hintTextStop").textContent = "Miss Maple: “You already found the treasure hiding at this stop. Wonderful exploring! The wagon is proud of you.”";
    } else if (save.tokens > 0) {
      save.tokens--; persist();
      $("hintTextStop").textContent = `Miss Maple spends 1 Wonder Token 🪙 and whispers: “The ${itemById(t, h.item).name} is hiding at the ${h.label}. Tap the ${h.emoji}!”`;
    } else {
      $("hintTextStop").textContent = "Miss Maple: “A treasure is still hiding at this stop. Tap every big picture — bees, boats, and treasures all love to be tapped. Win the mini-game below to earn a token for my very best hint!”";
    }
    $("hintBoxStop").hidden = false;
  } else if (cur.trip) {
    const t = cur.trip;
    const missing = t.stops.filter(s => {
      const h = s.hotspots.find(x => x.item);
      return h && !foundItems(t).includes(h.item);
    });
    $("hintTextTrip").textContent = missing.length
      ? `Miss Maple: “Treasures are still hiding at: ${missing.map(s => s.name).join(", ")}. Wander, tap everything, and try, notice, try again!”`
      : "Miss Maple: “Every treasure on this trip is found. What a class of explorers!”";
    $("hintBoxTrip").hidden = false;
  }
}

/* ================= GAME WIN ================= */
function onGameWin(key, msgEl, winText) {
  if (!save.gamesWon[key]) {
    save.gamesWon[key] = true; save.tokens++; persist();
    msgEl.innerHTML = `🎉 ${winText}<br>🪙 You earned a Wonder Token! (Tokens: ${save.tokens})`;
  } else {
    msgEl.innerHTML = `🎉 ${winText}`;
  }
  SoundFX.correct();
}
function gentle(msgEl, text) {
  msgEl.innerHTML = `<span class="try">${text}</span>`;
  SoundFX.wrong();
}

/* ================= MINI-GAME ENGINES ================= */
function mountGame(area, msgEl, cfg, key) {
  area.innerHTML = ""; msgEl.innerHTML = "";
  ({ sequence: mountSequence, order: mountOrder, targets: mountTargets, path: mountPath })[cfg.kind](area, msgEl, cfg, key);
}

/* --- watch & repeat (waggle dance, echo path, radio message) --- */
function mountSequence(area, msgEl, cfg, key) {
  let round = 0, seq = [], input = [], busy = false;
  const stage = document.createElement("div"); stage.className = "seq-stage";
  const prog = document.createElement("p"); prog.className = "seq-progress";
  const btns = cfg.symbols.map(sym => {
    const b = document.createElement("button");
    b.className = "seq-btn"; b.textContent = sym; b.dataset.sym = sym;
    b.onclick = () => tap(sym, b);
    stage.appendChild(b); return b;
  });
  area.appendChild(stage); area.appendChild(prog);
  const delay = FAST ? 40 : 550;
  function setEnabled(on) { btns.forEach(b => b.disabled = !on); }
  function startRound() {
    input = []; busy = true; setEnabled(false);
    seq = Array.from({ length: cfg.rounds[round] }, () => cfg.symbols[Math.floor(Math.random() * cfg.symbols.length)]);
    window.WW.currentSeq = seq.slice();
    prog.textContent = `Round ${round + 1} of ${cfg.rounds.length} — watch…`;
    seq.forEach((sym, i) => {
      setTimeout(() => {
        const b = btns[cfg.symbols.indexOf(sym)];
        b.classList.add("flash"); SoundFX.pop();
        setTimeout(() => b.classList.remove("flash"), FAST ? 30 : 380);
      }, delay * (i + 1));
    });
    setTimeout(() => { busy = false; setEnabled(true); prog.textContent = `Round ${round + 1} of ${cfg.rounds.length} — your turn!`; }, delay * (seq.length + 1));
  }
  function tap(sym, b) {
    if (busy) return;
    b.classList.add("flash"); setTimeout(() => b.classList.remove("flash"), 200);
    input.push(sym);
    const i = input.length - 1;
    if (input[i] !== seq[i]) {
      busy = true; setEnabled(false);
      gentle(msgEl, "Oops — that step was different. No worries at all! Watch the dance once more, then try again.");
      setTimeout(startRoundReplay, FAST ? 60 : 900);
      return;
    }
    SoundFX.pop();
    if (input.length === seq.length) {
      round++;
      if (round >= cfg.rounds.length) { setEnabled(false); prog.textContent = "⭐ Finished! ⭐"; onGameWin(key, msgEl, cfg.winText); }
      else { prog.textContent = "⭐ You copied it! Here comes the next round…"; setTimeout(startRound, FAST ? 60 : 1100); }
    }
  }
  function startRoundReplay() { input = []; busy = true;
    seq.forEach((sym, i) => {
      setTimeout(() => {
        const b = btns[cfg.symbols.indexOf(sym)];
        b.classList.add("flash");
        setTimeout(() => b.classList.remove("flash"), FAST ? 30 : 380);
      }, delay * (i + 1));
    });
    setTimeout(() => { busy = false; setEnabled(true); prog.textContent = `Round ${round + 1} of ${cfg.rounds.length} — your turn!`; }, delay * (seq.length + 1));
  }
  startRound();
}

/* --- tap cards in the right order (life cycles, food chain, phases) --- */
function mountOrder(area, msgEl, cfg, key) {
  let next = 0;
  const slots = document.createElement("div"); slots.className = "order-slots";
  const row = document.createElement("div"); row.className = "order-row";
  area.appendChild(slots); area.appendChild(row);
  function drawSlots() { slots.textContent = cfg.cards.map((c, i) => i < next ? c.e : "☆").join(" "); }
  drawSlots();
  shuffle(cfg.cards).forEach(c => {
    const b = document.createElement("button");
    b.className = "order-card"; b.dataset.cid = c.id;
    b.innerHTML = `<span class="oc-emoji">${c.e}</span><span class="oc-text">${c.t}</span>`;
    b.onclick = () => {
      if (b.classList.contains("done")) return;
      if (cfg.cards[next].id === c.id) {
        b.classList.add("done"); next++; drawSlots(); SoundFX.pop();
        if (next === cfg.cards.length) onGameWin(key, msgEl, cfg.winText);
        else gentle(msgEl, `Yes! ${c.t} is right. What comes next?`);
      } else {
        b.classList.add("shake"); setTimeout(() => b.classList.remove("shake"), 380);
        gentle(msgEl, `Good guess! ${c.t} comes later in the story. Which one comes at step ${next + 1}? Miss Maple believes in you.`);
      }
    };
    row.appendChild(b);
  });
}

/* --- tap all the right tiles (hexagons, packing, reef animals, stars) --- */
function mountTargets(area, msgEl, cfg, key) {
  let got = 0;
  const grid = document.createElement("div"); grid.className = "target-grid";
  area.appendChild(grid);
  shuffle(cfg.tiles).forEach(t => {
    const b = document.createElement("button");
    b.className = "target-tile"; b.dataset.tid = t.id;
    b.innerHTML = t.html;
    b.onclick = () => {
      if (b.classList.contains("got")) return;
      if (t.correct) {
        b.classList.add("got"); got++; SoundFX.pop();
        if (got >= cfg.need) onGameWin(key, msgEl, cfg.winText);
        else gentle(msgEl, `That's one! ${got} of ${cfg.need} found. Keep looking!`);
      } else {
        b.classList.add("wiggle"); setTimeout(() => b.classList.remove("wiggle"), 380);
        gentle(msgEl, "Not that one — but good exploring! Scientists look at everything closely, just like you're doing.");
      }
    };
    grid.appendChild(b);
  });
}

/* --- follow directions on a grid (dance map, rover, hermit crab) --- */
function mountPath(area, msgEl, cfg, key) {
  let round = 0;
  const say = document.createElement("p"); say.className = "seq-progress";
  const grid = document.createElement("div"); grid.className = "path-grid";
  grid.style.gridTemplateColumns = `repeat(${cfg.cols},1fr)`;
  area.appendChild(say); area.appendChild(grid);
  function drawRound() {
    const r = cfg.rounds[round];
    say.textContent = `Round ${round + 1} of ${cfg.rounds.length}: ${r.say}`;
    grid.innerHTML = "";
    for (let row = 0; row < cfg.rows; row++) {
      for (let col = 0; col < cfg.cols; col++) {
        const b = document.createElement("button");
        b.className = "path-cell"; b.dataset.r = row; b.dataset.c = col;
        const isStart = r.start[0] === row && r.start[1] === col;
        b.textContent = isStart ? cfg.char : cfg.deco;
        if (isStart) b.classList.add("start");
        b.onclick = () => {
          if (row === r.target[0] && col === r.target[1]) {
            b.classList.add("goal"); b.textContent = "⭐"; SoundFX.correct();
            round++;
            if (round >= cfg.rounds.length) onGameWin(key, msgEl, cfg.winText);
            else { gentle(msgEl, "You found it! One more set of directions…"); setTimeout(drawRound, FAST ? 60 : 1000); }
          } else {
            b.classList.add("wiggle"); setTimeout(() => b.classList.remove("wiggle"), 380);
            gentle(msgEl, "A nice spot, but the directions point somewhere else. Count the steps again — up means toward the top!");
          }
        };
        grid.appendChild(b);
      }
    }
  }
  drawRound();
}

/* ================= EXPERIMENT ENGINES ================= */
function mountExp(area, noteEl, cfg) {
  area.innerHTML = ""; noteEl.textContent = "";
  ({ toggle: mountToggle, tap: mountTapProcess, slider: mountSlider, jump: mountJump, drop: mountDrop })[cfg.kind](area, noteEl, cfg);
}
function expScene(area, html) {
  area.innerHTML = "";
  const d = document.createElement("div");
  d.className = "exp-scene"; d.innerHTML = html;
  area.appendChild(d); return d;
}

/* --- switch between states and watch what changes (bee eyes, bell, shells) --- */
function mountToggle(area, noteEl, cfg) {
  const scene = expScene(area, cfg.states[0].scene);
  noteEl.textContent = cfg.states[0].note;
  const row = document.createElement("div"); row.className = "toggle-row";
  area.appendChild(row);
  cfg.states.forEach((st, i) => {
    const b = document.createElement("button");
    b.className = "toggle-btn" + (i === 0 ? " on" : ""); b.textContent = st.label; b.dataset.state = i;
    b.onclick = () => {
      row.querySelectorAll(".toggle-btn").forEach(x => x.classList.remove("on"));
      b.classList.add("on");
      scene.innerHTML = st.scene; noteEl.textContent = st.note; SoundFX.pop();
    };
    row.appendChild(b);
  });
}

/* --- press to advance a process, stage by stage (fanning, growing) --- */
function mountTapProcess(area, noteEl, cfg) {
  let stage = 0;
  const scene = expScene(area, cfg.stages[0].scene);
  noteEl.textContent = cfg.stages[0].note;
  const row = document.createElement("div"); row.className = "ctl-row";
  const b = document.createElement("button");
  b.className = "play-btn purple"; b.textContent = cfg.btn;
  row.appendChild(b); area.appendChild(row);
  b.onclick = () => {
    if (stage >= cfg.stages.length - 1) return;
    stage++;
    scene.innerHTML = cfg.stages[stage].scene;
    noteEl.textContent = cfg.stages[stage].note;
    SoundFX.pop();
    if (stage >= cfg.stages.length - 1) { b.disabled = true; b.textContent = "✓ Finished!"; SoundFX.correct(); }
  };
}

/* --- slide through steps and watch the world respond --- */
function mountSlider(area, noteEl, cfg) {
  const scene = expScene(area, cfg.steps[0].scene);
  noteEl.textContent = cfg.steps[0].note;
  const input = document.createElement("input");
  input.type = "range"; input.className = "big-range";
  input.min = 0; input.max = cfg.steps.length - 1; input.step = 1; input.value = 0;
  input.setAttribute("aria-label", cfg.title);
  const labels = document.createElement("div"); labels.className = "range-labels";
  labels.innerHTML = `<span>${cfg.steps[0].label}</span><span>${cfg.steps[cfg.steps.length - 1].label}</span>`;
  const cur = document.createElement("p"); cur.className = "seq-progress"; cur.textContent = cfg.steps[0].label;
  area.appendChild(input); area.appendChild(labels); area.appendChild(cur);
  input.addEventListener("input", () => {
    const st = cfg.steps[Number(input.value)];
    scene.innerHTML = st.scene; noteEl.textContent = st.note; cur.textContent = st.label;
  });
}

/* --- gravity jump: pick a world, then jump (Moon trip) --- */
function mountJump(area, noteEl, cfg) {
  let mode = 0;
  const zone = document.createElement("div"); zone.className = "exp-scene";
  zone.innerHTML = `<div class="jump-zone"><span class="jumper" id="wwJumper">🧑‍🚀</span><div class="jump-ground"></div></div>`;
  area.appendChild(zone);
  noteEl.textContent = "Pick a place, then press JUMP!";
  const row = document.createElement("div"); row.className = "toggle-row"; area.appendChild(row);
  cfg.states.forEach((st, i) => {
    const b = document.createElement("button");
    b.className = "toggle-btn" + (i === 0 ? " on" : ""); b.textContent = st.label; b.dataset.state = i;
    b.onclick = () => { row.querySelectorAll(".toggle-btn").forEach(x => x.classList.remove("on")); b.classList.add("on"); mode = i; SoundFX.pop(); };
    row.appendChild(b);
  });
  const row2 = document.createElement("div"); row2.className = "ctl-row";
  const jb = document.createElement("button");
  jb.className = "play-btn"; jb.textContent = "🦘 JUMP!";
  row2.appendChild(jb); area.appendChild(row2);
  jb.onclick = () => {
    const j = $("wwJumper"); if (!j) return;
    const st = cfg.states[mode];
    j.style.setProperty("--jh", st.h + "px");
    j.style.setProperty("--jd", st.d);
    j.classList.remove("jumping"); void j.offsetWidth; j.classList.add("jumping");
    noteEl.textContent = st.note; SoundFX.correct();
  };
}

/* --- hammer & feather drop: air changes everything (Moon trip) --- */
function mountDrop(area, noteEl, cfg) {
  let mode = 0;
  const zone = document.createElement("div"); zone.className = "exp-scene";
  zone.innerHTML = `<div class="drop-zone">
      <span class="drop-item" id="wwHammer" style="left:22%;">🔨</span>
      <span class="drop-item" id="wwFeather" style="left:62%;">🪶</span>
      <div class="jump-ground"></div></div>`;
  area.appendChild(zone);
  noteEl.textContent = "Pick a place, then press DROP!";
  const row = document.createElement("div"); row.className = "toggle-row"; area.appendChild(row);
  cfg.states.forEach((st, i) => {
    const b = document.createElement("button");
    b.className = "toggle-btn" + (i === 0 ? " on" : ""); b.textContent = st.label; b.dataset.state = i;
    b.onclick = () => {
      row.querySelectorAll(".toggle-btn").forEach(x => x.classList.remove("on")); b.classList.add("on"); mode = i;
      ["wwHammer", "wwFeather"].forEach(id => { const el = $(id); if (el) el.classList.remove("falling"); });
      SoundFX.pop();
    };
    row.appendChild(b);
  });
  const row2 = document.createElement("div"); row2.className = "ctl-row";
  const db = document.createElement("button");
  db.className = "play-btn"; db.textContent = "⬇️ DROP!";
  row2.appendChild(db); area.appendChild(row2);
  db.onclick = () => {
    const st = cfg.states[mode];
    const ham = $("wwHammer"), fea = $("wwFeather");
    if (!ham || !fea) return;
    ham.classList.remove("falling"); fea.classList.remove("falling");
    void ham.offsetWidth;
    ham.style.setProperty("--fd", st.fast); fea.style.setProperty("--fd", st.slow);
    ham.classList.add("falling"); fea.classList.add("falling");
    noteEl.textContent = st.note; SoundFX.correct();
  };
}

/* ================= INIT / NAV ================= */
$("titleWagon").innerHTML = WAGON_SVG;
renderTitle();
$("btnStart").onclick = () => { renderClassroom(); showScreen("classroom"); };
$("btnSoundTitle").onclick = () => { save.sound = !save.sound; persist(); renderTitle(); if (save.sound) SoundFX.pop(); };
$("btnSpotClose").onclick = closeSpot;
$("btnBackStop").onclick = () => openTrip(cur.trip.id);
$("btnStopDone").onclick = () => openTrip(cur.trip.id);
$("btnHintTrip").onclick = () => mapleHint(false);
$("btnHintStop").onclick = () => mapleHint(true);
$("btnExplorer").onclick = showComplete;
$("btnExplorer2").onclick = showComplete;
document.querySelectorAll("[data-nav]").forEach(b => {
  b.onclick = () => {
    const t = b.dataset.nav;
    if (t === "title") { renderTitle(); showScreen("title"); }
    else if (t === "classroom") { renderClassroom(); showScreen("classroom"); }
  };
});

/* Debug/test handle (also handy for support) */
window.WW = { TRIPS, CLASS_SPOTS, save, openTrip, openStop, currentSeq: [], get cur() { return cur; } };
