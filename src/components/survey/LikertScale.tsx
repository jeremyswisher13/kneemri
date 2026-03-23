import type { ConfidenceStatement } from "@/types/content";

interface LikertScaleProps {
  statement: ConfidenceStatement;
  rating: number | null;
  onRate: (rating: number) => void;
  index: number;
}

const labels = [
  "Not at all confident",
  "Slightly confident",
  "Moderately confident",
  "Very confident",
  "Extremely confident",
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
              onClick={() => onRate(value)}
              className={`flex flex-1 flex-col items-center rounded-lg border-2 px-2 py-3 transition-colors ${
                isSelected
                  ? "border-ucla-blue bg-ucla-light"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-lg font-bold ${
                  isSelected ? "text-ucla-blue" : "text-gray-400"
                }`}
              >
                {shortLabels[value - 1]}
              </span>
              <span className="mt-1 hidden text-center text-[10px] leading-tight text-gray-500 sm:block">
                {labels[value - 1]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
