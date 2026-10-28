# Previous-year reference review

**Reviewed: 28 October 2026. Scope: AI Behaviour source chapter on `ai-behavior`.**

This records how the completed local 2024 and 2025 course examples informed the Stage 1 Markdown revision. The user's account of the team leader's feedback is the revision brief: improve the Markdown content and organization. The output is a book-style source chapter for later study-guide development, with a compact set of chapter-end questions. It is not a new interactive study guide or a Stage 2 production package.

## Material inspected

The downloaded collection is named `Intro to AI & CS`. Paths below are relative to that collection. The 2025 `PPT & Videos V1.0/notes.txt` advises using final versions as references when developing the first version. We therefore selected 2024 V3.0 guides and 2025 V3.0 documents. The folder year identifies the collection, not necessarily the date of every slide: one Power Bank slide contains a January 2026 date.

| ID | Document and location | Relevant locators inspected | Use and limit |
| --- | --- | --- | --- |
| Y24-A | `2024 - Intro to AI and CS/09、study guide v3.0/Team MHz Behaviorism and Hardware(fun to read).pdf` | PDF pp. 5–6, 87–92, 97–104; pp. 90–92 introduce a vacuum and grid | Useful progression from an everyday explanation to agent, environment and a decision problem. Keep a recurring example, but specify transitions and numerical updates explicitly rather than implying that a policy automatically improves |
| Y24-B | `2024 - Intro to AI and CS/09、study guide v3.0/Technova Hardware and Behavioral AI.pdf` | PDF pp. 3–4, 80–86 | Useful chapter hierarchy and end-of-chapter questions. Its behavioural-analysis framing differs from action-policy learning; the new introduction explains this distinction rather than combining the definitions |
| Y24-C | `2024 - Intro to AI and CS/09、study guide v3.0/MindWare Hardware and Behaviorism.pdf` | PDF pp. 113, 116–117, 122, 124, 130; printed pages differ, e.g. PDF p. 130 is printed p. 116 | Shows an algorithms overview and a stochastic grid case. Our chapter separates planning, model-based learning and model-free learning. Its two-tile example remains deterministic; we do not import an incompletely specified stochastic example |
| Y25-A | `2025-intro to AI and CS/PPT & Videos V3.0/Power Bank Video Tutorial Script PPT Improvement.zip` → `Power Bank Video Tutorial Script PPT Improvement/ppt/Chapter 13 Definition of Behaviorist.pdf`, `Chapter 15 Behaviorist Learning Method.pdf`, `Chapter 16 Behaviorist Limitations.pdf`, `Chapter 17 Behaviorist Techniques.pdf`, `Chapter 18 Key Concepts of Behaviorist AI.pdf`, `Chapter 19 Application of Behaviorist AI.pdf` | Chapter 13 pp. 1–8; Chapter 15 pp. 1–10, especially p. 4; Chapter 16 pp. 1–9, especially pp. 4–5; Chapter 17 pp. 1–10; Chapter 18 pp. 1–8; Chapter 19 pp. 1–7 | Coverage prompts: terminology, learning methods, hardware limitations and applications. Keep the AI mechanisms precise; avoid importing psychological terminology as if it were a complete definition of RL, or treating every application as a deployed learning system |
| Y25-B | `2025-intro to AI and CS/PPT & Videos V3.0/Paper T-Rex Ppt & video tutorial v3.0.zip` → `Script - Paper T-Rex (1).pdf` | PDF p. 41 and opening continuation on p. 42 | Introduces perception/action and several learning approaches. Add a short, sourced methods comparison rather than a long list of unexplained algorithms. Do not adopt a claim that all agents continuously learn or that learning guarantees optimal behaviour |

Text was extracted from three complete 2024 guides and eight selected PDFs from the 2025 archives, including the Paper T-Rex improvement report. Close content review was limited to the locators above; the improvement report was screened but did not supply a technical claim. Five source pages were rendered and visually inspected: Y24-A p. 90, Y24-B p. 80, Y24-C p. 130, Y25-A Chapter 15 p. 4 and Y25-B p. 41. No videos were reviewed.

Selected ZIP members were read with archive CRC checking. PDF files opened successfully, and their sizes and modification times were unchanged during extraction. Files carrying Baidu's `.downloading` suffix were excluded. This establishes usability of the selected documents, not completion of the whole 77.68 GB collection. Extracts and rendered source pages remain in ignored local staging; third-party PDFs, slides, personal logs and artwork are not added to the public commit.

