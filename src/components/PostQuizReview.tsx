import { useMemo, useState } from "react";
import type { UserProgress } from "@/types/progress";
import { type CourseDefinition, getPostQuizQuestions } from "@/content/courses";
import { domainLabel } from "@/lib/growth";

/**
 * Per-item review of the POST quiz, available once the learner has finished it
 * (the final measurement — no further post form reuses these items). Shows each
 * question with the learner's choice, the correct answer, and the explanation,
 * with a "misses only" filter. Closes the explanation loop the pre/post
 * instrument otherwise leaves open.
 */
export default function PostQuizReview({
  progress,
  course,
}: {
  progress: UserProgress;
  course: CourseDefinition;
}) {
  const [open, setOpen] = useState(false);
  const [missesOnly, setMissesOnly] = useState(false);

  const items = useMemo(() => {
    const chosen = new Map((progress.postQuizResponses ?? []).map((r) => [r.questionId, r.selectedAnswer]));
    return getPostQuizQuestions(course).map((q) => {
      const selected = chosen.get(q.id) ?? null;
      return { q, selected, correct: selected !== null && selected === q.correctAnswer };
    });
  }, [progress.postQuizResponses, course]);

  const missed = items.filter((it) => !it.correct).length;
  if (items.length === 0 || progress.postQuizResponses == null) return null;

  const shown = missesOnly ? items.filter((it) => !it.correct) : items;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-6 py-4 text-left"
      >
        <div>
          <h2 className="text-lg font-bold text-gray-900">Review your answers</h2>
          <p className="text-sm text-gray-500">
            {items.length - missed}/{items.length} correct on the post quiz — see the explanation for each.
          </p>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-6 py-4">
          {missed > 0 && (
            <label className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={missesOnly}
                onChange={(e) => setMissesOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-ucla-blue focus:ring-ucla-blue"
              />
              Show only the {missed} I missed
            </label>
          )}
          <ol className="space-y-4">
            {shown.map(({ q, selected, correct }, i) => (
              <li key={q.id} className="rounded-lg border border-gray-100 p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-gray-900">{i + 1}. {q.stem}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      correct ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {correct ? "correct" : "missed"}
                  </span>
                </div>
                <ul className="space-y-1">
                  {q.options.map((o) => {
                    const isCorrect = o.key === q.correctAnswer;
                    const isChosen = o.key === selected;
                    const cls = isCorrect
                      ? "border-green-300 bg-green-50 text-green-900"
                      : isChosen
                        ? "border-rose-300 bg-rose-50 text-rose-900"
                        : "border-gray-200 text-gray-600";
                    return (
                      <li key={o.key} className={`flex items-start gap-2 rounded-md border px-2.5 py-1.5 text-sm ${cls}`}>
                        <span className="font-semibold">{o.key}.</span>
                        <span className="flex-1">{o.text}</span>
                        {isCorrect && <span className="text-[11px] font-semibold text-green-700">correct</span>}
                        {isChosen && !isCorrect && <span className="text-[11px] font-semibold text-rose-700">your answer</span>}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  <span className="font-semibold text-gray-500">{domainLabel(q.domain)} · </span>
                  {q.explanation}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
