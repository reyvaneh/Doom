> Markdown transcription of the supplied 22-page PDF. Filed with the Stage 1 project records; the source is a master plan spanning Stages 1–3. Dates, assessments, reflections and completion claims are reproduced from the source, not independently verified. The PDF is retained unchanged.

# Master Project Plan (Stages 1, 2 & 3)
Module: Hardware, Networks & Behaviorist AI | Team: Doom
## 1. Team Information and Responsibilities

| Role / Topic | Team Member | Student ID | Primary Responsibilities (Stages 1–3) | Pros and Cons (Self-Reflection) |
| --- | --- | --- | --- | --- |
| Team Lead & Submission Lead | Neville Reyvan | 1820262215 | Overall project coordination, milestone tracking, main point of contact, cross-resource consistency checks, and final submission packaging across Stages 1–3. | Neville Reyvan Pros:<br>• Strong Coordination & Supervision: Highly effective at managing a large, 7-person team, keeping everyone organized, and actively tracking daily progress.<br>• Driving Content Depth: Refuses to settle for basic, surface-level work; pushes teammates to dig deeper (e.g., moving past basic Arduinos to cover CPUs, NPUs, TPUs, and TOPS). Cons:<br>• Taking on Too Much (Micromanaging): Sometimes rewrites drafts directly (like rewriting complex AI pseudocode into simple beginner pseudocode) instead of coaching teammates to fix it.<br>• Review Bottlenecks: Checking everyone's work for depth takes massive time; needs to set clearer benchmarks upfront before drafting begins. |
| Hardware | Leoric Lius & Justin Liem | 1820262180 & 1820262176 | Zero-knowledge hardware prerequisites, physical component selection, circuit design, ADC & sensor/actuator walkthroughs, and hardware Study Guide/Test Bank/PPT/Video sections. | Justin Liem Pros:<br>• Responsible for completing assigned hardware documentation tasks.<br>• Willing to learn unfamiliar hardware concepts and ask questions when unclear.<br>• Careful about organizing the study guide, explaining components, and checking Markdown formatting.<br>• Open to feedback and willing to improve work quality. Cons:<br>• Still developing understanding of circuit design and component specifications, so some tasks take extra time.<br>• Needs more practical experience with hardware components and circuit testing.<br>• Sometimes needs guidance to troubleshoot technical problems and verify calculations.<br>• Needs to improve ability to check datasheets and technical info independently. Leoric Lius Pros:<br>• Completes assigned responsibilities on time.<br>• Checks work against the assignment brief (compared hardware content with Lexue Markdown V1.0 requirements and listed missing items).<br>• Coordinates well with teammates on Markdown additions. Cons:<br>• Limited practical experience testing physical circuits (Arduino sketches not yet run on a real board).<br>• Still learning Git (mostly uses GitHub Desktop; building confidence with command line).<br>• Needs to check primary sources like datasheets directly instead of relying on secondary summaries. |
| Project Log & QA | Devi Aurelia | 1820262183 | Documentation of each member's contribution and AI usage, cross-checking task completion, coordinating peer-learner testing, and compiling Personal Logs. | Devi Aurelia Pros:<br>• Responsible in completing tasks on time; met all assigned deadlines for project plan sections and requirements.<br>• Took ownership of work; ensured all entries were accurate and well-organized rather than rushed.<br>• Reliable for documentation; project log was ready in time for review.<br>• Followed up consistently on corrections. Cons:<br>• Still developing skills in navigating technical project tools beyond documentation tools.<br>• Perfectionism: Spending extra time polishing formats and wording caused some log sections to finish later than planned. |
| Networks | Quang Huy Đỗ & Carensia Chin | 1820262207 & 1820262177 | Beginner network analogies, protocol setup, Star vs. Mesh topologies, packet routing, wireless communications, local image asset management, and network Study Guide/PPT/Video materials. | Carensia Chin Pros: • Responsible and organized when completing assigned tasks.<br>• Willing to learn new technical concepts and improve problem-solving skills.<br>• Detail-oriented when preparing documentation and visual project materials. Cons:<br>• May need additional time to understand unfamiliar technical networking concepts.<br>• Still developing practical experience in network configuration and implementation.<br>• May need guidance when dealing with complex technical problems. Quang Huy Đỗ Pros:<br>• Clear technical comparisons on network arrangements and Star vs. Mesh topologies; reliable delivery of assigned tasks. Cons:<br>• Needs to ensure foundational definitions and everyday analogies precede complex routing concepts for absolute beginners. |
| Behaviorist AI / Software | James (Nothingness) & Devi Aurelia | 1820262284 & 1820262183 | Beginner "If–Then" rules, Sense–Act loops, Finite State Machines (FSM), Subsumption Architecture, reward-based learning comparisons, and interactive AI activities/test items. | James (Nothingness) Pros:<br>• Responsible and organized when completing assigned tasks.<br>• Willing to learn about AI behavior and reinforcement learning.<br>• Detail-oriented when preparing documentation, source maps, diagrams, and consistency checks. Cons:<br>• May need extra time to understand unfamiliar AI concepts.<br>• Still developing practical experience with RL training and implementation.<br>• May need guidance with complex algorithms and keeping early explanations strictly beginner-friendly. |

