import { describe, expect, it } from "vitest";
import { authErrorCode, redirectSignInErrorMessage, signInErrorMessage } from "@/lib/auth-error-message";

describe("auth error messages", () => {
  it("extracts Firebase auth codes", () => {
    expect(authErrorCode({ code: "auth/operation-not-allowed" })).toBe("auth/operation-not-allowed");
    expect(authErrorCode(new Error("plain"))).toBeUndefined();
  });

  it("explains Apple provider setup failures without exposing raw Firebase wording", () => {
    expect(signInErrorMessage({ code: "auth/operation-not-allowed" }, "apple")).toContain(
      "Sign in with Apple is not fully configured yet",
    );
    expect(signInErrorMessage({ code: "auth/unauthorized-domain" }, "apple")).toContain(
      "App Review demo",
    );
  });

  it("keeps Google errors provider-specific", () => {
    expect(signInErrorMessage({ code: "auth/popup-closed-by-user" }, "google")).toBe(
      "Google sign-in was cancelled.",
    );
    expect(signInErrorMessage(new Error("Google auth failed"), "google")).toBe("Google auth failed");
  });

  it("gives a Firebase setup hint for Apple redirect failures", () => {
    expect(redirectSignInErrorMessage({ code: "auth/operation-not-allowed" }, "apple")).toContain(
      "Configure the Apple provider",
    );
  });
});
