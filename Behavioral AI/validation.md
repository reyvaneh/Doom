# Local validation — 2026-10-22

These are checks of the authored teaching artifacts. They are not a teammate review, a personal learning log, a physical robot experiment, or a learner trial.

## Executable discrete model

Ran `vacuum_model.py` with the bundled Python runtime. Output:

```text
Passed: 13 trace ticks; 16896 finite configurations; return bound and counterexamples.
These checks cover only the stated discrete model, not physical robot safety or learner results.
```

The 16,896 configurations enumerate 4 positions × 11 integer energy levels × 16 dirt maps × 3 modes × 8 static barrier arrangements. The assertions check position/energy bounds, legal actions, dirt changes, zero-energy waiting, and defensive handling of CHARGE away from the dock.

Additional assertions compare the chapter's 13 expected trace results, check unobstructed returns with sufficient energy up to the threshold, compare two modes under identical observations, and reproduce the barrier, insufficient-energy, and right-first coverage counterexamples.

The program and chapter can still share a mistaken assumption. Independent manual review is required. Exhaustive one-step checks on this finite model do not establish correctness in other environments or prove physical robot safety.

## Diagram

Rendered the original SVG to a 1100 × 560 PNG and visually inspected the output. Labels and arrows are readable at the inspected size. The chapter embeds the PNG, with editable SVG retained alongside it. This does not establish readability in a future team PDF; inspect that actual export separately.

## Remaining verification

- Detailed course expectations beyond the two-slide lecturer overview, now inspected.
- Full-text recheck for sources accessed only as indexed passages.
- Another member's recorded technical and teaching review.
- Beginner learner trial, if the team chooses to perform one.
- Final rendered PDF and extracted submission ZIP.
- User's authentic AI-use record and personal log, to be completed separately.

## Redesign checks after lecturer-file inspection

The local file has two slides, neither hidden. Both were read in presentation order; no pictures or linked notes were found. Slide 2 explicitly lists RL basics, algorithms, MDPs, robotics/games, applications and limitations. The scope review records these contents without inferring required depth.

Ran `rl_vacuum_model.py` with the bundled Python runtime:

```text
Passed: 24 nonterminal state-action transitions; terminal guards; 6 scripted Q updates; return 11.2.
Scripted educational replay only; no random training, convergence or physical performance result.
```

The earlier fixed-rule model was rerun and still passed its 13 trace rows and 16,896 finite configurations. The learning example is a separate model; these counts must not be combined into a claim about RL training. This paragraph records the original local checks; current Git history determines the publication state.

## 28 October 2026 source-chapter revision

Re-ran both unchanged Python models using the bundled runtime. They again reported:

```text
Passed: 24 nonterminal state-action transitions; terminal guards; 6 scripted Q updates; return 11.2.
Passed: 13 trace ticks; 16896 finite configurations; return bound and counterexamples.
```

Additional one-off checks used the learning model's update function for the new illustrative values: target 5.6, revised estimate 3.3, and terminal alternative 1.5. The boundary example was checked against the model: LEFT from `(A, 0, 1)` leaves that state unchanged at reward −1, followed by RIGHT to `(B, 0, 1)` at reward −1. A separate enumeration of the game example's 12 nonterminal state–action pairs confirmed its coordinate bounds and rewards; RIGHT then UP reaches the terminal collectible with rewards −1 and 5.

The five chapter-end questions were reviewed against the definitions, stated rule order, update distinction, state/action examples and delayed-return explanation. They require simple reasoning rather than arithmetic or advanced algorithm knowledge. This is an assisted consistency check, not another team member's review.

The [previous-year record](previous-year-review.md) describes extraction and five rendered source-page inspections. Source files and temporary extracts remain outside the public change. The new Markdown is a book-style source chapter; a new PDF, interactive study guide, videos and training evaluation were not produced.

All 115 local file links and heading anchors in the AI Markdown files and public progress log resolved in the final link check. Code fences were balanced and the chapter-end question count was five. `git diff --check` passed. These source checks do not establish the layout of a future book export.
