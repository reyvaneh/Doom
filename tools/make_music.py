"""Generate the interactive guide's soundtrack with Pollinations (elevenlabs/music-v2.5).

    POLLINATIONS_KEY=sk_... python tools/make_music.py            # all missing tracks
    POLLINATIONS_KEY=sk_... python tools/make_music.py boss --force

The key is read from the environment only; never commit it. The finished,
re-encoded tracks in tools/game_guide/music/ are committed, so building the
guide does not need a key. ffmpeg re-encodes each track to small mono MP3s.
"""
from pathlib import Path
import os
import shutil
import subprocess
import sys
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tools/game_guide/music"
RAW = ROOT / "tools/game_guide/build/music-raw"
MODEL = "elevenlabs/music-v2.5"

STYLE = "instrumental, no vocals with lyrics, dark fantasy orchestral, cinematic, high quality mix"
TRACKS = {
    "hall": (75, "Solemn dark fantasy throne hall theme. Slow low strings, distant wordless choir, "
                 "soft church organ pad, a lone cello melody, majestic and melancholic, gentle and seamless loop"),
    "study": (90, "Quiet ambient study music in an ancient stone library at night. Soft sustained strings, "
                  "warm low drones, sparse harp and celesta notes, calm and focused, no percussion, seamless loop"),
    "miniboss": (75, "Intense boss battle music. Driving taiko and timpani percussion, aggressive staccato strings, "
                     "heavy brass stabs, chanting wordless choir, dark and epic, fast tempo, seamless loop"),
    "boss": (100, "Epic final boss battle music. Huge wordless choir, thunderous pipe organ, pounding timpani, "
                  "soaring brass and frantic strings, grand and terrifying, builds in intensity, seamless loop"),
    "victory": (8, "Short triumphant victory fanfare. Bright brass and choir chord, timpani roll, "
                   "resolving to a majestic final chord"),
}


def fetch(name, seconds, prompt, key):
    RAW.mkdir(parents=True, exist_ok=True)
    raw = RAW / f"{name}.mp3"
    url = ("https://gen.pollinations.ai/audio/" + urllib.parse.quote(f"{prompt}. {STYLE}")
           + "?" + urllib.parse.urlencode({"model": MODEL, "duration": seconds}))
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {key}", "User-Agent": "doom-study-guide-build"})
    print(f"{name}: generating {seconds}s ...", flush=True)
    with urllib.request.urlopen(req, timeout=600) as r:
        raw.write_bytes(r.read())
    return raw


def encode(name, raw, seconds):
    # Small mono MP3; looping tracks get short fades so the loop point is soft.
    fade = [] if name == "victory" else ["-af", f"afade=t=in:d=1.5,afade=t=out:st={max(1, seconds - 2.5)}:d=2.5"]
    out = OUT / f"{name}.mp3"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), *fade,
                    "-ac", "1", "-b:a", "80k", "-ar", "44100", str(out)], check=True)
    print(f"{name}: wrote {out.relative_to(ROOT)} ({out.stat().st_size // 1024} KB)")


def main():
    key = os.environ.get("POLLINATIONS_KEY")
    if not key:
        sys.exit("Set POLLINATIONS_KEY to a Pollinations secret key (sk_...).")
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg is needed to re-encode the tracks.")
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    force = "--force" in sys.argv
    OUT.mkdir(parents=True, exist_ok=True)
    for name in args or TRACKS:
        seconds, prompt = TRACKS[name]
        if (OUT / f"{name}.mp3").exists() and not force:
            print(f"{name}: exists, skipping (use --force)")
            continue
        encode(name, fetch(name, seconds, prompt, key), seconds)


if __name__ == "__main__":
    main()
