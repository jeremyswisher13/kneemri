import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { moduleRegistry } from "@/content/modules";
import { caseRegistry } from "@/content/cases";

export default function DashboardPage() {
  const { user } = useAuth();
  const { progress, loading } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const fellowName = user?.displayName || user?.email || "Fellow";
  const preAssessmentComplete = progress?.preQuizCompleted && progress?.preSurveyCompleted;
  const modulesCompleted = progress?.modulesCompleted ?? 0;
  const totalModules = moduleRegistry.length;
  const casesCompleted = progress?.casesCompleted ?? 0;
  const totalCases = caseRegistry.length;
  const postAssessmentAvailable = !!progress?.postQuizUnlocked;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {fellowName}
      </h1>
      <p className="mt-1 text-gray-500">
        Track your progress through the Knee MRI interpretation course.
      </p>

      {/* Status Cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pre-Assessment */}
        <Card title="Pre-Assessment">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                preAssessmentComplete ? "bg-green-500" : "bg-amber-400"
              }`}
            />
            <span className="text-sm text-gray-600">
              {preAssessmentComplete ? "Complete" : "Incomplete"}
            </span>
          </div>
          {!preAssessmentComplete && (
            <div className="mt-3">
              <Link to="/pre-assessment">
                <Button size="sm">Start Pre-Assessment</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Modules Progress */}
        <Card title="Modules Progress">
          <p className="text-3xl font-bold text-ucla-blue">
            {modulesCompleted}
            <span className="text-base font-normal text-gray-400">
              /{totalModules}
            </span>
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-ucla-blue transition-all"
              style={{
                width: `${totalModules > 0 ? (modulesCompleted / totalModules) * 100 : 0}%`,
              }}
            />
          </div>
        </Card>

        {/* Cases */}
        <Card title="Cases">
          <p className="text-3xl font-bold text-ucla-blue">
            {casesCompleted}
            <span className="text-base font-normal text-gray-400">
              /{totalCases}
            </span>
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-ucla-gold transition-all"
              style={{
                width: `${totalCases > 0 ? (casesCompleted / totalCases) * 100 : 0}%`,
              }}
            />
          </div>
        </Card>

        {/* Post-Assessment */}
        <Card title="Post-Assessment">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                postAssessmentAvailable ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span className="text-sm text-gray-600">
              {postAssessmentAvailable ? "Available" : "Locked"}
            </span>
          </div>
          {!postAssessmentAvailable && (
            <p className="mt-2 text-xs text-gray-400">
              Complete all modules and cases to unlock.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
