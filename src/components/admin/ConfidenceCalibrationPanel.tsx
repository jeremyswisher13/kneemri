import { useMemo } from "react";
import type { CourseDefinition } from "@/content/courses";
import { domainLabel, type Fellow } from "@/components/admin/shared";

interface ConfidenceCalibrationPanelProps {
  fellows: Fellow[];
  course: CourseDefinition;
}

const NOW = "#2774AE";
const THEN = "#d97706";
const DAYONE = "#9ca3af";

function avg(xs: number[]): number | null {
  return xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null;
}

export default function ConfidenceCalibrationPanel({ fellows, course }: ConfidenceCalibrationPanelProps) {
  const rows = useMemo(() => {
    // statement id -> domain (one statement per domain after the blueprint alignment)
    const stmtDomain = new Map(course.confidenceStatements.map((s) => [s.id, s.domain]));

    // Knowledge items grouped by domain, split into pre/post administrations.
    const postQByDomain = new Map<string, { id: string; correctAnswer: string }[]>();
    const preQByDomain = new Map<string, { id: string; correctAnswer: string }[]>();
    for (const q of course.prePostQuizQuestions) {
      const onPost = q.prePostMapping === "parallel-post" || q.prePostMapping === "identical" || q.prePostMapping === "post-only";
      const onPre = q.prePostMapping === "parallel-pre" || q.prePostMapping === "identical" || q.prePostMapping === "pre-only";
      if (onPost) (postQByDomain.get(q.domain) ?? postQByDomain.set(q.domain, []).get(q.domain)!).push({ id: q.id, correctAnswer: q.correctAnswer });
      if (onPre) (preQByDomain.get(q.domain) ?? preQByDomain.set(q.domain, []).get(q.domain)!).push({ id: q.id, correctAnswer: q.correctAnswer });
    }

    return course.confidenceStatements.map((stmt) => {
      const domain = stmt.domain;
      const dayOne: number[] = [];
      const retro: number[] = [];
      const post: number[] = [];
      for (const f of fellows) {
        const p = f.preSurveyResponses?.find((r) => stmtDomain.get(r.statementId) === domain)?.rating;
        const r = f.postRetroResponses?.find((x) => stmtDomain.get(x.statementId) === domain)?.rating;
        const q = f.postSurveyResponses?.find((x) => stmtDomain.get(x.statementId) === domain)?.rating;
        if (p !== undefined) dayOne.push(p);
        if (r !== undefined) retro.push(r);
        if (q !== undefined) post.push(q);
      }

      // Knowledge % correct for this domain (pooled across fellows + items).
      const knowledgePct = (group: Map<string, { id: string; correctAnswer: string }[]>, phase: "pre" | "post") => {
        const items = group.get(domain) ?? [];
        if (!items.length) return null;
        const byId = new Map(items.map((it) => [it.id, it.correctAnswer]));
        let n = 0;
        let correct = 0;
        for (const f of fellows) {
          const resp = phase === "pre" ? f.preQuizResponses : f.postQuizResponses;
          for (const a of resp ?? []) {
            const key = byId.get(a.questionId);
            if (key === undefined) continue;
            n++;
            if (a.selectedAnswer === key) correct++;
          }
        }
        return n ? { pct: Math.round((correct / n) * 100), n } : null;
      };

      const avgPost = avg(post);
      const knowPost = knowledgePct(postQByDomain, "post");
      const knowPre = knowledgePct(preQByDomain, "pre");
      const avgDayOne = avg(dayOne);
      const avgRetro = avg(retro);

      // Calibration: end-of-course self-confidence (%) vs end-of-course competence (%).
      // Map the 1–5 Likert across its SPAN ((rating-1)/4) so the floor is 0%, matching
      // the competence % floor — otherwise rating 1 reads as 20% and every domain looks
      // systematically overconfident.
      const confPct = avgPost !== null ? Math.round(((avgPost - 1) / 4) * 100) : null;
      const gap = confPct !== null && knowPost ? confPct - knowPost.pct : null;

      // Response shift: a positive value means fellows now judge their true
      // baseline as LOWER than they rated it on day one (classic overrating of novices).
      const responseShift = avgDayOne !== null && avgRetro !== null ? Math.round((avgDayOne - avgRetro) * 10) / 10 : null;

      return {
        domain,
        label: domainLabel(domain),
        avgDayOne,
        avgRetro,
        avgPost,
        responseShift,
        confPct,
        knowPost: knowPost?.pct ?? null,
        knowPre: knowPre?.pct ?? null,
        gap,
      };
    });
  }, [fellows, course]);

  const hasConfidence = rows.some((r) => r.avgPost !== null || r.avgDayOne !== null);
  if (!hasConfidence) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Confidence vs. Competence</h2>
        <p className="py-6 text-center text-sm text-gray-500">
          No confidence-survey responses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Confidence vs. Competence</h2>
        <p className="text-sm text-gray-500">
          End-of-course self-rated confidence against actual % correct, by domain. A large
          positive gap = overconfident (knows less than they think); negative = underconfident.
        </p>
      </div>

      {/* Calibration: confidence% vs knowledge% per domain */}
      <div className="space-y-3">
        {rows.map((r) => {
          const gapColor = r.gap == null ? "#9ca3af" : Math.abs(r.gap) <= 15 ? "#16a34a" : r.gap > 0 ? "#dc2626" : "#d97706";
          const gapLabel =
            r.gap == null ? "—" : r.gap > 0 ? `+${r.gap} overconfident` : r.gap < 0 ? `${r.gap} underconfident` : "calibrated";
          return (
            <div key={r.domain} className="rounded-lg border border-gray-100 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-gray-800">{r.label}</span>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `${gapColor}1a`, color: gapColor }}>
                  {gapLabel}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-[11px] text-ucla-blue">Confidence</span>
                  <div className="h-2.5 flex-1 rounded-full bg-gray-100">
                    <div className="h-2.5 rounded-full" style={{ width: `${r.confPct ?? 0}%`, backgroundColor: NOW }} />
                  </div>
                  <span className="w-9 text-right text-[11px] font-semibold text-ucla-blue">{r.confPct == null ? "—" : `${r.confPct}%`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-[11px] text-gray-600">Competence</span>
                  <div className="h-2.5 flex-1 rounded-full bg-gray-100">
                    <div className="h-2.5 rounded-full" style={{ width: `${r.knowPost ?? 0}%`, backgroundColor: "#16a34a" }} />
                  </div>
                  <span className="w-9 text-right text-[11px] font-semibold text-green-700">{r.knowPost == null ? "—" : `${r.knowPost}%`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confidence growth with response-shift correction */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <h3 className="mb-1 text-sm font-bold text-gray-900">Confidence growth (response-shift corrected)</h3>
        <p className="mb-3 text-xs text-gray-500">
          <span style={{ color: DAYONE }}>Day-one</span> is what fellows rated at the start;{" "}
          <span style={{ color: THEN }}>looking-back</span> is how they re-rated that same baseline at the end.
          A positive shift means they had overrated themselves on day one — so the honest gain is{" "}
          <span style={{ color: NOW }}>now</span> minus looking-back.
        </p>
        <div className="space-y-2">
          {rows.map((r) => {
            const honestGain = r.avgRetro !== null && r.avgPost !== null ? Math.round((r.avgPost - r.avgRetro) * 10) / 10 : null;
            return (
              <div key={r.domain} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="w-40 shrink-0 font-medium text-gray-700">{r.label}</span>
                <span className="text-gray-500">day-one <b style={{ color: DAYONE }}>{r.avgDayOne ?? "—"}</b></span>
                <span className="text-gray-500">looking-back <b style={{ color: THEN }}>{r.avgRetro ?? "—"}</b></span>
                <span className="text-gray-500">now <b style={{ color: NOW }}>{r.avgPost ?? "—"}</b></span>
                {honestGain !== null && (
                  <span className="font-semibold" style={{ color: honestGain >= 0 ? "#16a34a" : "#dc2626" }}>
                    gain {honestGain > 0 ? `+${honestGain}` : honestGain}
                  </span>
                )}
                {r.responseShift !== null && r.responseShift !== 0 && (
                  <span className="text-[11px] text-gray-500">(shift {r.responseShift > 0 ? `+${r.responseShift}` : r.responseShift})</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
