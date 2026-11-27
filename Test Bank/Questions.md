# Hardware Networks and AI Behaviour Test Bank

**Team Doom | Version 1.1 draft | 27 November 2026**

Use these questions to practise the main ideas in Hardware, Networks and AI Behaviour. All 56 questions can be answered without equipment or an external website. Write answers separately, then check AnswerKey.md.

The bank mainly assesses the core course, Study Guide Chapters 1-6. Some core items also use the light-indicator project (Chapter 9), network diagrams (Chapter 11) and limits of models (Chapter 15). The Extension multiple-choice questions MC21-MC30 assess Chapters 7-16 material and the Guide's calculations: TCP and OSI layers, buses and architectures, lab skills, running averages, Q-learning and discounted return.

Each question names its learning-material source and the Study Guide section to revise, written as "→ Guide §x.y". The bank is a draft for teammate review.

## Part A True or False

Write True or False for each statement.

### Hardware

#### TF01

Unsaved work held only in RAM can be lost when the computer loses power.

*Topic source: Hardware A1 and A2 → Guide §1.2.*

#### TF02

One byte contains four bits.

*Topic source: Hardware A3 → Guide §2.2.*

#### TF03

The CPU carries out program instructions.

*Topic source: Hardware A5 → Guide §1.2 and §2.4.*

#### TF04

A light sensor's main job is to turn a motor.

*Topic source: Hardware B1 and B12 → Guide §9.2.*

#### TF05

An analog-to-digital converter turns an input voltage into a number the program can use.

*Topic source: Hardware B7 → Guide §9.3.*

#### TF06

In the module's simple LED circuit, the current-limiting resistor can be removed because an LED limits its own current safely.

*Topic source: Hardware B8 → Guide §9.4.*

#### TF07

A motor that needs more current than a controller pin can supply needs a suitable driver circuit.

*Topic source: Hardware B9 → Guide §9.5.*

### Networks

#### TF08

Devices on a working local network can sometimes communicate even when the Internet connection is unavailable.

*Topic source: Network Fundamentals 01 and 02 → Guide §3.1.*

#### TF09

Every network that uses Wi-Fi is a wide area network.

*Topic source: Network Fundamentals 02 → Guide §3.1.*

#### TF10

A switch can forward data frames between devices on a local network.

*Topic source: Network Fundamentals 04 → Guide §3.3.*

#### TF11

DNS normally sends the complete webpage to your browser.

*Topic source: Network Fundamentals 06 and 07 → Guide §4.2.*

#### TF12

An IP address and a MAC address have exactly the same job.

*Topic source: Network Fundamentals 05 → Guide §3.3.*

#### TF13

UDP does not itself guarantee that data arrives in order.

*Topic source: Network Fundamentals 07 and Beginner Prerequisites packets → Guide §4.4.*

#### TF14

Higher bandwidth always means lower delay.

*Topic source: Network Fundamentals 13 → Guide §4.3.*

### AI Behaviour

#### TF15

A robot's dirt-sensor reading is an observation.

*Topic source: AI Behaviour 2 → Guide §5.2.*

#### TF16

An automatic door can open by following a fixed rule without learning.

*Topic source: AI Behaviour 2 and 3 → Guide §5.3.*

#### TF17

A robot switching from CLEAN mode to RETURN mode proves that it has learned.

*Topic source: AI Behaviour 3 → Guide §6.1.*

#### TF18

Showing a score after each action is enough to make a controller learn, even if it never updates anything from experience.

*Topic source: AI Behaviour 4 → Guide §6.2 and §15.4.*

#### TF19

Trying an unfamiliar action to gather experience is an example of exploration.

*Topic source: AI Behaviour 4 → Guide §6.4.*

#### TF20

A robot that succeeds in a computer simulation is guaranteed to succeed on a real floor.

*Topic source: AI Behaviour Training and use and 9 → Guide §15.3.*

## Part B Multiple Choice

Choose ONE answer, A, B, C or D, for each question.

### Hardware

#### MC01

Which part carries out the instructions of a program?

A. RAM<br>
B. CPU<br>
C. Storage drive (SSD)<br>
D. Motherboard<br>

*Topic source: Hardware A1 → Guide §1.2.*

#### MC02

The four binary positions have values 8, 4, 2 and 1, from left to right. What decimal number does 0101 represent?

A. 2<br>
B. 4<br>
C. 6<br>
D. 5<br>

*Topic source: Hardware A3 → Guide §2.2.*

#### MC03

An AND gate outputs 1 only when both inputs are 1. What is its output when the inputs are 1 and 0?

A. 0<br>
B. 1<br>
C. It depends on which input is 1<br>
D. It cannot be decided from the rule<br>

*Topic source: Hardware A4 → Guide §2.3.*

#### MC04

In fetch-decode-execute, what happens during the fetch step?

