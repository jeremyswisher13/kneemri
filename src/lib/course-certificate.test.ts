import { describe, expect, it } from "vitest";
import { certificateFieldsForCourse } from "@/lib/course-certificate";

describe("certificateFieldsForCourse", () => {
  it("keeps the knee course on the legacy certificate fields", () => {
    expect(certificateFieldsForCourse("knee-mri")).toEqual({
      sentField: "certificateSent",
      sentAtField: "certificateSentAt",
    });
  });

  it("uses course-specific certificate fields for the newer MRI courses", () => {
    expect(certificateFieldsForCourse("shoulder-mri")).toEqual({
      sentField: "certificateSentShoulder",
      sentAtField: "certificateSentAtShoulder",
    });
    expect(certificateFieldsForCourse("hip-mri")).toEqual({
      sentField: "certificateSentHip",
      sentAtField: "certificateSentAtHip",
    });
    expect(certificateFieldsForCourse("elbow-mri")).toEqual({
      sentField: "certificateSentElbow",
      sentAtField: "certificateSentAtElbow",
    });
  });
});
