# Serial Communication Interfaces (UART, I²C, SPI) on the Arduino Uno R3 + CSV over Serial

Research date: 2026-10-23. Board: classic 5 V Arduino Uno R3 (ATmega328P). Uno R4 differences flagged where found.
Access note: docs.arduino.cc pages render client-side and returned empty to the fetch tool, so Arduino facts are cited from Arduino's official reference source repo on GitHub (`arduino/reference-en`). That repo is the source text for the docs.arduino.cc language reference pages, but citing it in a course is less friendly. The page URLs a learner would visit are given as "learner-facing URL" (not separately verified by fetch). The Bosch BME280 and Arduino Uno R3 datasheet PDFs downloaded but their text could not be extracted, so some chip figures are from secondary sources, and are marked as such.

## UART (asynchronous serial): wiring, baud rate, framing, Uno pins 0/1, point-to-point, example modules

### Takeaway
UART uses two signal wires (TX and RX, wired crossed: TX→RX, RX→TX) plus a shared ground. It has no clock wire, so both ends must be set to the same baud rate (bits per second) and frame format; Arduino's default is 8N1. On the Uno R3, the only hardware UART is on pins 0 (RX) and 1 (TX). Those pins are shared with the USB connection to the computer, so anything wired to them can interfere with Serial Monitor output and with uploads. A UART link is point-to-point: one bus connects exactly two devices.

