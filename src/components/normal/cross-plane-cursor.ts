export const clampCrossPlaneCoordinate = (n: number) => Math.min(100, Math.max(0, n));

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
