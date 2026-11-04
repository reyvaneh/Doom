# Unit A — Hardware

> Study-guide content for Lessons 1–2 of the [course outline](../study-overview.md). Written for absolute beginners. Numbers marked "roughly" are typical values used for comparison, not exact specifications.

**Running example:** a robot vacuum. Every section ends by asking what the same idea looks like inside the vacuum.

**How to use this guide**

- You don't need to know anything about computers to start. Every new word is in **bold** and explained the first time it appears. You can also look it up in the [glossary](#unit-a-glossary) at the end.
- Read the sections in order. Each one builds on the one before.
- Try the *Check your understanding* questions before you open the answers.
- Numbers in square brackets, like [1], point to the [sources](#sources) at the end of the page.

---

## Lesson 1: Inside a computer

### 1.1 The big picture: input → process → output, plus storage

Almost every computer, from a phone to a robot vacuum, follows the same pattern:

```
 INPUT  ──►  PROCESSING  ──►  OUTPUT
 (keyboard,   (CPU working      (screen,
  camera,      with RAM)         speaker,
  sensors)        ▲  │           motors)
                  │  ▼
               STORAGE
          (keeps files when
           power is off)
```

- **Input** brings information *in* from the outside world.
- **Processing** is where the computer follows instructions to change that information.
- **Output** sends the result back *out* to people or the world.
- **Storage** keeps information for later, even when the power is off.

**Try it with something you already do — sending a voice message on your phone:**

1. **Input:** the microphone picks up your voice.
2. **Processing:** the phone's chip turns the sound into data and compresses it.
3. **Storage:** the recording is saved, so it still exists if the phone restarts.
4. **Output:** when your friend presses play, their phone's speaker turns the data back into sound.

### 1.2 The main components

Now let's name the parts that do each of those jobs. You don't need to memorise the whole table. Focus on the first two columns.

| Component | Plain-language job | Everyday analogy | Example |
| --- | --- | --- | --- |
| **Input devices** | Turn actions or the world into data | Your eyes and ears | Keyboard, mouse, touchscreen, microphone, camera, sensors |
| **CPU** (Central Processing Unit) | Follows instructions one step at a time, very fast | A chef following a recipe | Intel Core, AMD Ryzen, Apple M-series, phone chips |
| **RAM** (Random Access Memory) | Holds what the CPU is working on *right now* | The kitchen counter | 8 GB or 16 GB in a typical laptop |
| **Storage** (SSD or hard drive) | Keeps files and programs long-term | The pantry and fridge | 256 GB–2 TB SSD |
| **Output devices** | Present results | Your voice and hands | Screen, speaker, printer, motors |
| **Motherboard** | Connects every part so they can exchange data | The roads in a city | The large main circuit board |
| **Power supply / battery** | Provides electricity to every part | Gas or electricity for the kitchen | Laptop charger, phone battery |
| **GPU** (Graphics Processing Unit) | Does many simple calculations at once, mainly for images, games, and AI | A team of helpers doing one task in parallel | Built-in graphics, NVIDIA/AMD graphics cards |

#### The CPU in a bit more detail

- A **core** is one independent worker inside the CPU. A "quad-core" CPU has four workers that can run tasks at the same time.
- **Clock speed** is how many times per second the CPU's internal clock "ticks." Each tick is a chance for the CPU to do a small piece of work. It is measured in **GHz** (gigahertz): *hertz* means "per second" and *giga* means "billion," so 3 GHz means about 3 billion ticks per second. A higher number does **not** automatically mean a faster computer — the design of the CPU, the number of cores, and the amount of cache also matter.
- **Cache** is a very small, very fast memory built *inside* the CPU. It holds the data the CPU is most likely to need next, so it doesn't have to wait for RAM.

#### RAM vs storage — the most common beginner confusion

| | RAM | Storage (SSD/HDD) |
| --- | --- | --- |
| What it holds | Programs and files currently open | Everything installed or saved |
| When power is lost | **Erased** (it is *volatile*) | **Kept** (it is *non-volatile*) |
| Speed | Much faster | Slower |
| Typical size | 8–32 GB | 256 GB–2 TB+ |
| Cost per GB | Higher | Lower |
| Analogy | Kitchen counter: small, close, cleared at night | Pantry: large, further away, keeps food |

> **Key idea:** "My phone has 128 GB" usually describes *storage*. "My laptop has 16 GB" usually describes *RAM*. They are different jobs, so you cannot add them together.

*(GB means gigabyte, a unit for an amount of data. Lesson 2 explains exactly what it means. For now, just know that a bigger number means more space.)*

**What happens when RAM is full?** The computer moves some of the least-used data from RAM onto storage temporarily (called *virtual memory* or *swap*). Storage is much slower than RAM, so the computer feels sluggish. This is why adding RAM often helps a computer that slows down when many apps are open.

#### SSD vs hard drive (HDD)

| | HDD (hard disk drive) | SSD (solid-state drive) |
| --- | --- | --- |
| How it stores data | Magnetic spinning disk with a moving arm | Electronic memory chips, no moving parts |
| Speed | Slower — the arm must physically move | Much faster |
| Durability | Can be damaged if dropped while running | Handles knocks better |
| Price per GB | Cheaper | More expensive |
| Common use today | Large backups, cheap bulk storage | Laptops, phones, most new computers |

### 1.3 The memory hierarchy: fast-and-small vs slow-and-big

Computers use several layers of memory because no single kind is both fast and cheap. The closer a memory is to the CPU, the faster and smaller it is.

- **Registers** are a handful of tiny storage slots *inside* the CPU, holding the exact numbers it is working on this instant.
- **Cache** is slightly bigger and slightly slower, also inside the CPU.
- Then come RAM and storage, which you met above.

The times below are rough, widely quoted estimates. Real values vary from computer to computer [1].

| Layer | Roughly how long one access takes | Typical size | Keeps data without power? |
| --- | --- | --- | --- |
| CPU registers | Less than 1 nanosecond | A few hundred bytes | No |
| CPU cache | About 1–10 nanoseconds | A few MB | No |
| RAM | About 100 nanoseconds | 8–32 GB | No |
| SSD | About 0.1 milliseconds (100,000 ns) | 256 GB–2 TB | Yes |
| Hard drive | About 10 milliseconds (10,000,000 ns) | 1–20 TB | Yes |

**Make it human-sized:** if reading from cache took 1 second, reading from RAM would take about a minute and a half, an SSD would take more than a day, and a hard drive would take months. That is why the CPU tries hard to keep needed data close.

*(1 nanosecond = one billionth of a second. 1 millisecond = one thousandth of a second.)*

### 1.4 Worked example: opening a photo

1. **Input:** you double-click the photo with the mouse. The mouse sends a signal to the computer.
2. **Processing:** the **operating system** works out which program opens photos. The operating system is the main program that manages the computer and all the other programs on it, for example Windows, macOS or Android. The CPU starts that program.
3. **Storage → RAM:** the photo app and the photo file are copied from the SSD into RAM, because the CPU works far faster with RAM.
4. **Processing:** the CPU (often helped by the GPU) decodes the compressed photo into a grid of coloured dots (pixels).
5. **Output:** the picture data is sent to the screen, which lights up each pixel.
6. **If you edit and don't save:** your changes exist only in RAM. Pull the plug and they are gone. When you press *Save*, the changed photo is written back to storage.

### 1.5 Hardware inside the robot vacuum

| Role | Robot vacuum part |
| --- | --- |
| Input (**sensors**, devices that measure something in the surroundings) | Bump sensor (a switch in the front bumper that detects hitting something); cliff sensors (shine invisible **infrared** light at the floor and detect stairs when no light bounces back); wheel sensors (count how far each wheel has turned); battery level sensor; on some models, a camera or a spinning laser that measures distances (**LiDAR**) |
| Processing | A small computer chip — often a **microcontroller** (a CPU, a little RAM, and storage all on one cheap, low-power chip) |
| RAM | Holds current sensor readings and the current map |
| Storage | Holds the control program and saved room maps |
| Output (**actuators** — parts that move or act) | Wheel motors, brush motor, suction fan, speaker beeps, status lights |
| Power | Rechargeable battery |
| Network hardware (optional) | Wi-Fi chip — see [Unit B](unit-b-networks.md) |

### 1.6 Common misconceptions

| Misconception | Correction |
| --- | --- |
| "More storage makes my computer faster." | Storage holds more files. Speed problems with many open apps are usually about RAM or the CPU. (An SSD *is* faster than an HDD, though, so switching type can help.) |
| "The CPU is the whole box." | The CPU is one chip inside. The box (case) holds all the components. |
| "RAM and storage are both 'memory,' so they're the same." | RAM is temporary working space; storage is long-term keeping. |
| "Higher GHz always wins." | Two CPUs at the same GHz can perform very differently because of cores, cache, and design. |

### 1.7 Check your understanding

1. Sort these into input, processing, output, or storage: microphone, SSD, CPU, speaker, touchscreen.
2. You wrote an essay for 2 hours and didn't save. The power goes out. Why is the essay lost, while yesterday's saved essay is fine?
3. A friend says, "My phone has 8 GB and 256 GB — so 264 GB total memory." What is wrong with this?
4. Name one input and one output of a robot vacuum.

<details>
<summary>Answers</summary>

1. Microphone → input. SSD → storage. CPU → processing. Speaker → output. Touchscreen → **both** input (touch) and output (display).
2. Unsaved work exists only in RAM, which is erased when power is lost. The saved essay was written to storage, which keeps data without power.
3. 8 GB is RAM (working space) and 256 GB is storage (long-term). They do different jobs, so adding them together is meaningless.
4. Input: bump sensor, cliff sensor, battery sensor, camera. Output: wheel motors, brush, suction fan, beeps, lights.

</details>

---

## Lesson 2: From bits to actions

### 2.1 Why computers use binary

Inside a computer chip are billions of tiny electronic switches called **transistors**. Each switch is either **off** or **on**. It is reliable to tell those two states apart, so computers write everything using just two symbols:

- **0** = off (low voltage)
- **1** = on (high voltage)

A single 0 or 1 is called a **bit** (short for *binary digit*). Everything — numbers, letters, photos, music, the robot's instructions — is stored as long patterns of bits.

> Binary is a way to **represent** information, like writing. A computer storing the bits for the word "cat" does not know what a cat is.

### 2.2 Counting in binary with bit cards

In everyday (decimal) numbers each place is worth 10× the one to its right: 1, 10, 100, 1000.
In binary each place is worth **2×** the one to its right: 1, 2, 4, 8, 16 …

Make four cards. Each card is either face-up (1) or face-down (0):

| Card value | 8 | 4 | 2 | 1 |
| --- | --- | --- | --- | --- |

**Worked example — what number is `1101`?**

| Card value | 8 | 4 | 2 | 1 |
| --- | --- | --- | --- | --- |
| Bit | 1 | 1 | 0 | 1 |
| Counts? | 8 | 4 | — | 1 |

8 + 4 + 1 = **13**. So `1101` in binary = 13 in decimal.

**How to read a binary number, step by step:**

1. Write the card values 8, 4, 2, 1 above the bits.
2. Cross out every card whose bit is 0.
3. Add up the cards that are left.

**Worked example — how do you write 6 in binary?** Go from the biggest card to the smallest. At each card, ask: "Does this card fit into what I still need?"

| Step | Card | Still need | Does it fit? | Bit | Now still need |
| --- | --- | --- | --- | --- | --- |
| 1 | 8 | 6 | No, 8 is bigger than 6 | 0 | 6 |
| 2 | 4 | 6 | Yes | 1 | 6 − 4 = 2 |
| 3 | 2 | 2 | Yes | 1 | 2 − 2 = 0 |
| 4 | 1 | 0 | No, nothing left | 0 | 0 |

Read the bits from top to bottom: **`0110`**. Check: 4 + 2 = 6 ✓

With 4 bits the smallest number is `0000` = 0 and the biggest is `1111` = 8+4+2+1 = 15. So 4 bits can represent **16 different values** (0–15).

**Why does each extra bit double the number of values?** Adding a 5th card worth 16 gives you every old pattern with the new card down (0–15), plus every old pattern again with the new card up (16–31). That's twice as many.

| Number of bits | Different values | Range |
| --- | --- | --- |
| 1 | 2 | 0–1 |
| 4 | 16 | 0–15 |
| 8 (one byte) | 256 | 0–255 |
| 16 | 65,536 | 0–65,535 |
| 32 | About 4.3 billion | 0–4,294,967,295 |

### 2.3 Bits, bytes, and bigger units

- **8 bits = 1 byte.** A byte is the basic unit for measuring file sizes and memory.
- **Kilobyte (KB)** ≈ 1,000 bytes · **Megabyte (MB)** ≈ 1 million bytes · **Gigabyte (GB)** ≈ 1 billion bytes · **Terabyte (TB)** ≈ 1 trillion bytes.

> **Why does my 1 TB drive show only about 931 GB?** Drive makers count 1 TB = 1,000,000,000,000 bytes. Some operating systems (such as Windows) divide by 1,024 at each step instead of 1,000 — strictly, those units are named *GiB* (gibibytes). Same bytes, different counting.

> **Bits vs bytes:** internet speeds are usually given in **bits** per second (Mbps, lowercase b). File sizes are usually given in **bytes** (MB, uppercase B). Divide Mbps by 8 to get MB per second. More in [Unit B](unit-b-networks.md#44-latency-vs-bandwidth).

### 2.4 How bits represent different things

The same bits mean different things depending on the agreed **encoding** (the rule for reading them).

**Text.** People agreed on a table that gives every character a number. The oldest common table is called **ASCII** [2]. Here is how the letter `A` is stored, step by step:

1. Look up `A` in the table: it is number **65** (`B` is 66, `C` is 67, and so on).
2. Write 65 using 8 bit cards (128, 64, 32, 16, 8, 4, 2, 1): 65 = 64 + 1.
3. So `A` is stored as **`01000001`**: one byte.

ASCII only covers English letters, digits and symbols. A larger table, **Unicode**, gives a number to characters from every writing system, including Chinese and emoji [3]. In the most common way of storing Unicode, called UTF-8, one Chinese character such as 中 takes 3 bytes [4].

**Colours and images.** A picture is a grid of dots called **pixels**. Each pixel's colour is often stored as three numbers — red, green, and blue — each from 0 to 255 (one byte each).

| Colour | Red | Green | Blue |
| --- | --- | --- | --- |
| Black | 0 | 0 | 0 |
| White | 255 | 255 | 255 |
| Pure red | 255 | 0 | 0 |
| Yellow (red + green light) | 255 | 255 | 0 |

**Worked example — how big is one uncompressed Full-HD image?**

1. A Full-HD screen is 1920 pixels wide and 1080 pixels tall.
2. Number of pixels: 1920 × 1080 = 2,073,600 pixels.
3. Each pixel needs 3 bytes (red, green, blue): 2,073,600 × 3 = 6,220,800 bytes.
4. 1 MB is about 1 million bytes, so that's about **6.2 MB**.
A JPEG of the same photo is often under 1 MB because **compression** finds patterns and stores them more cleverly.

**Sound.** Sound is a wave. To store it, the computer measures the height of the wave thousands of times per second. Each measurement is called a **sample** and is stored as a number. CD audio takes 44,100 samples every second [5]. Playing those numbers back quickly, in order, rebuilds the wave.

**Sensors.** A robot vacuum's cliff sensor might report a number from 0 to 255 for how much infrared light bounces back. A low number can mean "no floor below — stairs!"

### 2.5 Logic gates: how switches make decisions

Transistors are combined into **logic gates**. A gate takes one or more bits in and produces one bit out according to a simple rule.

**How to read a truth table:** each row is one possible situation. The left columns are the inputs, and the last column is what the gate outputs in that situation. Read one row at a time.

**AND** — output is 1 only if **both** inputs are 1.
*Example:* the vacuum moves forward only if (path is clear) AND (battery is OK).

| A | B | A AND B |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**OR** — output is 1 if **at least one** input is 1.
*Example:* the vacuum stops if (bumper pressed) OR (cliff detected).

| A | B | A OR B |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

**NOT** — flips the input.

| A | NOT A |
| --- | --- |
| 0 | 1 |
| 1 | 0 |

**From gates to arithmetic — adding two bits.** Think of normal addition: 1 + 1 = 2, which in binary is `10`. You write down 0 and **carry** 1 to the next column, just like carrying in 9 + 1 = 10.

| A | B | A + B in binary | Sum bit (write down) | Carry bit |
| --- | --- | --- | --- | --- |
| 0 | 0 | `00` | 0 | 0 |
| 0 | 1 | `01` | 1 | 0 |
| 1 | 0 | `01` | 1 | 0 |
| 1 | 1 | `10` | 0 | 1 |

- The **carry** column matches **AND**: it is 1 only when both inputs are 1.
- The **sum** column matches a gate called **XOR** ("exclusive or"): it is 1 when the inputs are *different*.

So two gates are enough to add two bits. Chain many of these together and you can add big numbers. Build further and you get circuits that compare values and remember bits. *Nand to Tetris* follows this whole path, from single gates to a working computer [6].

### 2.6 Programs, instructions, and the fetch–decode–execute cycle

A **program** is a list of instructions stored in memory, just like data. The CPU runs a program by repeating three steps, billions of times per second:

1. **Fetch** — get the next instruction from memory.
2. **Decode** — work out what the instruction means.
3. **Execute** — do it (add, compare, copy, jump to another instruction, etc.).

Then it moves on to the next instruction and repeats.

Three small parts inside the CPU help:

| Part | Job | Analogy |
| --- | --- | --- |
| **Program counter (PC)** | Remembers the memory address of the *next* instruction | A bookmark in the recipe |
| **Instruction register** | Holds the instruction currently being decoded | The recipe line you're reading |
| **Accumulator / registers** | Holds numbers currently being worked on | The bowl in your hand |

#### Worked example: a three-instruction paper machine

Memory contents before the program runs:

| Address | Contents |
| --- | --- |
| 0 | `LOAD 10` (copy the number at address 10 into the accumulator) |
| 1 | `ADD 11` (add the number at address 11 to the accumulator) |
| 2 | `STORE 12` (copy the accumulator into address 12) |
| 3 | `HALT` (stop) |
| 10 | 5 |
| 11 | 3 |
| 12 | 0 |

**How to trace it yourself.** Repeat these steps until you reach `HALT`:

1. Look at the program counter (PC) to find which address to read.
2. **Fetch:** read the instruction at that address.
3. Move the PC on by one.
4. **Decode:** say in words what the instruction asks for.
5. **Execute:** do it, and update the accumulator or memory.
6. Write a new row in the trace table.

Trace:

| Step | PC | Fetched instruction | What happens | Accumulator | Address 12 |
| --- | --- | --- | --- | --- | --- |
| Start | 0 | — | — | 0 | 0 |
| 1 | 0 → 1 | `LOAD 10` | Read address 10 (5) into the accumulator | 5 | 0 |
| 2 | 1 → 2 | `ADD 11` | Read address 11 (3) and add | 8 | 0 |
| 3 | 2 → 3 | `STORE 12` | Write the accumulator into address 12 | 8 | **8** |
| 4 | 3 | `HALT` | Stop | 8 | 8 |

The program calculated 5 + 3 = 8 and saved the result. Real programs are this, scaled up: millions of tiny steps.

**Classroom version:** one learner is the **CPU** (holds the accumulator on a mini whiteboard), one is **memory** (holds numbered cards), and one is the **program counter** (points at the next card). The CPU must ask memory for every card — it cannot "see" memory directly.

#### Why it matters for the robot vacuum

The vacuum's program is a loop of instructions such as: *read the bump sensor → compare with 1 → if equal, jump to the "stop and turn" instructions → otherwise, jump to "drive forward."* Its microcontroller runs the fetch–decode–execute cycle millions of times per second, so it reacts to a bump in a tiny fraction of a second. The *behaviour* those instructions describe is the subject of [Unit C](unit-c-behaviorist-ai.md).

### 2.7 Common misconceptions

| Misconception | Correction |
| --- | --- |
| "Binary means the computer understands 0s and 1s like words." | Bits are just on/off states. Meaning comes from the encoding rules people designed. |
| "1 GHz means 1 billion instructions per second." | It means 1 billion clock ticks. Some instructions take several ticks; modern CPUs can also handle several instructions per tick. |
| "Programs are something different from data." | Both are stored as bits in memory. The CPU treats bits as instructions when the program counter points at them. |
| "Mb and MB are the same." | Mb = megabits, MB = megabytes. 1 MB = 8 Mb. |

### 2.8 Check your understanding

1. What decimal number is `1010`? What is 9 in 4-bit binary?
2. How many different values can 3 bits represent?
3. What is the output of `1 AND 0`? Of `1 OR 0`? Of `NOT 1`?
4. A vacuum should drive forward only when the bumper is **not** pressed **and** the battery is OK. Write this using NOT and AND.
5. In the paper machine, change address 11 from 3 to 7. What ends up in address 12?
6. Put the three steps of the instruction cycle in order and describe each in one sentence.

<details>
<summary>Answers</summary>

1. `1010` = 8 + 2 = **10**. 9 = 8 + 1 = **`1001`**.
2. 2 × 2 × 2 = **8** values (0–7).
3. `1 AND 0` = 0. `1 OR 0` = 1. `NOT 1` = 0.
4. Drive = (NOT bumper) AND battery_ok.
5. 5 + 7 = **12**.
6. Fetch (get the next instruction from memory) → Decode (work out what it means) → Execute (carry it out). Then repeat.

</details>

---

## Unit A glossary

| Term | Meaning |
| --- | --- |
| Actuator | A part that acts on the world, such as a motor or speaker |
| Binary | A number system with only two digits, 0 and 1 |
| Bit | A single binary digit (0 or 1) |
| Byte | 8 bits |
| Cache | Small, very fast memory inside the CPU |
| Clock speed | How many ticks per second the CPU's clock makes (GHz) |
| Core | An independent processing unit inside a CPU |
| CPU | The chip that follows program instructions |
| Encoding | An agreed rule for what a pattern of bits means |
| Logic gate | A tiny circuit that combines bits using a rule such as AND, OR, NOT, XOR |
| Microcontroller | A small, low-power chip that combines a CPU, memory, and storage — common in appliances and robots |
| Non-volatile | Keeps data when power is off (e.g., SSD) |
| Operating system | The main program that manages the computer and runs other programs (Windows, macOS, Android) |
| Pixel | One coloured dot in an image |
| Program counter | CPU part that tracks the next instruction's address |
| RAM | Fast, temporary working memory |
| Register | A tiny storage slot inside the CPU for the number it is using right now |
| Sample | One measurement of a sound wave, stored as a number |
| Sensor | An input device that measures something in the environment |
| Storage | Long-term memory such as an SSD or hard drive |
| Transistor | A microscopic electronic switch — the basic building block of chips |
| Volatile | Loses data when power is off (e.g., RAM) |

## Sources

1. Peter Norvig, "Approximate timing for various operations," in [Teach Yourself Programming in Ten Years](https://norvig.com/21-days.html). Widely shared, updated versions are in [Jonas Bonér's gist](https://gist.github.com/jboner/2841832). These are order-of-magnitude estimates, not measurements of any particular computer.
2. ASCII: ANSI X3.4-1968. The table is reproduced in [RFC 20 — ASCII format for Network Interchange](https://www.rfc-editor.org/rfc/rfc20) (1969), where `A` = decimal 65.
3. The Unicode Consortium, [What is Unicode?](https://www.unicode.org/standard/WhatIsUnicode.html)
4. [RFC 3629 — UTF-8](https://www.rfc-editor.org/rfc/rfc3629). Characters from U+0800 to U+FFFF, including the common Chinese characters, use 3 bytes.
5. CD audio (the Red Book standard, IEC 60908) uses 44.1 kHz sampling at 16 bits. Summary: [Compact Disc Digital Audio](https://en.wikipedia.org/wiki/Compact_Disc_Digital_Audio).
6. Nisan and Schocken, [Nand to Tetris](https://www.nand2tetris.org/course). Projects 1–5 go from logic gates, through adders and memory, to a CPU.

### Further reading

- Charles Petzold, *Code: The Hidden Language of Computer Hardware and Software* (2nd ed., 2022). A beginner-friendly book on binary, logic gates, and how CPUs work.
