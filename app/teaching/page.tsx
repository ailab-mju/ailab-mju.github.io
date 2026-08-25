import type { Metadata } from 'next';
import { courses, terms } from '@/lib/content';

export const metadata: Metadata = { title: 'Teaching' };

export default function Teaching() {
  return (
    <div className="w">
      <header className="hd">
        <h1>Teaching</h1>
      </header>

      <section className="sec">
        {/*
          학기는 제목이고 과목은 그 아래 목록이다. 전에는 학기명이 그룹의 첫 줄에만
          들어가 있어서, 화면으로는 묶여 보여도 마크업에는 소속이 없었다.
        */}
        {terms.map((term) => (
          <div key={term}>
            <h2 className="term">{term}</h2>
            <ul className="rows">
              {courses
                .filter((c) => c.term === term)
                .map((c, i) => (
                  <li className="row row-1" key={`${term}-${c.name}-${i}`}>
                    <div>
                      <div className="row-t">
                        {c.name}{' '}
                        {c.name_ko && (
                          <span className="ko" lang="ko">
                            {c.name_ko}
                          </span>
                        )}
                      </div>
                      <div className="row-b">{[c.note, c.level].filter(Boolean).join(' · ')}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
