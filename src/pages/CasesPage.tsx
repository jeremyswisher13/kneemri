import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import { caseRegistry } from "@/content/cases";
import { useProgress } from "@/hooks/useProgress";

const difficultyConfig = {
  foundational: { label: "Foundational", bg: "bg-green-100", text: "text-green-700" },
  intermediate: { label: "Intermediate", bg: "bg-blue-100", text: "text-ucla-blue" },
  advanced: { label: "Advanced", bg: "bg-red-100", text: "text-red-700" },
} as const;

export default function CasesPage() {
  const { progress, loading } = useProgress();

  function isCaseCompleted(caseId: string) {
    return progress?.caseAttempts?.some((a: any) => a.caseId === caseId) ?? false;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const completedCount = caseRegistry.filter((c) =>
    isCaseCompleted(c.id)
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Case Simulator</h1>
      <p className="mt-1 text-gray-500">
        Apply your search pattern skills to realistic clinical cases.
        {" "}
        <span className="font-medium text-gray-600">
          {completedCount}/{caseRegistry.length} completed
        </span>
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {caseRegistry.map((caseItem) => {
          const completed = isCaseCompleted(caseItem.id);
          const diff = difficultyConfig[caseItem.difficulty];

          return (
            <Link
              key={caseItem.id}
              to={`/cases/${caseItem.id}`}
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
                  {caseItem.title}
                </h3>

                {/* Clinical Scenario */}
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                  {caseItem.clinicalScenario}
                </p>

                {/* Key Diagnoses as tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {caseItem.keyDiagnoses.map((diagnosis, i) => (
                    <span
                      key={i}
                      className="inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {diagnosis}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
