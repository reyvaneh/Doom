// Three.js scenes for the Castle Doom Campaign study guide.
// Bundled by esbuild into vendor/scene.bundle.js (global: DoomScene).
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const C = {
  green: 0x10b981, emerald: 0x34d399, deep: 0x021a14, gold: 0xfbbf24, amber: 0xd97706,
  titanium: 0x1a222e, plate: 0x0d131c, violet: 0xa78bfa, ink: 0x03070a,
};
export const UNIT_COLORS = { hardware: 0xf5b330, networks: 0x2ee6a6, ai: 0xb79cff };

const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function supported() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}

/* ---------- shared stage ---------- */
function stage(host, opts = {}) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true, alpha: !!opts.alpha, preserveDrawingBuffer: !!opts.still, powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(opts.still ? 2 : Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure || 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'gl-canvas';
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // Metals need something to reflect, or they render black.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = opts.env ?? 0.35;
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(opts.fov || 45, 1, 0.1, 400);
  let composer = null, bloom = null;
  if (opts.bloom !== false) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), opts.bloomStrength ?? 0.85, 0.55, opts.bloomThreshold ?? 0.18);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }
  let labels = null;
  if (opts.labels) {
    labels = new CSS2DRenderer();
    labels.domElement.className = 'gl-labels';
    host.appendChild(labels.domElement);
  }

  const ticks = new Set();
  const clock = new THREE.Clock();
  let raf = 0, alive = true, w = 1, h = 1;

  function resize() {
    w = Math.max(1, host.clientWidth); h = Math.max(1, host.clientHeight);
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = w + 'px';
    renderer.domElement.style.height = h + 'px';
    if (composer) composer.setSize(w, h);
    if (labels) labels.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  function frame() {
    if (!alive) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    ticks.forEach((f) => f(dt, t));
    if (composer) composer.render(); else renderer.render(scene, camera);
    if (labels) labels.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  // Pause rendering while the page is hidden or the canvas is scrolled away.
  const io = new IntersectionObserver(([e]) => {
    if (!alive) return;
    cancelAnimationFrame(raf);
    if (e.isIntersecting) { clock.getDelta(); raf = requestAnimationFrame(frame); }
  });
  io.observe(host);

  return {
    renderer, scene, camera, host, labels,
    get size() { return { w, h }; },
    tick(f) { ticks.add(f); return () => ticks.delete(f); },
    renderOnce(t = 2) { ticks.forEach((f) => f(0.016, t)); if (composer) composer.render(); else renderer.render(scene, camera); if (labels) labels.render(scene, camera); },
    dispose() {
      alive = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      });
      envTex.dispose();
      renderer.dispose();
      if (composer) composer.dispose?.();
      renderer.domElement.remove();
      if (labels) labels.domElement.remove();
    },
  };
}

/* ---------- small builders ---------- */
const metal = (color, rough = 0.35, metalness = 0.9, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness, ...extra });
const glow = (color, opacity = 1) =>
  new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, blending: opacity < 1 ? THREE.AdditiveBlending : THREE.NormalBlending, depthWrite: opacity >= 1 });

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// Leaded stained-glass panel, echoing the green-and-gold castle windows.
function glassTexture(seed = 1) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return canvasTexture(128, 512, (g, w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, '#fff2b0'); grd.addColorStop(0.35, '#f5c542'); grd.addColorStop(0.7, '#22c55e'); grd.addColorStop(1, '#064e3b');
    g.fillStyle = grd; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) {
      g.fillStyle = rnd() > 0.55 ? `rgba(16,185,129,${0.25 + rnd() * 0.5})` : `rgba(251,191,36,${0.2 + rnd() * 0.5})`;
      g.fillRect(rnd() * w, rnd() * h, 8 + rnd() * 40, 10 + rnd() * 60);
    }
    g.strokeStyle = 'rgba(10,14,10,0.85)'; g.lineWidth = 4;
    for (let y = 0; y < h; y += 40 + rnd() * 30) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (rnd() - 0.5) * 30); g.stroke(); }
    for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(rnd() * w, 0); g.lineTo(rnd() * w, h); g.stroke(); }
    g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
  });
}

function embers(count, spread, height, colors = [C.gold, C.emerald]) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), spd = new Float32Array(count);
  const tmp = new THREE.Color();
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spread;
    pos[i * 3 + 1] = Math.random() * height;
    pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    tmp.set(colors[i % colors.length]);
    col.set([tmp.r, tmp.g, tmp.b], i * 3);
    spd[i] = 0.3 + Math.random() * 0.9;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const sprite = canvasTexture(32, 32, (g) => {
    const r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,0.5)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 32, 32);
  });
  const mat = new THREE.PointsMaterial({ size: 0.18, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(geo, mat);
  pts.userData.update = (dt, t) => {
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += spd[i] * dt * 0.6;
      pos[i * 3] += Math.sin(t * 0.7 + i) * dt * 0.08;
      if (pos[i * 3 + 1] > height) pos[i * 3 + 1] = 0;
    }
    geo.attributes.position.needsUpdate = true;
  };
  return pts;
}

function shieldShape(s = 1) {
  const sh = new THREE.Shape();
  sh.moveTo(-1.1 * s, 1.25 * s);
  sh.lineTo(1.1 * s, 1.25 * s);
  sh.lineTo(1.1 * s, 0.1 * s);
  sh.quadraticCurveTo(1.05 * s, -1.0 * s, 0, -1.55 * s);
  sh.quadraticCurveTo(-1.05 * s, -1.0 * s, -1.1 * s, 0.1 * s);
  sh.closePath();
  return sh;
}

function monogramD(s = 1) {
  const sh = new THREE.Shape();
  sh.moveTo(-0.45 * s, -0.7 * s);
  sh.lineTo(0.0, -0.7 * s);
  sh.absarc(0, 0, 0.7 * s, -Math.PI / 2, Math.PI / 2, false);
  sh.lineTo(-0.45 * s, 0.7 * s);
  sh.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-0.22 * s, -0.48 * s);
  hole.lineTo(0.0, -0.48 * s);
  hole.absarc(0, 0, 0.48 * s, -Math.PI / 2, Math.PI / 2, false);
  hole.lineTo(-0.22 * s, 0.48 * s);
  hole.closePath();
  sh.holes.push(hole);
  return sh;
}

function crownShape(s = 1) {
  const sh = new THREE.Shape();
  sh.moveTo(-0.7 * s, 0);
  sh.lineTo(-0.75 * s, 0.45 * s);
  sh.lineTo(-0.38 * s, 0.22 * s);
  sh.lineTo(0, 0.62 * s);
  sh.lineTo(0.38 * s, 0.22 * s);
  sh.lineTo(0.75 * s, 0.45 * s);
  sh.lineTo(0.7 * s, 0);
  sh.closePath();
  return sh;
}

function gearShape(r = 1, teeth = 12) {
  const sh = new THREE.Shape();
  const inner = r * 0.82;
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2, a1 = ((i + 0.25) / teeth) * Math.PI * 2;
    const a2 = ((i + 0.5) / teeth) * Math.PI * 2, a3 = ((i + 0.75) / teeth) * Math.PI * 2;
    const p = (a, rr) => [Math.cos(a) * rr, Math.sin(a) * rr];
    if (i === 0) sh.moveTo(...p(a0, inner));
    sh.lineTo(...p(a1, r)); sh.lineTo(...p(a2, r)); sh.lineTo(...p(a3, inner)); sh.lineTo(...p(((i + 1) / teeth) * Math.PI * 2, inner));
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, r * 0.35, 0, Math.PI * 2, true);
  sh.holes.push(hole);
  return sh;
}

function extrude(shape, depth, mat, bevel = 0.04) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 24 });
  g.center();
  return new THREE.Mesh(g, mat);
}

function tickRing(radius, n, color, size = 0.05) {
  const grp = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 8, 160), glow(color));
  grp.add(ring);
  const box = new THREE.BoxGeometry(size, size * 4, size);
  const inst = new THREE.InstancedMesh(box, glow(color), n);
  const m = new THREE.Matrix4();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    m.makeRotationZ(a - Math.PI / 2);
    m.setPosition(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    if (i % 5 === 0) m.scale(new THREE.Vector3(1, 1.8, 1));
    inst.setMatrixAt(i, m);
  }
  grp.add(inst);
  return grp;
}

