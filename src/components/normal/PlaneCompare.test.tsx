import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PlaneCompare, { type ComparePlane } from "./PlaneCompare";

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
});
