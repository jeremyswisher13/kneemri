interface WheelGesture {
  deltaX: number;
  deltaY: number;
  shiftKey: boolean;
}

/**
 * Ordinary vertical wheel gestures belong to the page. Horizontal trackpad
 * gestures and Shift+wheel intentionally scrub the image stack.
 */
export function wheelSliceStep({ deltaX, deltaY, shiftKey }: WheelGesture): -1 | 0 | 1 {
  const horizontal = Math.abs(deltaX) >= 6 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
  if (!horizontal && !shiftKey) return 0;

  const delta = horizontal ? deltaX : deltaY;
  if (delta === 0) return 0;
  return delta > 0 ? 1 : -1;
}
