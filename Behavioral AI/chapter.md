# AI Behaviour and reinforcement learning

**Stage 1 teaching draft, 2026-10-22. Lecturer overview checked; teammate review pending.**

A robot vacuum reaches a dirty patch of floor. It can clean, move on, or wait. A programmer could write the decision in advance. A learning system could instead use experience to estimate which choices lead to better results. This chapter explains the difference, then works through a small learning example.

## 1. Scope and learning sequence

The supplied lecturer deck contains two slides. Slide 2 lists an introduction to Behaviorist AI, reinforcement-learning basics, RL algorithms and techniques, Markov Decision Processes (MDPs), robotics and games, applications, and challenges. It gives no definitions or worked examples. The topics below follow that overview; the examples, sequence and choice of Q-learning are our teaching proposals. See the [lecturer scope review](lecturer-scope-review.md).

This chapter is for beginners. No programming is needed, although the worked update uses addition and multiplication. Start with the idea that sensors supply information and actuators carry out actions. The Hardware section can introduce those parts beforehand.

| Step | Main question | What the learner should be able to do |
| --- | --- | --- |
| 1. Agents and their environment | What information can the agent use, and what can it change? | Identify observations and actions |
| 2. Programmed behaviour | How do rules and remembered modes choose actions? | Explain a priority conflict and a state transition |
| 3. Reinforcement learning | How can experience affect later choices? | Distinguish reward, policy and learning |
| 4. MDPs | How do we specify a decision problem precisely? | Identify states, actions, transitions and rewards |
| 5. A learning update | How does one experience change an estimate? | Calculate a small Q-learning update |
| 6. Robotics and games | How does the same framework apply elsewhere? | Describe a new agent and its reward |
| 7. Limitations | What can go wrong with the model or goal? | Identify an assumption and a counterexample |

By the end, learners should be able to follow both a fixed rule and a learning update, explain why they differ, and describe a small MDP. Deep neural networks, full robot navigation and formal convergence proofs are beyond this introductory treatment. The overview does not establish a required algorithm, lesson duration or depth.

## 2. Agents and the perception–action loop

An **agent** receives information and acts in an **environment**. Sensors provide **observations**, while actuators carry out actions. The **controller** selects commands. Some controllers respond to the current observation; others also use information retained from earlier steps. [S1](research-and-sources.md)

For a vacuum, the floor, dirt and dock form part of the environment. A dirt sensor reports something about the floor; a motor changes the vacuum's position. A command to move and the resulting movement are different things. Sensors and mechanisms can be unreliable. [S2](research-and-sources.md)

The loop repeats: observe, choose an action, act, then observe the result. After cleaning a dirty tile, the next reading should reflect the cleaner floor. The agent needs that new reading before making its next choice.

![Original agent and reward loop with an explicit Q-value update](assets/learning-loop.png)

**Original teaching diagram.** During learning, experience supplies a next observation and reward, and an update revises the action estimates used by the policy. This describes the proposed learning example, not a commercial vacuum's architecture.

## 3. Fixed rules, priorities and remembered modes

Consider these instructions, in order:

1. If energy is too low for cleaning, return to the dock.
2. Otherwise, if the current tile is dirty, clean it.
3. Otherwise, move to another tile.

When energy is low and the tile is dirty, the first instruction takes priority. The controller leaves the dirt for later. That decision is built into the rule order.

A controller can also remember its current **mode**, such as CLEAN, RETURN or CHARGE. A **finite-state machine** describes a finite set of modes and the conditions that switch between them. It needs a starting mode and a clear way to resolve competing transitions. [S6–S7](research-and-sources.md)

For example, a vacuum could remain in RETURN until it reaches the dock, even if it passes dirt on the way. Changing mode does not mean that it has learned: the programmer may have specified every transition. The [fixed-rule exercise](fixed-rule-vacuum.md) defines this controller completely, including energy costs, blocked movements and a 13-tick trace.

Brooks's behaviour-based robotics provides background for connecting sensing with action. His subsumption architecture uses interacting layers of asynchronous finite-state modules, including suppression and inhibition mechanisms. An ordered list of rules alone does not implement the full architecture. [S3–S5](research-and-sources.md)

## 4. What reinforcement learning changes

In **reinforcement learning (RL)**, an agent learns from interaction and reward feedback, aiming for accumulated reward. A **policy** describes how it selects actions. **Exploration** gathers experience by trying choices; **exploitation** uses choices favoured by current estimates. [S8–S11](research-and-sources.md)

Look at what changes. In the fixed controller, position, energy and mode change, but the written rules stay the same. In our learning example, experience also changes a table of action estimates. Those estimates can affect later choices.

| Component | Meaning in the learning example |
| --- | --- |
| Reward | A number returned after an action |
| Policy | The method for choosing an action |
| Q-value | An estimate of the return from an action in a state, followed by continuation under the target policy |
| Learning update | The calculation that revises an estimate using experience |

Displaying a score does not create a learning mechanism. A trained policy can also be held fixed when used later. The important distinction is whether experience was used to learn its behaviour.

## 5. Describing a task as an MDP

