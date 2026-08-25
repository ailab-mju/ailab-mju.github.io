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
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
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
