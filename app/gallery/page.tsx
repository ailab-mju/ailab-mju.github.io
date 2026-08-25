import type { Metadata } from 'next';
import Gallery from '@/components/Gallery';
import { albums } from '@/lib/content';

export const metadata: Metadata = { title: 'Gallery' };

export default function GalleryPage() {
  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">Gallery</p>
        <h2>Gallery</h2>
        <p className="lede">Conferences, retreats, and other lab activities.</p>
      </header>

      <section className="sec">
        <Gallery albums={albums} />
      </section>
    </div>
  );
}
