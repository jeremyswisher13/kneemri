import { useAuth } from "@/contexts/AuthContext";
import { surgicalCorrelatesByRegion } from "@/content/surgical-correlates";

/**
 * Surgical / arthroscopic correlate panel — renders ONLY when the learner's
 * "Surgical correlates" toggle is on (defaults on for Orthopedic Surgery). Shows
 * how each structure looks at surgery alongside its MRI appearance. Self-gating,
 * so it can be dropped anywhere; renders nothing when the toggle is off or the
 * region has no correlates yet.
 */
export default function SurgicalCorrelates({ region }: { region: string }) {
  const { showSurgical } = useAuth();
  const items = surgicalCorrelatesByRegion[region];
  if (!showSurgical || !items || items.length === 0) return null;

  return (
    <section className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
      <div className="mb-1 flex items-center gap-2">
        <svg className="h-5 w-5 shrink-0 text-emerald-700" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.42 15.17 5.69 5.69a2.25 2.25 0 0 0 3.182-3.182l-5.69-5.69m-2.182 3.182L4.93 6.69a2.25 2.25 0 0 1 3.182-3.182l8.49 8.49" />
        </svg>
        <h3 className="text-base font-bold text-emerald-900">Surgical &amp; arthroscopic correlate</h3>
      </div>
      <p className="mb-4 text-sm text-emerald-800/80">
        How each structure looks at surgery — to anchor the MRI anatomy.
      </p>
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.title} className="rounded-lg border border-emerald-100 bg-white p-4">
            {c.image && (
              <figure className="mb-3">
                <img
                  src={c.image.src}
                  alt={c.image.alt}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto block max-h-64 rounded-lg object-contain"
                />
                <figcaption className="mt-1 text-center text-[11px] text-gray-500">{c.image.attribution}</figcaption>
              </figure>
            )}
            <p className="text-sm font-semibold text-gray-900">{c.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
