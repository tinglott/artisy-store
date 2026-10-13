/**
 * Jaws Trouble: Race to the Reef — Digital Edition UI
 * Menu + Solo-vs-Bots + Pass & Play, animated movement, save/resume.
 * Original UI implementation built on the project's pure rules engine.
 */
import {
  BOARD, BOARD_SIZE, makePlayer, newGameState, rollDie,
  movePiece, selectShark, canDeclareAttack, declareAttack,
  checkWinner, SPACE_ICONS, getLegalMoves, piecesAtHome,
  piecesFinished, piecesOnTrack, startIndexForPlayer,
} from "./game-engine.js";
import { chooseBotMove, chooseBotAttack } from "./bots.js";

const COLOR_OPTIONS = ["#E85D4C", "#2E6FBA", "#3FA34D", "#F2C744"];
const COLOR_NAMES = ["Coral", "Ocean", "Kelp", "Sunshine"];
const BOT_NAMES = ["Bubbles", "Fin Diesel", "Coral", "Marina", "Sandy", "Reef"];
const SAVE_KEY = "jaws_trouble_digital_save_v1";

let mode = "solo";                 // "solo" | "pass"
let botIds = new Set();            // player ids controlled by the computer
let players = [];                  // setup form state (pass & play)
let game = null;
let roleCheckQueue = [];
let busy = false;                  // animation / bot turn in progress
let soundEnabled = true;
let pendingMoves = null;
let visualPos = new Map();         // "pid:pieceId" -> track index during animation
let pawnEls = new Map();           // "pid:pieceId" -> element (persistent pawns)

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const keyOf = (pid, pieceId) => `${pid}:${pieceId}`;

// ---------- Audio ----------
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();
}
function beep(freq, duration = 0.12, type = "sine", gain = 0.12) {
  if (!soundEnabled) return;
  try {
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start();
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.stop(audioCtx.currentTime + duration);
  } catch (_) {}
}
const playRollSound = () => { beep(180, 0.08); setTimeout(() => beep(260, 0.08), 70); setTimeout(() => beep(340, 0.1), 140); };
const playMoveSound = () => beep(520, 0.1, "triangle", 0.1);
const playTreasureSound = () => { beep(660, 0.12); setTimeout(() => beep(880, 0.15), 100); };
const playAttackSound = () => { beep(120, 0.25, "sawtooth", 0.15); setTimeout(() => beep(90, 0.3, "sawtooth", 0.12), 180); };
const playWinSound = () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.2, "sine", 0.14), i * 140)); };
const playClick = () => beep(400, 0.06, "square", 0.06);

// ---------- Screens ----------
function showScreen(name) {
  ["menu", "setup", "rolecheck", "game"].forEach((s) => {
    $(`screen-${s}`).classList.toggle("hidden", s !== name);
  });
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

// ---------- Menu / setup ----------
$("btn-mode-solo").addEventListener("click", () => { playClick(); openSetup("solo"); });
$("btn-mode-pass").addEventListener("click", () => { playClick(); openSetup("pass"); });
$("btn-back-menu").addEventListener("click", () => { playClick(); refreshContinueBtn(); showScreen("menu"); });
$("btn-howto").addEventListener("click", () => { playClick(); $("modal-howto").classList.remove("hidden"); });
$("btn-howto-close").addEventListener("click", () => { playClick(); $("modal-howto").classList.add("hidden"); });
$("btn-sound").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  $("btn-sound").textContent = soundEnabled ? "🔊 Sound" : "🔇 Muted";
  $("btn-sound").setAttribute("aria-pressed", soundEnabled ? "true" : "false");
  if (soundEnabled) playClick();
});

function openSetup(which) {
  mode = which;
  $("setup-solo").classList.toggle("hidden", which !== "solo");
  $("setup-pass").classList.toggle("hidden", which !== "pass");
  if (which === "pass") renderPlayerForm();
  updateBotNote();
  showScreen("setup");
}

function updateBotNote() {
  const n = +$("bot-count").value;
  $("bot-names-note").textContent = "Your opponents: " + BOT_NAMES.slice(0, n).join(", ") + ".";
}
$("bot-count").addEventListener("change", updateBotNote);

