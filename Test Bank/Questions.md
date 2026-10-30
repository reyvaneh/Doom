# Hardware Networks and AI Behaviour Test Bank

**Team Doom | Version 1.0 draft | 30 October 2026**

Use these questions to practise the main ideas in Hardware, Networks and AI Behaviour. No equipment or external website is needed. Write answers separately, then check AnswerKey.md.

The bank is a draft for teammate review. Source-topic labels show where each idea is taught; final Study Guide section references will be added when that guide is available.

## Part A True or False

Write True or False for each statement.

### Hardware

#### TF01

Unsaved work held only in RAM can be lost when the computer loses power.

*Topic source: Hardware A1 and A2.*

#### TF02

One byte contains four bits.

*Topic source: Hardware A3.*

#### TF03

The CPU carries out program instructions.

*Topic source: Hardware A5.*

#### TF04

A light sensor's main job is to turn a motor.

*Topic source: Hardware B1 and B12.*

#### TF05

An analog-to-digital converter turns an input voltage into a number the program can use.

*Topic source: Hardware B7.*

#### TF06

In the module's simple LED circuit, the current-limiting resistor can be removed because an LED limits its own current safely.

*Topic source: Hardware B8.*

#### TF07

A motor that needs more current than a controller pin can supply needs a suitable driver circuit.

*Topic source: Hardware B9.*

### Networks

#### TF08

Devices on a working local network can sometimes communicate even when the Internet connection is unavailable.

*Topic source: Network Fundamentals 01 and 02.*

#### TF09

Every network that uses Wi-Fi is a wide area network.

*Topic source: Network Fundamentals 02.*

#### TF10

A switch can forward data frames between devices on a local network.

*Topic source: Network Fundamentals 04.*

#### TF11

DNS normally sends the complete webpage to your browser.

*Topic source: Network Fundamentals 06 and 07.*

#### TF12

An IP address and a MAC address have exactly the same job.

*Topic source: Network Fundamentals 05.*

#### TF13

UDP does not itself guarantee that data arrives in order.

*Topic source: Network Fundamentals 07 and Beginner Prerequisites packets.*

#### TF14

Higher bandwidth always means lower delay.

*Topic source: Network Fundamentals 13.*

### AI Behaviour

#### TF15

A robot's dirt-sensor reading is an observation.

*Topic source: AI Behaviour 2.*

#### TF16

An automatic door can open by following a fixed rule without learning.

*Topic source: AI Behaviour 2 and 3.*

#### TF17

A robot switching from CLEAN mode to RETURN mode proves that it has learned.

*Topic source: AI Behaviour 3.*

#### TF18

Showing a score after each action is enough to make a controller learn, even if it never updates anything from experience.

*Topic source: AI Behaviour 4.*

#### TF19

Trying an unfamiliar action to gather experience is an example of exploration.

*Topic source: AI Behaviour 4.*

#### TF20

A robot that succeeds in a computer simulation is guaranteed to succeed on a real floor.

*Topic source: AI Behaviour Training and use and 9.*

## Part B Multiple Choice

Choose ONE answer, A, B, C or D, for each question.

### Hardware

#### MC01

Which part carries out the instructions of a program?

A. Monitor<br>
B. CPU<br>
C. Keyboard<br>
D. Speaker<br>

*Topic source: Hardware A1.*

#### MC02

The four binary positions have values 8, 4, 2 and 1, from left to right. What decimal number does 0101 represent?

A. 2<br>
B. 4<br>
C. 6<br>
D. 5<br>

*Topic source: Hardware A3.*

#### MC03

An AND gate outputs 1 only when both inputs are 1. What is its output when the inputs are 1 and 0?

A. 0<br>
B. 1<br>
C. 2<br>
D. It cannot be decided from the rule<br>

*Topic source: Hardware A4.*

#### MC04

In fetch-decode-execute, what happens during the fetch step?

A. The monitor displays every saved file<br>
B. The keyboard stores the next program<br>
C. The CPU gets the next instruction from memory<br>
D. The computer deletes its instructions<br>

*Topic source: Hardware A5.*

#### MC05

Which set is suitable for a simple automatic light indicator?

