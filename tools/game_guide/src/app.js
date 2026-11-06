/* Castle Doom Campaign: game logic for the Stage 2 study guide. */
(function () {
  'use strict';
  const G = window.GUIDE;
  const A = window.ASSETS;
  const S3 = window.DoomScene;
  const GL = !!(S3 && S3.supported());
  if (!GL) document.documentElement.classList.add('no-gl');

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pad2 = (n) => String(n).padStart(2, '0');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CH = G.chapters;
  const byN = Object.fromEntries(CH.map((c) => [c.n, c]));
  const UNIT = {
    hardware: { name: 'Hardware Foundry', unit: 'Unit A · Hardware' },
    networks: { name: 'Network Citadel', unit: 'Unit B · Networks' },
    ai: { name: 'AI Sanctum', unit: 'Unit C · Behaviorist AI' },
  };
  const TOPIC_UNIT = { Hardware: 'hardware', Networks: 'networks', 'AI Behaviour': 'ai' };
  const DIFF = [1, 1, 2, 2, 2, 3, 2, 3, 3, 3, 3, 3, 4, 4, 4, 5];
  const act = (n) => (n <= 6 ? 1 : 2);

  /* ---------- XP economy ---------- */
  const XP = { section: 10, decrypt: 10, op: 40, term: 5, q: 30, qHint: 15, clear: 100, star: 25, sim: 75, bank: 10, run: 50 };
  const termsFor = (n) => G.glossary.filter((t) => t.chapter === n);
  function chapterMaxXP(c) {
    return c.sections.length * XP.section + XP.decrypt + XP.op + termsFor(c.n).length * XP.term + c.questions.length * XP.q + XP.clear + 3 * XP.star;
  }
  const MAX_XP = CH.reduce((s, c) => s + chapterMaxXP(c), 0) + 3 * XP.sim + G.bank.length * XP.bank + XP.run;
  const RANKS = [
    ['Serf of Latveria', 0], ['Castle Page', 0.03], ['Foundry Apprentice', 0.09], ['Circuit Adept', 0.18],
    ['Network Warden', 0.3], ['Arcane Technomancer', 0.45], ['Magister of Latveria', 0.62], ['Lord Engineer', 0.8], ['Sovereign of Latveria', 0.94],
  ].map(([name, f], i) => ({ name, at: Math.round((f * MAX_XP) / 10) * 10, lvl: i + 1 }));
  const rankOf = (xp) => RANKS.filter((r) => xp >= r.at).pop();

  /* ---------- Achievements ---------- */
  const ACH = [
    ['first_blood', '⚔', 'First Blood', 'Answer your first boss question correctly.'],
    ['first_clear', '🏰', 'Gate Breaker', 'Conquer your first mission.'],
    ['flawless', '✦', 'Flawless Victory', 'Conquer a mission with three stars.'],
    ['streak5', '⚡', 'Unbroken Will', 'Five correct answers in a row.'],
    ['act1', '📜', 'Beginner Course Complete', 'Conquer missions 1 to 6.'],
    ['foundry', '⚙', 'Master of the Foundry', 'Conquer every Hardware mission.'],
    ['citadel', '📡', 'Warden of the Citadel', 'Conquer every Networks mission.'],
    ['sanctum', '🜂', 'Sage of the Sanctum', 'Conquer every AI mission.'],
    ['sovereign', '👑', 'Sovereign', 'Conquer all 16 missions.'],
    ['scholar', '📖', 'Scholar of Latveria', 'Read every intel file in the campaign.'],
    ['codebreaker', '🔓', 'Codebreaker', 'Decrypt five intercepted transmissions.'],
    ['codex50', '📚', 'Archivist', 'Unlock 50 codex entries.'],
    ['codexall', '🗝', 'Keeper of the Codex', 'Unlock every codex entry.'],
    ['rig_cpu', '🖥', 'Clockwork Master', 'Run a CPU program to HALT in the Armoury.'],
    ['rig_net', '📦', 'Packet Courier', 'Deliver a packet to Castle Doom Central.'],
    ['rig_q', '🤖', 'Trainer of Machines', 'Train the vacuum agent for 100 episodes.'],
    ['trial_done', '🛡', 'Trial Survivor', 'Finish a Final Trial run.'],
    ['trial_ace', '🏆', 'Grade S', 'Finish a full Final Trial run with grade S.'],
    ['perfect5', '✷', 'Perfect Riposte', 'Land five perfect parries in a single fight.'],
    ['untouched', '🜁', 'Untouched', 'Win a fight without taking a single hit.'],
    ['prof_down', '🎓', 'Top of the Class', 'Defeat The Professor in the Final Trial.'],
  ].map(([id, ico, name, desc]) => ({ id, ico, name, desc }));

  /* ---------- Saved progress ---------- */
  const KEY = 'doom-campaign-v1';
  const fresh = () => ({ xp: 0, seen: {}, ops: {}, decrypt: {}, solved: {}, missions: {}, codex: {}, ach: {}, sims: {}, bank: {}, typed: {}, free: false, streak: 0, best: 0, trialBest: null, marks: 0, up: {}, vol: 0.6, muted: false, profDown: false });
  let P;
  // Older saves simply pick up the new fields' defaults.
  try { P = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { P = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { /* private mode */ } };

  /* ---------- Music: crossfaded tracks, started on the first click ---------- */
  const Music = (() => {
    const SRC = window.MUSIC || {};
    const els = {}, fades = new Map();
    let cur = null, curName = null, want = null, unlocked = false, ducked = false;
    const level = () => (P.muted ? 0 : P.vol) * (ducked ? 0.35 : 1);
    const get = (name) => {
      if (!els[name] && SRC[name]) { const a = new Audio(SRC[name]); a.loop = name !== 'victory'; a.volume = 0; els[name] = a; }
      return els[name];
    };
    function fade(a, to, ms, done) {
      clearInterval(fades.get(a));
      const from = a.volume, t0 = performance.now();
      const id = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        a.volume = Math.max(0, Math.min(1, from + (to - from) * k));
        if (k >= 1) { clearInterval(id); fades.delete(a); if (done) done(); }
      }, 40);
      fades.set(a, id);
    }
    function play(name) {
      want = name;
      if (!unlocked || name === curName) return;
      const old = cur;
      if (old) fade(old, 0, 1200, () => old.pause());
      cur = get(name); curName = name;
      if (!cur) return;
      if (cur.paused) { cur.currentTime = 0; cur.play().catch(() => {}); }
      fade(cur, level(), 1500);
    }
    function sting(name) {
      const a = get(name);
      if (!a || !unlocked) return;
      a.currentTime = 0; a.volume = P.muted ? 0 : Math.min(1, P.vol * 1.1);
      a.play().catch(() => {});
    }
    function refresh() { if (cur) fade(cur, level(), 300); }
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      const w = want; want = null; curName = null;
      if (w) play(w);
    };
    addEventListener('pointerdown', unlock, { once: true });
    addEventListener('keydown', unlock, { once: true });
    return { play, sting, refresh, duck(on) { ducked = on; refresh(); }, get current() { return curName || want; } };
  })();

  window.DoomMusic = Music; // lets you check which track is playing from the console

  /* ---------- Sound effects, synthesised so they need no files ---------- */
  const Sfx = (() => {
    let ctx = null;
    const ac = () => {
      if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    };
    const vol = () => (P.muted ? 0 : 0.35 + P.vol * 0.5);
    function tone(freq, dur, type = 'sine', gain = 0.2, slideTo = 0, delay = 0) {
      const c = ac(); if (!c || !vol()) return;
      const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
      g.gain.setValueAtTime(gain * vol(), t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.02);
    }
    function noise(dur, gain = 0.3, freq = 1200, type = 'highpass', delay = 0) {
      const c = ac(); if (!c || !vol()) return;
      const t = c.currentTime + delay, len = Math.floor(c.sampleRate * dur);
      const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = buf; f.type = type; f.frequency.value = freq; g.gain.value = gain * vol();
      s.connect(f).connect(g).connect(c.destination); s.start(t);
    }
    return {
      parry() { tone(1320, 0.35, 'triangle', 0.18); tone(1980, 0.25, 'triangle', 0.1); noise(0.08, 0.25, 3000); },
      perfect() { tone(1320, 0.5, 'triangle', 0.2); tone(2640, 0.6, 'sine', 0.12, 0, 0.05); tone(3520, 0.5, 'sine', 0.08, 0, 0.12); noise(0.1, 0.3, 4000); },
      strike() { tone(160, 0.25, 'sawtooth', 0.18, 60); noise(0.18, 0.35, 900, 'lowpass'); },
      hurt() { tone(110, 0.45, 'square', 0.16, 40); noise(0.3, 0.45, 600, 'lowpass'); },
      tick() { tone(880, 0.05, 'square', 0.05); },
      heal() { tone(440, 0.4, 'sine', 0.15, 880); tone(660, 0.5, 'sine', 0.1, 1320, 0.08); },
      whoosh() { noise(0.25, 0.25, 700, 'bandpass'); },
      rumble() { tone(55, 1.1, 'sawtooth', 0.12, 35); noise(1.0, 0.35, 160, 'lowpass'); },
      crack() { noise(0.12, 0.5, 2500); tone(240, 0.2, 'square', 0.08, 90); },
      shatter() { for (let i = 0; i < 6; i++) { noise(0.18, 0.35, 2000 + i * 600, 'highpass', i * 0.06); tone(1800 - i * 200, 0.2, 'triangle', 0.05, 0, i * 0.05); } },
      roar() { tone(90, 1.2, 'sawtooth', 0.18, 45); tone(135, 1.2, 'sawtooth', 0.1, 60); noise(1.0, 0.3, 300, 'lowpass'); },
    };
  })();

  /* ---------- Assets ---------- */
  function hydrate(root) {
    $$('[data-asset]', root).forEach((img) => {
      const k = img.dataset.asset === 'CREST' ? G.crest : img.dataset.asset;
      if (A[k]) img.src = A[k];
      img.removeAttribute('data-asset');
    });
    return root;
  }
  document.documentElement.style.setProperty('--bg-img', `url("${A[G.art.hall]}")`);
  document.documentElement.style.setProperty('--glass', `url("${A[G.art.glass]}")`);

  /* ---------- Feedback: XP pops, toasts, level-ups ---------- */
  function pop(text, el) {
    const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
    const p = document.createElement('div');
    p.className = 'xp-pop';
    p.textContent = text;
    p.style.left = Math.min(innerWidth - 120, r.left + r.width / 2 - 30) + 'px';
    p.style.top = Math.max(70, r.top - 10) + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }
  function toast(ico, small, title, sub) {
    const t = document.createElement('div');
    t.className = 'toast panel';
    t.innerHTML = `<div class="ico">${ico}</div><div><small>${esc(small)}</small><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div>`;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 450); }, 4200);
  }
  function gain(amount, el, label) {
    if (amount <= 0) return;
    const before = rankOf(P.xp);
    P.xp += amount;
    save();
    pop(`+${amount} XP${label ? ' · ' + label : ''}`, el);
    const after = rankOf(P.xp);
    if (after.lvl > before.lvl) levelUp(after);
    hud();
  }
  function levelUp(r) {
    const o = document.createElement('div');
    o.className = 'overlay';
    o.innerHTML = `<div class="levelup panel rivets"><div class="rank-hex">${r.lvl}</div><div class="eyebrow">Rank ascended</div><h2 class="gold-text">${esc(r.name)}</h2><p>Doom acknowledges your progress. Do not let it go to your head.</p><button class="btn primary" type="button">Onward</button></div>`;
    o.addEventListener('click', (e) => { if (e.target === o || e.target.closest('button')) o.remove(); });
    document.body.appendChild(o);
    $('button', o).focus();
  }
  function award(id) {
    if (P.ach[id]) return;
    const a = ACH.find((x) => x.id === id);
    P.ach[id] = Date.now();
    save();
    toast(a.ico, 'Trophy unlocked', a.name, a.desc);
    hud();
  }

  /* ---------- Derived progress ---------- */
  const cleared = (n) => !!(P.missions[n] && P.missions[n].cleared);
  const isOpen = (n) => P.free || n === 1 || cleared(n - 1) || cleared(n);
  const state = (n) => (cleared(n) ? 'cleared' : isOpen(n) ? 'open' : 'locked');
  const stars = () => CH.reduce((s, c) => s + ((P.missions[c.n] || {}).stars || 0), 0);
  const codexCount = () => G.glossary.filter((t) => P.codex[t.term]).length;
  const nextMission = () => (CH.find((c) => !cleared(c.n) && isOpen(c.n)) || CH.find((c) => !cleared(c.n)) || CH[0]).n;

  function checkMeta() {
    const all = (u) => CH.filter((c) => c.unit === u).every((c) => cleared(c.n));
    if (CH.filter((c) => c.n <= 6).every((c) => cleared(c.n))) award('act1');
    if (all('hardware')) award('foundry');
    if (all('networks')) award('citadel');
    if (all('ai')) award('sanctum');
    if (CH.every((c) => cleared(c.n))) award('sovereign');
    if (CH.every((c) => c.sections.every((_, i) => P.seen[c.n + ':' + i]))) award('scholar');
    if (Object.keys(P.decrypt).length >= 5) award('codebreaker');
    const cc = codexCount();
    if (cc >= 50) award('codex50');
    if (cc >= G.glossary.length) award('codexall');
  }

  function hud() {
    const r = rankOf(P.xp);
    const next = RANKS[r.lvl] || null;
    $('#hud-level').textContent = r.lvl;
    $('#hud-rank').textContent = r.name;
    const pct = next ? ((P.xp - r.at) / (next.at - r.at)) * 100 : 100;
    $('#hud-xpbar').style.width = Math.max(2, Math.min(100, pct)) + '%';
    $('#hud-xp').textContent = next ? `${P.xp} / ${next.at} XP` : `${P.xp} XP · max rank`;
    $('#hud-stars').textContent = `${stars()}/${CH.length * 3}`;
    $('#hud-codex').textContent = `${codexCount()}/${G.glossary.length}`;
    $('#hud-trophies').textContent = `${Object.keys(P.ach).length}/${ACH.length}`;
    $('#hud-marks').textContent = P.marks;
    const sb = $('#snd-btn');
    sb.textContent = P.muted ? '🔇' : '🔊';
    sb.setAttribute('aria-pressed', P.muted);
    $('#vol').value = P.vol;
  }
  $('#snd-btn').addEventListener('click', () => { P.muted = !P.muted; save(); hud(); Music.refresh(); });
  $('#vol').addEventListener('input', (e) => { P.vol = Number(e.target.value); if (P.vol > 0) P.muted = false; save(); hud(); Music.refresh(); });
  $('#vol').addEventListener('click', (e) => e.stopPropagation());

  /* ---------- Router ---------- */
  let scenes = [];
  const killScenes = () => { scenes.forEach((s) => s && s.dispose && s.dispose()); scenes = []; };
  let mapScene = null;

  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function route() {
    const h = location.hash || '#/title';
    const [, name, arg] = h.split('/');
    killScenes();
    mapScene = null;
    $$('.screen').forEach((s) => s.classList.remove('active'));
    document.body.classList.toggle('on-title', name === 'title' || !name);
    $$('.hud nav button').forEach((b) => b.classList.toggle('active', b.dataset.nav === (name === 'm' ? 'map' : name)));
    $('#menu-pop').classList.remove('open');
    const show = (id) => { const s = $('#scr-' + id); s.classList.add('active'); return s; };
    window.scrollTo(0, 0);
    Music.duck(false);
    Music.play(name === 'm' ? 'study' : 'hall');
    switch (name) {
      case 'map': renderMap(show('map'), Number(arg) || null); break;
      case 'm': {
        const n = Number(arg);
        if (!byN[n]) return go('#/map');
        renderMission(show('mission'), byN[n]);
        break;
      }
      case 'armoury': renderArmoury(show('armoury')); break;
      case 'codex': renderCodex(show('codex')); break;
      case 'trial': renderTrial(show('trial')); break;
      case 'trophies': renderTrophies(show('trophies')); break;
      default: renderTitle(show('title'));
    }
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go); }
  });
  $('#menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const m = $('#menu-pop');
    m.classList.toggle('open');
    $('#menu-btn').setAttribute('aria-expanded', m.classList.contains('open'));
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.hud-menu')) $('#menu-pop').classList.remove('open'); });
  $('#reset-btn').addEventListener('click', () => {
    if (!confirm('Erase all campaign progress, XP and trophies?')) return;
    P = fresh(); save(); hud(); go('#/title');
  });

  /* ================= TITLE ================= */
  function renderTitle(scr) {
    const started = P.xp > 0;
    const n = nextMission();
    $('#title-actions').innerHTML = started
      ? `<button class="btn primary" data-go="#/m/${n}">▶ Continue · Mission ${pad2(n)}</button><button class="btn" data-go="#/map">Campaign map</button><button class="btn green" data-go="#/trial">Final Trial</button>`
      : `<button class="btn primary" data-go="#/map">▶ Begin campaign</button><button class="btn" data-go="#/m/1">Jump to Mission 01</button><button class="btn green" data-go="#/trial">Final Trial</button>`;
    $('#title-stats').innerHTML = [
      [CH.length, 'Missions'], [CH.reduce((s, c) => s + c.questions.length, 0), 'Boss trials'], [G.glossary.length, 'Codex entries'], [3, 'Training rigs'], [G.bank.length, 'Final Trial Qs'],
    ].map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('');
    hydrate(scr);
    if (GL) scenes.push(S3.createHero($('#hero-host')));
  }

  /* ================= MAP ================= */
  let selected = null;
  function missionStates() {
    const o = {};
    CH.forEach((c) => (o[c.n] = { state: state(c.n), stars: (P.missions[c.n] || {}).stars || 0 }));
    return o;
  }
  function drawMissionList() {
    const done = CH.filter((c) => cleared(c.n)).length;
    $('#camp-bar').style.width = (done / CH.length) * 100 + '%';
    $('#camp-note').textContent = `${done} of ${CH.length} missions conquered · ${stars()} ★`;
    const row = (c) => {
      const s = state(c.n), st = (P.missions[c.n] || {}).stars || 0;
      return `<button type="button" class="m-row is-${s}" data-unit="${c.unit}" data-n="${c.n}"><span class="num">${pad2(c.n)}</span><span class="t"><small>${UNIT[c.unit].name}</small>${esc(c.title)}</span><span class="s">${s === 'cleared' ? '★'.repeat(st) : s === 'locked' ? '🔒' : '◆'}</span></button>`;
    };
    $('#mission-list').innerHTML =
      `<div class="act-head">Act I · The Beginner Course</div>${CH.filter((c) => act(c.n) === 1).map(row).join('')}` +
      `<div class="act-head">Act II · The Extended Campaign</div>${CH.filter((c) => act(c.n) === 2).map(row).join('')}`;
    $$('#mission-list .m-row').forEach((b) => b.addEventListener('click', () => selectMission(Number(b.dataset.n))));
    if (selected) $$('.m-row').forEach((r) => r.classList.toggle('sel', Number(r.dataset.n) === selected));
  }
  function renderMap(scr, focus) {
    drawMissionList();
    const fr = $('#free-roam');
    fr.setAttribute('aria-pressed', P.free);
    // Free roam only changes which missions are open, so update the existing map instead of building a second one.
    fr.onclick = () => {
      P.free = !P.free; save();
      fr.setAttribute('aria-pressed', P.free);
      drawMissionList();
      if (mapScene) mapScene.setState(missionStates());
      if (selected) selectMission(selected);
    };
    $('#overview-btn').onclick = () => { selected = null; $('#map-card').classList.remove('show'); mapScene && mapScene.overview(); $$('.m-row').forEach((r) => r.classList.remove('sel')); };
    if (GL) {
      if (mapScene) { mapScene.dispose(); scenes = scenes.filter((x) => x !== mapScene); }
      mapScene = S3.createMap($('#map-host'), { missions: CH.map((c) => ({ n: c.n, unit: c.unit, title: c.title })), onSelect: selectMission });
      mapScene.setState(missionStates());
      scenes.push(mapScene);
    }
    if (focus) selectMission(focus);
    else { selected = null; $('#map-card').classList.remove('show'); }
  }
  function selectMission(n) {
    selected = n;
    const c = byN[n], s = state(n), m = P.missions[n] || {};
    $$('.m-row').forEach((r) => r.classList.toggle('sel', Number(r.dataset.n) === n));
    const card = $('#map-card');
    card.dataset.unit = c.unit;
    card.innerHTML = `
      <div class="unit-chip">${UNIT[c.unit].unit}</div>
      <div class="eyebrow">Mission ${pad2(n)} · Act ${act(n) === 1 ? 'I' : 'II'}</div>
      <h3 class="gold-text">${esc(c.title)}</h3>
      <div class="reward-row"><span>Threat <span class="pips">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= DIFF[n - 1] ? 'on' : ''}"></i>`).join('')}</span></span><span>Reward <b>${chapterMaxXP(c)} XP</b></span><span><b>${s === 'cleared' ? '★'.repeat(m.stars) + '☆'.repeat(3 - m.stars) : '☆☆☆'}</b></span></div>
      <ul>${c.objectives.slice(0, 3).map((o) => `<li>${o}</li>`).join('')}</ul>
      ${s === 'locked' ? `<div class="lock-note">🔒 Conquer Mission ${pad2(n - 1)} to unlock, or switch on Free roam.</div>` : ''}
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn primary" type="button" ${s === 'locked' ? 'disabled' : ''} data-go="#/m/${n}">${s === 'cleared' ? '↻ Replay mission' : '▶ Deploy'}</button>
        <button class="btn ghost sm" type="button" id="card-close">Close</button>
      </div>`;
    card.classList.add('show');
    $('#card-close').onclick = () => { card.classList.remove('show'); selected = null; mapScene && mapScene.overview(); };
    mapScene && mapScene.focus(n);
  }

  /* ================= MISSION ================= */
  function renderMission(scr, c) {
    const n = c.n, unit = UNIT[c.unit];
    if (!isOpen(n)) { toast('🔒', 'Mission locked', `Mission ${pad2(n)} is sealed`, `Conquer Mission ${pad2(n - 1)} first, or enable Free roam on the map.`); return go('#/map/' + n); }
    const m = P.missions[n] || {};
    const prev = byN[n - 1], next = byN[n + 1];
    scr.dataset.unit = c.unit;
    scr.innerHTML = `
      <div class="m-hero" data-unit="${c.unit}">
        <div class="art" style="--art:url('${A[c.banner]}')"></div>
        <div class="wrap">
          <div class="m-hero-top"><span class="m-num">${pad2(n)}</span><div><div class="unit-chip">${unit.unit}</div><div class="eyebrow" style="margin-top:10px">${unit.name} · Act ${act(n) === 1 ? 'I' : 'II'}</div></div></div>
          <h1 class="m-title gold-text">${esc(c.title)}</h1>
          <div class="m-meta"><span>Threat <span class="pips">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= DIFF[n - 1] ? 'on' : ''}"></i>`).join('')}</span></span><span>Bounty <b>${chapterMaxXP(c)} XP</b></span><span>Record <b class="stars-big" id="m-stars">${m.cleared ? '★'.repeat(m.stars) + '☆'.repeat(3 - m.stars) : '☆☆☆'}</b></span></div>
        </div>
      </div>
      <div class="wrap m-body">
        <aside class="m-rail panel">
          <h4 class="eyebrow">Mission log</h4>
          <ol id="rail"></ol>
          <div class="rail-xp"><div class="xpbar"><i id="rail-bar"></i></div><span id="rail-note"></span></div>
        </aside>
        <div class="m-main" id="m-main"></div>
      </div>`;
    const main = $('#m-main', scr);

    // Briefing.
    main.insertAdjacentHTML('beforeend', `
      <section id="b-brief" class="panel briefing rivets">
        <div class="avatar"><img src="${A[c.avatar]}" alt="Doctor Doom"></div>
        <div><div class="who">INCOMING TRANSMISSION · DOOM'S DIRECTIVE</div><div class="say" id="say">${c.directive}</div>
        <button class="skip-type" type="button" id="skip" hidden>Skip ▸▸</button></div>
      </section>
      <section id="b-obj" class="panel objectives">
        <div class="block-head"><span class="eyebrow">Quest</span><h2>Mission objectives</h2></div>
        <ul>${c.objectives.map((o, i) => `<li data-i="${i}"><i>✓</i><span>${o}</span></li>`).join('')}</ul>
      </section>`);

    // Intel files.
    main.insertAdjacentHTML('beforeend', `<div class="block-head"><span class="eyebrow">Intel files</span><h2>Study the dossiers</h2></div>`);
    c.sections.forEach((s, i) => {
      const m2 = s.title.match(/^(\d+\.\d+)\s+(.*)$/);
      main.insertAdjacentHTML('beforeend', `
        <article class="panel intel ${P.seen[n + ':' + i] ? 'done' : ''}" id="b-s${i}" data-i="${i}">
          <span class="tag">${P.seen[n + ':' + i] ? '✓ STUDIED' : 'INTEL ' + pad2(i + 1)}</span>
          <h3>${m2 ? `<span class="sec">${m2[1]}</span>${m2[2]}` : s.title}</h3>
          ${s.html}
        </article>`);
    });

    // Intercepted transmission.
    const dec = !!P.decrypt[n];
    main.insertAdjacentHTML('beforeend', `
      <section id="b-tx" class="panel transmission ${dec ? '' : 'locked'}">
        <div class="eyebrow">Intercepted transmission · Meanwhile in Latveria</div>
        <div class="body">${c.meanwhile}</div>
        <button class="btn sm decrypt" type="button">🔓 Decrypt transmission (+${XP.decrypt} XP)</button>
      </section>`);

    // Field operation.
    const parts = c.activity.parts;
    main.insertAdjacentHTML('beforeend', `
      <section id="b-op" class="panel fieldop rivets">
        <div class="block-head"><span class="eyebrow">Field operation</span><h2>Hands-on lab</h2></div>
        <h3>${esc(c.activity.title)}</h3>
        <div class="op-steps">${parts.map((p, i) => {
          const lbl = p.label.replace(/^\d+\.\s*/, '');
          return `<div class="op-step ${i === parts.length - 1 ? 'verdict' : ''}"><div class="k">${i === parts.length - 1 ? '✓' : pad2(i + 1)}</div><div><div class="lbl">${esc(lbl)}</div><div class="txt">${p.html}</div></div></div>`;
        }).join('')}</div>
        <div class="op-done" id="op-done"></div>
      </section>`);

    // Codex unlocks.
    main.insertAdjacentHTML('beforeend', `
      <section id="b-codex">
        <div class="block-head"><span class="eyebrow">Codex unlocks</span><h2>Terms of power</h2></div>
        <div class="codex-grid">${c.glossary.map((g) => `<div class="codex-card" data-unit="${c.unit}"><span class="src">CH ${pad2(n)}</span><h5>${esc(g.term)}</h5><p>${g.def}</p></div>`).join('')}</div>
      </section>`);

    // The guardian's seal: reaching it after studying breaks the page open into a fight.
    main.insertAdjacentHTML('beforeend', `
      <section id="b-boss">
        <div class="block-head"><span class="eyebrow" style="color:var(--danger)">The guardian</span><h2>Break the seal</h2></div>
        <div class="panel seal rivets" id="boss" data-unit="${c.unit}"></div>
      </section>
      <nav class="m-next">
        ${prev ? `<button class="btn ghost" data-go="#/m/${prev.n}">◂ Mission ${pad2(prev.n)}</button>` : '<span></span>'}
        <button class="btn" data-go="#/map/${n}">Campaign map</button>
        ${next ? `<button class="btn ghost" data-go="#/m/${next.n}">Mission ${pad2(next.n)} ▸</button>` : '<span></span>'}
      </nav>`);
    hydrate(scr);

    // Mission log rail.
    const railItems = [['b-brief', 'Briefing'], ['b-obj', 'Objectives'], ...c.sections.map((s, i) => ['b-s' + i, s.title.replace(/<[^>]+>/g, '')]), ['b-tx', 'Transmission'], ['b-op', 'Field operation'], ['b-codex', 'Codex unlocks'], ['b-boss', 'The guardian']];
    $('#rail', scr).innerHTML = railItems.map(([id, t]) => `<li><a href="#${id}" data-to="${id}" class="${id === 'b-boss' ? 'boss' : ''}"><i></i><span>${esc(t)}</span></a></li>`).join('');
    $$('#rail a', scr).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); document.getElementById(a.dataset.to).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }));

    const done = {};
    function refresh() {
      done['b-brief'] = !!P.typed[n];
      c.sections.forEach((_, i) => (done['b-s' + i] = !!P.seen[n + ':' + i]));
      done['b-obj'] = c.sections.every((_, i) => P.seen[n + ':' + i]);
      done['b-tx'] = !!P.decrypt[n];
      done['b-op'] = !!P.ops[n];
      done['b-codex'] = termsFor(n).every((t) => P.codex[t.term]) && !!P.seen[n + ':codex'];
      done['b-boss'] = cleared(n);
      $$('#rail a', scr).forEach((a) => a.classList.toggle('done', !!done[a.dataset.to]));
      // Objectives tick off in step with how much intel has been studied.
      const read = c.sections.filter((_, i) => P.seen[n + ':' + i]).length / Math.max(1, c.sections.length);
      $$('#b-obj li', scr).forEach((li, i, all) => li.classList.toggle('done', read >= (i + 1) / all.length - 0.001));
      let got = 0;
      c.sections.forEach((_, i) => P.seen[n + ':' + i] && (got += XP.section));
      if (P.decrypt[n]) got += XP.decrypt;
      if (P.ops[n]) got += XP.op;
      termsFor(n).forEach((t) => P.codex[t.term] && (got += XP.term));
      c.questions.forEach((_, i) => { const s = P.solved[n + ':' + i]; if (s) got += s === 'hint' ? XP.qHint : XP.q; });
      if (cleared(n)) got += XP.clear + (P.missions[n].stars || 0) * XP.star;
      const max = chapterMaxXP(c);
      $('#rail-bar', scr).style.width = (got / max) * 100 + '%';
      $('#rail-note', scr).textContent = `${got} / ${max} mission XP`;
    }

    // Typewriter briefing on first visit.
    const say = $('#say', scr);
    if (!P.typed[n] && !reduced) {
      const nodes = [];
      const walker = document.createTreeWalker(say, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) nodes.push([walker.currentNode, walker.currentNode.textContent]);
      nodes.forEach(([t]) => (t.textContent = ''));
      say.classList.add('caret');
      const skip = $('#skip', scr);
      skip.hidden = false;
      let ni = 0, ci = 0, timer;
      const finish = () => {
        clearInterval(timer);
        nodes.forEach(([t, s]) => (t.textContent = s));
        say.classList.remove('caret');
        skip.hidden = true;
        if (!P.typed[n]) { P.typed[n] = 1; save(); refresh(); }
      };
      timer = setInterval(() => {
        for (let k = 0; k < 3; k++) {
          if (ni >= nodes.length) return finish();
          const [t, s] = nodes[ni];
          t.textContent = s.slice(0, ++ci);
          if (ci >= s.length) { ni++; ci = 0; }
        }
      }, 16);
      skip.onclick = finish;
      $('#b-brief', scr).addEventListener('click', finish, { once: true });
      scenes.push({ dispose: () => clearInterval(timer) });
    } else if (!P.typed[n]) { P.typed[n] = 1; save(); }

    // Mark intel as studied once it has been scrolled through.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.id === 'b-codex') {
          io.unobserve(el);
          if (!P.seen[n + ':codex']) {
            P.seen[n + ':codex'] = 1;
            const newly = termsFor(n).filter((t) => !P.codex[t.term]);
            newly.forEach((t) => (P.codex[t.term] = 1));
            $$('.codex-card', el).forEach((cd, i) => { cd.classList.add('fresh'); cd.style.animationDelay = i * 0.08 + 's'; });
            save();
            if (newly.length) { gain(newly.length * XP.term, el, `${newly.length} codex entries`); }
            checkMeta(); refresh();
          }
          return;
        }
        const i = Number(el.dataset.i);
        const k = n + ':' + i;
        io.unobserve(el);
        if (P.seen[k]) return;
        P.seen[k] = 1;
        el.classList.add('done');
        $('.tag', el).textContent = '✓ STUDIED';
        gain(XP.section, $('.tag', el), 'intel');
        checkMeta(); refresh();
      });
    }, { rootMargin: '0px 0px -35% 0px', threshold: 0 });
    // An intel file counts as studied when its end scrolls into the reading zone.
    $$('.intel', scr).forEach((el) => {
      const end = document.createElement('div');
      end.dataset.i = el.dataset.i;
      el.appendChild(end);
      const proxy = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        proxy.disconnect();
        io.observe(el);
      }, { rootMargin: '0px 0px -10% 0px' });
      proxy.observe(end);
      scenes.push({ dispose: () => proxy.disconnect() });
    });
    io.observe($('#b-codex', scr));
    scenes.push({ dispose: () => io.disconnect() });

    // Transmission.
    $('#b-tx .decrypt', scr).onclick = (e) => {
      $('#b-tx', scr).classList.remove('locked');
      if (!P.decrypt[n]) { P.decrypt[n] = 1; save(); gain(XP.decrypt, e.target, 'decrypted'); checkMeta(); refresh(); }
    };

    // Field operation completion.
    const opBox = $('#op-done', scr);
    const drawOp = () => {
      opBox.innerHTML = P.ops[n]
        ? `<span class="ok">✓ OPERATION LOGGED · DOOM APPROVES</span>`
        : `<button class="btn green" type="button">I completed this operation (+${XP.op} XP)</button><span style="color:var(--dim);font-size:13px">Work through every step, then log it.</span>`;
      const b = $('button', opBox);
      if (b) b.onclick = () => { P.ops[n] = 1; save(); gain(XP.op, b, 'field op'); drawOp(); refresh(); };
    };
    drawOp();

    guardianSeal(c, $('#boss', scr), refresh);
    refresh();
  }

  /* ================= COMBAT ================= */
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'];
  const GUARDIAN = { hardware: 'Forge Golem', networks: 'Relay Sentinel', ai: 'Mind Eye' };
  const GLYPH = { hardware: '⚙', networks: '📡', ai: '👁', professor: '🎓' };
  const shuffle = (list) => {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  /* ---------- The Forge: small upgrades bought with Marks ---------- */
  const UPGRADES = [
    { id: 'vit', ico: '❤', name: 'Vitality', max: 3, cost: 30, desc: '+1 maximum HP in every fight.' },
    { id: 'ref', ico: '⏳', name: 'Reflexes', max: 3, cost: 25, desc: '+3 seconds on every attack timer.' },
    { id: 'elx', ico: '⚗', name: 'Elixir', max: 2, cost: 40, desc: 'One more healing elixir per fight.' },
    { id: 'rip', ico: '⚔', name: 'Riposte', max: 2, cost: 35, desc: 'A wider perfect-parry window and harder critical counters.' },
    { id: 'ins', ico: '☉', name: 'Insight', max: 2, cost: 30, desc: 'Insight costs 1 Focus. At level II it also strikes out a wrong answer.' },
    { id: 'ward', ico: '🛡', name: "Doom's Ward", max: 1, cost: 80, desc: 'Blocks the first hit you take in every fight.' },
  ];
  const upLvl = (id) => P.up[id] || 0;
  const upCost = (u) => u.cost * (upLvl(u.id) + 1);
  // What the upgrades add up to, read at the start of each fight.
  function kit() {
    const rip = upLvl('rip');
    return {
      hp: 3 + upLvl('vit'), elixirs: 1 + upLvl('elx'), timeBonus: 3 * upLvl('ref'),
      perfect: [0.33, 0.39, 0.45][rip], crit: [1.5, 1.75, 2][rip],
      insightCost: upLvl('ins') ? 1 : 2, strike: upLvl('ins') >= 2, ward: upLvl('ward') > 0,
    };
  }

  /* ---------- Fight questions ---------- */
  // A chapter guardian asks the chapter's review questions, interleaved with "name the term" strikes.
  function chapterFightQs(c) {
    const review = c.questions.map((q, i) => ({ kind: 'mc', prompt: q.prompt, options: q.options.map(esc), right: 'ABCD'.indexOf(q.answer), hint: q.hint, explain: q.explanation, key: c.n + ':' + i }));
    const terms = shuffle(c.glossary).slice(0, 3).map((g) => {
      const options = shuffle([g.term, ...shuffle(c.glossary.filter((t) => t.term !== g.term)).slice(0, 3).map((t) => t.term)]);
      return { kind: 'term', prompt: `<span class="q-k">Which term is this?</span> ${g.def}`, options: options.map(esc), right: options.indexOf(g.term), hint: `It starts with “${esc(g.term.charAt(0))}”.`, explain: `<b>${esc(g.term)}</b>: ${g.def}` };
    });
    const out = [];
    for (let i = 0; i < Math.max(review.length, terms.length); i++) { if (terms[i]) out.push(terms[i]); if (review[i]) out.push(review[i]); }
    return out;
  }
  function bankFightQ(q) {
    const kind = q.id.slice(0, 2);
    const base = { prompt: esc(q.prompt), explain: esc(q.explanation || ''), hint: null, bank: q.id };
    if (kind === 'TF') return { ...base, kind: 'tf', options: ['True', 'False'], right: /^t/i.test(q.answer) ? 0 : 1 };
    if (kind === 'MC') return { ...base, kind: 'mc', options: q.options.map(esc), right: 'ABCD'.indexOf(q.answer) };
    return { ...base, kind: 'oe', tasks: q.tasks || [], sample: q.sample || '', points: q.key_points || [] };
  }

  /* ---------- The page breaks: quake, cracks, then the page falls away in shards ---------- */
  function breakPage(scr, done) {
    const restore = () => { scr.style.visibility = ''; scr.classList.remove('quake'); };
    if (reduced) { scr.style.visibility = 'hidden'; done(restore); return; }
    Music.duck(true);
    Sfx.rumble();
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H * 0.55;
    let paths = '';
    for (let k = 0; k < 12; k++) {
      let a = (k / 12) * Math.PI * 2 + Math.random() * 0.4, x = cx, y = cy, d = `M${cx} ${cy}`;
      const steps = 6 + Math.floor(Math.random() * 4);
      for (let s = 0; s < steps; s++) {
        a += (Math.random() - 0.5) * 0.7;
        const len = (Math.max(W, H) / steps) * (0.6 + Math.random() * 0.6);
        x += Math.cos(a) * len; y += Math.sin(a) * len;
        d += ` L${x.toFixed(0)} ${y.toFixed(0)}`;
      }
      paths += `<path d="${d}" pathLength="1" style="animation-delay:${(0.55 + Math.random() * 0.4).toFixed(2)}s"/>`;
    }
    const fx = document.createElement('div');
    fx.className = 'breakfx';
    fx.innerHTML = `<div class="vign"></div><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${paths}</svg>`;
    document.body.appendChild(fx);
    scr.classList.add('quake');
    setTimeout(() => Sfx.crack(), 650);
    setTimeout(() => Sfx.crack(), 950);
    setTimeout(() => {
      // Copies of the visible page, each clipped to one jagged quad, fall away to reveal the arena.
      const r = scr.getBoundingClientRect();
      const snap = scr.cloneNode(true);
      snap.removeAttribute('id');
      snap.classList.remove('active');
      $$('canvas', snap).forEach((n) => n.remove());
      $$('[id]', snap).forEach((n) => n.removeAttribute('id'));
      const cols = 4, rows = 3;
      const P2 = [];
      for (let j = 0; j <= rows; j++) {
        P2[j] = [];
        for (let i = 0; i <= cols; i++) {
          const edge = i === 0 || j === 0 || i === cols || j === rows;
          P2[j][i] = [(i / cols) * W + (edge ? 0 : (Math.random() - 0.5) * W * 0.12), (j / rows) * H + (edge ? 0 : (Math.random() - 0.5) * H * 0.14)];
        }
      }
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const q = [P2[j][i], P2[j][i + 1], P2[j + 1][i + 1], P2[j + 1][i]];
          const sh = document.createElement('div');
          sh.className = 'shard';
          sh.style.clipPath = `polygon(${q.map(([x, y]) => `${x.toFixed(0)}px ${y.toFixed(0)}px`).join(',')})`;
          const mx = (q[0][0] + q[2][0]) / 2 - cx, my = (q[0][1] + q[2][1]) / 2 - cy;
          sh.style.setProperty('--dx', (mx * 0.5 + (Math.random() - 0.5) * 120).toFixed(0) + 'px');
          sh.style.setProperty('--dy', (H * 0.9 + Math.random() * H * 0.4).toFixed(0) + 'px');
          sh.style.setProperty('--rot', ((Math.random() - 0.5) * 70).toFixed(0) + 'deg');
          sh.style.setProperty('--delay', (Math.hypot(mx, my) / Math.max(W, H) * 0.35).toFixed(2) + 's');
          sh.style.transformOrigin = `${(mx + cx).toFixed(0)}px ${(my + cy).toFixed(0)}px`;
          const inner = snap.cloneNode(true);
          inner.classList.add('shard-in');
          inner.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;display:block;visibility:visible`;
          sh.appendChild(inner);
          fx.appendChild(sh);
        }
      }
      scr.style.visibility = 'hidden';
      done(restore);
      Sfx.shatter();
      requestAnimationFrame(() => requestAnimationFrame(() => fx.classList.add('fall')));
      setTimeout(() => fx.remove(), 1900);
    }, 1250);
  }

  /* ---------- The fight engine: timed parries, Focus actions, phases ---------- */
  function fight(o) {
    const K = kit();
    const phases = (o.phases || [{ qs: o.queue }]).filter((p) => p.qs.length);
    const seg = 1 / phases.length;
    const R = { hits: 0, insights: 0, perfects: 0, parries: 0, firstTry: 0, total: phases.reduce((s, p) => s + p.qs.length, 0), maxHp: K.hp + (o.bonusHp || 0) };
    let hp = R.maxHp, focus = 1, elixirs = K.elixirs, ward = K.ward, combo = 0;
    let pi = -1, floor = 1, dmg = 0, enemy = 1, queue = [], cur = null;
    let running = false, raf = 0, elapsed = 0, limit = 1, last = 0, frozenUntil = 0, lastTick = -1, over = false, closed = false;
    const timers = [];
    const later = (f, ms) => timers.push(setTimeout(f, ms));
    const el = document.createElement('div');
    el.className = 'arena';
    el.dataset.variant = o.variant;
    el.innerHTML = `
      <div class="ar-stage"><div class="gl-host" id="ar-host"></div>${GL ? '' : `<div class="ar-glyph">${GLYPH[o.variant]}</div>`}</div>
      <div class="ar-top">
        <div class="ar-name"><small>${esc(o.title)}</small><b>${esc(o.name)}</b></div>
        <div class="ar-ehp"><i id="ar-ehp"></i>${phases.slice(1).map((_, i) => `<span class="mark" style="left:${(1 - (i + 1) * seg) * 100}%"></span>`).join('')}</div>
        <div class="ar-phase" id="ar-phase"></div>
      </div>
      <button class="ar-flee" type="button" id="ar-flee">Flee ✕</button>
      <div class="ar-banner" id="ar-banner"></div>
      <div class="ar-dock">
        <div class="ar-player panel">
          <div class="ar-hearts" id="ar-hearts"></div>
          <div class="ar-focus"><span>Focus</span><div id="ar-focus"></div></div>
          <div class="ar-combo" id="ar-combo"></div>
        </div>
        <div class="ar-card panel rivets" id="ar-card"></div>
        <div class="ar-actions">
          <button type="button" class="ar-act" id="ar-ins"><b>☉ Insight</b><small>${K.insightCost} Focus · clue, time slows</small></button>
          <button type="button" class="ar-act" id="ar-side"><b>↷ Sidestep</b><small>1 Focus · face it later</small></button>
          <button type="button" class="ar-act" id="ar-elx"><b>⚗ Elixir</b><small id="ar-elx-n"></small></button>
        </div>
      </div>
      <div class="ar-hurt"></div>`;
    document.body.appendChild(el);
    document.body.classList.add('in-arena');
    requestAnimationFrame(() => el.classList.add('on'));
    Music.duck(false);
    Music.play(o.music);
    let boss = null;
    try { if (GL) boss = S3.createBoss($('#ar-host', el), { variant: o.variant }); } catch (e) { boss = null; }
    const card = $('#ar-card', el);
    const RING = 2 * Math.PI * 19;

    function draw() {
      $('#ar-ehp', el).style.width = enemy * 100 + '%';
      $('#ar-hearts', el).innerHTML = Array.from({ length: R.maxHp }, (_, i) => `<i class="${i < hp ? '' : 'lost'}">♥</i>`).join('') + (ward ? `<i class="ward" title="Doom's Ward">🛡</i>` : '');
      $('#ar-focus', el).innerHTML = [0, 1, 2].map((i) => `<i class="${i < focus ? 'on' : ''}"></i>`).join('');
      $('#ar-combo', el).textContent = combo >= 2 ? `Combo ×${combo}` : '';
      $('#ar-elx-n', el).textContent = `${elixirs} left · heals 1 HP`;
      $('#ar-ins', el).disabled = !running || focus < K.insightCost || !!(cur && cur.insight);
      $('#ar-side', el).disabled = !running || focus < 1 || !queue.length;
      $('#ar-elx', el).disabled = over || !elixirs || hp >= R.maxHp;
    }
    function banner(big, small, cls = '') {
      const b = $('#ar-banner', el);
      b.className = 'ar-banner show ' + cls;
      b.innerHTML = `<b>${big}</b>${small ? `<span>${small}</span>` : ''}`;
      clearTimeout(b._t);
      b._t = setTimeout(() => b.classList.remove('show'), 1300);
    }
    function flash(cls) { el.classList.remove('hit', 'parry-flash', 'perfect-flash'); void el.offsetWidth; el.classList.add(cls); }
    function dmgPop(text, crit) {
      const d = document.createElement('div');
      d.className = 'ar-dmg' + (crit ? ' crit' : '');
      d.textContent = text;
      d.style.left = 44 + Math.random() * 12 + '%';
      el.appendChild(d);
      setTimeout(() => d.remove(), 1200);
    }

    function nextPhase() {
      pi++;
      if (pi >= phases.length) return win();
      const ph = phases[pi];
      queue = ph.qs.slice();
      floor = Math.max(0, 1 - (pi + 1) * seg);
      if (floor < 1e-6) floor = 0;
      enemy = Math.min(enemy, 1 - pi * seg);
      dmg = seg / ph.qs.length;
      $('#ar-phase', el).textContent = ph.name ? `Phase ${ROMAN[pi]} · ${ph.name}` : '';
      if (ph.name) {
        let healed = '';
        if (pi > 0) { if (boss) boss.enrage(ph.color); Sfx.roar(); if (hp < R.maxHp) { hp++; healed = ' · +1 HP'; } }
        banner(`Phase ${ROMAN[pi]}`, ph.name + healed, 'phase');
        draw();
        later(ask, 1600);
      } else { draw(); later(ask, 500); }
    }

    function ask() {
      if (over) return;
      if (!queue.length) return nextPhase();
      cur = queue.shift();
      cur.insight = false;
      const label = { mc: 'Multiple choice', tf: 'True or false', term: 'Name the term', oe: 'Charge attack · open-ended' }[cur.kind];
      if (cur.kind === 'oe') return askOpen(label);
      card.classList.remove('result');
      card.innerHTML = `
        <div class="ar-q-head"><span class="eyebrow">${label}</span><span class="ar-left">${queue.length} more after this</span>
          <svg class="ar-ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="19" class="bg"/><circle cx="22" cy="22" r="19" class="fg" id="ar-ring"/><text x="22" y="26.5" id="ar-sec"></text></svg></div>
        <div class="ar-prompt">${cur.prompt}</div>
        <div class="ar-opts ${cur.kind === 'tf' ? 'tf' : ''}">${cur.options.map((x, i) => `<button type="button" class="opt" data-i="${i}"><span class="L">${cur.kind === 'tf' ? (i ? '✗' : '✓') : 'ABCD'[i]}</span><span>${x}</span></button>`).join('')}</div>
        <div id="ar-extra"></div>`;
      $$('.opt', card).forEach((b) => (b.onclick = () => running && resolve(Number(b.dataset.i), b)));
      limit = ({ tf: 18, term: 20, mc: 30 }[cur.kind] || 25) + K.timeBonus;
      elapsed = 0; last = performance.now(); frozenUntil = 0; lastTick = -1;
      running = true;
      el.classList.add('timing');
      draw();
      raf = requestAnimationFrame(loop);
    }
    function loop() {
      if (!running) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (now >= frozenUntil) elapsed += dt;
      const p = Math.min(1, elapsed / limit);
      const ring = $('#ar-ring', card);
      if (ring) {
        ring.style.strokeDasharray = RING;
        ring.style.strokeDashoffset = RING * p;
        ring.classList.toggle('perfect', p <= K.perfect);
        ring.classList.toggle('danger', p > 0.75);
        ring.classList.toggle('frozen', now < frozenUntil);
        $('#ar-sec', card).textContent = Math.max(0, Math.ceil(limit - elapsed));
      }
      if (boss) boss.windup(p);
      const left = Math.floor(limit - elapsed);
      if (left < 3 && left !== lastTick) { lastTick = left; Sfx.tick(); }
      if (p >= 1) { resolve(-1); return; }
      raf = requestAnimationFrame(loop);
    }
    function resolve(i, btn) {
      running = false;
      cancelAnimationFrame(raf);
      el.classList.remove('timing');
      const p = elapsed / limit;
      $$('.opt', card).forEach((b) => { b.disabled = true; if (Number(b.dataset.i) === cur.right) b.classList.add('right'); });
      const ok = i === cur.right;
      if (!ok && btn) btn.classList.add('wrong');
      if (ok) parry(p <= K.perfect, 1, btn);
      else takeHit(i < 0 ? 'Too slow' : 'Wrong answer', true);
      const ans = cur.kind === 'tf' ? cur.options[cur.right] : `${'ABCD'[cur.right]} · ${cur.options[cur.right]}`;
      $('#ar-extra', card).innerHTML = `<div class="explain ${ok ? '' : 'bad'}"><b>${ok ? 'Parried · why it works' : `The blow lands · the answer is ${ans}`}</b>${cur.explain || ''}${ok ? '' : '<div class="again">This question returns later in the fight.</div>'}</div>`;
      addNext();
    }
    function addNext() {
      $('#ar-extra', card).insertAdjacentHTML('beforeend', `<div class="q-tools"><button class="btn primary" type="button" id="ar-next">Continue ▸</button><span class="count-note" style="margin:0">or press Enter</span></div>`);
      const nb = $('#ar-next', card);
      nb.onclick = () => { if (!over) ask(); };
      nb.focus({ preventScroll: true });
      draw();
    }
    function parry(perfect, scale, src) {
      combo++; R.parries++;
      if (perfect) R.perfects++;
      if (!cur.tries) R.firstTry += scale < 1 ? 0.5 : 1;
      focus = Math.min(3, focus + (perfect ? 2 : 1));
      if (perfect) Sfx.perfect(); else Sfx.parry();
      if (boss) boss.parried(perfect);
      flash(perfect ? 'perfect-flash' : 'parry-flash');
      banner(perfect ? 'Perfect parry' : 'Parried', perfect ? 'Critical riposte' : combo >= 3 ? `Combo ×${combo}` : '', perfect ? 'gold' : '');
      // Every question must be faced: blows are capped until the last one, which is always the finisher.
      const finisher = !queue.length;
      const d = finisher ? enemy - floor : Math.max(0, Math.min(dmg * scale * (perfect ? K.crit : 1), enemy - floor - seg * 0.05));
      later(() => {
        enemy = Math.max(floor, enemy - d);
        if (boss) boss.hit(enemy);
        Sfx.strike();
        dmgPop(Math.round(d * 1000) + (perfect ? '!' : ''), perfect);
        draw();
      }, 280);
      if (o.onAnswer) o.onAnswer(cur, true, src);
    }
    function takeHit(reason, requeue) {
      combo = 0;
      cur.tries = (cur.tries || 0) + 1;
      if (requeue) queue.push(cur);
      if (o.onAnswer) o.onAnswer(cur, false);
      banner(reason, 'The enemy strikes', 'red');
      const ms = boss ? boss.attack() : 250;
      later(() => {
        if (ward) { ward = false; Sfx.parry(); banner("Doom's Ward", 'The blow is absorbed', 'gold'); }
        else { hp--; R.hits++; Sfx.hurt(); flash('hit'); }
        draw();
        if (hp <= 0) lose();
      }, ms);
    }
    function askOpen(label) {
      card.classList.remove('result');
      card.innerHTML = `
        <div class="ar-q-head"><span class="eyebrow">${label}</span><span class="ar-left">${queue.length} more after this</span></div>
        <div class="ar-prompt">${cur.prompt}</div>
        <ol class="oe-tasks">${cur.tasks.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        <textarea class="oe-input" placeholder="Write your answer to charge the counter-attack. There is no timer. Then reveal the model answer and grade yourself honestly."></textarea>
        <div class="q-tools"><button class="btn primary" type="button" id="oe-reveal">⚡ Unleash the answer</button></div><div id="ar-extra"></div>`;
      if (boss) boss.windup(0.45);
      draw();
      $('#oe-reveal', card).onclick = (e) => {
        e.currentTarget.remove();
        $('#ar-extra', card).innerHTML = `<div class="explain model"><b>Model answer</b>${esc(cur.sample)}${cur.points.length ? `<ul>${cur.points.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}</div>
          <div class="self-grade"><span class="count-note" style="margin:0">Grade yourself honestly:</span><button class="btn green sm" type="button" data-g="1">✓ I covered it</button><button class="btn sm" type="button" data-g="0.5">◐ Partly</button><button class="btn ghost sm" type="button" data-g="0">✗ Missed it</button></div>`;
        $$('.self-grade button', card).forEach((b) => (b.onclick = () => {
          const g = Number(b.dataset.g);
          $('.self-grade', card).remove();
          if (g === 1) parry(true, 1, b);
          else if (g > 0) parry(false, 0.5, b);
          else takeHit('Missed', false);
          addNext();
        }));
      };
    }

    function win() {
      over = true; running = false;
      cancelAnimationFrame(raf);
      enemy = 0; draw();
      if (boss) boss.defeat();
      Sfx.shatter();
      Music.duck(true);
      Music.sting('victory');
      banner(o.winBanner || 'Enemy felled', '', 'gold big');
      if (R.hits === 0) award('untouched');
      if (R.perfects >= 5) award('perfect5');
      R.hpLeft = hp;
      later(() => { card.classList.add('result'); card.innerHTML = o.onWin(R); bindResult(); }, 1900);
    }
    function lose() {
      over = true; running = false;
      cancelAnimationFrame(raf);
      if (boss) { boss.windup(0); boss.taunt(); }
      Music.duck(true);
      el.classList.add('fallen');
      const marks = Math.min(12, R.parries * 2);
      if (marks) { P.marks += marks; save(); hud(); }
      later(() => {
        card.classList.add('result');
        card.innerHTML = `<div class="died"><div class="died-title">DOOM PREVAILS</div>
          <p>${o.loseLine || 'You fall before the guardian.'} Re-read the intel, temper your kit at the Forge, then rise again.</p>
          ${marks ? `<p class="loot"><span><b>◈ +${marks}</b> Marks for ${R.parries} parries</span></p>` : ''}
          <div class="actions"><button class="btn primary" type="button" data-retry>↻ Rise again</button><button class="btn" type="button" data-go="#/armoury">Forge ◈</button><button class="btn ghost" type="button" data-close>${o.leaveLabel || 'Back to the page'}</button></div></div>`;
        bindResult();
      }, 1500);
    }
    function bindResult() {
      $$('[data-close]', card).forEach((b) => (b.onclick = () => close()));
      $$('[data-retry]', card).forEach((b) => (b.onclick = () => { close(true); o.retry(); }));
      const first = $('button', card);
      if (first) first.focus({ preventScroll: true });
    }
    function close(quiet) {
      if (closed) return;
      closed = true; over = true; running = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      removeEventListener('keydown', onKey);
      if (boss) boss.dispose();
      el.remove();
      document.body.classList.remove('in-arena');
      if (o.onClose) o.onClose();
      if (!quiet) { Music.duck(false); Music.play(o.after); }
    }
    function onKey(e) {
      if (closed || e.target.tagName === 'TEXTAREA') return;
      if (running) {
        const i = '1234'.indexOf(e.key) >= 0 ? '1234'.indexOf(e.key) : 'abcd'.indexOf(e.key.toLowerCase());
        const b = i >= 0 && $$('.opt', card)[i];
        if (b && !b.disabled) { e.preventDefault(); b.click(); }
      } else if (e.key === 'Enter') {
        const nb = $('#ar-next', card);
        if (nb && document.activeElement !== nb) { e.preventDefault(); nb.click(); }
      }
    }
    addEventListener('keydown', onKey);

    $('#ar-ins', el).onclick = () => {
      if (!running || focus < K.insightCost || cur.insight) return;
      focus -= K.insightCost; cur.insight = true; R.insights++;
      frozenUntil = performance.now() + 5000;
      const extra = $('#ar-extra', card);
      extra.innerHTML = `<div class="hint-box"><b>Doom's clue</b>${cur.hint || 'Time slows for five seconds. Read the question again, slowly.'}</div>`;
      if ((K.strike || !cur.hint) && cur.kind !== 'tf') {
        const wrong = $$('.opt', card).filter((b) => Number(b.dataset.i) !== cur.right && !b.disabled);
        const w = wrong[Math.floor(Math.random() * wrong.length)];
        if (w) { w.disabled = true; w.classList.add('struck'); }
      }
      Sfx.heal();
      draw();
    };
    $('#ar-side', el).onclick = () => {
      if (!running || focus < 1 || !queue.length) return;
      focus -= 1;
      running = false;
      cancelAnimationFrame(raf);
      el.classList.remove('timing');
      queue.push(cur);
      Sfx.whoosh();
      if (boss) boss.windup(0);
      banner('Sidestep', 'You will face it again', '');
      later(ask, 450);
    };
    $('#ar-elx', el).onclick = () => {
      if (over || !elixirs || hp >= R.maxHp) return;
      elixirs--; hp++;
      Sfx.heal();
      banner('Elixir', '+1 HP', 'green');
      draw();
    };
    $('#ar-flee', el).onclick = () => { if (over || confirm('Flee this fight? Progress in it is lost, but XP already earned stays.')) close(); };
    scenes.push({ dispose: () => close(true) });

    draw();
    later(nextPhase, 900);
    return { close };
  }

  /* ---------- Chapter guardian (miniboss) ---------- */
  function guardianSeal(c, box, refresh) {
    const n = c.n, name = `${GUARDIAN[c.unit]} Mk.${ROMAN[n - 1]}`;
    const count = c.questions.length + Math.min(3, c.glossary.length);
    const studiedAll = () => c.sections.every((_, i) => P.seen[n + ':' + i]);
    function draw() {
      const m = P.missions[n] || {}, K = kit();
      const studied = c.sections.filter((_, i) => P.seen[n + ':' + i]).length;
      box.innerHTML = `<div class="seal-sigil" aria-hidden="true"><span>${GLYPH[c.unit]}</span></div>
        <div class="seal-body"><div class="eyebrow" style="color:var(--danger)">${UNIT[c.unit].name} guardian</div><h3>${esc(name)}</h3>
          <p>Finish the intel and the seal breaks. The guardian winds up an attack while a timer drains: answer correctly before it lands to <b>parry</b> and strike back, or answer in the first third of the timer for a <b>perfect parry</b> and a critical riposte. ${count} questions: the chapter's review questions and its key terms.</p>
          <div class="seal-meta"><span>Intel studied <b>${studied}/${c.sections.length}</b></span><span>Record <b>${m.cleared ? '★'.repeat(m.stars) + '☆'.repeat(3 - m.stars) : 'unbeaten'}</b></span><span>Your kit <b>${K.hp} HP · ${K.elixirs} elixir${K.elixirs > 1 ? 's' : ''}${K.ward ? ' · ward' : ''}</b></span></div>
          <div class="q-tools"><button class="btn primary" type="button" id="face">⚔ ${m.cleared ? 'Fight the guardian again' : 'Break the seal'}</button>${studied < c.sections.length ? '<span class="count-note" style="margin:0">Study every intel file first, or fight now if you are brave.</span>' : ''}</div></div>`;
      $('#face', box).onclick = start;
    }
    function start() {
      if (document.body.classList.contains('in-arena') || document.querySelector('.breakfx')) return;
      breakPage($('#scr-mission'), (restore) => chapterFight(c, name, () => { refresh(); draw(); }, restore));
    }
    // Reaching the seal with every intel file studied breaks it on its own, once per visit.
    let armed = true;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      draw();
      if (!armed || cleared(n) || !studiedAll()) return;
      armed = false;
      io.disconnect();
      box.classList.add('trembling');
      Sfx.rumble();
      const warn = document.createElement('div');
      warn.className = 'seal-warn';
      warn.innerHTML = `<b>The seal is cracking…</b><button class="btn ghost sm" type="button">Not yet</button>`;
      box.appendChild(warn);
      const t = setTimeout(() => { box.classList.remove('trembling'); start(); }, 1900);
      $('button', warn).onclick = () => { clearTimeout(t); box.classList.remove('trembling'); warn.remove(); };
      scenes.push({ dispose: () => clearTimeout(t) });
    }, { threshold: 0.55 });
    io.observe(box);
    scenes.push({ dispose: () => io.disconnect() });
    draw();
  }

  function chapterFight(c, name, refresh, restore) {
    const n = c.n;
    fight({
      variant: c.unit, name, title: `Mission ${pad2(n)} · ${UNIT[c.unit].name} guardian`, music: 'miniboss', after: 'study',
      queue: chapterFightQs(c),
      onClose: restore,
      retry: () => chapterFight(c, name, refresh, restore),
      onAnswer(q, ok) {
        if (!ok) { P.streak = 0; save(); return; }
        award('first_blood');
        P.streak++;
        P.best = Math.max(P.best, P.streak);
        if (P.streak >= 5) award('streak5');
        if (q.key && !P.solved[q.key]) {
          const clean = !q.tries && !q.insight;
          P.solved[q.key] = clean ? 1 : 'hint';
          gain(clean ? XP.q : XP.qHint, null, 'parry');
        }
        save();
        refresh();
      },
      onWin(R) {
        const st = R.hits === 0 && R.insights === 0 ? 3 : R.hits + R.insights <= 1 ? 2 : 1;
        const prev = P.missions[n] || { stars: 0 };
        const first = !prev.cleared;
        P.missions[n] = { cleared: true, stars: Math.max(prev.stars || 0, st) };
        const bonus = (first ? XP.clear : 0) + Math.max(0, st - (prev.stars || 0)) * XP.star;
        const marks = (first ? 20 : 8) + Math.min(5, R.perfects) * 3;
        P.marks += marks;
        save();
        if (bonus) gain(bonus, null, first ? 'mission conquered' : 'new stars');
        if (first) award('first_clear');
        if (st === 3) award('flawless');
        checkMeta(); refresh(); hud();
        const ms = $('#m-stars');
        if (ms) ms.textContent = '★'.repeat(P.missions[n].stars) + '☆'.repeat(3 - P.missions[n].stars);
        const nx = byN[n + 1];
        return `<div class="victory">
          <div class="eyebrow">Mission ${pad2(n)} conquered</div>
          <h3 class="gold-text">Guardian felled</h3>
          <div class="stars-big">${[1, 2, 3].map((i) => `<span>${i <= st ? '★' : '☆'}</span>`).join('')}</div>
          <div class="loot"><span><b>+${bonus}</b> XP</span><span><b>◈ +${marks}</b> Marks</span><span><b>${R.perfects}</b> perfect parries</span><span><b>${R.hits}</b> hits taken</span></div>
          <p>${st === 3 ? 'Flawless. Even Doom nods, once.' : st === 2 ? 'Strong work. One stumble stands between you and perfection.' : 'The guardian falls, but Doom saw every misstep. Fight again for more stars.'}</p>
          <div class="actions">${nx ? `<button class="btn primary" type="button" data-go="#/m/${nx.n}">Next: Mission ${pad2(nx.n)} ▸</button>` : `<button class="btn primary" type="button" data-go="#/trial">Face The Professor ▸</button>`}<button class="btn" type="button" data-go="#/armoury">Forge ◈</button><button class="btn ghost" type="button" data-close>Back to the page</button></div></div>`;
      },
    });
  }

  /* ================= ARMOURY ================= */
  function renderArmoury(scr) {
    const badge = (id) => `<span class="badge-state ${P.ach[id] ? 'got' : ''}">${P.ach[id] ? '★ RIG MASTERED' : '◇ +' + XP.sim + ' XP ON MASTERY'}</span>`;
    scr.innerHTML = `<div class="wrap">
      <header class="page-head"><div class="eyebrow">Castle Doom Armoury</div><h1 class="gold-text">The Forge &amp; training rigs</h1><p>Temper your kit with Marks won in battle, then sharpen your skills on three live simulators. Master each rig to earn its trophy and XP.</p></header>
      ${forgeHtml()}

      <section class="panel rig rivets" data-unit="hardware">
        <div class="rig-head"><div><div class="unit-chip">Rig I · Hardware</div><h2>CPU fetch–decode–execute stepper</h2><p>Step a tiny CPU through each clock phase and watch the address, data and control buses carry each instruction between RAM and the registers.</p></div>
        <div><div class="rig-actions"><select class="search" id="cpu-prog" style="min-width:0;flex:none"><option value="prog1">Add two integers</option><option value="prog2">Sensor sum</option></select><button class="btn sm primary" id="cpu-step">Step phase</button><button class="btn sm" id="cpu-auto">Auto run</button><button class="btn sm ghost" id="cpu-reset">Reset</button></div><div style="margin-top:8px">${badge('rig_cpu')}</div></div></div>
        <div class="regs">${['PC', 'MAR', 'MDR', 'CIR', 'CU', 'ACC'].map((r) => `<div class="reg" id="r-${r}"><small>${r}</small><b>0</b></div>`).join('')}</div>
        <div class="buses">${[['addr', 'Address bus'], ['data', 'Data bus'], ['ctrl', 'Control bus']].map(([k, l]) => `<div class="bus ${k}"><span>${l}</span><div class="track"><i id="bus-${k}"></i><span id="bus-${k}-t">Idle</span></div></div>`).join('')}</div>
        <div class="ram" id="ram"></div>
        <div class="log" id="cpu-log"></div>
      </section>

      <section class="panel rig rivets" data-unit="networks">
        <div class="rig-head"><div><div class="unit-chip">Rig II · Networks</div><h2>Packet journey &amp; encapsulation tracer</h2><p>Follow one packet hop by hop from a Doombot sensor to Castle Doom Central. Watch NAT rewrite the address, the TTL fall and the MAC addresses change at every router.</p></div>
        <div><div class="rig-actions"><button class="btn sm primary" id="pk-step">Next hop</button><button class="btn sm" id="pk-hs">TCP handshake</button><button class="btn sm ghost" id="pk-reset">Reset</button></div><div style="margin-top:8px">${badge('rig_net')}</div></div></div>
        <div class="net-path">${NET_NODES.map((x, i) => `<div class="net-node" id="nn-${i}"><b>${x[0]}</b><small>${x[1]}</small><small>${x[2]}</small></div>`).join('')}</div>
        <div class="hdr">${[['src-ip', 'Source IP:port'], ['dst-ip', 'Destination IP:port'], ['ttl', 'TTL'], ['src-mac', 'Source MAC'], ['dst-mac', 'Destination MAC'], ['flags', 'TCP flags']].map(([k, l]) => `<div><small>${l}</small><b id="pk-${k}">—</b></div>`).join('')}</div>
        <div class="log" id="pk-log"></div>
      </section>

      <section class="panel rig rivets" data-unit="ai">
        <div class="rig-head"><div><div class="unit-chip">Rig III · Behaviorist AI</div><h2>Robot vacuum Q-learning grid world</h2><p>A 2×2 world: start at (0,0), dirt at (0,1) worth +5, a wall at (1,0) and the dock at (1,1) worth +10. Each move costs −1 and bumping costs −3. Watch the Q-table and the 3D arrows converge on the best route.</p></div>
        <div><div class="rig-actions"><button class="btn sm primary" id="q-step">Step</button><button class="btn sm" id="q-ep">Run episode</button><button class="btn sm" id="q-100">Train 100</button><button class="btn sm ghost" id="q-reset">Reset</button></div><div style="margin-top:8px">${badge('rig_q')}</div></div></div>
        <div class="q-rig">
          <div class="q-view"><div class="gl-host" id="grid-host"></div><div class="legend">Arrow length = Q value · gold = best action · red = negative</div></div>
          <div>
            <div class="sliders">${[['alpha', 'α learning', 0.5], ['gamma', 'γ discount', 0.9], ['epsilon', 'ε explore', 0.2]].map(([k, l, v]) => `<label>${l}<input type="range" min="0" max="1" step="0.05" value="${v}" id="sl-${k}"><b id="v-${k}">${v.toFixed(2)}</b></label>`).join('')}</div>
            <table class="qtable"><thead><tr><th>State</th><th>UP</th><th>DOWN</th><th>LEFT</th><th>RIGHT</th></tr></thead><tbody id="qt"></tbody></table>
            <div class="bellman" id="bellman">Q(s,a) ← Q(s,a) + α [ r + γ · max Q(s′,·) − Q(s,a) ]</div>
            <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><div class="pad"><span></span><button id="mv-UP">▲</button><span></span><button id="mv-LEFT">◀</button><button id="mv-DOWN">▼</button><button id="mv-RIGHT">▶</button></div><div class="badge-state" id="q-stats"></div></div>
          </div>
        </div>
        <div class="log" id="q-log" style="margin-top:14px"></div>
      </section>
    </div>`;
    cpuRig(scr); netRig(scr); qRig(scr);
    bindForge(scr);
  }

  function forgeHtml() {
    const K = kit();
    return `<section class="panel forge rivets" id="forge">
      <div class="rig-head"><div><div class="unit-chip">The Forge</div><h2>Temper your kit</h2><p>Every fight drops Marks, with extra for perfect parries. Each upgrade makes a small difference in battle. Respec at any time for a full refund.</p></div>
        <div class="forge-purse"><b>◈ ${P.marks}</b><small>Marks</small><button class="btn ghost sm" type="button" id="respec" ${Object.keys(P.up).length ? '' : 'disabled'}>Respec</button></div></div>
      <div class="forge-grid">${UPGRADES.map((u) => {
        const l = upLvl(u.id), maxed = l >= u.max, cost = upCost(u);
        return `<div class="forge-card ${maxed ? 'maxed' : ''} ${l ? 'owned' : ''}"><div class="ico">${u.ico}</div>
          <div class="txt"><b>${u.name}</b><div class="lv">${Array.from({ length: u.max }, (_, i) => `<i class="${i < l ? 'on' : ''}"></i>`).join('')}</div><p>${u.desc}</p></div>
          <button class="btn sm ${!maxed && P.marks >= cost ? 'primary' : ''}" type="button" data-up="${u.id}" ${maxed || P.marks < cost ? 'disabled' : ''}>${maxed ? 'Mastered' : `◈ ${cost}`}</button></div>`;
      }).join('')}</div>
      <div class="forge-kit"><span>Your kit</span><b>${K.hp} HP</b><b>${K.elixirs} elixir${K.elixirs > 1 ? 's' : ''}</b><b>+${K.timeBonus} s timers</b><b>${Math.round(K.perfect * 100)}% perfect window</b><b>×${K.crit} crits</b><b>Insight ${K.insightCost} Focus</b>${K.ward ? '<b>Doom\'s Ward</b>' : ''}</div>
    </section>`;
  }
  function bindForge(scr) {
    const box = $('#forge', scr);
    if (!box) return;
    $$('[data-up]', box).forEach((b) => (b.onclick = () => {
      const u = UPGRADES.find((x) => x.id === b.dataset.up), cost = upCost(u);
      if (P.marks < cost || upLvl(u.id) >= u.max) return;
      P.marks -= cost;
      P.up[u.id] = upLvl(u.id) + 1;
      save(); hud();
      Sfx.parry();
      toast(u.ico, 'Forged', `${u.name} ${ROMAN[upLvl(u.id) - 1]}`, u.desc);
      box.outerHTML = forgeHtml();
      bindForge(scr);
    }));
    $('#respec', box).onclick = () => {
      const refund = UPGRADES.reduce((s, u) => { let t = 0; for (let k = 1; k <= upLvl(u.id); k++) t += u.cost * k; return s + t; }, 0);
      if (!refund || !confirm(`Melt down every upgrade for ◈ ${refund} Marks?`)) return;
      P.marks += refund; P.up = {};
      save(); hud();
      box.outerHTML = forgeHtml();
      bindForge(scr);
    };
  }

  function rigMastered(id, el) {
    if (P.ach[id]) return;
    award(id);
    gain(XP.sim, el, 'rig mastered');
    const b = el && el.closest('.rig') && $('.badge-state', el.closest('.rig'));
    if (b) { b.classList.add('got'); b.textContent = '★ RIG MASTERED'; }
  }
  const logTo = (el, html) => { el.insertAdjacentHTML('afterbegin', `<div>${html}</div>`); };

  // Rig I: CPU. The programs and RAM come from the original simulator.
  const PROGRAMS = {
    prog1: [{ op: 'LOAD 0x04', code: 'LOAD', operand: 4 }, { op: 'ADD 0x05', code: 'ADD', operand: 5 }, { op: 'STORE 0x06', code: 'STORE', operand: 6 }, { op: 'HALT', code: 'HALT', operand: 0 }],
    prog2: [{ op: 'LOAD 0x04', code: 'LOAD', operand: 4 }, { op: 'ADD 0x05', code: 'ADD', operand: 5 }, { op: 'ADD 0x07', code: 'ADD', operand: 7 }, { op: 'HALT', code: 'HALT', operand: 0 }],
  };
  function cpuRig(scr) {
    const labels = ['INST 0', 'INST 1', 'INST 2', 'INST 3', 'DATA A', 'DATA B', 'RESULT', 'OFFSET'];
    let ram, s, timer = null;
    const hex = (v) => '0x' + v.toString(16).padStart(2, '0').toUpperCase();
    const log = $('#cpu-log', scr);
    const reg = (r, v, on) => { const e = $('#r-' + r, scr); $('b', e).textContent = v; e.classList.toggle('active', !!on); };
    const bus = (k, txt) => { $('#bus-' + k, scr).style.width = txt ? '100%' : '0'; $('#bus-' + k + '-t', scr).textContent = txt || 'Idle'; };
    const drawRam = () => ($('#ram', scr).innerHTML = ram.map((v, i) => `<div class="${s.mar === i ? 'hl' : ''}"><small>${hex(i)} · ${labels[i]}</small><b>${esc(v)}</b></div>`).join(''));
    function reset() {
      if (timer) { clearInterval(timer); timer = null; $('#cpu-auto', scr).textContent = 'Auto run'; }
      const prog = PROGRAMS[$('#cpu-prog', scr).value];
      ram = [...prog.map((p) => p.op), '15', '27', '0', '8'];
      s = { pc: 0, phase: 0, mar: 0, acc: 0, cir: 'IDLE', halted: false };
      ['PC', 'MAR', 'MDR'].forEach((r) => reg(r, '0x00'));
      reg('CIR', 'IDLE'); reg('CU', 'FETCH'); reg('ACC', '0');
      ['addr', 'data', 'ctrl'].forEach((k) => bus(k));
      log.innerHTML = '<div>[RESET] Registers cleared. Program loaded into RAM. Ready.</div>';
      drawRam();
    }
    function step() {
      const prog = PROGRAMS[$('#cpu-prog', scr).value];
      if (s.halted) { logTo(log, '<b>[HALTED]</b> Reset to run again.'); return; }
      const inst = prog[s.pc % prog.length];
      ['addr', 'data', 'ctrl'].forEach((k) => bus(k));
      ['PC', 'MAR', 'MDR', 'CIR', 'CU', 'ACC'].forEach((r) => $('#r-' + r, scr).classList.remove('active'));
      if (s.phase === 0) {
        s.mar = s.pc;
        reg('MAR', hex(s.mar), 1); reg('PC', hex(s.pc), 1);
        bus('addr', `Address ${hex(s.mar)} placed on the address bus`);
        setTimeout(() => bus('data', `RAM returns "${ram[s.mar]}" to MDR → CIR`), 180);
        reg('MDR', ram[s.mar]); reg('CIR', ram[s.mar]); reg('CU', 'DECODE');
        logTo(log, `<b>[FETCH]</b> PC=${hex(s.pc)} → MAR. RAM[${hex(s.mar)}] travels over the data bus into CIR ("${ram[s.mar]}").`);
        s.phase = 1;
      } else if (s.phase === 1) {
        reg('CU', 'EXECUTE', 1);
        bus('ctrl', `CU signals opcode ${inst.code}${inst.code !== 'HALT' ? ', operand ' + hex(inst.operand) : ''}`);
        logTo(log, `<b>[DECODE]</b> The control unit decodes "${inst.code}"${inst.code !== 'HALT' ? ` targeting ${hex(inst.operand)}` : ''}.`);
        s.phase = 2;
      } else {
        if (inst.code === 'LOAD') { s.acc = parseInt(ram[inst.operand], 10); s.mar = inst.operand; logTo(log, `<b>[EXECUTE]</b> LOAD ${hex(inst.operand)} → ACC = ${s.acc}.`); }
        else if (inst.code === 'ADD') { const v = parseInt(ram[inst.operand], 10); s.acc += v; s.mar = inst.operand; logTo(log, `<b>[EXECUTE]</b> ALU adds RAM[${hex(inst.operand)}] (${v}) → ACC = ${s.acc}.`); }
        else if (inst.code === 'STORE') { ram[inst.operand] = String(s.acc); s.mar = inst.operand; bus('data', `ACC ${s.acc} written to RAM[${hex(inst.operand)}]`); logTo(log, `<b>[EXECUTE]</b> STORE writes ACC (${s.acc}) into RAM[${hex(inst.operand)}].`); }
        else { s.halted = true; logTo(log, `<b style="color:var(--gold)">[HALT]</b> Program finished. Accumulator holds ${s.acc}.`); rigMastered('rig_cpu', $('#cpu-step', scr)); if (timer) { clearInterval(timer); timer = null; $('#cpu-auto', scr).textContent = 'Auto run'; } }
        reg('ACC', s.acc, 1);
        s.pc++;
        reg('PC', hex(s.pc)); reg('CU', 'FETCH');
        s.phase = 0;
      }
      drawRam();
    }
    $('#cpu-step', scr).onclick = step;
    $('#cpu-reset', scr).onclick = reset;
    $('#cpu-prog', scr).onchange = reset;
    $('#cpu-auto', scr).onclick = (e) => {
      if (timer) { clearInterval(timer); timer = null; e.target.textContent = 'Auto run'; }
      else { timer = setInterval(step, 650); e.target.textContent = 'Pause'; }
    };
    scenes.push({ dispose: () => timer && clearInterval(timer) });
    reset();
  }

  // Rig II: packet tracer. Hop data from the original simulator.
  const NET_NODES = [['Doombot Sensor', '192.168.1.105', 'MAC AA:BB:CC:11:01'], ['LAN Switch', 'Layer 2 switch', 'Port 1 → Port 4'], ['Border Router A', 'NAT 198.51.100.1', 'MAC 11:22:33:AA:BB'], ['Core Router B', '198.51.100.254', 'Trunk fibre link'], ['Castle Doom Central', '198.51.100.42:443', 'Imperial mainframe']];
  const HOPS = [
    { src: '192.168.1.105:52140', dst: '198.51.100.42:443', sm: 'AA:BB:CC:11:01', dm: '11:22:33:AA:BB', ttl: 64, msg: 'The Doombot sensor wraps its JSON telemetry in TCP, then IP, then an Ethernet frame addressed to the default gateway’s MAC.' },
    { src: '192.168.1.105:52140', dst: '198.51.100.42:443', sm: 'AA:BB:CC:11:01', dm: '11:22:33:AA:BB', ttl: 64, msg: 'The Layer 2 switch reads only the destination MAC, looks it up in its forwarding table and sends the frame out of port 4 to Router A. It never inspects the IP header.' },
    { src: '198.51.100.1:49152 (NAT)', dst: '198.51.100.42:443', sm: '11:22:33:AA:BB', dm: '99:88:77:CC:DD', ttl: 63, msg: 'Border Router A applies NAT (192.168.1.105 → 198.51.100.1), decrements TTL to 63, recomputes the header checksum and re-frames for Core Router B’s MAC.' },
    { src: '198.51.100.1:49152', dst: '198.51.100.42:443', sm: '99:88:77:CC:DD', dm: '44:55:66:DD:EE', ttl: 62, msg: 'Core Router B finds the longest-prefix match in its routing table, forwards the packet over the fibre trunk and decrements TTL to 62.' },
    { src: '198.51.100.1:49152', dst: '198.51.100.42:443', sm: '44:55:66:DD:EE', dm: '44:55:66:DD:EE', ttl: 62, msg: 'Castle Doom Central receives the frame, verifies the TCP checksum, delivers the payload to the port 443 web service and sends a TCP ACK back.' },
  ];
  function netRig(scr) {
    let hop = 0;
    const timers = [];
    const log = $('#pk-log', scr);
    const set = (k, v) => ($('#pk-' + k, scr).textContent = v);
    function reset() {
      hop = 0;
      $$('.net-node', scr).forEach((x) => x.classList.remove('active'));
      set('src-ip', HOPS[0].src); set('dst-ip', HOPS[0].dst); set('src-mac', HOPS[0].sm); set('dst-mac', HOPS[0].dm); set('ttl', '64'); set('flags', 'SYN=0 ACK=1 Seq=1042');
      log.innerHTML = '<div>[RESET] Packet staged at the Doombot sensor.</div>';
    }
    $('#pk-step', scr).onclick = (e) => {
      const h = HOPS[hop % HOPS.length], i = hop % HOPS.length;
      $$('.net-node', scr).forEach((x, j) => x.classList.toggle('active', j === i));
      set('src-ip', h.src); set('dst-ip', h.dst); set('src-mac', h.sm); set('dst-mac', h.dm); set('ttl', h.ttl);
      logTo(log, `<b>[HOP ${i + 1}]</b> ${h.msg}`);
      if (i === HOPS.length - 1) rigMastered('rig_net', e.target);
      hop++;
    };
    $('#pk-hs', scr).onclick = () => {
      logTo(log, '<b>[TCP]</b> Opening a three-way handshake with Castle Doom Central…');
      [[300, 'SYN=1 ACK=0 Seq=1000', '<b>[1 · SYN]</b> Client → server: SYN, client sequence number 1000.'],
        [800, 'SYN=1 ACK=1 Seq=5000 Ack=1001', '<b>[2 · SYN-ACK]</b> Server → client: SYN+ACK, server sequence number 5000, Ack 1001.'],
        [1300, 'SYN=0 ACK=1 Seq=1001 Ack=5001', '<b>[3 · ACK]</b> Client → server: ACK 5001. Connection ESTABLISHED, so reliable data can flow.']]
        .forEach(([t, f, m]) => timers.push(setTimeout(() => { set('flags', f); logTo(log, m); }, t)));
    };
    $('#pk-reset', scr).onclick = reset;
    scenes.push({ dispose: () => timers.forEach(clearTimeout) });
    reset();
  }

  // Rig III: Q-learning. Rules and rewards from the original simulator.
  function qRig(scr) {
    const prm = { alpha: 0.5, gamma: 0.9, epsilon: 0.2 };
    const blank = () => ({ UP: 0, DOWN: 0, LEFT: 0, RIGHT: 0 });
    let Q = { '0,0': blank(), '0,1': blank(), '1,1': blank() };
    const ag = { r: 0, c: 0, dirt: false, steps: 0, eps: 0, total: 0 };
    const grid = GL ? S3.createGrid($('#grid-host', scr)) : null;
    if (grid) scenes.push(grid);
    if (!GL) $('#grid-host', scr).innerHTML = '<p style="padding:20px;color:var(--dim)">3D view needs WebGL. The Q-table still works.</p>';
    const log = $('#q-log', scr);
    const ACTS = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    function draw() {
      $('#qt', scr).innerHTML = Object.entries(Q).map(([s, v]) => {
        const best = Math.max(...Object.values(v));
        return `<tr><td>(${s})${s === '1,1' ? ' dock' : ''}</td>${ACTS.map((a) => `<td class="${v[a] === best && best !== 0 ? 'best' : ''}">${v[a].toFixed(2)}</td>`).join('')}</tr>`;
      }).join('');
      $('#q-stats', scr).textContent = `EPISODES ${ag.eps} · STEPS ${ag.steps} · RETURN ${ag.total}`;
      if (grid) { grid.setQ(Q); grid.setDirt(!ag.dirt); }
    }
    function act(a, quiet) {
      const old = ag.r + ',' + ag.c;
      let nr = ag.r + (a === 'DOWN') - (a === 'UP'), nc = ag.c + (a === 'RIGHT') - (a === 'LEFT');
      let reward = -1, blocked = false;
      if (nr < 0 || nr > 1 || nc < 0 || nc > 1 || (nr === 1 && nc === 0)) { reward = -3; nr = ag.r; nc = ag.c; blocked = true; }
      if (nr === 0 && nc === 1 && !ag.dirt) { reward += 5; ag.dirt = true; }
      let term = false;
      if (nr === 1 && nc === 1) { reward += 10; term = true; }
      const ns = nr + ',' + nc;
      ag.r = nr; ag.c = nc; ag.steps++; ag.total += reward;
      const oldQ = Q[old][a];
      const maxN = term ? 0 : Math.max(...Object.values(Q[ns]));
      const nq = oldQ + prm.alpha * (reward + prm.gamma * maxN - oldQ);
      Q[old][a] = Math.round(nq * 100) / 100;
      if (!quiet) {
        $('#bellman', scr).innerHTML = `Q(${old}, ${a}) ← ${oldQ.toFixed(2)} + ${prm.alpha} × [ ${reward} + ${prm.gamma} × ${maxN.toFixed(2)} − ${oldQ.toFixed(2)} ] = <b style="color:var(--gold)">${nq.toFixed(2)}</b>`;
        logTo(log, `[Step ${ag.steps}] ${a} → (${ns}), reward ${reward}${blocked ? ' (bump!)' : ''}, new Q ${nq.toFixed(2)}${term ? ' · <b style="color:var(--gold)">DOCKED</b>' : ''}`);
        grid && grid.move(nr, nc, a, blocked);
      }
      if (term) {
        ag.eps++;
        if (!quiet && grid) { grid.docked(); setTimeout(() => grid.reset(0, 0), 450); }
        ag.r = 0; ag.c = 0; ag.dirt = false;
      }
      return term;
    }
    function choose() {
      if (Math.random() < prm.epsilon) return ACTS[Math.floor(Math.random() * 4)];
      const v = Q[ag.r + ',' + ag.c];
      const best = Math.max(...ACTS.map((a) => v[a]));
      const ties = ACTS.filter((a) => v[a] === best);
      return ties[Math.floor(Math.random() * ties.length)];
    }
    const step = () => { act(choose()); draw(); };
    $('#q-step', scr).onclick = step;
    $('#q-ep', scr).onclick = () => {
      let k = 0;
      const t = setInterval(() => { k++; const done = act(choose()); draw(); if (done || k >= 20) clearInterval(t); }, 260);
      scenes.push({ dispose: () => clearInterval(t) });
    };
    $('#q-100', scr).onclick = (e) => {
      for (let i = 0; i < 100; i++) { for (let k = 0; k < 20; k++) if (act(choose(), true)) break; }
      grid && grid.reset(ag.r, ag.c);
      draw();
      logTo(log, '<b style="color:var(--green-b)">[TRAINED]</b> 100 episodes complete. The gold arrows show the learned policy: (0,0) → RIGHT → (0,1) → DOWN → dock.');
      rigMastered('rig_q', e.target);
    };
    $('#q-reset', scr).onclick = () => {
      Q = { '0,0': blank(), '0,1': blank(), '1,1': blank() };
      Object.assign(ag, { r: 0, c: 0, dirt: false, steps: 0, eps: 0, total: 0 });
      grid && grid.reset(0, 0);
      log.innerHTML = '<div>[RESET] Q-table cleared to zeros. Agent placed on (0,0).</div>';
      draw();
    };
    ACTS.forEach((a) => ($('#mv-' + a, scr).onclick = () => { act(a); draw(); }));
    ['alpha', 'gamma', 'epsilon'].forEach((k) => ($('#sl-' + k, scr).oninput = (e) => { prm[k] = parseFloat(e.target.value); $('#v-' + k, scr).textContent = prm[k].toFixed(2); }));
    log.innerHTML = '<div>[READY] Agent on (0,0). Step, steer with the arrows, or train.</div>';
    draw();
  }

  /* ================= CODEX ================= */
  function renderCodex(scr) {
    let unit = 'all', q = '', reveal = false;
    scr.innerHTML = `<div class="wrap codex-page">
      <header class="page-head"><div class="eyebrow">Imperial archive</div><h1 class="gold-text">The Codex</h1><p>Every term of power in the campaign. Entries unlock when you reach the Codex unlocks section of their mission. You can reveal everything for revision at any time.</p></header>
      <div class="toolbar">
        <input class="search" id="cx-q" type="search" placeholder="Search terms and definitions…" aria-label="Search the codex">
        <div class="seg" id="cx-unit">${[['all', 'All'], ['hardware', 'Hardware'], ['networks', 'Networks'], ['ai', 'AI']].map(([k, l]) => `<button type="button" data-u="${k}" class="${k === 'all' ? 'on' : ''}">${l}</button>`).join('')}</div>
        <button class="toggle" type="button" id="cx-rev" aria-pressed="false"><i></i>Reveal all</button>
      </div>
      <p class="count-note" id="cx-count"></p>
      <div class="codex-grid" id="cx-grid"></div></div>`;
    function draw() {
      const list = G.glossary.filter((t) => (unit === 'all' || t.unit === unit) && (!q || (t.term + ' ' + t.definition).toLowerCase().includes(q)));
      const open = (t) => reveal || P.codex[t.term];
      $('#cx-count', scr).textContent = `${list.length} entries shown · ${codexCount()} of ${G.glossary.length} unlocked`;
      $('#cx-grid', scr).innerHTML = list.map((t) => `<div class="codex-card ${open(t) ? '' : 'locked'}" data-unit="${t.unit}"><span class="src">CH ${pad2(t.chapter)}</span><h5>${open(t) ? esc(t.term) : '████████'}</h5><p>${open(t) ? esc(t.definition) : `Unlock in Mission ${pad2(t.chapter)}. ` + '▒'.repeat(40)}</p></div>`).join('') || '<p style="color:var(--dim)">No entries match.</p>';
    }
    $('#cx-q', scr).oninput = (e) => { q = e.target.value.toLowerCase().trim(); draw(); };
    $$('#cx-unit button', scr).forEach((b) => (b.onclick = () => { unit = b.dataset.u; $$('#cx-unit button', scr).forEach((x) => x.classList.toggle('on', x === b)); draw(); }));
    $('#cx-rev', scr).onclick = (e) => { reveal = !reveal; e.currentTarget.setAttribute('aria-pressed', reveal); draw(); };
    draw();
  }

  /* ================= FINAL TRIAL ================= */
  function renderTrial(scr) {
    let topic = 'ALL', mode = 'run';
    scr.innerHTML = `<div class="wrap">
      <header class="page-head"><div class="eyebrow">The Final Trial · Test Bank</div><h1 class="gold-text">Face the Final Trial</h1><p>${G.bank.length} questions from the team's Stage 2 test bank: true/false, multiple choice and open-ended scenarios. Defeat The Professor, the final boss, by parrying his attacks with correct answers, or practise freely with no timer.</p></header>
      <div id="trial-body"></div></div>`;
    const body = $('#trial-body', scr);
    function setup() {
      const best = P.trialBest;
      body.innerHTML = `<div class="panel trial-setup rivets">
        <div><h3>Choose your battlefield</h3><div class="seg" id="t-topic">${[['ALL', `All (${G.bank.length})`], ['Hardware', 'Hardware'], ['Networks', 'Networks'], ['AI Behaviour', 'AI Behaviour']].map(([k, l]) => `<button type="button" data-t="${k}" class="${k === topic ? 'on' : ''}">${l}</button>`).join('')}</div></div>
        <div><h3>Choose your mode</h3><div class="mode-cards">
          <button type="button" class="mode-card boss-card ${mode === 'run' ? 'on' : ''}" data-m="run"><b>🎓 Face The Professor</b><span>The final boss, in three phases: The Lecture (true or false), The Examination (multiple choice) and Final Grading (open-ended, self-graded). Timed parries, your Forge upgrades, graded S to D.</span></button>
          <button type="button" class="mode-card ${mode === 'practice' ? 'on' : ''}" data-m="practice"><b>📖 Practice drill</b><span>No lives and no pressure. Every answer is explained. XP still counts for first-time correct answers.</span></button>
        </div></div>
        ${best ? `<div class="count-note" style="margin:0">Best run: grade ${best.grade} · score ${best.score} · ${best.correct}/${best.total} correct</div>` : ''}
        <div><button class="btn primary" type="button" id="t-go">▶ Begin the trial</button></div></div>`;
      $$('#t-topic button', body).forEach((b) => (b.onclick = () => { topic = b.dataset.t; setup(); }));
      $$('.mode-card', body).forEach((b) => (b.onclick = () => { mode = b.dataset.m; setup(); }));
      $('#t-go', body).onclick = start;
    }
    function start() {
      const pool = G.bank.filter((q) => topic === 'ALL' || q.topic === topic);
      if (mode === 'run') return professorFight(pool, topic);
      const R = { qs: pool, i: 0, lives: 3, combo: 0, score: 0, correct: 0, mode, topic, answered: 0 };
      next(R);
    }
    function professorFight(pool, topic) {
      const by = (k) => shuffle(pool.filter((q) => q.id.startsWith(k))).map(bankFightQ);
      fight({
        variant: 'professor', name: 'The Professor', title: `Final boss · The Final Trial${topic === 'ALL' ? '' : ' · ' + topic}`,
        music: 'boss', after: 'hall', bonusHp: 2, winBanner: 'Class dismissed',
        loseLine: 'The Professor adjusts his glasses. You are not ready yet.', leaveLabel: 'Leave the trial',
        phases: [
          { name: 'The Lecture', color: 0x6ee7b7, qs: by('TF') },
          { name: 'The Examination', color: 0x60a5fa, qs: by('MC') },
          { name: 'Final Grading', color: 0xfbbf24, qs: by('OE') },
        ],
        retry: () => professorFight(pool, topic),
        onClose: setup,
        onAnswer(q, ok) {
          if (ok && q.bank && !q.tries && !P.bank[q.bank]) { P.bank[q.bank] = 1; save(); gain(XP.bank, null, 'trial'); }
        },
        onWin(R) {
          const pct = R.firstTry / R.total;
          const grade = pct >= 0.9 ? 'S' : pct >= 0.75 ? 'A' : pct >= 0.6 ? 'B' : pct >= 0.4 ? 'C' : 'D';
          const score = Math.round(R.firstTry * 100 + R.perfects * 50 + R.hpLeft * 100);
          if (!P.ach.trial_done) gain(XP.run, null, 'trial complete');
          award('trial_done');
          if (topic === 'ALL') { award('prof_down'); if (grade === 'S') award('trial_ace'); }
          const marks = topic === 'ALL' && !P.profDown ? 120 : 30;
          if (topic === 'ALL') P.profDown = true;
          P.marks += marks;
          const best = P.trialBest;
          if (!best || score > best.score) P.trialBest = { grade, score, correct: R.firstTry, total: R.total };
          save(); hud();
          return `<div class="victory">
            <div class="eyebrow">The Professor is defeated</div>
            <div class="grade gold-text">${grade}</div>
            <div class="loot"><span><b>${score}</b> score</span><span><b>${R.firstTry}/${R.total}</b> right first time</span><span><b>${R.perfects}</b> perfect parries</span><span><b>◈ +${marks}</b> Marks</span></div>
            <p>${grade === 'S' ? 'Full marks. The Professor closes his book and, for once, smiles.' : grade === 'A' ? 'Formidable. Revisit the topics you stumbled on.' : 'You passed, barely. Return to the campaign and study the intel again.'}</p>
            <div class="actions"><button class="btn primary" type="button" data-retry>↻ Fight again</button><button class="btn" type="button" data-go="#/map">Campaign map</button><button class="btn ghost" type="button" data-close>Leave the trial</button></div></div>`;
        },
      });
    }
    function hudHtml(R) {
      const mult = R.combo >= 6 ? 3 : R.combo >= 3 ? 2 : 1;
      return `<div class="panel trial-hud">
        ${R.mode === 'run' ? `<div class="lives">${[0, 1, 2].map((i) => `<i class="${i >= R.lives ? 'lost' : ''}"></i>`).join('')}</div>` : '<div class="stat"><b>∞</b>PRACTICE</div>'}
        <div class="stat"><b>${R.i + 1}/${R.qs.length}</b>QUESTION</div>
        <div class="stat"><b>${R.score}</b>SCORE</div>
        <div class="stat"><b class="combo">×${mult}</b>COMBO ${R.combo}</div>
        <button class="btn ghost sm" type="button" id="t-quit" style="margin-left:auto">Retreat</button></div>`;
    }
    function next(R) {
      if (R.i >= R.qs.length || (R.mode === 'run' && R.lives <= 0)) return results(R);
      const q = R.qs[R.i];
      const unit = TOPIC_UNIT[q.topic];
      const kind = q.id.slice(0, 2);
      let opts = '';
      if (kind === 'TF') opts = `<div class="tf">${['True', 'False'].map((v) => `<button type="button" class="opt" data-v="${v}">${v}</button>`).join('')}</div>`;
      else if (kind === 'MC') opts = `<div class="opts">${q.options.map((o, i) => `<button type="button" class="opt" data-v="${'ABCD'[i]}"><span class="L">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
      else opts = `<ol class="oe-tasks">${(q.tasks || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ol><textarea class="oe-input" placeholder="Draft your answer here (optional), then reveal the model answer and grade yourself honestly."></textarea><div class="q-tools"><button class="btn" type="button" id="oe-reveal">Reveal model answer</button></div>`;
      body.innerHTML = hudHtml(R) + `<div class="panel trial-card rivets" data-unit="${unit}">
        <div class="meta"><span class="unit-chip">${esc(q.topic)}</span><span>${q.id}</span><span>${kind === 'TF' ? 'TRUE OR FALSE' : kind === 'MC' ? 'MULTIPLE CHOICE' : 'OPEN-ENDED SCENARIO · SELF-GRADED'}</span></div>
        <p class="q-prompt">${esc(q.prompt)}</p>${opts}<div id="t-extra"></div></div>`;
      $('#t-quit', body).onclick = () => (R.answered ? results(R, true) : setup());
      const card = $('.trial-card', body);
      const resolve = (ok, el, partial) => {
        R.answered++;
        if (ok) {
          R.combo++;
          const mult = R.combo >= 6 ? 3 : R.combo >= 3 ? 2 : 1;
          R.score += (partial ? 50 : 100) * mult;
          R.correct += partial ? 0.5 : 1;
          if (!P.bank[q.id] && !partial) { P.bank[q.id] = 1; save(); gain(XP.bank, el, 'trial'); }
        } else {
          R.combo = 0;
          if (R.mode === 'run') R.lives--;
          card.classList.remove('shake', 'flash-red'); void card.offsetWidth; card.classList.add('shake', 'flash-red');
        }
        $('.trial-hud', body).outerHTML = hudHtml(R);
        $('#t-quit', body).onclick = () => results(R, true);
        const last = R.i + 1 >= R.qs.length || (R.mode === 'run' && R.lives <= 0);
        $('#t-extra', body).insertAdjacentHTML('beforeend', `<div class="q-tools"><button class="btn primary" type="button" id="t-next">${last ? 'See results ▸' : 'Next question ▸'}</button></div>`);
        $('#t-next', body).onclick = () => { R.i++; next(R); };
        $('#t-next', body).focus({ preventScroll: true });
      };
      if (kind === 'OE') {
        $('#oe-reveal', body).onclick = (e) => {
          e.target.remove();
          $('#t-extra', body).innerHTML = `<div class="explain model"><b>Model answer</b>${esc(q.sample || '')}${q.key_points ? `<ul>${q.key_points.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}</div>
            <div class="self-grade"><span class="count-note" style="margin:0">Grade yourself honestly:</span><button class="btn green sm" data-g="full">✓ I covered it</button><button class="btn sm" data-g="part">◐ Partly</button><button class="btn ghost sm" data-g="miss">✗ Missed it</button></div>`;
          $$('.self-grade button', body).forEach((b) => (b.onclick = () => {
            $('.self-grade', body).remove();
            const g = b.dataset.g;
            if (g === 'full') { if (!P.bank[q.id]) { P.bank[q.id] = 1; save(); gain(XP.bank, b, 'trial'); } resolve(true, b); }
            else if (g === 'part') resolve(true, b, true);
            else { R.combo = 0; R.answered++; resolveMissNoLife(); }
          }));
        };
        // Open-ended misses cost no life: they are self-graded.
        const resolveMissNoLife = () => {
          $('.trial-hud', body).outerHTML = hudHtml(R);
          $('#t-quit', body).onclick = () => results(R, true);
          $('#t-extra', body).insertAdjacentHTML('beforeend', `<div class="q-tools"><button class="btn primary" type="button" id="t-next">Next question ▸</button></div>`);
          $('#t-next', body).onclick = () => { R.i++; next(R); };
        };
        return;
      }
      $$('.opt', body).forEach((b) => (b.onclick = () => {
        const ok = b.dataset.v.toLowerCase() === String(q.answer).toLowerCase();
        $$('.opt', body).forEach((x) => { x.disabled = true; if (x.dataset.v.toLowerCase() === String(q.answer).toLowerCase()) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        $('#t-extra', body).innerHTML = `<div class="explain"><b>${ok ? 'Correct' : 'Not quite'} · answer ${esc(q.answer)}</b>${esc(q.explanation || '')}</div>`;
        resolve(ok, b);
      }));
    }
    function results(R, quit) {
      const total = R.qs.length;
      const pct = R.answered ? R.correct / total : 0;
      const grade = pct >= 0.9 ? 'S' : pct >= 0.75 ? 'A' : pct >= 0.6 ? 'B' : pct >= 0.4 ? 'C' : 'D';
      const survived = R.mode !== 'run' || R.lives > 0;
      if (!quit && R.mode === 'run') {
        if (!P.ach.trial_done) gain(XP.run, null, 'trial complete');
        award('trial_done');
        if (grade === 'S' && R.topic === 'ALL' && survived) award('trial_ace');
        const best = P.trialBest;
        if (!best || R.score > best.score) { P.trialBest = { grade, score: R.score, correct: R.correct, total }; save(); }
      }
      body.innerHTML = `<div class="panel results rivets">
        <div class="eyebrow">${quit ? 'Retreated' : survived ? 'Trial complete' : 'Fallen in battle'}</div>
        <div class="grade gold-text">${grade}</div>
        <div class="results-stats"><div><b>${R.score}</b><span>Score</span></div><div><b>${R.correct}/${total}</b><span>Correct</span></div><div><b>${Math.round(pct * 100)}%</b><span>Accuracy</span></div></div>
        <p style="color:var(--muted)">${grade === 'S' ? 'Doom finds nothing to correct. A rare day in Latveria.' : grade === 'A' ? 'Formidable. Return to the missions you stumbled on.' : 'Return to the campaign, study the intel files and face the trial again.'}</p>
        <div class="victory"><div class="actions"><button class="btn primary" type="button" id="t-again">↻ Run it again</button><button class="btn" data-go="#/map">Campaign map</button></div></div></div>`;
      $('#t-again', body).onclick = setup;
    }
    setup();
  }

  /* ================= TROPHIES ================= */
  function renderTrophies(scr) {
    const r = rankOf(P.xp);
    scr.innerHTML = `<div class="wrap">
      <header class="page-head"><div class="eyebrow">Hall of records</div><h1 class="gold-text">Rank &amp; trophies</h1><p>${P.xp} XP earned of ${MAX_XP} available · best answer streak ${P.best} · ${stars()} of ${CH.length * 3} stars.</p></header>
      <div class="block-head"><span class="eyebrow">Rank ladder</span><h2>The road to Sovereign</h2></div>
      <div class="rank-ladder">${RANKS.map((k) => `<div class="rung ${P.xp >= k.at ? 'got' : ''} ${k.lvl === r.lvl ? 'cur' : ''}"><div class="rank-hex">${k.lvl}</div><div><b>${k.name}</b></div><small>${k.at} XP</small></div>`).join('')}</div>
      <div class="block-head"><span class="eyebrow">Trophies</span><h2>${Object.keys(P.ach).length} of ${ACH.length} earned</h2></div>
      <div class="trophy-grid" style="margin-bottom:60px">${ACH.map((a) => `<div class="panel trophy ${P.ach[a.id] ? 'got' : ''}"><div class="ico">${a.ico}</div><div><b>${a.name}</b><span>${a.desc}</span></div></div>`).join('')}</div></div>`;
  }

  /* ---------- boot ---------- */
  hydrate(document.body);
  hud();
  checkMeta();
  route();
})();
