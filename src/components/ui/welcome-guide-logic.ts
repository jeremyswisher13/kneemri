import { coursePath, type CourseDefinition } from "@/content/courses";

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
      return "Start here";
    case "normal":
      return "Pass the knowledge check on every plane";
    case "modules":
      return `Continue with Module ${p.modulesCompleted + 1}`;
    case "cases":
      return `${p.casesCompleted}/${p.totalCases} cases`;
    case "post":
      return p.postAssessmentUnlocked ? "Ready to take" : "Waiting for instructor to unlock";
  }
}

export function buildStepData(course: CourseDefinition): WelcomeStep[] {
  const moduleCount = course.modules.length;
  const stepCount = course.searchPatternSteps.length;
  const isKnee = course.bodyRegion === "knee";

  const pre: WelcomeStep = {
    kind: "pre",
    title: "Pre-Assessment",
    description:
      "Take a baseline knowledge quiz and confidence survey so we can measure your growth.",
    link: coursePath(course, "/pre-assessment"),
    linkLabel: "Start Pre-Assessment",
  };
  const region = course.bodyRegion;
  const regionTitle = region.charAt(0).toUpperCase() + region.slice(1);
  const normal: WelcomeStep = {
    kind: "normal",
    title: `Master the Normal ${regionTitle} MRI`,
    description: `The heart of the course — scroll a real normal ${region} MRI like a workstation, take the guided tour, then prove it with the knowledge check on each plane.`,
    link: coursePath(course, `/normal-${region}-mri`),
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
    title: "Practice with Cases",
    description: `Apply your pattern to interactive cases using the ${stepCount}-step search and compare to the expert read.`,
    link: coursePath(course, "/cases"),
    linkLabel: "View Cases",
  };
  const post: WelcomeStep = {
    kind: "post",
    title: "Post-Assessment",
    description: isKnee
      ? "After the Normal Knee MRI and the modules, the post-assessment unlocks so you can measure your improvement."
      : "After completing all modules and cases, the post-assessment unlocks so you can measure your improvement.",
    link: coursePath(course, "/post-assessment"),
    linkLabel: "View Post-Assessment",
  };

  // The Normal-MRI workstation is the primary focus, placed before the modules —
  // but only courses whose bodyRegion has a workstation (knee, shoulder) include
  // it. Knee: cases are optional (omitted). Shoulder/hip: cases are required.
  const hasWorkstation =
    course.bodyRegion === "knee" ||
    course.bodyRegion === "shoulder" ||
    course.bodyRegion === "hip";
  const steps: WelcomeStep[] = [pre];
  if (hasWorkstation) steps.push(normal);
  steps.push(modules);
  if (!isKnee) steps.push(cases);
  steps.push(post);
  return steps;
}
