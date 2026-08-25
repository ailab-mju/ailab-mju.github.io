import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Face from '@/components/Face';
import { MemberLinks } from '@/components/MemberTabs';
import PubRow from '@/components/PubRow';
import {
  lab,
  memberPages,
  memberBySlug,
  publicationsOf,
  awardsOf,
  awardLabel,
  AWARD_GROUPS,
  ROLE_LABEL,
  memberPeriod,
} from '@/lib/content';

/** 개인 페이지는 논문이나 수상이 있는 멤버에게만 생긴다. lib/content.ts 의 memberPages 참고. */
export function generateStaticParams() {
  return memberPages.map((m) => ({ slug: m.slug as string }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const member = memberBySlug(params.slug);
  return { title: member ? member.name : 'Member' };
}

export default function MemberPage({ params }: { params: { slug: string } }) {
  const member = memberBySlug(params.slug);
  if (!member) notFound();

  const pubs = publicationsOf(member);
  const honors = awardsOf(member);
  const period = memberPeriod(member);

  return (
    <div className="w">
      <p className="crumb">
        <Link className="link" href="/members">
          &larr; Members
        </Link>
      </p>

      <section className="sec">
        <div className="pi">
          <Face member={member} />
          <div>
            <div className="person-r" style={{ marginTop: 0 }}>
              {member.role === 'alumni'
                ? [member.degree ?? ROLE_LABEL.alumni, period].filter(Boolean).join(' · ')
                : [member.title ?? ROLE_LABEL[member.role], period].filter(Boolean).join(' · ')}
            </div>
            <h2 style={{ fontSize: 23, marginTop: 5 }}>
              {member.name}{' '}
              {member.name_ko && (
                <span style={{ fontWeight: 400, color: 'var(--mute)', fontSize: 17 }}>
                  {member.name_ko}
                </span>
              )}
            </h2>
            <p style={{ margin: '9px 0 0', fontSize: 14.5, color: 'var(--mute)' }}>
              {member.role === 'pi' ? `${lab.department}, ${lab.university}` : lab.name_short}
              {member.topic && (
                <>
                  <br />
                  {member.topic}
                </>
              )}
              {member.next && (
                <>
                  <br />
                  Now at {member.next}
                </>
              )}
            </p>
            <MemberLinks member={member} align="left" />
          </div>
        </div>
      </section>

      {honors.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <h2>Awards &amp; honors</h2>
          </div>
          {AWARD_GROUPS.map((g) => {
            const items = honors.filter((a) => a.kind === g.key);
            if (items.length === 0) return null;
            return (
              <div key={g.key}>
                <div className="yr-h">{g.label}</div>
                {items.map((a) => (
                  <div className="row" key={`${a.date}-${a.title}`}>
                    <div className="row-d">{a.date}</div>
                    <div>
                      <div className="row-t">{awardLabel(a)}</div>
                      {a.org && <div className="row-b">{a.org}</div>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </section>
      )}

      {pubs.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <h2>
              Publications <span className="sec-n">{pubs.length}</span>
            </h2>
            <Link className="link" href="/publications">
              All publications &rarr;
            </Link>
          </div>
          <div className="pub-list">
            {pubs.map((p) => (
              <PubRow key={`${p.title}-${p.date}`} pub={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
