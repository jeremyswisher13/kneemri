import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Link, Navigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MarkdownContent from "@/components/ui/MarkdownContent";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import { moduleQuizzes, type ModuleQuizQuestion } from "@/content/quizzes/module-quizzes";
import { moduleContentById } from "@/content/modules/content-by-id";
import { getFlashcardsForTopic } from "@/content/flashcards/module-flashcards";
import FlashcardSet from "@/components/ui/FlashcardSet";
import ModuleInteractive from "@/components/normal/ModuleInteractive";
import { moduleInteractives } from "@/content/module-interactives";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useActiveCourse } from "@/hooks/useActiveCourse";
import { useIsAdminView } from "@/hooks/useIsAdminView";
import { coursePath, courseRegistry } from "@/content/courses";
import { completeModule, addWrongAnswerToReview } from "@/lib/firestore";

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, role } = useAuth();
  const isResident = role === "resident";
  const activeCourse = useActiveCourse();
  const isAdminView = useIsAdminView();
  const { progress, loading: progressLoading, refresh } = useProgress(activeCourse);
  const modules = activeCourse.modules;

  const moduleIndex = modules.findIndex((m) => m.id === moduleId);
  // Lightweight metas drive the prev/next nav; the full module content (heavy
  // topicContent) is loaded here, in this lazy page chunk, not the eager bundle.
  // (Invalid ids resolve to undefined at runtime; the `if (!mod)` guard below
  // handles that, mirroring the previous modules[index] behavior.)
  const mod = moduleContentById[moduleId ?? ""];
  const prevModule = moduleIndex > 0 ? modules[moduleIndex - 1] : null;
  const nextModule =
    moduleIndex < modules.length - 1
      ? modules[moduleIndex + 1]
      : null;

  const [completing, setCompleting] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());

  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    total: number;
    details: { question: ModuleQuizQuestion; selected: string; correct: boolean }[];
  } | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);

  const quizSectionRef = useRef<HTMLDivElement>(null);
  // Per-topic section refs (keyed by the topic's original index) so the quiz
  // "Review this topic" link and the inbound ?topic=N param can scroll to a section.
  const topicSectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [searchParams] = useSearchParams();

  // Expand a topic and scroll its section into view. Used by the quiz-results
  // remediation links and the inbound ?topic=N deep link (from the Review page).
  const openAndScrollToTopic = useCallback((index: number) => {
    setExpandedTopics((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setTimeout(() => {
      topicSectionRefs.current.get(index)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  // Track previous moduleId to reset state SYNCHRONOUSLY on navigation
  // (useEffect runs after render, which would leave stale indices during the first render)
  const prevModuleIdRef = useRef(moduleId);
  if (prevModuleIdRef.current !== moduleId) {
    prevModuleIdRef.current = moduleId;
    // These are the same resets as before, but happen during render — not after
    setQuizMode(false);
    setCurrentQuestion(0);
    setAnswers({});
    setCheckedQuestions({});
    setFeedbackShown(false);
    setQuizResults(null);
    setQuizError(null);
    setCompleting(false);
    setExpandedTopics(new Set());
  }

  // Warn before navigating away from an in-progress quiz
  useEffect(() => {
    const hasAnswers = Object.keys(answers).length > 0;
    if (!hasAnswers || quizResults) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [answers, quizResults]);

  // Scroll to top when navigating between modules
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleId]);

  // Inbound ?topic=N deep link (e.g. from the Review page "Review this topic"):
  // expand topic N and scroll to it once the section refs are mounted.
  const topicParam = searchParams.get("topic");
  useEffect(() => {
    if (topicParam == null) return;
    const idx = Number(topicParam);
    if (!Number.isInteger(idx) || idx < 0) return;
    openAndScrollToTopic(idx);
    // moduleId in deps so a deep link still fires after a same-page module switch.
  }, [topicParam, moduleId, openAndScrollToTopic]);

  const moduleProgress = progress?.moduleProgress?.find(
    (m) => m.id === moduleId
  );
  const completed = !progressLoading && moduleProgress?.completed;
  const previousScore = moduleProgress?.quizScore;
  const previousTotal = moduleProgress?.quizTotal;

  const questions = moduleId ? moduleQuizzes[moduleId] || [] : [];

  // Filter quiz questions for residents to only include questions about essential topics
  const filteredQuestions = isResident && mod?.essentialTopics
    ? questions.filter(q => mod.essentialTopics!.includes(q.topicIndex))
    : questions;

  // Clamp currentQuestion to valid range (prevents crash if stale index survives a module switch)
  const safeCurrentQuestion = Math.min(currentQuestion, Math.max(0, filteredQuestions.length - 1));

  /* ---- Cross-course canonicalization ----
     The bare /modules/:id route carries no :courseId, so activeCourse defaults
     to knee. moduleContentById is a global map, so a module owned by another
     course would otherwise render under the wrong course (wrong prev/next, wrong
     completion attribution) — redirect to its canonical course-scoped URL. */
  if (mod && moduleId && !modules.some((m) => m.id === moduleId)) {
    const owning = courseRegistry.find((co) => co.modules.some((m) => m.id === moduleId));
    if (owning) return <Navigate to={coursePath(owning, `/modules/${moduleId}`)} replace />;
  }

  if (!mod) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Module Not Found</h1>
        <p className="mt-2 text-gray-500">
          The requested module could not be found.
        </p>
        <Link to={coursePath(activeCourse, "/modules")} className="mt-4 inline-block">
          <Button variant="secondary">Back to Modules</Button>
        </Link>
      </div>
    );
  }

  // Filter topics for residents
  const visibleTopicIndices = isResident && mod?.essentialTopics
    ? mod.essentialTopics
    : mod?.topics.map((_, i) => i) ?? [];
  const visibleTopics = visibleTopicIndices.map((i) => ({ originalIndex: i, name: mod?.topics[i] ?? "" }));

  function toggleTopic(index: number) {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function expandAll() {
    setExpandedTopics(new Set(visibleTopicIndices));
  }

  function collapseAll() {
    setExpandedTopics(new Set());
  }

  function startQuiz() {
    if (filteredQuestions.length === 0) return; // Safety: no questions to show
    setQuizMode(true);
    setCurrentQuestion(0);
    setAnswers({});
    setCheckedQuestions({});
    setFeedbackShown(false);
    setQuizResults(null);
    setTimeout(() => {
      quizSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function checkAnswer() {
    const q = filteredQuestions[safeCurrentQuestion];
    setCheckedQuestions((prev) => ({
      ...prev,
      [q.id]: answers[q.id] === q.correctAnswer,
    }));
    setFeedbackShown(true);
  }

  function advanceQuestion() {
    setFeedbackShown(false);
    if (safeCurrentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion((p) => p + 1);
    }
  }

  // Running score from checked questions
  const runningCorrect = Object.values(checkedQuestions).filter(Boolean).length;
  const runningChecked = Object.keys(checkedQuestions).length;

  async function submitQuiz() {
    if (!user || filteredQuestions.length === 0) return;
    setCompleting(true);
    setQuizError(null);

    const details = filteredQuestions.map((q) => ({
      question: q,
      selected: answers[q.id] || "",
      correct: answers[q.id] === q.correctAnswer,
    }));
    const score = details.filter((d) => d.correct).length;
    const total = filteredQuestions.length;

    try {
      if (!isAdminView) {
        await completeModule(user.uid, user.email || "", mod.id, score, total, activeCourse.id);
      }

      // Add wrong answers to spaced repetition review system (non-blocking —
      // don't let review-card failures prevent showing quiz results).
      if (activeCourse.features.reviewCards && !isAdminView) {
        const wrongAnswers = details.filter((d) => !d.correct);
        await Promise.all(
          wrongAnswers.map((d) =>
            addWrongAnswerToReview(user.uid, d.question.id, mod.id, activeCourse.id).catch((err) =>
              console.error("Failed to save review card:", err)
            )
          )
        );
      }

      if (!isAdminView) {
        await refresh();
      }

      // Learners see results only after the write succeeds; admins never write.
      setQuizResults({ score, total, details });
    } catch {
      setQuizError("Failed to save your quiz results. Please check your connection and try again.");
    } finally {
      setCompleting(false);
    }
  }

  // Adapt ModuleQuizQuestion to QuizQuestionType for the QuizQuestion component
  function toQuizQuestionType(q: ModuleQuizQuestion) {
    return {
      ...q,
      domain: "",
      prePostMapping: "identical" as const,
    };
  }

  // Use real topic content from the module registry
  const topicTeachingContent: Record<number, import("@/content/modules").TopicContent> = {};
  mod.topics.forEach((_topic, i) => {
    topicTeachingContent[i] = mod.topicContent?.[i] ?? { content: 'Content coming soon.' };
  });

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to={coursePath(activeCourse, "/modules")} className="hover:text-ucla-blue transition-colors">
          Modules
        </Link>
        <span>/</span>
        <span className="text-gray-600">Module {mod.number}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ucla-blue text-white text-sm font-bold">
            {mod.number}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{mod.title}</h1>
            <p className="text-gray-500">{mod.subtitle}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {mod.estimatedMinutes} min estimated
          </span>
          <span>{visibleTopics.length} topics</span>
          {completed && (
            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              Completed
              {previousScore != null && previousTotal != null && (
                <span className="ml-1 text-gray-500 font-normal">
                  ({previousScore}/{previousTotal})
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Search-pattern anchor — ties this module to its step in the systematic read */}
      {mod.searchPatternStep != null && (
        <div className="mb-4">
          <Link
            to={coursePath(activeCourse, `/search-pattern?step=${mod.searchPatternStep}`)}
            className="inline-flex items-center gap-2 rounded-full border border-ucla-blue/25 bg-ucla-blue/5 px-3 py-1.5 text-xs font-medium text-ucla-blue transition-colors hover:bg-ucla-blue/10"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            </svg>
            Step {mod.searchPatternStep} of the systematic search pattern
          </Link>
        </div>
      )}

      {/* Resident track badge */}
      {isResident && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          Resident Track — Essential Topics
        </div>
      )}

      {/* Learning Objectives */}
      {mod.learningObjectives && mod.learningObjectives.length > 0 && (
        <div className="mb-6 rounded-xl border border-ucla-blue/20 bg-ucla-light/50 p-5">
          <h3 className="text-sm font-bold text-ucla-dark mb-3 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            Learning Objectives
          </h3>
          <p className="text-xs text-gray-500 mb-2">After this module, you will be able to:</p>
          <ul className="space-y-1.5">
            {mod.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-ucla-blue" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expand/Collapse All Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={expandedTopics.size === visibleTopics.length ? collapseAll : expandAll}
          className="text-sm text-ucla-blue hover:underline"
        >
          {expandedTopics.size === visibleTopics.length ? "Collapse all sections" : "Expand all sections"}
        </button>
      </div>

      {/* Topics as expandable sections */}
      <div className="space-y-3">
        {visibleTopics.map(({ originalIndex: i, name: topic }, displayIndex) => {
          const isExpanded = expandedTopics.has(i);
          const teaching = topicTeachingContent[i];

          const topicFlashcards = moduleId ? getFlashcardsForTopic(moduleId, i) : [];
          // Per-topic read-time so a fellow studying in short snatches can pick a
          // topic that fits before the next patient (module-level time is too coarse).
          const readMins = Math.max(
            1,
            Math.round(teaching.content.trim().split(/\s+/).filter(Boolean).length / 200),
          );

          return (
            <div
              key={i}
              className="space-y-3 scroll-mt-20"
              ref={(el) => {
                if (el) topicSectionRefs.current.set(i, el);
                else topicSectionRefs.current.delete(i);
              }}
            >
            <Card className="overflow-hidden !p-0">
              <button
                onClick={() => toggleTopic(i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ucla-light text-ucla-blue text-xs font-semibold">
                    {displayIndex + 1}
                  </span>
                  <span className="font-medium text-gray-900">{topic}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 tabular-nums">
                    ~{readMins} min
                  </span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-6 py-4">
                  <MarkdownContent content={teaching.content} />

                  {(moduleInteractives[moduleId ?? ""]?.[i] ?? []).map((block, bi) => (
                    <ModuleInteractive key={bi} block={block} />
                  ))}

                  {teaching.images && teaching.images.length > 0 && (() => {
                    const imageCount = teaching.images!.length;
                    return (
                      <details open className="mt-4 group">
                        <summary className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-blue-300 bg-blue-50 px-5 py-3.5 text-base font-semibold text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-all shadow-sm">
                          <svg className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                          📷 Teaching Images ({imageCount} {imageCount === 1 ? 'image' : 'images'}) — click to collapse
                        </summary>
                        <div className="mt-3 space-y-4">
                          {teaching.images!.map((img, idx) => (
                            <figure key={idx} className="overflow-hidden rounded-lg border border-gray-200">
                              <img
                                src={img.src}
                                alt={img.alt}
                                loading="lazy"
                                className="w-full"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                              <figcaption className="bg-gray-50 px-4 py-2 text-xs text-gray-500">
                                {img.caption}
                                {img.attribution && (
                                  <span className="text-gray-500"> — {img.attribution}</span>
                                )}
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                      </details>
                    );
                  })()}

                  {teaching.pearl && (
                    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                      <div className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 shrink-0 text-amber-600 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-amber-800">
                            Clinical Pearl
                          </p>
                          <p className="mt-1 text-sm text-amber-700">
                            {teaching.pearl}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
            {topicFlashcards.length > 0 && (
              <FlashcardSet
                key={`${moduleId}-${i}`}
                cards={topicFlashcards}
                topicName={topic}
                onNeedsReview={
                  user && activeCourse.features.reviewCards
                    ? (cardId) =>
                        addWrongAnswerToReview(user.uid, cardId, mod.id, activeCourse.id).catch(
                          (err) => console.error("Failed to save review card:", err),
                        )
                    : undefined
                }
              />
            )}
            </div>
          );
        })}
      </div>

      {/* Common Mistakes */}
      {mod.commonMistakes && mod.commonMistakes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            Common Mistakes to Avoid
          </h3>
          <div className="space-y-3">
            {mod.commonMistakes.map((item, i) => (
              <div key={i} className="rounded-lg border border-red-100 bg-red-50/50 p-4">
                <p className="text-sm font-medium text-red-800">
                  <span className="text-red-500">{"\u2717"}</span> {item.mistake}
                </p>
                <p className="mt-1.5 text-sm text-green-800 bg-green-50 rounded px-3 py-2 border border-green-100">
                  <span className="text-green-600 font-medium">{"\u2713"} Instead:</span> {item.correction}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz / Completion Section */}
      {quizError && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {quizError}
        </div>
      )}

      <div ref={quizSectionRef} className="mt-10">
        {quizResults ? (
          /* Results view */
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="text-center mb-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-xl font-bold text-gray-900">
                Module Complete!
              </h3>
              <p className="mt-2 text-3xl font-bold text-ucla-blue">
                {quizResults.score}/{quizResults.total}
              </p>
              <p className="text-sm text-gray-500">
                {quizResults.score === quizResults.total
                  ? "Perfect score!"
                  : quizResults.score >= quizResults.total * 0.8
                  ? "Great work!"
                  : "Review the explanations below to reinforce your learning."}
              </p>

              {/* Continue to next module button */}
              {nextModule ? (
                <Link to={coursePath(activeCourse, `/modules/${nextModule.id}`)} className="mt-5 inline-block">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-ucla-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-ucla-dark transition-colors">
                    Continue to Module {nextModule.number}: {nextModule.title}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </Link>
              ) : (
                <Link to={coursePath(activeCourse, "/cases")} className="mt-5 inline-block">
                  <button className="inline-flex items-center gap-2 rounded-lg bg-ucla-blue px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-ucla-dark transition-colors">
                    All modules complete! Continue to Cases
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </Link>
              )}
            </div>

            {/* Per-question review */}
            <div className="space-y-4">
              {quizResults.details.map((d, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-4 ${
                    d.correct
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        d.correct ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {d.correct ? "\u2713" : "\u2717"}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {d.question.stem}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs">
                        {!d.correct && (
                          <span className="text-red-600">
                            Your answer: {d.question.options.find((o) => o.key === d.selected)?.text ?? d.selected}
                          </span>
                        )}
                        <span className="text-green-700 font-medium">
                          Correct: {d.question.options.find((o) => o.key === d.question.correctAnswer)?.text ?? d.question.correctAnswer}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {d.question.explanation}
                      </p>
                      {!d.correct && (
                        <button
                          type="button"
                          onClick={() => openAndScrollToTopic(d.question.topicIndex)}
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ucla-blue hover:underline"
                        >
                          Review this topic
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : quizMode ? (
          /* Active quiz with immediate feedback */
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Module {mod.number} Quiz
              </h3>
              {runningChecked > 0 && (
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {runningCorrect}/{runningChecked} correct so far
                </span>
              )}
            </div>

            {isAdminView && (
              <div className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-ucla-gold/40 bg-ucla-gold/10 px-4 py-2.5">
                <span className="text-xs font-medium text-ucla-dark">
                  Admin view — quiz results are not recorded.
                </span>
                <Link
                  to={nextModule ? coursePath(activeCourse, `/modules/${nextModule.id}`) : coursePath(activeCourse, "/cases")}
                >
                  <Button variant="secondary" size="sm">
                    Skip quiz (admin) →
                  </Button>
                </Link>
              </div>
            )}

            <QuizQuestion
              question={toQuizQuestionType(filteredQuestions[safeCurrentQuestion])}
              selectedAnswer={answers[filteredQuestions[safeCurrentQuestion].id] || null}
              onSelect={(key) =>
                setAnswers((prev) => ({
                  ...prev,
                  [filteredQuestions[safeCurrentQuestion].id]: key,
                }))
              }
              questionNumber={safeCurrentQuestion + 1}
              totalQuestions={filteredQuestions.length}
              disabled={feedbackShown}
              checkedAnswer={feedbackShown ? (answers[filteredQuestions[safeCurrentQuestion].id] || null) : null}
              correctAnswer={feedbackShown ? filteredQuestions[safeCurrentQuestion].correctAnswer : null}
            />

            {/* Immediate feedback after checking */}
            {feedbackShown && (() => {
              const q = filteredQuestions[safeCurrentQuestion];
              const isCorrect = answers[q.id] === q.correctAnswer;
              return (
                <div className="mt-4 space-y-3">
                  {/* Correct / Incorrect banner */}
                  <div
                    className={`flex items-center gap-2 rounded-lg border p-3 ${
                      isCorrect
                        ? "border-green-300 bg-green-50 text-green-800"
                        : "border-red-300 bg-red-50 text-red-800"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {isCorrect ? "\u2713" : "\u2717"}
                    </span>
                    <span className="text-sm font-semibold">
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                    {!isCorrect && (
                      <span className="text-sm">
                        &mdash; The correct answer is: {q.options.find((o) => o.key === q.correctAnswer)?.text ?? q.correctAnswer}
                      </span>
                    )}
                  </div>

                  {/* Explanation box */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 shrink-0 text-blue-500 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                      <p className="text-sm text-blue-800">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="sticky bottom-0 z-20 -mx-6 -mb-6 mt-6 flex items-center justify-end border-t border-gray-200 bg-white/95 pl-6 pr-20 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-1px_3px_rgba(0,0,0,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:static lg:z-auto lg:mx-0 lg:mb-0 lg:border-0 lg:bg-transparent lg:pl-0 lg:pr-0 lg:pt-0 lg:pb-0 lg:shadow-none lg:backdrop-blur-none">
              {!feedbackShown ? (
                <Button
                  size="sm"
                  onClick={checkAnswer}
                  disabled={!answers[filteredQuestions[safeCurrentQuestion].id]}
                  className="h-11 w-full text-sm lg:h-auto lg:w-auto lg:text-xs"
                >
                  Check Answer
                </Button>
              ) : safeCurrentQuestion === filteredQuestions.length - 1 ? (
                <Button
                  size="sm"
                  onClick={submitQuiz}
                  disabled={completing}
                  className="h-11 w-full text-sm lg:h-auto lg:w-auto lg:text-xs"
                >
                  {completing ? "Submitting..." : "See Results"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={advanceQuestion}
                  className="h-11 w-full text-sm lg:h-auto lg:w-auto lg:text-xs"
                >
                  Next Question &rarr;
                </Button>
              )}
            </div>
          </div>
        ) : completed ? (
          /* Already completed */
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">
              Module Complete
            </h3>
            {previousScore != null && previousTotal != null ? (
              <p className="mt-1 text-sm text-gray-500">
                Quiz score: {previousScore}/{previousTotal}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                Great work! You have completed this module.
              </p>
            )}
            <Button
              className="mt-4"
              variant="secondary"
              size="sm"
              onClick={startQuiz}
            >
              Retake Quiz
            </Button>
          </div>
        ) : (
          /* Not completed — show take quiz prompt */
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ucla-light">
              <svg
                className="h-6 w-6 text-ucla-blue"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">
              Ready to test your knowledge?
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete a short {filteredQuestions.length}-question quiz to finish this module.
            </p>
            <Button className="mt-4" size="lg" onClick={startQuiz}>
              Take Module Quiz
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          {prevModule ? (
            <Link to={coursePath(activeCourse, `/modules/${prevModule.id}`)}>
              <Button variant="secondary" size="sm">
                &larr; Module {prevModule.number}: {prevModule.title}
              </Button>
            </Link>
          ) : (
            <Link to={coursePath(activeCourse, "/modules")}>
              <Button variant="secondary" size="sm">
                &larr; Back to Modules
              </Button>
            </Link>
          )}
        </div>
        <div>
          {nextModule && (
            <Link to={coursePath(activeCourse, `/modules/${nextModule.id}`)}>
              <Button size="sm">
                Module {nextModule.number}: {nextModule.title} &rarr;
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