function renderPlayerForm() {
  const count = +$("player-count").value;
  while (players.length < count) {
    players.push({ name: `Player ${players.length + 1}`, color: COLOR_OPTIONS[players.length % COLOR_OPTIONS.length] });
  }
  while (players.length > count) players.pop();

  const wrap = $("player-form-list");
  wrap.innerHTML = "";
  players.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "panel";
    row.style.marginTop = "12px";
    row.innerHTML = `
      <label for="name-${i}">Player ${i + 1} name</label>
      <input type="text" id="name-${i}" data-idx="${i}" class="name-input" value="${escapeAttr(p.name)}" maxlength="16" placeholder="e.g. Jordan" autocomplete="off" />
      <label>Color</label>
      <div class="color-picker" data-idx="${i}" role="group"></div>
    `;
    const picker = row.querySelector(".color-picker");
    COLOR_OPTIONS.forEach((c, ci) => {
      const sw = document.createElement("button");
      sw.type = "button";
      sw.className = "swatch" + (p.color === c ? " selected" : "");
      sw.style.background = c;
      sw.setAttribute("aria-label", COLOR_NAMES[ci]);
      sw.setAttribute("aria-pressed", p.color === c ? "true" : "false");
      sw.addEventListener("click", () => {
        const used = players.map((x) => x.color);
        if (used.includes(c) && p.color !== c) {
          const other = players.find((x) => x.color === c);
          if (other) other.color = p.color;
        }
        p.color = c;
        playClick();
        renderPlayerForm();
      });
      picker.appendChild(sw);
    });
    wrap.appendChild(row);
  });

  wrap.querySelectorAll(".name-input").forEach((inp) => {
    inp.addEventListener("input", (e) => { players[+e.target.dataset.idx].name = e.target.value; });
  });
}
$("player-count").addEventListener("change", () => { playClick(); renderPlayerForm(); });

$("btn-start-game").addEventListener("click", () => {
  playClick();
  let gamePlayers;
  botIds = new Set();
  if (mode === "solo") {
    const humanName = ($("solo-name").value || "You").trim() || "You";
    gamePlayers = [makePlayer("p0", humanName, COLOR_OPTIONS[0])];
    const n = +$("bot-count").value;
    for (let i = 0; i < n; i++) {
      const bp = makePlayer(`p${i + 1}`, BOT_NAMES[i], COLOR_OPTIONS[(i + 1) % COLOR_OPTIONS.length]);
      botIds.add(bp.id);
      gamePlayers.push(bp);
    }
  } else {
    const count = +$("player-count").value;
    gamePlayers = players.slice(0, count).map((p, i) => makePlayer(`p${i}`, p.name || `Player ${i + 1}`, p.color));
  }
  game = newGameState(gamePlayers);
  pawnEls.clear();
  clearSave();
  startRoleCheckRound();
  saveGame();
});

// ---------- Save / resume ----------
function saveGame() {
  if (!game) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ game, mode, botIds: [...botIds] }));
  } catch (_) {}
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (_) {} }
function refreshContinueBtn() {
  let has = false;
  try { has = !!localStorage.getItem(SAVE_KEY); } catch (_) {}
  $("btn-continue").classList.toggle("hidden", !has);
}
$("btn-continue").addEventListener("click", () => {
  playClick();
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!data || !data.game) return;
    game = data.game;
    mode = data.mode || "pass";
    botIds = new Set(data.botIds || []);
    pawnEls.clear();
    showScreen("game");
    buildBoardSpaces();
    renderAll();
    log("▶ Game resumed. Good luck out there!");
    maybeDriveBot();
  } catch (_) {}
});
$("btn-quit").addEventListener("click", () => {
  playClick();
  saveGame();
  refreshContinueBtn();
  showScreen("menu");
});

// ---------- Shark Selection ----------
function startRoleCheckRound() {
  selectShark(game);
  if (mode === "solo") {
    // Only the human peeks; bot roles stay secret.
    roleCheckQueue = ["p0"];
    $("rolecheck-instructions").firstChild.textContent = "New round! Only you peek — the bots keep their secrets. Pass the device to ";
  } else {
    roleCheckQueue = game.players.map((p) => p.id);
  }
  showScreen("rolecheck");
  nextRoleCheck();
}

