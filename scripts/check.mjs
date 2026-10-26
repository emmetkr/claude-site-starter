// Checks every page in public/ for unbalanced tags and links to files that do not exist.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve('public');
let bad = 0;
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); } })(ROOT);
for (const p of pages) {
  const s = fs.readFileSync(p, 'utf8');
  for (const tag of ['div', 'section', 'main', 'nav', 'footer', 'header', 'ul', 'p', 'a']) {
    const open = (s.match(new RegExp(`<${tag}\\b[^>]*(?<!/)>`, 'g')) || []).length;
    const close = (s.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (open !== close) { console.log(`${path.relative('.', p)}: <${tag}> opened ${open}, closed ${close}`); bad++; }
  }
  for (const m of s.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
    const f = path.join(ROOT, m[1].endsWith('/') ? m[1] + 'index.html' : m[1]);
    if (!fs.existsSync(f)) { console.log(`${path.relative('.', p)}: missing ${m[1]}`); bad++; }
  }
}
console.log(bad ? `${bad} problem${bad > 1 ? 's' : ''}` : `${pages.length} page${pages.length > 1 ? 's' : ''} clean`);
process.exit(bad ? 1 : 0);
