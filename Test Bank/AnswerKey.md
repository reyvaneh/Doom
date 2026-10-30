# Test Bank Answer Key

**Version 1.0 draft.** Try the questions before reading these answers. For open-ended questions, accept equivalent correct explanations, diagrams or worked steps.

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

**MC01 B - CPU.** The CPU executes program instructions. The other options are input or output devices.

**MC02 D - 5.** The 1s are in the 4 and 1 positions. Add 4 + 1 to get 5.

**MC03 A - 0.** Both inputs are not 1, so the supplied AND rule gives an output of 0.

**MC04 C - The CPU gets the next instruction from memory.** Fetching brings the next instruction from memory so the CPU can decode and execute it.

**MC05 A - Light sensor, microcontroller and LED.** The sensor detects light, the microcontroller applies the rule, and the LED provides the visible output.

**MC06 B - It should increase.** The question specifies the direction for this circuit: darker means a higher reading. Different wiring could reverse that direction.

**MC07 D - Disconnect power, then check the wiring and LED direction.** Disconnecting power allows the learner to inspect and correct the wiring without changing a powered circuit.

### Networks

**MC08 C - Computers connected within one classroom.** A classroom network covers a small local area. The other choices describe much wider connections.

**MC09 B - They cannot communicate with one another through that switch.** The stated switch is their only connection path. Without it, they cannot exchange data through that path.

**MC10 A - A to B to C.** The working A-B and B-C links provide an alternate route. This assumes the network can forward traffic along those links.

**MC11 C - Router.** A router forwards IP packets between networks. The other devices do not perform that networking role.

**MC12 D - Look up the address, send a request, receive a response.** Under the stated assumption, the browser obtains addressing information before sending the request. The server's response then supplies content.

**MC13 D - Provide a device with IP address settings.** DHCP can provide an IP address and other network settings automatically.

**MC14 C - Use a strong Wi-Fi password and keep router software updated.** A strong password and software updates help reduce unauthorized access and known vulnerabilities. They do not remove every risk.

### AI Behaviour

**MC15 B - The room and floor around the robot.** The environment is the surrounding task world in which the robot senses and acts, including the room, floor and dirt.

**MC16 A - Observe, choose an action, act, observe again.** The loop uses an observation to choose and carry out an action, then checks the environment again.

**MC17 C - Return to the dock.** The low-battery rule is checked first and applies, so it takes priority over cleaning.

**MC18 D - CHARGE.** The supplied condition is met, so the programmed transition changes the mode to CHARGE.

**MC19 A - Updating an action estimate after receiving reward feedback.** Updating an action estimate uses experience in a way that can influence future choices. The other examples do not describe such an update.

**MC20 B - The robot may choose an action using incomplete information.** A missed dirt reading gives an incomplete picture of the floor. The controller may then choose an action that does not fit the true situation.

## Part C Explain Your Answer

### Hardware

#### OE01 Sample answer

The laptop's storage keeps the saved photo even when the laptop is switched off. When Mia opens the photo, the application uses RAM as working space for the image and her edits. The CPU carries out the application's instructions, such as changing the picture, while the screen shows the result. When power is lost, the edits held only in RAM are lost under the conditions in the question. The original photo remains on storage because Mia did not replace it with a saved edited version. Saving her work regularly would put a copy of the changes on storage. She could also save a separate edited copy to keep the original.

**Expected key points**

- Storage retains the saved file; RAM is temporary working space.
- The CPU executes instructions and the screen displays the result.
- The unsaved edits are lost, while the original saved photo remains.
- Saving regularly or saving an edited copy reduces the risk of losing changes.

#### OE02 Sample answer

The light sensor responds to the room's brightness and produces a voltage in the sensing circuit. The ADC turns that voltage into a number. The microcontroller reads the number and follows the supplied rule. The LED is the output that shows the result. At 300 the LED should be off because 300 is below 600. At 700 it should be on because 700 is at least 600. At 400 it should be off again. If it stays off at 700, one possible cause is an LED connected in the wrong direction. Disconnect the low-voltage circuit's power before checking its direction and wiring against the diagram. Other faults are also possible; one symptom does not prove a single cause.

**Expected key points**

- Trace sensor voltage to ADC number to controller rule to LED output.
- The three results are off, on, off.
- Give a plausible fault, such as reversed LED polarity or a loose connection.
- Disconnect power before changing wiring; do not claim the fault is certain.

### Networks

#### OE03 Sample answer

The browser starts with a website name, so it uses DNS to obtain the addressing information needed to contact the site. In this example no cached answer is available. The laptop sends its request through the home network to the router. The router forwards traffic toward other networks, and the request eventually reaches the web server. The server provides the requested content, and a response returns through the networks to the laptop. The browser can then show the page. The router's job is forwarding between networks, while the server's job is providing the page. A working local connection alone would not prove the website is reachable, because the Internet connection or the remote server could still have a problem.

**Expected key points**

- DNS helps resolve the name to addressing information; it does not supply the whole page.
- Describe a request to the server and a response back through the network.
- The router forwards traffic; the server supplies content.
- Local connectivity and successful Internet access are separate checks.

#### OE04 Sample answer

In the star network, all three computers depend on switch H to reach one another. If H loses power, they cannot communicate through the stated network because no other links are available. In the mesh example, the direct A-C link has failed, but A can still send data to B and then from B to C. The path is A to B to C, using the two working links and the forwarding assumption in the question. This does not mean every mesh survives every failure. If the remaining paths are also broken, communication can stop. If the alternate path stopped working, checking A-B or B-C would be sensible because both links are needed for that route.

**Expected key points**

- The star loses its only shared forwarding point when H loses power.
- The alternate mesh path is A to B to C.
- Resilience depends on which nodes and links remain working.
- Check a link actually used by the alternate path, such as A-B or B-C.

### AI Behaviour

#### OE05 Sample answer

In Case A the robot returns to the dock. Its battery is low, so the first rule matches and takes priority even though the tile is dirty. In Case B the battery is normal, so the first rule does not apply. The dirty-tile rule then tells the robot to clean. In Case C neither low battery nor dirt is present, so the robot moves to another tile. If the dirty-tile rule were checked first, Case A would select cleaning instead of returning. This change comes from the priority order given by the programmer. Following either order does not by itself prove learning. The robot can carry out these fixed instructions without updating any rules or estimates from experience.

**Expected key points**

- Case A returns, Case B cleans, and Case C moves.
- Each result follows from the first matching rule.
- Putting the dirty-tile rule first makes Case A clean.
- A programmed rule order is not evidence of learning from experience.

#### OE06 Sample answer

Controller B describes learning from experience because reward feedback changes its action estimates, which can influence later choices. Controller A only prints a score and keeps its rules and estimates unchanged. The displayed score does not provide a mechanism that learns. To check whether B improves, compare its early and later performance using the same task conditions and a similar range of starting situations. Record how much dirt it removes and how many steps it takes. Cleaning more dirt in fewer steps would be useful evidence, provided the comparison is fair. Repeat the task rather than trusting one good run, because a favourable starting situation or a lucky choice could explain a single success. Keep the results rather than assuming an update guarantees improvement.

**Expected key points**

- B updates action estimates from feedback; A does not.
- A score alone is not a learning mechanism.
- Use comparable starting conditions and record cleaning and steps.
- Repeat trials; an update or one good run does not guarantee improvement.
