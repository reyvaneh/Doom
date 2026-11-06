"""Build the gamified Stage 2 study guide (interactive HTML + printable PDF).

    python tools/build_game_guide.py          # rebuild HTML and PDF
    python tools/build_game_guide.py --html   # HTML only
    python tools/build_game_guide.py --check  # verify nothing was lost

Content comes from the original guide via tools/game_guide/extract.py.
Three.js scenes live in tools/game_guide/src/scene.js; after editing them run
`npm install` then `npm run bundle` inside tools/game_guide.
The soundtrack in tools/game_guide/music/ is embedded in the HTML; regenerate
it with tools/make_music.py (needs a Pollinations key in POLLINATIONS_KEY).
"""
from pathlib import Path
import base64
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
HERE = ROOT / "tools/game_guide"
sys.path.insert(0, str(HERE))
from extract import extract  # noqa: E402

HTML_OUT = ROOT / "DOOM_Stage2_Study_Guide_Interactive.html"
PDF_OUT = ROOT / "DOOM_Stage2_Study_Guide.pdf"
PRINT_HTML = HERE / "build/print.html"
MUSIC_DIR = HERE / "music"
MUSIC_TRACKS = ("hall", "study", "miniboss", "boss", "victory")
CHROME_PATHS = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome", "/usr/bin/chromium",
]


def model_with_art():
    model, assets = extract()
    by_sel = {d["selector"]: d["asset"] for d in model.pop("decor")}
    model["art"] = {"hall": by_sel[".comic-masthead"], "glass": by_sel[".activity-header"]}
    return model, assets


def asset_attrs(obj):
    """Turn src="asset:k" tokens into data-asset attributes, recursively."""
    if isinstance(obj, str):
        return re.sub(r'src="asset:(\w+)"', r'data-asset="\1"', obj)
    if isinstance(obj, list):
        return [asset_attrs(x) for x in obj]
    if isinstance(obj, dict):
        return {k: asset_attrs(v) for k, v in obj.items()}
    return obj


