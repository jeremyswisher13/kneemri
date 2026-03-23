import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { caseRegistry } from "@/content/cases";
import { searchPatternSteps } from "@/content/search-pattern";
import { useAuth } from "@/contexts/AuthContext";
import { submitCaseAttempt } from "@/lib/firestore";

type TabKey = "clinical" | "search-pattern" | "report" | "answer-key";

const difficultyConfig = {
  foundational: { label: "Foundational", bg: "bg-green-100", text: "text-green-700" },
  intermediate: { label: "Intermediate", bg: "bg-blue-100", text: "text-ucla-blue" },
  advanced: { label: "Advanced", bg: "bg-red-100", text: "text-red-700" },
} as const;

export default function CasePage() {
  const { caseId } = useParams<{ caseId: string }>();
  const { user } = useAuth();

  const caseItem = caseRegistry.find((c) => c.id === caseId);

  const [activeTab, setActiveTab] = useState<TabKey>("clinical");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [findings, setFindings] = useState("");
  const [impression, setImpression] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!caseItem) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Case Not Found</h1>
        <p className="mt-2 text-gray-500">
          The requested case could not be found.
        </p>
        <Link to="/cases" className="mt-4 inline-block">
          <Button variant="secondary">Back to Cases</Button>
        </Link>
      </div>
    );
  }

  const diff = difficultyConfig[caseItem.difficulty];

  function toggleItem(stepNumber: number, itemIndex: number) {
    const key = `${stepNumber}-${itemIndex}`;
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function isItemChecked(stepNumber: number, itemIndex: number) {
    return !!checkedItems[`${stepNumber}-${itemIndex}`];
  }

  async function handleSubmit() {
    if (!findings.trim() && !impression.trim()) return;
    if (!user || !caseId) return;

    setSubmitting(true);
    try {
      const report = `FINDINGS:\n${findings}\n\nIMPRESSION:\n${impression}`;
      await submitCaseAttempt(user.uid, user.email || "", caseId, checkedItems, report);
      setSubmitted(true);
      setActiveTab("answer-key");
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  const tabs: { key: TabKey; label: string; locked?: boolean }[] = [
    { key: "clinical", label: "Clinical Info" },
    { key: "search-pattern", label: "Search Pattern" },
    { key: "report", label: "Your Report" },
    { key: "answer-key", label: "Answer Key", locked: !submitted },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link to="/cases" className="hover:text-ucla-blue transition-colors">
          Cases
        </Link>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{caseItem.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${diff.bg} ${diff.text}`}
          >
            {diff.label}
          </span>
          {submitted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Submitted
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{caseItem.title}</h1>
      </div>

      {/* Clinical Scenario Banner */}
      <div className="mb-6 rounded-xl border border-ucla-blue/20 bg-ucla-light px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ucla-blue mb-1">
          Clinical Scenario
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {caseItem.clinicalScenario}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                if (tab.locked) return;
                setActiveTab(tab.key);
              }}
              className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-ucla-blue text-ucla-blue"
                  : tab.locked
                  ? "border-transparent text-gray-300 cursor-not-allowed"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              {tab.locked && (
                <svg
                  className="ml-1.5 inline h-3.5 w-3.5"
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
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "clinical" && (
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
              Tags
            </h3>
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
            <Button onClick={() => setActiveTab("search-pattern")}>
              Begin Search Pattern &rarr;
            </Button>
          </div>
        </div>
      )}

      {activeTab === "search-pattern" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-2">
            Work through each step of the search pattern for this case. Check
            off items as you evaluate them.
          </p>

          {searchPatternSteps.map((step) => {
            const allChecked = step.checklistItems.every((_, i) =>
              isItemChecked(step.number, i)
            );
            const someChecked = step.checklistItems.some((_, i) =>
              isItemChecked(step.number, i)
            );

            return (
              <Card key={step.number}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      allChecked
                        ? "bg-green-100 text-green-700"
                        : someChecked
                        ? "bg-ucla-light text-ucla-blue"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {allChecked ? (
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
                  <h3 className="font-semibold text-gray-900">
                    Step {step.number}: {step.name}
                  </h3>
                </div>

                <div className="space-y-2 pl-11">
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
              </Card>
            );
          })}

          <div className="flex justify-end">
            <Button onClick={() => setActiveTab("report")}>
              Write Your Report &rarr;
            </Button>
          </div>
        </div>
      )}

      {activeTab === "report" && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Findings
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Describe what you see in each structure, organized by the search
              pattern steps.
            </p>
            <textarea
              value={findings}
              onChange={(e) => setFindings(e.target.value)}
              rows={10}
              disabled={submitted}
              placeholder={"BONES AND MARROW:\n...\n\nCARTILAGE:\n...\n\nMENISCI:\n...\n\nLIGAMENTS:\n...\n\nEXTENSOR MECHANISM:\n...\n\nSYNOVIUM/BURSAE:\n..."}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:border-ucla-blue focus:ring-1 focus:ring-ucla-blue/50 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Impression
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Summarize the key diagnoses and their significance.
            </p>
            <textarea
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              rows={5}
              disabled={submitted}
              placeholder={"1. \n2. \n3. "}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:border-ucla-blue focus:ring-1 focus:ring-ucla-blue/50 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </Card>

          {!submitted ? (
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setActiveTab("search-pattern")}
              >
                &larr; Back to Search Pattern
              </Button>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={
                  submitting || (!findings.trim() && !impression.trim())
                }
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
              <p className="text-sm font-medium text-green-700">
                Report submitted successfully. View the Answer Key to compare
                your report with the model answer.
              </p>
              <Button
                className="mt-3"
                size="sm"
                onClick={() => setActiveTab("answer-key")}
              >
                View Answer Key
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "answer-key" && submitted && (
        <div className="space-y-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm text-amber-700">
              Compare your report with the model answer below. Focus on
              identifying findings you may have missed and how the impression is
              structured.
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

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Model Findings
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              Model findings will be available when full case content is loaded.
              For now, review the key diagnoses above and compare with your
              report.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Model Impression
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
              Model impression will be available when full case content is
              loaded. Use the key diagnoses as a reference for what should appear
              in your impression.
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Your Report (Submitted)
            </h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Findings
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">
                {findings || "(No findings entered)"}
              </p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Impression
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {impression || "(No impression entered)"}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link to="/cases">
          <Button variant="secondary" size="sm">
            &larr; Back to Cases
          </Button>
        </Link>
      </div>
    </div>
  );
}
