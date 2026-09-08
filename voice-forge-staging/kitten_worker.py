#!/usr/bin/env python3
"""Local Kitten TTS audiobook worker.

Reads a UTF-8 text manuscript, synthesizes resumable WAV chapters, and writes
only to the chosen output directory. It never uploads files or handles secrets.
Requires KittenTTS 0.8.1 and soundfile.
"""
from __future__ import annotations
import argparse, hashlib, json, re
from pathlib import Path
from kittentts import KittenTTS

SAMPLE_RATE = 24000

def chunks(text: str, limit: int = 1800):
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    out, buf = [], ""
    for paragraph in paragraphs:
        if len(buf) + len(paragraph) + 1 <= limit:
            buf = f"{buf}\n{paragraph}".strip()
        else:
            if buf: out.append(buf)
            while len(paragraph) > limit:
                cut = paragraph.rfind(" ", 0, limit)
                cut = cut if cut > 200 else limit
                out.append(paragraph[:cut].strip()); paragraph = paragraph[cut:].strip()
            buf = paragraph
    if buf: out.append(buf)
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("manuscript", type=Path)
    ap.add_argument("output", type=Path)
    ap.add_argument("--voice", default="Jasper")
    ap.add_argument("--model", default="KittenML/kitten-tts-nano-0.8")
    ap.add_argument("--speed", type=float, default=1.0)
    args = ap.parse_args()
    text = args.manuscript.read_text(encoding="utf-8")
    parts = chunks(text)
    args.output.mkdir(parents=True, exist_ok=True)
    manifest = {"status":"in_progress","engine":"KittenTTS","model":args.model,"voice":args.voice,"sample_rate":SAMPLE_RATE,"parts":[]}
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    model = KittenTTS(args.model)
    for i, part in enumerate(parts, 1):
        target = args.output / f"part-{i:04d}.wav"
        if not target.exists():
            model.generate_to_file(part, str(target), voice=args.voice, speed=args.speed, sample_rate=SAMPLE_RATE, clean_text=True)
        manifest["parts"].append({"index":i,"file":target.name,"sha256":hashlib.sha256(target.read_bytes()).hexdigest(),"bytes":target.stat().st_size})
        (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    manifest["status"] = "complete"
    (args.output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

if __name__ == "__main__": main()
