import { describe, expect, it } from "vitest";
import {
  MEDICAL_QA_REVIEW_LABELS,
  MEDICAL_QA_REVIEW_STATUSES,
  medicalQaReviewId,
} from "@/lib/medical-qa-review";

describe("medical QA review helpers", () => {
  it("creates stable Firestore-safe IDs from source-check item identity", () => {
    const id = medicalQaReviewId({
      courseId: "hip-mri",
      itemType: "red-flag",
      itemId: "Femoral neck stress fracture / AVN",
    });

    expect(id).toBe("hip-mri%3A%3Ared-flag%3A%3AFemoral%20neck%20stress%20fracture%20%2F%20AVN");
    expect(id).not.toContain("/");
  });

  it("keeps every status label defined", () => {
    for (const status of MEDICAL_QA_REVIEW_STATUSES) {
      expect(MEDICAL_QA_REVIEW_LABELS[status]).toBeTruthy();
    }
  });
});
