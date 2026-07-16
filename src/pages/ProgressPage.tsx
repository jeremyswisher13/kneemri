import Card from "@/components/ui/Card";
import CompletionTimeline from "@/components/ui/CompletionTimeline";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import {
  getVisibleAdvancedCases,
  getVisibleCoreCases,
  getPreQuizQuestions,
  getPostQuizQuestions,
  requiredCoreCaseCount,
} from "@/content/courses";

export default function ProgressPage() {
  const { role } = useAuth();
  const activeCourse = useActiveCourse();
  const { progress, loading } = useProgress(activeCourse);
  const isResident = role === 'resident';
  // Fallback quiz totals for this course (used only when a stored attempt lacks totalQuestions).
  const preTotalFallback = getPreQuizQuestions(activeCourse).length;
  const postTotalFallback = getPostQuizQuestions(activeCourse).length;
  // The case card tracks the shared completion milestone; the library section
  // below still shows every role-visible core and advanced case.
  const visibleCoreCases = getVisibleCoreCases(activeCourse, isResident);
  const visibleAdvancedCases = getVisibleAdvancedCases(activeCourse, isResident);
  const totalCoreCases = visibleCoreCases.length;
  const requiredCaseCount = requiredCoreCaseCount(activeCourse, isResident);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Unable to load progress data.</p>
      </div>
    );
  }

  const activeModuleIds = new Set(activeCourse.modules.map((m) => m.id));
  const completedModuleCount = (progress.moduleProgress ?? []).filter(
    (m) => m.completed && activeModuleIds.has(m.id)
  ).length;
  const modulePercent =
    activeCourse.modules.length > 0
      ? Math.round((completedModuleCount / activeCourse.modules.length) * 100)
      : 0;

  const coreCaseIds = new Set(visibleCoreCases.map(c => c.id));
  const allCompletedCaseIds = new Set<string>(
    (progress.caseAttempts?.map((c) => c.caseId) ?? [])
  );
  const completedCoreCaseIds = new Set<string>(
    [...allCompletedCaseIds].filter((id) => coreCaseIds.has(id))
  );
  const casePercent =
    requiredCaseCount > 0
      ? Math.min(100, Math.round((completedCoreCaseIds.size / requiredCaseCount) * 100))
      : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
      <p className="mt-1 text-gray-500">
        {/* Not .toLowerCase() — it turned the "MRI" acronym into "mri". */}
        Track your journey through {activeCourse.dashboardTitle}.
      </p>

      {/* Overall Summary */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activeCourse.features.assessments ? (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Pre-Assessment
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                progress.preQuizCompleted ? "bg-green-500" : "bg-amber-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {progress.preQuizCompleted ? "Complete" : "Incomplete"}
            </span>
          </div>
          {progress.preQuizScore !== null && (
            <p className="mt-1 text-2xl font-bold text-ucla-blue">
              {progress.preQuizScore}
              <span className="text-sm font-normal text-gray-500">/{progress.preQuizTotal ?? preTotalFallback}</span>
            </p>
          )}
        </Card>
        ) : (
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Course Status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="text-sm font-medium text-gray-700">MVP build</span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Assessments and certificate are planned after content research.
          </p>
        </Card>
        )}

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Modules
          </p>
          <p className="mt-2 text-2xl font-bold text-ucla-blue">
            {completedModuleCount}
            <span className="text-sm font-normal text-gray-500">
              /{activeCourse.modules.length}
            </span>
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-ucla-blue transition-all"
              style={{ width: `${modulePercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">{modulePercent}% complete</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Required Cases
          </p>
          <p className="mt-2 text-2xl font-bold text-ucla-blue">
            {Math.min(completedCoreCaseIds.size, requiredCaseCount)}
            <span className="text-sm font-normal text-gray-500">
              /{requiredCaseCount}
            </span>
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-ucla-gold transition-all"
              style={{ width: `${casePercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Any 3 core cases</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {activeCourse.features.assessments ? "Post-Assessment" : "Assessment Blueprint"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                !activeCourse.features.assessments
                  ? "bg-gray-300"
                  : progress.postQuizCompleted
                  ? "bg-green-500"
                  : progress.postQuizUnlocked
                  ? "bg-amber-400"
                  : "bg-gray-300"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {activeCourse.features.assessments
                ? progress.postQuizCompleted
                  ? "Complete"
                  : progress.postQuizUnlocked
                  ? "Available"
                  : "Locked"
                : "Planned"}
            </span>
          </div>
          {activeCourse.features.assessments && progress.postQuizScore !== null && (
            <p className="mt-1 text-2xl font-bold text-ucla-blue">
              {progress.postQuizScore}
              <span className="text-sm font-normal text-gray-500">/{progress.postQuizTotal ?? postTotalFallback}</span>
            </p>
          )}
        </Card>
      </div>

      {/* Completion Timeline */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Completion Timeline
        </h2>
        <CompletionTimeline progress={progress} course={activeCourse} />
      </div>

      {/* Pre-Assessment Results */}
      {activeCourse.features.assessments && progress.preQuizCompleted && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pre-Assessment Results
          </h2>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Quiz Score</p>
                <p className="text-3xl font-bold text-ucla-blue">
                  {progress.preQuizScore}
                  <span className="text-base font-normal text-gray-500">
                    /{progress.preQuizTotal ?? preTotalFallback}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {progress.preQuizScore !== null && (progress.preQuizTotal ?? preTotalFallback) > 0
                    ? `${Math.min(100, Math.round((progress.preQuizScore / (progress.preQuizTotal ?? preTotalFallback)) * 100))}%`
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Confidence Survey</p>
                <p className="text-sm font-medium text-gray-700">
                  {progress.preSurveyCompleted ? "Completed" : "Not completed"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Module Progress */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Module Progress
        </h2>
        <Card className="!p-0 divide-y divide-gray-100">
          {activeCourse.modules.map((mod) => {
            const record = progress.moduleProgress?.find(
              (m) => m.id === mod.id
            );
            const isCompleted = record?.completed;

            return (
              <div
                key={mod.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
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
                    ) : (
                      mod.number
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {mod.title}
                    </p>
                    <p className="text-xs text-gray-500">{mod.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isCompleted
                    ? record?.quizScore != null && record?.quizTotal != null
                      ? `Quiz: ${record.quizScore}/${record.quizTotal}`
                      : "Complete"
                    : "Not started"}
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Core Case Progress */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Core Case Library
        </h2>
        <p className="-mt-2 mb-4 text-sm text-gray-500">
          {completedCoreCaseIds.size}/{totalCoreCases} explored · any {requiredCaseCount} complete the course requirement
        </p>
        <Card className="!p-0 divide-y divide-gray-100">
          {visibleCoreCases.map((caseItem, caseIndex) => {
            const isCompleted = allCompletedCaseIds.has(caseItem.id);
            const caseNumber = caseIndex + 1;

            return (
              <div
                key={caseItem.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
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
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isCompleted ? caseItem.title : `Case ${caseNumber}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {caseItem.difficulty.charAt(0).toUpperCase() +
                        caseItem.difficulty.slice(1)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCompleted ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isCompleted ? "Complete" : "Not attempted"}
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Advanced Case Progress (fellows only) */}
      {visibleAdvancedCases.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Advanced Cases
          </h2>
          <p className="text-xs text-gray-500 mb-4">Optional deep dives — not required for completion</p>
          <Card className="!p-0 divide-y divide-gray-100">
            {visibleAdvancedCases.map((caseItem, caseIndex) => {
              const isCompleted = allCompletedCaseIds.has(caseItem.id);
              const caseNumber = caseIndex + 1;

              return (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
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
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {isCompleted ? caseItem.title : `Case ${caseNumber}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {caseItem.difficulty.charAt(0).toUpperCase() +
                          caseItem.difficulty.slice(1)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCompleted ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isCompleted ? "Complete" : "Not attempted"}
                  </span>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* Post-Assessment Results (if completed) */}
      {activeCourse.features.assessments && progress.postQuizCompleted && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Post-Assessment Results
          </h2>
          <Card>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Pre score */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Pre-Assessment Score
                </p>
                <p className="text-3xl font-bold text-gray-500">
                  {progress.preQuizScore ?? "---"}
                  <span className="text-base font-normal">/{progress.preQuizTotal ?? preTotalFallback}</span>
                </p>
                {progress.preQuizScore !== null && (
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gray-400 transition-all"
                      style={{
                        width: `${Math.min(100, (progress.preQuizScore / ((progress.preQuizTotal ?? preTotalFallback) || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Post score */}
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Post-Assessment Score
                </p>
                <p className="text-3xl font-bold text-ucla-blue">
                  {progress.postQuizScore ?? "---"}
                  <span className="text-base font-normal text-gray-500">
                    /{progress.postQuizTotal ?? postTotalFallback}
                  </span>
                </p>
                {progress.postQuizScore !== null && (
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-ucla-blue transition-all"
                      style={{
                        width: `${Math.min(100, (progress.postQuizScore / ((progress.postQuizTotal ?? postTotalFallback) || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Improvement */}
            {progress.preQuizScore !== null &&
              progress.postQuizScore !== null && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-500">Improvement</p>
                  <p
                    className={`text-2xl font-bold ${
                      progress.postQuizScore - progress.preQuizScore > 0
                        ? "text-green-600"
                        : progress.postQuizScore - progress.preQuizScore === 0
                        ? "text-gray-500"
                        : "text-red-600"
                    }`}
                  >
                    {progress.postQuizScore - progress.preQuizScore > 0
                      ? "+"
                      : ""}
                    {progress.postQuizScore - progress.preQuizScore} points
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.min(100, Math.round((progress.preQuizScore / ((progress.preQuizTotal ?? preTotalFallback) || 1)) * 100))}% &rarr;{" "}
                    {Math.min(100, Math.round((progress.postQuizScore / ((progress.postQuizTotal ?? postTotalFallback) || 1)) * 100))}%
                  </p>
                </div>
              )}
          </Card>
        </div>
      )}
    </div>
  );
}
