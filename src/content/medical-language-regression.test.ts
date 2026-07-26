import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceText(...paths: string[]) {
  return paths.map((path) => readFileSync(resolve(path), "utf8")).join("\n").toLowerCase();
}

/**
 * Medical prose does not only live in src/content — components and pages hardcode
 * captions, link descriptions, and helper copy that learners read as teaching text.
 * Globbing the UI tree is what keeps a claim that a module explicitly walked back
 * from re-entering the app through a JSX string literal.
 */
function uiSourceText(...roots: string[]) {
  const files: string[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      // Test files quote forbidden phrasing on purpose (this file included), so
      // scanning them would make the guard trip on its own assertions.
      if (/\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")) files.push(full);
    }
  };

  roots.forEach((root) => walk(resolve(root)));
  return sourceText(...files);
}

// The forbidden lists are named so the same phrasings can be enforced against both
// the content tree and the UI tree without the two copies drifting apart.
const forbiddenMeniscalPhrases = [
  "every finding must be confirmed in at least two planes",
  "a real tear tracks across both planes",
  "if meniscal signal is gone on t2",
  "only grade 3 is surgical",
];

const forbiddenPrognosticPhrases = [
  "below that, rehab",
  "partial/single-tendon injuries get rehab",
  "regardless of tear size",
  "surgery must address the bony deformity",
  "pathognomonic for plc injury",
  "pathognomonic for acl",
];

const forbiddenKneeCorrectionPhrases = [
  "the single most important sequence for knee mri",
  "most commonly injured knee ligament",
  "it represents an avulsion equivalent of an acl tear",
  "if meniscal signal on pd disappears on t2, it is artifact, not a tear",
  "acl + pcl = dislocation until proven otherwise",
  "primary spontaneous osteonecrosis with epiphyseal infarct",
  "either malposition predicts failure",
  "patella retracts superiorly",
  "fracture line longer than ~14",
  "routine knee mri can clear the artery",
];

const uiRoots = ["src/components", "src/pages"];

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
    for (const phrase of forbiddenMeniscalPhrases) expect(text).not.toContain(phrase);
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
    for (const phrase of forbiddenPrognosticPhrases) expect(text).not.toContain(phrase);
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

    for (const phrase of forbiddenKneeCorrectionPhrases) expect(text).not.toContain(phrase);
  });

  it("holds components and pages to the same forbidden medical phrasings as content", () => {
    // Components/pages were previously unguarded: every assertion above globbed only
    // src/content, so a corrected claim could still ship inside a hardcoded UI string.
    const text = uiSourceText(...uiRoots);

    for (const phrase of [
      ...forbiddenMeniscalPhrases,
      ...forbiddenPrognosticPhrases,
      ...forbiddenKneeCorrectionPhrases,
    ]) {
      expect(text).not.toContain(phrase);
    }
  });

  /**
   * PENDING FACULTY EDIT — the two tests below are `it.fails`, meaning vitest expects
   * them to throw. They currently throw because src/components/ui/VisualAtlas.tsx still
   * carries wording that module6-menisci.ts explicitly walked back, and that wording is
   * rendered live in Reference -> Atlas (src/components/ui/CourseReference.tsx:79).
   *
   * Dr. Swisher is authoring the corrected medical wording himself, so the strings are
   * NOT edited here. The moment he fixes VisualAtlas.tsx, each test stops throwing and
   * vitest reports "expected test to fail, but passed" — at that point delete the
   * `.fails` on that test and it becomes a live, permanently enforcing guard.
   */

  it.fails(
    "PENDING: rejects a '>5 mm severe' meniscal-extrusion tier in UI copy (VisualAtlas.tsx:62)",
    () => {
      // Current wrong string (VisualAtlas.tsx line ~62, extrusion diagram caption):
      //   "Measure on coronal image at mid-body. >3mm pathologic, >5mm suggests severe
      //    extrusion and major functional loss."
      // module6-menisci.ts: "There is no separately validated universal '>5 mm severe' tier",
      // and MeasurementsCard.tsx already says to report the continuous measurement rather
      // than assigning a 'severe' tier. The caption must drop the >5 mm tier and the
      // "major functional loss" claim (major medial extrusion is associated with coverage
      // loss and OA progression; it does not establish a nonfunctional meniscus).
      expect(uiSourceText(...uiRoots)).not.toContain("suggests severe extrusion");
    },
  );

  it.fails(
    "PENDING: rejects 'functional meniscectomy equivalent' for root tears (VisualAtlas.tsx:53)",
    () => {
      // Current wrong string (VisualAtlas.tsx line ~53, meniscal root tear link description):
      //   "Ghost sign, extrusion, functional meniscectomy equivalent"
      // module6-menisci.ts reframed this as a cadaveric model: in a cadaveric medial
      // posterior-root model contact mechanics approached those after total medial
      // meniscectomy, and that comparison "should not be generalized to every partial,
      // lateral, or degenerative root abnormality." The description must state the
      // biomechanical model rather than asserting equivalence.
      expect(uiSourceText(...uiRoots)).not.toContain("functional meniscectomy equivalent");
    },
  );
});
