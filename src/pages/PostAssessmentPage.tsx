import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import YourGrowthReport from "@/components/YourGrowthReport";
import PostQuizReview from "@/components/PostQuizReview";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { isCourseComplete } from "@/lib/completion";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { coursePath, getPostQuizQuestions, normalMriTitle } from "@/content/courses";

function Confetti() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const colors = ["#FFD100", "#2774AE", "#005587", "#4CAF50", "#FF6B6B"];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      piece.style.cssText = `
        position: absolute;
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: 0;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        animation: confetti-fall ${2 + Math.random() * 3}s ease-out ${Math.random() * 1.5}s forwards;
      `;
      container.appendChild(piece);
    }
    const timeout = setTimeout(() => {
      if (container) container.style.display = "none";
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    />
  );
}

export default function PostAssessmentPage() {
  const { user } = useAuth();
  const activeCourse = useActiveCourse();
  const isAdminView = useIsAdminView();
  const { progress, loading } = useProgress(activeCourse);

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

  const normalTitle = normalMriTitle(activeCourse);

  // Locked state — admins (and admin preview) bypass the unlock gate so they
  // can review the post-assessment flow without completing all modules + cases.
  if (!progress.postQuizUnlocked && !isAdminView) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post-Assessment</h1>
        <div className="mt-8 rounded-xl bg-gray-50 border border-gray-200 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-8 w-8 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Post-Assessment Locked
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            {activeCourse.bodyRegion === "knee"
              ? `Finish all modules and the Interactive ${normalTitle} to unlock the post-assessment. (Cases are optional.)`
              : (progress.totalNormalPlanes ?? 0) > 0
                ? `Complete all modules, all cases, and the Interactive ${normalTitle} to unlock the post-assessment.`
                : "Complete all modules and cases to unlock the post-assessment."}
          </p>
          <div className="mt-6">
            <Link to={coursePath(activeCourse, "/")}>
              <Button variant="secondary">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allComplete =
    progress.postQuizCompleted && progress.postSurveyCompleted;

  const courseComplete = isCourseComplete(progress, activeCourse);

  const fellowName = user?.displayName || user?.email || "Fellow";

  // Comparison view when both post assessments are complete
  if (allComplete) {
    return (
      <div>
        {courseComplete && <Confetti />}

        <h1 className="text-2xl font-bold text-gray-900">Post-Assessment</h1>

        {courseComplete ? (
          <div className="mt-8 overflow-hidden rounded-xl border-2 border-ucla-gold bg-gradient-to-r from-ucla-dark to-ucla-blue p-8 text-center text-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ucla-gold/20 ring-2 ring-ucla-gold">
              <svg className="h-8 w-8 text-ucla-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3h14c.6 0 1 .4 1 1v2c0 2.8-2 5.1-4.6 5.8-.4 1.4-1.5 2.5-2.9 2.9V17h3a1 1 0 110 2H8a1 1 0 110-2h3v-2.3c-1.4-.4-2.5-1.5-2.9-2.9C5.5 11.1 4 8.8 4 6V4c0-.6.4-1 1-1zm1 2v1c0 1.9 1.2 3.5 2.8 4.2.5-.3 1-.4 1.6-.4h1.2c.6 0 1.1.1 1.6.4C14.8 9.5 16 7.9 16 6V5H6z" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold">
              Congratulations, {fellowName}!
            </h2>
            <p className="mt-2 text-white/80">
              You have completed the entire {activeCourse.title}.
            </p>
            <Link
              to={coursePath(activeCourse, "/certificate")}
              className="mt-4 inline-block rounded-lg bg-ucla-gold px-6 py-2 text-sm font-semibold text-ucla-dark shadow transition-colors hover:bg-yellow-300"
            >
              View Your Certificate
            </Link>
          </div>
        ) : (
          <div className="mt-8 rounded-xl bg-green-50 border border-green-200 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-green-800">
              Post-Assessment Complete
            </h2>
          </div>
        )}

        {/* Your Growth: domain-level knowledge gain + confidence calibration */}
        <div className="mt-8">
          <YourGrowthReport progress={progress} course={activeCourse} />
        </div>

        {/* Per-item review of the post quiz (your answer vs correct + explanation) */}
        <div className="mt-6">
          <PostQuizReview progress={progress} course={activeCourse} />
        </div>

        <div className="mt-8 text-center">
          <Link to={coursePath(activeCourse, "/")}>
            <Button size="lg">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Cards view when unlocked but not all complete
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Post-Assessment</h1>
      <p className="mt-1 text-gray-500">
        Complete the post-assessment to measure your progress after the course.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* Knowledge Quiz Card */}
        <Card>
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                progress.postQuizCompleted ? "bg-green-100" : "bg-ucla-light"
              }`}
            >
              {progress.postQuizCompleted ? (
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
                {getPostQuizQuestions(activeCourse).length} questions on {activeCourse.bodyRegion} MRI interpretation concepts.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${
                    progress.postQuizCompleted ? "bg-green-500" : "bg-amber-400"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {progress.postQuizCompleted
                    ? `Complete (Score: ${progress.postQuizScore})`
                    : "Not started"}
                </span>
              </div>
              {!progress.postQuizCompleted && (
                <div className="mt-4">
                  <Link to={coursePath(activeCourse, "/post-assessment/quiz")}>
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
                progress.postSurveyCompleted ? "bg-green-100" : "bg-ucla-light"
              }`}
            >
              {progress.postSurveyCompleted ? (
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
                {activeCourse.confidenceStatements.length} statements to rate your confidence level after the course.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex h-2.5 w-2.5 rounded-full ${
                    progress.postSurveyCompleted
                      ? "bg-green-500"
                      : "bg-amber-400"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {progress.postSurveyCompleted ? "Complete" : "Not started"}
                </span>
              </div>
              {!progress.postSurveyCompleted && (
                <div className="mt-4">
                  <Link to={coursePath(activeCourse, "/post-assessment/survey")}>
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
