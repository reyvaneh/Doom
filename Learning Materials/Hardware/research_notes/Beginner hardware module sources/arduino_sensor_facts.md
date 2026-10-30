# Arduino Uno R3 + LDR beginner lesson: board, sensor and citation facts (verified Oct 2026)

Fetch notes: the docs.arduino.cc language-reference pages returned 404s or empty pages to the fetch tool, so the reference text was read from Arduino's own source repo (github.com/arduino/reference-en). That repo is what docs.arduino.cc renders. The old www.arduino.cc/reference/... URLs now 301-redirect to docs.arduino.cc/language-reference/en/functions/analog-io/... The lowercase forms of those URLs 404'd. The Uno R3 PDF datasheet (A000066) wasn't machine-readable, so board specs come from the official Arduino Store page instead.

## Q1. Arduino Uno R3 board facts

### Takeaway
All of the following are confirmed from Arduino sources: 5 V operation, 6 analog inputs (A0–A5), a 10-bit ADC (0–1023), a DEFAULT reference of 5 V, about 100 µs per analogRead, 6 PWM pins (3, 5, 6, 9, 10, 11) at 490 Hz (980 Hz on pins 5 and 6), 20 mA per I/O pin, 50 mA from the 3.3 V pin, and a 500 mA USB polyfuse. The 40 mA per-pin and 200 mA total-chip figures only appear in secondary sources (SparkFun, resellers); I couldn't read them in the Microchip datasheet itself.

