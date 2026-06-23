import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import RetroLikertScale from "@/components/survey/RetroLikertScale";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { coursePath } from "@/content/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { submitSurvey } from "@/lib/firestore";

interface PreSurveyResponse {
  statementId: string;
  rating: number;
}

export default function PostSurveyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeCourse = useActiveCourse();
  const isAdminView = useIsAdminView();
  const { progress, loading: progressLoading } = useProgress(activeCourse);
  const confidenceStatements = activeCourse.confidenceStatements;
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [retroRatings, setRetroRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not unlocked or already completed. Admins bypass the unlock gate.
  // Fail SAFE when progress is unavailable (null, not loading) — redirect rather
  // than render the gated survey for an unauthorized learner.
  const shouldRedirect = !progressLoading &&
    (!progress || ((!progress.postQuizUnlocked && !isAdminView) || progress.postSurveyCompleted));
  useEffect(() => {
    if (shouldRedirect) {
      navigate(coursePath(activeCourse, "/post-assessment"), { replace: true });
    }
  }, [shouldRedirect, navigate, activeCourse]);

  if (shouldRedirect) {
    return null;
  }

  if (progressLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  // Parse pre-survey responses for comparison
  const preRatings: Record<string, number> = {};
  if (progress?.preSurveyResponses) {
    try {
      const responses: PreSurveyResponse[] =
        typeof progress.preSurveyResponses === "string"
          ? JSON.parse(progress.preSurveyResponses)
          : progress.preSurveyResponses;
      responses.forEach((r) => {
        preRatings[r.statementId] = r.rating;
      });
    } catch {
      // Pre-survey data not available, that's ok
    }
  }

  const allRated = confidenceStatements.every(
    (s) => ratings[s.id] != null && retroRatings[s.id] != null,
  );

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const responses = Object.entries(ratings).map(([statementId, rating]) => ({
        statementId,
        rating,
      }));
      const retroResponses = Object.entries(retroRatings).map(([statementId, rating]) => ({
        statementId,
        rating,
      }));

      await submitSurvey(
        user.uid,
        user.email || "",
        "post",
        responses,
        activeCourse.id,
        retroResponses,
        isAdminView,
      );
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    const hasPreData = Object.keys(preRatings).length > 0;

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Post-Assessment Confidence Survey
        </h1>

        <div className="mt-8 rounded-xl bg-green-50 border border-green-200 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-green-800">
            Survey Submitted
          </h2>
          <p className="mt-2 text-green-700">
            Your post-course confidence ratings have been recorded.
          </p>
        </div>

        {/* Confidence comparison: retrospective "before" vs now, plus the
            original pre-course rating when available. */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Your Confidence Growth
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            <span className="font-medium text-amber-600">Before</span> is your
            looking-back rating;{" "}
            <span className="font-medium text-ucla-blue">Now</span> is today. The
            growth uses the same after-course yardstick for both, which is the most
            honest measure of what you gained.
            {hasPreData && " Your original day-one rating is shown for reference."}
          </p>
          <div className="space-y-3">
            {confidenceStatements.map((s, idx) => {
              const origPre = preRatings[s.id] ?? null;
              const then = retroRatings[s.id] ?? null;
              const now = ratings[s.id] ?? null;
              const gain = then != null && now != null ? now - then : null;

              const Bar = ({
                label,
                value,
                color,
                text,
              }: {
                label: string;
                value: number | null;
                color: string;
                text: string;
              }) => (
                <div className="flex items-center gap-2">
                  <span className={`w-14 text-[10px] ${text}`}>{label}</span>
                  <div className="h-2 flex-1 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: value != null ? `${(value / 5) * 100}%` : "0%",
                        backgroundColor: color,
                      }}
                    />
                  </div>
                  <span className={`w-4 text-right text-[11px] font-semibold ${text}`}>
                    {value ?? "—"}
                  </span>
                </div>
              );

              return (
                <div
                  key={s.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-gray-900">
                      {idx + 1}. {s.statement}
                    </p>
                    {gain != null && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          gain > 0
                            ? "bg-green-50 text-green-700"
                            : gain < 0
                              ? "bg-red-50 text-red-600"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {gain > 0 ? `+${gain}` : gain === 0 ? "no change" : gain}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 space-y-1">
                    {hasPreData && (
                      <Bar label="Day one" value={origPre} color="#d1d5db" text="text-gray-500" />
                    )}
                    <Bar label="Before" value={then} color="#d97706" text="text-amber-600" />
                    <Bar label="Now" value={now} color="#2774AE" text="text-ucla-blue" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to={coursePath(activeCourse, "/")}>
            <Button size="lg">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Post-Assessment Confidence Survey
      </h1>
      <p className="mt-1 text-gray-500">
        For each skill, rate your confidence <span className="font-medium text-ucla-blue">now</span>{" "}
        and&mdash;looking back with what you know today&mdash;how confident you{" "}
        <span className="font-medium text-amber-600">actually were before</span> the course.
        There are no right or wrong answers.
      </p>

      {isAdminView && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-ucla-gold/40 bg-ucla-gold/10 px-4 py-2.5">
          <span className="text-xs font-medium text-ucla-dark">
            Admin view — your responses are not recorded. You can skip ahead.
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(coursePath(activeCourse, "/"))}
          >
            Skip survey (admin) →
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 space-y-4">
        {confidenceStatements.map((statement, idx) => (
          <RetroLikertScale
            key={statement.id}
            statement={statement}
            nowRating={ratings[statement.id] ?? null}
            thenRating={retroRatings[statement.id] ?? null}
            onRateNow={(rating: number) =>
              setRatings((prev) => ({ ...prev, [statement.id]: rating }))
            }
            onRateThen={(rating: number) =>
              setRetroRatings((prev) => ({ ...prev, [statement.id]: rating }))
            }
            index={idx + 1}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={!allRated || submitting}
        >
          {submitting ? "Submitting..." : "Submit Survey"}
        </Button>
        {!allRated && (
          <p className="mt-2 text-sm text-gray-500">
            Please give both ratings for all {confidenceStatements.length} statements to continue.
          </p>
        )}
      </div>
    </div>
  );
}
