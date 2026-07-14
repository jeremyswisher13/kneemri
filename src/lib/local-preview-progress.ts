import {
  defaultCourse,
  LEGACY_DEFAULT_COURSE_ID,
  requiredCoreCaseCount,
  type CourseDefinition,
  type CourseId,
} from "@/content/courses";
import { createNewCard, type ReviewCard } from "@/lib/spaced-repetition";
import { normalPlaneIdsFor } from "@/lib/normal-plane-ids";
import type { CaseAttemptItem, ModuleProgressItem, QuizResponse, SurveyResponse, UserProgress } from "@/types/progress";

export const LOCAL_PREVIEW_PROGRESS_KEY = "uclaSportsMri.localPreviewProgress.v1";
export const LOCAL_PREVIEW_PROGRESS_EVENT = "uclaSportsMri:localPreviewProgress";

type PreviewStorage = Pick<Storage, "getItem" | "removeItem" | "setItem">;
type TimestampSeconds = { seconds: number };

interface LocalPreviewQuizAttempt {
  id: string;
  courseId: CourseId;
  quizType: "pre" | "post";
  score: number;
  totalQuestions: number;
  answers: QuizResponse[];
  completedAt: TimestampSeconds;
}

interface LocalPreviewSurveyAttempt {
  id: string;
  courseId: CourseId;
  surveyType: "pre" | "post";
  responses: SurveyResponse[];
  retroResponses?: SurveyResponse[];
  completedAt: TimestampSeconds;
}

interface LocalPreviewNormalPlane {
  id: string;
  passed: boolean;
  score: number;
  total: number;
  completedAt: TimestampSeconds;
}

interface LocalPreviewCaseAttempt extends CaseAttemptItem {
  id: string;
  courseId: CourseId;
  searchPatternChecklist?: Record<string, boolean>;
  report?: string;
}

interface LocalPreviewState {
  quizAttempts: LocalPreviewQuizAttempt[];
  surveyResponses: LocalPreviewSurveyAttempt[];
  moduleProgress: Record<string, ModuleProgressItem & { courseId?: CourseId }>;
  caseAttempts: LocalPreviewCaseAttempt[];
  normalPlanes: Record<string, LocalPreviewNormalPlane>;
  reviewCards: Record<string, ReviewCard>;
}

function emptyState(): LocalPreviewState {
  return {
    quizAttempts: [],
    surveyResponses: [],
    moduleProgress: {},
    caseAttempts: [],
    normalPlanes: {},
    reviewCards: {},
  };
}

function browserStorage(): PreviewStorage | null {
  return typeof window === "undefined" ? null : window.localStorage;
}

function readState(storage: PreviewStorage | null = browserStorage()): LocalPreviewState {
  if (!storage) return emptyState();
  try {
    const raw = storage.getItem(LOCAL_PREVIEW_PROGRESS_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<LocalPreviewState>;
    return {
      ...emptyState(),
      ...parsed,
      moduleProgress: parsed.moduleProgress ?? {},
      normalPlanes: parsed.normalPlanes ?? {},
      reviewCards: parsed.reviewCards ?? {},
      quizAttempts: parsed.quizAttempts ?? [],
      surveyResponses: parsed.surveyResponses ?? [],
      caseAttempts: parsed.caseAttempts ?? [],
    };
  } catch {
    return emptyState();
  }
}

function writeState(state: LocalPreviewState, storage: PreviewStorage | null = browserStorage()) {
  if (!storage) return;
  storage.setItem(LOCAL_PREVIEW_PROGRESS_KEY, JSON.stringify(state));
  notifyLocalPreviewProgressChange();
}

function nowTimestamp(): TimestampSeconds {
  return { seconds: Math.floor(Date.now() / 1000) };
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function completedMs(t: TimestampSeconds | null | undefined): number {
  return t?.seconds ? t.seconds * 1000 : 0;
}

function belongsToCourse(courseId: CourseId | undefined, course: CourseDefinition) {
  return courseId === course.id || (course.id === LEGACY_DEFAULT_COURSE_ID && courseId == null);
}

export function notifyLocalPreviewProgressChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOCAL_PREVIEW_PROGRESS_EVENT));
  }
}

