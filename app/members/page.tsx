import type { Metadata } from 'next';
import Link from 'next/link';
import Face from '@/components/Face';
import MemberTabs, { MemberLinks } from '@/components/MemberTabs';
import {
  lab,
  pi,
  membersByRole,
  counts,
  awards,
  memberHref,
  memberPeriod,
  awardLabel,
  unmatchedAwardMembers,
  AWARD_GROUPS,
  type Role,
} from '@/lib/content';

export const metadata: Metadata = { title: 'Members' };

/** 탭 구성은 데이터에서 파생한다. PhD가 한 명도 없으면 탭 자체가 생기지 않는다. */
const TAB_ORDER: { key: Role; label: string }[] = [
  { key: 'phd', label: 'PhD Students' },
  { key: 'ms', label: 'MS Students' },
  { key: 'intern', label: 'Research Interns' },
  { key: 'alumni', label: 'Alumni' },
];

export default function Members() {
  // 개인 페이지가 있는 멤버만 href 가 붙는다. 어느 멤버에게 페이지가 있는지는
  // lib/content.ts 가 논문·수상 유무로 파생한다 — 여기서 판단하지 않는다.
  const piHref = pi ? memberHref(pi) : null;
  const groups = TAB_ORDER.map((t) => ({
    ...t,
    members: membersByRole(t.key).map((m) => ({ ...m, href: memberHref(m) })),
  })).filter((g) => g.key === 'alumni' || g.members.length > 0);

  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">Members</p>
        <h2>Members</h2>
        <p className="lede">
          {counts.members} current members and {counts.alumni} alumni.
        </p>
      </header>

      <section className="sec">
        {pi && (
          <div className="pi">
            <Face member={pi} />
            <div>
              <div className="person-r" style={{ marginTop: 0 }}>
                Principal Investigator
                {memberPeriod(pi) ? ` · ${memberPeriod(pi)}` : ''}
              </div>
              <h3 style={{ fontSize: 23, marginTop: 5 }}>
                {piHref ? <Link href={piHref}>{pi.name}</Link> : pi.name}{' '}
                {pi.name_ko && (
                  <span style={{ fontWeight: 400, color: 'var(--mute)', fontSize: 17 }}>
                    {pi.name_ko}
                  </span>
                )}
              </h3>
              <p style={{ margin: '9px 0 0', fontSize: 14.5, color: 'var(--mute)' }}>
                {pi.title}, {lab.department}
                <br />
                {pi.topic}
                {' · '}
                <Link className="link" href="/publications">
                  Publications
                </Link>
              </p>
              <MemberLinks member={pi} align="left" />
            </div>
          </div>
        )}

        <MemberTabs groups={groups} />
      </section>

      {awards.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <h2>Awards &amp; honors</h2>
          </div>
          {unmatchedAwardMembers.length > 0 && (
            <div className="note">
              <b>수상자 미매칭 {unmatchedAwardMembers.length}명</b> —{' '}
              {unmatchedAwardMembers.join(', ')}.
              <br />
              <code>content/awards.yaml</code>의 <code>member</code>가{' '}
              <code>content/members.yaml</code>의 이름과 다릅니다.
            </div>
          )}
          {AWARD_GROUPS.map((g) => {
            const items = awards.filter((a) => a.kind === g.key);
            if (items.length === 0) return null;
            return (
              <div key={g.key}>
                <div className="yr-h">{g.label}</div>
                {items.map((a) => (
                  <div className="row" key={`${a.date}-${a.member}-${a.title}`}>
                    <div className="row-d">{a.date}</div>
                    <div>
                      <div className="row-t">
                        <b>{a.member}</b> — {awardLabel(a)}
                      </div>
                      {a.org && <div className="row-b">{a.org}</div>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
