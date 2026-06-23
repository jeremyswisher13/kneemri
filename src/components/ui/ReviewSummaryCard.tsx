import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { getCourseCards } from "@/lib/firestore";
import { reviewQuestionById } from "@/content/review-registry";
import { coursePath } from "@/content/courses";
import { summarizeReview, type ReviewSummary } from "@/lib/review-stats";

/**
 * Dashboard widget: a learner's spaced-review state for the active course —
 * how many cards are due, when the next session is, and how much has matured
 * into long-term retention. Renders nothing until the learner has cards.
 */
export default function ReviewSummaryCard() {
  const { user } = useAuth();
  const activeCourse = useActiveCourse();
  const [summary, setSummary] = useState<ReviewSummary | null>(null);

  useEffect(() => {
    if (!user || !activeCourse.features.reviewCards) return;
    let cancelled = false;
    getCourseCards(user.uid, activeCourse)
      .then((cards) => {
        if (cancelled) return;
        const valid = cards.filter((c) => reviewQuestionById[c.questionId]);
        setSummary(summarizeReview(valid));
      })
      .catch(() => {
        if (!cancelled) setSummary(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user, activeCourse]);

  // Nothing to show until the learner has accumulated review cards.
  if (!summary || summary.total === 0) return null;

  const { dueNow, dueNext7, nextDate, total, buckets } = summary;
  const reviewHref = coursePath(activeCourse, "/review");
  const segs = [
    { n: buckets.learning, color: "#f59e0b", label: "learning" },
    { n: buckets.strengthening, color: "#3b82f6", label: "strengthening" },
    { n: buckets.retained, color: "#16a34a", label: "retained" },
  ].filter((s) => s.n > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Spaced Review</p>
          {dueNow > 0 ? (
            <p className="mt-0.5 text-sm text-gray-600">
              <span className="text-lg font-bold text-ucla-blue">{dueNow}</span>{" "}
              {dueNow === 1 ? "card is" : "cards are"} due today.
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-gray-600">
              You&apos;re all caught up
              {dueNext7 > 0 ? (
                <>
                  {" — "}
                  <span className="font-medium text-gray-700">{dueNext7}</span>{" "}
                  {dueNext7 === 1 ? "card comes" : "cards come"} due in the next 7 days.
                </>
              ) : nextDate ? (
                <>
                  {" — next review around "}
                  <span className="font-medium text-gray-700">{nextDate}</span>.
                </>
              ) : (
                "."
              )}
            </p>
          )}
        </div>
        {dueNow > 0 && (
          <Link
            to={reviewHref}
            className="shrink-0 rounded-lg bg-ucla-blue px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-ucla-dark"
          >
            Review now
          </Link>
        )}
      </div>

      {/* Retention buckets */}
      <div className="mt-3">
        <div className="flex h-2 overflow-hidden rounded-full bg-gray-100">
          {segs.map((s) => (
            <div key={s.label} style={{ width: `${(s.n / total) * 100}%`, backgroundColor: s.color }} />
          ))}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
          {segs.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.n} {s.label}
            </span>
          ))}
          <span className="ml-auto text-gray-500">{total} in rotation</span>
        </div>
      </div>
    </div>
  );
}
