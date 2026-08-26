import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { awardLabel, deriveAuthorRoles, normName, projectEnd, projectStatus, toISODate, unknownAuthorNames, type Album, type Area, type Award, type AreaWithPapers, type Course, type Lab, type Member, type NewsItem, type Project, type ProjectWithStatus, type Publication, type PublicationRaw, type Role, type Venue, type Category } from './types';

/* ============================================================
 * content/*.yaml 을 빌드 타임에 읽어 파생값까지 계산한다.
 * 여기서 계산되는 값은 하드코딩하지 않는다 — 갱신 비용이 0이 된다.
 * ========================================================== */

const CONTENT_DIR = path.join(process.cwd(), 'content');

function read<T>(file: string): T {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  return (yaml.load(raw) ?? null) as T;
}

export * from './types';

/* ---------------------------- loaders ---------------------------- */

export const lab: Lab = read<Lab>('lab.yaml');

const researchFile = read<{ areas: Area[]; projects?: Project[] }>('research.yaml');
export const areas: Area[] = researchFile.areas ?? [];
const rawProjects: Project[] = researchFile.projects ?? [];

export const venues: Venue[] = read<Venue[]>('venues.yaml') ?? [];

const VENUE_BY_NAME = new Map(venues.map((v) => [v.name, v]));

export const members: Member[] = read<Member[]>('members.yaml') ?? [];

/** 저자 굵게 처리용. 재학생·인턴·졸업생 모두 포함한다 — 논문 당시엔 다 랩 멤버였다. */
const MEMBER_NAMES: ReadonlySet<string> = new Set(
  members.flatMap((m) => [m.name, m.name_ko].filter(Boolean).map((n) => normName(n as string))),
);

const byDateDesc = (a: { date: string }, b: { date: string }) =>
  a.date < b.date ? 1 : a.date > b.date ? -1 : 0;

/** 수상·선정 이력. 날짜 내림차순 — YYYY 와 YYYY-MM 이 섞여도 문자열 비교로 정렬된다. */
export const awards: Award[] = (read<Award[]>('awards.yaml') ?? [])
  .map((a) => ({ ...a, date: toISODate(a.date) }))
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

/** members.yaml 에 없는 수상자. 이름이 어긋나면 조용히 남으므로 눈에 보이게 센다. */
export const unmatchedAwardMembers: string[] = [
  ...new Set(awards.filter((a) => !MEMBER_NAMES.has(normName(a.member))).map((a) => a.member)),
];

/** 제목으로 논문과 상을 잇는다. 표기가 한 글자라도 다르면 매칭이 깨지므로 빌드에서 센다. */
const normTitle = (t: string) => t.trim().toLowerCase().replace(/\s+/g, ' ');

const AWARDS_BY_PAPER = new Map<string, Award[]>();
for (const a of awards) {
  if (!a.paper) continue;
  const key = normTitle(a.paper);
  const list = AWARDS_BY_PAPER.get(key);
  if (list) list.push(a);
  else AWARDS_BY_PAPER.set(key, [a]);
}

