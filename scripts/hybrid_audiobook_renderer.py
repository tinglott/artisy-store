#!/usr/bin/env python3
"""Checkpointed hybrid audiobook renderer.

Provider order: Kokoro (local) -> Edge TTS (existing fallback) -> Piper (if configured)
-> eSpeak-ng (last-resort diagnostic fallback). Each chunk is independently rendered,
validated, and retained until its track is assembled. Originals are never modified.
"""
from __future__ import annotations
import argparse, asyncio, hashlib, json, os, re, shutil, subprocess, sys, time
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).parent))
import produce_verified_audiobooks as booklib

DEFAULT_ROOT = Path(os.environ.get("AUDIOBOOK_HYBRID_ROOT", "/tasklet/agent/home/audiobooks/hybrid"))
EDGE_VOICE = os.environ.get("EDGE_VOICE", "en-US-AvaMultilingualNeural")
EDGE_RATE = os.environ.get("EDGE_RATE", "-8%")
KOKORO_VOICE = os.environ.get("KOKORO_VOICE", "af_heart")
PIPER_MODEL = os.environ.get("PIPER_MODEL", "")
MIN_BYTES = 1000


def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for b in iter(lambda: f.read(1024 * 1024), b""): h.update(b)
    return h.hexdigest()


def valid_audio(p: Path) -> bool:
    if not p.exists() or p.stat().st_size < MIN_BYTES: return False
    try:
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(p)], capture_output=True, text=True, timeout=30)
        return r.returncode == 0 and float(r.stdout.strip()) > 0.1
    except Exception: return False


def have(cmd: str) -> bool: return shutil.which(cmd) is not None


def discover() -> list[str]:
    providers=[]
    try:
        import kokoro  # noqa: F401
        providers.append("kokoro")
    except Exception: pass
    try:
        import edge_tts  # noqa: F401
        providers.append("edge")
    except Exception: pass
    if have("piper") and PIPER_MODEL and Path(PIPER_MODEL).exists(): providers.append("piper")
    if have("espeak-ng"): providers.append("espeak")
    return providers


class Hybrid:
    def __init__(self, work: Path, order: list[str]):
        self.work=work; self.order=order; self.events=[]; self._kokoro=None

    def event(self, **kw):
        row={"timestamp":time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), **kw}
        self.events.append(row); print(json.dumps(row), flush=True)

    def _kokoro_render(self, text: str, out: Path):
        import numpy as np, soundfile as sf
        from kokoro import KPipeline
        if self._kokoro is None: self._kokoro=KPipeline(lang_code="a")
        pieces=[]; rate=24000
        for _, _, audio in self._kokoro(text, voice=KOKORO_VOICE, speed=0.94):
            arr=np.asarray(audio)
            if arr.size: pieces.append(arr)
        if not pieces: raise RuntimeError("Kokoro returned no audio")
        sf.write(str(out), np.concatenate(pieces), rate)

    async def _edge_render(self, text: str, out: Path):
        import edge_tts
        await edge_tts.Communicate(text, EDGE_VOICE, rate=EDGE_RATE).save(str(out))

    def _piper_render(self, text: str, out: Path):
        r=subprocess.run(["piper", "--model", PIPER_MODEL, "--output_file", str(out)], input=text, text=True, capture_output=True, timeout=180)
        if r.returncode: raise RuntimeError(r.stderr[-500:])

    def _espeak_render(self, text: str, out: Path):
        r=subprocess.run(["espeak-ng", "-w", str(out), text], capture_output=True, text=True, timeout=180)
        if r.returncode: raise RuntimeError(r.stderr[-500:])

    def render(self, text: str, out: Path, label: str):
        errors=[]
        for provider in self.order:
            for attempt in range(1,4):
                try:
                    if provider=="kokoro": self._kokoro_render(text,out)
                    elif provider=="edge": asyncio.run(self._edge_render(text,out))
                    elif provider=="piper": self._piper_render(text,out)
                    elif provider=="espeak": self._espeak_render(text,out)
                    else: raise RuntimeError("unknown provider")
                    if not valid_audio(out): raise RuntimeError("output failed audio validation")
                    self.event(type="chunk_ok", label=label, provider=provider, attempt=attempt, bytes=out.stat().st_size, sha256=sha256(out))
                    return provider
                except Exception as e:
                    out.unlink(missing_ok=True)
                    msg=f"{type(e).__name__}: {e}"
                    errors.append({"provider":provider,"attempt":attempt,"error":msg})
                    self.event(type="provider_failed", label=label, provider=provider, attempt=attempt, error=msg)
                    time.sleep(min(attempt,2))
        raise RuntimeError(json.dumps({"label":label,"providers_tried":self.order,"errors":errors}))

    def assemble(self, chunks: list[Path], target: Path, title: str):
        listing=target.parent/(target.stem+"_concat.txt")
        listing.write_text("".join("file '"+str(x).replace("'","'\\''")+"'\n" for x in chunks))
        r=subprocess.run(["ffmpeg","-y","-f","concat","-safe","0","-i",str(listing),"-c","copy","-metadata",f"title={title}","-metadata","artist=T. Lott",str(target)],capture_output=True,text=True)
        listing.unlink(missing_ok=True)
        if r.returncode or not valid_audio(target): raise RuntimeError(r.stderr[-1000:])
        self.event(type="track_ok", track=target.name, bytes=target.stat().st_size, sha256=sha256(target))


