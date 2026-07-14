import { describe, expect, it } from "vitest";
import {
  readLocalIssueReports,
  saveLocalIssueReport,
  updateLocalIssueReportStatus,
} from "@/lib/issue-report-store";
import type { IssueReportInput } from "@/lib/issue-report";

function memoryStorage(): Pick<Storage, "getItem" | "setItem"> {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

const input: IssueReportInput = {
  schemaVersion: 1,
  category: "marker-location",
  courseId: "elbow-mri",
  route: "/courses/elbow-mri/normal-elbow-mri",
  pageKind: "normal-mri",
  mode: "Guided Tour",
  seriesId: "sag-ir",
  seriesLabel: "Sagittal IR",
  sliceNumber: 14,
  landmark: "Olecranon",
  itemId: "ec-sag-q4",
  appVersion: "web-test",
  deviceClass: "desktop",
  displayMode: "browser",
  viewport: "1440x1000",
  online: true,
};

describe("local issue report store", () => {
  it("persists and resolves a structured report", () => {
    const storage = memoryStorage();
    const report = saveLocalIssueReport(input, storage);
    expect(readLocalIssueReports(storage)).toHaveLength(1);
    expect(readLocalIssueReports(storage)[0]).toMatchObject({ status: "open", landmark: "Olecranon" });

    updateLocalIssueReportStatus(report.id, "resolved", storage);
    expect(readLocalIssueReports(storage)[0].status).toBe("resolved");
  });
});

