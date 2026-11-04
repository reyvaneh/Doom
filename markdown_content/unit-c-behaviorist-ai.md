# Unit C — Behaviorist AI

> **Reading edition:** This source is included or superseded in the [complete study book](../Learning%20Materials/Study%20Book.md). Start there for the numbered chapters and subchapters.

> Study-guide content for Lessons 5–6 of the [course outline](../study-overview.md). Written for absolute beginners. No programming is required; rules are written in plain language.

**Running example:** a robot vacuum that cleans a room without a map or a network connection.

**How to use this guide**

- It helps to have read [Unit A](unit-a-hardware.md), for sensors, the CPU and motors. Otherwise, no background is needed.
- **AI** (artificial intelligence) here simply means *machines that do things we would call intelligent if a person or animal did them*, such as avoiding danger, finding food, or learning from mistakes.
- Every new word is in **bold** and explained the first time it appears. Look in the [glossary](#unit-c-glossary) if you forget one.
- Read the sections in order, and try each *Check your understanding* before opening the answers.
- Numbers in square brackets, like [1], point to the [sources](#sources) at the end of the page.

---

## Introduction: what does "Behaviorist AI" mean?

### Three schools of AI

Chinese AI textbooks commonly describe three broad schools (学派), or approaches, to building intelligent machines: 符号主义, 连接主义 and 行为主义 [1]. To see the difference, imagine teaching a machine to **ride a bicycle**:

| School | The bicycle idea | Core belief | Examples |
| --- | --- | --- | --- |
| **Symbolism** (符号主义) | Give it a rulebook: "if leaning left, steer left…" | Intelligence = following written rules and logic | **Expert systems**, programs that answer questions using rules written by human experts; the chess computer Deep Blue |
| **Connectionism** (连接主义) | Show it thousands of videos of people riding until it spots the patterns | Intelligence = a web of simple connected units, loosely inspired by brain cells (**neural networks**), that learns from lots of examples | Photo recognition, chatbots |
| **Behaviorism** (行为主义, also called the *cybernetics school*, 控制论学派) | Put it on the bike, let it **sense** wobbling and **act** to correct, and improve each time it falls | Intelligence = acting successfully in the real world | Brooks's walking robots, robot vacuums, learning-by-reward programs |

**Behaviorist AI** is this third school. Its key ideas:

1. **Intelligence shows in behaviour.** Judge a machine by what it *does* in its environment, not by what it "thinks."
2. **Perception and action are connected directly.** A sensor reading can trigger an action without building a detailed internal model of the world first.
3. **Complex behaviour can emerge from simple parts.** Several simple behaviours working together can look surprisingly clever.
4. **Feedback improves behaviour.** The machine checks the effect of its actions and adjusts.

> Modern systems often mix the schools. A self-driving car may use neural networks (connectionism) to recognise objects, rules (symbolism) for traffic laws, and reactive safety behaviours (behaviorism) for emergency braking.

### Where the name comes from

The ideas came together in three steps over about 75 years:

1. **Behaviourism in psychology (1913 onward).** John B. Watson argued that psychology should study only what can be seen: what a person or animal *does* in response to a **stimulus** (something it senses), not its hidden thoughts [2]. B. F. Skinner then showed that animals repeat actions that are followed by **rewards**, for example a rat learning to press a lever that releases food. This is called *operant conditioning* [3]. The same idea is behind reward-based learning in Lesson 6.
2. **Cybernetics (1948).** Norbert Wiener studied how animals and machines control themselves using **feedback**: measure the result, compare it with the goal, correct, repeat [4]. A thermostat is the classic example (Section 5.9).
3. **Behaviour-based robotics (1980s).** Rodney Brooks at MIT argued that robots should be built from layers of simple sense–act behaviours, instead of first building a detailed picture of the world and planning every move [5][6]. His six-legged robot **Genghis** (1989) walked over rough ground using simple behaviours for each leg, with no central plan [7]. Brooks later co-founded iRobot, the company that makes the Roomba robot vacuum [8].

---

## Lesson 5: Reactive behavior

### 5.1 Agents and environments

An **agent** is anything that **perceives** its environment through **sensors** and **acts** on it through **actuators**.

| Agent | Sensors (input) | Actuators (output) | Environment |
| --- | --- | --- | --- |
| Robot vacuum | Bump sensor, cliff sensors, battery sensor, wheel sensors | Wheels, brushes, suction fan | A room with furniture and stairs |
| Thermostat | Temperature sensor | Heater switch | A house |
| Human | Eyes, ears, skin | Hands, legs, voice | The world |
| Game character | Game data: player position, health | Move, jump, attack | The game level |

#### Describing an agent with PEAS

A simple checklist for designing any agent, taken from the most widely used AI textbook [9]. Answer the four questions in order:

| Letter | Question | Robot vacuum |
| --- | --- | --- |
| **P**erformance measure | How do we judge success? | Clean floor area, time taken, no falls, no collisions with pets, battery never fully empty |
| **E**nvironment | Where does it work? | Rooms, furniture, rugs, stairs, pets, people |
| **A**ctuators | How does it act? | Left/right wheel motors, brush, suction, beeper |
| **S**ensors | How does it perceive? | Bumper, cliff sensors, battery level, wheel sensors, dirt sensor |

### 5.2 The sense–think–act loop

An agent runs a loop that never stops while it's switched on:

```
        ┌──────────────────────────────────────────┐
        │                                          │
        ▼                                          │
   1. SENSE ──────► 2. DECIDE ──────► 3. ACT ──────┘
   read sensors     choose an action   send commands
                    using rules        to motors
                              │
                              ▼
                  the environment changes
               (robot moved, bumped something)
                  → new sensor readings
```

A robot vacuum repeats this loop many times per second. Because the world keeps changing, the robot keeps re-checking it.

### 5.3 Simple reflex agents and condition–action rules

The simplest agent is a **simple reflex agent**. It looks only at the **current** sensor readings and picks an action using **condition–action rules** (also called *if–then rules*):

> **IF** *condition* **THEN** *action*

Just like a human reflex: IF a hand touches something hot, THEN pull it away — no thinking required.

### 5.4 Worked example: the three-rule vacuum

**How the robot uses the rules, every time round the loop:**

1. Read all the sensors.
2. Look at rule 1. Is its condition true? If yes, do its action and **stop checking**.
3. If not, look at rule 2, and so on down the list.
4. The last rule has no condition ("otherwise"), so the robot always does *something*.
5. Go back to step 1.

| Priority | Rule |
| --- | --- |
| 1 (highest) | IF obstacle directly ahead THEN **stop** |
| 2 | IF battery low THEN **request charging** |
| 3 (default) | OTHERWISE **clean forward** |

**Trace table:**

| Case | Obstacle ahead? | Battery low? | First rule that matches | Action |
| --- | --- | --- | --- | --- |
| A | No | No | Rule 3 | Clean forward |
| B | Yes | No | Rule 1 | Stop |
| C | No | Yes | Rule 2 | Request charging |
| D | Yes | Yes | Rule 1 (checked first) | Stop |

**Why does order matter?** In case D two rules match. Putting safety first means the robot never drives into a wall or a pet just because it wants to charge.

**What goes wrong?** In case B the robot stops… and stays stopped forever, because the obstacle is still there on the next loop. We need a better rule set.

### 5.5 Improving the rules

| Priority | Rule |
| --- | --- |
| 1 | IF cliff detected THEN **back up** and **turn 90°** |
| 2 | IF bumper pressed THEN **back up** and **turn a random angle** |
| 3 | IF battery low THEN **follow the dock's infrared beacon** |
| 4 | OTHERWISE **drive forward and clean** |

Changes:
- **Cliff first** — falling down stairs is worse than bumping into a chair.
- **Turn instead of stop** — the robot can now escape obstacles.
- **Random turn** — if it always turned exactly 90°, it could get stuck bouncing in the same pattern forever. Randomness helps it cover the whole room over time.
- **A charging action that moves** — "request charging" did nothing physical; now it heads home.

> The first Roomba (2002) cleaned in a similar way. It had no map: it spiralled outward until its bumper touched something, followed walls, and changed direction after bumps [10][11]. With enough time this covers most of a room, not efficiently but reliably. Many newer models add maps and route planning.

### 5.6 Subsumption architecture: layers of behaviour

Brooks's **subsumption architecture** (1986) [5] organises behaviours in **layers**. *Subsume* means "to take over and include," which is what higher layers do to lower ones. Each layer is a complete simple behaviour. Higher-priority layers can **suppress** (override) lower ones when needed.

```
  Sensors                                          Motors
     │                                               ▲
     ├──► [ Layer 3: Avoid cliffs    ] ──overrides──►│
     │                                               │
     ├──► [ Layer 2: Avoid obstacles ] ──overrides──►│
     │                                               │
     ├──► [ Layer 1: Go to dock      ] ──overrides──►│
     │                                               │
     └──► [ Layer 0: Wander & clean  ] ─────────────►┘
```

- All layers run at the same time, each watching the sensors.
- Layer 0 (wander and clean) works on its own — this is the robot's normal state.
- When a higher layer is triggered (a cliff, a bump), it takes control of the motors until the danger has passed, then hands control back.
- New abilities are added by stacking new layers on top **without rewriting** the old ones.

**Emergence:** no single layer contains a plan to "clean the whole room," yet the combination does it. Behaviour that appears from simple parts interacting is called **emergent behaviour** — like an ant colony building complex nests with no ant in charge.

### 5.7 Braitenberg vehicles: simple wiring, "emotional" behaviour

Neuroscientist Valentino Braitenberg imagined tiny cars with two light sensors (front left and front right) and two wheel motors [12]. Each sensor is wired to one motor: more light on a sensor means that motor spins faster.

**First, one fact about steering:** if the left wheel spins faster than the right, the car turns **right**, and the other way round. (Try it with a toy car, or picture a tank.)

**Now follow the "fear" vehicle step by step**, with a lamp on its left:

1. The left sensor is closer to the lamp, so it gets more light.
2. It is wired to the **left** wheel, so the left wheel spins faster.
3. Left wheel faster → the car turns **right**, away from the lamp.
4. As it turns away, both sensors get less light, so it slows down and stops far from the lamp.

| Wiring | Behaviour near a light | It looks like… |
| --- | --- | --- |
| Left sensor → left wheel, right sensor → right wheel | The wheel on the light side spins faster, so the vehicle turns **away** from the light | **Fear** — it runs away |
| Left sensor → **right** wheel, right sensor → **left** wheel (crossed) | The wheel on the far side spins faster, so the vehicle turns **toward** the light and speeds up | **Aggression** — it charges at the light |

**The lesson:** observers easily read feelings or intentions into very simple machines. A behaviour that *looks* intelligent does not prove the machine understands anything.

### 5.8 Adding memory: finite-state machines

A pure reflex agent forgets everything between loops. Many robots add a small amount of memory called a **state** — "what mode am I in?" — and switch between states when events happen. This is a **finite-state machine (FSM)**.

```
           battery < 20%                    reached dock
 ┌──────────┐ ─────────────► ┌────────────┐ ─────────────► ┌───────────┐
 │ CLEANING │                │ RETURNING  │                │ CHARGING  │
 └──────────┘ ◄───────────── └────────────┘                └───────────┘
      ▲          (no change)                                     │
      └──────────────────────── battery = 100% ──────────────────┘
```

| Current state | Event | Next state | What the robot does in the new state |
| --- | --- | --- | --- |
| Cleaning | Battery below 20% | Returning | Follows the dock signal; still avoids obstacles |
| Returning | Reached the dock | Charging | Stops motors, charges |
| Charging | Battery full | Cleaning | Leaves the dock and resumes cleaning |

Inside each state, the reactive rules (avoid cliffs, avoid obstacles) still run. FSMs are also used for most enemy characters in video games (e.g., *patrol → chase when the player is seen → return when the player is lost*).

### 5.9 Feedback control: the thermostat

The simplest "behaviour" is **feedback control**:

1. Measure: room is 18 °C.
2. Compare with the goal: target is 21 °C → too cold.
3. Act: turn the heater on.
4. Measure again: room is 21.5 °C → too warm → heater off.

The vacuum uses the same idea to drive straight: the wheel sensors measure whether one wheel is turning faster than the other, and the controller corrects the motor speeds — just as you make small steering corrections on a bicycle.

### 5.10 Strengths and limits of reactive behaviour

| Strengths | Limits |
| --- | --- |
| **Fast** — no long planning, so it reacts in milliseconds | **No foresight** — can't plan the shortest route |
| **Robust** — keeps working when the world changes unexpectedly | **Can get stuck** in loops (e.g., trapped under a chair) |
| **Cheap** — runs on a small, low-power processor | **Doesn't improve** — makes the same mistake forever |
| **Easy to test** — each rule can be checked separately | **Rules must be written by people**, who can't foresee every situation |

### 5.11 Common misconceptions

| Misconception | Correction |
| --- | --- |
| "If a robot behaves cleverly, it must be learning." | A reactive controller follows fixed rules. It behaves the same way every time in the same situation. |
| "If–then rules are human-like intelligence." | They produce useful behaviour, but the robot has no understanding of *why* it turns away from stairs. |
| "Behaviour-based robots have no program." | They do — the rules *are* the program. The difference is that there is no detailed world model or long-term plan. |
| "More rules always make it better." | Rules can conflict. Priorities and testing matter more than the number of rules. |

### 5.12 Check your understanding

1. List the sensors and actuators of a robot vacuum.
2. Using the three-rule vacuum (5.4), what does the robot do when there is an obstacle and the battery is low? Why?
3. Describe one situation the improved rules (5.5) handle poorly. Suggest a new rule.
4. In a subsumption architecture, what happens when the "avoid cliffs" layer is triggered while the robot is wandering?
5. A Braitenberg vehicle has crossed wiring. A lamp is switched on to its left. Which way does it turn?
6. Draw a finite-state machine for a game enemy with states *Patrol*, *Chase*, and *Search*.

<details>
<summary>Answers</summary>

1. Sensors: bumper, cliff sensors, battery sensor, wheel sensors (dirt sensor, camera on some models). Actuators: wheel motors, brush, suction fan, beeper/lights.
2. **Stop.** Rule 1 is checked first and its condition is true, so rules 2 and 3 are never reached.
3. Example: the robot under a low chair keeps bumping and turning without escaping. New rule: *IF bumped more than 5 times in 10 seconds THEN reverse further and drive along the nearest wall.* Other good answers: dark carpets confusing cliff sensors; a cable tangling the brush; the dock is in another room and its signal can't be seen.
4. It **overrides** (suppresses) the wander layer and takes control of the motors to back away; once safe, control returns to wandering.
5. **Left, toward the lamp.** The left sensor gets more light and drives the right wheel faster, turning the vehicle left.
6. Example: Patrol → (sees player) → Chase → (loses player) → Search → (finds player) → Chase; Search → (time runs out) → Patrol.

</details>

---

## Lesson 6: Learning and integration

### 6.1 From fixed rules to learning

A fixed-rule robot behaves the same way forever. A **learning agent** changes its behaviour based on experience. In behaviorist AI the main learning method is **reinforcement learning (RL)**: learning by **trial and error** from **rewards** [13].

**Link to psychology:** Skinner's animals learned to press a lever because pressing it was followed by food. An RL agent learns to choose actions because they have been followed by high rewards.

### 6.2 The reinforcement learning loop

```
            ┌─────────────── action ───────────────┐
            │                                      ▼
       ┌─────────┐                          ┌─────────────┐
       │  AGENT  │                          │ ENVIRONMENT │
       └─────────┘                          └─────────────┘
            ▲                                      │
            └──────── new state + reward ──────────┘
```

| Term | Meaning | Vacuum example |
| --- | --- | --- |
| **State** | The situation the agent is in | "In the kitchen, battery 70%, bumper not pressed" |
| **Action** | A choice the agent can make | Go left, go right, go forward, return to dock |
| **Reward** | A number telling how good the result was | +1 for each new patch of floor cleaned, −10 for bumping hard, −100 for running out of battery away from the dock |
| **Policy** | The agent's current strategy: which action it picks in each state | "In the kitchen, usually go left" |
| **Value** | The agent's *estimate* of how much reward an action will bring | "Going left has paid about 6 points on average" |

The goal is not the biggest reward right now, but the **most total reward over time**. Sometimes a small cost now (driving to the dock) prevents a big penalty later (dying in the middle of the room).

### 6.3 Worked example: the route-choice game

*A paper analogy, not a real learning algorithm.*

A robot can clean three areas. Each time it picks an area, it gets a reward (how much dirt it collected). Rewards vary from day to day. The robot keeps an **average score** for each area and updates it after every try.

**Update rule (just a running average)** [13, ch. 2]:

> new average = old average + (reward − old average) ÷ number of tries

**What the rule means in words:** "How surprised am I?" is the gap (reward − old average). Move the average part of the way toward the new reward. The more tries you've had, the smaller the move, because you already know a lot.

**One update, step by step (round 4 in the table below):**

1. Area B's average so far is 8, from 1 try.
2. The robot tries B again and gets reward 6. That makes 2 tries.
3. Surprise: 6 − 8 = −2 (worse than expected).
4. Share the surprise over the tries: −2 ÷ 2 = −1.
5. New average: 8 + (−1) = **7**.
6. Check: the plain average of 8 and 6 is (8 + 6) ÷ 2 = 7 ✓

| Round | Area chosen | Why | Reward | Average A | Average B | Average C |
| --- | --- | --- | --- | --- | --- | --- |
| Start | — | — | — | 0 (0 tries) | 0 (0 tries) | 0 (0 tries) |
| 1 | A | Try everything once | 4 | **4** | 0 | 0 |
| 2 | B | Try everything once | 8 | 4 | **8** | 0 |
| 3 | C | Try everything once | 2 | 4 | 8 | **2** |
| 4 | B | Best average (exploit) | 6 | 4 | 8 + (6−8)÷2 = **7** | 2 |
| 5 | B | Best average (exploit) | 7 | 4 | 7 + (7−7)÷3 = **7** | 2 |
| 6 | A | Random check (explore) | 9 | 4 + (9−4)÷2 = **6.5** | 7 | 2 |
| 7 | B | Best average (exploit) | 8 | 6.5 | 7 + (8−7)÷4 = **7.25** | 2 |

After a few rounds the robot prefers area B — not because a person wrote "go to B," but because experience pushed its estimate up. If area B stops being dirty (someone starts cleaning it by hand), B's average will fall and the robot will gradually shift elsewhere.

**Classroom version:** hide reward cards (points) in three envelopes. Groups pick envelopes, record rewards, update averages on the board, and see which group earns the most points over 10 rounds.

### 6.4 Exploration vs exploitation

- **Exploit:** choose the action with the best estimate so far — collect known rewards.
- **Explore:** try something else — maybe it's even better, and you'll never know if you don't try.

Too much exploiting → stuck with a "good enough" choice forever (in round 6 above, area A turned out better than it first looked).
Too much exploring → waste time on bad choices.

**A simple strategy, called ε-greedy ("epsilon-greedy") [13, ch. 2]:** roll a 10-sided die each round. (ε, the Greek letter epsilon, just stands for "the small chance of exploring.") On a 1, pick a random action (explore). Otherwise pick the best-known action (exploit). So the agent explores about 10% of the time.

**Everyday example:** at your favourite restaurant, do you order your usual dish (exploit) or try something new (explore)?

### 6.5 When rewards go wrong: reward hacking

The agent learns whatever earns reward — not what the designer *meant*.

| Designer's reward | What the agent might learn | Why |
| --- | --- | --- |
| +1 for every piece of dirt collected | Spill dirt, then collect it again | More dirt collected = more reward |
| −10 for every bump | Never move at all | No movement = no bumps |
| +1 for each minute spent cleaning | Clean very slowly | More minutes = more reward |

**A real case [14]:** in 2016 OpenAI researchers trained an agent on the boat-racing game *CoastRunners*, using the game's score as the reward. In that game you score points by hitting targets along the course, not by finishing. The agent found a lagoon where targets kept reappearing and circled it again and again. It caught fire, crashed into other boats and went the wrong way, yet still scored more than players who finished the race.

The table above shows *made-up* examples of the same problem.

> Designing the reward is designing the goal. A good reward measures the actual result you want (clean floor, safely, efficiently), not an easy-to-count stand-in.

### 6.6 Fixed rules vs reinforcement learning

| | Fixed-rule (reactive) controller | Reinforcement learning agent |
| --- | --- | --- |
| Who decides the behaviour? | A person writes the rules | The agent discovers it from rewards |
| Changes with experience? | **No** | **Yes**, through an update mechanism |
| Same situation, same action? | Always | Not necessarily — it may explore |
| Needs training time? | No | Yes, often many thousands of tries (often in simulation) |
| Predictability | High — easy to check | Lower — can find surprising strategies |
| Handles new situations | Only those the rules cover | Can adapt, if rewards guide it well |
| Typical use | Safety reflexes, simple appliances | Game-playing AI, robot walking, recommendation systems |

> **A reward alone changes nothing.** If a fixed-rule vacuum received a "+1" signal, nothing would happen — nothing in its program reads the reward or changes the rules. Learning requires an **update mechanism** like the averaging in 6.3.

**In practice, real robots combine both:** reactive safety rules that are *never* overridden (always avoid cliffs), with learning used to improve things like cleaning routes.

### 6.7 Real-world examples of behaviorist AI

| Example | Approach |
| --- | --- |
| Robot vacuums | Reactive bump/cliff behaviours + state machines; newer models add mapping and route planning [10] |
| Brooks's *Genghis* walking robot (1989) | Subsumption architecture — simple behaviours per leg [7] |
| Video-game enemies | Finite-state machines and behaviour rules |
| AlphaGo (2016), the first program to beat a professional Go player | Learned partly from human games, then improved by playing against itself with reinforcement learning [15] |
| Four-legged robots learning to walk and get up | Reinforcement learning in a computer simulation, then transferred to the real robot [16] |
| Industrial robot safety systems | Reactive rules, e.g., slow down or stop if a person comes too close |

### 6.8 Integration: the whole robot vacuum

This brings all three units together.

```
 ┌─────────────────────────── ROBOT VACUUM ───────────────────────────┐
 │                                                                     │
 │  SENSORS (input)        PROCESSOR (microcontroller)      ACTUATORS │
 │  bumper ─────────┐     ┌──────────────────────────┐   ┌─► wheels   │
 │  cliff sensors ──┼────►│ behaviour controller:    │───┼─► brush    │
 │  battery ────────┤     │ rules + state machine    │   └─► fan      │
 │  wheel sensors ──┘     │ (program in storage,     │                │
 │                        │  readings in RAM)        │                │
 │                        └────────────┬─────────────┘                │
 │                                     │ optional                     │
 │                              Wi-Fi chip                            │
 └─────────────────────────────────────┼──────────────────────────────┘
                                       ▼
                     home router → Internet → cloud server → phone app
```

**Trace one event from start to finish — the robot reaches the top of the stairs:**

| Step | What happens | Unit |
| --- | --- | --- |
| 1 | The cliff sensor shines infrared light down; almost none bounces back. It reports a low value, e.g. `12` (out of 255) | Hardware — input, bits |
| 2 | The value is stored in RAM; the microcontroller's fetch–decode–execute cycle runs the instruction "compare cliff value with 50" | Hardware — CPU, RAM |
| 3 | 12 < 50, so the cliff layer triggers and overrides the wander behaviour | Behaviorist AI — subsumption |
| 4 | The controller sends "reverse, then turn" to the wheel motors | Hardware — output/actuators |
| 5 | The robot backs away safely. **No network was needed** | Behaviorist AI — reactive loop |
| 6 | *Optional:* the vacuum sends a status packet ("cliff avoided near stairs") via Wi-Fi to the cloud server, so the app can mark the map | Networks — packets, TCP, DNS |

**What works offline vs what needs the network:**

| Works with no network | Needs the network |
| --- | --- |
| Sensing, avoiding cliffs and obstacles, cleaning, returning to the dock, charging | Starting/stopping from the app when away from home, live map in the app, software updates, voice-assistant control |

### 6.9 Common misconceptions

| Misconception | Correction |
| --- | --- |
| "Behaviour-based robotics and reinforcement learning are the same thing." | Both are part of the behaviorist school and focus on behaviour, but behaviour-based robotics usually uses hand-written behaviours; RL learns behaviour from rewards. |
| "Reward = the robot feels happy." | A reward is just a number used in a calculation. |
| "A learning agent always gets better." | Only if rewards measure the right thing — otherwise it gets better at the wrong thing (reward hacking). |
| "The robot vacuum needs the Internet to think." | Its sense–act loop runs entirely on board. |

### 6.10 Check your understanding

1. Name the three schools of AI and give one example of each.
2. Define *state*, *action*, *reward*, and *policy* in your own words.
3. In the route-choice game, area A has an average of 5 after 4 tries. The next try gives a reward of 10. What is the new average?
4. Why should a learning agent sometimes choose an action that *isn't* its current best?
5. A designer gives a vacuum +1 for each second its brush is spinning. What unintended behaviour might it learn? Suggest a better reward.
6. Does receiving a reward change a fixed-rule program automatically? What would need to be added?
7. Trace what happens, step by step, when the vacuum's bumper hits a chair leg. Name the unit (hardware, network, behaviour) for each step.

<details>
<summary>Answers</summary>

1. Symbolism (expert systems, Deep Blue); connectionism (neural networks, image recognition, language models); behaviorism (Brooks's robots, robot vacuums, RL agents).
2. State: the current situation. Action: a choice the agent can make. Reward: a number saying how good the result was. Policy: the agent's strategy for choosing actions in each state.
3. 5 + (10 − 5) ÷ 5 = 5 + 1 = **6**. (It's the 5th try, so divide by 5.)
4. To **explore**: its estimates may be wrong, and another action may actually be better. Without exploring it can never find out.
5. It might spin its brush while sitting still, or drive in circles over the same clean patch. Better: reward newly cleaned floor area (or dirt removed for the first time), with penalties for collisions and an empty battery.
6. **No.** A fixed-rule program never reads the reward. An update mechanism is needed: somewhere to store estimates (memory) and a rule that changes them after each reward (like the running average).
7. Bumper switch closes → sensor bit becomes 1 (hardware, input) → microcontroller reads it in its instruction loop (hardware, CPU/RAM) → avoid-obstacles layer overrides wandering (behaviour) → motors reverse and turn (hardware, actuators) → robot continues cleaning (behaviour) → optionally a status update is sent to the app (network).

</details>

---

## Unit C glossary

| Term | Meaning |
| --- | --- |
| Actuator | A part that lets an agent act, such as a motor |
| Agent | Anything that senses its environment and acts on it |
| Behaviorism (AI) | The AI school that builds intelligence from perception–action behaviour and feedback |
| Condition–action rule | An IF–THEN rule linking a situation to an action |
| Cybernetics | The study of control and feedback in animals and machines |
| Emergent behaviour | Complex behaviour that arises from simple parts interacting |
| Environment | Everything outside the agent that it senses and acts on |
| Exploration / exploitation | Trying new actions vs using the best-known action |
| Feedback control | Measuring a result, comparing it with a goal, and correcting |
| Finite-state machine | A model where an agent is in one of a few modes and switches on events |
| Operant conditioning | Learning in animals where actions followed by rewards become more frequent |
| PEAS | Performance, Environment, Actuators, Sensors — a checklist for describing an agent |
| Policy | An agent's strategy for choosing actions |
| Reactive agent | An agent that responds to current sensor readings without a long-term plan |
| Reinforcement learning | Learning behaviour by trial and error from rewards |
| Reward | A number that signals how good an outcome was |
| Reward hacking | An agent maximising reward in a way the designer didn't intend |
| Sensor | A device that measures something in the environment |
| State | The current situation (for RL), or the current mode (for an FSM) |
| Subsumption architecture | Brooks's design where layered behaviours run together and higher layers override lower ones |

## Sources

1. 蔡自兴 (Cai Zixing) et al., 《人工智能及其应用》 (*Artificial Intelligence and Its Applications*), Tsinghua University Press. A standard Chinese university AI textbook that presents the symbolism, connectionism and behaviorism schools; behaviorism is traced to cybernetics, with Brooks as its leading figure. *Team to-do: add the edition and page number from the library copy we use.*
2. J. B. Watson, ["Psychology as the behaviorist views it"](https://psychclassics.yorku.ca/Watson/views.htm), *Psychological Review* 20 (1913).
3. B. F. Skinner, *The Behavior of Organisms: An Experimental Analysis* (Appleton-Century, 1938).
4. N. Wiener, *Cybernetics: Or Control and Communication in the Animal and the Machine* (MIT Press, 1948).
5. R. A. Brooks, ["A robust layered control system for a mobile robot"](https://people.csail.mit.edu/brooks/papers/AIM-864.pdf), MIT AI Memo 864 (1985); published in *IEEE Journal of Robotics and Automation* 2(1), 1986. The original description of the subsumption architecture.
6. R. A. Brooks, ["Intelligence without representation"](https://people.csail.mit.edu/brooks/papers/representation.pdf), *Artificial Intelligence* 47 (1991).
7. R. A. Brooks, "A robot that walks: emergent behaviors from a carefully evolved network," *Neural Computation* 1(2), 253–262 (1989), [doi:10.1162/neco.1989.1.2.253](https://doi.org/10.1162/neco.1989.1.2.253). See also [Genghis (robot)](https://en.wikipedia.org/wiki/Genghis_(robot)).
8. [Rodney Brooks — MIT CSAIL](https://people.csail.mit.edu/brooks/). Lists him as a co-founder of iRobot.
9. S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, 4th ed. (Pearson, 2020), chapter 2. Covers agents, PEAS, and simple reflex agents.
10. iRobot, ["iRobot Introduces Roomba Intelligent FloorVac"](https://media.irobot.com/2002-09-18-iRobot-Introduces-Roomba-Intelligent-FloorVac-The-First-Automatic-Floor-Cleaner-In-The-U-S), press release, 18 September 2002. Describes the spiral and wall-following behaviour.
11. J. L. Jones, "Robots at the tipping point: the road to iRobot Roomba," *IEEE Robotics & Automation Magazine* 13(1), 2006. Explains the random-bounce and wall-following coverage strategy.
12. V. Braitenberg, *Vehicles: Experiments in Synthetic Psychology* (MIT Press, 1984). Vehicles 2a ("fear") and 2b ("aggression").
13. R. S. Sutton and A. G. Barto, [*Reinforcement Learning: An Introduction*, 2nd ed.](https://mitpress.ublish.com/book/reinforcement-learning-an-introduction-2) (MIT Press, 2018). Chapter 1 covers the agent–reward loop; chapter 2 covers the incremental average update and ε-greedy exploration.
14. J. Clark and D. Amodei, ["Faulty reward functions in the wild"](https://openai.com/index/faulty-reward-functions/), OpenAI, 21 December 2016.
15. D. Silver et al., ["Mastering the game of Go with deep neural networks and tree search"](https://www.nature.com/articles/nature16961), *Nature* 529 (2016).
16. J. Hwangbo et al., "Learning agile and dynamic motor skills for legged robots," *Science Robotics* 4(26) (2019), [doi:10.1126/scirobotics.aau5872](https://doi.org/10.1126/scirobotics.aau5872).