function lights(scene, keyColor = 0xfff1c1) {
  scene.add(new THREE.HemisphereLight(0x9fe8c8, 0x0a0f0a, 0.55));
  const key = new THREE.DirectionalLight(keyColor, 2.2);
  key.position.set(4, 8, 6);
  scene.add(key);
  const rim = new THREE.PointLight(C.green, 30, 30, 1.6);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const gold = new THREE.PointLight(C.gold, 25, 30, 1.6);
  gold.position.set(5, 2, 3);
  scene.add(gold);
}

/* ================= HERO: the throne-hall crest ================= */
export function createHero(host, opts = {}) {
  const st = stage(host, { still: opts.still, bloomStrength: 0.7, bloomThreshold: 0.28, fov: 40 });
  const { scene, camera } = st;
  scene.background = new THREE.Color(0x020806);
  scene.fog = new THREE.FogExp2(0x03100b, 0.045);
  lights(scene);

  // Cathedral window wall.
  const wall = new THREE.Group();
  const windows = [[0, 9, 1.3], [-2.2, 6, 0.6], [2.2, 6, 0.6], [-3.6, 4.4, 0.5], [3.6, 4.4, 0.5], [-7.5, 8, 0.8], [7.5, 8, 0.8]];
  windows.forEach(([x, hgt, wd], i) => {
    const mat = new THREE.MeshBasicMaterial({ map: glassTexture(i + 3), color: 0x8a8a8a });
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(wd, hgt), mat);
    pane.position.set(x, hgt / 2 + 0.8, -10);
    wall.add(pane);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(wd + 0.2, hgt + 0.2, 0.1), metal(0x0b0f0c, 0.6, 0.7));
    frame.position.copy(pane.position).add(new THREE.Vector3(0, 0, -0.08));
    wall.add(frame);
  });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), metal(0x050a08, 0.9, 0.2));
  back.position.set(0, 10, -10.2);
  wall.add(back);
  scene.add(wall);

  // God-ray from the great window.
  const rayMat = new THREE.MeshBasicMaterial({ color: 0xd9f99d, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const ray = new THREE.Mesh(new THREE.ConeGeometry(4.5, 16, 32, 1, true), rayMat);
  ray.position.set(0, 4, -4);
  ray.rotation.x = -0.55;
  scene.add(ray);

  // Stairs to the throne.
  const stairs = new THREE.Group();
  const stepMat = metal(0x0e1512, 0.75, 0.4);
  const edgeMat = glow(0x6b4a12);
  for (let i = 0; i < 14; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(16 - i * 0.35, 0.22, 1.1), stepMat);
    step.position.set(0, i * 0.22 - 2.4, 4 - i * 0.95);
    stairs.add(step);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(16 - i * 0.35, 0.02, 0.02), edgeMat);
    edge.position.set(0, i * 0.22 - 2.28, 4.55 - i * 0.95);
    stairs.add(edge);
  }
  scene.add(stairs);

  // Torches.
  [-4.6, 4.6].forEach((x) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 2.6, 12), metal(0x1b1b14, 0.5, 0.8));
    post.position.set(x, -0.2, -2.5);
    scene.add(post);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.2, 0.35, 20), metal(C.amber, 0.35, 0.9));
    bowl.position.set(x, 1.2, -2.5);
    scene.add(bowl);
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 16), glow(0xffa630));
    flame.position.set(x, 1.75, -2.5);
    scene.add(flame);
    const light = new THREE.PointLight(0xff9a2a, 18, 12, 1.8);
    light.position.set(x, 2, -2.3);
    scene.add(light);
    st.tick((dt, t) => { const f = 1 + Math.sin(t * 13 + x) * 0.08 + Math.sin(t * 7.3) * 0.06; flame.scale.set(f, f * 1.1, f); light.intensity = 16 * f; });
  });

  // The crest.
  const crest = new THREE.Group();
  const goldMat = metal(C.gold, 0.22, 1.0, { emissive: 0x3a2400, emissiveIntensity: 0.6 });
  const plateMat = metal(0x0f3b2c, 0.32, 0.85, { emissive: 0x021a12, emissiveIntensity: 0.6 });
  const rim = extrude(shieldShape(1.08), 0.18, goldMat, 0.05);
  const face = extrude(shieldShape(0.96), 0.3, plateMat, 0.05);
  face.position.z = 0.08;
  crest.add(rim, face);
  const mono = extrude(monogramD(0.62), 0.16, goldMat, 0.03);
  mono.position.set(0.08, -0.05, 0.32);
  crest.add(mono);
  const crown = extrude(crownShape(0.85), 0.22, goldMat, 0.03);
  crown.position.set(0, 1.62, 0.05);
  crest.add(crown);
  [-0.42, 0, 0.42].forEach((x, i) => {
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.075), glow(C.emerald));
    gem.position.set(x, 1.62 + (i === 1 ? 0.38 : 0.2), 0.2);
    crest.add(gem);
  });
  const rings = [tickRing(2.15, 60, C.gold, 0.03), tickRing(2.5, 90, C.emerald, 0.025), tickRing(2.85, 24, C.gold, 0.05)];
  rings.forEach((r) => crest.add(r));
  const halo = new THREE.Mesh(new THREE.CircleGeometry(2.2, 64), new THREE.MeshBasicMaterial({ color: 0x0b5a40, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.position.z = -0.4;
  crest.add(halo);
  crest.position.set(0, 2.75, -3.2);
  scene.add(crest);

  const motes = embers(reduced() ? 120 : 420, 18, 12);
  motes.position.set(0, -2.5, -3);
  scene.add(motes);

  const pointer = { x: 0, y: 0 };
  const onMove = (e) => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = (e.clientY / innerHeight) * 2 - 1; };
  window.addEventListener('pointermove', onMove);
  const still = reduced() || opts.still;
  camera.position.set(0, 1.4, 9.5);
  let intro = still ? 1 : 0;

  st.tick((dt, t) => {
    intro = Math.min(1, intro + dt * 0.35);
    const e = 1 - Math.pow(1 - intro, 3);
    const tx = still ? 0 : pointer.x * 0.9, ty = still ? 0 : -pointer.y * 0.5;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (1.6 + ty - camera.position.y) * 0.04;
    camera.position.z = 12.5 - e * 3.2;
    camera.lookAt(0, opts.still ? 1.6 : 0.4, -3);
    crest.rotation.y = still ? 0.18 : Math.sin(t * 0.35) * 0.32;
    crest.position.y = 2.75 + (still ? 0 : Math.sin(t * 0.9) * 0.07);
    rings[0].rotation.z = t * 0.12; rings[1].rotation.z = -t * 0.08; rings[2].rotation.z = t * 0.05;
    rings[1].rotation.x = Math.sin(t * 0.3) * 0.25;
    rayMat.opacity = 0.045 + Math.sin(t * 0.6) * 0.012;
    if (!still) motes.userData.update(dt, t);
  });

  return {
    snapshot() { st.renderOnce(3.2); return st.renderer.domElement.toDataURL('image/png'); },
    dispose() { window.removeEventListener('pointermove', onMove); st.dispose(); },
  };
}

/* ================= CAMPAIGN MAP ================= */
const ZONES = {
  hardware: { pos: new THREE.Vector3(-11, 0, 5), name: 'Hardware Foundry' },
  networks: { pos: new THREE.Vector3(11, 0, 5), name: 'Network Citadel' },
  ai: { pos: new THREE.Vector3(0, 0, -11), name: 'AI Sanctum' },
};

function gridTexture() {
  const t = canvasTexture(512, 512, (g, w, h) => {
    g.fillStyle = '#070c10'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(16,185,129,0.22)'; g.lineWidth = 1;
    for (let i = 0; i <= w; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
    g.strokeStyle = 'rgba(251,191,36,0.18)'; g.lineWidth = 2;
    for (let i = 0; i <= w; i += 128) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
  return t;
}

function zoneLandmark(unit, color, st) {
  const g = new THREE.Group();
  if (unit === 'hardware') {
    const gear = extrude(gearShape(1.6, 14), 0.35, metal(0xb88a2a, 0.3, 1, { emissive: 0x2a1800, emissiveIntensity: 0.6 }), 0.03);
    gear.rotation.x = 0; gear.position.y = 2.6;
    const gear2 = extrude(gearShape(0.9, 10), 0.3, metal(0x2d3b36, 0.3, 1), 0.03);
    gear2.position.set(1.95, 1.9, 0.1);
    g.add(gear, gear2);
    [-1.6, 1.4].forEach((x, i) => {
      const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 3 + i, 12), metal(0x1d2420, 0.6, 0.7));
      ch.position.set(x, 1.5 + i / 2, -1.4);
      g.add(ch);
      const top = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 8, 20), glow(0xff8a1f));
      top.rotation.x = Math.PI / 2; top.position.set(x, 3 + i, -1.4);
      g.add(top);
    });
    const smoke = embers(80, 3, 5, [0xff9a2a, 0xfbbf24]);
    smoke.position.set(0, 3, -1.4);
    g.add(smoke);
    st.tick((dt, t) => { gear.rotation.z = t * 0.4; gear2.rotation.z = -t * 0.62; smoke.userData.update(dt, t); });
  } else if (unit === 'networks') {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.7, 4.2, 6), metal(0x16231e, 0.45, 0.9));
    tower.position.y = 2.1;
    const spire = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.2, 6), metal(C.gold, 0.25, 1));
    spire.position.y = 4.8;
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), glow(color));
    orb.position.y = 5.6;
    g.add(tower, spire, orb);
    const sats = [];
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 1.6, 6), metal(0x16231e, 0.45, 0.9));
      s.position.set(Math.cos(a) * 2.4, 0.8, Math.sin(a) * 2.4);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), glow(color));
      b.position.set(s.position.x, 1.75, s.position.z);
      g.add(s, b);
      sats.push(b.position.clone());
    }
    // Data beams with packets running to the central tower.
    const packets = [];
    sats.forEach((p, i) => {
      const curve = new THREE.QuadraticBezierCurve3(p, new THREE.Vector3(p.x / 2, 4.2, p.z / 2), new THREE.Vector3(0, 5.6, 0));
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.018, 6), glow(color, 0.55)));
      const pk = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), glow(0xffffff));
      g.add(pk);
      packets.push({ pk, curve, off: i / 4 });
    });
    st.tick((dt, t) => {
      packets.forEach((o) => o.pk.position.copy(o.curve.getPoint((t * 0.35 + o.off) % 1)));
      orb.scale.setScalar(1 + Math.sin(t * 3) * 0.15);
    });
  } else {
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1), metal(0x241a3d, 0.3, 0.8, { emissive: 0x4c1d95, emissiveIntensity: 0.9, flatShading: true }));
    const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 1), new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.6 }));
    core.position.y = cage.position.y = 3.2;
    g.add(core, cage);
    const orbits = [0, 1, 2].map((i) => {
      const r = new THREE.Mesh(new THREE.TorusGeometry(1.8 + i * 0.35, 0.02, 6, 120), glow(i === 1 ? C.gold : color));
      r.position.y = 3.2; r.rotation.x = Math.PI / 2 + i * 0.5; r.rotation.y = i * 0.7;
      g.add(r);
      return r;
    });
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.3, 1.2, 8), metal(0x161a26, 0.5, 0.8));
    plinth.position.y = 0.6;
    g.add(plinth);
    st.tick((dt, t) => {
      core.rotation.y = t * 0.5; cage.rotation.y = -t * 0.25; cage.rotation.x = t * 0.15;
      core.position.y = cage.position.y = 3.2 + Math.sin(t) * 0.15;
      orbits.forEach((o, i) => (o.rotation.z = t * (0.3 + i * 0.15)));
    });
  }
  return g;
}

