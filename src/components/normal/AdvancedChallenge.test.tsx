import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AdvancedChallenge from "./AdvancedChallenge";
import type { AdvancedQ } from "@/content/normal-mri-types";

const questions: AdvancedQ[] = [
  {
    id: "adv-1",
    topic: "Normal variants",
    prompt: "Which finding is a normal variant?",
    options: ["Sublabral recess", "Full-thickness tear", "Displaced fragment", "Marrow replacement"],
    answer: 0,
    explanation: "A sublabral recess can be normal in the right location.",
  },
  {
    id: "adv-2",
    topic: "Measurements",
    prompt: "Which measurement is most relevant?",
    options: ["Alpha angle", "QT interval", "LVEF", "Aortic root"],
    answer: 0,
    explanation: "The alpha angle is relevant for cam morphology.",
  },
];

describe("AdvancedChallenge", () => {
  it("renders the topic picker with counts", () => {
    const html = renderToStaticMarkup(<AdvancedChallenge questions={questions} />);

    expect(html).toContain("Advanced challenge");
    expect(html).toContain("ADV");
    expect(html).toContain("All topics");
    expect(html).toContain("2 Q");
    expect(html).toContain("Normal variants");
    expect(html).toContain("Measurements");
    expect(html).toContain("Start advanced challenge with all topics, 2 questions");
    expect(html).toContain("Start advanced challenge topic Normal variants, 1 question");
    expect(html).not.toContain("🏆");
  });

  it("shows a prepared-state message instead of a blank card for empty banks", () => {
    const html = renderToStaticMarkup(<AdvancedChallenge questions={[]} />);

    expect(html).toContain("The advanced challenge bank is being prepared");
  });
});
