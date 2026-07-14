import type { QuizItem, TourStep } from "@/content/normal-mri-types";

export type KnowledgeCheckMode = "identify" | "locate" | "mastery";
export type KnowledgeTrialKind = "identify" | "locate";

export interface KnowledgeTrial extends QuizItem {
  trialId: string;
  kind: KnowledgeTrialKind;
  optOrder: number[];
  correctPos: number;
}

export const MASTERY_SOURCE_COUNT = 5;
export const MASTERY_TRIAL_COUNT = MASTERY_SOURCE_COUNT * 2;
export const NORMAL_MRI_PASS_PERCENT = 70;

const sameCoordinate = (a: number, b: number) => Math.abs(a - b) < 0.001;

/**
 * A multiple-choice answer may be a diagnosis, pitfall, plane, or management
 * concept rather than the anatomy under its marker. The Guided Tour is the
 * canonical source for that marker's anatomical label, so Locate never turns a
 * conceptual answer into a misleading "Find the ..." prompt.
 */
export function labelQuizItemsFromTour(
  items: readonly QuizItem[],
  tour: readonly TourStep[],
): QuizItem[] {
  return items.map((item) => {
    if (item.locateLabel?.trim()) return item;
    const matchingStep = tour.find(
      (step) =>
        step.sliceIndex === item.sliceIndex &&
        step.markers.some(
          (marker) =>
            sameCoordinate(marker.x, item.marker.x) &&
            sameCoordinate(marker.y, item.marker.y) &&
            !!marker.label?.trim(),
        ),
    );
    const matchingMarker = matchingStep?.markers.find(
      (marker) =>
        sameCoordinate(marker.x, item.marker.x) &&
        sameCoordinate(marker.y, item.marker.y) &&
        !!marker.label?.trim(),
    );
    return matchingMarker?.label
      ? {
          ...item,
          locateLabel: matchingMarker.label,
          locateExplanation: item.locateExplanation ?? matchingStep?.note,
        }
      : item;
  });
}

export function locatableItemCount(items: readonly QuizItem[]): number {
  return items.filter((item) => !!item.locateLabel?.trim()).length;
}

export function shouldRecordPlaneResult(mode: KnowledgeCheckMode): boolean {
  return mode === "mastery";
}

export function isPassingMasteryScore(score: number, total: number): boolean {
  return total > 0 && score * 100 >= total * NORMAL_MRI_PASS_PERCENT;
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function canStartMastery(items: readonly QuizItem[]): boolean {
  return locatableItemCount(items) >= MASTERY_SOURCE_COUNT;
}

/**
 * Practice uses the full plane bank in one chosen response format. Mastery uses
 * five source landmarks exactly twice: once for identification and once for
 * localization, yielding ten equally weighted blinded trials and a true 70%
 * integer pass boundary.
 */
export function buildKnowledgeRound(
  items: readonly QuizItem[],
  mode: KnowledgeCheckMode,
  random: () => number = Math.random,
): KnowledgeTrial[] {
  const eligibleItems = mode === "identify"
    ? [...items]
    : items.filter((item) => !!item.locateLabel?.trim());
  if (mode === "mastery" && !canStartMastery(eligibleItems)) return [];

  const sourceItems =
    mode === "mastery"
      ? shuffle(eligibleItems, random).slice(0, MASTERY_SOURCE_COUNT)
      : eligibleItems;

  const specs: { item: QuizItem; kind: KnowledgeTrialKind }[] = [];
  if (mode === "mastery") {
    sourceItems.forEach((item, index) => {
      specs.push({ item, kind: "identify" });
      specs.push({ item: sourceItems[(index + 2) % sourceItems.length], kind: "locate" });
    });
  } else {
    sourceItems.forEach((item) => specs.push({ item, kind: mode }));
  }

  return specs.map(({ item, kind }, index) => {
    const optOrder = shuffle(item.options.map((_, optionIndex) => optionIndex), random);
    return {
      ...item,
      trialId: `${item.id}-${kind}-${index}`,
      kind,
      optOrder,
      correctPos: optOrder.indexOf(item.answer),
    };
  });
}
