import { useMemo, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import type { PlaneLearn, QuizItem, TourStep } from "@/content/normal-mri-types";

/**
 * Admin-only authoring workbench. The director scrubs to the best slice and
 * drags each marker onto the structure; "Copy JSON" hands the exact slice +
 * coordinates back to be committed into normal-knee-learn.ts. Working state is
 * kept in localStorage so adjustments survive a refresh.
 */

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

type Sel = { kind: "tour" | "quiz"; idx: number };

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
  const storeKey = `nk-adjust:${planeId}`;
  // Signature of the committed content. If it changes (a newer version was
  // deployed), any saved local draft is stale and we start fresh — this stops a
  // stale draft from silently reverting edits that were already committed.
  const baseSig = useMemo(() => JSON.stringify({ t: learn.tour, q: learn.quiz }), [learn]);

  const [tour, setTour] = useState<TourStep[]>(() => loadDraft(storeKey, baseSig).tour ?? structuredClone(learn.tour));
  const [quiz, setQuiz] = useState<QuizItem[]>(() => loadDraft(storeKey, baseSig).quiz ?? structuredClone(learn.quiz));
  const [sel, setSel] = useState<Sel>({ kind: "tour", idx: 0 });
  const [copied, setCopied] = useState(false);

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
  const markers: { x: number; y: number; label?: string }[] = !item
    ? []
    : sel.kind === "tour"
      ? (item as TourStep).markers
      : [{ x: (item as QuizItem).marker.x, y: (item as QuizItem).marker.y }];

  function setSlice(v: number) {
    if (sel.kind === "tour") {
      const nt = tour.map((s, i) => (i === sel.idx ? { ...s, sliceIndex: v } : s));
      setTour(nt);
      persist(nt, quiz);
    } else {
      const nq = quiz.map((q, i) => (i === sel.idx ? { ...q, sliceIndex: v } : q));
      setQuiz(nq);
      persist(tour, nq);
    }
  }

  function setMarker(mi: number, xRaw: number, yRaw: number) {
    const x = round1(clamp(xRaw));
    const y = round1(clamp(yRaw));
    if (sel.kind === "tour") {
      const nt = tour.map((s, i) =>
        i === sel.idx ? { ...s, markers: s.markers.map((m, j) => (j === mi ? { ...m, x, y } : m)) } : s,
      );
      setTour(nt);
      persist(nt, quiz);
    } else {
      const nq = quiz.map((q, i) => (i === sel.idx ? { ...q, marker: { x, y } } : q));
      setQuiz(nq);
      persist(tour, nq);
    }
  }

  function onMove(e: React.PointerEvent) {
    if (dragIdx.current === null || !boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    setMarker(dragIdx.current, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
  }

  const exportText = useMemo(() => JSON.stringify({ tour, quiz }, null, 2), [tour, quiz]);

  function copyJson() {
    navigator.clipboard?.writeText(exportText).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
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
          {markers.map((m, mi) => (
            <div
              key={mi}
              onPointerDown={(e) => {
                dragIdx.current = mi;
                boxRef.current?.setPointerCapture(e.pointerId);
              }}
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
            >
              <span className="block h-6 w-6 rounded-full border-2 border-ucla-gold bg-ucla-gold/25 shadow-[0_0_0_2px_rgba(0,0,0,0.6)]" />
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ucla-gold" />
              {m.label && (
                <span className="absolute left-1/2 top-[150%] -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {m.label}
                </span>
              )}
            </div>
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
            className="flex-1 accent-ucla-blue"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Drag the gold marker onto the structure; use the slider to pick the best slice. Saved as you go.
        </p>
      </div>

      {/* Controls */}
      <div>
        <Card>
          <h3 className="text-sm font-semibold text-gray-900">Adjust markers — {planeLabel}</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Pick a structure, scrub to the best slice, drag the marker. Then <strong>Copy JSON</strong> and send it
            to me to commit.
          </p>

          <div className="mt-3 max-h-72 space-y-0.5 overflow-y-auto pr-1">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Tour steps</p>
            {tour.map((s, i) => (
              <button
                key={`t${i}`}
                onClick={() => setSel({ kind: "tour", idx: i })}
                className={`block w-full truncate rounded px-2 py-1 text-left text-xs ${
                  sel.kind === "tour" && sel.idx === i ? "bg-ucla-blue text-white" : "text-gray-700 hover:bg-gray-100"
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
                  sel.kind === "quiz" && sel.idx === i ? "bg-ucla-blue text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {q.options[q.answer]} <span className="opacity-60">· sl {q.sliceIndex + 1}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
            <Button size="sm" onClick={copyJson}>
              {copied ? "Copied!" : "Copy JSON"}
            </Button>
            <Button size="sm" variant="secondary" onClick={reset}>
              Reset to committed
            </Button>
          </div>
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
