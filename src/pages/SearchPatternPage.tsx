import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { searchPatternSteps } from "@/content/search-pattern";

export default function SearchPatternPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

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

  if (showSummary) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Search Pattern Summary
        </h1>
        <p className="mt-1 text-gray-500">
          You checked {totalChecked} of {totalItems} items across all 7 steps.
        </p>

        {/* Progress bar */}
        <div className="mt-6 mb-8">
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-ucla-blue transition-all"
              style={{ width: `${(totalChecked / totalItems) * 100}%` }}
            />
          </div>
          <p className="mt-1 text-sm text-gray-400 text-right">
            {Math.round((totalChecked / totalItems) * 100)}% complete
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
                        : "text-gray-400"
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
          <Link to="/cases">
            <Button>Practice on a Case</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        7-Step Search Pattern Trainer
      </h1>
      <p className="mt-1 text-gray-500">
        Practice the systematic approach to knee MRI interpretation. Complete
        each step&apos;s checklist to build your reading pattern.
      </p>

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
                onClick={() =>
                  setCurrentStep(isActive ? -1 : stepIdx)
                }
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
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Progress indicator */}
                {!stepComplete && (
                  <span className="text-xs text-gray-400">
                    {getStepProgress(step.number)}%
                  </span>
                )}

                <svg
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
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
                              ? "text-gray-400 line-through"
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
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Reset all checkboxes
        </button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowSummary(true)}>
            View Summary
          </Button>
          <Link to="/cases">
            <Button>Practice on a Case</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
