import { describe, expect, it } from "vitest";
import { getCourseById } from "@/content/courses";
import {
  addLocalPreviewWrongAnswerToReview,
  clearLocalPreviewProgress,
  getLocalPreviewProgress,
  getLocalPreviewReviewCards,
  recordLocalPreviewCaseAttempt,
  recordLocalPreviewModule,
  recordLocalPreviewNormalPlane,
  recordLocalPreviewQuiz,
  recordLocalPreviewSurvey,
  saveLocalPreviewReviewCard,
} from "@/lib/local-preview-progress";
import { normalPlaneIdsFor } from "@/lib/normal-plane-ids";

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

describe("local preview progress", () => {
  it("tracks course-scoped modules, normal MRI planes, cases, and assessments", () => {
    const storage = memoryStorage();
    const shoulder = getCourseById("shoulder-mri");

    for (const mod of shoulder.modules) {
      recordLocalPreviewModule(mod.id, 2, 3, shoulder.id, storage);
    }
    for (const planeId of normalPlaneIdsFor(shoulder.bodyRegion)) {
      recordLocalPreviewNormalPlane(planeId, 3, 3, storage);
    }
    for (const c of shoulder.coreCases) {
      recordLocalPreviewCaseAttempt(c.id, {}, "", shoulder.id, storage);
    }
    recordLocalPreviewQuiz("pre", [], 7, 10, shoulder.id, storage);
    recordLocalPreviewSurvey("pre", [], shoulder.id, undefined, storage);
    recordLocalPreviewQuiz("post", [], 8, 10, shoulder.id, storage);
    recordLocalPreviewSurvey("post", [], shoulder.id, [], storage);

    const progress = getLocalPreviewProgress(shoulder, "fellow", storage);

    expect(progress.modulesCompleted).toBe(shoulder.modules.length);
    expect(progress.normalMriComplete).toBe(true);
    expect(progress.normalPlanesPassed).toBe(normalPlaneIdsFor(shoulder.bodyRegion).length);
    expect(progress.casesCompleted).toBe(shoulder.coreCases.length);
    expect(progress.preQuizCompleted).toBe(true);
    expect(progress.preSurveyCompleted).toBe(true);
    expect(progress.postQuizCompleted).toBe(true);
    expect(progress.postSurveyCompleted).toBe(true);
    expect(progress.postQuizUnlocked).toBe(true);
  });

  it("keeps unrelated course progress isolated", () => {
    const storage = memoryStorage();
    const shoulder = getCourseById("shoulder-mri");
    const elbow = getCourseById("elbow-mri");

    recordLocalPreviewModule(shoulder.modules[0].id, 1, 1, shoulder.id, storage);
    recordLocalPreviewCaseAttempt(elbow.coreCases[0].id, {}, "", elbow.id, storage);

    const shoulderProgress = getLocalPreviewProgress(shoulder, "fellow", storage);
    const elbowProgress = getLocalPreviewProgress(elbow, "fellow", storage);

    expect(shoulderProgress.modulesCompleted).toBe(1);
    expect(shoulderProgress.casesCompleted).toBe(0);
    expect(elbowProgress.modulesCompleted).toBe(0);
    expect(elbowProgress.casesCompleted).toBe(1);
  });

  it("stores missed questions as due review cards without overwriting future cards", () => {
    const storage = memoryStorage();

    addLocalPreviewWrongAnswerToReview("elbow-ucl-q1", "workstation", "elbow-mri", storage);
    const [card] = getLocalPreviewReviewCards(storage);

    expect(card.questionId).toBe("elbow-ucl-q1");
    expect(card.courseId).toBe("elbow-mri");
    expect(card.nextReviewDate).toBe(new Date().toISOString().split("T")[0]);

    saveLocalPreviewReviewCard({ ...card, nextReviewDate: "2999-01-01", interval: 99 }, storage);
    addLocalPreviewWrongAnswerToReview("elbow-ucl-q1", "workstation", "elbow-mri", storage);

    expect(getLocalPreviewReviewCards(storage)[0].nextReviewDate).toBe("2999-01-01");
  });

  it("can clear the sandboxed preview state", () => {
    const storage = memoryStorage();
    const knee = getCourseById("knee-mri");

    recordLocalPreviewModule(knee.modules[0].id, 1, 1, knee.id, storage);
    expect(getLocalPreviewProgress(knee, "fellow", storage).modulesCompleted).toBe(1);

    clearLocalPreviewProgress(storage);
    expect(getLocalPreviewProgress(knee, "fellow", storage).modulesCompleted).toBe(0);
  });
});
