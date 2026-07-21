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

    expect(text).toContain("one-image finding is lower confidence");
    expect(text).toContain("images need not be contiguous");
    expect(text).toContain("not automatically exclude a subtle lesion");
    expect(text).toContain("extrusion alone does not diagnose a root tear");
    expect(text).toContain("signal grade supports diagnosis but does not determine surgery");
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

  it("preserves the knee course's high-stakes medical corrections", () => {
    const text = sourceText(
      "src/content/cases/index.ts",
      "src/content/daily-pearls.ts",
      "src/content/faq-knowledge-base.ts",
      "src/content/flashcards/module-flashcards.ts",
      "src/content/module-interactives.ts",
      "src/content/modules/index.ts",
      "src/content/modules/module6-menisci.ts",
      "src/content/modules/module7-ligaments.ts",
      "src/content/modules/module8-extensor.ts",
      "src/content/modules/module10-dontmiss.ts",
      "src/content/normal-knee-learn.ts",
      "src/content/quizzes/module-quizzes.ts",
      "src/content/quizzes/pre-post-quiz.ts",
      "src/content/red-flags.ts",
      "src/content/search-pattern.ts",
    );

    expect(text).toContain("routine knee mri cannot exclude an intimal injury");
    expect(text).toContain("same threshold should not be transferred mechanically to the lateral meniscus");
    expect(text).toContain("systemic osteonecrosis with a serpiginous epiphyseal infarct");
    expect(text).toContain("an anterior tibial tunnel can cause roof impingement");
    expect(text).toContain("a vertical femoral tunnel can leave rotational instability");
    expect(text).toContain("an excessively anterior femoral tunnel can over-tension");

    expect(text).not.toContain("the single most important sequence for knee mri");
    expect(text).not.toContain("most commonly injured knee ligament");
    expect(text).not.toContain("it represents an avulsion equivalent of an acl tear");
    expect(text).not.toContain("if meniscal signal on pd disappears on t2, it is artifact, not a tear");
    expect(text).not.toContain("acl + pcl = dislocation until proven otherwise");
    expect(text).not.toContain("primary spontaneous osteonecrosis with epiphyseal infarct");
    expect(text).not.toContain("either malposition predicts failure");
    expect(text).not.toContain("patella retracts superiorly");
    expect(text).not.toContain("fracture line longer than ~14");
    expect(text).not.toContain("routine knee mri can clear the artery");
  });
});