A **Markov Decision Process**, or **MDP**, specifies states, actions, transition probabilities and rewards. It can also include terminal states and a discount factor. The **Markov property** means that the current state contains the information needed to predict the next outcome given the action; earlier history adds no further predictive information. This depends on how the state is defined. [S13](research-and-sources.md)

An MDP describes the problem. A learning algorithm describes how the agent learns to act in it. Known transitions and rewards can also support planning without learning them through trial and error. [S11](research-and-sources.md)

### 5.1 A two-tile vacuum world

This is a new teaching model. It differs from the four-tile fixed-rule exercise: there is no battery, dock or operating-mode variable, and the agent receives the complete dirt state.

```text
Initial world:   [ A: vacuum + dirt ] [ B: dirt ]
Goal for this episode: remove both patches of dirt
```

Everything in this example, including the rewards and initial conditions, is an **original teaching proposal**, not a reported experiment or a commercial robot specification. An **episode** is one run from the initial state until the task ends.

| Part | Exact specification |
| --- | --- |
| State | `(position, dirt_A, dirt_B)`, where position is A or B and each dirt flag is 0 or 1 |
| Initial state | `(A, 1, 1)` at the beginning of each episode |
| Observation | The complete current state, reported without error |
| Actions | LEFT, RIGHT, SUCK and WAIT in each nonterminal state |
| LEFT / RIGHT | Move to the neighbouring tile; a move beyond an end stays on the same tile |
| SUCK | Remove dirt on the current tile, if present |
| WAIT | Leave the state unchanged |
| Transitions | Deterministic: each action has one resulting state with probability 1 |
| Reward | Start at −1 per action; add 5 if the action removes new dirt; add 6 if that action makes both tiles clean |
| Terminal state | Either position with both dirt flags 0; the episode ends immediately on entry |
| Terminal convention | No further actions or rewards; future Q-value contribution is 0 |
| Reset | Restore the initial world for the next episode; retain the learned Q-table |
| Discount factor | `gamma = 0.9` |

There are eight possible state tuples, including two terminal states. Position and both dirt flags fully determine the next result, so this model satisfies the Markov assumption. A sensor that reports only local dirt would not reveal the other tile's condition. The fully observed model used here would then need additional assumptions or state estimation to describe the agent's information.

### 5.2 Reward and return

Removing the first patch earns `−1 + 5 = 4`. Moving earns `−1`. Removing the last patch earns `−1 + 5 + 6 = 10`. Sucking an already clean tile earns only `−1`.

The **discounted return** weights later rewards by successive powers of `gamma`. [S13](research-and-sources.md) For SUCK, RIGHT, SUCK from the initial state, the rewards are 4, −1 and 10:

```text
Return = 4 + 0.9 × (−1) + 0.9² × 10
       = 4 − 0.9 + 8.1
       = 11.2
```

This is the return of one specified sequence. It is not a measured training result or proof that an agent has learned an optimal policy.

## 6. A worked Q-learning update

**Q-learning** revises action-value estimates from experience. Each sampled update combines the immediate reward with the highest current action estimate at the next state. The learning rate controls how far the old estimate moves toward that target. [S14](research-and-sources.md)

We chose Q-learning because a small table makes the update visible. The lecturer's overview lists algorithms and techniques but names no particular algorithm.

### 6.1 Specify the learning procedure

- Start with `Q(s, a) = 0` for every nonterminal state and action.
- Use learning rate `alpha = 0.5` and discount factor `gamma = 0.9`.
- After each transition, update only the entry for the state and action just experienced.
- For a terminal next state, use a future value of 0.
- A proposed policy is epsilon-greedy with `epsilon = 0.2`: with probability 0.2 choose uniformly among all four actions; otherwise choose the highest-Q action. Break equal-Q ties in the order SUCK, RIGHT, LEFT, WAIT.
- The table below uses a **scripted sequence of valid experiences** to make the arithmetic reproducible. It does not show a random training run under that policy.

The update is:

```text
target = reward + gamma × best_next_Q
new_Q = old_Q + alpha × (target − old_Q)
```

This expresses the standard sampled update, using the terminal convention above. [S14](research-and-sources.md)

### 6.2 Follow one episode

Name the nonterminal states in the sequence:

```text
s0 = (A, 1, 1)
s1 = (A, 0, 1)
s2 = (B, 0, 1)
```

| Step | State and action | Next state | Reward | Old Q | Best next Q at this update | New Q |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | s0, SUCK | s1 | 4 | 0 | 0 | 2 |
| 2 | s1, RIGHT | s2 | −1 | 0 | 0 | −0.5 |
| 3 | s2, SUCK | Terminal | 10 | 0 | 0 | 5 |

For Step 1, `new_Q = 0 + 0.5 × (4 + 0.9 × 0 − 0) = 2`. An estimate has changed. That is different from moving into a mode chosen by fixed rules.

RIGHT initially gets a negative estimate because its immediate reward is −1 and the next state's estimates are still zero. Step 3 then raises the estimate for cleaning the final patch.

### 6.3 Revisit the experience

