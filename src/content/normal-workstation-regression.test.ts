import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { normalMriPath, getCourseById } from "@/content/courses";
import {
  normalKneeLearn,
  advancedChallenge,
  crossPlane,
  kneeImageCaq,
} from "@/content/normal-knee-learn";
import {
  normalShoulderLearn,
  shoulderAdvanced,
  shoulderCrossPlane,
  shoulderImageCaq,
} from "@/content/normal-shoulder-learn";
import {
  normalHipLearn,
  hipAdvanced,
  hipCrossPlane,
  hipImageCaq,
} from "@/content/normal-hip-learn";
import {
  normalElbowLearn,
  elbowAdvanced,
  elbowCrossPlane,
  elbowImageCaq,
} from "@/content/normal-elbow-learn";
import {
  normalKneeSeries,
  normalShoulderSeries,
  normalHipSeries,
  normalElbowSeries,
  type NormalWorkstationSeries,
} from "@/content/normal-workstation-series";
import type { AdvancedQ, CorrelationItem, ImageCaqQ, PlaneLearn } from "@/content/normal-mri-types";

type WorkstationContract = {
  courseId: string;
  expectedRoute: string;
  expectedModes: string[];
  series: NormalWorkstationSeries[];
  learn: Record<string, PlaneLearn>;
  expectedSeriesLabels: string[];
  expectedTourCounts: Record<string, number>;
  expectedQuizCounts: Record<string, number>;
  crossPlane: CorrelationItem[];
  expectedCrossPlaneCount: number;
  firstCrossPlaneTarget: { x: number; y: number };
  advanced: AdvancedQ[];
  expectedAdvancedCount: number;
  imageCaq: ImageCaqQ[];
  expectedImageCaqCount: number;
};

const STACK_ROOT = join(process.cwd(), "public/images/teaching/stacks");
const stackFolder = (dir: string) => dir.split("/").filter(Boolean).pop() as string;
const stackCount = (dir: string) =>
  readdirSync(join(STACK_ROOT, stackFolder(dir))).filter((file) => file.endsWith(".jpg")).length;

const EXPECTED_MODES = [
  "Explore",
  "Guided Tour",
  "Knowledge Check",
  "Cross-Plane",
  "Compare",
  "Advanced",
  "Image CAQ",
];

const workstations: WorkstationContract[] = [
  {
    courseId: "knee-mri",
    expectedRoute: "/courses/knee-mri/normal-knee-mri",
    expectedModes: EXPECTED_MODES,
    series: normalKneeSeries,
    learn: normalKneeLearn,
    expectedSeriesLabels: ["Sagittal PD-FS", "Coronal PD-FS", "Axial T2-FS", "Sagittal T1"],
    expectedTourCounts: { "sag-pdfs": 11, "cor-pdfs": 9, "axi-t2fs": 9, "sag-t1": 10 },
    expectedQuizCounts: { "sag-pdfs": 12, "cor-pdfs": 11, "axi-t2fs": 11, "sag-t1": 11 },
    crossPlane,
    expectedCrossPlaneCount: 13,
    firstCrossPlaneTarget: { x: 27, y: 56 },
    advanced: advancedChallenge,
    expectedAdvancedCount: 36,
    imageCaq: kneeImageCaq,
    expectedImageCaqCount: 7,
  },
  {
    courseId: "shoulder-mri",
    expectedRoute: "/courses/shoulder-mri/normal-shoulder-mri",
    expectedModes: EXPECTED_MODES,
    series: normalShoulderSeries,
    learn: normalShoulderLearn,
    expectedSeriesLabels: ["Sagittal T2-FS", "Coronal T2-FS", "Axial PD-FS", "Sagittal T1"],
    expectedTourCounts: { "sag-t2fs": 11, "cor-t2fs": 10, "axi-t2fs": 9, "sag-t1": 8 },
    expectedQuizCounts: { "sag-t2fs": 12, "cor-t2fs": 12, "axi-t2fs": 11, "sag-t1": 12 },
    crossPlane: shoulderCrossPlane,
    expectedCrossPlaneCount: 12,
    firstCrossPlaneTarget: { x: 34, y: 58 },
    advanced: shoulderAdvanced,
    expectedAdvancedCount: 34,
    imageCaq: shoulderImageCaq,
    expectedImageCaqCount: 7,
  },
  {
    courseId: "hip-mri",
    expectedRoute: "/courses/hip-mri/normal-hip-mri",
    expectedModes: EXPECTED_MODES,
    series: normalHipSeries,
    learn: normalHipLearn,
    expectedSeriesLabels: ["Coronal T2-FS", "Axial T2-FS", "Sagittal PD-FS"],
    expectedTourCounts: { "cor-t2fs": 11, axi: 8, sag: 9 },
    expectedQuizCounts: { "cor-t2fs": 9, axi: 6, sag: 7 },
    crossPlane: hipCrossPlane,
    expectedCrossPlaneCount: 5,
    firstCrossPlaneTarget: { x: 42, y: 45 },
    advanced: hipAdvanced,
    expectedAdvancedCount: 12,
    imageCaq: hipImageCaq,
    expectedImageCaqCount: 6,
  },
  {
    courseId: "elbow-mri",
    expectedRoute: "/courses/elbow-mri/normal-elbow-mri",
    expectedModes: EXPECTED_MODES,
    series: normalElbowSeries,
    learn: normalElbowLearn,
    expectedSeriesLabels: ["Coronal T2-FS", "Axial T2-FS", "Sagittal IR"],
    expectedTourCounts: { "cor-t2fs": 8, "axi-t2fs": 7, "sag-ir": 7 },
    expectedQuizCounts: { "cor-t2fs": 3, "axi-t2fs": 2, "sag-ir": 3 },
    crossPlane: elbowCrossPlane,
    expectedCrossPlaneCount: 7,
    firstCrossPlaneTarget: { x: 61, y: 54 },
    advanced: elbowAdvanced,
    expectedAdvancedCount: 10,
    imageCaq: elbowImageCaq,
    expectedImageCaqCount: 7,
  },
];

