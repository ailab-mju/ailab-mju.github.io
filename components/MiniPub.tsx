import type { Publication } from '@/lib/types';
import VenueMeta from './VenueMeta';

/** /research 의 주제별 논문 목록용 한 줄 항목. 저자까지 보려면 /publications 로 간다. */
export default function MiniPub({ pub }: { pub: Publication }) {
  const title = pub.doi ? (
    <a href={pub.doi} target="_blank" rel="noopener noreferrer">
      {pub.title}
    </a>
  ) : (
    <span>{pub.title}</span>
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
