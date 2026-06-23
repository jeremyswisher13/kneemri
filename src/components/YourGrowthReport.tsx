import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { UserProgress } from "@/types/progress";
import { coursePath, type CourseDefinition } from "@/content/courses";
import { computeGrowth, type DomainGrowth } from "@/lib/growth";

const BLUE = "#2774AE";
const GREEN = "#16a34a";
const GRAY = "#9ca3af";
const AMBER = "#d97706";
const RED = "#dc2626";

function Bar({ pct, color }: { pct: number | null; color: string }) {
  return (
    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct ?? 0}%`, backgroundColor: color }} />
    </div>
  );
}

function gainBadge(gain: number | null) {
  if (gain === null) return null;
  const color = gain > 0 ? GREEN : gain < 0 ? RED : GRAY;
  return (
    <span
      className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {gain > 0 ? "+" : ""}
      {gain}
      {gain !== 0 ? " pts" : ""}
    </span>
  );
}

export default function YourGrowthReport({
  progress,
  course,
}: {
  progress: UserProgress;
  course: CourseDefinition;
}) {
  const g = useMemo(() => computeGrowth(progress, course), [progress, course]);

  // Map each assessment domain → its primary module (the most-referenced module
  // among that domain's pre/post items) so a weak/overconfident domain can link
  // straight to the content to restudy. Empty when items carry no moduleId.
  const domainModule = useMemo(() => {
    const moduleById = new Map(course.modules.map((m) => [m.id, m] as const));
    const counts = new Map<string, Map<string, number>>();
    for (const q of course.prePostQuizQuestions) {
      if (!q.moduleId) continue;
      if (!counts.has(q.domain)) counts.set(q.domain, new Map());
      const m = counts.get(q.domain)!;
      m.set(q.moduleId, (m.get(q.moduleId) ?? 0) + 1);
    }
    const out = new Map<string, { id: string; title: string }>();
    for (const [domain, m] of counts) {
      let best: string | null = null;
      let bestN = 0;
      for (const [mid, n] of m) {
        if (n > bestN) {
          best = mid;
          bestN = n;
        }
      }
      const mod = best ? moduleById.get(best) : undefined;
      if (mod) out.set(domain, { id: mod.id, title: mod.title });
    }
    return out;
  }, [course]);

  const answeredKnowledge = g.domains.filter((d) => d.postTotal > 0);
  const withConf = g.domains.filter((d) => d.confPct !== null && d.postPct !== null);
  const honestGains = g.domains.map((d) => d.honestConfGain).filter((x): x is number => x !== null);
  const avgHonestGain =
    honestGains.length > 0
      ? Math.round((honestGains.reduce((a, b) => a + b, 0) / honestGains.length) * 10) / 10
      : null;

  const { overall, strongest, needsWork, mostOverconfident } = g;

  return (
    <div className="space-y-6">
      {/* ── Overall knowledge gain ── */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Your Growth</h2>
          <p className="text-sm text-gray-500">How much you learned, where you're strongest, and how well-calibrated you are.</p>
        </div>
        <div className="grid items-center gap-4 px-6 py-6 sm:grid-cols-[1fr_auto_1fr_auto]">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Before</p>
            <p className="text-4xl font-bold text-gray-500">{overall.prePct === null ? "—" : `${overall.prePct}%`}</p>
          </div>
          <div className="hidden text-2xl text-gray-300 sm:block">→</div>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: BLUE }}>
              After
            </p>
            <p className="text-4xl font-bold" style={{ color: BLUE }}>
              {overall.postPct === null ? "—" : `${overall.postPct}%`}
            </p>
          </div>
          <div className="text-center sm:text-right">
            {overall.gainPts !== null ? (
              <>
                <p
                  className="text-2xl font-bold"
                  style={{ color: overall.gainPts > 0 ? GREEN : overall.gainPts < 0 ? RED : GRAY }}
                >
                  {overall.gainPts > 0 ? "+" : ""}
                  {overall.gainPts} pts
                </p>
                <p className="text-xs text-gray-500">
                  {overall.gainPts > 0 ? "knowledge gain" : overall.gainPts === 0 ? "no change" : "review the topics below"}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">Take both quizzes to see your gain.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Knowledge by topic ── */}
      {answeredKnowledge.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">Knowledge by topic</h3>
          <p className="mb-4 text-sm text-gray-500">Your % correct before (gray) and after (blue) the course, by domain.</p>
          <div className="space-y-3">
            {answeredKnowledge.map((d) => (
              <DomainKnowledgeRow
                key={d.domain}
                d={d}
                isStrongest={strongest?.domain === d.domain}
                isWeakest={needsWork?.domain === d.domain && answeredKnowledge.length > 1}
              />
            ))}
          </div>
          {strongest && needsWork && strongest.domain !== needsWork.domain && (
            <div className="mt-4 border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-600">
                Strongest now: <span className="font-semibold text-green-700">{strongest.label}</span> ({strongest.postPct}%).
                Most room to grow: <span className="font-semibold text-amber-700">{needsWork.label}</span> ({needsWork.postPct}%)
                — a good place to point your spaced-review.
              </p>
              <StudyModuleLink course={course} mod={domainModule.get(needsWork.domain)} />
            </div>
          )}
        </div>
      )}

      {/* ── Confidence calibration ── */}
      {withConf.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900">Confidence check</h3>
          <p className="mb-3 text-sm text-gray-500">
            How sure you felt (blue) vs how you actually did (green). Big gaps are worth knowing about.
          </p>
          {mostOverconfident ? (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              You were noticeably more confident than correct on{" "}
              <span className="font-semibold">{mostOverconfident.label}</span> — a cue to slow down and double-check there.
              <StudyModuleLink course={course} mod={domainModule.get(mostOverconfident.domain)} tone="amber" />
            </div>
          ) : (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              Nicely calibrated — your confidence tracks your actual performance across topics.
            </div>
          )}
          <div className="space-y-3">
            {withConf.map((d) => {
              const gap = d.calibrationGap ?? 0;
              const tag =
                Math.abs(gap) <= 15 ? "calibrated" : gap > 0 ? `+${gap} overconfident` : `${gap} underconfident`;
              const tagColor = Math.abs(gap) <= 15 ? GREEN : gap > 0 ? RED : AMBER;
              return (
                <div key={d.domain} className="rounded-lg border border-gray-100 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-gray-800">{d.label}</span>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: `${tagColor}1a`, color: tagColor }}
                    >
                      {tag}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-20 shrink-0 text-[11px]" style={{ color: BLUE }}>Confidence</span>
                      <Bar pct={d.confPct} color={BLUE} />
                      <span className="w-9 text-right text-[11px] font-semibold" style={{ color: BLUE }}>
                        {d.confPct ?? "—"}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 shrink-0 text-[11px] text-gray-600">Correct</span>
                      <Bar pct={d.postPct} color={GREEN} />
                      <span className="w-9 text-right text-[11px] font-semibold text-green-700">{d.postPct ?? "—"}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {avgHonestGain !== null && (
            <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              Your confidence grew an honest average of{" "}
              <span className="font-semibold" style={{ color: avgHonestGain >= 0 ? GREEN : RED }}>
                {avgHonestGain > 0 ? "+" : ""}
                {avgHonestGain}
              </span>{" "}
              on the 1–5 scale — measured against how you re-rated your <em>true</em> starting point at the end (which
              corrects for the way beginners tend to overrate themselves).
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DomainKnowledgeRow({
  d,
  isStrongest,
  isWeakest,
}: {
  d: DomainGrowth;
  isStrongest: boolean;
  isWeakest: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-100 p-3">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-gray-800">
          {d.label}
          {isStrongest && (
            <span className="ml-2 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
              strongest
            </span>
          )}
          {isWeakest && (
            <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              grow here
            </span>
          )}
        </span>
        {gainBadge(d.quizGain)}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-12 shrink-0 text-[11px] text-gray-500">before</span>
          <Bar pct={d.prePct} color={GRAY} />
          <span className="w-9 text-right text-[11px] text-gray-500">{d.prePct ?? "—"}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12 shrink-0 text-[11px]" style={{ color: BLUE }}>after</span>
          <Bar pct={d.postPct} color={BLUE} />
          <span className="w-9 text-right text-[11px] font-semibold" style={{ color: BLUE }}>{d.postPct ?? "—"}%</span>
        </div>
      </div>
    </div>
  );
}

/** "Review the {module} →" deep-link shown on a weak/overconfident domain, so the
 *  growth report's insight turns into one click of targeted restudy. Renders
 *  nothing when the domain's items carry no moduleId. */
function StudyModuleLink({
  course,
  mod,
  tone = "blue",
}: {
  course: CourseDefinition;
  mod: { id: string; title: string } | undefined;
  tone?: "blue" | "amber";
}) {
  if (!mod) return null;
  return (
    <Link
      to={coursePath(course, `/modules/${mod.id}`)}
      className={`mt-2 inline-flex items-center gap-1 text-sm font-semibold hover:underline ${
        tone === "amber" ? "text-amber-900" : "text-ucla-blue"
      }`}
    >
      Review the {mod.title} module
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </Link>
  );
}
