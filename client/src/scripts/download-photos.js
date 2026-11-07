// Downloads real, royalty-free demo photos and saves them locally so the site
// never depends on an external image CDN at runtime.
// Run: node src/scripts/download-photos.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '..', 'public', 'images');
const PROPS_DIR = path.join(OUT, 'props');
fs.mkdirSync(PROPS_DIR, { recursive: true });

async function download(url, dest, seedForName) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  const kb = Math.round(buf.length / 1024);
  console.log(`  ${path.basename(dest)}  ${kb} KB  (${url})`);
  return dest;
}

const results = [];
for (let i = 1; i <= 12; i += 1) {
  results.push(download(`https://picsum.photos/seed/ehprop${i}/1200/800`, path.join(PROPS_DIR, `prop-${i}.jpg`)));
}

results.push(download('https://picsum.photos/seed/ehhero8/1920/1080', path.join(OUT, 'hero.jpg')));

// real avatar portraits via pravatar
const avatarIds = [47, 12, 32, 59];
for (let i = 0; i < avatarIds.length; i += 1) {
  results.push(download(`https://i.pravatar.cc/360?img=${avatarIds[i]}`, path.join(OUT, `agent-${i + 1}.jpg`)));
}

// company/office photo
results.push(download('https://picsum.photos/seed/ehoffice5/800/1000', path.join(OUT, 'office.jpg')));

await Promise.allSettled(results);
console.log(`\nDone. Files in ${OUT}`);
console.log(fs.readdirSync(PROPS_DIR).length + ' property photos, plus hero/agents/office.');