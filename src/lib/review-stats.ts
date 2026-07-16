/**
 * Learner-facing summary of the spaced-review (SM-2) queue for a dashboard
 * widget: how many cards are due, when the next session is, how big the
 * rotation is, and how much has matured into long-term retention. Pure +
 * unit-tested; `today` is injected so the date math is deterministic.
 */

export interface ReviewCardLite {
  nextReviewDate: string; // YYYY-MM-DD
  interval: number; // days
  repetitions: number;
}

export interface ReviewSummary {
  total: number;
  dueNow: number;
  dueNext7: number;
  nextDate: string | null;
  buckets: { learning: number; strengthening: number; retained: number };
}

/**
 * UTC calendar day — NOT the local one. The rest of the spaced-repetition
 * pipeline stores and compares `nextReviewDate` on a UTC basis
 * (calculateNextReview -> next.toISOString(), getDueCards -> new Date().toISOString()),
 * so this summary must use the same basis. Using the local day made the dashboard
 * ReviewSummaryCard disagree with the nav due-badge and the Review page for any
 * negative-offset user (e.g. Pacific) once the UTC day had rolled over in the
 * evening — the dashboard said "all caught up" while the badge showed cards due.
 */
function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function summarizeReview(cards: ReviewCardLite[], today: Date = new Date()): ReviewSummary {
  const todayIso = isoDate(today);
  const horizon = new Date(today);
  horizon.setUTCDate(horizon.getUTCDate() + 7);
  const horizonIso = isoDate(horizon);

  let dueNow = 0;
  let dueNext7 = 0;
  let nextDate: string | null = null;
  const buckets = { learning: 0, strengthening: 0, retained: 0 };

  for (const c of cards) {
    // YYYY-MM-DD strings compare lexically as dates.
    if (c.nextReviewDate <= todayIso) {
      dueNow++;
    } else {
      if (c.nextReviewDate <= horizonIso) dueNext7++;
      if (nextDate === null || c.nextReviewDate < nextDate) nextDate = c.nextReviewDate;
    }
    if (c.interval >= 30) buckets.retained++;
    else if (c.interval >= 7) buckets.strengthening++;
    else buckets.learning++;
  }

  return { total: cards.length, dueNow, dueNext7, nextDate, buckets };
}
