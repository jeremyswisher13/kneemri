import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { normalMriPath, getCourseById } from "@/content/courses";
import {
  normalKneeLearn,
  advancedChallenge,
  crossPlane,
  kneeImageCaq,
  structurePearl,
  structureReading,
} from "@/content/normal-knee-learn";
import {
  normalShoulderLearn,
  shoulderAdvanced,
  shoulderCrossPlane,
  shoulderImageCaq,
  structureShoulderPearl,
  structureShoulderReading,
} from "@/content/normal-shoulder-learn";
import {
  normalHipLearn,
  hipAdvanced,
  hipCrossPlane,
  hipImageCaq,
  structureHipPearl,
  structureHipReading,
} from "@/content/normal-hip-learn";
import {
  normalElbowLearn,
  elbowAdvanced,
  elbowCrossPlane,
  elbowImageCaq,
  structureElbowPearl,
  structureElbowReading,
} from "@/content/normal-elbow-learn";
import {
  normalKneeSeries,
  normalShoulderSeries,
  normalHipSeries,
  normalElbowSeries,
  type NormalWorkstationSeries,
} from "@/content/normal-workstation-series";
import type { AdvancedQ, CorrelationItem, ImageCaqQ, PlaneLearn } from "@/content/normal-mri-types";
import {
  canStartMastery,
  labelQuizItemsFromTour,
} from "@/components/normal/knowledge-check-logic";

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
const sliceFile = (dir: string, sliceIndex: number) =>
  join(STACK_ROOT, stackFolder(dir), `slice_${String(sliceIndex + 1).padStart(2, "0")}.jpg`);

function expectPercentMarker(marker: { x: number; y: number }, label: string) {
  expect(Number.isFinite(marker.x), `${label} x`).toBe(true);
  expect(Number.isFinite(marker.y), `${label} y`).toBe(true);
  expect(marker.x, `${label} x`).toBeGreaterThanOrEqual(0);
  expect(marker.x, `${label} x`).toBeLessThanOrEqual(100);
  expect(marker.y, `${label} y`).toBeGreaterThanOrEqual(0);
  expect(marker.y, `${label} y`).toBeLessThanOrEqual(100);
}

function expectValidAnswer(answer: number, options: string[], label: string) {
  expect(Number.isInteger(answer), `${label} answer`).toBe(true);
  expect(answer, `${label} answer`).toBeGreaterThanOrEqual(0);
  expect(answer, `${label} answer`).toBeLessThan(options.length);
  expect(options[answer]?.trim(), `${label} correct option`).toBeTruthy();
}

function expectUnique(ids: string[], label: string) {
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  expect(duplicates, `${label} duplicate ids`).toEqual([]);
}

