import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { CourseDefinition } from "@/content/courses";
import {
  issueCategoryLabel,
  type IssueReportRecord,
  type IssueReportStatus,
} from "@/lib/issue-report";
import { getIssueReports, updateIssueReportStatus } from "@/lib/issue-report-store";

const STATUS_LABELS: Record<IssueReportStatus, string> = {
  open: "Open",
  reviewing: "Reviewing",
  resolved: "Resolved",
};

const STATUS_CLASSES: Record<IssueReportStatus, string> = {
  open: "border-rose-200 bg-rose-50 text-rose-700",
  reviewing: "border-amber-200 bg-amber-50 text-amber-800",
  resolved: "border-green-200 bg-green-50 text-green-700",
};

function formatTimestamp(timestamp: { seconds: number } | null) {
  if (!timestamp) return "Pending sync";
  return new Date(timestamp.seconds * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function IssueReportsPanel({ course }: { course: CourseDefinition }) {
  const [reports, setReports] = useState<IssueReportRecord[]>([]);
  const [filter, setFilter] = useState<"all" | IssueReportStatus>("open");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setReports(await getIssueReports());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Issue reports could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const courseReports = useMemo(
    () => reports.filter((report) => report.courseId === course.id),
    [course.id, reports],
  );
  const counts = useMemo(
    () => ({
      all: courseReports.length,
      open: courseReports.filter((report) => report.status === "open").length,
      reviewing: courseReports.filter((report) => report.status === "reviewing").length,
      resolved: courseReports.filter((report) => report.status === "resolved").length,
    }),
    [courseReports],
  );
  const visible = useMemo(
    () => (filter === "all" ? courseReports : courseReports.filter((report) => report.status === filter)),
    [courseReports, filter],
  );

  async function setStatus(reportId: string, status: IssueReportStatus) {
    setUpdatingId(reportId);
    setError(null);
    try {
      await updateIssueReportStatus(reportId, status);
      setReports((current) =>
        current.map((report) => (report.id === reportId ? { ...report, status } : report)),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The issue status could not be updated.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section aria-labelledby="issue-reports-heading" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="issue-reports-heading" className="text-xl font-semibold text-gray-900">
            Issue Reports
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
            Structured reports from {course.shortTitle}. Reporter identity, free text, raw device identifiers,
            and patient information are not collected.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Issue status filter">
        {(["open", "reviewing", "resolved", "all"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            aria-pressed={filter === status}
            className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              filter === status ? "bg-ucla-blue text-white" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {status === "all" ? "All" : STATUS_LABELS[status]} ({counts[status]})
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && reports.length === 0 ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <p className="text-sm font-semibold text-gray-700">No {filter === "all" ? "" : `${filter} `}reports</p>
          <p className="mt-1 text-sm text-gray-500">New reports appear here after they sync.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((report) => {
            const context = [
              report.mode,
              report.seriesLabel,
              report.sliceNumber ? `Slice ${report.sliceNumber}` : null,
              report.landmark,
            ].filter(Boolean) as string[];
            return (
              <article
                key={report.id}
                data-testid="issue-report-row"
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {issueCategoryLabel(report.category)}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_CLASSES[report.status]}`}>
                        {STATUS_LABELS[report.status]}
                      </span>
                      {report.pageKind === "normal-mri" && (
                        <span className="rounded-full bg-ucla-light px-2 py-0.5 text-xs font-semibold text-ucla-dark">
                          Normal MRI
                        </span>
                      )}
                    </div>
                    <p className="mt-2 break-words text-sm text-gray-700">
                      {context.length ? context.join(" · ") : "Course page"}
                    </p>
                    {report.itemId && (
                      <p className="mt-1 break-all text-xs text-gray-500">Content id: {report.itemId}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>{formatTimestamp(report.createdAt)}</span>
                      <span>{report.deviceClass} · {report.displayMode} · {report.viewport}</span>
                      <span>{report.online ? "Online" : "Captured offline"}</span>
                      <span>{report.appVersion}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Link
                      to={report.route}
                      className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Open screen
                    </Link>
                    <select
                      aria-label={`Status for ${issueCategoryLabel(report.category)}`}
                      value={report.status}
                      disabled={updatingId === report.id}
                      onChange={(event) => setStatus(report.id, event.target.value as IssueReportStatus)}
                      className="min-h-11 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
                    >
                      <option value="open">Open</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

