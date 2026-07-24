export function mapLinkedSliceIndex(
  sourceIndex: number,
  sourceCount: number,
  targetCount: number,
) {
  if (sourceCount <= 1 || targetCount <= 1) return 0;
  const sourceMax = sourceCount - 1;
  const targetMax = targetCount - 1;
  const relativePosition = Math.min(1, Math.max(0, sourceIndex / sourceMax));
  return Math.round(relativePosition * targetMax);
}
