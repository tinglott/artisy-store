# Jaws Trouble: Race to the Reef — Digital Edition

The polished digital-game edition of Ting's reef-racing board game: animated board,
character-style play, and computer opponents — in the spirit of the big digital
board-game apps, built as a dependency-free web game.

## What's new vs. the original pass-and-play build

- Title menu: Solo vs Bots, Pass & Play (2–4 on one device), How to Play, Continue
- Solo mode: 1–3 bot opponents (Bubbles, Fin Diesel, Coral, Marina, Sandy, Reef)
  with real move strategy — they chase finishes, bump leaders, grab treasure,
  hide on Lifeguard Towers, and flee danger
- Bot Shark: when a bot is secretly Jaws, it strikes on its own with a
  full-screen reveal — once per round, targeting the swimmer closest to home
- Animated dice and step-by-step swimmer movement, event-card pop-ups, sounds
- Exact-roll Finish entry (rules fix: the original engine over-counted steps
  when a swimmer crossed its start line heading home — corrected and unit-tested)
- Win podium ranked by swimmers home, then shells
- Auto-save: quit mid-game and Continue from the menu on the same device

## Run it

Browsers block ES modules from file:// — serve the folder:

    cd jaws-trouble/digital
    python3 -m http.server 8000
    # open http://localhost:8000

Or upload this folder to any static host (Netlify, Vercel, GitHub Pages,
Cloudflare Pages). No build step, no backend.

## Files

- index.html — screens and modals
- style.css — ocean theme (shared with the original build)
- digital.css — Digital Edition additions (menu, badges, animations, podium)
- app.js — UI, animation, bot turn driver, save/resume
- bots.js — bot move and attack heuristics
- game-engine.js — pure rules engine (with the Finish-entry fix)

## Verification (Oct 12, 2026)

- Finish-math unit tests: all cases pass
- 40 simulated bot-vs-bot games on this engine: 40 finished with a winner,
  0 errors, 848 bot shark attacks; average game ~620 turns
- All modules pass syntax parsing; all files serve HTTP 200 locally
