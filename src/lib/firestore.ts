import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, query, where, serverTimestamp
} from "firebase/firestore";
import { db } from "./db";
import { logAuditEvent } from "./audit";
import { createNewCard, calculateNextReview, type ReviewCard } from "./spaced-repetition";
import { certificateFieldsForCourse } from "@/lib/course-certificate";
import {
  defaultCourse,
  getCourseById,
  LEGACY_DEFAULT_COURSE_ID,
  requiredCoreCaseCount,
  type CourseDefinition,
  type CourseId,
} from "@/content/courses";
import {
  medicalQaReviewId,
  type MedicalQaReviewInput,
  type MedicalQaReviewRecord,
  type MedicalQaReviewTarget,
} from "@/lib/medical-qa-review";
import { isPreviewAuthSession } from "@/lib/local-preview-auth";
import {
  addLocalPreviewWrongAnswerToReview,
  getLocalPreviewProgress,
  getLocalPreviewReviewCards,
  recordLocalPreviewCaseAttempt,
  recordLocalPreviewModule,
  recordLocalPreviewNormalPlane,
  recordLocalPreviewQuiz,
  recordLocalPreviewSurvey,
  saveLocalPreviewReviewCard,
} from "@/lib/local-preview-progress";
import { normalPlaneIdsFor } from "@/lib/normal-plane-ids";
import type {
  CaseAttemptItem,
  ModuleProgressItem,
  QuizAttempt,
  SurveyAttempt,
  UserProgress,
} from "@/types/progress";

// --- Admin Preview Guard ---
function isAdminPreview(): boolean {
  try {
    return !!sessionStorage.getItem("adminPreviewRole") || isPreviewAuthSession();
  } catch {
    return false;
  }
}

// --- Specialty + surgical-correlate preference ---
export async function setUserSpecialty(uid: string, specialty: "sports-med" | "ortho"): Promise<void> {
  if (isAdminPreview()) return;
  const userRef = doc(db, "users", uid);
  // Default the surgical-correlate toggle from specialty (ortho → on); the learner
  // can flip it anytime via setShowSurgical.
  await setDoc(userRef, { specialty, showSurgical: specialty === "ortho" }, { merge: true });
}

export async function setShowSurgical(uid: string, showSurgical: boolean): Promise<void> {
  if (isAdminPreview()) return;
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { showSurgical }, { merge: true });
}

// --- Touch Last Active ---
async function touchLastActive(uid: string) {
  if (isAdminPreview()) return;
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { lastActive: serverTimestamp() }, { merge: true });
}

// --- User Role ---
export async function setUserRole(uid: string, role: 'fellow' | 'resident'): Promise<void> {
  if (isAdminPreview()) return;
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { role }, { merge: true });
}

// --- Quiz ---
export async function submitQuiz(
  userId: string,
  userEmail: string,
  quizType: "pre" | "post",
  answers: { questionId: string; selectedAnswer: string }[],
  courseId: CourseId = defaultCourse.id,
  // When true (admin viewing the course directly), score and return results for
  // the UI but DO NOT persist — so an admin's own test runs never pollute cohort data.
  skipWrite = false
) {
  // Filter questions for this quiz type, scoped to the submitting course's instrument.
  const validMappings = quizType === "pre"
    ? ["identical", "parallel-pre", "pre-only"]
    : ["identical", "parallel-post", "post-only"];
  const questions = getCourseById(courseId).prePostQuizQuestions
    .filter(q => validMappings.includes(q.prePostMapping));

  // Score
  let score = 0;
  const results = answers.map(a => {
    const question = questions.find(q => q.id === a.questionId);
    const correct = question?.correctAnswer === a.selectedAnswer;
    if (correct) score++;
    return {
      questionId: a.questionId,
      correct,
      correctAnswer: question?.correctAnswer || "",
      explanation: question?.explanation || "",
    };
  });

  // Admin preview / admin-view: return real scoring without writing anything.
  if (isPreviewAuthSession() && !skipWrite) {
    recordLocalPreviewQuiz(quizType, answers, score, questions.length, courseId);
    return { score, totalQuestions: questions.length, results, attemptId: "local-preview" };
  }

  if (isAdminPreview() || skipWrite) {
    return { score, totalQuestions: questions.length, results, attemptId: "preview" };
  }

  // Save to Firestore
  const attemptRef = await addDoc(collection(db, "users", userId, "quizAttempts"), {
    courseId,
    quizType,
    answers,
    score,
    totalQuestions: questions.length,
    completedAt: serverTimestamp(),
  });

  logAuditEvent(userId, userEmail, "quiz_submitted", { courseId, quizType, score, totalQuestions: questions.length }).catch(() => {});
  touchLastActive(userId).catch(() => {});

  return { score, totalQuestions: questions.length, results, attemptId: attemptRef.id };
}

