import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AwardName from '@/components/AwardName';
import MemberTabs from '@/components/MemberTabs';
import PersonHeader from '@/components/PersonHeader';
import {
  lab,
  pi,
  membersByRole,
  counts,
  awards,
  memberHref,
  memberPeriod,
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
        <h1>Members</h1>
        <p className="lede">
          {counts.members} current members and {counts.alumni} alumni.
        </p>
      </header>

      <section className="sec">
        {pi && (
          <PersonHeader
            member={pi}
            as="h2"
            role={`Principal Investigator${memberPeriod(pi) ? ` · ${memberPeriod(pi)}` : ''}`}
          >
            {pi.title}, {lab.department}
            <br />
            {pi.topic}
            {' · '}
            <Link className="link" href={piHref ?? '/publications'}>
              {piHref ? 'Profile' : 'Publications'}
            </Link>
          </PersonHeader>
        )}

        <MemberTabs groups={groups} />
      </section>

      {awards.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <h2>Awards &amp; honors</h2>
          </div>
          {unmatchedAwardMembers.length > 0 && (
            <div className="note" lang="ko">
              {unmatchedAwardMembers.join(', ')} 님의 표기를 구성원 명단과 대조하는 중입니다.
            </div>
          )}
          {AWARD_GROUPS.map((g) => {
            const items = awards.filter((a) => a.kind === g.key);
            if (items.length === 0) return null;
            return (
              <Fragment key={g.key}>
                <h3 className="yr-h">{g.label}</h3>
                <ol className="rows">
                  {items.map((a) => (
                    <li className="row" key={`${a.date}-${a.member}-${a.title}`}>
                      <div className="row-d">
                        <time dateTime={a.date}>{a.date}</time>
                      </div>
                      <div>
                        <div className="row-t">
                          <b>{a.member}</b> — <AwardName award={a} />
                        </div>
                        {a.org && <div className="row-b">{a.org}</div>}
                      </div>
                    </li>
                  ))}
                </ol>
              </Fragment>
            );
          })}
        </section>
      )}
    </div>
  );
}
