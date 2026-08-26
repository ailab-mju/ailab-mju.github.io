# MJU AI Lab 홈페이지

Next.js(App Router) + `output: 'export'` 정적 사이트. 콘텐츠는 전부 `content/*.yaml`.
설계 근거는 `SPEC.md`, 디자인 기준은 `mju-ailab-site.html` 목업이다.

## 이 설계의 제1원칙

기존 사이트가 2024년에서 멈춘 이유는 자동 수집 워크플로가 조용히 죽었기 때문이다
(GitHub는 공개 저장소에서 60일간 커밋이 없으면 스케줄 워크플로를 자동 비활성화한다).

**따라서 자동화를 최소화하고, 대신 낡았다는 사실이 눈에 보이게 만든다.**

- 크론 워크플로가 없다. 빌드는 push에만 반응하므로 꺼지지 않는다.
- 푸터의 `Last updated` 는 최종 커밋 날짜다. 재배포만으로는 갱신되지 않는다.
- 확정 논문 중 최신 것이 12개월 이상 지나면 푸터에 경고가 뜬다.
- keepalive · 실패 알림 · 하트비트는 붙이지 않는다. 하나를 살리려고 셋을 더 붙이는 구조가 된다.

## 자주 하는 일

| 상황 | 커맨드 |
|---|---|
| 논문이 accept됐다 | `/add-paper <DOI>` |
| 새 멤버가 들어왔다 | `/add-member` |
| 졸업했다 | `/graduate <이름>` |
| 행사 사진이 생겼다 | `/add-gallery <폴더>` |
| 상을 받았다 | `/add-award` |
| 그 밖의 소식 | `/add-news` |

**논문이 accept되면 즉시 `/add-paper` 를 실행한다. 게재 확정 후로 미루지 않는다.**
**학기가 시작하면 `content/members.yaml` 과 `content/courses.yaml` 을 갱신한다.**

## 규칙

### 콘텐츠
- 새 콘텐츠 타입은 **YAML 스키마를 먼저 정의하고 컴포넌트를 나중에** 만든다.
- 카운트·연도 목록·개인 논문 목록·갱신 날짜는 전부 `lib/content.ts` 에서 파생된다.
  **어디에도 숫자를 하드코딩하지 말 것.**
- 논문의 연도는 `date` 에서 파생한다. `year` 필드를 만들지 말 것.
- `news.yaml` 의 `date` 와 `members.yaml` 의 `since`/`until` 은 **`YYYY-MM`** 이다.
  일자를 적지 않는다 — 학기·학위수여식 단위라 확인할 수 없는 정밀도가 된다.
- 수상·선정 이력은 `content/awards.yaml` 에 둔다. `member` 는 `members.yaml` 의 `name` 과
  일치해야 하고, 어긋나면 `/members` 와 푸터에 "수상자 미매칭" 경고가 뜬다.
  `kind` 로 수상(`award`)과 지원사업 선정(`grant`)을 나눈다 — 선정은 수상이 아니다.
  원어 이름은 `ko` 에 남기고 화면에는 `영문 (원어)` 로 함께 나간다.
  논문상은 `paper` 에 논문 제목을 적으면 `/publications` 의 그 논문 줄에 상 이름이 붙는다 —
  논문 쪽에 상 이름을 적지 말 것. 상은 상 파일에서만 관리한다.
- **수상 소식을 `news.yaml` 에 적지 말 것.** `/news` 목록은 `news.yaml` + `awards.yaml`
  파생 항목을 합친 것이다(`newsFeed`). 두 벌로 적으면 한쪽만 고쳐져 어긋난다.
- **IF·SCIE 는 논문이 아니라 저널의 속성이다.** `content/venues.yaml` 에서만 관리한다.
  논문에 IF 를 적지 말 것 — 매년 바뀌고 같은 저널 논문끼리 어긋난다.
  국내/해외 · 저널/컨퍼런스 구분도 venue 에서 파생된다.
