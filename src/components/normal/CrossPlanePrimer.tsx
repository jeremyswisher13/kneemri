/**
 * Compact, collapsible "how to read across planes" teaching primer shown above
 * the cross-plane correlation drill. Region-agnostic — each workstation passes
 * its own three rules. Uses a native <details> so it needs no state and stays
 * out of the way on repeat visits.
 */
export default function CrossPlanePrimer({
  rules,
}: {
  rules: { label: string; text: string }[];
}) {
  return (
    <details
      open
      className="group mb-4 rounded-xl border border-ucla-blue/20 bg-ucla-blue/5 px-4 py-3"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-ucla-blue [&::-webkit-details-marker]:hidden">
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.8 9.2l-1.5 4.1-4.1 1.5 1.5-4.1 4.1-1.5z" />
        </svg>
        Reading across planes — 3 rules
        <svg
          className="ml-auto h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      <ol className="mt-3 space-y-2">
        {rules.map((r, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-gray-700">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ucla-blue text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <span>
              <span className="font-semibold text-gray-900">{r.label}</span> {r.text}
            </span>
          </li>
        ))}
      </ol>
    </details>
  );
}