### Cited Findings
- Asynchronous serial means "data is transferred without support from an external clock signal"; both sides must agree on the settings beforehand. — [SparkFun: Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all)
- The baud rate "specifies how fast data is sent over a serial line" (bits per second), and both devices must use the same rate. A mismatch produces garbage or missing data. — [SparkFun: Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all)
- 9600 is a common rate for simple uses, and 115200 is another standard rate. SparkFun notes that speeds above ~115200 are usually too fast for most microcontrollers. — [SparkFun: Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all)
- Frame = 1 start bit + data bits + optional parity bit + 1 or more stop bits. A common setup is "9600 8N1 - 9600 baud, 8 data bits, no parity, and 1 stop bit". — [SparkFun: Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all)
- Because of the start and stop bits, 10 bits go over the wire for every 8 data bits (overhead). — [SparkFun: I2C (comparison section)](https://learn.sparkfun.com/tutorials/i2c/all)
- Wiring rule: "cross the RX and TX lines between serial devices." — [SparkFun: Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all)
- Point-to-point rule: "one serial bus, two serial devices!" Two transmitters on one line cause bus contention. — [SparkFun: Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all)
- The Uno has a single hardware UART, and its RX pin is also wired to the USB-to-serial converter's TX line. Connecting a second device to that pin can therefore cause contention. — [SparkFun: Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all)
- "On older boards (Uno, Nano, Mini, and Mega), pins 0 and 1 are used for communication with the computer. Connecting anything to these pins can interfere with that communication, including causing failed uploads to the board." — [Arduino reference source: Serial](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Serial.adoc) (learner-facing URL: https://docs.arduino.cc/language-reference/en/functions/communication/serial/)
- Voltage warning: "Don't connect these pins directly to an RS232 serial port; they operate at +/- 12V and can damage your Arduino board." — [Arduino reference source: Serial](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Serial.adoc)
- TTL serial swings between roughly 0 V and 3.3 V or 5 V. RS-232 uses about −13 V to +13 V with inverted logic. The two cannot be connected directly. — [SparkFun: Serial Communication](https://learn.sparkfun.com/tutorials/serial-communication/all)
- `Serial.begin(speed)` / `Serial.begin(speed, config)`: the default config is `SERIAL_8N1`, and options run from `SERIAL_5N1` to `SERIAL_8O2`, covering 5–8 data bits, none/even/odd parity and 1–2 stop bits. The Serial Monitor rate must be one of the rates in its menu. Other rates are allowed, for example for a component on pins 0/1. — [Arduino reference source: Serial.begin()](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Serial/begin.adoc)
- The Uno R3 uses an ATmega16U2 (ATmega8U2 up to R2) programmed as a USB-to-serial converter. The board's RX/TX LEDs flash for traffic through the USB-to-serial chip "but not for serial communication on pins 0 and 1". — [Wevolver: Arduino Uno Rev3 specs](https://www.wevolver.com/specs/arduino-uno-rev3) (secondary; wording mirrors Arduino's legacy Uno product page)
- **Uno R4 difference:** in Arduino's board table, the Uno R4 Minima and Uno R4 WiFi list pins "0(RX0), 1(TX0)" under **Serial1**, not under the default `Serial`. — [Arduino reference source: Serial](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Serial.adoc)
- For native-USB (CDC) ports, `begin()` has no effect, so any baud rate works. — [Arduino reference source: Serial.begin()](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Serial/begin.adoc)

### Inferences
- Teaching consequence for the R3: an external UART module (GPS, HC-05) on pins 0/1 will clash with Serial Monitor and with uploads. Beginners should either unplug the module's RX/TX while uploading, or use the SoftwareSerial library on two other pins. On the R4, `Serial1` (pins 0/1) is separate from USB `Serial`, so this clash goes away.
- Each byte at 8N1 costs 10 bit-times, so 9600 baud ≈ 960 bytes/s and 115200 baud ≈ 11,520 bytes/s. This is arithmetic from the 10-bits-per-byte fact above.
- Wire count for teaching: 2 signal wires (TX, RX) plus GND. Transmit-only needs just TX and GND.

### Gaps
- No primary source was fetched for the example modules. From general knowledge, and unverified this session: u-blox NEO-6M GPS modules commonly default to 9600 baud and send NMEA text sentences; HC-05 Bluetooth modules commonly default to 9600 baud in data mode (38400 in AT mode), and their RX pin is 3.3 V logic, so a divider is usually recommended from a 5 V Uno's TX. Verify against the module vendor's datasheet before teaching.
- SoftwareSerial reference (https://docs.arduino.cc/learn/built-in-libraries/software-serial/) was not fetched. Its pin/speed limitations on the Uno are not verified here.
- The ATmega16U2 role could not be confirmed from Arduino's own Uno R3 datasheet (https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf), because the PDF text wasn't extractable. Only the secondary Wevolver page was used.

## I²C: SDA/SCL, Uno pins, 7-bit addresses, pull-ups, speeds, multiple devices, Wire library, example sensors

### Takeaway
I²C uses two shared wires: SDA (data) and SCL (clock), plus GND. Many devices sit on the same pair, and each has a 7-bit address. On the Uno R3 they are A4 (SDA) and A5 (SCL), also brought out on the SDA/SCL header pins near AREF. The lines are open-drain, so they need pull-up resistors (4.7 kΩ is a typical starting value; many breakout boards include them). Standard mode is 100 kHz and fast mode is 400 kHz, set with `Wire.setClock()`. The bus is meant for short distances, on the order of a board or a couple of metres. Common addresses: BH1750 0x23 (or 0x5C), BME280 0x77 (or 0x76), SSD1306 OLED usually 0x3C.

### Cited Findings
- "Each I2C bus consists of two signals: SDA and SCL." Drivers are open-drain: they can pull a line low but never drive it high. Pull-ups exist "to restore the signal to high when no device is asserting it low." — [SparkFun: I2C](https://learn.sparkfun.com/tutorials/i2c/all)
- Pull-up values: "start with 4.7kΩ resistor and adjust down if necessary". "For long runs, or systems with lots of devices, smaller resistors are better." — [SparkFun: I2C](https://learn.sparkfun.com/tutorials/i2c/all)
- Arduino: "a pull-up resistor is needed when connecting SDA/SCL pins". The Mega 2560 has onboard pull-ups, which by implication the Uno doesn't list. — [Arduino reference source: Wire](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire.adoc)
- 7-bit addressing limits a bus to 112 devices (reserved addresses excluded). 10-bit addressing allows up to 1008. SparkFun's practical advice is about 7 I²C devices per bus before problems may appear. — [SparkFun: I2C](https://learn.sparkfun.com/tutorials/i2c/all)
- "The Wire library uses 7 bit addresses throughout." If a datasheet gives an 8-bit address, drop the low bit. Addresses 0–7 are reserved, so the lowest usable address is 8. — [Arduino reference source: Wire](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire.adoc) (learner-facing URL: https://docs.arduino.cc/language-reference/en/functions/communication/wire/)
- Wire uses a 32-byte buffer, and bytes beyond that in one transmission are dropped. — [Arduino reference source: Wire](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire.adoc)
- Uno R3 default I2C pins: "A4(SDA), A5(SCL)". — [Arduino reference source: Wire](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire.adoc)
- Wire functions: begin(), end(), requestFrom(), beginTransmission(), endTransmission(), write(), available(), read(), setClock(), onReceive(), onRequest(), setWireTimeout(), clearWireTimeoutFlag(), getWireTimeoutFlag(). — [Arduino reference source: Wire](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire.adoc)
- `Wire.setClock()`: 100000 = standard mode (100 kHz) and 400000 = fast mode (400 kHz) are accepted. 10 kHz, 1 MHz (fast mode plus) and 3.4 MHz (high speed) work only on some processors. — [Arduino reference source: Wire.setClock()](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire/setClock.adoc)
- "most I2C devices can communicate at 100kHz or 400kHz". Faster modes exist: 1 MHz Fast-mode Plus, 3.4 MHz High-speed and 5 MHz Ultra-fast. — [SparkFun: I2C](https://learn.sparkfun.com/tutorials/i2c/all)
- Distance: usable "with short runs of wire (2-3m)". Longer runs need a differential extender such as the PCA9615. — [SparkFun: I2C](https://learn.sparkfun.com/tutorials/i2c/all)
- I²C allows multiple controllers that take turns on the bus. SPI supports only one controller. — [SparkFun: I2C](https://learn.sparkfun.com/tutorials/i2c/all)
- **Uno R4 difference:** default I²C is still A4/A5, "also available on the SDA / SCL pins (digital header)". The Qwiic connector (on the R4 WiFi) is a second bus, `Wire1`/I2C1, on D27 (SDA)/D26 (SCL). — [Arduino reference source: Wire](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire.adoc)
- **BH1750 light sensor:** 7-bit address 0x23 when the ADDR pin is low and 0x5C when ADDR is high, according to the Linux kernel driver and the current RIOT-OS driver header. An older RIOT commit had the mapping reversed, which appears to be a historical error. — [RIOT-OS BH1750FVI driver docs](https://doc.riot-os.org/group__drivers__bh1750fvi.html); [Linux bh1750 driver source](https://git.cs.tu-dortmund.de/tresor.bessoh/linuxdebug/src/branch/master/drivers/iio/light/bh1750.c). Primary ROHM datasheet URL as referenced by the Linux driver (fetch timed out, not verified live): http://rohmfs.rohm.com/en/products/databook/datasheet/ic/sensor/light/bh1750fvi-e.pdf
- **BME280 (Adafruit breakout):** the default I²C address is 0x77, and it becomes 0x76 if SDO is jumpered to GND. That board has a regulator taking 3–5 V DC and level-shifting so its logic pins are "3-5V logic level safe". — [Adafruit BME280 Learn guide: Pinouts](https://learn.adafruit.com/adafruit-bme280-humidity-barometric-pressure-temperature-sensor-breakout/pinouts)
- BME280 chip (secondary): SDO to GND gives address 0x76, SDO to VDDIO gives 0x77. The core runs from 1.71–3.6 V and VDDIO from 1.2–3.6 V. Listed interface limits are I²C up to 3.4 MHz and SPI up to 10 MHz. — [Elektor BME280 e-BoB](https://www.elektormagazine.com/labs/bme280-bob-160109-1); [Switch Science BME280 listing](https://international.switch-science.com/catalog/2236/). Primary Bosch datasheet: https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme280-ds002.pdf (downloaded, but text not extractable this session)
- **SSD1306 OLED:** Adafruit's 128×64 OLED breakouts "can be used with I2C (+ an optional reset line) or SPI", and "SPI is generally faster than I2C but uses more pins". The STEMMA QT version defaults to I²C. — [Adafruit Monochrome OLED Breakouts: Wiring 128x64](https://learn.adafruit.com/monochrome-oled-breakouts/wiring-128x64-oleds)

### Inferences
- Wire count for teaching: 2 signal wires (SDA, SCL) + GND (+ power), no matter how many devices share the bus. A BH1750, a BME280 and an SSD1306 can all share A4/A5 because their addresses (0x23, 0x76/0x77, 0x3C) differ.
- A4/A5 and the SDA/SCL header pins are the same signals on the Uno R3, so a sketch using I²C cannot also use A4/A5 as analog inputs. This follows from the shared pins; not explicitly stated in the fetched sources.
- An "I²C scanner" sketch (loop over addresses 8–119 calling `beginTransmission`/`endTransmission`) is a common beginner tool built from the Wire functions listed above. It is not cited as an official example here.

### Gaps
- NXP UM10204 (I²C-bus specification) was not fetched. Spec-level details such as bus capacitance limits (400 pF) and the exact reserved-address table are not verified here. URL to check: https://www.nxp.com/docs/en/user-guide/UM10204.pdf
- SSD1306 address 0x3C (128×64 boards may use 0x3D) is common knowledge but was **not confirmed** from a fetched source this session.
- BH1750 supply voltage, measurement range (about 1–65535 lx) and I²C speed (fast mode) come from general knowledge and were not verified, because the ROHM datasheet fetch timed out. Many BH1750 breakout modules (GY-302) include a regulator for 5 V input; this is vendor-dependent and unverified.
- Arduino's Wire article (https://docs.arduino.cc/learn/communication/wire/) returned empty and wasn't read.
- Whether the Uno R3 has any onboard I²C pull-ups: the Arduino page implies not (it mentions only the Mega's), but no schematic was checked. The ATmega328P's internal pull-ups (about 20–50 kΩ), which Wire enables, are too weak for reliable 400 kHz operation. This is general knowledge, unverified here.

## SPI: signals and naming, Uno pins 10–13 / ICSP, chip select, full duplex, speeds, SPI library, SD card example

### Takeaway
SPI uses four signal wires: SCK (clock), COPI/MOSI (controller to peripheral), CIPO/MISO (peripheral to controller), and CS/SS (chip select, active low). Each extra device needs its own CS pin. Data flows both ways at once (full duplex), at MHz speeds (on the Uno R3, from 125 kHz up to 8 MHz), but only over short distances. Uno R3 pins: 10 = CS, 11 = COPI, 12 = CIPO, 13 = SCK; the same signals are on the 6-pin ICSP header. You use it through `#include <SPI.h>` and `SPI.beginTransaction(SPISettings(...))`. The typical beginner example is an SD card module.

### Cited Findings
- Uno R3 SPI pins: "10(CS), 11(COPI), 12(CIPO), 13(SCK)". "SPI pins available on ICSP header." — [Arduino reference source: SPI](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/SPI.adoc) (learner-facing URL: https://docs.arduino.cc/language-reference/en/functions/communication/SPI/)
- Arduino now uses COPI (Controller Out Peripheral In) and CIPO (Controller In Peripheral Out) in place of MOSI/MISO. — [Arduino reference source: SPI](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/SPI.adoc)
- SparkFun uses a different new-name pair: PICO (Peripheral In/Controller Out) and POCI (Peripheral Out/Controller In). Its mapping: Master→Controller, Slave→Peripheral, MOSI→PICO, MISO→POCI, SS→CS. — [SparkFun: SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all). *Conflict in naming only: Arduino says COPI/CIPO and SparkFun says PICO/POCI for the same signals. Teach MOSI/MISO alongside whichever new name the course picks.*
- The SPI library lets the Arduino act as the controller. It ships with every Arduino platform, and you include it with `#include <SPI.h>`. Functions: SPISettings, begin(), beginTransaction(), endTransaction(), end(), setBitOrder(), setClockDivider(), setDataMode(), transfer(), usingInterrupt(). — [Arduino reference source: SPI](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/SPI.adoc)
- `SPISettings(speedMaximum, dataOrder, dataMode)`: dataOrder is MSBFIRST/LSBFIRST, and dataMode is SPI_MODE0–3. The documented example is `SPI.beginTransaction(SPISettings(14000000, MSBFIRST, SPI_MODE0))`, and for a chip rated at 20 MHz you pass 20000000. — [Arduino reference source: SPISettings](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/SPI/SPISettings.adoc)
- CS is "active low": normally held high and pulled low to select a device. Each separately wired peripheral needs its own CS line; daisy-chained devices can share one. — [SparkFun: SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)
- SPI is "full duplex" with separate send and receive lines. Whether a device actually sends and receives at the same time depends on the device. — [SparkFun: SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)
- On an Uno, the SPI library divides the 16 MHz clock to give rates "between 8MHz (/2) and 125kHz (/128)". SPI can reach "millions of bytes per second". — [SparkFun: SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)
- With the SPI library you "must use the provided SCK, PICO, and POCI pins" because the hardware is fixed. Distance should be short ("up to a few feet"), and the clock should be lowered over longer wires. — [SparkFun: SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)
- Pros: faster than async serial, simple receiver hardware, supports multiple peripherals. Cons: more wires, the controller must run all communication, and usually one CS per device. — [SparkFun: SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)
- SPI needs one extra CS I/O pin for each additional peripheral, which makes it pin-hungry compared with I²C. — [SparkFun: I2C](https://learn.sparkfun.com/tutorials/i2c/all)
- The BME280 breakout can also run over SPI, with pins SCK, SDO (sensor→controller), SDI (controller→sensor) and CS (pulled low to start a transaction). This is a useful example of the same sensor speaking either bus. — [Adafruit BME280: Pinouts](https://learn.adafruit.com/adafruit-bme280-humidity-barometric-pressure-temperature-sensor-breakout/pinouts)

### Inferences
- Wire count for teaching: 3 shared wires (SCK, COPI, CIPO) + 1 CS per device + GND. One device = 4 signal wires, and two devices = 5.
- On the Uno R3, pin 13 is both SCK and the onboard "L" LED pin, so the LED flickers during SPI traffic and pin 13 can't be used as a normal LED output alongside SPI. This follows from the shared pin assignments; not explicitly stated in the fetched sources.

### Gaps
- SD card module specifics were not fetched from a primary source: Arduino's SD library reference (https://docs.arduino.cc/libraries/sd/), FAT16/FAT32 formatting, the common CS pin (4 or 10 depending on the shield/module), and the fact that SD cards are 3.3 V devices so a 5 V Uno needs a module with a regulator and level shifter. These are general knowledge, unverified here.
- The ATmega328P datasheet note that pin 10 (SS) must be an OUTPUT for the chip to stay SPI controller was not verified, because the Arduino reference doesn't mention it. Microchip datasheet: https://ww1.microchip.com/downloads/en/DeviceDoc/Atmel-7810-Automotive-Microcontrollers-ATmega328P_Datasheet.pdf (not fetched).
- Arduino's SPI article (https://docs.arduino.cc/learn/communication/spi/) returned empty.
- Uno R4 SPI pin mapping was not checked. It is believed to be the same D10–D13 + ICSP, but this is unverified.

## Comparison table: wires, addressing, speed, distance, typical use

### Takeaway
UART: 2 wires, no addressing, one-to-one, typically 9600–115200 baud, used for PC/USB links, GPS and Bluetooth modules. I²C: 2 shared wires, addressed by 7-bit number, 100/400 kHz, many slow sensors and small displays on one bus, short runs. SPI: 3 shared wires + 1 CS per device, selected by CS pin, MHz speeds, used for SD cards, fast displays and radios, very short runs.

### Cited Findings
| | UART | I²C | SPI |
|---|---|---|---|
| Signal wires (+GND) | 2: TX, RX, crossed ([SparkFun Serial](https://learn.sparkfun.com/tutorials/serial-communication/all)) | 2: SDA, SCL, shared ([SparkFun I2C](https://learn.sparkfun.com/tutorials/i2c/all)) | 3 shared + 1 CS per device ([SparkFun SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)) |
| Clock wire? | No, asynchronous; both ends agree on a baud rate ([SparkFun Serial](https://learn.sparkfun.com/tutorials/serial-communication/all)) | Yes (SCL) | Yes (SCK) |
| Devices / addressing | 2 devices only, no addresses ([SparkFun Serial](https://learn.sparkfun.com/tutorials/serial-communication/all)) | Up to 112 with 7-bit addresses; ~7 practical ([SparkFun I2C](https://learn.sparkfun.com/tutorials/i2c/all)) | One CS line per device, active low ([SparkFun SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)) |
| Typical speed | 9600–115200 baud ([SparkFun Serial](https://learn.sparkfun.com/tutorials/serial-communication/all)); common rates top out ~230400 ([SparkFun I2C](https://learn.sparkfun.com/tutorials/i2c/all)) | 100 kHz / 400 kHz ([Arduino setClock](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire/setClock.adoc)) | 125 kHz–8 MHz on Uno ([SparkFun SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)) |
| Duplex | Full (separate TX/RX) | Half (one data line) | Full ([SparkFun SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)) |
| Typical distance | TTL: short. RS-232 handles long distances better ([SparkFun Serial](https://learn.sparkfun.com/tutorials/serial-communication/all)) | ~2–3 m ([SparkFun I2C](https://learn.sparkfun.com/tutorials/i2c/all)) | "up to a few feet" ([SparkFun SPI](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all)) |
| Uno R3 pins | D0 RX, D1 TX, shared with USB ([Arduino Serial](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Serial.adoc)) | A4 SDA, A5 SCL (+ SDA/SCL header) ([Arduino Wire](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Wire.adoc)) | D10 CS, D11 COPI, D12 CIPO, D13 SCK, + ICSP ([Arduino SPI](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/SPI.adoc)) |
| Arduino library | `Serial` | `Wire` | `SPI` |
| Example module | GPS, HC-05 Bluetooth (see Gaps) | BH1750 (0x23/0x5C), BME280 (0x76/0x77), SSD1306 OLED | SD card module; BME280 / OLED in SPI mode ([Adafruit OLED](https://learn.adafruit.com/monochrome-oled-breakouts/wiring-128x64-oleds)) |

### Inferences
- "Duplex" for UART (full) and I²C (half) is inferred from the wire structure (separate TX/RX lines vs. a single SDA line). No fetched source states it in those words.
- The "Typical use" mnemonic for beginners: UART = "talk to one thing (or the PC)", I²C = "many slow sensors on two wires", SPI = "fast, needs more pins".

### Gaps
- No single primary source gives a side-by-side distance figure. The distances above are SparkFun's rules of thumb.

## Logic levels: using 3.3 V breakout modules with a 5 V Uno (what to check)

### Takeaway
Before wiring a module, check three things: (1) what supply voltage its VIN/VCC pin accepts (does it have an onboard regulator?), (2) whether its data pins are 5 V-tolerant or level-shifted, and (3) for I²C, which voltage the module's pull-ups go to. If the module isn't 5 V-safe, use a logic-level converter. Many breakouts, such as Adafruit's BME280, include both a regulator and level shifting.

### Cited Findings
- I²C trick: "connect the pull-up resistors to the lower of the two voltages". This works only in some cases, such as a 5 V Arduino with a 3.3 V accelerometer. SparkFun still recommends "using a logic level converter". For large voltage gaps, use a translator like the PCA9306. — [SparkFun: I2C](https://learn.sparkfun.com/tutorials/i2c/all)
- Example of a 5 V-friendly breakout: the Adafruit BME280 has a regulator that accepts 3–5 V DC, and level shifting makes its logic pins "3-5V logic level safe". Adafruit advises using the same logic level as Vin. — [Adafruit BME280: Pinouts](https://learn.adafruit.com/adafruit-bme280-humidity-barometric-pressure-temperature-sensor-breakout/pinouts)
- The bare BME280 chip supply is 1.71–3.6 V and VDDIO is 1.2–3.6 V, so the bare chip is **not** 5 V-tolerant. Secondary source. — [Elektor BME280 e-BoB](https://www.elektormagazine.com/labs/bme280-bob-160109-1)
- Uno serial pins are TTL level and must never be connected directly to RS-232 (±12 V). — [Arduino reference source: Serial](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Serial.adoc)

### Inferences
- Beginner checklist: read the module's product page and look for "regulator", "level shifter" or "5V safe". If the page says only "3.3V", assume the data pins are not 5 V-tolerant. Cheap clones of a branded breakout may leave out the level shifting.
- Direction matters. A 5 V Uno output driving a 3.3 V input (Uno TX → module RX, SCK/COPI/CS) is the risky direction. A 3.3 V output into the Uno is often read as HIGH but with little margin. This is from general knowledge; the ATmega328P VIH figure was not verified this session.

### Gaps
- The ATmega328P input-high threshold (VIH ≈ 0.6 × VCC = 3.0 V at 5 V) was not verified against the Microchip datasheet this session.
- **Uno R4:** the R4's RA4M1 is reported to run 5 V I/O, keeping R3 shield compatibility. Not verified this session.

## CSV over serial: format, Serial Plotter, pyserial, spreadsheet

### Takeaway
Have the sketch print one reading per line with values separated by commas, e.g. `Serial.print(lux); Serial.print(','); Serial.println(tempC);`. `println` ends each line with a newline. That one format works three ways. The Arduino IDE Serial Plotter draws each comma-separated column as a separate trace. A Python script using pyserial's `readline()` gets one line per reading and can `split(',')` it. Saving the lines as a `.csv` file lets a spreadsheet open them as columns. Baud rates must match on both ends.

### Cited Findings
- Serial Plotter input format: values on one line separated by a comma, space or tab, ending with a newline. Labels can be sent as `label:value` pairs, e.g. `temperature:21,humidity:76`, or as a header line first. The plotter's baud rate must match `Serial.begin()`, otherwise you get garbage or nothing. — [Elektor: How to use Arduino's Serial Plotter](https://www.elektormagazine.com/news/how-to-use-arduinos-serial-plotter); [Norwegian Creations: Multiple values in the Serial Plotter](https://www.norwegiancreations.com/?p=3907); [DeepBlue Embedded: Serial Plotter](https://deepbluembedded.com/arduino-serial-plotter/) (secondary tutorials; the official Arduino page wasn't reachable)
- Known quirk: in a reported issue, the `\r` from `Serial.println()`'s `\r\n` ending was parsed as an extra value by the plotter. — [arduino-serial-plotter-webapp PR #16](https://github.com/arduino/arduino-serial-plotter-webapp/pull/16)
- pyserial: open a port with the port name, baud rate and an optional timeout, e.g. `serial.Serial('/dev/ttyS1', 19200, timeout=1)`. Windows names look like `COM3`, Linux names like `/dev/ttyUSB0`. `readline()` reads up to and including `\n`. Set a timeout, or it can block forever; a returned line with no `\n` means the timeout hit. You can list ports with `python -m serial.tools.list_ports`. — [pyserial short introduction](https://pyserial.readthedocs.io/en/latest/shortintro.html)
- Serial Monitor/Plotter and the sketch must use the same rate. Rates are chosen from the menu. — [Arduino reference source: Serial.begin()](https://raw.githubusercontent.com/arduino/reference-en/master/Language/Functions/Communication/Serial/begin.adoc)

### Inferences
- The bridge to the Networks unit: CSV over serial is a tiny protocol. It has agreed framing (newline = end of record), a delimiter (comma = field separator), and optionally a header line that names the fields. These are the same ideas as packet framing and data formats in networking.
- Python sketch for the course: `line = ser.readline().decode().strip(); lux, temp = line.split(',')`. `.strip()` removes the `\r\n` that Arduino's `println()` adds. Only one program can open the COM port at a time, so close Serial Monitor/Plotter before running the Python script. The single-owner port behaviour is general OS knowledge, not verified here.
- On the Uno R3, opening the serial port from the PC typically resets the board through the DTR line. A script should therefore wait about 2 s after opening, or skip the first partial line. This is general knowledge, not verified this session.

### Gaps
- The official Arduino Serial Plotter docs page (https://docs.arduino.cc/software/ide-v2/tutorials/ide-v2-serial-plotter/) could not be fetched. Format rules are from third-party tutorials.
- The pyserial install command (`pip install pyserial`) is not shown on the fetched page. It is standard, but cite https://pyserial.readthedocs.io/en/latest/pyserial.html#installation if needed.
- The CSV standard (RFC 4180, https://www.rfc-editor.org/rfc/rfc4180) was not fetched. RFC 4180 specifies CRLF line endings and quoting rules. Arduino's `println()` emits CRLF (`\r\n`), which happens to match; this is general knowledge.
