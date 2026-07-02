import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MriStackViewer from "@/components/ui/MriStackViewer";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { coursePath } from "@/content/courses";

/**
 * Optional "look HERE" target for a search-pattern step: a stack plane + slice
 * the embedded viewer jumps to when the step is tapped. Plane dirs and slice
 * indices are reused verbatim from the vision-verified normal-MRI workstation
 * content (normal-knee-learn / normal-shoulder-learn) — steps without a clean
 * verified target are intentionally omitted rather than guessed.
 */
interface StepTarget {
  dir: string;
  count: number;
  plane: string;
  sliceIndex: number;
}

const KNEE_SAG = "/images/teaching/stacks/normal-knee-sagittal";
const KNEE_COR = "/images/teaching/stacks/normal-knee-coronal";
const SH_SAG = "/images/teaching/stacks/normal-shoulder-sagittal";
const SH_COR = "/images/teaching/stacks/normal-shoulder-coronal";
const SH_AXI = "/images/teaching/stacks/normal-shoulder-axial";

// Keyed by course id → search-pattern step number.
const STEP_TARGETS: Record<string, Record<number, StepTarget>> = {
  "knee-mri": {
    1: { dir: KNEE_SAG, count: 29, plane: "Sagittal PD-FS", sliceIndex: 13 },
    2: { dir: KNEE_COR, count: 19, plane: "Coronal PD-FS", sliceIndex: 7 },
    3: { dir: KNEE_COR, count: 19, plane: "Coronal PD-FS", sliceIndex: 7 },
    4: { dir: KNEE_SAG, count: 29, plane: "Sagittal PD-FS", sliceIndex: 8 },
    5: { dir: KNEE_SAG, count: 29, plane: "Sagittal PD-FS", sliceIndex: 21 },
    6: { dir: KNEE_SAG, count: 29, plane: "Sagittal PD-FS", sliceIndex: 13 },
    7: { dir: KNEE_SAG, count: 29, plane: "Sagittal PD-FS", sliceIndex: 14 },
  },
  "shoulder-mri": {
    1: { dir: SH_SAG, count: 28, plane: "Oblique sagittal T2-FS", sliceIndex: 11 },
    2: { dir: SH_COR, count: 24, plane: "Oblique coronal T2-FS", sliceIndex: 11 },
    3: { dir: SH_COR, count: 24, plane: "Oblique coronal T2-FS", sliceIndex: 7 },
    4: { dir: SH_SAG, count: 28, plane: "Oblique sagittal T2-FS", sliceIndex: 5 },
    5: { dir: SH_AXI, count: 30, plane: "Axial PD-FS", sliceIndex: 13 },
    6: { dir: SH_AXI, count: 30, plane: "Axial PD-FS", sliceIndex: 13 },
    7: { dir: SH_COR, count: 24, plane: "Oblique coronal T2-FS", sliceIndex: 11 },
  },
};

function stackAttr(bodyRegion: string) {
  return `De-identified normal ${bodyRegion} MRI · UCLA Sports Medicine teaching collection`;
}

