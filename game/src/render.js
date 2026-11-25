// Dapur Kilat Nusantara — semua gambar digambar di canvas (tanpa aset luar).
// Layout dipakai juga oleh main.js untuk hit-test klik.

import { INGREDIENTS, DISH_MAP, ING_MAP } from './dishes.js';

export const W = 1280;
export const H = 720;

export const LAYOUT = {
  hud: { x: 0, y: 0, w: 1280, h: 64 },
  board: { x: 16, y: 76, w: 280, h: 372 },
  stove: { x: 316, y: 76, w: 392, h: 372 },
  serve: { x: 724, y: 76, w: 540, h: 372 },
  counter: { x: 16, y: 464, w: 1248, h: 240 },
  wok: { x: 512, y: 232, r: 88 },
  plate: { x: 994, y: 306, rx: 130, ry: 52 },
  cookBtn: { x: 396, y: 372, w: 220, h: 52 },
  serveBtn: { x: 884, y: 372, w: 220, h: 52 },
  trash: { x: 636, y: 372, w: 64, h: 52 },
  startBtn: { x: 490, y: 372, w: 300, h: 64 },
  restartBtn: { x: 490, y: 540, w: 300, h: 64 },
};

// Posisi tiap bin bahan di counter (10 bin).
export const BIN_RECTS = INGREDIENTS.map((g, i) => ({
  id: g.id,
  x: 28 + i * 124,
  y: 500,
  w: 112,
  h: 150,
}));

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function text(ctx, s, x, y, size, color, weight = 'bold', align = 'center') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Trebuchet MS", "Segoe UI", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

function bar(ctx, x, y, w, h, frac, fg, bg = 'rgba(0,0,0,0.35)') {
  rr(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = bg;
  ctx.fill();
  if (frac > 0) {
    rr(ctx, x, y, Math.max(h, w * Math.min(1, frac)), h, h / 2);
    ctx.fillStyle = fg;
    ctx.fill();
  }
}

export function drawIngredientIcon(ctx, id, cx, cy, r) {
  const g = ING_MAP[id];
  circle(ctx, cx, cy, r);
  ctx.fillStyle = g.color;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = g.dark;
  ctx.stroke();
  ctx.fillStyle = g.dark;
  ctx.strokeStyle = g.dark;
  switch (id) {
    case 'nasi':
      ctx.fillStyle = '#ffffff';
      circle(ctx, cx - 8, cy + 2, 6); ctx.fill();
      circle(ctx, cx + 7, cy + 4, 6); ctx.fill();
      circle(ctx, cx, cy - 5, 6); ctx.fill();
      break;
    case 'mie':
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy - 6);
      ctx.quadraticCurveTo(cx - 5, cy - 12, cx + 2, cy - 5);
      ctx.quadraticCurveTo(cx + 9, cy + 1, cx + 14, cy - 5);
      ctx.moveTo(cx - 14, cy + 5);
      ctx.quadraticCurveTo(cx - 4, cy + 11, cx + 5, cy + 5);
      ctx.quadraticCurveTo(cx + 10, cy + 1, cx + 14, cy + 6);
      ctx.stroke();
      break;
    case 'ayam': {
      circle(ctx, cx - 3, cy + 2, 11); ctx.fillStyle = '#c75b39'; ctx.fill();
      ctx.fillStyle = '#fff6d8';
      circle(ctx, cx + 11, cy - 9, 3); ctx.fill();
      circle(ctx, cx + 15, cy - 4, 3); ctx.fill();
      break;
    }
    case 'telur':
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(cx, cy, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
      circle(ctx, cx, cy, 6); ctx.fillStyle = '#ffca28'; ctx.fill();
      break;
    case 'kecap':
      rr(ctx, cx - 7, cy - 12, 14, 24, 4);
      ctx.fillStyle = '#3e2723'; ctx.fill();
      rr(ctx, cx - 4, cy - 18, 8, 8, 2);
      ctx.fillStyle = '#ffca28'; ctx.fill();
      break;
    case 'cabai':
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy + 8, 12, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = '#e53935'; ctx.stroke();
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(cx + 8, cy - 12, 4, 8);
      break;
    case 'bawang':
      circle(ctx, cx, cy + 3, 11); ctx.fillStyle = '#ab47bc'; ctx.fill();
      ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy - 8); ctx.quadraticCurveTo(cx + 2, cy - 16, cx + 8, cy - 17); ctx.stroke();
      break;
    case 'timun':
      circle(ctx, cx - 6, cy, 8); ctx.fillStyle = '#66bb6a'; ctx.fill();
      circle(ctx, cx + 7, cy + 2, 8); ctx.fill();
      circle(ctx, cx - 6, cy, 4); ctx.fillStyle = '#c8e6c9'; ctx.fill();
      circle(ctx, cx + 7, cy + 2, 4); ctx.fill();
      break;
    case 'teh':
      ctx.fillStyle = '#795548';
      ctx.beginPath(); ctx.moveTo(cx - 11, cy - 6); ctx.lineTo(cx + 11, cy - 6); ctx.lineTo(cx + 8, cy + 10); ctx.lineTo(cx - 8, cy + 10); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#bcaaa4'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx + 12, cy + 1, 6, -Math.PI / 2, Math.PI / 2); ctx.stroke();
      break;
    case 'es':
      ctx.fillStyle = '#e1f5fe';
      ctx.save();
      ctx.translate(cx - 6, cy - 2); ctx.rotate(0.3);
      ctx.fillRect(-7, -7, 14, 14);
      ctx.restore();
      ctx.save();
      ctx.translate(cx + 7, cy + 5); ctx.rotate(-0.25);
      ctx.fillRect(-7, -7, 14, 14);
      ctx.restore();
      break;
    default:
      break;
  }
}

