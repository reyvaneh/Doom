# Test Bank

**Status: version 1.1, revised after the Stage 2 peer review (27 November 2026); teammate review pending.**

This folder holds Team Doom's Stage 2 test-bank draft for **Hardware, Networks & Behaviorist AI**. It accompanies the [consolidated study book](../Learning%20Materials/Study%20Book.md). Read its six core chapters first; the advanced extensions are not prerequisites for this beginner bank. Teammate review and final question-by-question reconciliation remain pending.

Start with [Questions.md](Questions.md), then check [AnswerKey.md](AnswerKey.md). The [editable Word document](Doom_Stage2_TestBank_V1.docx) combines all questions with the answer key afterward. [PLAN.md](PLAN.md) records the coverage and [Review.md](Review.md) records checks and outstanding review work.

An [interactive HTML practice version](../DOOM_Test_Bank_Interactive.html) is also retained from the latest main-branch contribution. Download it and open it in a browser; its assessment content needs the same final reconciliation as the other versions.

The bank contains **56 questions: 20 true/false, 30 multiple-choice (20 core and 10 extension) and 6 guided open-ended questions**. Hardware has 21 questions, Networks 18 and AI Behaviour 17. The core questions mainly assess Study Guide Chapters 1-6 through basic understanding, everyday examples and short reasoning. The extension questions MC21-MC30 assess Chapters 7-16 material and the Guide's short calculations (running average, Q-learning update, discounted return), with every formula supplied. Each question names its Study Guide section ("→ Guide §x.y"). No real circuit or network account is needed.

The Word document will be included in `Doom_Stage2_StudyGuide_TestBank_V1.zip` alongside the Study Guide and required activity files when those are ready. This folder is the test-bank contribution, not a complete Study Guide submission package. A PDF copy is optional and is not included.

`bank.json` is the shared authoring source. `tools/build_test_bank.py` regenerates both Markdown copies and the Word document using Python with `python-docx` (`--markdown-only` rebuilds just the Markdown). After edits, rebuild and repeat the checks and visual review before replacing the exported document. **Version 1.1 note:** the Markdown copies have been regenerated from `bank.json`; the Word document and the interactive HTML still hold version 1.0 and need regenerating before submission.

Before submission, another member must attempt every question, selected activities need a non-author learner check, and the bank must be reconciled with the completed Study Guide. These Stage 2 checks have not been claimed as complete.
