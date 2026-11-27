# Test Bank Answer Key

**Version 1.1 draft.** Try the questions before reading these answers. For open-ended questions, accept equivalent correct explanations, diagrams or worked steps.

## Part A True or False

### Hardware

**TF01 True.** RAM needs power to retain its contents. A file already saved to non-volatile storage can remain after power is lost.

**TF02 False.** One byte contains eight bits. Each bit has a value of 0 or 1.

**TF03 True.** The CPU fetches, decodes and executes instructions to perform the program's work.

**TF04 False.** A light sensor detects light. A motor is an output device that produces movement.

**TF05 True.** The ADC represents an analog voltage using a digital code. The program can read that code.

**TF06 False.** The resistor limits current through the LED. Removing it can allow too much current and damage the LED or controller pin.

**TF07 True.** The controller pin provides the control signal. A suitable driver handles the motor's larger current.

### Networks

**TF08 True.** Local communication does not always need the Internet. For example, a laptop may still reach a local printer when local links and settings work.

**TF09 False.** Wi-Fi describes a wireless connection method. A home or classroom Wi-Fi network can be a local area network.

**TF10 True.** A switch forwards frames within a local network, commonly using destination MAC addresses.

**TF11 False.** DNS helps resolve a website name to addressing information. The webpage content comes from a web server.

**TF12 False.** They have different roles. IP addresses support communication between IP networks; MAC addresses are used for local-link communication.

**TF13 True.** UDP has no built-in delivery or ordering guarantee. An application can add mechanisms if it needs them.

**TF14 False.** Bandwidth describes capacity, while latency describes delay. A link can have high capacity and still have a long delay.

### AI Behaviour

**TF15 True.** The reading gives the robot information about its environment. Cleaning is an action it may choose in response.

**TF16 True.** A programmed rule can say to open when a person is detected. That response alone does not show learning.

**TF17 False.** The switch may follow a transition written by the programmer. Changing mode alone does not prove learning from experience.

**TF18 False.** A score alone is not a learning mechanism. Learning needs an update from experience that can affect behaviour.

**TF19 True.** Exploration tries choices to gain information. Exploitation uses choices favoured by the agent's current estimates.

**TF20 False.** Real sensors, surfaces and mechanisms can differ from the simulation. Real-world success needs suitable testing.

## Part B Multiple Choice

### Hardware

**MC01 B - CPU.** The CPU fetches, decodes and executes program instructions. RAM holds the running program and its data, the SSD keeps files when power is off, and the motherboard connects the parts; none of them executes the instructions.

**MC02 D - 5.** The 1s are in the 4 and 1 positions. Add 4 + 1 to get 5.

**MC03 A - 0.** The inputs are not both 1, so the supplied AND rule gives an output of 0. The order of the inputs does not matter for AND.

**MC04 C - The CPU gets the next instruction from memory.** Fetching copies the next instruction from memory (at the address in the program counter) into the CPU. Working out its meaning is the decode step, and carrying it out is the execute step.

**MC05 A - Light sensor, microcontroller and LED.** The indicator must sense light and give a visible output. The light sensor detects light, the microcontroller applies the rule, and the LED provides the visible output. A push button or temperature sensor does not measure light, and a buzzer gives sound rather than light.

**MC06 B - It should increase.** The question specifies the direction for this circuit: darker means a higher reading. Different wiring could reverse that direction, and a reading of zero would suggest a wiring fault rather than a darker room.

**MC07 D - Disconnect power, then check wiring and LED polarity.** Disconnecting power lets the learner inspect and correct the wiring safely; a reversed LED (wrong polarity) is a common cause. Removing the resistor or raising the voltage can damage the LED, and working on a powered circuit is unsafe.

### Networks

**MC08 C - Computers connected within one classroom.** A classroom network covers a small local area, so it is a LAN. Networks that span a country, several countries or different cities are wide area networks (WANs).

**MC09 B - They cannot communicate with one another through that switch.** In a star network the central switch is the only connection path. Without it none of the computers can exchange data through that path. They do not form a mesh by themselves, and an IP address alone does not provide a link.

**MC10 A - A to B to C.** The working A-B and B-C links provide an alternate route. This assumes the network can forward traffic along those links. Links carry traffic in both directions, and the failed A-C link cannot be used.

**MC11 C - Router.** A router forwards IP packets between different networks, for example between a home network and the Internet. A switch forwards frames between devices on the same local network using MAC addresses, a hub repeats signals to every port, and a wireless access point connects Wi-Fi devices to the local network.

**MC12 D - Look up the address, send a request, receive a response.** Under the stated assumption, the browser first obtains the server's IP address from DNS, then sends its request to that address, and finally receives the server's response with the content. A request cannot be sent before the address is known, and a response cannot arrive before a request.

