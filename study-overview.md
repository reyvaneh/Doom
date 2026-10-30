# Hardware, Networks & Behaviorist AI

> Course outline v0.1 — 16 October 2026. A plan for lectures and learning materials; full lesson content, slides, and videos are still to be developed.

## 1. Course purpose

Help absolute beginners explain how a computer processes information, how devices exchange information, and how a simple artificial agent responds to its environment. No programming or prior computer science knowledge is required.

This outline follows the audience and deliverables in the [project README](README.md). It will become the shared foundation for the study guide, PowerPoint slides, and video tutorials.

**Connecting example:** a robot vacuum. Its hardware senses and processes information, its network connection can exchange status messages, and its behavior controller chooses actions. Basic autonomous operation can work without a network connection.

## 2. Scope and assumptions

- Proposed format: six 45-minute lessons, grouped into three units. Timing is provisional until the assignment requirements are confirmed.
- Use everyday examples, labeled diagrams, paper simulations, and plain-language rules before introducing technical vocabulary.
- Treat **Behaviorist AI** provisionally as behavior-based/reactive AI: sensing the environment and selecting actions. Introduce reward-based learning as a related approach, while distinguishing it from fixed rules. Confirm the lecturer's intended terminology before expanding this unit.
- Coding, physical robot kits, advanced electronics, subnet calculations, and mathematical learning algorithms are outside the core outline. Optional demonstrations can be added later.
- Course structure and activities below are our proposed teaching design. Sources support the underlying concepts; they do not prescribe this course or its duration.

## 3. Learning outcomes

By the end of the course, learners should be able to:

1. Identify input devices, the CPU, RAM, storage, and output devices, and describe their roles.
2. Explain bits and bytes using a small example and trace a simplified instruction cycle.
3. Draw a simple home network and distinguish local connectivity from Internet access.
4. Describe packets, IP addresses, DNS, and transport protocols at an introductory level.
5. Trace an agent's sense–act loop and predict the result of simple behavior rules.
6. Distinguish a fixed-rule controller from an agent that changes its behavior through reward-based learning.
7. Connect hardware, networking, and behavior control in one annotated system diagram.

## 4. Proposed lesson sequence

| Lesson | Main question | Core topics | Learner evidence |
| --- | --- | --- | --- |
| 1. Inside a computer | What do the parts actually do? | Input/output, CPU, RAM, persistent storage | Labeled component diagram |
| 2. From bits to actions | How does hardware follow instructions? | Bits/bytes, simple logic, fetch–decode–execute | Paper instruction trace |
| 3. Connecting devices | How do devices communicate? | LAN/Internet, Ethernet/Wi-Fi, switches, routers, packets | Home-network sketch and packet activity |
| 4. A message's journey | How does information reach the right place? | IP, DNS, TCP/UDP, latency and bandwidth | Annotated request/response journey |
| 5. Reactive behavior | How can a machine respond to its surroundings? | Agents, sensors, actions, rules, priorities | Predicted robot actions across test cases |
| 6. Learning and integration | How is learning different from following rules? | Rewards, trial and error, exploration, integrated system | Rule/learning comparison and final explanation |

### Unit A — Hardware

#### Lesson 1: Inside a computer

