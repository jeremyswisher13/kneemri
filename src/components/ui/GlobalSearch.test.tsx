import { describe, expect, it } from "vitest";
import { getCourseById } from "@/content/courses";
import { buildIndex, search } from "./GlobalSearch";

// Cmd/Ctrl+K search must not become a back door around the case simulator's
// blinding. CasesPage matches an unopened case on its clinical scenario ALONE
// (src/pages/CasesPage.tsx, matchesQuery) — these tests pin GlobalSearch to the
// same contract, because a tag like "acl" names the diagnosis just as plainly
// as the case title does.
const knee = getCourseById("knee-mri");

// "acl-pivot-shift" is a core knee case tagged "acl" whose scenario mentions a
// soccer player — a clean pair of a diagnosis-bearing tag and neutral scenario
// text.
const CASE_ID = "acl-pivot-shift";
const NO_CASES_COMPLETED = new Set<string>();
const CASE_COMPLETED = new Set([CASE_ID]);

function caseEntry(completed: Set<string>) {
  const entry = buildIndex("fellow", knee, completed).find(
    (item) => item.id === `case-${CASE_ID}`,
  );
  if (!entry) throw new Error(`${CASE_ID} is missing from the search index`);
  return entry;
}

// Search this ONE entry rather than the whole index: `search` caps results at 30
// and ranks by score, so a whole-index assertion could pass merely because the
// case was crowded out of the top slice rather than because it is unmatchable.
function isFindable(completed: Set<string>, query: string) {
  return search([caseEntry(completed)], query).length === 1;
}

describe("GlobalSearch case indexing is spoiler-safe", () => {
  it("does not surface an unopened case by a diagnosis-bearing tag", () => {
    expect(isFindable(NO_CASES_COMPLETED, "acl")).toBe(false);
    expect(isFindable(NO_CASES_COMPLETED, "pivot-shift")).toBe(false);
  });

  it("still surfaces an unopened case by its clinical scenario", () => {
    expect(isFindable(NO_CASES_COMPLETED, "soccer player")).toBe(true);
    expect(isFindable(NO_CASES_COMPLETED, "instability")).toBe(true);
  });

  it("labels an unopened case by number and difficulty, never by diagnosis", () => {
    const entry = caseEntry(NO_CASES_COMPLETED);
    expect(entry.title).toMatch(/^Case \d+: (Foundational|Intermediate|Advanced)$/);
    expect(`${entry.title} ${entry.body}`.toLowerCase()).not.toContain("acl");
  });

  it("indexes title, diagnoses, and tags once the case is completed", () => {
    expect(isFindable(CASE_COMPLETED, "acl")).toBe(true);
    expect(caseEntry(CASE_COMPLETED).title).toBe("ACL Tear + Pivot-Shift Pattern");
  });
});
