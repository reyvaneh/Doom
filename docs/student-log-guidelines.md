# Student log standard

Use this standard on `study-guide`, `hardware`, `network`, and `ai-behavior`. The templates and rules are public; completed personal logs belong in the private submission workspace.

## Separate the records

- `student-log.md` is the public team development log. Include public contributor handles, actual work, repository evidence, decisions, and next actions. Do not add student IDs, private discussions, or personal learning reflections here.
- Each member maintains their own private personal learning and work log using [the template](../templates/student-log-template.md). Include course learning beyond the assigned topic as well as project work.
- The submission lead combines private personal logs into one Word/PDF with a contents list and each member starting on a new page. Add roster name, student ID, team, and reporting period privately. Do not commit the completed document.
- Project meeting records need actual date/time/platform, attendance, agenda, discussions, decisions, and follow-ups. Personal logs do not replace meeting records.

## Required entry format

1. Use `YYYY-MM-DD` dates and state the timezone, normally `Asia/Jakarta` or `Asia/Shanghai`. Record actual duration; use `Not recorded` for unknown details.
2. Give each entry a unique ID: `YYYY-MM-DD-handle-01`. Use the same ID in evidence captions and submission cross-references.
3. Record the branch, topic, goal, substantive work, learning, outcome, difficulties, reflection, and next steps. Use `Completed`, `Partial`, or `Blocked` for outcomes. Planned work belongs under next steps.
4. Name the exact file/section and commit SHA when available. Commit counts alone do not establish substantive contribution. Distinguish author and uploader when someone uploads another member's work.
5. Place readable evidence immediately below the corresponding entry in the private submission: a captioned excerpt, screenshot, diagram, worked trace, or review result. Links and project-log references supplement this evidence; they do not replace it.
6. Record significant AI assistance, including learning sessions that produced no final artifact: actual date/tool, purpose, relevant prompt/response excerpts, source or manual verification, accepted/revised/rejected decisions, and outcome/learning. A conversation link alone is insufficient.
7. A different member records a review only after doing it: reviewer, date, files/commit reviewed, checks performed, findings, corrections or confirmation, and any follow-up. An AI check does not replace the required teammate review.
8. Write authentic personal reflections yourself. Never fabricate dates, time, meetings, reviews, experiments, or learning. Mark unverified claims and resolve them before reporting completion.

## Topic-specific evidence

| Branch | Suggested work and evidence |
| --- | --- |
| `study-guide` | Integrated learning sequence, consistent terminology, cross-topic links, question/answer checks, rendered content checks, and selected integration diffs |
| `hardware` | Component explanations, checked specifications and sources, original diagrams, worked examples, and actual demonstration results if performed |
| `network` | Packet/message traces, diagrams, checked protocol claims, learner activities and answers, and actual connectivity tests if performed |
| `ai-behavior` | Agent/action definitions, controller rules, manually checked action traces, behaviour conflicts, limitations, and rules-versus-learning explanations |

For every topic, record course learning outside that topic in the private log when it actually occurs.

## Workflow and consistency

- Add an entry after a meaningful work session. Preserve past entries; label later corrections with their real correction date.
- Work on the relevant topic branch. Commit substantive content with an identifiable account and descriptive message; never create artificial activity commits.
- When integrating into `study-guide`, reference the source commit and preserve authorship. Avoid copying the same accomplishment into the team log multiple times; cross-reference its entry ID.
- Propose changes to this standard in `study-guide`, then merge that commit into the topic branches so the templates stay consistent.
- Before submission, check dates, ownership, evidence readability, accurate statuses, AI records, and links. Keep contribution scores pending until the team assesses them; highest contributor is 100, ties are allowed, and scores need not sum to 100.

## Privacy

Keep completed private logs and evidence outside the repository. `private-submissions/` is ignored as an additional safeguard if local staging is needed; ignoring a path does not remove files already tracked. Inspect staged changes before pushing. Do not commit student IDs, private screenshots, credentials, or completed personal logs.

Basis: Stage 1 handoff and the Markdown V1.0 assignment checked on 2026-10-22. The separate Shared Assignment Rules attachment remains unchecked; reconcile this standard with it before final submission.
