# Behavioral AI — Stage 1 research and teaching draft

**Status: redesigned against the lecturer overview; teammate review pending.** Prepared 2026-10-22 for DOOM's Hardware, Networks & Behaviorist AI module.

Start with the [teaching chapter](chapter.md). It contains the scope recommendation, beginner learning sequence, explanations, worked vacuum example, activities, explained answers, and limitations.

| File | Purpose |
| --- | --- |
| [chapter.md](chapter.md) | RL chapter with an MDP, Q-learning updates and answered activities |
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

The [scope review](lecturer-scope-review.md) records exactly what is supported. The deck supplies no required algorithm, worked example, teaching duration or depth. The separate Shared Assignment Rules attachment remains unchecked. The downloaded PPTX and these revisions remain uncommitted at the user's request.

## Development status

| Item | Status |
| --- | --- |
| Teaching explanations, example, activities and answers | Drafted |
| Primary-source claim map | Prepared, with access limits recorded |
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

- Study Guide: use the chapter, glossary, diagrams, and answered activities after review.
- Test Bank: adapt Questions 1–9 while retaining their assumptions and explanations.
- Slides: use the loop diagram, a few trace rows, the mode distinction, and one limitation.
- Video: animate the corridor trace one tick at a time and ask the viewer to predict an action before revealing it.
- Team integration: connect sensor/actuator examples to Hardware and optional status messages to Networks. A suggested mini-lecture focuses on how a move with an immediate penalty gains value through later cleaning rewards. No particular duration is claimed as a BIT requirement.
