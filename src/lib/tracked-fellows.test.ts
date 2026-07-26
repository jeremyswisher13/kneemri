import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  fellowMatchesAlias,
  matchTrackedFellows,
  parseTrackedFellowTargets,
} from "./tracked-fellows";
import type { Fellow } from "@/components/admin/shared";

const fellow = (id: string, name: string, email = ""): Fellow =>
  ({ id, displayName: name, email }) as unknown as Fellow;

describe("tracked fellows roster", () => {
  // The roster used to be a literal array of real trainee names, which shipped
  // them inside the public JS bundle — fetchable from the live site with no
  // authentication, from a public repo. The roster now lives in Firestore.
  //
  // This guard is deliberately written WITHOUT naming anyone: spelling the old
  // names here would just move the disclosure into a different public file. It
  // matches the shape of a personal name instead, so it catches any roster
  // reintroduction rather than only the three that leaked.
  it("hard-codes no personal names in source", () => {
    const source = readFileSync(new URL("./tracked-fellows.ts", import.meta.url), "utf8");
    expect(source).not.toContain("TRACKED_FELLOW_TARGETS");

    // Strip comments first: the doc comments legitimately use invented example
    // names ("Dana Singleton") to explain why matching is token-based.
    const code = source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");

    // A quoted "Firstname Lastname" literal is what a reintroduced roster looks
    // like. There is no legitimate reason for one to appear in this module.
    const personalNameLiteral = /["'][A-Z][a-z]+ [A-Z][a-z]+["']/;
    expect(code).not.toMatch(personalNameLiteral);

    // And no static roster array should exist at all.
    expect(code).not.toMatch(/aliases:\s*\[\s*["']/);
  });

  it("parses string and object roster entries, dropping malformed ones", () => {
    expect(parseTrackedFellowTargets(["Ada Lovelace"])).toEqual([
      { name: "Ada Lovelace", aliases: ["Ada Lovelace"] },
    ]);
    expect(
      parseTrackedFellowTargets([{ name: "Grace Hopper", aliases: ["grace hopper", "g hopper"] }]),
    ).toEqual([{ name: "Grace Hopper", aliases: ["grace hopper", "g hopper"] }]);
    // An entry with no usable name is dropped rather than throwing, so a bad
    // hand-edit in the settings doc degrades to an empty panel.
    expect(parseTrackedFellowTargets([{ aliases: ["x"] }, "", null, 42, { name: "   " }])).toEqual([]);
    expect(parseTrackedFellowTargets(undefined)).toEqual([]);
    expect(parseTrackedFellowTargets("not-an-array")).toEqual([]);
  });

  it("falls back to matching on the name when no aliases are given", () => {
    const [target] = parseTrackedFellowTargets(["Ada Lovelace"]);
    expect(fellowMatchesAlias(fellow("1", "Ada Lovelace"), target.aliases[0])).toBe(true);
  });

  it("returns an empty roster when nothing is configured", () => {
    expect(matchTrackedFellows([fellow("1", "Ada Lovelace")], [])).toEqual([]);
  });

  it("claims each learner at most once so similar names cannot collide", () => {
    const targets = parseTrackedFellowTargets(["Ada Lovelace", "Ada Lovelace-Byron"]);
    const rows = matchTrackedFellows([fellow("1", "Ada Lovelace")], targets);
    expect(rows.filter((r) => r.fellow !== null)).toHaveLength(1);
  });

  it("matches on whole tokens, never substrings", () => {
    // "Dana Sing" must not match "Dana Singleton" — the original reason the
    // matcher is token-based rather than a raw substring search.
    expect(fellowMatchesAlias(fellow("1", "Dana Singleton"), "dana sing")).toBe(false);
    expect(fellowMatchesAlias(fellow("2", "Dana Sing"), "dana sing")).toBe(true);
  });

  it("matches against email text as well as display name", () => {
    expect(fellowMatchesAlias(fellow("1", "", "ada.lovelace@example.edu"), "ada lovelace")).toBe(true);
  });
});

/**
 * Moving the roster out of the bundle only helps if the document it moved INTO
 * is actually admin-only. `settings/cohort` is not: every signed-in learner
 * reads it on the normal progress path, so storing the roster there would have
 * left it readable by the learners named in it. Firestore ORs `allow` rules
 * across every matching path, so a narrower `match /settings/roster` could not
 * have taken that access back — the roster needs a separate collection.
 */
describe("tracked fellow roster storage contract", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  const store = readFileSync(new URL("./firestore.ts", import.meta.url), "utf8");

  const adminBlock = rules.match(/match \/adminSettings\/\{doc\} \{([\s\S]*?)\n\s{4}\}/)?.[1] ?? "";
  const settingsBlock = rules.match(/match \/settings\/\{doc\} \{([\s\S]*?)\n\s{4}\}/)?.[1] ?? "";

  it("reserves /adminSettings for admins on both read and write", () => {
    expect(adminBlock).toContain("allow read, write: if isAdmin()");
    expect(adminBlock).not.toMatch(/allow read[^\n]*request\.auth != null/);
  });

  it("keeps /settings learner-readable for the unlock flags it already serves", () => {
    expect(settingsBlock).toContain("allow read: if request.auth != null");
    expect(settingsBlock).toContain("allow write: if isAdmin()");
  });

  it("does not store the roster under any learner-readable settings path", () => {
    // A `match /settings/...` sub-path cannot narrow the wildcard above it, so
    // the roster must not be referenced anywhere in the /settings rules.
    expect(settingsBlock).not.toContain("trackedFellows");
  });

  it("reads the roster from adminSettings, not from the learner cohort doc", () => {
    const roster = store.match(/export async function getTrackedFellowRoster\(\)[\s\S]*?\n\}/)?.[0] ?? "";
    expect(roster).toContain("getAdminCohortSettings()");
    expect(roster).not.toContain("getCohortSettings()");
    expect(store).toContain('getDoc(doc(db, "adminSettings", "cohort"))');
  });

  it("keeps the learner-path cohort read on settings/cohort only", () => {
    const learnerRead = store.match(/async function getCohortSettings\(\)[\s\S]*?\n\}/)?.[0] ?? "";
    expect(learnerRead).toContain('getDoc(doc(db, "settings", "cohort"))');
    expect(learnerRead).not.toContain("adminSettings");
  });
});
