import type { Metadata } from 'next';
import { newsFeed } from '@/lib/content';

export const metadata: Metadata = { title: 'News' };

export default function News() {
  return (
    <div className="w">
      <header className="hd">
        <h1>News</h1>
      </header>

      <section className="sec">
        {newsFeed.length === 0 ? (
          <div className="empty">No news yet.</div>
        ) : (
          // 목록으로 감싼다 — 스크린리더가 항목 수와 경계를 읽을 수 있어야 한다.
          <ol className="rows">
            {newsFeed.map((n) => (
              <li className="row" key={`${n.date}-${n.title}`}>
                <div className="row-d">
                  <time dateTime={String(n.date)}>{String(n.date)}</time>
                </div>
                <div>
                  <div className="row-t">
                    {n.title}
                    {n.ko && (
                      <>
                        {' ('}
                        <span lang="ko">{n.ko}</span>
                        {')'}
                      </>
                    )}
                  </div>
                  {n.body && <div className="row-b">{n.body}</div>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
