---
description: 새 멤버를 members.yaml에 추가한다
allowed-tools: Read, Edit, Bash(ls:*), Bash(npm run build:*)
---

새 멤버를 `content/members.yaml` 에 추가한다.

## 물어볼 것

1. 영문 이름 / 한글 이름 (slug 는 영문 이름에서 만든다)
2. 역할 — `phd` | `ms` | `intern`
3. 연구 주제 한 줄 (영문). 인턴은 비워도 된다
4. 시작 시점 (`YYYY-MM`)
5. 이메일
6. 사진 파일 (있으면). 링크 (CV / Scholar / GitHub)

## 규칙

- 같은 역할 그룹의 맨 아래에 넣는다. Alumni 블록 위쪽이다.
- `slug` 를 반드시 적는다 (`gildong-hong` 꼴). 개인 페이지 주소가 된다.
  이미 쓰는 slug 와 겹치면 안 된다 — 겹치면 한쪽 페이지가 사라지고 빌드가 경고한다.
  개인 페이지는 논문이나 수상이 생기면 자동으로 만들어진다. 없으면 링크 없는 카드로 남는다.
- 사진은 원본을 `raw-photos/members/<slug>.jpg` 에 놓고 `npm run optimize-member-photos`
  를 돌린다. 480px 정사각 WebP로 줄이고 EXIF를 지운 뒤 `photo:` 까지 채우고 원본을 지운다.
  **원본을 커밋하지 말 것.** 사진이 없으면 `photo:` 를 비운다 — 영문 이니셜로 폴백된다.
- 이메일은 yaml에만 두고 화면에는 mailto 링크로만 나간다. 그대로 적으면 된다.
- 링크가 없으면 `links: {}` 로 둔다.
- 멤버 수는 자동으로 다시 세어진다. 어디에도 숫자를 적지 말 것.
- **영문 이름은 논문 저자 표기와 같게 적는다.** 이 이름으로 두 가지가 파생된다:
  1. `/publications` 저자 목록에서 그 사람 이름이 굵게 나온다 (과거 논문 포함)
  2. 멤버 카드의 "N publications" 개수와 개인 논문 목록
  대소문자·띄어쓰기 차이는 무시되지만 로마자 표기가 다르면(`Goun` vs `Gowoon`) 매칭이 깨진다.
  이미 실린 논문의 표기와 다르면 사람에게 어느 쪽으로 통일할지 물어본다.
- 추가한 뒤 `/publications` 에서 그 사람 이름이 실제로 굵어졌는지 확인한다.
  안 굵어지면 `content/publications.yaml` 의 표기와 어긋난 것이다.

`npm run build` 로 통과 확인.