export function createMap(host, { missions, onHover, onSelect, still }) {
  const st = stage(host, { labels: true, bloomStrength: 0.75, bloomThreshold: 0.3, fov: 42, still, env: 0.55 });
  const { scene, camera, renderer } = st;
  scene.background = new THREE.Color(0x02060a);
  scene.fog = new THREE.FogExp2(0x02060a, 0.012);
  lights(scene);
  scene.add(new THREE.AmbientLight(0x8fa8a0, 1.2));
  const top = new THREE.DirectionalLight(0xfff4d6, 1.6);
  top.position.set(-10, 30, 20);
  scene.add(top);

  // Plateau.
  const plateau = new THREE.Mesh(new THREE.CylinderGeometry(27, 29, 2, 8), metal(0x0b1117, 0.7, 0.6, { map: gridTexture() }));
  plateau.position.y = -1;
  plateau.rotation.y = Math.PI / 8;
  scene.add(plateau);
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(27.2, 0.08, 6, 8), glow(C.gold));
  rimRing.rotation.x = Math.PI / 2; rimRing.rotation.z = Math.PI / 8;
  scene.add(rimRing);
  const sky = embers(still ? 0 : 500, 80, 30, [C.gold, C.emerald, 0x9aa6b8]);
  sky.position.y = -4;
  scene.add(sky);

  // Zones.
  Object.entries(ZONES).forEach(([unit, z]) => {
    const color = UNIT_COLORS[unit];
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(8.2, 8.8, 0.6, 6), metal(0x223038, 0.5, 0.75));
    pad.position.copy(z.pos).setY(0.3);
    scene.add(pad);
    const edge = new THREE.Mesh(new THREE.TorusGeometry(8.25, 0.06, 6, 6), glow(color));
    edge.rotation.x = Math.PI / 2; edge.position.copy(z.pos).setY(0.62);
    scene.add(edge);
    const inner = new THREE.Mesh(new THREE.RingGeometry(2.8, 3, 64), glow(color, 0.5));
    inner.rotation.x = -Math.PI / 2; inner.position.copy(z.pos).setY(0.63);
    scene.add(inner);
    const lm = zoneLandmark(unit, color, st);
    lm.position.copy(z.pos).setY(0.6);
    scene.add(lm);
    const el = document.createElement('div');
    el.className = 'zone-label zone-' + unit;
    el.innerHTML = `<span>${z.name}</span>`;
    const lbl = new CSS2DObject(el);
    const out = z.pos.clone().setY(0).normalize();
    lbl.position.copy(z.pos).addScaledVector(out, 8.6).setY(1.2);
    scene.add(lbl);
  });

  // Mission nodes.
  const byUnit = {};
  missions.forEach((m) => (byUnit[m.unit] = byUnit[m.unit] || []).push(m));
  const nodes = new Map();
  const pickables = [];
  Object.entries(byUnit).forEach(([unit, list]) => {
    const z = ZONES[unit].pos;
    // Open the arc of nodes towards the plateau centre so paths read clearly.
    const facing = Math.atan2(-z.z, -z.x);
    list.forEach((m, i) => {
      const spread = Math.min(Math.PI * 1.5, list.length * 0.62);
      const a = facing - spread / 2 + (spread * (i + 0.5)) / list.length;
      const r = 5.6;
      const p = new THREE.Vector3(z.x + Math.cos(a) * r, 0.6, z.z + Math.sin(a) * r);
      nodes.set(m.n, { m, p });
    });
  });

  nodes.forEach((node) => {
    const color = UNIT_COLORS[node.m.unit];
    const g = new THREE.Group();
    g.position.copy(node.p);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.35, 6), metal(0x34404c, 0.4, 0.85));
    base.position.y = 0.17;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.05, 6, 6), glow(color));
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.36;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), metal(color, 0.2, 0.6, { emissive: color, emissiveIntensity: 1.2 }));
    gem.position.y = 1.6;
    const beamMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.5, 5, 16, 1, true), beamMat);
    beam.position.y = 2.6;
    const flag = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 6), metal(C.gold, 0.3, 1));
    pole.position.y = 0.75;
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.42), new THREE.MeshStandardMaterial({ color: 0x0f5132, emissive: 0x064e3b, side: THREE.DoubleSide }));
    cloth.position.set(0.37, 1.25, 0);
    flag.add(pole, cloth);
    flag.position.set(0.55, 0.35, 0);
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.34, 0.16), metal(0x55606e, 0.5, 0.8));
    lock.position.y = 1.1;
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.04, 6, 16, Math.PI), metal(0x55606e, 0.5, 0.8));
    shackle.position.y = 1.27;
    lock.add(shackle); shackle.position.set(0, 0.17, 0);
    const pick = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3.2, 8), new THREE.MeshBasicMaterial({ visible: false }));
    pick.position.y = 1.4;
    pick.userData.n = node.m.n;
    pickables.push(pick);
    g.add(base, ring, gem, beam, flag, lock, pick);
    scene.add(g);

    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'node-label';
    el.innerHTML = `<b>${String(node.m.n).padStart(2, '0')}</b><span>${node.m.title}</span><i class="node-stars"></i>`;
    el.addEventListener('click', (e) => { e.stopPropagation(); onSelect && onSelect(node.m.n); });
    el.addEventListener('pointerenter', () => setHover(node.m.n));
    el.addEventListener('pointerleave', () => setHover(null));
    const lbl = new CSS2DObject(el);
    lbl.position.set(0, 2.55, 0);
    g.add(lbl);
    Object.assign(node, { g, gem, beam, beamMat, ring, flag, lock, el, state: 'locked', hover: 0 });
  });

  // Campaign route: one arc per consecutive pair of missions.
  const edges = [];
  const order = [...nodes.keys()].sort((a, b) => a - b);
  for (let i = 0; i < order.length - 1; i++) {
    const a = nodes.get(order[i]).p.clone().setY(1.2), b = nodes.get(order[i + 1]).p.clone().setY(1.2);
    const lift = Math.min(6, a.distanceTo(b) * 0.28) + 0.6;
    const mid = a.clone().lerp(b, 0.5).setY(1.2 + lift);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const mat = new THREE.MeshBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.55 });
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.045, 6), mat);
    scene.add(tube);
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), glow(0xfff3c4));
    spark.visible = false;
    scene.add(spark);
    edges.push({ from: order[i], to: order[i + 1], curve, mat, spark });
  }

  // Controls and camera choreography.
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 14;
  controls.maxDistance = 62;
  controls.minPolarAngle = 0.35;
  controls.maxPolarAngle = 1.2;
  controls.target.set(0, 1, 0);
  const HOME = { target: new THREE.Vector3(-4, 0, 0), pos: new THREE.Vector3(-4, 27, 31) };
  camera.position.set(-4, 45, 55);
  const want = { target: HOME.target.clone(), pos: HOME.pos.clone(), active: true };
  controls.addEventListener('start', () => (want.active = false));

  let hovered = null;
  function setHover(n) {
    if (hovered === n) return;
    hovered = n;
    renderer.domElement.style.cursor = n ? 'pointer' : '';
    nodes.forEach((node, k) => node.el.classList.toggle('hover', k === n));
    onHover && onHover(n);
  }
  const ray = new THREE.Raycaster();
  const v2 = new THREE.Vector2();
  let downAt = null;
  function pickAt(e) {
    const r = renderer.domElement.getBoundingClientRect();
    v2.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(v2, camera);
    const hit = ray.intersectObjects(pickables, false)[0];
    return hit ? hit.object.userData.n : null;
  }
  const onMove = (e) => setHover(pickAt(e));
  const onDown = (e) => (downAt = [e.clientX, e.clientY]);
  const onUp = (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
    const n = pickAt(e);
    if (n && onSelect) onSelect(n);
  };
  renderer.domElement.addEventListener('pointermove', onMove);
  renderer.domElement.addEventListener('pointerdown', onDown);
  renderer.domElement.addEventListener('pointerup', onUp);

  st.tick((dt, t) => {
    if (want.active) {
      controls.target.lerp(want.target, 0.05);
      camera.position.lerp(want.pos, 0.05);
      if (camera.position.distanceTo(want.pos) < 0.05) want.active = false;
    }
    controls.update();
    nodes.forEach((node) => {
      const on = node.state !== 'locked';
      node.hover += ((hovered === node.m.n ? 1 : 0) - node.hover) * 0.15;
      node.gem.rotation.y = t * (on ? 1.2 : 0.3);
      node.gem.position.y = 1.6 + (on ? Math.sin(t * 2 + node.m.n) * 0.12 : 0);
      node.gem.scale.setScalar(1 + node.hover * 0.35);
      const pulse = node.state === 'open' ? 0.22 + Math.sin(t * 3 + node.m.n) * 0.1 : node.state === 'cleared' ? 0.14 : 0.0;
      node.beamMat.opacity = pulse + node.hover * 0.15;
      node.flag.rotation.y = Math.sin(t * 2 + node.m.n) * 0.25;
    });
    edges.forEach((e, i) => {
      if (!e.spark.visible) return;
      e.spark.position.copy(e.curve.getPoint((t * 0.4 + i * 0.13) % 1));
    });
    if (!still) sky.userData.update(dt * 0.3, t);
  });

  return {
    setState(states) {
      nodes.forEach((node, n) => {
        const s = states[n] || { state: 'locked' };
        node.state = s.state;
        const on = s.state !== 'locked';
        const color = UNIT_COLORS[node.m.unit];
        node.gem.material.color.set(on ? color : 0x3b4250);
        node.gem.material.emissive.set(on ? (s.state === 'cleared' ? C.gold : color) : 0x000000);
        node.gem.material.emissiveIntensity = s.state === 'cleared' ? 0.9 : 1.2;
        node.ring.material.color.set(s.state === 'cleared' ? C.gold : on ? color : 0x2a313c);
        node.beam.visible = on;
        node.flag.visible = s.state === 'cleared';
        node.lock.visible = !on;
        node.el.className = 'node-label is-' + s.state + (hovered === n ? ' hover' : '');
        node.el.querySelector('.node-stars').textContent = s.state === 'cleared' ? '★'.repeat(s.stars || 1) + '☆'.repeat(3 - (s.stars || 1)) : '';
      });
      edges.forEach((e) => {
        const a = states[e.from]?.state, b = states[e.to]?.state;
        const done = a === 'cleared' && b !== 'locked';
        e.mat.color.set(done ? (b === 'cleared' ? C.gold : C.emerald) : 0x334155);
        e.mat.opacity = done ? 0.95 : 0.4;
        e.spark.visible = a === 'cleared' && b === 'open';
      });
    },
    focus(n) {
      const node = n && nodes.get(n);
      if (!node) { want.target.copy(HOME.target); want.pos.copy(HOME.pos); want.active = true; return; }
      want.target.copy(node.p).setY(1.2);
      const dir = node.p.clone().setY(0).normalize();
      want.pos.copy(node.p).add(dir.multiplyScalar(12)).setY(13);
      want.active = true;
    },
    overview() { this.focus(null); },
    snapshot() {
      camera.position.set(0, 34, 34); controls.target.set(0, 0.5, 1); controls.update();
      want.active = false;
      st.renderOnce(2);
      return renderer.domElement.toDataURL('image/png');
    },
    dispose() {
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      controls.dispose();
      st.dispose();
    },
  };
}

