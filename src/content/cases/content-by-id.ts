import { caseRegistry, type CaseMetadata } from "./index";
import { shoulderCaseRegistry } from "@/content/shoulder/cases";
import { hipCaseRegistry } from "@/content/hip/cases";
import { elbowCaseRegistry } from "@/content/elbow/cases";

/**
 * Full case content (model report, teaching points, per-step search findings,
 * images), keyed by globally-unique case id. Imported ONLY by the lazy CasePage
 * and GlobalSearch so the heavy case bodies stay out of the eager course bundle.
 * The lightweight `case-metas.ts` (used by the registry / listings) is kept in
 * sync by a drift test.
 */
export const caseContentById: Record<string, CaseMetadata> = Object.fromEntries(
  [...caseRegistry, ...shoulderCaseRegistry, ...hipCaseRegistry, ...elbowCaseRegistry].map((c) => [c.id, c]),
);