// --- Survey ---
export async function submitSurvey(
  userId: string,
  userEmail: string,
  surveyType: "pre" | "post",
  responses: { statementId: string; rating: number }[],
  courseId: CourseId = defaultCourse.id,
  // Post survey only: the retrospective "then" ratings (confidence as the learner
  // now judges it to have been before the course). Omitted/empty on the pre survey.
  retroResponses?: { statementId: string; rating: number }[],
  // When true (admin viewing directly), skip the write so test runs don't pollute data.
  skipWrite = false
) {
  if (isPreviewAuthSession() && !skipWrite) {
    recordLocalPreviewSurvey(surveyType, responses, courseId, retroResponses);
    return { success: true };
  }

  if (isAdminPreview() || skipWrite) return { success: true };
  await addDoc(collection(db, "users", userId, "surveyResponses"), {
    courseId,
    surveyType,
    responses,
    ...(retroResponses && retroResponses.length > 0 ? { retroResponses } : {}),
    completedAt: serverTimestamp(),
  });

  logAuditEvent(userId, userEmail, "survey_submitted", { courseId, surveyType }).catch(() => {});
  touchLastActive(userId).catch(() => {});

  return { success: true };
}

// --- Module Progress (Admin) ---
export async function completeModuleAdmin(
  userId: string,
  moduleId: string,
  quizScore: number,
  quizTotal: number,
  courseId: CourseId = defaultCourse.id
) {
  const moduleRef = doc(db, "users", userId, "moduleProgress", moduleId);
  await setDoc(moduleRef, {
    courseId,
    completed: true,
    quizScore,
    quizTotal,
    completedAt: serverTimestamp(),
  }, { merge: true });
}

// --- Module Progress ---
export async function completeModule(
  userId: string,
  userEmail: string,
  moduleId: string,
  quizScore?: number,
  quizTotal?: number,
  courseId: CourseId = defaultCourse.id
) {
  if (isPreviewAuthSession()) {
    recordLocalPreviewModule(moduleId, quizScore ?? null, quizTotal ?? null, courseId);
    return { success: true };
  }

  if (isAdminPreview()) return { success: true };
  const moduleRef = doc(db, "users", userId, "moduleProgress", moduleId);
  await setDoc(moduleRef, {
    courseId,
    completed: true,
    quizScore: quizScore ?? null,
    quizTotal: quizTotal ?? null,
    completedAt: serverTimestamp(),
  }, { merge: true });

  // Non-blocking: don't let audit/activity tracking failures prevent module completion
  logAuditEvent(userId, userEmail, "module_completed", { courseId, moduleId, quizScore, quizTotal }).catch(() => {});
  touchLastActive(userId).catch(() => {});

  return { success: true };
}

// --- Interactive Normal MRI workstation: plane pass (ALL courses) ---
// NOTE: the per-user subcollection is still named "normalKnee" (the knee course
// shipped first), but it is the SHARED store for every course — plane passes are
// keyed by course-disambiguated ids (knee bare, "sh-"/"hip-"/"elbow-" prefixed;
// see NORMAL_*_PLANE_IDS). Renaming the collection would orphan existing data, so
// only the function name is generic. There is NO knee-specific behavior here.
/** Record that a fellow passed the blinded Mastery Check for one workstation plane. */
export async function markNormalPlanePassed(
  userId: string,
  userEmail: string,
  planeId: string,
  score: number,
  total: number,
) {
  if (isPreviewAuthSession()) {
    recordLocalPreviewNormalPlane(planeId, score, total);
    return { success: true };
  }

  if (isAdminPreview()) return { success: true };
  const ref = doc(db, "users", userId, "normalKnee", planeId);
  await setDoc(ref, {
    passed: true,
    score,
    total,
    completedAt: serverTimestamp(),
  }, { merge: true });
  logAuditEvent(userId, userEmail, "normal_knee_plane_passed", { planeId, score, total }).catch(() => {});
  touchLastActive(userId).catch(() => {});
  return { success: true };
}

