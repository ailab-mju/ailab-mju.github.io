---
description: 수상·선정 이력을 awards.yaml에 추가한다
argument-hint: [수상 내용]
allowed-tools: Read, Edit, Bash(npm run build:*)
---

`content/awards.yaml` 에 항목을 추가한다. 최신 항목이 위로 간다.

```yaml
- date: YYYY-MM         # 개최월을 모르면 YYYY 만. 일자는 적지 않는다
  member: <members.yaml 의 name 그대로>
  kind: award | grant   # award=수상, grant=지원사업 선정
  title: <영문 상·사업 이름>
  ko: <원어 이름>
  org: <수여 학회·기관>
  paper: <논문상이면 publications.yaml 의 title 그대로>
```

## 규칙

- **`member` 는 `content/members.yaml` 의 `name` 과 글자까지 같아야 한다.**
  어긋나면 `/members` 와 푸터에 "수상자 미매칭" 경고가 뜬다.
  아직 멤버로 등록되지 않은 사람이면 `/add-member` 를 먼저 실행한다.
- **논문상이면 `paper` 에 그 논문 제목을 적는다.** `publications.yaml` 의 `title` 과
  글자까지 같아야 하고, 그러면 `/publications` 의 그 논문 줄에 상 이름이 함께 나간다.
  어긋나면 푸터에 경고가 뜬다. 포스터상·졸업상처럼 논문에 붙지 않는 상은 비운다.
- **선정(`grant`)을 수상(`award`)으로 적지 말 것.** 화면에서 두 묶음으로 나뉜다.
  연구장려금·지원사업 선정은 `grant` 다.
- `title` 은 영문. 원어는 `ko` 에 남긴다 — 국문 실적 자료를 만들 때 쓴다.
- 개최월을 모르면 지어내지 말고 `YYYY` 만 적는다.
- **`news.yaml` 에 따로 적지 말 것.** `/news` 목록이 `awards.yaml` 에서 파생된다.
- `ko` 에 "선정" 같은 서술어를 붙이지 않는다. `kind` 가 `grant` 면 문구가
  자동으로 `selected for` 가 된다.

내용: $ARGUMENTS

`npm run build` 로 통과 확인.
