import { redFlagsByRegion } from "@/content/red-flags";

/**
 * Glanceable "don't-miss" safety net for the Quick Reference page — the handful
 * of management-changing findings a fellow should never let slip past, in one
 * scannable place. Collapsible (native <details>, open by default) so it's there
 * when you want it and out of the way when you don't.
 */
export default function RedFlagCard({ region }: { region: string }) {
  const flags = redFlagsByRegion[region];
  if (!flags || flags.length === 0) return null;
  const title = region.charAt(0).toUpperCase() + region.slice(1);

  return (
    <details open className="group mb-6 overflow-hidden rounded-xl border border-red-200 bg-red-50/70">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <svg className="h-5 w-5 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <span className="text-sm font-bold text-red-800">Don&apos;t miss — {title} red flags</span>
        <svg
          className="ml-auto h-4 w-4 shrink-0 text-red-400 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      <ul className="space-y-2 px-4 pb-4">
        {flags.map((f, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            <span>
              <span className="font-semibold text-gray-900">{f.finding}.</span>{" "}
              <span className="text-gray-700">{f.action}</span>
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