- 새 저널에 실리면 `venues.yaml` 에 항목을 먼저 만든다. 없으면 빌드가 그 논문을
  "venue 미매칭"으로 세고 분류 배지가 사라진다.
- IF 는 **한 JCR 판(현재 2025판) 값으로 통일**하고 `source` 에 근거를 남긴다.
  연도가 섞이면 같은 목록 안에서 비교가 어긋난다. 화면에는 연도 없이 `IF 7.3` 만 나간다
  (`jcr_year` 는 갱신 시점을 알기 위해 yaml 에만 남긴다).
  출판사가 자동 조회를 막는 곳(Springer Nature·Elsevier·MDPI)은 WoS 기록에서 가져왔다.
  bioxbio·resurchify 처럼 값이 서로 다른 집계 사이트는 쓰지 않는다.
- 1저자·교신저자는 `first` / `corresponding` 으로 적는다. `first` 는 **공동1저자일 때만**
  — 비우면 `authors` 첫 사람이 1저자로 파생된다. 이름은 `authors` 표기와 글자까지 같아야 한다.
- 논문에는 `topics` 를 반드시 붙인다. `/research` 의 주제별 논문 목록·편수·연도 범위가
  전부 여기서 파생된다. 키는 `content/research.yaml` 의 `areas[].key` 와 일치해야 한다.
  누락되면 `/research` 와 푸터에 "주제 미분류" 경고가 뜬다 — 이것도 낡음을 드러내는 장치다.
- 연구 주제를 늘리거나 이름을 바꿀 때는 `research.yaml` 의 `key` 를 먼저 정하고
  해당 논문들의 `topics` 를 옮긴다. 페이지 코드는 손댈 필요가 없다.
- 저자 굵게 처리는 `content/members.yaml` 의 이름 목록에서 파생된다(졸업생 포함).
  이름을 하드코딩하지 말 것 — 멤버를 추가하면 과거 논문의 저자명도 함께 굵어진다.
  `lib/types.ts` 의 `isPI()` 는 members 매칭이 어긋나도 PI 는 굵게 나오게 하는 안전망이다.
- 졸업 처리는 `role` / `until` / `next` 세 필드 수정으로 끝나야 한다. 항목을 옮기지 않는다.
- 멤버 개인 페이지(`/members/<slug>/`)는 **논문이나 수상이 하나라도 있는 사람에게만** 생긴다.
  `lib/content.ts` 의 `memberPages` 가 파생한다 — 사람이 켜고 끄는 플래그를 만들지 말 것.
  이름·주제만 있는 빈 페이지는 없는 것보다 나쁘다.
- `slug` 는 이름에서 자동 생성하지 않고 `members.yaml` 에 적는다. 로마자 표기가 바뀌어도
  링크가 살아 있어야 한다. 한 번 정하면 바꾸지 않는다 — 겹치면 빌드가 잡는다.
- 멤버 이메일은 화면에 평문으로 찍지 않는다. mailto 링크만 렌더링한다.

### 언어
기본은 **영문**. 한국어는 네 군데뿐이다.
1. 홈 소개 문단 — `lab.yaml` 의 `intro_ko`
2. 모집 안내 및 체크리스트 — `lab.yaml` 의 `recruiting_ko`, `recruiting_checklist_ko`
3. 국내 학회 논문 제목 — **원문 그대로 쓴다.** 번역하면 인용이 어긋난다.
   영문 제목으로 발표된 논문이면 그 영문 제목을 쓴다.
4. 상·지원사업 이름 — `awards.yaml` 의 `ko`. 영문 뒤에 괄호로 붙는다.
   상 이름은 고유명사라 번역만 두면 무슨 상인지 찾을 수 없다.

**언어 전환 토글은 만들지 않는다.** 콘텐츠 두 벌 관리는 유지보수 실패의 원인이 된다.

