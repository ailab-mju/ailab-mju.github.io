# MJU AI Lab 홈페이지 — 구현 명세

**참조 목업:** `mju-ailab-site.html` (디자인·레이아웃·인터랙션의 기준)
**대상 저장소:** `ailab-mju/ailab-mju.github.io`
**도메인:** ailab.mju.ac.kr (기존 유지)

---

## 1. 배경

기존 사이트는 greenelab lab-website-template 기반 Jekyll. 구조 자체는 나쁘지 않았으나 콘텐츠가 2024년에서 멈췄다. 원인으로 추정되는 것:

- GitHub는 공개 저장소에서 60일간 **커밋** 활동이 없으면 스케줄 워크플로를 자동 비활성화한다. 태그·이슈·PR 머지는 활동으로 인정되지 않는다.
- 자동 수집이 조용히 멈췄고, 멈춘 사실을 알아챌 방법이 없었다.

**따라서 이번 설계의 제1원칙: 자동화를 최소화하고, 대신 낡았다는 사실이 눈에 보이게 만든다.**

---

## 2. 기술 스택

| 항목 | 선택 |
|---|---|
| 프레임워크 | Next.js (App Router) + `output: 'export'` |
| 스타일 | Tailwind CSS + CSS 변수 토큰 |
| 콘텐츠 | `content/*.yaml`, 빌드 타임에 js-yaml로 파싱 |
| 이미지 | 사전 리사이즈된 정적 파일 + 일반 `<img>` |
| 배포 | GitHub Actions → GitHub Pages |

**주의**
- 저장소가 조직 사이트(`*.github.io`)이므로 루트 경로로 서빙된다. `basePath`를 설정하지 말 것.
- `CNAME` 파일(`ailab.mju.ac.kr`)을 반드시 유지할 것. 배포 시 삭제되지 않도록 확인.
- static export이므로 `next/image` 최적화, 서버 컴포넌트의 런타임 fetch, 라우트 핸들러는 사용 불가.

---

## 3. 디자인 토큰

```css
--ink:   #151320;   /* 본문 텍스트 */
--paper: #f5f4f7;   /* 페이지 배경 */
--card:  #ffffff;
--line:  #e0dee6;   /* 테두리, 구분선 */
--mute:  #6d6980;   /* 보조 텍스트 */
--deep:  #3b1d52;   /* 저널명 등 강조 */
--teal:  #1f7f7a;   /* 링크, 액센트 */
```

폰트
- 제목: `Archivo` (Google Fonts)
- 본문: `Pretendard Variable` (jsDelivr CDN)
- 라벨·데이터: `JetBrains Mono`

한글이 포함된 제목은 Archivo에 글리프가 없으므로 `font-family: Archivo, "Pretendard Variable", sans-serif` 순으로 폴백 지정.

전체 밝은 톤, 다크 히어로 없음. 라운드 6~10px. 장식적 요소 없이 카드와 구분선 위주.

---

## 4. 언어 정책

**기본은 영문.** 내비게이션, 섹션 제목, 버튼, 필터, 빈 상태 문구, 논문·연구·멤버 정보 전부 영문.

**한국어로 두는 곳은 두 군데뿐:**
1. 홈 소개 문단 (`lab.yaml`의 `intro_ko`)
2. 모집 안내 본문 및 "메일에 담아주실 것" 목록 (`lab.yaml`의 `recruiting_ko`)

부가 규칙
- 멤버는 영문명이 주, 한글명이 보조
- 강의명은 영문 번역 + 한글 원래 명칭 병기
- **언어 전환 토글은 만들지 않는다.** 콘텐츠 두 벌 관리는 유지보수 실패의 원인이 된다.

---

## 5. 콘텐츠 스키마

### `content/publications.yaml`
```yaml
- title: "DeepFam: deep learning based alignment-free method for ..."
  authors: [Seokjun Seo, Minsik Oh, Youngjune Park, Sun Kim]
  venue: Bioinformatics
  date: 2018-07-01
  type: journal          # journal | conference | preprint
  doi: https://doi.org/gpmh64
  code: https://github.com/...   # 선택
```
- 저자명이 `Minsik Oh`면 렌더링 시 자동 굵게. 하드코딩 금지
- 연도 그룹은 `date`에서 파생. 별도 `year` 필드를 두지 말 것

