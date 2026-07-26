import { useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import type { CorrelationItem } from "@/content/normal-mri-types";
import type { NormalWorkstationSeries } from "@/content/normal-workstation-series";

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const round1 = (n: number) => Math.round(n * 10) / 10;
const pad = (n: number) => String(n + 1).padStart(2, "0");

type DragTarget = { side: "from" } | { side: "to"; candidateIndex: number };

export default function CrossPlaneAdjuster({
  workspaceId,
  items,
  series,
}: {
  workspaceId: string;
  items: CorrelationItem[];
  series: NormalWorkstationSeries[];
}) {
  const storeKey = `uclaSportsMri.normalMriCrossPlaneAdjustment:${workspaceId}`;
  const baseSig = useMemo(() => JSON.stringify(items), [items]);
  const savedDraft = useMemo(() => loadDraft(storeKey, baseSig), [baseSig, storeKey]);
  const [draftItems, setDraftItems] = useState<CorrelationItem[]>(
    () => savedDraft ?? structuredClone(items),
  );
  const [itemIndex, setItemIndex] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const fromBoxRef = useRef<HTMLDivElement>(null);
  const toBoxRef = useRef<HTMLDivElement>(null);
  const dragTarget = useRef<DragTarget | null>(null);
  const exportText = useMemo(
    () => JSON.stringify({ crossPlane: draftItems }, null, 2),
    [draftItems],
  );

  if (draftItems.length === 0) {
    return (
      <section className="border-t border-gray-200 pt-7">
        <h2 className="text-lg font-semibold text-gray-900">Adjust cross-plane markers</h2>
        <p className="mt-2 text-sm text-gray-500">No cross-plane correlations are currently authored.</p>
      </section>
    );
  }

  const item = draftItems[Math.min(itemIndex, draftItems.length - 1)];
  const fromCount = stackCount(series, item.from.dir, item.from.sliceIndex);
  const toCount = stackCount(series, item.to.dir, item.to.sliceIndex);
  const fromSrc = `${item.from.dir}/slice_${pad(item.from.sliceIndex)}.jpg`;
  const toSrc = `${item.to.dir}/slice_${pad(item.to.sliceIndex)}.jpg`;

  function persist(next: CorrelationItem[]) {
    try {
      localStorage.setItem(storeKey, JSON.stringify({ baseSig, items: next }));
    } catch {
      /* ignore */
    }
  }

  function updateSelected(update: (current: CorrelationItem) => CorrelationItem) {
    setDraftItems((current) => {
      const next = current.map((candidate, index) =>
        index === itemIndex ? update(candidate) : candidate,
      );
      persist(next);
      return next;
    });
  }

  function setSlice(side: "from" | "to", sliceIndex: number) {
    updateSelected((current) =>
      side === "from"
        ? { ...current, from: { ...current.from, sliceIndex } }
        : { ...current, to: { ...current.to, sliceIndex } },
    );
  }

  function setMarker(target: DragTarget, xRaw: number, yRaw: number) {
    const x = round1(clamp(xRaw));
    const y = round1(clamp(yRaw));
    updateSelected((current) => {
      if (target.side === "from") {
        return { ...current, from: { ...current.from, x, y } };
      }
      return {
        ...current,
        to: {
          ...current.to,
          candidates: current.to.candidates.map((candidate, index) =>
            index === target.candidateIndex ? { x, y } : candidate,
          ),
        },
      };
    });
  }

  function onPointerMove(side: "from" | "to", event: React.PointerEvent) {
    const target = dragTarget.current;
    if (!target || target.side !== side) return;
    const box = side === "from" ? fromBoxRef.current : toBoxRef.current;
    if (!box) return;
    const bounds = box.getBoundingClientRect();
    setMarker(
      target,
      ((event.clientX - bounds.left) / bounds.width) * 100,
      ((event.clientY - bounds.top) / bounds.height) * 100,
    );
  }

  function nudgeMarker(target: DragTarget, event: React.KeyboardEvent) {
    const offsets: Record<string, { x: number; y: number }> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
    };
    const offset = offsets[event.key];
    if (!offset) return;
    const point =
      target.side === "from"
        ? item.from
        : item.to.candidates[target.candidateIndex];
    const step = event.shiftKey ? 0.1 : 1;
    setMarker(target, point.x + offset.x * step, point.y + offset.y * step);
    event.preventDefault();
  }

  async function copyChanges() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(exportText);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("failed");
    }
  }

  function reset() {
    const next = structuredClone(items);
    setDraftItems(next);
    persist(next);
  }

  return (
    <section className="border-t border-gray-200 pt-7" aria-labelledby={`${workspaceId}-cross-plane-adjuster`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id={`${workspaceId}-cross-plane-adjuster`} className="text-lg font-semibold text-gray-900">
            Adjust cross-plane markers
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-gray-500">
            Review both linked planes together. Source, correct-target, and distractor positions are saved on
            this device until the copied update is reviewed and deployed.
          </p>
        </div>
        <span className="text-xs font-medium text-gray-500">
          Correlation {itemIndex + 1} of {draftItems.length}
        </span>
      </div>

      <label className="mt-4 block max-w-2xl text-xs font-semibold text-gray-700">
        Cross-plane correlation
        <select
          value={itemIndex}
          onChange={(event) => {
            dragTarget.current = null;
            setItemIndex(Number(event.target.value));
          }}
          className="mt-1 block min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-normal text-gray-900 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        >
          {draftItems.map((candidate, index) => (
            <option key={candidate.id} value={index}>
              {index + 1}. {candidate.from.label}: {candidate.from.plane} to {candidate.to.plane}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-brand-blue">Source: {item.from.plane}</p>
            <p className="text-xs tabular-nums text-gray-500">
              x {item.from.x.toFixed(1)}%, y {item.from.y.toFixed(1)}%
            </p>
          </div>
          <div
            ref={fromBoxRef}
            onPointerMove={(event) => onPointerMove("from", event)}
            onPointerUp={() => {
              dragTarget.current = null;
            }}
            onPointerCancel={() => {
              dragTarget.current = null;
            }}
            className="relative mx-auto w-full max-w-[620px] select-none overflow-hidden rounded-lg bg-black"
          >
            <img
              src={fromSrc}
              alt={`${item.from.label} source marker on ${item.from.plane}`}
              draggable={false}
              className="block w-full select-none"
            />
            <button
              type="button"
              data-cross-plane-marker="source"
              aria-label={`Move source marker for ${item.from.label}`}
              title={`Source: ${item.from.label}`}
              onPointerDown={(event) => {
                dragTarget.current = { side: "from" };
                fromBoxRef.current?.setPointerCapture(event.pointerId);
              }}
              onKeyDown={(event) => nudgeMarker({ side: "from" }, event)}
              style={{ left: `${item.from.x}%`, top: `${item.from.y}%` }}
              className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            >
              <span className="block h-6 w-6 rounded-full border-2 border-brand-gold bg-brand-gold/30 shadow-[0_0_0_2px_rgba(0,0,0,0.65)]" />
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold" />
            </button>
          </div>
          <label className="mt-3 flex items-center gap-3 text-xs text-gray-600">
            <span className="w-28 shrink-0 tabular-nums">
              Source slice {item.from.sliceIndex + 1} / {fromCount}
            </span>
            <input
              type="range"
              min={0}
              max={fromCount - 1}
              value={item.from.sliceIndex}
              onChange={(event) => setSlice("from", Number(event.target.value))}
              aria-label={`Source slice for ${item.from.plane}`}
              className="flex-1 accent-brand-blue"
            />
          </label>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#7a5d00]">Target: {item.to.plane}</p>
            <p className="text-xs text-gray-500">Gold is correct; blue markers are distractors</p>
          </div>
          <div
            ref={toBoxRef}
            onPointerMove={(event) => onPointerMove("to", event)}
            onPointerUp={() => {
              dragTarget.current = null;
            }}
            onPointerCancel={() => {
              dragTarget.current = null;
            }}
            className="relative mx-auto w-full max-w-[620px] select-none overflow-hidden rounded-lg bg-black"
          >
            <img
              src={toSrc}
              alt={`Target markers on ${item.to.plane}`}
              draggable={false}
              className="block w-full select-none"
            />
            {item.to.candidates.map((candidate, candidateIndex) => {
              const correct = candidateIndex === item.to.answer;
              const distractorNumber = distractorOrdinal(candidateIndex, item.to.answer);
              const markerLabel = correct ? "Correct target" : `Distractor ${distractorNumber}`;
              return (
                <button
                  type="button"
                  key={candidateIndex}
                  data-cross-plane-marker={correct ? "correct-target" : "distractor"}
                  aria-label={`Move ${markerLabel.toLowerCase()} marker on ${item.to.plane}`}
                  title={markerLabel}
                  onPointerDown={(event) => {
                    dragTarget.current = { side: "to", candidateIndex };
                    toBoxRef.current?.setPointerCapture(event.pointerId);
                  }}
                  onKeyDown={(event) =>
                    nudgeMarker({ side: "to", candidateIndex }, event)
                  }
                  style={{ left: `${candidate.x}%`, top: `${candidate.y}%` }}
                  className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
                >
                  <span
                    className={`grid h-7 min-w-7 place-items-center rounded-full border-2 px-1 text-[10px] font-bold shadow-[0_0_0_2px_rgba(0,0,0,0.65)] ${
                      correct
                        ? "border-brand-gold bg-brand-gold text-[#3a2d00]"
                        : "border-white bg-brand-blue text-white"
                    }`}
                  >
                    {correct ? "T" : `D${distractorNumber}`}
                  </span>
                </button>
              );
            })}
          </div>
          <label className="mt-3 flex items-center gap-3 text-xs text-gray-600">
            <span className="w-28 shrink-0 tabular-nums">
              Target slice {item.to.sliceIndex + 1} / {toCount}
            </span>
            <input
              type="range"
              min={0}
              max={toCount - 1}
              value={item.to.sliceIndex}
              onChange={(event) => setSlice("to", Number(event.target.value))}
              aria-label={`Target slice for ${item.to.plane}`}
              className="flex-1 accent-brand-blue"
            />
          </label>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs tabular-nums text-gray-500 sm:grid-cols-4">
            {item.to.candidates.map((candidate, candidateIndex) => (
              <span key={candidateIndex}>
                {candidateIndex === item.to.answer
                  ? "Target"
                  : `D${distractorOrdinal(candidateIndex, item.to.answer)}`}: x{" "}
                {candidate.x.toFixed(1)}, y {candidate.y.toFixed(1)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        <Button size="sm" onClick={copyChanges}>
          {copyState === "copied" ? "Cross-plane changes copied" : "Copy cross-plane changes"}
        </Button>
        <Button size="sm" variant="secondary" onClick={reset}>
          Reset cross-plane draft
        </Button>
      </div>

      {copyState === "failed" && (
        <div className="mt-3" role="alert">
          <p className="text-xs font-medium text-red-700">
            Automatic copy was blocked. Select and copy the cross-plane changes below.
          </p>
          <textarea
            readOnly
            value={exportText}
            aria-label="Cross-plane changes to copy manually"
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 h-28 w-full resize-y rounded border border-gray-300 bg-gray-50 p-2 font-mono text-[11px] text-gray-800"
          />
        </div>
      )}
    </section>
  );
}

function stackCount(
  series: NormalWorkstationSeries[],
  dir: string,
  currentSliceIndex: number,
) {
  return series.find((candidate) => candidate.dir === dir)?.count ?? currentSliceIndex + 1;
}

function distractorOrdinal(candidateIndex: number, answerIndex: number) {
  return candidateIndex < answerIndex ? candidateIndex + 1 : candidateIndex;
}

function loadDraft(
  storeKey: string,
  baseSig: string,
): CorrelationItem[] | undefined {
  try {
    const saved = localStorage.getItem(storeKey);
    if (!saved) return undefined;
    const parsed = JSON.parse(saved);
    if (parsed && parsed.baseSig === baseSig && Array.isArray(parsed.items)) {
      return parsed.items;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}
