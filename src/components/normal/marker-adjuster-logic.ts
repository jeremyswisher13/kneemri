import type { LocateSegmentRegion, QuizItem, TourStep } from "@/content/normal-mri-types";
import { isKnowledgeLocateHit } from "./knowledge-check-hit";

/**
 * Pure editing rules behind the admin MarkerAdjuster workbench. They live here,
 * not in the component, so the coordinate maths that decides what gets deployed
 * to a course is testable on its own.
 */

export const clamp = (n: number) => Math.max(0, Math.min(100, n));
export const round1 = (n: number) => Math.round(n * 10) / 10;
export const sameAnchor = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.abs(a.x - b.x) < 0.001 && Math.abs(a.y - b.y) < 0.001;

export type AdjusterKind = "tour" | "quiz";

/**
 * Half-width (radius from the centreline, in image-percent) a freshly added
 * region starts at. Matches the tolerance already reviewed on the shipped knee
 * tendon regions so a new region behaves like the ones fellows have used;
 * faculty widen or narrow it per structure with the slider.
 */
export const NEW_REGION_TOLERANCE = 4;
/** Below ~1% the band is thinner than a fingertip; above ~12% it swallows neighbours. */
export const MIN_REGION_TOLERANCE = 1;
export const MAX_REGION_TOLERANCE = 12;

/**
 * A seeded region is NOT an anatomic claim — it is a pair of handles parked on
 * the reviewed marker so faculty have something to grab. Both ends sit on that
 * marker's own column (never on a coordinate read off the image) and have to be
 * dragged along the structure before the region means anything.
 */
const SEED_REGION_HALF_SPAN = 6;

export function seedRegion(marker: { x: number; y: number }): LocateSegmentRegion {
  return {
    kind: "segment",
    start: { x: round1(marker.x), y: round1(clamp(marker.y - SEED_REGION_HALF_SPAN)) },
    end: { x: round1(marker.x), y: round1(clamp(marker.y + SEED_REGION_HALF_SPAN)) },
    tolerance: NEW_REGION_TOLERANCE,
  };
}

/** Same clamp/round convention as marker drags, so exported coordinates match. */
export function withRegionPoint(
  region: LocateSegmentRegion,
  which: "start" | "end",
  xRaw: number,
  yRaw: number,
): LocateSegmentRegion {
  const point = { x: round1(clamp(xRaw)), y: round1(clamp(yRaw)) };
  return which === "start" ? { ...region, start: point } : { ...region, end: point };
}

export function withRegionTolerance(
  region: LocateSegmentRegion,
  toleranceRaw: number,
): LocateSegmentRegion {
  return {
    ...region,
    tolerance: round1(
      Math.max(MIN_REGION_TOLERANCE, Math.min(MAX_REGION_TOLERANCE, toleranceRaw)),
    ),
  };
}

/** Drops the key entirely so the exported JSON carries no empty `locateRegion`. */
export function withoutRegion(item: QuizItem): QuizItem {
  const next = { ...item };
  delete next.locateRegion;
  return next;
}

/**
 * A zero-length segment scores as a disc around `start`, which is almost never
 * what the author meant — flag it rather than silently shipping it.
 */
export function isDegenerateRegion(region: LocateSegmentRegion) {
  return sameAnchor(region.start, region.end);
}

/**
 * The marker is the reveal anchor, so it has to sit inside the band the scorer
 * accepts: otherwise a fellow who clicks the very spot the answer highlights is
 * marked wrong. Checked with the shipped scorer so this warning can never drift
 * from the real hit test.
 */
export function markerOutsideRegion(
  marker: { x: number; y: number },
  region: LocateSegmentRegion,
) {
  return !isKnowledgeLocateHit(marker, marker, region);
}

export type AdjusterHandle = {
  x: number;
  y: number;
  label?: string;
  role: "marker" | "region-start" | "region-end";
};

/**
 * Every draggable point for the current selection, in render order. Region
 * endpoints ride the same drag machinery as markers so they inherit the 44px
 * touch target and the clamp/round conventions.
 */
export function adjusterHandles(
  kind: AdjusterKind,
  item: TourStep | QuizItem | undefined,
): AdjusterHandle[] {
  if (!item) return [];
  if (kind === "tour") {
    return (item as TourStep).markers.map((m) => ({
      x: m.x,
      y: m.y,
      label: m.label,
      role: "marker" as const,
    }));
  }
  const quizItem = item as QuizItem;
  const handles: AdjusterHandle[] = [
    { x: quizItem.marker.x, y: quizItem.marker.y, role: "marker" },
  ];
  const region = quizItem.locateRegion;
  if (region) {
    handles.push({ x: region.start.x, y: region.start.y, label: "Line start", role: "region-start" });
    handles.push({ x: region.end.x, y: region.end.y, label: "Line end", role: "region-end" });
  }
  return handles;
}

export function handleAriaLabel(handle: AdjusterHandle, index: number) {
  if (handle.role === "region-start") return "Move locate line start";
  if (handle.role === "region-end") return "Move locate line end";
  return handle.label ? `Move ${handle.label} marker` : `Move marker ${index + 1}`;
}