## 2. Stage 1 Feedback & Revision Action Plan
In response to Professor Zhao Fengnian's evaluation of Stage 1 (Project Plan:
17/20; Repository & Markdown V1.0: 28/30), Team Doom has established the
following concrete revisions for Stage 2 and Stage 3:

| Feedback Source | Issue Identified by Professor Zhao | Concrete Revision & Action Taken in Stage 2 | Responsible Owner(s) |
| --- | --- | --- | --- |
| Project Plan Feedback | "It's impossible for absolute beginners to make a real system without learning the basics first." | Restructured the learning sequence across all modules into a 4-Step Beginner Scaffolding Model: (1) Everyday Analogy & Prerequisite Basics → (2) Core Component/Concept → (3) Guided Simulation/Trace → (4) Conceptual System Connection. Removed expectations that beginners build complex physical systems from scratch without foundational walkthroughs. | Neville, Justin, Leoric,… |
| Project Plan Feedback | "The last few tables are quite confusing." | Redesigned the Workflow Schedule and Master Task List tables with clean, standardized date formats, non-duplicated Task IDs, and clear phase groupings for Stage 1, Stage 2, and Stage 3. | Neville, Devi |
| Project Plan Feedback | "You need also to plan for stage 2 and 3." | Added complete milestone schedules and granular task allocations for Stage 2 (Markdown V2.0, Study Guide & Test Bank, PPT Slides, Video Tutorials) and Stage 3 (Live Mini Lecture, Peer Reviews, Final Portfolio). | Neville |
| Repository Feedback | "There should be one pdf file capturing all the main content of the markdowns." | Added a mandatory compilation step (Task T-206) to merge the README and all module Markdown files into one unified, readable PDF document with a complete Table of Contents before submission. | Neville |
| Repository Feedback | "All images need to be local in the markdown folder." | Audited all .md files to eliminate external web image URLs; downloaded all figures into local /assets subdirectories within the repository and verified relative paths (Task T-205). | Carensia, Leoric, James |
| Repository Feedback | "The content coverage might be insufficient (refer to assignments from previous years)." | Expanded Markdown V2.0 to thoroughly cover all core prerequisites, step-by-step worked examples, misconception checks, and hands-on beginner activities with full answer keys across Hardware, Networks, and Behaviorist AI. | All Sub-Teams |

## 3. Learning Goals and Project Scope (Zero-to-One Beginner Guide)
Target Audience: Someone who knows nothing at all about hardware,
networking, or AI, and wants a clear, step-by-step guide to learn from scratch.
Core Philosophy & Project Scope
In Stage 1, our plan jumped too quickly toward building a complete physical
system. For Stage 2, we have redesigned our scope into a true Zero-to-One
Beginner Guide. We do not expect beginners to wire a complex robot or write
production code on day one. Instead, we guide someone who knows nothing
through four gradual stages of understanding within every topic:
- Level 1 — Everyday Analogy (Zero Prerequisite Knowledge): Connect
the new idea to something the learner already uses every day (e.g.,
comparing computer memory to a desk vs. a backpack, or network
packets to postal letters).
- Level 2 — Core Building Blocks (The Basics First): Explain the
fundamental terms clearly (bits and bytes, digital vs. analog signals and
ADC conversion, IP addresses and Star vs. Mesh topologies, simple
"If–Then" rules and Sense–Act loops).
- Level 3 — Guided Single-Step Practice: Let the learner try or observe
one focused procedure at a time (e.g., reading a single temperature
sensor value, tracing a single packet across a diagram, or stepping
through a 3-state Finite State Machine on paper).
- Level 4 — Seeing the Big Picture: Only after the basics are mastered do
we show how Hardware (sensors/processors/NPUs), Networks (data
transmission), and Behaviorist AI (reactive decision rules) work together
in a real-world smart device.
Module Learning Goals
Core Objectives (Established in Stage 1 & Expanded for Stage 2):
- Help absolute beginners explain how a computer processes information.
- Help beginners understand how devices exchange information across a
network.

