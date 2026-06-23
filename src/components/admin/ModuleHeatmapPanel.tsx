import { useMemo } from "react";
import type { CourseDefinition } from "@/content/courses";
import { type Fellow, pct } from "@/components/admin/shared";

interface ModuleRow {
  id: string;
  number: number;
  title: string;
  completedCount: number;
  attempts: number;
  avgPct: number | null;
  needsReview: boolean;
}

const GREEN = "#16a34a";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#9ca3af";

function colorFor(avgPct: number | null): string {
  if (avgPct === null) return GRAY;
  if (avgPct >= 80) return GREEN;
  if (avgPct >= 60) return AMBER;
  return RED;
}

export default function ModuleHeatmapPanel({
  fellows,
  course,
}: {
  fellows: Fellow[];
  course: CourseDefinition;
}) {
  const rows = useMemo<ModuleRow[]>(() => {
    return course.modules.map((mod) => {
      let completedCount = 0;
      const quizPcts: number[] = [];

      for (const f of fellows) {
        const mp = (f.moduleProgress ?? []).find((m) => m.id === mod.id);
        if (!mp) continue;
        if (mp.completed) completedCount++;
        if (mp.quizScore !== null && mp.quizTotal !== null && mp.quizTotal > 0) {
          quizPcts.push(pct(mp.quizScore, mp.quizTotal));
        }
      }

      const attempts = quizPcts.length;
      const avgPct =
        attempts > 0 ? Math.round(quizPcts.reduce((a, b) => a + b, 0) / attempts) : null;
      const needsReview = avgPct !== null && avgPct < 70 && attempts >= 3;

      return {
        id: mod.id,
        number: mod.number,
        title: mod.title,
        completedCount,
        attempts,
        avgPct,
        needsReview,
      };
    });
  }, [fellows, course]);

  const totalLearners = fellows.length;
  const hasProgress = rows.some((r) => r.completedCount > 0 || r.attempts > 0);

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Module Performance Heatmap</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Cohort completion and average module-quiz score per module — low scorers flag content that
          may need reteaching
        </p>
      </div>

      {!hasProgress ? (
        <p className="py-8 text-center text-sm text-gray-500">No module progress yet.</p>
      ) : (
        <>
          <div className="space-y-3">
            {rows.map((row) => {
              const color = colorFor(row.avgPct);
              const w = row.avgPct === null ? 0 : Math.min(row.avgPct, 100);
              return (
                <div key={row.id} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-gray-800">
                      {row.number}. {row.title}
                    </p>
                    {row.needsReview && (
                      <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600 border border-red-200">
                        review teaching
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-4 flex-1 overflow-hidden rounded bg-gray-100">
                      <div className="h-full rounded" style={{ width: `${w}%`, backgroundColor: color }} />
                    </div>
                    <span className="w-12 shrink-0 text-xs font-semibold" style={{ color }}>
                      {row.avgPct === null ? "—" : `${row.avgPct}%`}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>
                      {row.completedCount}/{totalLearners} completed
                    </span>
                    <span className="text-gray-500">
                      {row.attempts > 0 ? `avg quiz across ${row.attempts} attempt${row.attempts === 1 ? "" : "s"}` : "no quiz data"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
            Color reflects the cohort average module-quiz score (green ≥80%, amber 60–79%, red &lt;60%,
            gray no data). Modules below 70% with 3+ attempts are flagged for a teaching review.
          </p>
        </>
      )}
    </div>
  );
}
