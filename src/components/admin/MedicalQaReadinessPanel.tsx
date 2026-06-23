import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { CourseDefinition } from "@/content/courses";
import type { MedicalQaPriorityItem } from "@/content/medical-qa.generated";
import { getMedicalQaReviews } from "@/lib/firestore";
import type { MedicalQaReviewRecord } from "@/lib/medical-qa-review";
import { medicalQaFilterPath, summarizeMedicalQaReadiness } from "@/lib/medical-qa-readiness";

interface MedicalQaReadinessPanelProps {
  course: CourseDefinition;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function pct(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

export default function MedicalQaReadinessPanel({ course }: MedicalQaReadinessPanelProps) {
  const [sourceCheckItems, setSourceCheckItems] = useState<MedicalQaPriorityItem[]>([]);
  const [reviewsById, setReviewsById] = useState<Record<string, MedicalQaReviewRecord>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/medical-qa/source-check-items.json").then((response) => {
        if (!response.ok) throw new Error(`Source queue returned ${response.status}`);
        return response.json() as Promise<MedicalQaPriorityItem[]>;
      }),
      getMedicalQaReviews(),
    ])
      .then(([items, reviews]) => {
        if (!active) return;
        setSourceCheckItems(items);
        setReviewsById(reviews);
        setError(null);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(
    () => summarizeMedicalQaReadiness(sourceCheckItems, reviewsById, course.id),
    [course.id, reviewsById, sourceCheckItems],
  );

  const approvedPct = pct(summary.approved, summary.total);
  const statusTone =
    summary.highRiskPending > 0
      ? "border-red-200 bg-red-50 text-red-700"
      : summary.pending + summary.needsRevision + summary.sourceNeeded > 0
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-green-200 bg-green-50 text-green-700";
  const statusLabel =
    summary.highRiskPending > 0
      ? "High-risk review pending"
      : summary.pending + summary.needsRevision + summary.sourceNeeded > 0
        ? "Source review pending"
        : "Source-check queue approved";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Medical QA Readiness</h2>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusTone}`}>{statusLabel}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Source-check signoff for {course.shortTitle}; high-risk items stay visible until approved.
          </p>
        </div>
        <Link
          to={medicalQaFilterPath({ courseId: course.id, status: "pending", risk: "high" })}
          className="inline-flex items-center justify-center rounded-lg border border-ucla-blue bg-white px-3 py-2 text-sm font-semibold text-ucla-blue transition-colors hover:bg-ucla-light"
        >
          Open high-risk queue
        </Link>
      </div>

      {loading ? (
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-ucla-blue/40" />
        </div>
      ) : error ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          QA readiness could not be loaded: {error}
        </div>
      ) : (
        <>
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>{formatNumber(summary.approved)} approved</span>
              <span>{approvedPct}%</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-green-500" style={{ width: `${approvedPct}%` }} />
            </div>
          </div>

          <div className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <MetricLine label="Unreviewed" value={summary.pending} tone="text-gray-900" />
            <MetricLine label="High-risk unapproved" value={summary.highRiskPending} tone="text-red-700" />
            <MetricLine label="Needs revision" value={summary.needsRevision} tone="text-red-700" />
            <MetricLine label="Source needed" value={summary.sourceNeeded} tone="text-amber-700" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to={medicalQaFilterPath({ courseId: course.id, status: "pending", risk: "all" })}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Unreviewed ({formatNumber(summary.pending)})
            </Link>
            <Link
              to={medicalQaFilterPath({ courseId: course.id, status: "needs-revision", risk: "all" })}
              className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
            >
              Needs revision ({formatNumber(summary.needsRevision)})
            </Link>
            <Link
              to={medicalQaFilterPath({ courseId: course.id, status: "source-needed", risk: "all" })}
              className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
            >
              Source needed ({formatNumber(summary.sourceNeeded)})
            </Link>
            <Link
              to={medicalQaFilterPath({ courseId: course.id, status: "approved", risk: "all" })}
              className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100"
            >
              Approved ({formatNumber(summary.approved)})
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

function MetricLine({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-gray-100 pb-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`text-lg font-bold ${tone}`}>{formatNumber(value)}</span>
    </div>
  );
}
