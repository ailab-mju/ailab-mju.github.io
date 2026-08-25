import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AwardName from '@/components/AwardName';
import PersonHeader from '@/components/PersonHeader';
import PubRow from '@/components/PubRow';
import {
  lab,
  memberPages,
  memberBySlug,
  publicationsOf,
  awardsOf,
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
        <PersonHeader
          member={member}
          as="h1"
          role={
            member.role === 'alumni'
              ? [member.degree ?? ROLE_LABEL.alumni, period].filter(Boolean).join(' · ')
              : [member.title ?? ROLE_LABEL[member.role], period].filter(Boolean).join(' · ')
          }
        >
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
        </PersonHeader>
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
                <h3 className="yr-h">{g.label}</h3>
                <ol className="rows">
                  {items.map((a) => (
                    <li className="row" key={`${a.date}-${a.title}`}>
                      <div className="row-d">
                        <time dateTime={a.date}>{a.date}</time>
                      </div>
                      <div>
                        <div className="row-t">
                          <AwardName award={a} />
                        </div>
                        {a.org && <div className="row-b">{a.org}</div>}
                      </div>
                    </li>
                  ))}
                </ol>
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
