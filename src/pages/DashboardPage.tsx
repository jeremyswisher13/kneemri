import { Link } from "react-router-dom";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CompletionBadge from "@/components/ui/CompletionBadge";
import WelcomeGuide from "@/components/ui/WelcomeGuide";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import DailyPearl from "@/components/ui/DailyPearl";
import ReviewSummaryCard from "@/components/ui/ReviewSummaryCard";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import {
  CERTIFICATE_PASS_THRESHOLD,
  hasCompletedRequirements,
  meetsPassThreshold,
  postScorePct,
} from "@/lib/completion";
import {
  courseRegionTitle,
  coursePath,
  courseRegistry,
  coreCasesRequiredForCompletion,
  getVisibleCoreCases,
  hasNormalMriWorkstation,
  normalMriPath,
  normalMriTitle,
} from "@/content/courses";

export default function DashboardPage() {
  const { user, role } = useAuth();
  const activeCourse = useActiveCourse();
  const { progress, loading } = useProgress(activeCourse);
  const isResident = role === 'resident';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ucla-blue border-t-transparent" />
      </div>
    );
  }

  const fellowName = user?.displayName || user?.email || (isResident ? "Resident" : "Fellow");
  const assessmentsEnabled = activeCourse.features.assessments;
  const preAssessmentComplete = assessmentsEnabled
    ? progress?.preQuizCompleted && progress?.preSurveyCompleted
    : true;
  const activeModuleIds = new Set(activeCourse.modules.map((m) => m.id));
  const modulesCompleted = (progress?.moduleProgress ?? []).filter(
    (m) => m.completed && activeModuleIds.has(m.id)
  ).length;
  const totalModules = activeCourse.modules.length;
  // Completion is based on core cases only
  const requiredCases = getVisibleCoreCases(activeCourse, isResident);
  const requiredCaseIds = new Set(requiredCases.map(c => c.id));
  const completedCaseIds = new Set(
    (progress?.caseAttempts?.map((c) => c.caseId) ?? [])
      .filter((id: string) => requiredCaseIds.has(id))
  );
  const casesCompleted = completedCaseIds.size;
  const totalCases = requiredCases.length;
  const postAssessmentAvailable = assessmentsEnabled && !!progress?.postQuizUnlocked;
  const postAssessmentComplete = assessmentsEnabled
    ? progress?.postQuizCompleted && progress?.postSurveyCompleted
    : true;
  const isKnee = activeCourse.bodyRegion === "knee";
  const casesRequired = coreCasesRequiredForCompletion(activeCourse);
  const region = activeCourse.bodyRegion;
  const regionTitle = courseRegionTitle(activeCourse);
  const normalTitle = normalMriTitle(activeCourse);
  const normalPath = normalMriPath(activeCourse);
  const isWorkstationCourse = hasNormalMriWorkstation(activeCourse);
  const workstationImg =
    region === "shoulder"
      ? "/images/teaching/stacks/normal-shoulder-coronal/slice_12.jpg"
      : region === "hip"
        ? "/images/teaching/stacks/normal-hip-coronal/slice_18.jpg"
        : region === "elbow"
          ? "/images/teaching/stacks/normal-elbow-coronal/slice_13.jpg"
          : "/images/teaching/stacks/normal-knee-sagittal/slice_14.jpg";
  // firestore already returns true for genuinely workstation-less courses, so
  // this is course-correct for knee, shoulder, hip, and elbow (all track plane passes).
  const normalMriComplete = !!progress?.normalMriComplete;
  const normalPlanesPassed = progress?.normalPlanesPassed ?? 0;
  const totalNormalPlanes = progress?.totalNormalPlanes ?? 4;
  const requirementsDone = progress ? hasCompletedRequirements(progress, activeCourse) : false;
  const scorePassed = progress ? meetsPassThreshold(progress, activeCourse) : false;
  const courseComplete = requirementsDone && scorePassed;
  const nearMissPct = (progress && postScorePct(progress)) ?? 0;

  return (
    <div>
      {courseComplete && activeCourse.features.certificate && (
        <>
          <CompletionBadge
            fellowName={fellowName}
            courseTitle={activeCourse.shortTitle}
            certificateHref={coursePath(activeCourse, "/certificate")}
          />
          <div className="mb-6 rounded-lg border-2 border-ucla-gold bg-ucla-gold/10 px-6 py-5 text-center">
            <p className="text-lg font-semibold text-[#003B5C]">
              Congratulations! You have completed the course.
            </p>
            <div className="mt-3">
              <Link to={coursePath(activeCourse, "/certificate")}>
                <Button>
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                    View Certificate
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}

      {requirementsDone && !scorePassed && activeCourse.features.certificate && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-6 py-5 text-center">
          <p className="text-sm font-semibold text-amber-800">
            Post-assessment: {nearMissPct}% &mdash; {CERTIFICATE_PASS_THRESHOLD}% needed
            for the certificate
          </p>
          <p className="mt-1 text-sm text-amber-700">
            You've finished every course requirement — you're close. Ask your course
            director to arrange a retake; the modules and review cards stay open for studying.
          </p>
          <div className="mt-3">
            <Link to={coursePath(activeCourse, "/certificate")}>
              <Button size="sm" variant="secondary">View Certificate Status</Button>
            </Link>
          </div>
        </div>
      )}

      {!requirementsDone && assessmentsEnabled && (
        <WelcomeGuide
          course={activeCourse}
          progress={{
            preAssessmentComplete: !!preAssessmentComplete,
            modulesCompleted,
            totalModules,
            casesCompleted,
            totalCases,
            normalMriComplete,
            postAssessmentUnlocked: postAssessmentAvailable,
            postAssessmentComplete: !!postAssessmentComplete,
          }}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {fellowName}
      </h1>
      <p className="mt-1 text-gray-500">
        Track your progress through {activeCourse.dashboardTitle.toLowerCase()}.
      </p>

      {/* Focal point — the interactive Normal MRI workstation is the heart of every course. */}
      {isWorkstationCourse && (
        <Link to={normalPath} className="mt-6 block">
          <div className="flex items-center gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#003B5C] to-[#2774AE] px-6 py-6 text-white shadow-lg transition-shadow hover:shadow-xl sm:px-8">
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center rounded-full bg-ucla-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#003B5C]">
                Start here
              </span>
              <h2 className="mt-3 text-xl font-bold sm:text-2xl">Master the {normalTitle}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100">
                The heart of the course. Scroll a real {region} on a workstation and learn everything
                about reading it — the sequences, every plane, the normal anatomy, the variants you
                shouldn&apos;t over-call, and the measurements that matter — then prove it with the
                knowledge check. Do this first; the modules go deeper.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#2774AE] shadow-sm">
                Open the workstation
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </div>
            <img
              src={workstationImg}
              alt=""
              loading="lazy"
              decoding="async"
              width={160}
              height={160}
              className="hidden h-32 w-32 shrink-0 rounded-xl object-cover ring-2 ring-white/25 sm:block lg:h-40 lg:w-40"
            />
          </div>
        </Link>
      )}

      {/* Daily Pearl + spaced-review summary (all live courses); build banner if still building */}
      {activeCourse.status === "building" ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Course In Development
          </p>
          <p className="mt-1 text-sm text-amber-800">
            This {activeCourse.bodyRegion} MRI course is scoped for {activeCourse.audience} and is still being built out.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <DailyPearl />
          <ReviewSummaryCard />
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {courseRegistry.map((course) => {
          const selected = course.id === activeCourse.id;
          return (
            <Link key={course.id} to={coursePath(course, "/")} className="block">
              <div
                className={`rounded-lg border px-4 py-3 transition-colors ${
                  selected
                    ? "border-ucla-blue bg-ucla-light"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">{course.shortTitle}</p>
                  {course.status === "building" && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                      Build
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">{course.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Continue Where You Left Off CTA */}
      {(() => {
        let ctaText = "";
        let ctaLink = "";

        if (assessmentsEnabled && !preAssessmentComplete) {
          ctaText = "Start Pre-Assessment";
          ctaLink = coursePath(activeCourse, "/pre-assessment");
        } else if (!normalMriComplete) {
          ctaText = `Master the ${normalTitle}`;
          ctaLink = normalPath;
        } else if (modulesCompleted < totalModules) {
          const firstIncomplete = activeCourse.modules.find((mod) => {
            const record = progress?.moduleProgress?.find((m) => m.id === mod.id);
            return !record?.completed;
          });
          ctaText = firstIncomplete
            ? `Continue Module ${firstIncomplete.number}: ${firstIncomplete.title}`
            : "Continue Modules";
          ctaLink = firstIncomplete
            ? coursePath(activeCourse, `/modules/${firstIncomplete.id}`)
            : coursePath(activeCourse, "/modules");
        } else if (casesRequired && casesCompleted < totalCases) {
          // On non-knee courses the core cases are required (they gate the
          // post-assessment unlock and the certificate), so surface them before
          // pointing the learner at the post-assessment.
          ctaText = "Practice with Cases";
          ctaLink = coursePath(activeCourse, "/cases");
        } else if (assessmentsEnabled && !postAssessmentComplete) {
          ctaText = "Take Post-Assessment";
          ctaLink = coursePath(activeCourse, "/post-assessment");
        } else if (activeCourse.features.certificate) {
          ctaText = scorePassed ? "View Your Certificate" : "Review Certificate Status";
          ctaLink = coursePath(activeCourse, "/certificate");
        } else {
          ctaText = "Review Course Progress";
          ctaLink = coursePath(activeCourse, "/progress");
        }

        return (
          <Link to={ctaLink} className="mt-6 block">
            <div className="rounded-lg bg-[#2774AE] px-6 py-4 text-white shadow-md transition-shadow hover:shadow-lg flex items-center justify-between">
              <span className="text-lg font-semibold">{ctaText}</span>
              <svg className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        );
      })()}

      {/* Status Cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {assessmentsEnabled ? (
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
                <Link to={coursePath(activeCourse, "/pre-assessment")}>
                  <Button size="sm">Start Pre-Assessment</Button>
                </Link>
              </div>
            )}
          </Card>
        ) : (
          <Card title="Course Status">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-sm text-gray-600">MVP build</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Assessment instruments will be added after the primary care sports medicine research pass.
            </p>
          </Card>
        )}

        {/* Modules Progress */}
        <Card title="Modules Progress">
          <p className="text-3xl font-bold text-ucla-blue">
            {modulesCompleted}
            <span className="text-base font-normal text-gray-500">
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

        {/* Normal MRI workstation — required & tracked on every workstation course */}
        {totalNormalPlanes > 0 && (
          <Card title={`Normal ${regionTitle} MRI`}>
            <p className="text-3xl font-bold text-ucla-blue">
              {normalPlanesPassed}
              <span className="text-base font-normal text-gray-500">/{totalNormalPlanes}</span>
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-ucla-blue transition-all"
                style={{ width: `${totalNormalPlanes > 0 ? (normalPlanesPassed / totalNormalPlanes) * 100 : 0}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">Planes passed · required</p>
          </Card>
        )}

        {/* Cases — required on non-knee courses (optional on the knee) */}
        {!isKnee && (
          <Card title="Cases">
            <p className="text-3xl font-bold text-ucla-blue">
              {casesCompleted}
              <span className="text-base font-normal text-gray-500">/{totalCases}</span>
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-ucla-gold transition-all"
                style={{ width: `${totalCases > 0 ? (casesCompleted / totalCases) * 100 : 0}%` }}
              />
            </div>
          </Card>
        )}

        {/* Post-Assessment */}
        <Card title={assessmentsEnabled ? "Post-Assessment" : "Assessment Blueprint"}>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex h-2.5 w-2.5 rounded-full ${
                postAssessmentAvailable ? "bg-green-500" : "bg-gray-300"
              }`}
            />
            <span className="text-sm text-gray-600">
              {assessmentsEnabled
                ? postAssessmentAvailable ? "Available" : "Locked"
                : "Planned"}
            </span>
          </div>
          {!postAssessmentAvailable && assessmentsEnabled && (
            <p className="mt-2 text-xs text-gray-500">
              {isKnee
                ? `Complete all modules and the ${normalTitle} to unlock.`
                : `Complete all modules, cases, and the ${normalTitle} to unlock.`}
            </p>
          )}
          {!assessmentsEnabled && (
            <p className="mt-2 text-xs text-gray-500">
              Pre/post quiz and confidence survey are intentionally not wired yet.
            </p>
          )}
        </Card>
      </div>

      {isKnee && (
        <Link
          to={coursePath(activeCourse, "/cases")}
          className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100"
        >
          <span className="text-sm text-gray-600">
            <span className="font-medium text-gray-800">Cases</span> — optional deep-dive practice (
            {casesCompleted}/{totalCases} reviewed)
          </span>
          <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      )}

      {/* Time Remaining Estimate — modules only, shorter for residents */}
      {(() => {
        const remainingModules = totalModules - modulesCompleted;
        const minutesPerModule = isResident ? 10 : 15;
        const moduleMinutes = remainingModules * minutesPerModule;
        if (moduleMinutes <= 0) return null;
        const formatTime = (min: number) => {
          if (min >= 60) {
            const hours = Math.floor(min / 60);
            const mins = min % 60;
            return mins > 0 ? `~${hours}h ${mins}m` : `~${hours}h`;
          }
          return `~${min} min`;
        };
        return (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Estimated module time remaining: {formatTime(moduleMinutes)}</span>
          </div>
        );
      })()}
    </div>
  );
}
