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
  ].map(([id, ico, name, desc]) => ({ id, ico, name, desc }));

  /* ---------- Saved progress ---------- */
  const KEY = 'doom-campaign-v1';
  const fresh = () => ({ xp: 0, seen: {}, ops: {}, decrypt: {}, solved: {}, missions: {}, codex: {}, ach: {}, sims: {}, bank: {}, typed: {}, free: false, streak: 0, best: 0, trialBest: null });
  let P;
  try { P = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { P = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { /* private mode */ } };

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
  }

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
  function renderMap(scr, focus) {
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
    const fr = $('#free-roam');
    fr.setAttribute('aria-pressed', P.free);
    fr.onclick = () => { P.free = !P.free; save(); renderMap(scr, selected); };
    $('#overview-btn').onclick = () => { selected = null; $('#map-card').classList.remove('show'); mapScene && mapScene.overview(); $$('.m-row').forEach((r) => r.classList.remove('sel')); };
    if (GL) {
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

    // Boss gate.
    main.insertAdjacentHTML('beforeend', `
      <section id="b-boss">
        <div class="block-head"><span class="eyebrow" style="color:var(--danger)">Boss gate</span><h2>Defeat the gatekeeper</h2></div>
        <div class="panel boss" id="boss"></div>
      </section>
      <nav class="m-next">
        ${prev ? `<button class="btn ghost" data-go="#/m/${prev.n}">◂ Mission ${pad2(prev.n)}</button>` : '<span></span>'}
        <button class="btn" data-go="#/map/${n}">Campaign map</button>
        ${next ? `<button class="btn ghost" data-go="#/m/${next.n}">Mission ${pad2(next.n)} ▸</button>` : '<span></span>'}
      </nav>`);
    hydrate(scr);

    // Mission log rail.
    const railItems = [['b-brief', 'Briefing'], ['b-obj', 'Objectives'], ...c.sections.map((s, i) => ['b-s' + i, s.title.replace(/<[^>]+>/g, '')]), ['b-tx', 'Transmission'], ['b-op', 'Field operation'], ['b-codex', 'Codex unlocks'], ['b-boss', 'Boss gate']];
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

    bossGate(c, $('#boss', scr), refresh);
    refresh();
  }

  /* ---------- Boss gate ---------- */
  function bossGate(c, box, refresh) {
    const n = c.n, qs = c.questions, total = qs.length;
    let qi = 0, shields = 3, mistakes = 0, hints = 0, boss = null, combat = false;
    const names = ['Sentinel', 'Warden', 'Executor', 'Inquisitor', 'Overseer'];
    const bossName = `Gatekeeper Doombot Mk.${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI'][n - 1]} “${names[n % names.length]}”`;

    function frame(inner) {
      box.innerHTML = `
        <div class="boss-grid">
          <div class="boss-stage">
            <div class="boss-hp"><div class="name">${esc(bossName)}</div><div class="hpbar"><i id="hp" style="width:${((total - qi) / total) * 100}%"></i></div></div>
            <div class="gl-host" id="boss-host"></div>
            ${GL ? '' : '<div class="fallback-bot">🤖</div>'}
            <div class="shields">SHIELDS ${[0, 1, 2].map((i) => `<i class="${i >= shields ? 'lost' : ''}"></i>`).join('')}</div>
          </div>
          <div class="boss-q" id="bq">${inner}</div>
        </div>`;
      if (GL) {
        if (boss) boss.dispose();
        boss = S3.createBoss($('#boss-host', box), { color: 0x10b981 });
        scenes.push(boss);
        boss.hit((total - qi) / total);
      }
    }
    function intro() {
      const m = P.missions[n];
      frame(`
        <div class="eyebrow" style="color:var(--danger)">A gatekeeper bars the way</div>
        <h3 class="q-prompt" style="font-size:24px;margin-top:10px">${total} trials stand between you and the next mission.</h3>
        <p style="color:var(--muted)">Each correct answer cracks the Doombot's armour for <b style="color:var(--gold)">${XP.q} XP</b>. A wrong answer costs a shield. Consulting Doom for a hint halves that question's XP. Clear all ${total} with no mistakes and no hints for ★★★.</p>
        ${m && m.cleared ? `<p style="color:var(--green-b)">Best record: ${'★'.repeat(m.stars)}${'☆'.repeat(3 - m.stars)}. Replay to improve it.</p>` : ''}
        <div class="q-tools"><button class="btn primary" type="button" id="engage">⚔ Engage</button></div>`);
      $('#engage', box).onclick = () => { combat = true; qi = 0; shields = 3; mistakes = 0; hints = 0; ask(); };
    }
    function ask() {
      const q = qs[qi];
      let hinted = false, wrongHere = 0;
      frame(`
        <div class="q-pips">${qs.map((_, i) => `<i class="${i < qi ? 'ok' : i === qi ? 'cur' : ''}"></i>`).join('')}</div>
        <div class="eyebrow">Trial ${qi + 1} of ${total}</div>
        <p class="q-prompt" style="margin-top:8px">${q.prompt}</p>
        <div class="opts">${q.options.map((o, i) => `<button type="button" class="opt" data-l="${'ABCD'[i]}"><span class="L">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div>
        <div class="q-tools"><button class="btn sm" type="button" id="hint-btn">☉ Consult Doom (hint)</button></div>
        <div id="q-extra"></div>`);
      $('#hint-btn', box).onclick = (e) => {
        if (hinted) return;
        hinted = true; hints++;
        e.target.disabled = true;
        $('#q-extra', box).insertAdjacentHTML('afterbegin', `<div class="hint-box"><b>Doom's clue</b>${q.hint}</div>`);
      };
      $$('.opt', box).forEach((b) => (b.onclick = () => {
        const L = b.dataset.l;
        if (L === q.answer) {
          $$('.opt', box).forEach((x) => (x.disabled = true));
          b.classList.add('right');
          const k = n + ':' + qi;
          const firstTime = !P.solved[k];
          if (firstTime) {
            P.solved[k] = hinted || wrongHere ? 'hint' : 1;
            save();
            gain(hinted || wrongHere ? XP.qHint : XP.q, b, 'trial');
          }
          award('first_blood');
          P.streak++; P.best = Math.max(P.best, P.streak); save();
          if (P.streak >= 5) award('streak5');
          qi++;
          $('#hp', box).style.width = ((total - qi) / total) * 100 + '%';
          boss && boss.hit((total - qi) / total);
          $('#q-extra', box).insertAdjacentHTML('beforeend', `<div class="explain"><b>Correct · why it works</b>${q.explanation}</div>
            <div class="q-tools"><button class="btn primary" type="button" id="next-q">${qi >= total ? '⚔ Deliver the final blow' : 'Next trial ▸'}</button></div>`);
          $('#next-q', box).onclick = () => (qi >= total ? victory() : ask());
          $('#next-q', box).focus({ preventScroll: true });
          refresh();
        } else {
          b.classList.add('wrong'); b.disabled = true;
          wrongHere++; mistakes++; P.streak = 0; save();
          shields = Math.max(0, shields - 1);
          $$('.shields i', box).forEach((s, i) => s.classList.toggle('lost', i >= shields));
          box.classList.remove('shake', 'flash-red'); void box.offsetWidth; box.classList.add('shake', 'flash-red');
          boss && boss.taunt();
          if (shields === 0) return defeat();
        }
      }));
    }
    function defeat() {
      setTimeout(() => {
        frame(`<div class="victory"><div class="eyebrow" style="color:var(--danger)">Shields depleted</div><h3 style="color:#fda4af">The Doombot repels you</h3>
          <p>Doom is unimpressed, but not surprised. Re-read the intel files above, then try again. Questions you already answered keep their XP.</p>
          <div class="actions"><button class="btn primary" type="button" id="retry">↻ Retry the gate</button><button class="btn ghost" type="button" id="reread">Review intel</button></div></div>`);
        $('#retry', box).onclick = () => { qi = 0; shields = 3; mistakes = 0; hints = 0; ask(); };
        $('#reread', box).onclick = () => document.getElementById('b-s0').scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
    function victory() {
      boss && boss.defeat();
      const st = mistakes === 0 && hints === 0 ? 3 : mistakes + hints <= 1 ? 2 : 1;
      const prev = P.missions[n] || { stars: 0 };
      const first = !prev.cleared;
      P.missions[n] = { cleared: true, stars: Math.max(prev.stars || 0, st) };
      save();
      let bonus = (first ? XP.clear : 0) + Math.max(0, st - (prev.stars || 0)) * XP.star;
      setTimeout(() => {
        const nx = byN[n + 1];
        $('#bq', box).innerHTML = `<div class="victory">
          <div class="eyebrow">Mission ${pad2(n)} conquered</div>
          <h3 class="gold-text">Victory</h3>
          <div class="stars-big">${[1, 2, 3].map((i) => `<span>${i <= st ? '★' : '☆'}</span>`).join('')}</div>
          <p>${st === 3 ? 'Flawless. Even Doom nods, once.' : st === 2 ? 'Strong work. One stumble stands between you and perfection.' : 'The gate falls, but Doom saw every misstep. Replay for more stars.'}</p>
          <div class="actions">${nx ? `<button class="btn primary" type="button" data-go="#/m/${nx.n}">Next: Mission ${pad2(nx.n)} ▸</button>` : `<button class="btn primary" type="button" data-go="#/trial">Face the Final Trial ▸</button>`}<button class="btn" type="button" data-go="#/map/${n}">Campaign map</button><button class="btn ghost" type="button" id="again">↻ Replay gate</button></div></div>`;
        $('#again', box).onclick = () => { qi = 0; shields = 3; mistakes = 0; hints = 0; ask(); };
        if (bonus) gain(bonus, $('.stars-big', box), first ? 'mission conquered' : 'new stars');
        const ms = $('#m-stars');
        if (ms) ms.textContent = '★'.repeat(P.missions[n].stars) + '☆'.repeat(3 - P.missions[n].stars);
        if (first) award('first_clear');
        if (st === 3) award('flawless');
        checkMeta(); refresh();
      }, 700);
    }
    intro();
  }

  /* ================= ARMOURY ================= */
  function renderArmoury(scr) {
    const badge = (id) => `<span class="badge-state ${P.ach[id] ? 'got' : ''}">${P.ach[id] ? '★ RIG MASTERED' : '◇ +' + XP.sim + ' XP ON MASTERY'}</span>`;
    scr.innerHTML = `<div class="wrap">
      <header class="page-head"><div class="eyebrow">Castle Doom Armoury</div><h1 class="gold-text">Training rigs</h1><p>Three live simulators from the campaign. Master each rig to earn its trophy and XP.</p></header>

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
      <header class="page-head"><div class="eyebrow">The Final Trial · Test Bank</div><h1 class="gold-text">Face the Final Trial</h1><p>${G.bank.length} questions from the team's Stage 2 test bank: true/false, multiple choice and open-ended scenarios. Survive the run with three lives and build combos for score multipliers, or practise freely.</p></header>
      <div id="trial-body"></div></div>`;
    const body = $('#trial-body', scr);
    function setup() {
      const best = P.trialBest;
      body.innerHTML = `<div class="panel trial-setup rivets">
        <div><h3>Choose your battlefield</h3><div class="seg" id="t-topic">${[['ALL', `All (${G.bank.length})`], ['Hardware', 'Hardware'], ['Networks', 'Networks'], ['AI Behaviour', 'AI Behaviour']].map(([k, l]) => `<button type="button" data-t="${k}" class="${k === topic ? 'on' : ''}">${l}</button>`).join('')}</div></div>
        <div><h3>Choose your mode</h3><div class="mode-cards">
          <button type="button" class="mode-card ${mode === 'run' ? 'on' : ''}" data-m="run"><b>⚔ Gauntlet run</b><span>Three lives. Wrong answers cost a life. Streaks build a ×2 and ×3 combo. Graded S to D.</span></button>
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
      const R = { qs: pool, i: 0, lives: 3, combo: 0, score: 0, correct: 0, mode, topic, answered: 0 };
      next(R);
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