export const publications: Publication[] = (read<PublicationRaw[]>('publications.yaml') ?? [])
  .map((p) => {
    const date = toISODate(p.date);
    const venueInfo = VENUE_BY_NAME.get(p.venue) ?? null;
    return {
      ...p,
      date,
      year: Number(date.slice(0, 4)),
      venueInfo,
      // 국내/해외 · 저널/컨퍼런스는 venue 에서 파생한다.
      category: venueInfo ? (`${venueInfo.scope}-${venueInfo.kind}` as Category) : null,
      // 1저자·교신저자 표기는 authors 순서에 맞춰 편다.
      authorRoles: deriveAuthorRoles(p, MEMBER_NAMES),
      // 논문상은 awards.yaml 의 paper 로 이어진다.
      awards: AWARDS_BY_PAPER.get(normTitle(p.title)) ?? [],
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export const news: NewsItem[] = (read<NewsItem[]>('news.yaml') ?? [])
  .map((n) => ({ ...n, date: toISODate(n.date) }))
  .sort((a, b) => (String(a.date) < String(b.date) ? 1 : -1));

export const courses: Course[] = read<Course[]>('courses.yaml') ?? [];

/**
 * 최신 앨범이 위로. 파일 순서에 기대지 않는다 — date 를 손으로 고치면 순서가 어긋난다.
 *
 * 수상은 awards.yaml 에서 같은 달(YYYY-MM)의 `award` 항목을 붙인다.
 * 캡션에 손으로 적지 않는 이유는 news 와 같다 — 두 벌이 되면 상 이름을 고칠 때
 * 한쪽만 고쳐져 어긋난다. 지원사업 선정(`grant`)은 행사가 아니므로 제외한다.
 *
 * 한 달에 행사가 둘이면 양쪽 앨범에 같은 상이 붙는다. 지금 6개 앨범의 달은
 * 전부 다르다. 겹치는 날이 오면 그때 awards.yaml 에 앨범 id 를 적는 편이 낫다 —
 * 그 전에 미리 필드를 만들지 않는다.
 */
export const albums: Album[] = (read<Album[]>('gallery.yaml') ?? [])
  .map((a) => {
    const date = toISODate(a.date);
    const month = date.slice(0, 7);
    return {
      ...a,
      date,
      awards: awards.filter((w) => w.kind === 'award' && w.date.slice(0, 7) === month),
    };
  })
  .sort(byDateDesc);

/* ---------------------------- derived ---------------------------- */

export const pi: Member | undefined = members.find((m) => m.role === 'pi');

export function membersByRole(role: Role): Member[] {
  return members.filter((m) => m.role === role);
}

/** 필터용 연도 목록. publications.yaml에서 뽑는다. */
/** 주제별 논문 묶음. research.yaml 의 areas[].key 와 publications.yaml 의 topics 로 잇는다. */
export const areasWithPapers: AreaWithPapers[] = areas.map((a) => {
  const papers = publications.filter((p) => (p.topics ?? []).includes(a.key));
  const ys = papers.map((p) => p.year);
  return {
    ...a,
    papers,
    count: papers.length,
    span: ys.length
      ? Math.min(...ys) === Math.max(...ys)
        ? String(ys[0])
        : `${Math.min(...ys)}–${Math.max(...ys)}`
      : null,
  };
});

/** 어느 주제에도 속하지 않은 논문. 분류가 빠진 걸 눈에 보이게 한다. */
const AREA_KEYS = new Set(areas.map((a) => a.key));
export const untaggedPublications: Publication[] = publications.filter(
  (p) => !(p.topics ?? []).some((t) => AREA_KEYS.has(t)),
);

export const years: number[] = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a);

/** 학기 목록 (최신순). courses.yaml의 등장 순서를 유지한다. */
/** "2026 Fall" > "2026 Spring" > "2025 Fall" ... 파일 순서에 기대지 않는다. */
function termRank(term: string): number {
  const [year, season] = term.split(' ');
  return Number(year) * 10 + (season === 'Fall' ? 2 : 1);
}

export const terms: string[] = [...new Set(courses.map((c) => c.term))].sort(
  (a, b) => termRank(b) - termRank(a),
);

export const counts = {
  publications: publications.length,
  internationalJournal: publications.filter((p) => p.category === 'international-journal').length,
  internationalConference: publications.filter((p) => p.category === 'international-conference')
    .length,
  domesticJournal: publications.filter((p) => p.category === 'domestic-journal').length,
  domesticConference: publications.filter((p) => p.category === 'domestic-conference').length,
  scie: publications.filter((p) => p.venueInfo?.scie === true).length,
  members: members.filter((m) => m.role !== 'alumni').length,
  ms: membersByRole('ms').length,
  phd: membersByRole('phd').length,
  intern: membersByRole('intern').length,
  alumni: membersByRole('alumni').length,
  areas: areas.length,
  taggedPublications: publications.length - untaggedPublications.length,
  albums: albums.length,
  awards: awards.length,
};

/** 멤버 개인의 논문. ORCID가 있으면 iD 우선, 없으면 이름 문자열로 매칭. */
export function publicationsOf(member: Member): Publication[] {
  const needles = [member.name, member.name_ko].filter(Boolean).map((s) => String(s).toLowerCase());
  return publications.filter((p) =>
    p.authors.some((a) => needles.includes(a.trim().toLowerCase())),
  );
}

/* --------- 자동화를 대신하는 두 장치: 갱신 날짜와 낡음 표시 --------- */

/** 빌드 시각(또는 CI가 주입한 최종 커밋 날짜). */
export const lastUpdated: string =
  process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);

const MONTH_MS = 1000 * 60 * 60 * 24 * 30.44;

/**
 * 확정된(todo가 아닌) 논문 중 가장 최근 것이 얼마나 지났는지.
 * todo 항목은 아직 검증되지 않았으므로 낡음 판정에서 제외한다 —
 * 플레이스홀더를 넣어두는 것만으로 경고가 꺼지면 장치가 무의미해진다.
 */
const latestConfirmed = publications.find((p) => !p.todo);

/**
 * 과제 목록. 진행 중인 것을 먼저, 각 그룹 안에서는 늦게 끝나는 것부터 보여준다.
 * "지금 뭐가 돌고 있나" 가 이 목록을 보는 이유라 그 순서가 곧 답이 되게 한다.
 *
 * 기준일은 빌드 날짜(= 최종 커밋 날짜)다. 실제 오늘이 아니라는 게 중요하다 —
 * 아무도 커밋하지 않으면 상태도 그 날짜에 멈춘다. 푸터의 Last updated 와 같은
 * 기준이라 둘이 어긋나지 않는다.
 */
export const projects: ProjectWithStatus[] = rawProjects
  .map((p) => ({ ...p, status: projectStatus(p.period, lastUpdated) }))
  .sort((a, b) => {
    const rank = { ongoing: 0, unknown: 1, completed: 2 } as const;
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    return (projectEnd(b.period) ?? '').localeCompare(projectEnd(a.period) ?? '');
  });

export const projectCounts = {
  ongoing: projects.filter((p) => p.status === 'ongoing').length,
  completed: projects.filter((p) => p.status === 'completed').length,
};

export const staleness = (() => {
  if (!latestConfirmed) return { months: null as number | null, stale: false, since: null as string | null };
  const months = Math.floor(
    (Date.parse(lastUpdated) - Date.parse(latestConfirmed.date)) / MONTH_MS,
  );
  return { months, stale: months >= 12, since: latestConfirmed.date };
})();

/** 검증이 필요한 항목 수 (todo 플래그 + 비어 있는 alumni 정보). */
/** venue 매칭에 실패한 논문. venues.yaml 에 항목이 없다는 뜻이다. */
export const unmatchedVenues: string[] = [
  ...new Set(publications.filter((p) => !p.venueInfo).map((p) => p.venue)),
];

/**
 * SCIE 여부나 IF 가 아직 확인되지 않은 저널. 컨퍼런스는 대상이 아니다.
 * note 가 달린 저널(예: PLOS — 방침상 IF 미공개)은 IF 없음이 확정된 상태이므로 제외한다.
 */
export const venuesNeedingMetrics: Venue[] = venues.filter(
  (v) => v.kind === 'journal' && (v.scie == null || (v.impact_factor == null && !v.note)),
);

/**
 * first / corresponding 에 authors 에 없는 이름이 적힌 논문.
 * 이름 표기가 어긋나면 †·* 가 조용히 사라지므로 눈에 보이게 센다.
 */
export const publicationsWithBadAuthorNames: { title: string; names: string[] }[] = publications
  .map((p) => ({ title: p.title, names: unknownAuthorNames(p) }))
  .filter((x) => x.names.length > 0);

/* ------------------------- 멤버 개인 페이지 ------------------------- */

/** 그 사람이 받은 상. awards.yaml 에서 파생한다. */
export function awardsOf(member: Member): Award[] {
  return awards.filter((a) => normName(a.member) === normName(member.name));
}

/**
 * 개인 페이지를 만들 멤버. 논문이나 수상이 하나라도 있어야 한다 —
 * 이름과 주제만 있는 빈 페이지는 없는 것보다 나쁘다. 사람이 켜고 끄는 플래그를 두지 않는다.
 */
export const memberPages: Member[] = members.filter(
  (m) => Boolean(m.slug) && (publicationsOf(m).length > 0 || awardsOf(m).length > 0),
);

const MEMBER_BY_SLUG = new Map(memberPages.map((m) => [m.slug as string, m]));

export function memberBySlug(slug: string): Member | undefined {
  return MEMBER_BY_SLUG.get(slug);
}

/** 개인 페이지가 있으면 그 주소, 없으면 null. 카드에서 이름·사진을 링크로 감쌀지 결정한다. */
export function memberHref(member: Member): string | null {
  return member.slug && MEMBER_BY_SLUG.has(member.slug) ? `/members/${member.slug}/` : null;
}

/** slug 가 겹치면 한쪽 페이지가 조용히 사라진다. 빌드에서 잡는다. */
export const duplicateSlugs: string[] = (() => {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const m of members) {
    if (!m.slug) continue;
    if (seen.has(m.slug)) dup.add(m.slug);
    seen.add(m.slug);
  }
  return [...dup];
})();

