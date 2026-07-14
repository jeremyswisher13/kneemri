import {
  coursePath,
  hasNormalMriWorkstation,
  normalMriPath,
  normalMriTitle,
  requiredCoreCaseCount,
  type CourseDefinition,
} from "@/content/courses";

/**
 * Pure step/status logic for the WelcomeGuide, extracted from the component so
 * the order-driven progression (which has been bug-prone) is unit-testable.
 * The component supplies the per-step icons by `kind`.
 */

export interface WelcomeGuideProgress {
  preAssessmentComplete: boolean;
  modulesCompleted: number;
  totalModules: number;
  casesCompleted: number;
  totalCases: number;
  normalMriComplete: boolean;
  postAssessmentUnlocked: boolean;
  postAssessmentComplete: boolean;
}

export type StepStatus = "complete" | "current" | "future";
export type StepKind = "pre" | "normal" | "modules" | "cases" | "post";

export interface WelcomeStep {
  kind: StepKind;
  title: string;
  description: string;
  link: string;
  linkLabel: string;
}

export function stepDone(kind: StepKind, p: WelcomeGuideProgress): boolean {
  switch (kind) {
    case "pre":
      return p.preAssessmentComplete;
    case "normal":
      return p.normalMriComplete;
    case "modules":
      return p.modulesCompleted >= p.totalModules;
    case "cases":
      return p.casesCompleted >= p.totalCases;
    case "post":
      return p.postAssessmentComplete;
  }
}

// Status is order-driven: the first not-done step is "current", earlier are
// "complete", later are "future". This lets each region order its steps freely.
export function getStepStatuses(steps: { kind: StepKind }[], p: WelcomeGuideProgress): StepStatus[] {
  let currentAssigned = false;
  return steps.map((s) => {
    if (stepDone(s.kind, p)) return "complete";
    if (!currentAssigned) {
      currentAssigned = true;
      return "current";
    }
    return "future";
  });
}

export function getStepSubtext(
  kind: StepKind,
  status: StepStatus,
  p: WelcomeGuideProgress,
): string | null {
  if (status === "complete") return "Complete";
  if (status === "future") return null;
  switch (kind) {
    case "pre":
      return "Begin with the baseline";
    case "normal":
      return "Pass the Mastery Check on every plane";
    case "modules":
      return `${p.modulesCompleted}/${p.totalModules} modules`;
    case "cases":
      return `${Math.min(p.casesCompleted, p.totalCases)}/${p.totalCases} required cases`;
    case "post":
      return p.postAssessmentUnlocked ? "Ready to take" : "Complete the earlier steps to unlock";
  }
}

export function buildStepData(course: CourseDefinition): WelcomeStep[] {
  const moduleCount = course.modules.length;
  const stepCount = course.searchPatternSteps.length;
  const requiredCases = requiredCoreCaseCount(course);

  const pre: WelcomeStep = {
    kind: "pre",
    title: "Pre-Assessment",
    description:
      "Take a baseline knowledge quiz and confidence survey so we can measure your growth.",
    link: coursePath(course, "/pre-assessment"),
    linkLabel: "Start Pre-Assessment",
  };
  const region = course.bodyRegion;
  const normalTitle = normalMriTitle(course);
  const normal: WelcomeStep = {
    kind: "normal",
    title: `Master the ${normalTitle}`,
    description: `Scroll a real normal ${region} MRI, take the guided tour, practice with feedback, then pass the blinded Mastery Check on each plane.`,
    link: normalMriPath(course),
    linkLabel: "Open the workstation",
  };
  const modules: WelcomeStep = {
    kind: "modules",
    title: "Deepen it with the Modules",
    description: `Then work through ${moduleCount} modules and the ${stepCount}-step search pattern to go deeper on each structure.`,
    link: coursePath(course, "/modules"),
    linkLabel: "View Modules",
  };
  const cases: WelcomeStep = {
    kind: "cases",
    title: `Complete ${requiredCases} Core Cases`,
    description: `Apply the ${stepCount}-step search to any ${requiredCases} core cases and compare your read with the expert interpretation.`,
    link: coursePath(course, "/cases"),
    linkLabel: "View Cases",
  };
  const post: WelcomeStep = {
    kind: "post",
    title: "Post-Assessment",
    description: `After the ${normalTitle}, all modules, and ${requiredCases} core cases, measure your improvement.`,
    link: coursePath(course, "/post-assessment"),
    linkLabel: "View Post-Assessment",
  };

  // Every course follows one sequence: baseline, normal workstation, modules,
  // a bounded case milestone, then the post-assessment.
  const hasWorkstation = hasNormalMriWorkstation(course);
  const steps: WelcomeStep[] = [pre];
  if (hasWorkstation) steps.push(normal);
  steps.push(modules);
  steps.push(cases);
  steps.push(post);
  return steps;
}
