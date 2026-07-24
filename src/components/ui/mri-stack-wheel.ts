interface WheelGesture {
  deltaX: number;
  deltaY: number;
  shiftKey: boolean;
  ctrlKey?: boolean;
  deltaMode?: number;
}

/**
 * Normalize mouse-wheel and trackpad motion to one MRI slice step. Browser
 * pinch-to-zoom arrives as Ctrl+wheel and must remain available to the browser.
 */
export function wheelSliceStep({
  deltaX,
  deltaY,
  ctrlKey = false,
  deltaMode = 0,
}: WheelGesture): -1 | 0 | 1 {
  if (ctrlKey) return 0;

  const delta = Math.abs(deltaY) >= Math.abs(deltaX) ? deltaY : deltaX;
  const minimumDelta = deltaMode === 0 ? 1 : Number.EPSILON;
  if (Math.abs(delta) < minimumDelta) return 0;
  return delta > 0 ? 1 : -1;
}
