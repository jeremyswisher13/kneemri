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
  it("renders compact course progress without repeating workstation controls", () => {
    const html = renderToStaticMarkup(
      <NormalMriMasteryPanel courseId="knee-mri" />,
    );

    expect(html).toContain("Normal MRI progress");
    expect(html).toContain("2 of 4 series passed");
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="50"');
    expect(html).not.toContain("Current focus:");
    expect(html).not.toContain("Stack Sweep");
    expect(html).not.toContain("Before calling pathology");
  });
});
