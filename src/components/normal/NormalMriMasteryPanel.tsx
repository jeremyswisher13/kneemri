import { getCourseById, type CourseId } from "@/content/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";

interface NormalMriMasteryPanelProps {
  courseId: CourseId;
}

export default function NormalMriMasteryPanel({ courseId }: NormalMriMasteryPanelProps) {
  const course = getCourseById(courseId);
  const { user } = useAuth();
  const { progress, loading } = useProgress(course);

  const passed = progress?.normalPlanesPassed ?? 0;
  const total = progress?.totalNormalPlanes ?? 0;
  const clampedPassed = Math.max(0, Math.min(passed, total || passed));
  const progressPercent = total > 0 ? Math.round((clampedPassed / total) * 100) : 0;
  const completionLabel = loading
    ? "Loading series progress"
    : total > 0
      ? `${clampedPassed} of ${total} series passed`
      : user
        ? "Series progress unavailable"
        : "Sign in to save series passes";

  return (
    <section
      aria-label="Normal MRI mastery progress"
      className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 border-b border-gray-200 pb-3 sm:flex sm:gap-3"
    >
      <p className="shrink-0 text-xs font-semibold text-gray-700">Normal MRI progress</p>
      <p className="min-w-0 text-right text-xs font-medium text-gray-600 sm:order-3 sm:shrink-0">
        {completionLabel}
      </p>
      <div
        role="progressbar"
        aria-label="Normal MRI series mastery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
        aria-valuetext={completionLabel}
        className="col-span-2 h-1.5 min-w-12 overflow-hidden rounded-full bg-gray-200 sm:order-2 sm:flex-1"
      >
        <div
          className="h-full rounded-full bg-ucla-blue transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
}
