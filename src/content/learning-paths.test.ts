import { describe, expect, it } from "vitest";
import { courseRegistry } from "@/content/courses";
import { LEARNING_TRACKS_BY_REGION } from "@/content/learning-paths";

describe("learning path contracts", () => {
  it("provides substantive tracks for every live course", () => {
    for (const course of courseRegistry) {
      expect(LEARNING_TRACKS_BY_REGION[course.bodyRegion].length, course.id).toBeGreaterThanOrEqual(4);
    }
  });

  it("links only to modules and cases owned by the active course", () => {
    for (const course of courseRegistry) {
      const moduleIds = new Set(course.modules.map((module) => module.id));
      const caseIds = new Set(course.cases.map((caseItem) => caseItem.id));
      const coreCaseIds = new Set(course.coreCases.map((caseItem) => caseItem.id));
      const residentCoreCaseIds = new Set(
        course.coreCases.filter((caseItem) => caseItem.residentVisible).map((caseItem) => caseItem.id),
      );

      for (const track of LEARNING_TRACKS_BY_REGION[course.bodyRegion]) {
        expect(track.modules.length, `${course.id}/${track.id} modules`).toBeGreaterThan(0);
        expect(track.cases.length, `${course.id}/${track.id} cases`).toBeGreaterThan(0);
        expect(
          track.modules.every((module) => moduleIds.has(module.id)),
          `${course.id}/${track.id} module ownership`,
        ).toBe(true);
        expect(
          track.cases.every((caseItem) => caseIds.has(caseItem.id)),
          `${course.id}/${track.id} case ownership`,
        ).toBe(true);
        expect(
          track.cases.some((caseItem) => coreCaseIds.has(caseItem.id)),
          `${course.id}/${track.id} has a core case`,
        ).toBe(true);
        if (course.id === "knee-mri") {
          expect(
            track.cases.some((caseItem) => residentCoreCaseIds.has(caseItem.id)),
            `${course.id}/${track.id} has a resident-visible core case`,
          ).toBe(true);
        }
      }
    }
  });
});
