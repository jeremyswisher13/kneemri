import { useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { PlaneLearn, QuizItem, TourStep } from "@/content/normal-mri-types";
import { locateRevealSpanPercent } from "./knowledge-check-reveal";
import {
  MAX_REGION_TOLERANCE,
  MIN_REGION_TOLERANCE,
  type AdjusterKind,
  adjusterHandles,
  clamp,
  handleAriaLabel,
  isDegenerateRegion,
  markerOutsideRegion,
  round1,
  sameAnchor,
  seedRegion,
  withRegionPoint,
  withRegionTolerance,
  withoutRegion,
} from "./marker-adjuster-logic";

/**
 * Admin-only authoring workbench. The director scrubs to the best slice and
 * drags each marker onto the structure; the copied marker changes hand the
 * exact slice + coordinates back for review and deployment. Working state is
 * kept in localStorage so adjustments survive a refresh.
 *
 * Elongated structures (tendons, ligaments) also carry a `locateRegion`: a
 * centreline the localization scorer accepts anywhere along its length. Those
 * endpoints are authored HERE, on the image, for the same reason markers are —
 * nobody can read a coordinate off an MRI by eye, so the only trustworthy way
 * to add a region to a course is for faculty to drag it onto the slice.
 */

type Sel = { kind: AdjusterKind; idx: number };

export default function MarkerAdjuster({
  planeId,
  planeLabel,
  dir,
  count,
  learn,
}: {
  planeId: string;
  planeLabel: string;
  dir: string;
  count: number;
  learn: PlaneLearn;
}) {
  // Plane IDs such as "cor-t2fs" repeat between courses. Include the image
  // directory so a draft from one anatomy cannot overwrite another.
  const storeKey = `uclaSportsMri.normalMriAdjustment:${dir}:${planeId}`;
  const legacyStoreKey = `nk-adjust:${planeId}`;
  // Signature of the committed content. If it changes (a newer version was
  // deployed), any saved local draft is stale and we start fresh — this stops a
  // stale draft from silently reverting edits that were already committed.
  const baseSig = useMemo(() => JSON.stringify({ t: learn.tour, q: learn.quiz }), [learn]);
  const savedDraft = useMemo(() => {
    const current = loadDraft(storeKey, baseSig);
    if (current.tour || current.quiz) return current;
    return loadDraft(legacyStoreKey, baseSig);
  }, [baseSig, legacyStoreKey, storeKey]);

  const [tour, setTour] = useState<TourStep[]>(() => savedDraft.tour ?? structuredClone(learn.tour));
  const [quiz, setQuiz] = useState<QuizItem[]>(() => savedDraft.quiz ?? structuredClone(learn.quiz));
  const [sel, setSel] = useState<Sel>({ kind: "tour", idx: 0 });
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const boxRef = useRef<HTMLDivElement>(null);
  const dragIdx = useRef<number | null>(null);

  function persist(nt: TourStep[], nq: QuizItem[]) {
    try {
      localStorage.setItem(storeKey, JSON.stringify({ baseSig, tour: nt, quiz: nq }));
    } catch {
      /* ignore */
    }
  }

  const item = sel.kind === "tour" ? tour[sel.idx] : quiz[sel.idx];
  const sliceIndex = item?.sliceIndex ?? 0;
  const handles = adjusterHandles(sel.kind, item);
  const selectedQuizItem = sel.kind === "quiz" ? quiz[sel.idx] : undefined;
  const region = selectedQuizItem?.locateRegion;

  function setSlice(v: number) {
    if (sel.kind === "tour") {
      const selectedStep = tour[sel.idx];
      const nt = tour.map((s, i) => (i === sel.idx ? { ...s, sliceIndex: v } : s));
      const nq = quiz.map((q) =>
        selectedStep &&
        q.sliceIndex === selectedStep.sliceIndex &&
        selectedStep.markers.some((marker) => sameAnchor(marker, q.marker))
          ? { ...q, sliceIndex: v }
          : q,
      );
      setTour(nt);
      setQuiz(nq);
      persist(nt, nq);
    } else {
      const selectedQuiz = quiz[sel.idx];
      const nt = tour.map((step) =>
        selectedQuiz &&
        step.sliceIndex === selectedQuiz.sliceIndex &&
        step.markers.some((marker) => sameAnchor(marker, selectedQuiz.marker))
          ? { ...step, sliceIndex: v }
          : step,
      );
      const nq = quiz.map((q, i) => (i === sel.idx ? { ...q, sliceIndex: v } : q));
      setTour(nt);
      setQuiz(nq);
      persist(nt, nq);
    }
  }

  function setMarker(mi: number, xRaw: number, yRaw: number) {
    const x = round1(clamp(xRaw));
    const y = round1(clamp(yRaw));
    if (sel.kind === "tour") {
      const selectedStep = tour[sel.idx];
      const priorMarker = selectedStep?.markers[mi];
      const nt = tour.map((s, i) =>
        i === sel.idx ? { ...s, markers: s.markers.map((m, j) => (j === mi ? { ...m, x, y } : m)) } : s,
      );
      const nq = quiz.map((q) =>
        selectedStep &&
        priorMarker &&
        q.sliceIndex === selectedStep.sliceIndex &&
        sameAnchor(q.marker, priorMarker)
          ? { ...q, marker: { x, y } }
          : q,
      );
      setTour(nt);
      setQuiz(nq);
      persist(nt, nq);
    } else {
      const selectedQuiz = quiz[sel.idx];
      const nt = tour.map((step) =>
        selectedQuiz && step.sliceIndex === selectedQuiz.sliceIndex
          ? {
              ...step,
              markers: step.markers.map((marker) =>
                sameAnchor(marker, selectedQuiz.marker) ? { ...marker, x, y } : marker,
              ),
            }
          : step,
      );
      // Sibling quiz items sharing this slice + anchor are the SAME point, so
      // they move together — matching what the tour->quiz path already does and
      // what the panel copy promises about synchronized anchors.
      const nq = quiz.map((q, i) =>
        i === sel.idx ||
        (selectedQuiz && q.sliceIndex === selectedQuiz.sliceIndex && sameAnchor(q.marker, selectedQuiz.marker))
          ? { ...q, marker: { x, y } }
          : q,
      );
      setTour(nt);
      setQuiz(nq);
      persist(nt, nq);
    }
  }

  function setRegionPoint(which: "start" | "end", xRaw: number, yRaw: number) {
    const current = quiz[sel.idx]?.locateRegion;
    if (sel.kind !== "quiz" || !current) return;
    const nq = quiz.map((q, i) =>
      i === sel.idx ? { ...q, locateRegion: withRegionPoint(current, which, xRaw, yRaw) } : q,
    );
    setQuiz(nq);
    persist(tour, nq);
  }

  function setRegionTolerance(toleranceRaw: number) {
    const current = quiz[sel.idx]?.locateRegion;
    if (sel.kind !== "quiz" || !current) return;
    const nq = quiz.map((q, i) =>
      i === sel.idx ? { ...q, locateRegion: withRegionTolerance(current, toleranceRaw) } : q,
    );
    setQuiz(nq);
    persist(tour, nq);
  }

  function addRegion() {
    const current = quiz[sel.idx];
    if (sel.kind !== "quiz" || !current || current.locateRegion) return;
    const nq = quiz.map((q, i) => (i === sel.idx ? { ...q, locateRegion: seedRegion(q.marker) } : q));
    setQuiz(nq);
    persist(tour, nq);
  }

  function removeRegion() {
    if (sel.kind !== "quiz" || !quiz[sel.idx]?.locateRegion) return;
    const nq = quiz.map((q, i) => (i === sel.idx ? withoutRegion(q) : q));
    setQuiz(nq);
    persist(tour, nq);
  }

  // Region endpoints share the marker drag path, so the handle's role — not its
  // index — decides what a drag writes to.
  function setHandle(hi: number, xRaw: number, yRaw: number) {
    const handle = handles[hi];
    if (!handle) return;
    if (handle.role === "marker") setMarker(hi, xRaw, yRaw);
    else setRegionPoint(handle.role === "region-start" ? "start" : "end", xRaw, yRaw);
  }

  function onMove(e: React.PointerEvent) {
    if (dragIdx.current === null || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    setHandle(dragIdx.current, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  }

  const exportText = useMemo(() => JSON.stringify({ tour, quiz }, null, 2), [tour, quiz]);

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
    const t = structuredClone(learn.tour);
    const q = structuredClone(learn.quiz);
    setTour(t);
    setQuiz(q);
    persist(t, q);
  }

  const src = `${dir}/slice_${String(sliceIndex + 1).padStart(2, "0")}.jpg`;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Image editor */}
      <div>
        <div
          ref={boxRef}
          onPointerMove={onMove}
          onPointerUp={() => (dragIdx.current = null)}
          className="relative mx-auto w-full max-w-[560px] touch-none select-none overflow-hidden rounded-xl bg-black"
        >
          <img src={src} alt="" draggable={false} className="block w-full select-none" />
          {region && (
            <svg
              data-testid="adjust-locate-region"
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/*
                Same geometry the reveal uses in KnowledgeCheck: the halo is the
                band the scorer accepts (tolerance is a radius, so the stroke is
                twice it) and it deliberately scales with the box, because the
                hit test measures in stretched percent space too. Authoring
                against anything narrower would hide what fellows are graded on.
              */}
              <line
                x1={region.start.x}
                y1={region.start.y}
                x2={region.end.x}
                y2={region.end.y}
                stroke="rgba(255, 209, 0, 0.18)"
                strokeWidth={locateRevealSpanPercent(region)}
                strokeLinecap="round"
              />
              <line
                x1={region.start.x}
                y1={region.start.y}
                x2={region.end.x}
                y2={region.end.y}
                stroke="#FFD100"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
          {handles.map((m, mi) => (
            <button
              type="button"
              key={mi}
              aria-label={handleAriaLabel(m, mi)}
              onPointerDown={(e) => {
                dragIdx.current = mi;
                boxRef.current?.setPointerCapture(e.pointerId);
              }}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
            >
              {/* Line ends are white so they stay tellable from the gold answer marker. */}
              <span
                className={`block h-6 w-6 rounded-full border-2 shadow-[0_0_0_2px_rgba(0,0,0,0.6)] ${
                  m.role === "marker" ? "border-brand-gold bg-brand-gold/25" : "border-white bg-white/25"
                }`}
              />
              <span
                className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  m.role === "marker" ? "bg-brand-gold" : "bg-white"
                }`}
              />
              {m.label && (
                <span className="absolute left-1/2 top-[calc(50%+16px)] -translate-x-1/2 whitespace-nowrap rounded bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {m.label}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs tabular-nums text-gray-500">
            Slice {sliceIndex + 1} / {count}
          </span>
          <input
            type="range"
            min={0}
            max={count - 1}
            value={sliceIndex}
            onChange={(e) => setSlice(Number(e.target.value))}
            aria-label={`Slice for ${planeLabel}`}
            className="flex-1 accent-brand-blue"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Drag the gold marker onto the structure; use the slider to pick the best slice. White handles set the
          ends of a locate line. Your draft is saved on this device as you go.
        </p>
      </div>

      {/* Controls */}
      <div>
        <Card>
          <h3 className="text-sm font-semibold text-gray-900">Adjust markers — {planeLabel}</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Pick a structure, scrub to the best slice, and drag the marker. Then copy the marker changes and send
            them to Dr. Swisher for review and deployment. Matching tour and quiz anchors stay synchronized.
          </p>

          <div className="mt-3 max-h-72 space-y-0.5 overflow-y-auto pr-1">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Tour steps</p>
            {tour.map((s, i) => (
              <button
                key={`t${i}`}
                onClick={() => setSel({ kind: "tour", idx: i })}
                className={`block w-full truncate rounded px-2 py-1 text-left text-xs ${
                  sel.kind === "tour" && sel.idx === i ? "bg-brand-blue text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}. {s.title} <span className="opacity-60">· sl {s.sliceIndex + 1}</span>
              </button>
            ))}
            <p className="mt-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Quiz</p>
            {quiz.map((q, i) => (
              <button
                key={`q${i}`}
                onClick={() => setSel({ kind: "quiz", idx: i })}
                className={`block w-full truncate rounded px-2 py-1 text-left text-xs ${
                  sel.kind === "quiz" && sel.idx === i ? "bg-brand-blue text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {q.options[q.answer]}{" "}
                <span className="opacity-60">
                  · sl {q.sliceIndex + 1}
                  {q.locateRegion ? " · line" : ""}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Locate line</p>
            {sel.kind !== "quiz" || !selectedQuizItem ? (
              <p className="mt-1 text-xs text-gray-500">Pick a quiz item to place a locate line.</p>
            ) : !region ? (
              <>
                <p className="mt-1 text-xs text-gray-500">
                  Long structures (tendons, ligaments) should score anywhere along their course, not just at one
                  point. Add a line, then drag each white end along the structure.
                </p>
                <Button size="sm" variant="secondary" className="mt-2" onClick={addRegion}>
                  Add locate line
                </Button>
              </>
            ) : (
              <>
                <div className="mt-2 flex items-center gap-3">
                  <span className="w-28 shrink-0 text-xs tabular-nums text-gray-500">
                    Half-width {region.tolerance}%
                  </span>
                  <input
                    type="range"
                    min={MIN_REGION_TOLERANCE}
                    max={MAX_REGION_TOLERANCE}
                    step={0.5}
                    value={region.tolerance}
                    onChange={(e) => setRegionTolerance(Number(e.target.value))}
                    aria-label="Locate line half-width"
                    className="flex-1 accent-brand-blue"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  The gold band is exactly what the scorer accepts — keep it inside the structure.
                </p>
                {isDegenerateRegion(region) && (
                  <p className="mt-1 text-xs font-medium text-red-700">
                    Both ends sit on the same spot, so this scores as a circle. Drag them apart along the structure.
                  </p>
                )}
                {markerOutsideRegion(selectedQuizItem.marker, region) && (
                  <p className="mt-1 text-xs font-medium text-red-700">
                    The gold marker is outside the band. The same item is also served as an identify question,
                    where this marker is the pin drawn on the image — so it has to sit on the structure the band
                    traces. Move the marker onto the line or widen the band.
                  </p>
                )}
                <Button size="sm" variant="secondary" className="mt-2" onClick={removeRegion}>
                  Remove locate line
                </Button>
              </>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
            <Button size="sm" onClick={copyChanges}>
              {copyState === "copied" ? "Changes copied" : "Copy marker changes"}
            </Button>
            <Button size="sm" variant="secondary" onClick={reset}>
              Reset to committed
            </Button>
          </div>
          {copyState === "failed" && (
            <div className="mt-3" role="alert">
              <p className="text-xs font-medium text-red-700">
                Automatic copy was blocked. Select and copy the marker changes below.
              </p>
              <textarea
                readOnly
                value={exportText}
                aria-label="Marker changes to copy manually"
                onFocus={(event) => event.currentTarget.select()}
                className="mt-2 h-28 w-full resize-y rounded border border-gray-300 bg-gray-50 p-2 font-mono text-[11px] text-gray-800"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function loadDraft(storeKey: string, baseSig: string): { tour?: TourStep[]; quiz?: QuizItem[] } {
  try {
    const s = localStorage.getItem(storeKey);
    if (s) {
      const parsed = JSON.parse(s);
      // Only restore a draft that was saved against the SAME committed baseline.
      if (parsed && parsed.baseSig === baseSig) return { tour: parsed.tour, quiz: parsed.quiz };
    }
  } catch {
    /* ignore */
  }
  return {};
}
