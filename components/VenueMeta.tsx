import { CATEGORIES, hasKorean, type Publication } from '@/lib/types';

const LABEL = new Map(CATEGORIES.map((c) => [c.key, c.label]));

/**
 * 저널명 · 연도 · 국내/해외 구분 · SCIE · IF. 전부 venues.yaml 에서 파생된다.
 * IF 는 값만 쓴다 — JCR 연도와 분위(Q1/Q2)는 venues.yaml 에만 남기고 화면에 내보내지 않는다.
 */
export default function VenueMeta({ pub }: { pub: Publication }) {
  const v = pub.venueInfo;
  // 영문명이 있으면 "English (원어)". 괄호 안쪽에만 lang 을 건다 —
  // 전체에 걸면 영문까지 한국어로 읽히고, 안 걸면 원어가 영어로 읽힌다.
  const native = hasKorean(pub.venue) ? (
    <span lang="ko">{pub.venue}</span>
  ) : (
    pub.venue
  );

  return (
    <>
      <span className="pub-v">
        {v?.name_en ? (
          <>
            {v.name_en} ({native})
          </>
        ) : (
          native
        )}
      </span>
      <span aria-hidden="true">·</span>
      <span>{pub.year}</span>

      {pub.category && <span className="flag">{LABEL.get(pub.category)}</span>}

      {v?.scie === true && <span className="flag scie">SCIE</span>}

      {typeof v?.impact_factor === 'number' && (
        <span className="flag if">IF {v.impact_factor.toFixed(1)}</span>
      )}

      {pub.todo && (
        <span className="flag todo" lang="ko">
          확인 필요
        </span>
      )}
    </>
  );
}
