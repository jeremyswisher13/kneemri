import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import NormalMriMasteryPanel from "./NormalMriMasteryPanel";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-user" } }),
}));

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => ({
    loading: false,
    progress: {
      normalPlanesPassed: 2,
      totalNormalPlanes: 4,
    },
  }),
}));

describe("NormalMriMasteryPanel", () => {
  it("renders course progress and highlights the active workstation step", () => {
    const html = renderToStaticMarkup(
      <NormalMriMasteryPanel
        courseId="knee-mri"
        activeMode="correlate"
        activeModeLabel="Cross-Plane"
        seriesLabel="Sagittal PD-FS"
        availableModes={[
          { id: "explore", label: "Explore" },
          { id: "tour", label: "Guided Tour" },
          { id: "check", label: "Knowledge Check" },
          { id: "correlate", label: "Cross-Plane" },
          { id: "caq", label: "Image CAQ" },
        ]}
      />,
    );

    expect(html).toContain("Normal Knee MRI");
    expect(html).toContain("2 of 4 series passed");
    expect(html).toContain("Current focus:");
    expect(html).toContain("Sagittal PD-FS");
    expect(html).toContain("Cross-Plane");
    expect(html).toContain('aria-current="step"');
    expect(html).toContain("confirm on another plane");
  });
});
