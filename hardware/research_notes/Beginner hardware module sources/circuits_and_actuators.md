# Circuit Foundations and Actuator Integration (Arduino Uno-style, 5 V)

Research date: 2026-10-22. Note on sources: docs.arduino.cc pages render client-side and WebFetch could not read them, so Arduino facts below come from Arduino's own GitHub reference source (the source behind docs.arduino.cc), the Servo library source, the Arduino Playground, and store pages. Manufacturer PDF datasheets (onsemi P2N2222A, Diodes Inc 1N4001) could not be text-extracted. Figures marked **[UNVERIFIED]** are from general knowledge and should be checked against the datasheet before publication.

## Q1. Series and parallel circuits: rules and a worked example

### Takeaway
In series the same current flows through every resistor and the resistances add (R_total = R1 + R2 + …). In parallel every branch sees the same voltage, the currents add, and 1/R_total = 1/R1 + 1/R2 + … (two resistors: R1·R2/(R1+R2)). The parallel total is always smaller than the smallest resistor.

### Cited Findings
- Series components share a node and carry the same current. Total series resistance is the sum of all N resistors, e.g. 10 kΩ + 10 kΩ = 20 kΩ — [SparkFun: Series and Parallel Circuits](https://learn.sparkfun.com/tutorials/series-and-parallel-circuits/all)
- Parallel components "all have the same voltage drop across them." 1/Rtot = 1/R1 + 1/R2 + … + 1/RN, and for two resistors R1·R2/(R1+R2) — [SparkFun](https://learn.sparkfun.com/tutorials/series-and-parallel-circuits/all)
- The total of two parallel resistors with different values "is always less than the smallest value resistor" — [SparkFun](https://learn.sparkfun.com/tutorials/series-and-parallel-circuits/all)
- Numbers SparkFun gives: 10 kΩ ∥ 10 kΩ = 5 kΩ. Three, four and five 10 kΩ in parallel give 3.33 kΩ, 2.5 kΩ and 2 kΩ. With 10 V across one 10 kΩ the current is 1 mA. Adding a second 10 kΩ in parallel doubles the supply current to 2 mA — [SparkFun](https://learn.sparkfun.com/tutorials/series-and-parallel-circuits/all)
- Parallel resistors of unequal value don't share power equally: 1 kΩ ∥ 10 kΩ means the 1 kΩ draws 10× the current and dissipates 10× the power — [SparkFun](https://learn.sparkfun.com/tutorials/series-and-parallel-circuits/all)
- Series voltages adding (KVL) is **not** stated explicitly on the SparkFun page; it only makes that point for series capacitor voltage ratings. Cite a KVL source such as the All About Circuits textbook (not fetched) for that point.

### Inferences (worked example — my own arithmetic using Ohm's law V = I·R)
- **Series, 5 V supply, R1 = 1 kΩ, R2 = 2 kΩ:** R_total = 3 kΩ. I = 5 V / 3 kΩ ≈ 1.67 mA through both resistors. V_R1 = 1.67 mA × 1 kΩ ≈ 1.67 V and V_R2 ≈ 3.33 V. These sum to 5 V, and the larger resistor takes the larger share. This is also a voltage divider.
- **Parallel, same parts:** R_total = (1k·2k)/(1k+2k) ≈ 667 Ω, less than 1 kΩ. Both resistors see 5 V. I_R1 = 5 mA, I_R2 = 2.5 mA, total 7.5 mA (5 V / 667 Ω ≈ 7.5 mA ✓).

### Gaps
- No primary page for the series voltage-sum rule was fetched (All About Circuits was suggested but not retrieved).

## Q2. Basic electrical safety for low-voltage student electronics

### Takeaway
Mains is out of scope. Disconnect power before building or changing a circuit. Check wiring before powering up. Watch for accidental shorts, especially from batteries, which have no current limiting. If something smokes, cut power with a non-conducting object. Treat LiPo/Li-ion cells with care: no shorting, puncturing or crushing, use only a compatible charger, and retire swollen packs.

### Cited Findings
- "Always make sure power is disconnected when constructing or modifying your experimental circuit." Leaving power on while making changes can damage components or cause shock — university lab manuals summarised via search; see [UIUC ECE 110 Electronics Lab Safety](https://courses.engr.illinois.edu/ece110/content/labs/archive/Skill_Safety_ElectronicsLab.pdf) and [McMaster Physics lab chapter 5](https://physics.mcmaster.ca/phy4d6/Lab/chapter5.htm)
- The most common serious wiring mistake is shorting a battery's + and − through a non-obvious breadboard path. Batteries have no protection and "can supply enough current to burn up components or melt a breadboard" — [UIUC ECE 110](https://courses.engr.illinois.edu/ece110/content/labs/archive/Skill_Safety_ElectronicsLab.pdf)
- On smoke or a burning smell: disconnect the source with a pencil or other non-conducting object, don't touch the parts (they may be hot), and have staff check before re-powering — [UIUC ECE 110](https://courses.engr.illinois.edu/ece110/content/labs/archive/Skill_Safety_ElectronicsLab.pdf)
- "Treat all circuits as energized unless switched OFF and verified." Avoid loose jumper wires that can cause shorts. Before energising, get connections verified and set supply knobs to zero or minimum — [BUET Circuit Laboratory SOP](https://eee.buet.ac.bd/facilities/laboratory-safety/sop0526/Circuit_Laboratory.pdf)
- Build and check the breadboard circuit first, then connect the sources — [Gaziantep Univ. EEE lab doc](https://akbis.gaziantep.edu.tr/yonetim/upload/files/382968-8081.docx)
- Li-ion/LiPo: do not strike, crush, puncture or disassemble the cell, and do not short circuit it. Use a charger "clearly specified to be compatible," with voltage, current and temperature protection. If the cell becomes discolored, deformed or abnormal, remove it and stop using it. Heat can lead to "fire or explosion" — [Adafruit: Li-Ion & LiPoly Batteries](https://learn.adafruit.com/li-ion-and-lipoly-batteries/conclusion)
- The Uno's resettable USB polyfuse breaks the connection if more than 500 mA is drawn, until the short or overload is removed — [Arduino Store: UNO Rev3](https://store.arduino.cc/uno-rev3)
- Mains warning for relays: the ECE/hobby sources above concern low voltage only. See Q8 for the relay-module mains caution.

### Inferences
- Polarity: reverse-connected electrolytic capacitors, LEDs, diodes and supplies are common beginner failures. I found no single fetched source covering polarity, so it sits under Inferences. The checklist "wire → check (colour-coded red/black, polarity, no shorts) → power → observe" follows from the cited rules.
- Suggested classroom rule: unplug USB/battery before rewiring. Batteries have no current limit (UIUC), so use a fused or current-limited bench supply or USB where possible.

### Gaps
- No primary source fetched on LiPo over-discharge limits or storage/charging-bag practice. The Adafruit page doesn't mention over-discharge.

## Q3. Power budgeting and the USB 500 mA limit

### Takeaway
Add up the worst-case current of everything powered from the Uno's 5 V and compare the total with the USB limit (500 mA polyfuse). Also check that each GPIO pin stays within its limits: 20 mA is the practical figure and 40 mA the absolute maximum, with per-port and 200 mA VCC/GND totals. Motors, servos and relays usually don't belong on that budget at all.

### Cited Findings
- Uno USB polyfuse trips above 500 mA — [Arduino Store: UNO Rev3](https://store.arduino.cc/uno-rev3); also [Digi-Key A000066 reference design](https://www.digikey.cn/reference-designs/en/open-source-mcu-platforms/2481)
- ATmega328P: absolute maximum "DC Current per I/O Pin ... 40.0 mA". VCC/GND pins are rated 200 mA each. Port-group source totals are 150 mA (two groups) and sink totals 100 mA (three groups). The test condition is 20 mA at 5 V, and "Pins are not guaranteed to source current greater than the listed test condition." — [Arduino Playground: Pin Current Limitations](https://playground.arduino.cc/Main/ArduinoPinCurrentLimitations/)
- 20 mA recommended / 40 mA max per pin — [SparkFun RedBoard Plus Graphical Datasheet](https://cdn.sparkfun.com/assets/learn_tutorials/1/7/5/8/RedBoard_Plus_Graphical_Datasheet_v1a.pdf) (secondary)

### Inferences (worked example — numbers marked are assumptions)
| Load | Current (approx.) | Source / basis |
|---|---|---|
| Uno board itself | ~50 mA **[UNVERIFIED]** | Commonly quoted. No primary source fetched; measure with a USB meter. |
| 1 red LED + 220 Ω on 5 V | (5 − ~2.0 V)/220 Ω ≈ 14 mA | Ohm's law; red LED Vf ≈ 2 V is an assumption, so check the LED datasheet |
| Small sensor (e.g. ultrasonic module) | ~15 mA **[UNVERIFIED]** | Check the module's datasheet |
| Small 9 g servo, idle → moving/stall | ~10 mA idle, up to hundreds of mA to >1 A under load | [SparkFun Hobby Servo](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial/all) |
| **Total without servo** | ≈ 80 mA → well under 500 mA | |
- Lesson: LED + sensor + board fit comfortably on USB. Adding a servo or motor can push transient current toward or over 500 mA and cause brown-out resets, which is why Q9/Q10 recommend a separate supply.
- Add a 20–25 % margin and use worst-case (stall/start) currents, not running currents.

### Gaps
- Official Uno quiescent current, 5 V regulator capacity on barrel-jack input, and 3.3 V pin current (often quoted as 50 mA) were not verified from a primary page (docs.arduino.cc Tech Specs didn't render).

## Q4. Common ground

### Takeaway
When the motor or servo runs from its own supply, connect that supply's negative to the Arduino GND. A control signal is a voltage relative to ground, so without a shared reference the transistor/driver input isn't defined.

### Cited Findings
- Run the processor and servos from separate supplies "(but be sure to have a common ground between them)" — [SparkFun Hobby Servo Tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial/all)
- Don't power a relay coil from the Arduino 5 V, which is for logic and sensors. Use a separate supply with common ground — Arduino forum advice summarised via search, [forum.arduino.cc](https://forum.arduino.cc/t/are-flyback-diodes-needed-in-my-circuit/682772) (community source, lower authority)
- Give each servo a direct supply connection ("star power") rather than a daisy chain — [SparkFun Hobby Servo](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial/all)

### Inferences
- Connect grounds only, never the two positive rails together.
- Route heavy motor return current directly to the motor supply's negative, joining the Arduino GND at one point. This keeps motor noise out of logic ground (standard practice, not explicitly sourced).

### Gaps
- No TI/ADI grounding app note was fetched.

## Q5. Why GPIO pins can't drive motors (and LEDs/buzzers that they can)

### Takeaway
A GPIO pin is a signal source. It is rated about 20 mA continuous (40 mA absolute maximum). Even small DC motors draw 100s of mA, and far more at start or stall. They also generate inductive voltage spikes, so use a transistor, MOSFET or driver IC.

### Cited Findings
- The motor "is likely to use more power than an Arduino digital output can handle directly." A PN2222 is used as the switch, with a diode across the motor to short out the reverse spike — [Adafruit Arduino Lesson 13: DC Motors](https://learn.adafruit.com/adafruit-arduino-lesson-13-dc-motors/transistors)
- Pin limits: 40 mA absolute max, 20 mA test condition — [Arduino Playground](https://playground.arduino.cc/Main/ArduinoPinCurrentLimitations/)
- LED with a series resistor in a low-side NPN example. Base current of "1mA to 10mA will usually be enough" for switching — [SparkFun: Transistors](https://learn.sparkfun.com/tutorials/transistors/all)
- **Buzzers:** an active buzzer has an internal oscillator and sounds a fixed tone when powered, so switch it with digitalWrite(). A passive buzzer needs the microcontroller to supply the frequency with tone() or PWM. tone() gives no pitch control on an active buzzer. Sources disagree on details of construction (electromagnetic vs piezo) — [Robocraze: Active vs Passive Buzzer](https://robocraze.com/blogs/post/active-vs-passive-buzzer-the-difference-explained) (vendor blog), [Circuit Digest](https://circuitdigest.com/microcontroller-projects/understanding-difference-between-active-and-passive-buzzer-with-arduino), [Deep Blue Embedded](https://deepbluembedded.com/active-buzzer-vs-passive-buzzer/)

### Inferences
- A single LED (~10–15 mA with 220–330 Ω) and a small piezo buzzer can run directly from a pin. Check the buzzer's rated current: magnetic active buzzers can draw ~30 mA or more and are best driven via a transistor **[UNVERIFIED — check part datasheet]**.

### Gaps
- No primary manufacturer datasheet fetched for buzzer current; the buzzer sources are blogs/vendors.

## Q6. Low-side NPN switch (2N2222/PN2222) — base resistor math, plus logic-level MOSFET alternative

### Takeaway
Wiring: Arduino pin → base resistor → NPN base. Emitter to GND (common ground). Collector to motor (−). Motor (+) to the separate supply (+). 1N4001 across the motor with its cathode to supply (+). For hard saturation, size the base current for a forced beta of ~10 (I_B ≈ I_C/10). For a 150 mA motor this means ~15 mA and ~270–330 Ω, not 1 kΩ. A 1 kΩ resistor only gives ~4.3 mA, which suits loads up to ~40–80 mA such as relays. For 150–200 mA+ a logic-level MOSFET is the cleaner beginner choice.

### Cited Findings
- 2N2222A: I_C max 600 mA, V_CE 40 V, P_tot 500 mW (T_amb ≤ 25 °C) per the ST datasheet. The PN2222/P2N2222 is the plastic TO-92 version with "lower maximum collector current." The P2N2222 has emitter and collector swapped versus the metal-can 2N2222, so check the pinout — [Wikipedia: 2N2222](https://en.wikipedia.org/wiki/2N2222) (citing ST 2N2222A datasheet, Feb 2022)
- VBE ≈ 0.6 V at room temperature (estimate). The base resistor is mandatory ("Don't forget to add this resistor!"). In saturation the transistor "acts like a short circuit between collector and emitter." The NPN-to-ground arrangement "is called a low-side switch" — [SparkFun: Transistors](https://learn.sparkfun.com/tutorials/transistors/all)
- PN2222 used to switch a small DC motor from an Arduino, with a diode across the motor — [Adafruit Lesson 13](https://learn.adafruit.com/adafruit-arduino-lesson-13-dc-motors/transistors)
- **[UNVERIFIED — datasheet PDF could not be parsed]** onsemi P2N2222A typical datasheet values: hFE min 100 at I_C = 150 mA, V_CE = 10 V. hFE min 40 at 500 mA. V_CE(sat) max 0.3 V at I_C = 150 mA, I_B = 15 mA (note the spec is tested at a forced beta of 10). V_CE(sat) max 1.0 V at 500 mA / 50 mA. V_BE(sat) max ~1.2 V at 150 mA / 15 mA. Source to verify: [onsemi P2N2222A datasheet](https://www.onsemi.com/download/data-sheet/pdf/p2n2222a-d.pdf)
- IRLB8721 logic-level N-MOSFET: 30 V, 62 A, R_DS(on) as low as ~8.7 mΩ (depends on V_GS), V_GS(th) max 2.35 V. It can be driven directly from 2.8/3.3/5 V logic — [Adafruit product 355](https://www.adafruit.com/product/355)

### Inferences (worked example — my own arithmetic)
Motor: 6 V hobby motor drawing ~150 mA running from a 4×AA pack (separate supply).
1. Target forced beta 10 → I_B = 150 mA / 10 = 15 mA. This is within the 20 mA pin guideline.
2. R_B = (V_pin − V_BE) / I_B. Using V_BE ≈ 0.7 V (SparkFun's ~0.6 V; V_BE(sat) at 15 mA can be higher, so this is conservative), R_B = (5 − 0.7) / 0.015 ≈ 287 Ω → use **270 Ω or 330 Ω** (330 Ω gives ≈ 13 mA, forced beta ≈ 11.5).
3. Check the provided 1 kΩ suggestion: I_B = 4.3 V / 1 kΩ ≈ 4.3 mA → forced beta ≈ 35 at 150 mA. With hFE(min) ≈ 100 it will *probably* saturate, but V_CE(sat) is not guaranteed (the datasheet spec assumes I_B = I_C/10), and stall/start current (often 3–5× running current, unverified) will pull it out of saturation and heat it. **Verdict: 1 kΩ is fine for a ~70 mA relay coil (forced beta ≈ 16) but undersized for a 150–200 mA motor.** Use 270–330 Ω or a MOSFET.
4. At 200 mA, forced beta 10 needs 20 mA, which is right at the pin's practical limit. That makes it a good teaching point for switching to a MOSFET.
5. Dissipation check: at 150 mA × ~0.3 V ≈ 45 mW, well under the ~500–625 mW rating.
6. **MOSFET version:** pin → 100–220 Ω gate resistor → IRLB8721 gate, with a 10 kΩ gate-to-source pull-down. The pull-down keeps the motor off while the Arduino resets or the pin floats. Source to GND, drain to motor (−), flyback diode across the motor. The gate resistor and pull-down values are common practice and were not sourced from a fetched page.
- IRLZ44N is often recommended as a logic-level alternative. It was not verified this session, so confirm R_DS(on) at V_GS = 5 V in the Infineon datasheet. Avoid the non-logic-level IRF540/IRFZ44N for 5 V gate drive (common-knowledge caution, unverified).

### Gaps
- Exact P2N2222A/PN2222A I_C, hFE and V_CE(sat) table values need verification from the onsemi PDF. The PDF was binary and not parsable here.
- IRLZ44N specs not fetched.

## Q7. Flyback diode across inductive loads (motors, relays, solenoids)

### Takeaway
Switching off an inductor forces V = −L·dI/dt, which produces a spike much larger than the supply. A reverse-biased diode across the coil (cathode to +supply, anode to the transistor/collector side) gives the current a loop to decay in, clamping the spike to ~1 diode drop. The 1N4001 (1 A) is the standard beginner part.

### Cited Findings
- Interrupting inductor current produces V_L = −L dI/dt, and the spike "can be much larger than the battery voltage." The diode is reverse-biased in normal operation and forward-biased by the spike. Current recirculates and dissipates in the winding resistance, and the voltage is clamped to about one diode forward voltage. Drawback: it "can noticeably delay the release of the relay" — [Wikipedia: Flyback diode](https://en.wikipedia.org/wiki/Flyback_diode)
- The diode across the motor "protects against this, by shorting out any such reverse current from the motor" — [Adafruit Lesson 13](https://learn.adafruit.com/adafruit-arduino-lesson-13-dc-motors/transistors)
- Relay flyback wiring: cathode to positive supply, anode to the negative (switched) side of the coil. Most commercial relay modules already include the diode — [Zbotic: Flyback diode](https://zbotic.in/flyback-diode-protecting-relays-and-transistors-explained/) (vendor blog)
- 1N4001–1N4007: 1.0 A rectifier, 30 A peak surge — Diodes Inc datasheet metadata, [ds28002.pdf](https://www.diodes.com/assets/Datasheets/ds28002.pdf)
- **[UNVERIFIED — datasheet body not parsed]** 1N4001 V_RRM = 50 V, V_F ≈ 1.0–1.1 V max at 1 A. Confirm from the [Diodes Inc datasheet](https://www.diodes.com/assets/Datasheets/ds28002.pdf)

### Inferences
- The diode's current rating should be ≥ the load current; a 1N4001 covers small motors. A 1N4148 is adequate for small relay coils (~70 mA).
- Common student error: a diode installed backwards shorts the supply through the diode whenever the transistor turns on.

### Gaps
- No TI app note on inductive kickback fetched.

## Q8. Relays and relay modules

### Takeaway
A 5 V relay coil typically draws ~70–100+ mA, which is above the 20 mA (40 mA max) GPIO rating. Drive it with an NPN/MOSFET plus a flyback diode, or use a relay module that has these onboard. Switching mains through relay contacts is out of scope for beginners.

### Cited Findings
- The common Songle SRD-05VDC-SL-C coil is ≈ 70 Ω and draws ≈ 70 mA at 5 V (search summary of datasheet values). Other sources quote 70–100 mA, and one quotes ~150 mA — [Flux.ai SRD-05VDC-SL-C](https://www.flux.ai/jecstronic/srd-05vdc-sl-c); [Instructables: Driving a Relay With an Arduino](https://instructables.com/Driving-a-Relay-With-an-Arduino); [Electromaker](https://www.electromaker.io/project/view/driving-a-relay-with-an-arduino)
- Typical driver: 2N2222/PN2222 with ~680 Ω–1 kΩ base resistor and a 1N4007/1N4148 flyback diode. Most relay modules already include the diode — [Zbotic](https://zbotic.in/flyback-diode-protecting-relays-and-transistors-explained/); [Instructables](https://instructables.com/Driving-a-Relay-With-an-Arduino)
- Relay coil supply should be separate from Arduino logic 5 V, with common ground — [Arduino forum thread](https://forum.arduino.cc/t/are-flyback-diodes-needed-in-my-circuit/682772)

### Inferences
- 70 mA coil with a 1 kΩ base resistor: I_B ≈ 4.3 mA → forced beta ≈ 16, adequate saturation (my arithmetic).
- Mains warning: a relay's contact rating (e.g. "10 A 250 VAC" printed on the part) doesn't make cheap modules or breadboard wiring safe for mains. Creepage, enclosure and strain relief all matter. Teach relays switching only low-voltage DC loads (e.g. a 12 V lamp). This is policy advice, not sourced.

### Gaps
- No primary manufacturer datasheet for the SRD-05VDC coil fetched directly; values come from search summaries.

## Q9. DC motors and motor-driver modules (L298N vs TB6612FNG vs DRV8833)

### Takeaway
For bidirectional or speed control use an H-bridge driver. The L298N is a cheap, robust, old bipolar design that can handle up to 46 V but drops ~1.4–3 V. The TB6612FNG and DRV8833 are MOSFET drivers with much lower drop, built-in protection and logic-voltage flexibility. They suit small 3–12 V robot motors.

### Cited Findings
- **L298 (ST):** supply up to 46 V, total DC current up to 4 A. Separate logic supply. Logic "0" up to 1.5 V (TTL-compatible). Drives relays, solenoids, motors — [ST L298 product page](https://www.st.com/en/motor-drivers/l298.html)
- **L298N drop:** bipolar output stages drop ~1.4–2 V (some sources say 1.4–3 V), so a 6 V supply leaves ~4–4.6 V at the motor. Vendor-blog figures vary — [Zbotic comparison](https://zbotic.in/motor-driver-ic-comparison-l298n-vs-drv8833-vs-tb6612fng/) (vendor blog, verify against the ST datasheet saturation-voltage table); [circuit.rocks L298N](https://docs.circuit.rocks/motors/l298n/)
- **TB6612FNG:** motor voltage 4.5–13.5 V (poor with 3 V motors), 1.2 A continuous per channel, 3 A peak for ~20 ms. Logic 2.7–5 V. Built-in kickback diodes — [Adafruit TB6612 breakout](https://learn.adafruit.com/adafruit-tb6612-h-bridge-dc-stepper-motor-driver-breakout/overview)
- **DRV8833 (TI):** 2.7–10.8 V supply (11.8 V abs max). Dual H-bridge. 1.5 A RMS / 2 A peak per bridge (HTSSOP/WQFN), or 500 mA RMS in the TSSOP package. R_DS(on) 360 mΩ (HS+LS). Protection for overcurrent/short, UVLO and overtemperature with a fault pin. Current regulation — [TI DRV8833 product page](https://www.ti.com/product/DRV8833)
- SparkFun notes that a well-designed H-bridge needs flyback diodes and more besides — [SparkFun Transistors](https://learn.sparkfun.com/tutorials/transistors/all)

### Inferences
- For a 2-motor beginner robot on 4×AA (6 V), TB6612FNG or DRV8833 modules give more motor voltage and run cooler than an L298N. The L298N remains popular because it's cheap and tolerant of higher voltages and abuse.
- Most L298N modules include an onboard 5 V regulator and jumper. Their exact behaviour varies by board, so check the module documentation (unverified).

### Gaps
- ST L298 datasheet V_CE(sat) table not parsed. The L298N drop figure comes from vendor blogs.

## Q10. PWM: duty cycle, analogWrite, frequencies, brightness/speed

### Takeaway
PWM rapidly switches a pin between 0 V and 5 V. Duty cycle is the percentage of each period the signal is high. analogWrite(pin, 0–255) sets the duty cycle (0 = always off, 255 = always on), so 128 ≈ 50 % and the average ≈ 2.5 V. On the Uno R3, PWM pins are 3, 5, 6, 9, 10 and 11, at 490 Hz, except pins 5 and 6 at 980 Hz.

### Cited Findings
- analogWrite value: "between 0 (always off) and 255 (always on)." Uno R3 PWM pins are 3, 5, 6, 9, 10 and 11. Most run at 490 Hz, pins 5 and 6 at 980 Hz. UNO R4 Minima/WiFi uses the same pins, all at 490 Hz. Pins 5/6 "will have higher-than-expected duty cycles" because millis()/delay() share that timer, so 0 may not fully turn them off. analogWrite has nothing to do with analog input pins — [Arduino reference source: analogWrite](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Analog%20IO/analogWrite.adoc) (the source for [docs.arduino.cc analogWrite](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogWrite/))
- Duty cycle is "the percentage of time a digital signal is on over an interval or period of time." 100 % equals a steady 5 V and 0 % equals ground. 50 % is "an ideal square wave." "You can control the brightness of an LED by adjusting the duty cycle," and the frequency must be high enough to avoid visible blinking — [SparkFun: Pulse Width Modulation](https://learn.sparkfun.com/tutorials/pulse-width-modulation/all)

### Inferences
- 128/255 ≈ 50.2 % → average ≈ 0.502 × 5 V ≈ 2.51 V. V_avg = duty × V_high (my arithmetic; SparkFun doesn't state the average-voltage formula). The Arduino "Basics of PWM" page ([docs.arduino.cc/learn/microcontrollers/analog-output](https://docs.arduino.cc/learn/microcontrollers/analog-output/)) is the canonical citation but could not be rendered.
- 490 Hz → period ≈ 2.04 ms; 980 Hz → ≈ 1.02 ms.
- Motor speed: PWM into the transistor/MOSFET gate or driver enable pin varies average motor voltage, and so speed. Motors may not start at low duty cycles. LED brightness is perceived non-linearly.

### Gaps
- Arduino's own "Basics of PWM" article text couldn't be retrieved for direct quoting.

## Q11. Servos: pulse-width control, Servo library, power

### Takeaway
Hobby servos read a pulse every 20 ms (50 Hz). Nominally 1 ms sets one end, 1.5 ms centre and 2 ms the other end. The Arduino Servo library defaults to a wider 544–2400 µs range for write(0..180). Power anything bigger than a tiny unloaded micro-servo from a separate 5–6 V supply with common ground. On the Uno, the Servo library disables analogWrite on pins 9 and 10.

### Cited Findings
- Pulses "vary between 1 and 2 mSec in width." Centre at 1.5 ms. Pulses repeat at 20 ms (50 Hz). Some servos accept wider ranges — [SparkFun: Hobby Servo Tutorial](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial/all)
- An unloaded small servo may draw ~10 mA; loaded or stalled servos can draw ≥1 A and sag the supply. Provide "at least one Ampere per servo" and keep the supply ≤ 5.5 V when it's shared with a microcontroller. Use separate supplies with common ground — [SparkFun Hobby Servo](https://learn.sparkfun.com/tutorials/hobby-servo-tutorial/all)
- Servo library: MIN_PULSE_WIDTH 544 µs, MAX_PULSE_WIDTH 2400 µs, DEFAULT_PULSE_WIDTH 1500 µs, REFRESH_INTERVAL 20000 µs. "analogWrite of PWM on pins associated with the timer are disabled when the first servo is attached." — [Arduino Servo library source, Servo.h](https://raw.githubusercontent.com/arduino-libraries/Servo/master/src/Servo.h)

### Inferences
- On AVR Uno the library uses Timer1, so PWM on pins 9 and 10 is lost. Arduino's Servo reference ([docs.arduino.cc/libraries/servo](https://docs.arduino.cc/libraries/servo/)) states this, but the page didn't render for direct verification.
- Minimal sketch pattern: `#include <Servo.h>`, `Servo s;`, `s.attach(9);`, `s.write(90);` (centre). `writeMicroseconds(1500)` is the explicit form.

### Gaps
- Uno-specific pin 9/10 statement not directly fetched (inferred from library behaviour and widely documented).
