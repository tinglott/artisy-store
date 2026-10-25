# Nap Time Adventures — audio sources (repair, Oct 25, 2026)

The original 13 sound files were lost (the ./audio folder was never in
this repo; every file returned 404). The player now loads from
https://nap-time-audio.vercel.app/audio/ (Vercel project nap-time-audio).
Replacements, all verified by ear-level checks (duration + loudness):

Ambient beds — from Ting's own Sleep Sanctuary sound library
(~/workspace/sleep-app/build/audio/sounds/, licenses in its SOURCES.md):
- gentle-rain.mp3  <- soft-rain.mp3 (public domain rain recording)
- ocean-waves.mp3  <- ocean-waves.mp3 (CC0)
- forest-sounds.mp3 <- gentle-breeze.mp3 (CC0 forest wind in trees)
- babbling-stream.mp3 <- soft-stream.mp3 ("Brook sound" by TwoWings,
  CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Brook_sound.ogg)

Noise beds — synthesized (ffmpeg anoisesrc), loudness-normalized:
- white-noise.mp3, pink-noise.mp3, brown-noise.mp3

Lullabies — music-box renders made for this repair:
- twinkle-twinkle.mp3 — Twinkle Twinkle Little Star (traditional)
- saties-lullaby.mp3, sleep-tight.mp3, summer-lullaby.mp3,
  sweet-lullaby.mp3, sweet-ay-ay.mp3 — original gentle renders
  (the original recordings are lost; these are substitutes, not the
  originals). Build script: ~/workspace/nap-audio-repair/build_audio.py
