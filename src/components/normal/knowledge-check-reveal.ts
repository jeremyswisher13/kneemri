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
 */
export function locateRevealSpanPercent(region?: LocateSegmentRegion) {
  return (region?.tolerance ?? DEFAULT_LOCATE_TOLERANCE) * 2;
}
