import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MriStackViewer, { type MriStackSlice } from "@/components/ui/MriStackViewer";
import type { ImageCaqQ } from "@/content/normal-mri-types";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

type RunItem = {
  question: ImageCaqQ;
  optionOrder: number[];
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ATTR = "De-identified normal MRI · UCLA Sports Medicine teaching collection";
const questionCountText = (count: number) => `${count} question${count === 1 ? "" : "s"}`;

/**
 * Image-anchored CAQ — board-style questions read off the REAL interactive stack.
 * Each question opens the actual MRI at its anchor slice; the fellow scrolls to
 * read it like a radiologist, then commits to a single-best-answer. Misses feed
 * spaced review.
 */
export default function ImageCaq({
  questions,
  onMiss,
}: {
  questions: ImageCaqQ[];
  onMiss?: (itemId: string) => void;
}) {
  const [run, setRun] = useState<RunItem[] | null>(null);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [missedIds, setMissedIds] = useState<string[]>([]);

  const active = run ? run[qi] : null;
  const q = active?.question ?? null;
  const slices: MriStackSlice[] = useMemo(() => {
    if (!q) return [];
    return Array.from({ length: q.count }, (_, i) => ({
      src: `${q.dir}/slice_${String(i + 1).padStart(2, "0")}.jpg`,
      alt: `${q.plane} slice ${i + 1}`,
    }));
  }, [q]);

  if (questions.length === 0) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-gray-500">
          The image-anchored question bank is being prepared — check back shortly.
        </p>
      </Card>
    );
  }

  function start() {
    setRun(
      shuffle(questions).map((question) => ({
        question,
        optionOrder: shuffle(question.options.map((_, i) => i)),
      })),
    );
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setMissedIds([]);
  }

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (!run) {
    const countText = questionCountText(questions.length);
    return (
      <Card>
        <div className="flex items-start gap-3">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ucla-blue/15 text-xs font-bold tracking-wide text-ucla-blue"
            aria-hidden="true"
          >
            CAQ
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Image-anchored CAQ</h2>
            <p className="mt-0.5 text-sm text-gray-600">
              Board-style questions read off the real MRI. Each opens the stack at the key slice —{" "}
              <span className="font-medium text-gray-700">scroll it like a radiologist</span>, then commit
              to your answer. {countText}.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <Button
            size="sm"
            onClick={start}
            aria-label={`Start image-anchored CAQ, ${countText}`}
          >
            Start ({countText}) →
          </Button>
        </div>
      </Card>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (done) {
    const pct = Math.round((score / run.length) * 100);
    const missedCount = missedIds.length;
    return (
      <Card>
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-gray-500">Image-anchored CAQ complete</p>
          <p className="mt-2 text-4xl font-bold text-ucla-blue">
            {score}/{run.length}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            {pct >= 80
              ? "Excellent — you're reading findings off the image with confidence."
              : pct >= 50
                ? "Solid. Re-scroll the misses and run it again to lock them in."
                : "These are hard. Re-read the explanations on the image and try again."}
          </p>
          {missedCount > 0 && (
            <p className="mx-auto mt-2 max-w-md text-xs font-medium text-gray-500">
              {missedCount} missed {missedCount === 1 ? "item was" : "items were"} added to spaced
              review.
            </p>
          )}
          <div className="mt-5">
            <Button size="sm" onClick={start}>
              Run it again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!q || !active) return null;
  const order = active.optionOrder;
  const answered = picked !== null;
  const correct = picked === q.answer;
  const anchorSlice = `Slice ${q.startIndex + 1} of ${q.count}`;
  const answerDisplayPos = order.indexOf(q.answer);
  const pickedDisplayPos = picked === null ? -1 : order.indexOf(picked);
  const answerLetter = answerDisplayPos >= 0 ? LETTERS[answerDisplayPos] : "?";
  const pickedLetter = pickedDisplayPos >= 0 ? LETTERS[pickedDisplayPos] : "?";

  function choose(optIdx: number) {
    if (picked !== null || !q) return;
    setPicked(optIdx);
    if (optIdx === q.answer) setScore((s) => s + 1);
    else {
      setMissedIds((ids) => [...ids, q.id]);
      onMiss?.(q.id);
    }
  }

  function next() {
    if (qi >= run!.length - 1) setDone(true);
    else {
      setQi((n) => n + 1);
      setPicked(null);
    }
  }

  function optClass(optIdx: number) {
    if (!answered)
      return "border-gray-200 bg-white hover:border-ucla-blue/50 hover:bg-ucla-light/40 cursor-pointer";
    if (optIdx === q!.answer) return "border-green-400 bg-green-50";
    if (optIdx === picked) return "border-red-400 bg-red-50";
    return "border-gray-200 bg-white opacity-60";
  }

  return (
    <div>
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

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <MriStackViewer
            key={q.id}
            slices={slices}
            plane={q.plane}
            attribution={ATTR}
            startIndex={q.startIndex}
          />
          <p className="mt-2 text-xs text-gray-500">
            Opened at the key slice. Review adjacent slices before you answer.
          </p>
          <div className="mt-2 grid gap-2 rounded-lg border border-ucla-blue/15 bg-ucla-light/40 px-3 py-2 text-xs sm:grid-cols-2">
            <p>
              <span className="font-semibold text-gray-700">Anchor: </span>
              <span className="text-gray-600">{anchorSlice}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-700">Plane: </span>
              <span className="text-gray-600">{q.plane}</span>
            </p>
          </div>
        </div>

        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-ucla-blue/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ucla-blue">
              {q.topic}
            </span>
            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
              {anchorSlice}
            </span>
          </div>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-gray-900">{q.vignette}</p>

          <div
            className="mt-4 space-y-2"
            role="radiogroup"
            aria-label="Image CAQ answer choices"
          >
            {order.map((optIdx, pos) => {
              const letter = LETTERS[pos] ?? `${pos + 1}`;
              const isCorrectAnswer = answered && optIdx === q.answer;
              const isPickedWrong = answered && optIdx === picked && optIdx !== q.answer;
              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={answered}
                  onClick={() => choose(optIdx)}
                  aria-label={`Option ${letter}: ${q.options[optIdx]}`}
                  aria-checked={picked === optIdx}
                  role="radio"
                  className={`flex w-full items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${optClass(optIdx)}`}
                >
                  <span
                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[10px] font-bold ${
                      isCorrectAnswer
                        ? "border-green-500 bg-green-500 text-white"
                        : isPickedWrong
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-gray-300 text-gray-500"
                    }`}
                    aria-hidden="true"
                  >
                    {letter}
                  </span>
                  <span className="min-w-0 flex-1 text-gray-800">{q.options[optIdx]}</span>
                  {isCorrectAnswer && (
                    <span className="ml-auto shrink-0 text-xs font-semibold text-green-700">
                      Correct
                    </span>
                  )}
                  {isPickedWrong && (
                    <span className="ml-auto shrink-0 text-xs font-semibold text-red-700">
                      Your pick
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={`mt-4 rounded-lg border px-4 py-3 ${
                correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
              }`}
            >
              <p className={`text-sm font-semibold ${correct ? "text-green-800" : "text-red-800"}`}>
                {correct ? "Correct" : "Not quite"}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500">
                {correct
                  ? `You chose option ${answerLetter}.`
                  : `You chose option ${pickedLetter}; correct is option ${answerLetter}.`}
              </p>
              <p className="mt-1 text-sm text-gray-600">{q.explanation}</p>
            </div>
          )}

          <div className="mt-4">
            <Button size="sm" disabled={!answered} onClick={next}>
              {qi >= run.length - 1 ? "See results" : "Next →"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
