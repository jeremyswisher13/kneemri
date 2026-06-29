import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CrossPlaneDrill from "./CrossPlaneDrill";
import type { CorrelationItem } from "@/content/normal-mri-types";

const correlations: CorrelationItem[] = [
  {
    id: "test-c1",
    prompt: "Find the same normal structure on the paired plane.",
    explanation: "The same structure is followed across the two planes.",
    from: {
      plane: "Sagittal PD-FS",
      dir: "/images/from",
      sliceIndex: 4,
      x: 88,
      y: 82,
      label: "Abductors",
    },
    to: {
      plane: "Coronal PD-FS",
      dir: "/images/to",
      sliceIndex: 7,
      candidates: [
        { x: 25, y: 40 },
        { x: 62, y: 54 },
        { x: 78, y: 70 },
      ],
      answer: 1,
    },
  },
];

describe("CrossPlaneDrill", () => {
  it("renders the paired-plane drill with an accessible difficulty toggle", () => {
    const html = renderToStaticMarkup(<CrossPlaneDrill items={correlations} />);

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Cross-plane difficulty"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Multiple choice");
    expect(html).toContain("Free response (hard)");
    expect(html).toContain("Correlation 1 of 1");
    expect(html).toContain("Track the labeled structure across planes");
    expect(html).toContain("Find <span");
    expect(html).toContain("Abductors");
    expect(html).toContain("right-0 translate-x-0 text-right");
    expect(html).toContain("bottom-5");
    expect(html).toContain("Sagittal PD-FS");
    expect(html).toContain("Coronal PD-FS");
    expect(html).toContain('aria-label="Option');
    expect(html).toContain('aria-label="Choose option');
    expect(html).toContain("Option ");
    expect(html).toContain("on Coronal PD-FS");
    expect(html).toContain("Pick the letter sitting over the same normal structure.");
    expect(html).toContain("Find the same normal structure on the paired plane.");
  });

  it("shows a prepared-state message instead of crashing on empty banks", () => {
    const html = renderToStaticMarkup(<CrossPlaneDrill items={[]} />);

    expect(html).toContain("Cross-plane correlations are being prepared");
  });
});