A. Light sensor, microcontroller and LED<br>
B. Microphone, printer and paper<br>
C. Speaker, keyboard and mouse<br>
D. Hard drive, router and screen only<br>

*Topic source: Hardware A6 B1 and B5.*

#### MC06

In the module's light-sensor circuit, a darker room gives a higher sensor reading. The room becomes darker. What should happen to the reading?

A. It must become zero<br>
B. It should increase<br>
C. It should decrease<br>
D. It becomes a sound<br>

*Topic source: Hardware B6 and B7.*

#### MC07

An LED does not light in a low-voltage learning circuit. What is a sensible first action before changing its wiring?

A. Connect it to a wall socket<br>
B. Remove its current-limiting resistor<br>
C. Increase the supply without checking ratings<br>
D. Disconnect power, then check the wiring and LED direction<br>

*Topic source: Hardware B4 and B15.*

### Networks

#### MC08

Which example is a local area network?

A. All networks in the world<br>
B. A company's links between distant countries<br>
C. Computers connected within one classroom<br>
D. A link joining offices in different cities<br>

*Topic source: Network Fundamentals 02.*

#### MC09

Three classroom computers connect only through one central switch. The switch loses power. What is the likely result?

A. Their screens stop working<br>
B. They cannot communicate with one another through that switch<br>
C. They automatically become a mesh network<br>
D. They no longer need network connections<br>

*Topic source: Network Fundamentals 03.*

#### MC10

A network has links A-B, B-C and A-C. The A-C link fails, but the other links work. Which path can still connect A to C?

A. A to B to C<br>
B. A directly to C using the failed link<br>
C. A to D to C, although D is not in this network<br>
D. No path is left<br>

*Topic source: Network Fundamentals 03.*

#### MC11

Which device forwards IP packets between different IP networks?

A. Keyboard<br>
B. Monitor<br>
C. Router<br>
D. Microphone<br>

*Topic source: Network Fundamentals 04.*

#### MC12

Assume a browser needs a DNS lookup before contacting a website. Which simple order is correct?

A. Receive the page, then ask for its address<br>
B. Send the response before the request<br>
C. Display the page before receiving any content<br>
D. Look up the address, send a request, receive a response<br>

*Topic source: Network Fundamentals 06.*

#### MC13

What is one job of DHCP on a home network?

A. Clean the laptop screen<br>
B. Write the webpage text<br>
C. Replace the Wi-Fi radio<br>
D. Provide a device with IP address settings<br>

*Topic source: Network Fundamentals 12.*

#### MC14

Which action helps protect a home Wi-Fi network?

A. Share its password publicly<br>
B. Keep the router's default administrator password forever<br>
C. Use a strong Wi-Fi password and keep router software updated<br>
D. Disable its security features<br>

*Topic source: Network Fundamentals 08.*

### AI Behaviour

#### MC15

A cleaning robot senses dirt and moves around a room. Which is its environment?

A. Only the robot's cleaning command<br>
B. The room and floor around the robot<br>
C. Only its battery number<br>
D. Only its written program<br>

*Topic source: AI Behaviour 2.*

#### MC16

Which order matches the agent loop?

A. Observe, choose an action, act, observe again<br>
B. Act, stop observing, guess forever<br>
C. Choose an action before any input is available in every situation<br>
D. Observe once and never check the result<br>

*Topic source: AI Behaviour Follow one decision.*

#### MC17

A robot uses these rules in order: first return to the dock if the battery is low; otherwise clean if the tile is dirty. The battery is low and the tile is dirty. What does it do?

A. Always clean first<br>
B. Ignore both rules<br>
C. Return to the dock<br>
D. Learn a new rule automatically<br>

*Topic source: AI Behaviour 3.*

#### MC18

A robot is in RETURN mode. Its programmed rule says to switch to CHARGE when it reaches the dock. It reaches the dock. What is its next mode?

A. CLEAN<br>
B. RETURN forever<br>
C. WANDER<br>
D. CHARGE<br>

*Topic source: AI Behaviour 3.*

#### MC19

Which example describes learning from experience?

A. Updating an action estimate after receiving reward feedback<br>
B. Displaying the same fixed rule on screen<br>
C. Changing an LED's colour without changing any decision rule<br>
D. Printing a score while keeping all rules and estimates unchanged<br>

