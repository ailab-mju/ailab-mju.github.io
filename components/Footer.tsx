import { lab, lastUpdated, staleness, needsAttention } from '@/lib/content';

/**
 * 푸터의 "Last updated"와 낡음 표시가 이 사이트에서 자동화를 대신하는 장치다.
 * 크론이 조용히 멈춰도 여기 날짜가 굳으면 눈에 띈다.
 */
export default function Footer() {
  const year = Number(lastUpdated.slice(0, 4));
  const attention = needsAttention.publications;
  const untagged = needsAttention.untagged;
  const metrics = needsAttention.venueMetrics;
  const badNames = needsAttention.authorNames;
  const badAward = needsAttention.awardMembers + needsAttention.awardPapers;

  return (
    <footer className="foot">
      <div className="w">
        <div className="foot-in">
          <div>
            © {year} {lab.name_en}
            <br />
            {lab.department}, Yongin, Korea
          </div>
          <div>
            Last updated {lastUpdated} ·{' '}
            <a href={`mailto:${lab.email}`}>{lab.email}</a>
          </div>
        </div>
        {(staleness.stale || attention > 0 || untagged > 0 || metrics > 0 || badNames > 0 || badAward > 0) && (
          <p className="stale">
            {staleness.stale && staleness.months !== null && (
              <>
                Content check due — the most recent confirmed publication is{' '}
                {staleness.months} months old.
              </>
            )}
            {staleness.stale && attention > 0 && ' '}
            {attention > 0 && (
              <>
                {attention} publication{attention === 1 ? '' : 's'} still marked
                unverified.
              </>
            )}
            {untagged > 0 && (
              <>
                {' '}
                {untagged} publication{untagged === 1 ? '' : 's'} not assigned to a
                research area.
              </>
            )}
            {metrics > 0 && (
              <>
                {' '}
                {metrics} journal{metrics === 1 ? '' : 's'} missing SCIE / impact factor.
              </>
            )}
            {badNames > 0 && (
              <>
                {' '}
                {badNames} publication{badNames === 1 ? '' : 's'} with an author name that
                does not match its author list.
              </>
            )}
            {badAward > 0 && (
              <>
                {' '}
                {badAward} award entr{badAward === 1 ? 'y' : 'ies'} pointing at a member or
                paper that does not exist.
              </>
            )}
          </p>
        )}
      </div>
    </footer>
  );
}
