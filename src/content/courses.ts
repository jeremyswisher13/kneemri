import { kneeModuleMetas, shoulderModuleMetas, hipModuleMetas, elbowModuleMetas, type ModuleMeta } from "@/content/module-metas";
import { kneeCaseMetas, shoulderCaseMetas, hipCaseMetas, elbowCaseMetas, type CaseMeta } from "@/content/case-metas";
import { searchPatternSteps as kneeSearchPatternSteps } from "@/content/search-pattern";
import type { SearchPatternStep, QuizQuestion, ConfidenceStatement } from "@/types/content";
import { prePostQuizQuestions as kneePrePostQuizQuestions } from "@/content/quizzes/pre-post-quiz";
import { confidenceStatements as kneeConfidenceStatements } from "@/content/quizzes/confidence-survey";
import { shoulderSearchPatternSteps } from "@/content/shoulder/search-pattern";
import { shoulderPrePostQuizQuestions } from "@/content/shoulder/pre-post-quiz";
import { shoulderConfidenceStatements } from "@/content/shoulder/confidence-survey";
import { hipSearchPatternSteps } from "@/content/hip/search-pattern";
import { hipPrePostQuizQuestions } from "@/content/hip/pre-post-quiz";
import { hipConfidenceStatements } from "@/content/hip/confidence-survey";
import { elbowSearchPatternSteps } from "@/content/elbow/search-pattern";
import { elbowPrePostQuizQuestions } from "@/content/elbow/pre-post-quiz";
import { elbowConfidenceStatements } from "@/content/elbow/confidence-survey";

export type CourseId = "knee-mri" | "shoulder-mri" | "hip-mri" | "elbow-mri";

export interface CourseDefinition {
  id: CourseId;
  title: string;
  shortTitle: string;
  dashboardTitle: string;
  description: string;
  audience: string;
  bodyRegion: "knee" | "shoulder" | "hip" | "elbow";
  status: "live" | "building";
  modules: ModuleMeta[];
  cases: CaseMeta[];
  coreCases: CaseMeta[];
  advancedCases: CaseMeta[];
  searchPatternSteps: SearchPatternStep[];
  /** Pre/post knowledge assessment instrument for this course. */
  prePostQuizQuestions: QuizQuestion[];
  /** Confidence / self-efficacy survey statements for this course. */
  confidenceStatements: ConfidenceStatement[];
  features: {
    assessments: boolean;
    certificate: boolean;
    reviewCards: boolean;
    reference: boolean;
  };
}

export const courseRegistry: CourseDefinition[] = [
  {
    id: "knee-mri",
    title: "UCLA Knee MRI Interpretation Course",
    shortTitle: "Knee MRI",
    dashboardTitle: "Knee MRI Interpretation",
    description:
      "A systematic knee MRI interpretation curriculum for sports medicine fellows and orthopaedic residents.",
    audience: "Sports medicine fellows and orthopaedic residents",
    bodyRegion: "knee",
    status: "live",
    modules: kneeModuleMetas,
    cases: kneeCaseMetas,
    coreCases: kneeCaseMetas.filter((c) => c.tier === "core"),
    advancedCases: kneeCaseMetas.filter((c) => c.tier === "advanced"),
    searchPatternSteps: kneeSearchPatternSteps,
    prePostQuizQuestions: kneePrePostQuizQuestions,
    confidenceStatements: kneeConfidenceStatements,
    features: {
      assessments: true,
      certificate: true,
      reviewCards: true,
      reference: true,
    },
  },
  {
    id: "shoulder-mri",
    title: "Shoulder MRI for Primary Care Sports Medicine",
    shortTitle: "Shoulder MRI",
    dashboardTitle: "Shoulder MRI Interpretation",
    description:
      "A primary care sports medicine shoulder MRI course focused on management-changing interpretation: cuff, labrum, biceps, capsule, arthritis, and red flags.",
    audience: "Primary care sports medicine fellows",
    bodyRegion: "shoulder",
    status: "live",
    modules: shoulderModuleMetas,
    cases: shoulderCaseMetas,
    coreCases: shoulderCaseMetas.filter((c) => c.tier === "core"),
    advancedCases: shoulderCaseMetas.filter((c) => c.tier === "advanced"),
    searchPatternSteps: shoulderSearchPatternSteps,
    prePostQuizQuestions: shoulderPrePostQuizQuestions,
    confidenceStatements: shoulderConfidenceStatements,
    features: {
      // Live: modules, cases, search pattern, pre/post assessment, confidence
      // survey, certificate, reference, and spaced-review flashcards (shoulder
      // module quizzes feed the SM-2 review, course-scoped by courseId).
      assessments: true,
      certificate: true,
      reviewCards: true,
      reference: true,
    },
  },
  {
    id: "hip-mri",
    title: "Hip MRI for Primary Care Sports Medicine",
    shortTitle: "Hip MRI",
    dashboardTitle: "Hip MRI Interpretation",
    description:
      "A primary care sports medicine hip MRI course focused on management-changing interpretation: FAI and the labrum, cartilage, femoral-neck stress fracture and AVN, the abductor/hamstring/iliopsoas/adductor tendons, athletic pubalgia, and red flags.",
    audience: "Primary care sports medicine fellows",
    bodyRegion: "hip",
    status: "live",
    modules: hipModuleMetas,
    cases: hipCaseMetas,
    coreCases: hipCaseMetas.filter((c) => c.tier === "core"),
    advancedCases: hipCaseMetas.filter((c) => c.tier === "advanced"),
    searchPatternSteps: hipSearchPatternSteps,
    prePostQuizQuestions: hipPrePostQuizQuestions,
    confidenceStatements: hipConfidenceStatements,
    features: {
      // Live: modules, cases, search pattern, pre/post assessment, confidence
      // survey, certificate, and spaced-review flashcards. Reference page and the
      // (Workstation + Quick Reference are now authored and live.)
      assessments: true,
      certificate: true,
      reviewCards: true,
      reference: true,
    },
  },
  {
    id: "elbow-mri",
    title: "Elbow MRI for Primary Care Sports Medicine",
    shortTitle: "Elbow MRI",
    dashboardTitle: "Elbow MRI Interpretation",
    description:
      "A primary care sports medicine elbow MRI course focused on management-changing interpretation: the thrower's elbow (UCL valgus overload, capitellar OCD, ulnar neuritis, olecranon stress), the LCL complex and posterolateral rotatory instability, the coronoid/anteromedial-facet axis, the distal biceps and triceps, lateral and medial epicondylitis, the three nerves, and don't-miss findings.",
    audience: "Primary care sports medicine fellows",
    bodyRegion: "elbow",
    // Live: modules, cases, matched-parallel pre/post quiz, confidence survey,
    // reference, red flags, and the 3-plane interactive workstation are all
    // authored, MSK-verified, and wired. Workstation anatomy markers are starter
    // coordinates pending radiologist fine-tuning via the admin Adjust tool.
    status: "live",
    modules: elbowModuleMetas,
    cases: elbowCaseMetas,
    coreCases: elbowCaseMetas.filter((c) => c.tier === "core"),
    advancedCases: elbowCaseMetas.filter((c) => c.tier === "advanced"),
    searchPatternSteps: elbowSearchPatternSteps,
    prePostQuizQuestions: elbowPrePostQuizQuestions,
    confidenceStatements: elbowConfidenceStatements,
    features: {
      assessments: true,
      certificate: true,
      reviewCards: true,
      reference: true,
    },
  },
];

