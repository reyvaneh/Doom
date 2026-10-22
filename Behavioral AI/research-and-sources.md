# Research scope and source map

Research date: 2026-10-22. **Status: provisional course alignment; no teammate review recorded.**

## 1. Lecturer-first scope check

The course's authenticated [Learning materials folder](https://lexue.bit.edu.cn/mod/folder/view.php?id=544488) lists `（important）PPT and Docs / PPT 2024 / chap6 Behaviorist AI.pptx`. Two browser download attempts, including a newly opened Edge tab, displayed `ERR_BLOCKED_BY_CLIENT`. A targeted local search found no copy. The slides have not been read.

Only the title and folder placement are verified. The following cannot be verified from the slides:

- The lecturer's definition of Behaviorist AI or relationship to psychological behaviourism.
- Whether reactive robotics, reinforcement learning, finite-state machines, subsumption, Braitenberg vehicles, evolutionary methods, or other approaches are covered.
- Required depth, specific examples, terminology, assessment expectations, or teaching duration.
- Whether this 2024 deck is unchanged guidance for the 2026 class.

**Recommendation, not a course requirement:** teach agents and feedback first, then reactive rules and conflicts, then finite-state memory, and finish with a short rules/learning comparison. Use the vacuum as an original worked example. Treat subsumption as research context, not as a name for the example controller. Do not expand into advanced RL equations before checking Chapter 6.

When the deck is supplied, read slide text, figures, and notes. Add exact slide numbers to the alignment table below, record omissions and disagreements, and revise the chapter before labeling it course-aligned.

| Proposed topic | Lecturer slide evidence | Current decision |
| --- | --- | --- |
| Agents and environments | Unverified | Include as prerequisite explanation |
| Perception/action and reactive control | Unverified | Proposed core |
| Priority conflicts | Unverified | Proposed core example |
| Finite-state behaviour | Unverified | Proposed introduction |
| Reinforcement learning | Unverified | Proposed short comparison |
| Subsumption | Unverified | Research context only |
| Additional lecturer topics | Unknown | Reassess after access |

## 2. Claim-to-source table

Locators use section titles where available because PDF viewer numbers, draft pagination, and published-edition pages can differ. Sources support the concepts, not this lesson's invented thresholds, corridor, or teaching schedule.

