/**
 * Unified registry of everything that can land in the SM-2 spaced-review queue:
 * module-quiz questions, the workstation Knowledge Checks (visual "name the
 * marked structure" items), and the Advanced challenge banks.
 *
 * Module-quiz ids are globally unique, so their review cards keep their plain id
 * (backward compatible with existing data). Workstation/advanced item ids COLLIDE
 * across courses (both knee and shoulder have `axi-q1`, `t1-q1`, …), so their
 * cards are namespaced `${courseId}::${itemId}` — see `workstationReviewId`.
 */
import { moduleQuizzes } from "@/content/quizzes/module-quizzes";
import { normalKneeLearn, advancedChallenge, kneeImageCaq } from "@/content/normal-knee-learn";
import { normalShoulderLearn, shoulderAdvanced, shoulderImageCaq } from "@/content/normal-shoulder-learn";
import { normalHipLearn, hipAdvanced, hipImageCaq } from "@/content/normal-hip-learn";
import { normalElbowLearn, elbowAdvanced, elbowImageCaq } from "@/content/normal-elbow-learn";
import type { QuizItem, AdvancedQ, ImageCaqQ } from "@/content/normal-mri-types";
import { workstationReviewId } from "@/content/review-id";
import { moduleFlashcards } from "@/content/flashcards/module-flashcards";
import { prePostQuizQuestions as kneePrePostQuizQuestions } from "@/content/quizzes/pre-post-quiz";
import { shoulderPrePostQuizQuestions } from "@/content/shoulder/pre-post-quiz";
import { hipPrePostQuizQuestions } from "@/content/hip/pre-post-quiz";
import { elbowPrePostQuizQuestions } from "@/content/elbow/pre-post-quiz";
import { kneeModuleMetas, shoulderModuleMetas, hipModuleMetas, elbowModuleMetas } from "@/content/module-metas";

export { workstationReviewId };

export interface ReviewQuestion {
  stem: string;
  options: { key: string; text: string }[];
  correctAnswer: string; // the correct option key
  explanation: string;
  source: string; // shown above the card, e.g. "Knee MRI · Sagittal"
  /** For visual "name the marked structure" items — the slice + marker to show. */
  image?: { dir: string; sliceIndex: number; x: number; y: number };
  /** Flashcard cards carry a front/back pair instead of MCQ options. */
  flashcard?: { front: string; back: string };
  /** Remediation metadata: which module/topic/course the item belongs to. */
  moduleId?: string;
  topicIndex?: number;
  courseId?: string;
}

// Module id -> { courseId, title }, derived from the lightweight metas (a module
// id is globally unique across courses). Used for remediation metadata and the
// flashcard `source` label without pulling in the heavy course registry.
const MODULE_META_BY_ID: Record<string, { courseId: string; title: string }> = {};
for (const m of kneeModuleMetas) MODULE_META_BY_ID[m.id] = { courseId: "knee-mri", title: m.title };
for (const m of shoulderModuleMetas) MODULE_META_BY_ID[m.id] = { courseId: "shoulder-mri", title: m.title };
for (const m of hipModuleMetas) MODULE_META_BY_ID[m.id] = { courseId: "hip-mri", title: m.title };
for (const m of elbowModuleMetas) MODULE_META_BY_ID[m.id] = { courseId: "elbow-mri", title: m.title };

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const PLANE_DIR: Record<string, Record<string, string>> = {
  "knee-mri": {
    "sag-pdfs": "/images/teaching/stacks/normal-knee-sagittal",
    "cor-pdfs": "/images/teaching/stacks/normal-knee-coronal",
    "axi-t2fs": "/images/teaching/stacks/normal-knee-axial",
    "sag-t1": "/images/teaching/stacks/normal-knee-sagittal-t1",
  },
  "shoulder-mri": {
    "sag-t2fs": "/images/teaching/stacks/normal-shoulder-sagittal",
    "cor-t2fs": "/images/teaching/stacks/normal-shoulder-coronal",
    "axi-t2fs": "/images/teaching/stacks/normal-shoulder-axial",
    "sag-t1": "/images/teaching/stacks/normal-shoulder-sagittal-t1",
  },
  "hip-mri": {
    "cor-t2fs": "/images/teaching/stacks/normal-hip-coronal",
    axi: "/images/teaching/stacks/normal-hip-axial",
    sag: "/images/teaching/stacks/normal-hip-sagittal",
  },
  "elbow-mri": {
    "cor-t2fs": "/images/teaching/stacks/normal-elbow-coronal",
    "axi-t2fs": "/images/teaching/stacks/normal-elbow-axial",
    "sag-ir": "/images/teaching/stacks/normal-elbow-sagittal",
  },
};
const PLANE_LABEL: Record<string, string> = {
  "sag-ir": "Sagittal",
  "sag-pdfs": "Sagittal",
  "cor-pdfs": "Coronal",
  "axi-t2fs": "Axial",
  "sag-t1": "Sagittal T1",
  "sag-t2fs": "Sagittal",
  "cor-t2fs": "Coronal",
  axi: "Axial",
  sag: "Sagittal",
};

