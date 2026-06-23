import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { coursePath, getPostQuizQuestions } from "@/content/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { submitQuiz, addWrongAnswerToReview } from "@/lib/firestore";
import { workstationReviewId } from "@/content/review-id";

interface QuizResult {
  questionId: string;
  correct: boolean;
  correctAnswer: string;
  explanation: string;
}

interface QuizResults {
  score: number;
  totalQuestions: number;
  results: QuizResult[];
}

export default function PostQuizPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeCourse = useActiveCourse();
  const isAdminView = useIsAdminView();
  const postQuestions = getPostQuizQuestions(activeCourse);
  const { progress, loading: progressLoading } = useProgress(activeCourse);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Warn before navigating away from an in-progress quiz
  useEffect(() => {
    const hasAnswers = Object.keys(answers).length > 0;
    if (!hasAnswers || results) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [answers, results]);

  // Redirect if not unlocked or already completed. Admins (and admin preview)
  // bypass the unlock gate so they can walk the quiz without prerequisites.
  // Fail SAFE: if progress couldn't load (null, not loading), redirect rather than
  // fall through to the live gated quiz for an unauthorized learner.
  const shouldRedirect = !progressLoading &&
    (!progress || ((!progress.postQuizUnlocked && !isAdminView) || progress.postQuizCompleted));
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

  const preScore = progress?.preQuizScore ?? null;
  const currentQuestion = postQuestions[currentIndex];
  const isLast = currentIndex === postQuestions.length - 1;
  const hasAnswer = !!answers[currentQuestion?.id];
  const allAnswered = postQuestions.every((q) => !!answers[q.id]);

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));

      const data = await submitQuiz(user.uid, user.email || "", "post", answersArray, activeCourse.id, isAdminView);

      // Feed missed questions into the spaced-review queue. Namespaced key MUST
      // match the registry exactly (stage 1: workstationReviewId(courseId,
      // "prepost-"+id)). allSettled so a Firestore hiccup can't block results.
      if (activeCourse.features.reviewCards && !isAdminView) {
        const wrong = data.results.filter((r) => !r.correct);
        await Promise.allSettled(
          wrong.map((r) =>
            addWrongAnswerToReview(
              user.uid,
              workstationReviewId(activeCourse.id, `prepost-${r.questionId}`),
              "assessment",
              activeCourse.id,
            ),
          ),
        );
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  // Results view
  if (results) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Post-Quiz Results
        </h1>

        {/* Score summary with comparison */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Pre-Assessment Score
            </p>
            <p className="mt-2 text-4xl font-bold text-gray-500">
              {preScore != null ? `${preScore}/${progress?.preQuizTotal ?? results.totalQuestions}` : "N/A"}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-ucla-blue text-center">
            <p className="text-sm font-medium text-ucla-blue uppercase tracking-wider">
              Post-Assessment Score
            </p>
            <p className="mt-2 text-4xl font-bold text-ucla-blue">
              {results.score}/{results.totalQuestions}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {results.totalQuestions > 0 ? Math.round((results.score / results.totalQuestions) * 100) : 0}%
              correct
            </p>
          </div>
        </div>

        {preScore != null && (
          <div className="mt-4 text-center">
            <p className="text-sm font-medium text-gray-700">
              {results.score > preScore
                ? `You improved by ${results.score - preScore} point(s)!`
                : results.score === preScore
                  ? "Your score remained the same."
                  : `Your score decreased by ${preScore - results.score} point(s).`}
            </p>
          </div>
        )}

        {/* Individual results */}
        <div className="mt-8 space-y-4">
          {postQuestions.map((question, idx) => {
            const result = results.results.find(
              (r) => r.questionId === question.id
            );
            const userAnswer = answers[question.id];
            const isCorrect = result?.correct;

            return (
              <div
                key={question.id}
                className={`rounded-xl border-2 p-6 ${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {isCorrect ? "\u2713" : "\u2717"}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {idx + 1}. {question.stem}
                    </p>

                    <div className="mt-3 space-y-1.5">
                      {question.options.map((opt) => {
                        const isUserAnswer = userAnswer === opt.key;
                        const isCorrectAnswer =
                          result?.correctAnswer === opt.key;

                        let optStyle = "text-gray-600";
                        if (isCorrectAnswer)
                          optStyle =
                            "text-green-800 font-medium bg-green-100 rounded px-2 py-0.5";
                        else if (isUserAnswer && !isCorrect)
                          optStyle =
                            "text-red-800 line-through bg-red-100 rounded px-2 py-0.5";

                        return (
                          <p key={opt.key} className={`text-sm ${optStyle}`}>
                            <span className="font-semibold">{opt.key}.</span>{" "}
                            {opt.text}
                            {isCorrectAnswer && " \u2190 Correct"}
                            {isUserAnswer && !isCorrect && " \u2190 Your answer"}
                          </p>
                        );
                      })}
                    </div>

                    <p className="mt-3 text-sm text-gray-700 bg-white/60 rounded-lg p-3 border border-gray-200">
                      <span className="font-semibold">Explanation:</span>{" "}
                      {result?.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to={coursePath(activeCourse, "/post-assessment/survey")}>
            <Button size="lg">Continue to Confidence Survey</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Quiz view
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Post-Assessment Knowledge Quiz
      </h1>

      {isAdminView && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-ucla-gold/40 bg-ucla-gold/10 px-4 py-2.5">
          <span className="text-xs font-medium text-ucla-dark">
            Admin view — your answers are not recorded. You can skip ahead.
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(coursePath(activeCourse, "/post-assessment/survey"))}
          >
            Skip quiz (admin) →
          </Button>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="pb-24 lg:pb-0">
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id] ?? null}
          onSelect={(key: string) =>
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: key }))
          }
          questionNumber={currentIndex + 1}
          totalQuestions={postQuestions.length}
        />
      </div>

      <div className="sticky bottom-0 z-20 -mx-4 mt-6 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pr-20 shadow-[0_-1px_3px_rgba(0,0,0,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:static lg:z-auto lg:mx-0 lg:gap-0 lg:border-0 lg:bg-transparent lg:px-0 lg:pr-0 lg:pt-0 lg:pb-0 lg:shadow-none lg:backdrop-blur-none">
        <Button
          variant="secondary"
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
          className="h-11 lg:h-auto"
        >
          Previous
        </Button>

        {isLast ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="h-11 flex-1 lg:h-auto lg:flex-none"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={!hasAnswer}
            className="h-11 flex-1 lg:h-auto lg:flex-none"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
