---
description: DOI로 논문을 추가하고 news 항목까지 함께 만든다
argument-hint: <DOI 또는 DOI URL>
allowed-tools: Read, Edit, Write, WebFetch, Bash(npm run build:*)
---

논문 `$1` 을 사이트에 추가한다.

## 절차

1. **메타데이터 조회.** Crossref API를 쓴다 — `https://api.crossref.org/works/{DOI}`.
   DOI가 URL 형태면 접두사를 떼고 `10.` 으로 시작하는 부분만 쓴다.
   Crossref에 없으면 (bioRxiv/arXiv 프리프린트 등) 해당 서비스의 공식 API를 쓴다.
   Google Scholar는 스크레이핑하지 않는다 — 차단 및 ToS 위반.

2. **`content/publications.yaml` 최상단에 추가.**
   ```yaml
   - title: >-
       논문 제목
     authors: [저자1, 저자2, ...]     # Crossref의 given + family 순서 그대로
     first: [저자1, 저자2]            # 공동1저자일 때만. 아니면 줄 자체를 빼면 된다
     corresponding: [교신저자, ...]   # 논문에 표기된 교신저자 전원
     venue: 저널명                    # content/venues.yaml 의 name 과 정확히 일치할 것
     date: YYYY-MM-DD                 # published-print 우선, 없으면 published-online
     doi: https://doi.org/{DOI}
     code:                            # GitHub 저장소가 있으면
     topics: [<research.yaml 의 areas[].key 중 하나 이상>]
   ```
   - `topics` 를 반드시 넣는다. `/research` 의 주제별 논문 목록이 여기서 파생된다.
     현재 키: `single-cell` `spatial` `multi-omics` `networks` `methods`.
     어디에도 안 맞으면 사람에게 물어보고, 새 주제가 필요하면
     `content/research.yaml` 의 `areas` 에 먼저 항목을 만든다.
     비워두면 푸터와 `/research` 에 "주제 미분류" 경고가 뜬다.
   - `type` / `scie` / `impact_factor` 를 논문에 적지 말 것. 전부 venue 에서 파생된다.
   - `first` / `corresponding` 의 이름은 `authors` 표기와 글자까지 같아야 한다.
     어긋나면 †·* 가 조용히 사라지고, 빌드가 "저자 표기 불일치"로 센다.
     Crossref 에는 교신저자 정보가 없다. 이 순서로 확인한다:
     1. OpenAlex — `https://api.openalex.org/works/https://doi.org/{DOI}` 의
        `authorships[].is_corresponding`
     2. Europe PMC 전문 XML — `https://www.ebi.ac.uk/europepmc/webservices/rest/{PMCID}/fullTextXML`
        의 `author-notes` 와 저자별 `xref`
     3. 저널 홈페이지의 "Correspondence to" / "교신저자"
     세 곳 다 없으면 비워두고 사람에게 묻는다. 마지막 저자라고 넘겨짚지 말 것.
   - `year` 필드를 만들지 말 것. 날짜에서 파생된다.
   - 저자명 굵게 처리를 하드코딩하지 말 것. `lib/types.ts`의 `isPI()`가 한다.
   - 이미 같은 DOI가 있으면 추가하지 말고 알린다.

3. **`content/news.yaml` 최상단에 게재 소식 추가.**
   ```yaml
   - date: <오늘 날짜>
     title: <논문 제목 축약> published in <저널명>
     body:
   ```

4. **`content/venues.yaml` 에 그 저널이 있는지 확인한다.** 없으면 항목을 추가한다:
   ```yaml
   - name: <container-title 그대로>
     scope: international | domestic   # 발행 주체 기준. 국내 학회·기관이면 domestic
     kind: journal | conference
     publisher: <출판사>
     scie: true | false                # 확인 못 하면 비워둔다
     impact_factor:                    # 기존 항목과 같은 JCR 판 값으로 맞출 것
     jcr_year:                         # 화면에 나가지 않지만 반드시 적는다
     quartile: Q1 | Q2 | ...           # best ranking 카테고리 기준
     source: <근거 URL>
   ```
   기존 항목은 전부 JCR 2025판이다. 다른 연도 값을 섞지 말 것.
   출판사 공식 페이지가 막혀 있으면 `https://wos-journal.info/?jsearch=<저널명>` 에서
   JIF·SCIE·percentile 을 읽는다(percentile 75% 이상이면 Q1). 확인 못 하면 비워두고
   사람에게 알린다 — 비어 있으면 사이트가 "SCIE·IF 미확인"으로 세어 보여준다.

5. **저자 순서와 저널명을 사람에게 확인시킨다.** 자동 수집 메타데이터는
   저자 순서 오류와 프리프린트 중복이 흔하다. 확인 결과를 요약해서 보여준다.

6. `npm run build` 로 통과 확인.
