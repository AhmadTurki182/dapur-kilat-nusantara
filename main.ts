// Dapur Kilat Nusantara — program penyerahan (Node 22, stdlib saja).
// Menyalin game/ dan screenshots/ dari samping file ini ke direktori output
// lalu menulis dossier.json lewat pustaka make.fun yang divendor.
// Direktori output itu sendiri TIDAK PERNAH dihapus — hanya isinya yang
// ditulis ulang, karena grader me-mount /output sebagai titik mount.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Game harus ada: tanpa index.html tidak ada yang bisa dinilai.
if (!existsSync(join(here, 'game', 'index.html'))) {
  throw new Error('game/index.html tidak ditemukan di ' + here);
}

// Siapkan direktori output (buat bila belum ada; jangan hapus direktori ini).
mkdirSync(out, { recursive: true });

// Bersihkan hasil salinan lama di DALAM output, lalu salin yang baru.
for (const name of ['game', 'screenshots']) {
  const dest = join(out, name);
  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
}
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// Batas scorer (sesuai gate kompetisi): teks maks 160 KiB, maks 4 screenshot
// @ 256 KiB, maks 993 file game / 48 MiB, path game maks 1000 byte.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
