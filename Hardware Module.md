# Hardware, Networks & Behaviorist AI — Module Plan and Learning Content V1.0

## How to use this module

This module connects three ideas:

1. **Hardware** allows a computer-based system to sense and affect the physical world.
2. **Networks** allow devices to exchange information.
3. **Behaviorist or behavior-based AI** concerns how an agent selects actions in response to its environment or feedback. The precise meaning of “Behaviorist AI” should be confirmed against the instructor's definition before that section is fully written.

A useful unifying example is a smart-room system: a sensor measures brightness, a controller reads the measurement, a network may share the reading, an agent or control rule decides what should happen, and an output device switches a light.

## Prerequisites

Beginners do not need previous electronics experience. They should be prepared to learn these ideas as they progress:

- Basic arithmetic, fractions, and rearranging a simple equation.
- The difference between physical hardware and software instructions.
- Basic programming ideas such as variables, conditions (`if` statements), and repetition (`while` or `loop`).
- The idea that data can be represented as numbers and sent between devices.

Electrical terms such as voltage, current, resistance, and ground will be introduced before they are used in calculations.

## Intended learning outcomes

By the end of the complete module, a beginner should be able to:

1. **Describe** the roles of a processor or microcontroller, power supply, input, output, and communication interface in a small computing system.
2. **Select and justify** physical components using requirements such as voltage, current, power, interface, performance, environmental conditions, cost, and availability.
3. **Explain and calculate** simple circuits using Ohm's law and the voltage-divider equation.
4. **Trace** the path from a physical measurement through a sensor and controller to an actuator.
5. **Explain** how devices communicate over a network and identify the roles of network interfaces, switches, routers, and communication protocols.
6. **Describe** the course's intended approach to Behaviorist AI and explain how a simple agent maps inputs or feedback to actions.
7. **Evaluate** an integrated system by identifying compatibility, reliability, safety, and testing requirements.

## Overall module structure and development status

Status meanings:

- **Outline only:** the section plan exists, but substantive teaching material still needs to be written.
- **Drafted:** a first version of the content exists; it has not yet passed full peer or instructor review.
- **Checked:** another person or a documented test has checked the material. Use this label only after that check has happened.
- **Needs revision:** a known gap or uncertainty remains.

| Order | Section and subtopics | What learners should be able to do | Planned example, question, or activity | Current status / gap |
|---|---|---|---|---|
| 1 | **Module overview:** hardware, networks, and agent behavior; how the parts fit together | Explain the whole system at a high level | Trace a smart-room system from sensing to action | **Drafted — needs revision:** confirm the module framing with the team |
| 2 | **Hardware foundations:** voltage, current, resistance, power; series and parallel circuits; basic electrical safety | Define the main quantities and use Ohm's law in a simple calculation | Calculate the current through a resistor | **Drafted — needs technical review** |
| 3 | **Physical component selection:** microcontroller vs. single-board computer; sensors; resistors; drivers; power supplies; datasheets; selection trade-offs | Choose a component and justify the choice from its specifications | Choose a controller and light sensor for an automatic lamp | **Drafted — needs technical review** |
| 4 | **Circuit design:** schematic reading; voltage dividers; current-limiting resistors; logic-level compatibility; power budgeting; grounding; protection | Draw and check a basic sensor circuit | Calculate the divider output and LED resistor | **Drafted — needs circuit/peer review** |
| 5 | **Sensor integration:** analog and digital sensors; ADC; resolution vs. accuracy; signal conditioning; sampling; calibration | Explain how a physical quantity becomes a value a program can use | Read a light-dependent resistor (LDR) using an analog input | **Drafted — needs technical review** |
| 6 | **Actuator integration:** LEDs, buzzers, relays, motors; GPIO limits; transistor/MOSFET or motor-driver circuits; PWM; protection | Explain why some loads require driver circuitry | Control an indicator LED and explain why a motor needs a suitable driver | **Outline partly covered — needs additional examples and review** |
| 7 | **Network foundations:** devices and links; packets; addresses; Ethernet and Wi-Fi; switches, routers, and access points; latency and reliability | Describe a simple device-to-device communication path | Draw how a sensor node sends a reading to a computer | **Outline only — assign/coordinate with Networks contributor** |
| 8 | **Networked/IoT systems:** device communication, data formats, connectivity limits, privacy and security basics | Identify what a connected hardware system needs beyond a sensor and controller | Plan how a room sensor could share readings without exposing unnecessary data | **Outline only — needs substantive content** |
| 9 | **Behaviorist AI / behavior-based agents:** inputs, state or feedback, behavior rules, action selection; layered behavior or learning concepts if those are in course scope | Explain the specific AI approach taught in the course and trace a simple input-to-action example | Describe a simple robot response to an obstacle | **Outline only — needs instructor/team clarification of “Behaviorist AI”** |
| 10 | **Integration and evaluation:** hardware + networks + agent behavior; reliability; test plan; trade-offs; documentation | Explain how the parts interact and evaluate a proposed design | Walk through a networked smart-room example and identify failure points | **Outline only — depends on agreement across sections** |
| 11 | **Glossary, questions, and references** | Use technical terms consistently and check their learning | Short end-of-module quiz with answer explanations | **Drafted for hardware terms — incomplete for whole module** |

