import { describe, expect, it } from "vitest";
import { normalKneeLearn } from "@/content/normal-knee-learn";
import { normalShoulderLearn } from "@/content/normal-shoulder-learn";
import { normalHipLearn } from "@/content/normal-hip-learn";
import { normalElbowLearn } from "@/content/normal-elbow-learn";
import type { LocateSegmentRegion, PlaneLearn, QuizItem } from "@/content/normal-mri-types";
import { DEFAULT_LOCATE_TOLERANCE, distanceToLocateSegment } from "./knowledge-check-hit";
import { locateRevealSpanPercent } from "./knowledge-check-reveal";
import {
  MIN_LOCATE_TOLERANCE,
  computeLocateTolerances,
  locateTolerances,
} from "./locate-tolerance";

const COURSES: readonly [string, Record<string, PlaneLearn>][] = [
  ["knee", normalKneeLearn],
  ["shoulder", normalShoulderLearn],
  ["hip", normalHipLearn],
  ["elbow", normalElbowLearn],
];

/**
 * Items whose derived cap landed under MIN_LOCATE_TOLERANCE, so the cap was NOT
 * applied and they still score at the flat default. Every entry is a pair of
 * distinct structures anchored too close to be separated by clicking — a content
 * problem (rewrite as Identify, or reposition the anchors with faculty) that no
 * tolerance can fix.
 *
 * This list is frozen on purpose. It is the only escape hatch from the overlap
 * assertion below, so a future anchor edit that crowds a new pair fails here and
 * has to be looked at by a human rather than quietly re-widening a scoring zone.
 * Shrinking the list is always safe; growing it needs a faculty decision.
 */
