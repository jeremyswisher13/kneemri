export const NORMAL_MRI_MODE_PARAM = "mode";
export const NORMAL_MRI_SERIES_PARAM = "series";

/**
 * Workstation modes that can be restored from a URL or a saved resume entry.
 *
 * SINGLE SOURCE OF TRUTH for both sides of the round-trip: what we PERSIST
 * (useNormalMriResume) and what we READ BACK (each Normal*MriPage). These lists
 * were previously duplicated per page, and the write side drifted — the
 * admin-only "adjust" mode was written into the URL and the resume card but was
 * never in the read set, so a reload silently dropped to Explore and the resume
 * card pointed somewhere it could not reach.
 *
 * Admin-only modes (e.g. "adjust") are deliberately excluded.
 */
export const RESTORABLE_NORMAL_MODES = [
  "explore",
  "tour",
  "check",
  "correlate",
  "compare",
  "advanced",
  "caq",
] as const;

export type RestorableNormalMode = (typeof RESTORABLE_NORMAL_MODES)[number];

export function isRestorableNormalMode(mode: string): mode is RestorableNormalMode {
  return (RESTORABLE_NORMAL_MODES as readonly string[]).includes(mode);
}

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
