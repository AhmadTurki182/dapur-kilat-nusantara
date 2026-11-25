// Dapur Kilat Nusantara — loop game, state, input, dan logika.
// Pesanan datang, bahan masuk wajan, masak dengan timing, sajikan tepat waktu.

import { W, H, LAYOUT, BIN_RECTS, render } from './render.js';
import { DISHES, DISH_MAP, ING_MAP, dishReward, wokMatchesRecipe, mulberry32 } from './dishes.js';
import * as sfx from './audio.js';
import { applyShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = W;
canvas.height = H;

const DAY_TIME = 150;
const MAX_ORDERS = 3;

let rng = mulberry32((Math.random() * 1e9) | 0);

function newState() {
  return {
    mode: 'title',
    t: 0,
    dayTime: DAY_TIME,
    dayLeft: DAY_TIME,
    score: 0,
    coins: 0,
    served: 0,
    combo: 0,
    bestCombo: 0,
    level: 1,
    lives: 3,
    orders: [],
    selectedOrder: -1,
    wok: [],
    cooking: null,
    plate: null,
    popups: [],
    steam: [],
    muted: false,
    canCook: false,
    best: Number(localStorage.getItem('dapurkilat-best') || 0),
    frozen: false,
    orderTimer: 2.5,
    spawnIn: 1.2,
  };
}

let s = newState();

function popup(x, y, txt, color, size = 22) {
  s.popups.push({ x, y, text: txt, color, size, life: 1.4, maxLife: 1.4 });
}

function pickDish() {
  // Hidangan mudah lebih sering di awal; makin tinggi level makin berat.
  const weights = DISHES.map((d) => (4 - d.difficulty) + s.level * 0.2);
  let total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < DISHES.length; i++) {
    r -= weights[i];
    if (r <= 0) return DISHES[i].id;
  }
  return 'nasgor';
}

function spawnOrder() {
  if (s.orders.length >= MAX_ORDERS) return;
  const dish = pickDish();
  const patience = 26 + rng() * 14 + s.level;
  s.orders.push({
    id: Math.floor(rng() * 1e9),
    dish,
    patience,
    maxPatience: patience,
  });
  sfx.sfxNewOrder();
  if (s.selectedOrder < 0) s.selectedOrder = 0;
}

function refreshCanCook() {
  if (s.selectedOrder < 0 || !s.orders[s.selectedOrder]) {
    s.canCook = false;
    return;
  }
  const dish = DISH_MAP[s.orders[s.selectedOrder].dish];
  s.canCook = wokMatchesRecipe(s.wok, dish.recipe);
}

function addIngredient(id) {
  if (s.mode !== 'playing' || s.cooking) return;
  if (s.wok.includes(id)) {
    sfx.sfxError();
    popup(496, 150, 'Sudah di wajan!', '#ffb300', 18);
    return;
  }
  if (s.wok.length >= 4) {
    sfx.sfxError();
    popup(496, 150, 'Wajan penuh!', '#ef5350', 18);
    return;
  }
  s.wok.push(id);
  sfx.sfxAdd();
  refreshCanCook();
}

function emptyWok() {
  if (!s.wok.length || s.cooking) return;
  s.wok = [];
  sfx.sfxTrash();
  refreshCanCook();
}

function startCooking() {
  if (s.mode !== 'playing' || s.cooking || !s.canCook) {
    if (s.mode === 'playing' && !s.cooking) {
      sfx.sfxError();
      popup(496, 150, 'Resep belum lengkap!', '#ef5350', 18);
    }
    return;
  }
  const dish = DISH_MAP[s.orders[s.selectedOrder].dish];
  const z0 = 0.35 + rng() * 0.3;
  s.cooking = {
    dish: dish.id,
    marker: 0,
    dir: 1,
    speed: 0.011 + s.level * 0.0012,
    zone: [z0, Math.min(0.95, z0 + 0.22)],
    done: false,
  };
  sfx.startSizzle();
}

