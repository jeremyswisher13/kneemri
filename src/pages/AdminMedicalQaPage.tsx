import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { courseRegistry } from "@/content/courses";
import {
  medicalQaCourseSummaries,
  medicalQaGeneratedAt,
  medicalQaPriorityItemCount,
  medicalQaReviewBreakdown,
  medicalQaTotals,
  type MedicalQaPriorityItem,
  type MedicalQaRisk,
} from "@/content/medical-qa.generated";
import { getMedicalQaReviews, saveMedicalQaReview } from "@/lib/firestore";
import {
  MEDICAL_QA_REVIEW_LABELS,
  MEDICAL_QA_REVIEW_STATUSES,
  medicalQaReviewId,
  type MedicalQaReviewRecord,
  type MedicalQaReviewStatus,
} from "@/lib/medical-qa-review";

type CourseFilter = "all" | string;
type RiskFilter = "all" | MedicalQaRisk;
type ReviewStatusFilter = "all" | MedicalQaReviewStatus;

const riskStyles: Record<MedicalQaRisk, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  standard: "border-gray-200 bg-gray-50 text-gray-600",
};

const riskLabels: Record<MedicalQaRisk, string> = {
  high: "High",
  medium: "Medium",
  standard: "Standard",
};

const reviewStatusStyles: Record<MedicalQaReviewStatus, string> = {
  pending: "border-gray-200 bg-gray-50 text-gray-600",
  approved: "border-green-200 bg-green-50 text-green-700",
  "needs-revision": "border-red-200 bg-red-50 text-red-700",
  "source-needed": "border-amber-200 bg-amber-50 text-amber-700",
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatGeneratedDate(value: string): string {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function humanizeType(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function compactFlags(flags: string[]): string {
  if (!flags.length) return "none";
  return flags.map((flag) => flag.replaceAll("-", " ")).join(", ");
}

function csvEscape(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadCsv(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function itemMatchesQuery(item: MedicalQaPriorityItem, query: string): boolean {
  if (!query.trim()) return true;
  const needle = query.toLowerCase();
  return [
    item.courseTitle,
    item.itemType,
    item.itemId,
    item.section,
    item.title,
    item.sourcePath,
    item.textPreview,
    item.flags.join(" "),
  ].some((value) => value.toLowerCase().includes(needle));
}

function StatCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className={`mb-3 h-1 w-12 rounded-full ${tone}`} />
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function RiskBadge({ risk }: { risk: MedicalQaRisk }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${riskStyles[risk]}`}>
      {riskLabels[risk]}
    </span>
  );
}

function ReviewStatusBadge({ status }: { status: MedicalQaReviewStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${reviewStatusStyles[status]}`}>
      {MEDICAL_QA_REVIEW_LABELS[status]}
    </span>
  );
}

function CourseQaCard({
  courseId,
  active,
  onSelect,
}: {
  courseId: string;
  active: boolean;
  onSelect: (courseId: string) => void;
}) {
  const summary = medicalQaCourseSummaries[courseId];
  const breakdown = medicalQaReviewBreakdown[courseId];
  const course = courseRegistry.find((item) => item.id === courseId);
  const sourcePct = pct(summary.sourceCheckItems, summary.reviewItems);

  return (
    <button
      type="button"
      onClick={() => onSelect(courseId)}
      className={`rounded-xl border bg-white p-4 text-left shadow-sm transition-colors ${
        active ? "border-ucla-blue ring-2 ring-ucla-blue/20" : "border-gray-100 hover:border-ucla-blue/40"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-900">{course?.shortTitle ?? summary.title}</h2>
          <p className="mt-1 text-xs text-gray-500">
            {summary.modules} modules · {summary.cases} cases · {summary.normalPlanes} planes
          </p>
        </div>
        <span className="rounded-full bg-ucla-light px-2 py-0.5 text-xs font-semibold text-ucla-dark">
          {sourcePct}%
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-red-50 px-2 py-2">
          <p className="text-lg font-bold text-red-700">{formatNumber(summary.highRiskItems)}</p>
          <p className="text-[11px] font-medium text-red-700">High</p>
        </div>
        <div className="rounded-lg bg-amber-50 px-2 py-2">
          <p className="text-lg font-bold text-amber-700">{formatNumber(breakdown.risks.medium)}</p>
          <p className="text-[11px] font-medium text-amber-700">Medium</p>
        </div>
        <div className="rounded-lg bg-gray-50 px-2 py-2">
          <p className="text-lg font-bold text-gray-700">{formatNumber(summary.sourceCheckItems)}</p>
          <p className="text-[11px] font-medium text-gray-600">Source</p>
        </div>
      </div>
    </button>
  );
}

function SourceCheckRow({
  item,
  reviewStatus,
  selected,
  onSelect,
}: {
  item: MedicalQaPriorityItem;
  reviewStatus: MedicalQaReviewStatus;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <tr className={`align-top hover:bg-blue-50/30 ${selected ? "bg-blue-50/60" : ""}`}>
      <td className="py-3 pr-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <RiskBadge risk={item.risk} />
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              {humanizeType(item.itemType)}
            </span>
          </div>
          <p className="max-w-xl text-sm font-semibold text-gray-900">{item.title}</p>
          <p className="max-w-2xl text-xs leading-5 text-gray-600">{item.textPreview}</p>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-gray-700">
        <div className="font-medium">{item.courseTitle.replace(" for Primary Care Sports Medicine", "")}</div>
        <div className="mt-1 text-xs text-gray-500">{item.section}</div>
      </td>
      <td className="py-3 pr-4">
        <code className="block max-w-[220px] break-words rounded-lg bg-gray-50 px-2 py-1 text-[11px] leading-5 text-gray-700">
          {item.sourcePath}
        </code>
      </td>
      <td className="py-3 pr-4">
        <div className="flex flex-col items-start gap-2">
          <ReviewStatusBadge status={reviewStatus} />
          <button
            type="button"
            onClick={onSelect}
            className="rounded-md border border-ucla-blue/30 bg-white px-2.5 py-1 text-xs font-semibold text-ucla-blue transition-colors hover:bg-ucla-light"
          >
            Review
          </button>
        </div>
      </td>
      <td className="py-3 text-xs leading-5 text-gray-500">{compactFlags(item.flags)}</td>
    </tr>
  );
}

export default function AdminMedicalQaPage() {
  const { user } = useAuth();
  const [courseFilter, setCourseFilter] = useState<CourseFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("high");
  const [reviewStatusFilter, setReviewStatusFilter] = useState<ReviewStatusFilter>("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sourceCheckItems, setSourceCheckItems] = useState<MedicalQaPriorityItem[]>([]);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState<string | null>(null);
  const [reviewsById, setReviewsById] = useState<Record<string, MedicalQaReviewRecord>>({});
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<MedicalQaReviewStatus>("pending");
  const [draftSourceNotes, setDraftSourceNotes] = useState("");
  const [draftReviewerNotes, setDraftReviewerNotes] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/medical-qa/source-check-items.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Source-check queue failed to load (${response.status})`);
        return response.json() as Promise<MedicalQaPriorityItem[]>;
      })
      .then((items) => {
        if (!active) return;
        setSourceCheckItems(items);
        setQueueError(null);
      })
      .catch((error: Error) => {
        if (!active) return;
        setQueueError(error.message);
      })
      .finally(() => {
        if (active) setQueueLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getMedicalQaReviews()
      .then((records) => {
        if (!active) return;
        setReviewsById(records);
        setReviewsError(null);
      })
      .catch((error: Error) => {
        if (!active) return;
        setReviewsError(error.message);
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const courseEntries = Object.entries(medicalQaCourseSummaries);
  const itemTypeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of sourceCheckItems) {
      counts.set(item.itemType, (counts.get(item.itemType) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [sourceCheckItems]);

  const filteredItems = useMemo(() => {
    return sourceCheckItems.filter((item) => {
      if (courseFilter !== "all" && item.courseId !== courseFilter) return false;
      if (riskFilter !== "all" && item.risk !== riskFilter) return false;
      const reviewStatus = reviewsById[medicalQaReviewId(item)]?.status ?? "pending";
      if (reviewStatusFilter !== "all" && reviewStatus !== reviewStatusFilter) return false;
      if (typeFilter !== "all" && item.itemType !== typeFilter) return false;
      return itemMatchesQuery(item, query);
    });
  }, [courseFilter, query, reviewStatusFilter, reviewsById, riskFilter, sourceCheckItems, typeFilter]);

  const visibleItems = filteredItems.slice(0, 80);
  const activeCourseId = courseFilter === "all" ? null : courseFilter;
  const selectedBreakdown = activeCourseId ? medicalQaReviewBreakdown[activeCourseId] : null;
  const selectedItem = selectedReviewId
    ? sourceCheckItems.find((item) => medicalQaReviewId(item) === selectedReviewId) ?? null
    : null;
  const reviewStatusCounts = useMemo(() => {
    const counts: Record<MedicalQaReviewStatus, number> = {
      pending: 0,
      approved: 0,
      "needs-revision": 0,
      "source-needed": 0,
    };
    for (const item of sourceCheckItems) {
      const status = reviewsById[medicalQaReviewId(item)]?.status ?? "pending";
      counts[status] += 1;
    }
    return counts;
  }, [reviewsById, sourceCheckItems]);

  function openReview(item: MedicalQaPriorityItem) {
    const reviewId = medicalQaReviewId(item);
    const review = reviewsById[reviewId];
    setSelectedReviewId(reviewId);
    setDraftStatus(review?.status ?? "pending");
    setDraftSourceNotes(review?.sourceNotes ?? "");
    setDraftReviewerNotes(review?.reviewerNotes ?? "");
    setSaveMessage(null);
  }

  async function handleSaveReview() {
    if (!user || !selectedItem || !selectedReviewId) return;
    setSavingReview(true);
    setSaveMessage(null);
    try {
      const saved = await saveMedicalQaReview(user.uid, user.email ?? "", selectedItem, {
        status: draftStatus,
        sourceNotes: draftSourceNotes,
        reviewerNotes: draftReviewerNotes,
      });
      setReviewsById((prev) => ({ ...prev, [selectedReviewId]: saved }));
      setSaveMessage("Saved");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Failed to save review");
    } finally {
      setSavingReview(false);
    }
  }

  function handleExportReviewCsv() {
    const headers = [
      "course_id",
      "course_title",
      "item_type",
      "item_id",
      "risk",
      "review_status",
      "source_notes",
      "reviewer_notes",
      "reviewer_email",
      "source_path",
      "flags",
      "title",
      "text_preview",
    ];
    const rows = sourceCheckItems.map((item) => {
      const review = reviewsById[medicalQaReviewId(item)];
      return [
        item.courseId,
        item.courseTitle,
        item.itemType,
        item.itemId,
        item.risk,
        review?.status ?? "pending",
        review?.sourceNotes ?? "",
        review?.reviewerNotes ?? "",
        review?.reviewerEmail ?? "",
        item.sourcePath,
        item.flags.join(";"),
        item.title,
        item.textPreview,
      ];
    });
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => csvEscape(cell)).join(","))
      .join("\n");
    downloadCsv(csvContent, `medical-qa-review-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical QA Review</h1>
          <p className="mt-1 text-gray-500">
            Generated {formatGeneratedDate(medicalQaGeneratedAt)} · physician source-check queue
          </p>
        </div>
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            medicalQaTotals.diagnostics === 0
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {medicalQaTotals.diagnostics === 0
            ? "Automated diagnostics clear"
            : `${medicalQaTotals.diagnostics} diagnostics pending`}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Review Items" value={formatNumber(medicalQaTotals.reviewItems)} tone="bg-ucla-blue" />
        <StatCard label="Source Checks" value={formatNumber(medicalQaTotals.sourceCheckItems)} tone="bg-amber-500" />
        <StatCard label="High Risk" value={formatNumber(medicalQaTotals.highRiskItems)} tone="bg-red-500" />
        <StatCard label="Approved" value={formatNumber(reviewStatusCounts.approved)} tone="bg-green-500" />
        <StatCard label="Diagnostics" value={formatNumber(medicalQaTotals.diagnostics)} tone="bg-green-500" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {courseEntries.map(([courseId]) => (
          <CourseQaCard
            key={courseId}
            courseId={courseId}
            active={courseFilter === courseId}
            onSelect={(nextCourseId) => setCourseFilter(courseFilter === nextCourseId ? "all" : nextCourseId)}
          />
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Source-Check Queue</h2>
            <p className="mt-1 text-sm text-gray-500">
              {queueLoading
                ? "Loading queue"
                : `${formatNumber(filteredItems.length)} matching items · showing ${formatNumber(visibleItems.length)}${
                    filteredItems.length > visibleItems.length ? ` of ${formatNumber(filteredItems.length)}` : ""
                  }`}
              {!queueLoading && sourceCheckItems.length !== medicalQaPriorityItemCount
                ? ` · expected ${formatNumber(medicalQaPriorityItemCount)}`
                : ""}
              {reviewsLoading ? " · loading review status" : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportReviewCsv}
              disabled={queueLoading}
              className="rounded-lg border border-ucla-blue bg-white px-3 py-1.5 text-sm font-semibold text-ucla-blue transition-colors hover:bg-ucla-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              Export QA CSV
            </button>
            {(["all", "high", "medium", "standard"] as const).map((risk) => {
              const active = riskFilter === risk;
              return (
                <button
                  key={risk}
                  type="button"
                  onClick={() => setRiskFilter(risk)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    active ? "bg-ucla-blue text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {risk === "all" ? "All risk" : riskLabels[risk]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-2">
          <span className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Review status</span>
          {(["all", ...MEDICAL_QA_REVIEW_STATUSES] as const).map((status) => {
            const active = reviewStatusFilter === status;
            const count = status === "all" ? sourceCheckItems.length : reviewStatusCounts[status];
            return (
              <button
                key={status}
                type="button"
                onClick={() => setReviewStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  active ? "bg-ucla-blue text-white shadow-sm" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status === "all" ? "All" : MEDICAL_QA_REVIEW_LABELS[status]} ({formatNumber(count)})
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-ucla-blue focus:ring-2 focus:ring-ucla-blue/20"
              placeholder="Finding, source file, flag, item id"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Item type</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-ucla-blue focus:ring-2 focus:ring-ucla-blue/20"
            >
              <option value="all">All item types</option>
              {itemTypeOptions.map(([type, count]) => (
                <option key={type} value={type}>
                  {humanizeType(type)} ({count})
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedBreakdown && (
          <div className="mt-5 grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">High-risk share</p>
              <p className="mt-1 text-lg font-bold text-gray-900">
                {pct(selectedBreakdown.risks.high, medicalQaCourseSummaries[activeCourseId!].reviewItems)}%
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Top source type</p>
              <p className="mt-1 truncate text-lg font-bold text-gray-900">
                {humanizeType(
                  Object.entries(selectedBreakdown.sourceCheckByType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "none",
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Automated diagnostics</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{medicalQaCourseSummaries[activeCourseId!].diagnostics}</p>
            </div>
          </div>
        )}

        {queueError && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {queueError}
          </div>
        )}

        {reviewsError && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
            Review status could not be loaded: {reviewsError}
          </div>
        )}

        {selectedItem && (
          <div className="mt-5 rounded-xl border border-ucla-blue/20 bg-blue-50/40 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <RiskBadge risk={selectedItem.risk} />
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-600">
                    {humanizeType(selectedItem.itemType)}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-gray-900">{selectedItem.title}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-600">{selectedItem.textPreview}</p>
                <code className="mt-2 block break-words rounded-lg bg-white px-2 py-1 text-[11px] leading-5 text-gray-700">
                  {selectedItem.sourcePath}
                </code>
              </div>

              <label className="block min-w-[190px]">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
                <select
                  value={draftStatus}
                  onChange={(event) => setDraftStatus(event.target.value as MedicalQaReviewStatus)}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm outline-none transition-colors focus:border-ucla-blue focus:ring-2 focus:ring-ucla-blue/20"
                >
                  {MEDICAL_QA_REVIEW_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {MEDICAL_QA_REVIEW_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Source notes</span>
                <textarea
                  value={draftSourceNotes}
                  onChange={(event) => setDraftSourceNotes(event.target.value)}
                  className="mt-1 min-h-28 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-ucla-blue focus:ring-2 focus:ring-ucla-blue/20"
                  placeholder="Citation, guideline, article, or rationale used to verify this claim"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Reviewer notes</span>
                <textarea
                  value={draftReviewerNotes}
                  onChange={(event) => setDraftReviewerNotes(event.target.value)}
                  className="mt-1 min-h-28 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-ucla-blue focus:ring-2 focus:ring-ucla-blue/20"
                  placeholder="Content edits needed, reviewer concerns, or sign-off context"
                />
              </label>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSaveReview}
                disabled={!user || savingReview}
                className="rounded-lg bg-ucla-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ucla-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingReview ? "Saving..." : "Save review"}
              </button>
              {saveMessage && (
                <span className={`text-sm font-medium ${saveMessage === "Saved" ? "text-green-700" : "text-red-700"}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left">
            <thead>
              <tr className="border-b-2 border-ucla-blue">
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-gray-600">Item</th>
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-gray-600">Course</th>
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-gray-600">Source</th>
                <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-gray-600">Review</th>
                <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queueLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-500">
                    Loading source-check items...
                  </td>
                </tr>
              ) : visibleItems.length > 0 ? (
                visibleItems.map((item) => {
                  const reviewId = medicalQaReviewId(item);
                  return (
                    <SourceCheckRow
                      key={`${item.courseId}:${item.itemType}:${item.itemId}`}
                      item={item}
                      reviewStatus={reviewsById[reviewId]?.status ?? "pending"}
                      selected={selectedReviewId === reviewId}
                      onSelect={() => openReview(item)}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-500">
                    No matching source-check items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
