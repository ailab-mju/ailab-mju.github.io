import type { Metadata } from 'next';
import Link from 'next/link';
import PaperList from '@/components/PaperList';
import {
  areasWithPapers,
  projects,
  counts,
  untaggedPublications,
} from '@/lib/content';

export const metadata: Metadata = { title: 'Research' };

export default function Research() {
  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">Research</p>
        <h2>Research areas</h2>
        <p className="lede">
          We develop machine learning methods that reflect the structure of biological data.
          The {counts.areas} areas below are what {counts.publications} publications since{' '}
          {Math.min(...areasWithPapers.flatMap((a) => a.papers.map((p) => p.year)))} add up to.
        </p>
      </header>

      {areasWithPapers.map((area) => (
        <section className="sec" key={area.key}>
          <div className="sec-h">
            <h2>{area.title}</h2>
            <span className="area-n">
              {area.count === 0
                ? 'in progress'
                : `${area.count} paper${area.count === 1 ? '' : 's'}${area.span ? ` · ${area.span}` : ''}`}
            </span>
          </div>

          <p className="area-s">{area.summary}</p>

          <div className="tags">
            {area.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>

          {area.papers.length > 0 ? (
            <PaperList papers={area.papers} />
          ) : (
            // 아직 논문이 없는 방향. 지어낸 논문으로 채우지 않는다.
            <p className="area-empty">
              Ongoing work — no publications from this lab yet.
            </p>
          )}
        </section>
      ))}

      {untaggedPublications.length > 0 && (
        <section className="sec">
          <div className="note">
            <b>주제 미분류 {untaggedPublications.length}건</b> —{' '}
            <code>content/publications.yaml</code>의 해당 항목에 <code>topics</code>를 넣으면
            이 안내가 사라지고 위 목록에 합쳐집니다.
          </div>
          <PaperList papers={untaggedPublications} label="Unassigned publications" />
        </section>
      )}

      {projects.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <h2>R&amp;D projects</h2>
            <Link className="link" href="/publications">
              All publications &rarr;
            </Link>
          </div>
          {projects.map((p) => (
            <div className="row" key={p.title}>
              <div className="row-d">{p.period || '—'}</div>
              <div>
                <div className="row-t">{p.title}</div>
                {(p.funder || p.role) && (
                  <div className="row-b">
                    {p.funder}
                    {p.funder && p.role && ' · '}
                    {p.role}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