function nextRoleCheck() {
  if (roleCheckQueue.length === 0) { beginRound(); return; }
  const id = roleCheckQueue[0];
  const player = game.players.find((p) => p.id === id);
  $("rolecheck-name").textContent = player.name;
  $("rolecheck-name").style.color = player.color;
  $("modal-role").classList.add("hidden");
}

$("btn-peek").addEventListener("click", () => {
  playClick();
  const id = roleCheckQueue[0];
  const content = $("modal-role-content");
  if (id === game.sharkId) {
    content.innerHTML = `
      <p class="shark-reveal">🦈 You are JAWS!</p>
      <p>Keep it secret. Once per round you may declare an attack on a swimmer that is on or next to one of your pieces (not on a Lifeguard Tower).</p>
    `;
  } else {
    content.innerHTML = `
      <p class="swimmer-reveal">🏊 You are a Swimmer.</p>
      <p>Get your 4 swimmers safely home. Watch out for Jaws!</p>
    `;
  }
  $("modal-role").classList.remove("hidden");
});

$("btn-role-continue").addEventListener("click", () => {
  playClick();
  $("modal-role").classList.add("hidden");
  roleCheckQueue.shift();
  nextRoleCheck();
});

// ---------- Round flow ----------
function beginRound() {
  showScreen("game");
  buildBoardSpaces();
  renderAll();
  $("die-display").textContent = "?";
  busy = false;
  pendingMoves = null;
  saveGame();
  maybeDriveBot();
}

function currentPlayer() {
  return game.players[game.turnIndex % game.players.length];
}
function isBot(player) { return botIds.has(player.id); }

function updateTurnBanner() {
  const p = currentPlayer();
  if (!p) return;
  let extra = game.extraTurn ? " (extra turn!)" : "";
  let thinking = isBot(p) ? ` <span class="thinking">— thinking…</span>` : "";
  $("turn-banner").innerHTML = `Round ${game.round} — <strong style="color:${p.color}">${escapeAttr(p.name)}</strong>${isBot(p) ? '<span class="bot-badge">BOT</span>' : ""}'s turn to POP!${extra}${thinking}`;
}

function log(...lines) {
  game.log.push(...lines);
  renderLog();
}
function renderLog() {
  const box = $("log-box");
  box.innerHTML = game.log.slice(-40).map((l) => `<p>${l}</p>`).join("");
  box.scrollTop = box.scrollHeight;
}

// ---------- Board rendering (persistent pawns so CSS transitions animate) ----------
function buildBoardSpaces() {
  const wrap = $("board-wrap");
  wrap.querySelectorAll(".space").forEach((el) => el.remove());
  const radius = 46, center = 50;
  BOARD.forEach((space, i) => {
    const angle = (i / BOARD_SIZE) * 2 * Math.PI - Math.PI / 2;
    const el = document.createElement("div");
    el.className = "space" + (space.type === "shore" ? " shore" : "") + (space.type === "lifeguard" ? " safe" : "");
    el.style.left = center + radius * Math.cos(angle) + "%";
    el.style.top = center + radius * Math.sin(angle) + "%";
    el.style.background = space.color;
    el.title = `${space.zone} — ${space.type}`;
    const icon = document.createElement("span");
    icon.className = "type-icon";
    icon.textContent = SPACE_ICONS[space.type] || "";
    el.appendChild(icon);
    wrap.appendChild(el);
  });
  pawnEls.clear();
  placePawns();
}

function spaceXY(pos, slot) {
  const radius = 46, center = 50;
  const angle = (pos / BOARD_SIZE) * 2 * Math.PI - Math.PI / 2;
  const offsets = [[0, 0], [3, 0], [-3, 0], [0, 3], [0, -3], [2.2, 2.2], [-2.2, 2.2], [2.2, -2.2]];
  const [ox, oy] = offsets[slot % offsets.length];
  return { x: center + radius * Math.cos(angle) + ox, y: center + radius * Math.sin(angle) + oy };
}

