import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnnotatedSlice from "./AnnotatedSlice";
import Button from "@/components/ui/Button";
import { findFocusedTourStepIndex, focusTargetKey, type TourFocusTarget } from "./guided-tour-focus";
import type { TourStep, StructureCorrelate, StructureReading } from "@/content/normal-mri-types";

/** Stepped, labeled walkthrough of the normal structures on one plane. */
export default function GuidedTour({
  dir,
  steps,
  structureCase = {},
  structurePearl = {},
  structureReading = {},
  structureCorrelate = {},
  caseImageById = {},
  caseBasePath = "/cases",
  isCaseAvailable,
  focusTarget,
  onContextChange,
}: {
  dir: string;
  steps: TourStep[];
  /** title → pathology case bridge ("See it injured →"). Optional per region. */
  structureCase?: Record<string, { caseId: string; label: string }>;
  /** title → "Watch for" teaching pearl. Optional per region. */
  structurePearl?: Record<string, string>;
  /** title → inline "reading point" (variant to not over-call + key measurement). */
  structureReading?: Record<string, StructureReading>;
  /** title → anatomy + ultrasound correlate panel. Optional per region. */
  structureCorrelate?: Record<string, StructureCorrelate>;
  /** caseId → first teaching image, for the inline normal↔abnormal compare. */
  caseImageById?: Record<string, { src: string; caption: string }>;
  /** Course-scoped base path for case links (e.g. "/courses/shoulder-mri/cases"). */
  caseBasePath?: string;
  /**
   * Whether the current role may actually OPEN a case. Residents are hard-gated
   * out of `residentVisible: false` cases by CasePage, so without this the
   * "See it injured" bridge sent them to a "Not Available" dead end.
   * Defaults to allowing everything (fellows/admins).
   */
  isCaseAvailable?: (caseId: string) => boolean;
  /** Missed knowledge-check item to open directly in the tour. */
  focusTarget?: TourFocusTarget | null;
  /** Supplies the active authored landmark to the structured issue reporter. */
  onContextChange?: (context: { sliceIndex: number; landmark: string; itemId: string }) => void;
}) {
  const [i, setI] = useState(0);
  const [compareOpen, setCompareOpen] = useState(false);
  const [correlateOpen, setCorrelateOpen] = useState(false);
  const [readingOpen, setReadingOpen] = useState(false);
  // Reset to the first step whenever the plane changes. Adjusted during render
  // (keyed on the stable per-plane `dir`) rather than in an effect, so the new
  // plane never renders for a frame against a stale step index.
  const [prevDir, setPrevDir] = useState(dir);
  const [prevFocusKey, setPrevFocusKey] = useState("");
  // Tracks the active step's title so we can collapse the abnormal-comparison
  // panel whenever the step changes (declared up here so the hook order is
  // stable — `step` itself is computed after the empty-steps early return).
  const [prevStepTitle, setPrevStepTitle] = useState("");
  if (dir !== prevDir) {
    setPrevDir(dir);
    setI(0);
    setPrevFocusKey("");
  }

  const activeFocusKey = focusTargetKey(focusTarget);
  if (activeFocusKey !== prevFocusKey) {
    setPrevFocusKey(activeFocusKey);
    if (focusTarget && steps.length) {
      setI(findFocusedTourStepIndex(steps, focusTarget));
      setCompareOpen(false);
      setCorrelateOpen(false);
      setReadingOpen(false);
    }
  }

  const step = steps.length ? steps[Math.min(i, steps.length - 1)] : null;
  useEffect(() => {
    if (!step) return;
    onContextChange?.({
      sliceIndex: step.sliceIndex,
      landmark: step.title,
      itemId: step.markers.map((marker) => marker.label).filter(Boolean).join(" | ") || step.title,
    });
  }, [onContextChange, step]);

  if (!step) return null;
  const atEnd = i >= steps.length - 1;
  const focusedStepIndex = focusTarget ? findFocusedTourStepIndex(steps, focusTarget) : -1;
  const isShowingFocusedStep = Boolean(focusTarget) && i === focusedStepIndex;

  // Collapse the abnormal-comparison panel whenever the step changes, so a new
  // structure never opens onto a stale pathology image.
  if (step.title !== prevStepTitle) {
    setPrevStepTitle(step.title);
    setCompareOpen(false);
    setCorrelateOpen(false);
    setReadingOpen(false);
  }

  // Hide the pathology bridge entirely when the target case is not openable by
  // this role — a visible link to a "Not Available" screen is worse than no link.
  const rawBridge = structureCase[step.title];
  const bridge = rawBridge && (isCaseAvailable?.(rawBridge.caseId) ?? true) ? rawBridge : undefined;
  const abnormal = bridge ? caseImageById[bridge.caseId] : undefined;
  const correlate = structureCorrelate[step.title];
  const reading = structureReading[step.title];

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-3">
        <AnnotatedSlice
          dir={dir}
          sliceIndex={step.sliceIndex}
          markers={step.markers}
          showLabels
          pulse
          alt={`MRI slice ${step.sliceIndex + 1} highlighting ${step.title}`}
        />
        {bridge && abnormal && compareOpen && (
          <figure className="overflow-hidden rounded-xl border border-rose-200 bg-white shadow-sm">
            <div className="border-b border-rose-100 bg-rose-50 px-3 py-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Normal-to-pathology compare
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-white bg-white/80 px-2.5 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Normal anchor</p>
                  <p className="mt-0.5 text-xs font-semibold text-gray-900">{step.title}</p>
                </div>
                <div className="rounded-lg border border-rose-100 bg-white/80 px-2.5 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-rose-500">Injury pattern</p>
                  <p className="mt-0.5 text-xs font-semibold text-rose-800">{bridge.label}</p>
                </div>
              </div>
            </div>
            <img src={abnormal.src} alt={abnormal.caption} className="w-full border-b border-rose-100" loading="lazy" />
            <figcaption className="px-3 py-2 text-xs leading-relaxed text-rose-800">
              <span className="font-semibold">Pathology contrast: </span>
              {abnormal.caption}
            </figcaption>
          </figure>
        )}
        {correlate && correlateOpen && (
          <div className="overflow-hidden rounded-xl border-2 border-sky-300 bg-sky-50">
            <div className="bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-800">
              Ultrasound correlate — {step.title}
            </div>
            <div className="space-y-3 p-3">
              {correlate.anatomy && (
                <figure className="rounded-lg border border-sky-200 bg-white p-2">
                  <img
                    src={correlate.anatomy.src}
                    alt={correlate.anatomy.caption}
                    className="mx-auto max-h-44"
                    loading="lazy"
                  />
                  <figcaption className="mt-1 text-center text-[11px] text-sky-700">
                    Anatomy: {correlate.anatomy.caption}
                  </figcaption>
                </figure>
              )}
              <div className="rounded-lg border border-sky-200 bg-white p-2.5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-sky-800">
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M3.75 9.75a8.25 8.25 0 0016.5 0M3.75 9.75V8.25A2.25 2.25 0 016 6h12a2.25 2.25 0 012.25 2.25v1.5" />
                  </svg>
                  On ultrasound
                  {!correlate.ultrasound.seen && (
                    <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      not the modality
                    </span>
                  )}
                </p>
                {correlate.ultrasound.image && (
                  <figure className="mt-2">
                    <img
                      src={correlate.ultrasound.image.src}
                      alt={correlate.ultrasound.image.caption}
                      className="w-full rounded-md border border-gray-200"
                      loading="lazy"
                    />
                    <figcaption className="mt-1 text-[10px] leading-tight text-gray-500">
                      {correlate.ultrasound.image.caption} · {correlate.ultrasound.image.attribution}
                    </figcaption>
                  </figure>
                )}
                <p className="mt-1.5 text-xs leading-relaxed text-gray-700">{correlate.ultrasound.appearance}</p>
                {correlate.ultrasound.tip && (
                  <p className="mt-1.5 text-[11px] leading-relaxed text-sky-700">
                    <span className="font-semibold">Probe:</span> {correlate.ultrasound.tip}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span>
            Step {i + 1} of {steps.length}
          </span>
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
            <span
              className="block h-full rounded-full bg-ucla-blue transition-all"
              style={{ width: `${((i + 1) / steps.length) * 100}%` }}
            />
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold text-gray-900">{step.title}</h3>
        {isShowingFocusedStep && focusTarget && (
          <div
            role="status"
            aria-live="polite"
            className="mt-3 rounded-lg border border-ucla-blue/20 bg-ucla-light/60 px-3 py-2 text-xs leading-relaxed text-[#003B5C]"
          >
            <span className="font-semibold">Reviewing missed item: </span>
            {focusTarget.structure}. This is the closest guided-tour match; use Back/Next to review nearby anatomy.
          </div>
        )}
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.note}</p>

        {structurePearl[step.title] && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 1a6 6 0 00-3.5 10.9c.28.2.5.56.5.95V14a1 1 0 001 1h4a1 1 0 001-1v-1.15c0-.39.22-.75.5-.95A6 6 0 0010 1z" />
              <path d="M7.5 17a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" />
            </svg>
            <p className="text-xs leading-relaxed text-amber-800">
              <span className="font-semibold">Watch for: </span>
              {structurePearl[step.title]}
            </p>
          </div>
        )}

        {reading && (reading.variant || reading.measure) && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setReadingOpen((v) => !v)}
              aria-pressed={readingOpen}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors sm:min-h-0 sm:py-1.5 sm:text-xs ${
                readingOpen
                  ? "border-indigo-300 bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                  : "border-indigo-300/70 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              Go deeper
              <svg
                className={`h-3 w-3 transition-transform ${readingOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {readingOpen && (
              <div className="mt-2 space-y-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2">
                {reading.variant && (
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-indigo-900">
                    <span className="mt-0.5 shrink-0 rounded bg-indigo-200 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-indigo-800">
                      Variant
                    </span>
                    {reading.variant}
                  </p>
                )}
                {reading.measure && (
                  <p className="flex items-start gap-2 text-xs leading-relaxed text-indigo-900">
                    <span className="mt-0.5 shrink-0 rounded bg-indigo-200 px-1 py-px text-[9px] font-bold uppercase tracking-wide text-indigo-800">
                      Measure
                    </span>
                    {reading.measure}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {correlate && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setCorrelateOpen((v) => !v)}
              aria-pressed={correlateOpen}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors sm:min-h-0 sm:py-1.5 sm:text-xs ${
                correlateOpen
                  ? "border-sky-300 bg-sky-100 text-sky-800 hover:bg-sky-200"
                  : "border-sky-300/70 bg-sky-50 text-sky-700 hover:bg-sky-100"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M3.75 9.75a8.25 8.25 0 0016.5 0M3.75 9.75V8.25A2.25 2.25 0 016 6h12a2.25 2.25 0 012.25 2.25v1.5" />
              </svg>
              {correlateOpen ? "Hide anatomy & US" : "Anatomy & ultrasound"}
            </button>
          </div>
        )}

        {bridge && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {abnormal && (
              <button
                type="button"
                onClick={() => setCompareOpen((v) => !v)}
                aria-pressed={compareOpen}
                aria-label={`${compareOpen ? "Hide" : "Show"} normal-to-pathology comparison for ${bridge.label}`}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors sm:min-h-0 sm:py-1.5 sm:text-xs ${
                  compareOpen
                    ? "border-rose-300 bg-rose-100 text-rose-700 hover:bg-rose-200"
                    : "border-rose-300/70 bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h7.5M3 12h7.5M3 16.5h7.5M21 7.5h-4.5M21 12h-4.5M21 16.5h-4.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5v15" />
                </svg>
                {compareOpen ? "Hide comparison" : "Compare normal vs injury"}
              </button>
            )}
            <Link
              to={`${caseBasePath}/${bridge.caseId}`}
              aria-label={`Open injured case: ${bridge.label}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-ucla-gold/60 bg-ucla-gold/10 px-3 py-2 text-sm font-semibold text-[#7a5d00] transition-colors hover:bg-ucla-gold/20 sm:min-h-0 sm:py-1.5 sm:text-xs"
            >
              See it injured: {bridge.label}
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <Button
            variant="secondary"
            size="sm"
            disabled={i === 0}
            onClick={() => setI((n) => n - 1)}
            className="min-h-11 px-4 text-sm lg:min-h-0 lg:px-3 lg:text-xs"
          >
            ← Back
          </Button>
          {!atEnd ? (
            <Button
              size="sm"
              onClick={() => setI((n) => n + 1)}
              className="min-h-11 px-4 text-sm lg:min-h-0 lg:px-3 lg:text-xs"
            >
              Next →
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setI(0)}
              className="min-h-11 px-4 text-sm lg:min-h-0 lg:px-3 lg:text-xs"
            >
              Restart tour
            </Button>
          )}
          <span
            role="group"
            aria-label="Guided tour steps"
            className="order-last flex w-full max-w-full justify-center lg:order-none lg:ml-auto lg:w-auto lg:justify-start lg:gap-1"
          >
            {steps.map((_, n) => (
              <button
                key={n}
                type="button"
                aria-label={`Go to step ${n + 1}: ${steps[n].title}`}
                aria-current={n === i ? "step" : undefined}
                onClick={() => setI(n)}
                className="grid h-11 w-6 place-items-center rounded-full lg:h-7 lg:w-5"
              >
                <span
                  className={`block rounded-full transition-colors ${
                    n === i ? "h-3 w-3 bg-ucla-blue ring-2 ring-ucla-blue/20" : "h-2 w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              </button>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
