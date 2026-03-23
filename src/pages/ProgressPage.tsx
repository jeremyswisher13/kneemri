import Card from "@/components/ui/Card";
import { moduleRegistry } from "@/content/modules";
import { caseRegistry } from "@/content/cases";
import { useProgress } from "@/hooks/useProgress";

export default function ProgressPage() {
  const { progress, loading } = useProgress();

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

  const modulePercent =
    progress.totalModules > 0
      ? Math.round((progress.modulesCompleted / progress.totalModules) * 100)
      : 0;

  const completedCaseIds = new Set(
    progress.caseAttempts?.map((c: any) => c.caseId) ?? []
  );
  const casePercent =
    caseRegistry.length > 0
      ? Math.round((completedCaseIds.size / caseRegistry.length) * 100)
      : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Your Progress</h1>
      <p className="mt-1 text-gray-500">
        Track your journey through the Knee MRI interpretation course.
      </p>

      {/* Overall Summary */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
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
              <span className="text-sm font-normal text-gray-400">/25</span>
            </p>
          )}
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Modules
          </p>
          <p className="mt-2 text-2xl font-bold text-ucla-blue">
            {progress.modulesCompleted}
            <span className="text-sm font-normal text-gray-400">
              /{progress.totalModules}
            </span>
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-ucla-blue transition-all"
              style={{ width: `${modulePercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">{modulePercent}% complete</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Cases
          </p>
          <p className="mt-2 text-2xl font-bold text-ucla-blue">
            {completedCaseIds.size}
            <span className="text-sm font-normal text-gray-400">
              /{caseRegistry.length}
            </span>
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-ucla-gold transition-all"
              style={{ width: `${casePercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">{casePercent}% complete</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Post-Assessment
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                progress.postQuizCompleted
                  ? "bg-green-500"
                  : progress.postQuizUnlocked
                  ? "bg-amber-400"
                  : "bg-gray-300"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {progress.postQuizCompleted
                ? "Complete"
                : progress.postQuizUnlocked
                ? "Available"
                : "Locked"}
            </span>
          </div>
          {progress.postQuizScore !== null && (
            <p className="mt-1 text-2xl font-bold text-ucla-blue">
              {progress.postQuizScore}
              <span className="text-sm font-normal text-gray-400">/25</span>
            </p>
          )}
        </Card>
      </div>

      {/* Pre-Assessment Results */}
      {progress.preQuizCompleted && (
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
                  <span className="text-base font-normal text-gray-400">
                    /25
                  </span>
                </p>
                <p className="text-sm text-gray-400">
                  {progress.preQuizScore !== null
                    ? `${Math.round((progress.preQuizScore / 25) * 100)}%`
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
          {moduleRegistry.map((mod) => {
            const record = progress.moduleProgress?.find(
              (m: any) => m.id === mod.id
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
                        : "bg-gray-100 text-gray-400"
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
                    <p className="text-xs text-gray-400">{mod.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCompleted ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {isCompleted ? "Complete" : "Not started"}
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Case Progress */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Case Progress
        </h2>
        <Card className="!p-0 divide-y divide-gray-100">
          {caseRegistry.map((caseItem) => {
            const isCompleted = completedCaseIds.has(caseItem.id);

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
                        : "bg-gray-100 text-gray-400"
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
                      {caseItem.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {caseItem.difficulty.charAt(0).toUpperCase() +
                        caseItem.difficulty.slice(1)}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCompleted ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {isCompleted ? "Complete" : "Not attempted"}
                </span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Post-Assessment Results (if completed) */}
      {progress.postQuizCompleted && (
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
                <p className="text-3xl font-bold text-gray-400">
                  {progress.preQuizScore ?? "---"}
                  <span className="text-base font-normal">/25</span>
                </p>
                {progress.preQuizScore !== null && (
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-gray-400 transition-all"
                      style={{
                        width: `${(progress.preQuizScore / 25) * 100}%`,
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
                  <span className="text-base font-normal text-gray-400">
                    /25
                  </span>
                </p>
                {progress.postQuizScore !== null && (
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-ucla-blue transition-all"
                      style={{
                        width: `${(progress.postQuizScore / 25) * 100}%`,
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
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.round((progress.preQuizScore / 25) * 100)}% &rarr;{" "}
                    {Math.round((progress.postQuizScore / 25) * 100)}%
                  </p>
                </div>
              )}
          </Card>
        </div>
      )}
    </div>
  );
}
