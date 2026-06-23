import { describe, it, expect } from "vitest";
import type { CourseDefinition } from "@/content/courses";
import {
  participantIds,
  buildResearchDataset,
  datasetToCsv,
  buildCohortReport,
  type ResearchFellow,
} from "@/lib/research-export";

// Minimal course: 2 domains, matched parallel pre/post items, 2 modules.
const course = {
  id: "test-mri",
  title: "Test MRI Course",
  modules: [{ id: "m1" }, { id: "m2" }],
  coreCases: [],
  advancedCases: [],
  prePostQuizQuestions: [
    { id: "q1-pre", domain: "bones", correctAnswer: "A", prePostMapping: "parallel-pre" },
    { id: "q1-post", domain: "bones", correctAnswer: "B", prePostMapping: "parallel-post" },
    { id: "q2-pre", domain: "ligaments", correctAnswer: "A", prePostMapping: "parallel-pre" },
    { id: "q2-post", domain: "ligaments", correctAnswer: "C", prePostMapping: "parallel-post" },
  ],
  confidenceStatements: [
    { id: "c-bones", domain: "bones" },
    { id: "c-ligaments", domain: "ligaments" },
  ],
} as unknown as CourseDefinition;

function fellow(
  id: string,
  pre: number,
  post: number,
  opts: Partial<ResearchFellow> = {},
): ResearchFellow {
  return {
    id,
    role: "fellow",
    preQuizScore: pre,
    preQuizTotal: 2,
    postQuizScore: post,
    postQuizTotal: 2,
    preQuizResponses: [
      { questionId: "q1-pre", selectedAnswer: pre >= 1 ? "A" : "X" },
      { questionId: "q2-pre", selectedAnswer: pre >= 2 ? "A" : "X" },
    ],
    postQuizResponses: [
      { questionId: "q1-post", selectedAnswer: post >= 1 ? "B" : "X" },
      { questionId: "q2-post", selectedAnswer: post >= 2 ? "C" : "X" },
    ],
    preSurveyResponses: [
      { statementId: "c-bones", rating: 2 },
      { statementId: "c-ligaments", rating: 2 },
    ],
    postRetroResponses: [
      { statementId: "c-bones", rating: 2 },
      { statementId: "c-ligaments", rating: 2 },
    ],
    postSurveyResponses: [
      { statementId: "c-bones", rating: 4 },
      { statementId: "c-ligaments", rating: 5 },
    ],
    modulesCompleted: 2,
    casesCompleted: 0,
    ...opts,
  };
}

const fellows: ResearchFellow[] = [
  fellow("uid-zzz", 1, 2, { name: "Synthetic Alpha", email: "alpha@example.invalid" } as Partial<ResearchFellow>),
  fellow("uid-aaa", 0, 1, { name: "Synthetic Beta", email: "beta@example.invalid" } as Partial<ResearchFellow>),
  fellow("uid-mmm", 1, 2),
];

describe("participantIds", () => {
  it("assigns stable, sequential, sorted-by-id codes", () => {
    const ids = participantIds(fellows);
    expect(ids.get("uid-aaa")).toBe("P001");
    expect(ids.get("uid-mmm")).toBe("P002");
    expect(ids.get("uid-zzz")).toBe("P003");
  });
  it("is order-independent (same code regardless of input order)", () => {
    const a = participantIds(fellows);
    const b = participantIds([...fellows].reverse());
    expect(a.get("uid-zzz")).toBe(b.get("uid-zzz"));
  });
});

describe("buildResearchDataset (de-identification)", () => {
  const { headers, rows } = buildResearchDataset(fellows, course);
  const csv = datasetToCsv(headers, rows);

  it("never exposes name, email, or raw user id", () => {
    expect(headers).not.toContain("Name");
    expect(headers).not.toContain("Email");
    expect(headers[0]).toBe("Participant ID");
    // No PII or opaque id leaks into the serialized dataset.
    expect(csv).not.toMatch(/@example\.invalid/);
    expect(csv).not.toContain("Synthetic");
    expect(csv).not.toContain("uid-");
  });

  it("emits one row per learner, keyed by participant code", () => {
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r[0])).toEqual(["P001", "P002", "P003"]);
  });

  it("includes overall and per-domain gain columns", () => {
    expect(headers).toContain("Quiz Gain (pp)");
    expect(headers).toContain("Honest Confidence Gain (post - retro)");
    expect(headers.some((h) => h.startsWith("Bones:"))).toBe(true);
    expect(headers.some((h) => h.startsWith("Ligaments:"))).toBe(true);
  });

  it("scores case completion against required core cases, not optional advanced cases", () => {
    const courseWithAdvanced = {
      ...course,
      coreCases: [{ id: "core-1", residentVisible: true }],
      advancedCases: [{ id: "advanced-1", residentVisible: true }],
      cases: [
        { id: "core-1", residentVisible: true },
        { id: "advanced-1", residentVisible: true },
      ],
    } as unknown as CourseDefinition;
    const dataset = buildResearchDataset(
      [fellow("uid-cases", 1, 2, { casesCompleted: 1 })],
      courseWithAdvanced,
    );
    const casesCol = dataset.headers.indexOf("Cases Completed %");

    expect(dataset.rows[0][casesCol]).toBe(100);
  });
});

describe("buildCohortReport", () => {
  const r = buildCohortReport(fellows, course);

  it("computes paired n, means, and a non-null effect size", () => {
    expect(r.enrolled).toBe(3);
    expect(r.nPaired).toBe(3);
    expect(r.preMean).not.toBeNull();
    expect(r.postMean).not.toBeNull();
    expect((r.postMean as number)).toBeGreaterThan(r.preMean as number);
    expect(r.cohensD).not.toBeNull();
    expect(r.cohensDInterp).toBeTruthy();
  });

  it("produces a per-domain breakdown and a manuscript paragraph", () => {
    expect(r.domains).toHaveLength(2);
    expect(r.resultsText).toMatch(/Cohen's d/);
    expect(r.resultsText).toContain("Test MRI Course");
  });

  it("degrades gracefully with no paired data", () => {
    const noPost = [fellow("uid-a", 1, 0, { postQuizScore: null, postQuizResponses: null })];
    const rep = buildCohortReport(noPost, course);
    expect(rep.nPaired).toBe(0);
    expect(rep.resultsText).toMatch(/Insufficient paired/);
  });
});
