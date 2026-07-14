import { Link } from "react-router-dom";
import {
  coursePath,
  getVisibleAdvancedCases,
  getVisibleCoreCases,
  normalMriPath,
  requiredCoreCaseCount,
} from "@/content/courses";
import { LEARNING_TRACKS_BY_REGION } from "@/content/learning-paths";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveCourse } from "@/hooks/useActiveCourse";

function StepNumber({ n }: { n: number }) {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ucla-blue text-xs font-bold text-white">
      {n}
    </span>
  );
}

export default function LearningPathsPage() {
  const { role } = useAuth();
  const activeCourse = useActiveCourse();
  const tracks = LEARNING_TRACKS_BY_REGION[activeCourse.bodyRegion];
  const normalPath = normalMriPath(activeCourse);
  const isResident = role === "resident";
  const requiredCases = requiredCoreCaseCount(activeCourse, isResident);
  const visibleCases = [
    ...getVisibleCoreCases(activeCourse, isResident),
    ...getVisibleAdvancedCases(activeCourse, isResident),
  ];
  const visibleCaseById = new Map(visibleCases.map((caseItem) => [caseItem.id, caseItem]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
      <p className="mt-1 max-w-3xl text-gray-500">
        After the baseline pre-assessment, use a structure path to connect normal anatomy, focused modules,
        and clinical application.
      </p>

      <div className="mt-5 rounded-lg border border-ucla-blue/20 bg-ucla-light/40 px-4 py-3 text-sm text-gray-700">
        Every path uses the same sequence: see it normal, learn it, then apply it. Complete any {requiredCases} cases
        labeled Core for the course requirement; Advanced cases are optional.
      </div>

      <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
        {tracks.map((track) => {
          const visibleTrackCases = track.cases.filter((caseItem) => visibleCaseById.has(caseItem.id));
          return (
            <article key={track.id} className="py-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900">{track.title}</h2>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">{track.blurb}</p>
                </div>
                <p className="shrink-0 text-xs font-medium text-gray-500">{track.planes}</p>
              </div>

              <div className="mt-4 grid overflow-hidden rounded-lg border border-gray-200 bg-white md:grid-cols-3 md:divide-x md:divide-gray-200">
                <Link
                  to={normalPath}
                  className="group min-h-28 border-b border-gray-200 p-4 transition-colors hover:bg-ucla-light/40 md:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <StepNumber n={1} />
                    <span className="text-sm font-semibold text-[#003B5C]">See it normal</span>
                  </div>
                  <p className="mt-2 pl-8 text-xs leading-5 text-gray-600">
                    Sweep the stack, follow the tour, and practice the landmarks on the normal MRI.
                  </p>
                </Link>

                <div className="min-h-28 border-b border-gray-200 p-4 md:border-b-0">
                  <div className="flex items-center gap-2">
                    <StepNumber n={2} />
                    <span className="text-sm font-semibold text-gray-800">Learn it</span>
                  </div>
                  <div className="mt-2 space-y-1.5 pl-8">
                    {track.modules.map((module) => (
                      <Link
                        key={module.id}
                        to={coursePath(activeCourse, `/modules/${module.id}`)}
                        className="flex min-h-8 items-center justify-between gap-2 text-sm font-medium text-ucla-blue hover:underline"
                      >
                        <span>{module.title}</span>
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="min-h-28 p-4">
                  <div className="flex items-center gap-2">
                    <StepNumber n={3} />
                    <span className="text-sm font-semibold text-gray-800">Apply it</span>
                  </div>
                  <div className="mt-2 space-y-1.5 pl-8">
                    {visibleTrackCases.map((caseItem) => {
                      const tier = visibleCaseById.get(caseItem.id)?.tier ?? "core";
                      return (
                        <Link
                          key={caseItem.id}
                          to={coursePath(activeCourse, `/cases/${caseItem.id}`)}
                          className="flex min-h-8 items-center justify-between gap-2 text-sm font-medium text-[#7a5d00] hover:underline"
                        >
                          <span>{caseItem.label}</span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-gray-500">
                              {tier === "core" ? "Core" : "Advanced"}
                            </span>
                            <span aria-hidden="true">&rarr;</span>
                          </span>
                        </Link>
                      );
                    })}
                    {visibleTrackCases.length === 0 && (
                      <p className="text-xs leading-5 text-gray-500">
                        No cases from this path are assigned to your role.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
