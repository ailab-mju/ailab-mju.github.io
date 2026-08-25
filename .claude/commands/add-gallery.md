---
description: 사진 폴더를 최적화해 갤러리 앨범으로 만든다
argument-hint: <사진이 들어 있는 폴더 경로>
allowed-tools: Read, Edit, Write, Bash(cp:*), Bash(ls:*), Bash(mkdir:*), Bash(npm run optimize-images), Bash(npm run build:*)
---

`$1` 의 사진들로 갤러리 앨범을 만든다.

## 절차

1. **앨범 ID를 정한다.** 소문자·숫자·하이픈만. 예: `giw2026`, `retreat-2026`.
   행사 이름 + 연도가 좋다.

2. `$1` 의 이미지들을 `raw-photos/{앨범ID}/` 로 복사한다.
   `members` 는 인물 사진 전용이라 앨범 ID로 쓸 수 없다.

3. `npm run optimize-images` 실행. 스크립트가 다음을 한다:
   - 긴 변 1600px WebP(품질 82) → `public/images/gallery/{id}/`
   - 400px 썸네일 → `{id}/thumb/`
   - EXIF 제거 (촬영 위치가 그대로 남는다)
   - `content/gallery.yaml` 항목 생성
   - 원본 삭제

4. `content/gallery.yaml` 에서 생성된 항목의 `title` / `date` / `caption` 을
   제대로 채운다. `photos` 와 `cover` 는 건드리지 말 것 — 파일에서 파생된다.
   - `title`: 행사 이름 (영문)
   - `date`: `YYYY-MM`
   - `caption`: 한 줄 설명 (영문)
   - `cover`: 갤러리 목록의 썸네일. **단체사진으로 고른다** — 인물 한 명이
     크게 잡힌 사진은 목록에서 무슨 행사인지 알아보기 어렵다.
     파일명에 `group` 이 들어 있으면 스크립트가 알아서 그걸 기본값으로 잡는다.

5. `npm run build` 로 통과 확인.

## 주의

원본을 그대로 커밋하지 말 것. `raw-photos/` 는 `.gitignore` 대상이고,
폰 사진을 그대로 올리면 저장소가 수백 MB로 불어난다.
