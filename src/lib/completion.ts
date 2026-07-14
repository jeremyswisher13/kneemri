import { requiredCoreCaseCount, type CourseDefinition } from "@/content/courses";
import type { UserProgress } from "@/types/progress";

/** Minimum post-assessment score (rounded percent) required for the certificate. */
export const CERTIFICATE_PASS_THRESHOLD = 70;

/**
 * Post-quiz score as a rounded percent, or null when the quiz hasn't been
 * taken (or the attempt has no usable score/total).
 */
export function postScorePct(p: UserProgress): number | null {
  if (p.postQuizScore == null || p.postQuizTotal == null || p.postQuizTotal <= 0) {
    return null;
  }
  return Math.round((p.postQuizScore / p.postQuizTotal) * 100);
}

/**
 * Whether the post-assessment score clears CERTIFICATE_PASS_THRESHOLD.
 * Compares the same rounded percent the UI displays so the gate and the
 * on-screen number always agree. Courses without assessment instruments
 * have no score to gate on.
 */
export function meetsPassThreshold(p: UserProgress, course: CourseDefinition): boolean {
  if (!course.features.assessments) return true;
  const pct = postScorePct(p);
  return pct != null && pct >= CERTIFICATE_PASS_THRESHOLD;
}

/**
 * All activity requirements, WITHOUT the post-assessment pass threshold.
 *
 * Required: pre-assessment (quiz + survey) · the Interactive Normal MRI
 * workstation (EVERY course that has one — knee, shoulder, hip, elbow) · all
 * modules · any three role-visible core cases · post-assessment (quiz + survey).
 *
 * Gating on `p.normalMriComplete` DIRECTLY (not `!isKnee || …`) is both safe and
 * correct: getUserProgress already sets normalMriComplete = true for any course
 * with no workstation, and gating it here no longer depends on the post-quiz
 * unlock transitivity — which an admin "unlock post-assessment" override can
 * otherwise bypass, letting a non-knee learner reach the certificate with the
 * workstation incomplete.
 */
export function hasCompletedRequirements(p: UserProgress, course: CourseDefinition): boolean {
  const assessments = course.features.assessments;
  // When a course has no assessment instruments wired, pre/post aren't gating.
  const preDone = !assessments || (p.preQuizCompleted && p.preSurveyCompleted);
  const postDone = !assessments || (p.postQuizCompleted && p.postSurveyCompleted);
  const modulesDone = p.modulesCompleted >= p.totalModules;
  const normalDone = p.normalMriComplete;
  const requiredCases = p.requiredCases ?? requiredCoreCaseCount(course);
  const casesDone = p.casesCompleted >= requiredCases;
  return preDone && modulesDone && normalDone && casesDone && postDone;
}

/**
 * Single source of truth for "is the course complete / certificate-eligible":
 * every activity requirement met AND the post-assessment score at or above
 * CERTIFICATE_PASS_THRESHOLD.
 */
export function isCourseComplete(p: UserProgress, course: CourseDefinition): boolean {
  return hasCompletedRequirements(p, course) && meetsPassThreshold(p, course);
}
