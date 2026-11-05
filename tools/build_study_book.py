"""Build the single reading edition from the team's retained chapter sources."""
from pathlib import Path
from urllib.parse import quote, unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "Learning Materials/Study Book.md"
MARKDOWN_OUTPUT = ROOT / "markdown_content/learning-materials.md"


def read(path):
    text = (ROOT / path).read_text(encoding="utf-8-sig")
    # Source copies carry a navigation banner, which is not part of the book.
    return re.sub(r"^> \*\*Reading edition:.*\n\n", "", text, flags=re.M)


def slug(text):
    text = re.sub(r"<[^>]+>", "", text).lower()
    return re.sub(r"[^\w\- ]", "", text).replace(" ", "-")


def headings(text):
    result = []
    fence = None
    for index, line in enumerate(text.splitlines()):
        marker = re.match(r"^(`{3,}|~{3,})", line)
        if marker:
            if fence is None:
                fence = marker[1][0]
            elif marker[1][0] == fence:
                fence = None
            continue
        match = re.match(r"^(#{1,6}) (.+)$", line)
        if match and fence is None:
            result.append((index, len(match[1]), match[2]))
    return result


sources = {}
blocks = []
targets = {}


def add(source, start, end, title, number, opening_section=False):
    text = sources.setdefault(source, read(source))
    lines = text.splitlines()
    hs = headings(text)
    begin = next(i for i, _, t in hs if t == start)
    finish = next((i for i, _, t in hs if i > begin and t == end), len(lines)) if end else len(lines)
    selected = "\n".join(lines[begin:finish]).strip()
    old = headings(selected)
    first_level = old[0][1]
    out = []
    cursor = 0
    selected_lines = selected.splitlines()
    for index, level, label in old:
        out.extend(selected_lines[cursor:index])
        if index == 0:
            new_level, new_label, anchor = 2, title, f"chapter-{number}" if isinstance(number, int) else f"appendix-{number}"
            if opening_section:
                clean = re.sub(r"^(?:[A-ZL]?\d+(?:\.\d+)*[. ·:]*\s+|[\W_]+\s*)", "", label).strip()
                out.extend([f'<a id="{anchor}"></a>', f'## {title}', "", f'### {number}.1 {clean}'])
                cursor = index + 1
                continue
        else:
            # Give every subsection a unique, numbered place in the book.
            new_level = min(6, level - first_level + (3 if opening_section else 2))
            if new_level <= 2:
                new_level = 3
            clean = re.sub(r"^(?:[A-ZL]?\d+(?:\.\d+)*[. ·:]*\s+|[\W_]+\s*)", "", label).strip()
            if new_level == 3:
                subsection = sum(1 for _, n, _ in headings("\n".join(out)) if n == 3) + 1
                new_label = f"{number}.{subsection} {clean}"
            else:
                new_label = clean
            anchor = f"{number}-" + slug(new_label)
        targets[(source, slug(label))] = anchor
        if index == 0:
            targets.setdefault((source, ""), anchor)
        out.extend([f'<a id="{anchor}"></a>', f'{"#" * new_level} {new_label}'])
        cursor = index + 1
    out.extend(selected_lines[cursor:])
    blocks.append((source, "\n".join(out)))


units = ["markdown_content/unit-a-hardware.md", "markdown_content/unit-b-networks.md", "markdown_content/unit-c-behaviorist-ai.md"]
titles = ["Inside a computer", "From bits to actions", "Connecting devices", "A message's journey", "Reactive behaviour", "Learning and integration"]
for unit_index, source in enumerate(units):
    lesson_heads = [t for _, n, t in headings(read(source)) if n == 2 and t.startswith("Lesson ")]
    for offset, head in enumerate(lesson_heads):
        num = unit_index * 2 + offset + 1
        end = lesson_heads[offset + 1] if offset == 0 else f"Unit {'ABC'[unit_index]} glossary"
        add(source, head, end, f"Chapter {num} — {titles[num - 1]}", num)

