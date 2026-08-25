'use client';

import { useState } from 'react';
import Link from 'next/link';
import Face from './Face';
import { memberPeriod, ROLE_LABEL, type Member, type Role } from '@/lib/types';

/** href 는 서버에서 파생해 넘긴다 (개인 페이지가 있는 멤버만 값이 있다). */
export type MemberCard = Member & { href: string | null };

const LINK_LABEL: Record<string, string> = {
  cv: 'CV',
  scholar: 'Scholar',
  github: 'GitHub',
  homepage: 'Homepage',
  orcid: 'ORCID',
  linkedin: 'LinkedIn',
};

function MemberLinks({ member, align = 'center' }: { member: Member; align?: 'center' | 'left' }) {
  const entries = Object.entries(member.links ?? {}).filter(([, v]) => Boolean(v));
  if (entries.length === 0 && !member.email) return null;
  return (
    <div
      className="person-l"
      style={align === 'left' ? { justifyContent: 'flex-start' } : undefined}
    >
      {entries.map(([key, href]) => (
        <a key={key} href={href as string} target="_blank" rel="noopener noreferrer">
          {LINK_LABEL[key] ?? key}
        </a>
      ))}
      {/* 이메일은 화면에 평문으로 찍지 않는다. mailto 링크만 남긴다. */}
      {member.email && <a href={`mailto:${member.email}`}>Email</a>}
    </div>
  );
}

function PersonCard({ member }: { member: MemberCard }) {
  // 개인 페이지가 있으면 카드에서 링크(이메일·Scholar) 를 뺀 전부가 클릭 영역이다.
  // 사진과 영문 이름만 링크였을 때는 한글 이름이나 주제를 눌러도 반응이 없어 오작동으로 보였다.
  const body = (
    <>
      <Face member={member} />
      <div className="person-n">{member.name}</div>
      {member.name_ko && <div className="person-e">{member.name_ko}</div>}
      <div className="person-r">{member.title ?? ROLE_LABEL[member.role]}</div>
      {memberPeriod(member) && <div className="person-x">{memberPeriod(member)}</div>}
      {member.topic && <div className="person-t">{member.topic}</div>}
    </>
  );
  return (
    <div className={member.href ? 'person person-c' : 'person'}>
      {member.href ? (
        <Link className="person-h" href={member.href}>
          {body}
          <span className="person-go">View profile &rarr;</span>
        </Link>
      ) : (
        body
      )}
      <MemberLinks member={member} />
    </div>
  );
}

function AlumniRow({ member }: { member: MemberCard }) {
  const period = memberPeriod(member);
  return (
    <div className="alum">
      <div>
        <div className="alum-n">
          {member.href ? <Link href={member.href}>{member.name}</Link> : member.name}
          {member.name_ko && <span>{member.name_ko}</span>}
        </div>
        <div className="alum-d">
          {member.degree ?? ROLE_LABEL.alumni}
          {member.next ? ` · now at ${member.next}` : ''}
        </div>
      </div>
      <div className="alum-x">{period || '—'}</div>
    </div>
  );
}

export default function MemberTabs({
  groups,
}: {
  groups: { key: Role; label: string; members: MemberCard[] }[];
}) {
  const [active, setActive] = useState<Role>(groups[0]?.key ?? 'ms');
  const current = groups.find((g) => g.key === active);

  return (
    <>
      <div className="chips" role="tablist" style={{ marginBottom: 20 }}>
        {groups.map((g) => (
          <button
            key={g.key}
            type="button"
            role="tab"
            aria-selected={active === g.key}
            className={active === g.key ? 'on' : undefined}
            onClick={() => setActive(g.key)}
          >
            {g.label} ({g.members.length})
          </button>
        ))}
      </div>

      <div className="people" role="tabpanel">
        {!current || current.members.length === 0 ? (
          <div className="empty">
            No {current?.label.toLowerCase() ?? 'members'} listed yet.
          </div>
        ) : active === 'alumni' ? (
          current.members.map((m) => <AlumniRow key={m.name} member={m} />)
        ) : (
          current.members.map((m) => <PersonCard key={m.name} member={m} />)
        )}
      </div>
    </>
  );
}

export { MemberLinks };
