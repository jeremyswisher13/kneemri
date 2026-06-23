import type { MedicalQaRisk } from "@/content/medical-qa.generated";

export type MedicalQaReviewStatus = "pending" | "approved" | "needs-revision" | "source-needed";

export interface MedicalQaReviewTarget {
  courseId: string;
  itemType: string;
  itemId: string;
  title?: string;
  risk?: MedicalQaRisk;
  sourcePath?: string;
  flags?: string[];
}

export interface MedicalQaReviewInput {
  status: MedicalQaReviewStatus;
  sourceNotes: string;
  reviewerNotes: string;
}

export interface MedicalQaReviewRecord extends MedicalQaReviewInput {
  id: string;
  courseId: string;
  itemType: string;
  itemId: string;
  title: string;
  risk: MedicalQaRisk;
  sourcePath: string;
  flags: string[];
  reviewedBy: string;
  reviewerEmail: string;
  reviewedAt: unknown;
  updatedAt: unknown;
}

export const MEDICAL_QA_REVIEW_STATUSES: MedicalQaReviewStatus[] = [
  "pending",
  "approved",
  "needs-revision",
  "source-needed",
];

export const MEDICAL_QA_REVIEW_LABELS: Record<MedicalQaReviewStatus, string> = {
  pending: "Unreviewed",
  approved: "Approved",
  "needs-revision": "Needs revision",
  "source-needed": "Source needed",
};

export function medicalQaReviewId(target: Pick<MedicalQaReviewTarget, "courseId" | "itemType" | "itemId">): string {
  return encodeURIComponent(`${target.courseId}::${target.itemType}::${target.itemId}`);
}