def script_json(value):
    # Safe to embed inside <script>: no closing tags or HTML comments.
    return json.dumps(value, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/").replace("<!--", "<\\!--")


def fill(template, parts):
    for key, value in parts.items():
        template = template.replace(key, value, 1)
    return template


def music():
    """The soundtrack from tools/game_guide/music as data URIs (see tools/make_music.py)."""
    out = {}
    for name in MUSIC_TRACKS:
        f = MUSIC_DIR / f"{name}.mp3"
        if f.exists():
            out[name] = "data:audio/mpeg;base64," + base64.b64encode(f.read_bytes()).decode("ascii")
        else:
            print(f"music: {f.name} missing; the guide will play without it")
    return out


def build_html():
    model, assets = model_with_art()
    model = asset_attrs(model)
    src = HERE / "src"
    page = (src / "app.html").read_text(encoding="utf-8")
    page = fill(page, {
        "/*CSS*/": (src / "app.css").read_text(encoding="utf-8"),
        "/*DATA*/": f"window.GUIDE={script_json(model)};window.ASSETS={script_json(assets)};",
        "/*MUSIC*/": f"window.MUSIC={script_json(music())};",
        "/*SCENE*/": (HERE / "vendor/scene.bundle.js").read_text(encoding="utf-8").replace("</script", "<\\/script"),
        "/*APP*/": (src / "app.js").read_text(encoding="utf-8"),
    })
    HTML_OUT.write_text(page, encoding="utf-8")
    print(f"wrote {HTML_OUT.name} ({HTML_OUT.stat().st_size // 1024} KB)")
    return model, assets


def build_print(toc=None):
    model, assets = model_with_art()
    # The print page is a temporary file, so images are inlined directly.
    model = json.loads(re.sub(r"asset:(\w+)", lambda m: assets[m.group(1)], json.dumps(model)))
    model["avatarUri"] = assets[model["chapters"][0]["avatar"]]
    model["artUri"] = {k: assets[v] for k, v in model["art"].items()}
    for c in model["chapters"]:
        c["bannerUri"] = assets[c["banner"]]
    src = HERE / "src"
    page = (src / "print.html").read_text(encoding="utf-8")
    page = fill(page, {
        "/*CSS*/": (src / "print.css").read_text(encoding="utf-8"),
        "/*DATA*/": f"window.GUIDE={script_json(model)};window.TOC_PAGES={script_json(toc or {})};",
        "/*SCENE*/": (HERE / "vendor/scene.bundle.js").read_text(encoding="utf-8").replace("</script", "<\\/script"),
        "/*PRINT*/": (src / "print.js").read_text(encoding="utf-8"),
    })
    PRINT_HTML.parent.mkdir(exist_ok=True)
    PRINT_HTML.write_text(page, encoding="utf-8")
    return PRINT_HTML


def render_pdf(html):
    chrome = next((p for p in CHROME_PATHS if Path(p).exists()), None)
    if not chrome:
        sys.exit("Chrome or Edge is needed to render the PDF.")
    profile = HERE / "build/chrome-profile"
    subprocess.run([
        chrome, "--headless=new", "--disable-gpu-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
        "--no-first-run", "--no-default-browser-check", f"--user-data-dir={profile}",
        "--run-all-compositor-stages-before-draw", "--virtual-time-budget=20000",
        "--generate-pdf-document-outline", "--no-pdf-header-footer",
        f"--print-to-pdf={PDF_OUT}", html.resolve().as_uri(),
    ], check=True, capture_output=True, timeout=300)


def toc_pages():
    """Read where each chapter landed from the PDF's heading outline."""
    try:
        import pymupdf
    except ImportError:
        print("pymupdf not installed; contents page will have no page numbers")
        return None
    model, _ = extract()
    # Line wraps can drop spaces from outline titles, so compare without them.
    norm = lambda t: re.sub(r"\s+", "", t)
    wanted = {norm(c["title"]): f"ch{c['n']}" for c in model["chapters"]}
    wanted.update({"Glossary": "glossary", "Practicetest": "test", "Answers": "answers"})
    found = {}
    for _level, title, page in pymupdf.open(PDF_OUT).get_toc():
        key = wanted.get(norm(title))
        if key and key not in found:
            found[key] = page
    missing = set(wanted.values()) - set(found)
    if missing:
        print("contents: could not locate", sorted(missing))
    return found


def build_pdf():
    # Pass 1 finds the page of each chapter; pass 2 prints them in the contents.
    render_pdf(build_print())
    toc = toc_pages()
    if toc:
        render_pdf(build_print(toc))
        again = toc_pages()
        if again != toc:
            render_pdf(build_print(again))
    print(f"wrote {PDF_OUT.name} ({PDF_OUT.stat().st_size // 1024} KB)")


def check():
    model, assets = model_with_art()
    page = HTML_OUT.read_text(encoding="utf-8")
    m = re.search(r"window\.GUIDE=(\{.*?\});window\.ASSETS=", page, re.S)
    built = json.loads(m.group(1)) if m else {}
    problems = []
    expect = {
        "chapters": (len(model["chapters"]), len(built.get("chapters", []))),
        "review questions": (sum(len(c["questions"]) for c in model["chapters"]), sum(len(c["questions"]) for c in built.get("chapters", []))),
        "intel sections": (sum(len(c["sections"]) for c in model["chapters"]), sum(len(c["sections"]) for c in built.get("chapters", []))),
        "test bank questions": (len(model["bank"]), len(built.get("bank", []))),
        "glossary terms": (len(model["glossary"]), len(built.get("glossary", []))),
    }
    for name, (want, got) in expect.items():
        print(f"{name:20} {got:4} / {want}")
        if want != got:
            problems.append(name)
    if (16, 48, 46) != (expect["chapters"][0], expect["review questions"][0], expect["test bank questions"][0]):
        problems.append("source counts changed")
    missing = [k for k in set(re.findall(r'data-asset="(\w+)"', page)) if k not in assets and k != "CREST"]
    if missing:
        problems.append(f"missing images {missing}")
    tracks = [t for t in MUSIC_TRACKS if not (MUSIC_DIR / f"{t}.mp3").exists()]
    if tracks:
        problems.append(f"missing music {tracks}")
    print(f"{'music tracks':20} {len(MUSIC_TRACKS) - len(tracks):4} / {len(MUSIC_TRACKS)}")
    # The PDF only depends on the print sources and the extracted content.
    print_src = [HERE / "src" / n for n in ("print.html", "print.css", "print.js")] + [HERE / "extract.py"]
    if not PDF_OUT.exists() or PDF_OUT.stat().st_mtime < max(p.stat().st_mtime for p in print_src) - 600:
        problems.append("PDF is missing or older than its print sources")
    print("OK" if not problems else "PROBLEMS: " + ", ".join(problems))
    return not problems


if __name__ == "__main__":
    args = set(sys.argv[1:])
    if "--check" in args:
        sys.exit(0 if check() else 1)
    build_html()
    if "--html" not in args:
        build_pdf()
