/**
 * 히어로 슬롯.
 *
 * 채우는 법: public/images/hero.webp 를 놓고 아래 HERO 를 그 경로로 바꾼다.
 * 지우는 법: 홈에서 <HeroSlot /> 한 줄을 지운다. 페이지는 그대로 완결된다.
 */
const HERO: { src: string; alt: string } | null = null;

export default function HeroSlot() {
  if (HERO) {
    return (
      <div className="slot filled">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO.src} alt={HERO.alt} />
      </div>
    );
  }

  return (
    <div className="slot">
      <p>
        <span className="t">Reserved</span>
        나중에 채울 자리입니다.
        <br />
        연구실 단체 사진, 대표 연구 그림, 또는 비워둬도 됩니다.
      </p>
    </div>
  );
}
