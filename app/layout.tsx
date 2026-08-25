import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { asset, lab } from '@/lib/content';

export const metadata: Metadata = {
  metadataBase: new URL(lab.site_url),
  title: {
    default: `${lab.name_en} · ${lab.university}`,
    template: `%s · ${lab.name_short}`,
  },
  description: lab.tagline,
  openGraph: {
    title: `${lab.name_en} · ${lab.university}`,
    description: lab.tagline,
    url: lab.site_url,
    siteName: lab.name_en,
    type: 'website',
    // npm run make-og 로 만든다. 이름·태그라인·소속은 lab.yaml 에서 읽으므로
    // 그쪽을 고쳤으면 스크립트를 다시 돌려야 카드도 따라온다.
    images: [{ url: asset('/images/og.png'), width: 1200, height: 630, alt: lab.name_en }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${lab.name_en} · ${lab.university}`,
    description: lab.tagline,
    images: [asset('/images/og.png')],
  },
  icons: {
    icon: asset('/favicon.svg'),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* 본문 폰트를 주는 호스트다. 제목용 Google Fonts 보다 먼저 붙어야 한다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        {/*
          dynamic-subset 판을 쓴다. 통짜 pretendardvariable.min.css 는 woff2 하나가
          2,010KB 라 홈 전송량(2,495KB)의 80%를 차지했다 — 사이트는 대부분 영문인데
          모든 방문자가 한글 글리프 전체를 받았다.
          이 판은 unicode-range 로 쪼개져 있어 실제로 쓰인 구간만 내려온다.
        */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          crossOrigin=""
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav brand={lab.name_short} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
