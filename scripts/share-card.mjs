// Renders public/share-card.html to public/share-card.png (1200x630) with headless Chrome.
// Then add to <head>:  <meta property="og:image" content="https://your-site/share-card.png">
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const CHROME = process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : 'google-chrome';
const ROOT = path.resolve('public'), PORT = 4174, CDP = 9334;
const types = {'.html':'text/html','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); } res.writeHead(200, {'content-type': types[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(res); }).listen(PORT);
const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'card-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP}`, '--no-first-run', `--user-data-dir=${profile}`, '--disable-extensions', 'about:blank'], {stdio: 'ignore'});
await new Promise(r => setTimeout(r, 2500));
const page = (await (await fetch(`http://127.0.0.1:${CDP}/json`)).json()).find(t => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl); let id = 0; const pending = {};
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({id: i, method, params})); });
ws.onmessage = e => { const d = JSON.parse(e.data); if (d.id && pending[d.id]) { pending[d.id](d.result || d.error); delete pending[d.id]; } };
await new Promise(r => ws.onopen = r);
await send('Emulation.setDeviceMetricsOverride', {width: 1200, height: 630, deviceScaleFactor: 1, mobile: false});
await send('Page.navigate', {url: `http://127.0.0.1:${PORT}/share-card.html`});
await new Promise(r => setTimeout(r, 1500));
const shot = await send('Page.captureScreenshot', {format: 'png'});
fs.writeFileSync('public/share-card.png', Buffer.from(shot.data, 'base64'));
console.log('public/share-card.png');
ws.close(); server.close(); await new Promise(r => { chrome.on('exit', r); chrome.kill(); }); try { fs.rmSync(profile, {recursive: true, force: true}); } catch {}
