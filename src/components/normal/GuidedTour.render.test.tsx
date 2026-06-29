import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AnnotatedSlice from "./AnnotatedSlice";
import GuidedTour from "./GuidedTour";
import type { TourStep } from "@/content/normal-mri-types";
import type { TourFocusTarget } from "./guided-tour-focus";

const tourSteps: TourStep[] = [
  {
    sliceIndex: 0,
    markers: [],
    title: "Get oriented",
    note: "Start with orientation.",
  },
  {
    sliceIndex: 4,
    markers: [{ x: 25, y: 50, label: "Anterior labrum" }],
    title: "Anterior labrum",
    note: "Review the anterior labrum.",
  },
  {
    sliceIndex: 4,
    markers: [{ x: 75, y: 50, label: "Posterior labrum" }],
    title: "Posterior labrum",
    note: "Review the posterior labrum.",
  },
];

const focusTarget: TourFocusTarget = {
  itemId: "q-posterior-labrum",
  sliceIndex: 4,
  marker: { x: 75, y: 50 },
  structure: "Posterior labrum",
};

describe("GuidedTour render polish", () => {
  it("shows a missed-item handoff cue when opened from a missed Knowledge Check item", () => {
    const html = renderToStaticMarkup(
      <GuidedTour dir="/images/test" steps={tourSteps} focusTarget={focusTarget} />,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain("Reviewing missed item:");
    expect(html).toContain("Posterior labrum");
    expect(html).toContain("closest guided-tour match");
  });

  it("labels each step dot with the step title and exposes the current step", () => {
    const html = renderToStaticMarkup(<GuidedTour dir="/images/test" steps={tourSteps} />);

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Guided tour steps"');
    expect(html).toContain('aria-label="Go to step 1: Get oriented"');
    expect(html).toContain('aria-label="Go to step 2: Anterior labrum"');
    expect(html).toContain('aria-current="step"');
  });

  it("renders specific normal-to-injury comparison controls when a case bridge exists", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <GuidedTour
          dir="/images/test"
          steps={[tourSteps[1]]}
          structureCase={{ "Anterior labrum": { caseId: "case-bankart", label: "Bankart lesion" } }}
          caseImageById={{
            "case-bankart": {
              src: "/images/cases/bankart.jpg",
              caption: "Abnormal anterior inferior labrum case image.",
            },
          }}
          caseBasePath="/courses/shoulder-mri/cases"
        />
      </MemoryRouter>,
    );

    expect(html).toContain("Compare normal vs injury");
    expect(html).toContain('aria-label="Show normal-to-pathology comparison for Bankart lesion"');
    expect(html).toContain("See it injured: Bankart lesion");
    expect(html).toContain('aria-label="Open injured case: Bankart lesion"');
    expect(html).toContain('/courses/shoulder-mri/cases/case-bankart');
  });

  it("renders nothing for empty tour steps", () => {
    const html = renderToStaticMarkup(<GuidedTour dir="/images/test" steps={[]} />);

    expect(html).toBe("");
  });

  it("keeps edge anatomy labels inside the mobile image frame", () => {
    const html = renderToStaticMarkup(
      <AnnotatedSlice
        dir="/images/test"
        sliceIndex={0}
        showLabels
        markers={[
          { x: 14, y: 54, label: "Medial collateral ligament" },
          { x: 88, y: 82, label: "Abductors" },
        ]}
      />,
    );

    expect(html).toContain("left-0 translate-x-0 text-left");
    expect(html).toContain("right-0 translate-x-0 text-right");
    expect(html).toContain("bottom-[140%]");
    expect(html).not.toContain("whitespace-nowrap");
  });
});
