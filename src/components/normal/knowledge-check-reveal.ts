import type { LocateSegmentRegion } from "@/content/normal-mri-types";
import { DEFAULT_LOCATE_TOLERANCE } from "./knowledge-check-hit";

/**
 * Full width/diameter of the region `isKnowledgeLocateHit` accepts, in the same
 * percent-of-image units the hit test measures in (tolerance is a radius from the
 * centreline or point, so the drawn span is twice it).
 *
 * The gold reveal MUST be derived from this rather than from a fixed pixel size:
 * a fellow who clicks inside the accepted band but visibly off a thin drawn answer
 * reads "Correct" beside a mark nowhere near the click, which looks like a scoring
 * bug and undermines trust in the mastery gate.
 *
 * `pointTolerance` carries the per-item radius `locate-tolerance.ts` derives from
 * the neighbouring anchors. It has to be the exact number handed to
 * `isKnowledgeLocateHit` for the same trial: the halo is a claim about what the
 * scorer accepts, so a default here beside a tightened tolerance there would draw
 * a ring wider than the accepted zone — the original honesty bug, re-created.
 */
export function locateRevealSpanPercent(
  region?: LocateSegmentRegion,
  pointTolerance: number = DEFAULT_LOCATE_TOLERANCE,
) {
  return (region?.tolerance ?? pointTolerance) * 2;
}
