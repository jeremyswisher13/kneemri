import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  courseRegistry,
  coursePath,
  type CourseDefinition,
} from "@/content/courses";
import { courseRegionAccent } from "@/lib/course-visuals";
import {
  readLearnerResume,
  shouldResumeHomeScreenLaunch,
  suggestedNextStep,
  type LearnerResumeState,
} from "@/lib/learner-resume";
import InstallPrompt from "@/components/ui/InstallPrompt";
import PageLoader from "@/components/ui/PageLoader";

/**
 * Landing / course-picker shown on first open (the app's `/` index, rendered
 * inside AppLayout but OUTSIDE the per-course FellowLayout). Pick a region to
 * enter that course's dashboard.
 */
export default function HomePage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const firstName = user?.displayName?.split(" ")[0];
  const [resume] = useState<LearnerResumeState | null>(() =>
    typeof localStorage === "undefined" ? null : readLearnerResume(),
  );
  const shouldAutoResume = shouldResumeHomeScreenLaunch(location.search, resume);

  useEffect(() => {
    if (shouldAutoResume && resume) {
      navigate(resume.path, { replace: true });
    }
  }, [navigate, resume, shouldAutoResume]);

  if (shouldAutoResume) {
    return <PageLoader fullHeight label="Opening your last MRI course..." />;
  }

  return (
    /* ORDER MATTERS HERE. This page's whole job is "choose a course", but the
       picker used to sit behind a full-height start card, the suggested-sequence
       chips and the install banner — on a 375x812 phone the first course card
       began at y≈912, i.e. entirely below the fold. Now: the one thing a
       returning fellow wants (resume) or a slim nudge for a new one, then the
       picker itself, and only then the generic supporting content. */
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-14">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {firstName ? `Welcome back, ${firstName}` : "Welcome"}
        </h1>
        <p className="mt-2 text-gray-500">
          {resume
            ? "Pick up where you left off, or choose another course."
            : "Choose a course to begin."}
        </p>
      </div>

      {/* Returning learner: the fastest path back in. */}
      {resume && (
        <div className="mb-6">
          <ResumePanel resume={resume} />
        </div>
      )}

      {/* New learner: a one-line nudge instead of a full card, so the picker
          still lands in the first screen. */}
      {!resume && <BaselineBanner />}

      {/* PRIMARY ACTION — the picker the heading promises. */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {courseRegistry.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Supporting content — useful, but never ahead of the picker. */}
      <div className="mt-8 space-y-4">
        <RecommendedPath />
        <InstallPrompt />
      </div>

      <p className="mt-10 text-center text-xs text-gray-500">
        UCLA Division of Sports Medicine · MSK MRI Interpretation
      </p>
    </div>
  );
}

/**
 * Slim first-run nudge toward the baseline assessment. Deliberately NOT a full
 * card: this is guidance, and it must not push the course picker off-screen.
 */
function BaselineBanner() {
  const firstCourse = courseRegistry[0];
  return (
    <Link
      to={coursePath(firstCourse, "/pre-assessment")}
      className="mb-6 flex min-h-11 items-center justify-between gap-3 rounded-xl border border-ucla-blue/25 bg-ucla-light/50 px-4 py-3 transition-colors hover:bg-ucla-light focus:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue focus-visible:ring-offset-2"
    >
      <span className="min-w-0 text-sm text-gray-700">
        <span className="font-semibold text-ucla-dark">New here?</span> Capture your baseline first —
        a short quiz and confidence survey.
      </span>
      <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ucla-blue">
        Start
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </span>
    </Link>
  );
}

/** Only rendered when a resume actually exists — the caller handles the empty case. */
function ResumePanel({ resume }: { resume: LearnerResumeState }) {
  return (
    <section className="rounded-xl border border-ucla-blue/20 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">Resume</p>
        <h2 className="mt-1.5 text-lg font-bold text-gray-900">{resume.title}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {[resume.courseTitle, resume.modeLabel, resume.seriesLabel].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1.5 text-xs font-medium text-gray-500">{suggestedNextStep(resume.modeLabel)}</p>
      </div>
      <Link
        to={resume.path}
        className="mt-4 inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-lg bg-ucla-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ucla-dark sm:mt-0 sm:w-auto"
      >
        Continue learning
      </Link>
    </section>
  );
}

function RecommendedPath() {
  const steps = ["Explore", "Guided Tour", "Practice & Mastery", "Cross-Plane", "Image CAQ"];
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Suggested sequence</p>
      <h2 className="mt-2 text-lg font-bold text-gray-900">A simple path through each workstation</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <span
            key={step}
            className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
          >
            {index + 1}. {step}
          </span>
        ))}
      </div>
    </section>
  );
}

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
      aria-label={`Open ${course.dashboardTitle}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-ucla-blue/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue focus-visible:ring-offset-2"
    >
      {/* Shorter accent band + tighter padding on phones so more of the picker
          fits in the first screen; full size returns at sm+. */}
      <div className={`relative h-16 bg-gradient-to-br sm:h-24 ${courseRegionAccent(course.bodyRegion)}`}>
        <RegionIcon region={course.bodyRegion} />
        {building && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
            Building
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h2 className="text-lg font-bold text-gray-900 group-hover:text-ucla-blue">{course.dashboardTitle}</h2>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-gray-500 sm:line-clamp-none">{course.description}</p>
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {course.modules.length} modules{duration ? ` · ${duration}` : ""}
        </p>
        <div className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-ucla-blue">
          Open {course.shortTitle}
          <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
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