function drawDishOnPlate(ctx, dish, cx, cy, scale = 1) {
  // Piring
  ctx.fillStyle = '#eceff1';
  ctx.beginPath(); ctx.ellipse(cx, cy, 118 * scale, 46 * scale, 0, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = '#b0bec5'; ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(cx, cy - 4 * scale, 92 * scale, 34 * scale, 0, 0, Math.PI * 2); ctx.fill();
  // Isi hidangan: gundukan warna hidangan + titik-titik bahan resep
  ctx.fillStyle = dish.color;
  ctx.beginPath(); ctx.ellipse(cx, cy - 12 * scale, 62 * scale, 26 * scale, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dish.dark;
  ctx.beginPath(); ctx.ellipse(cx, cy - 20 * scale, 40 * scale, 16 * scale, 0, 0, Math.PI * 2); ctx.fill();
  dish.recipe.forEach((ing, i) => {
    const a = (-0.6 + i * 0.45) * Math.PI;
    const px = cx + Math.cos(a) * 34 * scale;
    const py = cy - 14 * scale + Math.sin(a) * 10 * scale;
    circle(ctx, px, py, 7 * scale);
    ctx.fillStyle = ING_MAP[ing].color;
    ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = ING_MAP[ing].dark; ctx.stroke();
  });
  // Uap
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const sx = cx - 30 + i * 30;
    ctx.beginPath();
    ctx.moveTo(sx, cy - 34 * scale);
    ctx.quadraticCurveTo(sx + 8, cy - 52 * scale, sx - 2, cy - 66 * scale);
    ctx.stroke();
  }
}

function drawCustomer(ctx, x, y, mood) {
  // Pelanggan sederhana: kepala, topi, badan, senyum / cemas.
  ctx.fillStyle = '#ffccbc';
  circle(ctx, x, y - 52, 26); ctx.fill();
  ctx.fillStyle = '#00897b';
  ctx.beginPath(); ctx.arc(x, y - 62, 26, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - 28, y - 64, 56, 8);
  ctx.fillStyle = '#4e342e';
  circle(ctx, x - 10, y - 54, 3); ctx.fill();
  circle(ctx, x + 10, y - 54, 3); ctx.fill();
  ctx.strokeStyle = '#4e342e'; ctx.lineWidth = 3;
  ctx.beginPath();
  if (mood === 'happy') ctx.arc(x, y - 44, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  else ctx.arc(x, y - 36, 9, 1.15 * Math.PI, 1.85 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = '#ff7043';
  rr(ctx, x - 34, y - 26, 68, 56, 14); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 34, y - 26, 68, 10);
}

function drawBackground(ctx, t) {
  // Dinding hangat + ubin teal.
  ctx.fillStyle = '#ffe0b2';
  ctx.fillRect(0, 64, 1280, 400);
  ctx.fillStyle = '#00897b';
  ctx.fillRect(0, 64, 1280, 10);
  // Ubin
  ctx.fillStyle = 'rgba(0,137,123,0.16)';
  for (let x = 0; x < 1280; x += 64) ctx.fillRect(x, 76, 2, 388);
  for (let y = 76; y < 464; y += 64) ctx.fillRect(0, y, 1280, 2);
}

function drawHUD(ctx, s) {
  ctx.fillStyle = '#3e2723';
  ctx.fillRect(0, 0, 1280, 64);
  ctx.fillStyle = '#ff7043';
  ctx.fillRect(0, 60, 1280, 4);
  text(ctx, 'DAPUR KILAT', 20, 32, 26, '#ffcc80', 'bold', 'left');
  text(ctx, 'SKOR  ' + s.score, 250, 32, 22, '#ffffff', 'bold', 'left');
  text(ctx, 'Rp ' + s.coins, 450, 32, 22, '#ffd54f', 'bold', 'left');
  text(ctx, 'Kombo x' + s.combo, 600, 32, 20, s.combo >= 3 ? '#ff8a65' : '#bcaaa4', 'bold', 'left');
  // Timer hari
  const frac = Math.max(0, s.dayLeft / s.dayTime);
  const tcol = s.dayLeft <= 15 ? '#ef5350' : s.dayLeft <= 30 ? '#ffb300' : '#81c784';
  text(ctx, 'WAKTU', 780, 20, 13, '#bcaaa4', 'bold', 'left');
  bar(ctx, 780, 30, 180, 18, frac, tcol);
  text(ctx, Math.ceil(s.dayLeft) + ' dtk', 970, 39, 20, tcol, 'bold', 'left');
  // Nyawa (pesanan gagal)
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = i < s.lives ? '#ef5350' : 'rgba(255,255,255,0.2)';
    circle(ctx, 1060 + i * 34, 32, 12); ctx.fill();
  }
  text(ctx, 'Lvl ' + s.level, 1170, 32, 20, '#ffffff', 'bold', 'left');
  text(ctx, s.muted ? 'SUARA: MATI (M)' : 'SUARA: NYALA (M)', 1170, 52, 11, '#bcaaa4', 'bold', 'right');
}

function drawOrderBoard(ctx, s) {
  const b = LAYOUT.board;
  ctx.fillStyle = '#37474f';
  rr(ctx, b.x, b.y, b.w, b.h, 14); ctx.fill();
  ctx.fillStyle = '#263238';
  rr(ctx, b.x + 8, b.y + 8, b.w - 16, b.h - 16, 10); ctx.fill();
  text(ctx, 'PAPAN PESANAN', b.x + b.w / 2, b.y + 30, 20, '#ffe082');
  ctx.strokeStyle = '#ffe082'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(b.x + 20, b.y + 48); ctx.lineTo(b.x + b.w - 20, b.y + 48); ctx.stroke();
  if (!s.orders.length) {
    text(ctx, 'Belum ada pesanan...', b.x + b.w / 2, b.y + 130, 16, '#b0bec5');
    text(ctx, 'Pesanan segera datang!', b.x + b.w / 2, b.y + 160, 14, '#78909c');
  }
  s.orders.forEach((o, i) => {
    const y = b.y + 62 + i * 106;
    const sel = s.selectedOrder === i;
    const dish = DISH_MAP[o.dish];
    ctx.fillStyle = sel ? '#fff3e0' : '#eceff1';
    rr(ctx, b.x + 12, y, b.w - 24, 94, 10); ctx.fill();
    if (sel) {
      ctx.lineWidth = 4; ctx.strokeStyle = '#ff7043';
      rr(ctx, b.x + 12, y, b.w - 24, 94, 10); ctx.stroke();
    }
    circle(ctx, b.x + 36, y + 26, 15);
    ctx.fillStyle = dish.color; ctx.fill();
    text(ctx, dish.name.slice(0, 2).toUpperCase(), b.x + 36, y + 27, 13, '#ffffff');
    text(ctx, dish.name, b.x + 58, y + 20, 17, '#263238', 'bold', 'left');
    text(ctx, 'Rp ' + dish.price, b.x + b.w - 24, y + 20, 15, '#bf360c', 'bold', 'right');
    // Titik bahan resep
    dish.recipe.forEach((ing, j) => {
      const px = b.x + 66 + j * 26;
      drawIngredientIcon(ctx, ing, px, y + 48, 10);
    });
    text(ctx, 'ketuk untuk pilih', b.x + b.w - 24, y + 48, 11, '#90a4ae', 'normal', 'right');
    // Bar kesabaran
    const frac = o.patience / o.maxPatience;
    const col = frac > 0.5 ? '#66bb6a' : frac > 0.25 ? '#ffb300' : '#ef5350';
    bar(ctx, b.x + 24, y + 72, b.w - 48, 10, frac, col);
  });
}

function drawStove(ctx, s, t) {
  const a = LAYOUT.stove;
  const w = LAYOUT.wok;
  ctx.fillStyle = '#5d4037';
  rr(ctx, a.x, a.y, a.w, a.h, 14); ctx.fill();
  ctx.fillStyle = '#4e342e';
  rr(ctx, a.x + 8, a.y + 8, a.w - 16, 60, 10); ctx.fill();
  text(ctx, 'KOMPOR — WAJAN', a.x + a.w / 2, a.y + 38, 18, '#ffe082');
  // Api di bawah wajan
  const flick = 6 + Math.sin(t / 90) * 3;
  ctx.fillStyle = '#ff7043';
  ctx.beginPath();
  ctx.ellipse(w.x, 330, 70, 20 + flick, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffca28';
  ctx.beginPath();
  ctx.ellipse(w.x, 332, 44, 12 + flick * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wajan
  ctx.fillStyle = '#37474f';
  circle(ctx, w.x, w.y, w.r); ctx.fill();
  ctx.fillStyle = '#263238';
  circle(ctx, w.x, w.y, w.r - 10); ctx.fill();
  // Isi wajan: bahan yang sedang dimasak, atau bahan yang dimasukkan.
  const wokItems = s.cooking ? DISH_MAP[s.cooking.dish].recipe : s.wok;
  if (wokItems.length) {
    wokItems.forEach((ing, i) => {
      const ang = (i / Math.max(1, wokItems.length)) * Math.PI * 2 - Math.PI / 2;
      const px = w.x + Math.cos(ang) * 42;
      const py = w.y + Math.sin(ang) * 26;
      drawIngredientIcon(ctx, ing, px, py, 20);
    });
  } else {
    text(ctx, 'Wajan kosong', w.x, w.y - 6, 16, '#78909c');
    text(ctx, 'klik bahan di bawah', w.x, w.y + 16, 13, '#546e7a');
  }
  // Uap saat memasak
  if (s.cooking) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const sx = w.x - 48 + i * 32;
      const off = Math.sin(t / 300 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(sx, w.y - 96);
      ctx.quadraticCurveTo(sx + off, w.y - 130, sx - off, w.y - 152);
      ctx.stroke();
    }
  }
  // Bar timing memasak
  if (s.cooking) {
    const c = s.cooking;
    const bx = a.x + 20, by = a.y + 268, bw = a.w - 40;
    text(ctx, 'BERHENTI DI ZONA HIJAU!', a.x + a.w / 2, by - 14, 14, '#ffe082');
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    rr(ctx, bx, by, bw, 20, 10); ctx.fill();
    const zx0 = bx + c.zone[0] * bw, zx1 = bx + c.zone[1] * bw;
    ctx.fillStyle = '#66bb6a';
    ctx.fillRect(zx0, by, zx1 - zx0, 20);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(bx + (c.zone[0] - 0.08) * bw, by, (zx1 - zx0) * 0.4, 20);
    const mx = bx + c.marker * bw;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(mx - 3, by - 6, 6, 32);
  } else {
    // Tombol masak / status resep
    const b = LAYOUT.cookBtn;
    const ready = s.canCook;
    ctx.fillStyle = ready ? '#ff7043' : '#78909c';
    rr(ctx, b.x, b.y, b.w, b.h, 12); ctx.fill();
    text(ctx, ready ? 'MASAK!  [Spasi]' : 'MASAK  [Spasi]', b.x + b.w / 2, b.y + 26, 20, '#ffffff');
    // Tempat sampah
    const tr = LAYOUT.trash;
    ctx.fillStyle = '#546e7a';
    rr(ctx, tr.x, tr.y, tr.w, tr.h, 10); ctx.fill();
    text(ctx, 'BUANG', tr.x + tr.w / 2, tr.y + 26, 13, '#ffffff');
  }
}

function drawServe(ctx, s) {
  const a = LAYOUT.serve;
  ctx.fillStyle = '#6d4c41';
  rr(ctx, a.x, a.y, a.w, a.h, 14); ctx.fill();
  ctx.fillStyle = '#5d4037';
  rr(ctx, a.x + 8, a.y + 8, a.w - 16, 60, 10); ctx.fill();
  text(ctx, 'MEJA SAJI — PELANGGAN', a.x + a.w / 2, a.y + 38, 18, '#ffe082');
  // Pelanggan
  const mood = s.plate ? 'happy' : (s.orders.some((o) => o.patience / o.maxPatience < 0.25) ? 'worried' : 'happy');
  drawCustomer(ctx, 830, 300, mood);
  // Balon ucapan pelanggan
  const want = s.orders[0] ? DISH_MAP[s.orders[0].dish] : null;
  ctx.fillStyle = '#ffffff';
  rr(ctx, 880, 130, 220, 62, 12); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(880, 170); ctx.lineTo(862, 186); ctx.lineTo(884, 186);
  ctx.closePath(); ctx.fill();
  if (want) {
    text(ctx, 'Mau ' + want.name + '!', 990, 152, 17, '#263238');
    text(ctx, 'Rp ' + want.price, 990, 176, 14, '#bf360c');
  } else {
    text(ctx, 'Lapar nih...', 990, 162, 17, '#263238');
  }
  // Piring
  const p = LAYOUT.plate;
  if (s.plate) {
    drawDishOnPlate(ctx, DISH_MAP[s.plate], p.x, p.y, 1);
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.ellipse(p.x, p.y, 118, 46, 0, 0, Math.PI * 2); ctx.fill();
    text(ctx, 'Piring kosong', p.x, p.y - 4, 15, '#d7ccc8');
    text(ctx, 'masak dulu, lalu sajikan', p.x, p.y + 18, 12, '#bcaaa4');
  }
  // Tombol sajikan
  const b = LAYOUT.serveBtn;
  const ready = !!s.plate;
  ctx.fillStyle = ready ? '#43a047' : '#78909c';
  rr(ctx, b.x, b.y, b.w, b.h, 12); ctx.fill();
  text(ctx, ready ? 'SAJIKAN!  [Enter]' : 'SAJIKAN  [Enter]', b.x + b.w / 2, b.y + 26, 20, '#ffffff');
}

function drawCounter(ctx, s) {
  const c = LAYOUT.counter;
  ctx.fillStyle = '#8d6e63';
  rr(ctx, c.x, c.y, c.w, c.h, 14); ctx.fill();
  ctx.fillStyle = '#795548';
  ctx.fillRect(c.x, c.y, c.w, 12);
  text(ctx, 'BAHAN-BAHAN  —  klik untuk masukkan ke wajan  (tombol 1–0)', c.x + c.w / 2, c.y + 30, 17, '#ffe082');
  BIN_RECTS.forEach((b) => {
    const g = ING_MAP[b.id];
    const inWok = s.wok.includes(b.id);
    ctx.fillStyle = inWok ? '#fff3e0' : '#fff8e1';
    rr(ctx, b.x, b.y, b.w, b.h, 12); ctx.fill();
    if (inWok) {
      ctx.lineWidth = 4; ctx.strokeStyle = '#ff7043';
      rr(ctx, b.x, b.y, b.w, b.h, 12); ctx.stroke();
      text(ctx, '✓ DI WAJAN', b.x + b.w / 2, b.y + 132, 12, '#e64a19');
    }
    // Mangkuk
    ctx.fillStyle = '#b0bec5';
    ctx.beginPath(); ctx.ellipse(b.x + b.w / 2, b.y + 62, 44, 16, 0, 0, Math.PI); ctx.fill();
    drawIngredientIcon(ctx, b.id, b.x + b.w / 2, b.y + 52, 26);
    text(ctx, g.name, b.x + b.w / 2, b.y + 96, 16, '#263238');
    text(ctx, '[' + g.key + ']', b.x + b.w / 2, b.y + 116, 13, '#78909c');
  });
}

function drawPopups(ctx, s) {
  s.popups.forEach((p) => {
    const a = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = a;
    text(ctx, p.text, p.x, p.y, p.size || 22, p.color);
    ctx.globalAlpha = 1;
  });
}

function drawTitle(ctx, s, t) {
  ctx.fillStyle = 'rgba(38,32,28,0.55)';
  ctx.fillRect(0, 64, 1280, 656);
  ctx.fillStyle = '#fff3e0';
  rr(ctx, 340, 96, 600, 380, 18); ctx.fill();
  ctx.fillStyle = '#bf360c';
  text(ctx, 'DAPUR KILAT', 640, 152, 54, '#bf360c');
  text(ctx, 'N U S A N T A R A', 640, 196, 26, '#ff7043');
  text(ctx, 'Masak cepat, sajikan tepat waktu!', 640, 236, 20, '#5d4037');
  text(ctx, 'Terima pesanan → masukkan bahan ke wajan →', 640, 272, 17, '#4e342e', 'normal');
  text(ctx, 'masak di zona hijau → sajikan sebelum pelanggan pergi.', 640, 296, 17, '#4e342e', 'normal');
  text(ctx, 'Nasi Goreng • Sate Ayam • Mie Ayam • Es Teh Manis', 640, 326, 16, '#00897b');
  text(ctx, 'Klik / tombol 1–0 pilih bahan • Spasi masak • Enter sajikan', 640, 352, 14, '#78909c');
  const b = LAYOUT.startBtn;
  const pulse = 1 + Math.sin(t / 250) * 0.03;
  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = '#ff7043';
  rr(ctx, -b.w / 2, -b.h / 2, b.w, b.h, 16); ctx.fill();
  text(ctx, 'MULAI MEMASAK', 0, 2, 28, '#ffffff');
  ctx.restore();
  text(ctx, 'Skor tertinggi: ' + (s.best || 0), 640, 458, 16, '#ffe082');
}

function drawGameOver(ctx, s) {
  ctx.fillStyle = 'rgba(38,32,28,0.6)';
  ctx.fillRect(0, 64, 1280, 656);
  ctx.fillStyle = '#fff3e0';
  rr(ctx, 340, 130, 600, 340, 18); ctx.fill();
  text(ctx, s.dayLeft <= 0 ? 'HARI SELESAI!' : 'DAPUR TUTUP!', 640, 190, 44, '#bf360c');
  text(ctx, 'Skor akhir: ' + s.score, 640, 250, 26, '#263238');
  text(ctx, 'Pesanan tersaji: ' + s.served + '   •   Kombo terbaik: x' + s.bestCombo, 640, 292, 19, '#4e342e', 'normal');
  text(ctx, 'Pendapatan hari ini: Rp ' + s.coins, 640, 324, 19, '#bf360c');
  text(ctx, s.score >= 800 ? 'Luar biasa! Kamu koki bintang lima!' : s.score >= 400 ? 'Bagus! Pelanggan pulang kenyang.' : 'Terus latihan, koki hebat!', 640, 360, 18, '#00897b');
  const b = LAYOUT.restartBtn;
  ctx.fillStyle = '#ff7043';
  rr(ctx, b.x, b.y, b.w, b.h, 14); ctx.fill();
  text(ctx, 'MAIN LAGI  [R]', b.x + b.w / 2, b.y + 32, 24, '#ffffff');
}

export function render(ctx, s, t) {
  ctx.clearRect(0, 0, W, H);
  drawBackground(ctx, t);
  drawHUD(ctx, s);
  drawOrderBoard(ctx, s);
  drawStove(ctx, s, t);
  drawServe(ctx, s);
  drawCounter(ctx, s);
  drawPopups(ctx, s);
  if (s.mode === 'title') drawTitle(ctx, s, t);
  if (s.mode === 'over') drawGameOver(ctx, s);
}
