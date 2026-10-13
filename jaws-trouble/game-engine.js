/**
 * Jaws Trouble: Race to the Reef — Pure Rules Engine
 * Hybrid of Trouble (multi-piece race home, dice, bumping)
 * + Shark Attack (zones, special spaces, secret Shark ritual)
 */

export const ZONES = [
  { name: "Shallow Waters", color: "#F2C744", emoji: "☀️" },
  { name: "Kelp Forest", color: "#3FA34D", emoji: "🌿" },
  { name: "Open Ocean", color: "#2E6FBA", emoji: "🌊" },
  { name: "Coral Reef", color: "#E85D4C", emoji: "🪸" },
];

// Pattern repeats every 10 spaces (like original)
const SPACE_PATTERN = [
  "wave", "ripple", "wave", "lifeguard", "wave",
  "treasure", "wave", "ripple", "undertow", "current",
];

export const BOARD_SIZE = 40; // track length before Finish

export function buildBoard() {
  const spaces = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const zoneIndex = Math.floor(i / 10);
    const type = i === 0 ? "shore" : SPACE_PATTERN[i % 10];
    spaces.push({
      index: i,
      zone: ZONES[zoneIndex].name,
      zoneEmoji: ZONES[zoneIndex].emoji,
      color: ZONES[zoneIndex].color,
      type,
    });
  }
  return spaces;
}

export const BOARD = buildBoard();

export const SPACE_ICONS = {
  shore: "🏝️",
  wave: "〰️",
  ripple: "📜",
  lifeguard: "🛟",
  treasure: "💎",
  undertow: "⬇️",
  current: "➡️",
};

export const EVENT_DECK = [
  { id: "ripple1", name: "Ripple", text: "Every other player moves 1 space forward.", effect: "rippleForward", emoji: "〰️" },
  { id: "ripple2", name: "Ripple", text: "Every other player moves 1 space forward.", effect: "rippleForward", emoji: "〰️" },
  { id: "ripple3", name: "Ripple", text: "Every other player moves 1 space back.", effect: "rippleBack", emoji: "〰️" },
  { id: "ripple4", name: "Ripple", text: "Every other player moves 1 space back.", effect: "rippleBack", emoji: "〰️" },
  { id: "lifeguard1", name: "Lifeguard Save", text: "Move to the nearest Lifeguard Tower.", effect: "gotoLifeguard", emoji: "🛟" },
  { id: "lifeguard2", name: "Lifeguard Save", text: "Move to the nearest Lifeguard Tower.", effect: "gotoLifeguard", emoji: "🛟" },
  { id: "seafoam1", name: "Sea Foam", text: "Swap places with any other swimmer on the track.", effect: "swap", emoji: "🫧" },
  { id: "school1", name: "School of Fish", text: "Collect 2 extra shells.", effect: "shells2", emoji: "🐠" },
  { id: "rough1", name: "Rough Current", text: "Skip your next turn.", effect: "skipTurn", emoji: "🌪️" },
  { id: "dolphin1", name: "Dolphin Escort", text: "Move forward to the next Lifeguard Tower.", effect: "dolphinForward", emoji: "🐬" },
  { id: "uneven", name: "Uneven Spot", text: "Turn order rotates by one seat.", effect: "rotateOrder", emoji: "🔄" },
];

