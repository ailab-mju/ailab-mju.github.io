import Link from 'next/link';
import JoinBox from '@/components/JoinBox';
import PubRow from '@/components/PubRow';
import { lab, areasWithPapers, publications, newsFeed, hasKorean } from '@/lib/content';

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
        {/* 빈 줄로 나뉜 문단을 각각 <p> 로 낸다. pre-line 의 빈 줄보다 간격이 고르다. */}
        {lab.intro_ko
          .trim()
          .split(/\n{2,}/)
          .map((para) => para.replace(/\s*\n\s*/g, ' '))
          .map((para) => (
            <p className="lede" lang="ko" key={para}>
              {para}
            </p>
          ))}
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
        {/*
          /news 와 같은 목록을 쓴다. 전에는 홈이 news.yaml 만 보고 /news 는 수상·논문까지
          합친 피드를 봐서, "All news →" 가 미리보기와 다른 목록으로 이어졌다.
        */}
        <ol className="rows">
          {newsFeed.slice(0, 3).map((n) => (
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
                {n.body && (
                  <div className="row-b" lang={hasKorean(n.body) ? 'ko' : undefined}>
                    {n.body}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="sec">
        <JoinBox />
      </section>
    </div>
  );
}
