import { useEffect, useMemo, useRef, useState } from "react";
import AnnotatedSlice from "./AnnotatedSlice";
import Button from "@/components/ui/Button";
import type { Marker, QuizItem, TourStep } from "@/content/normal-mri-types";
import {
  MASTERY_TRIAL_COUNT,
  NORMAL_MRI_PASS_PERCENT,
  buildKnowledgeRound,
  canStartMastery,
  labelQuizItemsFromTour,
  locatableItemCount,
  shouldRecordPlaneResult,
  type KnowledgeCheckMode,
} from "./knowledge-check-logic";

export interface ShowInLearnArgs {
  itemId: string;
  sliceIndex: number;
  marker: Marker;
  structure: string;
}

const HIT_TOLERANCE = 8;
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Stable default for the optional `tour` prop. A `tour = []` default parameter
 * would allocate a NEW array on every render, invalidating the `labeledItems`
 * memo below and re-running buildKnowledgeRound — which reshuffles the answer
 * options mid-question, so post-answer feedback would highlight a different
 * option than the learner picked. Callers that omit `tour` (module spot-quizzes)
 * must share this one frozen reference.
 */
const NO_TOUR: readonly TourStep[] = Object.freeze([]);

export default function KnowledgeCheck({
  dir,
  items,
  tour = NO_TOUR as TourStep[],
  planeLabel,
  onComplete,
  onMiss,
  onShowInLearn,
  onContextChange,
}: {
  dir: string;
  items: QuizItem[];
  tour?: TourStep[];
  planeLabel: string;
  /** Fired only after the blinded Mastery Check; practice never grants a pass. */
  onComplete?: (score: number, total: number) => void;
  onMiss?: (itemId: string) => void;
  onShowInLearn?: (args: ShowInLearnArgs) => void;
  onContextChange?: (context: { sliceIndex: number; landmark: string; itemId: string }) => void;
}) {
  const [mode, setMode] = useState<KnowledgeCheckMode>("identify");
  const [round, setRound] = useState(0);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [guess, setGuess] = useState<{ x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [done, setDone] = useState(false);
  const onCompleteRef = useRef(onComplete);

  function resetState() {
    setIdx(0);
    setPicked(null);
    setGuess(null);
    scoreRef.current = 0;
    setScore(0);
    setDone(false);
  }

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const labeledItems = useMemo(() => labelQuizItemsFromTour(items, tour), [items, tour]);
  const verifiedLandmarkCount = locatableItemCount(labeledItems);
  const qs = useMemo(() => {
    void round;
    return buildKnowledgeRound(labeledItems, mode);
  }, [labeledItems, mode, round]);
  const activeQuestion = qs[idx] ?? null;

  useEffect(() => {
    if (!activeQuestion) return;
    const answerText = activeQuestion.options[activeQuestion.answer] ?? "MRI landmark";
    onContextChange?.({
      sliceIndex: activeQuestion.sliceIndex,
      landmark: activeQuestion.locateLabel ?? answerText,
      itemId: activeQuestion.id,
    });
  }, [activeQuestion, onContextChange]);

  useEffect(() => {
    if (done && shouldRecordPlaneResult(mode) && qs.length > 0) {
      onCompleteRef.current?.(scoreRef.current, qs.length);
    }
  }, [done, mode, qs.length]);

  function restart() {
    setRound((value) => value + 1);
    resetState();
  }

  function changeMode(nextMode: KnowledgeCheckMode) {
    if (nextMode === "locate" && verifiedLandmarkCount === 0) return;
    if (nextMode === "mastery" && !canStartMastery(labeledItems)) return;
    if (nextMode === mode) return;
    setMode(nextMode);
    resetState();
  }

  if (!labeledItems.length) return null;

  const modeSelector = (
    <div
      role="group"
      aria-label="Practice or mastery mode"
      className="grid w-full max-w-xl grid-cols-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-semibold"
    >
      {([
        ["identify", "Identify"],
        ["locate", "Locate"],
        ["mastery", "Mastery"],
      ] as const).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => changeMode(id)}
          disabled={
            (id === "locate" && verifiedLandmarkCount === 0) ||
            (id === "mastery" && !canStartMastery(labeledItems))
          }
          aria-pressed={mode === id}
          className={`min-h-11 rounded-md px-2 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-0 sm:px-3 sm:py-1.5 ${
            mode === id ? "bg-white text-ucla-blue shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    const isMastery = mode === "mastery";
    const passed = pct >= NORMAL_MRI_PASS_PERCENT;
    const message = isMastery
      ? passed
        ? `Passed. This ${planeLabel} series now counts toward Normal MRI completion.`
        : "Not passed yet. Review the guided landmarks, practice with feedback, then retake mastery."
      : "Practice complete. Review any misses, then use Mastery when you are ready to record this series.";

    return (
      <div className="mx-auto max-w-xl py-4 text-center">
        <div className="mx-auto">{modeSelector}</div>
        <p className="mt-6 text-sm font-medium text-gray-500">
          {planeLabel} &middot; {isMastery ? "Mastery Check" : mode === "identify" ? "Identify Practice" : "Locate Practice"}
        </p>
        <p className={`mt-2 text-5xl font-bold ${isMastery && !passed ? "text-amber-600" : "text-ucla-blue"}`}>
          {score}
          <span className="text-2xl font-normal text-gray-500">/{qs.length}</span>
        </p>
        <p className="mt-1 text-sm font-medium text-gray-500">{pct}%</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={restart} className="min-h-11">
            {isMastery ? "Retake Mastery" : "Repeat Practice"}
          </Button>
          {isMastery ? (
            <Button variant="secondary" onClick={() => changeMode("identify")} className="min-h-11">
              Return to Practice
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => changeMode("mastery")} className="min-h-11">
              Start Mastery Check
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (mode === "mastery" && qs.length !== MASTERY_TRIAL_COUNT) {
    return (
      <div className="space-y-4">
        {modeSelector}
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This series needs at least five verified landmarks before the Mastery Check can open.
        </p>
      </div>
    );
  }

  if (qs.length === 0) {
    return (
      <div className="space-y-4">
        {modeSelector}
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This series does not yet have verified anatomical labels for localization practice.
        </p>
      </div>
    );
  }

  const q = qs[idx];
  const answered = q.kind === "identify" ? picked !== null : guess !== null;
  const hit = guess !== null && dist(guess, q.marker) <= HIT_TOLERANCE;
  const isCorrect = q.kind === "identify" ? picked === q.correctPos : hit;
  const answerText = q.options[q.answer];
  const landmarkLabel = q.locateLabel ?? answerText;
  const structure = q.kind === "locate" ? landmarkLabel : answerText;
  const showFeedback = mode !== "mastery";

  function recordCorrectAnswer() {
    const nextScore = scoreRef.current + 1;
    scoreRef.current = nextScore;
    setScore(nextScore);
  }

  function pickIdentify(pos: number) {
    if (answered) return;
    setPicked(pos);
    if (pos === q.correctPos) recordCorrectAnswer();
    else onMiss?.(q.id);
  }

  function pickLocate(x: number, y: number) {
    if (answered) return;
    const nextGuess = { x, y };
    setGuess(nextGuess);
    if (dist(nextGuess, q.marker) <= HIT_TOLERANCE) recordCorrectAnswer();
    else onMiss?.(q.id);
  }

  function next() {
    if (idx < qs.length - 1) {
      setIdx((value) => value + 1);
      setPicked(null);
      setGuess(null);
    } else {
      setDone(true);
    }
  }

  return (
    <div className="space-y-4">
      {modeSelector}
      <p className="text-sm text-gray-500">
        {mode === "mastery"
          ? `Blinded scoring: ${MASTERY_TRIAL_COUNT} mixed identification and localization trials. Score ${NORMAL_MRI_PASS_PERCENT}% or higher to pass this series.`
          : "Practice gives immediate feedback and explanations. Practice scores do not record a series pass."}
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {q.kind === "identify" ? (
          <AnnotatedSlice
            dir={dir}
            sliceIndex={q.sliceIndex}
            markers={[q.marker]}
            pulse
            alt={`${planeLabel} MRI slice with a marked structure for identification`}
          />
        ) : (
          <LocatableSlice
            key={q.trialId}
            dir={dir}
            sliceIndex={q.sliceIndex}
            target={q.marker}
            guess={guess}
            answered={answered}
            showCorrect={showFeedback}
            hit={hit}
            onPick={pickLocate}
            structure={structure}
            planeLabel={planeLabel}
          />
        )}

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-3 text-xs font-medium text-gray-500">
            <span>Question {idx + 1} of {qs.length}</span>
            <span>{mode === "mastery" ? "Score hidden" : `Score ${score}`}</span>
          </div>

          {q.kind === "identify" ? (
            <>
              <h3 className="mt-3 text-base font-semibold text-gray-900">{q.prompt}</h3>
              <div role="radiogroup" aria-label={q.prompt} className="mt-3 space-y-2">
                {q.optOrder.map((origIdx, pos) => {
                  const optionIsCorrect = pos === q.correctPos;
                  const isPicked = pos === picked;
                  let classes = "border-gray-200 bg-white text-gray-800 hover:border-gray-300";
                  if (answered && showFeedback && optionIsCorrect) {
                    classes = "border-green-400 bg-green-50 text-green-800";
                  } else if (answered && showFeedback && isPicked) {
                    classes = "border-red-400 bg-red-50 text-red-800";
                  } else if (answered && showFeedback) {
                    classes = "border-gray-200 bg-white text-gray-500";
                  } else if (answered && isPicked) {
                    classes = "border-ucla-blue bg-ucla-light/40 text-ucla-dark";
                  }
                  return (
                    <button
                      key={pos}
                      type="button"
                      role="radio"
                      aria-checked={isPicked}
                      disabled={answered}
                      onClick={() => pickIdentify(pos)}
                      className={`flex min-h-11 w-full items-center gap-2 rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default lg:min-h-0 lg:py-2.5 ${classes}`}
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
                {!answered
                  ? "Select its location on the image."
                  : !showFeedback
                    ? "Answer recorded."
                    : hit
                      ? "On target."
                      : "Off target; the gold ring marks the actual location."}
              </p>
            </>
          )}

          {answered && showFeedback && (
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
                  : q.kind === "locate"
                    ? `Not quite. The gold ring marks the ${structure}. `
                    : "Not quite. "}
              </span>
              {q.kind === "locate" ? (q.locateExplanation ?? q.explanation) : q.explanation}
              {!isCorrect && onShowInLearn && (
                <button
                  type="button"
                  onClick={() =>
                    onShowInLearn({
                      itemId: q.id,
                      sliceIndex: q.sliceIndex,
                      marker: q.marker,
                      structure: landmarkLabel,
                    })
                  }
                  className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-ucla-blue hover:underline sm:min-h-0 sm:text-xs"
                >
                  Show me in Guided Tour
                  <span aria-hidden="true">&rarr;</span>
                </button>
              )}
            </div>
          )}

          {answered && !showFeedback && (
            <p role="status" aria-live="polite" className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              Answer recorded. Correct answers and your score stay hidden until the round ends.
            </p>
          )}

          <div className="mt-auto flex justify-end pt-5">
            <Button
              size="sm"
              disabled={!answered}
              onClick={next}
              className="min-h-11 px-5 text-sm lg:min-h-0 lg:px-3 lg:text-xs"
            >
              {idx < qs.length - 1 ? "Continue" : "See results"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LocatableSlice({
  dir,
  sliceIndex,
  target,
  guess,
  answered,
  showCorrect,
  hit,
  onPick,
  structure,
  planeLabel,
}: {
  dir: string;
  sliceIndex: number;
  target: Marker;
  guess: { x: number; y: number } | null;
  answered: boolean;
  showCorrect: boolean;
  hit: boolean;
  onPick: (x: number, y: number) => void;
  structure: string;
  planeLabel: string;
}) {
  const src = `${dir}/slice_${String(sliceIndex + 1).padStart(2, "0")}.jpg`;
  const [cursor, setCursor] = useState({ x: 50, y: 50 });
  const [keyboardActive, setKeyboardActive] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (answered) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onPick(
      clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (answered) return;
    const step = event.shiftKey ? 1 : 4;
    const move = (dx: number, dy: number) => {
      setKeyboardActive(true);
      setCursor((value) => ({ x: clamp(value.x + dx, 0, 100), y: clamp(value.y + dy, 0, 100) }));
      event.preventDefault();
    };
    if (event.key === "ArrowUp") move(0, -step);
    else if (event.key === "ArrowDown") move(0, step);
    else if (event.key === "ArrowLeft") move(-step, 0);
    else if (event.key === "ArrowRight") move(step, 0);
    else if (event.key === "Enter" || event.key === " ") {
      onPick(cursor.x, cursor.y);
      event.preventDefault();
    }
  };

  return (
    <div
      data-testid="locatable-mri"
      data-target-x={target.x}
      data-target-y={target.y}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={answered ? -1 : 0}
      role="application"
      aria-label={
        answered
          ? showCorrect
            ? `Result: the ${structure} is marked with a gold ring; your answer ${hit ? "was on target" : "missed"}.`
            : `Location recorded for the ${structure}. The result is hidden until the mastery round ends.`
          : `Locate the ${structure} on this ${planeLabel} MRI. Select the image, or use arrow keys to move the crosshair and press Enter.`
      }
      className={`relative mx-auto block w-fit max-h-[45svh] max-w-full overflow-hidden rounded-xl bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue focus-visible:ring-offset-2 lg:max-h-none lg:w-full lg:max-w-[560px] ${
        answered ? "" : "cursor-crosshair"
      }`}
    >
      <img
        src={src}
        alt={`${planeLabel} MRI slice; locate the ${structure}`}
        draggable={false}
        className="mx-auto block max-h-[45svh] w-auto max-w-full select-none object-contain lg:max-h-none lg:w-full"
      />
      {!answered && keyboardActive && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
          aria-hidden="true"
        >
          <span className="block h-6 w-6 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.6)]" />
          <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
        </span>
      )}
      {answered && showCorrect && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${target.x}%`, top: `${target.y}%` }}
          aria-hidden="true"
        >
          <span className="block h-7 w-7 rounded-full border-2 border-ucla-gold bg-ucla-gold/20 shadow-[0_0_0_2px_rgba(0,0,0,0.55)] lg:h-5 lg:w-5" />
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ucla-gold" />
        </span>
      )}
      {answered && guess && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-lg font-bold"
          style={{
            left: `${guess.x}%`,
            top: `${guess.y}%`,
            color: showCorrect ? (hit ? "#22c55e" : "#f87171") : "#ffffff",
            textShadow: "0 1px 2px rgba(0,0,0,0.9)",
          }}
          aria-hidden="true"
        >
          X
        </span>
      )}
    </div>
  );
}