### `content/members.yaml`
```yaml
- name: Minsik Oh
  name_ko: 오민식
  role: pi               # pi | phd | ms | intern | alumni
  topic: Machine learning for single-cell and spatial omics
  photo: minsik_oh.jpg   # 없으면 이니셜 폴백
  since: 2022-03
  until:                 # alumni만
  next:                  # alumni만 — 졸업 후 소속
  orcid:                 # 개인 논문 자동 매칭용
  links: { cv: ..., scholar: ..., github: ... }
  email: msoh@mju.ac.kr
```
- **졸업 처리는 `role`, `until`, `next` 세 필드 수정으로 끝나야 한다.** 파일 이동·삭제 없이
- 이메일은 평문 노출 금지. mailto 링크만 렌더링하거나 난독화 처리
- 개인 CV는 사이트가 호스팅하지 않고 `links.cv`로 외부 연결

### `content/gallery.yaml`
```yaml
- id: giw2026
  title: GIW 2026
  date: 2026-12
  caption: Poster presentations
  cover: 01.jpg
  photos: [01.jpg, 02.jpg, 03.jpg]
```

### `content/lab.yaml`
```yaml
name_en: Artificial Intelligence and Data Analytics Lab
department: Department of Artificial Intelligence, Myongji University
intro_ko: |
  단일세포 전사체와 공간 전사체 데이터를 위한 ...
recruiting_ko: |
  ... 모집합니다 ...
recruiting_checklist_ko: [간단한 자기소개 또는 CV, ...]
email: msoh@mju.ac.kr
address: ...
```

### 그 외
`content/research.yaml`, `content/news.yaml`, `content/courses.yaml`

---

## 6. 페이지별 기능

### `/` Home
- 헤더: 학과명 kicker, 연구실명, 한국어 소개 문단, 버튼 2개(Join / Research)
- **히어로 슬롯**: 현재 비워둔 상태. 점선 플레이스홀더. 후보 — 연구실 단체 사진, 대표 논문 Figure, 활동 사진 스트립. **슬롯을 통째로 삭제해도 페이지가 완결되도록 구현할 것**
- Research 카드 3개(요약), Recent publications 4건, News 3건, Join 블록
- 각 섹션 우상단에 전체 페이지로 가는 링크

### `/research`
- 카드 3개. 제목 + 설명 + 태그
- 아코디언 아님. 전부 펼쳐진 상태

### `/publications`
- 필터 3종 동시 동작: 텍스트 검색(제목+저자+저널) / 타입 / 연도
- 결과 건수 실시간 표시, 0건일 때 빈 상태 문구
- 연도 그룹 헤더로 구분
- 필터 상태를 URL 쿼리에 반영 (`?type=journal&year=2023`) — 공유 가능하게
- DOI 있으면 제목이 외부 링크

### `/members`
- PI 카드 상단 별도 배치
- 탭: MS Students / Research Interns / Alumni
- **Alumni 탭이 핵심.** `name · degree · year · current affiliation` 형식. 현재 데이터 없음 — 채워야 함
- 사진 없으면 영문 이니셜 폴백
- 각 멤버 카드에 CV·Scholar·GitHub 링크

### `/gallery`
- 앨범 카드 그리드 → 클릭 시 라이트박스
- 라이트박스: 좌우 화살표 키, ESC, 배경 클릭 닫기, 하단 썸네일 스트립, 배경 스크롤 잠금

### `/news`, `/teaching`
- 날짜·학기 거터 + 내용의 단순 리스트

### `/join`
- 모집 문구 + 체크리스트 + 메일 링크. 홈 하단과 동일 컴포넌트 재사용

---

## 7. 빌드 타임 파생 (적극 활용)

빌드마다 계산되므로 깨질 여지가 없고 유지보수 비용이 0이다. 다음은 **하드코딩하지 말고 반드시 파생시킬 것**:

- 논문 수, 멤버 수 등 모든 카운트
- 연도 필터 목록 (publications.yaml에서 추출)
- 멤버 개인 정보에 표시할 논문 목록 (이름/ORCID 매칭)
- **푸터의 마지막 갱신 날짜** — 빌드 시각 또는 최종 커밋 날짜
- **낡음 표시** — 가장 최근 논문 날짜가 12개월 이상 지났으면 관리자가 알아볼 수 있는 표시

마지막 두 항목이 이 설계에서 자동화를 대신하는 장치다.

---

