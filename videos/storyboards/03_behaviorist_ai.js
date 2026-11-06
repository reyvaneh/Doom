// Video 03 · Behaviorist AI — storyboard.
// Every beat is anchored to the narrator's word: K.W('word', nth) (see tools/video_kit/lib/kit.js).
// Note: anchors use the words as transcribed (e.g. "Uniship" = "Unit C", "query" = "Q").
(() => {
  const { C } = Kit;

  // ---------- 01 · Hook: the frozen planner vs the insect · UNIT C ----------
  STORY['01'] = (K, X) => {
    const s1 = K.shot(0, 'scan', { zoom: [1.0, 1.08] });
    s1.footage({ id: 'labrobot' });
    SB.tag(s1, 'EARLY AI ROBOTS', 'early').to('THINK LIKE A CHESS GRANDMASTER', 'Grandmaster', { boxColor: C.ai });
    const s2 = K.shot('scan', 'If');
    SB.heading(s2, 'THE OLD WAY', 'scan').to('THE RESULT?', 'result', { color: C.lost });
    const steps = [['📷', 'SCAN THE ROOM', 'scan'], ['🧊', '3D WORLD MODEL', 'model'], ['🗺️', 'PLAN A PATH', 'plan'], ['👣', 'MOVE ONE STEP', 'move']];
    steps.forEach(([ic, lb, at], i) => {
      s2.card({ x: 300 + i * 440, y: 540, w: 360, h: 300, icon: ic, label: lb, labelSize: 30, color: i === 3 ? C.memory : C.ai, at });
      if (i) s2.line({ pts: [[300 + (i - 1) * 440 + 190, 540], [300 + i * 440 - 190, 540]], at, arrow: true, color: 'rgba(255,255,255,.6)' });
    });
    const s3 = K.shot('If', 'How');
    SB.heading(s3, 'SOMEONE WALKS PAST', 'someone');
    const bot = s3.card({ x: 960, y: 520, w: 420, h: 360, icon: '🤖', iconSize: 170, color: C.ai, at: 'someone' });
    s3.say('RECALCULATING…', 'froze', { x: 960, y: 790, scale: 0.6, color: C.lost }).to('STILL RECALCULATING…', 'giant');
    SB.tag(s3, 'FROZE FOR MINUTES', 'froze', { boxColor: C.lost }).to('1980s · RODNEY BROOKS', 'Brooks', { boxColor: C.white }).to('ONE SIMPLE QUESTION', 'simple');
    s3.custom((t) => { const a = K.W('froze'), b = K.W('Brooks'); bot.el.style.filter = t > a && t < b ? `grayscale(${Math.min(1, (t - a) * 2)})` : 'none'; });
    const s4 = K.shot('How', 'Welcome', { zoom: [1.0, 1.12] });
    s4.footage({ id: 'insect' });
    SB.tag(s4, 'HOW DOES AN INSECT DODGE?', 'How').to('IN MILLISECONDS', 'milliseconds', { boxColor: C.memory }).to('WITH A TINY BRAIN', 'brain')
      .to('BEHAVIOURIST AI', 'Behaviourist', { boxColor: C.ai });
    const s5 = K.shot('Welcome', K.W('tutorial') - 0.5, { bg: '#07090d' });
    X.golem(s5, 'ai', { ringAt: 'Uniship', taunt: 'Uniship' });
    s5.say('UNIT C', 'Uniship', { style: 'title', x: 960, y: 880 });
    SB.tag(s5, 'TEAM DOOM · BEHAVIOURIST AI', K.W('Uniship') + 0.8, { y: 990, boxColor: C.ai });
    const s6 = K.shot(K.W('tutorial') - 0.5, K.length, { zoom: [1, 1.04] });
    SB.heading(s6, 'IN THIS TUTORIAL', 'tutorial').to('YOU WILL LEARN', 'learn');
    const cards = [['⚡', 'REAL-TIME REFLEXES', 'retips', C.memory], ['🔁', 'STATE MACHINES', 'design', C.storage], ['🧱', 'SUBSUMPTION', 'layer', C.lost],
      ['🎯', 'Q-LEARNING', 'QI', C.cpu], ['🧩', 'ONE SYSTEM', 'combine', C.ai]];
    const cs = cards.map(([ic, lb, at, col], i) => s6.card({ x: 240 + i * 360, y: 540, w: 320, h: 300, icon: ic, label: lb, labelSize: 28, color: col, at }));
    cs.forEach((c, i) => c.highlight(cards[i][2], cards[i + 1] ? cards[i + 1][2] : null));
  };

  // ---------- 02 · Sense → decide → act, reflex agents ----------
  STORY['02'] = (K, X) => {
    const s1 = K.shot(0, 'Rather', { zoom: [1.0, 1.08] });
    s1.footage({ id: 'vacuum' });
    SB.banner(K, s1, '02', 'BEHAVIOURIST AI', 0.4);
    SB.tag(s1, 'OBSERVABLE BEHAVIOUR', 'observable', { boxColor: C.ai }).to('RESPONDS TO ITS ENVIRONMENT', 'responds').to('RIGHT NOW', 'now', { boxColor: C.memory });
    const s2 = K.shot('Rather', 'simplest');
    SB.heading(s2, 'NO HEAVY MAPS', 'storing', { color: C.lost }).to('A TIGHT CONTINUOUS LOOP', 'loop', { color: C.white });
    const P = { sense: [480, 430], decide: [1440, 430], act: [960, 820] };
    const sense = s2.card({ x: P.sense[0], y: P.sense[1], w: 380, h: 260, icon: '📡', label: 'SENSE', labelSize: 46, color: C.net, at: 'send' });
    const decide = s2.card({ x: P.decide[0], y: P.decide[1], w: 380, h: 260, icon: '🧠', label: 'DECIDE', labelSize: 46, color: C.ai, at: 'decide' });
    const act = s2.card({ x: P.act[0], y: P.act[1], w: 380, h: 260, icon: '🦾', label: 'ACT', labelSize: 46, color: C.memory, at: 'motor' });
    s2.line({ pts: [[680, 430], [1240, 430]], at: 'decide', arrow: true, color: C.ai });
    s2.line({ pts: [[1400, 570], [1150, 760]], at: 'motor', arrow: true, color: C.memory });
    s2.line({ pts: [[770, 760], [520, 570]], at: 'changes', arrow: true, color: C.net });
    s2.say('HARDWARE INPUTS', 'inputs', { x: P.sense[0], y: 610, scale: 0.45, color: C.net });
    s2.say('WHICH ACTION?', 'action', { x: P.decide[0], y: 610, scale: 0.45, color: C.ai });
    s2.say('MOTOR OUTPUTS', 'outputs', { x: P.act[0], y: 1000, scale: 0.45, color: C.memory });
    s2.say('ENVIRONMENT CHANGES', 'changes', { x: 960, y: 600, scale: 0.5 }).to('NEXT CYCLE', 'cycle', { color: C.gold });
    s2.mover({ pts: [P.sense, P.decide, P.act, P.sense], at: 'cycle', dur: 2.4, loop: true, size: 30, color: C.gold });
    sense.highlight('send', 'decide'); decide.highlight('decide', 'motor'); act.highlight('motor', 'changes');
    const s3 = K.shot('simplest', 'No', { zoom: [1.0, 1.08] });
    s3.footage({ id: 'stairs' });
    SB.tag(s3, 'SIMPLE REFLEX AGENT', 'reflex', { boxColor: C.memory }).to('IF CLIFF SENSOR = STAIRS', 'stairs', { boxColor: C.white }).to('THEN STOP & REVERSE', 'stop', { boxColor: C.cpu });
    s3.say('IF stairs THEN stop', 'if', { style: 'data', x: 960, y: 140, color: C.memory, scale: 1.1 });
    const s4 = K.shot('No', K.length);
    SB.heading(s4, 'REFLEXES ARE FAST', 'fast', { color: C.cpu }).to('BUT…', 'but').to('TRAPPED IN A CORNER', 'trapped', { color: C.lost });
    s4.line({ pts: [[700, 300], [700, 860], [1260, 860]], at: 'trapped', width: 14, color: C.grey });
    s4.mover({ pts: [[820, 520], [1060, 760], [820, 520]], at: 'bouncing', dur: 1.1, loop: true, label: '🤖', size: 90, color: C.ai, linear: true });
    SB.tag(s4, 'NO MEMORY OF 1 SECOND AGO', 'memory', { boxColor: C.lost });
  };

  // ---------- 03 · Finite state machines & subsumption ----------
  STORY['03'] = (K, X) => {
    const s1 = K.shot(0, 'Angering');
    SB.banner(K, s1, '03', 'STATES & LAYERS', 0.2);
    SB.heading(s1, 'SEQUENCES OF ACTIONS', 'sequence').to('FINITE STATE MACHINE', 'finish', { color: C.storage }).to('DISTINCT MODES', 'modes');
    s1.card({ x: 640, y: 560, w: 520, h: 300, icon: '🔁', label: 'FINITE STATE MACHINE', labelSize: 34, color: C.storage, at: 'tools', out: 'modes' });
    s1.card({ x: 1280, y: 560, w: 520, h: 300, icon: '🧱', label: 'SUBSUMPTION', labelSize: 40, color: C.lost, at: 'subtraction', out: 'modes' });
    const P = [[480, 470], [1440, 470], [960, 840]];
    const st = [['🧹', 'CLEANING', 'cleaning'], ['↩️', 'TURNING', 'turning'], ['🔌', 'RETURN TO DOCK', 'returning']]
      .map(([ic, lb, at], i) => s1.card({ x: P[i][0], y: P[i][1], w: 400, h: 240, icon: ic, label: lb, labelSize: 38, color: C.storage, at }));
    s1.line({ pts: [[700, 440], [1220, 440]], at: 'triggers', arrow: true, color: C.storage });
    s1.line({ pts: [[1400, 600], [1150, 740]], at: 'triggers', arrow: true, color: C.storage });
    s1.line({ pts: [[750, 780], [520, 600]], at: 'triggers', arrow: true, color: C.storage });
    s1.say('SENSOR TRIGGER', 'triggers', { x: 960, y: 390, scale: 0.45, color: C.gold });
    st[0].highlight('cleaning', 'turning'); st[1].highlight('turning', 'returning'); st[2].highlight('returning', 'switch');
    st[0].highlight('switch', K.W('switch') + 0.6); st[1].highlight(K.W('switch') + 0.6);
    // Subsumption
    const layers = (s, at) => s.stack({ x: 960, y: 330, w: 1160, h: 150, gap: 24, labelSize: 42, layers: [
      { label: 'LAYER 2 · NAVIGATE TO DOCK', sub: 'lowest priority', color: C.cpu, at: at ?? 'navigate' },
      { label: 'LAYER 1 · WANDER & EXPLORE', sub: 'middle', color: C.storage, at: at ?? 'wander' },
      { label: 'LAYER 0 · SURVIVAL', sub: 'avoid collisions · stairs · highest priority', color: C.lost, at: at ?? 'survival' },
    ] });
    const s2 = K.shot('Angering', 'car');
    SB.heading(s2, 'MULTIPLE GOALS CONFLICT?', 'multiple').to('SUBSUMPTION ARCHITECTURE', 'subsumption', { color: C.lost }).to('LAYERS BY PRIORITY', 'priority')
      .to('ALL LAYERS RUN IN PARALLEL', 'parallel', { color: C.white });
    s2.card({ x: 960, y: 560, w: 640, h: 340, icon: '🤖', label: 'MANY GOALS AT ONCE', labelSize: 40, sub: 'avoid · explore · dock', subSize: 30, color: C.ai, at: 'multiple', out: 'bottom' });
    const L2 = layers(s2);
    L2[2].highlight('survival', 'wander'); L2[1].highlight('wander', 'navigate'); L2[0].highlight('navigate', 'parallel'); L2[0].highlight('driving');
    const s3 = K.shot('car', 'Once', { zoom: [1.0, 1.08] });
    s3.footage({ id: 'cat' });
    SB.tag(s3, 'A CAT STEPS IN FRONT', 'car').to('LAYER 0 OVERRIDES LAYER 2', 'overrides', { boxColor: C.lost }).to('SWERVES AWAY', 'swerves', { boxColor: C.cpu });
    const s4 = K.shot('Once', K.length);
    SB.heading(s4, 'OBSTACLE CLEARED', 'Once').to('LAYER 2 RESUMES', 'resumes', { color: C.cpu }).to('NO GIANT CENTRAL PLANNER', 'giant', { color: C.gold });
    const L4 = layers(s4, 'Once');
    L4[0].highlight('resumes');
  };

  // ---------- 04 · Reinforcement learning & the Q-table ----------
  STORY['04'] = (K, X) => {
    const s1 = K.shot(0, 'unknown');
    SB.banner(K, s1, '04', 'LEARNING FROM REWARD', 0.2);
    SB.heading(s1, 'REACTIVE RULES', 'Reactive', { y: 440, scale: 1.1 }).to('NEED EVERY RULE IN ADVANCE', 'advance', { color: C.memory });
    const s2 = K.shot('unknown', 'Instead', { zoom: [1.0, 1.1] });
    s2.footage({ id: 'maze' });
    SB.tag(s2, 'AN UNKNOWN MAZE', 'unknown').to('LEARN THE BEST STRATEGY', 'best').to('REINFORCEMENT LEARNING', 'reinforcement', { boxColor: C.ai });
    const s3 = K.shot('Instead', K.W('query') - 0.4);
    SB.heading(s3, 'NO RULES', 'Instead').to('A NUMERIC REWARD', 'reward', { color: C.gold });
    const r = [['🔋', '+10', 'CHARGING GOAL', 'reaching', C.cpu], ['☠️', '−10', 'HAZARD', 'hitting', C.lost], ['👣', '−1', 'EVERY STEP', 'step', C.memory]]
      .map(([ic, v, lb, at, col], i) => s3.card({ x: 480 + i * 480, y: 540, w: 400, h: 340, icon: ic, label: v, labelSize: 70, sub: lb, subSize: 28, color: col, at }));
    s3.say('SO IT LEARNS TO HURRY', 'hurry', { x: 1440, y: 790, scale: 0.5, color: C.memory });
    r[0].highlight('reaching', 'hitting'); r[1].highlight('hitting', 'step'); r[2].highlight('step');
    const s4 = K.shot(K.W('query') - 0.4, 'How');
    SB.heading(s4, 'Q-LEARNING', 'query', { color: C.cpu }).to('THE Q-TABLE', K.W('table', 2));
    const qt = s4.table({ x: 330, y: 270, cols: [260, 250, 250, 250, 250], head: ['STATE', '↑ UP', '↓ DOWN', '← LEFT', '→ RIGHT'],
      rows: [['square 0,0', '0.0', '0.0', '0.0', '0.0'], ['square 0,1', '0.0', '0.0', '0.0', '0.0'], ['square 1,0', '0.0', '0.0', '0.0', '0.0'], ['square 1,1', '0.0', '0.0', '0.0', '0.0']],
      at: K.W('table', 2), size: 40, mono: true, headColor: C.cpu });
    qt.set(0, 0, 'square 0,0', 'row', C.storage).set(0, 4, '0.0', 'column', C.memory).set(0, 4, '7.3', 'value', C.cpu);
    SB.tag(s4, 'ROW = STATE (A SQUARE)', 'row', { boxColor: C.storage }).to('COLUMN = ACTION', 'column', { boxColor: C.memory }).to('Q-VALUE = FUTURE REWARD', 'value', { boxColor: C.cpu });
    const s5 = K.shot('How', K.length);
    SB.heading(s5, 'FILLING THE TABLE', 'fill').to('BALANCE', 'balancing', { color: C.gold });
    const ex = s5.card({ x: 560, y: 470, w: 600, h: 320, icon: '🎲', label: 'EXPLORE', labelSize: 56, color: C.net, at: 'exploration' });
    const xp = s5.card({ x: 1360, y: 470, w: 600, h: 320, icon: '🏆', label: 'EXPLOIT', labelSize: 56, color: C.cpu, at: 'exploitation' });
    s5.say('RANDOM NEW PATHS', 'random', { x: 560, y: 700, scale: 0.5, color: C.net }).to('ε-GREEDY', 'excellent').to('MAY FIND A SHORTCUT', 'shortcut');
    s5.say('HIGHEST Q-VALUE', 'highest', { x: 1360, y: 700, scale: 0.5, color: C.cpu });
    ex.highlight('exploration', 'exploitation'); xp.highlight('exploitation', 'updates');
    s5.say('Q ← reward + best next Q', 'updates', { style: 'data', x: 960, y: 900, color: C.gold }).to('Q ← r + max Q(next)', K.W('best', 2), { color: C.gold });
  };

  // ---------- 05 · The 4×4 grid simulator ----------
  STORY['05'] = (K, X) => {
    const s1 = K.shot(0, K.length, { zoom: [1.0, 1.03] });
    SB.banner(K, s1, '05', 'WATCH IT LEARN', 0.4);
    SB.heading(s1, 'WATCH IT LEARN LIVE', 'watch', { y: 110 }).to('Q-LEARNING 4×4 GRID', 'Simulator').to('EPISODE 0 · ALL ZEROS', 'episode').to('RUN 1 EPISODE', 'Run', { color: C.net })
      .to('Q-VALUE DROPS', 'drops', { color: C.lost }).to('TRAIN 50 EPISODES', 'train', { color: C.net }).to('REWARD SPREADS BACKWARDS', 'spreads', { color: C.cpu })
      .to('THE SHORTEST SAFE PATH', 'shortest', { color: C.gold });
    SB.tag(s1, 'NO HUMAN-WRITTEN RULES', 'single', { y: 1010, boxColor: C.gold });
    const N = 4, S = 165, X0 = 960 - 2 * S, Y0 = 210;
    const goal = [3, 3], hz = [[1, 1], [3, 1]];
    const isHz = (r, c) => hz.some(([a, b]) => a === r && b === c);
    const ok = (r, c) => r >= 0 && c >= 0 && r < N && c < N && !isHz(r, c);
    const dist = Array.from({ length: N }, () => Array(N).fill(99)); dist[3][3] = 0;
    for (const q = [[3, 3]]; q.length;) { const [r, c] = q.shift(); for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = r + dr, b = c + dc; if (ok(a, b) && dist[a][b] === 99) { dist[a][b] = dist[r][c] + 1; q.push([a, b]); } } }
    const MOVES = [[0, 1, '→'], [1, 0, '↓'], [0, -1, '←'], [-1, 0, '↑']];
    const greedy = (r, c) => { let best = null; for (const [dr, dc, a] of MOVES) if (ok(r + dr, c + dc) && (!best || dist[r + dr][c + dc] < best[0])) best = [dist[r + dr][c + dc], [r + dr, c + dc], a]; return best; };
    const path = [[0, 0]]; while (path.length < 12) { const [r, c] = path[path.length - 1]; if (r === 3 && c === 3) break; path.push(greedy(r, c)[1]); }
    const wander = [[0, 0], [0, 1], [0, 2], [0, 1], [1, 1]];
    s1.custom((() => {
      let cells = null, agent, epi;
      return (t, L) => {
        if (!cells) {
          cells = [];
          for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
            const d = document.createElement('div');
            d.style.cssText = `position:absolute;left:${X0 + c * S + 5}px;top:${Y0 + r * S + 5}px;width:${S - 10}px;height:${S - 10}px;border-radius:18px;display:grid;place-items:center;font:900 34px Nunito;color:#e8f0ff;border:3px solid rgba(255,255,255,.18)`;
            L.appendChild(d); cells.push(d);
          }
          agent = document.createElement('div'); agent.style.cssText = 'position:absolute;width:70px;height:70px;border-radius:50%;background:#2ee6c8;box-shadow:0 0 30px #2ee6c8;display:grid;place-items:center;font:900 30px Nunito;color:#0b1118'; agent.textContent = 'A'; L.appendChild(agent);
          epi = document.createElement('div'); epi.style.cssText = `position:absolute;left:${X0 + N * S + 40}px;top:${Y0}px;font:900 40px Nunito;color:#8a96a6;white-space:nowrap`; L.appendChild(epi);
        }
        const show = Kit.arrive(t, K.W('watch'), 0.6), ttrain = K.W('train'), tspread = ttrain + 1.6, tarrow = K.W('arrow'), tpath = K.W('shortest');
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
          const d = cells[r * N + c], G = r === 3 && c === 3, H = isHz(r, c);
          d.style.opacity = show; d.style.transform = `translateY(${(1 - show) * 30}px)`;
          let txt = '0.0', col = 'rgba(255,255,255,.04)', bc = 'rgba(255,255,255,.18)', fc = '#e8f0ff';
          if (G) { txt = '+10'; col = t > K.W('Win') ? 'rgba(47,212,122,.35)' : col; bc = t > K.W('Win') ? '#2fd47a' : bc; }
          else if (H) { txt = '−10'; col = t > K.W('Red') ? 'rgba(255,77,94,.3)' : col; bc = t > K.W('Red') ? '#ff4d5e' : bc; }
          else {
            if (r === 0 && c === 1 && t > K.W('drops')) { txt = '↓ −1.0'; fc = '#ff4d5e'; }
            const tr = tspread + dist[r][c] * 0.55;
            if (dist[r][c] < 99 && t > tr) {
              const v = 10 * Math.pow(0.9, dist[r][c]);
              txt = (t > tarrow ? greedy(r, c)[2] + ' ' : '') + v.toFixed(1); fc = '#e8f0ff';
              col = `rgba(47,212,122,${0.06 + 0.3 * v / 10})`;
            }
          }
          const pi = path.findIndex(([a, b]) => a === r && b === c);
          if (pi >= 0 && t > tpath + pi * 0.25) { bc = '#fbbf24'; d.style.boxShadow = '0 0 30px rgba(251,191,36,.6)'; } else d.style.boxShadow = 'none';
          d.textContent = txt; d.style.background = col; d.style.borderColor = bc; d.style.color = fc;
        }
        // The agent: random wander into the hazard, then a fast blur of training episodes, then the learned path.
        let pos = null;
        const w0 = K.W('wander'), w1 = K.W('accidentally') + 0.4;
        if (t >= w0 && t < K.W('drops') + 0.8) { const k = Kit.ramp(t, w0, w1) * (wander.length - 1), i = Math.min(wander.length - 2, Math.floor(k)), f = k - i; pos = [wander[i][0] + (wander[i + 1][0] - wander[i][0]) * f, wander[i][1] + (wander[i + 1][1] - wander[i][1]) * f]; }
        else if (t >= ttrain && t < tspread + 3) { const k = ((t - ttrain) * 6) % path.length, i = Math.min(path.length - 2, Math.floor(k)), f = k - i; pos = [path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f]; }
        else if (t >= tpath) { const k = Math.min(path.length - 1, (t - tpath) * 4), i = Math.min(path.length - 2, Math.floor(k)), f = k - i; pos = [path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f]; }
        else if (t >= K.W('watch') && t < w0) pos = [0, 0];
        agent.style.display = pos ? '' : 'none';
        if (pos) agent.style.transform = `translate(${X0 + pos[1] * S + S / 2 - 35}px,${Y0 + pos[0] * S + S / 2 - 35}px)`;
        epi.style.opacity = show;
        epi.textContent = t < K.W('Run') ? 'EPISODE 0' : t < ttrain ? 'EPISODE 1' : `EPISODE ${Math.min(51, 1 + Math.floor((t - ttrain) * 18))}`;
      };
    })());
    K.ev(K.W('drops'), 'bad'); K.ev(K.W('spreads'), 'good');
  };

  // ---------- 06 · Pause & predict: pick the action ----------
  STORY['06'] = (K, X) => {
    const tableAt = (s, at, rowAt) => s.table({ x: 220, y: 300, cols: [330, 300], head: ['ACTION', 'Q-VALUE'], rows: [['↑ Up', '+1.2'], ['↓ Down', '−4.5'], ['→ Right', '+6.8'], ['← Left', '+0.4']],
      at, rowAt, size: 46, mono: true, headColor: C.cpu });
    const s1 = K.shot(0, 'lets');
    SB.banner(K, s1, '06', 'PAUSE & PREDICT', 0.2);
    SB.heading(s1, 'PAUSE & PREDICT', 'Pause', { color: C.gold });
    tableAt(s1, 'look', ['Up', 'down', 'right', 'left']);
    s1.card({ x: 1300, y: 420, w: 820, h: 230, icon: '1️⃣', iconSize: 60, label: 'ε = 0 · WHICH ACTION?', labelSize: 40, sub: 'pure exploitation', subSize: 28, color: C.cpu, at: 'First' });
    s1.card({ x: 1300, y: 720, w: 820, h: 230, icon: '2️⃣', iconSize: 60, label: 'WHY IS ε = 0 FROM EPISODE 1 DANGEROUS?', labelSize: 32, color: C.lost, at: 'Second' });
    s1.timer({ x: 540, y: 880, at: 'Answer', dur: K.W('lets') - K.W('Answer'), count: 10, out: 'lets' });
    const s2 = K.shot('lets', K.length);
    SB.heading(s2, "LET'S CHECK", 'lets').to('1 · PICK THE HIGHEST Q', 'highest', { color: C.cpu }).to('→ RIGHT  +6.8', K.W('right', 2), { color: C.cpu })
      .to('2 · ε = 0 FROM THE START', K.W('second', 2), { color: C.lost }).to('STUDY GUIDE CH. 13 & 14', 'chapter', { color: C.gold });
    const tb = tableAt(s2, 'lets');
    tb.set(2, 1, '+6.8', K.W('right', 2), C.cpu).set(2, 0, '→ Right', K.W('right', 2), C.cpu);
    s2.say('LOCKS ONTO A MEDIOCRE PATH', 'mediocre', { x: 1300, y: 420, scale: 0.6, color: C.lost }).to('NEVER EXPLORES THE MAP', 'never').to('MISSES BETTER ROUTES', 'better').to('MC18 · OE05', 'MC18', { color: C.gold });
  };

  // ---------- 07 · Finale: one system · the Professor ----------
  STORY['07'] = (K, X) => {
    const s1 = K.shot(0, 'Unit', { zoom: [1.0, 1.1] });
    s1.footage({ id: 'patrol' });
    SB.tag(s1, 'STEP BACK', 'step').to('A REAL AUTONOMOUS SYSTEM', 'autonomous', { boxColor: C.ai }).to('JUST HARDWARE?', 'hardware', { boxColor: C.white })
      .to('JUST NETWORKING?', 'networking').to('JUST AI?', 'AI').to('NEVER JUST ONE', K.W('AI') + 0.8, { boxColor: C.gold });
    const s2 = K.shot('Unit', 'Open');
    SB.heading(s2, 'THREE UNITS', 'Unit').to('ONE SYSTEM', 'Learning', { color: C.gold });
    const xs = [420, 960, 1500];
    const A = s2.card({ x: xs[0], y: 470, w: 480, h: 340, icon: '🦾', label: 'UNIT A · HARDWARE', labelSize: 34, color: C.power, at: 'Unit' });
    const B = s2.card({ x: xs[1], y: 470, w: 480, h: 340, icon: '🌐', label: 'UNIT B · NETWORKS', labelSize: 34, color: C.net, at: 'Units' });
    const Cc = s2.card({ x: xs[2], y: 470, w: 480, h: 340, icon: '🧠', label: 'UNIT C · BEHAVIOURIST AI', labelSize: 30, color: C.ai, at: K.W('Unit', 2) });
    s2.say('THE BODY', 'body', { x: xs[0], y: 710, scale: 0.5, color: C.power }).to('SENSORS', 'sensor').to('RAM · CPU', 'RAM').to('MOTORS', 'motor');
    s2.say('LIVE UDP STREAMS', 'UDP', { x: xs[1], y: 710, scale: 0.5, color: C.net }).to('RELIABLE TCP COMMANDS', 'TCP');
    s2.say('MILLISECOND REACTIONS', 'Millisecond', { x: xs[2], y: 710, scale: 0.5, color: C.ai }).to('SUBSUMPTION SAFETY', 'Subsumption').to('REINFORCEMENT LEARNING', 'Reinforcement');
    A.highlight('Unit', 'Units'); B.highlight('Units', K.W('Unit', 2)); Cc.highlight(K.W('Unit', 2), 'Learning'); A.highlight('Learning'); B.highlight('Learning'); Cc.highlight('Learning');
    s2.line({ pts: [[xs[0], 860], [xs[0], 900], [xs[2], 900], [xs[2], 860]], at: 'Learning', dur: 1.0, color: C.gold, width: 6 });
    s2.line({ pts: [[xs[1], 860], [xs[1], 900]], at: 'Learning', dur: 0.6, color: C.gold, width: 6 });
    const s3 = K.shot('Open', 'test');
    SB.heading(s3, 'OPEN THE STUDY GUIDE', 'Open', { y: 420, scale: 1.1 }).to('INTERACTIVE SIMULATOR', 'simulator', { color: C.net }).to('HANDS-ON ACTIVITIES', 'try', { color: C.memory });
    s3.card({ x: 960, y: 700, w: 360, h: 260, icon: '🎮', label: 'STUDY GUIDE', labelSize: 34, color: C.gold, at: 'Open' });
    const s4 = K.shot('test', K.length + 0.5, { bg: '#07090d', fadeOut: 0 });
    X.golem(s4, 'professor', { ringAt: 'test', taunt: 'Thanks' });
    SB.tag(s4, '46-QUESTION TEST BANK', 'test', { y: 960, boxColor: C.gold }).to('THANKS FOR WATCHING · TEAM DOOM', 'Thanks', { boxColor: C.white });
  };
})();
