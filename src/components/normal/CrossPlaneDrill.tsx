import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  clampCrossPlaneCoordinate,
  isCrossPlaneFreeResponseCorrect,
  moveCrossPlaneCursor,
} from "@/components/normal/cross-plane-cursor";
import type { CorrelationItem } from "@/content/normal-mri-types";

const pad = (n: number) => String(n + 1).padStart(2, "0");
const LETTERS = ["A", "B", "C", "D", "E", "F"];
type Diff = "mc" | "free";

// Touch/coarse-pointer devices default to (and stay in) multiple choice — the
// click-the-spot free mode demands pixel precision a thumb can't deliver. Desktop
// (fine pointer) keeps both modes.
const isCoarsePointer = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sourceLabelClass(point: { x: number; y: number }) {
  const vertical = point.y > 75 ? "bottom-5" : "top-5";
  const horizontal =
    point.x < 25
      ? "left-0 translate-x-0 text-left"
      : point.x > 75
        ? "right-0 translate-x-0 text-right"
        : "left-1/2 -translate-x-1/2 text-center";
  return `${vertical} ${horizontal}`;
}

/**
 * Cross-plane correlation drill — a structure is labeled on one plane (FROM) and
 * the learner finds the SAME structure on a different plane (TO). Two difficulties:
 *  • Multiple choice — tap the matching lettered candidate.
 *  • Free response — no letters; click the structure directly (graded by which
 *    point lands within the verified target tolerance).
 * Trains the mental 3-D model that ties the planes together.
 */