describe("normal MRI workstation regression contract", () => {
  describe.each(workstations)("$courseId", (workstation) => {
    it("keeps the expected route and mode set from the browser QA pass", () => {
      expect(normalMriPath(getCourseById(workstation.courseId))).toBe(workstation.expectedRoute);
      expect(workstation.expectedModes).toEqual(EXPECTED_MODES);
      expect(workstation.crossPlane.length > 0).toBe(true);
      expect(workstation.advanced.length > 0).toBe(true);
      expect(workstation.imageCaq.length > 0).toBe(true);
    });

    it("keeps page series in sync with the learn content and stack files", () => {
      const labels = workstation.series.map((series) => series.label);
      expect(labels).toEqual(workstation.expectedSeriesLabels);
      expect(workstation.series.map((series) => series.id)).toEqual(Object.keys(workstation.learn));

      for (const series of workstation.series) {
        expect(series.checklist.length, `${series.id} checklist`).toBeGreaterThan(0);
        expect(series.dir.startsWith("/images/teaching/stacks/"), `${series.id} dir`).toBe(true);
        expect(existsSync(join(STACK_ROOT, stackFolder(series.dir))), `${series.id} stack dir`).toBe(true);
        expect(series.count, `${series.id} count`).toBe(stackCount(series.dir));
        expect(series.startIndex ?? 0, `${series.id} startIndex`).toBeGreaterThanOrEqual(0);
        expect(series.startIndex ?? 0, `${series.id} startIndex`).toBeLessThan(series.count);
      }
    });

    it("keeps every guided tour and knowledge check at the known-good item counts", () => {
      for (const [seriesId, learn] of Object.entries(workstation.learn)) {
        expect(learn.tour.length, `${seriesId} tour count`).toBe(workstation.expectedTourCounts[seriesId]);
        expect(learn.quiz.length, `${seriesId} quiz count`).toBe(workstation.expectedQuizCounts[seriesId]);
        expect(learn.tour[0]?.title, `${seriesId} first tour step`).toBe("Get oriented");
        expect(learn.quiz[0]?.options[learn.quiz[0].answer], `${seriesId} first answer`).toBeTruthy();
      }
    });

    it("keeps the cross-plane drill, advanced bank, and image CAQ bank present", () => {
      expect(workstation.crossPlane.length).toBe(workstation.expectedCrossPlaneCount);
      const firstTarget = workstation.crossPlane[0].to.candidates[workstation.crossPlane[0].to.answer];
      expect(firstTarget).toEqual(workstation.firstCrossPlaneTarget);

      expect(workstation.advanced.length).toBe(workstation.expectedAdvancedCount);
      expect(workstation.advanced[0].options[workstation.advanced[0].answer]).toBeTruthy();

      expect(workstation.imageCaq.length).toBe(workstation.expectedImageCaqCount);
      expect(workstation.imageCaq[0].options[workstation.imageCaq[0].answer]).toBeTruthy();
    });
  });
});