hardware = "Learning Materials/Hardware/hardware.md"
lab = "Learning Materials/Hardware/beginner-lab-skills.md"
network = "Learning Materials/Network/network_fundamentals.md"
ai = "Learning Materials/AIBehaviour/AIBehaviour.md"
add(hardware, "Part A — Inside a computer", "Part B — Physical computing: an automatic light indicator", "Chapter 7 — Computer architecture in practice", 7)
add(lab, "L1. Breadboards: which holes are connected", "References (additional to hardware.md)", "Chapter 8 — First laboratory skills", 8, opening_section=True)
add(hardware, "Part B — Physical computing: an automatic light indicator", "Part C — Going further: talking to other devices, capacitors, datasheets and sustainability", "Chapter 9 — Building an automatic light indicator", 9)
add(hardware, "Part C — Going further: talking to other devices, capacitors, datasheets and sustainability", "How this content becomes the three resources", "Chapter 10 — Interfaces, datasheets and sustainability", 10)
# Retain the original networking explanations as a practical companion chapter.
add(network, "01 · Understanding Computer Networks", "📖 References", "Chapter 11 — Networking diagrams and practice", 11, opening_section=True)
add(network, "11 · The OSI Model: The 7 Layers of Networking", None, "Chapter 12 — Network layers, performance and privacy", 12, opening_section=True)
add(ai, "5. Decision problems", "6. Q-learning", "Chapter 13 — Modelling an agent's decisions", 13)
add(ai, "6. Q-learning", "7. Applications", "Chapter 14 — A worked Q-learning example", 14)
add(ai, "7. Applications", None, "Chapter 15 — Applications, review and limits", 15)

# Collect glossaries and references in the same reading edition. Citation numbers
# remain scoped to their original unit to avoid silently changing attribution.
for index, source in enumerate(units):
    letter = "ABC"[index]
    add(source, f"Unit {letter} glossary", "Sources", f"Appendix {letter} — {'Hardware Networks AI'.split()[index]} glossary", letter)
for index, source in enumerate(units):
    letter = "DEF"[index]
    add(source, "Sources", None, f"Appendix {letter} — {'Hardware Networks AI'.split()[index]} lesson references", letter)
add(hardware, "References", None, "Appendix G — Practical hardware references and image credits", "G")
add(lab, "References (additional to hardware.md)", "Status note", "Appendix H — Laboratory references", "H")
refs = "Learning Materials/AIBehaviour/References.md"
add(refs, "AI Behaviour - References", None, "Appendix I — Detailed AI references and source limits", "I")
add(network, "📖 References", "11 · The OSI Model: The 7 Layers of Networking", "Appendix J — Networking companion references", "J")
# The sentence between the old reference list and extension belongs to the old
# page introduction, not to the collected bibliography.
source, body = blocks[-1]
body = body.split('\n<a id="J-')[0].rstrip()
blocks[-1] = (source, body)


def rewrite_url(url, source):
    if re.match(r"^(?:[a-zA-Z][\w+.-]*:|//)", url):
        return url
    path, _, fragment = unquote(url).partition("#")
    absolute = (ROOT / source).parent / path if path else ROOT / source
    relative = absolute.resolve().relative_to(ROOT).as_posix()
    key = (relative, fragment)
    if key in targets:
        return "#" + targets[key]
    # An omitted legacy section stays available in its original source copy.
    from os.path import relpath
    destination = quote(Path(relpath(absolute, OUTPUT.parent)).as_posix(), safe="/-._~")
    return destination + ("#" + fragment if fragment else "")


def rewrite(text, source):
    # Balanced Markdown destinations include filenames such as foo_(bar).jpg.
    text = re.sub(r"(\]\()((?:[^()\n]|\([^()]*\))*)(\))", lambda m: m[1] + rewrite_url(m[2], source) + m[3], text)
    return re.sub(r'(\b(?:src|href)=")([^"]+)(")', lambda m: m[1] + rewrite_url(m[2], source) + m[3], text)


