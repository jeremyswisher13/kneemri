import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import { useProgress } from "@/hooks/useProgress";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { coursePath } from "@/content/courses";

export default function ModulesPage() {
  const activeCourse = useActiveCourse();
  const { progress, loading } = useProgress(activeCourse);
  const modules = activeCourse.modules;

  function getModuleStatus(moduleId: string) {
    const record = progress?.moduleProgress?.find(
      (m) => m.id === moduleId
    );
    if (!record) return "not-started";
    if (record.completed) return "completed";
    return "in-progress";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const completedModuleCount = modules.filter(
    (mod) => getModuleStatus(mod.id) === "completed"
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Course Modules</h1>
      <p className="mt-1 text-gray-500">
        Work through each module sequentially to build your {activeCourse.bodyRegion} MRI
        interpretation skills.
      </p>

      {/* Milestone encouragement banners */}
      {completedModuleCount >= Math.ceil(modules.length / 2) && completedModuleCount < modules.length && (
        <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          You've completed {completedModuleCount} of {modules.length} modules -- keep up the great work.
        </div>
      )}
      {completedModuleCount === modules.length && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          All modules complete! Time to put your knowledge to the test with cases.
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {modules.map((mod) => {
          const status = getModuleStatus(mod.id);

          return (
            <Link key={mod.id} to={coursePath(activeCourse, `/modules/${mod.id}`)} className="block">
              <Card className="relative h-full transition-shadow hover:shadow-md hover:border-ucla-blue/30">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {status === "completed" && (() => {
                    const record = progress?.moduleProgress?.find(
                      (m) => m.id === mod.id
                    );
                    const hasScore = record?.quizScore != null && record?.quizTotal != null;
                    return (
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
                        {hasScore ? `${record.quizScore}/${record.quizTotal}` : "Complete"}
                      </span>
                    );
                  })()}
                  {status === "in-progress" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-ucla-blue">
                      <span className="h-1.5 w-1.5 rounded-full bg-ucla-blue" />
                      In Progress
                    </span>
                  )}
                </div>

                {/* Module Number */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ucla-blue text-white text-sm font-bold">
                    {mod.number}
                  </div>
                  <div className="min-w-0 pr-20">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {mod.title}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {mod.estimatedMinutes} min
                </div>

                {/* Topics */}
                <div className="mt-3">
                  <ul className="space-y-1">
                    {mod.topics.slice(0, 4).map((topic, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-300" />
                        <span className="line-clamp-1">{topic}</span>
                      </li>
                    ))}
                    {mod.topics.length > 4 && (
                      <li className="text-xs text-gray-500 pl-3">
                        +{mod.topics.length - 4} more topics
                      </li>
                    )}
                  </ul>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
