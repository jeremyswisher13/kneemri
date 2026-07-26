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
  pointAnchor,
  quizAnchor,
  seedRegion,
  syncQuizMarkers,
  syncQuizSlices,
  syncTourMarkers,
  syncTourSlices,
  tourAnchor,
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

describe("shared-anchor sync", () => {
  // Straight from the shipped knee axial deck: axi-q4/axi-q10 both sit on the
  // trochlear groove and axi-q5/axi-q11 both on the MPFL. These coordinates are
  // COPIED from reviewed content — the sync only propagates an edit faculty
  // make on the image, it never invents a position.
  const trochlea = { x: 54.1, y: 29.8 };
  const mpfl = { x: 35.3, y: 23.2 };
  const dragged = { x: 55.4, y: 30.6 };

  const kneeAxialQuiz = (): QuizItem[] => [
    quizItem({ id: "axi-q4", sliceIndex: 13, marker: { ...trochlea } }),
    quizItem({ id: "axi-q5", sliceIndex: 13, marker: { ...mpfl } }),
    quizItem({ id: "axi-q10", sliceIndex: 13, marker: { ...trochlea } }),
    quizItem({ id: "axi-q11", sliceIndex: 13, marker: { ...mpfl } }),
    // Same pixels, different slice: a coincidence, not the same structure.
    quizItem({ id: "axi-q4-prev", sliceIndex: 12, marker: { ...trochlea } }),
  ];

  const step = (over: Partial<TourStep> = {}): TourStep => ({
    sliceIndex: 13,
    markers: [{ ...trochlea, label: "Trochlear groove" }],
    title: "Trochlea",
    note: "Note",
    ...over,
  });

  it("carries a quiz-row marker edit to every quiz twin on the same anchor", () => {
    const quiz = kneeAxialQuiz();
    const moved = syncQuizMarkers(quiz, quizAnchor(quiz[0]!), dragged.x, dragged.y);
    expect(moved.map((q) => q.marker)).toEqual([dragged, mpfl, dragged, mpfl, trochlea]);
    // Rows that did not move keep their identity, so React and the draft blob
    // see no churn from an unrelated edit.
    expect(moved[1]).toBe(quiz[1]);
    expect(moved[4]).toBe(quiz[4]);
  });

  it("carries a quiz-row slice scrub to every quiz twin on the same anchor", () => {
    const quiz = kneeAxialQuiz();
    const moved = syncQuizSlices(quiz, quizAnchor(quiz[1]!), 14);
    // axi-q5 and axi-q11 follow; the trochlear pair and the slice-12 item stay.
    expect(moved.map((q) => q.sliceIndex)).toEqual([13, 14, 13, 14, 12]);
  });

  it("carries a tour edit to the quiz items on that marker, and back again", () => {
    const quiz = kneeAxialQuiz();
    const tour = [step()];
    // tour -> quiz
    expect(
      syncQuizMarkers(quiz, pointAnchor(13, trochlea), dragged.x, dragged.y).map((q) => q.marker),
    ).toEqual([dragged, mpfl, dragged, mpfl, trochlea]);
    // quiz -> tour
    expect(syncTourMarkers(tour, quizAnchor(quiz[0]!), dragged.x, dragged.y)[0]!.markers).toEqual([
      { ...dragged, label: "Trochlear groove" },
    ]);
    expect(syncTourSlices(tour, quizAnchor(quiz[0]!), 14)[0]!.sliceIndex).toBe(14);
  });

  it("moves only the dragged marker's anchor, not the rest of its step", () => {
    const tour = [step({ markers: [{ ...trochlea }, { ...mpfl }] })];
    const moved = syncTourMarkers(tour, pointAnchor(13, trochlea), dragged.x, dragged.y);
    expect(moved[0]!.markers).toEqual([dragged, mpfl]);
  });

  it("scrubs a whole tour step's worth of quiz items, since the step moves as one", () => {
    const quiz = kneeAxialQuiz();
    const both = step({ markers: [{ ...trochlea }, { ...mpfl }] });
    expect(syncQuizSlices(quiz, tourAnchor(both), 14).map((q) => q.sliceIndex)).toEqual([
      14, 14, 14, 14, 12,
    ]);
  });

  it("leaves everything alone when nothing sits on the anchor", () => {
    const quiz = kneeAxialQuiz();
    const tour = [step()];
    expect(syncQuizMarkers(quiz, pointAnchor(13, { x: 1, y: 1 }), 9, 9)).toEqual(quiz);
    expect(syncTourMarkers(tour, pointAnchor(99, trochlea), 9, 9)[0]).toBe(tour[0]);
    expect(syncTourSlices(tour, pointAnchor(99, trochlea), 4)[0]).toBe(tour[0]);
  });
});
