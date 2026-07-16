import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ISSUE_REPORT_ACK_TIMEOUT_MS,
  readLocalIssueReports,
  saveLocalIssueReport,
  submitIssueReport,
  updateLocalIssueReportStatus,
} from "@/lib/issue-report-store";
import type { IssueReportInput } from "@/lib/issue-report";

// The real (non-preview) submit path. A Firestore write promise only settles on
// backend ACK, so offline it stays pending forever — the bug this guards against
// was an unbounded `await` that wedged the dialog open with the page scroll-locked.
const setDocMock = vi.hoisted(() => vi.fn());
vi.mock("firebase/firestore", () => ({
  collection: () => ({}),
  doc: () => ({ id: "generated-report-id" }),
  setDoc: setDocMock,
  serverTimestamp: () => ({}),
  getDocs: vi.fn(),
  limit: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ db: {} }));
vi.mock("@/lib/local-preview-auth", () => ({ isPreviewAuthSession: () => false }));

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

describe("submitIssueReport (real Firestore path)", () => {
  afterEach(() => {
    vi.useRealTimers();
    setDocMock.mockReset();
  });

  it("resolves as queued when the write never acks (offline) instead of hanging", async () => {
    vi.useFakeTimers();
    // Offline: the SDK durably queues the mutation but never settles the promise.
    setDocMock.mockReturnValue(new Promise(() => {}));

    const pending = submitIssueReport(input);
    await vi.advanceTimersByTimeAsync(ISSUE_REPORT_ACK_TIMEOUT_MS + 1);

    await expect(pending).resolves.toEqual({ id: "generated-report-id", queued: true });
  });

  it("resolves as acked when the write completes online", async () => {
    setDocMock.mockResolvedValue(undefined);
    await expect(submitIssueReport(input)).resolves.toEqual({
      id: "generated-report-id",
      queued: false,
    });
  });

  it("propagates a genuine write rejection (e.g. permission-denied)", async () => {
    setDocMock.mockRejectedValue(new Error("permission-denied"));
    await expect(submitIssueReport(input)).rejects.toThrow("permission-denied");
  });
});