/** paper 로 가리킨 논문을 찾지 못한 상. 제목 표기가 어긋나면 조용히 사라지므로 센다. */
export const awardsWithUnknownPaper: string[] = awards
  .filter(
    (a) => a.paper && !publications.some((p) => normTitle(p.title) === normTitle(a.paper as string)),
  )
  .map((a) => `${a.member} — ${a.title}`);

export const needsAttention = {
  publications: publications.filter((p) => p.todo).length,
  authorNames: publicationsWithBadAuthorNames.length,
  untagged: untaggedPublications.length,
  venueMetrics: venuesNeedingMetrics.length,
  unmatchedVenues: unmatchedVenues.length,
  awardMembers: unmatchedAwardMembers.length,
  duplicateSlugs: duplicateSlugs.length,
  awardPapers: awardsWithUnknownPaper.length,
  alumniMissingAffiliation: membersByRole('alumni').filter((m) => !m.next).length,
};

/**
 * /news 에 나가는 목록. news.yaml + awards.yaml 파생 항목을 합친다.
 * 수상 소식을 news.yaml 에 손으로 적지 않는 이유는 두 벌이 되면 한쪽만 고쳐지기 때문이다.
 */
export const newsFeed: NewsItem[] = [
  ...news.map((n) => ({ ...n, date: String(n.date) })),
  ...awards.map((a) => ({
    date: a.date,
    title:
      a.kind === 'grant'
        ? `${a.member} selected for the ${a.title}`
        : `${a.member} receives the ${a.title}`,
    ko: a.ko ?? null,
    body: a.org ?? null,
  })),
].sort(byDateDesc);