/* ================= ARENA ENEMIES: minibosses and The Professor ================= */
// One controller drives every enemy: idle sway, wind-up glow, a lunge with a projectile,
// parry sparks, stagger, phase colours and a shatter on defeat. Builders only make the body.
const BOSS_LOOK = {
  hardware: { accent: 0xf5b330, glowc: 0xff8a1f, bg: 0x0c0705 },
  networks: { accent: 0x2ee6a6, glowc: 0x34d399, bg: 0x030f0b },
  ai: { accent: 0xb79cff, glowc: 0xc084fc, bg: 0x08061a },
  professor: { accent: 0x34d399, glowc: 0x6ee7b7, bg: 0x040908 },
};

function dotSprite() {
  return canvasTexture(32, 32, (g) => {
    const r = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,0.5)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r; g.fillRect(0, 0, 32, 32);
  });
}

function sparkPool(scene, n = 140) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), life = new Float32Array(n);
  const vel = Array.from({ length: n }, () => new THREE.Vector3());
  const base = Array.from({ length: n }, () => new THREE.Color());
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.16, map: dotSprite(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  pts.frustumCulled = false;
  scene.add(pts);
  let next = 0;
  return {
    burst(at, count, color, speed = 4) {
      for (let k = 0; k < count; k++) {
        const i = next; next = (next + 1) % n;
        pos.set([at.x, at.y, at.z], i * 3);
        vel[i].set(Math.random() - 0.5, Math.random() - 0.3, Math.random() * 0.6 - 0.1).normalize().multiplyScalar(speed * (0.4 + Math.random()));
        life[i] = 1;
        base[i].set(color);
      }
    },
    update(dt) {
      for (let i = 0; i < n; i++) {
        if (life[i] > 0) {
          life[i] -= dt * 1.5;
          pos[i * 3] += vel[i].x * dt; pos[i * 3 + 1] += vel[i].y * dt; pos[i * 3 + 2] += vel[i].z * dt;
          vel[i].y -= 6 * dt; vel[i].multiplyScalar(0.97);
        }
        const l = Math.max(0, life[i]);
        col[i * 3] = base[i].r * l; col[i * 3 + 1] = base[i].g * l; col[i * 3 + 2] = base[i].b * l;
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
    },
  };
}

// A material whose emissive glow the controller pulses with the wind-up and phase colour.
const ember = (color, intensity = 2, base = 0x110804) => {
  const m = new THREE.MeshStandardMaterial({ color: base, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });
  m.userData.glow = intensity;
  return m;
};
const mesh = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); return m; };

