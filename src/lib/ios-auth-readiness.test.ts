import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const FIREBASE_APP_AUTH_HANDLER = "https://ucla-knee-mri.firebaseapp.com/__/auth/handler";
const WEB_APP_AUTH_HANDLER = "https://ucla-knee-mri.web.app/__/auth/handler";

describe("iOS Sign in with Apple readiness", () => {
  const setupDoc = readFileSync("ios/AppleFirebaseAuthSetup.md", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const metadata = readFileSync("ios/AppStoreConnectMetadata.json", "utf8");
  const evidence = JSON.parse(readFileSync("ios/AppleFirebaseAuthEvidence.json", "utf8")) as {
    appleDeveloper: { bundleId: string };
    firebaseAuth: {
      primaryReturnUrl: string;
      secondaryAuthHandler: string;
      authorizedDomains: string[];
    };
  };
  const evidenceScript = readFileSync("scripts/ios-auth-evidence.mjs", "utf8");
  const liveReadiness = readFileSync("scripts/ios-live-readiness.mjs", "utf8");
  const firebaseConfig = readFileSync("src/lib/firebase.ts", "utf8");
  const packageJson = readFileSync("package.json", "utf8");

  it("documents the exact Apple Service ID return URL", () => {
    expect(setupDoc).toContain(FIREBASE_APP_AUTH_HANDLER);
    expect(handoff).toContain(FIREBASE_APP_AUTH_HANDLER);
    expect(metadata).toContain(FIREBASE_APP_AUTH_HANDLER);
    expect(evidence.firebaseAuth.primaryReturnUrl).toBe(FIREBASE_APP_AUTH_HANDLER);
  });

  it("keeps Firebase authorized domains explicit for Apple provider setup", () => {
    expect(setupDoc).toContain("ucla-knee-mri.firebaseapp.com");
    expect(setupDoc).toContain("ucla-knee-mri.web.app");
    expect(metadata).toContain("ucla-knee-mri.firebaseapp.com");
    expect(metadata).toContain("ucla-knee-mri.web.app");
    expect(evidence.firebaseAuth.authorizedDomains).toEqual(
      expect.arrayContaining(["ucla-knee-mri.firebaseapp.com", "ucla-knee-mri.web.app"]),
    );
    expect(evidence.firebaseAuth.secondaryAuthHandler).toBe(WEB_APP_AUTH_HANDLER);
    expect(firebaseConfig).toContain('authDomain: "ucla-knee-mri.firebaseapp.com"');
  });

  it("checks the public Firebase Auth handler endpoints in live readiness", () => {
    expect(liveReadiness).toContain(FIREBASE_APP_AUTH_HANDLER);
    expect(liveReadiness).toContain(WEB_APP_AUTH_HANDLER);
    expect(liveReadiness).toContain("firebase-auth-helper");
  });

  it("documents and exposes the Apple/Firebase auth evidence gate", () => {
    expect(packageJson).toContain('"auth:ios:evidence": "node scripts/ios-auth-evidence.mjs"');
    expect(packageJson).toContain('"auth:ios:evidence:verify": "node scripts/ios-auth-evidence.mjs --verify"');
    expect(setupDoc).toContain("npm run auth:ios:evidence:verify");
    expect(handoff).toContain("ios/AppleFirebaseAuthEvidence.json");
  });

  it("keeps the auth evidence script tied to the submission gates without storing secrets", () => {
    expect(evidence.appleDeveloper.bundleId).toBe("com.jeremyswisher.uclasportsmri");
    expect(evidenceScript).toContain("appleDeveloper.signInWithAppleEnabledForBundleId");
    expect(evidenceScript).toContain("firebaseAuth.appleProviderConfigured");
    expect(evidenceScript).toContain("firebaseAuth.authorizedDomainsIncludeFirebaseHosting");
    expect(evidenceScript).toContain("com.apple.developer.applesignin");
    expect(evidenceScript).toContain('OAuthProvider("apple.com")');
    expect(evidenceScript).toContain("firebase.firebaseProjectId === expected.firebaseProjectId");
    expect(evidenceScript).toContain("Submission Gate Alignment");
    expect(evidenceScript).toContain("PRIVATE KEY");
  });

  it("can report Apple/Firebase auth evidence status before setup is complete", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-auth-evidence.mjs"], {
      encoding: "utf8",
    });

    expect(output).toContain("iOS Apple/Firebase Auth Evidence Report");
    expect(output).toContain("Source Checks");
    expect(output).toContain("Native Sign in with Apple entitlement is wired");
    expect(output).toContain("Web app exposes Firebase apple.com provider");
    expect(output).toContain("Submission Gate Alignment");
    expect(output).toContain("Ready Apple/Firebase auth gates:");
  });
});
