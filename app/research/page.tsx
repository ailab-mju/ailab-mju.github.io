import type { Metadata } from 'next';
import Link from 'next/link';
import PaperList from '@/components/PaperList';
import {
  areasWithPapers,
  projects,
  projectCounts,
  counts,
  untaggedPublications,
} from '@/lib/content';

export const metadata: Metadata = { title: 'Research' };

export default function Research() {
  return (
    <div className="w">
      <header className="hd">
        <h1>Research areas</h1>
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
          <div className="note" lang="ko">
            아래 {untaggedPublications.length}건은 아직 위 주제 중 어디에 넣을지 정리하는
            중입니다.
          </div>
          <PaperList papers={untaggedPublications} label="Unassigned publications" />
        </section>
      )}

      {projects.length > 0 && (
        <section className="sec">
          <div className="sec-h">
            <h2>R&amp;D projects</h2>
            {/* 논문 페이지로 가는 링크가 있었는데 과제와 논문은 이어지는 관계가 아니다.
                이 자리에는 "지금 몇 개가 도는가" 가 훨씬 쓸모 있다. */}
            <span className="area-n">
              {projectCounts.ongoing} ongoing · {projectCounts.completed} completed
            </span>
          </div>
          <ul className="rows">
            {projects.map((p) => (
              <li
                className={p.status === 'completed' ? 'row is-done' : 'row'}
                key={p.title}
              >
                <div className="row-d">
                  {p.status !== 'unknown' && (
                    <span className={p.status === 'ongoing' ? 'flag live proj-s' : 'flag done proj-s'}>
                      {p.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                  )}
                  {p.period || '—'}
                </div>
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
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