const BELOW_FLOOR_ITEM_IDS: readonly string[] = [
  // knee sag-pdfs slice 13 — sag-q6 sits 4.06 from the patellar-tendon centreline
  // (sag-q5), whose authored band is already 4 wide: 0.06 of free space.
  "knee/sag-pdfs/sag-q6",
  // knee cor-pdfs slice 7 — 2.24 apart, the tightest pair in the app.
  "knee/cor-pdfs/cor-sid-3",
  "knee/cor-pdfs/cor-q11",
  // knee axi-t2fs slice 13 — 5.69 apart (axi-q4 and axi-q10 share one anchor).
  "knee/axi-t2fs/axi-sid-1",
  "knee/axi-t2fs/axi-q4",
  "knee/axi-t2fs/axi-q10",
  // knee sag-t1 slice 13 — both crowd the patellar-tendon band (t1-q5, tolerance 4):
  // t1-q3 leaves 2.02, t1-q6 leaves 1.31.
  "knee/sag-t1/t1-q3",
  "knee/sag-t1/t1-q6",
  // hip cor-t2fs slice 19 — sourcil / acetabular cartilage / femoral head / labrum,
  // 4.12 to 5.59 apart (hc-q11, hc-q13, hc-q14 re-use the same three anchors).
  "hip/cor-t2fs/hc-q1",
  "hip/cor-t2fs/hc-q11",
  "hip/cor-t2fs/hc-q2",
  "hip/cor-t2fs/hc-q13",
  "hip/cor-t2fs/hc-q4",
  "hip/cor-t2fs/hc-q14",
];

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const cross = (
  o: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

/**
 * Distance between two accepted centrelines. Crossing segments are distance 0;
 * otherwise the minimum is attained at an endpoint, so the four endpoint-to-segment
 * distances are exact. Only knee sag-pdfs and sag-t1 carry two segments on one
 * slice today, but the assertion has to hold for any future pair.
 */
function segmentDistance(a: LocateSegmentRegion, b: LocateSegmentRegion) {
  const d1 = cross(a.start, a.end, b.start);
  const d2 = cross(a.start, a.end, b.end);
  const d3 = cross(b.start, b.end, a.start);
  const d4 = cross(b.start, b.end, a.end);
  if (d1 * d2 < 0 && d3 * d4 < 0) return 0;
  return Math.min(
    distanceToLocateSegment(b.start, a),
    distanceToLocateSegment(b.end, a),
    distanceToLocateSegment(a.start, b),
    distanceToLocateSegment(a.end, b),
  );
}

/** Free space between the two accepted zones; negative means they overlap. */
function zoneGap(a: QuizItem, aTol: number, b: QuizItem, bTol: number) {
  if (a.locateRegion && b.locateRegion) {
    return segmentDistance(a.locateRegion, b.locateRegion) - aTol - bTol;
  }
  if (a.locateRegion) return distanceToLocateSegment(b.marker, a.locateRegion) - aTol - bTol;
  if (b.locateRegion) return distanceToLocateSegment(a.marker, b.locateRegion) - aTol - bTol;
  return distance(a.marker, b.marker) - aTol - bTol;
}

interface Pair {
  key: string;
  a: QuizItem;
  b: QuizItem;
  aTol: number;
  bTol: number;
  exempt: boolean;
}

/**
 * Every pair of competing answers that share a series and a slice, with the
 * tolerance each one is actually scored at. Recomputed from the reviewed
 * coordinates on every run — that is the point: the scan cannot drift from the
 * content the way a hand-maintained table would.
 */
function collidablePairs(): Pair[] {
  const pairs: Pair[] = [];
  for (const [course, planes] of COURSES) {
    for (const [planeKey, plane] of Object.entries(planes)) {
      const tolerances = computeLocateTolerances(plane.quiz);
      const bySlice = new Map<number, QuizItem[]>();
      for (const item of plane.quiz) {
        const bucket = bySlice.get(item.sliceIndex);
        if (bucket) bucket.push(item);
        else bySlice.set(item.sliceIndex, [item]);
      }
      for (const items of bySlice.values()) {
        for (let i = 0; i < items.length; i += 1) {
          for (let j = i + 1; j < items.length; j += 1) {
            const a = items[i];
            const b = items[j];
            // One structure asked twice shares an anchor by design; the two items
            // are not competing answers and must not shrink each other.
            if (!a.locateRegion && !b.locateRegion && distance(a.marker, b.marker) < 0.001) {
              continue;
            }
            const aId = `${course}/${planeKey}/${a.id}`;
            const bId = `${course}/${planeKey}/${b.id}`;
            pairs.push({
              key: `${aId} <-> ${bId}`,
              a,
              b,
              aTol: tolerances.get(a.id)!.tolerance,
              bTol: tolerances.get(b.id)!.tolerance,
              exempt:
                BELOW_FLOOR_ITEM_IDS.includes(aId) || BELOW_FLOOR_ITEM_IDS.includes(bId),
            });
          }
        }
      }
    }
  }
  return pairs;
}

describe("locate tolerance collision scan", () => {
  /**
   * The bug this guards: Locate scored every point item against a flat 8% radius,
   * so on crowded slices a fellow could click the femoral head, be scored correct
   * for the labrum, and pass the mastery gate without telling them apart.
   */
  it("leaves no two accepted zones on a shared series+slice overlapping", () => {
    const overlapping = collidablePairs()
      .filter((pair) => !pair.exempt)
      // 1e-9 absorbs float error only: min(DEFAULT, nearest / 2) makes tangency the
      // exact worst case for two point items, so an honest pair lands at gap === 0.
      .filter((pair) => zoneGap(pair.a, pair.aTol, pair.b, pair.bTol) < -1e-9)
      .map(
        (pair) =>
          `${pair.key} gap=${zoneGap(pair.a, pair.aTol, pair.b, pair.bTol).toFixed(2)} (tolerances ${pair.aTol.toFixed(2)} / ${pair.bTol.toFixed(2)})`,
      );

    expect(overlapping).toEqual([]);
  });

  it("scans a real set of crowded pairs, so the assertion above is not vacuous", () => {
    const crowded = collidablePairs().filter(
      (pair) => zoneGap(pair.a, pair.aTol, pair.b, pair.bTol) < DEFAULT_LOCATE_TOLERANCE,
    );
    expect(crowded.length).toBeGreaterThan(20);
  });

  /**
   * Frozen so a future anchor edit that crowds a new pair fails loudly instead of
   * silently shrinking an item to an untouchable dot. If a listed pair is fixed in
   * content, delete its entry; if a new one appears, it needs a faculty decision
   * (rewrite as Identify, or reposition the anchors) — not a new list entry.
   */
  it("keeps the below-floor item list exactly as reviewed", () => {
    const found: string[] = [];
    for (const [course, planes] of COURSES) {
      for (const [planeKey, plane] of Object.entries(planes)) {
        const tolerances = computeLocateTolerances(plane.quiz);
        for (const item of plane.quiz) {
          if (tolerances.get(item.id)!.belowFloor) found.push(`${course}/${planeKey}/${item.id}`);
        }
      }
    }
    expect(found.sort()).toEqual([...BELOW_FLOOR_ITEM_IDS].sort());
  });

  it("keeps below-floor items at the historical tolerance rather than shrinking them", () => {
    for (const [, planes] of COURSES) {
      for (const plane of Object.values(planes)) {
        const tolerances = computeLocateTolerances(plane.quiz);
        for (const entry of tolerances.values()) {
          if (entry.belowFloor) expect(entry.tolerance).toBe(DEFAULT_LOCATE_TOLERANCE);
          else expect(entry.tolerance).toBeGreaterThanOrEqual(MIN_LOCATE_TOLERANCE);
          expect(entry.tolerance).toBeLessThanOrEqual(DEFAULT_LOCATE_TOLERANCE);
        }
      }
    }
  });

  it("never rewrites a faculty-authored segment tolerance", () => {
    for (const [, planes] of COURSES) {
      for (const plane of Object.values(planes)) {
        const tolerances = computeLocateTolerances(plane.quiz);
        for (const item of plane.quiz) {
          if (!item.locateRegion) continue;
          expect(tolerances.get(item.id)!.tolerance).toBe(item.locateRegion.tolerance);
        }
      }
    }
  });

  it("draws the gold reveal at exactly the tolerance the scorer used", () => {
    for (const [, planes] of COURSES) {
      for (const plane of Object.values(planes)) {
        const tolerances = computeLocateTolerances(plane.quiz);
        for (const item of plane.quiz) {
          const tolerance = tolerances.get(item.id)!.tolerance;
          expect(locateRevealSpanPercent(item.locateRegion, tolerance)).toBe(tolerance * 2);
        }
      }
    }
  });
});

describe("computeLocateTolerances", () => {
  const point = (id: string, x: number, y: number, sliceIndex = 0): QuizItem => ({
    id,
    sliceIndex,
    marker: { x, y },
    prompt: "p",
    options: ["a", "b"],
    answer: 0,
    explanation: "e",
  });

  it("splits the gap between two competing anchors so the zones only touch", () => {
    const items = [point("a", 40, 50), point("b", 50, 50)];
    const map = computeLocateTolerances(items);
    expect(map.get("a")!.tolerance).toBe(5);
    expect(map.get("b")!.tolerance).toBe(5);
  });

  it("ignores anchors on other slices", () => {
    const items = [point("a", 40, 50), point("b", 50, 50, 1)];
    const map = computeLocateTolerances(items);
    expect(map.get("a")!.tolerance).toBe(DEFAULT_LOCATE_TOLERANCE);
  });

  it("does not let one structure asked twice shrink its own tolerance", () => {
    const items = [point("a", 40, 50), point("a-again", 40, 50)];
    const map = computeLocateTolerances(items);
    expect(map.get("a")!.tolerance).toBe(DEFAULT_LOCATE_TOLERANCE);
    expect(map.get("a")!.nearestAnchorDistance).toBe(Infinity);
  });

  it("keeps clear of a neighbouring segment's authored band", () => {
    const segment: QuizItem = {
      ...point("seg", 50, 50),
      locateRegion: {
        kind: "segment",
        start: { x: 50, y: 20 },
        end: { x: 50, y: 80 },
        tolerance: 4,
      },
    };
    const map = computeLocateTolerances([segment, point("near", 60, 50)]);
    // 10 from the centreline, 4 of which the segment already claims.
    expect(map.get("near")!.tolerance).toBe(6);
  });

  it("leaves items below the floor at the historical tolerance and flags them", () => {
    const items = [point("a", 48, 50), point("b", 50, 50)];
    const map = computeLocateTolerances(items);
    expect(map.get("a")).toMatchObject({
      tolerance: DEFAULT_LOCATE_TOLERANCE,
      belowFloor: true,
      nearestAnchorDistance: 2,
    });
  });

  it("memoises per plane so KnowledgeCheck can call it every render", () => {
    const items = [point("a", 40, 50), point("b", 50, 50)];
    expect(locateTolerances(items)).toBe(locateTolerances(items));
  });
});
