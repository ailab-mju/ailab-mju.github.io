import { Fragment } from 'react';
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
        {/*
          래퍼 div 로 감싸지 않는다. 감싸면 모든 .term 이 각자 부모의 :first-of-type 이
          되어 학기 사이 여백이 전부 사라진다 — 라벨이 행 구분선에 끼어 앞 과목의
          일부처럼 보이게 된다. PublicationFilters 의 연도 그룹과 같은 이유다.
        */}
        {terms.map((term) => (
          <Fragment key={term}>
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
          </Fragment>
        ))}
      </section>
    </div>
  );
}