## Changes made

| Reference observation | Decision for this chapter | Resulting material |
| --- | --- | --- |
| A book benefits from a visible hierarchy and recurring example | Keep short chapter headings, detailed contents and one main vacuum model | [Contents](table-of-contents.md), chapter §§1–6 |
| Similar labels cover different meanings of behaviour | State the chapter's action-selection scope and distinguish a learned policy from behavioural prediction | Chapter §1 |
| Everyday examples help introduce unfamiliar terms | Explain an automatic door and one sensor-to-action cycle in prose | Chapter §2 |
| Mode changes can be mistaken for learning | Compare a programmed mode transition with a learned estimate | Chapter §§3–4 |
| Algorithm lists do not explain their differences | Compare known-model planning, model-based RL, Q-learning, SARSA and DQN; work through only Q-learning | Chapter §6.5 |
| Examples need explicit assumptions and boundaries | Retain the fully specified two-tile MDP; add a boundary trace and a terminal/nonterminal update comparison | Chapter §§5.3, 6.4 |
| Applications need mechanisms, not just industry names | Define a small game model and an optional network-message example | Chapter §7 |
| “It learns” can conceal missing evaluation | Distinguish replay checks, training and evaluation; describe a future comparison without inventing results | Chapter §9 |

The prose, numerical extensions, tables and questions are newly written for this repository. No student text, pictures, question sets or slide layouts are reproduced. The robot-vacuum theme was already in this repository before this comparison; it is not presented as a new idea discovered in the downloaded guides.

## Technical verification

Previous student work is a reference for coverage and explanation, not the authority for technical claims. New method descriptions were checked on 28 October 2026 against the university and author sources recorded as S15–S18 in the [source map](research-and-sources.md). S11 and S14 were also revisited. The sources support the mechanisms; the numerical settings, extra example and evaluation proposal are our own teaching choices.

The 2024 materials and 2025 slides do not establish new 2026 assessment requirements. The supplied lecturer overview still supplies the course topic list. We have not added every algorithm or psychology topic named by another team to the core chapter. This update improves the current source material; it is not an exhaustive survey of AI developments through 2026.

## Source fingerprints

SHA-256 hashes identify the inspected PDFs. For archived items, these are hashes of the selected decompressed PDF, not the full video archive.

| Document | SHA-256 |
| --- | --- |
| Y24-A, Team MHz | `4a79bdc4ce3545c59290f8f76d8137a9b7ef6130dcb2de97e5c6ada767dcc5cd` |
| Y24-B, Technova | `571672d9a2477392f067147d71c86c2cfe8d09af4a555f0e85538fb534fddd46` |
| Y24-C, MindWare | `15c7ffc2cf1a19dedb1479fed430691454f6446519332f5c4853faf8285a9ae5` |
| Y25-A, Chapter 13 | `0fa8ca9afd848888b70b28ea9bc7dc3c9c60de833ff3656b55df88c8098f22a2` |
| Y25-A, Chapter 15 | `42d6b26297a2a152868616d4987acec3e9878459c624549c584a46b055f77b44` |
| Y25-A, Chapter 16 | `f0931352348c68651fe5b857a649689d1f91495ae4d63faa795c219c5a8c36cf` |
| Y25-A, Chapter 17 | `07b7b7d69e64c919859b78097544d8883ea6fd5c18bae069be621bf276eabee1` |
| Y25-A, Chapter 18 | `c41ea692b5fa4b9e03daab5c443f396969511f31764247b9bbde1b91b504a673` |
| Y25-A, Chapter 19 | `434e1afcdc399dfe70301de9bd236bac57800ea1a0322ff13646d22f7411c5b7` |
| Y25-B, Paper T-Rex script | `04e27853c3af19ae7f1d3842371f8e83928b098eee5fb7bd96bd84d4a64a8895` |

## Remaining review

Another team member should check the revised explanations and new arithmetic, then record a concrete outcome in the [review checklist](review-checklist.md). This source inspection and technical recheck were carried out with Codex assistance and do not count as that independent review. Book assembly, final export checks, learner testing and the later interactive study guide remain separate work.
