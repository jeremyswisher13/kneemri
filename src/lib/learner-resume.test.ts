import { describe, expect, it } from "vitest";
import {
  LEARNER_RESUME_KEY,
  clearLearnerResume,
  isHomeScreenLaunch,
  readLearnerResume,
  saveLearnerResume,
  shouldResumeHomeScreenLaunch,
  suggestedNextStep,
} from "@/lib/learner-resume";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe("learner resume", () => {
  it("stores and reads the last meaningful learning state", () => {
    const storage = memoryStorage();
    saveLearnerResume(
      {
        path: "/courses/elbow-mri/normal-elbow-mri",
        title: "Interactive Normal Elbow MRI",
        courseId: "elbow-mri",
        courseTitle: "Elbow MRI",
        modeLabel: "Image CAQ",
        seriesLabel: "Axial T2-FS",
      },
      storage,
    );

    const resume = readLearnerResume(storage);
    expect(resume?.path).toBe("/courses/elbow-mri/normal-elbow-mri");
    expect(resume?.courseId).toBe("elbow-mri");
    expect(resume?.modeLabel).toBe("Image CAQ");
  });

  it("rejects unsafe resume paths and can clear state", () => {
    const storage = memoryStorage();
    storage.setItem(
      LEARNER_RESUME_KEY,
      JSON.stringify({
        path: "https://example.com",
        title: "Bad",
        updatedAt: new Date().toISOString(),
      }),
    );
    expect(readLearnerResume(storage)).toBeNull();

    saveLearnerResume({ path: "/courses/knee-mri", title: "Knee" }, storage);
    clearLearnerResume(storage);
    expect(storage.getItem(LEARNER_RESUME_KEY)).toBeNull();
  });

  it("suggests the next normal-workstation step", () => {
    expect(suggestedNextStep("Explore")).toBe("Next: Guided Tour");
    expect(suggestedNextStep("Cross-Plane")).toBe("Next: Image CAQ");
    expect(suggestedNextStep()).toBe("Continue where you left off.");
  });

  it("auto-resumes only from explicit home-screen launch URLs", () => {
    const resume = {
      path: "/courses/shoulder-mri/normal-shoulder-mri?mode=tour&series=cor-pd",
      title: "Interactive Normal Shoulder MRI",
      updatedAt: new Date().toISOString(),
    };

    expect(isHomeScreenLaunch("?source=homescreen")).toBe(true);
    expect(isHomeScreenLaunch("?source=pwa")).toBe(true);
    expect(isHomeScreenLaunch("?source=standalone")).toBe(true);
    expect(isHomeScreenLaunch("")).toBe(false);
    expect(shouldResumeHomeScreenLaunch("?source=homescreen", resume)).toBe(true);
    expect(shouldResumeHomeScreenLaunch("", resume)).toBe(false);
    expect(shouldResumeHomeScreenLaunch("?source=homescreen", null)).toBe(false);
  });
});
