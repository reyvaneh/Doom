# Student Log — Hardware, Networks & Behaviorist AI

This is the team's record of **what we actually do** while creating and teaching the course. The proposed course content and future work live in [study-overview.md](study-overview.md).

## How to use this log

This file is the public team development log. Keep individual learning records, reflections, student IDs and private submission evidence in a private workspace; do not publish completed personal logs here. Record only actual work and supporting evidence in this public log.

- Add an entry after a work session or a meaningful contribution.
- Record the contributor, actual work, outcome, and evidence such as a file, commit, slide, or review note.
- Separate completed work from next steps. Do not record a planned activity as completed.
- Include difficulties and lessons learned so this shows the process as well as the output.
- Use actual dates and time spent; leave unknown details marked “Not recorded.”

## 16 October 2026 — Initial course outline

| Field | Record |
| --- | --- |
| Contributor | [@vendouple](https://github.com/vendouple) |
| Work completed | Reviewed the repository README and its beginner audience; consulted primary web sources; drafted a proposed six-lesson course outline and this log |
| Output/evidence | [study-overview.md](study-overview.md) and [student-log.md](student-log.md) |
| Outcome | Initial outline ready for team review, covering objectives, lesson topics, demonstrations, activities, checks, and references |
| Working decisions | Use a robot vacuum to connect the topics; propose six 45-minute lessons; use paper activities that need no programming |
| Open questions | Confirm duration, delivery language, assessment requirements, and the lecturer's intended meaning of “Behaviorist AI” |
| Reflection | The three topics need one connected example. Fixed behavior rules and reward-based learning must be distinguished clearly for beginners |
| Limitations | Dedicated Deep Research was unavailable; initial web research was used. Full lessons, slides, videos, teaching sessions, and learner testing have not been completed |
| Time spent | Not recorded |
| Next steps | Team reviews the outline, confirms the assignment scope, assigns lesson owners, and begins drafting lesson content |

## 27 October 2026 — AI Behaviour Stage 1 contents revision

| Field | Record |
| --- | --- |
| Contributor | Work requested by [@vendouple](https://github.com/vendouple); repository inspection and contents drafting carried out with Codex assistance |
| Goal | Address the reported Stage 1 Markdown organization feedback for the AI Behaviour part on `ai-behavior`, starting with short headings and detailed contents |
| Work completed | Read the Stage 1 Markdown assignment and course learning-materials listing in the signed-in LeXue browser; inspected the existing AI chapter and source map; drafted an AI-only contents plan with section coverage, links, prerequisites, learning goals, activities and development status; added navigation to the chapter and folder README |
| Output/evidence | [Detailed contents](Behavioral%20AI/table-of-contents.md), [chapter navigation](Behavioral%20AI/chapter.md#contents), [folder README](Behavioral%20AI/README.md), [Stage 1 assignment](https://lexue.bit.edu.cn/mod/assign/view.php?id=544495), [course materials listing](https://lexue.bit.edu.cn/mod/folder/view.php?id=544488) |
| Outcome | Partial: the contents and navigation are drafted locally. Matching the revision against the exact team feedback and previous-year student work remains pending |
| Checks | All 67 local Markdown links and anchors checked in the AI contents, chapter and folder README resolved. `git diff --check` passed. Teaching models were unchanged and were not rerun |
| Decisions and reasons | Keep the existing developed explanations and numerical examples. Use a separate detailed contents file so the AI part can later be assembled into the book. Mark proposed activities as outline only and distinguish existing drafts from reviewed content |
| Difficulties | The signed-in account's Stage 1 assignment page displayed No attempt / Not graded and no team feedback. Its location was requested from the user. The browser site-safety policy blocked the Baidu share listed by the course; no share contents were read |
| Verification scope | The Stage 1 requirements and material filenames were read live. The 2024 Chapter 6 deck was already present locally with an earlier scope review; it was not newly downloaded or reinspected in this session. The book structure is a teaching proposal; no teammate review, beginner trial or successful learning run is claimed |
| Time spent | Not recorded |
| Next steps | Obtain the exact team feedback and accessible previous-year examples; revise the contents if needed; have another team member check the draft; complete any required private AI-use record and interaction evidence separately |

## 28 October 2026 — AI Behaviour source chapter revision

| Field | Record |
| --- | --- |
| Contributor | Work requested by [@vendouple](https://github.com/vendouple); local source inspection, technical research and Markdown revision carried out with Codex assistance |
| Goal | Improve the AI Behaviour Markdown in response to the user's account of the team leader's Stage 1 feedback, using downloaded 2024/2025 examples |
| Work completed | Inspected selected completed 2024 final guides and 2025 final-version PDF material; read primary technical sources; revised the chapter and detailed contents; recorded reference locations, page locators, decisions and fingerprints; updated supporting scope and review notes |
| Format decisions | Kept the Markdown as book-style source content for later study-guide development. At the user's request, limited the chapter-end set to five easy questions using mostly simple reasoning, with no calculation or advanced algorithm questions, because the later test must cover all module topics |
| Content changes | Clearer scope and prerequisites; short chapter headings; sensor/action and fixed-rule explanations; training/use distinction and vocabulary; a boundary trace, extra worked update, brief methods comparison, specified game example, optional message flow and evaluation limits |
| Output/evidence | [Chapter](Behavioral%20AI/chapter.md), [contents](Behavioral%20AI/table-of-contents.md), [previous-year comparison](Behavioral%20AI/previous-year-review.md), [source map](Behavioral%20AI/research-and-sources.md), [validation](Behavioral%20AI/validation.md) |
| Checks | Existing learning-model replay passed 24 nonterminal transitions and six Q updates with return 11.2; fixed-rule model passed 13 trace ticks and 16,896 configurations. Additional checks confirmed the new numerical update, terminal alternative, boundary trace and 12 grid-game transitions. All 115 checked local links/anchors resolved; code fences and five-question count checked; `git diff --check` passed |
| Outcome | Book-style revision and selected reference comparison completed; independent teammate review, final book export and later study-guide/test-bank production remain pending |
| Limitations | The full collection was still downloading. Partial `.downloading` files and videos were excluded; only the selected documents and locators in the comparison record support this revision. No training run, learner trial, real-robot result or teammate review is claimed |
| Time spent | Not recorded |
| Next steps | Team member reviews the revised explanations and five simple answers, records a concrete outcome, and later adapts the source chapter into the combined study guide and test. Keep required personal AI-use records and full interaction evidence in private submission materials |

## 28 October 2026 — Keep reference history out of the chapter

- Removed mentions of earlier course editions from the chapter and contents, including the revision banner already removed in the working copy.
- Kept the material as a standalone book chapter. Reference examples inform broad organization and information density; the chapter does not reproduce their structure or content one-to-one.
- Retained attribution and inspection details in separate research records. The five easy reasoning questions and technical explanations remain in place.
- Checked the chapter and contents for earlier-edition mentions and ran `git diff --check` before publication.

## Copyable entry template

Copy this section for the next session and replace the placeholders.

### YYYY-MM-DD — Session title

| Field | Record |
| --- | --- |
| Contributor(s) | Name(s) and role(s) |
| Goal | What we intended to accomplish |
| Work completed | Specific actions actually performed |
| Output/evidence | Link to file, commit, slides, recording, or review notes |
| Outcome | Completed, partial, or blocked; explain what this means |
| Decisions and reasons | What we chose and why |
| Difficulties | Problems encountered and what we tried |
| Reflection | What we learned or would improve |
| Time spent | Actual duration, or Not recorded |
| Next steps | Remaining tasks and agreed owner with internal deadline and dependencies |