export const defaultCourse = courseRegistry[0];

/**
 * The course that owns legacy Firestore documents written before multi-course
 * support — those carry no `courseId` field. Pinned explicitly to the knee
 * course (the original, in-production course), NOT to `defaultCourse`, so that
 * reordering `courseRegistry` can never silently reattribute production knee
 * progress/review data to another course.
 */
export const LEGACY_DEFAULT_COURSE_ID: CourseId = "knee-mri";

export function getCourseById(courseId: string | undefined): CourseDefinition {
  return courseRegistry.find((course) => course.id === courseId) ?? defaultCourse;
}

export function courseRegionTitle(course: CourseDefinition): string {
  return course.bodyRegion.charAt(0).toUpperCase() + course.bodyRegion.slice(1);
}

export function normalMriTitle(course: CourseDefinition): string {
  return `Normal ${courseRegionTitle(course)} MRI`;
}

export function interactiveNormalMriTitle(course: CourseDefinition): string {
  return `Interactive ${normalMriTitle(course)}`;
}

export function hasNormalMriWorkstation(course: CourseDefinition): boolean {
  return ["knee", "shoulder", "hip", "elbow"].includes(course.bodyRegion);
}

export function coreCasesRequiredForCompletion(course: CourseDefinition): boolean {
  return course.bodyRegion !== "knee";
}

// Every course is reached under its own `/courses/:id` namespace now that the
// app opens on a course-picker home page at `/`. (The old root paths like
// `/modules` are kept as backward-compatible aliases for the knee course in
// App.tsx, but the app no longer GENERATES them.)
export function getCourseBasePath(course: CourseDefinition): string {
  return `/courses/${course.id}`;
}

export function coursePath(course: CourseDefinition, path = "/"): string {
  const base = getCourseBasePath(course);
  if (path === "/" || path === "") return base || "/";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function normalMriPath(course: CourseDefinition): string {
  return coursePath(course, `/normal-${course.bodyRegion}-mri`);
}

export function getVisibleCoreCases(course: CourseDefinition, isResident: boolean): CaseMeta[] {
  return isResident ? course.coreCases.filter((c) => c.residentVisible) : course.coreCases;
}

export function getVisibleAdvancedCases(course: CourseDefinition, isResident: boolean): CaseMeta[] {
  return isResident ? course.advancedCases.filter((c) => c.residentVisible) : course.advancedCases;
}

/** The subset of items administered on the PRE quiz for a course. */
export function getPreQuizQuestions(course: CourseDefinition): QuizQuestion[] {
  return course.prePostQuizQuestions.filter(
    (q) =>
      q.prePostMapping === "identical" ||
      q.prePostMapping === "parallel-pre" ||
      q.prePostMapping === "pre-only",
  );
}

/** The subset of items administered on the POST quiz for a course. */
export function getPostQuizQuestions(course: CourseDefinition): QuizQuestion[] {
  return course.prePostQuizQuestions.filter(
    (q) =>
      q.prePostMapping === "identical" ||
      q.prePostMapping === "parallel-post" ||
      q.prePostMapping === "post-only",
  );
}
