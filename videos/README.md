# Video tutorials

| Video | File | Length | Size |
|---|---|---|---|
| 01 · Hardware Foundations | [DOOM_Video01_Hardware_Foundations.mp4](DOOM_Video01_Hardware_Foundations.mp4) | 6:53 | 113 MB |
| 02 · Network Communication | [DOOM_Video02_Network_Communication.mp4](DOOM_Video02_Network_Communication.mp4) | 6:30 | 89 MB |
| 03 · Behaviorist AI | [DOOM_Video03_Behaviorist_AI.mp4](DOOM_Video03_Behaviorist_AI.mp4) | 8:26 | 103 MB |

1920×1080, 30 fps, H.264 + AAC, loudness −18 LUFS. On-screen text follows the narration word by word and morphs between terms; each concept keeps one colour across all three videos. Style, pipeline and cost: [PLAN.md](PLAN.md). Beat-by-beat storyboards: [storyboards/](storyboards/).

Rebuild (AI clips are cached; nothing is paid for twice):

```bash
python tools/video_kit/make_clips.py
python tools/video_kit/render_videos.py
```

Credits: AI footage generated with Seedance 2.0 mini via Pollinations (about 9.5 Pollen). Font: Nunito (SIL Open Font Licence, `tools/video_kit/fonts/OFL.txt`). Music: the study guide's own soundtrack.

---

## Voiceover transcripts

Transcribed with Pollinations `whisper-1`. Whisper mishears some terms (e.g. "subtraction" for subsumption, "QI" for Q-learning); on-screen captions use the official script wording.


## Video 01: Hardware Foundations: From Silicon & RAM to Smart Sensors — total 06:53.2

| # | Section | Original file | Length | Starts at |
|---|---|---|---|---|
| 01 | Opening hook: the 2 AM blackout | `part 1.m4a` | 46.7s | 00:00.0 |
| 02 | The 4 pillars & the kitchen analogy | `part 2.m4a` | 97.5s | 00:46.7 |
| 03 | Binary, logic gates & Fetch-Decode-Execute | `part 3.m4a` | 83.7s | 02:24.2 |
| 04 | Sensors, circuits & the night-light | `part 4.m4a` | 67.7s | 03:47.9 |
| 05 | Pause & predict: thresholds vs hysteresis | `part 5.m4a` | 69.4s | 04:55.6 |
| 06 | Interfaces, datasheets & bridge to Video 02 | `part 6.m4a` | 48.2s | 06:05.0 |

Full transcript: [transcripts/01_hardware.md](transcripts/01_hardware.md)

## Video 02: Network Communication: How Packets Travel, Route & Stay Secure — total 06:30.0

| # | Section | Original file | Length | Starts at |
|---|---|---|---|---|
| 01 | Opening hook: crossing the ocean in milliseconds | `part 1 network.m4a` | 43.6s | 00:00.0 |
| 02 | LAN vs WAN, switches, routers, IP & DNS | `part 2 network.m4a` | 73.6s | 00:43.6 |
| 03 | Packet switching & rerouting around a broken link | `part 3 network.m4a` | 75.8s | 01:57.2 |
| 04 | The 4-layer TCP/IP model & TCP vs UDP | `part 4 network.m4a` | 81.2s | 03:13.0 |
| 05 | Bandwidth vs latency & security | `part 5 network.m4a` | 53.0s | 04:34.3 |
| 06 | Pause & predict + bridge to Video 03 | `part 6 network.m4a` | 62.8s | 05:27.2 |

Full transcript: [transcripts/02_networks.md](transcripts/02_networks.md)

## Video 03: Behaviorist AI: Reactive Robots, Q-Learning & Connected Systems — total 08:26.4

| # | Section | Original file | Length | Starts at |
|---|---|---|---|---|
| 01 | Opening hook: why early robots froze | `Part 1(1).m4a` | 77.1s | 00:00.0 |
| 02 | Sense-Decide-Act & reflex rules | `Part 2(1).m4a` | 57.8s | 01:17.1 |
| 03 | Finite state machines & subsumption | `Part 3(1).m4a` | 73.1s | 02:14.8 |
| 04 | Reinforcement learning & Q-tables | `Part 4(1).m4a` | 94.1s | 03:27.9 |
| 05 | Live demo: Q-learning grid | `Part 5(1).m4a` | 66.4s | 05:02.1 |
| 06 | Pause & predict: exploitation vs exploration | `Part 6(1).m4a` | 70.1s | 06:08.5 |
| 07 | Putting it all together | `Part 7.m4a` | 67.8s | 07:18.6 |

Full transcript: [transcripts/03_behaviorist_ai.md](transcripts/03_behaviorist_ai.md)

Skipped: `part 5 network(1).m4a` and `part 6 network(1).m4a` are byte-identical duplicates.
