import { getPearlForDate } from "@/content/daily-pearls";
import { useActiveCourse } from "@/hooks/useActiveCourse";

export default function DailyPearl() {
  const activeCourse = useActiveCourse();
  const pearl = getPearlForDate(activeCourse.bodyRegion);

  return (
    <div id="daily-pearl" className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Lightbulb icon */}
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-ucla-gold)" }}
        >
          <svg
            className="h-4.5 w-4.5 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">Daily Pearl</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-700">
            {pearl.text}
          </p>
        </div>
      </div>
    </div>
  );
}
