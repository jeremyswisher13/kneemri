import type { Marker } from "@/content/normal-mri-types";

/**
 * A single MRI slice with markers overlaid at percentage coordinates.
 * Used by both the Guided Tour (labels shown) and the Knowledge Check
 * (single unlabeled marker).
 */
export default function AnnotatedSlice({
  dir,
  sliceIndex,
  markers = [],
  showLabels = false,
  pulse = false,
}: {
  dir: string;
  sliceIndex: number;
  markers?: Marker[];
  showLabels?: boolean;
  pulse?: boolean;
}) {
  const src = `${dir}/slice_${String(sliceIndex + 1).padStart(2, "0")}.jpg`;
  return (
    <div className="relative mx-auto block w-fit max-h-[45svh] max-w-full overflow-hidden rounded-xl bg-black lg:max-h-none lg:w-full lg:max-w-[560px]">
      <img
        src={src}
        alt=""
        draggable={false}
        className="mx-auto block max-h-[45svh] w-auto max-w-full select-none object-contain lg:max-h-none lg:w-full"
      />
      {markers.map((m, i) => (
        <div
          key={i}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          {/* Marker ring */}
          <span
            className={`block h-7 w-7 rounded-full border-2 border-ucla-gold bg-ucla-gold/20 shadow-[0_0_0_2px_rgba(0,0,0,0.55)] lg:h-5 lg:w-5 ${
              pulse ? "animate-pulse" : ""
            }`}
          />
          {/* Center dot */}
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ucla-gold" />
          {showLabels && m.label && (
            <span className="absolute left-1/2 top-[140%] -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 text-[11px] font-semibold text-white">
              {m.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