- Explain how a simple artificial agent adapts and responds to its
environment.
- Achieve all of the above assuming zero prior knowledge of programming
or computer science concepts.
Specific Learner Outcomes Across the Module:
- Hardware Basics: Identify core computer components (CPU, RAM,
storage, input/output devices) and describe their roles; explain bits and
bytes and trace a simplified Fetch–Decode–Execute instruction cycle;
explain how sensors convert physical readings into digital values (ADC
conversion) to trigger actuators; and understand why modern AI uses
specialized chips (CPUs vs. NPUs/TPUs and TOPS).
- Network Basics: Sketch a simple home network and tell apart local
connectivity (LAN) from the internet (WAN); describe the basics of
packet data transmission and IP addressing at an introductory level; and
compare Star vs. Mesh topologies to diagnose basic connection failures.
- Behaviorist AI Basics: Trace an agent's reactive Sense–Act loop and
predict how simple "If–Then" behavior rules and Finite State Machines
(FSM) play out in a given situation; explain Rodney Brooks' Subsumption
Architecture (layered priorities like Avoid Obstacle overriding Wander);
and distinguish a fixed-rule controller from an agent that changes its
behavior through reward-based learning.
- System Synthesis: Bring it all together by connecting hardware,
networking, and behavior control in one annotated, beginner-friendly
system diagram.
## 4. How the Three Learning Resources Support One Another

| Component | Resource / Package Name | Focus Area | Implementation Notes (Stages 1–3) |
| --- | --- | --- | --- |
| Shared Markdown Content | https://github.com/reyvaneh/Doom & Doom_Stage2_Markdown_V2.zip | Core learning content of Hardware, Networks, and Behaviorist AI | Public GitHub repository organized by topic folders (hardware, network, ai-behavior) with local /assets images, worked examples, activities, and one unified Readable PDF. |
| Study Guide & Test Bank | Doom_Stage2_StudyGuide_TestBank_V1.zip | Self-study, hands-on practice, and self-checking | Interactive Study Guide with beginner challenges + separate Test Bank (min. 20 True/False, 20 Multiple Choice, 6 Open-Ended questions with explained answer keys). |
| PPT Slides | Doom_Stage2_PPT_V1.pptx | Visual classroom storytelling and concept explanation | High-contrast slides (28–32pt+ font) turning abstract concepts (topologies, ADC conversion, agent behavior) into clear diagrams, audience checks, and Presenter Notes. |
| Video Tutorials | Doom_Video01...mp4 & Doom_Stage2_VideoGuide.pdf | Narrated step-by-step demonstrations | 1–8 focused MP4 videos (strictly <= 250 MB each) demonstrating concrete procedures (wiring, uploading, reading sensor values, tracing agent states) with scripts and timestamps. |
| Live Mini Lecture | Stage 3 Live Classroom Deliverable | Synthesis and live classroom interaction | Combines slide diagrams, video demonstrations, and Study Guide audience activities around one focused question from the topic menu. |

The resources are designed as a collaboration system built on the same
content:
- Shared Markdown Content (The Foundation): Holds the full
explanations, examples, activities, and references. Everything else is
derived from it, so the key points remain consistent.
- Study Guide and Test Bank (Study & Practice): Condenses the
Markdown into study material and gives learners a way to practise and
verify their understanding with explained answers (including at least 20
True/False, 20 Multiple Choice, and 6 Open-Ended questions). Learners
who struggle can return to the Markdown for more depth on the topic.
- PPT Slides (Visual Explanation): Gives the learners a visual explanation
for a large classroom. It turns the key ideas from the Markdown file into
diagrams and worked examples, making more abstract or complicated
concepts—like topologies, ADC conversion, and agent behavior—easier
to grasp or digest at a glance.
- Video Tutorials (Demonstration): Built for demonstration (1–8 MP4 files,
strictly <= 250 MB each). They show the procedures the Markdown
describes (wiring, uploading, reading sensor values, tracing agent
states) being performed so explanations are clearer to learners.
- Live Mini Lecture (Synthesis & Interaction — Stage 3): Takes one
manageable question and combines all of the above in a live setting,
using visuals like diagrams from the slides, demonstrating what the
videos show, and drawing on the Study Guide's activity for audience
participation.
Summary of How Learners Use the System:
Markdown provides the content, the Study Guide makes it studyable, Slides
make it visual, Videos make it demonstrable, and the Mini Lecture brings it all
together in one interactive session. Learners can move between them
depending on whether they need more depth (Markdown), practice (Study
Guide), a visual overview (Slides), a demonstration (Videos), or a guided
walkthrough (Mini Lecture).

