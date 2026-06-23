import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MriStackViewer, { type MriStackSlice } from "@/components/ui/MriStackViewer";
import type { ImageCaqQ } from "@/content/normal-mri-types";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ATTR = "De-identified normal MRI · UCLA Sports Medicine teaching collection";

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
  const [run, setRun] = useState<ImageCaqQ[] | null>(null);
  const [qi, setQi] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Reshuffle options + clear selection when the active question changes
  // (adjusted during render, keyed on run + qi, so no stale frame).
  const [prevKey, setPrevKey] = useState<{ run: ImageCaqQ[] | null; qi: number }>({ run: null, qi: 0 });
  if (prevKey.run !== run || prevKey.qi !== qi) {
    setPrevKey({ run, qi });
    if (run && run[qi]) {
      setOrder(shuffle(run[qi].options.map((_, i) => i)));
      setPicked(null);
    }
  }

  const q = run ? run[qi] : null;
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
    setRun(shuffle(questions));
    setQi(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  }

  // ── Intro ─────────────────────────────────────────────────────────────────
  if (!run) {
    return (
      <Card>
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ucla-blue/15 text-lg">🩻</span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Image-anchored CAQ</h2>
            <p className="mt-0.5 text-sm text-gray-600">
              Board-style questions read off the real MRI. Each opens the stack at the key slice —{" "}
              <span className="font-medium text-gray-700">scroll it like a radiologist</span>, then commit
              to your answer. {questions.length} questions.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <Button size="sm" onClick={start}>
            Start ({questions.length} questions) →
          </Button>
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
          <div className="mt-5">
            <Button size="sm" onClick={start}>
              Run it again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!q) return null;
  const answered = picked !== null;

  function choose(optIdx: number) {
    if (picked !== null || !q) return;
    setPicked(optIdx);
    if (optIdx === q.answer) setScore((s) => s + 1);
    else onMiss?.(q.id);
  }

  function next() {
    if (qi >= run!.length - 1) setDone(true);
    else setQi((n) => n + 1);
  }

  function optClass(optIdx: number) {
    if (!answered) return "border-gray-200 bg-white hover:border-ucla-blue/50 hover:bg-ucla-light/40 cursor-pointer";
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
          <span className="block h-full rounded-full bg-ucla-blue transition-all" style={{ width: `${((qi + 1) / run.length) * 100}%` }} />
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
            Opened at the key slice — scroll to read the rest of the stack before you answer.
          </p>
        </div>

        <Card>
          <span className="inline-flex rounded-full bg-ucla-blue/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ucla-blue">
            {q.topic}
          </span>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-gray-900">{q.vignette}</p>

          <div className="mt-4 space-y-2">
            {order.map((optIdx) => (
              <button
                key={optIdx}
                type="button"
                disabled={answered}
                onClick={() => choose(optIdx)}
                className={`flex w-full items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${optClass(optIdx)}`}
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
            <div className={`mt-4 rounded-lg border px-4 py-3 ${picked === q.answer ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <p className={`text-sm font-semibold ${picked === q.answer ? "text-green-800" : "text-red-800"}`}>
                {picked === q.answer ? "Correct" : "Not quite"}
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