**MC13 D - Give a device an IP address and other network settings.** DHCP automatically gives a joining device an IP address and other settings such as the router (gateway) and DNS server addresses. Translating names into addresses is the job of DNS, forwarding between networks is the router's job, and Wi-Fi security (WPA2/WPA3) encrypts the wireless link.

**MC14 C - Use a strong Wi-Fi password and update router software.** A strong password and software updates help reduce unauthorized access and known vulnerabilities. Hiding the network name does not protect a default admin password, WEP is outdated and easily broken, and turning off encryption exposes traffic. No single step removes every risk.

### AI Behaviour

**MC15 B - The room and floor around the robot.** The environment is the surrounding task world in which the robot senses and acts, including the room, floor and dirt. Sensors and wheels are part of the agent (its sensors and actuators), the program is the agent's controller, and a reported score is an output, not the environment.

**MC16 A - Observe, choose an action, act, observe again.** The loop uses an observation to choose and carry out an action, then checks the environment again. Observing only at the end, ignoring results or repeating one action forever breaks the loop.

**MC17 C - Return to the dock.** The low-battery rule is checked first and applies, so it takes priority over cleaning. The robot uses only the first matching rule, so it does not clean first.

**MC18 D - CHARGE.** The supplied condition is met, so the programmed transition changes the mode to CHARGE. Staying in RETURN would ignore the rule, and CLEAN or WANDER are not the stated next mode.

**MC19 A - Updating an action estimate after reward feedback.** Updating an action estimate uses experience in a way that can influence future choices. A fixed rule, a printed score and a programmed mode switch can all happen without any learning update.

**MC20 B - The robot may act on incomplete information.** A missed dirt reading gives an incomplete picture of the floor. The controller may then choose an action that does not fit the true situation. A noisy sensor does not make the robot learn, does not prove the floor is clean, and does not by itself mean the rules are wrong.

## Part B Extension Multiple Choice

### Networks

**MC21 C - SYN, SYN-ACK, ACK.** This is the TCP three-way handshake. The client sends SYN to ask to start. The server replies SYN-ACK: it acknowledges the client's SYN and sends its own. The client confirms with ACK, and data can then flow. UDP sends data without this handshake.

**MC22 A - Layer 4, Transport.** TCP and UDP work at the Transport layer (Layer 4) and add port numbers, for example 443 for HTTPS. The Network layer adds IP addresses for routing between networks, the Data Link layer adds MAC addresses for one local link, and the Application layer holds protocols such as HTTP and DNS that use the transport service.

### Hardware

**MC23 D - Harvard keeps instructions and data on separate buses.** In a von Neumann design, instructions and data share one memory and one set of buses, so they take turns. A Harvard design, such as the AVR chip on the Arduino Uno, has separate memories and buses for program and data, so it can fetch the next instruction while it accesses data. Both use binary and both have a CPU.

**MC24 B - 65,536.** Each of the 16 address lines is 0 or 1, so there are 2^16 = 65,536 different address patterns (0x0000 to 0xFFFF), or 64 KB if each location holds one byte. 16 is only the number of lines, 256 is 2^8 and 32,768 is 2^15.

**MC25 A - In series, so the current flows through the meter.** Current is the flow around the loop, so you break the circuit and place the meter in series, using the A or mA socket and setting. Voltage is measured across a part (in parallel), and resistance is measured with the power off. A meter set to current and placed across a supply makes a short circuit and can blow its fuse.

**MC26 C - 220 Ω ±5%.** The first two bands are digits: red, red gives 22. The third band is the multiplier: brown is ×10, so 22 × 10 = 220 Ω. Gold in the fourth band means ±5%. 22 Ω ignores the multiplier, 2.2 kΩ uses red (×100) as the multiplier, and ±10% would be a silver band.

**MC27 D - 2, the address of the next instruction.** During fetch, the instruction at the address in the PC (1) is copied into the instruction register, and then the PC is increased to 2 so it points to the next instruction. A jump can load a different address, but ADD does not. The operand 5 is a data address used during execute, not the next instruction.

### AI Behaviour

**MC28 B - 5.0.** There are now 2 tries. The surprise is 8 − 2.0 = 6. Share it over the tries: 6 ÷ 2 = 3. New average = 2.0 + 3 = 5.0. Check: the plain average of 2 and 8 is (2 + 8) ÷ 2 = 5. 8.0 just copies the latest reward, 3.0 is only the step, and 6.0 is the surprise.

**MC29 A - 6.0.** Target = 2 + 0.9 × 10.0 = 11.0. Difference = 11.0 − 1.0 = 10.0. New Q = 1.0 + 0.5 × 10.0 = 6.0. 11.0 is the target before the learning rate is applied, 5.5 is 0.5 × 11.0 without the old estimate, and 6.5 forgets the discount factor (1.0 + 0.5 × (2 + 10 − 1)).

**MC30 C - 11.2.** 4 + 0.9 × (−1) + 0.81 × 10 = 4 − 0.9 + 8.1 = 11.2. 13.0 adds the rewards with no discount, 12.0 discounts only the last reward once, and 10.08 wrongly discounts the first reward as well.