function targetSlices(target: StepTarget) {
  return Array.from({ length: target.count }, (_, i) => ({
    src: `${target.dir}/slice_${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `${target.plane} slice ${i + 1}`,
  }));
}

export default function SearchPatternPage() {
  const activeCourse = useActiveCourse();
  const searchPatternSteps = activeCourse.searchPatternSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

  const courseTargets = STEP_TARGETS[activeCourse.id] ?? {};
  // The step number the embedded viewer is parked on, and whether it's expanded.
  const [activeTargetStep, setActiveTargetStep] = useState<number | null>(null);
  const [viewerOpen, setViewerOpen] = useState(true);
  const activeTarget =
    activeTargetStep != null ? courseTargets[activeTargetStep] : undefined;
  // Memoize so toggling a checklist item (which re-renders) doesn't hand the
  // viewer a brand-new slices array each render — that referential change would
  // reset its zoom/pan and jump it back to the anchor slice. activeTarget is a
  // stable object from courseTargets, so this recomputes only on target change.
  const slices = useMemo(
    () => (activeTarget ? targetSlices(activeTarget) : []),
    [activeTarget],
  );
  const activeTargetName =
    activeTargetStep != null
      ? searchPatternSteps.find((s) => s.number === activeTargetStep)?.name
      : undefined;

  // React Router reuses this component instance across course-scoped routes, and
  // step numbers collide between courses (both start at 1), so stale checkbox
  // state would bleed from one course's checklist into another's. Reset when the
  // active course changes — adjusted during render (not in an effect) so the new
  // course never renders a frame with the previous course's checked items.
  const [prevCourse, setPrevCourse] = useState(activeCourse.id);
  if (activeCourse.id !== prevCourse) {
    setPrevCourse(activeCourse.id);
    setCheckedItems({});
    setCurrentStep(0);
    setShowSummary(false);
    setActiveTargetStep(null);
  }

  // Deep link from a module's "Step N of the systematic search pattern" chip:
  // open that step and, if it has a verified viewer target, park the "look here"
  // stack on it.
  const [searchParams] = useSearchParams();
  const stepParam = searchParams.get("step");
  useEffect(() => {
    if (stepParam == null) return;
    const n = Number(stepParam);
    const idx = searchPatternSteps.findIndex((s) => s.number === n);
    if (idx < 0) return;
    setCurrentStep(idx);
    setShowSummary(false);
    if (STEP_TARGETS[activeCourse.id]?.[n]) {
      setActiveTargetStep(n);
      setViewerOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepParam, activeCourse.id]);

  function toggleItem(stepNumber: number, itemIndex: number) {
    const key = `${stepNumber}-${itemIndex}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function isItemChecked(stepNumber: number, itemIndex: number) {
    return !!checkedItems[`${stepNumber}-${itemIndex}`];
  }

  function getStepProgress(stepNumber: number) {
    const step = searchPatternSteps.find((s) => s.number === stepNumber);
    if (!step) return 0;
    const checked = step.checklistItems.filter((_, i) =>
      isItemChecked(stepNumber, i)
    ).length;
    return Math.round((checked / step.checklistItems.length) * 100);
  }

  function isStepComplete(stepNumber: number) {
    return getStepProgress(stepNumber) === 100;
  }

  const completedSteps = searchPatternSteps.filter((s) =>
    isStepComplete(s.number)
  ).length;

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = searchPatternSteps.reduce(
    (sum, s) => sum + s.checklistItems.length,
    0
  );
  const percentChecked = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  if (showSummary) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Search Pattern Summary
        </h1>
        <p className="mt-1 text-gray-500">
          You checked {totalChecked} of {totalItems} items across all {searchPatternSteps.length} steps.
        </p>

        {/* Progress bar */}
        <div className="mt-6 mb-8">
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-ucla-blue transition-all"
              style={{ width: `${percentChecked}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 text-right">
            {percentChecked}% complete
          </p>
        </div>

        <div className="space-y-4">
          {searchPatternSteps.map((step) => (
            <Card key={step.number}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isStepComplete(step.number)
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isStepComplete(step.number) ? (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{step.name}</h3>
              </div>
              <ul className="space-y-1 pl-11">
                {step.checklistItems.map((item, i) => (
                  <li
                    key={i}
                    className={`text-sm ${
                      isItemChecked(step.number, i)
                        ? "text-green-700"
                        : "text-gray-500"
                    }`}
                  >
                    {isItemChecked(step.number, i) ? "\u2713" : "\u2717"} {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Button variant="secondary" onClick={() => setShowSummary(false)}>
            Back to Steps
          </Button>
          <Link to={coursePath(activeCourse, "/cases")}>
            <Button>Practice on a Case</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {searchPatternSteps.length}-Step Search Pattern Trainer
      </h1>
      <p className="mt-1 text-gray-500">
        Practice the systematic approach to {activeCourse.bodyRegion} MRI interpretation. Complete
        each step&apos;s checklist to build your reading pattern.
      </p>

      {/* Embedded "look here" viewer — jumps to the verified plane/slice for the
          tapped step so the checklist becomes "look HERE". Collapsible. */}
      {activeTarget && (
        <div className="mt-6 overflow-hidden rounded-xl border-2 border-ucla-blue/25 bg-ucla-blue/[0.04]">
          <button
            type="button"
            onClick={() => setViewerOpen((v) => !v)}
            aria-expanded={viewerOpen}
            className="flex w-full items-center gap-2 border-b border-ucla-blue/15 bg-ucla-blue/[0.06] px-4 py-2.5 text-left"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ucla-blue px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Look here
            </span>
            <span className="flex-1 text-sm font-semibold text-gray-900">
              {activeTargetName} — {activeTarget.plane}
            </span>
            <svg
              className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                viewerOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {viewerOpen && (
            <div className="px-4 py-4">
              <MriStackViewer
                key={`${activeTarget.dir}-${activeTarget.sliceIndex}`}
                slices={slices}
                plane={activeTarget.plane}
                attribution={stackAttr(activeCourse.bodyRegion)}
                startIndex={activeTarget.sliceIndex}
              />
              <p className="mt-2 text-xs text-gray-500">
                Jumped to the key slice for this step. Scroll to explore the rest of the stack.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Overall Progress */}
      <div className="mt-6 mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>
            {completedSteps} of {searchPatternSteps.length} steps completed
          </span>
          <span>
            {totalChecked}/{totalItems} items checked
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-ucla-blue transition-all"
            style={{
              width: `${(completedSteps / searchPatternSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Stepper */}
      <div className="space-y-3">
        {searchPatternSteps.map((step, stepIdx) => {
          const isActive = stepIdx === currentStep;
          const stepComplete = isStepComplete(step.number);

          return (
            <div key={step.number}>
              {/* Step Header */}
              <button
                onClick={() => {
                  setCurrentStep(isActive ? -1 : stepIdx);
                  if (courseTargets[step.number]) {
                    setActiveTargetStep(step.number);
                    setViewerOpen(true);
                  }
                }}
                className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all ${
                  isActive
                    ? "border-ucla-blue bg-white shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Step Number */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    stepComplete
                      ? "bg-green-100 text-green-700"
                      : isActive
                      ? "bg-ucla-blue text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {stepComplete ? (
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold ${
                      isActive ? "text-ucla-blue" : "text-gray-900"
                    }`}
                  >
                    Step {step.number}: {step.name}
                  </h3>
                  {!isActive && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Progress indicator */}
                {!stepComplete && (
                  <span className="text-xs text-gray-500">
                    {getStepProgress(step.number)}%
                  </span>
                )}

                <svg
                  className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                    isActive ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Expanded Content */}
              {isActive && (
                <div className="ml-4 mt-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Jump the embedded viewer to this step's key slice */}
                  {courseTargets[step.number] && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTargetStep(step.number);
                        setViewerOpen(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-ucla-blue/40 bg-ucla-blue/10 px-3 py-1.5 text-xs font-semibold text-ucla-blue transition-colors hover:bg-ucla-blue/20"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      </svg>
                      Show on MRI
                    </button>
                  )}

                  {/* Checklist */}
                  <div className="space-y-2">
                    {step.checklistItems.map((item, i) => (
                      <label
                        key={i}
                        className="flex items-start gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isItemChecked(step.number, i)}
                          onChange={() => toggleItem(step.number, i)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-ucla-blue focus:ring-ucla-blue/50"
                        />
                        <span
                          className={`text-sm ${
                            isItemChecked(step.number, i)
                              ? "text-gray-500 line-through"
                              : "text-gray-700 group-hover:text-gray-900"
                          }`}
                        >
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Clinical Pearls */}
                  {step.pearls.length > 0 && (
                    <div className="mt-5 space-y-2">
                      {step.pearls.map((pearl, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
                        >
                          <div className="flex items-start gap-2">
                            <svg
                              className="h-5 w-5 shrink-0 text-amber-600 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                              />
                            </svg>
                            <div>
                              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide">
                                Clinical Pearl
                              </p>
                              <p className="mt-1 text-sm text-amber-700">
                                {pearl}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Navigation within steps */}
                  <div className="mt-5 flex items-center justify-between">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={stepIdx === 0}
                      onClick={() => setCurrentStep(stepIdx - 1)}
                    >
                      Previous Step
                    </Button>
                    {stepIdx < searchPatternSteps.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => setCurrentStep(stepIdx + 1)}
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setShowSummary(true)}>
                        View Summary
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => {
            setCheckedItems({});
            setCurrentStep(0);
          }}
          className="text-sm text-gray-500 hover:text-gray-600"
        >
          Reset all checkboxes
        </button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowSummary(true)}>
            View Summary
          </Button>
          <Link to={coursePath(activeCourse, "/cases")}>
            <Button>Practice on a Case</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