function placePawns(spawnKey = null) {
  const wrap = $("board-wrap");
  const seen = new Set();
  const bySpace = new Map();
  const current = game ? currentPlayer() : null;

  game.players.forEach((p) => {
    p.pieces.forEach((piece) => {
      const k = keyOf(p.id, piece.id);
      const vpos = visualPos.has(k) ? visualPos.get(k) : piece.position;
      if (vpos < 0 || vpos >= BOARD_SIZE) return;
      seen.add(k);
      const slot = bySpace.get(vpos) || 0;
      bySpace.set(vpos, slot + 1);
      let el = pawnEls.get(k);
      if (!el) {
        el = document.createElement("div");
        el.className = "pawn";
        el.style.background = p.color;
        el.title = `${p.name} piece ${piece.id + 1}`;
        wrap.appendChild(el);
        pawnEls.set(k, el);
        if (k === spawnKey) el.classList.add("spawned");
      }
      el.classList.toggle("current-turn", !!current && p.id === current.id);
      const { x, y } = spaceXY(vpos, slot);
      el.style.left = x + "%";
      el.style.top = y + "%";
    });
  });
  // Remove pawns that left the track (home / finished)
  for (const [k, el] of [...pawnEls.entries()]) {
    if (!seen.has(k)) { el.remove(); pawnEls.delete(k); }
  }
}

