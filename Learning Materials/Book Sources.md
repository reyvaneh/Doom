# Study-book source and maintenance record

The [study book](Study%20Book.md) consolidates the material available across the repository's branches on 4 November 2026. The newer `markdown_content` lessons were brought in from the hardware branch before building the reading edition. Source history and original assets are retained.

| Book location | Retained source |
| --- | --- |
| Chapters 1–2; Appendices A, D | [Unit A](../markdown_content/unit-a-hardware.md) |
| Chapters 3–4; Appendices B, E | [Unit B](../markdown_content/unit-b-networks.md) |
| Chapters 5–6; Appendices C, F | [Unit C](../markdown_content/unit-c-behaviorist-ai.md) |
| Chapters 7, 9, 10; Appendix G | [Hardware](Hardware/hardware.md), teaching Parts A, B and C |
| Chapter 8; Appendix H | [Lab skills](Hardware/beginner-lab-skills.md), sections L1–L8 |
| Chapters 11–12; Appendix J | [Network fundamentals](Network/network_fundamentals.md), sections 01–14 |
| Chapters 13–15 | [AI Behaviour](AIBehaviour/AIBehaviour.md), sections 5–9 |
| Appendix I | [Detailed AI references](AIBehaviour/References.md) |
| Chapter 16 | New synthesis activity connecting the existing vacuum, light-indicator and network-request examples |

Repeated introductory definitions from the older AI and networking prerequisite sources are taught by the six core chapters. Their original files remain available; the AI learning-loop diagram is included in Chapter 16. Hardware development-status tables, the older course outline, research reports and Stage 1 submission records remain supporting records rather than chapters in the reading sequence. The introductory taxonomy/history in the newer AI source remains source background rather than a definition imposed on the whole book. Reactive robotics, psychological behaviourism and reinforcement learning are distinguished in the reading edition.

Numeric reference lists retain their original scopes. The book's opening pages identify the corresponding appendix. S1–S18 and their verification limits are preserved in Appendix I. Source exports, including existing PDFs, have not been relabelled as current book editions.

## Updating the book

The builder also writes the complete content to [markdown_content/learning-materials.md](../markdown_content/learning-materials.md), rebasing image and supporting-file paths for that folder. Both generated editions contain the same teaching material and are checked together.

Edit the relevant retained source, then run `python tools/build_study_book.py` from the repository root. The builder preserves fenced code examples, rewrites local links and images for the book's location, assigns unique anchors, and rebuilds the contents page. It validates chapter order and local link/image destinations. Run `python tools/build_study_book.py --check` to confirm the reading edition matches the sources. Keep changes to the source and book in the same commit.

Chapter 16 and the opening reading guide are maintained in the builder. Source navigation banners are excluded from the generated book. Supporting research documents are linked from the original sources; their findings have not been newly verified by this editorial consolidation.

## Review state

This is a consolidated study-book draft. Technical source checking, teammate review, a non-author learner trial, real hardware measurements and final assessment reconciliation need actual recorded outcomes. Existing checks establish only the specific results described by their review records. The Stage 1 submission record remains separate from Stage 2 completion.
