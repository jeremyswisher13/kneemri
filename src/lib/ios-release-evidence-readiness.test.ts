import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type ReleaseEvidence = {
  testEnvironment: {
    acceptedSources: string[];
    version: string;
    build: string;
  };
  realDeviceAuth: {
    googleSignInPassedInNativeShell: boolean;
    appleSignInPassedInNativeShell: boolean;
    appReviewDemoPassedInNativeShell: boolean;
  };
  accountDeletion: {
    requestFlowVerified: boolean;
    confirmationNoticeVerified: boolean;
    requestDocumentObserved: boolean;
    statusRequestedObserved: boolean;
    sourceInAppObserved: boolean;
    adminDeletionProcessReady: boolean;
    adminDryRunCompleted: boolean;
    adminFulfillmentConfirmed: boolean;
    authUserDeletedConfirmed: boolean;
    firestoreUserTreeRemovedConfirmed: boolean;
    auditLogsDeidentifiedConfirmed: boolean;
    fulfilledRequestRecordScrubbed: boolean;
  };
};

describe("iOS release verification evidence readiness", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const readme = readFileSync("ios/README.md", "utf8");
  const evidence = JSON.parse(readFileSync("ios/ReleaseVerificationEvidence.json", "utf8")) as ReleaseEvidence;
  const evidenceScript = readFileSync("scripts/ios-release-evidence.mjs", "utf8");
  const preflight = readFileSync("scripts/ios-app-store-preflight.mjs", "utf8");
  const gateReport = readFileSync("scripts/ios-gate-report.mjs", "utf8");
  const submissionGate = readFileSync("scripts/ios-submission-gate.mjs", "utf8");

  it("documents and exposes the release evidence commands", () => {
    expect(packageJson).toContain('"release:ios:evidence": "node scripts/ios-release-evidence.mjs"');
    expect(packageJson).toContain('"release:ios:evidence:verify": "node scripts/ios-release-evidence.mjs --verify"');
    expect(handoff).toContain("npm run release:ios:evidence:verify");
    expect(handoff).toContain("ios/ReleaseVerificationEvidence.json");
    expect(readme).toContain("npm run release:ios:evidence");
    expect(preflight).toContain("Release evidence script exists");
    expect(gateReport).toContain("npm run release:ios:evidence");
  });

  it("maps release evidence to the real-device and account-deletion submission gates", () => {
    for (const key of [
      "realDeviceAuth.googleSignInPassedInNativeShell",
      "realDeviceAuth.appleSignInPassedInNativeShell",
      "realDeviceAuth.appReviewDemoPassedInNativeShell",
      "accountDeletion.requestFlowVerified",
      "accountDeletion.adminDeletionProcessReady",
    ]) {
      expect(evidenceScript).toContain(key);
      expect(gateReport).toContain(key);
      expect(submissionGate).toContain(key);
    }

    expect(evidence.testEnvironment.acceptedSources).toEqual(
      expect.arrayContaining(["TestFlight/native iOS app", "Real device Debug native iOS app"]),
    );
    expect(evidence.testEnvironment.version).toBe("1.0");
    expect(evidence.testEnvironment.build).toBe("1");
  });

  it("requires non-PII real-device auth and account-deletion confirmations", () => {
    expect(evidenceScript).toContain("Secret/PII scan");
    expect(evidenceScript).toContain("test-user emails");
    expect(evidenceScript).toContain("full UIDs");
    expect(evidenceScript).toContain("PHI");
    expect(evidence.accountDeletion.requestFlowVerified).toBe(false);
    expect(evidence.accountDeletion.confirmationNoticeVerified).toBe(false);
    expect(evidence.accountDeletion.requestDocumentObserved).toBe(false);
    expect(evidence.accountDeletion.statusRequestedObserved).toBe(false);
    expect(evidence.accountDeletion.sourceInAppObserved).toBe(false);
    expect(evidence.accountDeletion.adminDeletionProcessReady).toBe(false);
    expect(evidence.accountDeletion.adminDryRunCompleted).toBe(false);
    expect(evidence.accountDeletion.adminFulfillmentConfirmed).toBe(false);
    expect(evidence.accountDeletion.authUserDeletedConfirmed).toBe(false);
    expect(evidence.accountDeletion.firestoreUserTreeRemovedConfirmed).toBe(false);
    expect(evidence.accountDeletion.auditLogsDeidentifiedConfirmed).toBe(false);
    expect(evidence.accountDeletion.fulfilledRequestRecordScrubbed).toBe(false);
  });

  it("can report release evidence status before external verification is complete", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-release-evidence.mjs"], {
      encoding: "utf8",
    });

    expect(output).toContain("iOS Real Device and Account Deletion Evidence Report");
    expect(output).toContain("Ready real-device/account-deletion gates:");
    expect(output).toContain("Required Non-PII Evidence");
  });
});
