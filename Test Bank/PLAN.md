# Stage 2 Test Bank Plan

**Team:** Doom<br>
**Module:** Hardware, Networks & Behaviorist AI<br>
**Audience:** Absolute beginners<br>
**Planning date:** 30 October 2026<br>
**Status:** Implemented as a version 1.0 draft following the user's instruction to keep questions simple; teammate review and final Study Guide mapping remain pending

## 1. Purpose and assignment requirements

The bank should help learners review the Study Guide, apply its ideas and discover misunderstandings. It is a collection for practice and assessment, not a requirement to answer all questions in one timed sitting.

The [Lexue Study Guide and Test Bank assignment](https://lexue.bit.edu.cn/mod/assign/view.php?id=544501), read on 30 October 2026, requires:

- At least **20 true/false**, **20 multiple-choice** and **6 open-ended** questions across the module.
- Meaningful coverage of the core concepts actually taught in the guide.
- Consistent question numbering and a topic or corresponding guide section for each question.
- Questions first, followed by a clearly labeled answer key.
- True/false answers with brief explanations and corrections of false statements.
- Multiple-choice answers with reasoning; instructions must state whether one or multiple choices are correct.
- Open-ended sample answers or expected key points, allowing valid alternatives. Responses should normally involve more than 100 words or equivalent reasoning through diagrams, calculations or worked steps.
- Some questions connected to learning activities, with enough information to answer without opening an external platform.
- Another team member attempting and reviewing every question, plus testing of selected activities by someone other than their author.
- A **separate editable Word test-bank document**, submitted with the Study Guide in one ZIP. A PDF is optional.

The topic split below, question IDs, four-option MCQ format and workflow are our implementation choices, not extra lecturer requirements.

## 2. Coverage: 46 questions

| Topic | True/false | Multiple-choice | Open-ended | Total |
| --- | --- | --- | --- | --- |
| Hardware | 7 | 7 | 2 | 16 |
| Networks | 7 | 7 | 2 | 16 |
| AI Behaviour | 6 | 6 | 2 | 14 |
| **Total** | **20** | **20** | **6** | **46** |

Keep all three units substantial. Hardware's longer source chapter should not crowd out Networks or AI. The two-question difference keeps the bank at the minimum while maintaining a similar allocation across topics.

### Difficulty and teaching approach

- Use familiar situations: unsaved work, a room light sensor, a home network, and a cleaning robot.
- Keep true/false and multiple-choice questions easy to read, with one clear decision per question.
- Make learners predict, trace, compare or explain; do not rely entirely on memorized definitions.
- Keep AI questions mainly about simple rules, observations, modes and learning from experience. Detailed Q-learning arithmetic is outside this proposed introductory bank.
- Keep Hardware arithmetic simple. Supply any needed formula, units, circuit orientation and values; do not require an actual electronics kit.
- Open-ended questions should be accessible through several guided parts, while still requiring developed reasoning. A diagram or trace can provide equivalent evidence to a long paragraph.
- Avoid trick wording, double negatives, obscure product specifications and unsupported claims about real devices.
- User direction on 30 October: simple questions covering the material, without complex or deep assessment. The implementation uses basic definitions, short rule traces and familiar situations. It includes no Q-learning arithmetic, circuit calculations or detailed protocol configuration.

The five existing AI chapter questions are reusable source material, not the whole-module bank. Adapt selected questions where useful, give them bank IDs and review them with the new questions.

## 3. Content blueprint

Each row maps a question to its learning target. Full wording is in [Questions.md](Questions.md). TF = true/false; MC = multiple-choice; OE = open-ended. Every multiple-choice question uses four options with one correct answer.

### Hardware

Source: [Hardware](../Learning%20Materials/Hardware/hardware.md) and [Beginner Lab Skills](../Learning%20Materials/Hardware/beginner-lab-skills.md).

| ID | Planned concept or task | Source section |
| --- | --- | --- |
| TF01 | Distinguish volatile RAM from persistent storage | A1-A2 |
| TF02 | Relate bits to bytes | A3 |
| TF03 | Recognize that the CPU follows instructions | A5 |
| TF04 | Distinguish sensor input from actuator output | B1, B12 |
| TF05 | Distinguish analog voltage from its ADC reading | B6-B7 |
| TF06 | Recognize why an LED circuit needs current limiting | B8 |
| TF07 | Recognize that a heavy load can require a driver | B9 |
| MC01 | Select the computer component responsible for a stated job | A1-A2 |
| MC02 | Read a small binary representation with place values supplied | A3 |
| MC03 | Predict a simple logic-gate output from supplied inputs | A4 |
| MC04 | Identify what happens during the fetch step | A5 |
| MC05 | Choose an appropriate sensor/controller/output combination | A6, B1, B5 |
| MC06 | Predict how a change in the specified LDR divider affects its reading | B6-B7 |
| MC07 | Choose a useful first check for an LED or sensor fault | B4, B15 |
| OE01 | Follow a supplied photo/file scenario through storage, RAM, CPU and output; explain an unsaved-work outcome | A1-A2, A5 |
| OE02 | Trace a described automatic-light system and three readings; explain the component roles, apply the supplied threshold, then suggest a fault and a safe check | B6-B8, B11-B15 |

### Networks

Source: [Network Fundamentals](../Learning%20Materials/Network/network_fundamentals.md) and [Beginner Prerequisites](../Learning%20Materials/Network/beginner-prerequisites.md).

| ID | Planned concept or task | Source section |
| --- | --- | --- |
| TF08 | Distinguish local connectivity from Internet connectivity | Fundamentals 01-02 |
| TF09 | Distinguish connection method from network scope | Fundamentals 02; prerequisites LAN/WAN |
| TF10 | Distinguish switch and router roles | Fundamentals 04 |
| TF11 | Distinguish DNS lookup from delivering webpage contents | Fundamentals 06-07 |
| TF12 | Recognize that IP and MAC addresses have different roles | Fundamentals 05 |
| TF13 | Recognize UDP's lack of built-in delivery/ordering guarantees | Fundamentals 07; prerequisites packets |
| TF14 | Distinguish bandwidth from latency using an everyday scenario | Fundamentals 13 |
| MC08 | Identify a LAN from a short scenario | Fundamentals 02 |
| MC09 | Recognize the effect of a central-switch failure in a described star | Fundamentals 03 |
| MC10 | Identify an alternate route from three listed links | Fundamentals 03 |
| MC11 | Choose the device needed to connect two IP networks | Fundamentals 04 |
| MC12 | Put a simplified website request journey in order | Fundamentals 06 |
| MC13 | Identify DHCP's address-configuration role | Fundamentals 12 |
| MC14 | Choose a proportionate network-security action | Fundamentals 08, 14 |
| OE03 | Describe a simple website request using a supplied home-network scenario | Fundamentals 04-07 |
| OE04 | Compare failures in described star and mesh networks using listed links | Fundamentals 03 and its troubleshooting activity |

### AI Behaviour

Source: [AI Behaviour](../Learning%20Materials/AIBehaviour/AIBehaviour.md) and its [References](../Learning%20Materials/AIBehaviour/References.md).

| ID | Planned concept or task | Source section |
| --- | --- | --- |
| TF15 | Distinguish a sensor observation from an action | 2. Agents |
| TF16 | Recognize that a fixed rule can produce an apparently intelligent response | 2. Agents; 3. Rules |
| TF17 | Recognize that switching a programmed mode is not proof of learning | 3. Rules |
| TF18 | Recognize that a score alone does not provide a learning mechanism | 4. Learning |
| TF19 | Distinguish exploration from exploitation | 4. Learning |
| TF20 | Recognize that simulation success does not prove real-world success | Training and use; 9. Limits |
| MC15 | Identify the agent and environment in an everyday example | 2. Agents |
| MC16 | Trace one observation-choice-action cycle | Follow one decision |
| MC17 | Resolve competing conditions using supplied rule priorities | 3. Rules |
| MC18 | Select a mode transition from a supplied starting mode and conditions | 3. Rules |
| MC19 | Identify what changes when experience updates action estimates | 4. Learning |
| MC20 | Identify a limitation of the supplied reward or observation design | 5. Decision problems; 9. Limits |
| OE05 | Trace several robot decisions using supplied rules, battery readings and dirt observations; explain what changes if rule order changes | 2. Agents; 3. Rules |
| OE06 | Compare fixed-rule and learning controllers in a supplied scenario; identify what changes with experience and what evidence would support improvement | 3. Rules; 4. Learning; What would count as evidence? |

## 4. What each question record contains

Keep these authoring fields for each question:

| Field | Required content |
| --- | --- |
| ID and type | Stable ID from the blueprint, such as MC17 |
| Topic and learning outcome | The specific understanding being checked |
| Source | Markdown filename/section; later add the actual Study Guide section |
| Prompt | A complete task with all necessary values, rules, diagrams and assumptions |
| Response format | True/false, choose one of A-D, or open-ended instructions |
| Options | MCQs only; plausible alternatives based on beginner misunderstandings |
| Answer and explanation | Correct response and why it follows from the supplied information |
| Open-ended guidance | Sample answer or key points; accept equivalent correct reasoning |
| Activity connection | Where relevant, the exact activity and its self-contained scenario |
| Author/reviewer/status | Actual contributors and findings, recorded as work happens |

Do not label review as complete until another member has attempted the item. Source mapping and reviewer metadata stay in the authoring/review records; the learner document needs only the topic or guide-section labels that help learning.

## 5. Document and folder structure

Current files:

```text
Test Bank/
  README.md
  PLAN.md
  Questions.md
  AnswerKey.md
  Review.md
  bank.json
  tools/build_test_bank.py
  Doom_Stage2_TestBank_V1.docx
```

The scenarios are supplied in text, so the current bank needs no image assets or external platform. A supplementary PDF can be produced later if wanted.

The Word document contains:

1. Title, team, module, version and brief instructions.
2. Part A: 20 true/false questions, grouped by topic.
3. Part B: 20 multiple-choice questions, grouped by topic, with explicit selection instructions.
4. Part C: 6 open-ended questions, grouped by topic, with clear expectations for developed reasoning.
5. A page break and clearly labeled answer key, covering all 46 IDs with explanations.

Keep answers out of the question sections. Put diagrams and supplied data beside their questions. Include a brief source list and useful Study Guide references without requiring learners to follow external links to answer.

## 6. Drafting and review sequence

| Step | Work | Completion evidence |
| --- | --- | --- |
| 1 | Agree the coverage, difficulty and split above | Accepted plan or documented adjustments |
| 2 | Check the relevant source explanations and Study Guide activities | Clear sources and a list of corrections needed before assessment |
| 3 | Draft questions and answers together | Every ID has a complete prompt and checked reasoning |
| 4 | Review across members | A non-author attempts every question; record answer, ambiguity, source check and resulting change |
| 5 | Try selected scenarios with a beginner/non-author | Record confusing instructions and whether the learner can explain the idea |
| 6 | Reconcile source, guide and bank | Correct every affected explanation or answer; add final guide-section mappings |
| 7 | Produce the Word document | Questions first, explained key later; readable diagrams, tables and page breaks |
| 8 | Check the submitted copy and package | Correct counts, working local assets, editable Word file and successful ZIP extraction |

The master plan's T-209 names **Leoric Lius, Carensia Chin and Devi Aurelia** for test-bank work, with an internal target of **4 November 2026**. This blueprint does not reassign their responsibilities. Confirm the section authors and non-author reviewers with the team. The assignment's written deadline is **7 November 2026, 23:59 Beijing time**.

Record significant AI assistance, verification and decisions in the actual project and personal logs, with evidence beside the relevant entry. This plan is not a substitute for those records.

## 7. Review checks before release

- Count 20 TF, 20 MC and 6 OE items; check for duplicate or missing IDs and matching answer-key entries.
- Verify every assessed concept is taught in the submitted Study Guide. Remove or postpone unsupported questions rather than testing future content.
- Check that each MCQ has exactly one defensible correct choice and that incorrect options are not also valid under a reasonable interpretation.
- For each false statement, explain a corrected version. Avoid absolute wording that creates an unintended exception.
- Verify rule traces, mode transitions, circuit orientation, supplied arithmetic and all answers independently.
- Distinguish TCP guarantees from UDP; distinguish latency from round-trip time when a question uses measurements.
- Do not imply a mesh always survives a failure or that a VPN guarantees anonymity. State topology, available paths and assumptions.
- Do not equate a programmed state change with learning, or an ordered rule list with the full subsumption architecture.
- Check that open-ended items need developed reasoning, allow valid alternatives and can be answered using the supplied scenario.
- Check local diagrams, guide references and offline usability from the extracted submission package.
- Record real review findings and corrections. The draft and Word export exist; local checks do not replace teammate review or a learner trial. See [Review.md](Review.md) for the current status.