/* Hardware: the Forge Golem, an iron furnace with brass fists. */
function buildGolem(L) {
  const g = new THREE.Group();
  const iron = metal(0x58514a, 0.5, 0.8), brass = metal(0xc9952b, 0.3, 1), fire = ember(L.glowc, 1.8);
  g.add(mesh(new THREE.BoxGeometry(1.7, 1.45, 1.0), iron, 0, 0.15, 0));
  g.add(mesh(new THREE.BoxGeometry(1.2, 0.6, 0.85), iron, 0, -0.85, 0));
  g.add(mesh(new THREE.BoxGeometry(1.75, 0.12, 1.05), brass, 0, 0.85, 0));
  g.add(mesh(new THREE.CircleGeometry(0.36, 6), fire, 0, 0.15, 0.505));
  for (let i = -1; i <= 1; i++) g.add(mesh(new THREE.BoxGeometry(0.66, 0.05, 0.05), brass, 0, 0.15 + i * 0.16, 0.53));
  const head = new THREE.Group();
  head.position.y = 1.2;
  head.add(mesh(new THREE.BoxGeometry(0.72, 0.56, 0.66), iron));
  head.add(mesh(new THREE.BoxGeometry(0.52, 0.09, 0.05), fire, 0, 0.02, 0.34));
  [-1, 1].forEach((s) => { const horn = mesh(new THREE.ConeGeometry(0.1, 0.42, 6), brass, s * 0.3, 0.42, 0); horn.rotation.z = -s * 0.35; head.add(horn); });
  g.add(head);
  const arms = [-1, 1].map((s) => {
    g.add(mesh(new THREE.BoxGeometry(0.72, 0.5, 0.72), brass, s * 1.15, 0.68, 0));
    const arm = new THREE.Group();
    arm.position.set(s * 1.15, 0.55, 0);
    arm.add(mesh(new THREE.BoxGeometry(0.42, 1.0, 0.42), iron, 0, -0.55, 0));
    arm.add(mesh(new THREE.BoxGeometry(0.62, 0.55, 0.62), brass, 0, -1.25, 0));
    g.add(arm);
    return arm;
  });
  const gear = extrude(gearShape(0.95, 10), 0.12, brass);
  gear.position.set(0, 0.45, -0.62);
  g.add(gear);
  const hand = new THREE.Object3D(); hand.position.set(0, -1.3, 0.35); arms[1].add(hand);
  const projectile = new THREE.Mesh(new THREE.IcosahedronGeometry(0.24, 0), ember(L.glowc, 3));
  return {
    group: g, arm: arms[1], hand, projectile,
    update(dt, t, s) { gear.rotation.z += dt * (0.5 + s.wind * 4); arms[0].rotation.x = Math.sin(t * 1.3) * 0.08; },
  };
}

/* Networks: the Relay Sentinel, a glass obelisk with orbiting packet nodes. */
function buildSentinel(L) {
  const g = new THREE.Group();
  const core = mesh(new THREE.SphereGeometry(0.42, 32, 24), ember(L.glowc, 1.5));
  g.add(core);
  const shellGeo = new THREE.OctahedronGeometry(1, 0);
  const shell = new THREE.Mesh(shellGeo, metal(0x12312b, 0.25, 0.9, { transparent: true, opacity: 0.5 }));
  shell.scale.set(0.95, 1.75, 0.95);
  g.add(shell);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), new THREE.LineBasicMaterial({ color: L.accent }));
  edges.scale.copy(shell.scale);
  g.add(edges);
  const plates = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const p = mesh(new THREE.BoxGeometry(0.5, 1.3, 0.06), metal(0x1d3b36, 0.35, 0.9), 0, 0, 0);
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    p.position.set(Math.cos(a) * 1.15, 0, Math.sin(a) * 1.15);
    p.lookAt(0, 0, 0);
    plates.add(p);
  }
  g.add(plates);
  g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), metal(0xc9952b, 0.3, 1), 0, 2.05, 0));
  const tip = mesh(new THREE.SphereGeometry(0.12, 16, 12), ember(L.glowc, 3), 0, 2.5, 0);
  g.add(tip);
  const nodes = [];
  const nodeMat = ember(L.accent, 2.2);
  for (let i = 0; i < 6; i++) { const n = mesh(new THREE.SphereGeometry(0.11, 16, 12), nodeMat); nodes.push(n); g.add(n); }
  const lineGeo = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 7 }, () => new THREE.Vector3()));
  const web = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: L.accent, transparent: true, opacity: 0.55 }));
  g.add(web);
  g.scale.setScalar(0.85);
  g.position.y = -0.35;
  const projectile = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), ember(L.glowc, 3));
  return {
    group: g, hand: tip, projectile,
    update(dt, t, s) {
      plates.rotation.y += dt * (0.4 + s.wind * 3);
      const pts = nodes.map((n, i) => {
        const a = t * (0.7 + s.wind * 2) + (i / nodes.length) * Math.PI * 2;
        n.position.set(Math.cos(a) * 1.75, Math.sin(a * 2 + i) * 0.5, Math.sin(a) * 1.75);
        return n.position;
      });
      lineGeo.setFromPoints([...pts, pts[0]]);
      core.scale.setScalar(1 + s.wind * 0.35 + Math.sin(t * 5) * 0.04);
    },
  };
}

/* Behaviorist AI: the Mind Eye, a floating iris inside rotating rings. */
function buildEye(L) {
  const g = new THREE.Group();
  const ball = new THREE.Group();
  ball.add(mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.MeshStandardMaterial({ color: 0x9d96bb, roughness: 0.5, metalness: 0.1 })));
  const iris = mesh(new THREE.SphereGeometry(1.012, 48, 16, 0, Math.PI * 2, 0, 0.5), ember(L.glowc, 1.3, 0x1a0b33));
  iris.rotation.x = Math.PI / 2;
  ball.add(iris);
  const pupil = mesh(new THREE.SphereGeometry(1.02, 48, 12, 0, Math.PI * 2, 0, 0.2), new THREE.MeshBasicMaterial({ color: 0x05020c }));
  pupil.rotation.x = Math.PI / 2;
  ball.add(pupil);
  g.add(ball);
  const lidMat = metal(0x2a2440, 0.4, 0.9);
  const lidTop = mesh(new THREE.SphereGeometry(1.08, 48, 16, 0, Math.PI * 2, 0, Math.PI / 2), lidMat);
  const lidBot = mesh(new THREE.SphereGeometry(1.08, 48, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), lidMat);
  g.add(lidTop, lidBot);
  const rings = [1.55, 1.85, 2.15].map((r, i) => {
    const ring = mesh(new THREE.TorusGeometry(r, 0.025, 8, 120), ember(i === 1 ? C.gold : L.accent, 1.6));
    ring.rotation.set(Math.PI / 2 + (i - 1) * 0.5, i * 0.6, 0);
    g.add(ring);
    return ring;
  });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const spike = mesh(new THREE.ConeGeometry(0.1, 0.7, 6), lidMat, Math.cos(a) * 1.25, Math.sin(a) * 1.25, -0.45);
    spike.rotation.z = a - Math.PI / 2;
    g.add(spike);
  }
  const hand = new THREE.Object3D(); hand.position.set(0, 0, 1.05); ball.add(hand);
  const projectile = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), ember(L.glowc, 3.5));
  let blink = 0;
  return {
    group: g, hand, projectile,
    update(dt, t, s) {
      rings.forEach((r, i) => { r.rotation.z += dt * (0.4 + i * 0.25) * (1 + s.wind * 3) * (i % 2 ? -1 : 1); });
      blink = (t % 4.2) < 0.15 ? 1 : Math.max(0, blink - dt * 8);
      const open = 0.62 - blink * 0.55 + s.wind * 0.25;
      lidTop.rotation.x = -open; lidBot.rotation.x = open;
      ball.rotation.y = Math.sin(t * 0.7) * 0.25 * (1 - s.wind);
      ball.rotation.x = Math.sin(t * 0.5) * 0.12;
      pupil.scale.setScalar(1 - s.wind * 0.04);
    },
  };
}