def split_text(text: str, n=8500):
    text=re.sub(r"\s+"," ",text.replace("•",", ")).strip(); out=[]
    while len(text)>n:
        cut=max(text.rfind(x,0,n) for x in [". ","? ","! ","; ",", "])
        if cut<n//2: cut=n
        out.append(text[:cut+1].strip()); text=text[cut+1:].strip()
    if text: out.append(text)
    return out


def main():
    ap=argparse.ArgumentParser(); ap.add_argument("slug", choices=[x[0] for x in booklib.BOOKS]); ap.add_argument("--start",type=int,default=0); ap.add_argument("--root",type=Path,default=DEFAULT_ROOT); ap.add_argument("--providers",default="kokoro,edge,piper", help="Ordered providers; add espeak explicitly only for diagnostic use"); ap.add_argument("--max-tracks",type=int,default=0); ap.add_argument("--self-test",action="store_true")
    a=ap.parse_args(); available=discover(); order=[x for x in a.providers.split(",") if x in available]
    if not order: raise SystemExit("No usable TTS providers detected. Install Kokoro or configure a fallback provider.")
    print(json.dumps({"event":"hybrid_start","slug":a.slug,"available":available,"order":order,"root":str(a.root)}),flush=True)
    if a.self_test:
        h=Hybrid(a.root/"self_test",order); out=h.work/"self_test.mp3"; out.parent.mkdir(parents=True,exist_ok=True); p=h.render("This is a short audiobook rendering test.",out,"self-test"); print(json.dumps({"status":"ok","provider":p,"file":str(out),"sha256":sha256(out)})); return
    row=next(x for x in booklib.BOOKS if x[0]==a.slug); slug,source,title,kind=row
    sourcep=Path(source); paragraphs=booklib.paras(sourcep); tracks=booklib.stop_tracks(paragraphs) if kind=="stop" else booklib.stay_tracks(paragraphs)
    bookdir=a.root/slug; bookdir.mkdir(parents=True,exist_ok=True); h=Hybrid(bookdir,order)
    manifest_path=bookdir/"HYBRID_MANIFEST.json"; manifest=json.loads(manifest_path.read_text()) if manifest_path.exists() else {"title":title,"source":source,"source_sha256":sha256(sourcep),"providers_available":available,"provider_order":order,"tracks":[],"events":[]}
    done={x["track"]:x for x in manifest["tracks"]}
    end=len(tracks) if not a.max_tracks else min(len(tracks),a.start+a.max_tracks)
    for i,(name,items) in enumerate(tracks):
        if i<a.start or i>=end: continue
        target=bookdir/(name+".mp3")
        if name in done and valid_audio(target): print(json.dumps({"event":"track_skip","track":name})); continue
        text=" ".join(t for t,_ in items); text=(title+" "+text) if name.startswith("01_") else text
        chunkdir=bookdir/"_chunks"/name; chunkdir.mkdir(parents=True,exist_ok=True); chunks=[]; providers=[]
        for j,ch in enumerate(split_text(text),1):
            cp=chunkdir/f"{j:03d}.mp3"
            if valid_audio(cp): providers.append("existing"); chunks.append(cp); continue
            providers.append(h.render(ch,cp,f"{name}:{j}")); chunks.append(cp)
        h.assemble(chunks,target,name.replace("_"," "))
        rec={"index":i,"track":name,"file":target.name,"bytes":target.stat().st_size,"duration_seconds":float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",str(target)],text=True).strip()),"sha256":sha256(target),"chunk_providers":providers}
        manifest["tracks"]=[x for x in manifest["tracks"] if x["track"]!=name]+[rec]; manifest["events"]+=h.events; h.events=[]; manifest_path.write_text(json.dumps(manifest,indent=2)); print(json.dumps({"event":"checkpoint","track":name,"index":i}),flush=True)
    print(json.dumps({"status":"complete_for_range","slug":slug,"tracks_done":len(manifest["tracks"]),"tracks_total":len(tracks),"manifest":str(manifest_path)}))

if __name__=="__main__": main()
