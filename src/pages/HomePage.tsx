import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { courseRegistry, coursePath, type CourseDefinition } from "@/content/courses";

/**
 * Landing / course-picker shown on first open (the app's `/` index, rendered
 * inside AppLayout but OUTSIDE the per-course FellowLayout). Pick a region to
 * enter that course's dashboard.
 */
export default function HomePage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {firstName ? `Welcome back, ${firstName}` : "Welcome"}
        </h1>
        <p className="mt-2 text-gray-500">Choose a course to begin — pick up right where you left off.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courseRegistry.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-gray-500">
        UCLA Division of Sports Medicine · MSK MRI Interpretation
      </p>
    </div>
  );
}

const REGION_ACCENT: Record<string, string> = {
  knee: "from-[#003B5C] to-[#2774AE]",
  shoulder: "from-[#2774AE] to-[#0ea5e9]",
  hip: "from-[#155e75] to-[#0891b2]",
};

/** Rough "what am I committing to" estimate from the modules' own minute budgets. */
function estDuration(course: CourseDefinition): string {
  const min = course.modules.reduce((s, m) => s + (m.estimatedMinutes || 0), 0);
  if (min <= 0) return "";
  if (min < 60) return `~${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `~${h}h ${m}m` : `~${h}h`;
}

function CourseCard({ course }: { course: CourseDefinition }) {
  const building = course.status === "building";
  const duration = estDuration(course);
  return (
    <Link
      to={coursePath(course, "/")}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-ucla-blue/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue focus-visible:ring-offset-2"
    >
      <div className={`relative h-24 bg-gradient-to-br ${REGION_ACCENT[course.bodyRegion] ?? REGION_ACCENT.knee}`}>
        <RegionIcon region={course.bodyRegion} />
        {building && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
            Building
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-lg font-bold text-gray-900 group-hover:text-ucla-blue">{course.dashboardTitle}</h2>
        <p className="mt-1.5 flex-1 text-sm text-gray-500">{course.description}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {course.modules.length} modules{duration ? ` · ${duration}` : ""}
        </p>
        <div className="mt-4 inline-flex items-center text-sm font-semibold text-ucla-blue">
          Open course
          <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function RegionIcon({ region }: { region: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-2xl font-black uppercase tracking-[0.2em] text-white/90">{region}</span>
    </div>
  );
}
