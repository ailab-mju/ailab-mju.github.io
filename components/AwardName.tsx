import type { Award } from '@/lib/types';

/**
 * 상 이름. 영문 뒤에 원어를 괄호로 붙인다 — 상 이름은 고유명사라 번역만 두면
 * 무슨 상인지 찾을 수 없다.
 *
 * 문자열로 합치지 않고 컴포넌트로 두는 이유는 괄호 안쪽에만 `lang="ko"` 를 걸기
 * 위해서다. 문장 전체에 걸면 영문까지 한국어로 읽히고, 안 걸면 한국어가 영어
 * 발음 규칙으로 읽힌다. 문자열 표기가 필요한 자리(제목 속성 등)는 `awardLabel()`.
 */
export default function AwardName({ award }: { award: Award }) {
  if (!award.ko) return <>{award.title}</>;
  return (
    <>
      {award.title} (<span lang="ko">{award.ko}</span>)
    </>
  );
}
