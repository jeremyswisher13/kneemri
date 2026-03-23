import type { QuizQuestion as QuizQuestionType } from "@/types/content";

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string | null;
  onSelect: (key: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onSelect,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-ucla-blue transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question stem */}
      <div className="mb-6">
        <p className="text-base font-medium text-gray-900 leading-relaxed">
          {question.stem}
        </p>
      </div>

      {/* Image if present */}
      {question.image && (
        <div className="mb-6 text-center">
          <img
            src={question.image.src}
            alt={question.image.alt}
            className="mx-auto max-h-64 rounded-lg border border-gray-200"
          />
          {question.image.caption && (
            <p className="mt-2 text-xs text-gray-500">{question.image.caption}</p>
          )}
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.key;
          return (
            <button
              key={option.key}
              onClick={() => onSelect(option.key)}
              className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
                isSelected
                  ? "border-ucla-blue bg-ucla-light text-ucla-dark"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span
                className={`mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isSelected
                    ? "bg-ucla-blue text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.key}
              </span>
              <span className="text-sm">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
