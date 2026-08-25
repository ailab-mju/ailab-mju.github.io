#!/usr/bin/env node
/**
 * raw-photos/members/ 의 원본 인물 사진을 사이트가 쓰는 형태로 바꾼다.
 *
 *   1. 480px 정사각 WebP(품질 82)  → public/images/members/
 *   2. EXIF 제거 (촬영 위치가 그대로 남는다)
 *   3. content/members.yaml 의 photo: 를 채운다
 *   4. 원본 삭제 (raw-photos/ 는 .gitignore 대상)
 *
 * 파일 이름은 members.yaml 의 slug 로 짓는다 — janghyun-noh.jpg 처럼.
 * 확장자는 아무거나 (jpg/png/heic 등 sharp 가 읽는 형식).
 *
 * 실행: npm run optimize-member-photos
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const RAW = path.join(ROOT, 'raw-photos', 'members');
const OUT = path.join(ROOT, 'public', 'images', 'members');
const YAML_PATH = path.join(ROOT, 'content', 'members.yaml');
const EDGE = 480;

if (!fs.existsSync(RAW)) {
  console.log(`원본 폴더가 없다: ${path.relative(ROOT, RAW)}`);
  console.log('여기에 <slug>.jpg 형태로 넣고 다시 실행할 것.');
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
let yamlText = fs.readFileSync(YAML_PATH, 'utf8');
const slugs = new Set([...yamlText.matchAll(/^  slug: (\S+)$/gm)].map((m) => m[1]));

const files = fs.readdirSync(RAW).filter((f) => !f.startsWith('.'));
if (files.length === 0) {
  console.log('처리할 사진이 없다.');
  process.exit(0);
}

for (const file of files) {
  const slug = path.basename(file, path.extname(file));
  if (!slugs.has(slug)) {
    console.warn(`  건너뜀 ${file} — members.yaml 에 slug "${slug}" 가 없다`);
    continue;
  }
  const outName = `${slug.replace(/-/g, '_')}.webp`;
  await sharp(path.join(RAW, file))
    .rotate() // EXIF 방향만 반영하고 나머지 메타데이터는 버린다
    .resize(EDGE, EDGE, { fit: 'cover', position: 'attention' })
    .webp({ quality: 82 })
    .toFile(path.join(OUT, outName));

  // photo: 줄을 채운다. 이미 값이 있으면 덮어쓴다.
  const block = new RegExp(`(  slug: ${slug}\\n(?:.*\\n)*?  photo:)[^\\n]*`, 'm');
  if (block.test(yamlText)) {
    yamlText = yamlText.replace(block, `$1 ${outName}`);
  } else {
    console.warn(`  ${slug}: photo: 줄을 찾지 못했다. 직접 적을 것 — ${outName}`);
  }

  fs.unlinkSync(path.join(RAW, file));
  console.log(`  ${file} → public/images/members/${outName}`);
}

fs.writeFileSync(YAML_PATH, yamlText);
console.log('members.yaml 의 photo: 를 갱신했다. npm run build 로 확인할 것.');