// --- Case Attempts ---
export async function submitCaseAttempt(
  userId: string,
  userEmail: string,
  caseId: string,
  searchPatternChecklist: Record<string, boolean>,
  report: string,
  courseId: CourseId = defaultCourse.id
) {
  if (isPreviewAuthSession()) {
    recordLocalPreviewCaseAttempt(caseId, searchPatternChecklist, report, courseId);
    return { success: true, attemptId: "local-preview" };
  }

  if (isAdminPreview()) return { success: true, attemptId: "preview" };
  const ref = await addDoc(collection(db, "users", userId, "caseAttempts"), {
    courseId,
    caseId,
    searchPatternChecklist,
    report,
    completedAt: serverTimestamp(),
  });

  logAuditEvent(userId, userEmail, "case_submitted", { courseId, caseId }).catch(() => {});
  touchLastActive(userId).catch(() => {});

  return { success: true, attemptId: ref.id };
}

// --- Progress ---
/**
 * Course-scoped progress. Reads are filtered to the supplied course:
 *  - moduleProgress / caseAttempts / reviewCards are namespaced by content ID
 *    (e.g. "shoulder-rotator-cuff"), so we filter by course content membership.
 *  - quizAttempts / surveyResponses are keyed only by "pre"/"post", so they
 *    carry a `courseId` field. For backward compatibility, documents written
 *    before multi-course support (no `courseId`) are attributed to the default
 *    (knee) course.
 */
// The global cohort settings doc (admin post-quiz-unlock flags) is identical for
// every learner, so cache it briefly rather than re-reading it inside every
// getUserProgress call — the admin getAllFellows loop would otherwise read the
// same doc once per learner. Invalidated explicitly when an admin toggles a flag.
let cohortCache: { data: Record<string, unknown>; at: number } | null = null;
const COHORT_TTL_MS = 60_000;
async function getCohortSettings(): Promise<Record<string, unknown>> {
  if (cohortCache && Date.now() - cohortCache.at < COHORT_TTL_MS) return cohortCache.data;
  const snap = await getDoc(doc(db, "settings", "cohort"));
  const data = snap.exists() ? snap.data() : {};
  cohortCache = { data, at: Date.now() };
  return data;
}