Reset the environment, keep the Q-table, and replay SUCK, RIGHT, SUCK:

| Step | Entry updated | Old Q | Best next Q | Target | New Q |
| --- | --- | --- | --- | --- | --- |
| 4 | Q(s0, SUCK) | 2 | 0 | 4 | 3 |
| 5 | Q(s1, RIGHT) | −0.5 | 5 | 3.5 | 1.5 |
| 6 | Q(s2, SUCK) | 5 | 0, terminal | 10 | 7.5 |

At Step 4, the maximum at s1 is still 0: RIGHT has −0.5 and the untried actions have 0. At Step 5, the target is `−1 + 0.9 × 5 = 3.5`, so:

```text
Q(s1, RIGHT) = −0.5 + 0.5 × (3.5 − (−0.5))
             = 1.5
```

The positive estimate at s2 has now affected the earlier move. RIGHT's 1.5 at s1 exceeds the three untried actions' estimates of 0, so it becomes the greedy choice there. These six updates show how experience can affect earlier choices. They do not establish convergence, adequate exploration or optimal behaviour.

## 7. Robotics, games and applications

The overview explicitly includes robotics and games. These are proposed examples for teaching that connection, not claims about deployed products.

| Setting | Possible observation or state | Actions | Reward-design question |
| --- | --- | --- | --- |
| Cleaning robot | Position, dirt and energy | Move, clean, charge | Does the score reward newly cleaned floor or merely running suction? |
| Small grid game | Player position, goals and hazards | Move in allowed directions | Does a high score also require reaching the goal safely? |
| Simulated navigation | Position and nearby obstacles | Move or turn | Could a progress reward encourage shortcuts that cause collisions? |

For a game activity, replace dirt with collectibles and corridor boundaries with walls. Define when the episode ends and what each action earns. Changing the story is easy; specifying a sensible state and reward takes more care.

The fixed-rule example also shows that a robot can act autonomously without a learning algorithm. A learning component could be combined with programmed control, provided their responsibilities and conflict rules are defined. Neither paper model requires an Internet connection.

## 8. Questions and explained answers

These are original practice questions, not official BIT assessment questions.

1. **What makes the Q-learning example learn?**

   Experience changes Q-table entries, which the policy can use in later decisions. Switching a fixed controller from CLEAN to RETURN changes its mode but does not revise its rules.

2. **Why does the MDP state include both dirt flags?**

   They determine whether cleaning removes dirt and whether the episode ends. Position alone cannot distinguish a dirty room from an already clean one. A local reading also leaves the other tile's condition unknown.

3. **What does SUCK earn on a clean tile while the other tile remains dirty?**

   −1. It removes no new dirt and does not complete the task, so neither bonus applies.

4. **Why does the first RIGHT update give −0.5?**

   The reward is −1 and the next state's Q-values are initially 0. With an old estimate of 0 and alpha 0.5, the result is `0 + 0.5 × (−1 − 0) = −0.5`.

5. **Why does the second RIGHT update become positive?**

   Q(s2, SUCK) has since risen to 5. RIGHT's target becomes `−1 + 0.9 × 5 = 3.5`. Moving the old −0.5 halfway toward 3.5 produces 1.5.

6. **Does a high immediate reward always identify the best action?**

   No. The move has an immediate cost, but its estimate improves because it leads to a later reward. The aim is expected return rather than only the next score.

7. **What is wrong with rewarding every SUCK command?**

   An agent could repeat SUCK on clean floor. Our proposed reward counts newly removed dirt instead. That fixes this particular incentive, but does not establish that the whole reward design is adequate.

8. **Does “Markov” mean the controller cannot use memory?**

   No. It concerns whether the defined state is sufficient to predict the next result. The finite-state controller uses memory; the two-tile task supplies the full state directly. These are different modelling choices.

9. **Have two replayed episodes proved that Q-learning works on a real vacuum?**

   No. They are arithmetic examples in a deterministic model. They establish neither training success nor physical performance.

## 9. Challenges, limitations and next steps

The two-tile model supplies accurate, complete information. A real vacuum has uncertain readings and imperfect movement, and may observe only part of a room. This model also omits batteries, moving obstacles and collision costs. Its small table does not show how to represent a large or continuous task.

An untried action may have a poor estimate because it has not been sampled, yet trying actions on hardware can be costly. Paper tasks and simulations make examples easier to inspect; they do not establish reliable transfer to a robot. Our fixed learning rate and six scripted updates are teaching choices, not a convergence argument.

Reward needs its own check. Removing dirt, reaching a game goal and avoiding damage are different objectives. A score captures only what its designer specified. Learners should be able to give a case where a score encourages an unwanted action and explain what would need to change.

Connect observations and actions to the Hardware chapter's sensors, processor, memory and motors. Use Networks to explain an optional status message or remote request, with explicit handling for missing or stale messages. The local decision loop remains a separate responsibility.

Before submission, another member should check the definitions, rewards, traces, arithmetic and sources using the [review checklist](review-checklist.md). The lecturer's overview confirms the topic list, but gives no required algorithm or depth. Further detailed lecturer guidance could still change the scope.