export default function CrossPlaneDrill({
  items,
  onContextChange,
}: {
  items: CorrelationItem[];
  onContextChange?: (context: { sliceIndex: number; landmark: string; itemId: string }) => void;
}) {
  const [coarse] = useState(isCoarsePointer);
  const [diff, setDiff] = useState<Diff>("mc");
  const [idx, setIdx] = useState(0);
  const [order, setOrder] = useState<number[]>(() =>
    shuffle((items[0]?.to.candidates ?? []).map((_, i) => i)),
  );
  const [answered, setAnswered] = useState(false);
  const [scored, setScored] = useState(false);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [clickPct, setClickPct] = useState<{ x: number; y: number } | null>(null);
  const [keyboardPoint, setKeyboardPoint] = useState({ x: 50, y: 50 });
  const [keyboardActive, setKeyboardActive] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [retryRevision, setRetryRevision] = useState(0);
  const toBoxRef = useRef<HTMLDivElement>(null);

  const item = items[idx];
  const fromSrc = item ? `${item.from.dir}/slice_${pad(item.from.sliceIndex)}.jpg` : "";
  const toSrc = item ? `${item.to.dir}/slice_${pad(item.to.sliceIndex)}.jpg` : "";
  const fromFailed = failedImages.has(fromSrc);
  const toFailed = failedImages.has(toSrc);
  const interactionPaused = fromFailed || toFailed;

  useEffect(() => {
    if (!item) return;
    onContextChange?.({
      sliceIndex: item.from.sliceIndex,
      landmark: `${item.from.label} (${item.from.plane} to ${item.to.plane})`,
      itemId: item.id,
    });
  }, [item, onContextChange]);

  // New shuffle + clear the current answer whenever we move to a new item.
  // Adjusted during render (keyed on idx) so the new item never renders for a
  // frame with the previous item's order/answer state.
  const [prevIdx, setPrevIdx] = useState(idx);

  // Guard after all hooks (lint-safe ordering, matching ImageCaq/PlaneCompare):
  // an empty correlation set would crash at item.to.candidates below.
  if (items.length === 0) {
    return (
      <Card>
        <p className="py-8 text-center text-sm text-gray-500">
          Cross-plane correlations are being prepared — check back shortly.
        </p>
      </Card>
    );
  }

  if (idx !== prevIdx) {
    setPrevIdx(idx);
    setOrder(shuffle(item.to.candidates.map((_, i) => i)));
    setAnswered(false);
    setScored(false);
    setPickedIdx(null);
    setClickPct(null);
    setKeyboardPoint({ x: 50, y: 50 });
    setKeyboardActive(false);
  }

  // Switching difficulty re-opens the current item (but never double-scores it).
  function changeDiff(d: Diff) {
    if (d === diff) return;
    setDiff(d);
    setAnswered(false);
    setPickedIdx(null);
    setClickPct(null);
    setKeyboardPoint({ x: 50, y: 50 });
    setKeyboardActive(false);
  }

  if (done) {
    const perfect = score === items.length;
    return (
      <Card>
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-gray-500">Cross-plane correlation complete</p>
          <p className="mt-2 text-4xl font-bold text-ucla-blue">
            {score}/{items.length}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            {perfect
              ? "Perfect — you're tracking structures across planes. That's the skill that makes pathology obvious."
              : "Re-run it until you can flip any structure between planes without hesitating."}
          </p>
          <Button
            className="mt-5 min-h-11 px-5 text-sm lg:min-h-0 lg:px-3 lg:text-xs"
            size="sm"
            onClick={() => {
              setIdx(0);
              setScore(0);
              setAnswered(false);
              setScored(false);
              setPickedIdx(null);
              setClickPct(null);
              setKeyboardPoint({ x: 50, y: 50 });
              setKeyboardActive(false);
              setDone(false);
            }}
          >
            Restart drill
          </Button>
        </div>
      </Card>
    );
  }

  const answerPos = item.to.candidates[item.to.answer];

  const correct =
    answered &&
    (diff === "mc"
      ? pickedIdx === item.to.answer
      : clickPct !== null && isCrossPlaneFreeResponseCorrect(clickPct, answerPos));
  const answerDisplayPos = order.indexOf(item.to.answer);
  const pickedDisplayPos = pickedIdx === null ? -1 : order.indexOf(pickedIdx);
  const answerLetter = answerDisplayPos >= 0 ? LETTERS[answerDisplayPos] : "?";
  const pickedLetter = pickedDisplayPos >= 0 ? LETTERS[pickedDisplayPos] : "?";
  const responseSummary =
    diff === "mc"
      ? correct
        ? `You chose option ${answerLetter}.`
        : `You chose option ${pickedLetter}; correct is option ${answerLetter}.`
      : correct
        ? "Your click landed in the target region."
        : "Green ring marks the target; red dot marks your click.";

  function commit(isRight: boolean) {
    setAnswered(true);
    if (!scored) {
      setScored(true);
      if (isRight) setScore((s) => s + 1);
    }
  }

  function chooseMc(candIdx: number) {
    if (answered) return;
    setPickedIdx(candIdx);
    commit(candIdx === item.to.answer);
  }

  function commitFree(x: number, y: number) {
    if (answered || diff !== "free") return;
    const point = { x: clampCrossPlaneCoordinate(x), y: clampCrossPlaneCoordinate(y) };
    setClickPct(point);
    commit(isCrossPlaneFreeResponseCorrect(point, answerPos));
  }

  function clickFree(e: React.MouseEvent<HTMLDivElement>) {
    if (answered || diff !== "free" || interactionPaused) return;
    const box = toBoxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    commitFree(x, y);
  }

  function keyFree(e: React.KeyboardEvent<HTMLDivElement>) {
    if (answered || diff !== "free" || interactionPaused) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      const key = e.key as "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";
      setKeyboardPoint((point) => moveCrossPlaneCursor(point, key, e.shiftKey));
      setKeyboardActive(true);
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      commitFree(keyboardPoint.x, keyboardPoint.y);
      e.preventDefault();
    }
  }

  function next() {
    if (idx >= items.length - 1) setDone(true);
    else setIdx((i) => i + 1);
  }

  function candClass(candIdx: number) {
    if (!answered) return "bg-white/90 text-ucla-blue ring-ucla-blue hover:scale-110 cursor-pointer";
    if (candIdx === item.to.answer) return "bg-green-500 text-white ring-white";
    if (candIdx === pickedIdx) return "bg-red-500 text-white ring-white";
    return "bg-white/40 text-gray-500 ring-white/60";
  }

  function candPanelClass(candIdx: number) {
    if (!answered) return "border-ucla-blue/25 bg-white text-ucla-blue shadow-sm";
    if (candIdx === item.to.answer) return "border-green-400 bg-green-50 text-green-800";
    if (candIdx === pickedIdx) return "border-red-400 bg-red-50 text-red-800";
    return "border-gray-200 bg-gray-50 text-gray-500";
  }

  return (
    <div>
      {/* difficulty toggle + progress */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="group"
          aria-label="Cross-plane difficulty"
          className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-sm sm:text-xs"
        >
          {(coarse ? (["mc"] as Diff[]) : (["mc", "free"] as Diff[])).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => changeDiff(d)}
              aria-pressed={diff === d}
              className={`min-h-11 rounded-md px-3 py-2 font-medium transition-colors sm:min-h-9 sm:py-1.5 lg:min-h-0 lg:px-2.5 lg:py-1 ${
                diff === d ? "bg-ucla-blue text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {d === "mc" ? "Multiple choice" : "Free response (hard)"}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs font-medium text-gray-500">
          Correlation {idx + 1} of {items.length} · Score {score}/{items.length}
        </span>
      </div>
      <span className="block h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <span
          className="block h-full rounded-full bg-ucla-blue transition-all"
          style={{ width: `${((idx + 1) / items.length) * 100}%` }}
        />
      </span>

      <div className="mt-3 rounded-lg border border-ucla-blue/15 bg-ucla-light/50 px-3 py-2 text-sm">
        <p className="font-semibold text-[#003B5C]">Track the labeled structure across planes</p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
          Find <span className="font-semibold text-gray-800">{item.from.label}</span> on{" "}
          <span className="font-semibold text-gray-800">{item.to.plane}</span>. Use the source marker as
          your 3-D anchor, then pick the matching target on the paired image.
        </p>
      </div>

      <div data-screenshot-anchor="mri-viewer" className="mt-4 grid gap-5 lg:grid-cols-2">
        {/* FROM — labeled structure */}
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-ucla-blue/10 px-2.5 py-1 text-xs font-semibold text-ucla-blue">
            From · {item.from.plane}
          </span>
          <div className="relative mx-auto block w-fit min-h-[40svh] max-h-[40svh] overflow-hidden rounded-xl border border-gray-200 bg-black lg:mx-0 lg:min-h-0 lg:max-h-none lg:w-full">
            <img
              key={`${fromSrc}:${retryRevision}`}
              src={fromSrc}
              alt={`${item.from.label} on ${item.from.plane}`}
              className={`mx-auto block max-h-[40svh] w-auto max-w-full select-none object-contain lg:max-h-none lg:w-full ${
                fromFailed ? "invisible" : ""
              }`}
              draggable={false}
              onLoad={() =>
                setFailedImages((current) => {
                  if (!current.has(fromSrc)) return current;
                  const next = new Set(current);
                  next.delete(fromSrc);
                  return next;
                })
              }
              onError={() =>
                setFailedImages((current) =>
                  current.has(fromSrc) ? current : new Set(current).add(fromSrc),
                )
              }
            />
            {fromFailed && (
              <MriImageFailure
                paused
                onRetry={() => {
                  setFailedImages((current) => {
                    const next = new Set(current);
                    next.delete(fromSrc);
                    return next;
                  });
                  setRetryRevision((revision) => revision + 1);
                }}
              />
            )}
            {!fromFailed && (
              <span
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${item.from.x}%`, top: `${item.from.y}%` }}
              >
                <span className="block h-3.5 w-3.5 animate-pulse rounded-full bg-ucla-gold ring-2 ring-white shadow" />
                <span
                  className={`absolute max-w-44 rounded bg-ucla-gold px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-[#3a2d00] shadow ${sourceLabelClass(
                    item.from,
                  )}`}
                >
                  {item.from.label}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* TO — pick / click the matching structure */}
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-ucla-gold/20 px-2.5 py-1 text-xs font-semibold text-[#7a5d00]">
            To · {item.to.plane} — {diff === "mc" ? "tap the same structure" : "click the same structure"}
          </span>
          <div
            ref={toBoxRef}
            onClick={clickFree}
            onKeyDown={keyFree}
            tabIndex={diff === "free" && !answered && !interactionPaused ? 0 : -1}
            role={diff === "free" ? "application" : undefined}
            aria-label={
              diff === "free"
                ? answered
                  ? `Result: the ${item.from.label} is highlighted on ${item.to.plane}; your answer ${correct ? "was on target" : "missed"}.`
                  : `Locate the ${item.from.label} on this ${item.to.plane} MRI. Click the image, or use the arrow keys to move the crosshair (hold Shift for fine steps) and press Enter to place it.`
                : undefined
            }
            className={`relative mx-auto block w-fit min-h-[40svh] max-h-[40svh] overflow-hidden rounded-xl border border-gray-200 bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-ucla-blue focus-visible:ring-offset-2 lg:mx-0 lg:min-h-0 lg:max-h-none lg:w-full ${
              diff === "free" && !answered && !interactionPaused ? "cursor-crosshair" : ""
            }`}
          >
            <img
              key={`${toSrc}:${retryRevision}`}
              src={toSrc}
              alt={`Find the structure on ${item.to.plane}`}
              className={`mx-auto block max-h-[40svh] w-auto max-w-full select-none object-contain lg:max-h-none lg:w-full ${
                toFailed ? "invisible" : ""
              }`}
              draggable={false}
              onLoad={() =>
                setFailedImages((current) => {
                  if (!current.has(toSrc)) return current;
                  const next = new Set(current);
                  next.delete(toSrc);
                  return next;
                })
              }
              onError={() =>
                setFailedImages((current) =>
                  current.has(toSrc) ? current : new Set(current).add(toSrc),
                )
              }
            />
            {toFailed && (
              <MriImageFailure
                paused
                onRetry={() => {
                  setFailedImages((current) => {
                    const next = new Set(current);
                    next.delete(toSrc);
                    return next;
                  });
                  setRetryRevision((revision) => revision + 1);
                }}
              />
            )}

            {/* Multiple-choice candidates. On phones, the image letters are visual anchors only;
                the separate answer row below avoids overlapping thumb targets on tight anatomy. */}
            {!interactionPaused && diff === "mc" &&
              order.map((candIdx, pos) => {
                const c = item.to.candidates[candIdx];
                return (
                  <span key={candIdx}>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center lg:hidden"
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    >
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold shadow ring-2 transition-transform ${candClass(
                          candIdx,
                        )}`}
                      >
                        {LETTERS[pos]}
                      </span>
                    </span>
                    <button
                      type="button"
                      disabled={answered}
                      onClick={() => chooseMc(candIdx)}
                      aria-label={`Option ${LETTERS[pos]} on ${item.to.plane}`}
                      className="absolute hidden h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center lg:grid"
                      style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    >
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold shadow ring-2 transition-transform ${candClass(
                          candIdx,
                        )}`}
                      >
                        {LETTERS[pos]}
                      </span>
                    </button>
                  </span>
                );
              })}

            {/* Free-response: reveal the target + the click after answering */}
            {!interactionPaused && diff === "free" && answered && (
              <>
                <span
                  className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/30 ring-2 ring-green-400"
                  style={{ left: `${answerPos.x}%`, top: `${answerPos.y}%` }}
                />
                {clickPct && (
                  <span
                    className={`pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white ${
                      correct ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ left: `${clickPct.x}%`, top: `${clickPct.y}%` }}
                  />
                )}
              </>
            )}
            {!interactionPaused && diff === "free" && !answered && keyboardActive && (
              <span
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${keyboardPoint.x}%`, top: `${keyboardPoint.y}%` }}
                aria-hidden="true"
              >
                <span className="block h-6 w-6 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.6)]" />
                <span className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </span>
            )}
          </div>
          {diff === "mc" && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:hidden">
              {order.map((candIdx, pos) => (
                <button
                  key={candIdx}
                  type="button"
                  disabled={answered || interactionPaused}
                  onClick={() => chooseMc(candIdx)}
                  aria-label={`Choose option ${LETTERS[pos]} on ${item.to.plane}`}
                  className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-default ${candPanelClass(
                    candIdx,
                  )}`}
                >
                  Option {LETTERS[pos]}
                </button>
              ))}
            </div>
          )}
          {diff === "mc" && !answered && (
            <p className="mt-1.5 text-xs text-gray-500">
              Pick the letter sitting over the same normal structure.
            </p>
          )}
          {diff === "free" && !answered && (
            <p className="mt-1.5 text-xs text-gray-500">
              No labels — click where the structure is, or use the arrow keys and press Enter.
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-gray-700">{item.prompt}</p>

      {answered && (
        <div
          className={`mt-3 rounded-lg border px-4 py-3 ${
            correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
          }`}
        >
          <p className={`text-sm font-semibold ${correct ? "text-green-800" : "text-red-800"}`}>
            {correct
              ? "Correct — same structure, different plane."
              : `Not quite — the correct structure is highlighted in green.`}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">{responseSummary}</p>
          <p className="mt-1 text-sm text-gray-600">{item.explanation}</p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <Button
          size="sm"
          disabled={!answered}
          onClick={next}
          className="min-h-11 px-5 text-sm lg:min-h-0 lg:px-3 lg:text-xs"
        >
          {idx >= items.length - 1 ? "See results" : "Next →"}
        </Button>
      </div>
    </div>
  );
}

function MriImageFailure({ onRetry, paused = false }: { onRetry: () => void; paused?: boolean }) {
  return (
    <div
      role="alert"
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white"
    >
      <p>This MRI slice could not be loaded{paused ? "; the drill is paused" : ""}.</p>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onRetry();
        }}
        className="rounded-md border border-white/60 bg-white/10 px-3 py-2 font-medium hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ucla-gold"
      >
        Retry image
      </button>
    </div>
  );
}