front = """# Hardware, Networks & AI Behaviour

## A beginner's study book

**Team Doom · Consolidated reading edition · 4 November 2026**

A computer receives information, follows instructions and produces an output. A network lets it exchange information with other devices. An agent's controller decides which action to take. This book follows those three ideas from the parts inside a computer to a connected robot vacuum and a practical light indicator.

### How to read this book

Start with Chapters 1–6. These form the beginner course: hardware, networks, reactive behaviour and learning. Each chapter has worked examples, misconceptions and questions with answers. Try the questions before revealing the answers.

Chapters 7–10 are the practical hardware companion: architecture, laboratory skills, the automatic light indicator, interfaces and datasheets. Read Chapter 8 before attempting the Chapter 9 circuit. Chapters 11–12 provide extra networking diagrams and explanations. Chapters 13–15 extend the AI material with a precisely specified decision problem, Q-learning calculations and evaluation limits. Chapter 16 brings the subjects together in one design activity. The practical and numerical extensions can be read after the beginner course; they are not prerequisites for the introductory test bank.

No previous programming is needed for the core chapters. Practical extensions introduce code and circuit calculations. Values are teaching examples unless stated otherwise; the existing hardware qualifications and source limitations remain applicable. The book is a consolidated draft: source checking, teammate review and actual laboratory trials still need their recorded evidence.

“Behaviourist AI” is the course label. Here we distinguish reactive control, feedback and reinforcement learning: reacting or changing a programmed mode does not by itself demonstrate learning. Different examples specify different priorities; apply the rules stated in the example you are solving.

### Study tools and references

The appendices collect glossaries, sources and image credits. Bracketed numerical citations in Chapters 1–2 refer to Appendix D; Chapters 3–4 to Appendix E; Chapters 5–6 to Appendix F. S1–S18 citations in Chapters 13–15 refer to Appendix I. Practical hardware chapters retain their named-source citations and original section labels such as A5, B6 and C4; these correspond, in order, to subchapters in Chapters 7, 9 and 10. Laboratory L1–L8 correspond to Chapter 8.

Use the [46-question practice bank](../Test%20Bank/Questions.md), then consult its [explained answers](../Test%20Bank/AnswerKey.md). It remains a draft awaiting teammate and learner review. Ready-to-open [Arduino sketches](Hardware/arduino/README.md) and the optional [AI arithmetic check](AIBehaviour/checks/rl_vacuum_model.py) accompany the relevant chapters.

### Contents

{{CONTENTS}}

---
"""

integration = """
<a id="chapter-16"></a>
## Chapter 16 — Design a connected system

### 16.1 Follow one sensor reading

Imagine a proposed robot vacuum approaching a dirty tile. A sensor produces a reading. Hardware transfers that reading to the controller, whose instructions run on the processor using memory. The controller selects a cleaning command, and a driver and actuator carry it out. A later observation checks what happened. These are different jobs: receiving a reading does not guarantee a correct decision, and issuing a command does not guarantee successful movement.

![Original agent and reward loop, showing the separate action-value update](AIBehaviour/assets/learning-loop.png)

The diagram separates action selection from the reward-driven update used during learning. See Chapters 13–14 for the exact teaching model and Appendix I for its technical references.

The same chain appears in the light indicator: light changes the LDR resistance; the voltage divider supplies a voltage; the ADC returns a number; a threshold rule chooses an LED command. This rule is fixed unless an explicit mechanism changes it from experience.

### 16.2 Add an optional network message

A connected vacuum could report its status to a phone. Draw the vacuum's network interface, local access point, router and destination. State whether the destination is on the local network or reached through an Internet service. A local exchange need not use the Internet. The status packet reports information; the local control loop still decides what action is valid.

For this proposed design, define what happens when a pause request is delayed, duplicated or missing. One possible rule is to identify requests and reject expired requests under a stated clock convention. Describe an acknowledgement as evidence of receipt or acceptance only under the meaning you define; it does not prove that a motor physically stopped. This is a design exercise, not a description of a commercial vacuum.

### 16.3 Compare rules with learning

Write a fixed priority list for low battery, dirt and clear floor. Trace simultaneous low battery and dirt using that list. Then describe what a learning version would update, what reward it would receive, and how you would compare its later behaviour with the fixed controller. Keep the starting conditions and task definition the same. A changing score alone is insufficient evidence of learning.

### 16.4 Final activity

1. Draw and label the input, processor, RAM, storage, output and optional network path.
2. Trace a reading through a rule to a command and the next observation.
3. Explain what continues to work when the Internet connection is unavailable.
4. Give one hardware fault, one network fault and one unsuitable behaviour rule. Explain how you would tell them apart.
5. State what evidence would support a claim that learning improved the design.

### 16.5 Answer guide

A good diagram separates the sensing and actuation hardware from the controller and communication path. A valid trace applies the stated rule order and observes the result after acting. Offline operation depends on the stated design: the example's local sensing and rules can continue, while an Internet service cannot be assumed reachable. An incorrect sensor value suggests a hardware or measurement issue; a missing status message suggests a communication issue; a consistently unsuitable action despite correct input can expose a controller rule problem. Confirm each explanation with an appropriate measurement or trace. To assess learning, report comparable trials with stated conditions, success measures and failures; do not substitute the scripted Q-learning arithmetic for that evaluation.

---
"""

