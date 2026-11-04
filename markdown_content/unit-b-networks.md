# Unit B — Networks

> **Reading edition:** This source is included or superseded in the [complete study book](../Learning%20Materials/Study%20Book.md). Start there for the numbered chapters and subchapters.

> Study-guide content for Lessons 3–4 of the [course outline](../study-overview.md). Written for absolute beginners. The descriptions are simplified on purpose; where a simplification hides an important detail, a note says so.

**Running example:** a robot vacuum that can be started from a phone app.

**How to use this guide**

- It helps to read [Unit A](unit-a-hardware.md) first, especially bits and bytes. Otherwise, no background is needed.
- Every new word is in **bold** and explained the first time it appears. Look in the [glossary](#unit-b-glossary) if you forget one.
- Read the sections in order, and try each *Check your understanding* before opening the answers.
- Numbers in square brackets, like [1], point to the [sources](#sources) at the end of the page.
- IP addresses written as `203.0.113.x` or `2001:db8:…` are examples reserved for teaching. They don't belong to any real website [13].

---

## Lesson 3: Connecting devices

### 3.1 What is a network?

A **network** is two or more devices connected so they can exchange information. The connection can be a cable, radio waves (Wi-Fi, Bluetooth, mobile data), or light in an optical fibre.

| Type | Size | Example |
| --- | --- | --- |
| **PAN** (personal area network) | A few metres around one person | Phone ↔ wireless earbuds over Bluetooth |
| **LAN** (local area network) | One home, classroom, or office | Laptop, phone, printer, and robot vacuum on home Wi-Fi |
| **WAN** (wide area network) | Cities, countries | A company linking offices in different cities |
| **The Internet** | The whole world | Millions of separate networks connected to each other |

> **The Internet is a network of networks.** Your home LAN is one small network. Your internet service provider (ISP) connects it to the ISP's network, which connects to other ISPs, and so on around the world.

### 3.2 Wired vs wireless links

| | Ethernet (wired) | Wi-Fi (wireless) |
| --- | --- | --- |
| How data travels | Electrical signals in a cable | Radio waves |
| Speed and stability | Usually faster and more stable | Can be slowed by distance, walls, and interference |
| Convenience | Needs a cable to each device | Devices can move around freely |
| Typical devices | Desktop PCs, game consoles, smart TVs | Phones, laptops, robot vacuums |

**Wi-Fi bands:** many routers offer **2.4 GHz** (travels further and through walls better, but slower and more crowded) and **5 GHz** (faster, but shorter range). Some newer routers also use **6 GHz**. Many smart-home devices, including many robot vacuum models, can only join a 2.4 GHz network, so check the device's manual when setting one up.

### 3.3 The devices that make a network

| Device | Job | Analogy |
| --- | --- | --- |
| **Network interface (NIC)** | The hardware in each device that sends and receives network signals (Ethernet port or Wi-Fi chip) | A house's mailbox |
| **Switch** | Connects devices *within* one local network and forwards each message only to the device it's meant for | The mail-sorting room inside one apartment building |
| **Wireless access point** | Lets Wi-Fi devices join the local network | A mailbox you can reach without walking to the building |
| **Router** | Connects *different* networks together and chooses where to send messages next — e.g., between your home LAN and the Internet | The post office that sends letters to other cities |
| **Modem** | Converts signals between your home network and the ISP's line (phone line, cable, or fibre) | The truck that carries mail out of town on the right kind of road |

> **One box, many jobs:** the "Wi-Fi router" in most homes is really a router + switch + wireless access point (and sometimes a modem) inside one case.

#### MAC addresses

Every network interface has a **MAC address** set by the manufacturer [1]. It is written as six pairs of characters such as `3C:22:FB:7A:10:9E`. The letters A–F are not a mistake: this is **hexadecimal**, a way of writing numbers that uses 0–9 and then A–F for the values 10–15.

Switches use MAC addresses to deliver messages *inside* a local network. Think of it as the name on an apartment door: useful inside the building, but not enough to send mail across the world.

(Many phones now use a different, made-up MAC address on each Wi-Fi network, so they are harder to track [2].)

### 3.4 Packets: why messages are cut into pieces

Data is not sent as one big lump. It is cut into small pieces called **packets**. On Ethernet, a packet normally carries at most 1,500 bytes [3]. A photo of a few MB is therefore split into thousands of packets.

Each packet has two parts:

```
┌──────────────────────────────┬───────────────────────────────┐
│ HEADER                       │ PAYLOAD                       │
│ from-address, to-address,    │ a slice of the actual data    │
│ packet number, other info    │ (part of a photo, a message…) │
└──────────────────────────────┴───────────────────────────────┘
```

Like an envelope (header) holding one page of a letter (payload).

**Why use packets?**

1. **Sharing.** Many people's packets can take turns on the same cables, so one big download doesn't block everyone else.
2. **Fixing errors cheaply.** If one packet is damaged or lost, only that small piece needs resending, not the whole file.
3. **Flexible routes.** Packets can travel by different paths and be put back in order at the destination.

**Worked example — the paper packet activity.**
Message: `MEET AT NOON` (12 characters including spaces). Split into 3 packets of 4 characters:

| Packet | Header | Payload |
| --- | --- | --- |
| 1 of 3 | From: Ana · To: Ben · #1 | `MEET` |
| 2 of 3 | From: Ana · To: Ben · #2 | ` AT ` |
| 3 of 3 | From: Ana · To: Ben · #3 | `NOON` |

Pass them through classmates acting as routers. If packet 3 arrives before packet 2, Ben uses the numbers to rebuild the message in the right order. If packet 2 never arrives, Ben asks Ana to resend only packet 2.

### 3.5 Layers: splitting the job into simpler jobs

Networking is organized in **layers**. Each layer does one job and relies on the layer below it. The Internet's design, the TCP/IP model, uses four layers [18]:

| Layer | Job | Examples | Post analogy |
| --- | --- | --- | --- |
| 4. **Application** | What the program actually wants to say | Web (HTTP/HTTPS), email, DNS, video calls | The letter you write |
| 3. **Transport** | Deliver data to the right *program* on a device; optionally make it reliable | TCP, UDP | Registered mail vs a postcard |
| 2. **Internet** | Move packets between networks to the right *device* using IP addresses | IP | The address on the envelope and post offices routing it |
| 1. **Link** | Move bits across one physical link | Ethernet, Wi-Fi | The van or bicycle carrying it on one road |

**Step by step: sending the message "Hi" from a phone to a friend's chat app**

Each layer adds its own label to the outside, like putting a letter in an envelope and then that envelope in a bigger one:

1. **Application layer:** the chat app writes the message: `Hi`.
2. **Transport layer:** adds a label saying which *program* on the other end should get it (its port number, see 4.2) → `[port | Hi]`.
3. **Internet layer:** adds a label with the *device* addresses (from-IP and to-IP, see 4.1) → `[IP | port | Hi]`.
4. **Link layer:** adds a label for the next hop on this one Wi-Fi link (MAC addresses), then sends the bits as radio waves → `[MAC | IP | port | Hi]`.
5. **At the other end the steps run backwards.** Each layer removes its own label and passes the rest up, until the chat app shows `Hi`.

The benefit of layers is that the chat app doesn't need to know whether the message travels over Wi-Fi, cable or fibre. Each layer only has to talk to the layers next to it.

(You may also meet the 7-layer *OSI model*. It splits the same jobs into smaller pieces.)

### 3.6 Getting connected: DHCP and private addresses

When your phone joins home Wi-Fi, it needs an IP address (see [Lesson 4](#41-ip-addresses-the-address-on-the-envelope)). It usually gets one automatically:

1. Phone: "I'm new here — can someone give me an address?"
2. Home router (acting as a **DHCP server**, the job of handing out addresses): "Use `192.168.1.23`. The router is at `192.168.1.1`. Ask `192.168.1.1` for DNS too."
3. Phone saves this and can now talk on the network.

This exchange is defined by the **DHCP** standard [4]. The address is usually "rented" for a limited time and renewed automatically.

Addresses starting `192.168.`, `10.`, or `172.16.`–`172.31.` are **private addresses** [5]. They are reused inside millions of homes and only work locally. So how does a private address reach the Internet? Your router does **NAT** (network address translation) [6]:

1. Your phone (`192.168.1.23`) sends a request to a website.
2. The router swaps the private "from" address for the household's one **public** address, and writes down in a table: "this conversation belongs to the phone."
3. The website replies to the public address.
4. The router looks up its table, swaps the address back, and passes the reply to the phone.

The whole household shares one public address, but each reply still reaches the right device.

### 3.7 Local network vs Internet access

These are two different things:

| Situation | Can the phone print to the home printer? | Can the phone load a website? |
| --- | --- | --- |
| Wi-Fi on, ISP line working | Yes | Yes |
| Wi-Fi on, **ISP line down** | **Yes** — the LAN still works | No |
| Wi-Fi off, mobile data on | No (different network) | Yes, through the mobile network |

> **"Connected to Wi-Fi" only means connected to the local network.** Internet access also needs the router's link to the ISP to work. Phones often warn "Connected, no internet" in exactly this case.

### 3.8 The robot vacuum's network

```
 [Phone app] ──Wi-Fi──► [Home router] ──ISP──► Internet ──► [Vacuum maker's cloud server]
                              ▲                                        │
                              └──────────Wi-Fi──── [Robot vacuum] ◄────┘
```

- The vacuum joins the home Wi-Fi like any other device and gets a private IP address from DHCP.
- Many vacuum apps work through the **manufacturer's cloud server**: the phone sends "start cleaning" to the server, and the server passes it to the vacuum. With this design, the app can stop working when the Internet is down, even though the phone and vacuum are on the same Wi-Fi. (Details vary by brand and model.)
- The vacuum's basic cleaning does **not** need any network. Its sensors, processor, and behaviour rules are all on board ([Unit C](unit-c-behaviorist-ai.md)).

### 3.9 Common misconceptions

| Misconception | Correction |
| --- | --- |
| "Wi-Fi and the Internet are the same thing." | Wi-Fi is one way to connect to a local network. The Internet is the worldwide network beyond it. |
| "Data travels as one continuous stream like water in a pipe." | Data is cut into packets that are forwarded separately. |
| "A switch and a router do the same thing." | A switch connects devices within one network; a router connects different networks. |
| "The cloud is somewhere in the sky." | "The cloud" means other organizations' computers in data centres, reached over the Internet. |

### 3.10 Check your understanding

1. Is a home with one laptop, one phone, and one printer on Wi-Fi a LAN or a WAN?
2. Name two reasons data is sent in packets.
3. Your internet line is broken. Can your laptop still send a file to a printer on the same Wi-Fi? Why?
4. Which device connects your home network to the ISP's network: a switch or a router?
5. Draw your home network. Include at least: two devices, the access point, the router, and the Internet.

<details>
<summary>Answers</summary>

1. A **LAN** — one home.
2. Any two of: sharing the links fairly; only resending damaged/lost pieces; packets can take flexible routes.
3. **Yes.** Both are on the same local network, which works without the Internet link.
4. A **router**.
5. Check that devices connect to the access point, the access point connects to the router (often the same box), and the router connects to the ISP/Internet.

</details>

---

## Lesson 4: A message's journey

### 4.1 IP addresses: the address on the envelope

Every device on the Internet needs an **IP address** so packets can find it — like a street address.

- **IPv4** addresses look like four numbers from 0 to 255 separated by dots, such as `203.0.113.14` [7]. Here's where the 4.3 billion comes from, step by step:
  1. Each of the four numbers is one byte, which is 8 bits (see [Unit A](unit-a-hardware.md#22-counting-in-binary-with-bit-cards)), so it can be 0–255.
  2. 4 numbers × 8 bits = 32 bits in the whole address.
  3. 32 bits give 2 × 2 × … (32 times) ≈ **4.3 billion** possible addresses.
  4. There are more devices in the world than that, which is one reason NAT (Section 3.6) exists.
- **IPv6** addresses are 128 bits long and written in hexadecimal, such as `2001:db8::8a2e:370:7334` [8]. There are enough for every device many times over.

**Routers** read the destination IP address on each packet and pass it one step (one "hop") closer to its destination — like post offices forwarding a letter from city to city. A packet across the world may pass through 10–20 routers.

### 4.2 Ports: which program gets the message?

One device runs many programs at once. A **port number** on each packet says which program it is for, like an apartment number added to a street address. Well-known services have standard port numbers, recorded in a public list [9]:

| Port | Usually used for |
| --- | --- |
| 53 | DNS (name lookups) |
| 80 | Web pages (HTTP, unencrypted) |
| 443 | Secure web pages (HTTPS) |

### 4.3 DNS: turning names into addresses

People remember names like `www.example.com`. Packets need numbers like `203.0.113.14`. The **Domain Name System (DNS)** is the Internet's phone book that converts one to the other [10].

Names are read **right to left**, from general to specific:

```
www . example . com .
 │       │       │   └── root (the invisible starting point)
 │       │       └────── top-level domain (TLD): .com, .org, .cn, .uk …
 │       └────────────── the domain the owner registered
 └────────────────────── a specific computer/service in that domain
```

**Worked example — looking up `www.example.com` for the first time:**

1. Your device checks its own memory (**cache**). Not found.
2. It asks the **DNS resolver** — usually run by your ISP or a public service — "What is the address of `www.example.com`?"
3. The resolver asks a **root server**: "Who knows about `.com`?" → "Ask the `.com` servers."
4. The resolver asks a **`.com` server**: "Who knows about `example.com`?" → "Ask example.com's own name servers."
5. The resolver asks **example.com's authoritative server** (the server that holds the official answer for that domain): "What is `www.example.com`?" → "`203.0.113.14`."
6. The resolver tells your device and both **cache** the answer for a while, so next time steps 2–5 are skipped.

> DNS only finds the address. It does **not** deliver the webpage — that happens next, directly between your device and the web server.

### 4.4 Latency vs bandwidth

Two different ways a connection can be "slow":

| | **Latency** | **Bandwidth** |
| --- | --- | --- |
| Meaning | How long one piece of data takes to arrive | How much data can arrive per second |
| Unit | Milliseconds (ms) | Megabits per second (Mbps) |
| Highway analogy | How long the drive takes | How many lanes the highway has |
| Matters most for | Online games, video calls, clicking a button | Downloading big files, streaming 4K video |
| Measured by | `ping`, a tool that sends a tiny test message and times how long the reply takes (the "round trip") | A speed test website or app |

> **High bandwidth does not mean low latency.** A satellite link far above Earth may offer plenty of bandwidth but long delays because the signal travels so far. A wide highway doesn't make a 1,000 km trip short.

**Why distance adds latency, step by step:**

1. Light in empty space travels about 300,000 km per second.
2. Inside the glass of an optical fibre it is slowed down by about 1.5 times (the glass's *refractive index*), so it travels about 300,000 ÷ 1.5 = **200,000 km per second** [11].
3. Beijing to New York is roughly 11,000 km in a straight line.
4. One way: 11,000 ÷ 200,000 = 0.055 seconds = **55 ms**.
5. A round trip (there and back) is about **110 ms**, and that is before any delay from routers or waiting in queues.
6. Real cables don't run in straight lines, so the real figure is higher. No internet plan can beat the speed of light.

**Worked example — download time (watch bits vs bytes!):**

1. File size: 100 MB (mega**bytes**). Connection: 100 Mbps (mega**bits** per second).
2. Make the units match. 1 byte = 8 bits, so 100 MB × 8 = 800 megabits.
3. Divide by the speed: 800 Mb ÷ 100 Mbps = **8 seconds** (in ideal conditions).
A common mistake is to answer "1 second" by forgetting that the file is in **bytes** and the speed is in **bits**.

### 4.5 TCP and UDP: two ways to deliver

A **protocol** is an agreed set of rules for communicating, like the rules of a phone call: say hello, take turns, say goodbye. TCP [12] and UDP [14] are both **transport-layer** protocols that carry application data between programs.

| | **TCP** (Transmission Control Protocol) | **UDP** (User Datagram Protocol) |
| --- | --- | --- |
| Starts with a set-up step? | Yes — a "handshake" | No — just sends |
| Guarantees delivery? | Yes — lost packets are resent | No |
| Keeps order? | Yes — rebuilds the original order | No |
| Extra work and waiting | More | Less |
| Analogy | Registered mail with tracking and signatures | Shouting across a room — quick, but you might be missed |
| Typical uses | Web pages, email, file downloads, messaging | Live video calls, online games, live streaming, DNS lookups |

**The TCP three-way handshake:**

```
Your device                        Server
     │ ── SYN  ("Can we talk?") ──────► │
     │ ◄─ SYN-ACK ("Yes, can you?") ─── │
     │ ── ACK  ("Yes, let's go") ─────► │
     │        …data flows…              │
```

*SYN is short for "synchronise" and ACK for "acknowledge." After these three messages, both sides know the other is ready and listening.*

**Why would anyone want UDP?** In a live video call, a packet that arrives late is useless — the moment has passed. It is better to skip it and keep going than to pause the whole call to resend it. The application itself decides how to cope with gaps.

> Neither protocol is simply "always faster." UDP avoids TCP's setup and resending, but on a good connection the difference for most tasks is small. Some newer protocols, such as QUIC, which is used by the newest version of the web protocol, build their own reliability on top of UDP [15].

### 4.6 Putting it together: what happens when you visit a website

Simplified journey for typing `https://www.example.com` and pressing Enter:

| Step | What happens | Layer/protocol |
| --- | --- | --- |
| 0 | Your device already has an IP address from DHCP | — |
| 1 | The browser asks DNS for the IP address of `www.example.com` (unless it's cached) | DNS (application) over UDP, port 53 |
| 2 | The browser opens a connection to that IP on port 443 with the TCP handshake | TCP (transport) |
| 3 | The browser and server agree on secret codes (**encryption** keys) so no one in between can read the data | TLS [16], the "S" (secure) in HTTPS |
| 4 | The browser sends a request: `GET /` ("send me the home page") | HTTP [17] (application) |
| 5 | The request is split into packets, each with source and destination IP addresses; routers forward them hop by hop | IP (internet) |
| 6 | Each hop's physical link carries the bits — Wi-Fi to your router, fibre across the city, etc. | Ethernet/Wi-Fi (link) |
| 7 | The server sends back the page as packets. TCP on your device puts them in order and asks for any missing ones | TCP, IP |
| 8 | The browser reads the page, discovers it also needs images and styles, and requests those too | HTTP |
| 9 | The browser draws the page on screen | Back to hardware: CPU, GPU, display ([Unit A](unit-a-hardware.md)) |

All of this usually takes well under a second.

**The padlock icon** means HTTPS is in use: the content is encrypted between your browser and the website. It does **not** mean the website itself is trustworthy — scam sites can use HTTPS too.

### 4.7 Basic troubleshooting, using the layers

When "the Internet doesn't work," check from the bottom up:

1. **Link:** Is Wi-Fi connected, or the cable plugged in? Is the signal strong?
2. **Local network:** Can you reach the router (e.g., open its settings page or ping it)?
3. **Internet:** Can you reach a known public IP address? For example, `ping 1.1.1.1`, a public DNS service run by Cloudflare.
4. **DNS:** Do names work? If `ping 1.1.1.1` works but websites by name don't load, DNS is the likely problem.
5. **Application:** Does one website fail while others work? The problem may be that site, not your connection.

### 4.8 The robot vacuum's message journey

**Scenario:** at work, you press "Start cleaning" in the app.

1. The app looks up the manufacturer's server name with **DNS**.
2. It opens a secure **TCP + TLS** connection to the server and sends the command.
3. The vacuum keeps a connection open from home to the same server. The server forwards the command down that connection, through your home router (NAT knows the connection belongs to the vacuum).
4. The vacuum's processor receives the message and switches its behaviour controller into "cleaning" mode.
5. While cleaning, the vacuum sends status updates ("battery 60%", "map updated") back up to the server, which the app displays.

If the home Internet fails halfway, step 5 stops — but the vacuum keeps cleaning, because its sense–act loop runs on board.

### 4.9 Common misconceptions

| Misconception | Correction |
| --- | --- |
| "DNS sends me the website." | DNS only turns the name into an IP address. The website comes from the web server. |
| "100 Mbps means 100 MB per second." | Divide by 8: about 12.5 MB per second at best. |
| "Faster internet plan = lower ping." | A bigger plan raises bandwidth; latency depends mostly on distance and network path. |
| "UDP is bad because it's unreliable." | It's a trade-off. For live audio/video, waiting for resends is worse than a small gap. |
| "HTTPS padlock = safe website." | HTTPS protects the connection, not the honesty of the site. |

### 4.10 Check your understanding

1. What is the job of DNS? What is it *not* responsible for?
2. Is `192.168.0.5` a private or public address? How do you know?
3. A video call keeps freezing, but big downloads are fast. Is the problem more likely latency or bandwidth?
4. How long would a 50 MB file take to download at 20 Mbps (ideal conditions)?
5. For each, choose TCP or UDP and explain: (a) downloading a PDF, (b) a live online game, (c) sending an email.
6. Put in order: TCP handshake, DNS lookup, page displayed, HTTP request.

<details>
<summary>Answers</summary>

1. DNS converts names (like `www.example.com`) into IP addresses. It does not carry the webpage contents.
2. **Private** — addresses beginning `192.168.` are reserved for local networks.
3. **Latency** (or unstable delay, called *jitter*). Real-time calls need small, steady delays; bandwidth is clearly fine.
4. 50 MB × 8 = 400 Mb. 400 ÷ 20 = **20 seconds**.
5. (a) **TCP** — every byte of the file must arrive correctly. (b) **UDP** — late updates are useless; speed matters more. (c) **TCP** — the message must arrive complete and in order.
6. DNS lookup → TCP handshake → HTTP request → page displayed.

</details>

---

## Unit B glossary

| Term | Meaning |
| --- | --- |
| Access point | Device that lets Wi-Fi devices join a wired network |
| Bandwidth | How much data can be carried per second |
| DHCP | Automatically gives devices an IP address when they join a network |
| DNS | System that converts domain names into IP addresses |
| Ethernet | Standard for wired local networks |
| Header | The addressing and control part of a packet |
| HTTP / HTTPS | The protocol for requesting web pages; HTTPS is the encrypted version |
| Internet | The worldwide network of interconnected networks |
| IP address | A device's address on a network, used to route packets |
| ISP | Internet service provider — the company that connects you to the Internet |
| LAN | Local area network — one home, school, or office |
| Latency | How long data takes to travel from sender to receiver |
| MAC address | Hardware identifier of a network interface, used within a local network |
| NAT | Lets many devices with private addresses share one public address |
| Packet | A small piece of data with a header and payload |
| Payload | The actual data carried inside a packet |
| Port | Number identifying which program on a device a message is for |
| Protocol | An agreed set of rules for communicating |
| Router | Device that forwards packets between different networks |
| Switch | Device that forwards messages between devices within one local network |
| TCP | Reliable, ordered transport protocol |
| UDP | Simple, fast transport protocol without delivery guarantees |

## Sources

The RFCs ("Requests for Comments") are the official Internet standards documents. Learners don't need to read them; they are listed so every technical claim can be checked.

1. IEEE, [Guidelines for Use of Extended Unique Identifier (EUI), Organizationally Unique Identifier (OUI), and Company ID](https://standards.ieee.org/wp-content/uploads/import/documents/tutorials/eui.pdf). Explains how manufacturers are assigned MAC address blocks.
2. Android Open Source Project, [MAC randomization behavior](https://source.android.com/docs/core/connect/wifi-mac-randomization-behavior).
3. [RFC 894 — Transmission of IP Datagrams over Ethernet Networks](https://www.rfc-editor.org/rfc/rfc894). Gives the 1,500-byte maximum.
4. [RFC 2131 — Dynamic Host Configuration Protocol](https://www.rfc-editor.org/rfc/rfc2131).
5. [RFC 1918 — Address Allocation for Private Internets](https://www.rfc-editor.org/rfc/rfc1918).
6. [RFC 3022 — Traditional IP Network Address Translator](https://www.rfc-editor.org/rfc/rfc3022).
7. [RFC 791 — Internet Protocol](https://www.rfc-editor.org/rfc/rfc791). Defines IPv4 and its 32-bit addresses.
8. [RFC 8200 — IPv6 Specification](https://www.rfc-editor.org/rfc/rfc8200).
9. IANA, [Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml).
10. [RFC 1034 — Domain Names: Concepts and Facilities](https://www.rfc-editor.org/rfc/rfc1034). Covers the name hierarchy, resolvers, and caching.
11. Optical fibre core glass has a refractive index of roughly 1.46–1.48, so light travels at about c ÷ 1.47 ≈ 204,000 km/s. See [Optical fiber](https://en.wikipedia.org/wiki/Optical_fiber) and [Latency (engineering)](https://en.wikipedia.org/wiki/Latency_(engineering)).
12. [RFC 9293 — Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293). Covers reliable, ordered delivery and the three-way handshake.
13. [RFC 5737 — IPv4 Address Blocks Reserved for Documentation](https://www.rfc-editor.org/rfc/rfc5737) and [RFC 3849 — IPv6 Documentation Prefix](https://www.rfc-editor.org/rfc/rfc3849).
14. [RFC 768 — User Datagram Protocol](https://www.rfc-editor.org/rfc/rfc768).
15. [RFC 9000 — QUIC](https://www.rfc-editor.org/rfc/rfc9000) and [RFC 9114 — HTTP/3](https://www.rfc-editor.org/rfc/rfc9114).
16. [RFC 8446 — TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446).
17. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110). Defines the `GET` request.
18. [RFC 1122 — Requirements for Internet Hosts: Communication Layers](https://www.rfc-editor.org/rfc/rfc1122). Defines the four-layer model in 3.5.

### Further reading

- Kurose and Ross, *Computer Networking: A Top-Down Approach*. A standard university textbook that starts from applications and works downward, like Section 4.6.
