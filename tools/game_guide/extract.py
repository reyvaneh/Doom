"""Extract the Stage 2 study guide content into one data model.

The source is the original hand-built interactive guide, kept in git history.
Every chapter, question, glossary term and image is carried over word for word;
only the presentation is rebuilt by build_game_guide.py.
"""
from pathlib import Path
import hashlib
import json
import re
import subprocess

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[2]
# Last commit holding the original hand-built guide. The redesigned page
# replaces that file, so the source must be read from history.
SOURCE_REV = "df4bac4"
SOURCE_PATH = "DOOM_Stage2_Study_Guide_Interactive.html"

DATA_URI = re.compile(r"data:image/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+|data:image/svg\+xml[^\"')]+")


def source_html():
    return subprocess.run(
        ["git", "show", f"{SOURCE_REV}:{SOURCE_PATH}"],
        cwd=ROOT, check=True, capture_output=True,
    ).stdout.decode("utf-8")


class Assets:
    """Deduplicates embedded images so each one is stored once."""

    def __init__(self):
        self.by_uri = {}
        self.items = {}

    def key(self, uri):
        if uri not in self.by_uri:
            k = "a" + hashlib.sha1(uri.encode()).hexdigest()[:10]
            self.by_uri[uri] = k
            self.items[k] = uri
        return self.by_uri[uri]

    def tokenize(self, html):
        """Replace inline data URIs in an HTML fragment with asset tokens."""
        return DATA_URI.sub(lambda m: "asset:" + self.key(m.group(0)), html)


def inner(node):
    return "".join(str(c) for c in node.contents).strip() if node else ""


def text(node):
    return node.get_text(" ", strip=True) if node else ""


def extract():
    raw = source_html()
    soup = BeautifulSoup(raw, "html.parser")
    assets = Assets()

    chapters = []
    for art in soup.select("article.chapter-card"):
        num = int(art["data-chapter"])
        title = text(art.select_one(".chapter-title"))
        title = re.sub(r"^Chapter \d+:\s*", "", title)
        banner = art.select_one(".chapter-banner-img")
        avatar = art.select_one(".doom-avatar")

        core = art.select_one(".core-explanation-card")
        label = core.select_one(".card-section-label")
        if label:
            label.decompose()
        # Split the exposition into its numbered x.y sections.
        sections, current = [], None
        for child in core.children:
            if getattr(child, "name", None) == "h3":
                current = {"title": inner(child), "html": ""}
                sections.append(current)
            elif current is not None:
                current["html"] += str(child)
            elif str(child).strip():
                sections.append(current := {"title": "", "html": str(child)})
        for s in sections:
            s["html"] = assets.tokenize(s["html"].strip())

        act = art.select_one(".activity-card")
        activity = {
            "title": text(act.select_one(".activity-title")),
            "parts": [
                {"label": text(p.select_one(".act-label")), "html": assets.tokenize(inner(p.select_one(".act-content")))}
                for p in act.select(".act-part")
            ],
        }

        questions = []
        for card in art.select(".rq-card"):
            opts = []
            for b in card.select(".rq-opt-btn"):
                t = text(b.select_one(".rq-opt-text"))
                opts.append(re.sub(r"^[A-D]\)\s*", "", t))
            fb = card.select_one(".rq-feedback")
            hint = card.select_one(".rq-hint-box")
            strong = hint.find("strong") if hint else None
            if strong:
                strong.decompose()
            questions.append({
                "prompt": inner(card.select_one(".rq-prompt")),
                "options": opts,
                "answer": fb["data-answer"],
                "hint": inner(hint),
                "explanation": inner(fb.select_one(".rq-explanation")),
            })

        glossary = [
            {"term": text(g.select_one(".glossary-term")), "def": inner(g.select_one(".glossary-def"))}
            for g in art.select(".glossary-item")
        ]

        chapters.append({
            "n": num,
            "unit": art["data-unit"],
            "title": title,
            "banner": assets.key(banner["src"]) if banner else None,
            "avatar": assets.key(avatar["src"]) if avatar else None,
            "directive": inner(art.select_one(".directive-body")),
            "objectives": [inner(li) for li in art.select(".goals-list li")],
            "sections": sections,
            "meanwhile": inner(art.select_one(".meanwhile-body")),
            "activity": activity,
            "questions": questions,
            "glossary": glossary,
        })

    script = soup.find_all("script")[-1].string
    bank = json.loads(re.search(r"const QUESTIONS = (\[.*?\]);\n", script, re.S).group(1))
    terms = json.loads(re.search(r"const GLOSSARY_TERMS = (\[.*?\]);\n", script, re.S).group(1))

    # Decorative art from the old stylesheet (stained-glass panels etc.).
    style = "".join(s.string or "" for s in soup.find_all("style"))
    decor = []
    for m in re.finditer(r"(\.[\w-]+)[^{]*\{[^}]*?url\(\"(data:image[^\"]+)\"\)", style):
        decor.append({"selector": m.group(1), "asset": assets.key(m.group(2))})
    crest = soup.select_one(".crest-icon")

    return {
        "chapters": chapters,
        "bank": bank,
        "glossary": terms,
        "decor": decor,
        "crest": assets.key(crest["src"]) if crest else None,
    }, assets.items


if __name__ == "__main__":
    model, items = extract()
    print(len(model["chapters"]), "chapters")
    print(sum(len(c["questions"]) for c in model["chapters"]), "review questions")
    print(len(model["bank"]), "bank questions;", len(model["glossary"]), "glossary terms")
    print(len(items), "unique images;", sum(len(v) for v in items.values()) // 1024, "KB")
    print(model["decor"])