/* Final boss: The Professor, levitating, with short dark hair, thin metal glasses and a navy sweater. */
function buildProfessor(L) {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: 0xe0b594, roughness: 0.6, metalness: 0 });
  // A fine vertical rib so the sweater reads as knitwear.
  const knit = (base, line) => {
    const tex = canvasTexture(128, 128, (c, w, h) => {
      c.fillStyle = base; c.fillRect(0, 0, w, h);
      c.strokeStyle = line; c.lineWidth = 2;
      for (let x = 0; x <= w; x += 8) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    });
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 2);
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 });
  };
  const navy = knit('#28324f', 'rgba(255,255,255,0.05)');
  const grey = knit('#6b7280', 'rgba(0,0,0,0.12)');
  const black = new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.9 });
  const rim = metal(0xb9a46a, 0.22, 1);

  // Torso: a navy crew-neck sweater with grey shoulder panels.
  const torso = mesh(new THREE.CylinderGeometry(0.95, 0.8, 1.9, 32), navy, 0, -0.55, 0);
  torso.scale.z = 0.62;
  g.add(torso);
  [-1, 1].forEach((s) => {
    const sh = mesh(new THREE.SphereGeometry(0.42, 24, 16), grey, s * 0.84, 0.28, 0);
    sh.scale.set(1.1, 0.75, 0.8);
    g.add(sh);
    const yoke = mesh(new THREE.BoxGeometry(0.42, 0.22, 1.02), grey, s * 0.64, 0.33, 0);
    yoke.rotation.z = -s * 0.22;
    g.add(yoke);
  });
  const collar = mesh(new THREE.TorusGeometry(0.25, 0.05, 10, 32), navy, 0, 0.4, 0.02);
  collar.rotation.x = Math.PI / 2;
  collar.scale.set(1, 0.85, 1);
  g.add(collar);
  g.add(mesh(new THREE.CylinderGeometry(0.19, 0.21, 0.32, 20), skin, 0, 0.52, 0));

  // Head: calm, neutral face with very short hair and rimless glasses.
  const head = new THREE.Group();
  head.position.set(0, 1.08, 0.02);
  const skull = mesh(new THREE.SphereGeometry(0.5, 48, 32), skin);
  skull.scale.set(0.9, 1.1, 0.97);
  head.add(skull);
  // Short, dark, neatly cut hair with the hairline high on the forehead.
  const hair = mesh(new THREE.SphereGeometry(0.515, 48, 32, 0, Math.PI * 2, 0, 1.35), new THREE.MeshStandardMaterial({ color: 0x15110f, roughness: 0.95 }));
  hair.scale.set(0.93, 1.14, 1.0);
  hair.rotation.x = -0.35;
  head.add(hair);
  [-1, 1].forEach((s) => { const ear = mesh(new THREE.SphereGeometry(0.11, 16, 12), skin, s * 0.45, -0.02, -0.02); ear.scale.set(0.45, 1, 0.7); head.add(ear); });
  [-1, 1].forEach((s) => {
    const white = mesh(new THREE.SphereGeometry(0.058, 16, 12), new THREE.MeshStandardMaterial({ color: 0xf2ece6, roughness: 0.4 }), s * 0.16, 0.03, 0.43);
    white.scale.set(1.1, 0.5, 0.45);
    head.add(white);
    head.add(mesh(new THREE.SphereGeometry(0.03, 12, 10), new THREE.MeshBasicMaterial({ color: 0x1b130e }), s * 0.16, 0.03, 0.455));
    const brow = mesh(new THREE.BoxGeometry(0.17, 0.024, 0.03), new THREE.MeshStandardMaterial({ color: 0x2a2019, roughness: 0.9 }), s * 0.16, 0.13, 0.45);
    brow.rotation.z = -s * 0.06;
    head.add(brow);
  });
  const nose = mesh(new THREE.SphereGeometry(0.065, 16, 12), skin, 0, -0.08, 0.5);
  nose.scale.set(0.8, 1.35, 1);
  head.add(nose);
  head.add(mesh(new THREE.BoxGeometry(0.15, 0.016, 0.02), new THREE.MeshStandardMaterial({ color: 0x8c5b4b, roughness: 0.7 }), 0, -0.24, 0.45));

  const glasses = new THREE.Group();
  glasses.position.set(0, 0.035, 0.51);
  const lw = 0.13, lh = 0.08;
  const rounded = (sh, w, h, r) => {
    sh.moveTo(-w + r, -h); sh.lineTo(w - r, -h); sh.quadraticCurveTo(w, -h, w, -h + r);
    sh.lineTo(w, h - r); sh.quadraticCurveTo(w, h, w - r, h); sh.lineTo(-w + r, h);
    sh.quadraticCurveTo(-w, h, -w, h - r); sh.lineTo(-w, -h + r); sh.quadraticCurveTo(-w, -h, -w + r, -h);
    return sh;
  };
  const lensShape = rounded(new THREE.Shape(), lw, lh, 0.035);
  // Thin full metal rims, as in the photo.
  const frameShape = rounded(new THREE.Shape(), lw + 0.014, lh + 0.014, 0.045);
  frameShape.holes.push(rounded(new THREE.Path(), lw, lh, 0.035));
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0xe6f2ff, transparent: true, opacity: 0.2, roughness: 0.05, metalness: 0, clearcoat: 1 });
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  [-1, 1].forEach((s) => {
    const lens = new THREE.Mesh(new THREE.ShapeGeometry(lensShape), lensMat);
    lens.position.x = s * 0.16; lens.rotation.y = s * 0.12;
    glasses.add(lens);
    const glint = new THREE.Mesh(new THREE.ShapeGeometry(lensShape), glintMat);
    glint.position.set(s * 0.16, 0, 0.004); glint.rotation.y = s * 0.12;
    glasses.add(glint);
    const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(frameShape, { depth: 0.012, bevelEnabled: false, curveSegments: 12 }), rim);
    frame.position.set(s * 0.16, 0, -0.004); frame.rotation.y = s * 0.12;
    glasses.add(frame);
    const temple = mesh(new THREE.BoxGeometry(0.01, 0.01, 0.5), rim, s * 0.3, lh - 0.01, -0.25);
    temple.rotation.y = s * 0.06;
    glasses.add(temple);
  });
  glasses.add(mesh(new THREE.BoxGeometry(0.06, 0.01, 0.01), rim, 0, 0.04, 0));
  head.add(glasses);
  g.add(head);

  // Arms: chalk in the right hand, a green-and-gold tome in the left.
  const arms = [-1, 1].map((s) => {
    const arm = new THREE.Group();
    arm.position.set(s * 0.98, 0.22, 0);
    arm.rotation.z = s * 0.12;
    arm.add(mesh(new THREE.CylinderGeometry(0.19, 0.17, 1.25, 20), navy, 0, -0.62, 0));
    arm.add(mesh(new THREE.CylinderGeometry(0.175, 0.175, 0.08, 20), black, 0, -1.27, 0));
    arm.add(mesh(new THREE.SphereGeometry(0.15, 20, 14), skin, 0, -1.4, 0.02));
    g.add(arm);
    return arm;
  });
  const chalkMat = ember(0xffffff, 0.6, 0xf2f2ea);
  const chalk = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.26, 10), chalkMat, 0, -1.5, 0.12);
  chalk.rotation.x = Math.PI / 2;
  arms[1].add(chalk);
  const tome = new THREE.Group();
  tome.position.set(0.05, -1.45, 0.25);
  tome.rotation.set(-0.3, 0.3, 0);
  tome.add(mesh(new THREE.BoxGeometry(0.46, 0.6, 0.12), new THREE.MeshStandardMaterial({ color: 0x0f3d2c, roughness: 0.6 })));
  tome.add(mesh(new THREE.BoxGeometry(0.42, 0.56, 0.125), new THREE.MeshStandardMaterial({ color: 0xefe6cf, roughness: 0.9 }), 0.02, 0, 0));
  const seal = extrude(monogramD(0.12), 0.02, metal(0xc9952b, 0.3, 1), 0.005);
  seal.position.z = 0.07;
  tome.add(seal);
  arms[0].add(tome);

  // Doom regalia: a deep green cape, a levitation aura and a gold rune halo.
  const cape = mesh(new THREE.CylinderGeometry(0.95, 1.35, 2.7, 32, 1, true, Math.PI / 2 + 0.25, Math.PI - 0.5), new THREE.MeshStandardMaterial({ color: 0x0b3a2a, roughness: 0.7, side: THREE.DoubleSide }), 0, -0.95, -0.05);
  g.add(cape);
  const aura = mesh(new THREE.ConeGeometry(0.85, 1.7, 32, 1, true), new THREE.MeshBasicMaterial({ color: L.glowc, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), 0, -2.3, 0);
  aura.rotation.x = Math.PI;
  aura.material.userData.aura = true;
  g.add(aura);
  const halo = tickRing(0.95, 40, C.gold, 0.025);
  halo.position.set(0, 1.12, -0.45);
  g.add(halo);

  // Floating chalk sticks and torn pages orbit him.
  const orbit = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const page = i % 2;
    const o = page
      ? mesh(new THREE.PlaneGeometry(0.28, 0.36), new THREE.MeshStandardMaterial({ color: 0xefe6cf, roughness: 0.9, side: THREE.DoubleSide }))
      : mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.24, 8), ember(0xffffff, 0.4, 0xf2f2ea));
    o.userData.a = (i / 10) * Math.PI * 2; o.userData.r = 2.0 + (i % 3) * 0.2; o.userData.y = (i % 4) * 0.45 - 0.8;
    orbit.add(o);
  }
  g.add(orbit);
  g.scale.setScalar(1.05);

  const hand = new THREE.Object3D(); hand.position.set(0, -1.5, 0.2); arms[1].add(hand);
  const projectile = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.42, 10), ember(0xffffff, 2.5, 0xffffff));
  return {
    group: g, arm: arms[1], hand, projectile, glasses, glintMat,
    update(dt, t, s) {
      orbit.children.forEach((o) => {
        const a = o.userData.a + t * (0.35 + s.wind * 1.5);
        o.position.set(Math.cos(a) * o.userData.r, o.userData.y + Math.sin(t + o.userData.a) * 0.15, Math.sin(a) * o.userData.r);
        o.rotation.set(t + o.userData.a, t * 0.7, 0);
      });
      halo.rotation.z = t * 0.3;
      head.rotation.y = Math.sin(t * 0.45) * 0.08;
      arms[0].rotation.x = Math.sin(t * 1.1) * 0.06 - 0.15;
      // Adjusting the glasses: a small lift, then the lenses flash.
      glasses.position.y = 0.035 + Math.sin(s.glasses * Math.PI) * 0.035;
      glintMat.opacity = Math.max(Math.sin(s.glasses * Math.PI) * 0.9, s.wind * 0.55);
    },
  };
}

