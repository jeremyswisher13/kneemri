import { describe, expect, it } from "vitest";
import { courseRegistry } from "@/content/courses";
import { courseRegionAccent } from "@/lib/course-visuals";

describe("course visuals", () => {
  it("defines a distinct course-picker accent for every body region", () => {
    const accents = courseRegistry.map((course) => courseRegionAccent(course.bodyRegion));

    expect(accents.every(Boolean)).toBe(true);
    expect(new Set(accents).size).toBe(accents.length);
  });
});
