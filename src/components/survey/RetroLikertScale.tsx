import type { ConfidenceStatement } from "@/types/content";

interface RetroLikertScaleProps {
  statement: ConfidenceStatement;
  /** Confidence now, after the course. */
  nowRating: number | null;
  /** Retrospective: confidence as the learner now judges it was before the course. */
  thenRating: number | null;
  onRateNow: (rating: number) => void;
  onRateThen: (rating: number) => void;
  index: number;
}

const labels = [
  "Very not confident",
  "Not confident",
  "Neutral",
  "Confident",
  "Very confident",
];

function Row({
  legend,
  hint,
  rating,
  onRate,
  accent,
}: {
  legend: string;
  hint: string;
  rating: number | null;
  onRate: (rating: number) => void;
  accent: "now" | "then";
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 flex items-baseline gap-2">
        <span
          className={`text-xs font-semibold ${accent === "now" ? "text-ucla-blue" : "text-amber-600"}`}
        >
          {legend}
        </span>
        <span className="text-[11px] text-gray-500">{hint}</span>
      </legend>
      <div className="flex items-center justify-between gap-1.5">
        {[1, 2, 3, 4, 5].map((value) => {
          const isSelected = rating === value;
          const selectedClass =
            accent === "now"
              ? "border-ucla-blue bg-ucla-light text-ucla-blue"
              : "border-amber-400 bg-amber-50 text-amber-700";
          return (
            <button
              key={value}
              type="button"
              aria-label={`${value} — ${labels[value - 1]}`}
              aria-pressed={isSelected}
              onClick={() => onRate(value)}
              className={`flex flex-1 flex-col items-center rounded-lg border-2 px-2 py-2 transition-colors ${
                isSelected
                  ? selectedClass
                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="text-base font-bold">{value}</span>
              <span
                className={`mt-0.5 text-center text-[10px] leading-tight ${
                  value === 1 || value === 5 ? "block" : "hidden sm:block"
                } ${isSelected ? "" : "text-gray-500"}`}
              >
                {labels[value - 1]}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function RetroLikertScale({
  statement,
  nowRating,
  thenRating,
  onRateNow,
  onRateThen,
  index,
}: RetroLikertScaleProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="mb-4 text-sm font-medium text-gray-900">
        <span className="mr-2 font-semibold text-ucla-blue">{index}.</span>
        {statement.statement}
      </p>
      <div className="space-y-4">
        <Row
          legend="Now"
          hint="your confidence today, after the course"
          rating={nowRating}
          onRate={onRateNow}
          accent="now"
        />
        <Row
          legend="Before the course"
          hint="looking back, how confident you actually were"
          rating={thenRating}
          onRate={onRateThen}
          accent="then"
        />
      </div>
    </div>
  );
}
