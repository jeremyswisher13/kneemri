import { defaultCourse, requiredCoreCaseCount, type CourseDefinition } from "@/content/courses";
import {
  buildStepData,
  getStepStatuses,
  getStepSubtext,
  type WelcomeGuideProgress,
} from "./welcome-guide-logic";

export type { WelcomeGuideProgress };

interface Props {
  progress?: WelcomeGuideProgress;
  course?: CourseDefinition;
}

/** Compact curriculum spine. The dashboard owns the single actionable CTA. */
export default function WelcomeGuide({ progress, course = defaultCourse }: Props) {
  const p: WelcomeGuideProgress = progress ?? {
    preAssessmentComplete: false,
    modulesCompleted: 0,
    totalModules: course.modules.length,
    casesCompleted: 0,
    totalCases: requiredCoreCaseCount(course),
    normalMriComplete: false,
    postAssessmentUnlocked: false,
    postAssessmentComplete: false,
  };
  const steps = buildStepData(course);
  const statuses = getStepStatuses(steps, p);

  return (
    <section aria-labelledby="course-pathway-title" className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="course-pathway-title" className="text-base font-semibold text-gray-900">
            Course pathway
          </h2>
          <p className="mt-1 text-sm text-gray-500">One sequence across every MRI course.</p>
        </div>
      </div>

      <ol className="mt-3 grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-5">
        {steps.map((step, index) => {
          const status = statuses[index];
          const subtext = getStepSubtext(step.kind, status, p);
          return (
            <li
              key={step.kind}
              aria-current={status === "current" ? "step" : undefined}
              className={`min-w-0 bg-white px-3 py-3 ${
                status === "current"
                  ? "border-l-4 border-ucla-blue sm:border-l-0 sm:border-t-4"
                  : status === "future"
                    ? "text-gray-500"
                    : "text-green-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    status === "complete"
                      ? "bg-green-100 text-green-700"
                      : status === "current"
                        ? "bg-ucla-blue text-white"
                        : "bg-gray-100 text-gray-500"
                  }`}
                  aria-hidden="true"
                >
                  {status === "complete" ? (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <p className="min-w-0 text-sm font-semibold leading-snug text-gray-900">{step.title}</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                {subtext ?? "Upcoming"}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