export function createBoss(host, { variant = 'hardware', still = false } = {}) {
  const L = BOSS_LOOK[variant] || BOSS_LOOK.hardware;
  const prof = variant === 'professor';
  const st = stage(host, { still, bloomStrength: 0.45, bloomThreshold: 0.88, fov: 34, env: 0.75, exposure: 1.0 });
  const { scene, camera } = st;
  scene.background = new THREE.Color(L.bg);
  scene.fog = new THREE.Fog(L.bg, 10, 24);
  lights(scene);
  camera.position.set(0, prof ? 0.9 : 0.35, prof ? 10.5 : 8.6);
  camera.lookAt(0, prof ? 0.75 : 0, 0);
  const accentLight = new THREE.PointLight(L.glowc, 12, 9, 1.5);
  accentLight.position.set(0, 1.2, -1.8);
  scene.add(accentLight);
  const under = new THREE.PointLight(0xff3344, 0, 8, 1.6);
  under.position.set(0, -2.6, 1.6);
  scene.add(under);
  const floorY = prof ? -3.1 : -2.3;
  const rune = tickRing(2.5, 60, L.accent, 0.03);
  rune.rotation.x = -Math.PI / 2; rune.position.y = floorY;
  scene.add(rune);
  const disc = mesh(new THREE.CircleGeometry(2.5, 64), new THREE.MeshBasicMaterial({ color: L.accent, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false }), 0, floorY + 0.01, 0);
  disc.rotation.x = -Math.PI / 2;
  scene.add(disc);
  const dust = embers(70, 11, 7, [L.accent, C.gold]);
  dust.position.y = floorY;
  scene.add(dust);

  const B = (prof ? buildProfessor : variant === 'networks' ? buildSentinel : variant === 'ai' ? buildEye : buildGolem)(L);
  const rig = new THREE.Group();
  rig.add(B.group);
  scene.add(rig);
  const sp = sparkPool(scene);
  const proj = B.projectile;
  proj.visible = false;
  scene.add(proj);
  // Every mesh gets its own material so it can fade out on its own when the enemy shatters.
  const pieces = [];
  B.group.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); pieces.push(o); } });
  const glows = pieces.filter((o) => o.material.userData.glow).map((o) => o.material);
  const aura = pieces.find((o) => o.material.userData.aura);

  const phase = new THREE.Color(L.glowc);
  let wind = 0, lunge = 0, recoil = 0, shake = 0, flash = 0, glasses = 0, hp = 1, dead = false, deadT = 0, shot = null;
  st.tick((dt, t) => {
    sp.update(dt);
    dust.userData.update(dt, t);
    rune.rotation.z += dt * 0.15 * (1 + wind * 4);
    shake = Math.max(0, shake - dt * 2.5); lunge = Math.max(0, lunge - dt * 2.4); recoil = Math.max(0, recoil - dt * 2);
    flash = Math.max(0, flash - dt * 3); glasses = Math.max(0, glasses - dt * 1.1);
    if (!dead) {
      rig.position.set((Math.random() - 0.5) * shake * 0.35, Math.sin(t * 1.4) * 0.1, lunge * 1.5 - recoil * 0.8);
      rig.rotation.y = Math.sin(t * 0.6) * (prof ? 0.08 : 0.18);
      rig.rotation.x = -wind * 0.1 + recoil * 0.22 - lunge * 0.12;
      if (B.arm) {
        const target = lunge > 0.05 ? -0.5 : -wind * 2.6;
        B.arm.rotation.x += (target - B.arm.rotation.x) * Math.min(1, dt * 12);
      }
      glows.forEach((m) => { m.emissive.copy(m.userData.keep ? m.emissive : phase); m.emissiveIntensity = m.userData.glow * (1 + wind * 1.6 + flash * 1.5); });
      if (aura) { aura.material.color.copy(phase); aura.material.opacity = 0.1 + wind * 0.25 + Math.sin(t * 3) * 0.04; }
      accentLight.color.copy(phase);
      accentLight.intensity = 8 + wind * 22 + flash * 25;
      under.intensity = shake * 40 + (1 - hp) * 10;
      B.update(dt, t, { wind, glasses });
    } else {
      deadT += dt;
      pieces.forEach((p) => {
        p.position.addScaledVector(p.userData.vel, dt);
        p.userData.vel.y -= dt * 3;
        p.rotation.x += dt * 3; p.rotation.y += dt * 2;
        p.material.transparent = true;
        p.material.opacity = Math.max(0, 1 - deadT / 1.8);
      });
      accentLight.intensity = Math.max(0, 40 - deadT * 30);
    }
    if (shot) {
      shot.t += dt;
      const k = Math.min(1, shot.t / shot.dur);
      proj.position.lerpVectors(shot.from, shot.to, k * k);
      proj.rotation.x += dt * 12; proj.rotation.z += dt * 7;
      if (k >= 1) { proj.visible = false; sp.burst(shot.to, 20, L.glowc, 3); shot = null; }
    }
  });
  const handPos = () => B.hand.getWorldPosition(new THREE.Vector3());
  const chest = () => new THREE.Vector3(0, prof ? 0.4 : 0.2, 1.3);
  return {
    /** Charge level of the coming attack, 0..1. */
    windup(p) { wind = Math.max(0, Math.min(1, p)); },
    /** The blow lands: lunge and throw the projectile at the player. Returns its flight time in ms. */
    attack() {
      lunge = 1; wind = 0;
      const from = handPos();
      shot = { t: 0, dur: 0.38, from, to: new THREE.Vector3(0, 0.1, camera.position.z - 1.3) };
      proj.position.copy(from); proj.visible = true;
      return 380;
    },
    /** A correct answer deflects the attack; perfect parries throw gold sparks. */
    parried(perfect) {
      wind = 0; recoil = 1; shake = 0.7; flash = 1;
      if (shot) { proj.visible = false; shot = null; }
      sp.burst(handPos(), perfect ? 60 : 30, perfect ? C.gold : 0xffffff, perfect ? 6 : 4);
    },
    /** The counter-attack lands; remaining is the enemy's health, 0..1. */
    hit(remaining) { hp = remaining; shake = 1; flash = 0.6; sp.burst(chest(), 26, 0xff5544, 4.5); },
    stagger() { shake = 1.3; recoil = 1; },
    taunt() { shake = 0.4; glasses = prof ? 1 : 0; },
    adjustGlasses() { glasses = 1; },
    enrage(color) { phase.set(color); flash = 1; shake = 0.9; sp.burst(chest(), 50, color, 5); },
    defeat() {
      dead = true;
      pieces.forEach((p) => { p.userData.vel = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.8, Math.random() - 0.3).multiplyScalar(4 + Math.random() * 3); });
      sp.burst(chest(), 120, C.gold, 7);
    },
    snapshot() { st.renderOnce(1.3); return st.renderer.domElement.toDataURL('image/png'); },
    /** Video capture only: move the camera (the arena never calls this). */
    setCamera({ x = 0, y = 0.35, z = 8.6, lookY = 0 } = {}) { camera.position.set(x, y, z); camera.lookAt(0, lookY, 0); },
    dispose: () => st.dispose(),
  };
}

