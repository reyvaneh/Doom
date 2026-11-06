// Helpers shared by the three storyboards (loaded by tools/video_kit/scenes/section.html).
window.STORY = {};
window.SB = {
  /** Section banner, top-left: "02 · THE 4 PILLARS". */
  banner(K, s, num, title, at = 0.15, out) {
    const tr = s.say(`${num} · ${title}`, at, { style: 'tag', x: 60, y: 70, align: 'left' });
    tr.out(out ?? K.W(at) + 3.2);
    return tr;
  },
  /** Big heading near the top that morphs as the narrator moves on. */
  heading(s, text, at, o = {}) { return s.say(text, at, { x: 960, y: o.y ?? 140, scale: o.scale ?? 0.9, color: o.color, style: 'label', ...o }); },
  /** Caption-like tag at the bottom (white box). */
  tag(s, text, at, o = {}) { return s.say(text, at, { style: 'tag', x: o.x ?? 960, y: o.y ?? 960, ...o }); },
  /** Darken footage under a diagram. */
  dim(s, a, b, k = 0.55) {
    const d = document.createElement('div'); d.style.cssText = 'position:absolute;inset:0;background:#0b1118;opacity:0'; s.el.insertBefore(d, s.layer);
    s.add((t) => { d.style.opacity = k * Morph.ease.sine(Kit.ramp(t, s.K.W(a), s.K.W(a) + 0.6)) * (b == null ? 1 : 1 - Morph.ease.sine(Kit.ramp(t, s.K.W(b), s.K.W(b) + 0.6))); });
  },
  /** Loop of points as a closed path for movers. */
  loop(pts) { return pts.concat([pts[0]]); },
};
