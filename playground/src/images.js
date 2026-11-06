// Sample photos drawn on canvas at startup (the artifact CSP blocks remote images).
const SCENES = [
  { name: 'Harbor dusk', sky: ['#f6b16b', '#c45b6a', '#3b2a55'], hills: ['#2d2343', '#1c1730'], sun: '#ffe2a8' },
  { name: 'Alpine morning', sky: ['#bfe3f2', '#7fb6d9', '#3f78a8'], hills: ['#5b7f63', '#2f4e3d'], sun: '#ffffff' },
  { name: 'Desert noon', sky: ['#fbe6b9', '#f2b878', '#d0874a'], hills: ['#b46a3c', '#7d4426'], sun: '#fff6dc' },
  { name: 'Northern night', sky: ['#1b3a4b', '#13293d', '#0a1420'], hills: ['#0d1b26', '#050b11'], sun: '#c9f0e4' },
  { name: 'Lavender field', sky: ['#f0e2f5', '#c9b1dd', '#8f78b5'], hills: ['#6c5a97', '#433767'], sun: '#fff4fb' },
  { name: 'Coast fog', sky: ['#e7ecef', '#c3cfd6', '#8fa3ae'], hills: ['#5f7480', '#3c4c55'], sun: '#ffffff' },
];

function drawScene(s, w, h, seed) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, s.sky[0]); sky.addColorStop(0.55, s.sky[1]); sky.addColorStop(1, s.sky[2]);
  g.fillStyle = sky; g.fillRect(0, 0, w, h);
  g.fillStyle = s.sun; g.globalAlpha = 0.9;
  g.beginPath(); g.arc(w * (0.25 + 0.5 * ((seed * 37) % 10) / 10), h * 0.38, h * 0.11, 0, Math.PI * 2); g.fill();
  g.globalAlpha = 1;
  s.hills.forEach((col, layer) => {
    g.fillStyle = col;
    g.beginPath(); g.moveTo(0, h);
    const base = h * (0.62 + layer * 0.12);
    for (let x = 0; x <= w; x += 8) {
      const y = base - Math.sin((x / w) * Math.PI * (2 + layer) + seed + layer) * h * 0.06 - Math.sin((x / w) * 17 + seed * 3) * h * 0.012;
      g.lineTo(x, y);
    }
    g.lineTo(w, h); g.closePath(); g.fill();
  });
  return c.toDataURL('image/jpeg', 0.82);
}

export const photos = SCENES.map((s, i) => ({
  title: s.name,
  source: { uri: drawScene(s, 750, 500, i + 1) },
}));

export const avatar = (() => {
  const c = document.createElement('canvas');
  c.width = 120; c.height = 120;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 120, 120);
  grd.addColorStop(0, '#659CEC'); grd.addColorStop(1, '#3b5ea8');
  g.fillStyle = grd; g.fillRect(0, 0, 120, 120);
  g.fillStyle = 'rgba(255,255,255,0.9)';
  g.beginPath(); g.arc(60, 46, 22, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(60, 112, 40, 32, 0, 0, Math.PI * 2); g.fill();
  return { uri: c.toDataURL('image/png') };
})();
