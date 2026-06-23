import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  medicalQaCourseSummaries,
  medicalQaPriorityItemCount,
  medicalQaReviewBreakdown,
  medicalQaTotals,
  type MedicalQaPriorityItem,
} from "@/content/medical-qa.generated";

function loadSourceCheckItems(): MedicalQaPriorityItem[] {
  return JSON.parse(
    readFileSync(resolve("public/medical-qa/source-check-items.json"), "utf8"),
  ) as MedicalQaPriorityItem[];
}

describe("medical QA generated data", () => {
  it("keeps course summaries aligned with totals", () => {
    const courses = Object.values(medicalQaCourseSummaries);

    expect(courses.reduce((sum, course) => sum + course.reviewItems, 0)).toBe(medicalQaTotals.reviewItems);
    expect(courses.reduce((sum, course) => sum + course.highRiskItems, 0)).toBe(medicalQaTotals.highRiskItems);
    expect(courses.reduce((sum, course) => sum + course.sourceCheckItems, 0)).toBe(medicalQaTotals.sourceCheckItems);
    expect(courses.reduce((sum, course) => sum + course.diagnostics, 0)).toBe(medicalQaTotals.diagnostics);
  });

  it("exports every source-check item used by the admin queue", () => {
    const sourceCheckItems = loadSourceCheckItems();

    expect(medicalQaPriorityItemCount).toBe(medicalQaTotals.sourceCheckItems);
    expect(sourceCheckItems).toHaveLength(medicalQaTotals.sourceCheckItems);
    expect(sourceCheckItems.every((item) => item.requiresSourceCheck)).toBe(true);
  });

  it("keeps risk breakdowns aligned with course summaries", () => {
    for (const [courseId, summary] of Object.entries(medicalQaCourseSummaries)) {
      const breakdown = medicalQaReviewBreakdown[courseId];
      expect(breakdown.risks.high).toBe(summary.highRiskItems);
      expect(breakdown.risks.high + breakdown.risks.medium + breakdown.risks.standard).toBe(summary.reviewItems);
    }
  });
});
