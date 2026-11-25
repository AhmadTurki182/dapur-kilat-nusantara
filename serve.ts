// Dapur Kilat Nusantara — server statis lokal untuk play-test.
// Jalankan: node serve.ts  lalu buka http://localhost:8080
// Hanya menyajikan file di bawah game/, tanpa network ke luar.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, 'game');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let path = decodeURIComponent(url.pathname);
    if (path === '/') path = '/index.html';
    const file = join(root, path);
    if (!file.startsWith(root)) {
      res.writeHead(403);
      res.end('forbidden');
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
      'x-content-type-options': 'nosniff',
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

const port = Number(process.env.PORT || 8080);
server.listen(port, () => {
  console.log('Dapur Kilat Nusantara: http://localhost:' + port);
});