function stopCooking() {
  if (!s.cooking) return;
  const c = s.cooking;
  const m = c.marker;
  const inZone = m >= c.zone[0] && m <= c.zone[1];
  const center = (c.zone[0] + c.zone[1]) / 2;
  const perfect = Math.abs(m - center) < 0.05;
  sfx.stopSizzle();
  if (!inZone) {
    s.cooking = null;
    s.wok = [];
    s.combo = 0;
    sfx.sfxFail();
    popup(496, 150, 'GOSONG! Bahan terbuang', '#ef5350');
    refreshCanCook();
    return;
  }
  s.plate = c.dish;
  s.cooking = null;
  s.wok = [];
  if (perfect) {
    sfx.sfxPerfect();
    popup(994, 212, 'SEMPURNA! +50', '#ffd54f', 22);
  } else {
    sfx.sfxClick();
  }
  s.perfectCook = perfect;
  refreshCanCook();
}

function servePlate() {
  if (s.mode !== 'playing' || !s.plate) return;
  const idx = s.orders.findIndex((o) => o.dish === s.plate);
  if (idx < 0) {
    sfx.sfxError();
    popup(994, 212, 'Tidak ada yang pesan ini!', '#ef5350', 18);
    return;
  }
  const dish = DISH_MAP[s.plate];
  const reward = dishReward(dish, s.combo, !!s.perfectCook);
  s.coins += reward;
  s.score += reward + 10;
  s.served += 1;
  s.combo += 1;
  s.bestCombo = Math.max(s.bestCombo, s.combo);
  const newLevel = 1 + Math.floor(s.served / 4);
  if (newLevel > s.level) {
    s.level = newLevel;
    popup(640, 120, 'LEVEL ' + newLevel + ' — Pesanan makin cepat!', '#81c784', 22);
    sfx.sfxLevelUp();
  }
  popup(994, 212, '+' + reward + '  ' + dish.name, '#ffd54f', 22);
  if (s.combo >= 3) popup(994, 240, 'KOMBO x' + s.combo + '!', '#ff8a65', 20);
  s.orders.splice(idx, 1);
  if (s.selectedOrder >= s.orders.length) s.selectedOrder = s.orders.length - 1;
  s.plate = null;
  s.perfectCook = false;
  sfx.sfxDing();
  refreshCanCook();
}

function startGame() {
  const best = s.best;
  s = newState();
  s.best = best;
  s.mode = 'playing';
  sfx.sfxClick();
  spawnOrder();
  s.spawnIn = 4;
}

function gameOver() {
  s.mode = 'over';
  sfx.stopSizzle();
  sfx.sfxFail();
  if (s.score > s.best) {
    s.best = s.score;
    localStorage.setItem('dapurkilat-best', String(s.best));
  }
}

function inRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function onClick(px, py) {
  if (s.mode === 'title') {
    if (inRect(px, py, LAYOUT.startBtn)) startGame();
    return;
  }
  if (s.mode === 'over') {
    if (inRect(px, py, LAYOUT.restartBtn)) startGame();
    return;
  }
  // Papan pesanan
  const b = LAYOUT.board;
  if (px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h) {
    for (let i = 0; i < s.orders.length; i++) {
      const y = b.y + 62 + i * 106;
      if (py >= y && py <= y + 94) {
        s.selectedOrder = i;
        sfx.sfxClick();
        refreshCanCook();
        return;
      }
    }
  }
  // Bin bahan
  for (const bin of BIN_RECTS) {
    if (inRect(px, py, bin)) {
      addIngredient(bin.id);
      return;
    }
  }
  // Wajan: klik bahan di wajan untuk membuang satu bahan
  const w = LAYOUT.wok;
  const dx = px - w.x, dy = py - w.y;
  if (dx * dx + dy * dy <= w.r * w.r) {
    if (s.wok.length && !s.cooking) {
      s.wok.pop();
      sfx.sfxTrash();
      refreshCanCook();
    }
    return;
  }
  if (inRect(px, py, LAYOUT.cookBtn)) {
    if (s.cooking) stopCooking();
    else startCooking();
    return;
  }
  if (inRect(px, py, LAYOUT.serveBtn)) {
    servePlate();
    return;
  }
  if (inRect(px, py, LAYOUT.trash)) {
    emptyWok();
    return;
  }
  // Piring: klik untuk sajikan
  const p = LAYOUT.plate;
  const pdx = (px - p.x) / p.rx, pdy = (py - p.y) / p.ry;
  if (pdx * pdx + pdy * pdy <= 1) {
    servePlate();
  }
}

