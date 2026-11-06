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

/* ================= BOSS: the gatekeeper Doombot sentinel ================= */
export function createBoss(host, { color = C.green, still = false } = {}) {
  const st = stage(host, { still, bloomStrength: 0.65, bloomThreshold: 0.55, fov: 35, env: 0.25 });
  const { scene, camera } = st;
  scene.background = new THREE.Color(0x0b0607);
  lights(scene);
  camera.position.set(0, 0.3, 8.2);
  camera.lookAt(0, 0, 0);
  const inner = new THREE.PointLight(0x34d399, 12, 6, 1.5);
  scene.add(inner);
  const under = new THREE.PointLight(0xff3344, 20, 8, 1.6);
  under.position.set(0, -2.5, 1.5);
  scene.add(under);
  const floor = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.3, 48), new THREE.MeshBasicMaterial({ color: 0x7f1d1d, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.9;
  scene.add(floor);

  const bot = new THREE.Group();
  const armour = metal(0x2b3a40, 0.4, 0.9);
  const trim = metal(0xc9952b, 0.3, 1);
  const shards = [];
  // Faceted armour plates arranged around a glowing core.
  const shell = new THREE.IcosahedronGeometry(1.1, 0);
  const pos = shell.attributes.position;
  for (let i = 0; i < pos.count; i += 3) {
    const tri = new THREE.BufferGeometry();
    const a = new THREE.Vector3().fromBufferAttribute(pos, i), b = new THREE.Vector3().fromBufferAttribute(pos, i + 1), c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
    const centre = a.clone().add(b).add(c).divideScalar(3);
    tri.setAttribute('position', new THREE.Float32BufferAttribute([...a.clone().sub(centre).toArray(), ...b.clone().sub(centre).toArray(), ...c.clone().sub(centre).toArray()], 3));
    tri.computeVertexNormals();
    const m = new THREE.Mesh(tri, (i / 3) % 4 === 0 ? trim : armour);
    m.material = m.material.clone();
    m.material.side = THREE.DoubleSide;
    m.scale.setScalar(0.86);
    m.position.copy(centre.multiplyScalar(1.1));
    m.userData.home = m.position.clone();
    m.userData.vel = centre.clone().normalize().multiplyScalar(2 + Math.random() * 3);
    bot.add(m);
    shards.push(m);
  }
  const coreMat = new THREE.MeshBasicMaterial({ color });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 32), coreMat);
  bot.add(core);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.12), glow(color));
  visor.position.set(0, 0.18, 1.12);
  bot.add(visor);
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), glow(0xff3b3b));
  eye.position.set(0, 0.18, 1.2);
  bot.add(eye);
  const halo = tickRing(1.75, 48, 0x8a6a1c, 0.02);
  bot.add(halo);
  bot.scale.setScalar(0.85);
  scene.add(bot);

  let shake = 0, dead = false, deadT = 0, hp = 1;
  st.tick((dt, t) => {
    shake = Math.max(0, shake - dt * 2.5);
    if (!dead) {
      bot.rotation.y = Math.sin(t * 0.8) * 0.4;
      bot.position.y = Math.sin(t * 1.5) * 0.12;
      bot.position.x = (Math.random() - 0.5) * shake * 0.4;
      halo.rotation.z = t * 0.6;
      eye.scale.setScalar(1 + Math.sin(t * 6) * 0.15);
      coreMat.color.set(color).lerp(new THREE.Color(0xff2222), shake * 0.8 + (1 - hp) * 0.25);
      shards.forEach((s) => s.position.lerp(s.userData.home.clone().multiplyScalar(1 + (1 - hp) * 0.18 + Math.sin(t * 2) * 0.015), 0.1));
      floor.scale.setScalar(1 + Math.sin(t * 2) * 0.08);
    } else {
      deadT += dt;
      shards.forEach((s) => {
        s.position.addScaledVector(s.userData.vel, dt);
        s.userData.vel.y -= dt * 3;
        s.rotation.x += dt * 4; s.rotation.y += dt * 3;
        s.material.transparent = true;
        s.material.opacity = Math.max(0, 1 - deadT / 1.6);
      });
      core.scale.setScalar(Math.max(0.001, 1 + deadT * 3));
      coreMat.transparent = true;
      coreMat.opacity = Math.max(0, 1 - deadT * 1.4);
      visor.visible = eye.visible = halo.visible = false;
    }
  });
  return {
    hit(remaining) { hp = remaining; shake = 1; },
    taunt() { shake = 0.6; },
    defeat() { dead = true; },
    snapshot() { st.renderOnce(1.3); return st.renderer.domElement.toDataURL('image/png'); },
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
