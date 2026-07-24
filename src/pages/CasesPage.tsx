import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import type { CaseMeta } from "@/content/case-metas";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import {
  coursePath,
  getVisibleAdvancedCases,
  getVisibleCoreCases,
  requiredCoreCaseCount,
} from "@/content/courses";

const difficultyConfig = {
  foundational: { label: "Foundational", bg: "bg-green-100", text: "text-green-700" },
  intermediate: { label: "Intermediate", bg: "bg-blue-100", text: "text-ucla-blue" },
  advanced: { label: "Advanced", bg: "bg-red-100", text: "text-red-700" },
} as const;

type StatusFilter = "all" | "todo" | "done";

export default function CasesPage() {
  const { role } = useAuth();
  const activeCourse = useActiveCourse();
  const { progress, loading } = useProgress(activeCourse);
  const isResident = role === "resident";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  // For residents: only show core cases that are residentVisible
  // For fellows: show all core + all advanced
  const visibleCoreCases = getVisibleCoreCases(activeCourse, isResident);
  const visibleAdvancedCases = getVisibleAdvancedCases(activeCourse, isResident);

  function isCaseCompleted(caseId: string) {
    return progress?.caseAttempts?.some((a) => a.caseId === caseId) ?? false;
  }

  /**
   * SPOILER-SAFE search. An unopened case deliberately hides its title and
   * diagnoses (it renders as "Case 3: Foundational"), so matching those would let
   * a learner type "ACL" and be told which case is the ACL tear — defeating the
   * point of the exercise. Only match the clinical scenario while unopened;
   * title, diagnoses, and tags join the search index after completion.
   */
  function matchesQuery(caseItem: CaseMeta, completed: boolean) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const visibleText = completed
      ? [caseItem.title, ...caseItem.keyDiagnoses, caseItem.clinicalScenario, ...caseItem.tags]
      : [caseItem.clinicalScenario];
    return visibleText.join(" ").toLowerCase().includes(q);
  }

  /**
   * Filter while PRESERVING each case's original position, so the "Case N" label
   * keeps matching the full list instead of renumbering under a filter.
   */
  function applyFilters(cases: CaseMeta[]) {
    return cases
      .map((caseItem, index) => ({ caseItem, index }))
      .filter(({ caseItem }) => {
        const completed = isCaseCompleted(caseItem.id);
        if (statusFilter === "todo" && completed) return false;
        if (statusFilter === "done" && !completed) return false;
        return matchesQuery(caseItem, completed);
      });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const coreCompletedCount = visibleCoreCases.filter((c) =>
    isCaseCompleted(c.id)
  ).length;
  const advancedCompletedCount = visibleAdvancedCases.filter((c) =>
    isCaseCompleted(c.id)
  ).length;
  const totalCompleted = coreCompletedCount + advancedCompletedCount;
  const totalVisible = visibleCoreCases.length + visibleAdvancedCases.length;

  // NOTE: the counts above deliberately stay whole-course (they drive the course
  // requirement and the milestone banners); only the rendered lists are filtered.
  const filteredCore = applyFilters(visibleCoreCases);
  const filteredAdvanced = applyFilters(visibleAdvancedCases);

  const requiredCoreCount = requiredCoreCaseCount(activeCourse, isResident);
  const requiredCoreDone = coreCompletedCount >= requiredCoreCount;
  const allCoreDone = visibleCoreCases.length > 0 && visibleCoreCases.every((c) => isCaseCompleted(c.id));
  const regionTitle = activeCourse.bodyRegion.charAt(0).toUpperCase() + activeCourse.bodyRegion.slice(1);
  const normalMriPath = coursePath(activeCourse, `/normal-${activeCourse.bodyRegion}-mri`);
  const baselineComplete = !!(progress?.preQuizCompleted && progress?.preSurveyCompleted);
  const prerequisitePath = baselineComplete
    ? normalMriPath
    : coursePath(activeCourse, "/pre-assessment");
  const prerequisiteTitle = baselineComplete
    ? `Recommended first: master the normal ${activeCourse.bodyRegion}`
    : "Recommended first: capture your baseline";
  const prerequisiteCopy = baselineComplete
    ? `Pathology is easier to recognize once normal is second nature. Complete the Normal ${regionTitle} practice and blinded Mastery Check before these cases.`
    : "Complete the baseline knowledge quiz and confidence survey before opening the teaching sequence.";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Case Simulator</h1>
      <p className="mt-1 text-gray-500">
        Apply your {activeCourse.bodyRegion} MRI search pattern skills to realistic clinical cases.
        {" "}
        <span className="font-medium text-gray-600">
          {totalCompleted}/{totalVisible} completed
        </span>
      </p>
      <p className="mt-2 text-sm font-medium text-gray-700">
        Complete any {requiredCoreCount} core cases for the course requirement. The rest are optional practice.
      </p>

      {(!baselineComplete || !progress?.normalMriComplete) && <Link to={prerequisitePath} className="mt-4 block">
        <div className="flex items-center gap-3 rounded-lg border border-ucla-blue/30 bg-ucla-light px-4 py-3 transition-colors hover:bg-ucla-light/70">
          <svg className="h-5 w-5 shrink-0 text-ucla-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#003B5C]">{prerequisiteTitle}</p>
            <p className="text-xs text-gray-600">{prerequisiteCopy}</p>
          </div>
          <svg className="h-4 w-4 shrink-0 text-ucla-blue" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </Link>}

      {/* Milestone encouragement banners */}
      {coreCompletedCount > 0 && !requiredCoreDone && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          Great start! Each case builds your pattern recognition skills.
        </div>
      )}
      {requiredCoreDone && !allCoreDone && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          Required cases complete. Keep exploring the remaining core cases whenever they match your learning goals.
        </div>
      )}
      {allCoreDone && visibleAdvancedCases.length > 0 && advancedCompletedCount < visibleAdvancedCases.length && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          Core cases complete — try the advanced cases for additional practice!
        </div>
      )}
      {totalCompleted === totalVisible && totalVisible > 0 && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          All cases complete! You've worked through every clinical scenario.
        </div>
      )}

      {/* Find-a-case controls. This list runs several screens long, so "which
          ones haven't I done?" needs to be one tap, not a scroll-and-scan. */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter cases by status">
          {([
            ["all", "All", totalVisible],
            ["todo", "Not started", totalVisible - totalCompleted],
            ["done", "Completed", totalCompleted],
          ] as const).map(([value, label, count]) => {
            const active = statusFilter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value)}
                aria-pressed={active}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors sm:min-h-9 ${
                  active
                    ? "border-ucla-blue bg-ucla-blue text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {label}
                <span className={active ? "text-white/80" : "text-gray-400"}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative sm:w-64">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search presentations…"
            aria-label="Search cases by clinical presentation"
            /* text-base on mobile: <16px triggers iOS zoom-on-focus. */
            className="min-h-11 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-ucla-blue focus-visible:ring-2 focus-visible:ring-ucla-blue/40 sm:min-h-9 sm:text-sm"
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      {query.trim() !== "" && (
        <p className="mt-2 text-xs text-gray-500">
          Searching presentations and tags only — a case&apos;s diagnosis stays hidden until you complete it.
        </p>
      )}

      {filteredCore.length === 0 && filteredAdvanced.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">No cases match this filter.</p>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setQuery("");
            }}
            className="mt-2 min-h-11 text-sm font-semibold text-ucla-blue hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Core Cases Section */}
          {filteredCore.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Core Cases</h2>
              <p className="mt-1 text-sm text-gray-500">
                {Math.min(coreCompletedCount, requiredCoreCount)}/{requiredCoreCount} required · {coreCompletedCount}/{visibleCoreCases.length} explored
                {filteredCore.length !== visibleCoreCases.length && (
                  <span className="text-gray-400"> · showing {filteredCore.length}</span>
                )}
              </p>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {filteredCore.map(({ caseItem, index }) =>
                  renderCaseCard(caseItem, index, isCaseCompleted, activeCourse)
                )}
              </div>
            </div>
          )}

          {/* Advanced Cases Section (fellows only) */}
          {filteredAdvanced.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-semibold text-gray-900">Advanced Cases</h2>
              <p className="mt-1 text-sm text-gray-500">
                Optional deep dives for additional practice.{" "}
                {advancedCompletedCount}/{visibleAdvancedCases.length} completed
                {filteredAdvanced.length !== visibleAdvancedCases.length && (
                  <span className="text-gray-400"> · showing {filteredAdvanced.length}</span>
                )}
              </p>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {filteredAdvanced.map(({ caseItem, index }) =>
                  renderCaseCard(caseItem, index, isCaseCompleted, activeCourse)
                )}
              </div>
            </div>
          )}
        </>
      )}
      {/* How-it-works explainer: evergreen guidance, so it sits BELOW the case
          list rather than pushing the filter and cases off the first screen. */}
      <div className="mt-12 grid gap-2 sm:grid-cols-3">
        {[
          ["1", "Normal baseline", "Anchor the exam against expected anatomy before naming pathology."],
          ["2", "Structured search", "Work region by region so subtle secondary signs are not skipped."],
          ["3", "Report comparison", "Compare your read with the model findings and teaching points."],
        ].map(([number, title, copy]) => (
          <div key={title} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ucla-light text-xs font-bold text-ucla-blue">
                {number}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{copy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function renderCaseCard(
  caseItem: CaseMeta,
  caseIndex: number,
  isCaseCompleted: (id: string) => boolean,
  activeCourse: ReturnType<typeof useActiveCourse>
) {
  const completed = isCaseCompleted(caseItem.id);
  const diff = difficultyConfig[caseItem.difficulty];
  const caseNumber = caseIndex + 1;

  return (
    <Link
      key={caseItem.id}
      to={coursePath(activeCourse, `/cases/${caseItem.id}`)}
      aria-label={
        completed
          ? `Review case: ${caseItem.title}`
          : `Start case ${caseNumber}: ${diff.label} ${activeCourse.shortTitle} case`
      }
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue focus-visible:ring-offset-2"
    >
      <Card className="flex h-full flex-col transition-shadow hover:border-ucla-blue/30 hover:shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty badge */}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${diff.bg} ${diff.text}`}
          >
            {diff.label}
          </span>

          {/* Completion badge */}
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              <svg
                className="h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Completed
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          {completed
            ? caseItem.title
            : `Case ${caseNumber}: ${diff.label}`}
        </h3>

        {/* Clinical Scenario */}
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
          {caseItem.clinicalScenario}
        </p>

        {/* Diagnostic metadata appears only after completion. */}
        <div className="mt-4 flex-1">
          {completed ? (
            <>
              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-500">Diagnoses</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {caseItem.keyDiagnoses.map((diagnosis, i) => (
                  <span
                    key={i}
                    className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {diagnosis}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs font-medium text-gray-500">
              Diagnosis hidden until you complete the case.
            </p>
          )}
        </div>

        <div className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-ucla-blue">
          {completed ? "Review case" : "Start case"}
          <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
