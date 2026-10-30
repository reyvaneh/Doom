# Test Bank Review Record

**Version:** 1.0 draft<br>
**Date:** 30 October 2026<br>
**Status:** AI-assisted draft; local checks recorded below. Teammate review, a non-author learner trial and final Study Guide mapping remain pending.

## Scope and difficulty

The user requested simple questions that cover the materials without going too deep. The draft uses 46 questions across all three units: 20 true/false, 20 single-answer multiple-choice and 6 guided open-ended questions. Each open-ended question has three short parts; its sample answer has more than 100 words, and learners can instead give equivalent reasoning with a diagram, table or trace.

Advanced Q-learning calculations, detailed circuit calculations and network configuration tasks were excluded. The small binary addition and logic-gate question supply the information needed to solve them. Network link lists and robot rules are given in the question itself.

## Local content checks

- Checked all question IDs, topic allocations and matching answer entries from `bank.json`.
- Confirmed 20 true/false statements, 20 MCQs with four options and exactly one designated answer, and 6 open-ended items with sample answers and expected key points.
- Recomputed 0101 as 4 + 1 = 5; checked the supplied AND rule for inputs 1 and 0 gives 0.
- Applied the light rule to 300, 700 and 400: off, on, off.
- Traced the alternate mesh route A to B to C using only the listed surviving links.
- Traced robot Cases A, B and C: return, clean, move. Reversing the first two priorities makes Case A clean.
- Kept local connectivity separate from Internet reachability, DNS separate from webpage content, and programmed mode changes separate from learning.
- Compared the draft's concepts with the source sections named in every question. Source labels refer to the current learning chapters, not to a Study Guide that has yet to be finalized.
- Reopened the generated Word package and checked that every prompt and explanation/sample answer is present and all questions appear before the answer key.

Counts, package checks and scripted traces establish consistency of this draft. They do not establish that a teammate has attempted the questions or that beginners find them clear.

## Export checks

The final editable Word document was exported through Microsoft Word to a temporary PDF, then all **12 pages** were rendered to PNG and visually inspected on 30 October 2026. The packaged LibreOffice renderer could not run because its executable was unavailable; Microsoft Word supplied the actual document layout for this check.

The initial export exposed uneven page breaks and a decorative border inherited from the default template. The builder was corrected, the document was rebuilt and rendered again, and every final page was inspected. The final copy has readable text, complete question blocks, no blank pages and an answer key starting after all questions. Temporary PDF and PNG files are QA material, not additional submission files.

## Teammate review to complete

Another member should answer every item before viewing the key, then compare with the answer and the named learning section. Record the reviewer, date, IDs attempted, actual response or finding, and any correction. For MCQs, specifically check that a second option cannot reasonably be correct. For open-ended questions, accept equivalent correct reasoning.

Use a record such as:

| Question IDs | Reviewer and date | Finding or attempted answer | Change or confirmation | Status |
| --- | --- | --- | --- | --- |
| Not yet recorded | Not yet recorded | No teammate attempt recorded | Awaiting actual review | Pending |

Have a non-author try selected activity scenarios, including the light readings, network path and robot rule trace. Record confusion and resulting corrections. Do not replace this with the author's own checks.

Before submission, confirm that the completed Study Guide teaches every assessed concept. Add its actual section references, correct discrepancies in all affected resources, and include the editable bank with the Study Guide in the required ZIP.

## AI assistance in this task

Tool: Codex. The user requested: "simple questions. not too complex or deep but still covers the materials" and "start implementation and sync branches". Codex drafted the question bank, explanations, sample answers and export builder using the existing module chapters and the assignment requirements already read in Lexue. It checked the counts and supplied traces and prepared the Word export.

The team's project and personal logs still need the relevant interaction excerpts, verification, decisions and actual individual learning. This technical record does not invent team contributions, personal reflections, reviewer names or learner-trial results.