### Important gaps and uncertainties

- The supplied assignment rules do not define the exact intended meaning of **“Behaviorist AI.”** Confirm the course definition with the instructor or team before writing that section in depth. Possible interpretations should not be treated as interchangeable.
- The Networks and Behaviorist AI sections are planning outlines here, not completed learning content. The relevant contributors should develop and review them.
- Circuit values in the worked example below are illustrative. A real circuit must use the selected parts' datasheets and the exact board's electrical specifications.
- The hardware example assumes a classic 5 V Arduino Uno R3-style board. Other boards can use different logic voltages and ADC characteristics; recalculate and check the board documentation before adapting the circuit.

---

# Substantive Learning Content V1.0 — Hardware

## Topic: Selecting components and connecting a sensor to an output

### Learning goals for this topic

After studying this topic, you should be able to:

- Explain what component selection means and name key selection criteria.
- Describe the jobs of a microcontroller, sensor, resistor, and output device.
- Use the voltage-divider equation to estimate a sensor voltage.
- Explain how an analog-to-digital converter (ADC) turns an input voltage into a number.
- Trace a simple sensor-to-controller-to-output system.
- Identify why electrical compatibility and component ratings must be checked.

## 1. Start with the system requirement, not the parts list

**Physical component selection** means choosing hardware that fits the task and the system's constraints. An engineer should not select a component just because it is popular or inexpensive. They first define what the system has to do, then check whether each candidate part can meet those requirements.

For example, imagine the requirement is:

> Switch an indicator light on when a room becomes dark, and switch it off again when the room is bright.

The design needs at least:

- a **sensor** to respond to room brightness;
- a **controller** to read the sensor and make a decision;
- an **output device** to indicate the result;
- suitable resistors, wiring, and a power source.

A **sensor** measures a physical quantity and provides a usable signal. A **microcontroller** is an integrated circuit designed to run a program and interact with hardware. An **actuator** converts a control signal and energy into a physical effect. In a beginner circuit an LED can be treated as an output device because it produces light; in larger systems, actuators include motors and solenoids.

### Photo: microcontroller board