/**
 * 유지보수자에게 필요한 지시는 빌드 로그로 보낸다.
 *
 * 화면의 안내문은 방문자가 읽는 글이라 "저자를 대조하는 중" 까지만 말한다.
 * 어느 YAML 의 어느 필드를 고쳐야 하는지는 방문자에게 아무 의미가 없고,
 * 진학을 고민하며 들어온 학생에게는 사이트가 공사 중이라는 인상만 준다.
 * 그렇다고 지시를 지우면 고치는 법을 아무도 모르게 되므로, 여기로 옮긴다.
 */
const buildNotes: string[] = [
  needsAttention.publications > 0 &&
    `확인 필요 ${needsAttention.publications}건 — content/publications.yaml 해당 항목의 todo 줄을 지운다.`,
  untaggedPublications.length > 0 &&
    `주제 미분류 ${untaggedPublications.length}건 — 해당 항목에 topics 를 넣는다 (키는 content/research.yaml 의 areas[].key).`,
  venuesNeedingMetrics.length > 0 &&
    `SCIE·IF 미확인 ${venuesNeedingMetrics.length}곳 (${venuesNeedingMetrics
      .map((v) => v.name)
      .join(', ')}) — content/venues.yaml 의 scie·impact_factor·quartile 을 채운다.`,
  publicationsWithBadAuthorNames.length > 0 &&
    `저자 표기 불일치 ${publicationsWithBadAuthorNames.length}건 — first·corresponding 의 이름이 authors 안에 없다: ${publicationsWithBadAuthorNames
      .map((x) => x.names.join(', '))
      .join(' / ')}`,
  unmatchedAwardMembers.length > 0 &&
    `수상자 미매칭 ${unmatchedAwardMembers.length}명 (${unmatchedAwardMembers.join(
      ', ',
    )}) — content/awards.yaml 의 member 를 content/members.yaml 의 name 과 맞춘다.`,
  duplicateSlugs.length > 0 && `slug 중복: ${duplicateSlugs.join(', ')}`,
].filter((x): x is string => Boolean(x));

if (buildNotes.length > 0) {
  console.warn(`\n[content] 손볼 것 ${buildNotes.length}건`);
  for (const note of buildNotes) console.warn(`  · ${note}`);
  console.warn('');
}
