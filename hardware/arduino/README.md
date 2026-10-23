# Arduino sketches — Hardware unit

Example code for the automatic light indicator in [hardware.md](../hardware.md) (Part B). All sketches target a **classic 5 V Arduino Uno R3**.

> **Status:** none of these sketches has been tested on real hardware yet. After the lab build, record the readings in the project log and update this table.

| Sketch | What it shows | Section | Tested? |
|---|---|---|---|
| [01_light_indicator_basic](01_light_indicator_basic/01_light_indicator_basic.ino) | Read the LDR, LED on when dark (one threshold) | B11 | No |
| [02_light_indicator_smoothed](02_light_indicator_smoothed/02_light_indicator_smoothed.ino) | Smoothing + hysteresis to stop flicker | B7, B11 | No |
| [03_calibrate_ldr](03_calibrate_ldr/03_calibrate_ldr.ino) | Record bright/dark readings and suggest thresholds | B7 | No |
| [04_pwm_dimming](04_pwm_dimming/04_pwm_dimming.ino) | Extension: LED gets brighter as the room gets darker | B9 (PWM) | No |
| [05_button_override](05_button_override/05_button_override.ino) | Extension: push button with `INPUT_PULLUP` and debouncing | [L6](../beginner-lab-skills.md#l6-digital-inputs-buttons-pull-up-resistors-and-debouncing) | No |

## Suggested order

1. **01** — check the circuit works at all.
2. **03** — find the real bright and dark readings in your room.
3. **02** — paste in the thresholds from step 2.
4. **04** and **05** — optional extension tasks.

## Wiring (all sketches)

```text
5V ──[10 kΩ]──┬──[LDR]── GND
              │
              A0

Pin 9 ──[330 Ω]──►|── GND        (LED: long leg toward the resistor)

Pin 2 ──[button]── GND           (sketch 05 only)
```

## How to upload

See [beginner-lab-skills.md, L4](../beginner-lab-skills.md#l4-uploading-code-with-the-arduino-ide). In short: open the `.ino` file in the Arduino IDE, choose **Tools → Board → Arduino Uno** and the correct **Port**, then click **Upload**. Open the Serial Monitor at **9600 baud** to see the readings.

The Arduino IDE needs each sketch to sit in a folder with the same name as its `.ino` file, which is why every sketch has its own folder.