*Topic source: AI Behaviour 4.*

#### MC20

A robot's dirt sensor sometimes misses dirt. What is a reasonable conclusion?

A. The floor must always be clean<br>
B. The robot may choose an action using incomplete information<br>
C. The robot can no longer move at all<br>
D. The robot has proved that it learns<br>

*Topic source: AI Behaviour 9.*

## Part C Explain Your Answer

Answer all three parts of each question. Aim for a developed response, normally more than 100 words in total per question, or equivalent reasoning using a labeled diagram, table or step-by-step trace. Keep the explanation simple and use the supplied situation.

### Hardware

#### OE01

Mia opens a photo saved on her laptop's storage. She edits it in an application but does not save the changes. The laptop then loses power. Assume the edits were held only in RAM and no recovery copy was made.

a) Explain the jobs of storage, RAM, the CPU and the screen while Mia works.
b) What happens to the unsaved edits? What happens to the original saved photo?
c) Explain one simple habit that would help Mia avoid losing her next edits.

*Topic source: Hardware A1 A2 and A5.*

#### OE02

An automatic light indicator uses a light sensor, an ADC, a microcontroller and an LED. The sensor produces a voltage; the ADC converts it to a number. In this circuit, darker conditions give a higher number. The controller turns the LED on for a reading of 600 or more, and off for a lower reading. The readings are 300, then 700, then 400.

a) Trace the path from room light to the LED. Explain the sensor, ADC, controller and LED roles.
b) Give the LED result for each of the three readings and explain the rule.
c) The LED stays off at 700. Give one possible wiring problem and a safe first check before changing wires.

*Topic source: Hardware B6 B7 B8 B11 and B15.*

### Networks

#### OE03

Leo's laptop is connected to his working home network. He types a website name into a browser. Assume the address is not already cached, DNS works, and the website is reachable. The home router connects the local network to the Internet. A web server holds the requested page.

a) Explain why the browser needs DNS in this example.
b) Describe the simple request and response journey between the laptop and web server through the router.
c) Explain why the router and the web server have different jobs. Would a working local connection alone prove that the website is reachable?

*Topic source: Network Fundamentals 04 06 and 07.*

#### OE04

Compare two small networks. In the star network, computers A, B and C each have one link to switch H; they have no other links. In the mesh example, nodes A, B and C have links A-B, B-C and A-C. Assume the mesh can forward data along any listed working path.

a) In the star network, what happens to communication between the computers if H loses power? Explain why.
b) In the mesh example, A-C fails while A-B and B-C still work. Write a path from A to C.
c) Explain why this does not mean every mesh survives every failure. Name a link you would check if the alternate path stopped working.

*Topic source: Network Fundamentals 03.*

### AI Behaviour

#### OE05

A cleaning robot checks these rules in order and uses the first matching rule: (1) if the battery is low, return to the dock; (2) otherwise, if the current tile is dirty, clean it; (3) otherwise, move to another tile. Case A has a low battery and a dirty tile. Case B has a normal battery and a dirty tile. Case C has a normal battery and a clean tile.

a) State the action for each case and explain which rule applies.
b) Suppose the dirty-tile rule is checked before the low-battery rule. What would change in Case A?
c) Does following either rule order prove that the robot learns? Explain simply.

*Topic source: AI Behaviour 2 and 3.*

#### OE06

Controller A follows fixed cleaning rules and prints a score after each action. It never changes its rules or action estimates. Controller B uses reward feedback to update its action estimates, and those estimates can affect its next choices. Both are tested on the same simple cleaning task.

a) Which controller describes learning from experience? Explain what changes.
b) Why is Controller A's printed score not enough to show learning?
c) Suggest a simple fair comparison to check whether B improves. Mention both cleaning results and the number of steps, and explain why one good run is not enough.

*Topic source: AI Behaviour 3 4 and What would count as evidence.*

## Source Materials

- [Hardware](../Learning%20Materials/Hardware/hardware.md)
- [Network Fundamentals](../Learning%20Materials/Network/network_fundamentals.md)
- [Network Beginner Prerequisites](../Learning%20Materials/Network/beginner-prerequisites.md)
- [AI Behaviour](../Learning%20Materials/AIBehaviour/AIBehaviour.md)
