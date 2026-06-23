// Exports source-backed review packets for medical QA.
//
// Outputs:
//   medical-qa/README.md
//   medical-qa/summary.json
//   medical-qa/review-items.csv
//   medical-qa/packets/<course-id>.md
//   medical-qa/packets/<course-id>.json
//
// Run from the app root:
//   npm run qa:medical
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const generatedDate = new Date().toISOString().slice(0, 10);
const qaRoot = resolve("medical-qa");
const packetDir = join(qaRoot, "packets");
mkdirSync(packetDir, { recursive: true });

const tmp = mkdtempSync(join(tmpdir(), "medical-qa-"));
const entry = join(tmp, "entry.ts");
writeFileSync(
  entry,
  `import { courseRegistry } from '@/content/courses';
import { moduleRegistry } from '@/content/modules';
import { shoulderModuleRegistry } from '@/content/shoulder/modules';
import { hipModuleRegistry } from '@/content/hip/modules';
import { elbowModuleRegistry } from '@/content/elbow/modules';
import { caseRegistry } from '@/content/cases';
import { shoulderCaseRegistry } from '@/content/shoulder/cases';
import { hipCaseRegistry } from '@/content/hip/cases';
import { elbowCaseRegistry } from '@/content/elbow/cases';
import { prePostQuizQuestions as kneePrePostQuizQuestions } from '@/content/quizzes/pre-post-quiz';
import { shoulderPrePostQuizQuestions } from '@/content/shoulder/pre-post-quiz';
import { hipPrePostQuizQuestions } from '@/content/hip/pre-post-quiz';
import { elbowPrePostQuizQuestions } from '@/content/elbow/pre-post-quiz';
import { confidenceStatements as kneeConfidenceStatements } from '@/content/quizzes/confidence-survey';
import { shoulderConfidenceStatements } from '@/content/shoulder/confidence-survey';
import { hipConfidenceStatements } from '@/content/hip/confidence-survey';
import { elbowConfidenceStatements } from '@/content/elbow/confidence-survey';
import { searchPatternSteps as kneeSearchPatternSteps } from '@/content/search-pattern';
import { shoulderSearchPatternSteps } from '@/content/shoulder/search-pattern';
import { hipSearchPatternSteps } from '@/content/hip/search-pattern';
import { elbowSearchPatternSteps } from '@/content/elbow/search-pattern';
import { moduleQuizzes } from '@/content/quizzes/module-quizzes';
import { moduleFlashcards } from '@/content/flashcards/module-flashcards';
import { shoulderModuleFlashcards } from '@/content/shoulder/flashcards';
import { hipModuleFlashcards } from '@/content/hip/flashcards';
import { redFlagsByRegion } from '@/content/red-flags';
import { surgicalCorrelatesByRegion } from '@/content/surgical-correlates';
import { dailyPearls, shoulderPearls, hipPearls, elbowPearls } from '@/content/daily-pearls';
import { faqKnowledgeBase } from '@/content/faq-knowledge-base';
import { reviewQuestionById } from '@/content/review-registry';
import { shoulderAnatomySections, shoulderMeasurementSections } from '@/content/shoulder/reference';
import { hipAnatomySections, hipMeasurementSections } from '@/content/hip/reference';
import { elbowAnatomySections, elbowMeasurementSections } from '@/content/elbow/reference';
import { normalKneeLearn, structurePearl, structureReading, structureCase, structureCorrelate, crossPlane, advancedChallenge, kneeImageCaq } from '@/content/normal-knee-learn';
import { normalShoulderLearn, structureShoulderPearl, structureShoulderReading, structureShoulderCase, shoulderStructureCorrelate, shoulderCrossPlane, shoulderAdvanced, shoulderImageCaq } from '@/content/normal-shoulder-learn';
import { normalHipLearn, structureHipPearl, structureHipReading, structureHipCase, hipStructureCorrelate, hipCrossPlane, hipAdvanced, hipImageCaq } from '@/content/normal-hip-learn';
import { normalElbowLearn, structureElbowPearl, structureElbowReading, structureElbowCase, elbowStructureCorrelate, elbowCrossPlane, elbowAdvanced, elbowImageCaq } from '@/content/normal-elbow-learn';

const courseMeta = courseRegistry.map((course) => ({
  id: course.id,
  title: course.title,
  shortTitle: course.shortTitle,
  dashboardTitle: course.dashboardTitle,
  description: course.description,
  audience: course.audience,
  bodyRegion: course.bodyRegion,
  status: course.status,
  features: course.features,
}));

export default {
  courseMeta,
  modules: {
    'knee-mri': moduleRegistry,
    'shoulder-mri': shoulderModuleRegistry,
    'hip-mri': hipModuleRegistry,
    'elbow-mri': elbowModuleRegistry,
  },
  cases: {
    'knee-mri': caseRegistry,
    'shoulder-mri': shoulderCaseRegistry,
    'hip-mri': hipCaseRegistry,
    'elbow-mri': elbowCaseRegistry,
  },
  prePostQuiz: {
    'knee-mri': kneePrePostQuizQuestions,
    'shoulder-mri': shoulderPrePostQuizQuestions,
    'hip-mri': hipPrePostQuizQuestions,
    'elbow-mri': elbowPrePostQuizQuestions,
  },
  confidence: {
    'knee-mri': kneeConfidenceStatements,
    'shoulder-mri': shoulderConfidenceStatements,
    'hip-mri': hipConfidenceStatements,
    'elbow-mri': elbowConfidenceStatements,
  },
  searchPatterns: {
    'knee-mri': kneeSearchPatternSteps,
    'shoulder-mri': shoulderSearchPatternSteps,
    'hip-mri': hipSearchPatternSteps,
    'elbow-mri': elbowSearchPatternSteps,
  },
  normal: {
    'knee-mri': {
      learn: normalKneeLearn,
      structurePearls: structurePearl,
      structureReadings: structureReading,
      structureCases: structureCase,
      structureCorrelates: structureCorrelate,
      crossPlane,
      advanced: advancedChallenge,
      imageCaq: kneeImageCaq,
    },
    'shoulder-mri': {
      learn: normalShoulderLearn,
      structurePearls: structureShoulderPearl,
      structureReadings: structureShoulderReading,
      structureCases: structureShoulderCase,
      structureCorrelates: shoulderStructureCorrelate,
      crossPlane: shoulderCrossPlane,
      advanced: shoulderAdvanced,
      imageCaq: shoulderImageCaq,
    },
    'hip-mri': {
      learn: normalHipLearn,
      structurePearls: structureHipPearl,
      structureReadings: structureHipReading,
      structureCases: structureHipCase,
      structureCorrelates: hipStructureCorrelate,
      crossPlane: hipCrossPlane,
      advanced: hipAdvanced,
      imageCaq: hipImageCaq,
    },
    'elbow-mri': {
      learn: normalElbowLearn,
      structurePearls: structureElbowPearl,
      structureReadings: structureElbowReading,
      structureCases: structureElbowCase,
      structureCorrelates: elbowStructureCorrelate,
      crossPlane: elbowCrossPlane,
      advanced: elbowAdvanced,
      imageCaq: elbowImageCaq,
    },
  },
  moduleQuizzes,
  flashcards: {
    'knee-mri': moduleFlashcards,
    'shoulder-mri': shoulderModuleFlashcards,
    'hip-mri': hipModuleFlashcards,
    'elbow-mri': {},
  },
  redFlagsByRegion,
  surgicalCorrelatesByRegion,
  pearls: {
    'knee-mri': dailyPearls,
    'shoulder-mri': shoulderPearls,
    'hip-mri': hipPearls,
    'elbow-mri': elbowPearls,
  },
  references: {
    'knee-mri': { anatomySections: [], measurementSections: [] },
    'shoulder-mri': { anatomySections: shoulderAnatomySections, measurementSections: shoulderMeasurementSections },
    'hip-mri': { anatomySections: hipAnatomySections, measurementSections: hipMeasurementSections },
    'elbow-mri': { anatomySections: elbowAnatomySections, measurementSections: elbowMeasurementSections },
  },
  faqKnowledgeBase,
  reviewQuestions: reviewQuestionById,
};
`,
);

