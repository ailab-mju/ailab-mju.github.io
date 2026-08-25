import type { Metadata } from 'next';
import PublicationFilters from '@/components/PublicationFilters';
import {
  publications,
  years,
  counts,
  needsAttention,
  venuesNeedingMetrics,
  publicationsWithBadAuthorNames,
} from '@/lib/content';

export const metadata: Metadata = { title: 'Publications' };

export default function Publications() {
  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">Publications</p>
        <h2>Publications</h2>
        <p className="lede">
          {counts.publications} entries — {counts.internationalJournal} international journal,{' '}
          {counts.internationalConference} international conference, {counts.domesticJournal}{' '}
          domestic journal, {counts.domesticConference} domestic conference.{' '}
          {counts.scie} in SCIE-indexed venues.
        </p>
      </header>

      <section className="sec">
        {needsAttention.publications > 0 && (
          <div className="note">
            <b>확인 필요 {needsAttention.publications}건</b> — 저자·게재일·DOI가 아직 확정되지
            않은 항목입니다. <code>content/publications.yaml</code>에서 해당 항목의{' '}
            <code>todo</code> 줄을 지우면 이 안내가 사라집니다.
          </div>
        )}
        {venuesNeedingMetrics.length > 0 && (
          <div className="note">
            <b>SCIE·IF 미확인 저널 {venuesNeedingMetrics.length}곳</b> —{' '}
            {venuesNeedingMetrics.map((v) => v.name).join(', ')}.
            <br />
            출판사 사이트가 자동 조회를 막아 값을 확정하지 못했습니다. JCR에서 확인해{' '}
            <code>content/venues.yaml</code>의 <code>scie</code>·<code>impact_factor</code>·
            <code>quartile</code>을 채우면 해당 저널의 모든 논문에 한 번에 반영됩니다.
          </div>
        )}
        {publicationsWithBadAuthorNames.length > 0 && (
          <div className="note">
            <b>저자 표기 불일치 {publicationsWithBadAuthorNames.length}건</b> —{' '}
            {publicationsWithBadAuthorNames.map((x) => x.names.join(', ')).join(' / ')}.
            <br />
            <code>first</code>·<code>corresponding</code>에 적힌 이름이{' '}
            <code>authors</code> 안에 없습니다. 표기가 어긋나면 †·* 가 붙지 않습니다.
          </div>
        )}
        <p className="legend">
          <span className="au-m">†</span> first author &nbsp;·&nbsp;{' '}
          <span className="au-m">*</span> corresponding author
        </p>
        <PublicationFilters publications={publications} years={years} />
      </section>
    </div>
  );
}
