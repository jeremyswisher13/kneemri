export const clampCrossPlaneCoordinate = (n: number) => Math.min(100, Math.max(0, n));
export const CROSS_PLANE_FREE_TOLERANCE = 8;

export function isCrossPlaneFreeResponseCorrect(
  point: { x: number; y: number },
  target: { x: number; y: number },
  tolerance = CROSS_PLANE_FREE_TOLERANCE,
) {
  return Math.hypot(point.x - target.x, point.y - target.y) <= tolerance;
}

export function moveCrossPlaneCursor(
  point: { x: number; y: number },
  key: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight",
  fine = false,
) {
  const step = fine ? 1 : 4;
  const offsets = {
    ArrowUp: { x: 0, y: -step },
    ArrowDown: { x: 0, y: step },
    ArrowLeft: { x: -step, y: 0 },
    ArrowRight: { x: step, y: 0 },
  } as const;
  const offset = offsets[key];
  return {
    x: clampCrossPlaneCoordinate(point.x + offset.x),
    y: clampCrossPlaneCoordinate(point.y + offset.y),
  };
}
