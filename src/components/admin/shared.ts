/**
 * Shared types + pure helpers for the Course Director Dashboard and its panels.
 * These were previously local to AdminDashboardPage; panels import them from
 * here so the Fellow shape and status logic stay single-sourced.
 */
import { CERTIFICATE_PASS_THRESHOLD } from "@/lib/completion";
import type { CourseDefinition } from "@/content/courses";

export interface SurveyResponse {
  statementId: string;
  rating: number;
}

export interface ModuleProgressItem {
  id: string;
  completed: boolean;
  quizScore: number | null;
  quizTotal: number | null;
  completedAt?: { seconds: number };
}

export interface CaseAttemptItem {
  id: string;
  caseId: string;
  completedAt?: { seconds: number };
}

export interface Fellow {
  id: string;
  name?: string;
  displayName?: string;
  email?: string;
  role?: string | null;
  lastLoginAt?: { seconds: number } | null;
  lastActive?: { seconds: number } | null;
  preQuizScore: number | null;
  preQuizTotal: number | null;
  postQuizScore: number | null;
  postQuizTotal: number | null;
  preSurveyCompleted: boolean;
  preSurveyResponses: SurveyResponse[] | null;
  postSurveyCompleted: boolean;
  postSurveyResponses: SurveyResponse[] | null;
  postRetroResponses: SurveyResponse[] | null;
  preQuizResponses: { questionId: string; selectedAnswer: string }[] | null;
  postQuizResponses: { questionId: string; selectedAnswer: string }[] | null;
  modulesCompleted: number;
  casesCompleted: number;
  normalMriComplete?: boolean;
  normalPlanesPassed?: number;
  totalNormalPlanes?: number;
  moduleProgress: ModuleProgressItem[];
  caseAttempts: CaseAttemptItem[];
  certificateSent?: boolean;
  certificateSentAt?: { seconds: number } | null;
}

export type FellowStatus = "Complete" | "Below 70%" | "In Progress" | "Not Started";

export function pct(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

export function fellowName(f: Fellow): string {
  return f.displayName || f.name || f.email || "Unknown";
}

/** Required core-case count for a learner, which differs by role. */
export function totalCasesForRole(course: CourseDefinition, role?: string | null): number {
  const residentCoreCaseCount = course.coreCases.filter((c) => c.residentVisible).length;
  return role === "resident" ? residentCoreCaseCount : course.coreCases.length;
}

export function hasNormalMriWorkstation(course: CourseDefinition): boolean {
  return ["knee", "shoulder", "hip", "elbow"].includes(course.bodyRegion);
}

export function fellowStatus(
  f: Fellow,
  totalModules: number,
  totalCases: number,
  course: CourseDefinition,
  postQuizTotal: number,
): FellowStatus {
  // Knee: cases are optional. Every current course requires its Normal MRI
  // workstation before the learner is certificate-ready.
  const isKnee = course.bodyRegion === "knee";
  const casesDone = isKnee ? true : f.casesCompleted >= totalCases;
  const normalDone = !hasNormalMriWorkstation(course) || !!f.normalMriComplete;
  const hasAll =
    f.preQuizScore !== null &&
    f.postQuizScore !== null &&
    f.preSurveyCompleted &&
    f.postSurveyCompleted &&
    f.modulesCompleted >= totalModules &&
    casesDone &&
    normalDone;
  if (hasAll) {
    // "Complete" means certificate-eligible: the Cloud Functions refuse to send
    // below the pass threshold, so the admin view must not offer Send Cert there.
    const postPct = pct(f.postQuizScore as number, f.postQuizTotal ?? postQuizTotal);
    return postPct >= CERTIFICATE_PASS_THRESHOLD ? "Complete" : "Below 70%";
  }
  const hasAny =
    f.preQuizScore !== null ||
    f.preSurveyCompleted ||
    f.modulesCompleted > 0 ||
    f.casesCompleted > 0 ||
    !!f.normalMriComplete;
  return hasAny ? "In Progress" : "Not Started";
}

/** Days without activity before an unfinished learner counts as inactive/drifting. */
export const INACTIVE_THRESHOLD_DAYS = 14;

/** Whole days since a Firestore timestamp; null when the timestamp is missing. */
export function daysSince(ts?: { seconds: number } | null): number | null {
  if (!ts) return null;
  return Math.floor((Date.now() - ts.seconds * 1000) / 86_400_000);
}

/** Most recent activity signal we have for a learner. */
export function lastSeen(f: Fellow): { seconds: number } | null {
  return f.lastActive ?? f.lastLoginAt ?? null;
}

/** Prettify a kebab-case domain id for display (e.g. "menisci-roots" → "Menisci Roots"). */
export function domainLabel(domain: string): string {
  return domain.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const UCLA_BLUE = "#2774AE";
export const UCLA_DARK = "#005587";
export const STATUS_COLORS: Record<FellowStatus, string> = {
  Complete: "#16a34a",
  "Below 70%": "#d97706",
  "In Progress": "#2774AE",
  "Not Started": "#9ca3af",
};
