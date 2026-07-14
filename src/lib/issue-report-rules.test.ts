import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("issue report Firestore contract", () => {
  const rules = readFileSync("firestore.rules", "utf8");
  const block = rules.match(/match \/issueReports\/\{reportId\} \{([\s\S]*?)\n\s{4}\}/)?.[1] ?? "";

  it("allows authenticated structured creates while reserving the queue for admins", () => {
    expect(block).toContain("allow create: if request.auth != null && isValidIssueReport()");
    expect(block).toContain("allow read, update, delete: if isAdmin()");
  });

  it("has no reporter-identity or free-text fields in the accepted shape", () => {
    const validator = rules.match(/function isValidIssueReport\(\) \{([\s\S]*?)\n\s{4}\}/)?.[1] ?? "";
    expect(validator).not.toMatch(/'email'|'displayName'|'reporterId'|'notes'|'freeText'/);
    expect(validator).toContain("'landmark'");
    expect(validator).toContain("'sliceNumber'");
    expect(validator).toContain("request.resource.data.route.matches('^/[^/].*')");
  });
});
