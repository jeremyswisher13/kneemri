import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import type { CaseMeta } from "@/content/case-metas";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { coursePath, getVisibleAdvancedCases, getVisibleCoreCases } from "@/content/courses";

const difficultyConfig = {
  foundational: { label: "Foundational", bg: "bg-green-100", text: "text-green-700" },
  intermediate: { label: "Intermediate", bg: "bg-blue-100", text: "text-ucla-blue" },
  advanced: { label: "Advanced", bg: "bg-red-100", text: "text-red-700" },
} as const;

export default function CasesPage() {
  const { role } = useAuth();
  const activeCourse = useActiveCourse();
  const { progress, loading } = useProgress(activeCourse);
  const isResident = role === "resident";

  // For residents: only show core cases that are residentVisible
  // For fellows: show all core + all advanced
  const visibleCoreCases = getVisibleCoreCases(activeCourse, isResident);
  const visibleAdvancedCases = getVisibleAdvancedCases(activeCourse, isResident);

  function isCaseCompleted(caseId: string) {
    return progress?.caseAttempts?.some((a) => a.caseId === caseId) ?? false;
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

  const allCoreDone = visibleCoreCases.length > 0 && visibleCoreCases.every((c) => isCaseCompleted(c.id));
  const regionTitle = activeCourse.bodyRegion.charAt(0).toUpperCase() + activeCourse.bodyRegion.slice(1);
  const normalMriPath = coursePath(activeCourse, `/normal-${activeCourse.bodyRegion}-mri`);

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

      {/* Recommended-first: master the normal MRI before pathology cases */}
      <Link to={normalMriPath} className="mt-4 block">
        <div className="flex items-center gap-3 rounded-lg border border-ucla-blue/30 bg-ucla-light px-4 py-3 transition-colors hover:bg-ucla-light/70">
          <svg className="h-5 w-5 shrink-0 text-ucla-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#003B5C]">Recommended first: master the normal {activeCourse.bodyRegion}</p>
            <p className="text-xs text-gray-600">
              You'll catch far more pathology once normal is second nature — run the Normal {regionTitle} tour &amp; check before these cases.
            </p>
          </div>
          <svg className="h-4 w-4 shrink-0 text-ucla-blue" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </Link>

      {/* Milestone encouragement banners */}
      {coreCompletedCount > 0 && !allCoreDone && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          Great start! Each case builds your pattern recognition skills.
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

      {/* Core Cases Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Core Cases</h2>
        <p className="mt-1 text-sm text-gray-500">
          {coreCompletedCount}/{visibleCoreCases.length} completed
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {visibleCoreCases.map((caseItem, caseIndex) =>
            renderCaseCard(caseItem, caseIndex, isCaseCompleted, activeCourse)
          )}
        </div>
      </div>

      {/* Advanced Cases Section (fellows only) */}
      {visibleAdvancedCases.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900">Advanced Cases</h2>
          <p className="mt-1 text-sm text-gray-500">
            Optional deep dives for additional practice.{" "}
            {advancedCompletedCount}/{visibleAdvancedCases.length} completed
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {visibleAdvancedCases.map((caseItem, caseIndex) =>
              renderCaseCard(caseItem, caseIndex, isCaseCompleted, activeCourse)
            )}
          </div>
        </div>
      )}
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
      className="block"
    >
      <Card className="relative h-full transition-shadow hover:shadow-md hover:border-ucla-blue/30">
        {/* Completion badge */}
        {completed && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
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
              Completed
            </span>
          </div>
        )}

        {/* Difficulty badge */}
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${diff.bg} ${diff.text}`}
        >
          {diff.label}
        </span>

        {/* Title */}
        <h3 className="mt-3 text-lg font-semibold text-gray-900 pr-20">
          {completed
            ? caseItem.title
            : `Case ${caseNumber}: ${diff.label}`}
        </h3>

        {/* Clinical Scenario */}
        <p className="mt-2 text-sm text-gray-500 line-clamp-3">
          {caseItem.clinicalScenario}
        </p>

        {/* Tags (non-spoiling) or Diagnoses (after completion) */}
        <div className="mt-4">
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
            <div className="flex flex-wrap gap-1.5">
              {caseItem.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