### 기술
- **`basePath` 를 손으로 적지 말 것.** `next.config.mjs` 는 `PREVIEW_BASE_PATH` 만 읽고,
  그 값은 배포 워크플로가 저장소 이름에서 파생한다 — `*.github.io` 저장소나 `CNAME` 이
  있으면 루트, 그 밖의 저장소는 `/<repo>`. 그래서 임시 저장소에 올려도 안 깨지고,
  정식 저장소로 옮길 때 고칠 설정이 없다.
- `public/` 아래 파일을 생짜 `<img src>` 나 `<a href>` 로 가리킬 때는 반드시
  `asset()` / `next/link` 를 쓴다. `basePath` 는 생짜 경로에 붙지 않는다 —
  루트 서빙에서는 멀쩡하다가 하위 경로에서만 조용히 깨진다.
- static export이므로 `next/image` 최적화, 서버 컴포넌트의 런타임 fetch,
  라우트 핸들러를 쓸 수 없다.
- `lib/content.ts` 는 `fs` 를 읽으므로 **클라이언트 컴포넌트에서 임포트하면 빌드가 깨진다.**
  클라이언트 쪽에서 쓸 타입·순수 함수는 `lib/types.ts` 에 둔다.
- 자동 메타데이터 수집을 빌드에 묶지 말 것. 수집이 죽어도 사이트는 빌드돼야 한다.
- 이미지는 사전 리사이즈된 정적 파일만 쓴다. 원본을 커밋하지 않는다.
  행사 사진은 `npm run optimize-images`, 인물 사진은 `npm run optimize-member-photos`.
  둘 다 `raw-photos/` 의 원본을 처리하고 지운다.

### git
- **`main` 이 곧 배포다.** `main` 에 push 되면 `Deploy` 워크플로가 빌드해 Pages 에 올린다.
  손보는 일은 브랜치에서 하고 PR 로 합친다.
- 푸터의 `Last updated` 는 최종 커밋 날짜(`git log -1 --format=%cs`)다.
  워크플로 재실행이나 재배포로는 갱신되지 않는다 — 그게 목적이다.
- **`raw-photos/` 의 사진은 `.gitignore` 대상이다.** 추적되는 건 `raw-photos/README.md`
  하나뿐이고, 그건 GitHub 에 이 디렉터리가 존재하게 만들려고 둔 것이다.
  이 파일을 지우면 학생이 사진을 드래그해 넣을 곳이 사라진다.
  GitHub 웹 업로드는 `.gitignore` 를 거치지 않으므로 학생 업로드 경로는 그대로 동작한다.
- **워크플로가 만든 커밋은 다른 워크플로를 트리거하지 않는다** (`GITHUB_TOKEN` 재귀 방지).
  그래서 `Deploy` 는 `Process gallery uploads` 의 완료를 `workflow_run` 으로 받아 이어 돈다.
  이 연결이 끊기면 사진은 처리되지만 사이트에는 영영 안 나온다.
- 워크플로 안의 `actions/checkout` 에 `ref` 를 지정하지 말 것.
  `workflow_run` 의 `head_sha` 는 갤러리 워크플로를 *촉발한* 커밋이라 사진 커밋이 빠진다.
- `pro.html`(교수 연구업적 시스템 export)은 커밋하지 않는다. 내용은 `research.yaml` 에 있다.

### 배포처가 둘이다
- **GitHub Pages** — `main` 에 push 하면 `Deploy` 워크플로가 올린다. `ailab-mju.github.io`.
- **학교 서버** — `ailab.mju.ac.kr`. 이쪽은 자동이 아니다. `npm run deploy` 를 사람이 돌린다
  (`scripts/deploy-server.sh` 가 빌드해서 `/data/project/noalcohol/site` 로 rsync 한다.
  그 디렉터리는 `noalcohol` 소유라 배포에 sudo 가 필요 없다).