canvas.addEventListener('click', (e) => {
  const r = canvas.getBoundingClientRect();
  const px = ((e.clientX - r.left) / r.width) * W;
  const py = ((e.clientY - r.top) / r.height) * H;
  onClick(px, py);
});

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (s.mode === 'title' && (k === 'enter' || k === ' ')) {
    startGame();
    return;
  }
  if (s.mode === 'over' && k === 'r') {
    startGame();
    return;
  }
  if (s.mode !== 'playing') return;
  if (k === ' ') {
    e.preventDefault();
    if (s.cooking) stopCooking();
    else startCooking();
  } else if (k === 'enter') {
    servePlate();
  } else if (k === 't') {
    emptyWok();
  } else if (k === 'm') {
    s.muted = !s.muted;
    sfx.setMuted(s.muted);
  } else {
    const g = ING_MAP && Object.values(ING_MAP).find((x) => x.key === k);
    if (g) addIngredient(g.id);
  }
});

function update(dt) {
  if (s.frozen) {
    // Mode screenshot: adegan diam, popup tidak memudar.
    render(ctx, s, 1200);
    return;
  }
  s.t += dt;
  // Popup melayang
  for (let i = s.popups.length - 1; i >= 0; i--) {
    const p = s.popups[i];
    p.life -= dt;
    p.y -= 26 * dt;
    if (p.life <= 0) s.popups.splice(i, 1);
  }
  if (s.mode !== 'playing') return;
  // Timer hari
  s.dayLeft -= dt;
  if (s.dayLeft <= 0) {
    s.dayLeft = 0;
    gameOver();
    return;
  }
  // Pesanan baru
  s.spawnIn -= dt;
  if (s.spawnIn <= 0) {
    spawnOrder();
    s.spawnIn = 5 + rng() * 4;
  }
  // Kesabaran pesanan
  for (let i = s.orders.length - 1; i >= 0; i--) {
    const o = s.orders[i];
    o.patience -= dt;
    if (o.patience <= 0) {
      s.orders.splice(i, 1);
      s.lives -= 1;
      s.combo = 0;
      popup(156, 120, 'Pesanan kabur!', '#ef5350', 20);
      sfx.sfxFail();
      if (s.selectedOrder >= s.orders.length) s.selectedOrder = s.orders.length - 1;
      if (s.lives <= 0) {
        gameOver();
        return;
      }
      refreshCanCook();
    }
  }
  // Marker timing memasak
  if (s.cooking) {
    const c = s.cooking;
    c.marker += c.dir * c.speed * dt * 60;
    if (c.marker >= 1) { c.marker = 1; c.dir = -1; }
    if (c.marker <= 0) { c.marker = 0; c.dir = 1; }
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(dt);
  render(ctx, s, s.t * 1000);
  requestAnimationFrame(loop);
}

// Mode screenshot (?shot=...): susun adegan tetap, bekukan waktu.
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
if (shot) {
  const seed = Number(params.get('seed') || 7);
  rng = mulberry32(seed);
  applyShot(s, shot, rng);
  render(ctx, s, 1200);
  // Tetap jalankan loop tapi beku, supaya animasi api/uap tidak mengubah
  // adegan secara drastis saat screenshot diambil.
  s.frozen = true;
  requestAnimationFrame(loop);
} else {
  requestAnimationFrame(loop);
}

// Ekspos untuk debugging di console.
window.__dapur = { get state() { return s; }, startGame, spawnOrder, update };
