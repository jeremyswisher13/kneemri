import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { AdvancedQ } from "@/content/normal-mri-types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Advanced challenge — an optional, higher-level question bank for fellows who
 * want to push past normal anatomy. Pick a topic (or all), then run through
 * literature-checked board-style MCQs with shuffled options, feedback, and a score.
 */
export default function AdvancedChallenge({
  questions,
  onMiss,
}: {
  questions: AdvancedQ[];
  /** Fired with the item id when the fellow answers it incorrectly (for spaced review). */
  onMiss?: (itemId: string) => void;
}) {
  const topics = useMemo(
    () => Array.from(new Set(questions.map((q) => q.topic))),
    [questions],
  );
  const countFor = (t: string) => questions.filter((q) => q.topic === t).length;

  const [run, setRun] = useState<AdvancedQ[] | null>(null);
  const [qi, setQi] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Reshuffle options + clear selection whenever the active question changes.
  // Adjusted during render (keyed on the run reference + qi, matching the prior
  // effect deps) so each question renders with a fresh shuffle and no empty frame.
  const [prevKey, setPrevKey] = useState<{ run: AdvancedQ[] | null; qi: number }>({
    run: null,
    qi: 0,
  });
  if (prevKey.run !== run || prevKey.qi !== qi) {
    setPrevKey({ run, qi });
    if (run && run[qi]) {
      setOrder(shuffle(run[qi].options.map((_, i) => i)));
      setPicked(null);
    }
  }

  function start(topic: string | null) {
    const pool = topic ? questions.filter((q) => q.topic === topic) : questions;
    if (!pool.length) return;
    setRun(shuffle(pool));
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  function quit() {
    setRun(null);
    setDone(false);
  }

  if (questions.length === 0) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-gray-500">
          The advanced challenge bank is being prepared — check back shortly.
        </p>
      </Card>
    );
  }

  // ── Topic picker ──────────────────────────────────────────────────────────
  if (!run) {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ucla-gold/20 text-lg">
            🏆
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Advanced challenge</h2>
            <p className="mt-0.5 text-sm text-gray-600">
              Optional, board-style questions for when you want to push your learning — measurements,
              normal variants that mimic pathology, secondary signs, and grading criteria. Every item
              is literature-checked.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => start(null)}
            className="flex items-center justify-between rounded-xl border border-ucla-blue/30 bg-ucla-light/60 px-4 py-3 text-left transition-colors hover:bg-ucla-light"
          >
            <span className="text-sm font-semibold text-[#003B5C]">All topics</span>
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-semibold text-gray-600">
              {questions.length} Q
            </span>
          </button>
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => start(t)}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-800">{t}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
                {countFor(t)} Q
              </span>
            </button>
          ))}
        </div>
      </Card>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((score / run.length) * 100);
    return (
      <Card>
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-gray-500">Advanced challenge complete</p>
          <p className="mt-2 text-4xl font-bold text-ucla-blue">
            {score}/{run.length}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            {pct >= 80
              ? "Strong — you're reading at an advanced level."
              : pct >= 50
                ? "Solid. Review the misses and run it again to lock them in."
                : "These are hard. Re-read the explanations and try again — that's how they stick."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button size="sm" onClick={() => start(run.length ? run[0].topic : null)}>
              Retry this set
            </Button>
            <Button size="sm" variant="secondary" onClick={quit}>
              Pick another topic
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // ── Active question ───────────────────────────────────────────────────────
  const q = run[qi];
  const answered = picked !== null;

  function choose(optIdx: number) {
    if (picked !== null) return;
    setPicked(optIdx);
    if (optIdx === q.answer) setScore((s) => s + 1);
    else onMiss?.(q.id);
  }

  function next() {
    if (qi >= run!.length - 1) setDone(true);
    else setQi((n) => n + 1);
  }

  function optClass(optIdx: number) {
    if (!answered)
      return "border-gray-200 bg-white hover:border-ucla-blue/50 hover:bg-ucla-light/40 cursor-pointer";
    if (optIdx === q.answer) return "border-green-400 bg-green-50";
    if (optIdx === picked) return "border-red-400 bg-red-50";
    return "border-gray-200 bg-white opacity-60";
  }

  return (
    <div>
      {/* progress */}
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-500">
        <span>
          Question {qi + 1} of {run.length}
        </span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-gray-200">
          <span
            className="block h-full rounded-full bg-ucla-blue transition-all"
            style={{ width: `${((qi + 1) / run.length) * 100}%` }}
          />
        </span>
        <span>
          Score {score}/{run.length}
        </span>
      </div>

      <Card>
        <span className="inline-flex rounded-full bg-ucla-gold/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#7a5d00]">
          {q.topic}
        </span>
        <p className="mt-2 text-[15px] font-medium leading-relaxed text-gray-900">{q.prompt}</p>

        <div className="mt-4 space-y-2">
          {order.map((optIdx) => (
            <button
              key={optIdx}
              type="button"
              disabled={answered}
              onClick={() => choose(optIdx)}
              className={`flex w-full items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${optClass(
                optIdx,
              )}`}
            >
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[10px] font-bold ${
                  answered && optIdx === q.answer
                    ? "border-green-500 bg-green-500 text-white"
                    : answered && optIdx === picked
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-gray-300 text-gray-500"
                }`}
              >
                {answered && optIdx === q.answer ? "✓" : answered && optIdx === picked ? "✕" : ""}
              </span>
              <span className="text-gray-800">{q.options[optIdx]}</span>
            </button>
          ))}
        </div>

        {answered && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 ${
              picked === q.answer ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                picked === q.answer ? "text-green-800" : "text-red-800"
              }`}
            >
              {picked === q.answer ? "Correct" : "Not quite"}
            </p>
            <p className="mt-1 text-sm text-gray-600">{q.explanation}</p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <Button size="sm" disabled={!answered} onClick={next}>
            {qi >= run.length - 1 ? "See results" : "Next →"}
          </Button>
          <button
            type="button"
            onClick={quit}
            className="ml-auto text-xs font-medium text-gray-500 hover:text-gray-600"
          >
            Exit
          </button>
        </div>
      </Card>
    </div>
  );
}
