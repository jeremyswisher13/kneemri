import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AnnotatedSlice from "@/components/normal/AnnotatedSlice";
import { useAuth } from "@/contexts/AuthContext";
import { getDueCards, saveReviewCard } from "@/lib/firestore";
import { calculateNextReview, mapAnswerToQuality, DAILY_REVIEW_CAP, type ReviewCard } from "@/lib/spaced-repetition";
import { reviewQuestionById } from "@/content/review-registry";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { coursePath, getCourseById } from "@/content/courses";

// SM-2 self-rating after the answer is revealed (the whole point of SM-2 is a
// graded recall difficulty, not a binary right/wrong).
const RATINGS: { label: string; quality: number; hint: string; cls: string }[] = [
  { label: "Again", quality: 1, hint: "Couldn't recall", cls: "border-red-300 text-red-700 hover:bg-red-50" },
  { label: "Hard", quality: 3, hint: "Recalled with effort", cls: "border-amber-300 text-amber-700 hover:bg-amber-50" },
  { label: "Good", quality: 4, hint: "Recalled it", cls: "border-green-300 text-green-700 hover:bg-green-50" },
  { label: "Easy", quality: 5, hint: "Instant", cls: "border-ucla-blue/40 text-ucla-blue hover:bg-ucla-light" },
];

