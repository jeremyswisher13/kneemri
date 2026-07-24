import { useState } from "react";
import type { Marker } from "@/content/normal-mri-types";

function labelClass(marker: Marker) {
  const vertical = marker.y > 75 ? "bottom-[140%]" : "top-[140%]";
  const horizontal =
    marker.x < 25
      ? "left-0 translate-x-0 text-left"
      : marker.x > 75
        ? "right-0 translate-x-0 text-right"
        : "left-1/2 -translate-x-1/2 text-center";
  return `${vertical} ${horizontal}`;
}

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
  alt,
}: {
  dir: string;
  sliceIndex: number;
  markers?: Marker[];
  showLabels?: boolean;
  pulse?: boolean;
  alt?: string;
}) {
  const src = `${dir}/slice_${String(sliceIndex + 1).padStart(2, "0")}.jpg`;
  const imageAlt = alt ?? `MRI slice ${sliceIndex + 1} with educational annotation markers`;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [retryRevision, setRetryRevision] = useState(0);
  const failed = failedSrc === src;
  return (
    // min-h reserves the box height before the slice decodes so an uncached image
    // doesn't collapse to 0 then shove the page down ~335px on load (CLS). Markers
    // stay aligned: the w-fit wrapper still fits the image after it loads.
    <div
      data-testid="annotated-mri"
      data-screenshot-anchor="mri-viewer"
      className="relative mx-auto block w-fit min-h-[45svh] max-h-[45svh] max-w-full overflow-hidden rounded-xl bg-black lg:min-h-0 lg:max-h-none lg:w-full lg:max-w-[560px]"
    >
      <img
        key={`${src}:${retryRevision}`}
        src={src}
        alt={imageAlt}
        draggable={false}
        className={`mx-auto block max-h-[45svh] w-auto max-w-full select-none object-contain lg:max-h-none lg:w-full ${
          failed ? "invisible" : ""
        }`}
        onLoad={() => setFailedSrc((current) => (current === src ? null : current))}
        onError={() => setFailedSrc(src)}
      />
      {failed && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-white"
        >
          <p>This MRI slice could not be loaded.</p>
          <button
            type="button"
            onClick={() => {
              setFailedSrc(null);
              setRetryRevision((revision) => revision + 1);
            }}
            className="rounded-md border border-white/60 bg-white/10 px-3 py-2 font-medium hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ucla-gold"
          >
            Retry image
          </button>
        </div>
      )}
      {!failed && markers.map((m, i) => (
        <div
          key={i}
          data-mri-marker="true"
          data-marker-x={m.x}
          data-marker-y={m.y}
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
            <span
              className={`absolute max-w-44 rounded bg-black/80 px-2 py-0.5 text-[11px] font-semibold leading-tight text-white ${labelClass(
                m,
              )}`}
            >
              {m.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
