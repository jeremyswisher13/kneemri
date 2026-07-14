import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CourseDefinition } from "@/content/courses";
import { useIssueReportContext } from "@/contexts/IssueReportContext";
import {
  browserIssueEnvironment,
  createIssueReportInput,
  ISSUE_REPORT_CATEGORIES,
  type IssueReportCategory,
} from "@/lib/issue-report";

export default function IssueReportButton({ course }: { course: CourseDefinition }) {
  const { pageContext } = useIssueReportContext();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<IssueReportCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(submitting);

  useEffect(() => {
    submittingRef.current = submitting;
  }, [submitting]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submittingRef.current) setOpen(false);
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  function close() {
    if (submitting) return;
    setOpen(false);
    setCategory(null);
    setSubmittedId(null);
    setError(null);
  }

  async function submit() {
    if (!category) return;
    setSubmitting(true);
    setError(null);
    try {
      const input = createIssueReportInput(
        category,
        course.id,
        pageContext,
        browserIssueEnvironment(),
      );
      const { submitIssueReport } = await import("@/lib/issue-report-store");
      const result = await submitIssueReport(input);
      setSubmittedId(result.id);
    } catch {
      setError("The report could not be saved. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const captured = [
    pageContext.mode,
    pageContext.seriesLabel,
    typeof pageContext.sliceIndex === "number" ? `Slice ${pageContext.sliceIndex + 1}` : null,
    pageContext.landmark,
  ].filter(Boolean) as string[];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report an issue"
        title="Report an issue"
        data-testid="report-issue-button"
        className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 sm:min-h-0 sm:min-w-0 sm:py-1.5"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-1.5a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5h.01" />
        </svg>
        <span className="hidden xl:inline">Report issue</span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) close();
            }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="issue-report-title"
              tabIndex={-1}
              className="max-h-[92svh] w-full overflow-y-auto rounded-t-lg bg-white shadow-2xl outline-none sm:max-w-lg sm:rounded-lg"
            >
              <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
                <div>
                  <h2 id="issue-report-title" className="text-lg font-semibold text-gray-900">
                    Report an issue
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    The app records this screen and device state. No name, free text, or patient information is collected.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close issue report"
                  className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-xl text-gray-500 hover:bg-gray-100"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="space-y-5 px-5 py-5">
                {submittedId ? (
                  <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800">
                    <p className="font-semibold">Report received</p>
                    <p className="mt-1">Reference {submittedId.slice(-8)}. It is now in the course-director review queue.</p>
                  </div>
                ) : (
                  <>
                    <fieldset>
                      <legend className="text-sm font-semibold text-gray-900">What needs attention?</legend>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {ISSUE_REPORT_CATEGORIES.map((item) => (
                          <label
                            key={item.id}
                            className={`cursor-pointer rounded-lg border px-3 py-3 transition-colors ${
                              category === item.id
                                ? "border-ucla-blue bg-ucla-light/60 ring-1 ring-ucla-blue"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="issue-category"
                              value={item.id}
                              checked={category === item.id}
                              onChange={() => setCategory(item.id)}
                              className="sr-only"
                            />
                            <span className="block text-sm font-semibold text-gray-900">{item.label}</span>
                            <span className="mt-1 block text-xs leading-5 text-gray-500">{item.description}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Captured context</p>
                      <p className="mt-1 text-sm font-medium text-gray-800">{course.shortTitle}</p>
                      <p className="mt-1 break-words text-xs leading-5 text-gray-600">
                        {captured.length ? captured.join(" · ") : "Current course page"}
                      </p>
                    </div>

                    {error && (
                      <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-4">
                {submittedId ? (
                  <button
                    type="button"
                    onClick={close}
                    className="min-h-11 rounded-lg bg-ucla-blue px-4 py-2 text-sm font-semibold text-white hover:bg-ucla-dark"
                  >
                    Done
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={close}
                      className="min-h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={submit}
                      disabled={!category || submitting}
                      className="min-h-11 rounded-lg bg-ucla-blue px-4 py-2 text-sm font-semibold text-white hover:bg-ucla-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? "Sending..." : "Send report"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
