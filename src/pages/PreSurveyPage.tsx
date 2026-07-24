import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import LikertScale from "@/components/survey/LikertScale";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { coursePath } from "@/content/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { submitSurvey } from "@/lib/firestore";
import UnsavedNavigationGuard from "@/components/ui/UnsavedNavigationGuard";

export default function PreSurveyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeCourse = useActiveCourse();
  const isAdminView = useIsAdminView();
  const { progress, loading: progressLoading } = useProgress(activeCourse);
  const confidenceStatements = activeCourse.confidenceStatements;
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already completed
  const shouldRedirect = !progressLoading && !!progress?.preSurveyCompleted;
  useEffect(() => {
    if (shouldRedirect) {
      navigate(coursePath(activeCourse, "/pre-assessment"), { replace: true });
    }
  }, [shouldRedirect, navigate, activeCourse]);

  if (shouldRedirect) return null;

  if (progressLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const allRated = confidenceStatements.every((s) => ratings[s.id] != null);
  const surveyInProgress = Object.keys(ratings).length > 0 && !submitted;

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const responses = Object.entries(ratings).map(([statementId, rating]) => ({
        statementId,
        rating,
      }));

      await submitSurvey(user.uid, user.email || "", "pre", responses, activeCourse.id, undefined, isAdminView);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Confidence Survey</h1>
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
            Your confidence ratings have been recorded. You can now proceed to
            the course modules.
          </p>
          <div className="mt-6">
            <Link to={coursePath(activeCourse, "/modules")}>
              <Button size="lg">Continue to Course Modules</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UnsavedNavigationGuard
        active={surveyInProgress}
        title="Leave this survey?"
        description="Your confidence ratings have not been submitted and will be lost."
      />
      <h1 className="text-2xl font-bold text-gray-900">
        Pre-Assessment Confidence Survey
      </h1>
      <p className="mt-1 text-gray-500">
        Rate your current confidence level for each of the following skills.
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
            onClick={() => navigate(coursePath(activeCourse, "/modules"))}
          >
            Skip to modules (admin) →
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
          <LikertScale
            key={statement.id}
            statement={statement}
            rating={ratings[statement.id] ?? null}
            onRate={(rating) =>
              setRatings((prev) => ({ ...prev, [statement.id]: rating }))
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
            Please rate all {confidenceStatements.length} statements to continue.
          </p>
        )}
      </div>
    </div>
  );
}