const EXPECTED_MODES = [
  "Explore",
  "Guided Tour",
  "Practice & Mastery",
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
    firstCrossPlaneTarget: { x: 69, y: 55 },
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
    expectedQuizCounts: { "cor-t2fs": 5, "axi-t2fs": 5, "sag-ir": 5 },
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
        expect(learn.quiz.length, `${seriesId} mastery source count`).toBeGreaterThanOrEqual(5);
        const labeledItems = labelQuizItemsFromTour(learn.quiz, learn.tour);
        expect(canStartMastery(labeledItems), `${seriesId} mastery-ready landmarks`).toBe(true);
        expect(learn.tour[0]?.title, `${seriesId} first tour step`).toBe("Get oriented");
        expect(learn.quiz[0]?.options[learn.quiz[0].answer], `${seriesId} first answer`).toBeTruthy();
      }
    });

    it("keeps all normal workstation markers, slices, and answer keys valid", () => {
      const seriesById = new Map(workstation.series.map((series) => [series.id, series]));
      const knownDirs = new Map(workstation.series.map((series) => [series.dir, series]));
      const quizIds: string[] = [];

      for (const [seriesId, learn] of Object.entries(workstation.learn)) {
        const series = seriesById.get(seriesId);
        expect(series, `${seriesId} series metadata`).toBeTruthy();
        if (!series) continue;

        learn.tour.forEach((step, stepIndex) => {
          const label = `${seriesId} tour step ${stepIndex + 1} (${step.title})`;
          expect(step.title.trim(), `${label} title`).toBeTruthy();
          expect(step.note.trim(), `${label} note`).toBeTruthy();
          expect(step.sliceIndex, `${label} sliceIndex`).toBeGreaterThanOrEqual(0);
          expect(step.sliceIndex, `${label} sliceIndex`).toBeLessThan(series.count);
          expect(existsSync(sliceFile(series.dir, step.sliceIndex)), `${label} slice file`).toBe(true);
          step.markers.forEach((marker, markerIndex) => {
            expectPercentMarker(marker, `${label} marker ${markerIndex + 1}`);
            if (marker.label !== undefined) {
              expect(marker.label.trim(), `${label} marker ${markerIndex + 1} label`).toBeTruthy();
            }
          });
        });

        learn.quiz.forEach((item) => {
          quizIds.push(item.id);
          const label = `${seriesId} quiz ${item.id}`;
          expect(item.id.trim(), `${label} id`).toBeTruthy();
          expect(item.prompt.trim(), `${label} prompt`).toBeTruthy();
          expect(item.explanation.trim(), `${label} explanation`).toBeTruthy();
          expect(item.options.length, `${label} options`).toBeGreaterThanOrEqual(2);
          expect(item.options.every((option) => option.trim()), `${label} blank options`).toBe(true);
          expectValidAnswer(item.answer, item.options, label);
          expect(item.sliceIndex, `${label} sliceIndex`).toBeGreaterThanOrEqual(0);
          expect(item.sliceIndex, `${label} sliceIndex`).toBeLessThan(series.count);
          expect(existsSync(sliceFile(series.dir, item.sliceIndex)), `${label} slice file`).toBe(true);
          expectPercentMarker(item.marker, `${label} marker`);
        });
      }

      expectUnique(quizIds, `${workstation.courseId} knowledge-check`);

      const crossPlaneIds = workstation.crossPlane.map((item) => item.id);
      expectUnique(crossPlaneIds, `${workstation.courseId} cross-plane`);
      workstation.crossPlane.forEach((item) => {
        const fromSeries = knownDirs.get(item.from.dir);
        const toSeries = knownDirs.get(item.to.dir);
        const label = `${workstation.courseId} cross-plane ${item.id}`;
        expect(item.prompt.trim(), `${label} prompt`).toBeTruthy();
        expect(item.explanation.trim(), `${label} explanation`).toBeTruthy();
        expect(fromSeries, `${label} source series`).toBeTruthy();
        expect(toSeries, `${label} target series`).toBeTruthy();
        if (fromSeries) {
          expect(item.from.sliceIndex, `${label} source sliceIndex`).toBeGreaterThanOrEqual(0);
          expect(item.from.sliceIndex, `${label} source sliceIndex`).toBeLessThan(fromSeries.count);
          expect(existsSync(sliceFile(item.from.dir, item.from.sliceIndex)), `${label} source slice file`).toBe(true);
        }
        if (toSeries) {
          expect(item.to.sliceIndex, `${label} target sliceIndex`).toBeGreaterThanOrEqual(0);
          expect(item.to.sliceIndex, `${label} target sliceIndex`).toBeLessThan(toSeries.count);
          expect(existsSync(sliceFile(item.to.dir, item.to.sliceIndex)), `${label} target slice file`).toBe(true);
        }
        expect(item.from.label.trim(), `${label} source label`).toBeTruthy();
        expectPercentMarker(item.from, `${label} source marker`);
        expectValidAnswer(item.to.answer, item.to.candidates.map((_, index) => String(index)), label);
        item.to.candidates.forEach((candidate, candidateIndex) =>
          expectPercentMarker(candidate, `${label} candidate ${candidateIndex + 1}`),
        );
      });

      expectUnique(workstation.advanced.map((item) => item.id), `${workstation.courseId} advanced`);
      workstation.advanced.forEach((item) => {
        const label = `${workstation.courseId} advanced ${item.id}`;
        expect(item.topic.trim(), `${label} topic`).toBeTruthy();
        expect(item.prompt.trim(), `${label} prompt`).toBeTruthy();
        expect(item.explanation.trim(), `${label} explanation`).toBeTruthy();
        expect(item.options.length, `${label} options`).toBeGreaterThanOrEqual(2);
        expect(item.options.every((option) => option.trim()), `${label} blank options`).toBe(true);
        expectValidAnswer(item.answer, item.options, label);
      });

      expectUnique(workstation.imageCaq.map((item) => item.id), `${workstation.courseId} image CAQ`);
      workstation.imageCaq.forEach((item) => {
        const series = knownDirs.get(item.dir);
        const label = `${workstation.courseId} image CAQ ${item.id}`;
        expect(series, `${label} series`).toBeTruthy();
        expect(item.count, `${label} count`).toBe(stackCount(item.dir));
        expect(item.startIndex, `${label} startIndex`).toBeGreaterThanOrEqual(0);
        expect(item.startIndex, `${label} startIndex`).toBeLessThan(item.count);
        expect(existsSync(sliceFile(item.dir, item.startIndex)), `${label} slice file`).toBe(true);
        expect(item.topic.trim(), `${label} topic`).toBeTruthy();
        expect(item.vignette.trim(), `${label} vignette`).toBeTruthy();
        expect(item.explanation.trim(), `${label} explanation`).toBeTruthy();
        expect(item.options.length, `${label} options`).toBeGreaterThanOrEqual(2);
        expect(item.options.every((option) => option.trim()), `${label} blank options`).toBe(true);
        expectValidAnswer(item.answer, item.options, label);
      });
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

const contentText = (...sources: unknown[]) => JSON.stringify(sources).toLowerCase();

describe("normal MRI must-not-overcall teaching safeguards", () => {
  it("locks the vision-reviewed knee ACL and lateral-meniscus targets", () => {
    const sagittal = normalKneeLearn["sag-pdfs"];
    const aclTour = sagittal.tour.find((step) => step.title === "Anterior cruciate ligament");
    const aclQuiz = sagittal.quiz.find((item) => item.id === "sag-sid-1");
    const aclCrossPlane = crossPlane.find((item) => item.id === "xp-acl-origin");
    const meniscusCrossPlane = crossPlane.find((item) => item.id === "xp-meniscus");
    const poplitealTour = sagittal.tour.find((step) => step.title === "Popliteal vessels");

    expect(aclTour?.sliceIndex).toBe(12);
    expect(aclTour?.markers[0]).toMatchObject({ x: 49, y: 55 });
    expect(aclQuiz).toMatchObject({ sliceIndex: 12, marker: { x: 49, y: 55 } });
    expect(aclCrossPlane?.from).toMatchObject({ sliceIndex: 12, x: 49, y: 55 });
    expect(kneeImageCaq.find((item) => item.id === "icaq-1")?.startIndex).toBe(12);

    expect(meniscusCrossPlane?.from.label.toLowerCase()).toContain("lateral meniscus");
    expect(meniscusCrossPlane?.to.candidates[meniscusCrossPlane.to.answer]).toEqual({ x: 69, y: 55 });
    expect(poplitealTour?.markers[0]).toMatchObject({ x: 66, y: 55 });
  });

  it("keeps the knee root, TT-TG, and MCL caveats", () => {
    const text = contentText(
      normalKneeLearn,
      structurePearl,
      structureReading,
      advancedChallenge,
      crossPlane,
      kneeImageCaq,
    );
    expect(text).toContain("extrusion alone neither proves nor excludes a root tear");
    expect(text).toContain("as a standalone surgical rule");
    expect(text).toContain("deep mcl");
  });

  it("keeps the shoulder impingement and Buford-complex caveats", () => {
    const text = contentText(
      normalShoulderLearn,
      structureShoulderPearl,
      structureShoulderReading,
      shoulderAdvanced,
      shoulderCrossPlane,
      shoulderImageCaq,
    );
    expect(text).toContain("not as a standalone diagnosis of impingement");
    expect(text).toContain("buford complex can coexist");
  });

  it("keeps the hip FAI and GTPS caveats", () => {
    const text = contentText(
      normalHipLearn,
      structureHipPearl,
      structureHipReading,
      hipAdvanced,
      hipCrossPlane,
      hipImageCaq,
    );
    expect(text).toContain("morphology is not symptomatic fai");
    expect(text).toContain("abductor tendon disease");
  });

  it("keeps the elbow OCD, UCL, and ulnar-nerve caveats", () => {
    const text = contentText(
      normalElbowLearn,
      structureElbowPearl,
      structureElbowReading,
      elbowAdvanced,
      elbowCrossPlane,
      elbowImageCaq,
    );
    expect(text).toContain("coronal and sagittal together");
    expect(text).toContain("beyond the articular-cartilage edge");
    expect(text).toContain("signal alone does not diagnose entrapment");
  });
});
