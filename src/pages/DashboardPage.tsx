import { Link } from "react-router-dom";
import CompletionBadge from "@/components/ui/CompletionBadge";
import DailyPearl from "@/components/ui/DailyPearl";
import ReviewSummaryCard from "@/components/ui/ReviewSummaryCard";
import WelcomeGuide from "@/components/ui/WelcomeGuide";
import {
  buildStepData,
  getStepStatuses,
  type StepKind,
  type WelcomeGuideProgress,
} from "@/components/ui/welcome-guide-logic";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import {
  CERTIFICATE_PASS_THRESHOLD,
  hasCompletedRequirements,
  meetsPassThreshold,
  postScorePct,
} from "@/lib/completion";
import {
  coursePath,
  getVisibleCoreCases,
  normalMriPath,
  normalMriTitle,
  requiredCoreCaseCount,
} from "@/content/courses";

interface NextAction {
  kind: StepKind | "certificate";
  title: string;
  description: string;
  label: string;
  href: string;
  stepNumber?: number;
  stepCount: number;
}

export default function DashboardPage() {
  const { user, role } = useAuth();
  const activeCourse = useActiveCourse();
  const { progress, loading } = useProgress(activeCourse);
  const isResident = role === "resident";

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
    ? !!(progress?.preQuizCompleted && progress?.preSurveyCompleted)
    : true;
  const postAssessmentComplete = assessmentsEnabled
    ? !!(progress?.postQuizCompleted && progress?.postSurveyCompleted)
    : true;

  const activeModuleIds = new Set(activeCourse.modules.map((module) => module.id));
  const modulesCompleted = (progress?.moduleProgress ?? []).filter(
    (module) => module.completed && activeModuleIds.has(module.id),
  ).length;
  const totalModules = activeCourse.modules.length;

  const visibleCoreCases = getVisibleCoreCases(activeCourse, isResident);
  const visibleCoreCaseIds = new Set(visibleCoreCases.map((caseItem) => caseItem.id));
  const completedCoreCaseIds = new Set(
    (progress?.caseAttempts ?? [])
      .map((attempt) => attempt.caseId)
      .filter((caseId) => visibleCoreCaseIds.has(caseId)),
  );
  const casesCompleted = completedCoreCaseIds.size;
  const requiredCases = requiredCoreCaseCount(activeCourse, isResident);

  const normalTitle = normalMriTitle(activeCourse);
  const normalPath = normalMriPath(activeCourse);
  const normalMriComplete = !!progress?.normalMriComplete;
  const guideProgress: WelcomeGuideProgress = {
    preAssessmentComplete,
    modulesCompleted,
    totalModules,
    casesCompleted,
    totalCases: requiredCases,
    normalMriComplete,
    postAssessmentUnlocked: !!progress?.postQuizUnlocked,
    postAssessmentComplete,
  };

  const curriculumSteps = buildStepData(activeCourse);
  const stepStatuses = getStepStatuses(curriculumSteps, guideProgress);
  const currentStepIndex = stepStatuses.findIndex((status) => status === "current");
  const currentStep = currentStepIndex >= 0 ? curriculumSteps[currentStepIndex] : null;
  const firstIncompleteModule = activeCourse.modules.find((module) => {
    const record = progress?.moduleProgress?.find((item) => item.id === module.id);
    return !record?.completed;
  });

  const requirementsDone = progress ? hasCompletedRequirements(progress, activeCourse) : false;
  const scorePassed = progress ? meetsPassThreshold(progress, activeCourse) : false;
  const courseComplete = requirementsDone && scorePassed;
  const nearMissPct = (progress && postScorePct(progress)) ?? 0;
  const nextAction = buildNextAction({
    activeCourse,
    currentStep,
    currentStepIndex,
    stepCount: curriculumSteps.length,
    firstIncompleteModule,
    modulesCompleted,
    totalModules,
    casesCompleted,
    requiredCases,
    normalTitle,
    normalPath,
    courseComplete,
    scorePassed,
  });

  const workstationImg =
    activeCourse.bodyRegion === "shoulder"
      ? "/images/teaching/stacks/normal-shoulder-coronal/slice_12.jpg"
      : activeCourse.bodyRegion === "hip"
        ? "/images/teaching/stacks/normal-hip-coronal/slice_18.jpg"
        : activeCourse.bodyRegion === "elbow"
          ? "/images/teaching/stacks/normal-elbow-coronal/slice_13.jpg"
          : "/images/teaching/stacks/normal-knee-sagittal/slice_14.jpg";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome back, {fellowName}</h1>
      <p className="mt-1 text-gray-500">{activeCourse.dashboardTitle}</p>

      {courseComplete && activeCourse.features.certificate ? (
        <div className="mt-6">
          <CompletionBadge
            fellowName={fellowName}
            courseTitle={activeCourse.shortTitle}
            certificateHref={coursePath(activeCourse, "/certificate")}
          />
        </div>
      ) : (
        <>
          {requirementsDone && !scorePassed && activeCourse.features.certificate && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-800">
                Post-assessment: {nearMissPct}% &middot; {CERTIFICATE_PASS_THRESHOLD}% needed for the certificate
              </p>
              <p className="mt-1 text-sm text-amber-700">
                Every activity is complete. Review your missed concepts and ask the course director to arrange a retake.
              </p>
            </div>
          )}

          <section
            aria-labelledby="next-action-title"
            className="mt-6 overflow-hidden rounded-lg border border-ucla-blue/30 bg-white shadow-sm"
          >
            <div className="flex min-h-[13rem]">
              <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-5 sm:px-6">
                <p className="text-xs font-bold uppercase tracking-wide text-ucla-blue">
                  {nextAction.stepNumber
                    ? `Next up | Step ${nextAction.stepNumber} of ${nextAction.stepCount}`
                    : "Next up"}
                </p>
                <h2 id="next-action-title" className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  {nextAction.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{nextAction.description}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Link
                    to={nextAction.href}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ucla-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ucla-dark focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2"
                  >
                    {nextAction.label}
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <Link to={coursePath(activeCourse, "/progress")} className="text-sm font-semibold text-ucla-blue hover:underline">
                    Detailed progress
                  </Link>
                </div>
              </div>

              {nextAction.kind === "normal" && (
                <img
                  src={workstationImg}
                  alt={`Normal ${activeCourse.bodyRegion} MRI preview`}
                  width={256}
                  height={256}
                  decoding="async"
                  className="hidden w-52 shrink-0 object-cover sm:block lg:w-64"
                />
              )}
            </div>
          </section>
        </>
      )}

      <WelcomeGuide course={activeCourse} progress={guideProgress} />

      {activeCourse.status === "building" ? (
        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-semibold text-amber-800">Course in development</p>
          <p className="mt-1 text-sm text-amber-700">
            This {activeCourse.bodyRegion} MRI course is still being built for {activeCourse.audience}.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
          <DailyPearl />
          <ReviewSummaryCard />
        </div>
      )}
    </div>
  );
}

