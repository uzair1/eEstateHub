// Generates local SVG placeholder images for EstateHub.
// Run: node src/scripts/generate-images.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '..', 'public', 'images');
fs.mkdirSync(OUT, { recursive: true });

// --- color palettes (bg top, bg bottom, accent) ---
const PALETTES = [
  ['#0f2a43', '#1e3550', '#c9a227'],
  ['#10233a', '#16324f', '#dfb84a'],
  ['#0d2236', '#213b57', '#b9892a'],
  ['#12304a', '#1a3d5c', '#d9a93f'],
  ['#0b1c30', '#24475f', '#cbb056'],
  ['#153047', '#1d3a4f', '#e0b64f'],
  ['#0f263a', '#243a50', '#bd9a35'],
  ['#112840', '#1f3f5f', '#d4a743'],
  ['#0e2135', '#233e56', '#c7a337'],
  ['#143250', '#1b2f47', '#deb454'],
  ['#0c1f33', '#274c69', '#c59c2b'],
  ['#16283d', '#1c3853', '#e2bd55'],
];

const house = (accent) => `
  <g transform="translate(600,470)">
    <rect x="-20" y="40" width="40" height="70" fill="rgba(0,0,0,0.25)"/>
    <polygon points="-190,55 -190,-20 -40,-120 80,-120 220,-25 220,55" fill="rgba(255,255,255,0.96)"/>
    <polygon points="-140,35 -140,-30 -30,-95 45,-95 160,-35 160,35" fill="#16283d"/>
    <rect x="-150" y="-45" width="210" height="14" rx="3" fill="${accent}"/>
    <rect x="-60" y="-30" width="120" height="60" fill="rgba(255,255,255,0.92)"/>
    <rect x="-60" y="-70" width="120" height="34" fill="rgba(255,255,255,0.92)"/>
    <rect x="-50" y="-12" width="22" height="42" fill="${accent}"/>
    <rect x="-2" y="-12" width="22" height="42" fill="${accent}"/>
    <circle cx="-45" cy="-52" r="7" fill="${accent}"/>
    <circle cx="-10" cy="-52" r="7" fill="${accent}"/>
    <circle cx="27" cy="-52" r="7" fill="${accent}"/>
    <circle cx="62" cy="-52" r="7" fill="${accent}"/>
  </g>`;

const tree = (x, y) => `
  <g transform="translate(${x},${y})">
    <rect x="-8" y="0" width="16" height="46" rx="4" fill="rgba(255,255,255,0.30)"/>
    <polygon points="-34,4 0,-46 34,4" fill="rgba(255,255,255,0.26)"/>
    <polygon points="-24,-6 0,-42 24,-6" fill="rgba(255,255,255,0.20)"/>
  </g>`;

const circleSun = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.85"/>`;

const propImage = (i) => {
  const [bg, bg2, accent] = PALETTES[i % PALETTES.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="Property image ${i + 1}">
  <defs>
    <linearGradient id="bg${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg${i})"/>
  ${circleSun(1020, 130, 46, accent)}
  <g transform="translate(0,0)">${tree(210, 560)}</g>
  <g transform="translate(0,0)">${tree(980, 540)}</g>
  ${house(accent)}
  <path d="M0 700 Q300 620 600 700 T1200 690 V800 H0 Z" fill="rgba(0,0,0,0.20)"/>
  <rect x="0" y="760" width="1200" height="40" fill="rgba(0,0,0,0.28)"/>
</svg>`;
};

const heroImage = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label="EstateHub hero">
  <defs>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1524"/>
      <stop offset="0.5" stop-color="#14283f"/>
      <stop offset="1" stop-color="#1e3550"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#hero)"/>
  <circle cx="1560" cy="200" r="120" fill="#c9a227" opacity="0.85"/>
  <g transform="translate(1360,220)">
    <polygon points="-330,120 -330,-70 -90,-210 190,-210 380,-90 380,120" fill="#ffffff" opacity="0.10"/>
  </g>
  <path d="M0 980 Q480 880 960 980 T1920 970 V1080 H0 Z" fill="#0b1524" opacity="0.6"/>
  <text x="160" y="920" font-family="Georgia, serif" font-size="46" fill="#c9a227" letter-spacing="6" opacity="0.7">ESTATEHUB</text>
</svg>`;

const avatarImage = (name, i) => {
  const [a, b, c] = PALETTES[i % PALETTES.length];
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="av${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="360" height="360" fill="url(#av${i})"/>
  <circle cx="180" cy="140" r="70" fill="${c}" opacity="0.9"/>
  <path d="M60 360 C60 250 110 205 180 205 C250 205 300 250 300 360 Z" fill="rgba(0,0,0,0.35)"/>
  <text x="180" y="225" font-family="Georgia, serif" font-size="66" font-weight="700" fill="#ffffff" text-anchor="middle" opacity="0.95">${initials}</text>
</svg>`;
};

const AGENTS = ['Sarah Mitchell', 'David Okonkwo', 'Elena Ruiz', 'Marcus Lee'];

fs.writeFileSync(path.join(OUT, 'hero.svg'), heroImage());
const ROWS = [['hero.svg', 'hero']];
for (let i = 0; i < 12; i += 1) {
  fs.writeFileSync(path.join(OUT, `prop-${i + 1}.svg`), propImage(i));
  ROWS.push([`prop-${i + 1}.svg`, `property ${i + 1}`]);
}
AGENTS.forEach((name, i) => {
  fs.writeFileSync(path.join(OUT, `agent-${i + 1}.svg`), avatarImage(name, i));
  ROWS.push([`agent-${i + 1}.svg`, name]);
});
fs.writeFileSync(path.join(OUT, 'office.svg'), propImage(3).replace('Property image 4', 'Office'));

ROWS.push(['office.svg', 'office']);
console.log(`Generated ${ROWS.length} images in ${OUT}`);
ROWS.forEach(([f]) => console.log(`  ${f}  ${fs.statSync(path.join(OUT, f)).size}b`));