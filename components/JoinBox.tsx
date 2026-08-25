import { lab } from '@/lib/content';

/** 홈 하단과 /join 이 같은 컴포넌트를 쓴다. */
export default function JoinBox() {
  return (
    <div className="join">
      <div>
        <h2>Join the lab</h2>
        <p style={{ marginTop: 12, whiteSpace: 'pre-line' }}>{lab.recruiting_ko.trim()}</p>
        <a className="btn btn-p" href={`mailto:${lab.email}`}>
          Email {lab.email}
        </a>
      </div>
      <div>
        <p style={{ fontWeight: 700, color: 'var(--ink)', margin: 0 }}>메일에 담아주실 것</p>
        <ol>
          {lab.recruiting_checklist_ko.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <p style={{ marginTop: 14, fontSize: 13.5 }}>{lab.recruiting_reply_ko}</p>
      </div>
    </div>
  );
}
