import { useRef, useState, type KeyboardEvent } from "react";
import type { QuizQuestion as QuizQuestionType } from "@/types/content";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function shuffleOptions<T>(opts: T[]): T[] {
  const arr = [...opts];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string | null;
  onSelect: (key: string) => void;
  questionNumber: number;
  totalQuestions: number;
  disabled?: boolean;
  checkedAnswer?: string | null;
  correctAnswer?: string | null;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onSelect,
  questionNumber,
  totalQuestions,
  disabled = false,
  checkedAnswer = null,
  correctAnswer = null,
}: QuizQuestionProps) {
  const isChecked = checkedAnswer !== null;
  const progress = (questionNumber / totalQuestions) * 100;
  const correctText = correctAnswer
    ? question.options.find((o) => o.key === correctAnswer)?.text
    : null;

  // Shuffle the options once per question so the correct answer is not always in
  // the same position/letter (the stored `key` drives selection + scoring, while
  // the badge shows the display position). Re-shuffles when the question changes.
  const [displayOptions, setDisplayOptions] = useState(() => shuffleOptions(question.options));
  const [shuffledFor, setShuffledFor] = useState(question.id);
  if (question.id !== shuffledFor) {
    setShuffledFor(question.id);
    setDisplayOptions(shuffleOptions(question.options));
  }

  // WAI-ARIA radio-group keyboard support. The group is a single tab stop (the
  // selected option, or the first if none is chosen yet); Arrow keys move the
  // selection between options and wrap around, so keyboard/AT users can answer
  // the scored quiz the same way mouse users can.
  const groupRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    0,
    displayOptions.findIndex((o) => o.key === selectedAnswer),
  );

  function focusRadioAt(index: number) {
    const radios = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    radios?.[index]?.focus();
  }

  function handleRadioKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (disabled) return;
    let next: number;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      next = (idx + 1) % displayOptions.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      next = (idx - 1 + displayOptions.length) % displayOptions.length;
    } else {
      return;
    }
    e.preventDefault();
    onSelect(displayOptions[next].key);
    focusRadioAt(next);
  }

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
        <p id={`quiz-stem-${question.id}`} className="text-base font-medium text-gray-900 leading-relaxed">
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
      <div ref={groupRef} role="radiogroup" aria-labelledby={`quiz-stem-${question.id}`} className="space-y-3">
        {displayOptions.map((option, idx) => {
          const isSelected = selectedAnswer === option.key;
          const isCorrectOption = correctAnswer === option.key;
          const isWrongSelection = isChecked && isSelected && !isCorrectOption;
          const isCorrectReveal = isChecked && isCorrectOption;

          let borderClass = "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50";
          let badgeClass = "bg-gray-100 text-gray-600";

          if (isChecked) {
            if (isCorrectReveal) {
              borderClass = "border-green-500 bg-green-50";
              badgeClass = "bg-green-500 text-white";
            } else if (isWrongSelection) {
              borderClass = "border-red-500 bg-red-50";
              badgeClass = "bg-red-500 text-white";
            } else {
              borderClass = "border-gray-200 bg-white opacity-60";
            }
          } else if (isSelected) {
            borderClass = "border-ucla-blue bg-ucla-light text-ucla-dark";
            badgeClass = "bg-ucla-blue text-white";
          }

          return (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={idx === activeIndex ? 0 : -1}
              onClick={() => !disabled && onSelect(option.key)}
              onKeyDown={(e) => handleRadioKeyDown(e, idx)}
              disabled={disabled}
              className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${borderClass} ${disabled ? "cursor-default" : ""}`}
            >
              <span
                aria-hidden="true"
                className={`mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${badgeClass}`}
              >
                {isChecked && isCorrectReveal ? "\u2713" : isChecked && isWrongSelection ? "\u2717" : LETTERS[idx]}
              </span>
              <span className="text-sm">{option.text}</span>
              {isCorrectReveal && <span className="sr-only"> (correct answer)</span>}
              {isWrongSelection && <span className="sr-only"> (your answer, incorrect)</span>}
            </button>
          );
        })}
      </div>

      {/* Result announced to screen readers when the answer is revealed. */}
      {isChecked && (
        <p role="status" aria-live="polite" className="sr-only">
          {checkedAnswer === correctAnswer
            ? "Correct."
            : `Incorrect. The correct answer is ${correctText ?? correctAnswer}.`}
        </p>
      )}
    </div>
  );
}
