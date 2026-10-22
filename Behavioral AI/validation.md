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

- Actual lecturer Chapter 6 slide contents and course alignment.
- Full-text recheck for sources accessed only as indexed passages.
- Another member's recorded technical and teaching review.
- Beginner learner trial, if the team chooses to perform one.
- Final rendered PDF and extracted submission ZIP.
- User's authentic AI-use record and personal log, to be completed separately.
