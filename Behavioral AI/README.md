# AI Behaviour — Stage 1 Markdown

**Status: revised 28 October 2026 using the lecturer overview and selected 2024/2025 examples; teammate review pending.** Prepared for DOOM's Hardware, Networks & Behaviorist AI module.

Start with the [detailed contents](table-of-contents.md), then read the [source chapter](chapter.md). This is the book-style Markdown foundation: explanations, definitions, original diagrams, worked examples and a compact set of review questions. The interactive study guide will be developed from it later.

**Stage 1 revision:** the user's account of the team leader's feedback is the revision brief. Selected completed 2024 guides and 2025 final-version materials have now been inspected locally. The [comparison record](previous-year-review.md) explains the sources and decisions; the [progress log](../student-log.md#28-october-2026--ai-behaviour-source-chapter-revision) records the work and its limits.

| File | Purpose |
| --- | --- |
| [table-of-contents.md](table-of-contents.md) | Detailed AI-only reading sequence, coverage and section status for the Stage 1 revision |
| [previous-year-review.md](previous-year-review.md) | Selected 2024/2025 source locations, inspection scope, teaching decisions and fingerprints |
| [chapter.md](chapter.md) | Book-style chapter with an MDP, worked Q-learning examples and five easy answered questions |
| [fixed-rule-vacuum.md](fixed-rule-vacuum.md) | Supplementary four-tile control exercise and 13-tick trace |
| [lecturer-scope-review.md](lecturer-scope-review.md) | Exact slide contents and evidence for the revised scope |
| [rl_vacuum_model.py](rl_vacuum_model.py) | Optional checks of the MDP and six Q-learning updates |
| [assets/learning-loop.svg](assets/learning-loop.svg) | Editable original learning-loop figure |
| [assets/learning-loop.png](assets/learning-loop.png) | Figure embedded in the main chapter |
| [research-and-sources.md](research-and-sources.md) | Claim-to-source table, precise locators, access limits, and lecturer-alignment questions |
| [diagram-specification.md](diagram-specification.md) | Original figure specification and state-machine diagram |
| [assets/perception-action-loop.svg](assets/perception-action-loop.svg) | Original standalone diagram used by the chapter |
| [assets/perception-action-loop.png](assets/perception-action-loop.png) | Raster copy for readers and PDF tools without SVG support |
| [vacuum_model.py](vacuum_model.py) | Optional executable reference for the invented corridor model; learners need no Python |
| [review-checklist.md](review-checklist.md) | Blank teammate review checklist and outcome form |
| [validation.md](validation.md) | Actual local consistency checks and their limits |

## Lecturer source status

The user supplied the local Chapter 6 file after the browser download was blocked. It has two slides: a title and an overview. Slide 2 includes RL basics, algorithms and techniques, MDPs, robotics and games, applications, and limitations. The main chapter now covers these topics; fixed-rule control remains a comparison.

The [scope review](lecturer-scope-review.md) records exactly what is supported. The deck supplies no required algorithm, worked example, teaching duration or depth. The separate Shared Assignment Rules attachment remains unchecked. Older student examples inform coverage and presentation; they do not establish additional current assessment requirements.

## Development status

| Item | Status |
| --- | --- |
| Book-style explanations, worked examples and five easy answered review questions | Revised using selected 2024/2025 comparisons |
| Primary-source claim map | Extended for model-based RL, SARSA, DQN and evaluation; older access limits retained |
| Detailed contents and previous-year comparison | Prepared |
| Original loop diagram and specification | Drafted |
| Executable model | Local trace and finite-configuration checks passed; see validation record |
| Lecturer slide alignment | Overview inspected; detailed expectations unspecified |
| Another member's substantive review | Pending; blank form supplied |
| Beginner learner trial / physical robot trial | Not performed |
| Personal learning log and AI-use record | User will complete separately; existing logs unchanged |
| Submission PDF and team ZIP | Not produced by this folder |

Optional fixed-controller check: `python "Behavioral AI/vacuum_model.py"` from the repository root. This verifies an invented discrete model, not real robot operation or learner understanding.

Optional learning-model check: `python "Behavioral AI/rl_vacuum_model.py"`. This checks a scripted educational replay, not random training or real robot performance.

## Reuse in later resources

- Study Guide: use the chapter, vocabulary table, diagrams and review questions after review; develop interactive activities separately.
- Test Bank: adapt Questions 1–5 while retaining their assumptions and explanations.
- Slides: use the loop diagram, a few trace rows, the mode distinction, and one limitation.
- Video: animate the corridor trace one tick at a time and ask the viewer to predict an action before revealing it.
- Team integration: connect sensor/actuator examples to Hardware and optional status messages to Networks. A suggested mini-lecture focuses on how a move with an immediate penalty gains value through later cleaning rewards. No particular duration is claimed as a BIT requirement.
