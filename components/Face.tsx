import { asset, type Member } from '@/lib/types';

/** 사진이 없으면 영문 이니셜로 폴백한다. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Face({ member }: { member: Member }) {
  if (!member.photo) return <div className="face">{initials(member.name)}</div>;
  return (
    <div className="face">
      {/* static export이므로 next/image 최적화를 쓰지 않는다. 사진은 사전 리사이즈됨. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset(`/images/members/${member.photo}`)}
        alt={member.name}
        width={480}
        height={480}
        loading="lazy"
      />
    </div>
  );
}
