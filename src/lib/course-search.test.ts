import { describe, expect, it } from "vitest";
import { getCourseById } from "@/content/courses";
import { moduleTopicSearchRoute, referenceSectionsForCourse } from "@/lib/course-search";

describe("course search helpers", () => {
  it("deep-links module search results to the matched topic", () => {
    const hip = getCourseById("hip-mri");

    expect(moduleTopicSearchRoute(hip, "hip-fai-labrum", 3)).toBe(
      "/courses/hip-mri/modules/hip-fai-labrum?topic=3",
    );
  });

  it("uses region-specific reference sections for search indexing", () => {
    const hipLabels = referenceSectionsForCourse(getCourseById("hip-mri"))
      .flatMap((section) => section.items.map((item) => item.label))
      .join(" ");
    const elbowLabels = referenceSectionsForCourse(getCourseById("elbow-mri"))
      .flatMap((section) => section.items.map((item) => item.label))
      .join(" ");

    expect(hipLabels).toMatch(/Alpha angle/i);
    expect(elbowLabels).toMatch(/UCL \(ulnar collateral\) complex/i);
  });
});
