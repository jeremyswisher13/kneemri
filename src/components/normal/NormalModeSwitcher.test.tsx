import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NormalModeSwitcher from "./NormalModeSwitcher";

describe("NormalModeSwitcher", () => {
  it("renders a mobile-safe segmented control with a clear active mode", () => {
    const html = renderToStaticMarkup(
      <NormalModeSwitcher
        modes={[
          { id: "explore", label: "Explore" },
          { id: "tour", label: "Guided Tour" },
          { id: "check", label: "Knowledge Check" },
          { id: "correlate", label: "Cross-Plane" },
        ]}
        activeMode="check"
        onModeChange={() => {}}
      />,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Normal MRI modes"');
    expect(html).toContain("w-full");
    expect(html).toContain("max-w-full");
    expect(html).toContain("basis-[8.5rem]");
    expect(html).toContain("sm:inline-flex");
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Knowledge Check");
  });
});
