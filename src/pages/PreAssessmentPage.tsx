import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useProgress } from "@/hooks/useProgress";

export default function PreAssessmentPage() {
  const { progress, loading } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-700 font-medium">Error loading progress</p>
        <p className="text-sm text-red-500 mt-1">Unable to load progress data.</p>
      </div>
    );
  }

  const allComplete = progress.preQuizCompleted && progress.preSurveyCompleted;

  if (allComplete) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pre-Assessment</h1>
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
            Pre-Assessment Complete
          </h2>
          <p className="mt-2 text-green-700">
            You scored {progress.preQuizScore} on the knowledge quiz. You can
            now proceed to the course modules.
          </p>
          <div className="mt-6">
            <Link to="/modules">
              <Button variant="primary" size="lg">
                Continue to Modules
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Pre-Assessment</h1>
      <p className="mt-1 text-gray-500">
        Complete both the knowledge quiz and confidence survey before starting
        the course modules.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Knowledge Quiz Card */}
        <Card>
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                progress.preQuizCompleted
                  ? "bg-green-100"
                  : "bg-ucla-light"
              }`}
            >
              {progress.preQuizCompleted ? (
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-ucla-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Knowledge Quiz
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                14 questions on knee MRI interpretation concepts.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${
                    progress.preQuizCompleted ? "bg-green-500" : "bg-amber-400"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {progress.preQuizCompleted
                    ? `Complete (Score: ${progress.preQuizScore})`
                    : "Not started"}
                </span>
              </div>
              {!progress.preQuizCompleted && (
                <div className="mt-4">
                  <Link to="/pre-assessment/quiz">
                    <Button size="sm">Start Quiz</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Confidence Survey Card */}
        <Card>
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                progress.preSurveyCompleted
                  ? "bg-green-100"
                  : "bg-ucla-light"
              }`}
            >
              {progress.preSurveyCompleted ? (
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-ucla-blue"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Confidence Survey
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                7 statements to rate your current confidence level.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${
                    progress.preSurveyCompleted
                      ? "bg-green-500"
                      : "bg-amber-400"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {progress.preSurveyCompleted ? "Complete" : "Not started"}
                </span>
              </div>
              {!progress.preSurveyCompleted && (
                <div className="mt-4">
                  <Link to="/pre-assessment/survey">
                    <Button size="sm">Start Survey</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
