import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
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

export async function submitIssueReport(input: IssueReportInput): Promise<{ id: string }> {
  if (isPreviewAuthSession()) {
    return { id: saveLocalIssueReport(input).id };
  }
  const reportRef = await addDoc(collection(db, "issueReports"), {
    ...input,
    status: "open",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: reportRef.id };
}

export async function getIssueReports(): Promise<IssueReportRecord[]> {
  if (isPreviewAuthSession()) return readLocalIssueReports();
  const snapshot = await getDocs(
    query(collection(db, "issueReports"), orderBy("createdAt", "desc"), limit(250)),
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

