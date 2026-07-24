import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PageLoader from "./PageLoader";

describe("PageLoader", () => {
  it("renders a branded, accessible loading state", () => {
    const html = renderToStaticMarkup(
      <PageLoader fullHeight label="Loading your course access..." />,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('aria-label="Loading your course access..."');
    expect(html).toContain('src="/pwa-icon-192.png"');
    expect(html).toContain("page-loader-indicator");
    expect(html).not.toContain("Taking longer than expected");
  });

  it("uses a useful default label", () => {
    const html = renderToStaticMarkup(<PageLoader />);

    expect(html).toContain("Opening this page...");
  });
});