export function clearLocalPreviewProgress(storage: PreviewStorage | null = browserStorage()) {
  storage?.removeItem(LOCAL_PREVIEW_PROGRESS_KEY);
  notifyLocalPreviewProgressChange();
}

export function recordLocalPreviewQuiz(
  quizType: "pre" | "post",
  answers: QuizResponse[],
  score: number,
  totalQuestions: number,
  courseId: CourseId = defaultCourse.id,
  storage: PreviewStorage | null = browserStorage(),
) {
  const state = readState(storage);
  state.quizAttempts.push({
    id: nextId(`${quizType}-quiz`),
    courseId,
    quizType,
    answers,
    score,
    totalQuestions,
    completedAt: nowTimestamp(),
  });
  writeState(state, storage);
}

export function recordLocalPreviewSurvey(
  surveyType: "pre" | "post",
  responses: SurveyResponse[],
  courseId: CourseId = defaultCourse.id,
  retroResponses?: SurveyResponse[],
  storage: PreviewStorage | null = browserStorage(),
) {
  const state = readState(storage);
  state.surveyResponses.push({
    id: nextId(`${surveyType}-survey`),
    courseId,
    surveyType,
    responses,
    ...(retroResponses && retroResponses.length > 0 ? { retroResponses } : {}),
    completedAt: nowTimestamp(),
  });
  writeState(state, storage);
}

export function recordLocalPreviewModule(
  moduleId: string,
  quizScore: number | null,
  quizTotal: number | null,
  courseId: CourseId = defaultCourse.id,
  storage: PreviewStorage | null = browserStorage(),
) {
  const state = readState(storage);
  state.moduleProgress[moduleId] = {
    id: moduleId,
    courseId,
    completed: true,
    quizScore,
    quizTotal,
    completedAt: nowTimestamp(),
  };
  writeState(state, storage);
}

export function recordLocalPreviewNormalPlane(
  planeId: string,
  score: number,
  total: number,
  storage: PreviewStorage | null = browserStorage(),
) {
  const state = readState(storage);
  state.normalPlanes[planeId] = {
    id: planeId,
    passed: true,
    score,
    total,
    completedAt: nowTimestamp(),
  };
  writeState(state, storage);
}

export function recordLocalPreviewCaseAttempt(
  caseId: string,
  searchPatternChecklist: Record<string, boolean>,
  report: string,
  courseId: CourseId = defaultCourse.id,
  storage: PreviewStorage | null = browserStorage(),
) {
  const state = readState(storage);
  state.caseAttempts.push({
    id: nextId("case"),
    courseId,
    caseId,
    searchPatternChecklist,
    report,
    completedAt: nowTimestamp(),
  });
  writeState(state, storage);
}

export function getLocalPreviewReviewCards(storage: PreviewStorage | null = browserStorage()): ReviewCard[] {
  return Object.values(readState(storage).reviewCards);
}

export function getLocalPreviewReviewCard(
  questionId: string,
  storage: PreviewStorage | null = browserStorage(),
): ReviewCard | null {
  return readState(storage).reviewCards[questionId] ?? null;
}

export function saveLocalPreviewReviewCard(
  card: ReviewCard,
  storage: PreviewStorage | null = browserStorage(),
) {
  const state = readState(storage);
  state.reviewCards[card.questionId] = card;
  writeState(state, storage);
}

export function addLocalPreviewWrongAnswerToReview(
  questionId: string,
  moduleId: string,
  courseId: CourseId = defaultCourse.id,
  storage: PreviewStorage | null = browserStorage(),
) {
  const existing = getLocalPreviewReviewCard(questionId, storage);
  if (existing) {
    const today = new Date().toISOString().split("T")[0];
    if (existing.nextReviewDate && existing.nextReviewDate > today) return;
  }
  saveLocalPreviewReviewCard(existing ?? createNewCard(questionId, moduleId, courseId), storage);
}

