export type SignInProvider = "google" | "apple";

const providerNames: Record<SignInProvider, string> = {
  google: "Google",
  apple: "Apple",
};

export function authErrorCode(err: unknown): string | undefined {
  return (err as { code?: string } | null)?.code;
}

export function signInErrorMessage(err: unknown, provider: SignInProvider): string {
  const code = authErrorCode(err);
  if (code === "auth/popup-closed-by-user") {
    return `${providerNames[provider]} sign-in was cancelled.`;
  }

  if (
    provider === "apple" &&
    (
      code === "auth/operation-not-allowed" ||
      code === "auth/unauthorized-domain" ||
      code === "auth/invalid-oauth-provider" ||
      code === "auth/invalid-credential"
    )
  ) {
    return "Sign in with Apple is not fully configured yet. Use Google sign-in for now, or App Review demo if you are reviewing a TestFlight/App Review build.";
  }

  return err instanceof Error ? err.message : `Failed to sign in with ${providerNames[provider]}`;
}

export function redirectSignInErrorMessage(err: unknown, provider: SignInProvider): string {
  const code = authErrorCode(err);
  if (code === "auth/operation-not-allowed" && provider === "apple") {
    return "Sign in with Apple is not enabled in Firebase Auth yet. Configure the Apple provider before App Store submission.";
  }
  return err instanceof Error ? err.message : "Failed to sign in";
}