## 5. Multi-Stage Roadmap & Milestone Schedule
(Note: Official instructions issued so far cover Stage 1 and Stage 2. Stage 3
milestones are included as forward planning per Professor Zhao's feedback
and will be updated when Stage 3 specifications are released.)

| Stage | Phase | Milestone Description | Target Date | Status |
| --- | --- | --- | --- | --- |
| Stage 1 | Phase 1.1 | Team formation, role allocation, and GitHub repository initialization | Oct 16, 2026 | Completed |
| Stage 1 | Phase 1.2 | Initial Project Plan, Master Task List, and Markdown V1.0 drafting | Oct 22, 2026 | Completed |
| Stage 1 | Phase 1.3 | Stage 1 Submission (Markdown V1.0, Project Plan, Combined Personal Logs) | Oct 24, 2026 | Completed |
| Stage 1 | Phase 1.4 | Stage 1 Status Report & Teacher Feedback Review | Oct 30, 2026 | Completed |
| Stage 2 | Phase 2.1 | Feedback Revision & Beginner Scaffolding: Rewrite Markdown V2.0 so basics come first; localize all images into repository folders | Oct 31, 2026 | In Progress |
| Stage 2 | Phase 2.2 | Cross-Member Peer Testing: Non-authors test Markdown V2.0 explanations and activities as beginners and log results | Nov 2, 2026 | Planned |
| Stage 2 | Phase 2.3 | Study Guide & Test Bank V1.0: Draft interactive beginner activities, curated resource guides, and 46+ verified test bank questions | Nov 4, 2026 | Planned |
| Stage 2 | Phase 2.4 | PPT Slides & Video Tutorials V1.0: Design visual classroom slides (topologies, ADC, agent behavior) and record/compress demonstration videos (wiring, uploading, reading sensors; <=250 MB) | Nov 5, 2026 | Planned |
| Stage 2 | Phase 2.5 | Unified PDF Compilation & Quality Check: Render single combined Markdown PDF; verify consistency across all deliverables; compile Stage 2 Personal Logs | Nov 6, 2026 | Planned |
| Stage 2 | Phase 2.6 | Official Stage 2 Submission Deadline (All Stage 2 packages uploaded before 23:59) | Nov 7, 2026 | Planned |
| Stage 3 | Phase 3.1 | Future Planning — Live Mini Lecture Preparation: Select one manageable question combining Slide diagrams, Video demos, and Study Guide audience activities | Mid-Nov 2026 | Planned (Future) |
| Stage 3 | Phase 3.2 | Future Planning — Final Refinements & Delivery: Incorporate Stage 2 feedback, deliver Live Mini Lecture, and submit final logs | Late Nov 2026 | Planned (Future) |

## 6. Master Task List
### 6A. Completed Stage 1 Tasks (Summary)

