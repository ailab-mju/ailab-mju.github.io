---
description: 멤버를 alumni로 전환한다
argument-hint: <이름>
allowed-tools: Read, Edit, Bash(npm run build:*)
---

`$1` 을 alumni로 전환한다.

## 절차

`content/members.yaml` 에서 해당 항목을 찾아 **세 필드만** 고친다.
항목을 옮기거나 지우지 말 것. 사진과 이메일도 그대로 둔다.

```yaml
  role: alumni
  degree: <MS | PhD | Undergraduate Research Intern>   # 받은 학위
  until: <YYYY-MM>                                      # 떠난 시점
  next: <졸업 후 소속>                                   # 모르면 사람에게 물어본다
```

`topic:` 은 남겨둔다 — 무슨 연구를 했는지가 alumni 목록에서 의미 있다.

**이름을 지우지 않는 이유가 하나 더 있다.** 저자 굵게 처리가 `members.yaml` 의
이름 목록에서 파생되므로(졸업생 포함), 항목을 지우면 그 사람이 재학 중에 쓴
논문의 저자명이 조용히 굵기를 잃는다.

## 확인할 것

- `next` 를 비워두면 Alumni 탭에 소속이 안 나온다. 가능하면 채운다.
- MS/PhD 학위를 받았다면 `degree` 를 반드시 적는다. Alumni 목록은
  `name · degree · period · affiliation` 형식으로 렌더링된다.

`npm run build` 로 통과 확인.
