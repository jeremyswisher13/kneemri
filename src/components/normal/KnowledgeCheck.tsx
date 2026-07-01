import { useEffect, useMemo, useRef, useState } from "react";
import AnnotatedSlice from "./AnnotatedSlice";
import Button from "@/components/ui/Button";
import type { Marker, QuizItem } from "@/content/normal-mri-types";

/** Marker → "what is the marked structure?" (Identify) or "click where it is"
 *  (Locate) check for one plane. Both modes feed the same score / pass-gating /
 *  spaced-review pipeline. */
export interface ShowInLearnArgs {
  itemId: string;
  sliceIndex: number;
  marker: Marker;
  /** The correct structure name (the answer text), for highlighting in Learn mode. */
  structure: string;
}

type Mode = "identify" | "locate";

// A click within this distance (in % of the image) of the true marker counts as
// a correct localization — forgiving enough for a fingertip, tight enough that
// you must actually find the structure.
const HIT_TOLERANCE = 8;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function KnowledgeCheck({
  dir,
  items,
  planeLabel,
  onComplete,
  onMiss,
  onShowInLearn,
}: {
  dir: string;
  items: QuizItem[];
  planeLabel: string;
  /** Fired once when the fellow reaches the results screen (for completion tracking). */
  onComplete?: (score: number, total: number) => void;
  /** Fired with the item id when the fellow answers it incorrectly (for spaced review). */
  onMiss?: (itemId: string) => void;
  /** Fired when the fellow taps "Show me in Learn mode" after a wrong answer. */
  onShowInLearn?: (args: ShowInLearnArgs) => void;
}) {
  const [mode, setMode] = useState<Mode>("identify");
  const [round, setRound] = useState(0);

  // Shuffle each question's options once per round (so the answer isn't always B).
  const qs = useMemo(() => {
    void round;
    return items.map((it) => {
      const order = it.options.map((_, n) => n);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      return { ...it, optOrder: order, correctPos: order.indexOf(it.answer) };
    });
  }, [items, round]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [guess, setGuess] = useState<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [done, setDone] = useState(false);

  // Reset when the plane OR the mode changes.
  useEffect(() => {
    setIdx(0);
    setPicked(null);
    setGuess(null);
    scoreRef.current = 0;
    setScore(0);
    setDone(false);
  }, [dir, items, mode]);

  // Report the result to the parent when the check is finished.
  useEffect(() => {
    if (done) onComplete?.(scoreRef.current, qs.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  function restart() {
    setRound((r) => r + 1);
    setIdx(0);
    setPicked(null);
    setGuess(null);
    scoreRef.current = 0;
    setScore(0);
    setDone(false);
  }

  if (!qs.length) return null;

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    const message =
      pct >= 90
        ? `Excellent — you've internalized this normal ${planeLabel}.`
        : pct >= 70
          ? "Solid. Review the ones you missed, then you're ready to move on."
          : "Keep going — run the Guided Tour again, then retake the check.";
    return (
      <div className="mx-auto max-w-md py-6 text-center">
        <p className="text-sm font-medium text-gray-500">
          {planeLabel} · Knowledge Check · {mode === "identify" ? "Identify" : "Locate"}
        </p>
        <p className="mt-2 text-5xl font-bold text-ucla-blue">
          {score}
          <span className="text-2xl font-normal text-gray-500">/{qs.length}</span>
        </p>
        <p className="mt-1 text-sm font-medium text-gray-500">{pct}%</p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-gray-600">{message}</p>
        <div className="mt-6">
          <Button onClick={restart} className="min-h-11 lg:min-h-0">
            Retake check
          </Button>
        </div>
      </div>
    );
  }

  const q = qs[idx];
  const answered = mode === "identify" ? picked !== null : guess !== null;
  const hit = guess !== null && dist(guess, q.marker) <= HIT_TOLERANCE;
  const isCorrect = mode === "identify" ? picked === q.correctPos : hit;
  const structure = q.options[q.answer];

  function pickIdentify(pos: number) {
    if (answered) return;
    setPicked(pos);
    if (pos === q.correctPos) recordCorrectAnswer();
    else onMiss?.(q.id);
  }

  function pickLocate(x: number, y: number) {
    if (answered) return;
    const c = { x, y };
    setGuess(c);
    if (dist(c, q.marker) <= HIT_TOLERANCE) recordCorrectAnswer();
    else onMiss?.(q.id);
  }

  function recordCorrectAnswer() {
    const nextScore = scoreRef.current + 1;
    scoreRef.current = nextScore;
    setScore(nextScore);
  }

  function next() {
    if (idx < qs.length - 1) {
      setIdx(idx + 1);
      setPicked(null);
      setGuess(null);
    } else {
      setDone(true);
    }
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div
        role="group"
        aria-label="Knowledge check mode"
        className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm font-semibold sm:text-xs"
      >
        {(["identify", "locate"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`min-h-11 rounded-md px-3 py-2 transition-colors sm:min-h-0 sm:py-1.5 ${
              mode === m ? "bg-white text-ucla-blue shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "identify" ? "Identify (name it)" : "Locate (click it)"}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {mode === "identify" ? (
          <AnnotatedSlice
            dir={dir}
            sliceIndex={q.sliceIndex}
            markers={[q.marker]}
            pulse
            alt={`${planeLabel} MRI slice with a marked structure for identification`}
          />
        ) : (
          <LocatableSlice
            key={q.id}
            dir={dir}
            sliceIndex={q.sliceIndex}
            target={q.marker}
            guess={guess}
            revealed={answered}
            hit={hit}
            onPick={pickLocate}
            structure={structure}
            planeLabel={planeLabel}
          />
        )}

        <div className="flex flex-col">
          <div className="flex items-center justify-between text-xs font-medium text-gray-500">
            <span>
              Question {idx + 1} of {qs.length}
            </span>
            <span>Score {score}</span>
          </div>

          {mode === "identify" ? (
            <>
              <h3 className="mt-3 text-base font-semibold text-gray-900">{q.prompt}</h3>
              <div role="radiogroup" aria-label={q.prompt} className="mt-3 space-y-2">
                {q.optOrder.map((origIdx, pos) => {
                  const optIsCorrect = pos === q.correctPos;
                  const isPicked = pos === picked;
                  let cls = "border-gray-200 bg-white hover:border-gray-300 text-gray-800";
                  if (answered && optIsCorrect) cls = "border-green-400 bg-green-50 text-green-800";
                  else if (answered && isPicked) cls = "border-red-400 bg-red-50 text-red-800";
                  else if (answered) cls = "border-gray-200 bg-white text-gray-500";
                  return (
                    <button
                      key={pos}
                      type="button"
                      role="radio"
                      aria-checked={isPicked}
                      disabled={answered}
                      onClick={() => pickIdentify(pos)}
                      className={`flex min-h-11 w-full items-center gap-2 rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default lg:min-h-0 lg:py-2.5 ${cls}`}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-[11px]">
                        {String.fromCharCode(65 + pos)}
                      </span>
                      {q.options[origIdx]}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <h3 className="mt-3 text-base font-semibold text-gray-900">
                Find the <span className="text-ucla-blue">{structure}</span>
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {answered
                  ? hit
                    ? "On target."
                    : "Off — the gold ring marks the actual location."
                  : "Click the spot on the image where this structure sits."}
              </p>
            </>
          )}

          {answered && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
                isCorrect
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <span className="font-semibold">
                {isCorrect
                  ? "Correct. "
                  : mode === "locate"
                    ? `Not quite — the gold ring marks the ${structure}. `
                    : "Not quite. "}
              </span>
              {q.explanation}
              {!isCorrect && onShowInLearn && (
                <button
                  type="button"
                  onClick={() =>
                    onShowInLearn({ itemId: q.id, sliceIndex: q.sliceIndex, marker: q.marker, structure })
                  }
                  className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-ucla-blue hover:underline sm:min-h-0 sm:text-xs"
                >
                  Show me in Learn mode
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="mt-auto flex justify-end pt-5">
            <Button
              size="sm"
              disabled={!answered}
              onClick={next}
              className="min-h-11 px-5 text-sm lg:min-h-0 lg:px-3 lg:text-xs"
            >
              {idx < qs.length - 1 ? "Next →" : "See results"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** A slice the learner clicks — OR keyboard-navigates — to localize a named
 *  structure; reveals their guess + the true marker after committing. Click/key
 *  coords map to the same %-space as markers. Keyboard: arrow keys move a
 *  crosshair (Shift = fine step), Enter/Space places it. */
function LocatableSlice({
  dir,
  sliceIndex,
  target,
  guess,
  revealed,
  hit,
  onPick,
  structure,
  planeLabel,
}: {
  dir: string;
  sliceIndex: number;
  target: Marker;
  guess: { x: number; y: number } | null;
  revealed: boolean;
  hit: boolean;
  onPick: (x: number, y: number) => void;
  structure: string;
  planeLabel: string;
}) {
  const src = `${dir}/slice_${String(sliceIndex + 1).padStart(2, "0")}.jpg`;
  // Keyboard crosshair: starts centered, shown once the user moves it with keys.
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [keyboardActive, setKeyboardActive] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (revealed) return;
    const r = e.currentTarget.getBoundingClientRect();
    onPick(
      clamp(((e.clientX - r.left) / r.width) * 100, 0, 100),
      clamp(((e.clientY - r.top) / r.height) * 100, 0, 100),
    );
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (revealed) return;
    const step = e.shiftKey ? 1 : 4;
    const move = (dx: number, dy: number) => {
      setKeyboardActive(true);
      setCursor((c) => ({ x: clamp(c.x + dx, 0, 100), y: clamp(c.y + dy, 0, 100) }));
      e.preventDefault();
    };
    if (e.key === "ArrowUp") move(0, -step);
    else if (e.key === "ArrowDown") move(0, step);
    else if (e.key === "ArrowLeft") move(-step, 0);
    else if (e.key === "ArrowRight") move(step, 0);
    else if (e.key === "Enter" || e.key === " ") {
      onPick(cursor.x, cursor.y);
      e.preventDefault();
    }
  };
  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={revealed ? -1 : 0}
      role="application"
      aria-label={
        revealed
          ? `Result: the ${structure} is marked with a gold ring${guess ? `; your answer ${hit ? "was on target" : "missed"}` : ""}.`
          : `Locate the ${structure} on this ${planeLabel} MRI. Click the image, or use the arrow keys to move the crosshair (hold Shift for fine steps) and press Enter to place it.`
      }
      className={`relative mx-auto block w-fit max-h-[45svh] max-w-full overflow-hidden rounded-xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue focus-visible:ring-offset-2 lg:max-h-none lg:w-full lg:max-w-[560px] ${
        revealed ? "" : "cursor-crosshair"
      }`}
    >
      <img
        src={src}
        alt={`${planeLabel} MRI slice — locate the ${structure}`}
        draggable={false}
        className="mx-auto block max-h-[45svh] w-auto max-w-full select-none object-contain lg:max-h-none lg:w-full"
      />
      {!revealed && keyboardActive && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
          aria-hidden="true"
        >
          <span className="block h-6 w-6 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.6)]" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </span>
      )}
      {revealed && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${target.x}%`, top: `${target.y}%` }}
        >
          <span className="block h-7 w-7 rounded-full border-2 border-ucla-gold bg-ucla-gold/20 shadow-[0_0_0_2px_rgba(0,0,0,0.55)] lg:h-5 lg:w-5" />
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ucla-gold" />
        </span>
      )}
      {revealed && guess && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-lg font-bold"
          style={{ left: `${guess.x}%`, top: `${guess.y}%`, color: hit ? "#22c55e" : "#f87171" }}
        >
          ✕
        </span>
      )}
    </div>
  );
}