A. The CPU carries out the decoded instruction<br>
B. The control unit works out what the instruction means<br>
C. The CPU gets the next instruction from memory<br>
D. The CPU writes the finished program to storage<br>

*Topic source: Hardware A5 → Guide §2.4.*

#### MC05

An automatic light indicator must measure the room light and switch on a visible light when it gets dark. Which set of parts is suitable?

A. Light sensor, microcontroller and LED<br>
B. Push button, microcontroller and LED<br>
C. Light sensor, microcontroller and buzzer<br>
D. Temperature sensor, microcontroller and LED<br>

*Topic source: Hardware A6 B1 and B5 → Guide §9.2.*

#### MC06

In the module's light-sensor circuit, a darker room gives a higher sensor reading. The room becomes darker. What should happen to the reading?

A. It should stay the same<br>
B. It should increase<br>
C. It should decrease<br>
D. It should drop to zero<br>

*Topic source: Hardware B6 and B7 → Guide §9.2.*

#### MC07

An LED does not light in a low-voltage learning circuit. What is a sensible first action before changing its wiring?

A. Swap in a brighter LED and leave the power connected<br>
B. Remove the current-limiting resistor to allow more current<br>
C. Increase the supply voltage while the circuit stays powered<br>
D. Disconnect power, then check wiring and LED polarity<br>

*Topic source: Hardware B4 and B15 → Guide §8.1 and §9.4.*

### Networks

#### MC08

Which example is a local area network?

A. A mobile network covering a whole country<br>
B. A bank network joining branches in several countries<br>
C. Computers connected within one classroom<br>
D. A link joining offices in different cities<br>

*Topic source: Network Fundamentals 02 → Guide §3.1.*

#### MC09

Three classroom computers connect only through one central switch. The switch loses power. What is the likely result?

A. Only the computer closest to the switch loses connection<br>
B. They cannot communicate with one another through that switch<br>
C. They automatically form a mesh network and keep talking<br>
D. They keep communicating because each PC still has an IP address<br>

*Topic source: Network Fundamentals 03 → Guide §11.1.*

#### MC10

A network has links A-B, B-C and A-C. The A-C link fails, but the other links work. Which path can still connect A to C?

A. A to B to C<br>
B. A directly to C over the failed link<br>
C. None, because only direct links can carry traffic<br>
D. C to B to A only, because traffic flows one way<br>

*Topic source: Network Fundamentals 03 → Guide §11.1.*

#### MC11

Which device forwards IP packets between different IP networks?

A. Switch<br>
B. Hub<br>
C. Router<br>
D. Wireless access point<br>

*Topic source: Network Fundamentals 04 → Guide §3.3 and §11.2.*

#### MC12

Assume a browser needs a DNS lookup before contacting a website. Which simple order is correct?

A. Send a request, look up the address, receive a response<br>
B. Look up the address, receive a response, send a request<br>
C. Receive a response, look up the address, send a request<br>
D. Look up the address, send a request, receive a response<br>

*Topic source: Network Fundamentals 06 → Guide §4.2.*

#### MC13

What is one job of DHCP on a home network?

A. Translate a website name into an IP address<br>
B. Forward packets between the home network and the Internet<br>
C. Encrypt traffic between the laptop and the router<br>
D. Give a device an IP address and other network settings<br>

*Topic source: Network Fundamentals 12 → Guide §3.4 and §12.3.*

#### MC14

Which action helps protect a home Wi-Fi network?

A. Hide the network name but keep the default admin password<br>
B. Use WEP encryption because older routers support it<br>
C. Use a strong Wi-Fi password and update router software<br>
D. Turn off encryption so devices connect more reliably<br>

*Topic source: Network Fundamentals 08 → Guide §11.4.*

### AI Behaviour

#### MC15

A cleaning robot senses dirt and moves around a room. Which is its environment?

A. The robot's sensors and wheels<br>
B. The room and floor around the robot<br>
C. The robot's program and its rules<br>
D. The score the robot reports after cleaning<br>

*Topic source: AI Behaviour 2 → Guide §5.2.*

#### MC16

Which order matches the agent loop?

A. Observe, choose an action, act, observe again<br>
B. Choose an action, act, then observe once at the end<br>
C. Observe, act at random, then ignore the result<br>
D. Act, observe, then repeat the same action forever<br>

*Topic source: AI Behaviour Follow one decision → Guide §5.3.*

#### MC17

A robot uses these rules in order: first return to the dock if the battery is low; otherwise clean if the tile is dirty. The battery is low and the tile is dirty. What does it do?

A. Clean the tile, because it is dirty<br>
B. Clean first, then return to the dock<br>
C. Return to the dock<br>
D. Keep moving to look for more dirt<br>

*Topic source: AI Behaviour 3 → Guide §5.3.*

#### MC18

