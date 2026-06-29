import { describe, expect, it } from "vitest";
import { getCourseById } from "@/content/courses";
import { fallbackRouteTitle, pageTitleForRouteSegment } from "./fellow-route-title";

describe("FellowLayout route titles", () => {
  it("preserves authored medical acronyms for module and case pages", () => {
    const elbow = getCourseById("elbow-mri");
    const knee = getCourseById("knee-mri");

    expect(pageTitleForRouteSegment("elbow-mri-orientation", elbow, false)).toBe("Elbow MRI Orientation");
    expect(pageTitleForRouteSegment("acl-pivot-shift", knee, false)).toBe("ACL Tear + Pivot-Shift Pattern");
  });

  it("uses acronym-aware fallback titles for unknown slugs", () => {
    expect(fallbackRouteTitle("mri-acl-ucl-tttg-review")).toBe("MRI ACL UCL TT-TG Review");
  });
});
