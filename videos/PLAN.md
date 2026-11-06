# Video Production Plan: Team DOOM Stage 2 Tutorials

Three videos built from the sorted voiceovers in `voiceover/` (see [README.md](README.md)). Timings below come from the Whisper transcripts in `transcripts/` and are measured against each finished video's timeline.

| Video | Output file | Length | Voiceover parts |
|---|---|---|---|
| 01 | `DOOM_Video01_Hardware_Foundations.mp4` | 6:53 | 6 |
| 02 | `DOOM_Video02_Network_Communication.mp4` | 6:30 | 6 |
| 03 | `DOOM_Video03_Behaviorist_AI.mp4` | 8:26 | 7 |

---

## 1. Approach: explainer graphics first, a few AI clips

The style follows a tech-explainer look (clean 3D renders, labelled diagrams, one colour per concept) with **narration-driven text**: whatever the narrator says appears on screen at that word, and terms **morph** into their short form ("RANDOM ACCESS MEMORY" → "RAM", "bit.edu.cn" → "192.0.2.10").

| Layer | Used for | How it's made |
|---|---|---|
| **Diagrams & text** | Labels, cards, loops, stacks, tables, quiz cards, simulators | HTML scenes rendered frame by frame in headless Chrome (`tools/video_kit`) |
| **3D** | The 2 AM desk, the circuit board, the Doom guardians and the Professor | Three.js (`explainer3d.js`, the study guide's `scene.js`) |
| **AI footage** | Analogies a diagram can't sell (kitchen, freezer, highway, insect, cat vs robot vacuum…) | 21 Seedance 2.0 mini clips, 5–6 s each, played under the graphics |

**Live demos** ("click Sever Primary Link", "Train 50 Episodes") are rebuilt as animations that "click" on the exact word: the packet tracer, the Fetch-Decode-Execute registers, the hysteresis trace table and the 4×4 Q-learning grid.

**Captions** are not burned in; the morphing on-screen text carries the key terms.

**Audio:** your voiceover at full volume; `study.mp3` underneath at about −19 dB, ducking under the voice; light UI sound effects (type, morph, pop, whoosh) generated from the same beats as the visuals.

## 2. Look and style

- **One colour per concept, the same in all three videos:** storage `#3b9dff` blue, memory/RAM `#ffb020` amber, CPU `#2fd47a` green, power `#ffe14a` yellow, network `#2ee6c8` teal, AI `#b48cff` violet, lost/error `#ff4d5e` red.
- **Text tracks:** every heading and tag is a track of states anchored to narrator words (`K.W('word', nth)` in the storyboards). Shared letters fly to their new place, unneeded letters fade out, new letters sharpen in. Acronym-aware matching makes "SUPREME ALLIED COMMANDER EUROPE" → "SACEUR" work.
- **Styles:** big white labels (Nunito, SIL OFL), white tag boxes at the bottom, monospace data for numbers and registers, rounded icon cards that glow while the narrator talks about them.
- **Flow:** every shot drifts (slow push and sway), cards spring in, shots cross-fade, 2× motion blur. The only hard cut is the 2 AM power cut.
- **Unit titles:** each unit opens on its Doom guardian under a ring light (Forge Golem, the networks guardian, the AI guardian); Video 03 ends on the Professor.
- **AI clip style suffix:** *"clean bright cinematic 3D render look, crisp detail, soft studio lighting, one smooth continuous camera move, no cuts, no text, no logos, no watermark, no people"*.
- **Output:** 1920×1080, 30 fps, H.264 CRF 21 (max 4 Mb/s), AAC 160 kb/s; well under 250 MB per video.

---

## 3. Shot lists

These were the first shot lists. The final beat-by-beat version, anchored to narrator words, is in `storyboards/01_hardware.js`, `02_networks.js` and `03_behaviorist_ai.js`.

AI = Seedance clip · MG = motion graphic · AI+MG = graphic over footage

### Video 01: Hardware Foundations (6:53)

**01 · Opening hook** `00:00–00:47`
| Time | Narration beat | Shot |
|---|---|---|
| 00:00–00:05 | "Imagine it is 2 AM… typing a report" | AI: dark bedroom desk at night, laptop screen glowing on a tired typist's hands. MG: "2:00 AM" clock corner |
| 00:05–00:07 | "the power cuts out" | AI: room lights and screen snap to black. MG: glitch + battery-dead icon |
| 00:07–00:15 | old files survive, typing vanishes | MG: desktop file icons stay lit while the open document dissolves; "3 hours: gone" |
| 00:15–00:20 | "Why did the old files survive…?" | MG: question card |
| 00:20–00:23 | "Welcome to Unit A" | MG: title card, *Team DOOM · Unit A · Hardware Foundations* (under 4 s) |
| 00:23–00:31 | "automated foundries… not magic boxes" | AI: vast dark automated factory, robot arms, sparks, green glow |
| 00:31–00:47 | three learning promises | AI+MG: slow macro pan over a circuit board; three goal chips appear on cue: *Memory ↔ CPU*, *0s & 1s*, *Sensors & circuits* |

**02 · The 4 pillars & the kitchen** `00:47–02:24`
| Time | Narration beat | Shot |
|---|---|---|
| 00:47–00:52 | "phone to a robot vacuum" | AI: robot vacuum gliding across a dark floor |
| 00:52–01:19 | Input → Processing → Storage → Output | MG: 4-box loop builds box by box on each word (Input 00:52, Processing 00:58, Storage 01:05, Output 01:10), with a pulse travelling round the loop |
| 01:19–01:29 | "two very different places… RAM and storage" | MG: split screen, RAM vs Storage |
| 01:29–01:34 | "CPU is the head chef" | AI: chef working fast in a dim professional kitchen. MG label: *CPU* |
| 01:34–01:45 | SSD = walk-in freezer | AI: heavy freezer door swings open, frost pours out. MG label: *SSD storage* |
| 01:45–02:01 | RAM = prep counter, copying | AI: knife chopping vegetables on a steel counter. MG: arrow freezer → counter, *RAM* |
| 02:01–02:07 | thousands of times faster | MG: speed bars RAM vs SSD |
| 02:07–02:24 | volatile, power cut wipes the counter | AI: kitchen lights flicker out over the counter. MG: *VOLATILE* stamp, then "Save" arrow counter → freezer |

**03 · Binary, logic gates & Fetch-Decode-Execute** `02:24–03:48`
| Time | Narration beat | Shot |
|---|---|---|
| 02:24–02:32 | bits: tiny switches | AI: extreme macro of a silicon chip, light pulses racing along traces |
| 02:32–02:40 | 8 bits = 1 byte, 0–255 | MG: 8 switches flip; byte counter climbs to 255 |
| 02:40–02:54 | AND / OR / NOT | MG: three gates with animated inputs and outputs |
| 02:54–03:40 | FDE simulator demo | MG: rebuilt stepper (PC, IR, ACC, RAM table). Fetch at 03:07, Decode at 03:15, Execute about 03:28, ACC 14 → 42 |
| 03:40–03:48 | "billions of times every second" | AI: CPU die glowing with a rhythmic pulse, camera pulls back |

**04 · Sensors, circuits & the night-light** `03:48–04:56`
| Time | Narration beat | Shot |
|---|---|---|
| 03:48–03:56 | street lamp or a robot | AI: street lamp blinking on at dusk |
| 03:56–04:07 | sensors, actuators, breadboard | AI: top-down breadboard with LEDs and jumper wires. MG labels: *sensor in*, *actuator out* |
| 04:07–04:33 | LDR → threshold 30% → LED | MG: circuit diagram animates left to right; light slider drops, LED turns on |
| 04:33–04:47 | polarity | AI: macro of an LED's legs. MG: long leg (+), short leg (−) |
| 04:47–04:56 | series resistor | MG: resistor slides into the circuit; current meter drops into the safe zone |

**05 · Pause & predict: hysteresis** `04:56–06:05`
| Time | Narration beat | Shot |
|---|---|---|
| 04:56–05:09 | dusk, cloud flicker 450 / 280 / 305 | AI: time-lapse clouds drifting over a street lamp at dusk. MG: live sensor readout |
| 05:09–05:31 | Rule A vs Rule B | MG: *PAUSE & PREDICT* card with trace table, all "?" |
| 05:31–05:37 | "Pause the video" | MG: 10-second ring timer (the audio pause is about 5 s, so the card holds) |
| 05:37–05:58 | reveal | MG: Rule A row flickers OFF→ON→OFF with a strobing lamp; Rule B row stays ON |
| 05:58–06:05 | Ch 9 · MC06 | MG: resource chip |

**06 · Interfaces & bridge** `06:05–06:53`
| Time | Narration beat | Shot |
|---|---|---|
| 06:05–06:12 | connecting chips | AI: macro dolly across a green PCB with chips and fine traces |
| 06:12–06:28 | GPIO / I2C / SPI / UART | MG: 4 cards appear on each word, each with a wire diagram |
| 06:28–06:40 | datasheet, e-waste | AI: pile of discarded circuit boards in dim light. MG: "Check voltage limits first" |
| 06:40–06:53 | devices across the planet → Video 02 | AI: Earth at night from orbit, light paths linking cities. MG: *Next: Video 02 · Networks* |

### Video 02: Network Communication (6:30)

**01 · Opening hook** `00:00–00:44`
| Time | Narration beat | Shot |
|---|---|---|
| 00:00–00:11 | photo to a friend, no private wire | AI: phone on a desk with a glowing photo being sent, then cut to city lights at night. MG: "Send" tap ripple |
| 00:11–00:21 | fibre cable breaks mid-download | AI: undersea fibre cable on the ocean floor, glowing pulses, sparks as it snaps. MG: download bar keeps going |
| 00:21–00:23 | "How does the internet pull that off?" | MG: question card |
| 00:23–00:26 | Unit B | MG: title card |
| 00:26–00:44 | learning promises | AI+MG: slow orbit over a glowing network globe; four goal chips: *LAN/WAN*, *IP & DNS*, *Packet switching*, *TCP · UDP · HTTPS* |

**02 · LAN, switches, routers, IP & DNS** `00:44–01:57`
| Time | Narration beat | Shot |
|---|---|---|
| 00:44–00:53 | "from your desk outward", LAN | MG: progressive zoom-out diagram starts: laptops in one room = LAN |
| 00:53–01:03 | switch connects neighbours | MG: switch appears, frames hop device to device |
| 01:03–01:15 | router, WAN | MG: router at the "doorway", link out to the WAN cloud |
| 01:15–01:25 | hallway vs front gate / post office | AI: dim corridor with doors (switch), then an iron gate opening onto a lit street (router) |
| 01:25–01:36 | IP = street address `192.0.2.10` | MG: address label stamps onto a device |
| 01:36–01:57 | DNS phonebook `bit.edu.cn` | MG: typed domain → DNS server flips through a "phonebook" → IP returned |

**03 · Packet switching & link failure** `01:57–03:13`
| Time | Narration beat | Shot |
|---|---|---|
| 01:57–02:05 | one big file clogging wires | AI: traffic jam of light streaks in a tunnel, then it breaks into small fast pulses |
| 02:05–02:22 | chop into packets + header | MG: file slices into 3 packets; header opens: *Src IP · Dst IP · Seq 1/3* |
| 02:22–02:38 | tracer: healthy route A→B→Server | MG: rebuilt packet tracer, 3 packets travel the primary path |
| 02:38–02:55 | sever link, reroute via C | MG: link snaps with sparks, routers flash, packets divert via Router C |
| 02:55–03:13 | out-of-order, reassemble by sequence | MG: packet 3 arrives before 2, then they sort into 1·2·3 and the photo reassembles |

**04 · TCP/IP layers & TCP vs UDP** `03:13–04:34`
| Time | Narration beat | Shot |
|---|---|---|
| 03:13–03:47 | 4 layers | MG: stack builds top-down, Application (03:18) → Transport (03:25) → Internet (03:32) → Link (03:39), with an icon per layer |
| 03:47–03:52 | Wi-Fi / copper / fibre | AI: macro of fibre-optic strands glowing at their tips |
| 03:52–04:14 | TCP = registered mail | AI: sealed parcel stamped and signed for at a dim post counter. MG: checklist ✓✓✓, "retransmit lost" |
| 04:14–04:34 | UDP = live broadcast | AI: drone racing through a neon tunnel. MG: frames streaming; one drops and is skipped |

**05 · Bandwidth, latency & security** `04:34–05:27`
| Time | Narration beat | Shot |
|---|---|---|
| 04:34–04:48 | highway width vs travel time | AI: aerial shot of a wide multi-lane highway at night with light trails. MG: width = *Mbps*, stopwatch = *ms* |
| 04:48–04:55 | satellite: high bandwidth, high latency | AI: satellite dish turning toward the stars |
| 04:55–05:10 | firewall, HTTPS | AI: heavy iron gate closing. MG: packets filtered; padlock seals the payload |
| 05:10–05:27 | header metadata still visible | MG: packet cut-away, payload scrambled, header readable (*Dst IP*, *time*) |

**06 · Pause & predict + bridge** `05:27–06:30`
| Time | Narration beat | Shot |
|---|---|---|
| 05:27–05:46 | two scenarios | MG: *PAUSE & PREDICT* card: Scenario 1 medical-robot firmware, Scenario 2 racing-drone video; TCP / UDP slots; ring timer |
| 05:46–06:08 | reveal | MG: TCP slots onto Scenario 1, UDP onto Scenario 2, with the reason lines |
| 06:08–06:16 | Ch 12 · MC11 · OE04 | MG: resource chip |
| 06:16–06:30 | "how does a machine decide?" → Video 03 | AI: small robot rolling forward, sensors glowing, pausing at a junction. MG: *Next: Video 03 · Behaviorist AI* |

### Video 03: Behaviorist AI (8:26)

**01 · Opening hook** `00:00–01:17`
| Time | Narration beat | Shot |
|---|---|---|
| 00:00–00:20 | chess-grandmaster robots map the room | AI: bulky retro lab robot scanning a room, wireframe scan sweeping. MG: "Building world model… 3%" bar |
| 00:20–00:29 | someone walks past, robot freezes | AI: ball rolls past the frozen robot. MG: "Recalculating…" spinner |
| 00:29–00:37 | 1980s, Rodney Brooks | MG: "1980s" date card, archival-style lab desk graphic (no likeness of Brooks) |
| 00:37–00:47 | insect dodges in milliseconds | AI: macro of a beetle-like insect darting away in slow motion |
| 00:47–00:53 | Behaviorist AI is born; Unit C | MG: title card |
| 00:53–01:17 | four learning promises | AI+MG: small six-legged robot scuttling over rubble; chips: *Sense→Decide→Act*, *Subsumption*, *Q-learning*, *Connected systems* |

**02 · Sense → Decide → Act & reflex rules** `01:17–02:15`
| Time | Narration beat | Shot |
|---|---|---|
| 01:17–01:34 | observable behaviour, tight loop | AI: robot vacuum moving across a floor, sensors pulsing |
| 01:34–01:49 | Sense / Decide / Act | MG: loop diagram, Agent ↔ Environment, each stage lights up on cue |
| 01:49–02:03 | reflex IF-THEN, cliff sensor | AI: robot vacuum stopping at a stair edge and reversing. MG: rule card `IF cliff_sensor THEN stop & reverse` |
| 02:03–02:15 | trapped bouncing in a corner | MG: top-down vacuum ping-ponging in a corner, "no memory" |

**03 · FSMs & subsumption** `02:15–03:28`
| Time | Narration beat | Shot |
|---|---|---|
| 02:15–02:42 | FSM states | MG: state diagram *Cleaning ⇄ Turning → Returning to Dock* with trigger labels animating |
| 02:42–03:06 | 3 layers by priority | MG: 3-layer stack, Layer 0 Survival (02:50), Layer 1 Wander (02:56), Layer 2 Navigate (03:00) |
| 03:06–03:21 | cat steps in, Layer 0 inhibits Layer 2 | AI: cat walks in front of a robot vacuum heading to its dock. MG: Ⓘ inhibition symbol blocks Layer 2 |
| 03:21–03:28 | Layer 2 resumes, no planner | MG: Layer 2 lights back up |

**04 · Reinforcement learning & Q-tables** `03:28–05:02`
| Time | Narration beat | Shot |
|---|---|---|
| 03:28–03:42 | unknown maze | AI: drone-eye flight through a dark hedge maze |
| 03:42–04:04 | rewards +10 / −10 / −1 | MG: RL loop (S, A → R, S′) plus reward chips popping |
| 04:04–04:30 | Q-table: states × actions | MG: grid ↔ Q-table rows build; Q-value cell highlighted |
| 04:30–04:53 | exploration vs exploitation, ε-greedy | MG: dice roll (explore) vs arrow to the best value (exploit); ε slider |
| 04:53–05:02 | update rule | MG: `Q ← r + best Q(next)` cell update animation |

**05 · Live demo: Q-learning grid** `05:02–06:09`
| Time | Narration beat | Shot |
|---|---|---|
| 05:02–05:25 | Episode 0, all 0.0 | MG: rebuilt 4×4 grid simulator, green +10 goal, red −10 traps |
| 05:25–05:42 | run 1 episode, hits trap at (1,1) | MG: agent wanders, steps into the trap, that Q-value turns red/negative |
| 05:42–06:01 | train 50 episodes | MG: fast-forward counter, values propagate back from the goal |
| 06:01–06:09 | arrows show the safe shortest path | MG: green path arrows light up |

**06 · Pause & predict** `06:09–07:19`
| Time | Narration beat | Shot |
|---|---|---|
| 06:09–06:43 | Q-row for S2 + two questions | MG: *PAUSE & PREDICT* card, Up +1.2 · Down −4.5 · Right +6.8 · Left +0.4, Q1/Q2, ring timer |
| 06:43–06:53 | pure exploitation → Right | MG: *Right +6.8* highlights |
| 06:53–07:06 | ε = 0 locks onto a mediocre path | MG: agent stuck on a short dull loop while a better route stays dark |
| 07:06–07:19 | Ch 13–14 · MC18 · OE05 | MG: resource chip |

**07 · Putting it all together** `07:19–08:26`
| Time | Narration beat | Shot |
|---|---|---|
| 07:19–07:34 | never just hardware, network or AI | AI: autonomous patrol robot rolling through a dark factory floor, sensors glowing |
| 07:34–07:46 | Unit A = body | AI+MG: full-system diagram builds: Hardware panel |
| 07:46–07:59 | Unit B = voice | AI+MG: Networks panel (UDP telemetry, TCP/HTTPS commands) |
| 07:59–08:12 | Unit C = brain | AI+MG: AI panel (Subsumption + RL) |
| 08:12–08:26 | try simulators, test bank, outro | MG: end card with study guide, test bank and 46 questions; Team DOOM sign-off |

---

## 4. Pipeline

1. **AI clips:** `python tools/video_kit/make_clips.py` generates the clips in `storyboards/clips.json` through `tools/make_videos.py` (cached by prompt; a hard budget cap of 25 Pollen is enforced by the ledger in `tools/video_build/spend.json`) and extracts graded frames.
2. **Storyboards:** `storyboards/<video>.js` builds each section with the kit (`tools/video_kit/lib/kit.js`, `morph.js`); every beat names the narrator word it lands on, and a missing word stops the render instead of drifting.
3. **Render:** `python tools/video_kit/render_videos.py` renders every section in headless Chrome on a virtual clock (`capture.mjs`, 6 sections in parallel), with sound effects from the same beats. `--preview` renders 3 fps drafts; `vid:part` renders one section.
4. **Assembly:** ffmpeg joins sections, voiceover and effects, ducks the music under the voice and exports the MP4s next to this file.

## 5. Cost

| Item | Pollen |
|---|---|
| 21 Seedance 2.0 mini clips (106 s at 0.09/s) | about 9.5 |
| Transcription | negligible |
| Graphics, 3D, rendering | free (local) |

The cap is 25 Pollen (under $30).
