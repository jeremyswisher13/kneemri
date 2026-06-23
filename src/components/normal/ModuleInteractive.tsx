import { useMemo, useState, type ReactNode } from "react";
import MriStackViewer from "@/components/ui/MriStackViewer";
import AnnotatedSlice from "@/components/normal/AnnotatedSlice";
import KnowledgeCheck from "@/components/normal/KnowledgeCheck";
import { STACK_ATTR, type InteractiveBlock } from "@/content/module-interactives";

/**
 * Renders one interactive MRI block inside a reading module (meniscus, cartilage).
 * Thin wrappers compose the existing workstation components so the look + behavior
 * match the Interactive Normal Knee MRI.
 */
export default function ModuleInteractive({ block }: { block: InteractiveBlock }) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border-2 border-ucla-blue/25 bg-ucla-blue/[0.04]">
      <div className="flex items-center gap-2 border-b border-ucla-blue/15 bg-ucla-blue/[0.06] px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ucla-blue px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Interactive
        </span>
        <span className="text-sm font-semibold text-gray-900">{block.title}</span>
      </div>
      <div className="px-4 py-4">
        {block.kind === "scroll-drill" && <ScrollDrill block={block} />}
        {block.kind === "shape-shift" && <ShapeShift block={block} />}
        {block.kind === "spot-quiz" && <SpotQuiz block={block} />}
        {block.kind === "annotate" && <Annotate block={block} />}
      </div>
    </div>
  );
}

function Teaching({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-lg border border-ucla-blue/20 bg-white px-4 py-3 text-sm leading-relaxed text-gray-700">
      {children}
    </div>
  );
}

function Instruction({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm font-medium text-ucla-blue">{children}</p>;
}

function ScrollDrill({ block }: { block: Extract<InteractiveBlock, { kind: "scroll-drill" }> }) {
  const [showCompare, setShowCompare] = useState(false);
  // Stable reference so toggling "Compare with abnormal" doesn't reset the viewer.
  const slices = useMemo(
    () =>
      Array.from({ length: block.count }, (_, i) => ({
        src: `${block.dir}/slice_${String(i + 1).padStart(2, "0")}.jpg`,
        alt: `${block.plane} slice ${i + 1}`,
      })),
    [block.count, block.dir, block.plane],
  );
  return (
    <div>
      <Instruction>{block.instruction}</Instruction>
      <MriStackViewer
        slices={slices}
        plane={block.plane}
        attribution={STACK_ATTR}
        startIndex={block.startIndex ?? 0}
      />
      <Teaching>{block.teaching}</Teaching>
      {block.compare && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowCompare((v) => !v)}
            aria-pressed={showCompare}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              showCompare
                ? "border-rose-300 bg-rose-100 text-rose-700 hover:bg-rose-200"
                : "border-rose-300/70 bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h7.5M3 12h7.5M3 16.5h7.5M21 7.5h-4.5M21 12h-4.5M21 16.5h-4.5M13.5 4.5v15" />
            </svg>
            {showCompare ? "Hide abnormal" : "Compare with abnormal"}
          </button>
          {showCompare && (
            <figure className="mt-3 overflow-hidden rounded-xl border-2 border-rose-300 bg-rose-50">
              <div className="bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700">Abnormal</div>
              <img src={block.compare.src} alt={block.compare.caption} className="w-full" loading="lazy" />
              <figcaption className="px-3 py-2 text-xs leading-relaxed text-rose-800">{block.compare.caption}</figcaption>
            </figure>
          )}
        </div>
      )}
    </div>
  );
}

function ShapeShift({ block }: { block: Extract<InteractiveBlock, { kind: "shape-shift" }> }) {
  const [v, setV] = useState(0);
  const view = block.views[Math.min(v, block.views.length - 1)];
  return (
    <div>
      <Instruction>{block.instruction}</Instruction>
      <div className="mb-3 inline-flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs">
        {block.views.map((vw, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setV(i)}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
              i === v ? "bg-ucla-blue text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {vw.planeLabel}
          </button>
        ))}
      </div>
      <AnnotatedSlice dir={view.dir} sliceIndex={view.sliceIndex} markers={[view.marker]} showLabels pulse />
      <Teaching>{block.teaching}</Teaching>
    </div>
  );
}

function SpotQuiz({ block }: { block: Extract<InteractiveBlock, { kind: "spot-quiz" }> }) {
  return (
    <div>
      <Instruction>{block.instruction}</Instruction>
      <KnowledgeCheck dir={block.dir} items={block.items} planeLabel={block.planeLabel} />
    </div>
  );
}

function Annotate({ block }: { block: Extract<InteractiveBlock, { kind: "annotate" }> }) {
  const [reveal, setReveal] = useState(false);
  return (
    <div>
      <Instruction>{block.instruction}</Instruction>
      <AnnotatedSlice
        dir={block.dir}
        sliceIndex={block.sliceIndex}
        markers={block.markers}
        showLabels={reveal}
        pulse={reveal}
      />
      <button
        type="button"
        onClick={() => setReveal((r) => !r)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-ucla-blue/40 bg-ucla-blue/10 px-3 py-1.5 text-xs font-semibold text-ucla-blue transition-colors hover:bg-ucla-blue/20"
      >
        {reveal ? "Hide structures" : "Reveal structures"}
      </button>
      <Teaching>{block.teaching}</Teaching>
    </div>
  );
}
