import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { TeachingImage } from "@/content/cases";
import { caseContentById } from "@/content/cases/content-by-id";
import MriStackViewer from "@/components/ui/MriStackViewer";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { coursePath, courseRegistry } from "@/content/courses";
import { submitCaseAttempt } from "@/lib/firestore";

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                                */
/* ------------------------------------------------------------------ */

// On a teaching-image load failure, hide the broken <img> and drop a neutral
// "Image unavailable" placeholder into its container — otherwise the fixed-ratio
// wrapper is left as an empty gray box.
function handleTeachingImageError(e: { currentTarget: HTMLImageElement }) {
  const img = e.currentTarget;
  img.style.display = "none";
  const parent = img.parentElement;
  if (parent && !parent.querySelector("[data-img-fallback]")) {
    const fb = document.createElement("div");
    fb.setAttribute("data-img-fallback", "");
    fb.className =
      "flex h-full w-full items-center justify-center p-3 text-center text-[11px] text-gray-400";
    fb.textContent = "Image unavailable";
    parent.appendChild(fb);
  }
}

// Generic connective / locational / descriptor words that appear across many
// findings — matching one of these should never credit a finding.
const FINDING_STOPWORDS = new Set([
  "with", "without", "the", "and", "for", "this", "that", "there", "from", "into",
  "over", "near", "along", "both", "within", "aspect", "region", "area", "appears",
  "seen", "noted", "present", "change", "changes", "mild", "small", "large", "acute",
  "chronic", "left", "right", "medial", "lateral", "anterior", "posterior", "superior",
  "inferior", "central", "joint", "knee", "shoulder", "signal", "edema", "fluid",
]);

function significantTerms(finding: string): string[] {
  return finding
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 4 && !FINDING_STOPWORDS.has(w));
}