function intervalLabel(days: number): string {
  if (days <= 1) return "1d";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

export default function ReviewPage() {
  const { user } = useAuth();
  const activeCourse = useActiveCourse();
  const workstationPath = coursePath(activeCourse, `/normal-${activeCourse.bodyRegion}-mri`);

  const [dueCards, setDueCards] = useState<ReviewCard[]>([]);
  const [totalDue, setTotalDue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [nextReviewDate, setNextReviewDate] = useState<string | null>(null);
  const [reviewedCards, setReviewedCards] = useState<ReviewCard[]>([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setSessionComplete(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setReviewedCards([]);
    setNextReviewDate(null);
    setLoadError(null);
    setSaveError(null);
    getDueCards(user.uid, activeCourse)
      .then((cards) => {
        if (cancelled) return;
        // Drop cards whose question no longer exists in any bank.
        const valid = cards.filter((c) => reviewQuestionById[c.questionId]);
        // Cap the day's session so a returning learner isn't buried by a backlog;
        // getDueCards already ordered hardest-first, so the cap keeps the most
        // important cards. The remainder carries to the next day.
        setTotalDue(valid.length);
        const session = valid.slice(0, DAILY_REVIEW_CAP);
        setDueCards(session);
        if (session.length === 0) setSessionComplete(true);
      })
      .catch(() => {
        if (cancelled) return;
        setDueCards([]);
        setSessionComplete(true);
        setLoadError("Review cards could not be loaded. Check your connection and try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, activeCourse]);

  const currentCard = dueCards[currentIndex] ?? null;
  const currentQuestion = currentCard ? reviewQuestionById[currentCard.questionId] : null;
  const isFlashcard = !!currentQuestion?.flashcard;
  const isCorrect = currentQuestion ? selectedAnswer === currentQuestion.correctAnswer : false;

  // Preview the next interval for each rating. calculateNextReview is pure in
  // (card, quality), so memoize per card instead of recomputing up to 6× on
  // every render (two-button branch = 2, RATINGS branch = 4).
  const intervalByQuality = useMemo(() => {
    const out: Record<number, number> = {};
    if (currentCard) {
      for (let q = 0; q <= 5; q++) out[q] = calculateNextReview(currentCard, q).interval;
    }
    return out;
  }, [currentCard]);

  function finishOrAdvance(reviewed: ReviewCard[]) {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= dueCards.length) {
      if (reviewed.length > 0) {
        const earliest = reviewed.reduce(
          (min, c) => (c.nextReviewDate < min ? c.nextReviewDate : min),
          reviewed[0].nextReviewDate,
        );
        const [y, m, d] = earliest.split("-").map(Number);
        setNextReviewDate(
          new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        );
      }
      setSessionComplete(true);
    } else {
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }

  // Rate recall difficulty (after the answer is revealed) → schedule via SM-2.
  async function rate(quality: number) {
    if (saving || !user || !currentCard) return;
    const updated = calculateNextReview(currentCard, quality);
    setSaving(true);
    setSaveError(null);
    try {
      await saveReviewCard(user.uid, updated);
      // Tell the layout's due-badge to refresh — an in-app nav back to the
      // dashboard fires no window focus event.
      window.dispatchEvent(new CustomEvent("reviewcards:changed"));
      const reviewed = [...reviewedCards, updated];
      setReviewedCards(reviewed);
      finishOrAdvance(reviewed);
    } catch {
      setSaveError("Failed to save — check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-ucla-blue" />
      </div>
    );
  }

  if (dueCards.length === 0 && sessionComplete) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Spaced Review</h1>
        <Card className="text-center">
          <div className="py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {loadError ? "Review is temporarily unavailable" : "No review cards yet"}
            </h3>
            {loadError ? (
              <p role="alert" className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                {loadError}
              </p>
            ) : (
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                Anything you miss — on a module quiz, Normal MRI practice or mastery, or an Advanced
                question — lands here and comes back on a spaced schedule so it sticks.
              </p>
            )}
            <div className="mt-6 flex justify-center gap-2">
              <Link to={coursePath(activeCourse, "/modules")}>
                <Button variant="secondary" size="sm">Go to Modules</Button>
              </Link>
              <Link to={workstationPath}>
                <Button variant="secondary" size="sm">Open the workstation</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Spaced Review</h1>
        <Card className="text-center">
          <div className="py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {totalDue > reviewedCards.length ? "Today's session is done" : "All caught up!"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              You reviewed {reviewedCards.length} {reviewedCards.length === 1 ? "card" : "cards"}.{" "}
              {totalDue > reviewedCards.length
                ? `${totalDue - reviewedCards.length} more ${totalDue - reviewedCards.length === 1 ? "card is" : "cards are"} still due — capped at ${DAILY_REVIEW_CAP} a day so it stays manageable. Come back tomorrow to keep going.`
                : "Nice work keeping the queue clear."}
            </p>
            {nextReviewDate && totalDue <= reviewedCards.length && (
              <p className="mt-3 text-sm text-gray-500">
                Next review around <span className="font-medium text-gray-600">{nextReviewDate}</span>
              </p>
            )}
            <Link to={coursePath(activeCourse, "/")} className="mt-6 inline-block">
              <Button variant="secondary" size="sm">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const reviewedCount = currentIndex + (showFeedback ? 1 : 0);

  // "Review this topic →" remediation link — shown on any answered card whose
  // registry entry carries a source module. Deep-links to the module page, with
  // ?topic=N when the topic is known (ModulePage expands + scrolls to it).
  const remediationLink =
    showFeedback && currentQuestion.moduleId
      ? (() => {
          const course = getCourseById(currentQuestion.courseId);
          const topicQuery =
            currentQuestion.topicIndex != null ? `?topic=${currentQuestion.topicIndex}` : "";
          return (
            <Link
              to={coursePath(course, `/modules/${currentQuestion.moduleId}${topicQuery}`)}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ucla-blue hover:underline"
            >
              Review this topic
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          );
        })()
      : null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Spaced Review</h1>
        <span className="rounded-full bg-ucla-light px-3 py-1 text-sm font-medium text-ucla-blue">
          {reviewedCount} of {dueCards.length} reviewed
          {totalDue > dueCards.length && (
            <span className="ml-1 font-normal text-ucla-blue/70">· {totalDue} due total</span>
          )}
        </span>
      </div>

      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-ucla-blue transition-all duration-300"
          style={{ width: `${(reviewedCount / dueCards.length) * 100}%` }}
        />
      </div>

      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          {currentQuestion.source}
        </p>

        {currentQuestion.image && (
          <div className="mb-5">
            <AnnotatedSlice
              dir={currentQuestion.image.dir}
              sliceIndex={currentQuestion.image.sliceIndex}
              markers={[{ x: currentQuestion.image.x, y: currentQuestion.image.y }]}
              pulse
            />
          </div>
        )}

        <p className="mb-5 text-base font-medium leading-relaxed text-gray-900">{currentQuestion.stem}</p>

        {isFlashcard ? (
          /* ── Flashcard recall: front → reveal → back → self-grade ───────── */
          <>
            {/* Back of the card (revealed) */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                showFeedback ? "max-h-[32rem] overflow-y-auto opacity-100" : "max-h-0 overflow-hidden opacity-0"
              }`}
            >
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-4">
                <p className="text-sm leading-relaxed text-gray-800">{currentQuestion.flashcard!.back}</p>
              </div>
            </div>

            {saveError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{saveError}</div>
            )}

            {remediationLink}

            {!showFeedback ? (
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowFeedback(true)}>Reveal</Button>
              </div>
            ) : (
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium text-gray-500">How did you do? (sets when it comes back)</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => rate(mapAnswerToQuality(true))}
                    disabled={saving}
                    className="rounded-lg border-2 border-green-300 bg-white px-3 py-2 text-center text-green-700 transition-colors hover:bg-green-50 disabled:opacity-50"
                  >
                    <span className="block text-sm font-semibold">Got it</span>
                    <span className="block text-[11px] text-gray-500">
                      {intervalLabel(currentCard ? intervalByQuality[mapAnswerToQuality(true)] ?? 0 : 0)}
                    </span>
                  </button>
                  <button
                    onClick={() => rate(mapAnswerToQuality(false))}
                    disabled={saving}
                    className="rounded-lg border-2 border-red-300 bg-white px-3 py-2 text-center text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    <span className="block text-sm font-semibold">Needed review</span>
                    <span className="block text-[11px] text-gray-500">
                      {intervalLabel(currentCard ? intervalByQuality[mapAnswerToQuality(false)] ?? 0 : 0)}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
        <>
        {/* Options */}
        <div role="radiogroup" aria-label={currentQuestion.stem} className="space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.key;
            const isCorrectOption = option.key === currentQuestion.correctAnswer;
            let borderClass = "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50";
            if (showFeedback) {
              if (isCorrectOption) borderClass = "border-green-400 bg-green-50";
              else if (isSelected) borderClass = "border-red-400 bg-red-50";
              else borderClass = "border-gray-200 bg-white opacity-60";
            } else if (isSelected) {
              borderClass = "border-ucla-blue bg-ucla-light text-ucla-dark";
            }
            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => { if (!showFeedback) setSelectedAnswer(option.key); }}
                disabled={showFeedback}
                className={`w-full rounded-lg border-2 p-4 text-left transition-colors ${borderClass}`}
              >
                <span
                  aria-hidden="true"
                  className={`mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                    showFeedback && isCorrectOption
                      ? "bg-green-500 text-white"
                      : showFeedback && isSelected && !isCorrectOption
                        ? "bg-red-500 text-white"
                        : isSelected
                          ? "bg-ucla-blue text-white"
                          : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {showFeedback && isCorrectOption ? "✓" : showFeedback && isSelected && !isCorrectOption ? "✗" : option.key}
                </span>
                <span className="text-sm">{option.text}</span>
                {showFeedback && isCorrectOption && <span className="sr-only"> (correct answer)</span>}
                {showFeedback && isSelected && !isCorrectOption && <span className="sr-only"> (your answer, incorrect)</span>}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div role="status" aria-live="polite" className={`mt-6 rounded-lg border p-4 ${isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <p className={`flex items-center gap-2 text-sm font-semibold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
              <span aria-hidden="true" className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                {isCorrect ? "✓" : "✗"}
              </span>
              {isCorrect ? "Correct" : "Incorrect"}
            </p>
            <p className="mt-2 text-sm text-gray-700">{currentQuestion.explanation}</p>
          </div>
        )}

        {remediationLink}

        {saveError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{saveError}</div>
        )}

        {/* Action: reveal, then self-rate recall difficulty */}
        {!showFeedback ? (
          <div className="mt-6 flex justify-end">
            <Button onClick={() => selectedAnswer !== null && setShowFeedback(true)} disabled={selectedAnswer === null}>
              Show Answer
            </Button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="mb-2 text-xs font-medium text-gray-500">How well did you recall it? (sets when it comes back)</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {RATINGS.map((r) => {
                const days = currentCard ? intervalByQuality[r.quality] ?? 0 : 0;
                return (
                  <button
                    key={r.label}
                    onClick={() => rate(r.quality)}
                    disabled={saving}
                    className={`rounded-lg border-2 bg-white px-3 py-2 text-center transition-colors disabled:opacity-50 ${r.cls}`}
                  >
                    <span className="block text-sm font-semibold">{r.label}</span>
                    <span className="block text-[11px] text-gray-500">
                      {r.hint} · {intervalLabel(days)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        </>
        )}
      </Card>
    </div>
  );
}
