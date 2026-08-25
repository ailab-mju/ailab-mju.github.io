import Link from 'next/link';
import JoinBox from '@/components/JoinBox';
import PubRow from '@/components/PubRow';
import { lab, areasWithPapers, publications, news } from '@/lib/content';

/** 마지막 단어를 반으로 자르지 않는다 — "batch effe…" 는 요약이 아니라 사고처럼 보인다. */
function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return `${(at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

export default function Home() {
  return (
    <div className="w">
      <header className="hd">
        <h1>{lab.name_en}</h1>
        {/* 소속은 제목 위의 라벨이 아니라 제목이 딸린 곳이다. 아래에 둔다. */}
        <p className="inst">{lab.department}</p>
        <p className="lede" lang="ko">
          {lab.intro_ko.trim()}
        </p>
        <div className="cta">
          <Link className="btn btn-p" href="/join">
            Join the lab
          </Link>
          <Link className="btn" href="/research">
            Research
          </Link>
        </div>
      </header>

      <section className="sec">
        <div className="sec-h">
          <h2>Research</h2>
          <Link className="link" href="/research">
            All areas &rarr;
          </Link>
        </div>
        <div className="cards">
          {/* 앞에서 3개만. 주제가 늘거나 순서가 바뀌면 여기도 따라간다. */}
          {areasWithPapers.slice(0, 3).map((a) => (
            <div className="card" key={a.key}>
              <h3>{a.title}</h3>
              <p>{clip(a.summary, 110)}</p>
              <div className="tags">
                <span className="tag">
                  {a.count === 0
                    ? 'in progress'
                    : `${a.count} paper${a.count === 1 ? '' : 's'}${a.span ? ` · ${a.span}` : ''}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="sec-h">
          <h2>Recent publications</h2>
          <Link className="link" href="/publications">
            All publications &rarr;
          </Link>
        </div>
        {publications.slice(0, 4).map((p) => (
          <PubRow key={`${p.title}-${p.date}`} pub={p} />
        ))}
      </section>

      <section className="sec">
        <div className="sec-h">
          <h2>News</h2>
          <Link className="link" href="/news">
            All news &rarr;
          </Link>
        </div>
        {news.slice(0, 3).map((n) => (
          <div className="row" key={`${n.date}-${n.title}`}>
            <div className="row-d">{String(n.date)}</div>
            <div>
              <div className="row-t">{n.title}</div>
              {n.body && <div className="row-b">{n.body}</div>}
            </div>
          </div>
        ))}
      </section>

      <section className="sec">
        <JoinBox />
      </section>
    </div>
  );
}
