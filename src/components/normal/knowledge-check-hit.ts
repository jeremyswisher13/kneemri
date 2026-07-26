import type { LocateSegmentRegion, Marker } from "@/content/normal-mri-types";

export const DEFAULT_LOCATE_TOLERANCE = 8;

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Exported for `locate-tolerance.ts`, which has to measure a point anchor against
 * a neighbouring segment's accept band using the SAME metric the scorer uses —
 * an approximation there would let the derived caps disagree with the hit test.
 */
export function distanceToLocateSegment(
  point: { x: number; y: number },
  region: LocateSegmentRegion,
) {
  const dx = region.end.x - region.start.x;
  const dy = region.end.y - region.start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(point, region.start);

  const projection =
    ((point.x - region.start.x) * dx + (point.y - region.start.y) * dy) /
    lengthSquared;
  const t = Math.min(1, Math.max(0, projection));
  return distance(point, {
    x: region.start.x + t * dx,
    y: region.start.y + t * dy,
  });
}

/**
 * `pointTolerance` is the per-item radius derived by `locate-tolerance.ts` from the
 * neighbouring anchors on the same series+slice. It defaults to the flat historical
 * value so standalone callers and the segment path are unchanged, but KnowledgeCheck
 * must pass the derived value — otherwise a click on the femoral head scores correct
 * for the labrum 4% away. Whatever is passed here must also reach
 * `locateRevealSpanPercent`, or the gold reveal claims an area that is not accepted.
 */
export function isKnowledgeLocateHit(
  point: { x: number; y: number },
  target: Marker,
  region?: LocateSegmentRegion,
  pointTolerance: number = DEFAULT_LOCATE_TOLERANCE,
) {
  return region
    ? distanceToLocateSegment(point, region) <= region.tolerance
    : distance(point, target) <= pointTolerance;
}
