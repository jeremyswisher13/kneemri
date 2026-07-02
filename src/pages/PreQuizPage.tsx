import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { coursePath, getPreQuizQuestions } from "@/content/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { submitQuiz, addWrongAnswerToReview } from "@/lib/firestore";
import { workstationReviewId } from "@/content/review-id";
import { domainLabel } from "@/lib/growth";

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

export default function PreQuizPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeCourse = useActiveCourse();
  const isAdminView = useIsAdminView();
  const preQuestions = getPreQuizQuestions(activeCourse);
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

  // Redirect if already completed
  useEffect(() => {
    if (!progressLoading && progress?.preQuizCompleted) {
      navigate(coursePath(activeCourse, "/pre-assessment"), { replace: true });
    }
  }, [progressLoading, progress?.preQuizCompleted, navigate, activeCourse]);

  if (!progressLoading && progress?.preQuizCompleted) {
    return null;
  }

  if (progressLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const currentQuestion = preQuestions[currentIndex];
  const isLast = currentIndex === preQuestions.length - 1;
  const hasAnswer = !!answers[currentQuestion?.id];
  const allAnswered = preQuestions.every((q) => !!answers[q.id]);

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }));

      const data = await submitQuiz(user.uid, user.email || "", "pre", answersArray, activeCourse.id, isAdminView);

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
    // Aggregate performance by blueprint domain. We deliberately do NOT reveal the
    // per-item correct answers or explanations on the pre-assessment: pre and post
    // are matched parallel forms, so showing the key here would coach fellows on the
    // exact concepts the post-quiz re-tests and inflate the measured gain. The full
    // item-by-item review lands at the post-assessment instead.
    const domainAgg = new Map<string, { correct: number; total: number }>();
    for (const q of preQuestions) {
      const r = results.results.find((x) => x.questionId === q.id);
      const cur = domainAgg.get(q.domain) ?? { correct: 0, total: 0 };
      cur.total += 1;
      if (r?.correct) cur.correct += 1;
      domainAgg.set(q.domain, cur);
    }
    const domainRows = Array.from(domainAgg.entries())
      .map(([domain, v]) => ({
        domain,
        label: domainLabel(domain),
        correct: v.correct,
        total: v.total,
        pct: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>

        {/* Score summary */}
        <div className="mt-6 rounded-xl bg-white p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-5xl font-bold text-ucla-blue">
            {results.score}
            <span className="text-2xl text-gray-500">
              /{results.totalQuestions}
            </span>
          </p>
          <p className="mt-2 text-gray-600">
            {results.totalQuestions > 0 ? Math.round((results.score / results.totalQuestions) * 100) : 0}% correct
          </p>
        </div>

        {/* Per-domain performance \u2014 aggregate only; the per-item answer key and
            explanations are intentionally withheld until the post-assessment. */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Where you stand by domain</h2>
          <p className="mt-1 text-sm text-gray-600">
            Your starting point across the {domainRows.length} knowledge domains this course covers \u2014
            a map of where to focus, not a score to worry about.
          </p>
          <div className="mt-4 space-y-3">
            {domainRows.map((row) => (
              <div key={row.domain}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-gray-800">{row.label}</span>
                  <span className="tabular-nums text-gray-500">
                    {row.correct}/{row.total}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-ucla-blue transition-all"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why the answer key is withheld on the pre-assessment */}
        <div className="mt-8 rounded-xl border border-ucla-blue/20 bg-ucla-blue/5 p-5">
          <p className="text-sm leading-6 text-gray-700">
            <span className="font-semibold text-gray-900">
              Answers are hidden for the pre-assessment on purpose.
            </span>{" "}
            This is your baseline before the course, so revealing the correct answers now would turn
            the test into a study guide and make your post-course gain look bigger than it really is.
            You'll get the correct answers and full explanations at the post-assessment.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link to={coursePath(activeCourse, "/pre-assessment/survey")}>
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
        Pre-Assessment Knowledge Quiz
      </h1>

      {isAdminView && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-ucla-gold/40 bg-ucla-gold/10 px-4 py-2.5">
          <span className="text-xs font-medium text-ucla-dark">
            Admin view — your answers are not recorded. You can skip ahead.
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(coursePath(activeCourse, "/pre-assessment/survey"))}
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
          onSelect={(key) =>
            setAnswers((prev) => ({ ...prev, [currentQuestion.id]: key }))
          }
          questionNumber={currentIndex + 1}
          totalQuestions={preQuestions.length}
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
