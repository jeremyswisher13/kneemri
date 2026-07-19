/**
 * Publication / research export helpers.
 *
 * Two deliverables, both PURE (no DOM, no Firestore) so they are unit-tested:
 *  1. buildResearchDataset() — a DE-IDENTIFIED, one-row-per-learner research
 *     dataset (stable "P001…" participant ids, NO name/email/timestamps),
 *     with overall + per-domain knowledge gain and confidence metrics. Feeds a
 *     manuscript, an IRB submission, or analysis in R/Python.
 *  2. buildCohortReport() — a cohort-level "methods & results" summary (n, pre/
 *     post mean±SD, paired Cohen's d, KR-20 reliability, per-domain gains) plus
 *     a ready-to-paste results paragraph.
 *
 * The statistics come from the already-tested psychometrics.ts (Cohen's d,
 * KR-20) and growth.ts (per-domain pre→post gain, retrospective "honest"
 * confidence gain). This module only assembles + de-identifies them.
 */
import {
  computePsychometrics,
  interpretCohensD,
  interpretKr20,
  mean,
} from "@/lib/psychometrics";
import { computeGrowth, domainLabel } from "@/lib/growth";
import {
  requiredCoreCaseCount,
  type CourseDefinition,
} from "@/content/courses";
import type { SurveyResponse, QuizResponse } from "@/types/progress";

/**
 * The minimal learner shape both exports need. The admin `Fellow` type is
 * structurally assignable to this — declared locally so the lib does not depend
 * on the admin component layer.
 */
export interface ResearchFellow {
  id: string;
  role?: string | null;
  preQuizScore: number | null;
  preQuizTotal: number | null;
  postQuizScore: number | null;
  postQuizTotal: number | null;
  preQuizResponses: QuizResponse[] | null;
  postQuizResponses: QuizResponse[] | null;
  preSurveyResponses: SurveyResponse[] | null;
  postSurveyResponses: SurveyResponse[] | null;
  postRetroResponses: SurveyResponse[] | null;
  modulesCompleted: number;
  casesCompleted: number;
}

/**
 * Stable de-identified participant ids, derived from a hash of the opaque user
 * id — so the SAME learner always maps to the SAME code, without ever exposing
 * the id, name, or email.
 *
 * The code MUST be a property of the learner, not of their position in a list.
 * A previous version assigned P001…Pnnn by index after sorting the passed-in
 * array, which meant the mapping depended on cohort membership: flipping the
 * Learners role filter, or one new learner enrolling, shifted every code. Merging
 * two exports on "Participant ID" — the documented longitudinal use case — would
 * then silently attribute one learner's pre/post scores to a different person.
 *
 * Collisions are resolved deterministically (by sorted uid) so a given roster
 * always produces the same codes; the suffix keeps the space large enough that
 * collisions are rare for a fellowship-sized cohort.
 */