rendered = [rewrite(body, source) for source, body in blocks]
appendix_start = next(i for i, (_, body) in enumerate(blocks) if "## Appendix " in body)
rendered.insert(appendix_start, integration.strip())
body = "\n\n---\n\n".join(rendered)
toc = []
for _, level, title in headings(body):
    if level not in (2, 3):
        continue
    if title.startswith("Chapter "):
        anchor = "chapter-" + re.search(r"Chapter (\d+)", title)[1]
    elif title.startswith("Appendix "):
        anchor = "appendix-" + re.search(r"Appendix ([A-Z])", title)[1]
    else:
        anchor = slug(title)
    toc.append(("  " if level == 3 else "") + f"- [{title}](#{anchor})")

book = front.replace("{{CONTENTS}}", "\n".join(toc)) + "\n" + body + "\n"
# Preserve Markdown hard line breaks explicitly; avoid inherited trailing spaces.
clean_lines = []
in_code = False
for line in book.splitlines():
    if re.match(r"^(`{3,}|~{3,})", line):
        in_code = not in_code
    if not in_code:
        line = line.rstrip() + ("<br>" if line.endswith("  ") else "")
    clean_lines.append(line)
book = "\n".join(clean_lines).rstrip() + "\n"


def validate(book, output=OUTPUT):
    ids = re.findall(r'<a id="([^"]+)"', book)
    if len(ids) != len(set(ids)):
        raise SystemExit("Duplicate explicit book anchors")
    anchors = set(ids) | {slug(t) for _, _, t in headings(book)}
    urls = re.findall(r'\]\(((?:[^()\n]|\([^()]*\))*)\)', book)
    urls += re.findall(r'\b(?:src|href)="([^"]+)"', book)
    errors = []
    for url in urls:
        if re.match(r"^(?:[a-zA-Z][\w+.-]*:|//)", url):
            continue
        path, _, fragment = unquote(url).partition("#")
        if not path:
            if fragment not in anchors:
                errors.append(f"Missing book anchor: {url}")
        elif not (output.parent / path).exists():
            errors.append(f"Missing local destination: {url}")
    chapters = re.findall(r"^## Chapter (\d+) —", book, flags=re.M)
    if chapters != [str(i) for i in range(1, 17)]:
        errors.append(f"Unexpected chapter sequence: {chapters}")
    if errors:
        raise SystemExit("\n".join(sorted(set(errors))))
    print(f"Validated 16 chapters, 10 appendices and {len(urls)} links/images.")


validate(book)


def export_url(url):
    """Keep book anchors and rebase asset/source links for markdown_content."""
    if re.match(r"^(?:[a-zA-Z][\w+.-]*:|//|#)", url):
        return url
    from os.path import relpath
    path, separator, fragment = unquote(url).partition("#")
    destination = quote(
        Path(relpath(OUTPUT.parent / path, MARKDOWN_OUTPUT.parent)).as_posix(),
        safe="/-._~",
    )
    return destination + (separator + fragment if separator else "")


markdown_book = re.sub(
    r"(\]\()((?:[^()\n]|\([^()]*\))*)(\))",
    lambda m: m[1] + export_url(m[2]) + m[3],
    book,
)
markdown_book = re.sub(
    r'(\b(?:src|href)=")([^"]+)(")',
    lambda m: m[1] + export_url(m[2]) + m[3],
    markdown_book,
)
validate(markdown_book, MARKDOWN_OUTPUT)

if "--check" in sys.argv:
    for output, content in [(OUTPUT, book), (MARKDOWN_OUTPUT, markdown_book)]:
        if not output.exists() or output.read_text(encoding="utf-8") != content:
            raise SystemExit(f"{output.relative_to(ROOT)} needs rebuilding: python tools/build_study_book.py")
    print("Both reading editions match their chapter sources.")
else:
    for output, content in [(OUTPUT, book), (MARKDOWN_OUTPUT, markdown_book)]:
        output.write_text(content, encoding="utf-8", newline="\n")
        print(f"Built {output.relative_to(ROOT)} ({len(content.split()):,} words)")
