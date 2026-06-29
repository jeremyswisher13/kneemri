export const NORMAL_MRI_MODE_PARAM = "mode";
export const NORMAL_MRI_SERIES_PARAM = "series";

export function readNormalParam<T extends string>(
  search: string,
  key: string,
  allowed: readonly T[],
  fallback: T,
): T {
  const value = new URLSearchParams(search).get(key);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function normalWorkstationResumePath({
  pathname,
  search,
  hash,
  modeId,
  seriesId,
}: {
  pathname: string;
  search: string;
  hash: string;
  modeId: string;
  seriesId: string;
}) {
  const params = new URLSearchParams(search);
  params.set(NORMAL_MRI_MODE_PARAM, modeId);
  params.set(NORMAL_MRI_SERIES_PARAM, seriesId);
  const query = params.toString();
  return `${pathname}${query ? `?${query}` : ""}${hash}`;
}