## 8. 자동화 (최소한으로)

### 유지하는 것

**Claude Code 슬래시 커맨드** — `.claude/commands/`

| 커맨드 | 동작 |
|---|---|
| `/add-paper <DOI>` | 메타데이터 조회 → `publications.yaml` 추가 → `news.yaml`에 게재 소식 함께 생성 |
| `/add-member` | 대화형으로 `members.yaml` 추가 |
| `/graduate <이름>` | `role: alumni` 전환, `until`·`next` 입력 |
| `/add-gallery <폴더>` | 이미지 최적화 → 배치 → `gallery.yaml` 항목 생성 |
| `/add-news` | `news.yaml` 최상단에 추가 |

**갤러리 업로드 트리거 (유일한 크론 외 Action)**
`raw-photos/{앨범ID}/`에 파일이 추가되면 Action이 리사이즈 → WebP 변환 → 썸네일 → EXIF 제거 → `gallery.yaml` 항목 생성 → 원본 삭제. 학생이 GitHub 웹에서 드래그 앤 드롭만 하면 된다.

### 선택 사항 (없어도 되는 부품으로 취급)

**ORCID 주기 조회.** 붙일 경우 커밋이 아니라 **PR 생성** 방식으로. 자동 수집 메타데이터는 저자 순서 오류나 프리프린트 중복이 흔하므로 머지 버튼이 검수 역할을 한다. 동명이인 문제 때문에 이름 문자열이 아니라 ORCID iD로 매칭할 것.

**60일 규칙에 걸려 꺼져도 사이트는 정상 동작해야 한다.** 빌드는 이 자동화와 완전히 분리한다. keepalive, 실패 알림, 하트비트 같은 감시 장치는 붙이지 않는다 — 하나를 살리려고 셋을 더 붙이는 구조가 된다.

나중에 크롤링을 확장할 경우 ORCID·Crossref 등 공식 API만 사용. Google Scholar 스크레이핑은 차단 및 ToS 문제로 부적합.

---

## 9. 이미지 파이프라인

`scripts/optimize-images.mjs` (sharp 사용)

1. 원본을 읽어 긴 변 1600px WebP(품질 82)로 변환 → `public/images/gallery/{id}/`
2. 400px 썸네일 → `{id}/thumb/`
3. **EXIF 제거** — 촬영 위치 정보가 그대로 남는다
4. 원본은 커밋하지 않음 (`.gitignore`에 `raw-photos/`)

이 스크립트 없이 폰 사진을 그대로 올리면 저장소가 수백 MB로 불어난다.

---

## 10. CLAUDE.md에 기록할 규칙

- 논문이 accept되면 즉시 `/add-paper` 실행. 게재 확정 후로 미루지 말 것
- 학기 시작 시 members / courses 갱신
- 자동 메타데이터 수집을 빌드에 묶지 말 것
- 빌드 검증: `npm run build` 후 `out/` 확인
- 배포 전 `CNAME` 존재 확인
- 새 콘텐츠 타입을 만들 때는 YAML 스키마를 먼저 정의하고 컴포넌트를 나중에

---

## 11. 마이그레이션 체크리스트

**콘텐츠**
- [ ] 기존 `_data/citations.yaml` → `content/publications.yaml` 변환
- [ ] 기존 `_members/*.md` 14개 → `content/members.yaml` 단일 파일로 통합
- [ ] **2025–2026 논문 추가** — 목업의 placeholder 3건 교체 (scDECA, histology-spatial, CELLIA 등)
- [ ] PI 직함 Associate Professor로 수정
- [ ] **Alumni 데이터 수집 및 입력** (현재 완전히 비어 있음)
- [ ] 홈 소개문을 현재 연구 방향으로 재작성
- [ ] R&D Projects 갱신 — 종료 과제는 기간 표기
- [ ] 멤버 이메일 평문 노출 제거

**기술**
- [ ] `CNAME` 유지 확인
- [ ] `basePath` 미설정 확인
- [ ] 기존 URL 유지 여부 결정 (`/members/minsik_oh.html` 등)
- [ ] 파비콘·OG 이미지 교체 (현재 템플릿 기본값 `share-thumbnail.jpg`)
- [ ] 모바일 레이아웃 확인
- [ ] 키보드 포커스 표시 확인, `prefers-reduced-motion` 대응
- [ ] 히어로 슬롯: 채울지 삭제할지 결정