![Microcontroller board](https://github.com/reyvaneh/Doom/blob/c12b5a427af212c96e32ac2048c167ccb3f64b9b/arduino-uno.jpg)

*An Arduino Uno R3 is an example of a microcontroller development board. It provides digital pins, analog inputs, a USB connection, and other supporting circuitry. Image: Shoot stufz, [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Arduino_Uno_R3_development_board_03.jpg), CC BY-SA 4.0.*

### Photo: light sensor

![Light-dependent resistor](https://github.com/reyvaneh/Doom/blob/c12b5a427af212c96e32ac2048c167ccb3f64b9b/ldr.jpg)

*A light-dependent resistor (LDR), also called a photoresistor, changes its resistance with light level. Image: Suyash Dwivedi, [Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:25mm_light-dependent_resistor_(LDR)_(2).jpg), CC BY-SA 4.0.*

## 2. Choose components using measurable criteria          

Use this checklist when comparing possible components.

| Criterion | What to ask | Why it matters |
|---|---|---|
| Operating voltage | What supply voltage does the part require? | An incompatible voltage can prevent operation or damage the part. |
| Input/output compatibility | Can the controller safely read the sensor's signal? | A board's permitted input voltage may differ from another board's. |
| Current and power | How much current will the part draw or carry? Can it dissipate the expected power? | Parts, pins, wires, and supplies have limits. |
| Function and performance | Is the measurement range, response time, accuracy, or speed good enough? | The device must satisfy the actual task, not just connect electrically. |
| Interface | Does the part use analog voltage, a digital pin, I²C, SPI, UART, or another interface? | The controller must support the interface or use an appropriate adapter. |
| Environment | Will the part tolerate expected temperature, moisture, vibration, and light conditions? | Conditions can affect readings and reliability. |
| Cost and availability | Is it affordable and are its specifications documented? | An undocumented or unavailable part can make the design hard to maintain. |

A **datasheet** is a manufacturer's technical document describing a component's pin connections, electrical characteristics, operating conditions, and limits. Check the datasheet before committing to a part. In particular, do not confuse *recommended operating conditions* with *absolute maximum ratings*: an absolute maximum is a limit to avoid exceeding, not a target for normal use.

### Microcontroller or single-board computer?

A microcontroller is often a good fit for a small control task because it can read inputs and control outputs directly. A single-board computer is more appropriate when the application needs a full operating system or heavier computation. The choice depends on requirements; one type is not automatically better for every project.

For this example, a classic Arduino Uno R3 is a useful teaching platform because its official documentation describes six analog inputs and a 10-bit ADC. This board-specific fact must not be assumed for every Arduino-compatible board or every microcontroller. [Arduino Uno R3 technical information](https://docs.arduino.cc/hardware/uno-rev3/).

## 3. Understand the electrical terms used in the circuit

- **Voltage (V):** electrical potential difference between two points, measured in volts.
- **Current (I):** rate of flow of electric charge, measured in amperes (A).
- **Resistance (R):** opposition to current flow, measured in ohms (Ω).
- **Power (P):** rate of electrical energy transfer, measured in watts (W).
- **Ground (GND):** the reference node used by the circuit; in many low-voltage circuits it is connected to the supply's negative terminal.
- **Analog signal:** a signal that can vary continuously within a range.
- **ADC (analog-to-digital converter):** circuitry that represents an analog input voltage as a digital number.

Ohm's law connects voltage, current, and resistance:

\[
V = IR
\]

It can be rearranged to calculate current or resistance:

$$
I = \frac{V}{R} \qquad R = \frac{V}{I}
$$

Electrical power is:

\[
P = VI
\]

## 4. Circuit design: use an LDR in a voltage divider

An LDR's resistance usually decreases as light on it increases. The resistance change alone is not a voltage that the controller can directly interpret as a digital number. A simple way to convert that resistance change into a changing voltage is to connect the LDR and a fixed resistor as a **voltage divider**.

A voltage divider has two resistors connected in series across a supply. The output is measured at the junction between them. If the output is measured across the lower resistor \(R_2\), the ideal no-load equation is:

$$
V_{out}=V_{in}\frac{R_2}{R_1+R_2}
$$

Here, \(V_{in}\) is the supply voltage, \(R_1\) is the top resistor, and \(R_2\) is the lower resistor connected to ground. The formula assumes the measurement input does not significantly load the divider.

### Wiring diagram

The following diagram uses a 10 kΩ fixed resistor on the high side and the LDR on the low side. The midpoint connects to analog input A0.

```text
          +5 V (Uno R3 example)
                   |
              [ R1 = 10 kΩ ]
                   |
                   +---------- A0 (analog input)
                   |
              [ LDR = R2 ]
                   |
                  GND
```

The circuit makes a voltage that varies with light. With this exact arrangement, more light generally reduces the LDR resistance and lowers the midpoint voltage. Reversing the two resistors would reverse the direction of the voltage change.

**Important:** a voltage divider is suitable for sensing, but it should not be used as a general power supply for a load. If a circuit needs a different supply voltage, use a suitable regulator or power converter instead.

### Worked example: estimate the sensor voltage

For practice, assume a 5 V input, a fixed resistor \(R_1=10\text{ kΩ}\), and two hypothetical LDR readings:

- In a dark condition, assume $$R_2=100\text{ kΩ}$$.
- In a bright condition, assume $$R_2=2\text{ kΩ}$$.

These are illustrative values only. The resistance of a real LDR depends on its model and the lighting, so it must be measured or taken from its datasheet for a real design.

**Case A: dark condition**

Substitute the values into the divider equation:

$$
V_{out}=5\frac{100}{10+100}
=5\frac{100}{110}
\approx4.55\text{ V}
$$

So the analog input is approximately 4.55 V.

**Case B: bright condition**

$$
V_{out}=5\frac{2}{10+2}
=5\frac{2}{12}
\approx0.83\text{ V}
$$

So the analog input is approximately 0.83 V.

**Interpretation:** with the LDR in the lower position, the dark example produces a higher voltage than the bright example. The controller can use this difference to distinguish the conditions.

## 5. From voltage to a number: the ADC

A microcontroller program works with digital values. An ADC converts the input voltage into a number that software can read.

For a classic Arduino Uno R3 using a 0–5 V analog reference, `analogRead()` returns a value from 0 to 1023. This means there are 1024 possible codes, numbered from zero. The approximate conversion is:

$$
\text{ADC code}\approx\frac{V_{in}}{5}\times1023
$$

Using the previous examples:

- Dark: $$4.55/5\times1023\approx930$$.
- Bright: $$0.83/5\times1023\approx170$$.

These are ideal estimates, not guaranteed measured values. Actual readings can differ because of the actual LDR resistance, the board's reference voltage, circuit tolerances, and electrical noise. The ADC's resolution is not the same as the full accuracy of the measurement.

For an explanation and practical example, see [Arduino's Analog Input tutorial](https://docs.arduino.cc/built-in-examples/analog/AnalogInput/) and [SparkFun's Voltage Divider guide](https://learn.sparkfun.com/tutorials/voltage-dividers/introduction).

## 6. Add an output: an LED indicator

An LED converts electrical energy into light. It is a simple output device for this demonstration.

An LED must normally have a series resistor to limit its current. If a 5 V output drives an LED with an assumed forward voltage of 2 V and a target current of 10 mA, the resistor voltage is:

$$
V_R=5-2=3\text{ V}
$$

Convert current to amperes: $$10\text{ mA}=0.010\text{ A}$$.

Then use Ohm's law:

$$
R=\frac{3}{0.010}=300\text{ Ω}
$$

A nearby standard value such as 330 Ω gives an approximate current of:

$$
I=\frac{3}{330}\approx0.0091\text{ A}=9.1\text{ mA}
$$

This is a worked estimate, not a substitute for checking the specific LED, resistor power rating, board output limits, and wiring. For a classic Uno-style example, the external LED can be wired from digital pin 9 through a 330 Ω resistor to the LED anode, with the LED cathode connected to GND. Other boards may have different output-voltage and current limits.

### What if the output is a motor instead?

A microcontroller pin is a signal output, not a general-purpose motor power supply. A motor may draw more current than a GPIO pin can safely deliver and can generate voltage transients when switched. Use a properly rated transistor/MOSFET driver or motor-driver module and suitable protection, following the driver's documentation. Do not connect a motor directly to a GPIO pin.

## 7. Connect the sensor reading to the output decision

The following Arduino-style example reads the LDR divider and turns an external LED on when the reading indicates darkness. The threshold `500` is only a starting point; it must be calibrated for the actual sensor, resistor, room, board and wiring.

```cpp
const int sensorPin = A0;
const int ledPin = 9;
const int darkThreshold = 500;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int lightValue = analogRead(sensorPin);
  Serial.println(lightValue);

  // With the LDR as the lower divider resistor,
  // darker conditions usually produce a higher reading.
  if (lightValue > darkThreshold) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }

  delay(100);
}
```

This is a software illustration for the stated circuit and a compatible Arduino board. Check the pinout and electrical specifications of the exact board before building it. The external LED needs its current-limiting resistor in series.

### Overall system diagram

```text
Room light
    |
    v
LDR + fixed resistor
(physical input -> voltage)
    |
    v
Analog input / ADC
(voltage -> digital number)
    |
    v
Microcontroller program
(compare reading with threshold)
    |
    v
Digital output pin
    |
    v
330 Ω resistor + LED
(electrical output -> light)
```

The sensor, controller, and output are a chain. A failure at any point can affect the whole behavior: incorrect wiring changes the measurement, a wrong threshold causes incorrect decisions, and an incorrectly connected LED can fail or damage a component.

## 8. Learner activity

### Question A — Component selection

You need to build the automatic light indicator above. Name four pieces of information you would check before choosing the board, LDR, fixed resistor, and LED.

### Question B — Voltage divider

The input is 5 V, the fixed resistor is 10 kΩ, and the LDR resistance is 10 kΩ. Calculate the output voltage at the midpoint.

### Question C — Interpret a measurement

For the stated Uno R3 example, an ADC reading is approximately 900 in one condition and 180 in another. Which reading is more consistent with darkness in the circuit shown, and why?

### Question D — Actuator safety

A teammate proposes connecting a small DC motor directly to a microcontroller's GPIO pin. Explain why this is not a suitable design and name the type of interface that should be investigated instead.

## 9. Answers and expected outcomes

### Answer A

Possible answers include: operating and logic voltage; current and power limits; sensor resistance range; ADC/interface compatibility; LED forward voltage and current; physical/environmental conditions; cost and availability; and manufacturer datasheets. A good answer explains why the criterion matters rather than only listing terms.

### Answer B

Use the voltage-divider equation:

$$
V_{out}=5\frac{10}{10+10}=2.5\text{ V}
$$

Because the two resistances are equal, the midpoint is half the input voltage.

### Answer C

A reading near 900 is more consistent with darkness for the particular wiring shown. In this arrangement, darkness is assumed to increase the LDR resistance, which raises the midpoint voltage and therefore the ADC code. Actual threshold values depend on the components and lighting; test and calibrate the system rather than treating 900 as universal.

### Answer D

A GPIO pin is intended for a limited control signal and may not safely supply the motor's required current. A motor is an inductive load and can produce switching transients. Investigate a motor driver or suitably rated transistor/MOSFET circuit, including the required protection and power supply.

## 10. Troubleshooting checklist

If the system does not behave as expected, check one thing at a time:

1. Verify the board pinout and supply voltage against its official documentation.
2. Confirm that the fixed resistor and LDR are connected in series and that A0 connects to their junction.
3. Check that the circuit has a suitable ground reference.
4. Print sensor readings to the Serial Monitor and test bright and dark conditions.
5. Adjust the threshold only after observing real readings.
6. Confirm that the LED is the correct way around and has a series resistor.
7. If adapting to another board, check its analog input range and output limits before connecting the circuit.

---

# Further development plan

Before calling this module complete:

- [ ] Ask the team to confirm the module's intended scope and terminology.
- [ ] Ask the instructor/team to clarify what “Behaviorist AI” means in this course.
- [ ] Add the substantive Networks section and cite its sources.
- [ ] Add the substantive Behaviorist AI section and cite its sources.
- [ ] Add at least one whole-module example linking hardware, network communication, and an agent's behavior.
- [ ] Ask a teammate to check the hardware calculations and circuit diagram.
- [ ] Check all image credits, external references, code, and board-specific electrical assumptions.
- [ ] Update the status table honestly after reviews and team discussions.

# References

## Hardware content

1. Arduino. “UNO R3.” Board specifications, features, and documentation. <https://docs.arduino.cc/hardware/uno-rev3/>
2. Arduino. “Analog Input.” Example using a variable resistor and ADC readings. <https://docs.arduino.cc/built-in-examples/analog/AnalogInput/>
3. SparkFun Learn. “Voltage Dividers.” Principle, equation, applications, and practical limitations. <https://learn.sparkfun.com/tutorials/voltage-dividers/introduction>
4. Shoot stufz. “Arduino Uno R3 development board 03.” Wikimedia Commons, CC BY-SA 4.0. <https://commons.wikimedia.org/wiki/File:Arduino_Uno_R3_development_board_03.jpg>
5. Suyash Dwivedi. “25mm light-dependent resistor (LDR) (2).” Wikimedia Commons, CC BY-SA 4.0. <https://commons.wikimedia.org/wiki/File:25mm_light-dependent_resistor_(LDR)_(2).jpg>

## Starter references for outline-only sections

6. Cisco. “What Is Computer Networking?” Introductory overview of connected devices and network equipment. <https://www.cisco.com/site/us/en/learn/topics/networking/what-is-computer-networking.html>
7. Oikawa, K., Tsuchiya, T., and Okubo, S. “Object-Oriented Design of Subsumption Architecture.” *Journal of Robotics and Mechatronics*, 23(6), 697–705 (2005). This is one possible starting point for behavior-based robotics; confirm that this matches the course's use of “Behaviorist AI” before using it as the main reference. <https://www.jstage.jst.go.jp/article/jrsj1983/23/6/23_6_697/_article>

## Status note

This file is **V1.0, a draft**. The hardware explanations and worked example are organized to support beginner learning, but the team still needs to verify component assumptions and review the content. Networks and Behaviorist AI are not substantively developed here; their presence in the module outline does not mean they are complete.
