export interface TimestampSeconds {
  seconds: number;
}

export interface SurveyResponse {
  statementId: string;
  rating: number;
}

export interface QuizResponse {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizAttempt {
  id: string;
  quizType?: "pre" | "post";
  score?: number;
  totalQuestions?: number;
  answers?: QuizResponse[];
  completedAt?: TimestampSeconds | null;
}

export interface SurveyAttempt {
  id: string;
  surveyType?: "pre" | "post";
  responses?: SurveyResponse[] | null;
  /** Post survey only: retrospective "then" ratings (see UserProgress.postRetroResponses). */
  retroResponses?: SurveyResponse[] | null;
  completedAt?: TimestampSeconds | null;
}

export interface ModuleProgressItem {
  id: string;
  completed?: boolean;
  quizScore?: number | null;
  quizTotal?: number | null;
  completedAt?: TimestampSeconds | null;
}

export interface CaseAttemptItem {
  id?: string;
  caseId: string;
  completedAt?: TimestampSeconds | null;
}

export interface UserProgress {
  preQuizCompleted: boolean;
  preQuizScore: number | null;
  preQuizTotal: number | null;
  preQuizCompletedAt?: TimestampSeconds | null;
  preSurveyCompleted: boolean;
  preSurveyResponses: SurveyResponse[] | null;
  preSurveyCompletedAt?: TimestampSeconds | null;
  /** Raw per-item pre-quiz answers (for item-level analysis). */
  preQuizResponses: QuizResponse[] | null;
  postQuizCompleted: boolean;
  postQuizScore: number | null;
  postQuizTotal: number | null;
  postQuizCompletedAt?: TimestampSeconds | null;
  /** Raw per-item post-quiz answers (for item-level analysis). */
  postQuizResponses: QuizResponse[] | null;
  postSurveyCompleted: boolean;
  postSurveyResponses: SurveyResponse[] | null;
  /**
   * Retrospective "then" ratings collected at post: the learner re-rates their
   * confidence as it was BEFORE the course, on the same post-course frame of
   * reference. Compared against postSurveyResponses for a response-shift-corrected
   * gain, and against preSurveyResponses to quantify the response shift itself.
   */
  postRetroResponses: SurveyResponse[] | null;
  postSurveyCompletedAt?: TimestampSeconds | null;
  postQuizUnlocked: boolean;
  modulesCompleted: number;
  totalModules: number;
  casesCompleted: number;
  totalCases: number;
  // Interactive Normal Knee MRI (knee course only). "Complete" = passed the
  // marker Knowledge Check on all planes. Required for completion; cases are not.
  normalMriComplete: boolean;
  normalPlanesPassed: number;
  totalNormalPlanes: number;
  moduleProgress: ModuleProgressItem[];
  caseAttempts: CaseAttemptItem[];
}
