import { describe, expect, it } from "vitest";
import type { QuizItem, TourStep } from "@/content/normal-mri-types";
import {
  MASTERY_SOURCE_COUNT,
  MASTERY_TRIAL_COUNT,
  NORMAL_MRI_PASS_PERCENT,
  buildKnowledgeRound,
  canStartMastery,
  isPassingMasteryScore,
  labelQuizItemsFromTour,
  locatableItemCount,
  shouldRecordPlaneResult,
} from "./knowledge-check-logic";

const items: QuizItem[] = Array.from({ length: 7 }, (_, index) => ({
  id: `q-${index}`,
  sliceIndex: index,
  marker: { x: 20 + index, y: 30 + index },
  locateLabel: `Landmark ${index}`,
  prompt: `Question ${index}`,
  options: ["A", "B", "C", "D"],
  answer: index % 4,
  explanation: `Explanation ${index}`,
}));

describe("knowledge-check round construction", () => {
  it("keeps formative practice in one response format across the full bank", () => {
    const round = buildKnowledgeRound(items, "locate", () => 0.5);
    expect(round).toHaveLength(items.length);
    expect(round.every((trial) => trial.kind === "locate")).toBe(true);
    expect(new Set(round.map((trial) => trial.id)).size).toBe(items.length);
  });

  it("builds a balanced ten-trial mastery round from five source landmarks", () => {
    const round = buildKnowledgeRound(items, "mastery", () => 0.5);
    expect(round).toHaveLength(MASTERY_TRIAL_COUNT);
    expect(round.filter((trial) => trial.kind === "identify")).toHaveLength(MASTERY_SOURCE_COUNT);
    expect(round.filter((trial) => trial.kind === "locate")).toHaveLength(MASTERY_SOURCE_COUNT);

    const sourceIds = new Set(round.map((trial) => trial.id));
    expect(sourceIds.size).toBe(MASTERY_SOURCE_COUNT);
    for (const id of sourceIds) {
      const trials = round.filter((trial) => trial.id === id);
      expect(trials.map((trial) => trial.kind).sort()).toEqual(["identify", "locate"]);
    }
  });

  it("requires at least five unique landmarks before mastery can start", () => {
    expect(canStartMastery(items.slice(0, 4))).toBe(false);
    expect(canStartMastery(items.slice(0, 5))).toBe(true);
  });

  it("uses the tour marker as the anatomical locate label for conceptual questions", () => {
    const conceptualItem: QuizItem = {
      ...items[0],
      locateLabel: undefined,
      prompt: "Which plane best evaluates extrusion?",
      options: ["Coronal", "Sagittal", "Axial"],
      answer: 0,
    };
    const tour: TourStep[] = [{
      sliceIndex: conceptualItem.sliceIndex,
      markers: [{ ...conceptualItem.marker, label: "Posterior horn of the medial meniscus" }],
      title: "Posterior horn",
      note: "Trace the horn to the root.",
    }];

    const [labeled] = labelQuizItemsFromTour([conceptualItem], tour);
    expect(labeled.locateLabel).toBe("Posterior horn of the medial meniscus");
    expect(labeled.locateExplanation).toBe("Trace the horn to the root.");
    expect(labeled.options[labeled.answer]).toBe("Coronal");
  });

  it("excludes unverified markers from localization without dropping identify practice", () => {
    const unlabeled = { ...items[0], locateLabel: undefined };
    expect(locatableItemCount([unlabeled, items[1]])).toBe(1);
    expect(buildKnowledgeRound([unlabeled, items[1]], "identify", () => 0.5)).toHaveLength(2);
    expect(buildKnowledgeRound([unlabeled, items[1]], "locate", () => 0.5)).toHaveLength(1);
  });

  it("records only mastery and uses an exact 70% boundary", () => {
    expect(NORMAL_MRI_PASS_PERCENT).toBe(70);
    expect(shouldRecordPlaneResult("identify")).toBe(false);
    expect(shouldRecordPlaneResult("locate")).toBe(false);
    expect(shouldRecordPlaneResult("mastery")).toBe(true);
    expect(isPassingMasteryScore(6, 10)).toBe(false);
    expect(isPassingMasteryScore(7, 10)).toBe(true);
  });
});
