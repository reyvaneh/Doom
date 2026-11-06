// Video 01 · Hardware Foundations — storyboard.
// Every beat is anchored to the narrator's word: K.W('word', nth) (see tools/video_kit/lib/kit.js).
// Part 01 seconds 0..30.9 are the approved sample scene (tools/video_kit/scenes/v01_hook.html).
(() => {
  const { C } = Kit;

  // ---------- 01 · Opening hook (30.9 .. end): the three things you'll learn ----------
  STORY['01'] = (K, X) => {
    const s = K.shot(30.9, K.length, { fadeIn: 0, zoom: [1, 1.04] });
    X.circuit(s, { from: [1.2, 3.3, 5.0], to: [2.6, 3.9, 6.6], pulseAt: 31.2, loop: true });
    SB.dim(s, 31.4, null, 0.6);
    s.say('ELECTRICITY', 30.9, { x: 960, y: 220, color: C.power, dur: 0.01 }).out(31.6);
    const h = SB.heading(s, 'IN THE NEXT FEW MINUTES', 'next', { y: 200 });
    h.to('HOW DATA MOVES', 'moves').to('ZEROS & ONES', 'zeros').to('RUNNING PROGRAMS', 'run').to('REACTING TO THE REAL WORLD', 'react');
    const a = s.card({ x: 480, y: 600, w: 420, h: 300, icon: '🔁', label: 'MEMORY ⇄ PROCESSOR', labelSize: 30, color: C.memory, at: 'memory' });
    const b = s.card({ x: 960, y: 600, w: 420, h: 300, icon: '0️⃣1️⃣', label: '0s & 1s', color: C.cpu, at: 'zeros' });
    const c = s.card({ x: 1440, y: 600, w: 420, h: 300, icon: '🔌', label: 'SENSORS & CIRCUITS', labelSize: 30, color: C.power, at: 'sensors' });
    a.highlight('memory', 'zeros'); b.highlight('zeros', 'sensors'); c.highlight('sensors');
  };

  // ---------- 02 · The 4 pillars & the kitchen ----------
  STORY['02'] = (K, X) => {
    // A: every device...
    const s1 = K.shot(0, 'first', { zoom: [1.08, 1.0] });
    s1.footage({ id: 'vacuum' });
    SB.banner(K, s1, '02', 'THE 4 PILLARS', 0.2);
    SB.tag(s1, 'EVERY DIGITAL DEVICE', 'every').to('PHONE', 'phone').to('ROBOT VACUUM', 'robot').to('ONE 4-STEP LOOP', 'four');
    // B: the loop
    const s2 = K.shot('first', 'now');
    SB.heading(s2, 'THE 4-STEP LOOP', 'first');
    const X0 = [330, 750, 1170, 1590], Y = 470;
    const cards = [
      s2.card({ x: X0[0], y: Y, w: 340, h: 300, icon: '⌨️', label: 'INPUT', color: C.net, at: 'input' }),
      s2.card({ x: X0[1], y: Y, w: 340, h: 300, icon: '⚙️', label: 'PROCESSING', color: C.cpu, at: 'processing' }),
      s2.card({ x: X0[2], y: Y, w: 340, h: 300, icon: '💾', label: 'STORAGE', color: C.storage, at: 'storage' }),
      s2.card({ x: X0[3], y: Y, w: 340, h: 300, icon: '🖥️', label: 'OUTPUT', color: C.ai, at: 'output' }),
    ];
    cards[0].highlight('input', 'second'); cards[1].highlight('processing', 'third'); cards[2].highlight('storage', 'fourth'); cards[3].highlight('output', 'movement');
    ['processing', 'storage', 'output'].forEach((w, i) => s2.line({ pts: [[X0[i] + 180, Y], [X0[i + 1] - 180, Y]], at: w, arrow: true, color: 'rgba(255,255,255,.55)' }));
    const sub = (i, txt, at) => s2.say(txt, at, { x: X0[i], y: 700, scale: 0.55 });
    sub(0, 'KEYBOARD', 'keyboard').to('MICROPHONE', 'microphone').to('CAMERA', 'camera').to('ELECTRICAL SIGNALS', 'electrical', { color: C.net });
    sub(1, 'CPU', 'CPU').to('CENTRAL PROCESSING UNIT', 'central').to('CPU', 'math', { color: C.cpu }).to('MATH & LOGIC', 'logic');
    sub(2, 'SSD', 'SSDs').to('LONG-TERM', 'long', { color: C.storage });
    sub(3, 'SCREENS', 'screens').to('SPEAKERS', 'speakers').to('MOTORS', 'motors').to('LIGHT · SOUND · MOVEMENT', 'light', { color: C.ai, scale: 0.45 });
    s2.line({ pts: [[X0[3], 640], [X0[3], 840], [X0[0], 840], [X0[0], 640]], at: 'light', dur: 1.0, dashed: true, arrow: true, color: 'rgba(255,255,255,.4)' });
    s2.mover({ pts: [[X0[0], Y], [X0[3], Y], [X0[3], 840], [X0[0], 840], [X0[0], Y]], at: 'movement', dur: 2.6, loop: true, size: 26, color: C.power });
    // C: two places to hold data
    const s3 = K.shot('now', 'think');
    SB.heading(s3, 'WHY DID IT VANISH?', 'why').to('TWO PLACES TO HOLD DATA', 'two');
    s3.card({ x: 640, y: 560, w: 460, h: 360, icon: '⚡', label: 'RAM', labelSize: 56, color: C.memory, at: 'RAM' });
    s3.card({ x: 1280, y: 560, w: 460, h: 360, icon: '💾', label: 'STORAGE', labelSize: 56, color: C.storage, at: ['storage', 2] && K.W('storage', 2) });
    // D: the kitchen
    const s4 = K.shot('think', ['storage'] && K.W('storage', 3), { zoom: [1.0, 1.08] });
    s4.footage({ id: 'chef' });
    SB.tag(s4, 'A COMPUTER = A KITCHEN', 'kitchen').to('CPU', K.W('CPU', 2), { boxColor: C.cpu }).to('CPU = HEAD CHEF', 'chef');
    const s5 = K.shot(K.W('storage', 3), K.W('RAM', 2) - 0.2, { zoom: [1.0, 1.06] });
    s5.footage({ id: 'freezer' });
    SB.tag(s5, 'STORAGE', K.W('storage', 3), { boxColor: C.storage }).to('SSD', 'SSD').to('SSD = WALK-IN FREEZER', 'freezer').to('LIGHTS OUT? FOOD STAYS', 'stays');
    // E: RAM = prep counter, copying from the SSD
    const s6 = K.shot(K.W('RAM', 2) - 0.2, K.W('RAM', 4) - 0.2, { zoom: [1.0, 1.06] });
    s6.footage({ id: 'counter' });
    SB.dim(s6, 'copies', null, 0.5);
    SB.tag(s6, 'RAM', K.W('RAM', 2), { boxColor: C.memory }).to('RANDOM ACCESS MEMORY', 'random').to('RAM', K.W('memory') + 0.7).to('RAM = PREP COUNTER', 'prep');
    const ssd = s6.card({ x: 560, y: 560, w: 360, h: 260, icon: '💾', label: 'SSD', color: C.storage, at: 'copies' });
    const ram = s6.card({ x: 1360, y: 560, w: 360, h: 260, icon: '⚡', label: 'RAM', color: C.memory, at: 'copies' });
    s6.line({ pts: [[760, 560], [1160, 560]], at: K.W('SSD', 2), arrow: true, color: C.white });
    s6.mover({ pts: [[600, 560], [1320, 560]], at: K.W('onto'), dur: 1.2, label: '📄', size: 64, color: C.white, hold: true });
    ram.highlight(K.W('RAM', 3));
    // F: thousands of times faster
    const s7 = K.shot(K.W('RAM', 4) - 0.2, K.W('RAM', 5) - 0.2);
    SB.heading(s7, 'RAM vs SSD', K.W('RAM', 4)).to('THOUSANDS OF TIMES FASTER', 'thousands').to("BUT THERE'S A CATCH", 'catch', { color: C.lost });
    s7.custom((() => {
      let made = false, bars;
      return (t, L) => {
        if (!made) { made = true; bars = [['RAM', C.memory, 380], ['SSD', C.storage, 620]].map(([n, c, y]) => { const r = document.createElement('div'); r.style.cssText = `position:absolute;left:300px;top:${y}px;height:120px;width:1320px;border-radius:60px;background:rgba(255,255,255,.06)`; const f = document.createElement('div'); f.style.cssText = `height:100%;border-radius:60px;background:${c};box-shadow:0 0 30px ${c}`; r.appendChild(f); const l = document.createElement('div'); l.style.cssText = 'position:absolute;left:40px;top:28px;font:900 56px Nunito;color:#0b1118'; l.textContent = n; r.appendChild(l); L.appendChild(r); return f; }); }
        const a = K.W('thousands');
        bars[0].style.width = `${Math.min(100, Math.max(8, (t - a + 0.3) * 220))}%`;
        bars[1].style.width = `${Math.min(100, Math.max(8, (t - a + 0.3) * 1.6))}%`;
      };
    })());
    // G: volatile
    const s8 = K.shot(K.W('RAM', 5) - 0.2, K.length);
    SB.heading(s8, 'RAM IS VOLATILE', 'volatile', { color: C.lost });
    const ramC = s8.card({ x: 560, y: 560, w: 440, h: 340, icon: '⚡', label: 'RAM', labelSize: 56, color: C.memory, at: K.W('RAM', 5) });
    const ssdC = s8.card({ x: 1360, y: 560, w: 440, h: 340, icon: '💾', label: 'SSD', labelSize: 56, color: C.storage, at: 'save' });
    s8.say('TINY ELECTRICAL CHARGES', 'charges', { x: 560, y: 820, scale: 0.55, color: C.memory }).to('VANISH WHEN POWER DROPS', 'vanish', { color: C.lost }).to('PRESS SAVE', 'save', { color: C.white }).out('cut');
    s8.line({ pts: [[800, 560], [1120, 560]], at: 'copy', arrow: true, color: C.white });
    s8.mover({ pts: [[600, 560], [1320, 560]], at: 'work', dur: 1.2, label: '📄', size: 64, color: C.white, hold: true });
    ssdC.highlight('freezer', 'cut');
    s8.say('POWER CUT', 'power', { x: 960, y: 900, color: C.lost, scale: 0.8 }).to('COUNTER WIPED CLEAN', 'wipes');
    s8.custom((t, L) => { const a = K.W('cut'); ramC.el.style.filter = t > a ? `grayscale(${Math.min(1, (t - a) * 2)}) brightness(${1 - Math.min(0.5, (t - a))})` : ramC.el.style.filter; });
    K.ev(K.W('cut'), 'power');
  };

  // ---------- 03 · Binary, logic gates & Fetch-Decode-Execute ----------
  STORY['03'] = (K, X) => {
    const s1 = K.shot(0, 'using');
    SB.banner(K, s1, '03', 'BITS, GATES & THE CPU', 0.2);
    SB.heading(s1, 'NO WORDS, NO PICTURES', 'words').to('ONLY BITS', 'bits').to('8 BITS = 1 BYTE', 'byte').to('0 → 255', '255', { color: C.cpu });
    // Eight switches that flip; the byte counts up to 255.
    s1.custom((() => {
      let sw = null, num = null;
      return (t, L) => {
        if (!sw) {
          sw = Array.from({ length: 8 }, (_, i) => { const d = document.createElement('div'); d.style.cssText = `position:absolute;left:${300 + i * 170}px;top:420px;width:130px;height:200px;border-radius:24px;border:4px solid rgba(255,255,255,.3);display:grid;place-items:center;font:900 90px "Cascadia Mono",Consolas,monospace;color:#fff`; L.appendChild(d); return d; });
          num = document.createElement('div'); num.style.cssText = 'position:absolute;left:0;right:0;top:700px;text-align:center;font:900 120px Nunito;color:#2fd47a;text-shadow:0 0 40px rgba(47,212,122,.5)'; L.appendChild(num);
        }
        const show = K.W('bits'), grp = K.W('group'), cnt = K.W('represent'), fin = K.W('255');
        const n = t < cnt ? [0, 1, 1, 0, 1, 0, 0, 1].reduce((a, b, i) => a | (b << (7 - i)), 0) * (t > K.W('off') ? 1 : 0)
          : Math.round(255 * Morph.ease.sine(Kit.ramp(t, cnt, fin)));
        sw.forEach((d, i) => {
          const bit = (n >> (7 - i)) & 1, vis = Kit.arrive(t, show + i * 0.05, 0.4) * (i < 1 || t > grp - 0.2 ? 1 : 0.0) + (i >= 1 && t <= grp - 0.2 ? Kit.arrive(t, show + i * 0.05, 0.4) * 0.35 : 0);
          d.textContent = bit; d.style.opacity = vis;
          d.style.background = bit ? 'rgba(47,212,122,.25)' : 'rgba(255,255,255,.04)';
          d.style.borderColor = bit ? '#2fd47a' : 'rgba(255,255,255,.3)';
          d.style.boxShadow = bit ? '0 0 30px rgba(47,212,122,.5)' : 'none';
        });
        num.style.opacity = Kit.arrive(t, grp, 0.5);
        num.textContent = t > grp ? `${n}` : '';
      };
    })());
    // Logic gates
    const s2 = K.shot('using', 'lets');
    SB.heading(s2, 'LOGIC GATES', 'logic');
    s2.card({ x: 620, y: 520, w: 520, h: 380, icon: '∧', iconSize: 120, label: 'AND', labelSize: 60, sub: '1 only if BOTH inputs are 1', subSize: 26, color: C.cpu, at: 'N' });
    s2.card({ x: 1300, y: 520, w: 520, h: 380, icon: '∨', iconSize: 120, label: 'OR', labelSize: 60, sub: '1 if EITHER input is 1', subSize: 26, color: C.storage, at: 'N0' });
    SB.tag(s2, 'BILLIONS OF SWITCHES', 'billions').to('= MATH', 'math', { boxColor: C.cpu });
    // Fetch-Decode-Execute simulator
    const s3 = K.shot('lets', K.length, { zoom: [1, 1.03] });
    SB.heading(s3, 'FETCH · DECODE · EXECUTE', 'fetch', { y: 110 });
    const stages = [['FETCH', C.storage, K.W('fetch', 2)], ['DECODE', C.memory, K.W('decode', 2)], ['EXECUTE', C.cpu, K.W('execute', 2)]];
    const sc = stages.map(([n, c, at], i) => s3.card({ x: 1180 + i * 250, y: 260, w: 230, h: 110, label: n, labelSize: 34, color: c, at: 'simulator' }));
    sc[0].highlight(K.W('fetch', 2), K.W('decode', 2)); sc[1].highlight(K.W('decode', 2), K.W('execute', 2)); sc[2].highlight(K.W('execute', 2), 'repeat');
    const reg = s3.table({ x: 160, y: 380, cols: [380, 300], head: ['REGISTER', 'VALUE'], rows: [['Program counter', '1'], ['Instruction reg.', '—'], ['Accumulator', '14']], at: 'simulator', size: 36, mono: true });
    reg.set(0, 1, '1', 'counter', C.gold).set(1, 1, 'ADD 28', 'register', C.storage).set(0, 1, '2', 'increments', C.memory).set(2, 1, '42', '42', C.cpu);
    const ram = s3.table({ x: 1140, y: 420, cols: [220, 420], head: ['RAM ADDR', 'INSTRUCTION'], rows: [['0', 'LOAD 14'], ['1', 'ADD 28'], ['2', 'STORE'], ['3', 'HALT']], at: 'simulator', size: 36, mono: true, headColor: C.storage });
    ram.set(1, 1, 'ADD 28', K.W('RAM', 2), C.storage).set(1, 0, '1', 'address', C.gold);
    s3.line({ pts: [[1140, 600], [860, 545]], at: 'loads', arrow: true, color: C.storage });
    s3.say('READ FROM RAM', K.W('reads'), { x: 960, y: 900, scale: 0.6, color: C.storage })
      .to('CONTROL UNIT: WHAT DOES IT MEAN?', 'control', { color: C.memory })
      .to('ADD 28', 'add', { color: C.memory })
      .to('ARITHMETIC LOGIC UNIT', 'arithmetic', { color: C.cpu })
      .to('ALU', 'calculation')
      .to('14 + 28 = 42', 'total', { color: C.cpu })
      .to('BILLIONS OF TIMES A SECOND', K.W('billions', 2), { color: C.white });
  };

  // ---------- 04 · Sensors, circuits & the night-light ----------
  STORY['04'] = (K, X) => {
    const s1 = K.shot(0, 'we', { zoom: [1.0, 1.08] });
    s1.footage({ id: 'streetlamp' });
    SB.banner(K, s1, '04', 'SENSORS & CIRCUITS', 0.2);
    SB.tag(s1, 'OFF THE DESK', 'off').to('PHYSICAL MACHINES', 'physical').to('STREET LAMP', 'street').to('ROBOT', 'robot');
    const s2 = K.shot('we', 'lets', { zoom: [1.0, 1.05] });
    s2.footage({ id: 'breadboard', from: 0 });
    SB.dim(s2, 'we', null, 0.6);
    const a = s2.card({ x: 620, y: 470, w: 520, h: 330, icon: '📡', label: 'SENSORS = INPUTS', labelSize: 36, color: C.net, at: 'sensors' });
    const b = s2.card({ x: 1300, y: 470, w: 520, h: 330, icon: '💡', label: 'ACTUATORS = OUTPUTS', labelSize: 36, color: C.ai, at: 'actuators' });
    s2.say('LIGHT', 'light', { x: 620, y: 720, scale: 0.6, color: C.net }).to('TEMPERATURE', 'temperature').to('DISTANCE', 'distance');
    s2.say('LEDs', 'LEDs', { x: 1300, y: 720, scale: 0.6, color: C.ai }).to('BUZZERS', 'buzzers').to('MOTORS', 'motor');
    SB.tag(s2, 'ON A BREADBOARD', 'breadboard');
    a.highlight('sensors', 'actuators'); b.highlight('actuators');
    // The night-light circuit
    const s3 = K.shot('lets', 'note');
    SB.heading(s3, 'AUTOMATIC NIGHT LIGHT', 'night');
    const xs = [400, 960, 1520], y = 500;
    const ldr = s3.card({ x: xs[0], y, w: 400, h: 300, icon: '🔆', label: 'LDR', labelSize: 50, color: C.net, at: 'LDR' });
    const ctl = s3.card({ x: xs[1], y, w: 400, h: 300, icon: '🧠', label: 'CONTROLLER', labelSize: 40, color: C.cpu, at: 'middle' });
    const led = s3.card({ x: xs[2], y, w: 400, h: 300, icon: '💡', label: 'LED', labelSize: 50, color: C.power, at: 'output' });
    s3.say('INPUT', 'input', { x: xs[0], y: 300, scale: 0.55, color: C.net });
    s3.say('LIGHT-DEPENDENT RESISTOR', 'light', { x: xs[0], y: 730, scale: 0.42 }).to('DARK → RESISTANCE CHANGES', 'resistance', { color: C.net }).to('VOLTAGE ON INPUT PIN', 'voltage');
    s3.say('COMPARES TO A THRESHOLD', 'compares', { x: xs[1], y: 730, scale: 0.42 }).to('BELOW 30%?', 'below', { color: C.cpu, scale: 0.6 });
    s3.say('OUTPUT', 'output', { x: xs[2], y: 300, scale: 0.55, color: C.power });
    s3.say('IF DARK → VOLTAGE', 'sends', { x: xs[2], y: 730, scale: 0.42, color: C.power });
    s3.line({ pts: [[xs[0] + 210, y], [xs[1] - 210, y]], at: 'pin', arrow: true, color: C.net });
    s3.line({ pts: [[xs[1] + 210, y], [xs[2] - 210, y]], at: 'sends', arrow: true, color: C.power });
    s3.mover({ pts: [[xs[0], y], [xs[2], y]], at: 'sends', dur: 1.3, size: 26, color: C.power });
    ldr.highlight('dark', 'middle'); ctl.highlight('compares', 'output'); led.highlight(K.W('LED', 1));
    s3.custom((t, L) => { const k = Morph.ease.sine(Kit.ramp(t, K.W('dark'), K.W('dark') + 1)); s3.el.style.filter = `brightness(${1 - k * 0.25})`; });
    // Two hard rules
    const s4 = K.shot('note', K.length);
    SB.heading(s4, 'TWO HARD RULES', 'two');
    const p = s4.card({ x: 620, y: 520, w: 560, h: 420, icon: '↔️', label: '1 · POLARITY', labelSize: 44, color: C.power, at: 'polarity' });
    s4.say('LONG LEG (+) → SHORT LEG (−)', 'long', { x: 620, y: 800, scale: 0.45, color: C.power });
    s4.mover({ pts: [[420, 520], [820, 520]], at: 'flows', dur: 1.4, loop: true, size: 22, color: C.power, out: 'second' });
    const r = s4.card({ x: 1300, y: 520, w: 560, h: 420, icon: '〰️', label: '2 · RESISTOR IN SERIES', labelSize: 38, color: C.memory, at: 'resistor' });
    s4.say('NO BURNT-OUT LED', 'burn', { x: 1300, y: 800, scale: 0.45, color: C.memory });
    p.highlight('polarity', 'second'); r.highlight('resistor');
  };

  // ---------- 05 · Pause & predict: thresholds vs hysteresis ----------
  STORY['05'] = (K, X) => {
    const s1 = K.shot(0, 'imagine', { zoom: [1, 1.05] });
    SB.banner(K, s1, '05', 'PAUSE & PREDICT', 0.2);
    SB.heading(s1, 'YOUR TURN', 'turn', { y: 470, scale: 1.4 }).to('THINK LIKE A HARDWARE ENGINEER', 'engineer', { scale: 0.9 });
    const s2 = K.shot('imagine', K.length, { zoom: [1, 1.03] });
    s2.footage({ id: 'streetlamp', from: 1 });
    SB.dim(s2, 'imagine', null, 0.78);
    SB.heading(s2, 'DUSK · A PASSING CLOUD', 'dusk', { y: 110 }).to('SIMPLE THRESHOLD: 300', 'simple').to('HYSTERESIS BUFFER', 'hysteresis', { color: C.cpu }).to('PREDICT THE LAMP', 'pause', { color: C.gold })
      .to('SIMPLE: OFF · ON · OFF', K.W('under'), { color: C.lost }).to('HYSTERESIS: STAYS ON', K.W('with'), { color: C.cpu }).to('STUDY GUIDE CH. 9 · MC06', 'chapter', { color: C.white });
    const tb = s2.table({ x: 240, y: 300, cols: [680, 240, 240, 240], head: ['LIGHT READING', '450', '280', '305'],
      rows: [['Simple · on < 300', '?', '?', '?'], ['Hysteresis · on < 290, off > 320', '?', '?', '?']], at: 'flicker', rowAt: ['simple', 'hysteresis'], size: 38 });
    tb.set(0, 1, 'OFF', K.W('off', 3), C.lost).set(0, 2, 'ON', K.W('on', 3), C.power).set(0, 3, 'OFF', K.W('off', 4), C.lost);
    tb.set(1, 1, 'OFF', K.W('turns', 2), C.lost).set(1, 2, 'ON', K.W('280', 2), C.power).set(1, 3, 'ON', 'stays', C.power);
    s2.timer({ x: 960, y: 820, at: 'pause', dur: 6, out: 'ready' });
    s2.say('FLICKERING!', 'flickering', { x: 960, y: 840, color: C.lost }).out(K.W('with'));
    s2.say('305 NEVER CROSSES 320', 'because', { x: 960, y: 840, color: C.cpu, scale: 0.7 });
  };

  // ---------- 06 · Interfaces, datasheets & bridge to Video 02 ----------
  STORY['06'] = (K, X) => {
    const s1 = K.shot(0, 'now');
    SB.banner(K, s1, '06', 'CONNECTING CHIPS', 0.2);
    SB.heading(s1, 'THE RIGHT WIRE FOR THE JOB', 'communication');
    const xs = [330, 750, 1170, 1590];
    const cs = [
      s1.card({ x: xs[0], y: 470, w: 360, h: 300, icon: '🔘', label: 'GPIO', labelSize: 50, sub: 'simple on / off', color: C.net, at: 'GPIO' }),
      s1.card({ x: xs[1], y: 470, w: 360, h: 300, icon: '🔗', label: 'I2C', labelSize: 50, sub: 'many sensors · 2 wires', color: C.cpu, at: 'I2C' }),
      s1.card({ x: xs[2], y: 470, w: 360, h: 300, icon: '🖥️', label: 'SPI', labelSize: 50, sub: 'high-speed displays', color: C.storage, at: 'SPI' }),
      s1.card({ x: xs[3], y: 470, w: 360, h: 300, icon: '✉️', label: 'UART', labelSize: 50, sub: 'direct serial messages', color: C.memory, at: 'UART' }),
    ];
    cs[0].highlight('GPIO', 'I2C'); cs[1].highlight('I2C', 'SPI'); cs[2].highlight('SPI', 'UART'); cs[3].highlight('UART', 'always');
    SB.tag(s1, 'CHECK THE DATASHEET', 'datasheet').to('VOLTAGE LIMITS', 'voltage', { boxColor: C.power }).to('RELIABLE HARDWARE', 'reliable', { boxColor: C.cpu }).to('NOT ELECTRONIC WASTE', 'waste', { boxColor: C.lost });
    const s2 = K.shot('now', K.length, { zoom: [1.0, 1.1] });
    s2.footage({ id: 'earth' });
    SB.heading(s2, 'ONE SMART DEVICE', 'single', { y: 160 }).to('HOW DO TWO DEVICES TALK?', 'talk').to('ACROSS A ROOM', 'room').to('ACROSS THE PLANET', 'planet', { color: C.net });
    SB.tag(s2, 'NEXT · VIDEO 02 · NETWORKS', 'video', { boxColor: C.net });
  };
})();