function renderPlayers() {
  const ul = $("player-list");
  ul.innerHTML = "";
  game.players.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="dot" style="background:${p.color}"></span>
      <span style="flex:1">${escapeAttr(p.name)}${isBot(p) ? '<span class="bot-badge">BOT</span>' : ""}</span>
      <span style="font-size:0.8rem;color:var(--sand-dark)">
        🏠${piecesAtHome(p)} · 🌊${piecesOnTrack(p).length} · 🏁${piecesFinished(p)} · 🐚${p.shells}
      </span>
    `;
    ul.appendChild(li);
  });
}

function renderHomes() {
  const row = $("homes-row");
  row.innerHTML = "";
  game.players.forEach((p) => {
    const box = document.createElement("div");
    box.className = "home-box";
    box.innerHTML = `<div class="home-label" style="color:${p.color}">${escapeAttr(p.name)}</div>`;
    const piecesDiv = document.createElement("div");
    piecesDiv.className = "home-pieces";
    p.pieces.forEach((pc) => {
      if (pc.position === -1) {
        const d = document.createElement("div");
        d.className = "home-piece";
        d.style.background = p.color;
        piecesDiv.appendChild(d);
      }
    });
    const fin = piecesFinished(p);
    if (fin > 0) {
      const f = document.createElement("span");
      f.style.fontSize = "0.75rem";
      f.style.color = "var(--sand-dark)";
      f.textContent = ` 🏁${fin}`;
      piecesDiv.appendChild(f);
    }
    box.appendChild(piecesDiv);
    row.appendChild(box);
  });
}

function renderAll() {
  placePawns();
  renderPlayers();
  renderHomes();
  updateTurnBanner();
  renderLog();
  checkForTagOpportunity();
  $("btn-roll").disabled = busy || isBot(currentPlayer());
}

// ---------- Roll & Move ----------
$("btn-roll").addEventListener("click", () => {
  if (busy || !game || pendingMoves) return;
  const p = currentPlayer();
  if (!p || isBot(p)) return;
  doRoll(p);
});

async function doRoll(player) {
  busy = true;
  $("btn-roll").disabled = true;

  if (player.skipNextTurn) {
    player.skipNextTurn = false;
    log(`⏭️ ${player.name} sits this turn out (Rough Current).`);
    playClick();
    await wait(700);
    busy = false;
    finishTurn(player, false);
    return;
  }

  playRollSound();
  const dieEl = $("die-display");
  dieEl.classList.add("die-rolling");
  for (let i = 0; i < 9; i++) {
    dieEl.textContent = 1 + Math.floor(Math.random() * 6);
    await wait(70);
  }
  const result = rollDie();
  dieEl.textContent = result;
  dieEl.classList.remove("die-rolling");
  game.lastRoll = result;

  const legal = getLegalMoves(player, result, game);
  if (legal.length === 0) {
    log(`🎲 ${player.name} rolled ${result} but has no legal moves.`);
    await wait(800);
    busy = false;
    finishTurn(player, result === 6);
    return;
  }

  if (isBot(player)) {
    await wait(450);
    const mv = chooseBotMove(player, legal, game);
    await executeMove(player, mv.piece, mv.target, result);
  } else if (legal.length === 1) {
    await executeMove(player, legal[0].piece, legal[0].target, result);
  } else {
    pendingMoves = { steps: result, moves: legal };
    busy = false;
    showPieceSelect(player, legal, result);
    return; // turn finishes inside executeMove after the human picks
  }
  busy = false;
  finishTurn(player, result === 6);
}

function showPieceSelect(player, moves, steps) {
  const list = $("piece-select-list");
  list.innerHTML = "";
  $("piece-select-title").textContent = `${player.name}: choose swimmer for ${steps}`;
  moves.forEach(({ piece, target }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-secondary";
    b.style.background = player.color;
    let label = `Piece ${piece.id + 1}`;
    if (piece.position === -1) label += " (Home → Start)";
    else if (target >= BOARD_SIZE) label += " → Finish!";
    else label += ` → space ${target + 1}`;
    b.textContent = label;
    b.addEventListener("click", async () => {
      $("modal-piece-select").classList.add("hidden");
      pendingMoves = null;
      busy = true;
      await executeMove(player, piece, target, steps);
      busy = false;
      finishTurn(player, steps === 6);
    });
    list.appendChild(b);
  });
  $("modal-piece-select").classList.remove("hidden");
}

$("btn-cancel-piece").addEventListener("click", () => {
  // Cancelling a choice re-offers the same roll's moves (no free re-roll).
  playClick();
  $("modal-piece-select").classList.add("hidden");
  if (pendingMoves) {
    const { steps, moves } = pendingMoves;
    showPieceSelect(currentPlayer(), moves, steps);
  }
});

/** Step-by-step path for the moving pawn, for animation. */
function computePath(player, piece, target, steps) {
  if (piece.position === -1) return [target]; // Home → Start pop-in
  const path = [];
  let pos = piece.position;
  const hops = target >= BOARD_SIZE ? steps : steps;
  for (let i = 0; i < hops; i++) {
    pos = (pos + 1) % BOARD_SIZE;
    path.push(pos);
    if (target < BOARD_SIZE && pos === target) break;
    if (target >= BOARD_SIZE) {
      const pIdx = game.players.findIndex((p) => p.id === player.id);
      if (pos === (startIndexForPlayer(pIdx) + BOARD_SIZE - 1) % BOARD_SIZE) break; // reached entry; finish glide handled by render
    }
  }
  return path;
}

async function executeMove(player, piece, target, steps) {
  const k = keyOf(player.id, piece.id);
  const fromPos = piece.position;
  const path = computePath(player, piece, target, steps);
  const lines = movePiece(player, piece, target, game);
  log(`🎲 ${player.name} rolled ${steps}.`, ...lines);

  // Animate the moving pawn along its path (state already committed).
  if (fromPos === -1) {
    placePawns(k); // pop-in on Start
    playMoveSound();
    await wait(420);
  } else {
    for (const p of path) {
      visualPos.set(k, p);
      placePawns();
      playMoveSound();
      await wait(190);
    }
    visualPos.delete(k);
  }

  // Event card drama: if a Ripple card was drawn, pop it center-screen.
  const cardLine = lines.find((l) => l.includes("drew"));
  if (cardLine) {
    $("card-pop-text").textContent = cardLine;
    $("card-pop").classList.remove("hidden");
    await wait(1700);
    $("card-pop").classList.add("hidden");
  }
  if (lines.some((l) => l.includes("Treasure") || l.includes("shells"))) playTreasureSound();

  renderAll();
  saveGame();

  const winner = checkWinner(game);
  if (winner) { showWin(winner); return true; }
  return false;
}

async function botSharkStrike() {
  const shark = game.players.find((p) => p.id === game.sharkId);
  if (!shark || !isBot(shark)) return;
  const atk = chooseBotAttack(shark, game);
  if (!atk) return;
  await wait(850);
  $("jaws-reveal").classList.remove("hidden");
  playAttackSound();
  await wait(1100);
  $("jaws-reveal").classList.add("hidden");
  const msg = declareAttack(shark, atk.targetPlayer, atk.targetPiece, game);
  log(`🦈 ${msg}`);
  renderAll();
  saveGame();
  await wait(500);
}

async function finishTurn(player, rolledSix) {
  if (checkWinner(game)) return;
  await botSharkStrike();
  if (checkWinner(game)) return;

  if (rolledSix) {
    game.extraTurn = true;
    log(`${player.name} rolled a 6 and gets another turn!`);
    updateTurnBanner();
    renderAll();
    saveGame();
    maybeDriveBot();
    return;
  }
  game.extraTurn = false;
  advanceTurn();
}

function advanceTurn() {
  game.turnIndex = (game.turnIndex + 1) % game.players.length;
  if (game.turnIndex === 0) {
    game.round += 1;
    pawnEls.clear();
    startRoleCheckRound();
    saveGame();
    return;
  }
  $("die-display").textContent = "?";
  renderAll();
  saveGame();
  maybeDriveBot();
}

function maybeDriveBot() {
  if (!game || busy) return;
  const p = currentPlayer();
  if (p && isBot(p) && !$("screen-game").classList.contains("hidden")) {
    busy = true;
    $("btn-roll").disabled = true;
    updateTurnBanner();
    setTimeout(async () => { await doRoll(p); }, 850);
  } else {
    renderAll();
  }
}

// ---------- Human Shark attack ----------
function checkForTagOpportunity() {
  const shark = game ? game.players.find((p) => p.id === game.sharkId) : null;
  const btn = $("btn-declare-attack");
  if (!shark || isBot(shark)) { btn.disabled = true; return; }
  let any = false;
  for (const t of game.players) {
    if (t.id === shark.id) continue;
    for (const pc of t.pieces) {
      if (canDeclareAttack(shark, t, pc, game)) { any = true; break; }
    }
    if (any) break;
  }
  btn.disabled = !any || busy;
  if (any) btn.classList.add("pulse-once");
}

$("btn-declare-attack").addEventListener("click", () => {
  playClick();
  const shark = game.players.find((p) => p.id === game.sharkId);
  const targets = [];
  game.players.forEach((t) => {
    if (t.id === shark.id) return;
    t.pieces.forEach((pc) => {
      if (canDeclareAttack(shark, t, pc, game)) targets.push({ player: t, piece: pc });
    });
  });
  if (!targets.length) return;
  const list = $("attack-target-list");
  list.innerHTML = "";
  targets.forEach(({ player: t, piece: pc }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn-secondary";
    b.style.background = t.color;
    b.textContent = `${t.name} (piece ${pc.id + 1} @ ${pc.position + 1})`;
    b.addEventListener("click", () => {
      const msg = declareAttack(shark, t, pc, game);
      log(`🦈 ${msg}`);
      playAttackSound();
      $("modal-attack-target").classList.add("hidden");
      renderAll();
      saveGame();
      const winner = checkWinner(game);
      if (winner) showWin(winner);
    });
    list.appendChild(b);
  });
  $("modal-attack-target").classList.remove("hidden");
});

$("btn-cancel-attack").addEventListener("click", () => {
  playClick();
  $("modal-attack-target").classList.add("hidden");
});

// ---------- Win ----------
function showWin(winner) {
  playWinSound();
  clearSave();
  $("win-text").textContent = `${winner.name} got all 4 swimmers home and wins Jaws Trouble!`;
  const ranked = [...game.players].sort((a, b) =>
    piecesFinished(b) - piecesFinished(a) || b.shells - a.shells);
  const medals = ["🥇", "🥈", "🥉", "4️⃣"];
  $("podium").innerHTML = ranked.map((p, i) =>
    `<li>${medals[i] || ""} ${escapeAttr(p.name)} — 🏁 ${piecesFinished(p)} home · 🐚 ${p.shells} shells</li>`).join("");
  $("modal-win").classList.remove("hidden");
  spawnConfetti();
}

function spawnConfetti() {
  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  document.body.appendChild(layer);
  for (let i = 0; i < 48; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.background = COLOR_OPTIONS[i % COLOR_OPTIONS.length];
    piece.style.animationDelay = Math.random() * 0.6 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
  }
  setTimeout(() => layer.remove(), 3200);
}

$("btn-play-again").addEventListener("click", () => {
  playClick();
  $("modal-win").classList.add("hidden");
  game = null;
  pawnEls.clear();
  refreshContinueBtn();
  showScreen("menu");
});

// Init
refreshContinueBtn();
showScreen("menu");