// Whether the learner's free text MENTIONS a finding: requires a majority of the
// finding's significant (non-generic) terms as WHOLE words. This is a self-check
// hint only ("you mentioned related terms"), not a graded judgment — it cannot
// detect negation, so the UI copy is framed as "mentioned," not "correct."
function mentionsFinding(userText: string, finding: string): boolean {
  const terms = significantTerms(finding);
  if (terms.length === 0) return false;
  const words = new Set(userText.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  const hits = terms.filter((t) => words.has(t)).length;
  return hits >= Math.max(1, Math.ceil(terms.length / 2));
}

const difficultyConfig = {
  foundational: { label: "Foundational", bg: "bg-green-100", text: "text-green-700" },
  intermediate: { label: "Intermediate", bg: "bg-blue-100", text: "text-ucla-blue" },
  advanced: { label: "Advanced", bg: "bg-red-100", text: "text-red-700" },
} as const;

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CasePage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { user, role } = useAuth();
  const activeCourse = useActiveCourse();
  const isAdminView = useIsAdminView();
  const searchPatternSteps = activeCourse.searchPatternSteps;
  const isResident = role === "resident";
  const stepperRef = useRef<HTMLDivElement>(null);

  // activeCourse.cases carries only lightweight metas; the full case body
  // (model report, per-step findings, images) is loaded here in this lazy page
  // chunk, keeping it out of the eager bundle.
  const caseItem = caseId ? caseContentById[caseId] : undefined;
  const reviewStep = searchPatternSteps.length + 1;
  const totalSteps = reviewStep + 1;
  const stepperLabels: { label: string; short: string }[] = [
    { label: "Clinical", short: "Clinical" },
    ...searchPatternSteps.map((step) => ({
      label: `${step.number}. ${step.shortName}`,
      short: String(step.number),
    })),
    { label: "Review", short: "Review" },
  ];

  // Walkthrough state
  const [currentStep, setCurrentStep] = useState(0);
  const [highestStep, setHighestStep] = useState(0);

  // Checklist state (same key format as before)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Per-step findings typed by the fellow
  const [stepFindings, setStepFindings] = useState<Record<number, string>>({});

  // Which steps have had their expected findings revealed
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(new Set());

  // Submit state
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Teaching image lightbox
  const [expandedImage, setExpandedImage] = useState<TeachingImage | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);

  // Close the teaching-image lightbox on Escape and move focus to the close
  // button on open — keyboard and screen-reader users previously had no way to
  // dismiss it (backdrop-click only).
  useEffect(() => {
    if (!expandedImage) return;
    lightboxCloseRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedImage]);

  // Try-again confirmation dialog
  const [showTryAgain, setShowTryAgain] = useState(false);
  const tryAgainCancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showTryAgain) return;
    tryAgainCancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowTryAgain(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showTryAgain]);

  useEffect(() => {
    const modalOpen = !!expandedImage || showTryAgain;
    if (!modalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [expandedImage, showTryAgain]);

  const handleTryAgain = useCallback(() => {
    setCurrentStep(0);
    setHighestStep(0);
    setCheckedItems({});
    setStepFindings({});
    setRevealedSteps(new Set());
    setSubmitted(false);
    setSubmitError(null);
    setSubmitting(false);
    setShowTryAgain(false);
  }, []);

  // Reset all state when navigating between cases
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentStep(0);
    setHighestStep(0);
    setCheckedItems({});
    setStepFindings({});
    setRevealedSteps(new Set());
    setSubmitted(false);
    setSubmitError(null);
    // Clear submitting too: if a prior case's submit is still in-flight (e.g. a
    // dropped connection before settleWrite resolves), a stale submitting=true
    // would block the next case's submit guard.
    setSubmitting(false);
    setExpandedImage(null);
    setShowTryAgain(false);
  }, [caseId]);

  // Scroll active stepper pill into view when step changes
  useEffect(() => {
    if (!stepperRef.current) return;
    const active = stepperRef.current.querySelector("[data-active-step]");
    if (active) {
      active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentStep]);


  /* ---- Cross-course canonicalization ----
     The bare /cases/:id route carries no :courseId, so activeCourse defaults to
     knee. Since caseContentById is a global map, a case owned by another course
     would otherwise render under the wrong course context — redirect it to its
     canonical course-scoped URL. (In-app links are already course-scoped.) */
  if (caseItem && caseId && !activeCourse.cases.some((c) => c.id === caseId)) {
    const owning = courseRegistry.find((co) => co.cases.some((c) => c.id === caseId));
    if (owning) return <Navigate to={coursePath(owning, `/cases/${caseId}`)} replace />;
  }

  /* ---- Not found ---- */
  if (!caseItem) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Case Not Found</h1>
        <p className="mt-2 text-gray-500">The requested case could not be found.</p>
        <Link to={coursePath(activeCourse, "/cases")} className="mt-4 inline-block">
          <Button variant="secondary">Back to Cases</Button>
        </Link>
      </div>
    );
  }

  /* ---- Resident access gate ---- */
  if (isResident && !caseItem.residentVisible) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Not Available</h1>
        <p className="mt-2 text-gray-500">
          This case is part of the optional advanced track and is not required for residents.
        </p>
        <Link to={coursePath(activeCourse, "/cases")} className="mt-4 inline-block">
          <Button variant="secondary">Back to Cases</Button>
        </Link>
      </div>
    );
  }

  const diff = difficultyConfig[caseItem.difficulty];
  const teachingImages = caseItem.teachingImages ?? [];
  const teachingStacks = caseItem.teachingStacks ?? [];
  const previewImages = teachingImages.slice(0, 4);
  const hasEmbeddedReferences = teachingImages.length > 0 || teachingStacks.length > 0;
  const readoutDiagnoses = caseItem.keyDiagnoses.slice(0, 3);
  const allReadoutFindingSteps = caseItem.searchPatternFindings ?? [];
  const pathologyReadoutFindingSteps = allReadoutFindingSteps.filter((findingStep) => findingStep.step > 1);
  const readoutFindings = (pathologyReadoutFindingSteps.length > 0 ? pathologyReadoutFindingSteps : allReadoutFindingSteps)
    .flatMap((findingStep) =>
      findingStep.expectedFindings.slice(0, 2).map((finding) => ({
        step: findingStep.step,
        stepName: findingStep.stepName,
        finding,
      })),
    )
    .slice(0, 4);
  const clinicalHinges = (caseItem.teachingPoints ?? []).slice(0, 3);
  const externalCaseLinkLabel = hasEmbeddedReferences
    ? "Open the full scrollable MRI on Radiopaedia"
    : "Open external scrollable MRI examples";
  const externalCaseLinkCaption = hasEmbeddedReferences
    ? `${caseItem.radiopaediaTitle} — scroll through every slice like a workstation`
    : `${caseItem.radiopaediaTitle} — use after committing to the local search pattern`;

  /* ---- Helpers ---- */

  function goToStep(step: number) {
    if (step < 0 || step >= totalSteps) return;
    // Can go back freely; can only go forward up to highestStep + 1
    if (step <= highestStep) {
      setCurrentStep(step);
    }
  }

  function advanceStep() {
    const next = currentStep + 1;
    if (next >= totalSteps) return;
    setCurrentStep(next);
    setHighestStep((prev) => Math.max(prev, next));
    // Auto-submit when advancing to the review step
    if (next === reviewStep && !submitted) {
      submitCase();
    }
  }

  function toggleItem(stepNumber: number, itemIndex: number) {
    const key = `${stepNumber}-${itemIndex}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function isItemChecked(stepNumber: number, itemIndex: number) {
    return !!checkedItems[`${stepNumber}-${itemIndex}`];
  }

  function revealFindings(stepNumber: number) {
    setRevealedSteps((prev) => new Set(prev).add(stepNumber));
  }

  function getExpectedFindings(stepNumber: number) {
    if (!caseItem?.searchPatternFindings) return null;
    return caseItem.searchPatternFindings.find((f) => f.step === stepNumber) ?? null;
  }

  async function submitCase() {
    if (!user || !caseId || submitting) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      if (!isAdminView) {
        await submitCaseAttempt(user.uid, user.email || "", caseId, checkedItems, "", activeCourse.id);
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Failed to submit your case. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function isStepComplete(idx: number) {
    if (idx === 0) return highestStep > 0;
    if (idx >= 1 && idx <= searchPatternSteps.length) return highestStep > idx;
    if (idx === reviewStep) return false; // review is never "complete"
    return false;
  }

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  return (
    <div>
      {/* Try Again Confirmation Dialog */}
      {showTryAgain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="try-again-title"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <span id="try-again-title">Start this case over?</span>
            </h3>
            <p className="text-sm text-gray-600 mb-5">
              Your previous submission is saved. This will reset all your notes
              and progress for this case so you can try again from the beginning.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button ref={tryAgainCancelRef} variant="secondary" size="sm" className="min-h-11 w-full sm:min-h-0 sm:w-auto" onClick={() => setShowTryAgain(false)}>
                Cancel
              </Button>
              <Button size="sm" className="min-h-11 w-full sm:min-h-0 sm:w-auto" onClick={handleTryAgain}>
                Start Over
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Teaching Image Lightbox */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Teaching image: ${expandedImage.caption || expandedImage.alt}`}
          >
            <button
              ref={lightboxCloseRef}
              onClick={() => setExpandedImage(null)}
              className="absolute top-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:h-8 sm:w-8"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="overflow-auto max-h-[75vh] bg-gray-900 flex items-center justify-center">
              <img
                src={expandedImage.src}
                alt={expandedImage.alt}
                className="max-h-[75vh] max-w-full object-contain"
                onError={handleTeachingImageError}
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700">{expandedImage.caption}</p>
              <p className="mt-1 text-xs text-gray-500">{expandedImage.attribution}</p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to={coursePath(activeCourse, "/cases")} className="hover:text-ucla-blue transition-colors">
          Cases
        </Link>
        <span>/</span>
        <span className="min-w-0 flex-1 text-gray-600 line-clamp-1">
          {currentStep === reviewStep ? caseItem.title : `Case: ${diff.label}`}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${diff.bg} ${diff.text}`}
          >
            {diff.label}
          </span>
          {submitted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              <CheckIcon className="h-3.5 w-3.5" />
              Submitted
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {currentStep === reviewStep ? caseItem.title : `Case: ${diff.label}`}
        </h1>
      </div>

      {/* Clinical Scenario Banner (always visible) */}
      <div className="mb-6 rounded-xl border border-ucla-blue/20 bg-ucla-light px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ucla-blue mb-1">
          Clinical Scenario
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {caseItem.clinicalScenario}
        </p>
      </div>

      {/* ============================================================ */}
      {/*  STEPPER                                                      */}
      {/* ============================================================ */}
      <div className="mb-8 max-w-full overflow-hidden">
        <div
          ref={stepperRef}
          className="max-w-full overflow-x-auto pb-2 scrollbar-hide [-webkit-overflow-scrolling:touch]"
        >
          <div className="flex w-max max-w-none items-center gap-1">
            {stepperLabels.map((s, idx) => {
              const isCurrent = idx === currentStep;
              const completed = isStepComplete(idx);
              const reachable = idx <= highestStep;

              return (
                <div key={idx} className="flex items-center">
                  {idx > 0 && (
                    <div
                      className={`w-4 h-0.5 mx-0.5 ${
                        idx <= highestStep ? "bg-ucla-blue" : "bg-gray-200"
                      }`}
                    />
                  )}
                  <button
                    {...(isCurrent ? { "data-active-step": true } : {})}
                    onClick={() => goToStep(idx)}
                    disabled={!reachable}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isCurrent
                        ? "bg-ucla-blue text-white shadow-sm"
                        : completed
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : reachable
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-gray-50 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {completed && <CheckIcon className="h-3 w-3" />}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{s.short}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  STEP CONTENT                                                 */}
      {/* ============================================================ */}

      {/* ---- Step 0: Clinical Presentation ---- */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Presenting Complaint
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {caseItem.clinicalScenario}
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Case Reading Mindset
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["1", "Anchor normal", `Start from the normal ${activeCourse.bodyRegion} MRI pattern before chasing pathology.`],
                ["2", "Commit findings", "Write the key positives and negatives for each search step before revealing the answer."],
                ["3", "Clinical hinge", "On review, link the imaging findings to the diagnosis and sports medicine decision point."],
              ].map(([number, title, copy]) => (
                <div key={title} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-ucla-light text-xs font-bold text-ucla-blue">
                    {number}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{copy}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Case Image Review
            </h3>
            {hasEmbeddedReferences ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Review the local teaching images and anatomy correlates first,
                  then work through the search pattern. Use the external scroll
                  only after you have committed to the case findings.
                </p>

                {previewImages.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {previewImages.map((image, index) => (
                      <button
                        key={`${image.src}-${index}`}
                        type="button"
                        onClick={() => setExpandedImage(image)}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 text-left transition hover:border-ucla-blue/50 hover:shadow-sm"
                      >
                        <div className="aspect-square bg-gray-900">
                          <img
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="h-full w-full object-contain"
                            onError={handleTeachingImageError}
                          />
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-2 text-xs font-medium text-gray-700">
                            {image.caption}
                          </p>
                          {image.step && (
                            <p className="mt-1 text-[11px] text-ucla-blue">
                              Search pattern step {image.step}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {teachingStacks.slice(0, 1).map((stack) => (
                  <MriStackViewer
                    key={stack.id}
                    slices={stack.slices}
                    title={stack.title}
                    plane={stack.plane}
                    caption={stack.caption}
                    attribution={stack.attribution}
                    sourceUrl={stack.sourceUrl}
                  />
                ))}

                {(teachingImages.length > previewImages.length || teachingStacks.length > 1) && (
                  <p className="text-xs text-gray-500">
                    More embedded teaching material appears in the guided review:
                    {" "}
                    {teachingImages.length} image{teachingImages.length === 1 ? "" : "s"}
                    {teachingStacks.length > 0 && (
                      <>
                        {" and "}
                        {teachingStacks.length} stack{teachingStacks.length === 1 ? "" : "s"}
                      </>
                    )}
                    .
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Work the local case stem and search-pattern findings first,
                  then use the linked external scrollable MRI examples for
                  optional image review.
                </p>
                {readoutFindings.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Image review focus
                    </p>
                    <ul className="mt-2 space-y-2">
                      {readoutFindings.map((finding, index) => (
                        <li key={`${finding.step}-${index}`} className="text-xs leading-relaxed text-gray-600">
                          <span className="font-semibold text-gray-800">
                            Step {finding.step}: {finding.stepName}
                          </span>
                          {" — "}
                          {finding.finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {caseItem.radiopaediaUrl && (
              <a
                href={caseItem.radiopaediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex flex-col items-start gap-3 rounded-lg border border-ucla-blue/30 bg-ucla-light px-4 py-3 transition-colors hover:bg-ucla-blue/10 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex items-center gap-3">
                  <svg className="h-6 w-6 shrink-0 text-ucla-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75 12 3l8.25 3.75L12 10.5 3.75 6.75Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 12 8.25 3.75L20.25 12M3.75 17.25 12 21l8.25-3.75" />
                  </svg>
                  <span>
                    <span className="block text-sm font-semibold text-ucla-dark">
                      {externalCaseLinkLabel}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {externalCaseLinkCaption}
                    </span>
                  </span>
                </span>
                <span className="self-end shrink-0 text-ucla-blue sm:self-center" aria-hidden>&#8599;</span>
              </a>
            )}
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {caseItem.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" className="w-full sm:w-auto" onClick={advanceStep}>
              Begin Case Walkthrough &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* ---- Search Pattern Walkthrough ---- */}
      {currentStep >= 1 && currentStep <= searchPatternSteps.length && (() => {
        const stepNumber = currentStep;
        const step = searchPatternSteps.find((s) => s.number === stepNumber)!;
        const expected = getExpectedFindings(stepNumber);
        const isRevealed = revealedSteps.has(stepNumber);
        const allChecked = step.checklistItems.every((_, i) =>
          isItemChecked(stepNumber, i)
        );

        return (
          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-gray-500">
                Step {stepNumber} of {searchPatternSteps.length}
              </p>
              <div className="flex gap-1">
                {Array.from({ length: searchPatternSteps.length }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full ${
                      i + 1 < stepNumber
                        ? "bg-green-400"
                        : i + 1 === stepNumber
                        ? "bg-ucla-blue"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step card with checklist */}
            <Card>
              <div className="mb-2 flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    allChecked
                      ? "bg-green-100 text-green-700"
                      : "bg-ucla-light text-ucla-blue"
                  }`}
                >
                  {allChecked ? <CheckIcon /> : stepNumber}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.name}
                </h3>
              </div>
              <p className="mb-4 text-sm text-gray-500 sm:pl-12">
                {step.description}
              </p>

              <div className="space-y-3 sm:pl-12">
                {step.checklistItems.map((item, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isItemChecked(stepNumber, i)}
                      onChange={() => toggleItem(stepNumber, i)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-ucla-blue focus:ring-ucla-blue/50"
                    />
                    <span
                      className={`text-sm ${
                        isItemChecked(stepNumber, i)
                          ? "text-gray-500 line-through"
                          : "text-gray-700 group-hover:text-gray-900"
                      }`}
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>

              {/* Pearls */}
              {step.pearls.length > 0 && (
                <div className="mt-4 sm:pl-12">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                      Pearl{step.pearls.length > 1 ? "s" : ""}
                    </p>
                    {step.pearls.map((pearl, i) => (
                      <p key={i} className="text-sm text-amber-800 leading-relaxed">
                        {pearl}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* What did you find? */}
            <Card>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                What did you find?
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Describe your observations for this step before revealing the
                expected findings.
              </p>
              <textarea
                value={stepFindings[stepNumber] ?? ""}
                onChange={(e) =>
                  setStepFindings((prev) => ({
                    ...prev,
                    [stepNumber]: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Type your observations here..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:border-ucla-blue focus:ring-1 focus:ring-ucla-blue/50"
              />

              {/* Reveal button */}
              {!isRevealed && expected && (
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="min-h-11 w-full sm:min-h-0 sm:w-auto"
                    onClick={() => revealFindings(stepNumber)}
                  >
                    Reveal Findings
                  </Button>
                </div>
              )}

              {/* Revealed expected findings */}
              {isRevealed && expected && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
                    Expected Findings for Step {expected.step}: {expected.stepName}
                  </p>
                  <ul className="space-y-1.5">
                    {expected.expectedFindings.map((finding, i) => {
                      const userText = stepFindings[stepNumber] ?? "";
                      const matched =
                        userText.trim().length > 0 && mentionsFinding(userText, finding);

                      return (
                        <li
                          key={i}
                          className={`flex items-start gap-2 text-sm ${
                            matched ? "text-gray-800" : "text-amber-700"
                          }`}
                        >
                          {/* A word-overlap match is "you mentioned this," NOT
                              "you were correct" — mentionsFinding can't detect
                              negation, so a green check would validate "no
                              hemarthrosis." Use a neutral dot the fellow verifies. */}
                          {matched ? (
                            <span
                              className="mt-0.5 shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-ucla-blue/15 text-ucla-blue text-[13px] leading-none"
                              title="You mentioned related terms — verify against your read"
                              aria-label="mentioned"
                            >
                              •
                            </span>
                          ) : (
                            <span className="mt-0.5 shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-amber-200 text-amber-700 text-xs font-bold" aria-label="not mentioned">
                              !
                            </span>
                          )}
                          {finding}
                        </li>
                      );
                    })}
                  </ul>
                  {(() => {
                    const userText = stepFindings[stepNumber] ?? "";
                    const hasText = userText.trim().length > 0;
                    const allMatched =
                      hasText &&
                      expected.expectedFindings.every((f) => mentionsFinding(userText, f));
                    const someMatched =
                      hasText &&
                      expected.expectedFindings.some((f) => mentionsFinding(userText, f));

                    if (allMatched) {
                      return (
                        <p className="mt-3 text-sm font-medium text-green-700">
                          You mentioned terms related to every expected finding -- now
                          compare your read against each one above to confirm.
                        </p>
                      );
                    }
                    if (someMatched) {
                      return (
                        <p className="mt-3 text-sm font-medium text-amber-700">
                          Good start! Check the amber items above -- these are findings
                          your notes didn't clearly mention.
                        </p>
                      );
                    }
                    if (!hasText) {
                      return (
                        <p className="mt-3 text-sm text-gray-500">
                          Compare these expected findings with your own
                          observations.
                        </p>
                      );
                    }
                    return (
                      <p className="mt-3 text-sm font-medium text-amber-700">
                        Take another look at the images for this step and
                        compare with the expected findings above.
                      </p>
                    );
                  })()}
                </div>
              )}

              {/* No expected findings for this step */}
              {isRevealed && !expected && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    No specific expected findings are listed for this step in
                    this case.
                  </p>
                </div>
              )}
            </Card>

            {/* Navigation */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="secondary"
                className="min-h-11 w-full sm:w-auto"
                onClick={() => goToStep(currentStep - 1)}
              >
                &larr; Back
              </Button>
              <Button className="min-h-11 w-full sm:w-auto" onClick={advanceStep}>
                {currentStep === searchPatternSteps.length ? "View Answer Key" : "Next Step"} &rarr;
              </Button>
            </div>
          </div>
        );
      })()}

      {/* ---- Answer Key & Review ---- */}
      {currentStep === reviewStep && (
        <div className="space-y-6">
          {submitError && (
            <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
              <span>{submitError}</span>
              <Button size="sm" className="min-h-11 w-full sm:min-h-0 sm:w-auto" onClick={submitCase} disabled={submitting}>
                Retry
              </Button>
            </div>
          )}

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm text-amber-700">
              Review the answer key below. Compare your observations from each
              search pattern step with the expected findings and model report.
            </p>
          </div>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Key Diagnoses
            </h3>
            <ul className="space-y-2">
              {caseItem.keyDiagnoses.map((diagnosis, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ucla-blue text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  {diagnosis}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-ucla-blue/20 bg-ucla-light/40">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Sports Medicine Read-Out
            </h3>
            <div className="grid gap-4 lg:grid-cols-3">
              <section className="rounded-lg border border-white/70 bg-white/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">
                  Call it
                </p>
                <ul className="mt-3 space-y-2">
                  {readoutDiagnoses.map((diagnosis, i) => (
                    <li key={i} className="text-sm leading-relaxed text-gray-700">
                      {diagnosis}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-white/70 bg-white/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">
                  Prove it on MRI
                </p>
                {readoutFindings.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {readoutFindings.map((finding, i) => (
                      <li key={`${finding.step}-${i}`} className="text-sm leading-relaxed text-gray-700">
                        <span className="font-semibold text-gray-900">Step {finding.step}, {finding.stepName}: </span>
                        {finding.finding}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Compare the model report against your stepwise observations.
                  </p>
                )}
              </section>

              <section className="rounded-lg border border-white/70 bg-white/80 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">
                  Clinical hinge
                </p>
                {clinicalHinges.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {clinicalHinges.map((point, i) => (
                      <li key={i} className="text-sm leading-relaxed text-gray-700">
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    Tie the imaging pattern back to the presenting scenario.
                  </p>
                )}
              </section>
            </div>
          </Card>

          {caseItem.modelReport && (
            <>
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Model Findings
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {caseItem.modelReport.findings}
                </p>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Model Impression
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {caseItem.modelReport.impression}
                </p>
              </Card>
            </>
          )}

          {caseItem.teachingPoints && caseItem.teachingPoints.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Teaching Points
              </h3>
              <ul className="space-y-3">
                {caseItem.teachingPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      !
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Scrollable MRI Stacks */}
          {caseItem.teachingStacks && caseItem.teachingStacks.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Scrollable MRI Stacks
              </h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {caseItem.teachingStacks.map((stack) => (
                  <MriStackViewer
                    key={stack.id}
                    slices={stack.slices}
                    title={stack.title}
                    plane={stack.plane}
                    caption={stack.caption}
                    attribution={stack.attribution}
                    sourceUrl={stack.sourceUrl}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Teaching Images */}
          {caseItem.teachingImages && caseItem.teachingImages.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Teaching Images
              </h3>
              {(() => {
                // Group images by search pattern step
                const grouped = new Map<number, TeachingImage[]>();
                const ungrouped: TeachingImage[] = [];
                for (const img of caseItem.teachingImages!) {
                  if (img.step != null) {
                    if (!grouped.has(img.step)) grouped.set(img.step, []);
                    grouped.get(img.step)!.push(img);
                  } else {
                    ungrouped.push(img);
                  }
                }
                const stepNames = Object.fromEntries(
                  searchPatternSteps.map((step) => [step.number, step.name])
                ) as Record<number, string>;
                const sortedSteps = Array.from(grouped.keys()).sort((a, b) => a - b);

                return (
                  <div className="space-y-6">
                    {sortedSteps.map((stepNum) => (
                      <div key={stepNum}>
                        <h4 className="text-sm font-semibold text-ucla-blue mb-3">
                          Step {stepNum}: {stepNames[stepNum] ?? `Step ${stepNum}`}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {grouped.get(stepNum)!.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setExpandedImage(img)}
                              className="group text-left rounded-lg border border-gray-200 overflow-hidden hover:border-ucla-blue/40 hover:shadow-md transition-all"
                            >
                              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                <img
                                  src={img.src}
                                  alt={img.alt}
                                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                                  loading="lazy"
                                  onError={handleTeachingImageError}
                                />
                              </div>
                              <div className="p-3">
                                <p className="text-sm text-gray-700 leading-snug">
                                  {img.caption}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 leading-tight">
                                  {img.attribution}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {ungrouped.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">
                          Additional Images
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {ungrouped.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setExpandedImage(img)}
                              className="group text-left rounded-lg border border-gray-200 overflow-hidden hover:border-ucla-blue/40 hover:shadow-md transition-all"
                            >
                              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                                <img
                                  src={img.src}
                                  alt={img.alt}
                                  className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-200"
                                  loading="lazy"
                                  onError={handleTeachingImageError}
                                />
                              </div>
                              <div className="p-3">
                                <p className="text-sm text-gray-700 leading-snug">
                                  {img.caption}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 leading-tight">
                                  {img.attribution}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </Card>
          )}

          {/* Per-step comparison: fellow findings vs expected */}
          {caseItem.searchPatternFindings &&
            caseItem.searchPatternFindings.length > 0 && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Search Pattern Findings: Your Notes vs Expected
                </h3>
                <div className="space-y-5">
                  {caseItem.searchPatternFindings.map((spf) => (
                    <div key={spf.step}>
                      <h4 className="text-sm font-semibold text-ucla-blue mb-2">
                        Step {spf.step}: {spf.stepName}
                      </h4>

                      {/* Fellow's observations */}
                      <div className="mb-2 rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Your Notes
                        </p>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">
                          {stepFindings[spf.step]?.trim() ||
                            "(No observations recorded)"}
                        </p>
                      </div>

                      {/* Expected findings */}
                      <ul className="ml-4 space-y-1">
                        {spf.expectedFindings.map((finding, i) => (
                          <li
                            key={i}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-green-500 mt-0.5">
                              <CheckIcon className="h-4 w-4" />
                            </span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          <div className="flex justify-center">
            <Button
              variant="secondary"
              className="min-h-11 w-full sm:w-auto"
              onClick={() => setShowTryAgain(true)}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link to={coursePath(activeCourse, "/cases")}>
          <Button variant="secondary" size="sm" className="min-h-11 w-full sm:min-h-0 sm:w-auto">
            &larr; Back to Cases
          </Button>
        </Link>
      </div>
    </div>
  );
}
