import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/**
 * The admin allow-list lives in TWO enforcement points that must never drift:
 *  - firestore.rules  isAdminEmail()  (server-side authz: who may self-assign the
 *    admin role / who the rules trust)
 *  - src/lib/auth.ts  ADMIN_EMAILS    (client: who the app treats as admin)
 * They are deployed independently (`firebase deploy --only firestore:rules` vs the
 * app bundle), so a silent divergence is a real privilege-escalation / lockout
 * risk. This test fails loudly if the two lists ever differ.
 */
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

function emailsBetween(text: string, startMarker: string): string[] {
  const start = text.indexOf(startMarker);
  if (start === -1) return [];
  const end = text.indexOf("]", start);
  const block = text.slice(start, end === -1 ? undefined : end);
  return [...new Set((block.match(EMAIL_RE) || []).map((e) => e.toLowerCase()))].sort();
}

describe("admin email allow-list parity", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  const auth = readFileSync("src/lib/auth.ts", "utf8");
  const rulesEmails = emailsBetween(rules, "email.lower() in [");
  const authEmails = emailsBetween(auth, "ADMIN_EMAILS = [");

  it("both sources actually contain an admin list", () => {
    expect(rulesEmails.length).toBeGreaterThan(0);
    expect(authEmails.length).toBeGreaterThan(0);
  });

  it("firestore.rules isAdminEmail() matches auth.ts ADMIN_EMAILS exactly", () => {
    expect(rulesEmails).toEqual(authEmails);
  });

  it("grants the Friday co-faculty account administrator access", () => {
    expect(authEmails).toContain("kimberlymburbank@gmail.com");
  });
});
