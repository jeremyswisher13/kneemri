import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/db";
import { isPreviewAuthSession } from "@/lib/local-preview-auth";
import type {
  IssueReportInput,
  IssueReportRecord,
  IssueReportStatus,
} from "@/lib/issue-report";

export const LOCAL_ISSUE_REPORTS_KEY = "uclaSportsMri.localIssueReports.v1";

type IssueStorage = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): IssueStorage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

export function readLocalIssueReports(
  storage: IssueStorage | null = browserStorage(),
): IssueReportRecord[] {
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(LOCAL_ISSUE_REPORTS_KEY) ?? "[]") as IssueReportRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalIssueReports(reports: IssueReportRecord[], storage: IssueStorage | null) {
  storage?.setItem(LOCAL_ISSUE_REPORTS_KEY, JSON.stringify(reports));
}

export function saveLocalIssueReport(
  input: IssueReportInput,
  storage: IssueStorage | null = browserStorage(),
): IssueReportRecord {
  const seconds = Math.floor(Date.now() / 1000);
  const report: IssueReportRecord = {
    id: `preview-issue-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...input,
    status: "open",
    createdAt: { seconds },
    updatedAt: { seconds },
  };
  writeLocalIssueReports([report, ...readLocalIssueReports(storage)], storage);
  return report;
}

export function updateLocalIssueReportStatus(
  reportId: string,
  status: IssueReportStatus,
  storage: IssueStorage | null = browserStorage(),
): IssueReportRecord | null {
  let updated: IssueReportRecord | null = null;
  const seconds = Math.floor(Date.now() / 1000);
  const reports = readLocalIssueReports(storage).map((report) => {
    if (report.id !== reportId) return report;
    updated = { ...report, status, updatedAt: { seconds } };
    return updated;
  });
  writeLocalIssueReports(reports, storage);
  return updated;
}

export const ISSUE_REPORT_ACK_TIMEOUT_MS = 6000;

/**
 * Submit a report WITHOUT waiting on the backend acknowledgement.
 *
 * `doc()` mints the id client-side, so the server round-trip is never needed to
 * show the learner a reference. A Firestore write promise only settles on
 * backend ack — offline it stays pending indefinitely (the SDK itself warns it
 * is "usually undesirable to await" it), and `persistentLocalCache` has already
 * durably queued the mutation to IndexedDB. So a timeout here means QUEUED, not
 * failed. Genuine errors (e.g. permission-denied) still reject inside the window
 * and surface to the caller. Promise.race attaches handlers to the write, so a
 * late rejection can't become an unhandled rejection.
 */
export async function submitIssueReport(
  input: IssueReportInput,
): Promise<{ id: string; queued: boolean }> {
  if (isPreviewAuthSession()) {
    return { id: saveLocalIssueReport(input).id, queued: false };
  }
  const reportRef = doc(collection(db, "issueReports"));
  const acked = setDoc(reportRef, {
    ...input,
    status: "open",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }).then(() => "acked" as const);
  const outcome = await Promise.race([
    acked,
    new Promise<"queued">((resolve) => {
      setTimeout(() => resolve("queued"), ISSUE_REPORT_ACK_TIMEOUT_MS);
    }),
  ]);
  return { id: reportRef.id, queued: outcome === "queued" };
}

export const ISSUE_REPORT_PAGE_LIMIT = 250;

/**
 * Fetch reports for ONE course. The course filter runs server-side on purpose:
 * a global `limit()` applied before a client-side course filter would silently
 * hide a course's older reports (and under-count the status tabs) once the
 * collection exceeded the limit across all four courses.
 * Requires the issueReports (courseId ASC, createdAt DESC) composite index.
 */
export async function getIssueReports(courseId?: string): Promise<IssueReportRecord[]> {
  if (isPreviewAuthSession()) {
    const local = readLocalIssueReports();
    return courseId ? local.filter((report) => report.courseId === courseId) : local;
  }
  const snapshot = await getDocs(
    query(
      collection(db, "issueReports"),
      ...(courseId ? [where("courseId", "==", courseId)] : []),
      orderBy("createdAt", "desc"),
      limit(ISSUE_REPORT_PAGE_LIMIT),
    ),
  );
  return snapshot.docs.map((reportDoc) => ({
    id: reportDoc.id,
    ...reportDoc.data(),
  })) as IssueReportRecord[];
}

export async function updateIssueReportStatus(
  reportId: string,
  status: IssueReportStatus,
): Promise<void> {
  if (isPreviewAuthSession()) {
    updateLocalIssueReportStatus(reportId, status);
    return;
  }
  await setDoc(
    doc(db, "issueReports", reportId),
    { status, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

