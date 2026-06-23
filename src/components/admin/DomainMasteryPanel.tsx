import { useMemo } from "react";
import type { CourseDefinition } from "@/content/courses";
import { type Fellow, domainLabel } from "@/components/admin/shared";

interface DomainRow {
  domain: string;
  label: string;
  preC: number;
  preN: number;
  postC: number;
  postN: number;
  prePct: number | null;
  postPct: number | null;
  delta: number | null;
}

const PRE_COLOR = "#d97706";
const POST_COLOR = "#16a34a";
const DELTA_DOWN = "#dc2626";

export default function DomainMasteryPanel({
  fellows,
  course,
}: {
  fellows: Fellow[];
  course: CourseDefinition;
}) {
  const rows = useMemo<DomainRow[]>(() => {
    const byId = new Map(course.prePostQuizQuestions.map((q) => [q.id, q]));
    type Agg = { preC: number; preN: number; postC: number; postN: number };
    const byDomain = new Map<string, Agg>();

    const bump = (questionId: string, selected: string, phase: "pre" | "post") => {
      const q = byId.get(questionId);
      if (!q) return;
      const domain = q.domain ?? "";
      let agg = byDomain.get(domain);
      if (!agg) {
        agg = { preC: 0, preN: 0, postC: 0, postN: 0 };
        byDomain.set(domain, agg);
      }
      const correct = selected === q.correctAnswer;
      if (phase === "pre") {
        agg.preN++;
        if (correct) agg.preC++;
      } else {
        agg.postN++;
        if (correct) agg.postC++;
      }
    };

    for (const f of fellows) {
      for (const r of f.preQuizResponses ?? []) bump(r.questionId, r.selectedAnswer, "pre");
      for (const r of f.postQuizResponses ?? []) bump(r.questionId, r.selectedAnswer, "post");
    }

    return [...byDomain.entries()]
      .map(([domain, agg]) => {
        const prePct = agg.preN ? Math.round((agg.preC / agg.preN) * 100) : null;
        const postPct = agg.postN ? Math.round((agg.postC / agg.postN) * 100) : null;
        const delta = prePct !== null && postPct !== null ? postPct - prePct : null;
        return {
          domain,
          label: domainLabel(domain),
          preC: agg.preC,
          preN: agg.preN,
          postC: agg.postC,
          postN: agg.postN,
          prePct,
          postPct,
          delta,
        };
      })
      .sort((a, b) => (a.postPct ?? 101) - (b.postPct ?? 101));
  }, [fellows, course]);

  const hasData = rows.some((r) => r.preN > 0 || r.postN > 0);

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Knowledge Mastery by Domain</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Actual % correct on the pre/post assessment by domain — where the cohort's knowledge moved
        </p>
      </div>

      {!hasData ? (
        <p className="py-8 text-center text-sm text-gray-500">
          No pre/post assessment responses yet.
        </p>
      ) : (
        <>
          <div className="space-y-5">
            {rows.map((row) => (
              <div key={row.domain}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{row.label}</span>
                  <DeltaChip delta={row.delta} />
                </div>
                <PhaseBar
                  label="Pre"
                  pct={row.prePct}
                  color={PRE_COLOR}
                  n={row.preN}
                  phaseWord="pre"
                />
                <div className="mt-1.5">
                  <PhaseBar
                    label="Post"
                    pct={row.postPct}
                    color={POST_COLOR}
                    n={row.postN}
                    phaseWord="post"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-6 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: PRE_COLOR }} /> Pre-assessment
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: POST_COLOR }} /> Post-assessment
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PhaseBar({
  label,
  pct,
  color,
  n,
  phaseWord,
}: {
  label: string;
  pct: number | null;
  color: string;
  n: number;
  phaseWord: string;
}) {
  const w = pct === null ? 0 : Math.min(pct, 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 shrink-0 text-right text-[10px] text-gray-500">{label}</span>
      <div className="h-4 flex-1 overflow-hidden rounded bg-gray-100">
        <div className="h-full rounded" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
      <span className="w-10 shrink-0 text-xs font-semibold text-gray-700">
        {pct === null ? "—" : `${pct}%`}
      </span>
      <span className="w-16 shrink-0 text-[10px] text-gray-500">
        n={n} {phaseWord}
      </span>
    </div>
  );
}

function DeltaChip({ delta }: { delta: number | null }) {
  if (delta === null) {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
        —
      </span>
    );
  }
  const positive = delta >= 0;
  const color = positive ? POST_COLOR : DELTA_DOWN;
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-bold"
      style={{ color, backgroundColor: positive ? "#dcfce7" : "#fee2e2" }}
    >
      {positive ? "+" : ""}
      {delta} pts
    </span>
  );
}
