import { describe, expect, it } from "vitest";
import { findFocusedTourStepIndex, type TourFocusTarget } from "./guided-tour-focus";
import type { TourStep } from "@/content/normal-mri-types";

const steps: TourStep[] = [
  {
    sliceIndex: 0,
    markers: [],
    title: "Get oriented",
    note: "Orientation step",
  },
  {
    sliceIndex: 4,
    markers: [{ x: 25, y: 50, label: "Anterior labrum" }],
    title: "Anterior labrum",
    note: "Labrum step",
  },
  {
    sliceIndex: 4,
    markers: [{ x: 75, y: 50, label: "Posterior labrum" }],
    title: "Posterior labrum",
    note: "Posterior step",
  },
  {
    sliceIndex: 7,
    markers: [{ x: 50, y: 30, label: "Ulnar nerve (cubital tunnel)" }],
    title: "Ulnar nerve (cubital tunnel)",
    note: "Nerve step",
  },
];

const target = (patch: Partial<TourFocusTarget>): TourFocusTarget => ({
  itemId: "q1",
  sliceIndex: 4,
  marker: { x: 25, y: 50 },
  structure: "Anterior labrum",
  ...patch,
});

describe("findFocusedTourStepIndex", () => {
  it("opens the same-slice tour step whose marker matches the missed structure", () => {
    expect(findFocusedTourStepIndex(steps, target({ structure: "Anterior labrum" }))).toBe(1);
  });

  it("falls back to the nearest marker on the missed slice for concept questions", () => {
    expect(
      findFocusedTourStepIndex(
        steps,
        target({
          marker: { x: 78, y: 52 },
          structure: "Posterior instability",
        }),
      ),
    ).toBe(2);
  });

  it("can match a structure title when no same-slice text match is available", () => {
    expect(
      findFocusedTourStepIndex(
        steps,
        target({
          sliceIndex: 3,
          marker: { x: 52, y: 31 },
          structure: "Ulnar nerve",
        }),
      ),
    ).toBe(3);
  });
});
