import { fellowName, type Fellow } from "@/components/admin/shared";

/**
 * A learner the admin dashboard follows by name (the pilot-cohort panel).
 *
 * The roster is stored in Firestore (`adminSettings/cohort.trackedFellows`) and
 * NOT hard-coded here. It used to be a literal array of real trainee names,
 * which meant those names shipped inside the public JS bundle and were fetchable
 * from the live site by anyone, signed in or not. It lives in `adminSettings`
 * rather than `settings` because `settings` is readable by every signed-in
 * learner — including the learners on the roster. Matching still uses DISPLAY
 * NAME + EMAIL TEXT only — never a uid or private email. Spelling aliases exist
 * because a learner's Google display name may not match the roster spelling.
 */
export interface TrackedFellowTarget {
  name: string;
  aliases: string[];
}

/**
 * Parse the roster out of the settings doc, tolerating hand-entry: entries may
 * be plain strings or `{ name, aliases }`. Anything malformed is dropped rather
 * than throwing, so a bad edit degrades to an empty panel instead of breaking
 * the whole admin page. An entry with no explicit aliases matches on its name.
 */
export function parseTrackedFellowTargets(value: unknown): TrackedFellowTarget[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): TrackedFellowTarget[] => {
    if (typeof entry === "string") {
      const name = entry.trim();
      return name ? [{ name, aliases: [name] }] : [];
    }
    if (!entry || typeof entry !== "object") return [];
    const record = entry as { name?: unknown; aliases?: unknown };
    const name = typeof record.name === "string" ? record.name.trim() : "";
    if (!name) return [];
    const aliases = Array.isArray(record.aliases)
      ? record.aliases
          .filter((alias): alias is string => typeof alias === "string")
          .map((alias) => alias.trim())
          .filter(Boolean)
      : [];
    return [{ name, aliases: aliases.length > 0 ? aliases : [name] }];
  });
}

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
 * short alias like "Dana Sing" cannot collide with a superstring name such as
 * "Dana Singleton".
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
  targets: TrackedFellowTarget[],
): { targetName: string; fellow: Fellow | null }[] {
  const used = new Set<string>();
  return targets.map((target) => {
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