export function shuffledDeck() {
  const deck = [...EVENT_DECK];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function rollDie() {
  return 1 + Math.floor(Math.random() * 6);
}

/**
 * Player has 4 pieces. Each piece:
 * position: -1 = Home, 0..BOARD_SIZE-1 = track, BOARD_SIZE..BOARD_SIZE+3 = Finish slots
 */
export function makePlayer(id, name, color) {
  return {
    id,
    name: (name || "Swimmer").trim().slice(0, 16),
    color,
    pieces: [
      { id: 0, position: -1 }, // Home
      { id: 1, position: -1 },
      { id: 2, position: -1 },
      { id: 3, position: -1 },
    ],
    shells: 0,
    skipNextTurn: false,
  };
}

export function piecesAtHome(player) {
  return player.pieces.filter((p) => p.position === -1).length;
}

export function piecesFinished(player) {
  return player.pieces.filter((p) => p.position >= BOARD_SIZE).length;
}

export function piecesOnTrack(player) {
  return player.pieces.filter((p) => p.position >= 0 && p.position < BOARD_SIZE);
}

/** Start space for a player is offset by their index so starts are spaced */
export function startIndexForPlayer(playerIndex) {
  return (playerIndex * 10) % BOARD_SIZE;
}

export function finishEntryIndex(playerIndex) {
  // After a full lap, enter finish from the space just before their start
  return (startIndexForPlayer(playerIndex) + BOARD_SIZE - 1) % BOARD_SIZE;
}

/**
 * Can this piece legally move the given number of spaces?
 * Returns target position or null if illegal.
 */
export function canMovePiece(player, piece, steps, gameState) {
  if (steps < 1) return null;

  // From Home: only on 6, and only to Start
  if (piece.position === -1) {
    if (steps !== 6) return null;
    const start = startIndexForPlayer(gameState.players.findIndex((p) => p.id === player.id));
    // Cannot land on own piece
    if (player.pieces.some((p) => p.position === start)) return null;
    return start;
  }

  // Already finished
  if (piece.position >= BOARD_SIZE) return null;

  const playerIndex = gameState.players.findIndex((p) => p.id === player.id);
  const start = startIndexForPlayer(playerIndex);

  // Distance this piece has travelled from its own Start (0..39 on the track).
  // A full lap is BOARD_SIZE steps; steps beyond that enter the Finish slots.
  const progress = (piece.position - start + BOARD_SIZE) % BOARD_SIZE;
  const total = progress + steps;

  if (total < BOARD_SIZE) {
    const pos = (start + total) % BOARD_SIZE;
    // Cannot land on own piece
    if (player.pieces.some((p) => p.id !== piece.id && p.position === pos)) return null;
    return pos;
  }

  // Entering the Finish stretch — exact count required, no overshoot.
  const intoFinish = total - BOARD_SIZE; // 0..3 → slots BOARD_SIZE..BOARD_SIZE+3
  if (intoFinish > 3) return null;
  const finishSlot = BOARD_SIZE + intoFinish;
  if (player.pieces.some((p) => p.id !== piece.id && p.position === finishSlot)) return null;
  return finishSlot;
}

export function movePiece(player, piece, targetPos, gameState) {
  const log = [];
  const oldPos = piece.position;

  // Bump opponents on the track
  if (targetPos >= 0 && targetPos < BOARD_SIZE) {
    for (const other of gameState.players) {
      if (other.id === player.id) continue;
      for (const op of other.pieces) {
        if (op.position === targetPos) {
          op.position = -1; // back to Home
          log.push(`🦈 ${other.name}'s swimmer was bumped back Home by ${player.name}!`);
        }
      }
    }
  }

  piece.position = targetPos;

  if (oldPos === -1) {
    log.push(`🚀 ${player.name} brought a swimmer out onto the reef!`);
  } else if (targetPos >= BOARD_SIZE) {
    log.push(`🏁 ${player.name} got a swimmer into the Finish zone!`);
  } else {
    log.push(`➡️ ${player.name} moved a swimmer to space ${targetPos + 1}.`);
  }

  // Resolve landing effects only on track
  if (targetPos >= 0 && targetPos < BOARD_SIZE) {
    const spaceLog = resolveSpace(player, piece, gameState);
    log.push(...spaceLog);
  }

  return log;
}

function nearestLifeguard(fromIndex, forward = true) {
  for (let step = 1; step <= BOARD_SIZE; step++) {
    const idx = forward
      ? (fromIndex + step) % BOARD_SIZE
      : (fromIndex - step + BOARD_SIZE) % BOARD_SIZE;
    if (BOARD[idx].type === "lifeguard") return idx;
  }
  return fromIndex;
}

function resolveSpace(player, piece, gameState) {
  const space = BOARD[piece.position];
  const log = [];

  switch (space.type) {
    case "treasure":
      player.shells += 2;
      log.push(`💎 ${player.name} found Reef Treasure (+2 shells)!`);
      break;
    case "current":
      {
        const newPos = (piece.position + 2) % BOARD_SIZE;
        // Simple: just advance 2 more (no chain for safety)
        piece.position = newPos;
        log.push(`➡️ Current surged ${player.name} forward 2 more spaces.`);
      }
      break;
    case "undertow":
      {
        const newPos = (piece.position - 2 + BOARD_SIZE) % BOARD_SIZE;
        piece.position = newPos;
        log.push(`⬅️ Undertow pulled ${player.name} back 2 spaces.`);
      }
      break;
    case "lifeguard":
      log.push(`🛟 ${player.name} reached a Lifeguard Tower — safe from Jaws this turn.`);
      break;
    case "ripple": {
      if (!gameState.deck.length) gameState.deck = shuffledDeck();
      const card = gameState.deck.pop();
      log.push(`${card.emoji || "📜"} ${player.name} drew “${card.name}” — ${card.text}`);
      applyEventCard(card, player, piece, gameState, log);
      break;
    }
    case "shore":
      log.push(`🏝️ ${player.name} is at Shore.`);
      break;
    default:
      log.push(`🌊 Calm waters for ${player.name}.`);
  }
  return log;
}

function applyEventCard(card, player, piece, gameState, log) {
  const others = gameState.players.filter((p) => p.id !== player.id);

  switch (card.effect) {
    case "rippleForward":
      others.forEach((op) => {
        op.pieces.forEach((p) => {
          if (p.position >= 0 && p.position < BOARD_SIZE) {
            p.position = (p.position + 1) % BOARD_SIZE;
          }
        });
      });
      break;
    case "rippleBack":
      others.forEach((op) => {
        op.pieces.forEach((p) => {
          if (p.position >= 0 && p.position < BOARD_SIZE) {
            p.position = (p.position - 1 + BOARD_SIZE) % BOARD_SIZE;
          }
        });
      });
      break;
    case "gotoLifeguard":
    case "dolphinForward":
      piece.position = nearestLifeguard(piece.position, true);
      break;
    case "swap": {
      const candidates = [];
      others.forEach((op) => {
        op.pieces.forEach((p) => {
          if (p.position >= 0 && p.position < BOARD_SIZE) candidates.push({ player: op, piece: p });
        });
      });
      if (candidates.length) {
        const target = candidates[Math.floor(Math.random() * candidates.length)];
        const tmp = piece.position;
        piece.position = target.piece.position;
        target.piece.position = tmp;
        log.push(`🔄 ${player.name} swapped with ${target.player.name}!`);
      }
      break;
    }
    case "shells2":
      player.shells += 2;
      break;
    case "skipTurn":
      player.skipNextTurn = true;
      break;
    case "rotateOrder":
      if (gameState.players.length > 1) {
        gameState.players.push(gameState.players.shift());
        log.push("🔄 Turn order rotated!");
      }
      break;
  }
}

export function selectShark(gameState) {
  const candidates = gameState.players;
  if (!candidates.length) return null;
  const shark = candidates[Math.floor(Math.random() * candidates.length)];
  gameState.sharkId = shark.id;
  gameState.sharkHasAttackedThisRound = false;
  return shark.id;
}

/** Distance on circular track */
function trackDistance(a, b) {
  return Math.min(Math.abs(a - b), BOARD_SIZE - Math.abs(a - b));
}

export function canDeclareAttack(sharkPlayer, targetPlayer, targetPiece, gameState) {
  if (!sharkPlayer || !targetPlayer || !targetPiece) return false;
  if (gameState.sharkHasAttackedThisRound) return false;
  if (targetPlayer.id === sharkPlayer.id) return false;
  if (targetPiece.position < 0 || targetPiece.position >= BOARD_SIZE) return false;
  if (BOARD[targetPiece.position].type === "lifeguard") return false;

  // Shark must have at least one piece adjacent or on same space
  const sharkPieces = piecesOnTrack(sharkPlayer);
  return sharkPieces.some((sp) => trackDistance(sp.position, targetPiece.position) <= 1);
}

export function declareAttack(sharkPlayer, targetPlayer, targetPiece, gameState) {
  targetPiece.position = -1; // back to Home
  gameState.sharkHasAttackedThisRound = true;
  return `${sharkPlayer.name} was Jaws! 🦈 ${targetPlayer.name}'s swimmer was eaten and sent Home.`;
}

export function checkWinner(gameState) {
  return gameState.players.find((p) => piecesFinished(p) === 4) || null;
}

export function newGameState(players) {
  return {
    players: players.map((p) => ({ ...p, pieces: p.pieces.map((pc) => ({ ...pc })) })),
    deck: shuffledDeck(),
    round: 1,
    turnIndex: 0,
    sharkId: null,
    sharkHasAttackedThisRound: false,
    log: ["🌊 Welcome to Jaws Trouble: Race to the Reef! Get all 4 swimmers home safely."],
    winnerId: null,
    lastRoll: null,
    extraTurn: false,
  };
}

export function getLegalMoves(player, steps, gameState) {
  const moves = [];
  for (const piece of player.pieces) {
    const target = canMovePiece(player, piece, steps, gameState);
    if (target !== null) {
      moves.push({ piece, target });
    }
  }
  return moves;
}
