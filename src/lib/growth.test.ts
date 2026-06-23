import { describe, it, expect } from "vitest";
import { computeGrowth, domainLabel } from "@/lib/growth";

const course = {
  prePostQuizQuestions: [
    { id: "q1-pre", domain: "d1", correctAnswer: "A", prePostMapping: "parallel-pre" },
    { id: "q1-post", domain: "d1", correctAnswer: "B", prePostMapping: "parallel-post" },
    { id: "q2-pre", domain: "d2", correctAnswer: "A", prePostMapping: "parallel-pre" },
    { id: "q2-post", domain: "d2", correctAnswer: "B", prePostMapping: "parallel-post" },
  ],
  confidenceStatements: [
    { id: "s1", domain: "d1" },
    { id: "s2", domain: "d2" },
  ],
};

const learner = {
  preQuizResponses: [
    { questionId: "q1-pre", selectedAnswer: "A" }, // d1 pre correct
    { questionId: "q2-pre", selectedAnswer: "X" }, // d2 pre wrong
  ],
  postQuizResponses: [
    { questionId: "q1-post", selectedAnswer: "A" }, // d1 post wrong (key B)
    { questionId: "q2-post", selectedAnswer: "B" }, // d2 post correct
  ],
  preQuizScore: 1,
  preQuizTotal: 2,
  postQuizScore: 1,
  postQuizTotal: 2,
  preSurveyResponses: [
    { statementId: "s1", rating: 2 },
    { statementId: "s2", rating: 2 },
  ],
  postRetroResponses: [
    { statementId: "s1", rating: 1 },
    { statementId: "s2", rating: 3 },
  ],
  postSurveyResponses: [
    { statementId: "s1", rating: 5 },
    { statementId: "s2", rating: 4 },
  ],
};

describe("computeGrowth", () => {
  const g = computeGrowth(learner, course);
  const d1 = g.domains.find((d) => d.domain === "d1")!;
  const d2 = g.domains.find((d) => d.domain === "d2")!;

  it("per-domain knowledge pre→post", () => {
    expect(d1.prePct).toBe(100);
    expect(d1.postPct).toBe(0);
    expect(d1.quizGain).toBe(-100);
    expect(d2.prePct).toBe(0);
    expect(d2.postPct).toBe(100);
    expect(d2.quizGain).toBe(100);
  });

  it("per-domain confidence + calibration (Likert mapped across span)", () => {
    expect(d1.confPct).toBe(100); // rating 5 → (5-1)/4 = 100%
    expect(d1.calibrationGap).toBe(100); // 100% confident, 0% correct → very overconfident
    expect(d1.honestConfGain).toBe(4); // now 5 − looking-back 1
    expect(d2.confPct).toBe(75); // rating 4 → 75%
    expect(d2.calibrationGap).toBe(-25); // 75% confident, 100% correct → underconfident
    expect(d2.honestConfGain).toBe(1); // 4 − 3
  });

  it("overall + highlights", () => {
    expect(g.overall.prePct).toBe(50);
    expect(g.overall.postPct).toBe(50);
    expect(g.overall.gainPts).toBe(0);
    expect(g.strongest?.domain).toBe("d2"); // post 100%
    expect(g.needsWork?.domain).toBe("d1"); // post 0%
    expect(g.mostOverconfident?.domain).toBe("d1"); // gap +100
  });

  it("empty learner → nulls, no crash", () => {
    const e = computeGrowth(
      {
        preQuizResponses: null,
        postQuizResponses: null,
        preQuizScore: null,
        preQuizTotal: null,
        postQuizScore: null,
        postQuizTotal: null,
        preSurveyResponses: null,
        postSurveyResponses: null,
        postRetroResponses: null,
      },
      course,
    );
    expect(e.overall.prePct).toBeNull();
    expect(e.overall.gainPts).toBeNull();
    expect(e.strongest).toBeNull();
    expect(e.mostOverconfident).toBeNull();
    expect(e.domains[0].prePct).toBeNull();
    expect(e.domains[0].confPct).toBeNull();
  });

  it("domainLabel prettifies", () => {
    expect(domainLabel("menisci-roots")).toBe("Menisci Roots");
  });
});
