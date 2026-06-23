import type { MedicalQaPriorityItem, MedicalQaRisk } from "@/content/medical-qa.generated";
import {
  MEDICAL_QA_REVIEW_STATUSES,
  medicalQaReviewId,
  type MedicalQaReviewRecord,
  type MedicalQaReviewStatus,
} from "@/lib/medical-qa-review";

export interface MedicalQaReadinessSummary {
  total: number;
  pending: number;
  approved: number;
  needsRevision: number;
  sourceNeeded: number;
  highRiskPending: number;
  highRiskTotal: number;
}

export interface MedicalQaFilterParams {
  courseId?: string;
  status?: "all" | MedicalQaReviewStatus;
  risk?: "all" | MedicalQaRisk;
  type?: string;
  query?: string;
}

export function summarizeMedicalQaReadiness(
  items: MedicalQaPriorityItem[],
  reviewsById: Record<string, MedicalQaReviewRecord>,
  courseId: string,
): MedicalQaReadinessSummary {
  const courseItems = items.filter((item) => item.courseId === courseId);
  const summary: MedicalQaReadinessSummary = {
    total: courseItems.length,
    pending: 0,
    approved: 0,
    needsRevision: 0,
    sourceNeeded: 0,
    highRiskPending: 0,
    highRiskTotal: 0,
  };

  for (const item of courseItems) {
    const status = reviewsById[medicalQaReviewId(item)]?.status ?? "pending";
    if (status === "approved") summary.approved += 1;
    if (status === "needs-revision") summary.needsRevision += 1;
    if (status === "source-needed") summary.sourceNeeded += 1;
    if (status === "pending") summary.pending += 1;
    if (item.risk === "high") {
      summary.highRiskTotal += 1;
      if (status !== "approved") summary.highRiskPending += 1;
    }
  }

  return summary;
}

export function medicalQaFilterPath(filters: MedicalQaFilterParams): string {
  const params = new URLSearchParams();
  if (filters.courseId && filters.courseId !== "all") params.set("course", filters.courseId);
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.risk && filters.risk !== "all") params.set("risk", filters.risk);
  if (filters.type && filters.type !== "all") params.set("type", filters.type);
  if (filters.query?.trim()) params.set("q", filters.query.trim());
  const query = params.toString();
  return `/admin/medical-qa${query ? `?${query}` : ""}`;
}

export function isMedicalQaReviewStatus(value: string | null): value is MedicalQaReviewStatus {
  return value != null && MEDICAL_QA_REVIEW_STATUSES.includes(value as MedicalQaReviewStatus);
}