## Part C Explain Your Answer

### Hardware

#### OE01 Sample answer · Saving work: storage, RAM and the CPU

The laptop's storage keeps the saved photo even when the laptop is switched off. When Mia opens the photo, the application uses RAM as working space for the image and her edits. The CPU carries out the application's instructions, such as changing the picture, while the screen shows the result. When power is lost, the edits held only in RAM are lost under the conditions in the question. The original photo remains on storage because Mia did not replace it with a saved edited version. Saving her work regularly would put a copy of the changes on storage. She could also save a separate edited copy to keep the original.

**Expected key points**

- Storage retains the saved file; RAM is temporary working space.
- The CPU executes instructions and the screen displays the result.
- The unsaved edits are lost, while the original saved photo remains.
- Saving regularly or saving an edited copy reduces the risk of losing changes.

#### OE02 Sample answer · Tracing the automatic light indicator

The light sensor responds to the room's brightness and produces a voltage in the sensing circuit. The ADC turns that voltage into a number. The microcontroller reads the number and follows the supplied rule. The LED is the output that shows the result. At 300 the LED should be off because 300 is below 600. At 700 it should be on because 700 is at least 600. At 400 it should be off again. If it stays off at 700, one possible cause is an LED connected in the wrong direction. Disconnect the low-voltage circuit's power before checking its direction and wiring against the diagram. Other faults are also possible; one symptom does not prove a single cause.

**Expected key points**

- Trace sensor voltage to ADC number to controller rule to LED output.
- The three results are off, on, off.
- Give a plausible fault, such as reversed LED polarity or a loose connection.
- Disconnect power before changing wiring; do not claim the fault is certain.

### Networks

#### OE03 Sample answer · Visiting a website: DNS, router and web server

The browser starts with a website name, so it uses DNS to obtain the addressing information needed to contact the site. In this example no cached answer is available. The laptop sends its request through the home network to the router. The router forwards traffic toward other networks, and the request eventually reaches the web server. The server provides the requested content, and a response returns through the networks to the laptop. The browser can then show the page. The router's job is forwarding between networks, while the server's job is providing the page. A working local connection alone would not prove the website is reachable, because the Internet connection or the remote server could still have a problem.

**Expected key points**

- DNS helps resolve the name to addressing information; it does not supply the whole page.
- Describe a request to the server and a response back through the network.
- The router forwards traffic; the server supplies content.
- Local connectivity and successful Internet access are separate checks.

#### OE04 Sample answer · Star and mesh networks when a link fails

In the star network, all three computers depend on switch H to reach one another. If H loses power, they cannot communicate through the stated network because no other links are available. In the mesh example, the direct A-C link has failed, but A can still send data to B and then from B to C. The path is A to B to C, using the two working links and the forwarding assumption in the question. This does not mean every mesh survives every failure. If the remaining paths are also broken, communication can stop. If the alternate path stopped working, checking A-B or B-C would be sensible because both links are needed for that route.

**Expected key points**

- The star loses its only shared forwarding point when H loses power.
- The alternate mesh path is A to B to C.
- Resilience depends on which nodes and links remain working.
- Check a link actually used by the alternate path, such as A-B or B-C.

### AI Behaviour

#### OE05 Sample answer · Rule order in a cleaning robot

In Case A the robot returns to the dock. Its battery is low, so the first rule matches and takes priority even though the tile is dirty. In Case B the battery is normal, so the first rule does not apply. The dirty-tile rule then tells the robot to clean. In Case C neither low battery nor dirt is present, so the robot moves to another tile. If the dirty-tile rule were checked first, Case A would select cleaning instead of returning. This change comes from the priority order given by the programmer. Following either order does not by itself prove learning. The robot can carry out these fixed instructions without updating any rules or estimates from experience.

**Expected key points**

- Case A returns, Case B cleans, and Case C moves.
- Each result follows from the first matching rule.
- Putting the dirty-tile rule first makes Case A clean.
- A programmed rule order is not evidence of learning from experience.

#### OE06 Sample answer · Fixed rules versus learning from experience

Controller B describes learning from experience because reward feedback changes its action estimates, which can influence later choices. Controller A only prints a score and keeps its rules and estimates unchanged. The displayed score does not provide a mechanism that learns. To check whether B improves, compare its early and later performance using the same task conditions and a similar range of starting situations. Record how much dirt it removes and how many steps it takes. Cleaning more dirt in fewer steps would be useful evidence, provided the comparison is fair. Repeat the task rather than trusting one good run, because a favourable starting situation or a lucky choice could explain a single success. Keep the results rather than assuming an update guarantees improvement.

**Expected key points**

- B updates action estimates from feedback; A does not.
- A score alone is not a learning mechanism.
- Use comparable starting conditions and record cleaning and steps.
- Repeat trials; an update or one good run does not guarantee improvement.
