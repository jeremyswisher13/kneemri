import { describe, expect, it } from "vitest";
import { orderDueCards, DAILY_REVIEW_CAP, type ReviewCard } from "./spaced-repetition";

function card(partial: Partial<ReviewCard> & { questionId: string }): ReviewCard {
  return {
    moduleId: "m",
    easeFactor: 2.5,
    interval: 1,
    repetitions: 1,
    nextReviewDate: "2026-07-20",
    ...partial,
  };
}

describe("orderDueCards", () => {
  it("puts the most overdue (oldest nextReviewDate) first", () => {
    const out = orderDueCards([
      card({ questionId: "b", nextReviewDate: "2026-07-21" }),
      card({ questionId: "a", nextReviewDate: "2026-07-10" }),
      card({ questionId: "c", nextReviewDate: "2026-07-15" }),
    ]);
    expect(out.map((c) => c.questionId)).toEqual(["a", "c", "b"]);
  });

  it("breaks date ties by lowest ease (hardest) first", () => {
    const out = orderDueCards([
      card({ questionId: "easy", nextReviewDate: "2026-07-10", easeFactor: 2.8 }),
      card({ questionId: "hard", nextReviewDate: "2026-07-10", easeFactor: 1.4 }),
    ]);
    expect(out.map((c) => c.questionId)).toEqual(["hard", "easy"]);
  });

  it("is stable and deterministic on full ties (by questionId)", () => {
    const out = orderDueCards([
      card({ questionId: "z" }),
      card({ questionId: "a" }),
      card({ questionId: "m" }),
    ]);
    expect(out.map((c) => c.questionId)).toEqual(["a", "m", "z"]);
  });

  it("does not mutate the input array", () => {
    const input = [card({ questionId: "b" }), card({ questionId: "a" })];
    const snapshot = input.map((c) => c.questionId);
    orderDueCards(input);
    expect(input.map((c) => c.questionId)).toEqual(snapshot);
  });

  it("exposes a sane daily cap", () => {
    expect(DAILY_REVIEW_CAP).toBeGreaterThan(0);
    expect(DAILY_REVIEW_CAP).toBeLessThanOrEqual(50);
  });
});
