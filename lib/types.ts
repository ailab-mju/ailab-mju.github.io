/* ============================================================
 * 타입과 순수 헬퍼. fs를 건드리지 않으므로 클라이언트 컴포넌트도 임포트할 수 있다.
 * 파일을 읽는 로더는 lib/content.ts 에 있다.
 * ========================================================== */

/* ---------------------------- types ---------------------------- */

export type Lab = {
  name_en: string;
  name_short: string;
  department: string;
  university: string;
  tagline: string;
  site_url: string;
  intro_ko: string;
  recruiting_ko: string;
  recruiting_checklist_ko: string[];
  recruiting_reply_ko: string;
  email: string;
  office?: string | null;
  phone?: string | null;
  address: string;
  links: Record<string, string | null>;
};

export type Area = { key: string; title: string; summary: string; tags: string[] };

/** 연구 주제 + 그 주제에 속한 논문. lib/content.ts 가 빌드 타임에 채운다. */
export type AreaWithPapers = Area & {
  papers: Publication[];
  count: number;
  span: string | null; // "2017–2023" 형태. 논문이 없으면 null
};
export type ProjectRole = 'PI' | 'Co-PI' | 'Co-investigator';

export type Project = {
  title: string;
  period?: string | null;
  funder?: string | null;
  /** 주관기관 연구책임자 / 공동기관 연구책임자 / 참여연구자. 비면 표기하지 않는다. */
  role?: ProjectRole | null;
};

export type Scope = 'international' | 'domestic';
export type Kind = 'journal' | 'conference';

/** 국내/해외 × 저널/컨퍼런스. venue 에서 파생하며 논문에 직접 적지 않는다. */
export type Category = `${Scope}-${Kind}`;

export const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'international-journal', label: 'International journal' },
  { key: 'international-conference', label: 'International conference' },
  { key: 'domestic-journal', label: 'Domestic journal' },
  { key: 'domestic-conference', label: 'Domestic conference' },
];

export type Venue = {
  name: string;
  name_en?: string | null;
  scope: Scope;
  kind: Kind;
  publisher?: string | null;
  /** 비어 있으면 미확인. false 와 구분한다. */
  scie?: boolean | null;
  impact_factor?: number | null;
  jcr_year?: number | null;
  quartile?: string | null;
  note?: string | null;
  source?: string | null;
};

export type PublicationRaw = {
  title: string;
  authors: string[];
  venue: string;
  date: string | Date;
  doi?: string | null;
  code?: string | null;
  topics?: string[] | null;
  pages?: string | null;
  /** 공동1저자일 때만 적는다. 비우면 authors 의 첫 사람이 1저자다. */
  first?: string[] | null;
  /** 논문에 표기된 교신저자 전원. 컨퍼런스 논문은 대개 비어 있다. */
  corresponding?: string[] | null;
  todo?: boolean;
};

/** 저자 한 명에게 붙는 표기. 1저자 † · 교신저자 * · 랩 멤버는 굵게. */
export type AuthorRole = { first: boolean; corresponding: boolean; member: boolean };

export type Publication = Omit<PublicationRaw, 'date'> & {
  date: string; // YYYY-MM-DD
  year: number; // date에서 파생. yaml에 year 필드를 두지 않는다.
  /** venues.yaml 에서 붙인다. 매칭 실패 시 null. */
  venueInfo: Venue | null;
  category: Category | null;
  /** 이 논문이 받은 상. awards.yaml 의 paper 로 이어진다. */
  awards: Award[];
  /** authors 와 같은 길이. first/corresponding 에서 파생한다. */
  authorRoles: AuthorRole[];
};

export type Role = 'pi' | 'phd' | 'ms' | 'intern' | 'alumni';

export const ROLE_LABEL: Record<Role, string> = {
  pi: 'Principal Investigator',
  phd: 'PhD Student',
  ms: 'MS Student',
  intern: 'Research Intern',
  alumni: 'Alumni',
};

export type Member = {
  name: string;
  name_ko?: string | null;
  /** 개인 페이지 주소 (/members/<slug>/). 이름에서 파생하지 않는다 — 표기가 바뀌어도 링크가 살아야 한다. */
  slug?: string | null;
  role: Role;
  title?: string | null;
  degree?: string | null;
  topic?: string | null;
  photo?: string | null;
  since?: string | null;
  until?: string | null;
  next?: string | null;
  orcid?: string | null;
  email?: string | null;
  links?: Record<string, string | null> | null;
};

export type AwardKind = 'award' | 'grant';

/** 수상·선정 이력. member 는 members.yaml 의 name 과 일치해야 한다. */
export type Award = {
  /** YYYY-MM. 개최월을 모르면 YYYY. */
  date: string;
  member: string;
  kind: AwardKind;
  title: string;
  /** 원어 이름. 영문 뒤에 괄호로 함께 나간다. 상 이름은 고유명사라 번역만 두면 못 찾는다. */
  ko?: string | null;
  org?: string | null;
  /** 논문상이면 publications.yaml 의 title. 그 논문 줄에 상 이름이 함께 나간다. */
  paper?: string | null;
};