- **Objectives:** identify the main components; distinguish temporary working memory from persistent storage.
- **Teaching outline:** begin with opening a photo; identify input, processing, working memory, storage, and display; connect the parts with a simple data-flow diagram.
- **Demonstration:** follow a saved photo from storage into RAM and onto the screen. Explain that the CPU executes instructions; the display presents the result.
- **Activity:** learners match component cards to jobs and label a computer diagram.
- **Check:** “What usually happens to unsaved work in RAM when power is lost, and how is that different from a saved file?”
- **Misconception to address:** RAM capacity and storage capacity describe different functions.
- **Planned visuals:** component diagram; RAM/storage comparison. Concept foundation: [Nand to Tetris hardware sequence](https://www.nand2tetris.org/course).

#### Lesson 2: From bits to actions

- **Objectives:** represent a small value with bits; trace a simplified fetch–decode–execute cycle.
- **Teaching outline:** binary states; bit versus byte; one AND/OR example; instructions and data in memory; the CPU instruction cycle.
- **Demonstration:** four paper bit cards representing values 0–15, followed by a three-instruction paper machine.
- **Activity:** take turns acting as CPU and memory to fetch instructions, add two small values, and record the result.
- **Check:** learners explain one complete instruction cycle in their own words.
- **Misconception to address:** binary is a representation of information; it does not mean a computer understands information as a person does.
- **Planned visuals:** bit cards, truth table, instruction-cycle diagram. Adapt concepts from [Nand to Tetris](https://www.nand2tetris.org/course), without requiring its construction projects.


### Unit B — Networks

#### Lesson 3: Connecting devices

- **Objectives:** sketch a local network; explain why data is sent in packets; distinguish switch and router roles.
- **Teaching outline:** devices and links; local networks versus the Internet; wired and wireless links; forwarding within and between networks; packet headers and payloads.
- **Demonstration:** deliver a short message as numbered paper packets through classmates acting as intermediate devices.
- **Activity:** draw a home network with a phone, laptop, access point, router, and Internet connection. Explain that one home box may combine several roles.
- **Check:** “Can two devices communicate locally when the Internet connection is unavailable?”
- **Misconception to address:** being connected to Wi-Fi does not guarantee Internet access.
- **Planned visuals:** home-network map and packet illustration. Technical background: [RFC 1122](https://www.rfc-editor.org/rfc/rfc1122).

#### Lesson 4: A message's journey

- **Objectives:** distinguish names from addresses; describe a simplified request/response exchange; compare latency and bandwidth.
- **Teaching outline:** DNS name lookup; destination IP addresses; routing; application data carried using transport protocols; response delivery.
- **Demonstration:** use a prepared diagram to follow a website request, then compare a delayed packet with a low-capacity link.
- **Activity:** arrange journey cards and label which jobs belong to DNS, IP, and the application. State that this is a simplified path; caching can avoid a fresh DNS lookup.
- **Check:** explain that TCP provides a reliable, ordered byte stream while UDP does not itself guarantee delivery or ordering. Neither protocol is simply “always faster.”
- **Misconception to address:** DNS helps resolve names; it does not carry the webpage contents. High bandwidth does not necessarily mean low latency.
- **Planned visuals:** request/response sequence and latency/bandwidth comparison. Sources: [RFC 1034](https://www.rfc-editor.org/rfc/rfc1034) and [RFC 1122](https://www.rfc-editor.org/rfc/rfc1122).

### Unit C — Behaviorist AI

#### Lesson 5: Reactive behavior

- **Objectives:** identify an agent's observations and actions; trace a reactive controller; explain conflicting behavior priorities.
- **Teaching outline:** agent and environment; sensor input; repeated sense–act loop; condition/action rules; prioritizing obstacle avoidance, charging, and cleaning.
- **Demonstration:** a paper robot vacuum on a grid with three ordered rules: stop if an obstacle is immediately ahead; otherwise request charging if the battery is low; otherwise clean forward.
- **Activity:** predict actions for clear space, an obstacle, low battery, and simultaneous obstacle/low-battery inputs. Discuss what extra behavior would be needed to turn or find a charger.
- **Check:** identify a case the rules handle poorly and propose a change.
- **Misconception to address:** a reactive controller need not learn. A basic if/then example illustrates behavior control; it does not by itself establish human-like intelligence.
- **Planned visuals:** sense–act loop and behavior-priority chart. Research foundation: Brooks's [Intelligence without representation](https://people.csail.mit.edu/brooks/papers/representation.pdf), which studies behavior organized around perception and action.

#### Lesson 6: Learning and integration

- **Objectives:** distinguish fixed rules from learning through rewards; explain how the three units fit together.
- **Teaching outline:** an agent tries actions, receives rewards, and updates its action preferences; exploration versus repeating a known useful action; rewards can encourage unintended behavior.
- **Demonstration:** contrast the fixed-rule vacuum with a paper route-choice game where learners update preferences using observed rewards. Label this an analogy, not an implementation of a learning algorithm.
- **Activity:** annotate the vacuum system with sensors, CPU, RAM/storage, optional network messages, and the behavior controller; explain what works offline and what depends on communication.
- **Check:** “Does receiving a reward change a fixed-rule program automatically? What mechanism would need to update?”
- **Misconception to address:** behavior-based robotics and reinforcement learning are related teaching topics, not interchangeable terms. Learning requires an update mechanism.
- **Planned visuals:** fixed-rule/learning comparison and integrated system diagram. Reward-based learning foundation: Sutton and Barto's [Reinforcement Learning: An Introduction, second edition](https://mitpress.ublish.com/book/reinforcement-learning-an-introduction-2).

## 5. Reusable lecture structure

Suggested allocation for each 45-minute lesson:

| Segment | Minutes | Purpose |
| --- | --- | --- |
| Everyday question and recap | 5 | Connect to prior knowledge |
| Explanation with diagrams | 12 | Introduce a few essential concepts |
| Worked demonstration | 8 | Model the reasoning |
| Learner activity | 12 | Practice and collect evidence |
| Check and recap | 8 | Discuss answers and correct misconceptions |

Each lesson should eventually have a study-guide section, matching slides, a short video/script, and an activity with an answer guide. Use the same terminology and examples across all formats.

## 6. Assessment outline

- **Opening diagnostic:** ask learners what they think RAM, Wi-Fi, and AI do; no grading proposed.
- **During lessons:** use the checks and learner evidence listed above.
- **Final task:** explain the robot-vacuum diagram in plain language, tracing one sensor reading through processing to an action and one optional network exchange.
- **Success criteria:** correct component roles; sensible network path; correct behavior trace; clear distinction between rules and learning; explanation accessible to another beginner.
- Grading weights and pass thresholds remain to be agreed with the assignment requirements.

## 7. Materials to develop next

- [ ] Confirm required lecture length, delivery language, assessment criteria, and meaning of “Behaviorist AI.”
- [ ] Agree on this sequence and assign lesson ownership.
- [ ] Expand each lesson into beginner-friendly explanations and worked examples, one folder per unit (Hardware: [hardware/hardware.md](Learning%20Materials/Hardware/hardware.md) covers Lessons 1–2 plus a physical-computing project).
- [ ] Create original diagrams and activity sheets in each unit's folder.
- [ ] Draft slides and video scripts from the reviewed Markdown.
- [ ] Prepare answer guides and check source attribution for reused material.
- [ ] Rehearse with a beginner and revise unclear explanations or unrealistic timing.
- [ ] Record actual contributions, decisions, and evidence in the team project log and private personal logs; their locations still need to be supplied by the team.

These are planned tasks, not completed deliverables. The README lists Stage 1 as due 24 October; later milestones and individual assignments are not specified here.

## 8. Research references

Sources consulted on 16 October 2026 using web research. This is an initial source-backed outline, not an exhaustive literature review. The standards and research papers are instructor references; learners do not need to read them in full.

| Source | Use in this course | Limit |
| --- | --- | --- |
| [Nand to Tetris — Projects](https://www.nand2tetris.org/course), Nisan and Schocken | Logic, memory, and architecture progression for Lessons 1–2 | Its full build-a-computer projects exceed this beginner outline |
| [RFC 1122 — Requirements for Internet Hosts: Communication Layers](https://www.rfc-editor.org/rfc/rfc1122), Braden, 1989 | Layering, IP, TCP, and UDP foundations for Lessons 3–4 | Foundational standard, not a complete account of modern networking |
| [RFC 1034 — Domain Names: Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034), Mockapetris, 1987 | DNS concepts for Lesson 4 | Foundational concepts; advanced details and later extensions are outside scope |
| [Intelligence without representation](https://people.csail.mit.edu/brooks/papers/representation.pdf), Brooks, 1991 | Perception/action and behavior-based robotics for Lesson 5 | One influential approach, not a definition of all AI |
| [Reinforcement Learning: An Introduction, second edition](https://mitpress.ublish.com/book/reinforcement-learning-an-introduction-2), Sutton and Barto, 2018 | Reward-based learning framing for Lesson 6 | Introductory framing checked through the publisher; detailed algorithms are outside scope |
