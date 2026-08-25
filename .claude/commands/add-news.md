---
description: news.yaml 최상단에 소식을 추가한다
argument-hint: [소식 내용]
allowed-tools: Read, Edit, Bash(npm run build:*)
---

`content/news.yaml` **최상단**에 항목을 추가한다.

```yaml
- date: YYYY-MM         # 실제 일어난 달. 오늘 날짜가 아니다. 일자는 적지 않는다
  title: <영문 한 줄>
  body: <영문 한두 문장. 없으면 비운다>
```

## 규칙

- `date` 는 **월까지만**. 랩 소식은 학기·학위수여식 단위라 일자를 적으면
  확인할 수 없는 정밀도를 지어내게 된다. `members.yaml` 의 `since`/`until` 과 같은 단위다.
- 제목과 본문 모두 **영문**. 사이트 기본 언어는 영문이다.
- 사람 이름은 `content/members.yaml` 의 표기를 그대로 쓴다.
- `title` 은 명사구로 짧게. 예: `Four abstracts accepted to GIW 2026`
- 논문 게재 소식이라면 `/add-paper` 를 쓰는 편이 낫다 —
  publications.yaml 과 news.yaml 을 함께 처리한다.
- **수상 소식은 여기 적지 않는다.** `/add-award` 로 `awards.yaml` 에만 넣으면
  `/news` 목록에 자동으로 함께 나간다.

내용: $ARGUMENTS

`npm run build` 로 통과 확인.
