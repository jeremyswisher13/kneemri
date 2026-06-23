import type { TourStep } from "@/content/normal-mri-types";

export interface TourFocusTarget {
  itemId: string;
  sliceIndex: number;
  marker: { x: number; y: number };
  structure: string;
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const textMatches = (a: string, b: string) => {
  const left = normalize(a);
  const right = normalize(b);
  return Boolean(left && right && (left.includes(right) || right.includes(left)));
};

const markerDistance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export function focusTargetKey(target?: TourFocusTarget | null) {
  if (!target) return "";
  return [
    target.itemId,
    target.sliceIndex,
    target.marker.x,
    target.marker.y,
    normalize(target.structure),
  ].join(":");
}

export function findFocusedTourStepIndex(steps: TourStep[], target?: TourFocusTarget | null) {
  if (!target || !steps.length) return 0;

  const sameSlice = steps
    .map((step, index) => ({ step, index }))
    .filter(({ step }) => step.sliceIndex === target.sliceIndex);

  const sameSliceTextMatch = sameSlice.find(({ step }) =>
    step.markers.some((marker) => textMatches(marker.label ?? "", target.structure)) ||
    textMatches(step.title, target.structure),
  );
  if (sameSliceTextMatch) return sameSliceTextMatch.index;

  const titleMatch = steps.findIndex((step) => textMatches(step.title, target.structure));
  if (titleMatch >= 0) return titleMatch;

  const nearestOnSameSlice = sameSlice
    .flatMap(({ step, index }) => step.markers.map((marker) => ({ index, marker })))
    .sort((a, b) => markerDistance(a.marker, target.marker) - markerDistance(b.marker, target.marker))[0];
  if (nearestOnSameSlice) return nearestOnSameSlice.index;

  const firstSameSlice = sameSlice[0];
  return firstSameSlice ? firstSameSlice.index : 0;
}
