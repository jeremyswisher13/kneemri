import { useMemo } from "react";
import type { CourseDefinition } from "@/content/courses";
import { UCLA_BLUE, type Fellow } from "@/components/admin/shared";
import {
  computePsychometrics,
  interpretCohensD,
  interpretDiscrimination,
  interpretKr20,
} from "@/lib/psychometrics";

interface Props {
  fellows: Fellow[];
  course: CourseDefinition;
}

const GREEN = "#16a34a";
const BLUE = UCLA_BLUE;
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#9ca3af";

function effectColor(interp: string): string {
  if (interp === "large") return GREEN;
  if (interp === "medium") return BLUE;
  if (interp === "small") return AMBER;
  return GRAY;
}
function kr20Color(r: number): string {
  if (r >= 0.8) return GREEN;
  if (r >= 0.7) return BLUE;
  if (r >= 0.5) return AMBER;
  return RED;
}

function Metric({
  label,
  value,
  sub,
  color,
  hint,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold leading-none" style={{ color: color ?? "#111827" }}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs font-medium text-gray-600">{sub}</p>}
      <p className="mt-2 text-[11px] leading-snug text-gray-500">{hint}</p>
    </div>
  );
}

export default function TestQualityPanel({ fellows, course }: Props) {
  const p = useMemo(
    () => computePsychometrics(fellows, course.prePostQuizQuestions),
    [fellows, course],
  );

  // Item-quality summary: how many answered items have weak/negative discrimination.
  const itemFlags = useMemo(() => {
    const scored = Object.values(p.items).filter((it) => it.discrimination !== null && it.n >= 5);
    const weak = scored.filter((it) => interpretDiscrimination(it.discrimination as number) === "weak").length;
    const flawed = scored.filter((it) => interpretDiscrimination(it.discrimination as number) === "flawed").length;
    return { scored: scored.length, weak, flawed };
  }, [p.items]);

  const hasData = p.post !== null || p.pre !== null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Test Quality &amp; Effectiveness</h2>
        <p className="text-sm text-gray-500">
          Psychometrics for the matched pre/post assessment — is the course working, and is the test trustworthy?
        </p>
      </div>

      {!hasData ? (
        <p className="py-8 text-center text-sm text-gray-500">
          No completed pre/post assessments yet — metrics appear once learners finish.
        </p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Effect size — the headline "did the course move the needle" number */}
            {p.gain && p.gain.cohensD !== null ? (
              <Metric
                label="Knowledge gain (effect size)"
                value={`d = ${p.gain.cohensD.toFixed(2)}`}
                sub={`${interpretCohensD(p.gain.cohensD)} · +${p.gain.meanPct.toFixed(1)} pts (n=${p.gain.nPaired})`}
                color={effectColor(interpretCohensD(p.gain.cohensD))}
                hint="Cohen's d: standardized pre→post gain. 0.2 small · 0.5 medium · 0.8 large."
              />
            ) : (
              <Metric
                label="Knowledge gain (effect size)"
                value="—"
                sub="needs ≥2 learners with both pre & post"
                hint="Cohen's d: standardized pre→post gain. 0.2 small · 0.5 medium · 0.8 large."
              />
            )}

            {/* Reliability — is the post form internally consistent */}
            {p.post && p.post.kr20 !== null ? (
              <Metric
                label="Reliability (KR-20)"
                value={p.post.kr20.toFixed(2)}
                sub={interpretKr20(p.post.kr20)}
                color={kr20Color(p.post.kr20)}
                hint="Internal consistency of the post form. ≥0.8 strong · <0.7 noisy scores."
              />
            ) : (
              <Metric
                label="Reliability (KR-20)"
                value="—"
                sub="needs several complete post forms"
                hint="Internal consistency of the post form. ≥0.8 strong · <0.7 noisy scores."
              />
            )}

            {/* Mean pre/post */}
            <Metric
              label="Mean score"
              value={
                p.post
                  ? `${Math.round(p.post.meanPct)}%`
                  : p.pre
                    ? `${Math.round(p.pre.meanPct)}%`
                    : "—"
              }
              sub={
                p.pre && p.post
                  ? `pre ${Math.round(p.pre.meanPct)}% → post ${Math.round(p.post.meanPct)}%`
                  : p.pre
                    ? `pre only (n=${p.pre.n})`
                    : `post only (n=${p.post?.n})`
              }
              hint={
                p.post
                  ? `Post SD ${p.post.sdPct.toFixed(0)} pts across n=${p.post.n}.`
                  : "Cohort average on the assessment."
              }
            />

            {/* Item quality summary */}
            <Metric
              label="Item quality"
              value={
                itemFlags.scored === 0
                  ? "—"
                  : `${itemFlags.scored - itemFlags.weak - itemFlags.flawed}/${itemFlags.scored}`
              }
              sub={
                itemFlags.scored === 0
                  ? "needs ≥5 responses/item"
                  : itemFlags.weak + itemFlags.flawed === 0
                    ? "all items discriminate"
                    : `${itemFlags.flawed} flawed · ${itemFlags.weak} weak`
              }
              color={itemFlags.flawed > 0 ? RED : itemFlags.weak > 0 ? AMBER : GREEN}
              hint="Items whose correctness tracks overall score (point-biserial ≥0.2). See Item Analysis below."
            />
          </div>

          <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
            Read together: a <span className="font-medium text-gray-600">large effect size</span> with{" "}
            <span className="font-medium text-gray-600">acceptable+ reliability</span> is the evidence that this
            course produces real, well-measured learning. Low reliability or many weak items means tighten the
            instrument before trusting the gain.
          </p>
        </>
      )}
    </div>
  );
}
