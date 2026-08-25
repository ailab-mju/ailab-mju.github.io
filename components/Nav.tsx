'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  ['/', 'Home'],
  ['/research', 'Research'],
  ['/publications', 'Publications'],
  ['/members', 'Members'],
  ['/gallery', 'Gallery'],
  ['/news', 'News'],
  ['/teaching', 'Teaching'],
  ['/join', 'Join'],
] as const;

export default function Nav({ brand }: { brand: string }) {
  const pathname = usePathname();
  const current = pathname.replace(/\/+$/, '') || '/';

  return (
    <nav className="nav">
      <div className="w nav-in">
        <Link className="brand" href="/">
          {/* 색을 박지 않는다. 토큰을 바꾸면 로고도 따라와야 한다. */}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polygon
              points="12,2 21,7 21,17 12,22 3,17 3,7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="12" r="3.2" fill="var(--teal)" />
          </svg>
          {brand}
        </Link>
        <div className="nav-links">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={current === href ? 'on' : undefined}
              aria-current={current === href ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
