// Dapur Kilat Nusantara — data hidangan dan bahan.
// Semua art digambar di canvas dari warna dan bentuk di bawah ini;
// tidak ada aset luar, tidak ada file eksternal.

export const INGREDIENTS = [
  { id: 'nasi',   name: 'Nasi',   short: 'NS', color: '#fff6d8', dark: '#d9c48a', key: '1' },
  { id: 'mie',    name: 'Mie',    short: 'MI', color: '#ffd54f', dark: '#c79a00', key: '2' },
  { id: 'ayam',   name: 'Ayam',   short: 'AY', color: '#ff9e7d', dark: '#c75b39', key: '3' },
  { id: 'telur',  name: 'Telur',  short: 'TL', color: '#fff176', dark: '#d8b400', key: '4' },
  { id: 'kecap',  name: 'Kecap',  short: 'KC', color: '#6d4c41', dark: '#3e2723', key: '5' },
  { id: 'cabai',  name: 'Cabai',  short: 'CB', color: '#ef5350', dark: '#b71c1c', key: '6' },
  { id: 'bawang', name: 'Bawang', short: 'BW', color: '#ce93d8', dark: '#8e24aa', key: '7' },
  { id: 'timun',  name: 'Timun',  short: 'TM', color: '#81c784', dark: '#2e7d32', key: '8' },
  { id: 'teh',    name: 'Teh',    short: 'TH', color: '#a1887f', dark: '#5d4037', key: '9' },
  { id: 'es',     name: 'Es Batu', short: 'ES', color: '#b3e5fc', dark: '#0288d1', key: '0' },
];

export const ING_MAP = Object.fromEntries(INGREDIENTS.map((g) => [g.id, g]));

export const DISHES = [
  {
    id: 'nasgor', name: 'Nasi Goreng', price: 120, difficulty: 2,
    recipe: ['nasi', 'telur', 'kecap', 'cabai'],
    color: '#ff7043', dark: '#bf360c', desc: 'Nasi digoreng di wajan panas',
  },
  {
    id: 'sate', name: 'Sate Ayam', price: 150, difficulty: 3,
    recipe: ['ayam', 'bawang', 'kecap', 'cabai'],
    color: '#e64a19', dark: '#7f1d0a', desc: 'Sate dibakar di atas arang',
  },
  {
    id: 'mieayam', name: 'Mie Ayam', price: 130, difficulty: 2,
    recipe: ['mie', 'ayam', 'bawang', 'timun'],
    color: '#fdd835', dark: '#9e7d00', desc: 'Mie kenyal kuah gurih',
  },
  {
    id: 'esteh', name: 'Es Teh Manis', price: 60, difficulty: 1,
    recipe: ['teh', 'es'],
    color: '#8d6e63', dark: '#4e342e', desc: 'Teh manis dingin menyegarkan',
  },
];

export const DISH_MAP = Object.fromEntries(DISHES.map((d) => [d.id, d]));

// Harga dan skor: harga dasar + bonus kombo + bonus kesempurnaan masak.
export function dishReward(dish, combo, perfect) {
  const mult = 1 + Math.min(combo, 10) * 0.1;
  const base = Math.round(dish.price * mult);
  return perfect ? base + 50 : base;
}

// Cek apakah isi wajan sama persis dengan resep (urutan bebas).
export function wokMatchesRecipe(wok, recipe) {
  if (wok.length !== recipe.length) return false;
  const have = [...wok].sort().join(',');
  const want = [...recipe].sort().join(',');
  return have === want;
}

// RNG deterministik (mulberry32) supaya screenshot bisa diulang.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