| Task ID | Deliverable Area | Task Description | Owner | Priority | Target Date | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-101 | Hardware V1.0 | Define hardware BOM (sensors, microcontrollers, power supply) | Justin Liem | High | Oct 22, 2026 | Finished |
| T-102 | Networks V1.0 | Network Topologies: Explain how devices are arranged; compare Star (central hub, common at home) vs. Mesh (interconnected, highly reliable, used by the internet) | Quang Huy Đỗ | Medium | Oct 22, 2026 | Finished |
| T-103 | Project Management | Supervise the team project, draft the Stage 1 Project Plan, and explain the project landscape and workflow | Neville Reyvan | High | Oct 23, 2026 | Finished |
| T-104 | Repository Setup | Set up shared GitHub code repository (Doom), folder structure, and project board | Neville Reyvan | Medium | Oct 16, 2026 | Finished |
| T-105 | Stage 1 Submission | Compile all 7 members' Stage 1 Personal Logs into one file and package the GitHub repository snapshot into the submission ZIP | Neville Reyvan | High | Oct 24, 2026 | Finished |
| T-106 | Quality Supervision | Review team drafts to ensure material is sufficient, has meaningful technical depth (e.g., NPU/TPU/TOPS), and includes real-world scenarios | Neville Reyvan | Medium | Oct 23, 2026 | Finished |
| T-107 | Hardware V1.0 | Develop the hardware module outline, learning outcomes, prerequisites, and topic sequence | Justin Liem | High | Oct 22, 2026 | Finished |
| T-108 | Hardware V1.0 | Write hardware fundamentals and physical component selection content | Justin Liem | High | Oct 22, 2026 | Finished |
| T-109 | Hardware V1.0 | Explain sensor and actuator integration using an automatic fan example | Justin Liem | Medium | Oct 22, 2026 | Finished |
| T-110 | Networks V1.0 | Develop the network module outline, learning objectives, and topic sequence | Carensia Chin | High | Oct 22, 2026 | Finished |
| T-111 | Networks V1.0 | Write network fundamentals content covering network types, devices, addressing, data transmission, and protocols | Carensia Chin | High | Oct 22, 2026 | Finished |
| T-112 | Networks V1.0 | Add visual learning materials, including network images and a data transmission diagram | Carensia Chin | Medium | Oct 22, 2026 | Finished |
| T-113 | Networks V1.0 | Format and preview the network learning material in Markdown using VS Code | Carensia Chin | Medium | Oct 22, 2026 | Finished |
| T-114 | Networks V1.0 | Prepare the network module files for submission to the shared GitHub repository | Carensia Chin | Medium | Oct 22, 2026 | Finished |
| T-115 | Behaviorist AI V1.0 | Coordinate branch cleanup and shared student-log templates with Codex | James (Nothingness) | High | Oct 22, 2026 | Finished |
| T-116 | Behaviorist AI V1.0 | Prepare the AI-assisted beginner chapter, source map, diagrams, examples, and answered questions; refine wording for clarity | James (Nothingness) | Critical | Oct 22, 2026 | Finished |
| T-117 | Behaviorist AI V1.0 | Run consistency checks and push revised material and lecturer file to origin/ai-behavior (e261eec) | James (Nothingness) | High | Oct 22, 2026 | Finished |
| T-118 | Project Log & QA | Cross-check Project Log against the Master Task List; confirm all members are represented and all finished tasks are logged | Devi Aurelia | Medium | Oct 23, 2026 | Finished |
| T-119 | Project Log & QA | Finalize Stage 1 Project Log with all entries, summaries, and unresolved items noted | Devi Aurelia | Medium | Oct 23, 2026 | Finished |
| T-120 | Hardware V1.0 | Update README.md team details and sync with main branch | Leoric Lius | Medium | Oct 16, 2026 | Finished |
| T-121 | Hardware V1.0 | Reorganize hardware content into hardware/hardware.md V1.1 with research notes and source report | Leoric Lius | High | Oct 22, 2026 | Finished |
| T-122 | Hardware V1.0 | Merge module status table into the hardware unit | Leoric Lius | Medium | Oct 22, 2026 | Finished |
| T-123 | Hardware V1.0 | Write Arduino sketches and beginner lab-skills page | Leoric Lius | High | Oct 23, 2026 | Finished |
| T-124 | Hardware V1.0 | Research and add hexadecimal, buses/clock, Harvard vs. von Neumann, and Part C (serial buses, capacitors, datasheets, e-waste) | Leoric Lius | High | Oct 23, 2026 | Finished |

### 6B. Active Stage 2 Tasks (Oct 25 – Nov 7, 2026)

