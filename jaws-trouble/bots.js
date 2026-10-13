/**
 * Bot opponents for Jaws Trouble — Digital Edition
 * Original heuristic move/attack selection written for solo play.
 * Pure functions over the game engine state; no DOM access.
 */
import {
  BOARD, BOARD_SIZE, canDeclareAttack, piecesOnTrack, startIndexForPlayer,
} from "./game-engine.js";

/** How far a piece has travelled from its owner's start (0..39 on track). */
function progressOf(gameState, player, position) {
  const idx = gameState.players.findIndex((p) => p.id === player.id);
  const start = startIndexForPlayer(idx);
  return (position - start + BOARD_SIZE) % BOARD_SIZE;
}

function circularDistance(a, b) {
  return Math.min(Math.abs(a - b), BOARD_SIZE - Math.abs(a - b));
}

/**
 * Score a candidate move for a bot. Higher is better.
 * moves: array of { piece, target } from getLegalMoves().
 */
export function chooseBotMove(player, moves, gameState) {
  if (!moves || !moves.length) return null;
  let best = null;
  let bestScore = -Infinity;

  for (const mv of moves) {
    const { piece, target } = mv;
    let score = Math.random() * 4; // slight unpredictability

    if (piece.position === -1) score += 55;               // leave Home on a 6
    if (target >= BOARD_SIZE) score += 120;               // reach a Finish slot

    if (target >= 0 && target < BOARD_SIZE) {
      const type = BOARD[target].type;
      if (type === "treasure") score += 45;
      if (type === "lifeguard") score += 40;              // safe from Jaws
      if (type === "current") score += 22;
      if (type === "ripple") score += 8;
      if (type === "undertow") score -= 25;
      if (type === "shore") score += 6;

      // Bumping an opponent home is strong — prefer their most advanced piece.
      for (const other of gameState.players) {
        if (other.id === player.id) continue;
        for (const op of other.pieces) {
          if (op.position === target) {
            score += 65 + progressOf(gameState, other, op.position);
          }
        }
      }

      // Prefer advancing the piece that is already furthest along.
      score += progressOf(gameState, player, target) * 0.6;

      // Risk: landing on/next to an opponent swimmer invites a Jaws tag.
      let danger = false;
      for (const other of gameState.players) {
        if (other.id === player.id) continue;
        for (const op of piecesOnTrack(other)) {
          if (circularDistance(op.position, target) <= 1) danger = true;
        }
      }
      if (danger && type !== "lifeguard") score -= 18;

      // Safety: moving a piece OUT of danger is good.
      if (piece.position >= 0) {
        let wasInDanger = false;
        for (const other of gameState.players) {
          if (other.id === player.id) continue;
          for (const op of piecesOnTrack(other)) {
            if (circularDistance(op.position, piece.position) <= 1) wasInDanger = true;
          }
        }
        if (wasInDanger && !danger) score += 14;
      }
    }

    if (score > bestScore) { bestScore = score; best = mv; }
  }
  return best;
}

/**
 * If the bot is the secret Shark, choose who to tag (or null).
 * Prefers the most advanced legal target so attacks feel smart, not random.
 */
export function chooseBotAttack(sharkPlayer, gameState) {
  let best = null;
  let bestProgress = -1;
  for (const targetPlayer of gameState.players) {
    if (targetPlayer.id === sharkPlayer.id) continue;
    for (const targetPiece of targetPlayer.pieces) {
      if (canDeclareAttack(sharkPlayer, targetPlayer, targetPiece, gameState)) {
        const prog = progressOf(gameState, targetPlayer, targetPiece.position);
        if (prog > bestProgress) {
          bestProgress = prog;
          best = { targetPlayer, targetPiece };
        }
      }
    }
  }
  return best;
}
