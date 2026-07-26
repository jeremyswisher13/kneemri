import { describe, expect, it } from "vitest";
import type { LocateSegmentRegion, QuizItem, TourStep } from "@/content/normal-mri-types";
import { isKnowledgeLocateHit } from "./knowledge-check-hit";
import {
  MAX_REGION_TOLERANCE,
  MIN_REGION_TOLERANCE,
  NEW_REGION_TOLERANCE,
  adjusterHandles,
  handleAriaLabel,
  isDegenerateRegion,
  markerOutsideRegion,
  seedRegion,
  withRegionPoint,
  withRegionTolerance,
  withoutRegion,
} from "./marker-adjuster-logic";

const quizItem = (over: Partial<QuizItem> = {}): QuizItem => ({
  id: "q1",
  sliceIndex: 3,
  marker: { x: 40, y: 50 },
  prompt: "What is marked?",
  options: ["A", "B"],
  answer: 0,
  explanation: "Because.",
  ...over,
});

const region = (over: Partial<LocateSegmentRegion> = {}): LocateSegmentRegion => ({
  kind: "segment",
  start: { x: 20, y: 20 },
  end: { x: 30, y: 60 },
  tolerance: 4,
  ...over,
});

describe("locate-region authoring helpers", () => {
  it("seeds a region on the reviewed marker rather than anywhere new", () => {
    const seeded = seedRegion({ x: 40, y: 50 });
    expect(seeded.start.x).toBe(40);
    expect(seeded.end.x).toBe(40);
    // Both ends must land on the marker's own column so the seed makes no
    // anatomic claim of its own; faculty drag them onto the structure.
    expect(seeded.start.y).toBeLessThan(50);
    expect(seeded.end.y).toBeGreaterThan(50);
    expect(seeded.tolerance).toBe(NEW_REGION_TOLERANCE);
    expect(isKnowledgeLocateHit({ x: 40, y: 50 }, { x: 40, y: 50 }, seeded)).toBe(true);
  });

  it("keeps a seeded region inside the image when the marker is near an edge", () => {
    const top = seedRegion({ x: 0.4, y: 1 });
    expect(top.start.y).toBe(0);
    const bottom = seedRegion({ x: 99, y: 99 });
    expect(bottom.end.y).toBe(100);
  });

  it("clamps and rounds dragged endpoints the same way markers are", () => {
    const moved = withRegionPoint(region(), "start", 133.33, -12);
    expect(moved.start).toEqual({ x: 100, y: 0 });
    expect(moved.end).toEqual(region().end);
    expect(withRegionPoint(region(), "end", 12.349, 7.86).end).toEqual({ x: 12.3, y: 7.9 });
  });

  it("clamps tolerance to the authorable range", () => {
    expect(withRegionTolerance(region(), 0.1).tolerance).toBe(MIN_REGION_TOLERANCE);
    expect(withRegionTolerance(region(), 99).tolerance).toBe(MAX_REGION_TOLERANCE);
    expect(withRegionTolerance(region(), 5.5).tolerance).toBe(5.5);
  });

  it("removes the key entirely when a region is cleared", () => {
    const cleared = withoutRegion(quizItem({ locateRegion: region() }));
    expect("locateRegion" in cleared).toBe(false);
    // Everything else the item carries must survive the clear.
    expect(cleared.marker).toEqual({ x: 40, y: 50 });
    expect(JSON.parse(JSON.stringify(cleared))).not.toHaveProperty("locateRegion");
  });

  it("flags a zero-length region, which would score as a circle", () => {
    expect(isDegenerateRegion(region({ end: { x: 20, y: 20 } }))).toBe(true);
    expect(isDegenerateRegion(region())).toBe(false);
  });

  it("flags a reveal marker that the region's own scorer would reject", () => {
    const band = region({ start: { x: 20, y: 20 }, end: { x: 20, y: 60 }, tolerance: 4 });
    expect(markerOutsideRegion({ x: 22, y: 40 }, band)).toBe(false);
    expect(markerOutsideRegion({ x: 30, y: 40 }, band)).toBe(true);
    // Widening the band must clear the warning, since the warning IS the scorer.
    expect(markerOutsideRegion({ x: 30, y: 40 }, withRegionTolerance(band, MAX_REGION_TOLERANCE))).toBe(false);
  });
});

describe("adjuster drag handles", () => {
  const tourStep: TourStep = {
    sliceIndex: 3,
    markers: [
      { x: 10, y: 10, label: "ACL" },
      { x: 20, y: 20 },
    ],
    title: "Step",
    note: "Note",
  };

  it("exposes only the markers for a tour step", () => {
    const handles = adjusterHandles("tour", tourStep);
    expect(handles.map((h) => h.role)).toEqual(["marker", "marker"]);
    expect(handleAriaLabel(handles[0]!, 0)).toBe("Move ACL marker");
    expect(handleAriaLabel(handles[1]!, 1)).toBe("Move marker 2");
  });

  it("adds two endpoint handles once a quiz item has a region", () => {
    expect(adjusterHandles("quiz", quizItem()).map((h) => h.role)).toEqual(["marker"]);
    const handles = adjusterHandles("quiz", quizItem({ locateRegion: region() }));
    expect(handles.map((h) => h.role)).toEqual(["marker", "region-start", "region-end"]);
    expect(handles[1]).toMatchObject({ x: 20, y: 20 });
    expect(handles[2]).toMatchObject({ x: 30, y: 60 });
    expect(handleAriaLabel(handles[1]!, 1)).toBe("Move locate line start");
    expect(handleAriaLabel(handles[2]!, 2)).toBe("Move locate line end");
  });

  it("returns nothing when the selection points at no item", () => {
    expect(adjusterHandles("quiz", undefined)).toEqual([]);
  });
});