export function getLocalPreviewProgress(
  course: CourseDefinition = defaultCourse,
  role: string | null = "fellow",
  storage: PreviewStorage | null = browserStorage(),
): UserProgress {
  const state = readState(storage);
  const courseModuleIds = new Set(course.modules.map((m) => m.id));
  const courseCaseIds = new Set(course.cases.map((c) => c.id));
  const visibleCoreCases =
    role === "resident" ? course.coreCases.filter((c) => c.residentVisible) : course.coreCases;
  const visibleCaseIds = new Set(visibleCoreCases.map((c) => c.id));
  const planeIds = normalPlaneIdsFor(course.bodyRegion);

  const quizAttempts = state.quizAttempts
    .filter((q) => belongsToCourse(q.courseId, course))
    .sort((a, b) => completedMs(b.completedAt) - completedMs(a.completedAt));
  const preQuiz = quizAttempts.find((q) => q.quizType === "pre");
  const postQuiz = quizAttempts.find((q) => q.quizType === "post");

  const surveyResponses = state.surveyResponses
    .filter((s) => belongsToCourse(s.courseId, course))
    .sort((a, b) => completedMs(b.completedAt) - completedMs(a.completedAt));
  const preSurvey = surveyResponses.find((s) => s.surveyType === "pre");
  const postSurvey = surveyResponses.find((s) => s.surveyType === "post");

  const moduleProgress = Object.values(state.moduleProgress).filter((m) => courseModuleIds.has(m.id));
  const modulesCompleted = moduleProgress.filter((m) => m.completed).length;

  const caseAttempts = state.caseAttempts.filter((c) => courseCaseIds.has(c.caseId));
  const completedVisibleCases = new Set(
    caseAttempts.filter((c) => visibleCaseIds.has(c.caseId)).map((c) => c.caseId),
  );

  const passedIds = new Set(
    Object.values(state.normalPlanes)
      .filter((plane) => plane.passed)
      .map((plane) => plane.id),
  );
  const normalPlanesPassed = planeIds.filter((id) => passedIds.has(id)).length;
  const normalMriComplete = planeIds.length === 0 || normalPlanesPassed >= planeIds.length;
  const allModulesDone = modulesCompleted >= course.modules.length;
  const requiredCases = requiredCoreCaseCount(course, role === "resident");
  const allCasesDone = completedVisibleCases.size >= requiredCases;
  const baselineDone = !!preQuiz && !!preSurvey;
  const postQuizUnlocked = baselineDone && normalMriComplete && allModulesDone && allCasesDone;

  return {
    preQuizCompleted: !!preQuiz,
    preQuizScore: preQuiz?.score ?? null,
    preQuizTotal: preQuiz?.totalQuestions ?? null,
    preQuizCompletedAt: preQuiz?.completedAt ?? null,
    preQuizResponses: preQuiz?.answers ?? null,
    preSurveyCompleted: !!preSurvey,
    preSurveyResponses: preSurvey?.responses ?? null,
    preSurveyCompletedAt: preSurvey?.completedAt ?? null,
    postQuizCompleted: !!postQuiz,
    postQuizScore: postQuiz?.score ?? null,
    postQuizTotal: postQuiz?.totalQuestions ?? null,
    postQuizCompletedAt: postQuiz?.completedAt ?? null,
    postQuizResponses: postQuiz?.answers ?? null,
    postSurveyCompleted: !!postSurvey,
    postSurveyResponses: postSurvey?.responses ?? null,
    postRetroResponses: postSurvey?.retroResponses ?? null,
    postSurveyCompletedAt: postSurvey?.completedAt ?? null,
    postQuizUnlocked,
    modulesCompleted,
    totalModules: course.modules.length,
    casesCompleted: completedVisibleCases.size,
    totalCases: visibleCoreCases.length,
    requiredCases,
    normalMriComplete,
    normalPlanesPassed,
    totalNormalPlanes: planeIds.length,
    moduleProgress,
    caseAttempts,
  };
}