/**
 * 한글 음절이 들어 있는지. 국내 학회 논문 제목·상 이름처럼 영문 문서 안에 섞여 나가는
 * 문자열에 lang="ko" 를 붙일지 판단하는 데 쓴다. 표시하지 않으면 스크린리더가
 * 한국어를 영어 발음 규칙으로 읽는다(WCAG 3.1.2).
 */
export function hasKorean(text: string): boolean {
  return /[\uAC00-\uD7A3]/.test(text);
}

/** 상 이름 표기. 영문 (원어). */
export function awardLabel(a: Award): string {
  return a.ko ? `${a.title} (${a.ko})` : a.title;
}

export const AWARD_GROUPS: { key: AwardKind; label: string }[] = [
  { key: 'award', label: 'Awards' },
  { key: 'grant', label: 'Fellowships & grants' },
];

/**
 * `ko` 는 상 이름의 원어 표기다. 제목에 괄호로 붙여 넣지 않고 따로 들고 있는 이유는,
 * 영문 문장 한가운데의 한국어에만 lang="ko" 를 걸어야 하기 때문이다.
 * 한 문자열로 합쳐 버리면 문장 전체를 한국어라고 하거나 아예 표시를 못 하게 된다.
 */
export type NewsItem = {
  date: string | Date;
  title: string;
  ko?: string | null;
  body?: string | null;
};

export type Course = {
  term: string;
  name: string;
  name_ko?: string | null;
  note?: string | null;
  level?: string | null;
};
export type Album = {
  id: string;
  title: string;
  date: string;
  caption?: string | null;
  cover?: string | null;
  photos: string[];
};

/* ---------------------------- helpers ---------------------------- */

/** js-yaml은 따옴표 없는 2026-01-01 을 Date로 파싱한다. 항상 YYYY-MM-DD 문자열로 정규화. */
export function toISODate(v: string | Date): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

/** 이름 비교용 정규화. members.yaml 과 publications.yaml 의 대소문자 표기가 다를 수 있다. */
export function normName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

const PI_NAME_PATTERN = /^(minsik\s+oh|오민식)$/i;

/** 저자명이 PI인지. members.yaml 매칭이 실패해도 PI 는 굵게 나가도록 하는 안전망이다. */
export function isPI(author: string): boolean {
  return PI_NAME_PATTERN.test(author.trim());
}

/**
 * 1저자·교신저자·랩 멤버 여부를 authors 순서에 맞춰 편다.
 * first 가 비면 첫 저자가 1저자다.
 * memberNames 는 members.yaml 에서 만든 소문자 이름 집합 — 이름을 하드코딩하지 않는다.
 * PI 는 members.yaml 매칭이 어긋나도 isPI() 로 한 번 더 걸러 항상 굵게 나간다.
 */
export function deriveAuthorRoles(
  p: {
    authors: string[];
    first?: string[] | null;
    corresponding?: string[] | null;
  },
  memberNames: ReadonlySet<string> = new Set(),
): AuthorRole[] {
  const firsts = new Set((p.first?.length ? p.first : p.authors.slice(0, 1)).map(normName));
  const corr = new Set((p.corresponding ?? []).map(normName));
  return p.authors.map((a) => ({
    first: firsts.has(normName(a)),
    corresponding: corr.has(normName(a)),
    member: memberNames.has(normName(a)) || isPI(a),
  }));
}

/** first/corresponding 에 authors 에 없는 이름이 적혔는지. 오탈자를 빌드에서 잡는다. */
export function unknownAuthorNames(p: {
  authors: string[];
  first?: string[] | null;
  corresponding?: string[] | null;
}): string[] {
  const known = new Set(p.authors.map((a) => a.trim().toLowerCase()));
  return [...(p.first ?? []), ...(p.corresponding ?? [])].filter(
    (n) => !known.has(n.trim().toLowerCase()),
  );
}

/**
 * 멤버 카드·목록에 쓰는 기간 표기.
 *   재학·재직 중 : "2025-03 –"   (끝 대시가 진행 중이라는 뜻)
 *   떠난 사람    : "2024-03 – 2026-08"
 * since 가 없으면 null — 없는 값을 지어내지 않는다.
 */
export function memberPeriod(m: Member): string | null {
  if (!m.since && !m.until) return null;
  if (m.role === 'alumni') return [m.since, m.until].filter(Boolean).join(' – ');
  return m.since ? `${m.since} –` : null;
}

/**
 * public/ 아래 파일 경로. <img src> 같은 생짜 경로에는 basePath 가 자동으로 붙지 않으므로
 * 하위 경로 미리보기에서 이미지가 통째로 깨진다. 정식 배포에서는 접두사가 빈 문자열이다.
 */
export function asset(path: string): string {
  return `${process.env.BASE_PATH || ''}${path}`;
}
