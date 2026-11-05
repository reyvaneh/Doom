# Learning materials in Markdown

**[Read the complete learning materials](learning-materials.md)** — Hardware, Networks and AI Behaviour, with 16 chapters, 10 appendices, worked examples, review questions, glossaries, references and diagrams.

Start with Chapters 1–6 for the beginner course, then continue with the practical and extended chapters. The contents page links directly to each chapter and subsection.

The complete file contains the same material as [Study Book.md](../Learning%20Materials/Study%20Book.md), with image and supporting-file links adjusted for this folder. Diagrams and practical files remain in their existing repository folders; keep those folders when sharing the Markdown. Existing PDFs are older source exports, not exports of this complete book.

## Unit sources

| Subject | Core lesson source |
| --- | --- |
| Hardware, Lessons 1–2 | [Unit A](unit-a-hardware.md) |
| Networks, Lessons 3–4 | [Unit B](unit-b-networks.md) |
| Behaviorist AI, Lessons 5–6 | [Unit C](unit-c-behaviorist-ai.md) |

For source attribution and review limitations, see the [maintenance record](../Learning%20Materials/Book%20Sources.md). The learning materials remain a draft awaiting the reviews recorded there.

## Updating the content

Edit the retained chapter sources listed in the maintenance record, then run `python tools/build_study_book.py` from the repository root. This rebuilds both complete Markdown editions together. Run `python tools/build_study_book.py --check` to verify that both match the sources and that local links, images and chapter anchors resolve. Do not edit the generated complete files directly.
