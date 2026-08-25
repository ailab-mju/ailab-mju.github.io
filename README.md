# Artificial Intelligence and Data Analytics Lab — Myongji University

연구실 홈페이지. Next.js 정적 사이트로 빌드해 GitHub Pages에 배포한다.

## 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ 에 정적 파일 생성
```

Node 20 이상이 필요하다.

## 콘텐츠 고치기

코드를 건드릴 일은 거의 없다. `content/` 의 YAML만 고치면 된다.

| 파일 | 내용 |
|---|---|
| `lab.yaml` | 연구실 이름, 소개, 모집 안내, 연락처 |
| `research.yaml` | 연구 분야, R&D 과제 |
| `publications.yaml` | 논문 |
| `members.yaml` | 구성원, 졸업생 |
| `news.yaml` | 소식 |
| `courses.yaml` | 강의 |
| `gallery.yaml` | 갤러리 앨범 (스크립트가 갱신) |

`main` 에 push하면 자동으로 빌드·배포된다.

## 사진 올리기

GitHub 웹에서 `raw-photos/{앨범ID}/` 에 사진을 드래그 앤 드롭하고 커밋하면
워크플로가 알아서 리사이즈·WebP 변환·썸네일 생성·EXIF 제거를 하고
`gallery.yaml` 에 앨범을 추가한다. 그다음 `title` / `date` / `caption` 만 손보면 된다.

로컬에서 하려면:

```bash
mkdir -p raw-photos/giw2026
cp ~/photos/*.jpg raw-photos/giw2026/
npm run optimize-images
```

## Claude Code 로 관리하기

`.claude/commands/` 에 커맨드가 있다.

```
/add-paper <DOI>      논문 + 게재 소식 추가
/add-member           멤버 추가
/graduate <이름>       alumni 전환
/add-gallery <폴더>    갤러리 앨범 생성
/add-news             소식 추가
```

작업 규칙은 `CLAUDE.md`, 설계 근거는 `SPEC.md` 에 있다.