A robot is in RETURN mode. Its programmed rule says to switch to CHARGE when it reaches the dock. It reaches the dock. What is its next mode?

A. CLEAN<br>
B. RETURN<br>
C. WANDER<br>
D. CHARGE<br>

*Topic source: AI Behaviour 3 → Guide §5.3.*

#### MC19

Which example describes learning from experience?

A. Updating an action estimate after reward feedback<br>
B. Repeating a fixed rule that always gives a good score<br>
C. Printing a score after each action without changing rules<br>
D. Switching mode when a programmed condition is met<br>

*Topic source: AI Behaviour 4 → Guide §6.1.*

#### MC20

A robot's dirt sensor sometimes misses dirt. What is a reasonable conclusion?

A. The robot will learn to see the missed dirt automatically<br>
B. The robot may act on incomplete information<br>
C. The floor is clean wherever the sensor reports no dirt<br>
D. The robot's rules must be wrong and need replacing<br>

*Topic source: AI Behaviour 9 → Guide §15.3.*

## Part B Extension Multiple Choice

These questions assess Study Guide Chapters 7-16 and its worked calculations. Choose ONE answer, A, B, C or D, for each question. Show your working for the calculations.

### Networks

#### MC21

A laptop opens a TCP connection to a web server before any webpage data is sent. Which order of control messages sets up the connection?

A. SYN, ACK, SYN-ACK<br>
B. ACK, SYN-ACK, SYN<br>
C. SYN, SYN-ACK, ACK<br>
D. SYN-ACK, SYN, ACK<br>

*Topic source: Network Fundamentals 07 and 11 → Guide §4.4.*

#### MC22

Data is wrapped layer by layer before it is sent. At which OSI layer do TCP and UDP add port numbers so the data reaches the right application?

A. Layer 4, Transport<br>
B. Layer 3, Network<br>
C. Layer 2, Data Link<br>
D. Layer 7, Application<br>

*Topic source: Network Fundamentals 07 and 11 → Guide §12.1 and §12.2.*

### Hardware

#### MC23

What is the main difference between a von Neumann architecture and a Harvard architecture?

A. Von Neumann uses binary, while Harvard uses decimal numbers<br>
B. Harvard has no CPU and runs programs directly from memory<br>
C. Von Neumann keeps instructions and data on separate buses<br>
D. Harvard keeps instructions and data on separate buses<br>

*Topic source: Hardware A6 (von Neumann vs Harvard) → Guide §7.1.*

#### MC24

A processor has a 16-bit address bus. How many different memory locations can it address directly?

A. 16<br>
B. 65,536<br>
C. 256<br>
D. 32,768<br>

*Topic source: Hardware A5 (buses, MAR and MDR) → Guide §7.2.*

#### MC25

You want to measure the current flowing through an LED circuit with a multimeter. How should the meter be connected?

A. In series, so the current flows through the meter<br>
B. In parallel across the LED, the same way as for voltage<br>
C. In series, with the dial set to resistance (Ω)<br>
D. Across the battery terminals with the power on<br>

*Topic source: Beginner Lab Skills L2 → Guide §8.2.*

#### MC26

A four-band resistor reads red, red, brown, gold. Use the colour code: red = 2 (multiplier ×100), brown = 1 (multiplier ×10), gold as the fourth band = ±5% tolerance. What is its value?

A. 22 Ω ±5%<br>
B. 2.2 kΩ ±5%<br>
C. 220 Ω ±5%<br>
D. 220 Ω ±10%<br>

*Topic source: Beginner Lab Skills L3 → Guide §8.3.*

#### MC27

In the paper CPU, the program counter (PC) holds 1 when a fetch starts. The instruction at address 1 is ADD 5, which is not a jump. What does the PC hold once the fetch step has finished?

A. 1, because the PC changes only on a jump<br>
B. 5, the operand address in ADD 5<br>
C. 0, because the PC resets after each fetch<br>
D. 2, the address of the next instruction<br>

*Topic source: Hardware A5 (worked example: a paper CPU) → Guide §2.4.*

### AI Behaviour

#### MC28

A robot's average reward for one action is 2.0 after 1 try. It tries the action again and gets a reward of 8. Use: new average = old average + (reward − old average) ÷ number of tries. What is the new average?

A. 8.0<br>
B. 5.0<br>
C. 3.0<br>
D. 6.0<br>

*Topic source: AI Behaviour 4 and Study Book 6.3 (route-choice game) → Guide §6.3.*

#### MC29

A Q-learning robot uses: target = reward + γ × best next Q, and new Q = old Q + α × (target − old Q). Old Q = 1.0, reward = 2, best next Q = 10.0, α = 0.5 and γ = 0.9. What is the new Q?

A. 6.0<br>
B. 11.0<br>
C. 5.5<br>
D. 6.5<br>

