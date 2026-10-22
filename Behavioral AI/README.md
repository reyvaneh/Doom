# Behavioral AI — Stage 1 research and teaching draft

**Status: drafted; lecturer alignment pending; teammate review pending.** Prepared 2026-10-22 for DOOM's Hardware, Networks & Behaviorist AI module.

Start with the [teaching chapter](chapter.md). It contains the scope recommendation, beginner learning sequence, explanations, worked vacuum example, activities, explained answers, and limitations.

| File | Purpose |
| --- | --- |
| [chapter.md](chapter.md) | Beginner teaching material and fully specified example |
| [research-and-sources.md](research-and-sources.md) | Claim-to-source table, precise locators, access limits, and lecturer-alignment questions |
| [diagram-specification.md](diagram-specification.md) | Original figure specification and state-machine diagram |
| [assets/perception-action-loop.svg](assets/perception-action-loop.svg) | Original standalone diagram used by the chapter |
| [assets/perception-action-loop.png](assets/perception-action-loop.png) | Raster copy for readers and PDF tools without SVG support |
| [vacuum_model.py](vacuum_model.py) | Optional executable reference for the invented corridor model; learners need no Python |
| [review-checklist.md](review-checklist.md) | Blank teammate review checklist and outcome form |
| [validation.md](validation.md) | Actual local consistency checks and their limits |

## Lecturer source status

The authenticated [Lexue Learning materials page](https://lexue.bit.edu.cn/mod/folder/view.php?id=544488) lists `PPT 2024 / chap6 Behaviorist AI.pptx`. Opening the download in Edge, including after reopening the browser at the user's request, returned `ERR_BLOCKED_BY_CLIENT`. No slide contents or speaker notes were available for inspection. The filename establishes the resource's presence, not its contents or its current-year authority.

Consequently, this draft does **not** establish the lecturer's intended scope. Its scope is a research-backed recommendation awaiting the slide file and team confirmation. The separate Shared Assignment Rules attachment also remains unchecked.

## Development status

| Item | Status |
| --- | --- |
| Teaching explanations, example, activities and answers | Drafted |
| Primary-source claim map | Prepared, with access limits recorded |
| Original loop diagram and specification | Drafted |
| Executable model | Local trace and finite-configuration checks passed; see validation record |
| Lecturer slide alignment | Pending access to actual slides |
| Another member's substantive review | Pending; blank form supplied |
| Beginner learner trial / physical robot trial | Not performed |
| Personal learning log and AI-use record | User will complete separately; existing logs unchanged |
| Submission PDF and team ZIP | Not produced by this folder |

Optional local check: `python "Behavioral AI/vacuum_model.py"` from the repository root. This verifies an invented discrete model, not real robot operation or learner understanding.

## Reuse in later resources

- Study Guide: use the chapter, glossary, diagrams, and answered activities after review.
- Test Bank: adapt Questions 1–8 while retaining their assumptions and explanations.
- Slides: use the loop diagram, a few trace rows, the mode distinction, and one limitation.
- Video: animate the corridor trace one tick at a time and ask the viewer to predict an action before revealing it.
- Team integration: connect sensor/actuator examples to Hardware and optional status messages to Networks. A suggested mini-lecture focuses on the simultaneous low-battery/dirty-tile case. No particular duration is claimed as a BIT requirement.
