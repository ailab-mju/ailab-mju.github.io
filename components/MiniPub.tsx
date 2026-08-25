import { hasKorean, type Publication } from '@/lib/types';
import VenueMeta from './VenueMeta';

/** /research 의 주제별 논문 목록용 한 줄 항목. 저자까지 보려면 /publications 로 간다. */
export default function MiniPub({ pub }: { pub: Publication }) {
  const lang = hasKorean(pub.title) ? 'ko' : undefined;
  const title = pub.doi ? (
    <a className="ext" href={pub.doi} target="_blank" rel="noopener noreferrer" lang={lang}>
      {pub.title}
    </a>
  ) : (
    <span lang={lang}>{pub.title}</span>
  );

  return (
    <li className="mini">
      <span className="mini-t">{title}</span>
      <span className="mini-m">
        <VenueMeta pub={pub} />
      </span>
    </li>
  );
}
