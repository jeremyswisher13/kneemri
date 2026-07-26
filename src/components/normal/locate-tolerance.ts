import type { QuizItem } from "@/content/normal-mri-types";
import { DEFAULT_LOCATE_TOLERANCE, distanceToLocateSegment } from "./knowledge-check-hit";

/**
 * Smallest derived radius we are willing to score against, in percent of the
 * image. The Locate viewer is ~560px wide on desktop and narrower on a phone, so
 * 3% is about 17px — already at the edge of what a fingertip can hit reliably.
 *
 * Below this the honest answer is NOT a tighter tolerance: two anchors that close
 * are asking a fellow to separate structures by clicking that cannot be separated
 * by clicking, which is an item-DESIGN problem. Those items keep the historical
 * flat tolerance (see `belowFloor`) and are surfaced to faculty for rewrite as
 * Identify items or for anchor repositioning, rather than being silently shrunk
 * into an unhittable dot.
 */
export const MIN_LOCATE_TOLERANCE = 3;

/**
 * Two quiz items may deliberately share one anchor — the same structure asked
 * twice with different stems. Those are not competing answers, so they must not
 * shrink each other. Matches the coordinate equality `labelQuizItemsFromTour`
 * uses so "same marker" means the same thing everywhere in this folder.
 */
const SAME_ANCHOR_EPSILON = 0.001;

export interface LocateToleranceEntry {
  /** Radius the scorer and the gold reveal must both use, in percent of image. */
  tolerance: number;
  /**
   * Distance to the nearest competing anchor on this series+slice (Infinity when
   * the item stands alone). Kept for the regression scan and faculty reporting.
   */
  nearestAnchorDistance: number;
  /**
   * True when the derived cap landed under MIN_LOCATE_TOLERANCE and was therefore
   * NOT applied — the item still scores at DEFAULT_LOCATE_TOLERANCE and needs a
   * content fix, not a scoring fix.
   */
  belowFloor: boolean;
}

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Free space between this item's anchor and one competing answer's accept zone.
 *
 * Against another point item we may only claim half the gap, because that item is
 * shrinking symmetrically against us — half each guarantees the two discs can
 * touch but never overlap. Against a segment item we may claim the whole gap
 * minus its authored tolerance: those tolerances are faculty-reviewed content and
 * this module never adjusts them.
 */
function availableGap(item: QuizItem, other: QuizItem): number {
  return other.locateRegion
    ? distanceToLocateSegment(item.marker, other.locateRegion) - other.locateRegion.tolerance
    : distance(item.marker, other.marker) / 2;
}

/**
 * Per-item Locate tolerance derived from the reviewed coordinates themselves, so
 * two answers on the same series+slice can never have overlapping accept zones.
 *
 * The flat 8% radius let a fellow click the femoral head and be scored correct for
 * the labrum: 26 anchor pairs across the four courses sat closer than 8 apart. No
 * coordinate is moved and no tolerance is hand-written into content — the cap is
 * recomputed from the anchors, so a future anchor edit re-derives it automatically
 * (and `locate-tolerance.test.ts` fails if an edit reintroduces an overlap).
 *
 * Items with a `locateRegion` are returned untouched at their authored tolerance;
 * the segment path is already explicitly scoped by faculty.
 */
export function computeLocateTolerances(
  items: readonly QuizItem[],
): Map<string, LocateToleranceEntry> {
  const bySlice = new Map<number, QuizItem[]>();
  for (const item of items) {
    const bucket = bySlice.get(item.sliceIndex);
    if (bucket) bucket.push(item);
    else bySlice.set(item.sliceIndex, [item]);
  }

  const result = new Map<string, LocateToleranceEntry>();
  for (const item of items) {
    if (item.locateRegion) {
      result.set(item.id, {
        tolerance: item.locateRegion.tolerance,
        nearestAnchorDistance: Infinity,
        belowFloor: false,
      });
      continue;
    }

    const neighbours = bySlice.get(item.sliceIndex) ?? [];
    let smallestGap = Infinity;
    let nearestAnchorDistance = Infinity;
    for (const other of neighbours) {
      if (other === item) continue;
      const anchorDistance = distance(item.marker, other.marker);
      // Same anchor = same structure asked twice; it is not a competing answer.
      if (anchorDistance <= SAME_ANCHOR_EPSILON) continue;
      nearestAnchorDistance = Math.min(nearestAnchorDistance, anchorDistance);
      smallestGap = Math.min(smallestGap, availableGap(item, other));
    }

    const derived = Math.min(DEFAULT_LOCATE_TOLERANCE, smallestGap);
    const belowFloor = derived < MIN_LOCATE_TOLERANCE;
    result.set(item.id, {
      tolerance: belowFloor ? DEFAULT_LOCATE_TOLERANCE : derived,
      nearestAnchorDistance,
      belowFloor,
    });
  }
  return result;
}

/**
 * Memoised per plane. KnowledgeCheck asks for the map on every render and the
 * scan is O(items² per slice); the quiz array it passes is itself memoised, so
 * keying the cache on that array identity computes each plane exactly once.
 */
const cache = new WeakMap<readonly QuizItem[], Map<string, LocateToleranceEntry>>();

export function locateTolerances(
  items: readonly QuizItem[],
): Map<string, LocateToleranceEntry> {
  const cached = cache.get(items);
  if (cached) return cached;
  const computed = computeLocateTolerances(items);
  cache.set(items, computed);
  return computed;
}

/** Convenience for the two call sites that need one item's number. */
export function locateToleranceFor(
  items: readonly QuizItem[],
  itemId: string,
): number {
  return locateTolerances(items).get(itemId)?.tolerance ?? DEFAULT_LOCATE_TOLERANCE;
}
