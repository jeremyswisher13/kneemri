import type { LocateSegmentRegion, Marker } from "@/content/normal-mri-types";

export const DEFAULT_LOCATE_TOLERANCE = 8;

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

function distanceToSegment(
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

export function isKnowledgeLocateHit(
  point: { x: number; y: number },
  target: Marker,
  region?: LocateSegmentRegion,
) {
  return region
    ? distanceToSegment(point, region) <= region.tolerance
    : distance(point, target) <= DEFAULT_LOCATE_TOLERANCE;
}
