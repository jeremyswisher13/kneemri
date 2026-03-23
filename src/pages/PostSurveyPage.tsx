import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import LikertScale from "@/components/survey/LikertScale";
import { confidenceStatements } from "@/content/quizzes/confidence-survey";
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
  const { progress, loading: progressLoading } = useProgress();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not unlocked or already completed
  if (!progressLoading && progress) {
    if (!progress.postQuizUnlocked || progress.postSurveyCompleted) {
      navigate("/post-assessment", { replace: true });
      return null;
    }
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

      await submitSurvey(user.uid, user.email || "", "post", responses);
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

        {/* Pre vs Post Confidence Comparison */}
        {hasPreData && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Confidence: Pre vs Post
            </h2>
            <div className="space-y-3">
              {confidenceStatements.map((s, idx) => {
                const pre = preRatings[s.id];
                const post = ratings[s.id];
                const diff = pre != null && post != null ? post - pre : null;

                return (
                  <div
                    key={s.id}
                    className="rounded-xl bg-white p-4 shadow-sm border border-gray-100"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {idx + 1}. {s.statement}
                    </p>
                    <div className="mt-2 flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Pre:</span>
                        <span className="text-sm font-semibold text-gray-400">
                          {pre ?? "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ucla-blue">Post:</span>
                        <span className="text-sm font-semibold text-ucla-blue">
                          {post ?? "N/A"}
                        </span>
                      </div>
                      {diff != null && (
                        <span
                          className={`text-xs font-semibold ${
                            diff > 0
                              ? "text-green-600"
                              : diff < 0
                                ? "text-red-600"
                                : "text-gray-500"
                          }`}
                        >
                          {diff > 0 ? `+${diff}` : diff === 0 ? "No change" : diff}
                        </span>
                      )}
                    </div>
                    {/* Visual bar comparison */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-[10px] text-gray-400">
                          Pre
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-gray-300 transition-all"
                            style={{
                              width: pre != null ? `${(pre / 5) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-[10px] text-ucla-blue">
                          Post
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-ucla-blue transition-all"
                            style={{
                              width:
                                post != null ? `${(post / 5) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/dashboard">
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
        Rate your confidence level for each skill after completing the course.
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
            onRate={(rating: number) =>
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
