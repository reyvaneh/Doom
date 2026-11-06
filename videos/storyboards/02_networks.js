// Video 02 · Network Communication — storyboard.
// Every beat is anchored to the narrator's word: K.W('word', nth) (see tools/video_kit/lib/kit.js).
(() => {
  const { C } = Kit;
  const NODE = { w: 230, h: 150, labelSize: 30 };

  // ---------- 01 · Hook: the cable breaks, the photo still arrives · UNIT B ----------
  STORY['01'] = (K, X) => {
    const s1 = K.shot(0, 'Even', { zoom: [1.0, 1.08] });
    s1.footage({ id: 'seacable' });
    SB.tag(s1, 'SEND A PHOTO', 'photo').to('THOUSANDS OF KM AWAY', 'thousands').to('NOT ONE PRIVATE WIRE', 'private', { boxColor: C.net });
    const s2 = K.shot('Even', 'How', { zoom: [1.0, 1.1] });
    s2.footage({ id: 'fibre' });
    SB.tag(s2, 'FIBER OPTIC CABLE', 'fiber', { boxColor: C.net }).to('CABLE BREAKS', 'breaks', { boxColor: C.lost }).to('PHOTO STILL ARRIVES', 'arrives', { boxColor: C.cpu });
    K.ev(K.W('breaks'), 'zap');
    const s3 = K.shot('How', 'Welcome');
    SB.heading(s3, 'HOW DOES THE INTERNET', 'How', { y: 470, scale: 1.1 }).to('PULL THAT OFF?', 'pull', { color: C.net });
    const s4 = K.shot('Welcome', 'next', { bg: '#07090d' });
    X.golem(s4, 'networks', { ringAt: 'Unit', taunt: 'Network' });
    s4.say('UNIT B', 'Unit', { style: 'title', x: 960, y: 880 });
    SB.tag(s4, 'TEAM DOOM · NETWORK COMMUNICATIONS', 'Network', { y: 990, boxColor: C.net });
    const s5 = K.shot('next', K.length, { zoom: [1, 1.04] });
    SB.heading(s5, 'IN THE NEXT FEW MINUTES', 'next');
    const xs = [330, 750, 1170, 1590];
    const cs = [
      s5.card({ x: xs[0], y: 540, w: 360, h: 320, icon: '🏠', label: 'LAN → INTERNET', labelSize: 32, color: C.net, at: 'local' }),
      s5.card({ x: xs[1], y: 540, w: 360, h: 320, icon: '📖', label: 'DNS & IP', labelSize: 40, color: C.storage, at: 'DNS' }),
      s5.card({ x: xs[2], y: 540, w: 360, h: 320, icon: '📦', label: 'PACKETS', labelSize: 40, color: C.memory, at: 'packets' }),
      s5.card({ x: xs[3], y: 540, w: 360, h: 320, icon: '🔒', label: 'TCP · UDP · HTTPS', labelSize: 30, color: C.cpu, at: 'TCP' }),
    ];
    cs[0].highlight('local', 'DNS'); cs[1].highlight('DNS', 'packets'); cs[2].highlight('packets', 'TCP'); cs[3].highlight('TCP');
    s5.say('SELF-HEALING ROUTES', 'heals', { x: xs[2], y: 790, scale: 0.42, color: C.memory });
    s5.say('FAST & SECURE', 'secure', { x: xs[3], y: 790, scale: 0.42, color: C.cpu });
  };

  // ---------- 02 · LAN, WAN, IP addresses & DNS ----------
  STORY['02'] = (K, X) => {
    const s1 = K.shot(0, 'front');
    SB.banner(K, s1, '02', 'FROM YOUR DESK OUTWARD', 0.2);
    SB.heading(s1, 'YOUR ROOM · LAB · HOME', 'devices').to('LAN', 'LAN', { color: C.net }).to('LOCAL AREA NETWORK', 'local', { color: C.net })
      .to('THE OUTSIDE WORLD', 'outside').to('WAN', 'WAN', { color: C.storage }).to('WIDE AREA NETWORK', 'wide', { color: C.storage });
    const dev = [['💻', 360], ['📱', 600], ['🖨️', 840]];
    dev.forEach(([ic, y], i) => s1.card({ x: 260, y, w: 200, h: 170, icon: ic, color: C.net, at: K.W('devices') + i * 0.25 }));
    const sw = s1.card({ x: 720, y: 600, ...NODE, icon: '🔀', label: 'SWITCH', color: C.net, at: 'switch' });
    dev.forEach(([, y]) => s1.line({ pts: [[360, y], [605, 600]], at: 'connects', color: C.net }));
    s1.mover({ pts: [[300, 360], [720, 600], [300, 840]], at: 'passing', dur: 1.8, label: 'FRAME', size: 40, color: C.net });
    const rt = s1.card({ x: 1180, y: 600, ...NODE, icon: '📮', label: 'ROUTER', color: C.memory, at: 'router' });
    const wan = s1.card({ x: 1640, y: 600, w: 300, h: 300, icon: '🌍', label: 'INTERNET', labelSize: 34, color: C.storage, at: 'WAN' });
    s1.line({ pts: [[835, 600], [1065, 600]], at: 'router', arrow: true, color: C.memory });
    s1.line({ pts: [[1295, 600], [1490, 600]], at: 'router', arrow: true, color: C.storage });
    s1.say('HALLWAY', 'hallway', { x: 720, y: 760, scale: 0.5, color: C.net });
    s1.say('FRONT GATE', 'gate', { x: 1180, y: 760, scale: 0.5, color: C.memory });
    sw.highlight('switch', 'outside'); sw.highlight('hallway', 'router'); rt.highlight('router'); wan.highlight('WAN', 'router');
    // Router = the post office
    const s2 = K.shot('front', 'every', { zoom: [1.0, 1.08] });
    s2.footage({ id: 'postoffice' });
    SB.tag(s2, 'ROUTER = FRONT GATE', 'front', { boxColor: C.memory }).to('+ POST OFFICE', 'post').to('FORWARDS TRAFFIC', 'forwards');
    // IP address
    const s3 = K.shot('every', 'Because', { zoom: [1.0, 1.04] });
    SB.heading(s3, 'EVERY DEVICE NEEDS', 'every').to('AN IP ADDRESS', 'IP', { color: C.net });
    s3.say('192.0.2.10', '192', { style: 'data', x: 960, y: 520, scale: 1.6, color: C.net });
    SB.tag(s3, '= A STREET ADDRESS', 'acts', { y: 760 });
    s3.card({ x: 960, y: 920, w: 260, h: 160, icon: '🏡', color: C.net, at: 'acts' });
    // DNS: names -> numbers
    const s4 = K.shot('Because', K.length, { zoom: [1.0, 1.04] });
    SB.heading(s4, 'HUMANS FORGET NUMBERS', 'humans').to('WE TYPE NAMES', 'type');
    s4.say('bit.edu.cn', 'bit', { style: 'data', x: 960, y: 470, scale: 1.4, color: C.white }).to('192.0.2.10', 'matching', { color: C.net });
    SB.tag(s4, 'DNS', 'DNS', { y: 700, boxColor: C.storage }).to('DOMAIN NAME SYSTEM', K.W('domain', 2)).to("THE INTERNET'S PHONE BOOK", 'phone');
    s4.card({ x: 960, y: 880, w: 240, h: 160, icon: '📖', color: C.storage, at: 'phone' });
    s4.line({ pts: [[960, 540], [960, 640]], at: 'looking', arrow: true, color: C.storage });
  };

  // ---------- 03 · Packet switching & the packet tracer ----------
  STORY['03'] = (K, X) => {
    const s1 = K.shot(0, 'Instead');
    SB.banner(K, s1, '03', 'PACKET SWITCHING', 0.2);
    SB.heading(s1, 'ONE BIG FILE', 'big', { y: 300 }).to('CLOGS THE WIRES?', 'clog', { color: C.lost }).to('PACKET SWITCHING', 'switching', { color: C.memory });
    s1.card({ x: 960, y: 620, w: 520, h: 300, icon: '🗂️', label: 'ONE HUGE FILE', labelSize: 40, color: C.grey, at: 'file' });
    // Chop into packets, each with a header
    const s2 = K.shot('Instead', 'Watch');
    SB.heading(s2, 'NOT ALL AT ONCE', 'Instead').to('CHOP IT UP', 'chops').to('SMALL NUMBERED CHUNKS', 'chunks').to('PACKETS', 'packets', { color: C.memory });
    s2.card({ x: 360, y: 340, w: 440, h: 240, icon: '🗂️', label: 'MESSAGE', color: C.grey, at: 'Instead', out: 'chops' });
    [1, 2, 3].forEach((n, i) => s2.card({ x: 580 + i * 380, y: 340, w: 320, h: 200, icon: '📦', label: `PACKET ${n}`, labelSize: 34, color: C.memory, at: K.W('chops') + 0.2 + i * 0.25 }));
    const hd = s2.table({ x: 470, y: 560, cols: [480, 500], head: ['PACKET HEADER', ''], rows: [['Source IP', '192.0.2.10'], ['Destination IP', '203.0.113.5'], ['Sequence #', '1 of 3']],
      at: 'header', rowAt: ['source', 'destinations', 'sequence'], size: 40, mono: true, headColor: C.memory });
    hd.set(2, 1, '1 of 3', K.W('1'), C.memory).set(2, 1, '2 of 3', K.W('2'), C.memory);
    // The packet tracer
    const s3 = K.shot('Watch', K.length, { zoom: [1.0, 1.03] });
    SB.heading(s3, 'PACKET TRACER', 'tracer', { y: 110 }).to('ALL LINKS HEALTHY', 'healthy', { color: C.cpu }).to('PRIMARY LINK CUT', 'click', { color: C.lost })
      .to('REROUTE VIA ROUTER C', 'backup', { color: C.net }).to('PACKET 3 BEATS PACKET 2', 'arrive', { color: C.memory }).to('REORDER BY SEQUENCE #', K.W('sequence', 2), { color: C.cpu });
    const N = { you: [220, 520], A: [660, 520], B: [1240, 520], srv: [1680, 520], C: [950, 860] };
    s3.card({ x: N.you[0], y: N.you[1], ...NODE, icon: '💻', label: 'YOU', color: C.white, at: 'Watch' });
    s3.card({ x: N.A[0], y: N.A[1], ...NODE, icon: '📮', label: 'ROUTER A', color: C.memory, at: K.W('Watch') + 0.2 });
    s3.card({ x: N.B[0], y: N.B[1], ...NODE, icon: '📮', label: 'ROUTER B', color: C.memory, at: K.W('Watch') + 0.4 });
    s3.card({ x: N.srv[0], y: N.srv[1], ...NODE, icon: '🗄️', label: 'SERVER', color: C.storage, at: K.W('Watch') + 0.6 });
    const rc = s3.card({ x: N.C[0], y: N.C[1], ...NODE, icon: '📮', label: 'ROUTER C', color: C.net, at: K.W('Watch') + 0.8 });
    const L = (a, b, o = {}) => s3.line({ pts: [[a[0] + 120, a[1]], [b[0] - 120, b[1]]], at: K.W('Watch') + 0.5, ...o });
    L(N.you, N.A); L(N.B, N.srv);
    L(N.A, N.B, { color: C.cpu, width: 7, out: 'click' });
    s3.line({ pts: [[780, 520], [1120, 520]], at: 'click', dur: 0.2, color: C.lost, width: 7, dashed: true });
    s3.say('✕', 'click', { x: 950, y: 520, color: C.lost, scale: 1.4 });
    s3.line({ pts: [[N.A[0], N.A[1] + 80], [N.C[0] - 120, N.C[1]]], at: K.W('Watch') + 0.9, dashed: true, color: C.net });
    s3.line({ pts: [[N.C[0] + 120, N.C[1]], [N.B[0], N.B[1] + 80]], at: K.W('Watch') + 0.9, dashed: true, color: C.net });
    const primary = [N.you, N.A, N.B, N.srv], backup = [N.A, [N.A[0], N.A[1] + 80], N.C, [N.B[0], N.B[1] + 80], N.B, N.srv];
    // Wave 1: all three over the primary route.
    [1, 2, 3].forEach((n, i) => s3.mover({ pts: primary, at: K.W('travels') + i * 0.7, dur: 2.4, label: `${n}`, size: 50, color: C.memory }));
    // Wave 2 after the cut: 1 already through, 2 and 3 rerouted, 3 arrives first.
    const park = (k) => [[N.srv[0] + 150, N.srv[1] - 90 + k * 90]];
    s3.mover({ pts: [N.you, N.A, N.B, N.srv, ...park(0)], at: K.W('cable') - 0.6, dur: 2.0, label: '1', size: 50, color: C.memory, hold: true, out: 'put' });
    s3.mover({ pts: [N.you, ...backup, ...park(2)], at: 'remaining', dur: 4.2, label: '2', size: 50, color: C.memory, hold: true, out: 'put' });
    s3.mover({ pts: [N.you, ...backup, ...park(1)], at: K.W('remaining') + 0.4, dur: 2.8, label: '3', size: 50, color: C.memory, hold: true, out: 'put' });
    rc.highlight('backup', 'put');
    s3.say('1 · 3 · 2', K.W('arrive') + 0.6, { style: 'data', x: 1680, y: 300, color: C.memory, scale: 0.9 }).to('1 · 2 · 3', 'exact', { color: C.cpu });
    SB.tag(s3, 'ROUTER DETECTS THE BREAK', 'detects', { boxColor: C.lost }).to('SENDS THE REST ANOTHER WAY', 'dynamically', { boxColor: C.net }).out('cause');
  };

  // ---------- 04 · The 4-layer stack, TCP vs UDP ----------
  STORY['04'] = (K, X) => {
    const s1 = K.shot(0, 'crucial', { zoom: [1.0, 1.04] });
    SB.banner(K, s1, '04', 'THE NETWORK STACK', 0.2);
    SB.heading(s1, 'FOUR STACK LAYERS', 'four');
    const st = s1.stack({ x: 900, y: 290, w: 1100, h: 140, gap: 22, labelSize: 44, layers: [
      { label: '4 · APPLICATION', sub: 'HTTP · formats data for your app', color: C.ai, at: 'applications' },
      { label: '3 · TRANSPORT', sub: 'TCP / UDP · numbered segments', color: C.cpu, at: 'transport' },
      { label: '2 · INTERNET', sub: 'IP addresses · routes packets', color: C.net, at: 'internet' },
      { label: '1 · LINK', sub: 'raw bits · Wi-Fi · copper · fibre', color: C.power, at: 'link' },
    ] });
    st[0].highlight('applications', 'transport'); st[1].highlight('transport', 'internet'); st[2].highlight('internet', 'link'); st[3].highlight('link');
    s1.mover({ pts: [[1580, 290], [1580, 290 + 3 * 162]], at: 'raw', dur: 1.6, label: '0101', size: 46, color: C.power, hold: true });
    // TCP vs UDP
    const s2 = K.shot('crucial', K.length, { zoom: [1.0, 1.04] });
    SB.heading(s2, 'A CRUCIAL CHOICE', 'crucial').to('TCP or UDP?', 'choice');
    const tcp = s2.card({ x: 560, y: 470, w: 660, h: 340, icon: '📬', label: 'TCP', labelSize: 70, color: C.cpu, at: K.W('TCP', 2) });
    const udp = s2.card({ x: 1360, y: 470, w: 660, h: 340, icon: '🎮', label: 'UDP', labelSize: 70, color: C.memory, at: K.W('UDP', 2) });
    s2.say('REGISTERED MAIL', 'registered', { x: 560, y: 720, scale: 0.6, color: C.cpu }).to('RETRANSMITS ANYTHING LOST', 'retransmit').to('EVERY BYTE · IN ORDER', 'guarantees')
      .to('DOWNLOADS · BANKING · EMAIL', 'downloading', { color: C.white });
    s2.say('SKIPS RECEIPTS', 'skips', { x: 1360, y: 720, scale: 0.6, color: C.memory }).to('AS FAST AS POSSIBLE', 'fast').to('VIDEO CALLS · GAMES', 'video', { color: C.white })
      .to('NEWEST FRAME WINS', 'newest', { color: C.memory });
    tcp.highlight('registered', 'skips'); udp.highlight('skips');
    s2.mover({ pts: [[330, 900], [790, 900]], at: 'registered', dur: 1.4, label: '✓', size: 40, color: C.cpu, loop: true, out: 'skips' });
    s2.mover({ pts: [[1130, 900], [1590, 900]], at: 'skips', dur: 0.6, label: '»', size: 40, color: C.memory, loop: true, linear: true });
  };

  // ---------- 05 · Bandwidth vs latency, firewalls & HTTPS ----------
  STORY['05'] = (K, X) => {
    const s1 = K.shot(0, 'satellite', { zoom: [1.0, 1.1] });
    s1.footage({ id: 'highway' });
    SB.banner(K, s1, '05', 'SPEED & SECURITY', 0.2);
    SB.tag(s1, 'BANDWIDTH ≠ LATENCY', 'confuse').to('BANDWIDTH = WIDTH OF THE HIGHWAY', 'width', { boxColor: C.net }).to('MEGABYTES PER SECOND', 'megabytes', { boxColor: C.net })
      .to('LATENCY = TRAVEL TIME', 'travel', { boxColor: C.memory }).to('MILLISECONDS PER PACKET', 'milliseconds', { boxColor: C.memory });
    const s2 = K.shot('satellite', K.W('protect') - 0.8, { zoom: [1.0, 1.08] });
    s2.footage({ id: 'satellite' });
    SB.tag(s2, 'SATELLITE LINK', 'satellite').to('HIGH BANDWIDTH ✓', 'downloading', { boxColor: C.cpu }).to('HIGH LATENCY ✗', 'lag', { boxColor: C.lost });
    const s3 = K.shot(K.W('protect') - 0.8, K.length, { zoom: [1.0, 1.03] });
    SB.heading(s3, 'PROTECTING PACKETS', 'protect');
    const fw = s3.card({ x: 300, y: 560, w: 300, h: 380, icon: '🧱', label: 'FIREWALL', labelSize: 36, color: C.lost, at: 'firewall' });
    s3.mover({ pts: [[-40, 560], [130, 560]], at: 'unauthorized', dur: 0.8, label: '☠', size: 54, color: C.lost, hold: true, out: 'HTTPS' });
    s3.say('✕', K.W('unauthorized') + 0.8, { x: 140, y: 470, color: C.lost, scale: 1.1 }).out('HTTPS');
    const pk = s3.table({ x: 620, y: 360, cols: [460, 560], head: ['PACKET', ''], rows: [['Header · destination IP', '203.0.113.5'], ['Header · timestamp', '14:02:07'], ['Payload', 'password=hunter2']],
      at: 'packets', size: 38, mono: true, headColor: C.memory });
    pk.set(2, 1, '9f#Qx!7@Lp2&Zr0', 'encrypts', C.ai).set(0, 1, '203.0.113.5', 'header', C.net).set(1, 1, '14:02:07', 'timestamp', C.net);
    SB.tag(s3, 'FIREWALL · FILTERS AT THE BORDER', 'filters', { boxColor: C.lost }).to('HTTPS · ENCRYPTS THE PAYLOAD', 'encrypts', { boxColor: C.ai })
      .to('EAVESDROPPERS CAN\'T READ IT', 'cannot').to('ROUTERS STILL READ THE HEADER', 'header', { boxColor: C.net }).to('CONTENT HIDDEN · METADATA VISIBLE', 'metadata', { boxColor: C.white });
    fw.highlight('firewall', 'HTTPS');
  };

  // ---------- 06 · Pause & predict: TCP or UDP? · bridge to Video 03 ----------
  STORY['06'] = (K, X) => {
    const s1 = K.shot(0, K.W('scenario', 4));
    SB.banner(K, s1, '06', 'PAUSE & PREDICT', 0.2);
    SB.heading(s1, 'TCP or UDP?', 'match').to('GOT YOUR PREDICTIONS?', 'Got', { color: C.gold });
    const c1 = s1.card({ x: 560, y: 500, w: 660, h: 380, icon: '🤖', label: 'FIRMWARE → MEDICAL ROBOT', labelSize: 34, color: C.storage, at: K.W('scenario', 2) });
    const c2 = s1.card({ x: 1360, y: 500, w: 660, h: 380, icon: '🛸', label: 'LIVE DRONE VIDEO', labelSize: 34, color: C.memory, at: K.W('scenario', 3) });
    s1.say('1 MISSING BYTE = CRASH', 'missing', { x: 560, y: 760, scale: 0.55, color: C.lost });
    s1.say('60 FRAMES / SECOND', 'frames', { x: 1360, y: 760, scale: 0.55, color: C.memory });
    c1.highlight(K.W('scenario', 2), K.W('scenario', 3)); c2.highlight(K.W('scenario', 3), 'Got');
    s1.timer({ x: 960, y: 900, at: 'frames', dur: K.W('Got') - K.W('frames'), count: 10, out: 'Got' });
    const s2 = K.shot(K.W('scenario', 4), K.W('scenario', 5), { zoom: [1.0, 1.08] });
    s2.footage({ id: 'labrobot' });
    SB.tag(s2, 'SCENARIO 1 → TCP', 'requires', { boxColor: C.cpu }).to('EVERY BYTE · INTACT · IN ORDER', 'intact').to('WORTH THE EXTRA MOMENT', 'retransmitting');
    const s3 = K.shot(K.W('scenario', 5), 'Take', { zoom: [1.0, 1.08] });
    s3.footage({ id: 'drone' });
    SB.tag(s3, 'SCENARIO 2 → UDP', 'UDP', { boxColor: C.memory }).to('CURRENT FRAME · MINIMAL DELAY', 'immediately').to('NOT 2 SECONDS AGO', 'ago', { boxColor: C.lost });
    const s4 = K.shot('Take', 'Now');
    SB.heading(s4, 'TEST MORE CASES', 'Take', { y: 440 }).to('STUDY GUIDE · CHAPTER 12', 'chapter').to('MC11 · OE04', 'MC11', { color: C.gold });
    const s5 = K.shot('Now', K.length, { bg: '#07090d' });
    X.golem(s5, 'ai', { ringAt: 'behaviorist' });
    SB.tag(s5, 'HARDWARE SENSES', 'sense', { y: 960, boxColor: C.power }).to('NETWORK CARRIES', 'carry', { boxColor: C.net }).to('HOW DOES IT DECIDE?', 'decide', { boxColor: C.white })
      .to('NEXT · VIDEO 03 · BEHAVIORIST AI', 'behaviorist', { boxColor: C.ai });
  };
})();
