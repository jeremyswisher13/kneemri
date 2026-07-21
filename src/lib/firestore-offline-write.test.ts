import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReviewCard } from "./spaced-repetition";

const firestoreMocks = vi.hoisted(() => ({
  setDoc: vi.fn(),
  doc: vi.fn(() => ({ path: "users/test/reviewCards/question-1" })),
}));

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  doc: firestoreMocks.doc,
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(),
  setDoc: firestoreMocks.setDoc,
  where: vi.fn(),
}));
vi.mock("./db", () => ({ db: {} }));
vi.mock("./audit", () => ({ logAuditEvent: vi.fn() }));

import { saveReviewCard, WRITE_ACK_TIMEOUT_MS } from "./firestore";

const card: ReviewCard = {
  questionId: "question-1",
  moduleId: "module-1",
  courseId: "knee-mri",
  easeFactor: 2.5,
  interval: 1,
  repetitions: 1,
  nextReviewDate: "2026-07-22",
};

describe("offline learner writes", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("lets a queued review-card save proceed when Firestore never acknowledges", async () => {
    firestoreMocks.setDoc.mockReturnValue(new Promise<void>(() => {}));
    const save = saveReviewCard("test-user", card);
    let settled = false;
    save.then(() => { settled = true; });

    await vi.advanceTimersByTimeAsync(WRITE_ACK_TIMEOUT_MS - 1);
    expect(settled).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await expect(save).resolves.toBeUndefined();
    expect(firestoreMocks.setDoc).toHaveBeenCalledOnce();
  });

  it("still surfaces an immediate Firestore error", async () => {
    firestoreMocks.setDoc.mockRejectedValue(new Error("permission denied"));
    await expect(saveReviewCard("test-user", card)).rejects.toThrow("permission denied");
  });
});
