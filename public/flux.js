/* "Le Flux" — champ de particules (impressions → conversions). Three.js global, sans build. */
(function () {
  var canvas = document.getElementById('flux');
  if (!canvas || !window.THREE) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var THREE = window.THREE;
  var w = window.innerWidth;
  var COUNT = w < 640 ? 1000 : w < 1024 ? 1800 : 2800;
  var DEPTH = 6;

 try {

  var COLD = new THREE.Color('#4B65FF'); // indigo (diffus)
  var HOT = new THREE.Color('#8FE3FF');  // cyan clair (conversion)

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0.4, 6);

  // Sprite rond doux
  var c = document.createElement('canvas'); c.width = c.height = 64;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  var sprite = new THREE.CanvasTexture(c);

  var positions = new Float32Array(COUNT * 3);
  var colors = new Float32Array(COUNT * 3);
  var data = [];
  for (var i = 0; i < COUNT; i++) {
    data.push({ theta: Math.random() * Math.PI * 2, radius: 0.4 + Math.random() * 3.2, p: Math.random(), speed: 0.05 + Math.random() * 0.09 });
  }

  var geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var material = new THREE.PointsMaterial({
    size: 0.085, map: sprite, vertexColors: true, transparent: true,
    opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  var points = new THREE.Points(geom, material);
  scene.add(points);

  var px = 0, py = 0; // pointer normalisé
  window.addEventListener('mousemove', function (e) {
    px = (e.clientX / window.innerWidth) * 2 - 1;
    py = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  function resize() {
    var W = canvas.clientWidth || window.innerWidth;
    var H = canvas.clientHeight || window.innerHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var last = performance.now();
  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05); last = now;
    for (var i = 0; i < COUNT; i++) {
      var d = data[i];
      d.p += d.speed * dt * 6;
      if (d.p > 1) { d.p -= 1; d.theta = Math.random() * Math.PI * 2; d.radius = 0.4 + Math.random() * 3.2; }
      var p = d.p, r = d.radius * (1 - p), ang = d.theta + p * 3.0, t = Math.pow(p, 1.5);
      positions[i * 3] = Math.cos(ang) * r;
      positions[i * 3 + 1] = Math.sin(ang) * r * 0.7 + p * 1.7;
      positions[i * 3 + 2] = -DEPTH + p * DEPTH;
      colors[i * 3] = COLD.r + (HOT.r - COLD.r) * t;
      colors[i * 3 + 1] = COLD.g + (HOT.g - COLD.g) * t;
      colors[i * 3 + 2] = COLD.b + (HOT.b - COLD.b) * t;
    }
    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;
    points.rotation.z += dt * 0.04;

    camera.position.x += (px * 1.1 - camera.position.x) * 0.04;
    camera.position.y += (py * 0.7 + 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0.7, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
 } catch (e) {
  /* WebGL indisponible : on conserve le fond dégradé du hero, sans erreur. */
 }
})();
