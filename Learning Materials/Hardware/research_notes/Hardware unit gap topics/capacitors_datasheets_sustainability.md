# Hardware unit gap topics: capacitors, reading a datasheet, sustainability / e-waste

Context: these notes support new beginner sections for an Arduino Uno R3 automatic light indicator (GL5528 LDR in a voltage divider with 10 kΩ, red 5 mm LED with 330 Ω on pin 9). Research date: 23 Oct 2026. "(secondary)" marks a fact from a non-primary or aggregator source.

## 1. Capacitors: what they are, types, codes, decoupling/bulk, RC smoothing, safety

### Takeaway
A capacitor is a two-terminal part that stores charge (energy). Its capacitance is in farads, and practical values run from pF to µF. Ceramics are small, non-polarised and ideal for 100 nF decoupling right next to IC power pins. Electrolytics are polarised (the stripe marks −) and hold larger "bulk" values (10–1000 µF) that cover current surges from motors and servos. A small capacitor from A0 to GND is optional for the LDR divider. It is a low-pass filter with τ = RC, but the divider is already a low enough impedance that it isn't required.

### Cited Findings
**Definition and units**
- A capacitor is a two-terminal component whose special ability is to "store energy". Capacitance indicates how much charge it can store. The unit is the farad (F). Practical values run from pF to µF, with prefixes pF = 10⁻¹², nF = 10⁻⁹, µF = 10⁻⁶ F. Farad-scale parts are called super- or ultracapacitors. — [SparkFun Learn: Capacitors](https://learn.sparkfun.com/tutorials/capacitors/all)
- Every capacitor has a maximum voltage rating, and exceeding it will usually destroy the part. SparkFun recommends choosing a rating well above the highest expected voltage spike. — [SparkFun Learn: Capacitors](https://learn.sparkfun.com/tutorials/capacitors/all)

**Reading 3-digit codes (secondary; no primary manufacturer page found)**
- The first two digits are significant figures, the third digit is the number of zeros, and the result is in **picofarads**. So "104" = 10 followed by 0000 = 100,000 pF = 100 nF = 0.1 µF. A common mistake is reading "104" as 104 pF. Codes of one or two digits are read directly in pF ("22" = 22 pF). A trailing letter gives tolerance (J = ±5%, K = ±10%, M = ±20%). The system is mainly used on ceramic and film caps; electrolytics usually print the value directly (e.g. "100µF 25V"). — (secondary) [Industrial Monitor Direct: Ceramic capacitor marking codes](https://industrialmonitordirect.com/blogs/knowledgebase/ceramic-capacitor-marking-codes-reading-151-102-104-more); [Zbotic: Capacitor marking codes](https://zbotic.in/capacitor-marking-codes-how-to-read-smd-and-through-hole-capacitors/)
  - Further worked examples (straight arithmetic from the rule): 102 = 1,000 pF = 1 nF; 103 = 10 nF; 105 = 1 µF; 220 = 22 pF.

**Ceramic vs electrolytic**
- Ceramic is the most common type. Ceramics are small in size and value (hard to find much above ~10 µF), closer to ideal (lower ESR and leakage), cheap, and "well suited to decoupling". Through-hole ceramics often look like small yellow or red "bulbs" with two leads. SparkFun does not describe ceramics as polarised, so they can go in either way. — [SparkFun Learn: Capacitors](https://learn.sparkfun.com/tutorials/capacitors/all)
- Aluminium electrolytics are typically 1 µF–1 mF and look like a small tin can. They are **polarised**: the anode (+) must be at a higher voltage than the cathode (−). The cathode is marked with a "−" symbol and a coloured stripe on the case, and the anode lead may be longer. If reverse-biased they "fail spectacularly (making a pop and bursting open), and permanently", and a failed cap then behaves like a short circuit. — [SparkFun Learn: Capacitors](https://learn.sparkfun.com/tutorials/capacitors/all)
- Adafruit's servo lesson also notes the longer lead of the electrolytic is positive and goes to 5 V. — [Adafruit: Arduino Lesson 14, If the Servo Misbehaves](https://learn.adafruit.com/adafruit-arduino-lesson-14-servo-motors/if-the-servo-misbehaves)

**Decoupling / bypass capacitors**
- A decoupling cap sits between the supply (5 V or 3.3 V) and GND, close to an IC. It filters high-frequency noise and supplies brief current when the supply dips. 0.1 µF is the common value, sometimes with 1 µF or 10 µF added. SparkFun's example: the ADXL345 board uses two 0.1 µF ceramics plus one 10 µF tantalum. "The farther the cap is from the IC, the less effective it is." — [SparkFun Learn: Capacitors](https://learn.sparkfun.com/tutorials/capacitors/all)
- TI THS4281 datasheet: "A bulk decoupling capacitor is recommended (6.8 μF to 22 μF) within 1 inch, and a ceramic (0.1 μF) within 0.1 inch of the power input pins." — [TI THS4281 datasheet §9.1](https://ti.com/document-viewer/THS4281/datasheet/power_supply_recommendations)
- TI TDP0604 datasheet: a single 10 µF bulk capacitor on VCC, plus a 0.1 µF on each VCC pin "placed as close to the VCC pin as possible". — [TI TDP0604 datasheet](https://www.ti.com.cn/document-viewer/cn/TDP0604/datasheet/GUID-711E5969-5094-4959-9E17-F1642B9FCA45)
- TI ADS1262: "Place a 0.1-µF capacitor as close as possible to the supply with an additional 1-µF bulk capacitor placed nearby." — [TI ADS1262 datasheet](https://ti.com/document-viewer/ADS1262/datasheet/GUID-2660838A-D5D8-4D06-8F14-E585CCA72836)
- Microchip also recommends 0.1 µF per power pin, placed as close as possible, plus a bulk cap per power domain. — [Microchip: Decoupling Capacitors](https://onlinedocs.microchip.com/oxy/GUID-D4CAD149-CB72-498B-B8E7-7E8255593463-en-US-7/GUID-832C2C5F-69CC-40FC-8C9B-C00BDCF7A081.html)

**Bulk capacitors for motors/servos (Arduino/Adafruit guidance)**
- Adafruit: a servo "draws quite a lot of power, especially as the motor is starting up", and this can drop the Arduino's voltage enough to reset it. The fix is "a high value capacitor (470uF or greater) between GND and 5V on the breadboard". — [Adafruit: If the Servo Misbehaves](https://learn.adafruit.com/adafruit-arduino-lesson-14-servo-motors/if-the-servo-misbehaves)
- Adafruit's 16-channel servo shield guide gives a rule of thumb of about 100 µF per servo (e.g. ~470 µF for 5 servos) and says there is no "one magic capacitor value". It also warns that powering servos from the Arduino 5 V pin is a bad idea, because brownouts can make the board act erratically or reset. — [Adafruit 16-channel PWM/Servo Shield PDF (Mouser-hosted)](https://www.mouser.ie/datasheet/3/1348/1/adafruit_16_channel_pwm_slash_servo_shield.pdf) (found via search snippet; PDF not opened)

**RC smoothing on A0 (LDR divider)**
- The ATmega328P-family ADC "is optimized for analog signals with an output impedance of approximately 10 kΩ or less". With higher source impedance, the sampling time depends on how long the source takes to charge the internal sample-and-hold (S/H) capacitor. Signal content above the Nyquist frequency (fADC/2) should be removed with a low-pass filter. — [Microchip online docs: Analog Input Circuitry (AVR ADC)](https://onlinedocs.microchip.com/oxy/GUID-6178B82B-1DE0-484B-ACA5-153F78A78E41-en-US-1/GUID-085B188C-E869-4105-8411-EB13F0E66D65.html) (generic AVR doc page, not the ATmega328P datasheet itself)
- Time constant: τ = R × C. Worked number: 10 kΩ × 100 nF = 10,000 × 0.000000100 = 0.001 s = **1 ms**. After about 5τ (~5 ms) the capacitor voltage has essentially settled (standard RC result; arithmetic only).

**Safety: stored charge (secondary sources only)**
- Large capacitors can hold charge after power is removed. Disconnect power first, then discharge through a resistor rather than a direct short (one guide suggests 10–100 kΩ), and confirm ~0 V with a multimeter before handling. Some high-voltage capacitors show "dielectric absorption", where voltage reappears after discharge. Inspect for swelling or damage. — (secondary) [LCSC blog: How to safely discharge a capacitor](https://www.lcsc.com/blog/?p=2601)

### Inferences
- **RC filter on the LDR divider: optional, not required.** The divider's source (Thevenin) resistance is R_LDR ∥ 10 kΩ, which is always below 10 kΩ. At 10 lux (GL5528 ≈ 10–20 kΩ) it is about 5–6.7 kΩ, and in the dark (≥1 MΩ) it approaches 10 kΩ. So it already meets the ADC's ~10 kΩ guidance without a capacitor. A 100 nF ceramic from A0 to GND is harmless and helps. It acts as a charge reservoir for the tiny internal S/H capacitor and rolls off fast electrical noise. Note that the cutoff f_c = 1/(2πRC) is about 160 Hz for 10 kΩ/100 nF and about 265 Hz for the real ~6 kΩ source, so 100/120 Hz lamp flicker is *below* f_c and barely attenuated. Use software averaging for that, or a larger C such as 1 µF (τ ≈ 6–10 ms). With τ ≈ 0.5–1 ms it is far faster than any light change the project cares about. Cautions: use a non-polarised ceramic; don't use a huge value (e.g. 100 µF gives τ ≈ 1 s, making the reading sluggish); it does not replace the unit's existing software smoothing and hysteresis. (Inference from the cited ADC guidance plus the GL5528 figures in §2; no Arduino/Adafruit page specifically recommending a cap on an LDR divider was found.)
- The search-engine summary claimed an external capacitor "would mainly add to charging time". That is not how it works in practice: the external cap is far larger than the internal S/H cap and supplies the charge, so this claim was **not** used.
- The Arduino Uno R3 board already has decoupling capacitors on its 5 V rail, so students don't need to add decoupling for the ATmega328P. Bulk caps matter if a servo or motor extension is added. (Inference; the Uno schematic was not checked in this pass.)
- At the Uno's 5 V, capacitor stored-charge risk is negligible for students. The safety point applies to mains-powered equipment, camera flashes, and large PSU caps. Teach "never open mains gear" rather than discharge procedures.

### Gaps
- No primary manufacturer page (e.g. KEMET/Vishay) was fetched for the 3-digit code; the sources are secondary but agree with each other.
- No official Arduino docs page recommending (or warning against) a capacitor on an analog sensor input was found.
- The ATmega328P datasheet itself wasn't opened; the 10 kΩ figure comes from Microchip's generic AVR ADC docs page.
- The Analog Devices decoupling article URL tried (analog.com/.../decoupling-techniques.html) returned 404; TI datasheets were used instead.
- No authoritative (OSHA/university) source on capacitor discharge safety was found; only vendor blogs.

## 2. Reading a datasheet: worked walkthrough with real GL5528 and Kingbright WP7113ID values

### Takeaway
Real datasheets for both project parts are short (2 and 5 pages) and follow the standard layout. The layout is: description/features, package dimensions, absolute maximum ratings, electrical/optical characteristics (typ/max with test conditions), and characteristic graphs. Comparing these numbers with the Uno circuit shows the design sits comfortably inside every limit.

### Cited Findings
**GL5528 LDR: TruOpto/Rapid Online datasheet (order code 58-0134, MPN GL5528), "Φ5 Series" table** — [Rapid Online GL5528 datasheet PDF](https://static.rapidonline.com/pdf/58-0134_v1.pdf)
- Maximum voltage: **150** (V, DC). Test condition: "Maximum voltage to be continuously given to component in the dark."
- Maximum power: **100** (mW), defined as "Maximum power at the environmental temperature 25°C."
- Environmental temperature: **−30 to +70** (°C).
- Spectrum peak: **540** (nm), green-yellow, close to the human eye's peak sensitivity.
- Light resistance at 10 lux: **10–20 kΩ**. Test condition: "Irradiated by 400–600 Lux light for two hours, then test with 10 Lux under standard light source A (colour temperature 2856K)."
- Dark resistance: **1 MΩ** (min). Measured "ten seconds after the 10Lux light is shut up."
- Gamma γ(100/10): **0.6**, where γ = lg(R10/R100), the log of the ratio of resistance at 10 lux to that at 100 lux.
- Response time: **20 ms** increase (rise), **30 ms** decrease (decay).
- Units are printed only in the column headers. The voltage, power, temperature and nm units above are the conventional ones for this table format; the PDF headers show "(KΩ)" and "(MΩ)" explicitly.
- The datasheet also includes graphs: a log-log illuminance–resistance curve (a shaded band showing part-to-part spread, 1–100 lux), relative resistance vs temperature, spectral response, and dimensions (Φ5.1 ± 0.1 mm body, lead pitch 3.0 ± 0.1 mm). Soldering note: keep soldering 4 mm away from the ceramic substrate.
- Cross-check (secondary): distributors list 10–20 kΩ at 10 lux for the GL5528 — [Özdisan listing](https://www.ozdisan.com/en/p/ldr-sensors-919/senba-gl5528-503062). Some list 8–20 kΩ and gamma ≈ 0.7 — [tinkered.ai](https://tinkered.ai/components/ldr-gl5528). The original Senba datasheet was not found online. **Conflict:** gamma 0.6 (Rapid/TruOpto sheet) vs 0.7 (tinkered.ai, secondary). Use 0.6 from the actual datasheet.

**Red 5 mm LED: Kingbright WP7113ID datasheet, Spec No DSAF0012 / 1101005042, Rev V.14A, dated "01/08/2026"** (day/month order ambiguous) — [Kingbright WP7113ID PDF](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf)
- Description: T-1 3/4 (5 mm) lamp, High Efficiency Red (GaAsP/GaP), red diffused lens. Features include "RoHS compliant".
- **Selection guide:** luminous intensity at 10 mA is min 25 mcd, typ 50 mcd (a second row marked * gives 18/40 mcd, the CIE127-2007 traceable values). Viewing angle 2θ½ = **30°**. Note: "θ1/2 is the angle from optical centerline where the luminous intensity is 1/2 of the optical peak value". Intensity tolerance ±15%.
- **Electrical/optical characteristics at TA = 25 °C (test condition IF = 10 mA):**
  - Peak wavelength λpeak = 627 nm (typ)
  - Dominant wavelength λdom = 617 nm (typ)
  - Spectral bandwidth Δλ = 45 nm
  - Forward voltage VF = **1.9 V typ, 2.3 V max** (±0.1 V)
  - Reverse current IR = 10 µA max at VR = 5 V
  - Temperature coefficient of VF = −1.9 mV/°C
- **Absolute maximum ratings at TA = 25 °C:**
  - Power dissipation 75 mW
  - Reverse voltage 5 V
  - Junction temperature 125 °C
  - Operating and storage temperature −40 to +85 °C
  - DC forward current **30 mA**
  - Peak forward current **160 mA** (1/10 duty cycle, 0.1 ms pulse width)
  - ESD (HBM) 8000 V
  - Rth J-A 560 °C/W
  - Lead solder temperature 260 °C for 3 s (2 mm below base) or 5 s (5 mm below base)
- Note 4 on the characteristics table: "Excess driving current and/or operating temperature higher than recommended conditions may result in severe light degradation or premature failure."
- **Graphs ("Technical Data"):**
  - Relative intensity vs wavelength
  - Spatial distribution (polar plot)
  - Forward current vs forward voltage (0–20 mA over 1.3–2.3 V)
  - Luminous intensity vs forward current (roughly linear, normalised at 10 mA)
  - **Forward current derating curve** (30 mA flat up to about 25 °C, falling to about 5 mA near 85 °C)
  - Luminous intensity vs ambient temperature
- **Other sections:** package dimensions (cathode lead marked; Ø5 mm, 2.54 mm lead pitch, flange Ø5.9 mm), recommended PCB layout, wave soldering profile, packing/label, and precautions on storage, mounting, and lead forming ("Do not bend the leads more than twice"; keep ≥3 mm from the lens to the first bend).
- Precautionary note 3: "please make sure the product is being operated within the environmental and electrical limits specified in the datasheet."

**Standard datasheet sections and typ/min/max**
- SparkFun's "How to Read a Datasheet" tutorial (search snippet only; page fetch returned 404): absolute maximum ratings are what a part can withstand "before being damaged", and you should never exceed them. The "more normal" recommended operating conditions cover voltage/current ranges, timing and temperature. Graphs show performance vs supply voltage, temperature, etc., and you should look for "safe zones" where reliable operation is guaranteed. — [SparkFun: How to Read a Datasheet](https://sparkfun.com/tutorials/223) (secondary/snippet)
- Design margin example: don't run a regulator rated for a 36 V maximum input continuously at 35.5 V. — (secondary) [AdvancedPCB: How to read electronic component datasheets](https://www.advancedpcb.com/en-us/resources/blog/how-to-read-electronic-component-datasheets/)

### Inferences
**Worked walkthrough for the project (arithmetic on the datasheet values above)**
- *LED, typ vs max:* 330 Ω on a 5 V pin gives I ≈ (5 − 1.9)/330 ≈ **9.4 mA** with a typical LED. With a worst-case max-VF LED, I = (5 − 2.3)/330 ≈ **8.2 mA**. Either way it is near the 10 mA test condition (so the 25–50 mcd figures apply) and well under the 30 mA absolute maximum. LED power ≈ 1.9 V × 9.4 mA ≈ 18 mW, well under 75 mW. (This ignores the Uno pin's own voltage drop, which lowers current slightly; the LED-resistor calculation is already covered elsewhere in the unit.)
- *Why design to min/max, not typ:* "typ" is what an average part does under the stated test conditions; it is not guaranteed. The VF spread (1.9 typ → 2.3 max) changes the current by ~13%. The LDR's 10–20 kΩ range at 10 lux is a 2:1 spread between parts, which is why the unit calibrates thresholds per board.
- *Reverse voltage 5 V:* an LED in backwards on a 5 V Arduino sits at the edge of its reverse rating. It won't light, and it shouldn't be left like that.
- *LDR limits:* the divider puts at most 5 V across the LDR (≪ 150 V). The LDR's power is maximal when R_LDR = 10 kΩ: P = (2.5 V)²/10 kΩ ≈ **0.63 mW**, ≪ 100 mW. So the LDR is used at under 1% of its power rating.
- *Gamma in practice:* γ = 0.6 means 10× more light divides resistance by 10^0.6 ≈ 4. So at 100 lux, R ≈ 10–20 kΩ ÷ 4 ≈ **2.5–5 kΩ**. This explains why the A0 reading changes a lot between dim and room light.
- *Response time:* 20–30 ms is far quicker than the loop/smoothing timescales of a light indicator, so the LDR isn't the bottleneck. It does mean the LDR can partly follow 100/120 Hz lamp flicker, which the existing software averaging handles.
- *Derating graph lesson:* the 30 mA DC rating applies only at 25 °C; the graph shows the allowed current falling above ~25 °C. Graphs refine the headline numbers.
- *Absolute max vs recommended, worked example (suggested wording):* "Absolute max 30 mA ≠ operating point. Kingbright characterises the LED at 10 mA, and our 330 Ω gives ~9 mA, about a third of the limit."

### Gaps
- The original Senba (manufacturer) GL5528 datasheet couldn't be located; the Rapid/TruOpto distributor datasheet was used. The table's units for voltage/power/temp/nm are implied, not printed in the cells.
- The SparkFun red 5 mm LED product datasheet (e.g. COM-09590) was not fetched; the Kingbright WP7113ID was used as the primary LED example.
- SparkFun's "How to Read a Datasheet" page returned 404 at both URLs tried (learn.sparkfun.com/tutorials/how-to-read-a-datasheet/all and sparkfun.com/tutorials/223); only the search snippet was available. No primary source explicitly defining "typ" was captured. The inference above is standard practice, and the Kingbright sheet supports it implicitly (typ vs max columns, ±15% intensity tolerance).
- Neither of these simple parts' datasheets has a separate "Recommended Operating Conditions" table. The Kingbright sheet uses the 10 mA test condition and the derating curve in its place. Worth telling students that simple parts often omit that table, while ICs (e.g. ATmega328P) include it.

## 3. Sustainability and e-waste for a student lab

### Takeaway
The world generated a record 62 million tonnes of e-waste in 2022, and only 22.3% was documented as properly collected and recycled. Generation is growing five times faster than recycling. For a student lab the practical levers are:
- reuse components (the LDR and LED here are run far below their ratings and are fully reusable)
- use RoHS/lead-free parts and solder
- never bin lithium or rechargeable batteries
- buy from authorised distributors to avoid counterfeits, which fail early and add to waste

### Cited Findings
**Global E-waste Monitor 2024 (UNITAR/ITU, published March 2024)**
- 2022 e-waste: **62 million tonnes (Mt)**, up 82% since 2010. Generation is rising by 2.6 Mt per year and is projected to reach **82 Mt by 2030**. The press release gives the increase as both "33%" and "32%". — [UNITAR press release](https://www.unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling)
- Only **22.3%** was documented as properly collected and recycled in 2022, projected to fall to **20% by 2030**. Generation is rising **five times faster** than documented recycling. — [UNITAR](https://www.unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling)
- **US$91 billion** of metals were embedded in 2022 e-waste, including US$19 bn copper, US$15 bn gold, and US$16 bn iron. US$28 bn was recovered, and **US$62 bn** of recoverable resources was unaccounted for. — [UNITAR](https://www.unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling)
- Small equipment was 33% of e-waste (20.4 Mt), with only 12% recycled. Small IT and telecom equipment was 4.6 Mt (22% recycled). E-waste recycling meets only ~1% of rare-earth-element demand. — [UNITAR](https://www.unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling)
- Regional per-capita figures: Europe 17.6 kg, Oceania 16.1 kg, Americas 14.1 kg. Europe has the highest documented recycling rate (42.8%), and African countries are below 1%. — [UNITAR](https://www.unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling)
- E-waste is defined as "any discarded product with a plug or battery". Mercury is cited as a hazardous substance that "can damage the human brain and coordination system". — [UNITAR](https://www.unitar.org/about/news-stories/press/global-e-waste-monitor-2024-electronic-waste-rising-five-times-faster-documented-e-waste-recycling)
- Full report landing page: [ITU: The Global E-waste Monitor 2024](https://www.itu.int/en/ITU-D/Environment/Pages/Publications/The-Global-E-Waste-Monitor-2024.aspx)

**RoHS (EU)**
- RoHS Directive **2011/65/EU** "aims to prevent the risks posed to human health and the environment related to the management of EEE" by restricting hazardous substances that can be replaced with safer alternatives. — [European Commission: RoHS Directive](https://environment.ec.europa.eu/topics/waste-and-recycling/rohs-directive_en)
- There are ten restricted substances: lead, cadmium, mercury, hexavalent chromium, PBB, PBDE, DEHP, BBP, DBP, and DIBP. The four phthalates were added by Delegated Directive **(EU) 2015/863**. Exemptions are in Annexes III/IV. — [European Commission: RoHS Directive](https://environment.ec.europa.eu/topics/waste-and-recycling/rohs-directive_en)
- The project's own LED is marked RoHS compliant, and Kingbright recommends **SAC 305** (tin-silver-copper, lead-free) solder alloy for it. — [Kingbright WP7113ID PDF](https://www.kingbrightusa.com/images/catalog/SPEC/WP7113ID.pdf)
- Ironically, the GL5528 is a **CdS (cadmium sulphide)** cell: the schematic drawing labels the sensing layer "CdS". — [Rapid Online GL5528 datasheet](https://static.rapidonline.com/pdf/58-0134_v1.pdf)

**Battery disposal (US EPA)**
- Lithium-ion and other rechargeable batteries: "never put these batteries in household garbage or recycling bins". They can start fires, especially if "broken, bent or crushed". "Place each battery in separate plastic bags or place non-conductive tape" over the terminals. Take them to battery recyclers, retailer take-back schemes, or household hazardous waste points. Single-use lithium cells (check for the word "lithium") also stay out of the trash. Alkaline and zinc-carbon can go in household trash "in most communities", but EPA still recommends recycling. — [US EPA: Used Household Batteries](https://www.epa.gov/recycle/used-household-batteries)

**Counterfeits / buying reputable parts (secondary)**
- Buying from the manufacturer or an authorised distributor (e.g. Digi-Key, Mouser, Newark) is the reliable way to get genuine parts. Counterfeiters target obsolete parts: one cited figure says 67% of counterfeits are discontinued components. Many fakes are refurbished or pulled parts sold as new, and visual inspection is often insufficient. On marketplaces (eBay, AliExpress), check seller ratings carefully. — (secondary) [Octopart: Perils of unauthorized distributors](https://octopart.com/zh/pulse/p/perils-using-unauthorized-electronic-component-distributors); [Cofactr: What are counterfeit components](https://cofactr.com/blog/what-are-counterfeit-components)
- The Semiconductor Industry Association points to Authorized Aftermarket Distributors for end-of-life parts. — [SIA Anti-Counterfeiting Task Force whitepaper (ADI-hosted)](https://www-cce.cldnet.analog.com/media/en/Other/About-ADI/Quality-Reliability/SIA-Anti-Counterfeiting-Task-Force-Whitepaper.pdf) (snippet only; not opened)

### Inferences
- **CdS caution:** CdS LDRs like the GL5528 contain cadmium, a RoHS-restricted substance. Students should treat them as e-waste (not general bin waste) and reuse them between projects. Note for writers: CdS photocells have historically been sold in the EU under a RoHS exemption, and some vendors now steer users toward phototransistors or ambient-light sensors. The exemption's current status was **not verified** in this pass, so state it cautiously or omit it.
- **Reuse is realistic:** both project parts run far below their ratings (LED ~9 mA vs 30 mA; LDR ~0.6 mW vs 100 mW), so they shouldn't be worn out and can go into a parts bin. Breadboard builds avoid solder entirely. Kingbright's "don't bend leads more than twice" note is a useful reason to avoid over-bending LED legs if parts are reused.
- **Lab habits:** a labelled parts-return tray, keeping Uno boards and USB cables in service, sending dead boards and cables to a WEEE/e-waste collection point, and taping battery terminals before drop-off are all directly supported by the cited sources.
- Counterfeit parts with out-of-spec ratings fail sooner, which creates more waste and makes datasheet values meaningless. This links §2 and §3.

### Gaps
- The Global E-waste Monitor 2024 PDF itself wasn't opened; figures come from the UNITAR press release (primary co-publisher). A Global E-waste Monitor newer than 2024 was not searched for; as of Oct 2026 the 2024 edition is assumed latest (unverified).
- The EU RoHS page doesn't state the maximum concentration values (0.1% by weight; 0.01% for cadmium are the commonly cited limits) or lead-in-solder exemptions. These were not verified from a primary source in this pass.
- Battery guidance is from the US EPA. UK/EU-specific guidance (e.g. WEEE regulations, UK battery take-back at retailers) was not researched. Use the locally relevant authority if the unit isn't US-based.
- Counterfeit guidance is from industry blogs (secondary); no government or university source was fetched.
