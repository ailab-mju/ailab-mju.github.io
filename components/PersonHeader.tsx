import Face from './Face';
import { MemberLinks } from './MemberTabs';
import type { Member } from '@/lib/types';

/**
 * 사람 한 명을 크게 소개하는 블록. `/members` 의 PI 카드와 개인 페이지가 같은 것을 쓴다.
 *
 * 전에는 같은 인라인 style 네 줄이 두 파일에 복제돼 있었다 — 한쪽만 고치면 어긋난다.
 *
 * `as` 로 제목 단계를 받는다. 개인 페이지에서는 이름이 그 문서의 h1 이고,
 * `/members` 에서는 페이지 제목(h1 Members) 아래라 h2 다. 단계를 컴포넌트가 정하면
 * 두 자리 중 한쪽의 문서 개요가 반드시 어긋난다.
 */
export default function PersonHeader({
  member,
  as,
  role,
  children,
}: {
  member: Member;
  as: 'h1' | 'h2';
  role: string;
  children: React.ReactNode;
}) {
  const Heading = as;
  return (
    <div className="pi">
      <Face member={member} />
      <div>
        <div className="person-r">{role}</div>
        <Heading className="pi-n">
          {member.name}{' '}
          {member.name_ko && (
            <span className="ko" lang="ko">
              {member.name_ko}
            </span>
          )}
        </Heading>
        <p className="pi-b">{children}</p>
        <MemberLinks member={member} align="left" />
      </div>
    </div>
  );
}
