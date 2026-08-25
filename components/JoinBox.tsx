import { lab } from '@/lib/content';

/**
 * 홈 하단과 /join 이 같은 컴포넌트를 쓴다.
 *
 * `heading` 을 false 로 주면 제목을 렌더하지 않는다. /join 은 페이지 제목이 이미
 * "Join the lab" 이라 여기서 또 내면 같은 문구의 제목이 한 페이지에 두 번 생긴다.
 */
export default function JoinBox({ heading = true }: { heading?: boolean }) {
  return (
    <div className="join">
      <div>
        {heading && <h2>Join the lab</h2>}
        <p className="join-p" lang="ko">
          {lab.recruiting_ko.trim()}
        </p>
        <a className="btn btn-p" href={`mailto:${lab.email}`}>
          Email {lab.email}
        </a>
      </div>
      <div>
        <p className="join-h" lang="ko">
          메일에 담아주실 것
        </p>
        <ol lang="ko">
          {lab.recruiting_checklist_ko.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <p className="join-r" lang="ko">
          {lab.recruiting_reply_ko}
        </p>
      </div>
    </div>
  );
}
