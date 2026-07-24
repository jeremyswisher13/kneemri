import { describe, expect, it } from "vitest";
import { normalKneeLearn } from "@/content/normal-knee-learn";
import type { QuizItem } from "@/content/normal-mri-types";
import {
  DEFAULT_LOCATE_TOLERANCE,
  isKnowledgeLocateHit,
} from "./knowledge-check-hit";

function item(seriesId: "sag-pdfs" | "sag-t1", itemId: string): QuizItem {
  const match = normalKneeLearn[seriesId].quiz.find((candidate) => candidate.id === itemId);
  if (!match) throw new Error(`Missing ${seriesId} quiz item ${itemId}`);
  return match;
}

describe("knowledge-check localization hit regions", () => {
  it.each([
    ["sag-pdfs", "sag-q4", { x: 12.7, y: 8 }, { x: 27, y: 16 }],
    ["sag-pdfs", "sag-q5", { x: 17.5, y: 48 }, { x: 28, y: 52 }],
    ["sag-t1", "t1-q4", { x: 16, y: 7 }, { x: 28, y: 18 }],
    ["sag-t1", "t1-q5", { x: 18.5, y: 47.5 }, { x: 30, y: 54 }],
  ] as const)(
    "accepts the full tendon course for %s %s without accepting nearby soft tissue",
    (seriesId, itemId, validTendonPoint, nearbyMiss) => {
      const question = item(seriesId, itemId);
      expect(question.locateRegion).toBeDefined();
      expect(
        Math.hypot(
          validTendonPoint.x - question.marker.x,
          validTendonPoint.y - question.marker.y,
        ),
      ).toBeGreaterThan(DEFAULT_LOCATE_TOLERANCE);
      expect(
        isKnowledgeLocateHit(validTendonPoint, question.marker, question.locateRegion),
      ).toBe(true);
      expect(
        isKnowledgeLocateHit(nearbyMiss, question.marker, question.locateRegion),
      ).toBe(false);
    },
  );

  it("keeps point-based scoring for compact landmarks", () => {
    const target = { x: 50, y: 50 };
    expect(isKnowledgeLocateHit({ x: 58, y: 50 }, target)).toBe(true);
    expect(isKnowledgeLocateHit({ x: 58.1, y: 50 }, target)).toBe(false);
  });
});
