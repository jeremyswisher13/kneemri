import { describe, expect, it } from "vitest";
import type { MedicalQaPriorityItem } from "@/content/medical-qa.generated";
import type { MedicalQaReviewRecord } from "@/lib/medical-qa-review";
import { medicalQaReviewId } from "@/lib/medical-qa-review";
import {
  isMedicalQaReviewStatus,
  medicalQaFilterPath,
  summarizeMedicalQaReadiness,
} from "@/lib/medical-qa-readiness";

const baseItem: MedicalQaPriorityItem = {
  courseId: "knee-mri",
  courseTitle: "Knee MRI",
  itemType: "module-quiz",
  itemId: "q1",
  section: "Modules",
  title: "Question 1",
  risk: "high",
  requiresSourceCheck: true,
  flags: ["answer-key"],
  sourcePath: "src/content/example.ts",
  textPreview: "Preview",
};

function reviewFor(item: MedicalQaPriorityItem, status: MedicalQaReviewRecord["status"]): MedicalQaReviewRecord {
  return {
    id: medicalQaReviewId(item),
    courseId: item.courseId,
    itemType: item.itemType,
    itemId: item.itemId,
    title: item.title,
    risk: item.risk,
    sourcePath: item.sourcePath,
    flags: item.flags,
    status,
    sourceNotes: "",
    reviewerNotes: "",
    reviewedBy: "admin",
    reviewerEmail: "admin@example.com",
    reviewedAt: null,
    updatedAt: null,
  };
}

describe("medical QA readiness helpers", () => {
  it("summarizes status counts for the selected course only", () => {
    const approvedHigh = { ...baseItem, itemId: "q2", title: "Question 2" };
    const sourceNeededMedium = {
      ...baseItem,
      itemId: "q3",
      title: "Question 3",
      risk: "medium" as const,
    };
    const otherCourse = {
      ...baseItem,
      courseId: "shoulder-mri",
      itemId: "q4",
      title: "Question 4",
    };
    const reviews = {
      [medicalQaReviewId(approvedHigh)]: reviewFor(approvedHigh, "approved"),
      [medicalQaReviewId(sourceNeededMedium)]: reviewFor(sourceNeededMedium, "source-needed"),
      [medicalQaReviewId(otherCourse)]: reviewFor(otherCourse, "approved"),
    };

    expect(summarizeMedicalQaReadiness([baseItem, approvedHigh, sourceNeededMedium, otherCourse], reviews, "knee-mri")).toEqual({
      total: 3,
      pending: 1,
      approved: 1,
      needsRevision: 0,
      sourceNeeded: 1,
      highRiskPending: 1,
      highRiskTotal: 2,
    });
  });

  it("builds stable deep links to filtered QA queues", () => {
    expect(medicalQaFilterPath({ courseId: "knee-mri", status: "pending", risk: "high" })).toBe(
      "/admin/medical-qa?course=knee-mri&status=pending&risk=high",
    );
    expect(medicalQaFilterPath({ courseId: "all", status: "all", risk: "all", query: "  root tear  " })).toBe(
      "/admin/medical-qa?q=root+tear",
    );
  });

  it("validates review status URL values", () => {
    expect(isMedicalQaReviewStatus("approved")).toBe(true);
    expect(isMedicalQaReviewStatus("blocked")).toBe(false);
    expect(isMedicalQaReviewStatus(null)).toBe(false);
  });
});
