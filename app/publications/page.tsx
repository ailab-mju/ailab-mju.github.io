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
        <h1>Publications</h1>
        <p className="lede">
          {counts.publications} entries — {counts.internationalJournal} international journal,{' '}
          {counts.internationalConference} international conference, {counts.domesticJournal}{' '}
          domestic journal, {counts.domesticConference} domestic conference.{' '}
          {counts.scie} in SCIE-indexed venues.
        </p>
      </header>

      <section className="sec">
        {needsAttention.publications > 0 && (
          <div className="note" lang="ko">
            아래 목록 중 {needsAttention.publications}건은 저자·게재일·DOI를 아직 확인하는
            중입니다. 해당 항목에 <b>확인 필요</b> 표시가 붙어 있습니다.
          </div>
        )}
        {venuesNeedingMetrics.length > 0 && (
          <div className="note" lang="ko">
            {venuesNeedingMetrics.map((v) => v.name).join(', ')}
            {venuesNeedingMetrics.length === 1 ? '의' : ' 저널의'} SCIE 등재 여부와 impact
            factor는 아직 확인하지 못했습니다. 해당 논문에는 그 배지가 표시되지 않습니다.
          </div>
        )}
        {publicationsWithBadAuthorNames.length > 0 && (
          <div className="note" lang="ko">
            {publicationsWithBadAuthorNames.length}건의 논문에서 저자 표기를 대조하는 중이라
            1저자·교신저자 표시가 빠져 있습니다.
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