*Topic source: AI Behaviour 6 (Q-learning update) → Guide §14.2.*

#### MC30

A vacuum robot follows SUCK, RIGHT, SUCK and receives rewards 4, then −1, then 10. With discount factor γ = 0.9, the return is 4 + 0.9 × (−1) + 0.9² × 10. What is the discounted return?

A. 13.0<br>
B. 12.0<br>
C. 11.2<br>
D. 10.08<br>

*Topic source: AI Behaviour 5.2 (reward and return) → Guide §13.4.*

## Part C Explain Your Answer

Answer all three parts of each question. Aim for a developed response, normally more than 100 words in total per question, or equivalent reasoning using a labeled diagram, table or step-by-step trace. Keep the explanation simple and use the supplied situation.

### Hardware

#### OE01 · Saving work: storage, RAM and the CPU

Mia opens a photo saved on her laptop's storage. She edits it in an application but does not save the changes. The laptop then loses power. Assume the edits were held only in RAM and no recovery copy was made.

a) Explain the jobs of storage, RAM, the CPU and the screen while Mia works.
b) What happens to the unsaved edits? What happens to the original saved photo?
c) Explain one simple habit that would help Mia avoid losing her next edits.

*Topic source: Hardware A1 A2 and A5 → Guide §1.2 and §1.3.*

#### OE02 · Tracing the automatic light indicator

An automatic light indicator uses a light sensor, an ADC, a microcontroller and an LED. The sensor produces a voltage; the ADC converts it to a number. In this circuit, darker conditions give a higher number. The controller turns the LED on for a reading of 600 or more, and off for a lower reading. The readings are 300, then 700, then 400.

a) Trace the path from room light to the LED. Explain the sensor, ADC, controller and LED roles.
b) Give the LED result for each of the three readings and explain the rule.
c) The LED stays off at 700. Give one possible wiring problem and a safe first check before changing wires.

*Topic source: Hardware B6 B7 B8 B11 and B15 → Guide §9.2 to §9.4.*

### Networks

#### OE03 · Visiting a website: DNS, router and web server

Leo's laptop is connected to his working home network. He types a website name into a browser. Assume the address is not already cached, DNS works, and the website is reachable. The home router connects the local network to the Internet. A web server holds the requested page.

a) Explain why the browser needs DNS in this example.
b) Describe the simple request and response journey between the laptop and web server through the router.
c) Explain why the router and the web server have different jobs. Would a working local connection alone prove that the website is reachable?

*Topic source: Network Fundamentals 04 06 and 07 → Guide §4.2 and §11.3.*

#### OE04 · Star and mesh networks when a link fails

Compare two small networks. In the star network, computers A, B and C each have one link to switch H; they have no other links. In the mesh example, nodes A, B and C have links A-B, B-C and A-C. Assume the mesh can forward data along any listed working path.

a) In the star network, what happens to communication between the computers if H loses power? Explain why.
b) In the mesh example, A-C fails while A-B and B-C still work. Write a path from A to C.
c) Explain why this does not mean every mesh survives every failure. Name a link you would check if the alternate path stopped working.

*Topic source: Network Fundamentals 03 → Guide §11.1.*

### AI Behaviour

#### OE05 · Rule order in a cleaning robot

A cleaning robot checks these rules in order and uses the first matching rule: (1) if the battery is low, return to the dock; (2) otherwise, if the current tile is dirty, clean it; (3) otherwise, move to another tile. Case A has a low battery and a dirty tile. Case B has a normal battery and a dirty tile. Case C has a normal battery and a clean tile.

a) State the action for each case and explain which rule applies.
b) Suppose the dirty-tile rule is checked before the low-battery rule. What would change in Case A?
c) Does following either rule order prove that the robot learns? Explain simply.

*Topic source: AI Behaviour 2 and 3 → Guide §5.3 and §5.4.*

#### OE06 · Fixed rules versus learning from experience

Controller A follows fixed cleaning rules and prints a score after each action. It never changes its rules or action estimates. Controller B uses reward feedback to update its action estimates, and those estimates can affect its next choices. Both are tested on the same simple cleaning task.

a) Which controller describes learning from experience? Explain what changes.
b) Why is Controller A's printed score not enough to show learning?
c) Suggest a simple fair comparison to check whether B improves. Mention both cleaning results and the number of steps, and explain why one good run is not enough.

*Topic source: AI Behaviour 3 4 and What would count as evidence → Guide §6.2 and §15.4.*

## Source Materials

- [Hardware](../Learning%20Materials/Hardware/hardware.md)
- [Network Fundamentals](../Learning%20Materials/Network/network_fundamentals.md)
- [Network Beginner Prerequisites](../Learning%20Materials/Network/beginner-prerequisites.md)
- [AI Behaviour](../Learning%20Materials/AIBehaviour/AIBehaviour.md)
