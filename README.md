# Dapur Kilat Nusantara

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/AhmadTurki182/dapur-kilat-nusantara/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/AhmadTurki182/dapur-kilat-nusantara/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

**Dapur Kilat Nusantara** — game masak masakan jalanan Indonesia. Kamu koki warung yang harus melayani pelanggan sebelum mereka kabur: terima pesanan di papan pesanan, masukkan bahan ke wajan, masak dengan timing yang tepat di zona hijau, lalu sajikan selagi panas. Nasi Goreng, Sate Ayam, Mie Ayam, dan Es Teh Manis — semua digambar di canvas, semua suara disintesis WebAudio, tanpa aset luar sama sekali.

Kompetisi: [Make the best cooking game](https://make.fun/bounty/best-cooking-game-20261125-0137) — total hadiah $250, 10 besar dibayar (juara 1 $60). AI judge membandingkan game dua-dua lewat screenshot dan outline source; makin sering dipilih, makin tinggi peringkat.

## Run it

```sh
node serve.ts
```

Lalu buka http://localhost:8080 — tanpa build step, tanpa network, file statis biasa.

Mode screenshot (dipakai untuk screenshot entry): `?shot=start`, `?shot=play`, `?shot=rush`, `?shot=serve`, masing-masing dengan `&seed=7` untuk adegan yang tetap.

## How it plays

- **Pesanan:** muncul di papan pesanan (kiri) dengan bahan yang dibutuhkan dan bar kesabaran. Klik pesanan untuk memilihnya.
- **Bahan:** klik mangkuk bahan di counter (atau tombol 1–0) untuk memasukkannya ke wajan. Klik bahan di wajan untuk mengeluarkannya; tombol BUANG mengosongkan wajan.
- **Masak:** kalau isi wajan sama persis dengan resep pesanan terpilih, tombol MASAK menyala. Tekan Spasi — marker bergerak di bar timing, tekan Spasi lagi di zona hijau. Berhenti di tengah zona = SEMPURNA (+50). Melenceng = gosong, bahan terbuang.
- **Sajikan:** hidangan matang mendarat di piring. Klik piring atau tombol SAJIKAN (Enter) untuk mengantar ke pelanggan. Hidangan yang tidak dipesan siapa pun tidak bisa disajikan.
- **Skor:** harga hidangan × pengali kombo + bonus sempurna. Kombo naik tiap sajian beruntun, reset kalau pesanan kabur atau masakan gosong. Tiga pesanan kabur = dapur tutup. Hari berlangsung 150 detik; makin banyak tersaji, level naik dan pesanan makin cepat.

## Controls

- Mouse: klik pesanan, bahan, wajan, tombol MASAK / SAJIKAN / BUANG, piring.
- Keyboard: 1–0 pilih bahan, Spasi masak / berhenti, Enter sajikan, T buang isi wajan, M suara nyala/mati, R main lagi.

## Layout

- `game/index.html` — halaman game (canvas 1280×720).
- `game/src/main.js` — loop, state, input, logika pesanan dan masak.
- `game/src/render.js` — semua gambar: dapur, papan pesanan, kompor, pelanggan, counter bahan.
- `game/src/dishes.js` — resep, bahan, harga, RNG deterministik.
- `game/src/audio.js` — suara WebAudio (klik, desis wajan, ding sajian).
- `game/src/shots.js` — adegan tetap untuk screenshot.
- `main.ts` — program penyerahan: menyalin game/ + screenshots/ ke output dan menulis dossier.json.
- `serve.ts` — server statis lokal untuk play-test.
- `shots.json` — daftar 4 screenshot entry.
