import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import KnowledgeCheck from "./KnowledgeCheck";
import type { QuizItem } from "@/content/normal-mri-types";

const quizItems: QuizItem[] = [
  {
    id: "test-q1",
    sliceIndex: 2,
    marker: { x: 42, y: 58 },
    locateLabel: "Posterior cruciate ligament",
    prompt: "What normal structure is marked?",
    options: ["ACL", "PCL", "Medial meniscus", "Patellar tendon"],
    answer: 1,
    explanation: "The marked structure is the normal low-signal PCL.",
  },
];

describe("KnowledgeCheck", () => {
  it("renders an accessible practice/mastery shell before answering", () => {
    const html = renderToStaticMarkup(
      <KnowledgeCheck dir="/images/test" items={quizItems} planeLabel="Sagittal PD-FS" />,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Practice or mastery mode"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Identify");
    expect(html).toContain("Locate");
    expect(html).toContain("Mastery");
    expect(html).toContain("Question 1 of 1");
    expect(html).toContain("What normal structure is marked?");
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('aria-label="What normal structure is marked?"');
    expect(html).toContain('role="radio"');
    expect(html).toContain('aria-checked="false"');
  });

  it("renders nothing when a plane has no quiz items", () => {
    const html = renderToStaticMarkup(
      <KnowledgeCheck dir="/images/test" items={[]} planeLabel="Sagittal PD-FS" />,
    );

    expect(html).toBe("");
  });
});
