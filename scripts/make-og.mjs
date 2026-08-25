#!/usr/bin/env node
/**
 * OG 이미지(1200×630)를 만든다. → public/images/og.png
 *
 * 카톡·슬랙·트위터에 링크를 붙이면 미리보기 카드가 뜬다. 이미지가 없으면 그 자리가
 * 빈 채로 나가고, 학과 홈페이지에서 링크를 타고 오는 학생이 처음 보는 것이 그 빈 카드다.
 *
 * 글자는 전부 content/lab.yaml 에서 읽는다 — 랩 이름이나 소속이 바뀌면
 * 이 스크립트를 다시 돌리기만 하면 된다. 여기에 문구를 적지 말 것.
 *
 * Archivo 는 커밋하지 않는다. 사이트는 Google Fonts 에서 받아 쓰고, 이 스크립트는
 * 만들 때만 임시로 내려받는다. 저장소에 폰트 바이너리를 둘 이유가 없다.
 *
 * 실행: npm run make-og
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'images', 'og.png');
const FONT_URL =
  'https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf';
const FONT_CACHE = path.join(os.tmpdir(), 'archivo-variable.ttf');

const W = 1200;
const H = 630;

// 사이트 토큰과 같은 값이다. app/globals.css 를 고치면 여기도 맞춘다.
const INK = '#151320';
const INK_2 = '#3f3b4e';
const PAPER = '#f5f4f7';
const CARD = '#ffffff';
const LINE = '#e0dee6';
const MUTE = '#6d6980';
const TEAL = '#1a6d6a';

const lab = yaml.load(fs.readFileSync(path.join(ROOT, 'content', 'lab.yaml'), 'utf8'));

/** 글자 폭을 재지 않고 대략적인 평균 자폭으로 줄을 나눈다. OG 카드는 한 줄이면 충분하다. */
function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (line && `${line} ${w}`.length > maxChars) {
      lines.push(line);
      line = w;
    } else {
      line = line ? `${line} ${w}` : w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

async function font() {
  if (!fs.existsSync(FONT_CACHE)) {
    console.log('Archivo 내려받는 중…');
    const res = await fetch(FONT_URL);
    if (!res.ok) throw new Error(`폰트를 받지 못했습니다: HTTP ${res.status}`);
    fs.writeFileSync(FONT_CACHE, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(FONT_CACHE).toString('base64');
}

const titleLines = wrap(lab.name_en, 26);
const taglineLines = wrap(lab.tagline, 52);

// 제목 줄 수에 따라 아래 블록이 밀린다. 줄 수를 세지 않고 고정 y 를 쓰면
// 이름이 길어졌을 때 태그라인과 겹친다.
const TITLE_TOP = 236;
const TITLE_STEP = 76;
const taglineTop = TITLE_TOP + titleLines.length * TITLE_STEP + 18;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Archivo';
        src: url(data:font/ttf;base64,${await font()}) format('truetype');
        font-weight: 400 800;
      }
      .t { font-family: 'Archivo'; font-weight: 700; font-size: 62px; fill: ${INK}; letter-spacing: -1.2px; }
      .s { font-family: 'Archivo'; font-weight: 400; font-size: 27px; fill: ${INK_2}; }
      .m { font-family: 'Archivo'; font-weight: 600; font-size: 19px; fill: ${MUTE}; letter-spacing: 2.6px; }
      .u { font-family: 'Archivo'; font-weight: 600; font-size: 22px; fill: ${INK}; }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" rx="18" fill="${CARD}" stroke="${LINE}" stroke-width="2"/>

  <g transform="translate(104 104) scale(2.4)">
    <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="none" stroke="${INK}" stroke-width="1.6"/>
    <circle cx="12" cy="12" r="3.2" fill="${TEAL}"/>
  </g>
  <text x="176" y="132" class="u">${esc(lab.name_short)}</text>

  ${titleLines
    .map((l, i) => `<text x="104" y="${TITLE_TOP + i * TITLE_STEP}" class="t">${esc(l)}</text>`)
    .join('\n  ')}

  ${taglineLines
    .map((l, i) => `<text x="104" y="${taglineTop + i * 40}" class="s">${esc(l)}</text>`)
    .join('\n  ')}

  <text x="104" y="${H - 96}" class="m">${esc(lab.department.toUpperCase())}</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);

const { size } = fs.statSync(OUT);
console.log(`${path.relative(ROOT, OUT)} — ${W}×${H}, ${Math.round(size / 1024)}KB`);
