# System buses, the system clock, and hexadecimal (beginner level)

Research method note: I could not extract text from the official Cambridge 0478 syllabus PDF (https://www.cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf); the fetch tool returned only compressed binary, and no local PDF parser was available. The full ATmega328P datasheet PDFs (mirrors at fab.cba.mit.edu and cse.unl.edu) failed the same way. Syllabus wording below therefore comes from syllabus-aligned revision sites (Save My Exams, Seneca), not the syllabus itself. Datasheet wording comes from Microchip's online docs and from quotes in search snippets. Anything that should be checked against the primary PDF before it is quoted in the course is flagged.

## Q1. Address, data and control buses: what they are, directions, width, and how syllabuses describe them

### Takeaway
The definitions are standard across sources. The address bus carries a location and runs one way (CPU → memory/I/O). The data bus carries data or instructions and runs both ways. The control bus carries signals such as read, write, clock, interrupt and reset. Each extra address line doubles the number of addressable locations (2^n). Cambridge IGCSE-aligned notes say the control bus is two-way.

### Cited Findings
- Save My Exams (Cambridge IGCSE 0478-aligned) lists three buses. Address bus: one-way, carries locations. Data bus: two-way, carries data or instructions. Control bus: two-way, carries commands and signals. — [Save My Exams: Von Neumann Architecture (CIE IGCSE)](https://savemyexams.com/igcse/computer-science/cie/23/revision-notes/3-hardware/computer-architecture/von-neumann-architecture) (from a search snippet; the page body did not render on fetch)
- Toshiba's microcontroller e-learning (a manufacturer source) gives these definitions. Address bus: "a signal line that specifies the location of the memory and I/O". Data bus: "a signal line for exchanging the data between the CPU and the memory, and between the CPU and I/O". Control bus: "a signal line that specifies whether to read or write". On a Write the addressed device takes data from the data bus; on a Read it outputs data onto the data bus. The page states no directions and does not cover bus width. — [Toshiba: Types of bus lines](https://toshiba.semicon-storage.com/ap-en/semiconductor/knowledge/e-learning/micro-intro/chapter2/types-of-bus-lines.html)
- Revision sources describe the address bus as normally one-way, from the processor to memory or an I/O controller. The data bus is bidirectional because the processor both sends and receives data. Control bus lines include memory read, memory write, clock, interrupt and reset, and individual lines may run in either direction. — [RevisionDojo: address/data/control bus functions](https://www.revisiondojo.com/student-faq/address-data-control-bus-functions); [TutorChase: AQA A-level 16.1.4 Buses](https://www.tutorchase.com/notes/aqa-a-level/computer-science/16-1-4-buses)
- An Edexcel-style GCSE question describes the address bus as a unidirectional pathway carrying binary memory addresses from the MAR to the main memory's address decoder. — [Maths Genie Edexcel GCSE CS Hardware Q58](https://mathsgenie.co.uk/gcse/computer-science/edexcel/hardware/questions/q58)
- Bus width: a 16-bit address bus can address 2^16 = 65,536 locations ("64K"). Each extra address wire doubles the address capacity. — [University of Cambridge Engineering: Microprocessor and Memory Basics](https://www-mdp.eng.cam.ac.uk/web/library/enginfo/mdp_micro/lecture1/lecture1-3-4.html); [KFUPM lecture slide](https://faculty.kfupm.edu.sa/COE/masud/text/lectures/macCH1_files/slide0057.htm)
- Advanced caveat: real 64-bit systems with 8-byte-wide data buses do not put the lowest 3 address bits on the bus, so pin count is not exactly the address width. — [NIU bus lecture](https://faculty.cs.niu.edu/~berezin/463/lec/bus/bustech05.html) (not needed at beginner level)
- Exam technique (revision-site advice, not official): to distinguish the buses, state both what each one carries and its direction. — [RevisionDojo](https://www.revisiondojo.com/student-faq/address-data-control-bus-functions)

### Inferences
- Beginner rule of thumb: n address lines give 2^n locations. For example, 4 lines give 16 locations and 8 lines give 256, which ties directly to the course's existing 4-bit and 8-bit binary content. If each location holds 1 byte, 16 lines give 64 KiB.
- Data bus width usually matches the CPU word size: an 8-bit CPU such as the AVR moves 8 bits at a time. This is standard textbook framing, but I found no beginner source that states it cleanly; see Gaps.
- The "control bus is two-way" convention (Cambridge-aligned notes) versus "individual lines have their own direction" (A-level notes) are consistent: the bus as a whole carries signals both ways.

### Gaps
- I could not verify the exact Cambridge 0478 (2026–2028) syllabus wording on buses, because the PDF did not parse. Cambridge-aligned revision sites indicate it covers address, data and control buses within von Neumann architecture, with MAR, MDR, PC, CIR and ACC. Check the primary PDF before quoting.
- I did not retrieve the AQA (8525) or OCR (J277) specification wording. OCR J277 is generally understood to include MAR/MDR/PC/accumulator and von Neumann, but I did not confirm whether it names the three buses. Treat this as unverified.
- I found no citable beginner source for "data bus width = word size".

## Q2. How the buses, MAR and MDR are used in each step of fetch–decode–execute

### Takeaway
Standard syllabus-aligned descriptions agree on the steps. Fetch: PC → MAR; the MAR's address goes out on the address bus, the CU signals "read" on the control bus, and the instruction comes back on the data bus into the MDR (then into the CIR/IR). The PC is then incremented. Decode: the CU interprets the instruction. Execute: the instruction is carried out, possibly using MAR/MDR and the buses again, for example to load a value from RAM. MAR holds an address; MDR holds the data or instruction just read from memory, or about to be written to it.

### Cited Findings
- Seneca (Cambridge IGCSE): the address of the next instruction is copied from the PC to the MAR. The PC is incremented. "The instruction stored at the location held by the MAR is copied to the MDR." The CU then decodes the instruction and sends control signals. In execute, the relevant component (e.g. the ALU) carries out the operation, and PC or MAR values may change. This page does not name the buses or the CIR. — [Seneca: 1.3.4 The fetch-decode-execute cycle (Cambridge IGCSE)](https://senecalearning.com/en-GB/revision-notes/igcse/computer-science/cambridge-international/1-3-4-the-fetch-decode-execute-cycle)
- Save My Exams (CIE IGCSE/O Level): the MAR contents are sent along the address bus with a signal on the control bus, and the instruction returns to the MDR via the data bus. The worked example has the address placed on the address bus, the CU signalling a read on the control bus, and the instruction returned on the data bus. — [Save My Exams: The Fetch-Decode-Execute Cycle (CIE IGCSE)](https://www.savemyexams.com/igcse/computer-science/cie/23/revision-notes/3-hardware/computer-architecture/the-fetch-decode-execute-cycle); [Save My Exams: (CIE O Level)](https://savemyexams.com/o-level/computer-science/cie/21/revision-notes/3-hardware/computer-architecture/the-fetch-decode-execute-cycle) (from search snippets; the page bodies did not render on fetch)
- Seneca (OCR GCSE): the processor copies the next instruction's address from the PC into the MAR, and the PC is incremented by one. — [Seneca: OCR GCSE 1.1.3 Fetch-execute cycle](https://senecalearning.com/en-GB/revision-notes/gcse/computer-science/ocr/1-1-3-fetch-execute-cycle)
- Save My Exams (OCR AS/A level): which registers are used depends on the instruction. For example, LDA moves data from RAM over the data bus into the MDR during execute. — [Save My Exams: Fetch-Decode-Execute Cycle (OCR AS)](https://www.savemyexams.com/as/computer-science/ocr/14/revision-notes/1-the-characteristics-of-contemporary-processors-input-output-and-storage-devices/1-1-structure-and-function-of-the-processor/fetch-decode-execute-cycle-)
- Cambridge-aligned notes list five registers: PC, MAR, MDR, CIR and ACC. — [Save My Exams: Von Neumann Architecture (CIE IGCSE)](https://savemyexams.com/igcse/computer-science/cie/23/revision-notes/3-hardware/computer-architecture/von-neumann-architecture) (snippet)
- MAR definition: it holds the address of the memory location currently being read from or written to. — [Scribd presentation (study guide, lower reliability)](https://www.scribd.com/presentation/870639921/2); this is consistent with the Seneca and Maths Genie wording above.
- An A/L ICT guide gives the fetch sequence as PC address → MAR; instruction read via the data bus into the MDR; PC incremented. — [itguru.lk A/L ICT unit 2](https://itguru.lk/a-l-ict-syllabus/unit/2)
- Exam tip: register-based answers earn marks only when they state the specific values held in each register. — [Save My Exams OCR A-level FDE](https://savemyexams.com/a-level/computer-science/ocr/17/revision-notes/1-the-characteristics-of-contemporary-processors-input-output-and-storage-devices/1-1-structure-and-function-of-the-processor/fetch-decode-execute-cycle)

### Inferences
- The course calls the instruction register "IR". Cambridge calls it the CIR (Current Instruction Register). A one-line "also called CIR" note would help learners who use Cambridge materials.
- Suggested beginner bus walk-through for the course's paper CPU, synthesised from the sources above:
  1. Fetch: PC → MAR. MAR → address bus. CU puts "read" on the control bus. Memory puts the instruction on the data bus → MDR → IR/CIR. PC + 1.
  2. Decode: the CU interprets the IR. No memory access is needed.
  3. Execute, for "LOAD 7": address 7 → MAR → address bus. "Read" on the control bus. Data on the data bus → MDR → ACC.
  4. Execute, for "STORE 7": address 7 → MAR. ACC → MDR → data bus. "Write" on the control bus.
  This shows why the data bus must be two-way: it carries data in for a load and out for a store.
- MAR and MDR can be framed as the CPU's "outbox address label" and "parcel" at the boundary with memory.

### Gaps
- I did not retrieve the official syllabus or specification wording for MAR/MDR (Cambridge 0478, OCR J277, AQA 8525), only revision-site paraphrases.
- I found no single beginner source that maps the STORE (write) cycle step by step. The STORE sequence above is an inference from the bus and register definitions.

## Q3. The system clock and clock speed; the ATmega328P (16 MHz) example

### Takeaway
The clock is a regular pulse signal, carried on the control bus, that keeps the CPU's actions in step. Clock speed is the number of cycles per second: 1 MHz = 10^6 and 1 GHz = 10^9 cycles per second. Microchip states that the ATmega328P executes most of its instructions in a single clock cycle, with throughput "close to 1 MIPS per MHz" and "up to 20 MIPS at 20 MHz". At 16 MHz that gives about 16 MIPS at best, not exactly. Some instructions take 2 or more cycles.

### Cited Findings
- Clock speed is the number of clock cycles per second. 1 MHz = 1×10^6 cycles/s and 1 GHz = 1×10^9 cycles/s. — [Emory CS255 overview notes (PDF)](https://cs.emory.edu/~cheung/Courses/255/Syllabus/HardCopy/01-overview-computer/03.pdf)
- The clock is one of the signals on the control bus. — [RevisionDojo](https://www.revisiondojo.com/student-faq/address-data-control-bus-functions); [TutorChase AQA 16.1.4](https://www.tutorchase.com/notes/aqa-a-level/computer-science/16-1-4-buses)
- ATmega328P datasheet summary (Microchip): "by executing powerful instructions in a single clock cycle, the ATmega328/P achieves throughputs close to 1MIPS per MHz". The feature list includes "131 Powerful Instructions", "Most Single Clock Cycle Execution" and "Up to 20 MIPS Throughput at 20MHz". — [ATmega328P datasheet mirror (MIT Fab)](https://fab.cba.mit.edu/classes/863.17/EECS/people/akaspar/project/atmega328p-datasheet.pdf); [mirror (UNL)](https://cse.unl.edu/~jfalkinburg/cse_courses/2021/236/Atmega328p_full_datasheet.pdf); [Datasheet summary (radiolocman)](https://www.radiolocman.com/datasheet/pdf.html?di=124153). These quotes came through search snippets because the PDFs did not parse; check them against Microchip's PDF (Atmel-42735 / DS40002061).
- AVR core "Instruction Execution Timing" (Microchip online docs; the same AVR-core text appears across megaAVR datasheets): "The AVR CPU is driven by the CPU clock clkCPU, directly generated from the selected clock source for the chip". No internal clock division is used. Parallel instruction fetch and execute give up to 1 MIPS per MHz. "In a single clock cycle an ALU operation using two register operands is executed, and the result is stored back to the destination register." — [Microchip online docs, 8.7 Instruction Execution Timing (this page is the ATmega324PB datasheet; the core text is shared)](https://onlinedocs.microchip.com/oxy/GUID-74F8229E-4C43-4FA0-BE7D-1AA303C6F8A4-en-US-6/GUID-00885335-14FC-4AFF-9D60-0980181CAE0B.html); [other device versions of the same section](https://onlinedocs.microchip.com/oxy/GUID-74578654-4F5F-4B29-9F3C-6C3B1F1DF670-en-US-2/GUID-3A867580-03F1-4E43-8949-9FA8E3B4DF3F.html)
- The datasheet's wording is "close to" or "approaching" 1 MIPS/MHz, not exactly 1. Multi-cycle instructions, such as the 2-cycle multiply and branches or loads, lower real throughput. — summary of the search results on the [ATmega328P datasheet](https://cse.unl.edu/~jfalkinburg/cse_courses/2021/236/Atmega328p_full_datasheet.pdf); exact cycle counts should be taken from Microchip's AVR Instruction Set Manual.

### Inferences
- At the 16 MHz clock used on typical Arduino Uno-class boards, 16 million ticks per second, each tick lasts 1/16,000,000 s = 62.5 ns. Peak throughput is about 16 MIPS, and real code runs lower because some instructions take 2–4 cycles. Write "up to about 16 million simple instructions per second", not "exactly 16 MIPS".
- Beginner explanation: the clock is like a metronome or conductor. On each tick, every part of the CPU takes its next step at the same moment.
- The AVR's single-cycle speed depends on its pipelining: it fetches the next instruction while executing the current one. This differs from the course's paper CPU, which does fetch, then decode, then execute one after another. It is worth a "real world differs" note.

### Gaps
- I did not find a citable primary source stating "Arduino Uno runs the ATmega328P at 16 MHz" (the official Arduino Uno Rev3 product page/datasheet is the right source). The 16 MHz figure is widely known but uncited here.
- I did not retrieve exact per-instruction cycle counts (e.g. MUL = 2, LD = 2, CALL = 4) from the AVR Instruction Set Manual.
- I did not retrieve the ATmega328P's maximum clock against supply voltage (speed grades: 0–20 MHz at 4.5–5.5 V, per the datasheet). Verify before citing.

## Q4. Harvard (ATmega328P) vs von Neumann (course paper CPU)

### Takeaway
Microchip states that the AVR core "uses a Harvard architecture – with separate memories and buses for program and data". Program instructions live in Flash and variables live in SRAM, each with its own bus, so the next instruction can be fetched while the current one executes. In von Neumann architecture, the model used in Cambridge IGCSE and in the course's paper CPU, instructions and data share one memory and one set of buses. Wikipedia and community sources describe the AVR as a *modified* Harvard architecture.

### Cited Findings
- "The AVR uses a Harvard architecture – with separate memories and buses for program and data. Instructions in the program memory are executed with a single level pipelining. While one instruction is being executed, the next instruction is pre-fetched from the program memory." — Microchip AVR CPU core text, quoted in search results; [Microchip online docs (AVR core section)](https://onlinedocs.microchip.com/oxy/GUID-74F8229E-4C43-4FA0-BE7D-1AA303C6F8A4-en-US-6/GUID-00885335-14FC-4AFF-9D60-0980181CAE0B.html); [ATmega328P datasheet mirror](https://cse.unl.edu/~jfalkinburg/cse_courses/2021/236/Atmega328p_full_datasheet.pdf)
- The Harvard architecture and fast-access register file enable parallel instruction fetch and execution (datasheet Figure: "The Parallel Instruction Fetches and Instruction Executions"). — [Microchip online docs 8.7](https://onlinedocs.microchip.com/oxy/GUID-74F8229E-4C43-4FA0-BE7D-1AA303C6F8A4-en-US-6/GUID-00885335-14FC-4AFF-9D60-0980181CAE0B.html)
- The ATmega328 is described as having a "modified Harvard architecture 8-bit RISC processor core". — [Wikipedia: ATmega328](https://en.wikipedia.org/wiki/ATmega328)
- AVR uses separate program and data memories and buses. — [element14: ATmega328P and its architecture](https://community.element14.com/members-area/personalblogs/b/blog/posts/atmega328p-and-it-s-architecture)
- Von Neumann (Cambridge IGCSE framing): a stored-program design in which instructions and data share main memory and the same buses, with the CPU containing the CU, ALU and registers (PC, MAR, MDR, CIR, ACC). — [Save My Exams: Von Neumann Architecture (CIE IGCSE)](https://savemyexams.com/igcse/computer-science/cie/23/revision-notes/3-hardware/computer-architecture/von-neumann-architecture) (snippet-level)

### Inferences
- Suggested beginner note: "Our paper CPU is von Neumann: one memory holds both the program and the numbers, and everything travels along the same buses, so the CPU can't fetch the next instruction while it is still reading or writing data. The Arduino's ATmega328P is Harvard: the program sits in Flash and the variables in SRAM, each with its own bus, so it can fetch the next instruction while it executes the current one. That is one reason it manages about one instruction per clock tick."
- "Modified" Harvard means there are ways to read data from program memory, for example the LPM instruction or PROGMEM constants in Arduino. Mention this only as a footnote.
- Practical consequence that learners will meet: Arduino code cannot run from SRAM, and large constant tables are put in Flash with PROGMEM. This is an inference; I did not source it here.

### Gaps
- I did not retrieve the ATmega328P memory sizes (32 KB Flash, 2 KB SRAM, 1 KB EEPROM) from a primary source, because the Microchip product page returned 403. Verify before citing.
- I did not retrieve a Nand to Tetris citation. The Hack computer is itself a Harvard design (separate ROM and RAM), which could be an interesting parallel, but it is unverified here.

## Q5. Hexadecimal: base 16, nibbles, conversions, the 0x prefix, uses

### Takeaway
Hex is base 16 with digits 0–9 and A–F (A=10 … F=15). One hex digit is exactly 4 bits (a nibble), so a byte is always 2 hex digits. People use hex because it is shorter and less error-prone than binary for humans, while it still maps exactly onto bits. In C/Arduino, hex constants are written with a leading `0x` (e.g. `0x7B`), and A–F may be upper or lower case. Common uses are MAC addresses (12 hex digits = 48 bits), HTML colour codes (#RRGGBB = 6 hex digits = 24 bits), error codes, memory addresses and dumps, URL %-encoding, and device addresses in datasheets (e.g. I²C 0x23).

### Cited Findings
- Arduino reference: hexadecimal (base 16) constants use a leading "0x", with the example 0x7B. Valid characters are 0–9 and A–F; A has the value 10, B 11, up to F 15; a–f may also be used. Worked example: `n = 0x101` is 257 decimal = (1×16²)+(0×16¹)+1. Constants without a prefix are assumed to be decimal. Binary uses a leading `0b` in the current reference; older pages used `B` (e.g. `B1111011`). — [Arduino docs: Integer Constants (raw)](https://docs.arduino.cc/language-reference/en/variables/constants/integerConstants/raw/); [Arduino reference (alt)](https://reference.arduino.cc/reference/en/language/variables/constants/integerconstants); [ArduinoGetStarted: Integer Constants](https://arduinogetstarted.com/reference/arduino-integer-constants) (0xCF2 = 3314)
- Uses of hex (Cambridge IGCSE-aligned). A MAC address is typically 12 hex digits, equivalent to 48 binary digits. An HTML colour code is 6 hex digits = 24 binary digits, e.g. #66FF33. Hex is used in URLs, where special characters are converted to hex codes prefixed with %. Long binary strings are easy to get wrong when written down. — [Save My Exams: Uses of Hexadecimal (CIE IGCSE)](https://savemyexams.com/igcse/computer-science/cie/23/revision-notes/1-data-representation/number-systems/uses-of-hexadecimal); [Save My Exams: Hexadecimal (CIE IGCSE)](https://www.savemyexams.com/igcse/computer-science/cie/23/revision-notes/1-data-representation/1-1-number-systems/hexadecimal)
- A Cambridge-style exam question accepts "It can be used to represent error codes" as a true statement about hexadecimal. — [Save My Exams: Number Systems exam questions (CIE IGCSE)](https://www.savemyexams.com/igcse/computer-science/cie/23/topic-questions/1-data-representation/number-systems/exam-questions/)
- The syllabus expects learners to explain why hex is used instead of binary. Examiner tip: give reasons such as "fewer digits" or "less chance of copying errors". — [Save My Exams: Hexadecimal (CIE IGCSE)](https://www.savemyexams.com/igcse/computer-science/cie/23/revision-notes/1-data-representation/1-1-number-systems/hexadecimal)
- Hex is used to display memory contents (memory dumps) for debugging. — [Scribd IGCSE notes (user-uploaded, lower reliability)](https://www.scribd.com/document/820755730/IGCSE-Computer-Science-Notes)

### Inferences
These are worked examples, verified arithmetically; check them again before publishing.
- Binary → hex: split into nibbles from the right. 1011 0110 → B 6 → 0xB6. Denary: 11×16 + 6 = 182.
- Hex → binary: 0x23 → 2 = 0010, 3 = 0011 → 0010 0011. Denary: 2×16 + 3 = 35. This links directly to the course's I²C address 0x23. A 7-bit I²C address fits in two hex digits: 0x00–0x7F.
- Denary → hex: 200 ÷ 16 = 12 remainder 8 → C8 → 0xC8 = 1100 1000.
- 0xFF = 1111 1111 = 255, the largest 1-byte value. Every byte is exactly 2 hex digits (00–FF), which ties to the course's 8-bit content.
- Colour: #FF0000 = red 255, green 0, blue 0. Each pair of hex digits is one byte (0–255) per colour channel.
- Address-bus link: with a 16-bit address bus, addresses run from 0x0000 to 0xFFFF (65,536 locations). Hex compresses those 16-bit addresses to 4 digits.

### Gaps
- I did not retrieve an I²C-specific primary source. Which sensor uses 0x23 (e.g. the BH1750 light sensor's default address) should come from the course's own component datasheet.
- I did not retrieve the official Cambridge syllabus wording for the hex learning objectives (only the Save My Exams paraphrase).

## Q6. Common learner misconceptions (buses and hex)

### Takeaway
I found few explicit "misconception" sources. The ones below come from exam-technique advice, plus inferences from the standard definitions. Treat the inference items as teacher guidance, not cited research.

### Cited Findings
- Learners lose marks by naming a bus without saying what it carries and in which direction. — [RevisionDojo](https://www.revisiondojo.com/student-faq/address-data-control-bus-functions)
- Register answers that do not state the actual values held in each register lose marks. — [Save My Exams OCR A-level FDE](https://savemyexams.com/a-level/computer-science/ocr/17/revision-notes/1-the-characteristics-of-contemporary-processors-input-output-and-storage-devices/1-1-structure-and-function-of-the-processor/fetch-decode-execute-cycle)
- In "why hex?" questions, the expected answer is about humans: fewer digits, easier to read, fewer copying errors. Computers do not store hex. — [Save My Exams: Hexadecimal (CIE IGCSE)](https://www.savemyexams.com/igcse/computer-science/cie/23/revision-notes/1-data-representation/1-1-number-systems/hexadecimal)
- Old Arduino `B` binary notation versus the current `0b` notation can confuse learners reading older sketches. — [Arduino docs: Integer Constants](https://docs.arduino.cc/language-reference/en/variables/constants/integerConstants/raw/)

### Inferences
Uncited; these are common misconceptions derived from the definitions above.
- "The address bus carries data": it carries only *where*, never *what*.
- "The data bus is one-way": it is two-way, carrying data in on a load or fetch and out on a store.
- "MAR holds data" or "PC holds the instruction": both hold addresses. The MDR holds the data, and the IR/CIR holds the instruction.
- "Wider data bus = more memory": the address bus width sets how many locations can be addressed. The data bus width sets how many bits move at once.
- "Hex is a different kind of data the computer uses": everything is still binary, and hex is only a shorthand for people.
- "0x23 is twenty-three": it is 35 in denary.
- "A1 in hex is a letter": hex letters are digit values (A = 10), not text characters.
- Off-by-one: 8 address lines give 256 locations, numbered 0–255 (0x00–0xFF), not 1–256.
- "1 instruction per clock tick always": that is true for most AVR instructions only, and not on most CPUs. This is already partly covered by the course's existing clock-speed misconception note.

### Gaps
- I found no peer-reviewed or exam-board examiner-report source listing bus or hex misconceptions. Cambridge principal examiner reports for 0478 would be the authoritative place to look; I did not retrieve them.