function fromMcq(prompt: string, options: string[], answer: number, explanation: string, source: string) {
  return {
    stem: prompt,
    options: options.map((text, i) => ({ key: LETTERS[i], text })),
    correctAnswer: LETTERS[answer] ?? LETTERS[0],
    explanation,
    source,
  };
}

function buildRegistry(): Record<string, ReviewQuestion> {
  const map: Record<string, ReviewQuestion> = {};

  // 1) Module quizzes — plain id (globally unique; backward compatible).
  for (const [moduleId, questions] of Object.entries(moduleQuizzes)) {
    const meta = MODULE_META_BY_ID[moduleId];
    for (const q of questions) {
      map[q.id] = {
        stem: q.stem,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        source: "Module quiz",
        moduleId,
        topicIndex: q.topicIndex,
        courseId: meta?.courseId,
      };
    }
  }

  // 2) Workstation Knowledge Checks — visual items, namespaced, with image.
  const courses: [string, Record<string, { quiz: QuizItem[] }>, string][] = [
    ["knee-mri", normalKneeLearn, "Knee MRI"],
    ["shoulder-mri", normalShoulderLearn, "Shoulder MRI"],
    ["hip-mri", normalHipLearn, "Hip MRI"],
    ["elbow-mri", normalElbowLearn, "Elbow MRI"],
  ];
  for (const [courseId, learn, courseLabel] of courses) {
    const dirs = PLANE_DIR[courseId];
    for (const [planeId, plane] of Object.entries(learn)) {
      const dir = dirs[planeId];
      const planeLabel = PLANE_LABEL[planeId] ?? planeId;
      for (const it of plane.quiz) {
        map[workstationReviewId(courseId, it.id)] = {
          ...fromMcq(it.prompt, it.options, it.answer, it.explanation, `${courseLabel} · ${planeLabel}`),
          ...(dir
            ? { image: { dir, sliceIndex: it.sliceIndex, x: it.marker.x, y: it.marker.y } }
            : {}),
        };
      }
    }
  }

  // 3) Advanced challenge banks — text MCQs, namespaced.
  const advanced: [string, AdvancedQ[], string][] = [
    ["knee-mri", advancedChallenge, "Knee MRI · Advanced"],
    ["shoulder-mri", shoulderAdvanced, "Shoulder MRI · Advanced"],
    ["hip-mri", hipAdvanced, "Hip MRI · Advanced"],
    ["elbow-mri", elbowAdvanced, "Elbow MRI · Advanced"],
  ];
  for (const [courseId, bank, source] of advanced) {
    for (const a of bank) {
      map[workstationReviewId(courseId, a.id)] = fromMcq(a.prompt, a.options, a.answer, a.explanation, source);
    }
  }

  // 3b) Image-anchored CAQ banks — the vignette is the stem (text MCQ in review).
  const imageCaqBanks: [string, ImageCaqQ[], string][] = [
    ["knee-mri", kneeImageCaq, "Knee MRI · Image CAQ"],
    ["shoulder-mri", shoulderImageCaq, "Shoulder MRI · Image CAQ"],
    ["hip-mri", hipImageCaq, "Hip MRI · Image CAQ"],
    ["elbow-mri", elbowImageCaq, "Elbow MRI · Image CAQ"],
  ];
  for (const [courseId, bank, source] of imageCaqBanks) {
    for (const q of bank) {
      map[workstationReviewId(courseId, q.id)] = fromMcq(q.vignette, q.options, q.answer, q.explanation, source);
    }
  }

  // 4) Flashcards — front/back recall cards, keyed by the stable `fc-…` id. The
  // `fc-` prefix guarantees no collision with any module-quiz / workstation id.
  for (const [moduleId, topics] of Object.entries(moduleFlashcards)) {
    const meta = MODULE_META_BY_ID[moduleId];
    for (const topic of topics) {
      for (const card of topic.cards) {
        map[card.id] = {
          stem: card.question,
          options: [],
          correctAnswer: "",
          explanation: "",
          source: `Flashcard · ${meta?.title ?? moduleId}`,
          flashcard: { front: card.question, back: card.answer },
          moduleId,
          topicIndex: topic.topicIndex,
          courseId: meta?.courseId,
        };
      }
    }
  }

  // 5) Pre/post assessment items — course-namespaced because the bank ids
  // (`q01`, `sh-q01`, …) collide across courses. No single source topic, so no
  // moduleId/topicIndex.
  const prePost: [string, typeof kneePrePostQuizQuestions][] = [
    ["knee-mri", kneePrePostQuizQuestions],
    ["shoulder-mri", shoulderPrePostQuizQuestions],
    ["hip-mri", hipPrePostQuizQuestions],
    ["elbow-mri", elbowPrePostQuizQuestions],
  ];
  for (const [courseId, bank] of prePost) {
    for (const q of bank) {
      map[workstationReviewId(courseId, `prepost-${q.id}`)] = {
        stem: q.stem,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        source: "Pre/Post assessment",
      };
    }
  }

  return map;
}

export const reviewQuestionById: Record<string, ReviewQuestion> = buildRegistry();
