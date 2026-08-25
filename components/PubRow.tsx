import { hasKorean, type AuthorRole, type Publication } from '@/lib/types';
import AwardName from './AwardName';
import VenueMeta from './VenueMeta';

/** 1저자 † · 교신저자 * . 범례는 /publications 상단에 한 번만 둔다. */
function Marks({ role }: { role: AuthorRole }) {
  const marks = [role.first ? '†' : '', role.corresponding ? '*' : ''].join('');
  if (!marks) return null;
  const label = [role.first ? 'first author' : '', role.corresponding ? 'corresponding author' : '']
    .filter(Boolean)
    .join(', ');
  return (
    // 기호는 눈으로만 읽힌다. title 은 마우스에만 뜨므로 터치·키보드·스크린리더에는
    // 아무 정보가 없었다. 기호를 aria-hidden 으로 감추고 말을 따로 붙인다.
    <sup className="au-m" title={label}>
      <span aria-hidden="true">{marks}</span>
      <span className="sr"> ({label})</span>
    </sup>
  );
}

function Authors({ authors, roles }: { authors: string[]; roles: AuthorRole[] }) {
  return (
    <div className="pub-a">
      {authors.map((a, i) => (
        <span key={`${a}-${i}`}>
          {roles[i]?.member ? <b>{a}</b> : a}
          {roles[i] && <Marks role={roles[i]} />}
          {i < authors.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
}

export default function PubRow({ pub }: { pub: Publication }) {
  // 국내 학회 논문 제목은 원문 그대로 둔다. 원문이 한국어면 그 사실을 마크업에도 남긴다 —
  // 표시하지 않으면 스크린리더가 한국어를 영어 발음 규칙으로 읽는다.
  const lang = hasKorean(pub.title) ? 'ko' : undefined;
  const title = pub.doi ? (
    <a
      className="pub-t ext"
      href={pub.doi}
      target="_blank"
      rel="noopener noreferrer"
      lang={lang}
    >
      {pub.title}
    </a>
  ) : (
    <span className="pub-t" lang={lang}>
      {pub.title}
    </span>
  );

  return (
    <div className="pub">
      {title}
      <Authors authors={pub.authors} roles={pub.authorRoles} />
      {pub.awards.length > 0 && (
        <div className="pub-aw">
          {pub.awards.map((a) => (
            <span key={`${a.date}-${a.title}`}>
              <AwardName award={a} />
              {a.member ? ` · ${a.member}` : ''}
            </span>
          ))}
        </div>
      )}
      <div className="pub-m">
        <VenueMeta pub={pub} />
        {pub.code && (
          <a className="link ext" href={pub.code} target="_blank" rel="noopener noreferrer">
            Code
          </a>
        )}
      </div>
    </div>
  );
}
