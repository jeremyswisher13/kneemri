import { describe, expect, it } from "vitest";
import { getCourseById } from "@/content/courses";
import {
  fellowStatus,
  hasNormalMriWorkstation,
  totalCasesForRole,
  type Fellow,
} from "@/components/admin/shared";

const knee = getCourseById("knee-mri");
const shoulder = getCourseById("shoulder-mri");

function mkFellow(overrides: Partial<Fellow> = {}): Fellow {
  return {
    id: "learner-1",
    role: "fellow",
    preQuizScore: 10,
    preQuizTotal: 12,
    postQuizScore: 10,
    postQuizTotal: 12,
    preSurveyCompleted: true,
    preSurveyResponses: [],
    postSurveyCompleted: true,
    postSurveyResponses: [],
    postRetroResponses: [],
    preQuizResponses: [],
    postQuizResponses: [],
    modulesCompleted: 6,
    casesCompleted: 6,
    normalMriComplete: true,
    moduleProgress: [],
    caseAttempts: [],
    ...overrides,
  };
}

describe("hasNormalMriWorkstation", () => {
  it("treats every current MRI course as a workstation course", () => {
    expect(hasNormalMriWorkstation(getCourseById("knee-mri"))).toBe(true);
    expect(hasNormalMriWorkstation(getCourseById("shoulder-mri"))).toBe(true);
    expect(hasNormalMriWorkstation(getCourseById("hip-mri"))).toBe(true);
    expect(hasNormalMriWorkstation(getCourseById("elbow-mri"))).toBe(true);
  });
});

describe("fellowStatus", () => {
  it("keeps knee cases optional but still requires the workstation", () => {
    const totalModules = knee.modules.length;
    const totalCases = totalCasesForRole(knee, "fellow");

    expect(
      fellowStatus(
        mkFellow({ modulesCompleted: totalModules, casesCompleted: 0, normalMriComplete: true }),
        totalModules,
        totalCases,
        knee,
        12,
      ),
    ).toBe("Complete");

    expect(
      fellowStatus(
        mkFellow({ modulesCompleted: totalModules, casesCompleted: totalCases, normalMriComplete: false }),
        totalModules,
        totalCases,
        knee,
        12,
      ),
    ).toBe("In Progress");
  });

  it("requires the workstation for non-knee course completion", () => {
    const totalModules = shoulder.modules.length;
    const totalCases = totalCasesForRole(shoulder, "fellow");

    expect(
      fellowStatus(
        mkFellow({ modulesCompleted: totalModules, casesCompleted: totalCases, normalMriComplete: false }),
        totalModules,
        totalCases,
        shoulder,
        12,
      ),
    ).toBe("In Progress");

    expect(
      fellowStatus(
        mkFellow({ modulesCompleted: totalModules, casesCompleted: totalCases, normalMriComplete: true }),
        totalModules,
        totalCases,
        shoulder,
        12,
      ),
    ).toBe("Complete");
  });
});
