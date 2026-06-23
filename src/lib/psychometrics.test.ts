import { describe, it, expect } from "vitest";
import {
  mean,
  variance,
  sd,
  cohensD,
  interpretCohensD,
  pointBiserial,
  kr20,
  interpretKr20,
  interpretDiscrimination,
  computePsychometrics,
  type PrePostItemLite,
  type AssessmentFellow,
} from "@/lib/psychometrics";

describe("primitive stats", () => {
  it("mean / variance / sd", () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
    expect(variance([1, 2, 3, 4], false)).toBeCloseTo(1.25, 6); // population
    expect(variance([1, 2, 3, 4], true)).toBeCloseTo(1.6667, 3); // sample
    expect(sd([1, 2, 3, 4], false)).toBeCloseTo(1.1180, 3);
    expect(mean([])).toBe(0);
    expect(variance([5], true)).toBe(0); // n-1 = 0 guard
  });
});

describe("cohensD", () => {
  it("matches a hand-computed pooled-SD effect size", () => {
    // pre/post each have sample SD ≈ 12.91; mean gain 20 → d ≈ 1.549
    const d = cohensD([50, 60, 70, 80], [70, 80, 90, 100]);
    expect(d).toBeCloseTo(1.549, 2);
    expect(interpretCohensD(d!)).toBe("large");
  });
  it("returns null with <2 pairs or zero spread", () => {
    expect(cohensD([60], [80])).toBeNull();
    expect(cohensD([70, 70], [70, 70])).toBeNull(); // pooled SD 0
  });
  it("interpretation bands", () => {
    expect(interpretCohensD(0.1)).toBe("negligible");
    expect(interpretCohensD(0.35)).toBe("small");
    expect(interpretCohensD(0.6)).toBe("medium");
    expect(interpretCohensD(0.9)).toBe("large");
  });
});

describe("pointBiserial", () => {
  it("matches a hand-computed correlation", () => {
    // item=[1,1,0,0], rest-totals=[8,6,4,2]; (7-3)/2.236*0.5 ≈ 0.894
    const r = pointBiserial([1, 1, 0, 0], [8, 6, 4, 2]);
    expect(r).toBeCloseTo(0.894, 2);
    expect(interpretDiscrimination(r!)).toBe("good");
  });
  it("null when a group is empty or no spread", () => {
    expect(pointBiserial([1, 1, 1], [5, 4, 3])).toBeNull(); // all correct
    expect(pointBiserial([1, 0, 1], [4, 4, 4])).toBeNull(); // no total spread
    expect(pointBiserial([1, 0], [3, 1])).toBeNull(); // n<3
  });
  it("flags a flawed (negative) item", () => {
    expect(interpretDiscrimination(-0.1)).toBe("flawed");
    expect(interpretDiscrimination(0.1)).toBe("weak");
    expect(interpretDiscrimination(0.25)).toBe("ok");
  });
});

describe("kr20", () => {
  it("matches a hand-computed reliability", () => {
    // Guttman-like matrix → KR-20 = 0.75
    const m = [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ];
    expect(kr20(m)).toBeCloseTo(0.75, 6);
  });
  it("null with too few items/people or no spread", () => {
    expect(kr20([[1, 0]])).toBeNull(); // 1 person
    expect(kr20([[1], [0]])).toBeNull(); // 1 item
    expect(
      kr20([
        [1, 1],
        [1, 1],
      ]),
    ).toBeNull(); // no total-score spread
  });
  it("interpretation bands", () => {
    expect(interpretKr20(0.4)).toBe("poor");
    expect(interpretKr20(0.65)).toBe("questionable");
    expect(interpretKr20(0.75)).toBe("acceptable");
    expect(interpretKr20(0.85)).toBe("good");
    expect(interpretKr20(0.95)).toBe("excellent");
  });
});

describe("computePsychometrics", () => {
  const items: PrePostItemLite[] = [
    { id: "q1-pre", correctAnswer: "A", domain: "d1", prePostMapping: "parallel-pre" },
    { id: "q1-post", correctAnswer: "B", domain: "d1", prePostMapping: "parallel-post" },
    { id: "q2-pre", correctAnswer: "A", domain: "d2", prePostMapping: "parallel-pre" },
    { id: "q2-post", correctAnswer: "B", domain: "d2", prePostMapping: "parallel-post" },
    { id: "q3", correctAnswer: "C", domain: "d3", prePostMapping: "identical" },
  ];
  const mk = (
    preScore: number,
    postScore: number,
    post: [string, string][],
  ): AssessmentFellow => ({
    preQuizScore: preScore,
    preQuizTotal: 3,
    postQuizScore: postScore,
    postQuizTotal: 3,
    preQuizResponses: null,
    postQuizResponses: post.map(([questionId, selectedAnswer]) => ({ questionId, selectedAnswer })),
  });
  const fellows: AssessmentFellow[] = [
    mk(1, 3, [["q1-post", "B"], ["q2-post", "B"], ["q3", "C"]]), // 3/3
    mk(1, 2, [["q1-post", "B"], ["q2-post", "A"], ["q3", "C"]]), // 2/3
    mk(0, 1, [["q1-post", "A"], ["q2-post", "A"], ["q3", "C"]]), // 1/3
  ];

  const p = computePsychometrics(fellows, items);

  it("test-level means and paired effect size", () => {
    expect(p.pre?.n).toBe(3);
    expect(p.post?.n).toBe(3);
    expect(p.gain?.nPaired).toBe(3);
    expect(p.post?.meanPct).toBeCloseTo(66.67, 1);
    expect(p.gain?.cohensD).not.toBeNull();
    expect((p.gain?.cohensD ?? 0)).toBeGreaterThan(0.8); // large gain
  });

  it("per-item difficulty over the post form", () => {
    expect(p.items["q1-post"].difficulty).toBeCloseTo(2 / 3, 4);
    expect(p.items["q2-post"].difficulty).toBeCloseTo(1 / 3, 4);
    expect(p.items["q3"].difficulty).toBe(1); // everyone correct
    expect(Object.keys(p.items).sort()).toEqual(["q1-post", "q2-post", "q3"]);
  });

  it("post-form KR-20 over complete responders", () => {
    expect(p.post?.kr20).toBeCloseTo(0.5, 4);
  });

  it("empty cohort returns nulls, not crashes", () => {
    const e = computePsychometrics([], items);
    expect(e.pre).toBeNull();
    expect(e.post).toBeNull();
    expect(e.gain).toBeNull();
    expect(e.items["q1-post"]).toEqual({ difficulty: null, discrimination: null, n: 0 });
  });
});