const outDir = join(tmp, "out");
const outFile = join(outDir, "entry.mjs");
await build({
  configFile: false,
  copyPublicDir: false,
  logLevel: "error",
  resolve: { alias: { "@": resolve("src") } },
  build: {
    ssr: entry,
    outDir,
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: "entry.mjs",
        chunkFileNames: "chunk-[name].mjs",
      },
    },
  },
});

const data = (await import(pathToFileURL(outFile).href)).default;
rmSync(tmp, { recursive: true, force: true });

const courseById = Object.fromEntries(data.courseMeta.map((course) => [course.id, course]));
const moduleToCourse = {};
for (const [courseId, modules] of Object.entries(data.modules)) {
  for (const module of modules) moduleToCourse[module.id] = courseId;
}

const courseSourcePaths = {
  "knee-mri": {
    modules: "src/content/modules/index.ts",
    cases: "src/content/cases/index.ts",
    prePostQuiz: "src/content/quizzes/pre-post-quiz.ts",
    searchPattern: "src/content/search-pattern.ts",
  },
  "shoulder-mri": {
    modules: "src/content/shoulder/modules.ts",
    cases: "src/content/shoulder/cases.ts",
    prePostQuiz: "src/content/shoulder/pre-post-quiz.ts",
    searchPattern: "src/content/shoulder/search-pattern.ts",
  },
  "hip-mri": {
    modules: "src/content/hip/modules.ts",
    cases: "src/content/hip/cases.ts",
    prePostQuiz: "src/content/hip/pre-post-quiz.ts",
    searchPattern: "src/content/hip/search-pattern.ts",
  },
  "elbow-mri": {
    modules: "src/content/elbow/modules.ts",
    cases: "src/content/elbow/cases.ts",
    prePostQuiz: "src/content/elbow/pre-post-quiz.ts",
    searchPattern: "src/content/elbow/search-pattern.ts",
  },
};

const highRiskPattern =
  /\b(urgent|emergent|surgical|surgery|surgeon|refer|referral|vascular|artery|ischemia|limb|nerve|tumor|malign|infection|septic|fracture|dislocation|avulsion|rupture|complete tear|unstable|loose body|osteonecrosis|AVN|stress fracture|marrow-replacing|cord|cauda)\b/i;
