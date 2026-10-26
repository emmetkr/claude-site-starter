// Serves public/ at http://localhost:4173 so you can open the site in a browser while you work.
// Usage: node scripts/serve.mjs   (stop with Ctrl+C)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve('public'), PORT = 4173;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4','.json':'application/json'};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let f = path.join(ROOT, p);
  if (!path.extname(f) && fs.existsSync(f + '/index.html')) f += '/index.html';
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404, {'content-type': 'text/plain'}); return res.end('not found'); }
  res.writeHead(200, {'content-type': types[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store'});
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
