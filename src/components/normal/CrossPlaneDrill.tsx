import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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

/**
 * Cross-plane correlation drill — a structure is labeled on one plane (FROM) and
 * the learner finds the SAME structure on a different plane (TO). Two difficulties:
 *  • Multiple choice — tap the matching lettered candidate.
 *  • Free response — no letters; click the structure directly (graded by which
 *    candidate region the click lands nearest to).
 * Trains the mental 3-D model that ties the planes together.
 */
export default function CrossPlaneDrill({ items }: { items: CorrelationItem[] }) {
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
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const toBoxRef = useRef<HTMLDivElement>(null);

  const item = items[idx];

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
  }

  // Switching difficulty re-opens the current item (but never double-scores it).
  function changeDiff(d: Diff) {
    if (d === diff) return;
    setDiff(d);
    setAnswered(false);
    setPickedIdx(null);
    setClickPct(null);
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

  // Index of the candidate nearest a click (Voronoi grading for free response).
  function nearestCandidate(x: number, y: number) {
    let best = 0;
    let bestD = Infinity;
    item.to.candidates.forEach((c, i) => {
      const d = (c.x - x) ** 2 + (c.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }

  const correct =
    answered &&
    (diff === "mc"
      ? pickedIdx === item.to.answer
      : clickPct !== null && nearestCandidate(clickPct.x, clickPct.y) === item.to.answer);

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

  function clickFree(e: React.MouseEvent<HTMLDivElement>) {
    if (answered || diff !== "free") return;
    const box = toBoxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setClickPct({ x, y });
    commit(nearestCandidate(x, y) === item.to.answer);
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

  return (
    <div>
      {/* difficulty toggle + progress */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs">
          {(coarse ? (["mc"] as Diff[]) : (["mc", "free"] as Diff[])).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => changeDiff(d)}
              className={`min-h-9 rounded-md px-3 py-1.5 font-medium transition-colors lg:min-h-0 lg:px-2.5 lg:py-1 ${
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

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {/* FROM — labeled structure */}
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-ucla-blue/10 px-2.5 py-1 text-xs font-semibold text-ucla-blue">
            From · {item.from.plane}
          </span>
          <div className="relative mx-auto block w-fit max-h-[40svh] overflow-hidden rounded-xl border border-gray-200 bg-black lg:mx-0 lg:max-h-none lg:w-full">
            <img
              src={`${item.from.dir}/slice_${pad(item.from.sliceIndex)}.jpg`}
              alt={`${item.from.label} on ${item.from.plane}`}
              className="mx-auto block max-h-[40svh] w-auto max-w-full select-none object-contain lg:max-h-none lg:w-full"
              draggable={false}
            />
            <span
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${item.from.x}%`, top: `${item.from.y}%` }}
            >
              <span className="block h-3.5 w-3.5 animate-pulse rounded-full bg-ucla-gold ring-2 ring-white shadow" />
              <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded bg-ucla-gold px-1.5 py-0.5 text-[10px] font-semibold text-[#3a2d00] shadow">
                {item.from.label}
              </span>
            </span>
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
            className={`relative mx-auto block w-fit max-h-[40svh] overflow-hidden rounded-xl border border-gray-200 bg-black lg:mx-0 lg:max-h-none lg:w-full ${
              diff === "free" && !answered ? "cursor-crosshair" : ""
            }`}
          >
            <img
              src={`${item.to.dir}/slice_${pad(item.to.sliceIndex)}.jpg`}
              alt={`Find the structure on ${item.to.plane}`}
              className="mx-auto block max-h-[40svh] w-auto max-w-full select-none object-contain lg:max-h-none lg:w-full"
              draggable={false}
            />

            {/* Multiple-choice candidates */}
            {diff === "mc" &&
              order.map((candIdx, pos) => {
                const c = item.to.candidates[candIdx];
                return (
                  <button
                    key={candIdx}
                    type="button"
                    disabled={answered}
                    onClick={() => chooseMc(candIdx)}
                    aria-label={`Option ${LETTERS[pos]}`}
                    className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center lg:h-7 lg:w-7"
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
                );
              })}

            {/* Free-response: reveal the target + the click after answering */}
            {diff === "free" && answered && (
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
          </div>
          {diff === "free" && !answered && (
            <p className="mt-1.5 text-xs text-gray-500">No labels — click where the structure is.</p>
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
