import { CATEGORIES, type Publication } from '@/lib/types';

const LABEL = new Map(CATEGORIES.map((c) => [c.key, c.label]));

/**
 * 저널명 · 연도 · 국내/해외 구분 · SCIE · IF. 전부 venues.yaml 에서 파생된다.
 * IF 는 값만 쓴다 — JCR 연도와 분위(Q1/Q2)는 venues.yaml 에만 남기고 화면에 내보내지 않는다.
 */
export default function VenueMeta({ pub }: { pub: Publication }) {
  const v = pub.venueInfo;
  const venueLabel = v?.name_en ? `${v.name_en} (${pub.venue})` : pub.venue;

  return (
    <>
      <span className="pub-v">{venueLabel}</span>
      <span aria-hidden="true">·</span>
      <span>{pub.year}</span>

      {pub.category && <span className="flag">{LABEL.get(pub.category)}</span>}

      {v?.scie === true && <span className="flag scie">SCIE</span>}

      {typeof v?.impact_factor === 'number' && (
        <span className="flag if">IF {v.impact_factor.toFixed(1)}</span>
      )}

      {pub.todo && <span className="flag todo">확인 필요</span>}
    </>
  );
}