export async function getUserProgress(
  userId: string,
  course: CourseDefinition = defaultCourse,
): Promise<UserProgress> {
  const isDefaultCourse = course.id === defaultCourse.id;
  // Legacy (pre-multi-course) docs have no courseId and belong to the knee
  // course. Pinned to LEGACY_DEFAULT_COURSE_ID (not defaultCourse) so a registry
  // reorder can't reattribute them. This is distinct from isDefaultCourse below,
  // which gates the global admin post-quiz-unlock setting.
  const isLegacyOwnerCourse = course.id === LEGACY_DEFAULT_COURSE_ID;
  // A quiz/survey doc belongs to this course if its courseId matches, or — for
  // the legacy-owner course only — if it predates course tagging (no courseId).
  const belongsToCourse = (data: { courseId?: string }) =>
    data.courseId === course.id || (isLegacyOwnerCourse && data.courseId == null);

  // Newest-first ordering so find() returns the MOST RECENT attempt deterministically
  // (Firestore returns docs in random doc-ID order; addDoc IDs aren't chronological).
  const completedMs = (t: unknown): number =>
    t != null && typeof (t as { toMillis?: unknown }).toMillis === "function"
      ? (t as { toMillis: () => number }).toMillis()
      : 0;

  // The per-plane workstation read is gated only on course.bodyRegion (no
  // Firestore dependency), so it can join the same parallel wave as the other
  // independent subcollection/doc reads.
  const planeIds = normalPlaneIdsFor(course.bodyRegion);
  const hasWorkstation = planeIds.length > 0;

  // All of these reads are independent — fire them in one wave.
  const [[quizSnap, surveySnap, moduleSnap, caseSnap, userSnap, nkSnap], settingsData] =
    await Promise.all([
      Promise.all([
        getDocs(collection(db, "users", userId, "quizAttempts")),
        getDocs(collection(db, "users", userId, "surveyResponses")),
        getDocs(collection(db, "users", userId, "moduleProgress")),
        getDocs(collection(db, "users", userId, "caseAttempts")),
        getDoc(doc(db, "users", userId)),
        hasWorkstation
          ? getDocs(collection(db, "users", userId, "normalKnee"))
          : Promise.resolve(null),
      ]),
      getCohortSettings(),
    ]);

  // Quiz attempts
  const quizAttempts = quizSnap.docs
    .map(d => ({ id: d.id, ...d.data() } as QuizAttempt & { courseId?: string }))
    .filter(belongsToCourse)
    .sort((a, b) => completedMs(b.completedAt) - completedMs(a.completedAt));
  const preQuiz = quizAttempts.find((a) => a.quizType === "pre");
  const postQuiz = quizAttempts.find((a) => a.quizType === "post");

  // Survey responses
  const surveyResponses = surveySnap.docs
    .map(d => ({ id: d.id, ...d.data() } as SurveyAttempt & { courseId?: string }))
    .filter(belongsToCourse)
    .sort((a, b) => completedMs(b.completedAt) - completedMs(a.completedAt));
  const preSurvey = surveyResponses.find((s) => s.surveyType === "pre");
  const postSurvey = surveyResponses.find((s) => s.surveyType === "post");

  // Module progress — filter to this course's modules (IDs are namespaced)
  const courseModuleIds = new Set(course.modules.map((m) => m.id));
  const moduleProgress = moduleSnap.docs
    .map(d => ({ id: d.id, ...d.data() } as ModuleProgressItem))
    .filter((m) => courseModuleIds.has(m.id));
  const modulesCompleted = moduleProgress.filter((m) => m.completed).length;

  // Case attempts — filter to this course's cases (IDs are namespaced)
  const courseCaseIds = new Set(course.cases.map((c) => c.id));
  const caseAttempts = caseSnap.docs
    .map(d => ({ id: d.id, ...d.data() } as CaseAttemptItem))
    .filter((c) => courseCaseIds.has(c.caseId));

  // Cohort settings — admin unlock is course-scoped via a per-course field
  // (postQuizUnlocked_<courseId>); the legacy global `postQuizUnlocked` flag is
  // honored as the default (knee) course's value for backward compatibility.
  const adminUnlocked =
    settingsData[`postQuizUnlocked_${course.id}`] === true ||
    (isDefaultCourse && settingsData.postQuizUnlocked === true);

  // Auto-unlock: baseline first, then the normal workstation, all modules, and
  // any three role-appropriate core cases.
  const userRole = userSnap.exists() ? userSnap.data().role : null;
  const isResident = userRole === 'resident';
  const visibleCoreCases = isResident
    ? course.coreCases.filter(c => c.residentVisible)
    : course.coreCases;
  const requiredCases = requiredCoreCaseCount(course, isResident);
  const visibleCaseIds = new Set(visibleCoreCases.map(c => c.id));
  const completedVisibleCases = new Set(
    caseAttempts.filter((c) => visibleCaseIds.has(c.caseId)).map((c) => c.caseId)
  );
  const allModulesDone = modulesCompleted >= course.modules.length;
  // An empty required-case set is trivially satisfied (nothing left to do).
  const allCasesDone = completedVisibleCases.size >= requiredCases;

  // Interactive Normal MRI: "complete" = passed the Mastery Check on every
  // plane of this course's workstation. Courses without a workstation (none
  // currently) treat it as not-applicable (complete).
  let normalPlanesPassed = 0;
  if (hasWorkstation && nkSnap) {
    const passedIds = new Set(nkSnap.docs.filter((d) => d.data().passed === true).map((d) => d.id));
    normalPlanesPassed = planeIds.filter((id) => passedIds.has(id)).length;
  }
  const totalNormalPlanes = planeIds.length;
  const normalMriComplete = !hasWorkstation || normalPlanesPassed >= planeIds.length;

  const baselineDone = !!preQuiz && !!preSurvey;
  const requiredLearningDone =
    baselineDone && normalMriComplete && allModulesDone && allCasesDone;
  const postQuizUnlocked = adminUnlocked || requiredLearningDone;

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
    postQuizResponses: postQuiz?.answers ?? null,
    postSurveyCompleted: !!postSurvey,
    postSurveyResponses: postSurvey?.responses ?? null,
    postRetroResponses: postSurvey?.retroResponses ?? null,
    postQuizTotal: postQuiz?.totalQuestions ?? null,
    postSurveyCompletedAt: postSurvey?.completedAt ?? null,
    postQuizCompletedAt: postQuiz?.completedAt ?? null,
    postQuizUnlocked,
    modulesCompleted,
    totalModules: course.modules.length,
    casesCompleted: completedVisibleCases.size,
    totalCases: visibleCoreCases.length,
    requiredCases,
    normalMriComplete,
    normalPlanesPassed,
    totalNormalPlanes,
    moduleProgress,
    caseAttempts,
  };
}