| ID | Claim supported | Source and exact locator | Verification and limits |
| --- | --- | --- | --- |
| S1 | Agents perceive through sensors and affect their environment through actuators; simple reflex behaviour uses the current percept, while other agent designs retain internal state. | Russell & Norvig, *Artificial Intelligence: A Modern Approach*, author-hosted [Chapter 2 sample](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap02.pdf), §2.1 “Agents and Environments,” Fig. 2.1; §2.5 summary bullet beginning “Simple reflex agents.” | Relevant search-indexed text inspected. The sample's displayed p. 33 for §2.1 differs from the Global Edition's pagination; do not mix them. Not a review of the whole textbook. |
| S2 | A controller receives percepts and issues commands; sensors/actuators can be unreliable and actual action can differ from the command. | Poole & Mackworth, *Artificial Intelligence: Foundations of Computational Agents*, 3rd ed., author-hosted [§2.1](https://www.cs.ubc.ca/~poole/aibook/3e/html/ArtInt3e.Ch2.S1.html), opening paragraphs, Fig. 2.1, and §2.1.1 “Controllers.” | Relevant author-hosted indexed text inspected. Supports keeping the toy model's ideal sensors distinct from real hardware. |
| S3 | Behaviour-producing layers can connect sensing directly to action; Brooks proposed incrementally adding interacting layers. | Brooks (1991), [*Intelligence without representation*](https://people.csail.mit.edu/brooks/papers/representation.pdf), §4.2 “Decomposition by activity.” | Full text available through web extraction; relevant section inspected. A historical research approach, not a universal definition of AI. |
| S4 | Brooks's subsumption implementation uses asynchronous finite-state modules and suppression/inhibition connections, rather than merely one ordered conditional chain. | Same Brooks (1991) paper, §6.2 “An instantiation of the methodology,” paragraphs beginning “Each layer in the subsumption architecture” and “Layers are combined,” Fig. 2. | Relevant full-text passages inspected. For this host's PDF these appear around viewer pages 7–8. Use section and paragraph locators if comparing another layout. |
| S5 | The original layered architecture builds levels of competence from asynchronous communicating modules while lower layers continue operating. | Brooks (1985), [MIT AI Memo 864, *A Robust Layered Control System for a Mobile Robot*](https://dspace.mit.edu/entities/publication/362a32d0-a821-4a9d-a5ff-9e2b71c5539d), abstract; [author-hosted PDF](https://people.csail.mit.edu/brooks/papers/AIM-864.pdf). | MIT repository abstract inspected. PDF loaded but produced no extractable text; abstract supports only this limited claim. Memo dated September 1985; distinguish it from the 1986 journal publication. |
| S6 | Finite-state robot controllers have discrete modes, an initial mode, transition conditions, and tie-breaking when several transitions apply. | Hauser, author-hosted *Robotic Systems*, [Robot Control](https://motion.cs.illinois.edu/RoboticSystems/RobotControl.html), subsection “State machines,” Fig. 6. | Relevant author-hosted indexed text inspected. This chapter's transition-before-action convention is our explicit design choice, not a convention imposed by the source. |
| S7 | State machines can specify robot programs using sensor readings as inputs and control commands as outputs. | MIT 6.01, [Spring 2011 course textbook](https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/b2d8cb0bb07414a21f5ec444fd00d608_MIT6_01SCS11_textbook.pdf), Chapter 4, printed p. 118, numbered item 1 “Synthetically.” | Relevant indexed textbook extract inspected. No claim that a robot lab was performed. |
| S8 | RL learns from interaction to improve accumulated reward, rather than simply executing an unchanged controller. | Poole & Mackworth, author-hosted [Chapter 13 “Reinforcement Learning”](https://www.cs.ubc.ca/~poole/aibook/3e/html/ArtInt3e.Ch13.html), introductory paragraph. | Relevant indexed introduction inspected. Its fully observable single-agent scope is narrower than all RL. |
| S9 | Exploration gathers experience; exploitation selects actions favoured by current estimates. | Poole & Mackworth, author-hosted [§13.5 “Exploration and Exploitation”](https://www.cs.ubc.ca/~poole/aibook/3e/html/ArtInt3e.Ch13.S5.html), opening two bullets and following discussion. | Relevant indexed section inspected. The chapter avoids convergence guarantees and advanced strategy equations. |
| S10 | Sutton and Barto discuss trial-and-error interaction and the exploration/exploitation tradeoff. | Sutton & Barto, [author-hosted March 2018 draft](https://www.incompleteideas.net/book/bookdraft2018mar21.pdf), §1.1 “Reinforcement Learning,” printed p. 3. §1.3 “Elements of Reinforcement Learning” begins on printed p. 6 in this draft's contents. | Author-hosted indexed §1.1 passage and contents inspected; direct full-file retrieval timed out. Do not claim §1.3 body was fully inspected. Use S8/S9 for this draft's main RL explanation. |
| S11 | An agent can explore transitions/rewards and use feedback to estimate a policy. | UC Berkeley CS188, official [§5.1 “Reinforcement Learning”](https://inst.eecs.berkeley.edu/~cs188/textbook/rl/rl.html), introductory contrast between offline planning and online learning. | Relevant indexed university text inspected. The no-prior-model setup in this introduction is an example setting, not a necessary property of every RL system. |

## 3. Original teaching design versus sourced facts

**Sourced concepts:** sensor/actuator interaction, reflex versus remembered state, behaviour layers, finite-state transitions, reward-driven learning, exploration/exploitation.

**Original teaching proposals:** the four-tile corridor, 0–10 energy scale, threshold 3, action costs, mode guards, trace, questions/answers, suggested sequence, and SVG layout. They are invented instructional models, not experiments or claims about a commercial vacuum. AIMA also uses vacuum worlds; this corridor is a separately specified teaching example, not a reproduced figure or exercise.

**Design deductions:** the return-energy bound, oscillation counterexample, and reward-example conclusions follow from our stated assumptions. Check them against the model rather than attributing them to Brooks or BIT.

## 4. Research limits and next checks

This is a focused primary-source research draft, not an exhaustive literature review. Several websites were available only through indexed excerpts; those limits are recorded above. No third-party summaries are used as factual authorities. Retain exact edition/section names when checking the cited text. Do not redistribute entire lecturer decks or textbooks in the public folder without appropriate permission.

Required next checks: actual lecturer slide alignment; another member's substantive review; beginner accessibility; rendered PDF/asset checks when the team packages Stage 1. The user will complete personal logs and significant AI-use records separately.
