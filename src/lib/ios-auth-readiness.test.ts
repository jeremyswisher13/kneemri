import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const FIREBASE_APP_AUTH_HANDLER = "https://ucla-knee-mri.firebaseapp.com/__/auth/handler";
const WEB_APP_AUTH_HANDLER = "https://ucla-knee-mri.web.app/__/auth/handler";

describe("iOS Sign in with Apple readiness", () => {
  const setupDoc = readFileSync("ios/AppleFirebaseAuthSetup.md", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const metadata = readFileSync("ios/AppStoreConnectMetadata.json", "utf8");
  const liveReadiness = readFileSync("scripts/ios-live-readiness.mjs", "utf8");
  const firebaseConfig = readFileSync("src/lib/firebase.ts", "utf8");

  it("documents the exact Apple Service ID return URL", () => {
    expect(setupDoc).toContain(FIREBASE_APP_AUTH_HANDLER);
    expect(handoff).toContain(FIREBASE_APP_AUTH_HANDLER);
    expect(metadata).toContain(FIREBASE_APP_AUTH_HANDLER);
  });

  it("keeps Firebase authorized domains explicit for Apple provider setup", () => {
    expect(setupDoc).toContain("ucla-knee-mri.firebaseapp.com");
    expect(setupDoc).toContain("ucla-knee-mri.web.app");
    expect(metadata).toContain("ucla-knee-mri.firebaseapp.com");
    expect(metadata).toContain("ucla-knee-mri.web.app");
    expect(firebaseConfig).toContain('authDomain: "ucla-knee-mri.firebaseapp.com"');
  });

  it("checks the public Firebase Auth handler endpoints in live readiness", () => {
    expect(liveReadiness).toContain(FIREBASE_APP_AUTH_HANDLER);
    expect(liveReadiness).toContain(WEB_APP_AUTH_HANDLER);
    expect(liveReadiness).toContain("firebase-auth-helper");
  });
});
