import type { Metadata } from 'next';
import JoinBox from '@/components/JoinBox';
import { lab } from '@/lib/content';

export const metadata: Metadata = { title: 'Join' };

export default function Join() {
  return (
    <div className="w">
      <header className="hd">
        <p className="kicker">Join</p>
        <h2>Join the lab</h2>
      </header>

      <section className="sec">
        <JoinBox />
      </section>

      <section className="sec">
        <div className="sec-h">
          <h2>Contact</h2>
        </div>
        <div className="row">
          <div className="row-d">Email</div>
          <div>
            <div className="row-t">
              <a className="link" href={`mailto:${lab.email}`}>
                {lab.email}
              </a>
            </div>
          </div>
        </div>
        {lab.office && (
          <div className="row">
            <div className="row-d">Office</div>
            <div>
              <div className="row-b" style={{ marginTop: 0 }}>
                {lab.office}
                {lab.phone ? ` · ${lab.phone}` : ''}
              </div>
            </div>
          </div>
        )}
        <div className="row">
          <div className="row-d">Address</div>
          <div>
            <div className="row-b" style={{ whiteSpace: 'pre-line', marginTop: 0 }}>
              {lab.address.trim()}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
