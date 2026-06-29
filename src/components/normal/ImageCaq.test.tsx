import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ImageCaq from "./ImageCaq";
import type { ImageCaqQ } from "@/content/normal-mri-types";

const questions: ImageCaqQ[] = [
  {
    id: "caq-1",
    topic: "Normal anatomy",
    dir: "/images/stack",
    count: 8,
    startIndex: 3,
    plane: "Sagittal PD-FS",
    vignette: "Review the stack and identify the expected normal structure.",
    options: ["ACL", "PCL", "MCL", "LCL"],
    answer: 1,
    explanation: "The PCL is a smooth low-signal posterior arc.",
  },
];

describe("ImageCaq", () => {
  it("renders the image-anchored intro with the question count", () => {
    const html = renderToStaticMarkup(<ImageCaq questions={questions} />);

    expect(html).toContain("Image-anchored CAQ");
    expect(html).toContain("CAQ");
    expect(html).toContain("Board-style questions read off the real MRI");
    expect(html).toContain("1 question");
    expect(html).toContain("Start (1 question)");
    expect(html).toContain("Start image-anchored CAQ, 1 question");
    expect(html).not.toContain("🩻");
  });

  it("uses plural question copy for larger banks", () => {
    const html = renderToStaticMarkup(
      <ImageCaq
        questions={[
          ...questions,
          {
            ...questions[0],
            id: "caq-2",
            vignette: "Review another anchor slice and identify the best answer.",
          },
        ]}
      />,
    );

    expect(html).toContain("2 questions");
    expect(html).toContain("Start (2 questions)");
  });

  it("shows a prepared-state message instead of a blank card for empty banks", () => {
    const html = renderToStaticMarkup(<ImageCaq questions={[]} />);

    expect(html).toContain("The image-anchored question bank is being prepared");
  });
});
