import Link from 'next/link';
import HeroSlot from '@/components/HeroSlot';
import JoinBox from '@/components/JoinBox';
import PubRow from '@/components/PubRow';
import { lab, areasWithPapers, publications, news } from '@/lib/content';

export default function Home() {
  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">{lab.department}</p>
        <h1>{lab.name_en}</h1>
        <p className="lede">{lab.intro_ko.trim()}</p>
        <div className="cta">
          <Link className="btn btn-p" href="/join">
            Join the lab
          </Link>
          <Link className="btn" href="/research">
            Research
          </Link>
        </div>
        {/* 이 한 줄을 지우면 슬롯이 사라진다. 나머지는 그대로 동작한다. */}
        <HeroSlot />
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
              <p>{a.summary.length > 110 ? `${a.summary.slice(0, 110)}…` : a.summary}</p>
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
