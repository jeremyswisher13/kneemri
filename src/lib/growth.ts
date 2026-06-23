/**
 * Per-learner "Your Growth" computations for the post-assessment report:
 * domain-by-domain knowledge gain (pre→post % correct) and confidence
 * calibration (self-rated confidence vs actual competence, response-shift
 * corrected). Pure + unit-tested; the report component is just presentation.
 *
 * Mirrors the cohort math in ConfidenceCalibrationPanel but for ONE learner:
 *  - confidence % maps the 1–5 Likert across its span ((r−1)/4) so its floor is
 *    0%, matching the competence floor (else rating 1 reads as 20%).
 *  - honest confidence gain = now − looking-back (retrospective), not now − day-one.
 */

import type { QuizResponse, SurveyResponse } from "@/types/progress";

interface GrowthInput {
  preQuizResponses: QuizResponse[] | null;
  postQuizResponses: QuizResponse[] | null;
  preQuizScore: number | null;
  preQuizTotal: number | null;
  postQuizScore: number | null;
  postQuizTotal: number | null;
  preSurveyResponses: SurveyResponse[] | null;
  postSurveyResponses: SurveyResponse[] | null;
  postRetroResponses: SurveyResponse[] | null;
}

interface GrowthCourse {
  prePostQuizQuestions: { id: string; domain: string; correctAnswer: string; prePostMapping: string }[];
  confidenceStatements: { id: string; domain: string }[];
}

export interface DomainGrowth {
  domain: string;
  label: string;
  preCorrect: number;
  preTotal: number;
  prePct: number | null;
  postCorrect: number;
  postTotal: number;
  postPct: number | null;
  quizGain: number | null; // postPct − prePct
  preConf: number | null; // day-one 1–5
  retroConf: number | null; // looking-back 1–5
  postConf: number | null; // now 1–5
  confPct: number | null; // (postConf−1)/4·100
  calibrationGap: number | null; // confPct − postPct (+ = overconfident)
  honestConfGain: number | null; // postConf − retroConf
}

export interface GrowthSummary {
  overall: { prePct: number | null; postPct: number | null; gainPts: number | null };
  domains: DomainGrowth[];
  strongest: DomainGrowth | null;
  needsWork: DomainGrowth | null;
  mostOverconfident: DomainGrowth | null;
}

export function domainLabel(domain: string): string {
  return domain.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const onPost = (m: string) => m === "parallel-post" || m === "identical" || m === "post-only";
const onPre = (m: string) => m === "parallel-pre" || m === "identical" || m === "pre-only";

function pct(n: number, total: number): number | null {
  return total > 0 ? Math.round((n / total) * 100) : null;
}

export function computeGrowth(p: GrowthInput, c: GrowthCourse): GrowthSummary {
  // domain → pre/post item answer keys
  const preItems = new Map<string, Map<string, string>>();
  const postItems = new Map<string, Map<string, string>>();
  const domains: string[] = [];
  for (const q of c.prePostQuizQuestions) {
    if (!preItems.has(q.domain)) {
      preItems.set(q.domain, new Map());
      postItems.set(q.domain, new Map());
      domains.push(q.domain);
    }
    if (onPre(q.prePostMapping)) preItems.get(q.domain)!.set(q.id, q.correctAnswer);
    if (onPost(q.prePostMapping)) postItems.get(q.domain)!.set(q.id, q.correctAnswer);
  }
  const stmtDomain = new Map(c.confidenceStatements.map((s) => [s.id, s.domain] as const));

  const preResp = new Map((p.preQuizResponses ?? []).map((r) => [r.questionId, r.selectedAnswer] as const));
  const postResp = new Map((p.postQuizResponses ?? []).map((r) => [r.questionId, r.selectedAnswer] as const));

  const confFor = (resp: SurveyResponse[] | null, domain: string): number | null => {
    for (const r of resp ?? []) if (stmtDomain.get(r.statementId) === domain) return r.rating;
    return null;
  };

  const rows: DomainGrowth[] = domains.map((domain) => {
    let preCorrect = 0;
    let preTotal = 0;
    for (const [id, key] of preItems.get(domain)!) {
      const sel = preResp.get(id);
      if (sel === undefined) continue;
      preTotal++;
      if (sel === key) preCorrect++;
    }
    let postCorrect = 0;
    let postTotal = 0;
    for (const [id, key] of postItems.get(domain)!) {
      const sel = postResp.get(id);
      if (sel === undefined) continue;
      postTotal++;
      if (sel === key) postCorrect++;
    }
    const prePct = pct(preCorrect, preTotal);
    const postPct = pct(postCorrect, postTotal);
    const preConf = confFor(p.preSurveyResponses, domain);
    const retroConf = confFor(p.postRetroResponses, domain);
    const postConf = confFor(p.postSurveyResponses, domain);
    const confPct = postConf !== null ? Math.round(((postConf - 1) / 4) * 100) : null;
    return {
      domain,
      label: domainLabel(domain),
      preCorrect,
      preTotal,
      prePct,
      postCorrect,
      postTotal,
      postPct,
      quizGain: prePct !== null && postPct !== null ? postPct - prePct : null,
      preConf,
      retroConf,
      postConf,
      confPct,
      calibrationGap: confPct !== null && postPct !== null ? confPct - postPct : null,
      honestConfGain: postConf !== null && retroConf !== null ? postConf - retroConf : null,
    };
  });

  const overallPre = pct(p.preQuizScore ?? 0, p.preQuizTotal ?? 0);
  const overallPost = pct(p.postQuizScore ?? 0, p.postQuizTotal ?? 0);
  // Use null when the underlying total is missing (not a real 0%).
  const prePct = p.preQuizTotal ? overallPre : null;
  const postPct = p.postQuizTotal ? overallPost : null;

  const answered = rows.filter((r) => r.postTotal > 0);
  const strongest =
    answered.length > 0 ? answered.reduce((a, b) => ((b.postPct ?? -1) > (a.postPct ?? -1) ? b : a)) : null;
  const needsWork =
    answered.length > 0 ? answered.reduce((a, b) => ((b.postPct ?? 101) < (a.postPct ?? 101) ? b : a)) : null;
  const overconf = rows.filter((r) => r.calibrationGap !== null && r.calibrationGap > 15);
  const mostOverconfident =
    overconf.length > 0
      ? overconf.reduce((a, b) => ((b.calibrationGap as number) > (a.calibrationGap as number) ? b : a))
      : null;

  return {
    overall: {
      prePct,
      postPct,
      gainPts: prePct !== null && postPct !== null ? postPct - prePct : null,
    },
    domains: rows,
    strongest,
    needsWork,
    mostOverconfident,
  };
}