- 둘은 같은 커밋에서 나오지만 배포 시점이 다를 수 있다. **어긋나면 푸터의
  `Last updated` 날짜가 서로 달라 눈에 띈다** — 그게 이 구조에서 드리프트를 잡는 방법이다.
- Apache 설정은 `deploy/ailab-mju.conf` 에 있고 저장소가 정본이다. 서버에서 직접 고치지 말 것.
  **이 vhost 는 사이트만 서빙하지 않는다** — `/static`, `/media`, `/OlinkWeb/`, `/TFNetPropX/`
  가 같은 호스트에 얹혀 있다. 새 연구실 도구도 이 파일에 경로를 추가한다.
- `npm run deploy` 는 커밋되지 않은 변경이 있으면 멈춘다. 푸터 날짜가 최종 커밋
  날짜라, 그대로 올리면 화면 내용과 날짜가 어긋나기 때문이다.

### 배포 전 확인
```bash
npm run build       # out/ 생성 확인
```
- 커스텀 도메인을 쓴다면 저장소 루트의 `CNAME` 이 살아 있는지 확인한다.
  워크플로가 `out/` 으로 복사하지만, 파일 자체가 지워지면 도메인이 끊긴다.
- 현재 라이브 도메인은 `ailab-mju.github.io` 다. 저장소에 `CNAME` 이 없다.
  `ailab.mju.ac.kr` 로 옮기려면 DNS 설정 후 저장소 Settings > Pages 에서 지정하고,
  `content/lab.yaml` 의 `site_url` 도 함께 바꾼다.

## 남은 일

- `content/venues.yaml` 의 IF 는 JCR 2025판 값으로 다 채웠다. 출처가 WoS 기록인 항목은
  JCR(Clarivate) 직접 접속으로 한 번 대조하면 좋다 — 학교 도서관 → JCR → 저널명 검색.
- `content/publications.yaml` 의 `corresponding` 확인 — scFANCL(BMC Genomics)은
  출판사 조회가 막혀 미확인이고, 한국정보과학회 논문 15건은 지도교수·마지막 저자라는
  근거로 오민식을 교신저자로 적었다. 논문집 표기와 대조해 볼 것
- `content/publications.yaml` 의 JKMS 논문 게재월
- 한국정보과학회 논문 15건의 `pages` — RISS 목록에는 없다. DBpia 상세에서 확인 가능
- `content/members.yaml` alumni 블록 — 영문 표기, `until`, `next` 확인.
  2026-08 에 인턴을 마친 6명(배한준·박재욱·이태한·김민·오세리·안우섭)의 `until`/`next` 미입력
- 새 인턴 `JunHyeong Lim`·`Yunah Seo` 의 한글 이름·이메일·사진 미입력
- `content/research.yaml` 의 `projects` — DRL 다중오믹스 과제 1건의 기간과 지원 기관.
  나머지는 교수 연구업적 시스템 목록(`pro.html`)과 직접 확인으로 채웠다.
  이 건은 거기 없다(종료 과제로 보인다). NTIS나 산학협력단 기록에서 가져와야 한다.
- `content/lab.yaml` 의 `department` — 현재 "Department of Artificial Intelligence".
  명지대 공식 조직 표기는 인공지능·소프트웨어융합대학 > 융합소프트웨어학부 > 인공지능전공.
  어느 쪽으로 쓸지 결정 필요
- 히어로 슬롯 — 채울지(`components/HeroSlot.tsx` 의 `HERO` 설정) 삭제할지 결정
- OG 이미지

## 선택 사항 (없어도 되는 부품)

ORCID 주기 조회를 붙인다면 **커밋이 아니라 PR 생성** 방식으로 한다.
자동 수집 메타데이터는 저자 순서 오류·프리프린트 중복이 흔하므로 머지 버튼이 검수 역할을 한다.
동명이인 때문에 이름 문자열이 아니라 ORCID iD로 매칭한다.
그리고 **60일 규칙에 걸려 꺼져도 사이트는 정상 동작해야 한다.**