function buildNextAction({
  activeCourse,
  currentStep,
  currentStepIndex,
  stepCount,
  firstIncompleteModule,
  modulesCompleted,
  totalModules,
  casesCompleted,
  requiredCases,
  normalTitle,
  normalPath,
  courseComplete,
  scorePassed,
}: {
  activeCourse: ReturnType<typeof useActiveCourse>;
  currentStep: ReturnType<typeof buildStepData>[number] | null;
  currentStepIndex: number;
  stepCount: number;
  firstIncompleteModule: ReturnType<typeof useActiveCourse>["modules"][number] | undefined;
  modulesCompleted: number;
  totalModules: number;
  casesCompleted: number;
  requiredCases: number;
  normalTitle: string;
  normalPath: string;
  courseComplete: boolean;
  scorePassed: boolean;
}): NextAction {
  const stepNumber = currentStepIndex >= 0 ? currentStepIndex + 1 : undefined;

  switch (currentStep?.kind) {
    case "pre":
      return {
        kind: "pre",
        title: "Capture your baseline",
        description: "Complete the knowledge quiz and confidence survey before opening the teaching content, so your growth is measured cleanly.",
        label: "Start Pre-Assessment",
        href: coursePath(activeCourse, "/pre-assessment"),
        stepNumber,
        stepCount,
      };
    case "normal":
      return {
        kind: "normal",
        title: `Master the ${normalTitle}`,
        description: "Explore each series, follow the guided landmarks, practice with immediate feedback, and pass the blinded Mastery Check on every plane.",
        label: "Open Normal MRI",
        href: normalPath,
        stepNumber,
        stepCount,
      };
    case "modules":
      return {
        kind: "modules",
        title: firstIncompleteModule
          ? `Module ${firstIncompleteModule.number}: ${firstIncompleteModule.title}`
          : "Continue the modules",
        description: `${modulesCompleted} of ${totalModules} modules complete. Build the systematic search pattern and management-changing interpretation skills next.`,
        label: firstIncompleteModule ? "Continue Module" : "View Modules",
        href: firstIncompleteModule
          ? coursePath(activeCourse, `/modules/${firstIncompleteModule.id}`)
          : coursePath(activeCourse, "/modules"),
        stepNumber,
        stepCount,
      };
    case "cases": {
      const remaining = Math.max(0, requiredCases - casesCompleted);
      return {
        kind: "cases",
        title: `Complete ${remaining} more core ${remaining === 1 ? "case" : "cases"}`,
        description: `Choose any ${requiredCases} core cases, commit to a structured read, and compare it with the expert interpretation. Additional cases remain optional practice.`,
        label: "Choose a Case",
        href: coursePath(activeCourse, "/cases"),
        stepNumber,
        stepCount,
      };
    }
    case "post":
      return {
        kind: "post",
        title: "Measure your growth",
        description: "Complete the post-course knowledge quiz and confidence survey to close the learning loop and determine certificate eligibility.",
        label: "Take Post-Assessment",
        href: coursePath(activeCourse, "/post-assessment"),
        stepNumber,
        stepCount,
      };
    default:
      return {
        kind: "certificate",
        title: courseComplete ? "Course complete" : "Review certificate status",
        description: scorePassed
          ? "Your course requirements are complete."
          : `A post-assessment score of ${CERTIFICATE_PASS_THRESHOLD}% or higher is required for the certificate.`,
        label: courseComplete ? "View Certificate" : "Certificate Status",
        href: coursePath(activeCourse, "/certificate"),
        stepCount,
      };
  }
}
