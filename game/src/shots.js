// Dapur Kilat Nusantara — adegan tetap untuk screenshot (?shot=...&seed=...).
// Setiap shot menyusun state yang sama setiap kali dijalankan dengan seed sama.

import { DISH_MAP } from './dishes.js';

function order(dish, patience, maxPatience) {
  return { id: Math.floor(Math.random() * 1e9), dish, patience, maxPatience };
}

export function applyShot(s, shot, rng) {
  s.frozen = true;
  s.muted = true;
  s.mode = 'playing';
  s.t = 1.2;
  s.dayTime = 150;
  s.score = 0;
  s.coins = 0;
  s.served = 0;
  s.combo = 0;
  s.bestCombo = 0;
  s.level = 1;
  s.lives = 3;
  s.orders = [];
  s.selectedOrder = -1;
  s.wok = [];
  s.cooking = null;
  s.plate = null;
  s.popups = [];
  s.perfectCook = false;
  s.best = 1240;

  if (shot === 'start') {
    s.mode = 'title';
    s.orders = [order('nasgor', 30, 38), order('sate', 22, 34)];
    s.dayLeft = 150;
    s.wok = ['nasi', 'telur'];
    return;
  }

  if (shot === 'play') {
    // Dapur ramai: 2 pesanan, wajan berisi bahan nasi goreng (3 dari 4),
    // satu pesanan terpilih, timer masih panjang.
    s.dayLeft = 118;
    s.score = 240;
    s.coins = 360;
    s.combo = 2;
    s.bestCombo = 2;
    s.served = 2;
    s.orders = [
      order('nasgor', 24, 38),
      order('mieayam', 30, 36),
    ];
    s.selectedOrder = 0;
    s.wok = ['nasi', 'telur', 'kecap'];
    s.canCook = false;
    return;
  }

  if (shot === 'rush') {
    // Detik genting: timer hari tinggal 12 detik, 3 pesanan dengan
    // kesabaran menipis, wajan sedang memasak sate (timing bar jalan).
    s.dayLeft = 12;
    s.score = 890;
    s.coins = 1120;
    s.combo = 4;
    s.bestCombo = 5;
    s.served = 7;
    s.level = 2;
    s.lives = 2;
    s.orders = [
      order('sate', 6, 32),
      order('nasgor', 11, 38),
      order('esteh', 17, 28),
    ];
    s.selectedOrder = 0;
    s.cooking = {
      dish: 'sate',
      marker: 0.52,
      dir: 1,
      speed: 0.012,
      zone: [0.42, 0.64],
      done: false,
    };
    s.popups = [
      { x: 512, y: 405, text: 'CEPAT!', color: '#ff8a65', size: 24, life: 60, maxLife: 60 },
    ];
    return;
  }

  if (shot === 'serve') {
    // Piring siap disajikan: nasi goreng lengkap di piring, pelanggan senang,
    // popup koin, pesanan terpilih cocok dengan piring.
    s.dayLeft = 96;
    s.score = 610;
    s.coins = 740;
    s.combo = 3;
    s.bestCombo = 3;
    s.served = 4;
    s.orders = [
      order('nasgor', 28, 38),
      order('esteh', 20, 28),
    ];
    s.selectedOrder = 0;
    s.plate = 'nasgor';
    s.perfectCook = true;
    s.popups = [
      { x: 994, y: 212, text: 'SEMPURNA! +50', color: '#ffd54f', size: 22, life: 60, maxLife: 60 },
      { x: 994, y: 240, text: '+170  Nasi Goreng', color: '#ffd54f', size: 20, life: 60, maxLife: 60 },
    ];
    return;
  }

  // Fallback: seperti play.
  s.dayLeft = 120;
  s.orders = [order('nasgor', 30, 38)];
  s.selectedOrder = 0;
  s.wok = ['nasi', 'telur'];
}
