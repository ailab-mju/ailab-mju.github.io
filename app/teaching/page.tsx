import type { Metadata } from 'next';
import { courses, terms } from '@/lib/content';

export const metadata: Metadata = { title: 'Teaching' };

export default function Teaching() {
  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">Teaching</p>
        <h2>Teaching</h2>
      </header>

      <section className="sec">
        {terms.map((term) => (
          <div key={term}>
            {courses
              .filter((c) => c.term === term)
              .map((c, i) => (
                <div className="row" key={`${term}-${c.name}-${i}`}>
                  <div className="row-d">{i === 0 ? term : ''}</div>
                  <div>
                    <div className="row-t">
                      {c.name}{' '}
                      {c.name_ko && (
                        <span style={{ fontWeight: 400, color: 'var(--mute)', fontSize: 14 }}>
                          {c.name_ko}
                        </span>
                      )}
                    </div>
                    <div className="row-b">
                      {[c.note, c.level].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </section>
    </div>
  );
}
