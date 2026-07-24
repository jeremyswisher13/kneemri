import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AppErrorFallback } from "./ErrorBoundary";

describe("ErrorBoundary fallback", () => {
  it("recognizes failures that occur while loading an updated app page", () => {
    const html = renderToStaticMarkup(
      <AppErrorFallback
        error={new Error("Failed to fetch dynamically imported module")}
        onReload={vi.fn()}
      />,
    );

    expect(html).toContain("This page needs a quick refresh");
    expect(html).toContain("updated while this screen was loading");
  });

  it("renders recovery, course-home, and support actions without overpromising saved work", () => {
    const html = renderToStaticMarkup(
      <AppErrorFallback error={new Error("Unexpected render failure")} onReload={vi.fn()} />,
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain("We couldn&#x27;t open this page");
    expect(html).toContain("Reload app");
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/support"');
    expect(html).toContain("Any progress already recorded to your account remains saved.");
    expect(html).not.toContain("Your progress has been saved");
  });
});
