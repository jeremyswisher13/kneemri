import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import LikertScale from "@/components/survey/LikertScale";
import { confidenceStatements } from "@/content/quizzes/confidence-survey";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { submitSurvey } from "@/lib/firestore";

export default function PreSurveyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already completed
  if (!progressLoading && progress?.preSurveyCompleted) {
    navigate("/pre-assessment", { replace: true });
    return null;
  }

  if (progressLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const allRated = confidenceStatements.every((s) => ratings[s.id] != null);

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const responses = Object.entries(ratings).map(([statementId, rating]) => ({
        statementId,
        rating,
      }));

      await submitSurvey(user.uid, user.email || "", "pre", responses);
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
            <Link to="/modules">
              <Button size="lg">Continue to Course Modules</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Pre-Assessment Confidence Survey
      </h1>
      <p className="mt-1 text-gray-500">
        Rate your current confidence level for each of the following skills.
        There are no right or wrong answers.
      </p>

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
