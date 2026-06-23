import type { ConfidenceStatement } from "@/types/content";

interface LikertScaleProps {
  statement: ConfidenceStatement;
  rating: number | null;
  onRate: (rating: number) => void;
  index: number;
}

const labels = [
  "Very not confident",
  "Not confident",
  "Neutral",
  "Confident",
  "Very confident",
];

const shortLabels = ["1", "2", "3", "4", "5"];

export default function LikertScale({
  statement,
  rating,
  onRate,
  index,
}: LikertScaleProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="mb-4 text-sm font-medium text-gray-900">
        <span className="mr-2 text-ucla-blue font-semibold">{index}.</span>
        {statement.statement}
      </p>
      <div className="flex items-center justify-between gap-2">
        {[1, 2, 3, 4, 5].map((value) => {
          const isSelected = rating === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onRate(value)}
              aria-label={`${value} — ${labels[value - 1]}`}
              aria-pressed={isSelected}
              className={`flex flex-1 flex-col items-center rounded-lg border-2 px-2 py-3 transition-colors ${
                isSelected
                  ? "border-ucla-blue bg-ucla-light"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-lg font-bold ${
                  isSelected ? "text-ucla-blue" : "text-gray-500"
                }`}
              >
                {shortLabels[value - 1]}
              </span>
              <span className={`mt-1 text-center text-[10px] leading-tight text-gray-500 ${
                value === 1 || value === 5 ? "block" : "hidden sm:block"
              }`}>
                {labels[value - 1]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
