import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import QuizQuestion from "./QuizQuestion";
import type { QuizQuestion as QuizQuestionType } from "@/types/content";

const question: QuizQuestionType = {
  id: "q1",
  stem: "Which cruciate ligament is torn?",
  options: [
    { key: "a", text: "ACL" },
    { key: "b", text: "PCL" },
    { key: "c", text: "MCL" },
    { key: "d", text: "LCL" },
  ],
  correctAnswer: "a",
  explanation: "It is the ACL.",
  domain: "cruciates",
  prePostMapping: "identical",
};

function countMatches(html: string, needle: string): number {
  return html.split(needle).length - 1;
}

describe("QuizQuestion radio group", () => {
  it("exposes a proper radiogroup", () => {
    const html = renderToStaticMarkup(
      <QuizQuestion
        question={question}
        selectedAnswer={null}
        onSelect={() => {}}
        questionNumber={1}
        totalQuestions={14}
      />,
    );
    expect(html).toContain('role="radiogroup"');
    expect(countMatches(html, 'role="radio"')).toBe(question.options.length);
  });

  it("is a single tab stop with roving tabindex when nothing is selected", () => {
    const html = renderToStaticMarkup(
      <QuizQuestion
        question={question}
        selectedAnswer={null}
        onSelect={() => {}}
        questionNumber={1}
        totalQuestions={14}
      />,
    );
    // Exactly one option is tabbable; the rest are taken out of the tab order so
    // the whole group is a single Tab stop (Arrow keys move between options).
    expect(countMatches(html, 'tabindex="0"')).toBe(1);
    expect(countMatches(html, 'tabindex="-1"')).toBe(question.options.length - 1);
  });

  it("moves the tab stop onto the selected option once one is chosen", () => {
    const html = renderToStaticMarkup(
      <QuizQuestion
        question={question}
        selectedAnswer="c"
        onSelect={() => {}}
        questionNumber={1}
        totalQuestions={14}
      />,
    );
    // The checked radio is the tabbable one.
    expect(html).toContain('aria-checked="true" tabindex="0"');
    expect(countMatches(html, 'tabindex="0"')).toBe(1);
  });
});
