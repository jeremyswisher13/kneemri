import { courseRegistry, type CourseId } from "@/content/courses";

export const LEARNER_RESUME_KEY = "uclaSportsMri.resume";

export interface LearnerResumeState {
  path: string;
  title: string;
  courseId?: CourseId;
  courseTitle?: string;
  modeLabel?: string;
  seriesLabel?: string;
  updatedAt: string;
}

type ResumeStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;

function safeInternalPath(path: string) {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/login")) return "/";
  return path;
}

function isCourseId(value: string | undefined): value is CourseId {
  return !!value && courseRegistry.some((course) => course.id === value);
}

export function readLearnerResume(storage: ResumeStorage = localStorage): LearnerResumeState | null {
  try {
    const raw = storage.getItem(LEARNER_RESUME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LearnerResumeState>;
    if (!parsed.path || !parsed.title || !parsed.updatedAt) return null;
    const path = safeInternalPath(parsed.path);
    if (path === "/") return null;
    return {
      path,
      title: parsed.title,
      courseId: isCourseId(parsed.courseId) ? parsed.courseId : undefined,
      courseTitle: parsed.courseTitle,
      modeLabel: parsed.modeLabel,
      seriesLabel: parsed.seriesLabel,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function saveLearnerResume(
  state: Omit<LearnerResumeState, "updatedAt">,
  storage: ResumeStorage = localStorage,
) {
  const path = safeInternalPath(state.path);
  if (path === "/") return;
  const next: LearnerResumeState = {
    ...state,
    path,
    updatedAt: new Date().toISOString(),
  };
  storage.setItem(LEARNER_RESUME_KEY, JSON.stringify(next));
}

export function clearLearnerResume(storage: ResumeStorage = localStorage) {
  storage.removeItem(LEARNER_RESUME_KEY);
}

export function isHomeScreenLaunch(search: string) {
  const source = new URLSearchParams(search).get("source")?.toLowerCase();
  return source === "homescreen" || source === "pwa" || source === "standalone";
}

export function shouldResumeHomeScreenLaunch(search: string, resume: LearnerResumeState | null) {
  return !!resume && isHomeScreenLaunch(search);
}

export function suggestedNextStep(modeLabel?: string) {
  switch (modeLabel) {
    case "Explore":
      return "Next: Guided Tour";
    case "Guided Tour":
      return "Next: Practice & Mastery";
    case "Practice & Mastery":
    case "Knowledge Check":
      return "Next: Cross-Plane";
    case "Cross-Plane":
      return "Next: Image CAQ";
    case "Advanced":
    case "Image CAQ":
      return "Next: Spaced Review";
    default:
      return "Start with Explore, then Guided Tour, Practice & Mastery, Cross-Plane, and Image CAQ.";
  }
}
