import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NormalSeriesSelector from "./NormalSeriesSelector";

describe("NormalSeriesSelector", () => {
  it("renders plane chips with active and upcoming states", () => {
    const html = renderToStaticMarkup(
      <NormalSeriesSelector
        series={[
          { id: "sag-pdfs", label: "Sagittal PD-FS" },
          { id: "cor-pdfs", label: "Coronal PD-FS" },
        ]}
        activeId="cor-pdfs"
        onSeriesChange={() => {}}
        comingSoon={["Axial T1"]}
      />,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="MRI series"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Coronal PD-FS");
    expect(html).toContain("Axial T1");
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain("min-h-9");
  });
});
