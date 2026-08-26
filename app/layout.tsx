import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { asset, lab } from '@/lib/content';

/**
 * 제목·라벨 글꼴은 빌드 타임에 내려받아 out/ 안에 넣는다(next/font).
 *
 * 전에는 방문자 브라우저가 fonts.googleapis.com 에 CSS 를 받고 다시
 * fonts.gstatic.com 에서 폰트를 받았다. 요청 두 번이 렌더를 막았고, 교내망이나
 * 방화벽이 막으면 사이트 글꼴이 통째로 폴백됐다. 이제 자기 도메인에서 나가고
 * next/font 가 preload 까지 붙인다.
 *
 * 본문 한글(Pretendard)은 Google Fonts 에 없어 CDN 에 남겼다. 그쪽이 막히면
 * 시스템 한글 글꼴로 떨어지는데, 제목 글꼴이 사라지는 것보다 피해가 작다.
 * 의존이 런타임(모든 방문자)에서 빌드 타임(배포할 때만)으로 옮겨졌다.
 */
const archivo = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-disp',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(lab.site_url),
  title: {
    default: `${lab.name_en} · ${lab.university}`,
    template: `%s · ${lab.name_short}`,
  },
  description: lab.tagline,
  // 같은 내용이 학교 도메인과 GitHub Pages 두 곳에서 나간다.
  // canonical 을 박아 두지 않으면 검색엔진이 둘을 별개 문서로 센다.
  // metadataBase(= lab.site_url) 에 상대 경로가 붙어 페이지마다 자기 주소가 된다.
  alternates: { canonical: './' },
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
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* 본문 한글을 주는 호스트. 남은 외부 의존은 이것 하나다. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
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
