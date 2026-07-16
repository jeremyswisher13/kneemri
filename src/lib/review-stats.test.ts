import { describe, it, expect } from "vitest";
import { summarizeReview, type ReviewCardLite } from "@/lib/review-stats";

// Explicit UTC instant: summarizeReview compares on the UTC calendar day (to
// match calculateNextReview/getDueCards), so a local-constructed date would make
// this suite pass in Pacific/UTC but fail in a positive-offset timezone.
const today = new Date("2026-06-10T12:00:00Z"); // 2026-06-10 (UTC)

const cards: ReviewCardLite[] = [
  { nextReviewDate: "2026-06-08", interval: 1, repetitions: 0 }, // overdue, learning
  { nextReviewDate: "2026-06-10", interval: 6, repetitions: 2 }, // due today, learning
  { nextReviewDate: "2026-06-13", interval: 6, repetitions: 2 }, // due in 3d, learning
  { nextReviewDate: "2026-06-16", interval: 14, repetitions: 3 }, // due in 6d, strengthening
  { nextReviewDate: "2026-06-25", interval: 21, repetitions: 4 }, // >7d away, strengthening
  { nextReviewDate: "2026-08-01", interval: 45, repetitions: 6 }, // far, retained
];

describe("summarizeReview", () => {
  const s = summarizeReview(cards, today);
  it("counts due-now (overdue + today)", () => {
    expect(s.dueNow).toBe(2);
  });
  it("counts due within the next 7 days (after today)", () => {
    expect(s.dueNext7).toBe(2); // 06-13 and 06-16
  });
  it("finds the next future due date", () => {
    expect(s.nextDate).toBe("2026-06-13");
  });
  it("buckets by interval", () => {
    expect(s.total).toBe(6);
    expect(s.buckets.learning).toBe(3); // interval 1, 6, 6
    expect(s.buckets.strengthening).toBe(2); // 14, 21
    expect(s.buckets.retained).toBe(1); // 45
  });
  it("empty queue", () => {
    const e = summarizeReview([], today);
    expect(e).toEqual({
      total: 0,
      dueNow: 0,
      dueNext7: 0,
      nextDate: null,
      buckets: { learning: 0, strengthening: 0, retained: 0 },
    });
  });
});
