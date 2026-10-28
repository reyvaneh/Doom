# AI Behaviour — Contents

**Stage 1 revision · 28 October 2026 · Branch: `ai-behavior`.**

This is the contents map for the AI Behaviour part of the future Markdown book. The headings are short; the coverage below describes the developed explanations. Read the [current chapter](chapter.md) in the same order. This Markdown is the source for a later study guide, slides and videos. It uses connected prose and worked examples; interactive activities will be designed for those later resources.

**Audience:** beginners with no AI or programming background. Learners need to know that sensors collect information, a controller chooses commands, and actuators carry them out. Introduce these ideas again in Section 2 so the AI part can also be read separately. The numerical example needs addition, multiplication and negative numbers; explain each symbol before using it.

The chapter develops the subject through definitions, connected explanations and worked examples. A compact question set concludes the reading. The content can later support an interactive study guide, while this document remains a map of the book-style source material.

## Reading order

1. [Introduction](#1-introduction)
2. [Agents](#2-agents)
3. [Rules](#3-rules)
4. [Learning](#4-learning)
5. [Decision problems](#5-decision-problems)
6. [Q-learning](#6-q-learning)
7. [Applications](#7-applications)
8. [Review questions](#8-review-questions)
9. [Limits](#9-limits)
10. [References](#10-references)

## 1. Introduction

Current material: [Chapter §1](chapter.md#1-introduction).

- **Starting question:** how does a robot vacuum choose what to do next? Introduce the same situation first as programmed instructions and then as a task that can be learned through experience.
- **Scope:** explain how this AI part fits after Hardware and Networks. Identify reinforcement learning as a main topic in the lecturer overview, with rules and remembered modes as supporting comparisons.
- **Learning goals:** identify an agent's observations and actions; trace a rule choice and a mode change; distinguish reward from learning; describe a small decision problem; calculate a Q-learning update; explain one limitation.
- **Reading guidance:** identify the core chapter, optional fixed-rule exercise and optional Python checks. Make clear which activities can be completed on paper.

## 2. Agents

Current material: [Chapter §2](chapter.md#2-agents).

- **Agent and environment:** identify the vacuum as the agent and the floor, dirt and dock as parts of its environment. Define observations, controller, commands and actions when they first appear.
- **Perception and action:** follow one cycle from a sensor reading to a chosen command, an action and the next reading. Use a labelled diagram and explain the arrows.
- **Hardware connection:** relate sensing, processing, memory and motor output to the Hardware material without repeating its full component explanations.
- **Observation limits:** distinguish what is happening in the environment from what the sensor reports. Introduce inaccurate readings and unsuccessful movement through a concrete example.
- **Second example:** identify the agent, observation, environment and action in an automatic door; explain why opening does not itself prove learning.

## 3. Rules

Current material: [Chapter §3](chapter.md#3-rules) and the optional [fixed-rule exercise](fixed-rule-vacuum.md).

- **Condition and action:** trace the ordered rules for low energy, dirt and movement. Explain why rule order matters when two conditions apply together.
- **Remembered modes:** introduce CLEAN, RETURN and CHARGE; show a starting mode, a transition condition and what happens after the transition.
- **Rules versus learning:** distinguish changing position, energy or mode from changing the mechanism used to select actions. A programmed state transition alone is not a learning update.
- **Behaviour layers:** briefly place Brooks's behaviour-based robotics in context. Explain why an ordered rule list does not demonstrate the full subsumption architecture.
- **Worked comparison:** use a short trace in the core reading; keep the fully specified four-tile model and its longer trace in the supplementary exercise. State that its battery and dock are absent from the later two-tile learning model.

## 4. Learning

Current material: [Chapter §4](chapter.md#4-learning).

- **Interaction and feedback:** describe an agent trying an action, observing the result, receiving a reward and updating an estimate used for future choices.
- **Reward, policy and value:** define each term with the vacuum example. Distinguish the number received now from an estimate of reward over later steps.
- **Exploration and exploitation:** show why an agent might try an uncertain action and why it might instead repeat a currently preferred action.
- **What changes:** compare fixed rules with a changing Q-table. Explain why displaying a score is insufficient without an update mechanism.
- **Controller comparison:** contrast a programmed mode transition with an experience-based estimate update. Distinguish training from executing a learned policy, and introduce a compact vocabulary table.

## 5. Decision problems

Current material: [Chapter §5](chapter.md#5-decision-problems).

- **MDP vocabulary:** introduce a Markov Decision Process through states, actions, transitions, rewards and terminal states before presenting the tuple notation.
- **Two-tile world:** show the starting picture and explain each part of `(position, dirt_A, dirt_B)`. Define LEFT, RIGHT, SUCK and WAIT, including actions at a boundary or on a clean tile.
- **Complete specification:** retain the exact reward rule, deterministic transitions, ending condition, reset behaviour and discount factor. Explain which information remains in the Q-table between episodes.
- **State and observation:** explain why both dirt flags matter. Contrast full state information with a sensor that sees only local dirt; connect this to the Markov assumption.
- **Reward and return:** calculate the rewards for SUCK, RIGHT, SUCK and then the discounted return of 11.2. Explain each term in the calculation and why one sequence is not evidence of successful training.
- **Boundary behaviour:** follow LEFT and RIGHT from `(A, 0, 1)` and explain why a boundary action leaves position unchanged. Contrast deterministic outcomes with a task requiring transition probabilities.

## 6. Q-learning

Current material: [Chapter §6](chapter.md#6-q-learning).

- **Action estimates:** introduce the Q-table as estimates indexed by state and action. Explain the initial zero values and the role of the learning rate.
- **One update:** explain old estimate, immediate reward, best next estimate, discount factor and target, then work through the first calculation line by line.
- **First episode:** trace the three actions with rewards, next states and revised estimates. Explain the negative initial estimate for moving and the zero future contribution at a terminal state.
- **Second episode:** reset the world while keeping the estimates. Show how a later cleaning reward affects an earlier movement estimate, and why the greedy action can change.
- **Action selection:** explain epsilon-greedy choice and tie-breaking using the proposed settings. Clearly distinguish the six scripted experiences from a random training run.
- **Further worked example:** calculate a separate update with target 5.6 and new estimate 3.3, then compare the terminal case. Treat Q-learning as the selected teaching example, not an algorithm required by the lecturer.
- **Methods overview:** distinguish known-model planning, model-based RL, tabular Q-learning, SARSA and DQN. Explain the role of the next selected action and the difference between a Q-table and a neural value representation.

## 7. Applications

Current material: [Chapter §7](chapter.md#7-applications).

- **Robotics:** identify possible observations, actions and reward choices for a cleaning or navigation task. State the assumptions behind each proposed example.
- **Games:** adapt the vacuum world into a small grid game with goals, walls and hazards. Specify what ends an episode and what earns reward.
- **Reward choices:** explain whether a score rewards useful results or repeated commands. Use cleaning an already clean tile as a counterexample.
- **Networks connection:** trace an optional status message or remote request. Distinguish local decisions from communication and discuss missing or stale messages.
- **Game model:** specify a 2 × 2 collectible task with coordinates, action effects, boundary handling, step cost, goal reward and terminal condition. Explain the assumptions behind the example.

## 8. Review questions

Current material: [Chapter §8](chapter.md#8-review-questions).

- **Simple reasoning:** identify a sensor input, follow the low-battery rule, and explain why a displayed score does not establish learning.
- **Basic distinctions:** separate a state description from an action and explain why a small immediate cost can enable a later reward.
- **Test scope:** contribute only five easy questions to the later whole-module test. No Q-learning calculations, algorithm comparisons or formal Markov-property questions are required in this set.
- **Answer guidance:** give reasoning alongside the result, refer back to the relevant explanation, and identify common mistakes. Keep questions answerable from the chapter.
- **Current coverage:** five easy explained questions conclude the chapter. The door, controller, boundary, extra-update and game examples are explanatory passages in the main text. Interactive versions belong in the later study guide.

## 9. Limits

Current material: [Chapter §9](chapter.md#9-limits).

- **Model assumptions:** revisit complete observations, reliable actions, two tiles and a small action table. Explain what batteries, obstacles and uncertain readings would add.
- **Exploration cost:** discuss why trial and error on a paper grid differs from trial and error on physical hardware.
- **Reward design:** explain how an incomplete objective can favour unwanted actions and why changing one reward does not prove the whole design is adequate.
- **Evidence limits:** separate a checked arithmetic example, a scripted model replay, successful training and physical robot performance.
- **Evaluation:** distinguish arithmetic replay, training and evaluation. Explain a proposed comparison on the same task with fixed, random and trained policies, repeat runs and explicit metrics; do not present it as completed research.
- **Recap:** connect sensing, action selection, feedback and updates in one explanation.

## 10. References

Current material: [Research and source map](research-and-sources.md) and [lecturer scope review](lecturer-scope-review.md).

- Retain identifiable sources and precise section or slide locators for definitions and important claims. Distinguish original examples from borrowed concepts.
- Keep citations close to the explanations they support. Use the source map when checking the chapter before compiling the book.
- Ground technical explanations in identifiable sources and preserve the distinction between sourced concepts and original worked examples.
- Keep source-checking notes and editorial decisions in the research record rather than interrupting the chapter's explanations.

## Development status

**Drafted** means the prose or example exists; it does not mean another member has reviewed it. Primary-source checks are recorded separately from independent teammate review. The contents describe the chapter available now, not a claim that the future study guide is complete.

| Section | Existing material | Remaining work |
| --- | --- | --- |
| 1. Introduction | Revised, with scope and prerequisites | Teammate review |
| 2. Agents | Revised, with a loop visual and door example | Teammate review |
| 3. Rules | Drafted, with supplementary trace | Review the length of the core comparison for beginners |
| 4. Learning | Revised, with training/use distinction and vocabulary | Teammate review |
| 5. Decision problems | Drafted, with specification and return calculation | Check notation and arithmetic with a teammate |
| 6. Q-learning | Revised, with six replay updates, another worked update and methods overview | Independent arithmetic and teaching review |
| 7. Applications | Revised, with a specified game model and message example | Teammate review |
| 8. Review questions | Five easy explained questions drafted | Independent answer review; later study-guide adaptation |
| 9. Limits | Revised, with an evaluation proposal and recap | Teammate review; evaluation remains unperformed |
| 10. References | Technical source map prepared | Remaining source access limits and teammate checks |

For later book assembly, retain this order, normalize chapter numbering with the team, and keep examples, images, questions and answers beside their explanations. Whole-book integration, slides, videos and Stage 2 production are outside this revision. Another team member's review and a readable export check remain pending.
