'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import PubRow from './PubRow';
import { CATEGORIES, type Category, type Publication } from '@/lib/types';

/** 국내/해외 × 저널/컨퍼런스 4분류. 목록은 lib/types.ts 한 곳에서만 정의한다. */
const TYPES: [string, string][] = [['all', 'All'], ...CATEGORIES.map((c) => [c.key, c.label] as [string, string])];

type TypeKey = 'all' | Category;

/**
 * 처음 들어왔을 때 보이는 분류. 해외 저널이 이 랩의 주 실적이라 그걸 먼저 보여준다.
 * 이 값과 같으면 URL 에 type 을 싣지 않는다 — 기본 화면 주소가 지저분해지지 않는다.
 */
const DEFAULT_TYPE: TypeKey = 'international-journal';

/**
 * 필터 3종이 동시에 동작하고, 상태가 URL 쿼리에 실린다.
 * static export이므로 useSearchParams 대신 location + replaceState 를 직접 쓴다 —
 * 프리렌더 시점에 쿼리가 없다는 사실을 우회할 군더더기가 필요 없다.
 */
export default function PublicationFilters({
  publications,
  years,
}: {
  publications: Publication[];
  years: number[];
}) {
  const [q, setQ] = useState('');
  const [type, setType] = useState<TypeKey>(DEFAULT_TYPE);
  const [year, setYear] = useState<string>('all');
  const [ready, setReady] = useState(false);

  // 공유된 URL로 들어온 경우 필터를 복원한다.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get('type');
    const y = p.get('year');
    setQ(p.get('q') ?? '');
    if (t && TYPES.some(([k]) => k === t)) setType(t as TypeKey);
    if (y && (y === 'all' || years.includes(Number(y)))) setYear(y);
    setReady(true);
  }, [years]);

  // 필터가 바뀌면 URL을 갱신한다. 히스토리를 더럽히지 않도록 replace.
  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (type !== DEFAULT_TYPE) p.set('type', type);
    if (year !== 'all') p.set('year', year);
    const qs = p.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [q, type, year, ready]);

  const hits = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return publications.filter((p) => {
      if (type !== 'all' && p.category !== type) return false;
      if (year !== 'all' && String(p.year) !== year) return false;
      if (!needle) return true;
      return `${p.title} ${p.authors.join(' ')} ${p.venue}`.toLowerCase().includes(needle);
    });
  }, [publications, q, type, year]);

  const grouped = useMemo(() => {
    const by = new Map<number, Publication[]>();
    for (const p of hits) {
      const list = by.get(p.year);
      if (list) list.push(p);
      else by.set(p.year, [p]);
    }
    return [...by.entries()].sort((a, b) => b[0] - a[0]);
  }, [hits]);

  return (
    <>
      <div className="tools">
        <input
          className="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, author, or venue"
          aria-label="Search publications"
        />
      </div>

      <div className="chips" role="group" aria-label="Filter by publication type">
        {TYPES.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={type === key ? 'on' : undefined}
              aria-pressed={type === key}
              onClick={() => setType(key as TypeKey)}
            >
              {label}
            </button>
          ))}
      </div>

      <div className="chips chips-y" role="group" aria-label="Filter by year">
        <button
          type="button"
          className={year === 'all' ? 'on' : undefined}
          aria-pressed={year === 'all'}
          onClick={() => setYear('all')}
        >
          All years
        </button>
        {years.map((y) => (
          <button
            key={y}
            type="button"
            className={year === String(y) ? 'on' : undefined}
            aria-pressed={year === String(y)}
            onClick={() => setYear(String(y))}
          >
            {y}
          </button>
        ))}
      </div>

      <p className="count" aria-live="polite">
        {hits.length} publication{hits.length === 1 ? '' : 's'}
      </p>

      {/* 결과만 담는 컨테이너. .yr-h:first-of-type / .pub:first-of-type 가
          필터 UI가 아니라 목록의 첫 요소를 가리키도록 하기 위해 필요하다. */}
      <div className="pub-list">
        {grouped.length === 0 ? (
          <div className="empty">
            No publications match these filters. Try a different search term or year.
          </div>
        ) : (
          // Fragment로 감싼다. div로 감싸면 모든 .yr-h 가 각자 부모의 first-of-type 이
          // 되어 그룹 사이 여백이 사라진다.
          grouped.map(([y, list]) => (
            <Fragment key={y}>
              <div className="yr-h">{y}</div>
              {list.map((p) => (
                <PubRow key={`${p.title}-${p.date}`} pub={p} />
              ))}
            </Fragment>
          ))
        )}
      </div>
    </>
  );
}
