# AI Behaviour - Stage 1 notes

**Updated: 30 October 2026. Status: Stage 1 teammate review and team submission completed, as confirmed by the team.**

The reader starts with [AIBehaviour.md](AIBehaviour.md). [References.md](References.md) contains the claim-to-source map and background attribution. This file holds submission and verification notes so development records do not interrupt the book. The later interactive study guide, combined test bank, slides and videos are separate deliverables.

## Lecturer scope

The supplied `source-materials/chap6 Behaviorist AI.pptx` was inspected on 22 October 2026. It contains two slides: a title and an overview. The overview names the topics below; it does not specify a required algorithm, worked example, lesson duration or depth. Q-learning is our illustrative choice. Programmed rules, modes and the agent loop support the explanation rather than replacing reinforcement learning.

| Lecturer topic on slide 2 | Teaching coverage | Limit |
| --- | --- | --- |
| Introduction to Behaviorist AI | Agent/action introduction and fixed versus learned behaviour | Source-backed teaching explanation, not a definition quoted from the deck |
| Basics of Reinforcement Learning | Reward, policy, exploration and exploitation | Introductory coverage |
| RL Algorithms and Techniques | Tabular Q-learning and six updates | Our selected algorithm; none is named by the slide |
| Markov Decision Processes (MDPs) | Fully specified two-tile vacuum task | Original deterministic MDP |
| Behavioral AI in Robotics and Games | Vacuum and proposed grid-game adaptation | No physical experiment claimed |
| Applications and Use Cases | Cleaning, grid games and simulated navigation | Proposed examples, not product claims |
| Challenges and Limitations | Partial observations, rewards, exploration and model limits | No empirical evaluation or safety guarantee |

The separate Shared Assignment Rules attachment remains unchecked. The Stage 1 Markdown assignment was read in LeXue on 27 October 2026; the user's account of the team leader's feedback informed the revision. The team confirmed on 30 October 2026 that the required teammate review and team submission are complete. No learner trial or physical experiment is claimed.

## Content status

| Material | Status |
| --- | --- |
| Book explanations, vocabulary, diagrams and worked examples | Drafted |
| Five easy chapter-end questions with answers | Drafted; mostly simple reasoning, with no calculation requirement |
| Technical references and background attribution | Recorded with access limits |
| Two-tile MDP and scripted numerical replay | Local consistency checks passed |
| Independent teammate review | Completed; confirmed by the team on 30 October 2026 |
| Training comparison or physical robot trial | Not performed |
| Team submission | Completed by the team leader; confirmed by the team on 30 October 2026 |
| Submitted package and extraction-check evidence | Not separately recorded here; team submission is confirmed complete |

The five questions are a small contribution to a later test covering the whole module. Detailed algorithm explanations remain source material and do not imply that the introductory test must examine them in depth.

## Validation

Run the optional check from the repository root:

```powershell
python "Learning Materials/AIBehaviour/checks/rl_vacuum_model.py"
```

Expected output from the unchanged teaching model:

```text
Passed: 24 nonterminal state-action transitions; terminal guards; 6 scripted Q updates; return 11.2.
Scripted educational replay only; no random training, convergence or physical performance result.
```

Additional one-off checks on 28 October confirmed the illustrative Q target 5.6, revised estimate 3.3 and terminal alternative 1.5; the two boundary steps; and all 12 nonterminal state-action pairs in the separate grid-game example. These are checks of the authored examples, not evidence of successful training or learner understanding. The five questions were checked against the chapter's definitions and rule order. File links and heading anchors must also resolve after any folder rename.

## Review status

The required teammate review is complete, as confirmed by the team on 30 October 2026. The team leader has also completed the team submission. The confirmation date records this status update, not the date on which the review took place.

For reviewer details, findings and submitted files, refer to the team's project and submission records. The [master project plan](../../Project%20Plan/Project_Plan_Stage2_and_Stage3.md) records Stage 1 completion and the next stages of work.

Keep personal reflections and full private AI-use records outside the public repository. Future Stage 2 revisions need their own checks and review records.

## Diagrams

`assets/learning-loop.png` is the figure embedded in the book, with editable SVG alongside it. The standalone perception/action figure is retained in PNG and SVG for later reuse. Assets are original teaching diagrams, not copies of student work or a specification of a commercial robot.

## Folder cleanup

The current folder is `Learning Materials/AIBehaviour`. The material remains a book-style Markdown foundation. Legacy PDF exports were removed on 30 October 2026; earlier versions remain recoverable in Git history. The chapter already provides navigation, so the separate long contents plan was removed. Lecturer scope, content status, validation and review status now share this file; technical and background references share References.md. Duplicate diagram specifications and the older supplementary four-tile controller exercise were removed from the current package. Their development history remains recoverable in Git.

Cleanup checks: all 46 local links and heading anchors in the three Markdown files, repository introduction and public progress log resolved. Code fences are balanced and the book retains exactly five easy questions. The six retained asset, source-deck and check-script files match their original Git content after normal checkout line-ending handling. The relocated RL check passed its 24 transitions and six scripted updates. `git diff --check` passed. These local checks are separate from the teammate review and team submission subsequently confirmed as complete on 30 October 2026; they do not independently verify the final submitted export.
