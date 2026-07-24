import { describe, expect, it } from "vitest";
import { hipPearls } from "@/content/daily-pearls";
import { normalHipLearn, structureHipReading } from "@/content/normal-hip-learn";
import { hipCaseRegistry } from "@/content/hip/cases";
import { hipModuleRegistry } from "@/content/hip/modules";
import { hipAnatomySections, hipMeasurementSections } from "@/content/hip/reference";
import { LEARNING_TRACKS_BY_REGION } from "@/content/learning-paths";
import { moduleQuizzes } from "@/content/quizzes/module-quizzes";
import { surgicalCorrelatesByRegion } from "@/content/surgical-correlates";

const text = (...values: unknown[]) => JSON.stringify(values);
const leafStrings = (value: unknown): string[] => {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(leafStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(leafStrings);
  return [];
};
const hipModuleQuizContent = Object.entries(moduleQuizzes)
  .filter(([moduleId]) => moduleId.startsWith("hip-"))
  .flatMap(([, questions]) =>
    questions.map(({ stem, options, explanation }) => ({ stem, options, explanation })),
  );

describe("hip medical wording safeguards", () => {
  it("keeps femoral-neck stress-fracture side and extent rules separate", () => {
    const content = text(normalHipLearn, structureHipReading, hipModuleRegistry, hipMeasurementSections);

    expect(content).toContain("any superolateral/tension-side fracture is high-risk");
    expect(content).toContain("Incomplete compression (<50% width)");
    expect(content).not.toContain("superolateral/tension-side line beyond ~50%");
  });

  it("uses current cam-morphology threshold language without diagnosing FAI from one angle", () => {
    const content = text(
      normalHipLearn,
      structureHipReading,
      hipModuleRegistry,
      hipAnatomySections,
      hipMeasurementSections,
      hipPearls,
      surgicalCorrelatesByRegion.hip,
      hipModuleQuizContent,
    );

    expect(content).toContain("≥60");
    expect(content).toContain("morphology is not symptomatic FAI by itself");
    expect(content).not.toContain("Cam (pathologic)");
    expect(content).not.toContain(">55 degrees defines cam morphology");
    expect(content).not.toMatch(/pathologic threshold is >55/i);
  });

  it("uses femoral-head SIFFH terminology and does not import the knee acronym", () => {
    const caseItem = hipCaseRegistry.find((item) => item.id === "hip-transient-bme-vs-sifk");
    expect(caseItem).toBeTruthy();
    const learningPathLabels = LEARNING_TRACKS_BY_REGION.hip.flatMap((track) =>
      track.cases.map((caseItem) => caseItem.label),
    );

    const learnerFacingCase = text(
      caseItem?.title,
      caseItem?.clinicalScenario,
      caseItem?.keyDiagnoses,
      caseItem?.modelReport,
      caseItem?.teachingPoints,
      caseItem?.searchPatternFindings,
      caseItem?.teachingImages?.map(({ alt, caption }) => ({ alt, caption })),
      hipModuleQuizContent,
      learningPathLabels,
    );
    expect(learnerFacingCase).toContain("SIFFH");
    expect(learnerFacingCase).not.toContain("SIFK");
  });

  it("does not use one absent AVN sign or a normal labrum to exclude a pain source", () => {
    const statements = leafStrings(hipCaseRegistry);
    const absentDoubleLineExclusion =
      /(?:(?:AVN|osteonecrosis)[\s\S]{0,120}(?:excluded|ruled out)[\s\S]{0,120}(?:absen\w*|no)[\s\S]{0,80}double-line|(?:absen\w*|no)[\s\S]{0,80}double-line[\s\S]{0,120}(?:excludes?|rules? out)[\s\S]{0,80}(?:AVN|osteonecrosis))/i;

    expect(statements.filter((statement) => absentDoubleLineExclusion.test(statement))).toEqual([]);
    expect(
      statements.filter((statement) =>
        /exclude(?:s|d)? (?:a )?(?:competing )?intra-articular pain/i.test(statement),
      ),
    ).toEqual([]);
    expect(
      statements.filter((statement) =>
        /exclude(?:s|d)? (?:a )?competing labral cause/i.test(statement),
      ),
    ).toEqual([]);
  });

  it("keeps MR arthrography selective after an adequate 3-T examination", () => {
    const content = text(
      normalHipLearn,
      hipModuleRegistry,
      hipAnatomySections,
      hipMeasurementSections,
      surgicalCorrelatesByRegion.hip,
    );

    expect(content.toLowerCase()).toContain("high-quality dedicated 3-t");
    expect(content).toContain("equivocal");
    expect(content).not.toContain("MR arthrography is the most sensitive modality");
  });
});
