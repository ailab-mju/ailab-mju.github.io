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
        {lab.recruiting_ko
          .trim()
          .split(/\n{2,}/)
          .map((para) => para.replace(/\s*\n\s*/g, ' '))
          .map((para) => (
            <p className="join-p" lang="ko" key={para}>
              {para}
            </p>
          ))}
        <a className="btn btn-p" href={`mailto:${lab.email}`}>
          Email {lab.email}
        </a>
      </div>
      <div>
        <p className="join-h" lang="ko">
          메일에 담아주실 것
        </p>
        {/* 순서가 있는 목록이 아니다. ol 이면 번호가 의미를 갖는 것처럼 보이는데,
            Tailwind preflight 가 마커를 지워서 실제로는 번호도 안 나왔다. */}
        <ul className="checklist" lang="ko">
          {lab.recruiting_checklist_ko.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="join-r" lang="ko">
          {lab.recruiting_reply_ko}
        </p>
      </div>
    </div>
  );
}