| Task ID | Deliverable Area | Task Description (Incorporating Stage 1 Feedback) | Owner | Priority | Internal Deadline | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-201 | Project Management | Revise Master Project Plan to address Prof. Zhao's feedback (Zero-to-One beginner scaffolding, resource integration, clean tables, Stage 2 & future Stage 3 plan) | Neville Reyvan | Critical | Oct 28, 2026 | Finished |
| T-202 | Markdown V2.0 (Hardware) | Add zero-knowledge beginner prerequisites (bits/bytes, binary, basic CPU/RAM roles, ADC conversion basics) *before* microcontrollers & AI hardware (NPU/TPU/TOPS) | Justin Liem & Leoric Lius | Critical | Oct 31, 2026 | In Progress |
| T-203 | Markdown V2.0 (Networks) | Expand beginner prerequisites (postal analogy for packets, LAN vs. WAN) and step-by-step Star vs. Mesh comparison and troubleshooting activity | Quang Huy Đỗ & Carensia Chin | Critical | Oct 31, 2026 | In Progress |
| T-204 | Markdown V2.0 (Behaviorist AI) | Add foundational "If–Then" rule basics before Sense–Act loops, FSMs, and Subsumption Architecture; ensure pseudocode requires zero prior coding knowledge | James (Nothingness) | Critical | Oct 31, 2026 | In Progress |
| T-205 | Markdown V2.0 (Assets) | Feedback Fix: Download all external images into local repository folders (/assets) and verify all relative Markdown image links work offline | Carensia Chin & Leoric Lius | High | Nov 1, 2026 | Planned |
| T-206 | Markdown V2.0 (PDF & Report) | Feedback Fix: Compile all .md files into one unified, readable PDF; write Stage 2 Revision Summary & Resource Mapping Report | Neville Reyvan | Critical | Nov 6, 2026 | Planned |
| T-207 | Peer Review & Testing | Cross-test Markdown V2.0 & Study Guide activities as beginners (Hardware tests AI; AI tests Networks; Networks tests Hardware) and record evidence in logs | Devi Aurelia (Coordinator) & All | High | Nov 2, 2026 | Planned |
| T-208 | Study Guide V1.0 | Condense Markdown V2.0 into an engaging beginner Study Guide; structure hands-on practice activities (Goal, Prep, Task, Observation, Reflection, Feedback) and curated videos | Justin Liem & James | High | Nov 4, 2026 | Planned |
| T-209 | Test Bank V1.0 | Create balanced Test Bank (min. 20 True/False, 20 Multiple Choice, 6 Open-Ended questions + explained Answer Key) so learners can verify understanding | Leoric Lius, Carensia Chin & Devi Aurelia | High | Nov 4, 2026 | Planned |
| T-210 | PPT Slides V1.0 | Design large-classroom visual PPT slides (28–32pt+ font) turning abstract Markdown concepts (topologies, ADC conversion, agent behavior) into clear diagrams & worked examples with Presenter Notes | Quang Huy Đỗ & Carensia Chin | High | Nov 5, 2026 | Planned |
| T-211 | Video Tutorials V1.0 | Record, edit, and compress MP4 demonstration tutorials (<= 250 MB each) showing concrete procedures (wiring, uploading, reading sensor values, agent tracing) + write Doom_Stage2_VideoGuide.pdf | Leoric Lius, James & Neville Reyvan | High | Nov 5, 2026 | Planned |
| T-212 | Personal & Project Logs | Maintain Stage 2 Project Log; collect and format all 7 members' Stage 2 Personal Logs (Oct 25–Nov 7) into Doom_Stage2_PersonalLogs with TOC | Devi Aurelia & Neville Reyvan | Critical | Nov 6, 2026 | Planned |

### 6C. Future Stage 3 Roadmap (High-Level Forward Plan)

| Task ID | Deliverable Area | Task Description | Owner | Priority | Target Window | Status |
| --- | --- | --- | --- | --- | --- | --- |
| T-301 | Mini Lecture Design | Select one manageable question from the topic menu; design the live classroom synthesis combining Slide diagrams, Video demo, and Study Guide audience activity | Neville Reyvan & Quang Huy Đỗ | High | Mid-Nov 2026 (Stage 3) | Planned |
| T-302 | Resource Refinement (V2.0) | Revise Markdown, Study Guide, Test Bank, PPT, and Videos based on Stage 2 teacher and peer feedback | Justin Liem, Leoric Lius, Carensia Chin & James | High | Mid-Nov 2026 (Stage 3) | Planned |
| T-303 | Live Rehearsal & Delivery | Rehearse mini lecture timing, transitions, and audience participation; deliver live session in class | All Team Members | Critical | Late Nov 2026 (Stage 3) | Planned |
| T-304 | Final Stage 3 Portfolio & Logs | Compile final Stage 3 Personal Logs, Project Log, and updated learning system portfolio for final submission | Devi Aurelia & Neville Reyvan | Critical | Late Nov 2026 (Stage 3) | Planned |
