import { useState, useCallback } from "react";

interface FlashcardData {
  id: string;
  question: string;
  answer: string;
}

interface FlashcardSetProps {
  cards: FlashcardData[];
  topicName: string;
  /** Fired (fire-and-forget) with the card id when the user taps "Need to review". */
  onNeedsReview?: (cardId: string) => void;
}

// Module-level shuffle so it never runs inside render/useMemo (react-hooks/purity).
// Called from a useState lazy initializer — see the SHUFFLE PATTERN note.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardSet({ cards, topicName, onNeedsReview }: FlashcardSetProps) {
  // Shuffle once per session (lazy initializer). "Try Again" / "Retry flagged"
  // swap in new decks; the original card ids stay stable for review tracking.
  const [deck, setDeck] = useState<FlashcardData[]>(() => shuffle(cards));
  const [currentCard, setCurrentCard] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<("correct" | "review" | null)[]>(
    () => Array(deck.length).fill(null)
  );
  const [complete, setComplete] = useState(false);

  const correctCount = results.filter((r) => r === "correct").length;
  const flaggedCards = deck.filter((_, i) => results[i] === "review");

  const handleResponse = useCallback(
    (response: "correct" | "review") => {
      // Ignore repeat clicks on an already-answered card. Both buttons stay
      // mounted during the 300ms advance delay; without this guard a quick
      // double-click double-increments currentCard, silently skipping a card
      // (it never displays, its result stays null, and the count is wrong).
      if (results[currentCard] !== null) return;

      if (response === "review") onNeedsReview?.(deck[currentCard].id);

      setResults((prev) => {
        const updated = [...prev];
        updated[currentCard] = response;
        return updated;
      });

      if (currentCard < deck.length - 1) {
        setTimeout(() => {
          setCurrentCard((c) => c + 1);
          setRevealed(false);
        }, 300);
      } else {
        setTimeout(() => {
          setComplete(true);
        }, 300);
      }
    },
    [currentCard, deck, results, onNeedsReview]
  );

  // Restart with a given set of cards (all, or just the flagged ones).
  const restartWith = useCallback((next: FlashcardData[]) => {
    setDeck(next);
    setCurrentCard(0);
    setRevealed(false);
    setResults(Array(next.length).fill(null));
    setComplete(false);
  }, []);

  const handleRestart = useCallback(() => {
    restartWith(shuffle(cards));
  }, [restartWith, cards]);

  const handleRetryFlagged = useCallback(() => {
    if (flaggedCards.length === 0) return;
    restartWith(shuffle(flaggedCards));
  }, [restartWith, flaggedCards]);

  if (cards.length === 0) return null;
  if (currentCard >= deck.length) return null;

  const summaryMessage =
    correctCount === deck.length
      ? "Perfect recall!"
      : correctCount >= deck.length * 0.7
        ? "Great job! Consider re-reading any tricky sections above."
        : "Keep studying — review the section above and try again.";

  return (
    <details className="mt-4 group">
      <summary className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-indigo-300 bg-indigo-50 px-5 py-3.5 text-base font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400 transition-all shadow-sm">
        <svg
          className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
        🧠 Quick Review: {topicName} — {cards.length}{" "}
        {cards.length === 1 ? "card" : "cards"}
      </summary>

      <div className="mt-3 rounded-xl border border-indigo-200 bg-white p-5 shadow-sm">
        {!complete ? (
          /* ---- Active card ---- */
          <div>
            {/* Card counter */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-600">
                Card {currentCard + 1} of {deck.length}
              </span>
              {/* Progress dots */}
              <div className="flex gap-1.5">
                {deck.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i === currentCard
                        ? "bg-indigo-500"
                        : results[i] === "correct"
                          ? "bg-emerald-400"
                          : results[i] === "review"
                            ? "bg-amber-400"
                            : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question */}
            <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-4 py-4">
              <p className="text-sm font-semibold text-indigo-900">
                {deck[currentCard].question}
              </p>
            </div>

            {/* Answer area with CSS transition */}
            <div
              className={`mt-3 transition-all duration-300 ease-in-out ${
                revealed
                  ? "max-h-96 overflow-y-auto opacity-100"
                  : "max-h-0 overflow-hidden opacity-0"
              }`}
            >
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-4">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {deck[currentCard].answer}
                </p>
              </div>

              {/* Response buttons */}
              <div className="mt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleResponse("correct")}
                  disabled={results[currentCard] !== null}
                  className="flex-1 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-default"
                >
                  ✓ Got it
                </button>
                <button
                  type="button"
                  onClick={() => handleResponse("review")}
                  disabled={results[currentCard] !== null}
                  className="flex-1 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-default"
                >
                  ↻ Need to review
                </button>
              </div>
            </div>

            {/* Reveal button */}
            {!revealed && (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Reveal Answer
              </button>
            )}
          </div>
        ) : (
          /* ---- Summary ---- */
          <div className="text-center py-2">
            <p className="text-2xl font-bold text-indigo-700">
              {correctCount}/{deck.length}
            </p>
            <p className="mt-1 text-sm text-gray-600">{summaryMessage}</p>

            {/* Per-card results */}
            <div className="mt-4 flex justify-center gap-2">
              {results.map((r, i) => (
                <span
                  key={i}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    r === "correct"
                      ? "bg-emerald-100 text-emerald-700"
                      : r === "review"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-6 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                Try Again
              </button>
              {flaggedCards.length > 0 && (
                <button
                  type="button"
                  onClick={handleRetryFlagged}
                  className="rounded-lg border border-amber-300 bg-amber-50 px-6 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  Retry flagged ({flaggedCards.length})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
