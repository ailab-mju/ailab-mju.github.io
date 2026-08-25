#!/usr/bin/env node
/**
 * raw-photos/{앨범ID}/ 의 원본을 처리해 사이트가 쓰는 형태로 바꾼다.
 *
 * raw-photos/members/ 는 건드리지 않는다 — 인물 사진은 optimize-member-photos.mjs 담당.
 *
 *   1. 긴 변 1600px WebP(품질 82)  → public/images/gallery/{id}/
 *   2. 400px 썸네일                → public/images/gallery/{id}/thumb/
 *   3. EXIF 제거 (촬영 위치가 그대로 남는다)
 *   4. content/gallery.yaml 항목 생성·갱신
 *   5. 원본 삭제 (raw-photos/ 는 .gitignore 대상)
 *
 * 이 스크립트를 거치지 않고 폰 사진을 그대로 올리면 저장소가 수백 MB로 불어난다.
 *
 * 실행: npm run optimize-images
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const RAW = path.join(ROOT, 'raw-photos');
const OUT = path.join(ROOT, 'public', 'images', 'gallery');
const YAML_PATH = path.join(ROOT, 'content', 'gallery.yaml');

const FULL_EDGE = 1600;
const THUMB_EDGE = 400;
const QUALITY = 82;
const EXT = /\.(jpe?g|png|webp|heic|tiff?)$/i;

if (!fs.existsSync(RAW)) {
  console.log('raw-photos/ 가 없습니다. 처리할 사진이 없습니다.');
  process.exit(0);
}

// raw-photos/members/ 는 인물 사진 자리다(scripts/optimize-member-photos.mjs).
// 여기서 앨범으로 잡으면 멤버 얼굴이 갤러리에 올라간다.
const RESERVED = new Set(['members']);

const albumDirs = fs
  .readdirSync(RAW, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !RESERVED.has(d.name))
  .map((d) => d.name);

if (albumDirs.length === 0) {
  console.log('raw-photos/ 에 앨범 폴더가 없습니다.');
  process.exit(0);
}

/** 기존 gallery.yaml 을 읽는다. 사람이 손으로 고친 title/caption 을 덮어쓰지 않기 위해서다. */
const existing = (() => {
  if (!fs.existsSync(YAML_PATH)) return [];
  const parsed = yaml.load(fs.readFileSync(YAML_PATH, 'utf8'));
  return Array.isArray(parsed) ? parsed : [];
})();

const byId = new Map(existing.map((a) => [a.id, a]));

for (const id of albumDirs) {
  const srcDir = path.join(RAW, id);
  const files = fs.readdirSync(srcDir).filter((f) => EXT.test(f)).sort();
  if (files.length === 0) {
    console.log(`- ${id}: 이미지 없음, 건너뜀`);
    continue;
  }

  const fullDir = path.join(OUT, id);
  const thumbDir = path.join(fullDir, 'thumb');
  fs.mkdirSync(thumbDir, { recursive: true });

  const produced = [];
  const taken = new Set();

  for (const file of files) {
    // 한글·공백은 _ 로 바뀌므로 서로 다른 파일이 같은 이름이 될 수 있다.
    // 그대로 두면 조용히 덮어써지므로 뒤에 번호를 붙인다.
    const base = path.parse(file).name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    let unique = base;
    for (let n = 2; taken.has(unique); n += 1) unique = `${base}-${n}`;
    if (unique !== base) console.warn(`  ! ${file}: 이름 충돌 → ${unique}.webp`);
    taken.add(unique);
    const outName = `${unique}.webp`;

    // rotate() 는 EXIF 방향을 픽셀에 반영한 뒤 메타데이터를 버린다.
    // sharp 는 기본적으로 EXIF 를 출력에 싣지 않으므로 위치 정보가 남지 않는다.
    const pipeline = sharp(path.join(srcDir, file)).rotate();

    await pipeline
      .clone()
      .resize(FULL_EDGE, FULL_EDGE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(path.join(fullDir, outName));

    await pipeline
      .clone()
      .resize(THUMB_EDGE, THUMB_EDGE, { fit: 'cover', position: 'attention' })
      .webp({ quality: QUALITY })
      .toFile(path.join(thumbDir, outName));

    produced.push(outName);
  }

  const prev = byId.get(id);
  // 기존 사진 + 새 사진. 중복 없이 이름순.
  const all = [...new Set([...(prev?.photos ?? []), ...produced])].sort();
  // 갤러리 썸네일은 단체사진이 낫다. 파일명에 group 이 있으면 그걸 기본 커버로 쓴다.
  const defaultCover = all.find((f) => /group/i.test(f)) ?? all[0];
  byId.set(id, {
    id,
    title: prev?.title ?? id,
    date: prev?.date ?? new Date().toISOString().slice(0, 7),
    caption: prev?.caption ?? null,
    // produced 가 아니라 all 로 확인한다 — 사진을 덧붙일 때마다 고른 커버가 초기화되면 안 된다.
    cover: prev?.cover && all.includes(prev.cover) ? prev.cover : defaultCover,
    photos: all,
  });

  // 원본 삭제 — 커밋되지 않도록
  fs.rmSync(srcDir, { recursive: true, force: true });
  console.log(`- ${id}: ${produced.length}장 처리, 원본 삭제`);
}

// 최신 앨범이 위로
const albums = [...byId.values()].sort((a, b) => String(b.date).localeCompare(String(a.date)));

const header = `# 이 파일은 scripts/optimize-images.mjs 가 갱신한다.
# title / date / caption 은 사람이 고쳐도 되고, 다음 실행 때 유지된다.
# photos 와 cover 는 실제 파일 목록에서 파생되므로 손대지 말 것.

`;

fs.writeFileSync(
  YAML_PATH,
  albums.length === 0 ? `${header}[]\n` : header + yaml.dump(albums, { lineWidth: 100 }),
  'utf8',
);

console.log(`content/gallery.yaml 갱신 완료 — 앨범 ${albums.length}개`);
