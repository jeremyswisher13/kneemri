import {
  collection, doc, getDoc, getDocs, setDoc, addDoc, query, where, serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { logAuditEvent } from "./audit";
import { prePostQuizQuestions } from "@/content/quizzes/pre-post-quiz";

// --- Quiz ---
export async function submitQuiz(
  userId: string,
  userEmail: string,
  quizType: "pre" | "post",
  answers: { questionId: string; selectedAnswer: string }[]
) {
  // Filter questions for this quiz type
  const validMappings = quizType === "pre"
    ? ["identical", "parallel-pre", "pre-only"]
    : ["identical", "parallel-post", "post-only"];
  const questions = prePostQuizQuestions.filter(q => validMappings.includes(q.prePostMapping));

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

  // Save to Firestore
  const attemptRef = await addDoc(collection(db, "users", userId, "quizAttempts"), {
    quizType,
    answers,
    score,
    totalQuestions: questions.length,
    completedAt: serverTimestamp(),
  });

  await logAuditEvent(userId, userEmail, "quiz_submitted", { quizType, score, totalQuestions: questions.length });

  return { score, totalQuestions: questions.length, results, attemptId: attemptRef.id };
}

// --- Survey ---
export async function submitSurvey(
  userId: string,
  userEmail: string,
  surveyType: "pre" | "post",
  responses: { statementId: string; rating: number }[]
) {
  await addDoc(collection(db, "users", userId, "surveyResponses"), {
    surveyType,
    responses,
    completedAt: serverTimestamp(),
  });

  await logAuditEvent(userId, userEmail, "survey_submitted", { surveyType });
  return { success: true };
}

// --- Module Progress ---
export async function completeModule(
  userId: string,
  userEmail: string,
  moduleId: string,
  quizScore?: number,
  quizTotal?: number
) {
  const moduleRef = doc(db, "users", userId, "moduleProgress", moduleId);
  await setDoc(moduleRef, {
    completed: true,
    quizScore: quizScore ?? null,
    quizTotal: quizTotal ?? null,
    completedAt: serverTimestamp(),
  }, { merge: true });

  await logAuditEvent(userId, userEmail, "module_completed", { moduleId, quizScore, quizTotal });
  return { success: true };
}

// --- Case Attempts ---
export async function submitCaseAttempt(
  userId: string,
  userEmail: string,
  caseId: string,
  searchPatternChecklist: Record<string, boolean>,
  report: string
) {
  const ref = await addDoc(collection(db, "users", userId, "caseAttempts"), {
    caseId,
    searchPatternChecklist,
    report,
    completedAt: serverTimestamp(),
  });

  await logAuditEvent(userId, userEmail, "case_submitted", { caseId });
  return { success: true, attemptId: ref.id };
}

// --- Progress ---
export async function getUserProgress(userId: string) {
  // Quiz attempts
  const quizSnap = await getDocs(collection(db, "users", userId, "quizAttempts"));
  const quizAttempts = quizSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const preQuiz = quizAttempts.find((a: any) => a.quizType === "pre");
  const postQuiz = quizAttempts.find((a: any) => a.quizType === "post");

  // Survey responses
  const surveySnap = await getDocs(collection(db, "users", userId, "surveyResponses"));
  const surveyResponses = surveySnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const preSurvey = surveyResponses.find((s: any) => s.surveyType === "pre");
  const postSurvey = surveyResponses.find((s: any) => s.surveyType === "post");

  // Module progress
  const moduleSnap = await getDocs(collection(db, "users", userId, "moduleProgress"));
  const moduleProgress = moduleSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const modulesCompleted = moduleProgress.filter((m: any) => m.completed).length;

  // Case attempts
  const caseSnap = await getDocs(collection(db, "users", userId, "caseAttempts"));
  const caseAttempts = caseSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const uniqueCases = new Set(caseAttempts.map((c: any) => c.caseId));

  // Cohort settings
  const settingsSnap = await getDoc(doc(db, "settings", "cohort"));
  const postQuizUnlocked = settingsSnap.exists() ? settingsSnap.data().postQuizUnlocked === true : false;

  return {
    preQuizCompleted: !!preQuiz,
    preQuizScore: (preQuiz as any)?.score ?? null,
    preQuizTotal: (preQuiz as any)?.totalQuestions ?? null,
    preSurveyCompleted: !!preSurvey,
    preSurveyResponses: (preSurvey as any)?.responses ?? null,
    postQuizCompleted: !!postQuiz,
    postQuizScore: (postQuiz as any)?.score ?? null,
    postSurveyCompleted: !!postSurvey,
    postQuizUnlocked,
    modulesCompleted,
    totalModules: 10,
    casesCompleted: uniqueCases.size,
    totalCases: 12,
    moduleProgress,
    caseAttempts,
  };
}

// --- Admin ---
export async function getAllFellows() {
  const q = query(collection(db, "users"), where("role", "==", "fellow"));
  const snap = await getDocs(q);
  const fellows = [];
  for (const userDoc of snap.docs) {
    const userData = userDoc.data();
    const progress = await getUserProgress(userDoc.id);
    fellows.push({
      id: userDoc.id,
      ...userData,
      ...progress,
    });
  }
  return fellows;
}

export async function togglePostQuizUnlock(userId: string, userEmail: string, unlocked: boolean) {
  await setDoc(doc(db, "settings", "cohort"), {
    postQuizUnlocked: unlocked,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  await logAuditEvent(userId, userEmail, "post_quiz_unlocked", { unlocked });
  return { success: true, postQuizUnlocked: unlocked };
}