/* ================= Q-LEARNING GRID (2x2 vacuum world) ================= */
export function createGrid(host) {
  const st = stage(host, { bloomStrength: 0.6, bloomThreshold: 0.25, fov: 38 });
  const { scene, camera } = st;
  scene.background = new THREE.Color(0x04090c);
  lights(scene);
  camera.position.set(0, 7.2, 6.4);
  camera.lookAt(0, 0, 0.2);

  const T = 2.1; // tile size
  const tileAt = (r, c) => new THREE.Vector3((c - 0.5) * T, 0, (r - 0.5) * T);
  const tiles = {};
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
    const wall = r === 1 && c === 0;
    const m = new THREE.Mesh(new THREE.BoxGeometry(T * 0.94, 0.2, T * 0.94), metal(wall ? 0x262b33 : 0x101820, 0.6, 0.7));
    m.position.copy(tileAt(r, c)).setY(-0.1);
    scene.add(m);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: wall ? 0x64748b : 0x10b981 }));
    edge.position.copy(m.position);
    scene.add(edge);
    tiles[r + ',' + c] = m;
    if (wall) {
      const block = new THREE.Mesh(new THREE.BoxGeometry(T * 0.8, 1.2, T * 0.8), metal(0x3a3f47, 0.8, 0.4));
      block.position.copy(tileAt(r, c)).setY(0.6);
      scene.add(block);
    }
  }
  // Dock.
  const dock = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 0.12, 32), metal(C.gold, 0.3, 1, { emissive: 0x6b4a00, emissiveIntensity: 0.8 }));
  dock.position.copy(tileAt(1, 1)).setY(0.06);
  scene.add(dock);
  const dockRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.03, 6, 48), glow(C.gold));
  dockRing.rotation.x = Math.PI / 2; dockRing.position.copy(tileAt(1, 1)).setY(0.15);
  scene.add(dockRing);
  // Dirt.
  const dirt = new THREE.Group();
  for (let i = 0; i < 26; i++) {
    const d = new THREE.Mesh(new THREE.DodecahedronGeometry(0.05 + Math.random() * 0.06), new THREE.MeshStandardMaterial({ color: 0x6b4f2a, roughness: 1 }));
    d.position.set((Math.random() - 0.5) * 1.3, 0.05, (Math.random() - 0.5) * 1.3);
    dirt.add(d);
  }
  dirt.position.copy(tileAt(0, 1));
  scene.add(dirt);
  // Vacuum robot.
  const bot = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.58, 0.24, 40), metal(0x1b2a25, 0.35, 0.9));
  body.position.y = 0.16;
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.565, 0.03, 8, 48), metal(C.gold, 0.25, 1));
  band.rotation.x = Math.PI / 2; band.position.y = 0.2;
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 0.08), glow(C.emerald));
  eye.position.set(0, 0.24, 0.52);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), glow(C.emerald));
  dome.position.y = 0.28;
  bot.add(body, band, eye, dome);
  bot.position.copy(tileAt(0, 0));
  scene.add(bot);

  // Q-value arrows per open tile.
  const DIRS = { UP: [-1, 0], DOWN: [1, 0], LEFT: [0, -1], RIGHT: [0, 1] };
  const arrows = {};
  ['0,0', '0,1', '1,1'].forEach((s) => {
    const [r, c] = s.split(',').map(Number);
    arrows[s] = {};
    Object.entries(DIRS).forEach(([a, [dr, dc]]) => {
      const dir = new THREE.Vector3(dc, 0, dr);
      const origin = tileAt(r, c).add(dir.clone().multiplyScalar(0.28)).setY(0.45);
      const arr = new THREE.ArrowHelper(dir, origin, 0.3, 0x475569, 0.14, 0.12);
      scene.add(arr);
      arrows[s][a] = arr;
    });
  });

  const target = bot.position.clone();
  let face = 0, bump = 0, sparkle = 0;
  st.tick((dt, t) => {
    bot.position.lerp(target, 0.18);
    bot.rotation.y += (face - bot.rotation.y) * 0.2;
    bump = Math.max(0, bump - dt * 3);
    bot.position.y = Math.abs(Math.sin(bump * 10)) * 0.15 * bump;
    dockRing.scale.setScalar(1 + Math.sin(t * 3) * 0.06 + sparkle * 0.4);
    sparkle = Math.max(0, sparkle - dt);
  });

  return {
    move(r, c, action, blocked) {
      const [dr, dc] = DIRS[action] || [0, 0];
      face = Math.atan2(dc, dr);
      if (blocked) bump = 1;
      target.copy(tileAt(r, c));
    },
    reset(r = 0, c = 0) { target.copy(tileAt(r, c)); bot.position.copy(target); },
    setDirt(on) { dirt.visible = on; },
    docked() { sparkle = 1; },
    setQ(table) {
      Object.entries(arrows).forEach(([s, set]) => {
        const vals = table[s] || {};
        const best = Math.max(...Object.values(vals));
        Object.entries(set).forEach(([a, arr]) => {
          const v = vals[a] || 0;
          const len = 0.25 + Math.min(0.55, Math.abs(v) / 18);
          arr.setLength(len, 0.14, 0.12);
          arr.setColor(v === best && v > 0 ? C.gold : v > 0 ? C.emerald : v < 0 ? 0xef4444 : 0x475569);
        });
      });
    },
    dispose: () => st.dispose(),
  };
}
