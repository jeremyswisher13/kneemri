import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceText(...paths: string[]) {
  return paths.map((path) => readFileSync(resolve(path), "utf8")).join("\n").toLowerCase();
}

describe("medical phrasing regression safeguards", () => {
  it("keeps meniscal MRI criteria probabilistic and multiplanar", () => {
    const text = sourceText(
      "src/content/modules/index.ts",
      "src/content/modules/module6-menisci.ts",
      "src/content/module-interactives.ts",
      "src/content/daily-pearls.ts",
      "src/content/normal-knee-learn.ts",
      "src/content/faq-knowledge-base.ts",
      "src/content/flashcards/module-flashcards.ts",
    );

    expect(text).toContain("one-slice finding is lower confidence");
    expect(text).toContain("not automatically exclude a subtle lesion");
    expect(text).toContain("extrusion alone does not diagnose a root tear");
    expect(text).toContain("signal grade supports diagnosis but does not determine surgery by itself");
    expect(text).not.toContain("every finding must be confirmed in at least two planes");
    expect(text).not.toContain("a real tear tracks across both planes");
    expect(text).not.toContain("if meniscal signal is gone on t2");
    expect(text).not.toContain("only grade 3 is surgical");
  });

  it("keeps prognostic and operative language from becoming an absolute rule", () => {
    const text = sourceText(
      "src/content/daily-pearls.ts",
      "src/components/ui/AnatomyReference.tsx",
      "src/content/hip/flashcards.ts",
      "src/content/hip/modules.ts",
      "src/content/hip/reference.ts",
      "src/content/hip/cases.ts",
      "src/content/modules/module7-ligaments.ts",
      "src/content/modules/module10-dontmiss.ts",
      "src/content/cases/index.ts",
      "src/content/faq-knowledge-base.ts",
      "src/content/flashcards/module-flashcards.ts",
    );

    expect(text).toContain("commonly used surgical-referral threshold");
    expect(text).toContain("symptoms, chronicity, activity goals");
    expect(text).not.toContain("below that, rehab");
    expect(text).not.toContain("partial/single-tendon injuries get rehab");
    expect(text).not.toContain("regardless of tear size");
    expect(text).not.toContain("surgery must address the bony deformity");
    expect(text).not.toContain("pathognomonic for plc injury");
    expect(text).not.toContain("pathognomonic for acl");
  });
});
