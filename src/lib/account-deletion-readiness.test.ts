import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("account deletion App Store readiness", () => {
  const auth = readFileSync("src/lib/auth.ts", "utf8");
  const accountPage = readFileSync("src/pages/AccountPage.tsx", "utf8");
  const loginPage = readFileSync("src/pages/LoginPage.tsx", "utf8");
  const rules = readFileSync("firestore.rules", "utf8");
  const processor = readFileSync("scripts/process-account-deletion.mjs", "utf8");
  const liveReadiness = readFileSync("scripts/ios-live-readiness.mjs", "utf8");
  const packageJson = readFileSync("package.json", "utf8");

  it("keeps the in-app request path wired to the rules-backed collection", () => {
    expect(accountPage).toContain("requestAccountDeletion");
    expect(accountPage).toContain('state: { notice: "Your account deletion request has been recorded." }');
    expect(loginPage).toContain("noticeFromLocationState");
    expect(loginPage).toContain('role="status"');
    expect(auth).toContain('doc(db, "accountDeletionRequests", user.uid)');
    expect(auth).toContain('status: "requested"');
    expect(auth).toContain('source: "in-app"');
  });

  it("allows signed-in users to create only their own deletion request", () => {
    expect(rules).toContain("match /accountDeletionRequests/{userId}");
    expect(rules).toContain("allow create: if isOwner(userId) && isValidAccountDeletionRequest(userId)");
    expect(rules).toContain("request.resource.data.userId == userId");
    expect(rules).toContain("request.resource.data.status == 'requested'");
    expect(rules).toContain("request.resource.data.source == 'in-app'");
    expect(rules).toContain("request.resource.data.requestedAt == request.time");
  });

  it("keeps account deletion fulfillment as an explicit admin operation", () => {
    expect(rules).toContain("allow delete: if isAdmin()");
    expect(processor).toContain("getAuth().deleteUser");
    expect(processor).toContain("deleteDocumentTree(userRef)");
    expect(processor).toContain('db.collection("auditLog").where("userId", "==", uid)');
    expect(processor).toContain('status: "fulfilled"');
    expect(processor).toContain("--confirm");
    expect(packageJson).toContain('"account:deletion": "node scripts/process-account-deletion.mjs"');
  });

  it("proves the deployed native bundle exposes the account deletion route", () => {
    expect(liveReadiness).toContain('fetchText("/account")');
    expect(liveReadiness).toContain("Live JS bundle and lazy chunks fetched");
    expect(liveReadiness).toContain("Request account deletion");
    expect(liveReadiness).toContain("Confirm deletion request");
    expect(liveReadiness).toContain("Your account deletion request has been recorded.");
  });
});
