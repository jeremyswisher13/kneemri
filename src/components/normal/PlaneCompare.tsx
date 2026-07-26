import { useMemo, useState } from "react";
import MriStackViewer from "@/components/ui/MriStackViewer";
import { mapLinkedSliceIndex } from "@/components/normal/plane-compare-logic";

export interface ComparePlane {
  id: string;
  label: string;
  plane: string;
  dir: string;
  count: number;
  startIndex?: number;
}

function buildSlices(p: ComparePlane) {
  return Array.from({ length: p.count }, (_, i) => ({
    src: `${p.dir}/slice_${String(i + 1).padStart(2, "0")}.jpg`,
    alt: `${p.plane} slice ${i + 1} of ${p.count}`,
  }));
}

function openingIndex(plane?: ComparePlane) {
  if (!plane) return 0;
  return Math.min(Math.max(0, plane.startIndex ?? 0), Math.max(0, plane.count - 1));
}

function Pane({
  planes,
  selectedId,
  sliceIndex,
  onSelect,
  onSliceChange,
  attribution,
  paneLabel,
  onContextChange,
}: {
  planes: ComparePlane[];
  selectedId: string;
  sliceIndex: number;
  onSelect: (id: string) => void;
  onSliceChange: (sliceIndex: number) => void;
  attribution: string;
  paneLabel: string;
  onContextChange?: (context: { sliceIndex: number; landmark: string; itemId: string }) => void;
}) {
  const plane = planes.find((p) => p.id === selectedId) ?? planes[0];
  // Memoize per plane so the viewer's referential-reset guard only fires on a
  // real plane change (not every parent re-render).
  const slices = useMemo(() => buildSlices(plane), [plane]);
  return (
    <div>
      <select
        value={plane.id}
        onChange={(e) => onSelect(e.target.value)}
        aria-label={`${paneLabel} plane to compare`}
        className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
      >
        {planes.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <MriStackViewer
        slices={slices}
        plane={plane.plane}
        startIndex={plane.startIndex}
        sliceIndex={sliceIndex}
        attribution={attribution}
        onSliceChange={(nextSliceIndex) => {
          onSliceChange(nextSliceIndex);
          onContextChange?.({
            sliceIndex: nextSliceIndex,
            landmark: `${paneLabel}: ${plane.label}`,
            itemId: plane.id,
          });
        }}
      />
    </div>
  );
}

/**
 * Two MRI stacks side-by-side with independent series pickers. Linked scrolling
 * maps the relative position through each stack; it intentionally does not claim
 * true spatial registration because the teaching JPGs do not contain DICOM
 * geometry.
 */
export default function PlaneCompare({
  planes,
  attribution,
  onContextChange,
}: {
  planes: ComparePlane[];
  attribution: string;
  onContextChange?: (context: { sliceIndex: number; landmark: string; itemId: string }) => void;
}) {
  const [aId, setAId] = useState(planes[0]?.id ?? "");
  const [bId, setBId] = useState(planes[1]?.id ?? planes[0]?.id ?? "");
  const [aIndex, setAIndex] = useState(() => openingIndex(planes[0]));
  const [bIndex, setBIndex] = useState(() => openingIndex(planes[1] ?? planes[0]));
  const [linked, setLinked] = useState(false);

  if (planes.length < 2) return null;

  const aPlane = planes.find((plane) => plane.id === aId) ?? planes[0];
  const bPlane = planes.find((plane) => plane.id === bId) ?? planes[1] ?? planes[0];

  function selectA(id: string) {
    const nextPlane = planes.find((plane) => plane.id === id) ?? planes[0];
    const nextIndex = openingIndex(nextPlane);
    setAId(nextPlane.id);
    setAIndex(nextIndex);
    if (linked) {
      setBIndex(mapLinkedSliceIndex(nextIndex, nextPlane.count, bPlane.count));
    }
  }

  function selectB(id: string) {
    const nextPlane = planes.find((plane) => plane.id === id) ?? planes[1] ?? planes[0];
    const nextIndex = openingIndex(nextPlane);
    setBId(nextPlane.id);
    setBIndex(nextIndex);
    if (linked) {
      setAIndex(mapLinkedSliceIndex(nextIndex, nextPlane.count, aPlane.count));
    }
  }

  function changeAIndex(nextIndex: number) {
    setAIndex(nextIndex);
    if (linked) {
      setBIndex(mapLinkedSliceIndex(nextIndex, aPlane.count, bPlane.count));
    }
  }

  function changeBIndex(nextIndex: number) {
    setBIndex(nextIndex);
    if (linked) {
      setAIndex(mapLinkedSliceIndex(nextIndex, bPlane.count, aPlane.count));
    }
  }

  function toggleLinked() {
    if (!linked) {
      setBIndex(mapLinkedSliceIndex(aIndex, aPlane.count, bPlane.count));
    }
    setLinked((current) => !current);
  }

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Open two series side by side to compare anatomy and signal.
          </p>
          <p id="compare-link-status" className="mt-1 text-xs leading-5 text-gray-500">
            {linked
              ? "Linked by relative stack position. Cross-plane views are approximate, not spatially registered."
              : "Stacks scroll independently."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={linked}
          aria-describedby="compare-link-status"
          aria-label="Link stack scrolling"
          onClick={toggleLinked}
          className={`inline-flex min-h-11 w-full shrink-0 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors sm:w-auto ${
            linked
              ? "border-brand-blue bg-brand-blue/10 text-brand-blue"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 13.5l3-3m-6.75 6.75-1.5 1.5a3.182 3.182 0 0 1-4.5-4.5l3-3a3.182 3.182 0 0 1 4.5 0m9-4.5 1.5-1.5a3.182 3.182 0 0 1 4.5 4.5l-3 3a3.182 3.182 0 0 1-4.5 0"
              />
            </svg>
            Link scrolling
          </span>
          <span
            aria-hidden="true"
            className={`relative h-5 w-9 rounded-full transition-colors ${
              linked ? "bg-brand-blue" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                linked ? "translate-x-[18px]" : "translate-x-0.5"
              }`}
            />
          </span>
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Pane
          planes={planes}
          selectedId={aId}
          sliceIndex={aIndex}
          onSelect={selectA}
          onSliceChange={changeAIndex}
          attribution={attribution}
          paneLabel="Compare A"
          onContextChange={onContextChange}
        />
        <Pane
          planes={planes}
          selectedId={bId}
          sliceIndex={bIndex}
          onSelect={selectB}
          onSliceChange={changeBIndex}
          attribution={attribution}
          paneLabel="Compare B"
          onContextChange={onContextChange}
        />
      </div>
    </div>
  );
}
