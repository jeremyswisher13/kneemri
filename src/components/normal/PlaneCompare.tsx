import { useMemo, useState } from "react";
import MriStackViewer from "@/components/ui/MriStackViewer";

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

function Pane({
  planes,
  selectedId,
  onSelect,
  attribution,
  paneLabel,
  onContextChange,
}: {
  planes: ComparePlane[];
  selectedId: string;
  onSelect: (id: string) => void;
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
        className="mb-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 focus:border-ucla-blue focus:outline-none focus:ring-1 focus:ring-ucla-blue"
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
        attribution={attribution}
        onSliceChange={(sliceIndex) =>
          onContextChange?.({
            sliceIndex,
            landmark: `${paneLabel}: ${plane.label}`,
            itemId: plane.id,
          })
        }
      />
    </div>
  );
}

/**
 * Two MRI stacks side-by-side, each independently scrollable with its own plane
 * picker — so a learner can find a structure on one plane and confirm it on
 * another (the cross-plane mental model). Not auto-synced: there is no
 * slice-to-slice correspondence between planes, so each scrolls on its own.
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

  if (planes.length < 2) return null;

  return (
    <div className="mt-4">
      <p className="mb-3 text-sm text-gray-500">
        Open two planes at once: find a structure on one, then confirm it on the other to build your
        cross-plane sense of where things live. Each stack scrolls independently.
      </p>
      <div className="grid gap-5 lg:grid-cols-2">
        <Pane planes={planes} selectedId={aId} onSelect={setAId} attribution={attribution} paneLabel="Compare A" onContextChange={onContextChange} />
        <Pane planes={planes} selectedId={bId} onSelect={setBId} attribution={attribution} paneLabel="Compare B" onContextChange={onContextChange} />
      </div>
    </div>
  );
}
