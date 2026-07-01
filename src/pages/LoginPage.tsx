import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  completeRedirectSignIn,
  signInWithApple,
  signInWithAppleRedirect,
  signInWithGoogle,
  signInWithGoogleRedirect,
} from "@/lib/auth";
import {
  browserRedirectSignInHints,
  isStandaloneDisplayMode,
  installInstructionsForUserAgent,
} from "@/lib/pwa";
import {
  consumeReturnPath,
  localLoginUrlForLocalAuthHost,
  rememberReturnPath,
  returnPathFromLocation,
  shouldUseRedirectSignIn,
} from "@/lib/login-return";
import {
  canEnableAppReviewDemo,
  enableAppReviewDemoAuth,
  enableLocalPreviewAuth,
  isLocalPreviewHost,
} from "@/lib/local-preview-auth";
import { useEffect, useState } from "react";
import PageLoader from "@/components/ui/PageLoader";

type SignInProvider = "google" | "apple";

const providerLabels: Record<SignInProvider, string> = {
  google: "Google",
  apple: "Apple",
};

function shouldUseRedirectFallback(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  return (
    code === "auth/popup-blocked" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/operation-not-supported-in-this-environment"
  );
}

export default function LoginPage() {
  const { user, loading, setRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = returnPathFromLocation(location.state, location.search);
  const [error, setError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [activeProvider, setActiveProvider] = useState<SignInProvider | null>(null);
  const [fallbackProvider, setFallbackProvider] = useState<SignInProvider>("google");
  const [checkingRedirect, setCheckingRedirect] = useState(true);
  const [canonicalizingLocalHost, setCanonicalizingLocalHost] = useState(false);
  const [standaloneMode] = useState(() => isStandaloneDisplayMode());
  const localPreviewAvailable =
    typeof window !== "undefined" && isLocalPreviewHost(window.location.href);
  const appReviewDemoAvailable =
    typeof window !== "undefined" && canEnableAppReviewDemo(window.location.href, sessionStorage);
  const installInstructions =
    typeof navigator === "undefined"
      ? ""
      : installInstructionsForUserAgent(navigator.userAgent, navigator.platform);

  useEffect(() => {
    const targetUrl =
      typeof window === "undefined"
        ? null
        : localLoginUrlForLocalAuthHost(window.location.href, returnTo);
    if (!targetUrl) return;

    setCanonicalizingLocalHost(true);
    window.location.replace(targetUrl);
  }, [returnTo]);

  useEffect(() => {
    let cancelled = false;
    async function completeRedirect() {
      try {
        const result = await completeRedirectSignIn();
        if (!result || cancelled) return;
        setRole(result.role);
        navigate(consumeReturnPath(sessionStorage, returnTo), { replace: true });
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to finish sign-in");
        }
      } finally {
        if (!cancelled) setCheckingRedirect(false);
      }
    }
    completeRedirect();
    return () => {
      cancelled = true;
    };
  }, [navigate, returnTo, setRole]);

  useEffect(() => {
    if (!checkingRedirect && !loading && user) {
      navigate(consumeReturnPath(sessionStorage, returnTo), { replace: true });
    }
  }, [checkingRedirect, user, loading, navigate, returnTo]);

  async function handleProviderSignIn(provider: SignInProvider) {
    setError(null);
    setSigningIn(true);
    setActiveProvider(provider);
    setFallbackProvider(provider);
    rememberReturnPath(sessionStorage, returnTo);
    try {
      if (
        typeof window !== "undefined" &&
        shouldUseRedirectSignIn(window.location.href, browserRedirectSignInHints())
      ) {
        await signInWithProviderRedirect(provider);
        return;
      }

      const { role } =
        provider === "apple"
          ? await signInWithApple()
          : await signInWithGoogle();
      // Set the role directly — avoids race with onAuthStateChanged
      setRole(role);
      navigate(consumeReturnPath(sessionStorage, returnTo), { replace: true });
    } catch (err: unknown) {
      if (shouldUseRedirectFallback(err)) {
        try {
          await signInWithProviderRedirect(provider);
          return;
        } catch (redirectErr: unknown) {
          setError(redirectErr instanceof Error ? redirectErr.message : "Failed to sign in");
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to sign in");
      }
    } finally {
      setSigningIn(false);
      setActiveProvider(null);
    }
  }

  async function signInWithProviderRedirect(provider: SignInProvider) {
    if (provider === "apple") {
      await signInWithAppleRedirect();
      return;
    }
    await signInWithGoogleRedirect();
  }

  async function handleRedirectSignIn() {
    setError(null);
    setSigningIn(true);
    setActiveProvider(fallbackProvider);
    rememberReturnPath(sessionStorage, returnTo);
    try {
      await signInWithProviderRedirect(fallbackProvider);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setSigningIn(false);
      setActiveProvider(null);
    }
  }

  function handleLocalPreviewSignIn() {
    setError(null);
    setSigningIn(true);
    enableLocalPreviewAuth(sessionStorage);
    window.location.assign(returnTo);
  }

  function handleAppReviewDemoSignIn() {
    setError(null);
    setSigningIn(true);
    enableAppReviewDemoAuth(sessionStorage);
    window.location.assign(returnTo);
  }

  if (canonicalizingLocalHost || loading || checkingRedirect) {
    return <PageLoader fullHeight label="Preparing sign-in..." />;
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ucla-dark text-white text-2xl font-bold">
            MRI
          </div>
          <h1 className="text-2xl font-bold text-ucla-dark">UCLA Sports MRI Courses</h1>
          <p className="mt-2 text-sm text-gray-600">
            Interactive MRI interpretation courses for sports medicine learners
          </p>
          <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-gray-500">
            Educational training only. This app does not diagnose, treat, or replace clinical judgment;
            confirm patient-care decisions with qualified clinicians and local policy.
          </p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Sign In</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <button
            onClick={() => handleProviderSignIn("google")}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {signingIn && activeProvider === "google" ? "Signing in..." : "Sign in with Google"}
          </button>

          <button
            onClick={() => handleProviderSignIn("apple")}
            disabled={signingIn}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16.37 1.51c0 1.15-.42 2.17-1.25 3.04-.93.97-2 1.53-3.18 1.44-.12-1.1.45-2.25 1.21-3.05.84-.88 2.28-1.55 3.22-1.43ZM20.77 17.08c-.48 1.1-.7 1.59-1.31 2.56-.85 1.31-2.04 2.95-3.52 2.97-1.31.01-1.65-.86-3.43-.85-1.78.01-2.15.87-3.47.85-1.48-.02-2.61-1.49-3.46-2.8-2.43-3.76-2.68-8.17-1.18-10.52 1.07-1.67 2.75-2.65 4.34-2.65 1.62 0 2.64.87 3.98.87 1.3 0 2.09-.87 3.97-.87 1.42 0 2.92.77 3.98 2.1-3.49 1.91-2.92 6.88.1 8.34Z" />
            </svg>
            {signingIn && activeProvider === "apple" ? "Signing in..." : "Sign in with Apple"}
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Sign in with Google or Apple to access the courses.
          </p>

          {standaloneMode && (
            <div className="mt-4 rounded-lg border border-ucla-blue/20 bg-ucla-light/50 px-4 py-3 text-xs text-gray-600">
              Home-screen mode uses full-page Google sign-in so your return path is preserved.
              <span className="mt-1 block font-medium text-[#003B5C]">{installInstructions}</span>
            </div>
          )}

          {localPreviewAvailable && (
            <button
              onClick={handleLocalPreviewSignIn}
              disabled={signingIn}
              className="mt-4 w-full rounded-lg border border-ucla-blue/30 bg-ucla-light px-4 py-2 text-sm font-medium text-ucla-dark hover:bg-ucla-light/70 focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Continue in local preview
            </button>
          )}

          {appReviewDemoAvailable && (
            <button
              onClick={handleAppReviewDemoSignIn}
              disabled={signingIn}
              className="mt-4 w-full rounded-lg border border-[#003B5C]/30 bg-[#F4F8FB] px-4 py-2 text-sm font-semibold text-[#003B5C] transition-colors hover:bg-[#E8F1F7] focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue in App Review demo
            </button>
          )}

          {error && (
            <button
              onClick={handleRedirectSignIn}
              disabled={signingIn}
              className="mt-4 w-full rounded-lg border border-ucla-blue/30 bg-ucla-light px-4 py-2 text-sm font-medium text-ucla-dark hover:bg-ucla-light/70 focus:outline-none focus:ring-2 focus:ring-ucla-blue/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Continue with full-page {providerLabels[fallbackProvider]} sign-in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
