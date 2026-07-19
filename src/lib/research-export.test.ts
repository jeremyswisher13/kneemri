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
  it("assigns a stable code per learner", () => {
    const ids = participantIds(fellows);
    for (const f of fellows) expect(ids.get(f.id)).toMatch(/^P\d{5}$/);
    expect(new Set([...ids.values()]).size).toBe(fellows.length); // unique
  });
  it("is order-independent (same code regardless of input order)", () => {
    const a = participantIds(fellows);
    const b = participantIds([...fellows].reverse());
    expect(a.get("uid-zzz")).toBe(b.get("uid-zzz"));
  });
  // The whole point of the code: exports taken from DIFFERENT cohort subsets must
  // still line up, or merging them on "Participant ID" attributes one learner's
  // pre/post data to another person.
  it("is COHORT-independent — filtering the roster does not reassign codes", () => {
    const all = participantIds(fellows);
    const filtered = participantIds(fellows.filter((f) => f.id !== "uid-mmm"));
    expect(filtered.get("uid-aaa")).toBe(all.get("uid-aaa"));
    expect(filtered.get("uid-zzz")).toBe(all.get("uid-zzz"));
  });
  it("is enrollment-independent — a new learner does not shift existing codes", () => {
    const before = participantIds(fellows);
    const after = participantIds([...fellows, fellow("uid-000", 3, 9)]);
    for (const f of fellows) expect(after.get(f.id)).toBe(before.get(f.id));
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
    const codes = rows.map((r) => String(r[0]));
    // Codes are hash-derived (a property of the learner), NOT sequential by
    // position — asserting P001/P002/P003 would re-pin the cohort-dependent bug.
    for (const code of codes) expect(code).toMatch(/^P\d{5}$/);
    expect(new Set(codes).size).toBe(3);
    // Every emitted code must be the one participantIds assigns for that uid
    // (row ORDER is an implementation detail, so compare as sets).
    const expected = participantIds(fellows);
    expect([...codes].sort()).toEqual(fellows.map((f) => expected.get(f.id)!).sort());
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
