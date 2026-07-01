import { useState } from "react";
import { getCourseById, normalMriTitle, type CourseId } from "@/content/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";

interface NormalMasteryModeOption {
  id: string;
  label: string;
}

interface NormalMriMasteryPanelProps {
  courseId: CourseId;
  activeMode: string;
  activeModeLabel: string;
  seriesLabel: string;
  availableModes: readonly NormalMasteryModeOption[];
}

type MasteryStepId = "explore" | "tour" | "check" | "correlate" | "challenge";

const STEP_COPY: Record<MasteryStepId, { label: string; text: string }> = {
  explore: {
    label: "Stack Sweep",
    text: "Scroll the full series and anchor the normal marrow, cartilage, tendons, ligaments, and recesses.",
  },
  tour: {
    label: "Guided Tour",
    text: "Name the structures and the normal variants before moving to pathology.",
  },
  check: {
    label: "Knowledge Check",
    text: "Pass each series at 70% or higher to complete the normal MRI requirement.",
  },
  correlate: {
    label: "Cross-Plane",
    text: "Confirm the same structure on another plane before treating a finding as real.",
  },
  challenge: {
    label: "CAQ / Advanced",
    text: "Apply normal anatomy to sports-injury traps and do-not-overcall decisions.",
  },
};

const MODE_TO_STEP: Record<string, MasteryStepId> = {
  explore: "explore",
  tour: "tour",
  check: "check",
  correlate: "correlate",
  compare: "correlate",
  advanced: "challenge",
  caq: "challenge",
  adjust: "explore",
};

const FOCUS_COPY: Record<string, string> = {
  explore: "First build the normal mental map: sweep the series, then call out one variant or pitfall before leaving the stack.",
  tour: "Work through the landmarks on this series, including the variant and measurement notes that prevent false positives.",
  check: "Answer from the image, then use missed items to jump back to the exact normal landmark in the tour.",
  correlate: "Make the orthogonal-confirmation habit explicit: one-plane impressions should become two-plane anatomy.",
  compare: "Use side-by-side planes to prove orientation and avoid mistaking shape change for pathology.",
  advanced: "Treat these as management-changing board traps: thresholds matter, but context and imaging plane matter too.",
  caq: "Read the stack first, commit to the answer, then study the explanation for the normal-to-pathology bridge.",
  adjust: "Admin marker alignment does not change learner completion, but accurate markers protect the whole workstation.",
};

function stepForMode(mode: string): MasteryStepId {
  return MODE_TO_STEP[mode] ?? "explore";
}

export default function NormalMriMasteryPanel({
  courseId,
  activeMode,
  activeModeLabel,
  seriesLabel,
  availableModes,
}: NormalMriMasteryPanelProps) {
  const course = getCourseById(courseId);
  const { user } = useAuth();
  const { progress, loading } = useProgress(course);
  // On phones this guidance (focus text + 5-step list + footer) is ~half a
  // screen of chrome sitting above the actual viewer on every visit, so it is
  // collapsed by default on mobile and always shown from lg up.
  const [showGuide, setShowGuide] = useState(false);
  const activeStep = stepForMode(activeMode);
  const modeIds = new Set(availableModes.map((mode) => mode.id));
  const hasCrossPlane = modeIds.has("correlate") || modeIds.has("compare");
  const hasChallenge = modeIds.has("caq") || modeIds.has("advanced");
  const steps: MasteryStepId[] = [
    "explore",
    "tour",
    "check",
    ...(hasCrossPlane ? (["correlate"] as const) : []),
    ...(hasChallenge ? (["challenge"] as const) : []),
  ];

  const passed = progress?.normalPlanesPassed ?? 0;
  const total = progress?.totalNormalPlanes ?? 0;
  const clampedPassed = Math.max(0, Math.min(passed, total || passed));
  const progressPercent = total > 0 ? Math.round((clampedPassed / total) * 100) : 0;
  const completionLabel = loading
    ? "Loading series progress"
    : total > 0
      ? `${clampedPassed} of ${total} series passed`
      : user
        ? "Series progress unavailable"
        : "Sign in to save series passes";

  return (
    <section className="mt-4 rounded-xl border border-ucla-blue/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-ucla-blue">
              Normal MRI mastery
            </p>
            <button
              type="button"
              onClick={() => setShowGuide((v) => !v)}
              aria-expanded={showGuide}
              className="shrink-0 text-xs font-semibold text-ucla-blue underline-offset-2 hover:underline lg:hidden"
            >
              {showGuide ? "Hide steps" : "Learning steps"}
            </button>
          </div>
          <h2 className="mt-1 text-base font-semibold text-gray-900">{normalMriTitle(course)}</h2>
          <p className={`mt-1 max-w-3xl text-sm text-gray-600 lg:block ${showGuide ? "" : "hidden"}`}>
            Current focus: <strong className="font-semibold text-gray-800">{seriesLabel}</strong>{" "}
            in <strong className="font-semibold text-gray-800">{activeModeLabel}</strong>.{" "}
            {FOCUS_COPY[activeMode] ?? FOCUS_COPY.explore}
          </p>
        </div>
        <div className="min-w-[11rem] rounded-lg bg-gray-50 px-3 py-2 text-sm">
          <p className="font-semibold text-gray-900">{completionLabel}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-ucla-blue transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className={`lg:block ${showGuide ? "" : "hidden"}`}>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {steps.map((stepId, index) => {
          const active = stepId === activeStep;
          const step = STEP_COPY[stepId];
          return (
            <li
              key={stepId}
              aria-current={active ? "step" : undefined}
              className={`rounded-lg border p-3 ${
                active
                  ? "border-ucla-blue bg-ucla-blue/5"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    active ? "bg-ucla-blue text-white" : "bg-white text-gray-600"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-gray-900">{step.label}</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-600">{step.text}</p>
            </li>
          );
        })}
      </ol>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          Before calling pathology, confirm on another plane, check the expected normal variant,
          and use T1 or sequence logic when edema-like signal could be artifact or marrow reconversion.
        </p>
      </div>
    </section>
  );
}
