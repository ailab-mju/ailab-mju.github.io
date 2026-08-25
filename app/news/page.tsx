import type { Metadata } from 'next';
import { newsFeed } from '@/lib/content';

export const metadata: Metadata = { title: 'News' };

export default function News() {
  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">News</p>
        <h2>News</h2>
      </header>

      <section className="sec">
        {newsFeed.length === 0 ? (
          <div className="empty">No news yet.</div>
        ) : (
          newsFeed.map((n) => (
            <div className="row" key={`${n.date}-${n.title}`}>
              <div className="row-d">{String(n.date)}</div>
              <div>
                <div className="row-t">{n.title}</div>
                {n.body && <div className="row-b">{n.body}</div>}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
