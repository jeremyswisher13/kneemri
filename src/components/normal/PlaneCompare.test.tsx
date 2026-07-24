import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PlaneCompare, { type ComparePlane } from "./PlaneCompare";
import { mapLinkedSliceIndex } from "./plane-compare-logic";

const planes: ComparePlane[] = [
  { id: "sag", label: "Sagittal", plane: "Sagittal", dir: "/images/sag", count: 2 },
  { id: "cor", label: "Coronal", plane: "Coronal", dir: "/images/cor", count: 2 },
];

describe("PlaneCompare", () => {
  it("gives the two plane selectors distinct accessible names", () => {
    const html = renderToStaticMarkup(<PlaneCompare planes={planes} attribution="Teaching stack" />);

    expect(html).toContain('aria-label="Compare A plane to compare"');
    expect(html).toContain('aria-label="Compare B plane to compare"');
    expect(html.match(/aria-label="Plane to compare"/g)).toBeNull();
  });

  it("offers linked scrolling as an optional accessible control", () => {
    const html = renderToStaticMarkup(<PlaneCompare planes={planes} attribution="Teaching stack" />);

    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-label="Link stack scrolling"');
    expect(html).toContain('aria-checked="false"');
    expect(html).toContain("Stacks scroll independently.");
  });

  it("maps linked stacks by relative position when their slice counts differ", () => {
    expect(mapLinkedSliceIndex(0, 29, 19)).toBe(0);
    expect(mapLinkedSliceIndex(14, 29, 19)).toBe(9);
    expect(mapLinkedSliceIndex(28, 29, 19)).toBe(18);
    expect(mapLinkedSliceIndex(-4, 29, 19)).toBe(0);
    expect(mapLinkedSliceIndex(40, 29, 19)).toBe(18);
  });
});
