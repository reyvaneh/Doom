# Test Bank Review Record

**Version:** 1.0 draft<br>
**Date:** 30 October 2026<br>
**Status:** AI-assisted draft; local checks recorded below. Teammate review, a non-author learner trial and final Study Guide mapping remain pending.

## Version 1.1 peer-review revision (27 November 2026)

The Stage 2 peer review by team "team" agreed with all 46 version 1.0 key answers and asked for the changes below. They are made in `bank.json`, and `Questions.md` and `AnswerKey.md` were regenerated with `tools/build_test_bank.py --markdown-only`.

- **Answer cues.** Distractors that gave the answer away (for example Monitor/Keyboard/Speaker in MC01, Microphone/printer/paper in MC05, Keyboard/Monitor/Microphone in MC11, "Clean the laptop screen" in MC13) were replaced with plausible misconceptions of similar length: RAM/SSD/motherboard for the CPU, switch/hub/access point for the router, DNS/router/Wi-Fi encryption roles for DHCP, and so on. The correct option is no longer the single longest choice in any MCQ, including MC07, MC12, MC14 and MC19. Keys are balanced across all 30 MCQs (A 8, B 7, C 8, D 7). Correct answers to MC01-MC20 are unchanged; explanations now say why each distractor is wrong.
- **Coverage.** Ten extension MCQs were added (MC21-MC30): TCP handshake, OSI transport layer and ports, von Neumann vs Harvard, 16-bit address bus, multimeter current measurement, resistor colour code, a program-counter fetch trace, a running-average update, a Q-learning update and a discounted return. The bank now has 56 questions.
- **Recomputed values.** Running average: 2.0 + (8 − 2.0) ÷ 2 = 5.0. Q-update: target 2 + 0.9 × 10 = 11.0, new Q = 1.0 + 0.5 × (11.0 − 1.0) = 6.0. Discounted return: 4 − 0.9 + 0.81 × 10 = 11.2 (the same sequence as AI Behaviour 5.2). Address bus: 2^16 = 65,536. Resistor red-red-brown-gold: 22 × 10 = 220 Ω ±5%. PC after fetching address 1: 2.
- **Traceability.** Every question now ends with "→ Guide §x.y", pointing to the section of the Stage 2 Study Guide (16 chapters) where the idea is taught. The header states that the core questions mainly assess Chapters 1-6 and the extension questions Chapters 7-16.
- **Wording.** The MC03 explanation now reads "The inputs are not both 1". The open-ended questions have their own headings, so OE03 (visiting a website: DNS, router and web server) and OE04 (star and mesh networks when a link fails) are no longer both labelled only "Networks".
- **Not changed here.** The Word document, the interactive HTML guide and test bank, and the PDFs still show version 1.0 and need regenerating. The review's other points (§6.4 policy-flip trial label, §14 "Episode 2, Step 3" label, the insulting opening voice, and B being correct in 37 of the guide's 48 gatekeeper questions) are in the interactive Study Guide's content, not in these Markdown files.

## Scope and difficulty

The user requested simple questions that cover the materials without going too deep. The draft uses 46 questions across all three units: 20 true/false, 20 single-answer multiple-choice and 6 guided open-ended questions. Each open-ended question has three short parts; its sample answer has more than 100 words, and learners can instead give equivalent reasoning with a diagram, table or trace.

Version 1.0 excluded advanced Q-learning calculations, detailed circuit calculations and network configuration tasks; version 1.1 adds three short calculations with every formula and value supplied (MC28-MC30). The small binary addition and logic-gate question supply the information needed to solve them. Network link lists and robot rules are given in the question itself.

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
