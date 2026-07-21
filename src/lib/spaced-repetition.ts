/**
 * SM-2 (SuperMemo 2) Spaced Repetition Algorithm
 *
 * Quality ratings:
 *   0 — complete blackout
 *   1 — incorrect, but upon seeing the answer, remembered
 *   2 — incorrect, but the answer seemed easy to recall
 *   3 — correct, but with serious difficulty
 *   4 — correct, after some hesitation
 *   5 — perfect response
 */

export interface ReviewCard {
  questionId: string;
  moduleId: string;
  /**
   * Owning course ID (e.g. "knee-mri" | "shoulder-mri"). Optional for backward
   * compatibility: cards written before multi-course review have no courseId
   * and are attributed to the default (knee) course when filtering.
   */
  courseId?: string;
  easeFactor: number;   // >= 1.3, default 2.5
  interval: number;     // days until next review
  repetitions: number;  // consecutive correct responses
  nextReviewDate: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Cards to surface in a single day's review session. A learner returning after a
 * gap can have dozens of cards due at once; showing all of them is the classic
 * "review debt" wall that makes people quit. Cap the session and carry the rest
 * to the next day (the badge/count still shows the true backlog).
 */
export const DAILY_REVIEW_CAP = 20;

/**
 * Order due cards hardest-first so a capped session spends the day's attention
 * where it matters: most overdue (oldest nextReviewDate) first, then lowest ease
 * (most difficult). Ties broken deterministically by questionId so the session
 * is stable across reloads.
 */
export function orderDueCards(cards: ReviewCard[]): ReviewCard[] {
  return [...cards].sort((a, b) => {
    if (a.nextReviewDate !== b.nextReviewDate) return a.nextReviewDate < b.nextReviewDate ? -1 : 1;
    if (a.easeFactor !== b.easeFactor) return a.easeFactor - b.easeFactor;
    return a.questionId < b.questionId ? -1 : a.questionId > b.questionId ? 1 : 0;
  });
}

/**
 * Calculate the next review schedule for a card using the SM-2 algorithm.
 *
 * @param card  The current review card state
 * @param quality  The quality of the response (0-5)
 * @returns A new ReviewCard with updated scheduling fields
 */
export function calculateNextReview(card: ReviewCard, quality: number): ReviewCard {
  // Clamp quality to 0-5
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let { easeFactor, interval, repetitions } = card;

  if (q < 3) {
    // Incorrect or very poor response — reset repetitions
    repetitions = 0;
    interval = 1;
  } else {
    // Correct response — advance through the SM-2 intervals
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next review date
  const now = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + interval);
  const nextReviewDate = next.toISOString().split("T")[0];

  return {
    ...card,
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReviewDate,
  };
}

/**
 * Create a brand-new review card for a question the fellow got wrong.
 * The card is due immediately (today).
 */
export function createNewCard(
  questionId: string,
  moduleId: string,
  courseId?: string,
): ReviewCard {
  const today = new Date().toISOString().split("T")[0];
  return {
    questionId,
    moduleId,
    ...(courseId ? { courseId } : {}),
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: today,
  };
}

/**
 * Map a simple correct/incorrect boolean to the SM-2 quality scale.
 * wrong = 1 (incorrect but recognized answer), right = 4 (correct after hesitation)
 * Using moderate values to avoid extreme ease factor swings.
 */
export function mapAnswerToQuality(correct: boolean): number {
  return correct ? 4 : 1;
}