export function participantIds(fellows: ResearchFellow[]): Map<string, string> {
  const hash = (uid: string): number => {
    // FNV-1a — deterministic across runs and platforms (unlike a seeded RNG).
    let h = 0x811c9dc5;
    for (let i = 0; i < uid.length; i++) {
      h ^= uid.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  };

  const m = new Map<string, string>();
  const taken = new Set<string>();
  // Sort only to make collision resolution deterministic — the code itself does
  // NOT depend on position.
  for (const f of [...fellows].sort((a, b) => a.id.localeCompare(b.id))) {
    const base = hash(f.id) % 100000;
    let code = `P${String(base).padStart(5, "0")}`;
    for (let bump = 1; taken.has(code); bump++) {
      code = `P${String((base + bump) % 100000).padStart(5, "0")}`;
    }
    taken.add(code);
    m.set(f.id, code);
  }
  return m;
}

function avgRating(resp: SurveyResponse[] | null): number | null {
  if (!resp || resp.length === 0) return null;
  return resp.reduce((s, r) => s + r.rating, 0) / resp.length;
}

const blank = (x: number | null, digits = 0): number | string =>
  x === null ? "" : Number(x.toFixed(digits));

function domainKeysOf(course: CourseDefinition): string[] {
  const keys: string[] = [];
  for (const q of course.prePostQuizQuestions) {
    if (!keys.includes(q.domain)) keys.push(q.domain);
  }
  return keys;
}

function casesPctFor(f: ResearchFellow, course: CourseDefinition): number | null {
  const isResident = f.role === "resident";
  // Report progress toward the common core-case milestone. Additional core and
  // advanced cases remain available but do not inflate completion above 100%.
  const total = requiredCoreCaseCount(course, isResident);
  if (total === 0) return null;
  return Math.min(100, (f.casesCompleted / total) * 100);
}

/**
 * De-identified, analysis-ready dataset: one row per learner, overall +
 * per-domain. No DIRECT identifiers — never includes name, email, raw id, or
 * timestamps. NOTE: `role` (fellow/resident) is retained as a quasi-identifier
 * and, combined with a small cohort, can narrow identity — treat exports as
 * sensitive per your IRB / data-use terms.
 */
export function buildResearchDataset(
  fellows: ResearchFellow[],
  course: CourseDefinition,
): { headers: string[]; rows: (string | number)[][] } {
  const pids = participantIds(fellows);
  const domains = domainKeysOf(course);
  const totalModules = course.modules.length;

  const headers: string[] = [
    "Participant ID",
    "Role",
    "Pre %",
    "Post %",
    "Quiz Gain (pp)",
    "Pre Confidence (1-5)",
    "Retro Confidence (1-5)",
    "Post Confidence (1-5)",
    "Honest Confidence Gain (post - retro)",
    "Modules Completed %",
    "Cases Completed %",
    "Has Pre",
    "Has Post",
  ];
  domains.forEach((d) => {
    const label = domainLabel(d);
    headers.push(
      `${label}: Quiz Gain (pp)`,
      `${label}: Post Conf (1-5)`,
      `${label}: Honest Conf Gain`,
    );
  });

  // Stable participant-id order so re-exports diff cleanly.
  const ordered = [...fellows].sort((a, b) =>
    (pids.get(a.id) as string).localeCompare(pids.get(b.id) as string),
  );

  const rows = ordered.map((f) => {
    const g = computeGrowth(f, course);
    const preConf = avgRating(f.preSurveyResponses);
    const retroConf = avgRating(f.postRetroResponses);
    const postConf = avgRating(f.postSurveyResponses);
    const honestConf =
      postConf !== null && retroConf !== null ? postConf - retroConf : null;
    const byDomain = new Map(g.domains.map((d) => [d.domain, d]));

    const row: (string | number)[] = [
      pids.get(f.id) as string,
      f.role || "",
      blank(g.overall.prePct),
      blank(g.overall.postPct),
      blank(g.overall.gainPts),
      blank(preConf, 2),
      blank(retroConf, 2),
      blank(postConf, 2),
      blank(honestConf, 2),
      totalModules > 0 ? Math.round((f.modulesCompleted / totalModules) * 100) : "",
      blank(casesPctFor(f, course)),
      f.preQuizScore !== null ? "Yes" : "No",
      f.postQuizScore !== null ? "Yes" : "No",
    ];
    domains.forEach((d) => {
      const dg = byDomain.get(d);
      row.push(
        blank(dg?.quizGain ?? null),
        blank(dg?.postConf ?? null, 2),
        blank(dg?.honestConfGain ?? null, 2),
      );
    });
    return row;
  });

  return { headers, rows };
}

/** RFC-4180 CSV. */
export function datasetToCsv(headers: string[], rows: (string | number)[][]): string {
  const esc = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");
}

export interface CohortDomainGain {
  domain: string;
  label: string;
  quizGain: number | null;
  honestConfGain: number | null;
  /**
   * Sample sizes are TRACKED SEPARATELY on purpose: the quiz gain and the
   * confidence gain are averaged over different learner sets (a learner can
   * answer the quiz items without completing the retrospective ratings, and vice
   * versa). Reporting one shared `n` beside both attributed the wrong sample size
   * to the confidence figure in the panel and the exported PDF.
   */
  nQuiz: number;
  nConf: number;
}

export interface CohortReport {
  courseTitle: string;
  enrolled: number;
  nPre: number;
  nPost: number;
  nPaired: number;
  preMean: number | null;
  preSd: number | null;
  postMean: number | null;
  postSd: number | null;
  gainPts: number | null;
  cohensD: number | null;
  cohensDInterp: string | null;
  kr20: number | null;
  kr20Interp: string | null;
  domains: CohortDomainGain[];
  /** Manuscript-ready results paragraph. */
  resultsText: string;
}

/** Cohort-level effectiveness summary for a paper / program report. */
export function buildCohortReport(
  fellows: ResearchFellow[],
  course: CourseDefinition,
): CohortReport {
  const psych = computePsychometrics(fellows, course.prePostQuizQuestions);
  const enrolled = fellows.length;
  const nPre = psych.pre?.n ?? 0;
  const nPost = psych.post?.n ?? 0;
  const nPaired = psych.gain?.nPaired ?? 0;
  const preMean = psych.pre?.meanPct ?? null;
  const preSd = psych.pre?.sdPct ?? null;
  const postMean = psych.post?.meanPct ?? null;
  const postSd = psych.post?.sdPct ?? null;
  const gainPts = psych.gain?.meanPct ?? null;
  const cohensD = psych.gain?.cohensD ?? null;
  const cohensDInterp = cohensD !== null ? interpretCohensD(cohensD) : null;
  const kr20 = psych.post?.kr20 ?? null;
  const kr20Interp = kr20 !== null ? interpretKr20(kr20) : null;

  const growths = fellows.map((f) => computeGrowth(f, course));
  const domains: CohortDomainGain[] = domainKeysOf(course).map((key) => {
    const gains: number[] = [];
    const conf: number[] = [];
    let label = domainLabel(key);
    for (const g of growths) {
      const d = g.domains.find((x) => x.domain === key);
      if (!d) continue;
      label = d.label || label;
      if (d.quizGain !== null) gains.push(d.quizGain);
      if (d.honestConfGain !== null) conf.push(d.honestConfGain);
    }
    return {
      domain: key,
      label,
      quizGain: gains.length ? mean(gains) : null,
      honestConfGain: conf.length ? mean(conf) : null,
      nQuiz: gains.length,
      nConf: conf.length,
    };
  });

  const resultsText = buildResultsText({
    courseTitle: course.title,
    enrolled,
    nPost,
    nPaired,
    preMean,
    preSd,
    postMean,
    postSd,
    gainPts,
    cohensD,
    cohensDInterp,
    kr20,
    kr20Interp,
    domains,
  });

  return {
    courseTitle: course.title,
    enrolled,
    nPre,
    nPost,
    nPaired,
    preMean,
    preSd,
    postMean,
    postSd,
    gainPts,
    cohensD,
    cohensDInterp,
    kr20,
    kr20Interp,
    domains,
    resultsText,
  };
}

function buildResultsText(r: {
  courseTitle: string;
  enrolled: number;
  nPost: number;
  nPaired: number;
  preMean: number | null;
  preSd: number | null;
  postMean: number | null;
  postSd: number | null;
  gainPts: number | null;
  cohensD: number | null;
  cohensDInterp: string | null;
  kr20: number | null;
  kr20Interp: string | null;
  domains: CohortDomainGain[];
}): string {
  const r0 = (x: number | null) => (x === null ? "—" : x.toFixed(0));
  if (
    r.nPaired >= 2 &&
    r.preMean !== null &&
    r.postMean !== null &&
    r.cohensD !== null
  ) {
    let t = `${r.courseTitle}. Among ${r.nPaired} learners who completed both the pre- and post-course assessments, mean knowledge scores increased from ${r0(
      r.preMean,
    )}% (SD ${r0(r.preSd)}) to ${r0(r.postMean)}% (SD ${r0(
      r.postSd,
    )}), a gain of ${r0(r.gainPts)} percentage points (paired Cohen's d = ${r.cohensD.toFixed(
      2,
    )}, ${r.cohensDInterp} effect). `;
    if (r.kr20 !== null) {
      t += `The matched post-test form demonstrated ${r.kr20Interp} internal consistency (KR-20 = ${r.kr20.toFixed(
        2,
      )}). `;
    }
    const ranked = r.domains
      .filter((d) => d.quizGain !== null)
      .sort((a, b) => (b.quizGain as number) - (a.quizGain as number));
    if (ranked.length >= 1) {
      t += `The largest knowledge gains were in ${ranked[0].label} (+${r0(
        ranked[0].quizGain,
      )} pp)`;
      t += ranked.length >= 2 ? ` and ${ranked[1].label} (+${r0(ranked[1].quizGain)} pp). ` : ". ";
    }
    t += `Analyses reflect ${r.nPaired} of ${r.enrolled} enrolled learners.`;
    return t;
  }
  let t = `${r.courseTitle}. Insufficient paired pre/post data for effect-size estimation (paired n = ${r.nPaired}). `;
  if (r.postMean !== null) {
    t += `The current post-test mean is ${r0(r.postMean)}% (n = ${r.nPost}). `;
  }
  t += `Effect size and reliability will populate once at least two learners complete both assessments.`;
  return t;
}
