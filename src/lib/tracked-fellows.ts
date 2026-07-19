import { fellowName, type Fellow } from "@/components/admin/shared";

/**
 * The sports-medicine fellows being followed through the pilot.
 *
 * Matched by DISPLAY NAME + EMAIL TEXT only — no learner uid or private email is
 * hard-coded here, so this file stays safe to commit. Spelling aliases exist
 * because a learner's Google display name may not match the roster spelling.
 */
export const TRACKED_FELLOW_TARGETS = [
  { name: "Riley Coon", aliases: ["riley coon"] },
  { name: "Sonal Singh", aliases: ["sonal singh"] },
  { name: "Lilian Toaspern", aliases: ["lilian toaspern", "lillian toaspern"] },
] as const;

export function normalizePersonText(value?: string | null): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Match on whole normalized TOKENS (word boundaries), never raw substrings, so a
 * short alias like "Sonal Singh" cannot collide with a superstring name such as
 * "Sonali Singhania".
 */
export function fellowMatchesAlias(fellow: Fellow, alias: string): boolean {
  const normalizedAlias = normalizePersonText(alias);
  const searchable = normalizePersonText([fellowName(fellow), fellow.email ?? ""].join(" "));
  if (!normalizedAlias || !searchable) return false;
  const haystack = new Set(searchable.split(" ").filter(Boolean));
  const aliasParts = normalizedAlias.split(" ").filter(Boolean);
  return aliasParts.length > 0 && aliasParts.every((part) => haystack.has(part));
}

/**
 * Resolve each tracked fellow to a signed-in learner (or null if they have not
 * signed in yet). A learner is claimed by at most one target, so two similar
 * names can't both resolve to the same account.
 */
export function matchTrackedFellows(
  fellows: Fellow[],
): { targetName: string; fellow: Fellow | null }[] {
  const used = new Set<string>();
  return TRACKED_FELLOW_TARGETS.map((target) => {
    const fellow =
      fellows.find(
        (candidate) =>
          !used.has(candidate.id) &&
          target.aliases.some((alias) => fellowMatchesAlias(candidate, alias)),
      ) ?? null;
    if (fellow) used.add(fellow.id);
    return { targetName: target.name, fellow };
  });
}
