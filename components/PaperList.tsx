import MiniPub from './MiniPub';
import type { Publication } from '@/lib/types';

/**
 * 주제별 논문 목록. 기본은 접힌 상태다 — /research 는 연구 방향을 읽는 페이지지
 * 논문 목록을 훑는 페이지가 아니다. 전체 목록은 /publications 가 맡는다.
 *
 * <details> 를 쓴다. 자바스크립트 없이 동작하므로 하이드레이션 전에도, 스크립트가
 * 막혀도 열린다 — 이 사이트에서 부품을 하나 덜 붙이는 쪽이 항상 낫다.
 */
export default function PaperList({ papers, label }: { papers: Publication[]; label?: string }) {
  if (papers.length === 0) return null;
  return (
    <details className="disc">
      <summary>
        {label ?? 'Publications'} <span className="disc-n">{papers.length}</span>
      </summary>
      <ul className="minis">
        {papers.map((p) => (
          <MiniPub key={`${p.title}-${p.date}`} pub={p} />
        ))}
      </ul>
    </details>
  );
}
