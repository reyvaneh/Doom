/* Builds the static, printable study guide from the same data as the interactive guide. */
(function () {
  'use strict';
  const G = window.GUIDE;
  const S3 = window.DoomScene;
  const CH = G.chapters;
  const PAGES = window.TOC_PAGES || {};
  const book = document.getElementById('book');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const pad2 = (n) => String(n).padStart(2, '0');
  const UNIT = { hardware: 'Unit A · Hardware', networks: 'Unit B · Networks', ai: 'Unit C · Behaviorist AI' };
  const TOPIC_UNIT = { Hardware: 'hardware', Networks: 'networks', 'AI Behaviour': 'ai' };
  const add = (html) => book.insertAdjacentHTML('beforeend', html);
  const ornament = '<div class="ornament"><span>◆</span></div>';
  const corners = '<div class="frame"></div><div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>';

  function cleanInline(html) {
    return String(html).split(/(<[^>]+>)/g).map((seg, idx) => {
      if (idx % 2 === 1) return seg;
      return seg
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\s*-&gt;\s*|\s*->\s*/g, ' → ')
        .replace(/\(0\.9\)\^(\d+)/g, '(0.9)<sup>$1</sup>')
        .replace(/γ\^([a-zA-Z0-9]+)/g, 'γ<sup>$1</sup>')
        .replace(/10\^(\d+)/g, '10<sup>$1</sup>')
        .replace(/\b([sRG])_(\d+)\b/g, '$1<sub>$2</sub>')
        .replace(/\bV_(out|in)\b/g, 'V<sub>$1</sub>')
        .replace(/(^|[\s(])\*([A-Za-z][A-Za-z\s-]{0,28}[A-Za-z])\*(?=[\s.,;:!?)])/g, '$1<em>$2</em>');
    }).join('');
  }

  function formatTaskHtml(raw) {
    const lines = String(raw).split(/<br\s*\/?>/i);
    const steps = [];
    const preamble = [];
    let cur = null;
    lines.forEach((rawLine) => {
      const lead = rawLine.match(/^(\s*)/)[1].length;
      const trimmed = rawLine.trim();
      if (!trimmed) return;
      const m = trimmed.match(/^Step\s+(\d+)\s*:\s*(.*)$/i);
      if (m) {
        cur = { num: m[1], head: m[2], items: [] };
        steps.push(cur);
      } else if (cur) {
        cur.items.push({ lead, text: trimmed });
      } else {
        preamble.push(trimmed);
      }
    });
    if (!steps.length) return cleanInline(raw);
    const renderItems = (items) => {
      let out = '';
      let bullets = [];
      let codeLines = [];
      const flushBullets = () => {
        if (bullets.length) {
          out += `<ul class="task-sub">${bullets.map((b) => `<li>${cleanInline(b)}</li>`).join('')}</ul>`;
          bullets = [];
        }
      };
      const flushCode = () => {
        if (codeLines.length) {
          out += `<div class="task-code">${codeLines.map((c) => `<div>${cleanInline(c)}</div>`).join('')}</div>`;
          codeLines = [];
        }
      };
      const isCodeLike = (lead, txt) => lead >= 2 || /^(Address |Data Address |Priority |Rule \d+:|Packet \d+:|TD |G_0 =|N\(|`)/.test(txt);
      items.forEach(({ lead, text: t }) => {
        if (/^-\s+/.test(t)) {
          flushCode();
          bullets.push(t.replace(/^-\s+/, ''));
        } else if (isCodeLike(lead, t)) {
          flushBullets();
          codeLines.push(t);
        } else {
          flushBullets();
          flushCode();
          out += `<div class="task-note">${cleanInline(t)}</div>`;
        }
      });
      flushBullets();
      flushCode();
      return out;
    };
    return (preamble.length ? `<div class="task-note">${cleanInline(preamble.join(' '))}</div>` : '') +
      `<ol class="task-steps">${steps.map((s) => `<li class="task-step"><div class="step-k">STEP ${pad2(s.num)}</div><div class="step-c"><div class="step-head">${cleanInline(s.head)}</div>${renderItems(s.items)}</div></li>`).join('')}</ol>`;
  }

  function formatObservationHtml(raw) {
    const lines = String(raw).split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
    const out = [];
    let rows = [];
    const flushRows = () => {
      if (!rows.length) return;
      const keyed = rows.filter((r) => /^[^:]{2,55}:\s+.+/.test(r));
      if (keyed.length === rows.length && keyed.length >= 2) {
        out.push(`<table class="obs-table"><tbody>${rows.map((r) => {
          const idx = r.indexOf(':');
          return `<tr><th>${cleanInline(r.slice(0, idx))}</th><td>${cleanInline(r.slice(idx + 1).trim())}</td></tr>`;
        }).join('')}</tbody></table>`);
      } else {
        out.push(`<ul class="obs-list">${rows.map((r) => `<li>${cleanInline(r)}</li>`).join('')}</ul>`);
      }
      rows = [];
    };
    lines.forEach((line) => {
      if (/^-\s+/.test(line)) {
        rows.push(line.replace(/^-\s+/, ''));
      } else {
        flushRows();
        out.push(`<div class="${/:$/.test(line) ? 'obs-sub' : 'obs-intro'}">${cleanInline(line)}</div>`);
      }
    });
    flushRows();
    return out.join('');
  }

  function formatEvaluationHtml(raw) {
    const norm = cleanInline(raw.replace(/<br\s*\/?>/gi, ' '));
    const m = norm.match(/Benchmark Outcome:\s*(.+?)\s*Common Misconception:\s*(.+)$/i);
    if (!m) return norm;
    return `<div class="eval-grid">
      <div class="eval-card ok"><span class="eval-tag">Benchmark Outcome</span><p>${m[1].trim()}</p></div>
      <div class="eval-card warn"><span class="eval-tag">Common Misconception</span><p>${m[2].trim()}</p></div>
    </div>`;
  }

  function formatActivityPart(label, raw) {
    const up = String(label).toUpperCase();
    if (up.includes('TASK')) return formatTaskHtml(raw);
    if (up.includes('OBSERVATION')) return formatObservationHtml(raw);
    if (up.includes('REFLECTION')) return `<div class="reflect-box">${cleanInline(raw)}</div>`;
    if (up.includes('EVALUATION') || up.includes('DOOM APPROVES')) return formatEvaluationHtml(raw);
    return cleanInline(raw);
  }

  // The crest render is the only 3D art in the printed edition.
  let crest = G.artUri.hall;
  if (S3 && S3.supported()) {
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-9999px;top:0;width:900px;height:840px';
    document.body.appendChild(host);
    const hero = S3.createHero(host, { still: true });
    crest = hero.snapshot();
    hero.dispose();
    host.remove();
  }

  /* ---------- Cover ---------- */
  add(`<section class="dark cover">
    <div class="art" style="background-image:url('${crest}')"></div>${corners}
    <div class="titles">
      <h1>Hardware, Networks<br>&amp; Behaviorist AI</h1>
      ${ornament}
      <div class="sub">A beginner's guide to how computers work, how networks carry data and how simple machines learn to behave.</div>
      <div class="edition">Stage 2 Study Guide</div>
    </div>
    <div class="team"><b>TEAM DOOM</b><span>Fall 2026</span></div>
  </section>`);

  /* ---------- Contents ---------- */
  const tocRow = (n, title, unit, key) => `<div class="toc-row" data-unit="${unit || ''}"><span class="n">${n}</span><span class="t">${esc(title)}</span><span class="dots"></span><span class="p">${PAGES[key] || ''}</span></div>`;
  add(`<section class="contents">
    <h1>Contents</h1>
    <div class="intro">Sixteen chapters across three units. Chapters 1–6 are the core course; Chapters 7–16 build on them with practical and extended topics.</div>
    <div class="toc-part">Part I · Core course</div>
    ${CH.filter((c) => c.n <= 6).map((c) => tocRow(pad2(c.n), c.title, c.unit, 'ch' + c.n)).join('')}
    <div class="toc-part">Part II · Practice and extension</div>
    ${CH.filter((c) => c.n > 6).map((c) => tocRow(pad2(c.n), c.title, c.unit, 'ch' + c.n)).join('')}
    <div class="toc-part">Reference</div>
    ${tocRow('◆', 'Glossary', null, 'glossary')}${tocRow('◆', 'Practice test', null, 'test')}${tocRow('◆', 'Answers', null, 'answers')}
  </section>`);

  /* ---------- Chapters ---------- */
  CH.forEach((c) => {
    const parts = c.activity.parts;
    add(`<section class="chapter" data-unit="${c.unit}">
      <header class="opener">
        ${c.bannerUri ? `<div class="opener-art"><img src="${c.bannerUri}" alt=""></div>` : ''}
        <div class="label">Chapter ${c.n} · ${UNIT[c.unit]}</div>
        <div class="num">${pad2(c.n)}</div>
        <h1>${esc(c.title)}</h1>
        ${ornament}
      </header>
      <div class="directive"><img src="${G.avatarUri}" alt=""><div><div class="who">Doom's directive</div><div class="say">${c.directive}</div></div></div>
      <h3 class="part">Learning objectives</h3>
      <ul class="objectives">${c.objectives.map((o) => `<li>${o}</li>`).join('')}</ul>
      ${c.sections.map((s, i) => {
        const m = s.title.match(/^(\d+\.\d+)\s+(.*)$/);
        const head = s.title ? `<h2 class="sec">${m ? `<span class="k">${m[1]}</span>${m[2]}` : s.title}</h2>` : '';
        return `${head}<div class="body ${i === 0 ? 'first' : ''}">${s.html}</div>`;
      }).join('')}
      <aside class="meanwhile"><div class="label">Meanwhile in Latveria</div><div class="body">${c.meanwhile}</div></aside>
      <h3 class="part">Activity</h3>
      <div class="activity"><h4>${esc(c.activity.title)}</h4>
        ${parts.map((p) => {
          const lbl = p.label.replace(/^\d+\.\s*/, '').replace(/^DOOM APPROVES\s*\/\/\s*/i, '');
          const isTask = /TASK/i.test(p.label);
          return `<div class="step ${isTask ? 'is-task' : ''}"><div class="label">${esc(lbl)}</div><div class="step-body">${formatActivityPart(p.label, p.html)}</div></div>`;
        }).join('')}
      </div>
      <h3 class="part">Key terms</h3>
      <div class="terms">${c.glossary.map((g) => `<div><b>${esc(g.term)}</b><span>${g.def}</span></div>`).join('')}</div>
      <h3 class="part">Review questions</h3>
      ${c.questions.map((q, i) => `<div class="rq"><div class="q"><b>${i + 1}.</b><span>${q.prompt}</span></div><ol>${q.options.map((o, k) => `<li><i>${'ABCD'[k]}</i><span>${esc(o)}</span></li>`).join('')}</ol></div>`).join('')}
    </section>`);
  });

  /* ---------- Glossary ---------- */
  add(`<section class="matter"><h1>Glossary</h1><div class="intro">${G.glossary.length} terms, grouped by unit. The number after each term is the chapter where it is introduced.</div>
    ${['hardware', 'networks', 'ai'].map((u) => `<div class="gl-unit" data-unit="${u}"><h2>${UNIT[u]}</h2><div class="gl">${G.glossary.filter((t) => t.unit === u).sort((a, b) => a.term.localeCompare(b.term)).map((t) => `<div><b>${esc(t.term)}</b><small>Ch ${t.chapter}</small><br><span>${esc(t.definition)}</span></div>`).join('')}</div></div>`).join('')}
  </section>`);

  /* ---------- Practice test ---------- */
  add(`<section class="matter"><h1>Practice test</h1><div class="intro">${G.bank.length} questions from the team's Stage 2 test bank: true or false, multiple choice and open-ended scenarios. Answers follow in the next section.</div>
    <h2 class="sub">True or false</h2>${G.bank.filter((q) => q.id.startsWith('TF')).map((q, i) => pt(q, i, `<div class="tf">True  ·  False</div>`)).join('')}
    <h2 class="sub">Multiple choice</h2>${G.bank.filter((q) => q.id.startsWith('MC')).map((q, i) => pt(q, i, `<ol class="abc">${q.options.map((o, k) => `<li><i>${'ABCD'[k]}</i><span>${esc(o)}</span></li>`).join('')}</ol>`)).join('')}
    <h2 class="sub">Open-ended scenarios</h2>${G.bank.filter((q) => q.id.startsWith('OE')).map((q, i) => pt(q, i, `<ol>${(q.tasks || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`)).join('')}
  </section>`);
  function pt(q, i, body) {
    return `<div class="pt" data-unit="${TOPIC_UNIT[q.topic]}"><div class="meta">${q.id} · ${esc(q.topic)}</div><div class="q">${esc(q.prompt)}</div>${body}</div>`;
  }

  /* ---------- Answers ---------- */
  add(`<section class="matter"><h1>Answers</h1><div class="intro">Chapter review answers with their hints, followed by the practice test answers and model answers.</div>
    <h2 class="sub">Chapter review questions</h2>
    <div class="cols">${CH.map((c) => `<div class="ans-ch" data-unit="${c.unit}"><h3>Chapter ${c.n} · ${esc(c.title)}</h3>${c.questions.map((q, i) => `<div class="ans"><b class="a">${i + 1} · ${q.answer}</b><span>${q.explanation}<br><span class="hint">Hint: ${q.hint}</span></span></div>`).join('')}</div>`).join('')}</div>
    <h2 class="sub">Practice test</h2>
    <div class="cols">${G.bank.map((q) => q.id.startsWith('OE')
      ? `<div class="ans"><b class="a">${q.id}</b><span><i>Model answer.</i> ${esc(q.sample || '')}${q.key_points ? `<br><span class="hint">Key points: ${q.key_points.map(esc).join(' · ')}</span>` : ''}</span></div>`
      : `<div class="ans"><b class="a">${q.id}</b><span><b>${esc(q.answer)}.</b> ${esc(q.explanation || '')}</span></div>`).join('')}</div>
  </section>`);

  /* ---------- Back cover ---------- */
  add(`<section class="dark back">${corners}<div class="inner"><div><div class="crest" style="background-image:url('${crest}')"></div><p>“A computer is not magic. It is an obedient machine.”<br>For the interactive edition, open <b>DOOM_Stage2_Study_Guide_Interactive.html</b> in a web browser.</p></div></div></section>`);

  window.__ready = true;
})();
