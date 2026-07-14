import { describe, expect, it } from "vitest";
import {
  createIssueReportInput,
  deviceClassFor,
  type IssueReportEnvironment,
} from "@/lib/issue-report";

const environment: IssueReportEnvironment = {
  pathname: "/courses/elbow-mri/normal-elbow-mri",
  search: "?mode=tour&series=sag-ir",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
  platform: "iPhone",
  maxTouchPoints: 5,
  viewportWidth: 390,
  viewportHeight: 844,
  online: true,
  standalone: true,
};

describe("structured issue reports", () => {
  it("captures authored workstation state without reporter identity or free text", () => {
    const report = createIssueReportInput(
      "marker-location",
      "elbow-mri",
      {
        pageKind: "normal-mri",
        mode: "Guided Tour",
        seriesId: "sag-ir",
        seriesLabel: "Sagittal IR",
        sliceIndex: 13,
        landmark: "Olecranon & triceps insertion",
        itemId: "ec-sag-q4",
      },
      environment,
    );

    expect(report).toMatchObject({
      courseId: "elbow-mri",
      route: "/courses/elbow-mri/normal-elbow-mri?mode=tour&series=sag-ir",
      sliceNumber: 14,
      landmark: "Olecranon & triceps insertion",
      deviceClass: "ios",
      displayMode: "standalone",
      viewport: "390x844",
    });
    expect(report).not.toHaveProperty("name");
    expect(report).not.toHaveProperty("email");
    expect(report).not.toHaveProperty("notes");
    expect(report).not.toHaveProperty("userAgent");
  });

  it("bounds captured values and rejects invalid slice indexes", () => {
    const report = createIssueReportInput(
      "display",
      "knee-mri",
      { landmark: " x ".repeat(200), sliceIndex: -1 },
      { ...environment, pathname: "not-a-path", search: "" },
    );
    expect(report.route).toBe("/");
    expect(report.landmark?.length).toBeLessThanOrEqual(160);
    expect(report.sliceNumber).toBeNull();
  });

  it("never creates a scheme-relative admin review link", () => {
    const report = createIssueReportInput(
      "interaction",
      "hip-mri",
      {},
      { ...environment, pathname: "//malicious.example/path", search: "" },
    );
    expect(report.route).toBe("/");
  });

  it("recognizes touch-reporting iPadOS as iOS", () => {
    expect(
      deviceClassFor({
        ...environment,
        userAgent: "Mozilla/5.0 (Macintosh)",
        platform: "MacIntel",
        maxTouchPoints: 5,
      }),
    ).toBe("ios");
  });
});
