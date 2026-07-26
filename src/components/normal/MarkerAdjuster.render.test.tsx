import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import MarkerAdjuster from "./MarkerAdjuster";
import type { PlaneLearn } from "@/content/normal-mri-types";

const learn: PlaneLearn = {
  tour: [
    { sliceIndex: 0, markers: [{ x: 10, y: 10, label: "ACL" }], title: "Step", note: "Note" },
  ],
  quiz: [
    {
      id: "q1",
      sliceIndex: 0,
      marker: { x: 40, y: 50 },
      locateRegion: {
        kind: "segment",
        start: { x: 20, y: 20 },
        end: { x: 30, y: 60 },
        tolerance: 4,
      },
      prompt: "What is marked?",
      options: ["Patellar tendon", "ACL"],
      answer: 0,
      explanation: "Because.",
    },
  ],
};

const html = renderToStaticMarkup(
  <MarkerAdjuster planeId="sag-pdfs" planeLabel="Sagittal PD FS" dir="/images/test" count={3} learn={learn} />,
);

describe("MarkerAdjuster shell", () => {
  it("keeps the existing marker handles and their labels on the default tour selection", () => {
    expect(html).toContain("Move ACL marker");
    expect(html).not.toContain("Move locate line start");
  });

  it("draws no locate band for a selection that has none, and gates the region editor to quiz items", () => {
    // The band IS the accepted scoring region, so it must never be painted over
    // a selection that has no region to score.
    expect(html).not.toContain("adjust-locate-region");
    expect(html).toContain("Pick a quiz item to place a locate line.");
  });

  it("flags in the item list which quiz items already carry a locate line", () => {
    expect(html).toContain("· line");
  });
});
