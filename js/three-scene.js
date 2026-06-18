/**
 * LEISURE — 3D Speaker Scene (scroll-driven + rush effect)
 * Three.js r158
 */
(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;
  var canvas = document.getElementById('speakerCanvas');
  if (!canvas) return;

  var container = canvas.parentElement;

  /* ── Renderer ─────────────────────────────────────────── */
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = false;

  function getSize() {
    return {
      w: container.clientWidth  || window.innerWidth * 0.54,
      h: container.clientHeight || window.innerHeight,
    };
  }
  var sz = getSize();
  renderer.setSize(sz.w, sz.h);

  /* ── Scene / Camera ───────────────────────────────────── */
  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, sz.w / sz.h, 0.1, 200);
  camera.position.set(0, 0.3, 6.5);

  /* ── Fog for depth ────────────────────────────────────── */
  scene.fog = new THREE.FogExp2(0x0a0806, 0.035);

  /* ── Lights ───────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.30));

  var keyLight = new THREE.DirectionalLight(0xffe8d0, 2.0);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  var fillLight = new THREE.DirectionalLight(0x1a0d00, 0.5);
  fillLight.position.set(-4, -2, 2);
  scene.add(fillLight);

  var rimLight = new THREE.PointLight(0xc4956a, 3.0, 18);
  rimLight.position.set(4, 2, -3);
  scene.add(rimLight);

  var topLight = new THREE.PointLight(0xfff0d0, 1.2, 12);
  topLight.position.set(0, 7, 3);
  scene.add(topLight);

  var rushLight = new THREE.PointLight(0xc4956a, 0, 20);
  rushLight.position.set(0, 0, 5);
  scene.add(rushLight);

  /* ── Materials ────────────────────────────────────────── */
  var matCabinet = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.52, metalness: 0.20 });
  var matGold    = new THREE.MeshStandardMaterial({ color: 0xc4956a, roughness: 0.25, metalness: 0.68 });
  var matCone    = new THREE.MeshStandardMaterial({ color: 0x221a10, roughness: 0.70, metalness: 0.05 });
  var matDome    = new THREE.MeshStandardMaterial({ color: 0xd4a870, roughness: 0.20, metalness: 0.82 });
  var matWire    = new THREE.MeshBasicMaterial({ color: 0xc4956a, transparent: true, opacity: 0.06, wireframe: true });

  /* ── Speaker group ────────────────────────────────────── */
  var spk = new THREE.Group();
  scene.add(spk);

  /* Cabinet */
  spk.add(new THREE.Mesh(new THREE.BoxGeometry(1.50, 4.20, 1.05), matCabinet));

  /* Gold accent strips */
  [-1.53, 1.53].forEach(function (y) {
    var s = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.06, 1.07), matGold);
    s.position.y = y;
    spk.add(s);
  });

  /* Tweeter */
  var twtGrp = new THREE.Group();
  twtGrp.position.set(0, 1.5, 0.53);
  spk.add(twtGrp);
  twtGrp.add(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 8, 32), matGold));
  var twtDome = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI*2, 0, Math.PI*0.5), matDome);
  twtGrp.add(twtDome);

  /* Midrange */
  var midGrp = new THREE.Group();
  midGrp.position.set(0, 0.48, 0.53);
  spk.add(midGrp);
  midGrp.add(new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.05, 8, 32), matGold));
  var midCone = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.18, 24, 1, true), matCone);
  midCone.rotation.x = Math.PI; midCone.position.z = 0.04;
  midGrp.add(midCone);

  /* Woofer */
  var wfrGrp = new THREE.Group();
  wfrGrp.position.set(0, -0.88, 0.53);
  spk.add(wfrGrp);
  wfrGrp.add(new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.07, 8, 48), matGold));
  var wfrCone = new THREE.Mesh(new THREE.ConeGeometry(0.44, 0.28, 32, 1, true), matCone);
  wfrCone.rotation.x = Math.PI; wfrCone.position.z = 0.06;
  wfrGrp.add(wfrCone);
  var dustCap = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI*2, 0, Math.PI*0.5), matDome);
  dustCap.position.z = 0.12;
  wfrGrp.add(dustCap);

  /* Sub-woofer at bottom */
  var subGrp = new THREE.Group();
  subGrp.position.set(0, -2.0, 0.53);
  spk.add(subGrp);
  subGrp.add(new THREE.Mesh(new THREE.TorusGeometry(0.40, 0.055, 8, 40), matGold));
  var subCone = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.22, 28, 1, true), matCone);
  subCone.rotation.x = Math.PI; subCone.position.z = 0.05;
  subGrp.add(subCone);

  /* Plinth */
  var plinth = new THREE.Mesh(new THREE.BoxGeometry(1.70, 0.14, 1.20), matGold);
  plinth.position.y = -2.17;
  spk.add(plinth);

  /* Wireframe floaters */
  var floaters = [];
  var fShapes = [
    new THREE.IcosahedronGeometry(0.22, 0),
    new THREE.IcosahedronGeometry(0.15, 0),
    new THREE.IcosahedronGeometry(0.18, 0),
    new THREE.OctahedronGeometry(0.20, 0),
    new THREE.TetrahedronGeometry(0.25, 0),
    new THREE.OctahedronGeometry(0.14, 0),
  ];
  var fOffsets = [
    [2.2, 1.5, -0.5], [-2.4, 0.8, -0.8], [2.0, -1.2, 0.2],
    [-1.8, -0.5, 0.4], [1.5, 2.2, 0.0],  [-1.6, -2.0, -0.3],
  ];
  fShapes.forEach(function (geo, i) {
    var m = new THREE.Mesh(geo, matWire.clone());
    m.position.set(fOffsets[i][0], fOffsets[i][1], fOffsets[i][2]);
    scene.add(m);
    floaters.push(m);
  });

  /* ── Sound wave rings (large, visible) ────────────────── */
  var waves = [];
  for (var w = 0; w < 6; w++) {
    var wMat = new THREE.MeshBasicMaterial({
      color: 0xc4956a, transparent: true, opacity: 0.0,
      wireframe: false, side: THREE.DoubleSide
    });
    var wMesh = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.008, 6, 80), wMat);
    wMesh.rotation.y = Math.PI / 2;
    wMesh.position.set(0, -0.88, 0.55);
    spk.add(wMesh);
    waves.push({ mesh: wMesh, mat: wMat, phase: w / 6 });
  }

  /* Extra large world-space rings (follow speaker's world pos) */
  var bigRings = [];
  for (var br = 0; br < 4; br++) {
    var brMat = new THREE.MeshBasicMaterial({
      color: 0xc4956a, transparent: true, opacity: 0, side: THREE.DoubleSide
    });
    var brMesh = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.005, 4, 90), brMat);
    brMesh.rotation.y = Math.PI / 2;
    scene.add(brMesh);
    bigRings.push({ mesh: brMesh, mat: brMat, phase: br / 4 });
  }

  /* Ground halo */
  var haloMat = new THREE.MeshBasicMaterial({ color: 0xc4956a, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
  var halo = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.05, 48), haloMat);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = -2.25;
  spk.add(halo);

  /* ── Particles ────────────────────────────────────────── */
  var pGeo = new THREE.BufferGeometry();
  var pPos = new Float32Array(350 * 3);
  for (var pi = 0; pi < 350; pi++) {
    pPos[pi*3]   = (Math.random() - 0.5) * 10;
    pPos[pi*3+1] = (Math.random() - 0.5) * 10;
    pPos[pi*3+2] = (Math.random() - 0.5) * 8;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  var pMat  = new THREE.PointsMaterial({ color: 0xc4956a, size: 0.022, transparent: true, opacity: 0.50 });
  var parts = new THREE.Points(pGeo, pMat);
  scene.add(parts);

  /* ── Scroll tracking ──────────────────────────────────── */
  var scrollProg = 0;
  var ticking    = false;
  var rushActive = false;
  var rushIntensity = 0; /* 0..1 extra intensity during rush phase */

  function readScroll() {
    var hero = document.getElementById('hero');
    if (!hero) { ticking = false; return; }
    var rect      = hero.getBoundingClientRect();
    var scrollable = hero.offsetHeight - window.innerHeight;
    scrollProg = Math.max(0, Math.min(1, -rect.top / Math.max(scrollable, 1)));

    /* progress bar */
    var fill = document.getElementById('heroFill');
    if (fill) fill.style.height = (scrollProg * 100) + '%';

    /* panel swap */
    var pi = Math.min(Math.floor(scrollProg * 4), 3) + 1;
    for (var i = 1; i <= 4; i++) {
      var p = document.getElementById('hp' + i);
      if (p) p.classList.toggle('active', i === pi);
    }

    /* scroll cue */
    var cue = document.getElementById('heroScrollCue');
    if (cue) cue.style.opacity = scrollProg < 0.05 ? '1' : '0';

    /* rush detection: 0.28 → 0.52 = rush zone */
    rushActive = scrollProg > 0.28 && scrollProg < 0.52;
    var rushT  = Math.max(0, Math.min(1, (scrollProg - 0.28) / 0.12));
    var rushOut = Math.max(0, Math.min(1, (0.52 - scrollProg) / 0.12));
    rushIntensity = Math.min(rushT, rushOut);

    /* flash overlay */
    var flash = document.getElementById('heroFlash');
    if (flash) {
      var fa = rushIntensity * 0.18;
      flash.style.background = 'radial-gradient(ellipse 60% 70% at 65% 50%, rgba(196,149,106,' + fa + ') 0%, transparent 70%)';
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(readScroll); ticking = true; }
  }, { passive: true });

  /* ── Mouse tilt ───────────────────────────────────────── */
  var mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Resize ───────────────────────────────────────────── */
  window.addEventListener('resize', function () {
    sz = getSize();
    camera.aspect = sz.w / sz.h;
    camera.updateProjectionMatrix();
    renderer.setSize(sz.w, sz.h);
  });

  /* ── Animate ──────────────────────────────────────────── */
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var t = clock.getElapsedTime();
    var sp = scrollProg;

    /* ── Speaker rotation ── */
    var targetRotY = 0.22 + sp * Math.PI * 2;
    var mouseFactor = Math.max(0, 1 - sp * 5);
    targetRotY += mouseX * 0.12 * mouseFactor;
    spk.rotation.y += (targetRotY - spk.rotation.y) * 0.045;
    var targetRotX = -mouseY * 0.06 * mouseFactor;
    spk.rotation.x += (targetRotX - spk.rotation.x) * 0.04;

    /* ── Camera movement ── */
    var camZ;
    if (sp < 0.28) {
      /* Phase 1: steady approach */
      camZ = 6.5 - sp * 1.5;
    } else if (sp < 0.52) {
      /* Phase 2: RUSH FORWARD — camera charges toward speaker */
      var rushT = (sp - 0.28) / 0.24;
      /* ease in-out cubic */
      var e = rushT < 0.5 ? 4*rushT*rushT*rushT : 1 - Math.pow(-2*rushT+2,3)/2;
      camZ = (6.5 - 0.28*1.5) - e * 2.6; /* rushes from ~6.1 down to ~3.5 */
    } else {
      /* Phase 3: gradual pull-back */
      var pullT = (sp - 0.52) / 0.48;
      camZ = 3.5 + pullT * 2.2;
    }
    camera.position.z += (camZ - camera.position.z) * 0.055;

    /* Camera vertical */
    var yTarget = 0.3 - sp * 0.9;
    camera.position.y += (yTarget - camera.position.y) * 0.03;

    /* ── Rush light intensifies during rush ── */
    rushLight.intensity += (rushIntensity * 4.5 - rushLight.intensity) * 0.08;

    /* ── Sound wave rings (local, on speaker) ── */
    var waveSpeedFactor = 1.0 + rushIntensity * 3.5;
    waves.forEach(function (wv) {
      var ph = (t * 0.55 * waveSpeedFactor + wv.phase) % 1.0;
      var sc = 1 + ph * 2.2;
      wv.mesh.scale.set(sc, sc, sc);
      wv.mat.opacity = ph < 0.5 ? ph * 0.55 * 2 : (1 - ph) * 0.55 * 2;
      /* during rush, rings become more intense */
      if (rushIntensity > 0.1) {
        wv.mat.opacity *= (1 + rushIntensity * 1.5);
      }
    });

    /* ── Big world-space rings (appear during rush) ── */
    bigRings.forEach(function (br) {
      var ph = (t * 0.4 + br.phase + rushIntensity * 0.3) % 1.0;
      var sc = 1.0 + ph * 4.5;
      br.mesh.scale.set(sc, sc, sc);
      br.mat.opacity = rushIntensity > 0.05 ? ph < 0.5 ? ph * rushIntensity * 0.6 : (1 - ph) * rushIntensity * 0.6 : 0;
      /* position rings at woofer world-space */
      br.mesh.position.copy(spk.position);
      br.mesh.position.y -= 0.88;
      br.mesh.rotation.y = spk.rotation.y + Math.PI / 2;
    });

    /* ── Rim light orbit ── */
    rimLight.position.x = Math.cos(t * 0.18) * 7;
    rimLight.position.z = Math.sin(t * 0.18) * 7 - 3;

    /* ── Cone excursion during rush ── */
    if (rushIntensity > 0.05) {
      var exc = Math.sin(t * 12) * rushIntensity * 0.08;
      wfrCone.position.z = 0.06 + exc;
      subCone.position.z = 0.05 + exc * 0.6;
    }

    /* ── Halo pulse ── */
    haloMat.opacity = 0.12 + Math.sin(t * 0.9) * 0.06 + rushIntensity * 0.2;

    /* ── Floaters rotate ── */
    floaters.forEach(function (f, i) {
      f.rotation.x += 0.004 + i * 0.001;
      f.rotation.y += 0.006 + i * 0.0008;
    });

    /* ── Particles ── */
    parts.rotation.y = t * 0.018;
    parts.rotation.x = t * 0.008;
    pMat.opacity = 0.45 + rushIntensity * 0.3;

    renderer.render(scene, camera);
  }

  animate();

  /* init first panel */
  var hp1 = document.getElementById('hp1');
  if (hp1) hp1.classList.add('active');
})();
