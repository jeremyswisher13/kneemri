import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { coursePath, defaultCourse, type CourseDefinition } from "@/content/courses";
import {
  buildStepData,
  getStepStatuses,
  getStepSubtext,
  type StepKind,
  type WelcomeGuideProgress,
} from "./welcome-guide-logic";

export type { WelcomeGuideProgress };

const ICONS = {
  preAssessment: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
    />
  ),
  modules: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  ),
  cases: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
  ),
  postAssessment: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
  ),
};

// Per-kind icons (the step data is supplied by the pure buildStepData()).
const ICON_FOR_KIND: Record<StepKind, ReactNode> = {
  pre: ICONS.preAssessment,
  normal: ICONS.cases,
  modules: ICONS.modules,
  cases: ICONS.cases,
  post: ICONS.postAssessment,
};

interface Props {
  progress?: WelcomeGuideProgress;
  course?: CourseDefinition;
}

export default function WelcomeGuide({ progress, course = defaultCourse }: Props) {
  const dismissKey = `welcome-dismissed-${course.id}`;
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(dismissKey) === "true";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(dismissKey, "true");
    } catch {
      // ignore
    }
  }

  const defaultProgress: WelcomeGuideProgress = {
    preAssessmentComplete: false,
    modulesCompleted: 0,
    totalModules: course.modules.length,
    casesCompleted: 0,
    totalCases: course.coreCases.length,
    normalMriComplete: false,
    postAssessmentUnlocked: false,
    postAssessmentComplete: false,
  };

  const p = progress ?? defaultProgress;
  const steps = buildStepData(course);
  const statuses = getStepStatuses(steps, p);

  return (
    <div className="mb-8 rounded-xl border-2 border-ucla-blue/20 bg-gradient-to-br from-ucla-light/60 to-white p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-ucla-dark flex items-center gap-2">
            <svg
              className="h-5 w-5 text-ucla-blue"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
            Welcome to the {course.shortTitle} Course
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's how to get the most out of this course. Follow these steps in
            order.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Dismiss welcome guide"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, idx) => {
          const status = statuses[idx];
          const subtext = getStepSubtext(step.kind, status, p);

          const borderClass =
            status === "current"
              ? "border-ucla-blue border-2 ring-1 ring-ucla-blue/20"
              : status === "complete"
              ? "border-green-300 border"
              : "border-gray-200 border opacity-60";

          const bgClass =
            status === "current"
              ? "bg-ucla-light/30"
              : status === "complete"
              ? "bg-green-50/50"
              : "bg-white";

          const numberBg =
            status === "complete"
              ? "bg-green-500 text-white"
              : status === "current"
              ? "bg-ucla-blue text-white"
              : "bg-gray-200 text-gray-500";

          return (
            <div
              key={idx}
              className={`rounded-lg p-4 transition-all ${borderClass} ${bgClass}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${numberBg}`}
                >
                  {status === "complete" ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <svg
                  className={`h-4 w-4 ${
                    status === "complete"
                      ? "text-green-500"
                      : status === "current"
                      ? "text-ucla-blue"
                      : "text-gray-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  {ICON_FOR_KIND[step.kind]}
                </svg>
                {status === "future" && (
                  <svg
                    className="h-3.5 w-3.5 text-gray-300 ml-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                )}
              </div>
              <h3
                className={`text-sm font-semibold ${
                  status === "future" ? "text-gray-500" : "text-gray-900"
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`mt-1 text-xs leading-relaxed ${
                  status === "future" ? "text-gray-500" : "text-gray-500"
                }`}
              >
                {step.description}
              </p>

              {subtext && (
                <div className="mt-2">
                  {status === "complete" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {subtext}
                    </span>
                  ) : status === "current" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ucla-blue/10 px-2 py-0.5 text-xs font-medium text-ucla-blue">
                      <span className="h-1.5 w-1.5 rounded-full bg-ucla-blue animate-pulse" />
                      {subtext}
                    </span>
                  ) : null}
                </div>
              )}

              {status !== "future" && (
                <Link
                  to={step.link}
                  className={`mt-3 inline-block text-xs font-medium hover:underline ${
                    status === "complete" ? "text-green-600" : "text-ucla-blue"
                  }`}
                >
                  {step.linkLabel} &rarr;
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <p className="text-xs text-gray-500">
          Also check the{" "}
          <Link to={coursePath(course, "/search-pattern")} className="text-ucla-blue hover:underline">
            Search Pattern Trainer
          </Link>
          {course.features.reference && (
            <>
              {" "}and{" "}
              <Link to={coursePath(course, "/reference")} className="text-ucla-blue hover:underline">
                Quick Reference
              </Link>
            </>
          )}{" "}
          anytime.
        </p>
      </div>
    </div>
  );
}