// --- Admin ---
export async function getAllFellows(course: CourseDefinition = defaultCourse) {
  // Fetch both fellows and residents (exclude admins with no learner role).
  // Progress is computed for the supplied course so the admin dashboard can
  // switch between cohorts.
  const certificateFields = certificateFieldsForCourse(course.id);
  const fellowSnap = await getDocs(query(collection(db, "users"), where("role", "==", "fellow")));
  const residentSnap = await getDocs(query(collection(db, "users"), where("role", "==", "resident")));
  const allDocs = [...fellowSnap.docs, ...residentSnap.docs];
  const users = await Promise.all(
    allDocs.map(async (userDoc) => {
      const userData = userDoc.data();
      const progress = await getUserProgress(userDoc.id, course);
      return {
        id: userDoc.id,
        ...userData,
        ...progress,
        certificateSent: userData[certificateFields.sentField] === true,
        certificateSentAt: userData[certificateFields.sentAtField] ?? null,
      };
    }),
  );
  return users;
}

// In-flight coalescer for getUserProgress: FellowLayout and the dashboard page
// each call useProgress(activeCourse) on the same mount, which would otherwise
// run the full ~6-read wave TWICE. Sharing the pending promise collapses them
// into one wave; cleared once settled so a later mount / refresh() refetches
// fresh (no long-lived staleness after a progress-writing mutation).
const progressInFlight = new Map<string, Promise<UserProgress>>();
export function loadProgress(userId: string, course: CourseDefinition = defaultCourse): Promise<UserProgress> {
  if (isPreviewAuthSession()) return Promise.resolve(getLocalPreviewProgress(course));

  const key = `${userId}:${course.id}`;
  const existing = progressInFlight.get(key);
  if (existing) return existing;
  const p = getUserProgress(userId, course);
  progressInFlight.set(key, p);
  p.catch(() => {}).finally(() => {
    if (progressInFlight.get(key) === p) progressInFlight.delete(key);
  });
  return p;
}

export async function togglePostQuizUnlock(
  userId: string,
  userEmail: string,
  unlocked: boolean,
  courseId: CourseId = defaultCourse.id,
) {
  const update: Record<string, unknown> = {
    [`postQuizUnlocked_${courseId}`]: unlocked,
    updatedAt: serverTimestamp(),
  };
  // Keep the legacy global flag in sync for the default (knee) course.
  if (courseId === defaultCourse.id) update.postQuizUnlocked = unlocked;
  await setDoc(doc(db, "settings", "cohort"), update, { merge: true });
  cohortCache = null; // so the toggling admin sees the new unlock state immediately

  await logAuditEvent(userId, userEmail, "post_quiz_unlocked", { courseId, unlocked });
  return { success: true, postQuizUnlocked: unlocked };
}

// --- Medical QA Review ---
export async function getMedicalQaReviews(): Promise<Record<string, MedicalQaReviewRecord>> {
  const snap = await getDocs(collection(db, "medicalQaReviews"));
  return Object.fromEntries(
    snap.docs.map((reviewDoc) => [
      reviewDoc.id,
      { id: reviewDoc.id, ...reviewDoc.data() } as MedicalQaReviewRecord,
    ]),
  );
}