const thresholdPattern =
  /(≥|<=|>=|>|<|\b\d+(?:\.\d+)?\s?(?:mm|cm|%|degrees|°)\b|Goutallier|alpha angle|ARCO|Latarjet|T-sign|O'Driscoll|Outerbridge|Wiberg|Dejour)/i;

const reviewItems = [];
const diagnostics = [];

function clean(value) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

function line(value = "") {
  return clean(value).replace(/\n{3,}/g, "\n\n");
}

function flatten(value) {
  if (value == null) return "";
  if (typeof value === "string") return clean(value);
  if (Array.isArray(value)) return value.map(flatten).filter(Boolean).join(" | ");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${flatten(v)}`)
      .filter((x) => !x.endsWith(": "))
      .join(" | ");
  }
  return String(value);
}

function mdList(items, indent = "") {
  const values = (items ?? []).filter((item) => item != null && clean(item) !== "");
  if (!values.length) return `${indent}- None recorded\n`;
  return values.map((item) => `${indent}- ${line(item).replace(/\n/g, `\n${indent}  `)}`).join("\n") + "\n";
}

function mdOptions(options, correctAnswer) {
  return mdList(
    (options ?? []).map((option, index) => {
      const key = option.key ?? String.fromCharCode(65 + index);
      const text = option.text ?? option;
      return `${key}. ${text}${key === correctAnswer ? " [CORRECT]" : ""}`;
    }),
  );
}

function mdIndexedOptions(options, answer) {
  return mdList(
    (options ?? []).map((option, index) => `${String.fromCharCode(65 + index)}. ${option}${index === answer ? " [CORRECT]" : ""}`),
  );
}

function isInternalCourseImage(image) {
  return typeof image?.src === "string" && image.src.startsWith("/images/modules/");
}

function imageSource(image) {
  if (image?.attribution) return `attribution=${flatten(image.attribution)}`;
  if (image?.sourceUrl) return `sourceUrl=${image.sourceUrl}`;
  if (isInternalCourseImage(image)) return "source=Course-authored diagram";
  return "";
}

function imageText(image) {
  if (!image) return "";
  return [
    image.src ? `src=${image.src}` : null,
    image.alt ? `alt=${image.alt}` : null,
    image.caption ? `caption=${image.caption}` : null,
    imageSource(image),
  ].filter(Boolean).join(" | ");
}

function flashcardFront(card) {
  return card?.front ?? card?.question ?? "";
}

function flashcardBack(card) {
  return card?.back ?? card?.answer ?? "";
}

function flashcardTopicTitle(topic) {
  if (topic?.topic) return topic.topic;
  if (Number.isInteger(topic?.topicIndex)) return `Topic ${topic.topicIndex + 1}`;
  return "Topic";
}

function addDiagnostic(courseId, itemType, itemId, severity, message) {
  diagnostics.push({ courseId, itemType, itemId, severity, message });
}

function addReviewItem({ courseId, itemType, itemId, section, title, text, sourcePath, flags = [] }) {
  const body = flatten(text);
  if (!body) return;
  const highRisk = highRiskPattern.test(body);
  const threshold = thresholdPattern.test(body);
  const risk = highRisk ? "high" : threshold ? "medium" : "standard";
  const allFlags = [...flags];
  if (highRisk) allFlags.push("high-risk-keyword");
  if (threshold) allFlags.push("numeric-threshold-or-named-criterion");
  reviewItems.push({
    course_id: courseId,
    course_title: courseById[courseId]?.title ?? courseId,
    item_type: itemType,
    item_id: itemId,
    section,
    title: clean(title),
    risk,
    requires_source_check: highRisk || threshold ? "yes" : "no",
    flags: [...new Set(allFlags)].join(";"),
    source_path: sourcePath,
    review_status: "",
    reviewer: "",
    reviewed_at: "",
    source_notes: "",
    reviewer_notes: "",
    text: body,
  });
}

function validateMcq(courseId, itemType, itemId, options, correctAnswer, explanation) {
  const keys = new Set((options ?? []).map((option) => option.key));
  if (!keys.has(correctAnswer)) {
    addDiagnostic(courseId, itemType, itemId, "error", `Correct answer "${correctAnswer}" is not present in options`);
  }
  if (!clean(explanation)) {
    addDiagnostic(courseId, itemType, itemId, "warning", "Question has no explanation");
  }
}

function validateIndexedAnswer(courseId, itemType, itemId, options, answer, explanation) {
  if (!Number.isInteger(answer) || answer < 0 || answer >= (options ?? []).length) {
    addDiagnostic(courseId, itemType, itemId, "error", `Answer index "${answer}" is outside options`);
  }
  if (!clean(explanation)) {
    addDiagnostic(courseId, itemType, itemId, "warning", "Question has no explanation");
  }
}

function maybeDiagnosticImages(courseId, itemType, itemId, images) {
  for (const [index, image] of (images ?? []).entries()) {
    if (!image.alt) addDiagnostic(courseId, itemType, `${itemId}:image:${index}`, "warning", "Image missing alt text");
    if (!image.caption) addDiagnostic(courseId, itemType, `${itemId}:image:${index}`, "warning", "Image missing caption");
    if (!imageSource(image)) addDiagnostic(courseId, itemType, `${itemId}:image:${index}`, "warning", "Image missing attribution/source");
  }
}

function buildPacket(courseId) {
  const course = courseById[courseId];
  const region = course.bodyRegion;
  const modules = data.modules[courseId] ?? [];
  const cases = data.cases[courseId] ?? [];
  const normal = data.normal[courseId] ?? {};
  const prePostQuiz = data.prePostQuiz[courseId] ?? [];
  const confidence = data.confidence[courseId] ?? [];
  const searchPattern = data.searchPatterns[courseId] ?? [];
  const redFlags = data.redFlagsByRegion[region] ?? [];
  const surgicalCorrelates = data.surgicalCorrelatesByRegion[region] ?? [];
  const pearls = data.pearls[courseId] ?? [];
  const references = data.references[courseId] ?? { anatomySections: [], measurementSections: [] };
  const flashcards = Object.fromEntries(
    Object.entries(data.flashcards[courseId] ?? {}).filter(([moduleId]) => moduleToCourse[moduleId] === courseId),
  );
  const moduleQuizzes = Object.fromEntries(
    Object.entries(data.moduleQuizzes ?? {}).filter(([moduleId]) => moduleToCourse[moduleId] === courseId),
  );
  const reviewQuestions = Object.fromEntries(
    Object.entries(data.reviewQuestions ?? {}).filter(([, q]) => q.courseId === courseId || (!q.courseId && courseId === "knee-mri")),
  );
  const packet = {
    generatedAt: generatedDate,
    course,
    modules,
    cases,
    normal,
    prePostQuiz,
    confidence,
    searchPattern,
    redFlags,
    surgicalCorrelates,
    pearls,
    references,
    moduleQuizzes,
    flashcards,
    reviewQuestions,
  };
  collectReviewItems(packet);
  return packet;
}

function collectReviewItems(packet) {
  const courseId = packet.course.id;

  addReviewItem({
    courseId,
    itemType: "course-overview",
    itemId: packet.course.id,
    section: "course",
    title: packet.course.title,
    text: [packet.course.description, packet.course.audience],
    sourcePath: "src/content/courses.ts",
  });

  for (const [index, step] of packet.searchPattern.entries()) {
    addReviewItem({
      courseId,
      itemType: "search-pattern-step",
      itemId: `step-${step.number ?? index + 1}`,
      section: "search-pattern",
      title: step.name,
      text: [step.description, step.checklistItems, step.pearls],
      sourcePath: searchPatternPath(courseId),
    });
  }

  for (const module of packet.modules) {
    const sourcePath = modulePath(courseId);
    addReviewItem({
      courseId,
      itemType: "module-summary",
      itemId: module.id,
      section: `module ${module.number}`,
      title: module.title,
      text: [module.subtitle, module.topics, module.learningObjectives],
      sourcePath,
    });
    for (const [i, mistake] of (module.commonMistakes ?? []).entries()) {
      addReviewItem({
        courseId,
        itemType: "module-common-mistake",
        itemId: `${module.id}:mistake:${i + 1}`,
        section: `module ${module.number}`,
        title: mistake.mistake,
        text: mistake.correction,
        sourcePath,
      });
    }
    for (const [i, topic] of (module.topicContent ?? []).entries()) {
      addReviewItem({
        courseId,
        itemType: "module-topic",
        itemId: `${module.id}:topic:${i + 1}`,
        section: `module ${module.number}`,
        title: module.topics?.[i] ?? `Topic ${i + 1}`,
        text: [topic.content, topic.pearl],
        sourcePath,
      });
      maybeDiagnosticImages(courseId, "module-topic", `${module.id}:topic:${i + 1}`, topic.images);
    }
  }

  for (const [moduleId, questions] of Object.entries(packet.moduleQuizzes)) {
    for (const question of questions) {
      validateMcq(courseId, "module-quiz", question.id, question.options, question.correctAnswer, question.explanation);
      addReviewItem({
        courseId,
        itemType: "module-quiz",
        itemId: question.id,
        section: `module quiz:${moduleId}`,
        title: question.stem,
        text: [question.stem, question.options?.map((o) => `${o.key}. ${o.text}`), `Correct: ${question.correctAnswer}`, question.explanation],
        sourcePath: "src/content/quizzes/module-quizzes.ts",
        flags: ["answer-key"],
      });
    }
  }

  for (const caseItem of packet.cases) {
    const sourcePath = casePath(courseId);
    addReviewItem({
      courseId,
      itemType: "case-summary",
      itemId: caseItem.id,
      section: "cases",
      title: caseItem.title,
      text: [caseItem.clinicalScenario, caseItem.keyDiagnoses, caseItem.tags],
      sourcePath,
    });
    addReviewItem({
      courseId,
      itemType: "case-model-report",
      itemId: `${caseItem.id}:report`,
      section: "cases",
      title: `${caseItem.title} model report`,
      text: [caseItem.modelReport?.findings, caseItem.modelReport?.impression],
      sourcePath,
      flags: ["report-language"],
    });
    for (const [i, point] of (caseItem.teachingPoints ?? []).entries()) {
      addReviewItem({
        courseId,
        itemType: "case-teaching-point",
        itemId: `${caseItem.id}:teaching:${i + 1}`,
        section: "cases",
        title: caseItem.title,
        text: point,
        sourcePath,
      });
    }
    for (const finding of caseItem.searchPatternFindings ?? []) {
      addReviewItem({
        courseId,
        itemType: "case-search-finding",
        itemId: `${caseItem.id}:step:${finding.step}`,
        section: "cases",
        title: `${caseItem.title} · ${finding.stepName}`,
        text: finding.expectedFindings,
        sourcePath,
      });
    }
    maybeDiagnosticImages(courseId, "case", caseItem.id, caseItem.teachingImages);
  }

  for (const [planeId, plane] of Object.entries(packet.normal.learn ?? {})) {
    for (const [i, step] of (plane.tour ?? []).entries()) {
      addReviewItem({
        courseId,
        itemType: "normal-tour-step",
        itemId: `${planeId}:tour:${i + 1}`,
        section: "normal-mri",
        title: step.title,
        text: [step.note, (step.markers ?? []).map((m) => m.label)],
        sourcePath: normalPath(courseId),
        flags: ["anatomy-label"],
      });
    }
    for (const q of plane.quiz ?? []) {
      validateIndexedAnswer(courseId, "normal-plane-quiz", q.id, q.options, q.answer, q.explanation);
      addReviewItem({
        courseId,
        itemType: "normal-plane-quiz",
        itemId: `${planeId}:${q.id}`,
        section: "normal-mri",
        title: q.prompt,
        text: [q.prompt, q.options, `Correct: ${q.options?.[q.answer] ?? q.answer}`, q.explanation],
        sourcePath: normalPath(courseId),
        flags: ["answer-key", "anatomy-label"],
      });
    }
  }

  for (const [structure, pearl] of Object.entries(packet.normal.structurePearls ?? {})) {
    addReviewItem({
      courseId,
      itemType: "normal-structure-pearl",
      itemId: structure,
      section: "normal-mri",
      title: structure,
      text: pearl,
      sourcePath: normalPath(courseId),
    });
  }
  for (const [structure, reading] of Object.entries(packet.normal.structureReadings ?? {})) {
    addReviewItem({
      courseId,
      itemType: "normal-structure-reading",
      itemId: structure,
      section: "normal-mri",
      title: structure,
      text: reading,
      sourcePath: normalPath(courseId),
    });
  }
  for (const [structure, correlate] of Object.entries(packet.normal.structureCorrelates ?? {})) {
    addReviewItem({
      courseId,
      itemType: "normal-structure-correlate",
      itemId: structure,
      section: "normal-mri",
      title: structure,
      text: correlate,
      sourcePath: normalPath(courseId),
    });
  }

  for (const q of packet.normal.advanced ?? []) {
    validateIndexedAnswer(courseId, "normal-advanced-question", q.id, q.options, q.answer, q.explanation);
    addReviewItem({
      courseId,
      itemType: "normal-advanced-question",
      itemId: q.id,
      section: "normal-mri",
      title: q.prompt,
      text: [q.topic, q.prompt, q.options, `Correct: ${q.options?.[q.answer] ?? q.answer}`, q.explanation],
      sourcePath: normalPath(courseId),
      flags: ["answer-key"],
    });
  }
  for (const q of packet.normal.imageCaq ?? []) {
    validateIndexedAnswer(courseId, "normal-image-caq", q.id, q.options, q.answer, q.explanation);
    addReviewItem({
      courseId,
      itemType: "normal-image-caq",
      itemId: q.id,
      section: "normal-mri",
      title: q.vignette,
      text: [q.topic, q.vignette, q.plane, q.options, `Correct: ${q.options?.[q.answer] ?? q.answer}`, q.explanation],
      sourcePath: normalPath(courseId),
      flags: ["answer-key", "image-anchored"],
    });
  }
  for (const q of packet.normal.crossPlane ?? []) {
    addReviewItem({
      courseId,
      itemType: "normal-cross-plane",
      itemId: q.id,
      section: "normal-mri",
      title: q.prompt,
      text: [q.prompt, q.explanation, q.from, q.to],
      sourcePath: normalPath(courseId),
      flags: ["anatomy-label"],
    });
  }

  for (const q of packet.prePostQuiz) {
    validateMcq(courseId, "pre-post-quiz", q.id, q.options, q.correctAnswer, q.explanation);
    addReviewItem({
      courseId,
      itemType: "pre-post-quiz",
      itemId: q.id,
      section: "assessment",
      title: q.stem,
      text: [q.stem, q.options?.map((o) => `${o.key}. ${o.text}`), `Correct: ${q.correctAnswer}`, q.explanation, q.domain, q.moduleId],
      sourcePath: prePostPath(courseId),
      flags: ["answer-key"],
    });
  }

  for (const redFlag of packet.redFlags) {
    addReviewItem({
      courseId,
      itemType: "red-flag",
      itemId: redFlag.finding,
      section: "red-flags",
      title: redFlag.finding,
      text: redFlag.action,
      sourcePath: "src/content/red-flags.ts",
      flags: ["high-stakes"],
    });
  }
  for (const correlate of packet.surgicalCorrelates) {
    addReviewItem({
      courseId,
      itemType: "surgical-correlate",
      itemId: correlate.id ?? correlate.title,
      section: "surgical-correlates",
      title: correlate.title ?? correlate.id,
      text: correlate,
      sourcePath: "src/content/surgical-correlates.ts",
      flags: ["management"],
    });
  }

  for (const [sectionName, sections] of Object.entries(packet.references)) {
    if (!Array.isArray(sections)) continue;
    for (const [i, section] of sections.entries()) {
      addReviewItem({
        courseId,
        itemType: `reference-${sectionName}`,
        itemId: `${sectionName}:${i + 1}`,
        section: "reference",
        title: section.title,
        text: section.items,
        sourcePath: referencePath(courseId),
      });
    }
  }

  for (const pearl of packet.pearls) {
    addReviewItem({
      courseId,
      itemType: "daily-pearl",
      itemId: pearl.id ?? pearl.title,
      section: "daily-pearls",
      title: pearl.title,
      text: pearl.text ?? pearl.content ?? pearl,
      sourcePath: "src/content/daily-pearls.ts",
    });
  }

  for (const [moduleId, topicCards] of Object.entries(packet.flashcards ?? {})) {
    for (const [topicIndex, topic] of (topicCards ?? []).entries()) {
      for (const [cardIndex, card] of (topic.cards ?? []).entries()) {
        addReviewItem({
          courseId,
          itemType: "flashcard",
          itemId: `${moduleId}:topic:${topicIndex + 1}:card:${cardIndex + 1}`,
          section: "spaced-review",
          title: flashcardFront(card),
          text: [flashcardFront(card), flashcardBack(card)],
          sourcePath: flashcardPath(courseId),
        });
      }
    }
  }

  for (const [id, q] of Object.entries(packet.reviewQuestions ?? {})) {
    addReviewItem({
      courseId,
      itemType: "review-registry-question",
      itemId: id,
      section: "spaced-review-registry",
      title: q.stem ?? q.flashcard?.front,
      text: [q.stem, q.options?.map((o) => `${o.key}. ${o.text}`), q.correctAnswer, q.explanation, q.flashcard],
      sourcePath: "src/content/review-registry.ts",
      flags: q.options ? ["answer-key"] : [],
    });
  }

  for (const item of data.faqKnowledgeBase ?? []) {
    const faqCourse = item.courseId ?? "knee-mri";
    if (faqCourse !== courseId) continue;
    addReviewItem({
      courseId,
      itemType: "faq",
      itemId: item.id,
      section: "faq",
      title: item.question,
      text: [item.question, item.answer],
      sourcePath: "src/content/faq-knowledge-base.ts",
    });
  }
}

function modulePath(courseId) {
  return courseSourcePaths[courseId]?.modules ?? "src/content/modules/index.ts";
}

function casePath(courseId) {
  return courseSourcePaths[courseId]?.cases ?? "src/content/cases/index.ts";
}

function normalPath(courseId) {
  const region = courseById[courseId]?.bodyRegion ?? courseId.split("-")[0];
  return `src/content/normal-${region}-learn.ts`;
}

function prePostPath(courseId) {
  return courseSourcePaths[courseId]?.prePostQuiz ?? "src/content/quizzes/pre-post-quiz.ts";
}

function searchPatternPath(courseId) {
  return courseSourcePaths[courseId]?.searchPattern ?? "src/content/search-pattern.ts";
}

function referencePath(courseId) {
  const region = courseById[courseId]?.bodyRegion;
  return region === "knee" ? "src/components/ui/VisualAtlas.tsx" : `src/content/${region}/reference.ts`;
}

function flashcardPath(courseId) {
  const region = courseById[courseId]?.bodyRegion;
  if (region === "knee") return "src/content/flashcards/module-flashcards.ts";
  return `src/content/${region}/flashcards.ts`;
}

function renderCourseMarkdown(packet) {
  const courseId = packet.course.id;
  const md = [];
  md.push(`# Medical QA Packet: ${packet.course.title}\n`);
  md.push(`Generated: ${packet.generatedAt}\n`);
  md.push(`Course ID: \`${courseId}\`  \nBody region: \`${packet.course.bodyRegion}\`  \nAudience: ${packet.course.audience}\n`);
  md.push("> This packet is for physician/MSK radiology review. It does not certify accuracy until each flagged item has source notes and reviewer sign-off.\n\n");

  md.push("## Reviewer Sign-Off\n\n");
  md.push("- Reviewer:\n- Role:\n- Date:\n- Overall status: Pending / Approved / Needs revision\n- Notes:\n\n");

  const courseDiagnostics = diagnostics.filter((d) => d.courseId === courseId);
  const courseReviewItems = reviewItems.filter((item) => item.course_id === courseId);
  md.push("## Automated QA Summary\n\n");
  md.push(`- Review queue items: ${courseReviewItems.length}\n`);
  md.push(`- High-risk keyword items: ${courseReviewItems.filter((item) => item.risk === "high").length}\n`);
  md.push(`- Numeric threshold / named-criterion items: ${courseReviewItems.filter((item) => item.flags.includes("numeric-threshold-or-named-criterion")).length}\n`);
  md.push(`- Diagnostics: ${courseDiagnostics.length}\n\n`);
  if (courseDiagnostics.length) {
    md.push("### Diagnostics\n\n");
    for (const d of courseDiagnostics) md.push(`- **${d.severity.toUpperCase()}** ${d.itemType} \`${d.itemId}\`: ${d.message}\n`);
    md.push("\n");
  }

  md.push("## Course Overview\n\n");
  md.push(`**Description:** ${packet.course.description}\n\n`);
  md.push("### Search Pattern\n\n");
  for (const step of packet.searchPattern) {
    md.push(`#### ${step.number}. ${step.name}\n\n${line(step.description)}\n\n`);
    md.push("Checklist:\n");
    md.push(mdList(step.checklistItems));
    md.push("Pearls:\n");
    md.push(mdList(step.pearls));
    md.push("\n");
  }

  md.push("## Modules\n\n");
  for (const module of packet.modules) {
    md.push(`### Module ${module.number}: ${module.title}\n\n`);
    md.push(`**Subtitle:** ${module.subtitle}  \n**Estimated minutes:** ${module.estimatedMinutes}\n\n`);
    md.push("Learning objectives:\n");
    md.push(mdList(module.learningObjectives));
    md.push("Topics:\n");
    md.push(mdList(module.topics));
    if ((module.commonMistakes ?? []).length) {
      md.push("Common mistakes:\n");
      for (const m of module.commonMistakes) md.push(`- **Mistake:** ${line(m.mistake)}\n  **Correction:** ${line(m.correction)}\n`);
      md.push("\n");
    }
    for (const [i, topic] of (module.topicContent ?? []).entries()) {
      md.push(`#### Topic ${i + 1}: ${module.topics?.[i] ?? "Untitled"}\n\n`);
      md.push(`${line(topic.content)}\n\n`);
      if (topic.pearl) md.push(`**Pearl:** ${line(topic.pearl)}\n\n`);
      if ((topic.images ?? []).length) {
        md.push("Images:\n");
        md.push(mdList(topic.images.map(imageText)));
        md.push("\n");
      }
    }
  }

  md.push("## Cases\n\n");
  for (const caseItem of packet.cases) {
    md.push(`### ${caseItem.title}\n\n`);
    md.push(`ID: \`${caseItem.id}\` · Difficulty: ${caseItem.difficulty} · Tier: ${caseItem.tier} · Resident visible: ${caseItem.residentVisible}\n\n`);
    md.push(`Clinical scenario: ${line(caseItem.clinicalScenario)}\n\n`);
    md.push("Key diagnoses:\n");
    md.push(mdList(caseItem.keyDiagnoses));
    md.push("Search pattern findings:\n");
    for (const finding of caseItem.searchPatternFindings ?? []) {
      md.push(`- **Step ${finding.step}: ${finding.stepName}**\n`);
      md.push(mdList(finding.expectedFindings, "  "));
    }
    md.push("\nModel report findings:\n\n");
    md.push(`${line(caseItem.modelReport?.findings)}\n\n`);
    md.push("Model report impression:\n\n");
    md.push(`${line(caseItem.modelReport?.impression)}\n\n`);
    md.push("Teaching points:\n");
    md.push(mdList(caseItem.teachingPoints));
    if ((caseItem.teachingImages ?? []).length || (caseItem.teachingStacks ?? []).length) {
      md.push("Teaching media:\n");
      md.push(mdList([...(caseItem.teachingImages ?? []), ...(caseItem.teachingStacks ?? [])].map(imageText)));
    }
    md.push("\n");
  }

  md.push("## Normal MRI Workstation\n\n");
  for (const [planeId, plane] of Object.entries(packet.normal.learn ?? {})) {
    md.push(`### Plane: ${planeId}\n\n`);
    md.push("Guided tour:\n");
    for (const [i, step] of (plane.tour ?? []).entries()) {
      md.push(`- **${i + 1}. ${step.title}** (slice ${step.sliceIndex}) ${line(step.note)}\n`);
      if ((step.markers ?? []).length) md.push(mdList(step.markers.map((m) => `${m.label ?? "(unlabeled)"} @ x=${m.x}, y=${m.y}`), "  "));
    }
    md.push("\nKnowledge check:\n");
    for (const q of plane.quiz ?? []) {
      md.push(`- **${q.id}:** ${line(q.prompt)} (slice ${q.sliceIndex})\n`);
      md.push(mdIndexedOptions(q.options, q.answer).replace(/^/gm, "  "));
      md.push(`  Explanation: ${line(q.explanation)}\n`);
    }
    md.push("\n");
  }

  md.push("### Structure Pearls / Readings / Correlates\n\n");
  for (const [structure, pearl] of Object.entries(packet.normal.structurePearls ?? {})) {
    md.push(`- **${structure}:** ${line(pearl)}\n`);
  }
  for (const [structure, reading] of Object.entries(packet.normal.structureReadings ?? {})) {
    md.push(`- **${structure} reading:** ${line(flatten(reading))}\n`);
  }
  for (const [structure, correlate] of Object.entries(packet.normal.structureCorrelates ?? {})) {
    md.push(`- **${structure} correlate:** ${line(flatten(correlate))}\n`);
  }
  md.push("\n");

  md.push("### Advanced / Image CAQ / Cross-Plane Items\n\n");
  for (const q of packet.normal.advanced ?? []) {
    md.push(`#### Advanced: ${q.id} · ${q.topic}\n\n${line(q.prompt)}\n\n`);
    md.push(mdIndexedOptions(q.options, q.answer));
    md.push(`Explanation: ${line(q.explanation)}\n\n`);
  }
  for (const q of packet.normal.imageCaq ?? []) {
    md.push(`#### Image CAQ: ${q.id} · ${q.topic}\n\n${line(q.vignette)}\n\nPlane: ${q.plane} · Stack: ${q.dir} · startIndex: ${q.startIndex}\n\n`);
    md.push(mdIndexedOptions(q.options, q.answer));
    md.push(`Explanation: ${line(q.explanation)}\n\n`);
  }
  for (const q of packet.normal.crossPlane ?? []) {
    md.push(`#### Cross-plane: ${q.id}\n\n${line(q.prompt)}\n\n${line(q.explanation)}\n\n`);
  }

  md.push("## Assessments\n\n");
  md.push("### Pre/Post Knowledge Items\n\n");
  for (const q of packet.prePostQuiz) {
    md.push(`#### ${q.id} · ${q.prePostMapping} · ${q.domain}\n\n${line(q.stem)}\n\n`);
    md.push(mdOptions(q.options, q.correctAnswer));
    md.push(`Explanation: ${line(q.explanation)}\n\n`);
  }
  md.push("### Confidence Statements\n\n");
  for (const item of packet.confidence) md.push(`- **${item.id} (${item.domain}):** ${item.statement}\n`);
  md.push("\n");

  md.push("## Red Flags\n\n");
  for (const flag of packet.redFlags) md.push(`- **${flag.finding}:** ${flag.action}\n`);
  md.push("\n");

  md.push("## Quick Reference\n\n");
  for (const [sectionName, sections] of Object.entries(packet.references)) {
    if (!Array.isArray(sections) || !sections.length) continue;
    md.push(`### ${sectionName}\n\n`);
    for (const section of sections) {
      md.push(`#### ${section.title}\n`);
      for (const item of section.items ?? []) md.push(`- **${item.label}:** ${item.detail}\n`);
      md.push("\n");
    }
  }

  md.push("## Daily Pearls\n\n");
  for (const pearl of packet.pearls) md.push(`- **${pearl.title ?? pearl.id}:** ${pearl.text ?? pearl.content ?? flatten(pearl)}\n`);
  md.push("\n");

  md.push("## Module Flashcards\n\n");
  for (const [moduleId, topics] of Object.entries(packet.flashcards ?? {})) {
    md.push(`### ${moduleId}\n\n`);
    for (const topic of topics ?? []) {
      md.push(`#### ${flashcardTopicTitle(topic)}\n`);
      for (const card of topic.cards ?? []) md.push(`- **Front:** ${flashcardFront(card)}\n  **Back:** ${flashcardBack(card)}\n`);
    }
    md.push("\n");
  }

  return md.join("");
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function writeCsv(items) {
  const headers = [
    "course_id",
    "course_title",
    "item_type",
    "item_id",
    "section",
    "title",
    "risk",
    "requires_source_check",
    "flags",
    "source_path",
    "review_status",
    "reviewer",
    "reviewed_at",
    "source_notes",
    "reviewer_notes",
    "text",
  ];
  const rows = [headers.map(csvEscape).join(",")];
  for (const item of items) rows.push(headers.map((header) => csvEscape(item[header])).join(","));
  writeFileSync(join(qaRoot, "review-items.csv"), rows.join("\n") + "\n");
}

const packets = {};
for (const courseId of ["knee-mri", "shoulder-mri", "hip-mri", "elbow-mri"]) {
  const packet = buildPacket(courseId);
  packets[courseId] = packet;
  writeFileSync(join(packetDir, `${courseId}.json`), JSON.stringify(packet, null, 2) + "\n");
  writeFileSync(join(packetDir, `${courseId}.md`), renderCourseMarkdown(packet));
}

const summary = {
  generatedAt: generatedDate,
  courses: Object.fromEntries(
    Object.entries(packets).map(([courseId, packet]) => [
      courseId,
      {
        title: packet.course.title,
        modules: packet.modules.length,
        cases: packet.cases.length,
        prePostQuizItems: packet.prePostQuiz.length,
        normalPlanes: Object.keys(packet.normal.learn ?? {}).length,
        normalPlaneQuizItems: Object.values(packet.normal.learn ?? {}).reduce((sum, plane) => sum + (plane.quiz?.length ?? 0), 0),
        advancedItems: packet.normal.advanced?.length ?? 0,
        imageCaqItems: packet.normal.imageCaq?.length ?? 0,
        redFlags: packet.redFlags.length,
        reviewItems: reviewItems.filter((item) => item.course_id === courseId).length,
        highRiskItems: reviewItems.filter((item) => item.course_id === courseId && item.risk === "high").length,
        sourceCheckItems: reviewItems.filter((item) => item.course_id === courseId && item.requires_source_check === "yes").length,
        diagnostics: diagnostics.filter((d) => d.courseId === courseId).length,
      },
    ]),
  ),
  totals: {
    reviewItems: reviewItems.length,
    highRiskItems: reviewItems.filter((item) => item.risk === "high").length,
    sourceCheckItems: reviewItems.filter((item) => item.requires_source_check === "yes").length,
    diagnostics: diagnostics.length,
    diagnosticErrors: diagnostics.filter((d) => d.severity === "error").length,
    diagnosticWarnings: diagnostics.filter((d) => d.severity === "warning").length,
  },
  diagnostics,
};

writeFileSync(join(qaRoot, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
writeCsv(reviewItems);

writeFileSync(
  join(qaRoot, "README.md"),
  `# UCLA Sports MRI Courses Medical QA\n\nGenerated: ${generatedDate}\n\nThis folder is generated by \`npm run qa:medical\`.\n\n## Files\n\n- \`packets/*.md\`: human-readable course review packets.\n- \`packets/*.json\`: machine-readable course packets for downstream tools.\n- \`review-items.csv\`: spreadsheet-ready review queue with blank reviewer/source-note columns.\n- \`summary.json\`: counts and automated diagnostics.\n\n## Intended Workflow\n\n1. Start with \`summary.json\` and resolve any diagnostic errors.\n2. Sort \`review-items.csv\` by \`risk\` and \`requires_source_check\`.\n3. Physician/MSK radiology reviewer fills \`review_status\`, \`reviewer\`, \`reviewed_at\`, \`source_notes\`, and \`reviewer_notes\`.\n4. Apply content fixes in \`src/content/**\`.\n5. Regenerate packets and confirm changed rows are reviewed.\n\n## Important Limits\n\nAutomated QA can catch answer-key, attribution, and consistency issues, and it can flag high-risk/source-needed claims. It cannot prove that medical teaching content is correct. Final approval requires human clinical review with source notes.\n`,
);

console.log(`Wrote medical QA packets to ${qaRoot}`);
console.log(JSON.stringify(summary.totals, null, 2));