### Cited Findings
- Operating voltage 5 V; input voltage 7–12 V recommended, 6–20 V limit; 20 mA DC current per I/O pin; 50 mA DC current for the 3.3 V pin; 6 PWM digital I/O pins; 6 analog input pins. — [Arduino Store, UNO Rev3](https://store.arduino.cc/products/arduino-uno-rev3)
- USB protection: the store page says the board has a "resettable polyfuse" that protects the computer's USB port. Above 500 mA it breaks the connection until the short or overload is removed. — [Arduino Store, UNO Rev3](https://store.arduino.cc/products/arduino-uno-rev3)
- The board uses an ATmega328P with 14 digital I/O pins (6 of them PWM), 6 analog inputs and a 16 MHz ceramic resonator. — [Arduino Docs, UNO R3](https://docs.arduino.cc/hardware/uno-rev3/)
- analogRead table row: "UNO R3 | 5 Volts | A0 to A5 | 10 bits". The resolution is "5 volts / 1024 units", and the docs say "it takes about 100 microseconds (0.0001 s) to read an analog input". They also say a floating (unconnected) pin "will fluctuate". — [Arduino reference source, analogRead.adoc](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Analog%20IO/analogRead.adoc) (rendered at [docs.arduino.cc analogRead](https://docs.arduino.cc/language-reference/en/functions/analog-io/analogRead/))
- On AVR boards, "DEFAULT: the default analog reference of 5 volts (on 5V Arduino boards)". Other warnings: never apply less than 0 V or more than 5 V to AREF, and set EXTERNAL before calling analogRead() when using AREF. — [Arduino reference source, analogReference.adoc](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Analog%20IO/analogReference.adoc)
- analogWrite: "UNO (R3 and earlier), Nano, Mini | 3, 5, 6, 9, 10, 11 | 490 Hz (pins 5 and 6: 980 Hz)". On pins 5 and 6 the duty cycle is higher than expected at low values, so a value of 0 may not fully turn the output off. — [Arduino reference source, analogWrite.adoc](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Analog%20IO/analogWrite.adoc)
- ADC timing: the ATmega328P ADC clock must be 50–200 kHz for full resolution. A normal conversion takes 13 ADC clocks, and the first one takes 25. With Arduino's prescaler of 128, 16 MHz / 128 = 125 kHz, so 13 / 125 kHz ≈ 104 µs, or about 9.6 k samples/s in theory. — [UConn ECE3411 lecture](https://scl.engr.uconn.edu/courses/ece3411/material/Block4.pdf); [Nick Gammon, ADC conversion on the Arduino](https://www.gammon.com.au/adc)
- Per-pin and total-chip limits from a secondary source: "Maximum current for chip: 200mA. Maximum current per pin: 40mA. Recommended current per pin: 20mA." — [SparkFun RedBoard Plus Graphical Datasheet](https://cdn.sparkfun.com/assets/learn_tutorials/1/7/5/8/RedBoard_Plus_Graphical_Datasheet_v1a.pdf)
- **Conflict:** several resellers and clones list "40 mA per I/O pin" as the board spec. Examples are [DFRobot DFRduino UNO R3](https://wiki.dfrobot.com/dfr0216/), [Wiltronics](https://www.wiltronics.com.au/product/8305/arduino-uno-r3/) and [SuperDroid](https://www.superdroidrobots.com/electrical-parts/Programmable-Controllers/Arduino-Microcontrollers/product=1293). Arduino's official page says 20 mA ([Arduino Store](https://store.arduino.cc/products/arduino-uno-rev3)). 40 mA is the ATmega328P's *absolute maximum*, not a figure for normal operation.

### Inferences
- In the lesson, present 20 mA as "the safe working limit per pin (Arduino)". Mention 40 mA only as "the absolute maximum that causes damage (ATmega328P datasheet)". Don't present 40 mA as a design target.
- The ~100 µs conversion time is what limits sampling to roughly 10,000 analogRead calls per second. For an LDR, the sensor itself (20–30 ms response, see Q4) is the real limit.

### Gaps
- I couldn't read the 40 mA per-pin and 200 mA VCC/GND absolute-max values directly from the Microchip ATmega328P datasheet (DS40002061), because the PDF couldn't be fetched as text. Check them in the datasheet's "Absolute Maximum Ratings" section: https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf or the current DS40002061 at microchip.com.
- The official A000066 Uno R3 datasheet PDF wasn't machine-readable: https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf

## Q2. ADC formula: V/5×1023 or V/5×1024?

### Takeaway
The ATmega328P datasheet defines the conversion as ADC = Vin·1024/Vref. Code 0x3FF (1023) represents Vref minus one LSB, not Vref itself, so the exact inverse is V ≈ ADC × Vref/1024. Arduino's analogRead docs agree: they give the step as "5 volts / 1024 units". The common teaching formula V = ADC × 5.0/1023 is an approximation that maps 1023 to exactly 5.00 V. The difference is about 0.1 % (one LSB, ≈4.9 mV), which is negligible next to the ADC's own accuracy and the tolerance of the 5 V rail.

### Cited Findings
- Datasheet: single-ended result ADC = (VIN × 1024)/VREF. 0x000 represents analog ground and 0x3FF represents "the selected reference voltage minus one LSB". — Microchip AVR ADC documentation, summarised via [Microchip online docs (AVR ADC conversion result)](https://onlinedocs.microchip.com/oxy/GUID-6178B82B-1DE0-484B-ACA5-153F78A78E41-en-US-1/GUID-0BF4C5AD-4ECB-479B-A0A9-E33CD8200A60.html); discussed in [Arduino Forum, "Ottimizzare le letture dell'ADC"](https://forum.arduino.cc/t/ottimizzare-le-letture-delladc/218898). (The exact ATmega328P onlinedocs page I tried 404'd. The formula is the well-known one from the ATmega328P datasheet's "ADC Conversion Result" section.)
- Arduino gives the resolution as "5 volts / 1024 units" (≈4.9 mV per unit). — [Arduino analogRead.adoc](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Analog%20IO/analogRead.adoc)
- Arduino forum users still disagree about it: some say the datasheet formula should use 1023, but the thread leans towards 1024. — [Arduino Forum thread](https://forum.arduino.cc/t/ottimizzare-le-letture-delladc/218898)
- **Conflict:** Arduino's ReadAnalogVoltage example (not re-fetched here) uses `sensorValue * (5.0 / 1023.0)`, while the reference page says 5 V/1024 per step. Arduino's own materials are therefore inconsistent.

### Inferences
- Suggested wording for the lesson: "The ADC splits 0–5 V into 1024 steps of about 4.9 mV. A reading of 1023 means 'at or just below 5 V'. Converting with ×5/1023 or ×5/1024 differs by less than 0.1 %. Either is fine here, and your 5 V supply (often 4.8–5.1 V on USB) is a much bigger source of error."

### Gaps
- I didn't re-fetch the exact text of the ReadAnalogVoltage example in this session.

## Q3. Logic-level compatibility (5 V vs 3.3 V)

### Takeaway
The Uno R3 is a 5 V board. **The task brief's premise is wrong for the Uno R4: the Uno R4 Minima/WiFi also runs at 5 V.** Note, though, that its per-pin current limit is only 8 mA. ESP32 and Raspberry Pi GPIOs are 3.3 V and not 5 V tolerant, so they need a divider or level shifter.

### Cited Findings
- UNO R4 Minima: 5 V operating voltage, VIN 6–24 V, 48 MHz, "DC Current per I/O Pin 8 mA". — [Arduino Store, UNO R4 Minima](https://store-usa.arduino.cc/products/uno-r4-minima); [SunFounder UNO R4 component page](https://docs.sunfounder.com/projects/3in1-kit-r4/en/latest/components/component_uno.html)
- The UNO R4 uses the same PWM pins (3, 5, 6, 9, 10, 11) at 490 Hz. — [Arduino analogWrite.adoc](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Analog%20IO/analogWrite.adoc)
- Raspberry Pi: GPIO pins are "general-purpose 3.3 V pins, meaning outputs are set to 3.3 V and inputs are 3.3V-tolerant"; the docs also warn "Do not use 5V for 3.3V components". — [Raspberry Pi documentation](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html). The page doesn't explicitly say "not 5 V tolerant", but the community wiki does: [eLinux RPi Low-level peripherals (Scribd mirror)](https://www.scribd.com/document/181197260/Raspberry-Pi-Low-Level-Peripherals-eLinux).
- ESP32: an Espressif staff member advises using a resistor divider for 5 V signals. Forum consensus is that no ESP32 IO pin is 5 V tolerant. — [esp32.com, "Which pins are 5V tolerant?"](https://esp32.com/viewtopic.php?p=68290). **Conflict:** the module datasheet's VDD+0.3 rule implies 3.9 V max, but the chip datasheet's absolute maximum is lower (same thread).

### Inferences
- With a 5 V Uno, the divider midpoint swings 0–5 V. Copying the same circuit onto a 3.3 V board's 5 V rail could over-drive its ADC input. Tell learners to power the divider from the board's own logic voltage (3V3 on 3.3 V boards).
- If the module plans an R4 variant: the 330 Ω LED at ≈9 mA would exceed the R4's 8 mA per-pin rating. Suggest 470 Ω–1 kΩ for R4 boards.

### Gaps
- I didn't fetch Espressif's official datasheet table for ESP32 absolute-max GPIO input voltage.

## Q4. LDR (GL5528) characteristics; are 100 kΩ dark / 2 kΩ bright plausible?

### Takeaway
GL5528 datasheet values are about 10–20 kΩ at 10 lux, at least 1 MΩ dark (measured 10 s after the light is removed), gamma ≈0.6, about 20 ms rise and 30 ms fall. As illustrative values, 2 kΩ "bright" is plausible (roughly a well-lit room, ~100–300 lux). 100 kΩ "dark" fits a *dim* room, not true darkness. Label it "dim" or note that full darkness can exceed 1 MΩ.

### Cited Findings
- GL5528: light resistance 10–20 kΩ at 10 lux (after 2 h of 400–600 lux pre-exposure, standard light source A), dark resistance 1 MΩ, gamma 0.6, rise 20 ms, fall 30 ms. — [Rapid Electronics GL55 series datasheet 58-0134](https://static.rapidonline.com/pdf/58-0134_v1.pdf); [GL55 Series Photoresistor PDF](https://cdn.shopify.com/s/files/1/0699/1344/4452/files/GL55_Series_Photoresistor.pdf)
- Dark resistance "1MΩ Min" at 0 lux. — [Handson Technology GL55 guide](https://www.radiolocman.com/datasheet/data.html?di=632245)
- **Conflict:** some retailers quote 8–20 kΩ at 10 lux ([Makers Electronics](https://makerselectronics.com/ar/product/gl5528-photoresistor-sensor-ldr/)). Manufacturer-style datasheets say 10–20 kΩ.
- Gamma is defined as log(R10/R100)/log(100/10). — [Rapid datasheet](https://static.rapidonline.com/pdf/58-0134_v1.pdf)

### Inferences
- With gamma 0.6, R100 ≈ R10/10^0.6 ≈ R10/4, so about 2.5–5 kΩ at 100 lux and about 0.6–1.3 kΩ at 1000 lux (calculated from the datasheet gamma). 2 kΩ therefore sits around 150–300 lux, which is typical indoor lighting.
- Divider (10 kΩ to 5 V, LDR to GND, Vout = 5·R_LDR/(10k+R_LDR)):
  - 100 kΩ → 4.55 V → ≈930 counts.
  - 2 kΩ → 0.83 V → ≈170 counts.
  - 10–20 kΩ (10 lux) → 2.5–3.33 V → ≈512–683 counts.
  - 1 MΩ dark → 4.95 V → ≈1014 counts.
  - **The reading rises as it gets darker.** Point this out because beginners often expect the opposite.
- A 10 kΩ fixed resistor is close to the LDR's resistance around 10 lux, which gives the best sensitivity in dim-to-room lighting.

### Gaps
- No original Senba/Sunrom manufacturer PDF was fetched. Table columns in the PDFs were parsed from broken text layouts, so check them visually.

## Q5. Red LED forward voltage/current and resistor power

### Takeaway
A typical red 5 mm LED has Vf ≈ 1.8–2.2 V (typ. 2.0 V) and is rated 20 mA. With 330 Ω from 5 V, I ≈ (5 − 2.0)/330 ≈ 9 mA (8.5–9.7 mA across the Vf range). That is well within the Uno R3's 20 mA. Resistor power P = I²R ≈ (0.0091)² × 330 ≈ 27 mW, about 1/9 of a standard ¼ W (250 mW) resistor.

### Cited Findings
- SparkFun Basic Red 5 mm: forward voltage 1.8–2.2 V (typ. 2.0 V), 20 mA rated, 16–18 mA suggested. — [SparkFun COM-09590](https://www.sparkfun.com/led-basic-red-5mm.html)
- Kitronik red 5 mm: Vf 2.1 V, typical 20 mA, max 25 mA. — [Kitronik](https://kitronik.co.uk/?p=88765)
- CML V5752: 20 mA, 2 V, 635 nm. — [electronicsdatasheets.com](https://www.electronicsdatasheets.com/manufacturers/cml-innovative-technologies/parts/v5752)

### Inferences
- The calculation assumes the pin outputs a full 5 V. In practice the high-level output sags slightly under load, so the real current is a little below 9 mA (not sourced here).
- Under PWM the average current scales with duty cycle, and the peak stays ≈9 mA.

### Gaps
- No ATmega328P VOH-vs-current curve was fetched.

## Q6. Resolution vs accuracy vs precision; sampling; smoothing; calibration; hysteresis

### Takeaway
Arduino's own examples cover smoothing (a 10-sample running average) and calibration (min/max captured during the first 5 s, then constrain() and map() to 0–255 for an LED on pin 9). Calibration matches the lesson circuit's pin 9 directly. I found no Arduino-official hysteresis page. Present hysteresis as a standard technique: use two thresholds, e.g. turn on below 400 and off above 450.

### Cited Findings
- Resolution: 10 bits, 5 V/1024 ≈ 4.9 mV per step. — [Arduino analogRead.adoc](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Analog%20IO/analogRead.adoc)
- Smoothing example: `numReadings = 10`, a circular buffer with a running total (subtract the oldest reading, add the newest, average = total/numReadings using integer division). The comments note that more readings give smoother output but slower response. — [Arduino Smoothing.ino](https://raw.githubusercontent.com/arduino/arduino-examples/main/examples/03.Analog/Smoothing/Smoothing.ino) (docs page: https://docs.arduino.cc/built-in-examples/analog/Smoothing/)
- Calibration example: during `while (millis() < 5000)` it tracks sensorMin (starts at 1023) and sensorMax (starts at 0) with pin 13 HIGH. It then applies `constrain()` and `map(..., 0, 255)` and calls `analogWrite(9, ...)`, reading A0. — [Arduino Calibration.ino](https://raw.githubusercontent.com/arduino/arduino-examples/main/examples/03.Analog/Calibration/Calibration.ino) (docs page: https://docs.arduino.cc/built-in-examples/analog/Calibration/)
- The 5 V rail is the ADC reference by default, so any supply error shows up as a reading error. — [Arduino analogReference.adoc](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Analog%20IO/analogReference.adoc)

### Inferences
- Suggested definitions for teaching:
  - **Resolution:** the smallest step, 4.9 mV.
  - **Accuracy:** how close a reading is to the truth. It depends on Vref/USB 5 V tolerance and ADC error.
  - **Precision/repeatability:** how much repeated readings scatter (noise).
  - Averaging improves precision but not accuracy. Calibration addresses accuracy and range.
- An LDR responds in about 20–30 ms, so sampling every 10–50 ms is plenty.

### Gaps
- Not sourced here: the ATmega328P absolute-accuracy figure (±2 LSB per the datasheet, from memory, not verified) and an authoritative hysteresis/Schmitt-trigger reference (e.g. an SparkFun or Adafruit page).

## Q7. Wikimedia Commons image credits

### Takeaway
Both images are confirmed as CC BY-SA 4.0, "Own work". The authors are "Shoot stufz" and "Suyash Dwivedi".

### Cited Findings
- File:Arduino_Uno_R3_development_board_03.jpg: author **Shoot stufz**, licence **CC BY-SA 4.0**, source "Own work". The current version was uploaded 11 Dec 2025 by user Decodeme, so the uploader differs from the named author. The listed date is a bogus "30 November 1899", and the metadata date is unknown. — [Commons file page](https://commons.wikimedia.org/wiki/File:Arduino_Uno_R3_development_board_03.jpg)
- File:25mm_light-dependent_resistor_(LDR)_(2).jpg: author **Suyash Dwivedi** (User:Suyash.dwivedi), licence **CC BY-SA 4.0**, "Own work", taken and uploaded 15 Dec 2025. — [Commons file page](https://commons.wikimedia.org/wiki/File:25mm_light-dependent_resistor_(LDR)_(2).jpg)

### Inferences
- Suggested credit lines:
  - "Arduino Uno R3 development board 03" by Shoot stufz, CC BY-SA 4.0, via Wikimedia Commons.
  - "25mm light-dependent resistor (LDR)" by Suyash Dwivedi, CC BY-SA 4.0, via Wikimedia Commons.
- Link to https://creativecommons.org/licenses/by-sa/4.0/ and say if either image was modified. Under ShareAlike, modified versions must be released under the same licence.

### Gaps
- None.

## Q8. Subsumption citation check and canonical reference

### Takeaway
The Oikawa et al. citation is real. It was published in the *Journal of the Robotics Society of Japan* 23(6), pp. 697–705 (2005), DOI 10.7210/jrsj.23.697, with the first author's given name Kazumi. It is a niche Japanese-language paper. The canonical reference is Brooks (1986), IEEE Journal of Robotics and Automation 2(1):14–23.

### Cited Findings
- "Object-Oriented Design of Subsumption Architecture", by Kazumi Oikawa (Yamagata Univ.), Takeshi Tsuchiya (Hokkaido Institute of Technology) and Shigenori Okubo (Yamagata Univ.). *Journal of the Robotics Society of Japan*, vol. 23, no. 6, pp. 697–705, published 15 Sep 2005, DOI 10.7210/jrsj.23.697. — [J-STAGE](https://www.jstage.jst.go.jp/article/jrsj1983/23/6/23_6_697/_article)
- R. A. Brooks, "A robust layered control system for a mobile robot", *IEEE Journal of Robotics and Automation* (IEEE Xplore lists it as "IEEE Journal on Robotics and Automation"), vol. 2, no. 1, pp. 14–23, March 1986. — [IEEE Xplore 1087032](https://ieeexplore.ieee.org/document/1087032); free PDF at [UC Davis mirror](https://mae.engr.ucdavis.edu/dsouza/brooks.pdf); earlier version MIT AI Memo 864 (Sept 1985) at [MIT DSpace](https://dspace.mit.edu/entities/publication/362a32d0-a821-4a9d-a5ff-9e2b71c5539d)

### Inferences
- The DOI is probably 10.1109/JRA.1986.1087032, inferred from the IEEE Xplore document ID and IEEE's usual pattern. It wasn't shown in the fetched results.

### Gaps
- Brooks DOI not directly confirmed. The Japanese title of the Oikawa paper wasn't on the fetched page.