export async function saveMedicalQaReview(
  userId: string,
  userEmail: string,
  target: MedicalQaReviewTarget,
  input: MedicalQaReviewInput,
): Promise<MedicalQaReviewRecord> {
  const reviewId = medicalQaReviewId(target);
  const reviewedAt = input.status === "pending" ? null : serverTimestamp();
  const payload = {
    courseId: target.courseId,
    itemType: target.itemType,
    itemId: target.itemId,
    title: target.title ?? "",
    risk: target.risk ?? "standard",
    sourcePath: target.sourcePath ?? "",
    flags: target.flags ?? [],
    status: input.status,
    sourceNotes: input.sourceNotes.trim(),
    reviewerNotes: input.reviewerNotes.trim(),
    reviewedBy: userId,
    reviewerEmail: userEmail,
    reviewedAt,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, "medicalQaReviews", reviewId), payload, { merge: true });
  await logAuditEvent(userId, userEmail, "medical_qa_review_saved", {
    reviewId,
    courseId: target.courseId,
    itemType: target.itemType,
    itemId: target.itemId,
    status: input.status,
  });

  return {
    id: reviewId,
    ...payload,
    reviewedAt: input.status === "pending" ? null : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// --- Spaced Repetition Review Cards ---

// In-flight coalescer: the dashboard fires getReviewCards twice on mount (the
// FellowLayout due-badge via getDueCards and the ReviewSummaryCard via
// getCourseCards). Sharing the in-flight promise collapses those into one
// collection read; cleared once settled so later navigations still refetch.
let reviewCardsInFlight: { uid: string; p: Promise<ReviewCard[]> } | null = null;
export async function getReviewCards(userId: string): Promise<ReviewCard[]> {
  if (isPreviewAuthSession()) return getLocalPreviewReviewCards();
  if (isAdminPreview()) return [];
  if (reviewCardsInFlight && reviewCardsInFlight.uid === userId) return reviewCardsInFlight.p;
  const p = (async () => {
    const snap = await getDocs(collection(db, "users", userId, "reviewCards"));
    return snap.docs.map((d) => ({ questionId: d.id, ...d.data() } as ReviewCard));
  })();
  reviewCardsInFlight = { uid: userId, p };
  p.catch(() => {}).finally(() => {
    if (reviewCardsInFlight?.p === p) reviewCardsInFlight = null;
  });
  return p;
}

export async function saveReviewCard(userId: string, card: ReviewCard): Promise<void> {
  if (isPreviewAuthSession()) {
    saveLocalPreviewReviewCard(card);
    return;
  }

  if (isAdminPreview()) return;
  const cardRef = doc(db, "users", userId, "reviewCards", card.questionId);
  await setDoc(cardRef, {
    moduleId: card.moduleId,
    ...(card.courseId ? { courseId: card.courseId } : {}),
    easeFactor: card.easeFactor,
    interval: card.interval,
    repetitions: card.repetitions,
    nextReviewDate: card.nextReviewDate,
  }, { merge: true });
}

/**
 * Due cards for a course. A card belongs to the course when its courseId
 * matches, or — for the legacy-owner (knee) course only — when it predates
 * course tagging (no courseId), mirroring getUserProgress's backward-compat
 * rule. Pinned to LEGACY_DEFAULT_COURSE_ID so a registry reorder can't
 * reattribute production knee review cards.
 */
export async function getDueCards(
  userId: string,
  course: CourseDefinition = defaultCourse,
): Promise<ReviewCard[]> {
  const today = new Date().toISOString().split("T")[0];
  return (await getCourseCards(userId, course)).filter(card => card.nextReviewDate <= today);
}

/**
 * All of a learner's review cards owned by a course (due or not), using the same
 * ownership rule as getDueCards. Feeds the dashboard review-summary widget.
 */
export async function getCourseCards(
  userId: string,
  course: CourseDefinition = defaultCourse,
): Promise<ReviewCard[]> {
  const allCards = await getReviewCards(userId);
  const isLegacyOwnerCourse = course.id === LEGACY_DEFAULT_COURSE_ID;
  return allCards.filter(
    card => card.courseId === course.id || (isLegacyOwnerCourse && card.courseId == null),
  );
}

export async function addWrongAnswerToReview(
  userId: string,
  questionId: string,
  moduleId: string,
  courseId: CourseId = defaultCourse.id,
): Promise<void> {
  if (isPreviewAuthSession()) {
    addLocalPreviewWrongAnswerToReview(questionId, moduleId, courseId);
    return;
  }

  if (isAdminPreview()) return;
  // Check if card already exists — don't overwrite an existing card's scheduling
  // if it's not yet due (nextReviewDate is in the future).
  const cardRef = doc(db, "users", userId, "reviewCards", questionId);
  const existing = await getDoc(cardRef);
  if (existing.exists()) {
    const data = existing.data();
    const today = new Date().toISOString().split("T")[0];
    if (data.nextReviewDate && data.nextReviewDate > today) {
      // Card exists and isn't due yet — leave its scheduling alone
      return;
    }
    // Card exists but is currently due — apply a "again" (quality=1) review,
    // preserving its ease/repetition history rather than resetting from scratch.
    // Note: questionId is the doc ID, not a stored field — must add it back.
    const existingCard = {
      ...data,
      questionId,
      moduleId: data.moduleId || moduleId,
      courseId: data.courseId || courseId,
    } as ReviewCard;
    const card = calculateNextReview(existingCard, 1);
    await saveReviewCard(userId, card);
    return;
  }
  // Card doesn't exist — create a new one
  const card = createNewCard(questionId, moduleId, courseId);
  await saveReviewCard(userId, card);
}
