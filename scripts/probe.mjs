// Screenshots public/index.html at phone and laptop width with headless Chrome.
// Usage: node scripts/probe.mjs [path]   (default: /index.html)
// Output: shots/390.png and shots/1440.png, plus the page's scrollWidth at each size.
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const CHROME = process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  : process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'google-chrome';
const PAGE = process.argv[2] || '/index.html';
const ROOT = path.resolve('public');
const PORT = 4173, CDP = 9333;

const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4'};
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'content-type': types[path.extname(f)] || 'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
}).listen(PORT);

const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'probe-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP}`, '--no-first-run', `--user-data-dir=${profile}`, '--disable-extensions', '--hide-scrollbars', 'about:blank'], {stdio: 'ignore'});
await new Promise(r => setTimeout(r, 2500));
const list = await (await fetch(`http://127.0.0.1:${CDP}/json`)).json();
const page = list.find(t => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pending = {};
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({id: i, method, params})); });
ws.onmessage = e => { const d = JSON.parse(e.data); if (d.id && pending[d.id]) { pending[d.id](d.result || d.error); delete pending[d.id]; } };
await new Promise(r => ws.onopen = r);
await send('Page.enable');

fs.mkdirSync('shots', {recursive: true});
for (const [w, h, mobile] of [[390, 844, true], [1440, 900, false]]) {
  await send('Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: 1, mobile});
  await send('Page.navigate', {url: `http://127.0.0.1:${PORT}${PAGE}`});
  await new Promise(r => setTimeout(r, 1500));
  const sw = await send('Runtime.evaluate', {expression: 'document.documentElement.scrollWidth', returnByValue: true});
  const shot = await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: true});
  fs.writeFileSync(`shots/${w}.png`, Buffer.from(shot.data, 'base64'));
  const width = sw.result?.value;
  console.log(`${w}px: shots/${w}.png, scrollWidth ${width}${width > w ? '  <-- SIDEWAYS SCROLL' : ''}`);
}
ws.close(); server.close();
await new Promise(r => { chrome.on('exit', r); chrome.kill(); });
try { fs.rmSync(profile, {recursive: true, force: true}); } catch {}
