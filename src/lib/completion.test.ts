import { describe, it, expect } from "vitest";
import {
  postScorePct,
  meetsPassThreshold,
  hasCompletedRequirements,
  isCourseComplete,
  CERTIFICATE_PASS_THRESHOLD,
} from "@/lib/completion";
import { getCourseById } from "@/content/courses";
import type { UserProgress } from "@/types/progress";

// The completion predicates are the gates that decide whether a fellow's work is
// recorded as done and whether a certificate is earned — so the cross-course
// rules (same three-case milestone + workstation requirement in every course)
// are pinned here.

const knee = getCourseById("knee-mri");
const hip = getCourseById("hip-mri");

// Only the fields the completion predicates read; defaults describe a learner who
// has finished everything and passed, so each test overrides exactly one gate.
function mk(overrides: Partial<UserProgress> = {}): UserProgress {
  return {
    preQuizCompleted: true,
    preSurveyCompleted: true,
    postQuizCompleted: true,
    postSurveyCompleted: true,
    modulesCompleted: 8,
    totalModules: 8,
    normalMriComplete: true,
    casesCompleted: 6,
    totalCases: 6,
    requiredCases: 3,
    postQuizScore: 10,
    postQuizTotal: 12,
    ...overrides,
  } as unknown as UserProgress;
}

describe("postScorePct", () => {
  it("is null when the post quiz has no usable score/total", () => {
    expect(postScorePct(mk({ postQuizScore: null }))).toBeNull();
    expect(postScorePct(mk({ postQuizTotal: null }))).toBeNull();
    expect(postScorePct(mk({ postQuizTotal: 0 }))).toBeNull();
  });
  it("rounds to the same percent the UI shows", () => {
    expect(postScorePct(mk({ postQuizScore: 9, postQuizTotal: 12 }))).toBe(75); // 75.0
    expect(postScorePct(mk({ postQuizScore: 10, postQuizTotal: 12 }))).toBe(83); // 83.3 → 83
    expect(postScorePct(mk({ postQuizScore: 11, postQuizTotal: 12 }))).toBe(92); // 91.7 → 92
  });
});

describe("meetsPassThreshold", () => {
  it("passes at/above and fails below the threshold", () => {
    expect(CERTIFICATE_PASS_THRESHOLD).toBe(70);
    expect(meetsPassThreshold(mk({ postQuizScore: 10, postQuizTotal: 12 }), knee)).toBe(true); // 83%
    // 70% is the boundary and must pass (>=).
    expect(meetsPassThreshold(mk({ postQuizScore: 7, postQuizTotal: 10 }), knee)).toBe(true); // 70%
    expect(meetsPassThreshold(mk({ postQuizScore: 8, postQuizTotal: 12 }), knee)).toBe(false); // 67%
  });
  it("fails when the post quiz has not been scored", () => {
    expect(meetsPassThreshold(mk({ postQuizScore: null }), hip)).toBe(false);
  });
});

describe("hasCompletedRequirements — knee", () => {
  it("requires the shared three-case milestone", () => {
    expect(hasCompletedRequirements(mk({ casesCompleted: 2 }), knee)).toBe(false);
    expect(hasCompletedRequirements(mk({ casesCompleted: 3 }), knee)).toBe(true);
  });
  it("requires the Interactive Normal Knee MRI workstation", () => {
    expect(hasCompletedRequirements(mk({ normalMriComplete: false }), knee)).toBe(false);
  });
  it("requires every module and the pre/post instruments", () => {
    expect(hasCompletedRequirements(mk({ modulesCompleted: 5, totalModules: 9 }), knee)).toBe(false);
    expect(hasCompletedRequirements(mk({ preSurveyCompleted: false }), knee)).toBe(false);
    expect(hasCompletedRequirements(mk({ postQuizCompleted: false }), knee)).toBe(false);
  });
});

describe("hasCompletedRequirements — hip", () => {
  it("is complete when modules + three cases + workstation + pre/post are done", () => {
    expect(hasCompletedRequirements(mk(), hip)).toBe(true);
  });
  it("does not require the rest of the core library", () => {
    expect(hasCompletedRequirements(mk({ casesCompleted: 3, totalCases: 6 }), hip)).toBe(true);
    expect(hasCompletedRequirements(mk({ casesCompleted: 2, totalCases: 6 }), hip)).toBe(false);
  });
  it("gates the workstation directly (so an admin post-quiz unlock can't bypass it)", () => {
    // completion.ts now gates on normalMriComplete directly rather than relying on
    // the post-quiz-unlock transitivity, which an admin override could break.
    expect(hasCompletedRequirements(mk({ normalMriComplete: false }), hip)).toBe(false);
  });
});

describe("cross-course consistency", () => {
  it("applies the same case milestone to knee and hip", () => {
    const incomplete = mk({ casesCompleted: 2, totalCases: 6 });
    const complete = mk({ casesCompleted: 3, totalCases: 6 });
    expect(hasCompletedRequirements(incomplete, knee)).toBe(false);
    expect(hasCompletedRequirements(incomplete, hip)).toBe(false);
    expect(hasCompletedRequirements(complete, knee)).toBe(true);
    expect(hasCompletedRequirements(complete, hip)).toBe(true);
  });
});

describe("isCourseComplete — requirements AND the pass threshold", () => {
  it("requires both: all activities done and post score >= 70%", () => {
    expect(isCourseComplete(mk(), knee)).toBe(true);
    // Activities done but failing score → not complete.
    expect(isCourseComplete(mk({ postQuizScore: 8, postQuizTotal: 12 }), knee)).toBe(false);
    // Passing score but a missing activity → not complete.
    expect(isCourseComplete(mk({ casesCompleted: 2, totalCases: 6 }), hip)).toBe(false);
  });
});
