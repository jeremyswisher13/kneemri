import { describe, expect, it } from "vitest";
import { normalKneeLearn } from "@/content/normal-knee-learn";
import type { LocateSegmentRegion } from "@/content/normal-mri-types";
import { DEFAULT_LOCATE_TOLERANCE, isKnowledgeLocateHit } from "./knowledge-check-hit";
import { locateRevealSpanPercent } from "./knowledge-check-reveal";

/**
 * The gold reveal has to be the same shape the scorer accepts. When it was drawn
 * at a fixed pixel width it understated a percent-based tolerance by several
 * times, so a fellow could click inside the accepted band, be told "Correct",
 * and see the answer drawn nowhere near the click.
 */
describe("locate reveal geometry", () => {
  it("spans the full accepted width for point targets", () => {
    const target = { x: 50, y: 50 };
    const halfSpan = locateRevealSpanPercent() / 2;

    expect(isKnowledgeLocateHit({ x: 50 + halfSpan, y: 50 }, target)).toBe(true);
    expect(isKnowledgeLocateHit({ x: 50 + halfSpan + 0.1, y: 50 }, target)).toBe(false);
    expect(halfSpan).toBe(DEFAULT_LOCATE_TOLERANCE);
  });

  it("spans the full accepted width for elongated segment targets", () => {
    const region: LocateSegmentRegion = {
      kind: "segment",
      start: { x: 20, y: 50 },
      end: { x: 80, y: 50 },
      tolerance: 4,
    };
    const target = { x: 50, y: 50 };
    const halfSpan = locateRevealSpanPercent(region) / 2;

    // Perpendicular to the centreline, and past the endpoint, where the round
    // stroke cap has to stand in for the segment's clamped-projection disc.
    expect(isKnowledgeLocateHit({ x: 50, y: 50 + halfSpan }, target, region)).toBe(true);
    expect(isKnowledgeLocateHit({ x: 50, y: 50 + halfSpan + 0.1 }, target, region)).toBe(false);
    expect(isKnowledgeLocateHit({ x: 80 + halfSpan, y: 50 }, target, region)).toBe(true);
    expect(isKnowledgeLocateHit({ x: 80 + halfSpan + 0.1, y: 50 }, target, region)).toBe(false);
  });

  it("tracks each authored tolerance rather than a fixed size", () => {
    const authored = Object.values(normalKneeLearn)
      .flatMap((plane) => plane.quiz)
      .map((item) => item.locateRegion)
      .filter((region): region is LocateSegmentRegion => Boolean(region));

    expect(authored.length).toBeGreaterThan(0);
    for (const region of authored) {
      expect(locateRevealSpanPercent(region)).toBe(region.tolerance * 2);
    }
  });
});
